'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function fmtSph(v: any) {
  if (v == null) return null
  const n = parseFloat(v)
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2)
}

function ReciboContent() {
  const params  = useSearchParams()
  // Acepta ?token=<public_token> (desde email — sin sesión requerida)
  // O     ?orden=<uuid>          (desde sesión web — backwards compat)
  const token   = params.get('token')
  const orderId = params.get('orden')

  const [order,   setOrder]   = useState<any>(null)
  const [items,   setItems]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<'not_found'|'invalid'|null>(null)
  const [retry,   setRetry]   = useState(0)

  useEffect(() => {
    // ── TEST / Preview ────────────────────────────────────────────────────
    if (orderId === 'TEST' || (!token && !orderId)) {
      setOrder({
        id: 'TEST-001',
        numero_orden: 'CG-TEST0001',
        cliente_nombre: 'Cliente de Prueba',
        cliente_email: 'cliente@ejemplo.com',
        cliente_telefono: '(809) 000-0000',
        direccion_texto: 'Calle Ejemplo #123, Santo Domingo',
        metodo_pago: 'tarjeta',
        pago_estado: 'pagado',
        total: 7360,
        envio: 200,
        descuento: 0,
        azul_auth_code: 'OK0190',
        fecha: new Date().toISOString(),
      })
      setItems([
        { nombre: 'AIR OPTIX plus HydraGlyde Multifocal', cantidad: 1, precio: 6960, sph: -3.25, add_power: 'MID', ojo: 'OD' },
        { nombre: 'AIR OPTIX plus HydraGlyde Multifocal', cantidad: 1, precio: 6960, sph: -3.25, add_power: 'MID', ojo: 'OI' },
      ])
      setLoading(false)
      return
    }

    const sb = createClient()

    // ── Estrategia de búsqueda ────────────────────────────────────────────
    // 1. Si hay token → buscar por public_token (no requiere sesión)
    // 2. Si hay orderId → buscar por id (requiere sesión activa)
    // 3. Si ambos están → preferir token (más confiable desde email)

    const findOrder = async () => {
      if (token) {
        // Búsqueda por public_token via RPC SECURITY DEFINER
        // → no requiere sesión, solo devuelve campos no sensibles
        // → NO expone user_id, public_token, datos bancarios internos
        const { data, error: rpcErr } = await sb.rpc('get_order_by_public_token', {
          p_token: token,
        })
        if (!rpcErr && data && Array.isArray(data) && data.length > 0) return data[0]
        return null
      }
      // Búsqueda por UUID interno — requiere sesión activa (RLS estándar)
      const { data: byId } = await sb.from('orders').select('*').eq('id', orderId!).single()
      if (byId) return byId
      // Fallback: por numero_orden si alguien guarda el link con el número
      const { data: byNum } = await sb.from('orders').select('*').eq('numero_orden', orderId!).single()
      return byNum ?? null
    }

    const load = async () => {
      setLoading(true)
      setError(null)

      const orderData = await findOrder()

      if (!orderData) {
        // Si viene de email con token válido pero no encuentra → esperar y reintentar
        if (token && retry < 3) {
          setTimeout(() => setRetry(r => r + 1), 2500)
          return
        }
        setError('not_found')
        setLoading(false)
        return
      }

      const { data: its } = await sb
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id)

      setOrder(orderData)
      setItems(its ?? [])
      setLoading(false)
      // Analytics: receipt_viewed
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'receipt_viewed',
          order_id: orderData.id,
          numero_orden: orderData.numero_orden,
          pago_estado: orderData.pago_estado,
          via_token: Boolean(token),
        })
      }
    }

    load()
  }, [token, orderId, retry])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial,sans-serif',gap:'12px'}}>
      <div style={{width:'40px',height:'40px',border:'3px solid #0d6efd',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.9s linear infinite'}}/>
      <p style={{color:'#666',margin:0,fontSize:'14px'}}>Cargando comprobante...</p>
      {retry > 0 && <p style={{color:'#9ca3af',margin:0,fontSize:'12px'}}>Verificando pedido... intento {retry}/3</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── Error: no encontrado ──────────────────────────────────────────────────
  if (error === 'not_found' || (!order && !loading)) {
    // Logging temporal de intentos fallidos (client-side)
    if (typeof window !== 'undefined' && (token || orderId)) {
      const isExpired = !token && orderId  // link viejo sin token = posible enlace expirado
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'recibo_not_found',
        has_token: Boolean(token),
        has_orden: Boolean(orderId),
        retry_count: retry,
        is_legacy_link: isExpired,
      })
    }
    const isLegacyLink = !token && orderId  // link antiguo ?orden= sin sesión activa

    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial,sans-serif',background:'#f9fafb',padding:'20px'}}>
        <div style={{background:'white',borderRadius:'16px',padding:'40px 32px',maxWidth:'420px',width:'100%',textAlign:'center',boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>{isLegacyLink ? '🔗' : '⏳'}</div>
          <h2 style={{color:'#1a1a1a',marginBottom:'8px',fontSize:'20px',fontWeight:'800'}}>
            {isLegacyLink ? 'Enlace expirado o inválido' : 'Estamos verificando tu pedido'}
          </h2>
          <p style={{color:'#6b7280',fontSize:'14px',lineHeight:'1.6',marginBottom:'24px'}}>
            {isLegacyLink
              ? 'El enlace de este comprobante ha expirado o es inválido. Inicia sesión en tu cuenta para ver tu historial de pedidos, o contáctanos para ayudarte.'
              : 'Si acabas de realizar tu pago, el comprobante puede tardar unos minutos. Si el problema persiste, contáctanos.'}
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {!isLegacyLink && (
              <button
                onClick={() => { setLoading(true); setError(null); setRetry(r => r + 1) }}
                style={{background:'#0d6efd',color:'white',border:'none',padding:'12px 20px',borderRadius:'10px',cursor:'pointer',fontWeight:'700',fontSize:'14px'}}
              >
                🔄 Reintentar
              </button>
            )}
            <a
              href="/contacto?text=Hola%2C+no+puedo+ver+mi+comprobante+de+pago"
              target="_blank" rel="noopener noreferrer"
              style={{display:'block',background:'#16a34a',color:'white',textDecoration:'none',padding:'12px 20px',borderRadius:'10px',fontWeight:'700',fontSize:'14px'}}
            >
              💬 Contactar soporte por WhatsApp
            </a>
            <a
              href="/cuenta"
              style={{display:'block',background:'#f3f4f6',color:'#374151',textDecoration:'none',padding:'12px 20px',borderRadius:'10px',fontSize:'14px',fontWeight:'600'}}
            >
              📦 Ir a Mis Pedidos
            </a>
            <a
              href="/"
              style={{display:'block',color:'#9ca3af',textDecoration:'none',padding:'8px 0',fontSize:'13px'}}
            >
              Ir al inicio
            </a>
          </div>
          <p style={{color:'#d1d5db',fontSize:'11px',marginTop:'20px',marginBottom:0}}>
            ContactGo · (829) 472-8328 · info@contactgo.net
          </p>
        </div>
      </div>
    )
  }

  const fecha = new Date(order.fecha || order.updated_at || Date.now())
  const totalReal         = order.total ?? 0
  const envio             = order.envio ?? 200
  const descuento         = order.descuento ?? 0
  const subtotalConITBIS  = totalReal - envio - descuento
  const itbis             = Math.round(subtotalConITBIS * 0.18 / 1.18)
  const subtotalSinITBIS  = subtotalConITBIS - itbis

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          * { box-sizing: border-box; }
        }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #1a1a1a; margin: 0; padding: 0; background: #f5f5f5; }
      `}</style>

      <div style={{maxWidth:'720px',margin:'0 auto',background:'white',padding:'32px',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>

        {/* Botones pantalla */}
        <div className="no-print" style={{display:'flex',gap:'10px',marginBottom:'20px',justifyContent:'flex-end'}}>
          <button onClick={() => window.print()}
            style={{background:'#0d6efd',color:'white',border:'none',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',fontSize:'14px'}}>
            🖨️ Imprimir / Guardar PDF
          </button>
          <button onClick={() => window.close()}
            style={{background:'white',color:'#555',border:'1px solid #ddd',padding:'10px 20px',borderRadius:'8px',cursor:'pointer'}}>
            Cerrar
          </button>
        </div>

        {/* ENCABEZADO */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',borderBottom:'3px solid #0d6efd',paddingBottom:'16px',marginBottom:'16px'}}>
          <div>
            <div style={{fontSize:'28px',fontWeight:'900',color:'#0d6efd',letterSpacing:'-1px'}}>ContactGo</div>
            <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Lentes de Contacto República Dominicana</div>
            <div style={{fontSize:'11px',color:'#888'}}>contactgo.net · info@contactgo.net</div>
            <div style={{fontSize:'11px',color:'#888'}}>(829) 472-8328 · Santo Domingo, RD</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'16px',fontWeight:'900',color:'#1a1a1a',textTransform:'uppercase'}}>Comprobante de Pago</div>
            <div style={{fontSize:'11px',color:'#0d6efd',fontWeight:'700',marginTop:'4px'}}>
              #{order.numero_orden ?? order.id.slice(-8).toUpperCase()}
            </div>
            <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>
              {fecha.toLocaleDateString('es-DO',{day:'2-digit',month:'long',year:'numeric'})}
            </div>
            <div style={{fontSize:'11px',color:'#888'}}>
              {fecha.toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit'})}
            </div>
          </div>
        </div>

        {/* CLIENTE + ENTREGA */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
          <div style={{background:'#f0f7ff',border:'1px solid #dbeafe',borderRadius:'8px',padding:'12px'}}>
            <div style={{fontSize:'9px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Cliente</div>
            <div style={{fontWeight:'700',fontSize:'13px'}}>{order.cliente_nombre}</div>
            <div style={{color:'#666',fontSize:'11px'}}>{order.cliente_email}</div>
            <div style={{color:'#666',fontSize:'11px'}}>{order.cliente_telefono}</div>
          </div>
          <div style={{background:'#f0f7ff',border:'1px solid #dbeafe',borderRadius:'8px',padding:'12px'}}>
            <div style={{fontSize:'9px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Dirección de entrega</div>
            <div style={{fontWeight:'700',fontSize:'13px'}}>{order.cliente_nombre}</div>
            <div style={{color:'#666',fontSize:'11px'}}>{order.direccion_texto}</div>
            <div style={{color:'#666',fontSize:'11px'}}>República Dominicana</div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'16px'}}>
          <thead>
            <tr>
              {['Producto / Descripción','Prescripción','Cant.','Precio','Subtotal'].map((h,i) => (
                <th key={h} style={{background:'#0d6efd',color:'white',padding:'8px 10px',textAlign:i>=2?'right':'left',fontSize:'11px',fontWeight:'700'}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item:any, i:number) => (
              <tr key={i} style={{background: i%2===1 ? '#f9fafb' : 'white'}}>
                <td style={{padding:'7px 10px',fontSize:'12px',fontWeight:'600',borderBottom:'1px solid #f0f0f0'}}>{item.nombre}</td>
                <td style={{padding:'7px 10px',fontFamily:'monospace',fontSize:'11px',color:'#2563eb',borderBottom:'1px solid #f0f0f0'}}>
                  {[
                    item.sph != null ? `SPH ${fmtSph(item.sph)}` : null,
                    item.cyl != null && item.cyl !== 0 ? `CYL ${Number(item.cyl).toFixed(2)}` : null,
                    item.axis ? `${item.axis}°` : null,
                    item.add_power ? `ADD ${item.add_power}` : null,
                    item.color ?? null,
                    item.ojo ? `(${item.ojo})` : null,
                  ].filter(Boolean).join(' ') || '—'}
                </td>
                <td style={{padding:'7px 10px',textAlign:'right',borderBottom:'1px solid #f0f0f0'}}>{item.cantidad}</td>
                <td style={{padding:'7px 10px',textAlign:'right',borderBottom:'1px solid #f0f0f0'}}>RD${Number(item.precio ?? 0).toLocaleString()}</td>
                <td style={{padding:'7px 10px',textAlign:'right',fontWeight:'700',borderBottom:'1px solid #f0f0f0'}}>RD${(Number(item.precio ?? 0)*Number(item.cantidad ?? 1)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES */}
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'16px'}}>
          <div style={{width:'260px'}}>
            {[
              {label:'Subtotal (sin ITBIS)', val:`RD$${subtotalSinITBIS.toLocaleString()}`},
              {label:'ITBIS (18%)',           val:`RD$${itbis.toLocaleString()}`},
              ...(descuento > 0 ? [{label:'Descuento', val:`-RD$${descuento.toLocaleString()}`, color:'#16a34a'}] : []),
              {label:'Envío',                val: envio > 0 ? `RD$${envio.toLocaleString()}` : 'Gratis'},
            ].map((row:any, i:number) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f0f0f0',fontSize:'12px',color:row.color??'#555'}}>
                <span>{row.label}</span><span>{row.val}</span>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',fontSize:'18px',fontWeight:'900',color:'#0d6efd',borderTop:'2px solid #0d6efd',marginTop:'4px'}}>
              <span>TOTAL</span><span>RD${totalReal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* PAGO + ESTADO */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
          <div style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px'}}>
            <div style={{fontSize:'9px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',marginBottom:'6px'}}>Método de pago</div>
            <div style={{fontWeight:'700'}}>
              {'💳 Tarjeta AZUL (Banco Popular)'}
            </div>
            {order.azul_auth_code && (
              <div style={{fontSize:'11px',color:'#666',marginTop:'4px'}}>Auth: <strong>{order.azul_auth_code}</strong></div>
            )}
            <div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Moneda: Peso Dominicano (RD$)</div>
          </div>
          <div style={{
            background:  order.pago_estado === 'pagado' ? '#f0fdf4' : '#fffbeb',
            border:     `1px solid ${order.pago_estado === 'pagado' ? '#86efac' : '#fcd34d'}`,
            borderRadius:'8px', padding:'12px',
          }}>
            <div style={{fontSize:'9px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',marginBottom:'6px'}}>Estado del pago</div>
            <div style={{fontWeight:'900',fontSize:'18px',color: order.pago_estado === 'pagado' ? '#16a34a' : '#d97706'}}>
              {order.pago_estado === 'pagado' ? '✅ PAGADO' :
               order.pago_estado === 'pendiente' ? '⏳ PENDIENTE' :
               '📋 ' + (order.pago_estado ?? 'Pendiente').toUpperCase()}
            </div>
          </div>
        </div>

        {/* LOGOS SEGURIDAD */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 12px',background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
          <span style={{fontSize:'9px',color:'#9ca3af',fontWeight:'600'}}>Transacción procesada de forma segura:</span>
          {[
            {text:'VISA', bg:'#1a1f71', color:'white'},
            {text:'Mastercard', bg:'#EB001B', color:'white'},
            {text:'Verified by VISA', bg:'transparent', color:'#1a1f71', border:'1px solid #1a1f71'},
            {text:'Mastercard ID Check', bg:'transparent', color:'#EB001B', border:'1px solid #EB001B'},
            {text:'🔒 SSL Seguro', bg:'#0d6efd', color:'white'},
          ].map(b => (
            <span key={b.text} style={{fontSize:'9px',background:b.bg,color:b.color,padding:'2px 6px',borderRadius:'3px',fontWeight:'700',border:b.border}}>
              {b.text}
            </span>
          ))}
        </div>

        {/* PIE */}
        <div style={{borderTop:'1px solid #e5e7eb',paddingTop:'12px',textAlign:'center',fontSize:'10px',color:'#9ca3af',lineHeight:'1.8'}}>
          <strong style={{color:'#1a1a1a'}}>ContactGo — Lentes de Contacto República Dominicana</strong><br/>
          contactgo.net · info@contactgo.net · (829) 472-8328 · Santo Domingo, República Dominicana<br/>
          Este comprobante es válido como prueba de pago. Moneda: Peso Dominicano (RD$).<br/>
          No se aceptan devoluciones después de 30 días. ¿Dudas? Contáctenos al (829) 472-8328
        </div>
      </div>
    </>
  )
}

export default function ReciboPage() {
  return (
    <Suspense fallback={
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
        <p>Cargando comprobante...</p>
      </div>
    }>
      <ReciboContent />
    </Suspense>
  )
}
