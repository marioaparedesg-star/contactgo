import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { getFechaEntrega, getEntrega } from '@/lib/delivery-times'

const ESTADOS = [
  { key: 'recibido',      label: 'Pedido recibido',          icono: '✅', desc: 'Tu pedido fue recibido exitosamente' },
  { key: 'pago_aprobado', label: 'Pago aprobado',            icono: '💳', desc: 'Pago procesado por AZUL Banco Popular' },
  { key: 'preparando',    label: 'Preparando pedido',        icono: '📦', desc: 'Estamos preparando tu pedido' },
  { key: 'fabricante',    label: 'Pedido especial en proceso', icono: '🏭', desc: 'Tu pedido fue enviado al distribuidor' },
  { key: 'transito',      label: 'En tránsito',              icono: '🚛', desc: 'Tu pedido está en camino' },
  { key: 'entregado',     label: 'Entregado',                icono: '🎉', desc: '¡Tu pedido fue entregado!' },
]

export default async function PedidoPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params
  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )

  const { data: order } = await sb
    .from('orders')
    .select('*, order_items(*, product:products(nombre,tipo,imagen_url))')
    .eq('numero_orden', numero)
    .single()

  if (!order) notFound()

  const { data: eventos } = await sb
    .from('order_events')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true })

  const estadosCompletados = new Set((eventos ?? []).map((e: any) => e.estado))
  const ultimoEstado = eventos?.at(-1)?.estado ?? 'recibido'
  const idxActual = ESTADOS.findIndex(e => e.key === ultimoEstado)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400">Pedido</p>
            <h1 className="text-2xl font-black text-gray-900">{order.numero_orden}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleDateString('es-DO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                order.pago_estado==='pagado' ? 'bg-green-100 text-green-800' :
                order.pago_estado==='declinado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                {order.pago_estado==='pagado' ? '✅ Pago confirmado' : order.pago_estado==='declinado' ? '❌ Pago declinado' : '⏳ Pendiente'}
              </span>
              <span className="text-sm font-black text-gray-900">RD${order.total?.toLocaleString()}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-4">Estado de tu pedido</h2>
            <div className="space-y-0">
              {ESTADOS.map((estado, idx) => {
                const completado = estadosCompletados.has(estado.key)
                const esActual   = idx === idxActual
                const futuro     = idx > idxActual
                const evento     = (eventos ?? []).find((e: any) => e.estado === estado.key)
                return (
                  <div key={estado.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${
                        completado ? 'bg-green-500 text-white' :
                        esActual   ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-300'}`}>
                        {completado ? '✓' : estado.icono}
                      </div>
                      {idx < ESTADOS.length-1 && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${completado ? 'bg-green-200' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className={`pb-4 flex-1 ${futuro ? 'opacity-30' : ''}`}>
                      <p className={`font-bold text-sm ${completado||esActual ? 'text-gray-900' : 'text-gray-400'}`}>{estado.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{evento?.descripcion ?? estado.desc}</p>
                      {evento?.created_at && (
                        <p className="text-[10px] text-gray-300 mt-0.5">
                          {new Date(evento.created_at).toLocaleString('es-DO',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-black text-gray-800 mb-3">Productos en este pedido</h2>
            <div className="space-y-3 divide-y divide-gray-50">
              {(order.order_items ?? []).map((item: any, idx: number) => {
                const tipo  = item.product?.tipo ?? 'esferico'
                const nomb  = item.nombre ?? item.product?.nombre ?? ''
                const fecha = getFechaEntrega(tipo, nomb, item.sph)
                const info  = getEntrega(tipo, nomb, item.sph)
                return (
                  <div key={idx} className="flex gap-3 items-start pt-3 first:pt-0">
                    {item.product?.imagen_url && (
                      <img src={item.product.imagen_url} alt={nomb}
                        className="w-14 h-14 object-contain rounded-xl border border-gray-100 p-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 leading-tight">{nomb}</p>
                      {item.sph && <p className="text-xs text-gray-400 mt-0.5">SPH {item.sph}{item.color ? ` · ${item.color}` : ''}</p>}
                      <p className={`text-xs font-semibold mt-1 ${info.especial ? 'text-amber-600' : 'text-green-600'}`}>
                        {info.icono} {fecha.texto}
                      </p>
                    </div>
                    <span className="text-sm font-black text-gray-700 flex-shrink-0">×{item.cantidad}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTAs */}
          <a href="/catalogo"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl text-center text-sm transition-colors">
            Hacer otro pedido
          </a>
          <a href={`https://wa.me/18295430580?text=Hola, pregunta sobre pedido ${order.numero_orden}`}
            target="_blank" rel="noopener"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors">
            💬 Preguntar por WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params
  return { title: `Pedido ${numero} — ContactGo` }
}
