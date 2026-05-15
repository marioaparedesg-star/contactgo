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
  const params = useSearchParams()
  const orderId = params.get('orden')
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId || orderId === 'TEST') {
      // Datos de ejemplo para TEST
      setOrder({
        id: 'TEST-001',
        numero_orden: 'CG-2026-TEST',
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
    Promise.all([
      sb.from('orders').select('*').eq('id', orderId).single(),
      sb.from('order_items').select('*').eq('order_id', orderId),
    ]).then(([{ data: o }, { data: its }]) => {
      setOrder(o)
      setItems(its ?? [])
      setLoading(false)
    })
  }, [orderId])

  useEffect(() => {
    if (!loading && order) {
      const timer = setTimeout(() => window.print(), 1200)
      return () => clearTimeout(timer)
    }
  }, [loading, order])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>
      <div>
        <div style={{width:'40px',height:'40px',border:'3px solid #0d6efd',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 12px'}}/>
        <p style={{color:'#666',textAlign:'center'}}>Cargando comprobante...</p>
      </div>
    </div>
  )

  if (!order) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'48px',marginBottom:'16px'}}>⚠️</p>
        <h2 style={{color:'#1a1a1a',marginBottom:'8px'}}>Pedido no encontrado</h2>
        <p style={{color:'#666'}}>No se encontró el comprobante para esta orden.</p>
        <button onClick={() => window.close()} style={{marginTop:'16px',background:'#0d6efd',color:'white',border:'none',padding:'10px 20px',borderRadius:'8px',cursor:'pointer'}}>Cerrar</button>
      </div>
    </div>
  )

  const fecha = new Date(order.fecha || order.updated_at || Date.now())
  const totalReal = order.total ?? 0
  const envio = order.envio ?? 200
  const subtotalConITBIS = totalReal - envio - (order.descuento ?? 0)
  const itbis = Math.round(subtotalConITBIS * 0.18 / 1.18)
  const subtotalSinITBIS = subtotalConITBIS - itbis

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
        .page { max-width: 720px; margin: 0 auto; background: white; padding: 32px; min-height: 100vh; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #0d6efd; color: white; padding: 8px 10px; text-align: left; font-size: 11px; }
        td { padding: 7px 10px; font-size: 12px; border-bottom: 1px solid #f0f0f0; }
        tr:nth-child(even) td { background: #f9fafb; }
      `}</style>

      <div className="page">

        {/* Botones - solo pantalla */}
        <div className="no-print" style={{display:'flex',gap:'10px',marginBottom:'20px',justifyContent:'flex-end'}}>
          <button onClick={() => window.print()} style={{background:'#0d6efd',color:'white',border:'none',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',fontSize:'14px'}}>
            🖨️ Imprimir / Guardar PDF
          </button>
          <button onClick={() => window.close()} style={{background:'white',color:'#555',border:'1px solid #ddd',padding:'10px 20px',borderRadius:'8px',cursor:'pointer'}}>
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
              #{order.numero_orden ?? (orderId ?? 'TEST').substring(0,8).toUpperCase()}
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
        <table style={{marginBottom:'16px'}}>
          <thead>
            <tr>
              <th style={{width:'40%'}}>Producto / Descripción</th>
              <th>Prescripción</th>
              <th style={{textAlign:'center',width:'60px'}}>Cant.</th>
              <th style={{textAlign:'right',width:'110px'}}>Precio</th>
              <th style={{textAlign:'right',width:'110px'}}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item:any, i:number) => (
              <tr key={i}>
                <td style={{fontWeight:'600'}}>{item.nombre}</td>
                <td style={{fontFamily:'monospace',fontSize:'11px',color:'#2563eb'}}>
                  {item.sph != null ? `SPH ${fmtSph(item.sph)}` : '—'}
                  {item.cyl != null && item.cyl !== 0 ? ` CYL ${Number(item.cyl).toFixed(2)}` : ''}
                  {item.axis ? ` ${item.axis}°` : ''}
                  {item.add_power ? ` ADD ${item.add_power}` : ''}
                  {item.color ? ` ${item.color}` : ''}
                  {item.ojo ? ` (${item.ojo})` : ''}
                </td>
                <td style={{textAlign:'center'}}>{item.cantidad}</td>
                <td style={{textAlign:'right'}}>RD${Number(item.precio ?? 0).toLocaleString()}</td>
                <td style={{textAlign:'right',fontWeight:'700'}}>RD${(Number(item.precio ?? 0) * Number(item.cantidad ?? 1)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES */}
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'16px'}}>
          <div style={{width:'260px'}}>
            {[
              {label:'Subtotal (sin ITBIS)',val:`RD$${subtotalSinITBIS.toLocaleString()}`},
              {label:'ITBIS (18%)',val:`RD$${itbis.toLocaleString()}`},
              ...(order.descuento > 0 ? [{label:'Descuento',val:`-RD$${order.descuento.toLocaleString()}`,color:'#16a34a'}] : []),
              {label:`Envío`,val:envio > 0 ? `RD$${envio.toLocaleString()}` : 'Gratis'},
            ].map((row:any,i:number) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f0f0f0',fontSize:'12px',color:row.color ?? '#555'}}>
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
              {order.metodo_pago === 'contra_entrega' ? '💵 Contra entrega — Efectivo' :
               order.metodo_pago === 'paypal' ? '🔵 PayPal' :
               order.metodo_pago === 'tarjeta' ? '💳 Tarjeta de crédito/débito' : order.metodo_pago ?? 'Contra entrega'}
            </div>
            {order.azul_auth_code && (
              <div style={{fontSize:'11px',color:'#666',marginTop:'4px'}}>Código autorización: <strong>{order.azul_auth_code}</strong></div>
            )}
            <div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>Moneda: Peso Dominicano (RD$)</div>
          </div>
          <div style={{
            background: order.pago_estado === 'pagado' ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${order.pago_estado === 'pagado' ? '#86efac' : '#fcd34d'}`,
            borderRadius:'8px',padding:'12px'
          }}>
            <div style={{fontSize:'9px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',marginBottom:'6px'}}>Estado del pago</div>
            <div style={{fontWeight:'900',fontSize:'18px',color: order.pago_estado === 'pagado' ? '#16a34a' : '#d97706'}}>
              {order.pago_estado === 'pagado' ? '✅ PAGADO' :
               order.pago_estado === 'pendiente' ? '⏳ PENDIENTE' : '📋 ' + (order.pago_estado ?? 'Pendiente').toUpperCase()}
            </div>
          </div>
        </div>

        {/* LOGOS SEGURIDAD */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 12px',background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
          <span style={{fontSize:'9px',color:'#9ca3af',fontWeight:'600'}}>Transacción procesada de forma segura:</span>
          <span style={{fontSize:'9px',background:'#1a1f71',color:'white',padding:'2px 6px',borderRadius:'3px',fontWeight:'700'}}>VISA</span>
          <span style={{fontSize:'9px',background:'#EB001B',color:'white',padding:'2px 6px',borderRadius:'3px',fontWeight:'700'}}>Mastercard</span>
          <span style={{fontSize:'9px',border:'1px solid #1a1f71',color:'#1a1f71',padding:'2px 6px',borderRadius:'3px',fontWeight:'700'}}>Verified by VISA</span>
          <span style={{fontSize:'9px',border:'1px solid #EB001B',color:'#EB001B',padding:'2px 6px',borderRadius:'3px',fontWeight:'700'}}>Mastercard ID Check</span>
          <span style={{fontSize:'9px',background:'#0d6efd',color:'white',padding:'2px 6px',borderRadius:'3px',fontWeight:'700'}}>🔒 SSL Seguro</span>
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
