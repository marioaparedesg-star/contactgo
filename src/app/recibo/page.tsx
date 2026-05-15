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

  useEffect(() => {
    if (!orderId) return
    const sb = createClient()
    Promise.all([
      sb.from('orders').select('*').eq('id', orderId).single(),
      sb.from('order_items').select('*').eq('order_id', orderId),
    ]).then(([{ data: o }, { data: its }]) => {
      setOrder(o); setItems(its ?? [])
      setTimeout(() => window.print(), 800)
    })
  }, [orderId])

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const fecha = new Date(order.fecha || order.updated_at || Date.now())
  const itbis = Math.round(order.total * 0.18 / 1.18)
  const subtotalSinITBIS = order.total - itbis - (order.envio ?? 0)

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 1cm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a1a; }
      `}</style>

      <div className="max-w-[680px] mx-auto p-6">

        {/* Botón imprimir */}
        <div className="no-print flex justify-end gap-3 mb-4">
          <button onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700">
            🖨️ Imprimir / Guardar PDF
          </button>
          <button onClick={() => window.close()}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50">
            Cerrar
          </button>
        </div>

        {/* ENCABEZADO */}
        <div style={{borderBottom:'2px solid #0d6efd', paddingBottom:'16px', marginBottom:'16px', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:'22px', fontWeight:'900', color:'#0d6efd', letterSpacing:'-0.5px'}}>ContactGo</div>
            <div style={{fontSize:'11px', color:'#666', marginTop:'2px'}}>Lentes de Contacto República Dominicana</div>
            <div style={{fontSize:'11px', color:'#666'}}>contactgo.net · info@contactgo.net</div>
            <div style={{fontSize:'11px', color:'#666'}}>(829) 472-8328 · Santo Domingo, RD</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'18px', fontWeight:'900', color:'#1a1a1a'}}>COMPROBANTE DE PAGO</div>
            <div style={{fontSize:'12px', color:'#666', marginTop:'4px'}}>
              No. Orden: <strong style={{color:'#0d6efd'}}>{order.numero_orden ?? orderId?.substring(0,8).toUpperCase()}</strong>
            </div>
            <div style={{fontSize:'12px', color:'#666'}}>
              Fecha: <strong>{fecha.toLocaleDateString('es-DO', {day:'2-digit',month:'long',year:'numeric'})}</strong>
            </div>
            <div style={{fontSize:'12px', color:'#666'}}>
              Hora: <strong>{fecha.toLocaleTimeString('es-DO', {hour:'2-digit',minute:'2-digit'})}</strong>
            </div>
          </div>
        </div>

        {/* DATOS CLIENTE */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
          <div style={{background:'#f8faff', border:'1px solid #e0e7ff', borderRadius:'8px', padding:'12px'}}>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px'}}>Cliente</div>
            <div style={{fontWeight:'700'}}>{order.cliente_nombre}</div>
            <div style={{color:'#666', fontSize:'12px'}}>{order.cliente_email}</div>
            <div style={{color:'#666', fontSize:'12px'}}>{order.cliente_telefono}</div>
          </div>
          <div style={{background:'#f8faff', border:'1px solid #e0e7ff', borderRadius:'8px', padding:'12px'}}>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px'}}>Dirección de entrega</div>
            <div style={{fontWeight:'700'}}>{order.cliente_nombre}</div>
            <div style={{color:'#666', fontSize:'12px'}}>{order.direccion_texto}</div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'16px'}}>
          <thead>
            <tr style={{background:'#0d6efd', color:'white'}}>
              <th style={{padding:'8px 10px', textAlign:'left', fontSize:'11px', fontWeight:'700'}}>Producto</th>
              <th style={{padding:'8px 10px', textAlign:'left', fontSize:'11px', fontWeight:'700'}}>Prescripción</th>
              <th style={{padding:'8px 10px', textAlign:'center', fontSize:'11px', fontWeight:'700'}}>Cant.</th>
              <th style={{padding:'8px 10px', textAlign:'right', fontSize:'11px', fontWeight:'700'}}>Precio Unit.</th>
              <th style={{padding:'8px 10px', textAlign:'right', fontSize:'11px', fontWeight:'700'}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom:'1px solid #e5e7eb'}}>
                <td style={{padding:'8px 10px', fontSize:'12px', fontWeight:'600'}}>{item.nombre}</td>
                <td style={{padding:'8px 10px', fontSize:'11px', color:'#2563eb', fontFamily:'monospace'}}>
                  {item.sph != null ? `SPH: ${fmtSph(item.sph)}` : '—'}
                  {item.cyl != null && item.cyl !== 0 ? ` CYL: ${Number(item.cyl).toFixed(2)}` : ''}
                  {item.axis != null ? ` EJE: ${item.axis}°` : ''}
                  {item.add_power ? ` ADD: ${item.add_power}` : ''}
                  {item.color ? ` Color: ${item.color}` : ''}
                  {item.ojo ? ` (${item.ojo})` : ''}
                </td>
                <td style={{padding:'8px 10px', textAlign:'center', fontSize:'12px'}}>{item.cantidad}</td>
                <td style={{padding:'8px 10px', textAlign:'right', fontSize:'12px'}}>
                  RD${Number(item.precio ?? 0).toLocaleString()}
                </td>
                <td style={{padding:'8px 10px', textAlign:'right', fontSize:'12px', fontWeight:'700'}}>
                  RD${(Number(item.precio ?? 0) * Number(item.cantidad ?? 1)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALES */}
        <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'16px'}}>
          <div style={{width:'240px'}}>
            <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #e5e7eb', fontSize:'12px', color:'#666'}}>
              <span>Subtotal (sin ITBIS)</span>
              <span>RD${subtotalSinITBIS.toLocaleString()}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #e5e7eb', fontSize:'12px', color:'#666'}}>
              <span>ITBIS (18%)</span>
              <span>RD${itbis.toLocaleString()}</span>
            </div>
            {order.descuento > 0 && (
              <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #e5e7eb', fontSize:'12px', color:'#16a34a'}}>
                <span>Descuento</span>
                <span>-RD${order.descuento?.toLocaleString()}</span>
              </div>
            )}
            <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #e5e7eb', fontSize:'12px', color:'#666'}}>
              <span>Envío</span>
              <span>{order.envio > 0 ? `RD${order.envio?.toLocaleString()}` : 'Gratis'}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'8px 0', fontSize:'16px', fontWeight:'900', color:'#0d6efd', borderTop:'2px solid #0d6efd', marginTop:'4px'}}>
              <span>TOTAL</span>
              <span>RD${order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* MÉTODO DE PAGO + ESTADO */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
          <div style={{background:'#f8faff', border:'1px solid #e0e7ff', borderRadius:'8px', padding:'12px'}}>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#6b7280', textTransform:'uppercase', marginBottom:'6px'}}>Método de pago</div>
            <div style={{fontWeight:'700', fontSize:'13px'}}>
              {order.metodo_pago === 'contra_entrega' ? '💵 Contra entrega (efectivo)' :
               order.metodo_pago === 'paypal' ? '🔵 PayPal' :
               order.metodo_pago === 'tarjeta' ? '💳 Tarjeta de crédito/débito' : order.metodo_pago}
            </div>
            {order.azul_auth_code && (
              <div style={{fontSize:'11px', color:'#666', marginTop:'4px'}}>
                Código autorización AZUL: <strong>{order.azul_auth_code}</strong>
              </div>
            )}
          </div>
          <div style={{background: order.pago_estado === 'pagado' || order.pago_estado === 'verificado' ? '#f0fdf4' : '#fffbeb', border:`1px solid ${order.pago_estado === 'pagado' ? '#86efac' : '#fcd34d'}`, borderRadius:'8px', padding:'12px'}}>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#6b7280', textTransform:'uppercase', marginBottom:'6px'}}>Estado del pago</div>
            <div style={{fontWeight:'900', fontSize:'16px', color: order.pago_estado === 'pagado' || order.pago_estado === 'verificado' ? '#16a34a' : '#d97706'}}>
              {order.pago_estado === 'pagado' || order.pago_estado === 'verificado' ? '✅ PAGADO' : '⏳ PENDIENTE'}
            </div>
          </div>
        </div>

        {/* LOGOS SEGURIDAD */}
        <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', marginBottom:'16px', flexWrap:'wrap'}}>
          <span style={{fontSize:'10px', color:'#9ca3af', fontWeight:'600'}}>Pago procesado de forma segura por:</span>
          <span style={{fontSize:'10px', background:'#1a1f71', color:'white', padding:'2px 8px', borderRadius:'4px', fontWeight:'700'}}>VISA</span>
          <span style={{fontSize:'10px', background:'#EB001B', color:'white', padding:'2px 8px', borderRadius:'4px', fontWeight:'700'}}>Mastercard</span>
          <span style={{fontSize:'10px', border:'1px solid #1a1f71', color:'#1a1f71', padding:'2px 8px', borderRadius:'4px', fontWeight:'700'}}>Verified by VISA</span>
          <span style={{fontSize:'10px', border:'1px solid #EB001B', color:'#EB001B', padding:'2px 8px', borderRadius:'4px', fontWeight:'700'}}>Mastercard ID Check</span>
          <span style={{fontSize:'10px', background:'#0d6efd', color:'white', padding:'2px 8px', borderRadius:'4px', fontWeight:'700'}}>🔒 SSL Seguro</span>
        </div>

        {/* PIE */}
        <div style={{borderTop:'1px solid #e5e7eb', paddingTop:'12px', textAlign:'center', fontSize:'10px', color:'#9ca3af', lineHeight:'1.6'}}>
          <strong style={{color:'#1a1a1a'}}>ContactGo — Lentes de Contacto República Dominicana</strong><br/>
          contactgo.net · info@contactgo.net · (829) 472-8328<br/>
          Este comprobante es válido como prueba de pago. Guárdelo para referencia futura.<br/>
          Transacción procesada en República Dominicana conforme a la Ley 172-13.
        </div>

      </div>
    </>
  )
}

export default function ReciboPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>}>
      <ReciboContent />
    </Suspense>
  )
}
