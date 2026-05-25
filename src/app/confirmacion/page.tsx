'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CheckCircle, Package, MapPin, CreditCard, MessageCircle, ChevronRight, XCircle } from 'lucide-react'
import { fmtSph } from '@/lib/sph-utils'
import { trackEcommerce } from '@/lib/analytics'

const PASOS = [
  { key: 'pendiente',  label: 'Recibido',   icon: '📋' },
  { key: 'confirmado', label: 'Confirmado', icon: '✅' },
  { key: 'preparando', label: 'Preparando', icon: '📦' },
  { key: 'enviado',    label: 'En camino',  icon: '🚚' },
  { key: 'entregado',  label: 'Entregado',  icon: '🎉' },
]

function formatRecetaItem(item: any): string {
  const parts: string[] = []
  if (item.sph != null) parts.push(`SPH ${fmtSph(item.sph)}`)
  if (item.cyl != null) parts.push(`CYL ${parseFloat(item.cyl).toFixed(2)}`)
  if (item.axis != null) parts.push(`EJE ${String(item.axis).padStart(3,'0')}°`)
  if (item.add_power) parts.push(`ADD ${item.add_power}`)
  if (item.color) parts.push(item.color)
  return parts.join(' · ')
}

function ojoLabel(ojo: string | null): string | null {
  if (!ojo) return null
  if (ojo === 'OD') return '👁 Ojo Derecho'
  if (ojo === 'OI') return '👁 Ojo Izquierdo'
  return null
}

function ConfirmacionContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const orderId = params.get('orden')
  const origen  = params.get('origen')
  const resultado = params.get('resultado')
  const declinado = resultado === 'declinado'

  const [order,   setOrder]   = useState<any>(null)
  const [items,   setItems]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dots,    setDots]    = useState(false)

  // Limpiar carrito
  useEffect(() => {
    if (origen === 'azul' && resultado === 'aprobado') {
      try {
        const s = JSON.parse(localStorage.getItem('contactgo-cart') || '{}')
        if (s.state) { s.state.items = []; localStorage.setItem('contactgo-cart', JSON.stringify(s)) }
      } catch {}
      if (orderId) {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, evento: 'nuevo_pedido' }),
        }).catch(() => {})
      }
    }
  }, [origen, resultado, orderId])

  // Animación de puntos para celebrar
  useEffect(() => {
    if (!declinado) setTimeout(() => setDots(true), 400)
  }, [declinado])

  useEffect(() => {
    if (!orderId) { setTimeout(() => router.push('/'), 1500); return }
    const sb = createClient()
    Promise.all([
      sb.from('orders').select('*').eq('id', orderId).single(),
      sb.from('order_items').select('*').eq('order_id', orderId),
    ]).then(([{ data: o }, { data: i }]) => {
      if (!o) { router.push('/'); return }
      setOrder(o); setItems(i ?? []); setLoading(false)
      // GA4 + Meta Pixel: evento purchase (solo cuando es aprobado y primera vez)
      if (o && origen === 'azul' && resultado === 'aprobado') {
        const alreadyTracked = sessionStorage.getItem(`tracked_${orderId}`)
        if (!alreadyTracked) {
          sessionStorage.setItem(`tracked_${orderId}`, '1')
          trackEcommerce('purchase', {
            transaction_id: o.numero_orden ?? orderId ?? '',
            value: Number(o.total ?? 0),
            currency: 'DOP',
            items: (i ?? []).map((item: any) => ({
              item_id:       item.product_id ?? item.id,
              item_name:     item.nombre ?? '',
              item_brand:    item.marca ?? '',
              item_category: item.tipo ?? '',
              price:         Number(item.precio ?? 0),
              quantity:      Number(item.cantidad ?? 1),
            })),
          })
        }
      }
    })
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm font-medium">Cargando tu pedido...</p>
      </div>
    </div>
  )

  if (!order) return null

  const pedidoId   = (order.numero_orden ?? order.id.slice(-8)).toUpperCase()
  const stepIdx    = PASOS.findIndex(s => s.key === order.estado)
  const curStep    = Math.max(stepIdx, 0)
  const hasTorico  = items.some((i: any) => i.tipo === 'torico' || i.nombre?.toLowerCase().includes('toric'))
  const waMsg      = encodeURIComponent(`Hola ContactGo 👋 quiero consultar sobre mi pedido #${pedidoId}`)
  const waNumber   = '18294728328'

  // ── PAGO DECLINADO ─────────────────────────────────────────────────────────
  if (declinado) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white rounded-3xl shadow-md p-8 max-w-sm w-full">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-9 h-9 text-red-500" />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2">Pago no procesado</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Tu tarjeta fue declinada. Verifica los datos o intenta con otra tarjeta. Tu carrito sigue guardado.
        </p>
        <div className="space-y-3">
          <Link href="/checkout"
            className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 font-bold">
            🔄 Reintentar pago
          </Link>
          <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4 text-green-500" /> ¿Necesitas ayuda?
          </a>
        </div>
      </div>
    </div>
  )

  // ── PEDIDO CONFIRMADO ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 pt-12 pb-24 text-center relative overflow-hidden">
        {/* Confetti */}
        {dots && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length:16}).map((_,i)=>(
              <div key={i}
                className="absolute w-2 h-2 rounded-full bg-white/40 animate-bounce"
                style={{left:`${(i*6.5)%98}%`,top:`${(i*9.1)%70}%`,animationDelay:`${i*0.08}s`,animationDuration:`${0.7+(i%3)*0.25}s`}}/>
            ))}
          </div>
        )}
        <div className="relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-11 h-11 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-green-200 text-sm font-medium mb-1">¡Todo listo!</p>
          <h1 className="text-3xl font-black text-white mb-3">Pedido confirmado</h1>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-2xl px-5 py-2.5 border border-white/20">
            <span className="text-green-200 text-sm">Pedido</span>
            <span className="text-white font-black text-xl tracking-widest">#{pedidoId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-4 relative z-10 pb-8">

        {/* Tiempo de entrega — card destacada */}
        <div className={`rounded-2xl p-4 text-center border shadow-sm ${hasTorico ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
          <p className={`text-2xl font-black mb-0.5 ${hasTorico ? 'text-amber-700' : 'text-green-600'}`}>
            {hasTorico ? '20–30 días' : '24–48 horas'}
          </p>
          <p className={`text-sm font-medium ${hasTorico ? 'text-amber-600' : 'text-gray-500'}`}>
            {hasTorico
              ? '⏱️ Tus lentes se fabrican a medida · requieren más tiempo'
              : '🚀 Tu pedido llegará pronto a tu puerta'}
          </p>
        </div>

        {/* Estado del pedido */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Estado del pedido</p>
          <div className="flex items-start justify-between relative">
            {/* Línea fondo */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100" />
            {/* Línea progreso */}
            <div className="absolute top-4 left-6 h-0.5 bg-green-400 transition-all duration-700"
              style={{width: curStep > 0 ? `calc(${(curStep/(PASOS.length-1))*100}% - 0px)` : '0%'}} />
            {PASOS.map((paso, i) => {
              const done    = i < curStep
              const current = i === curStep
              return (
                <div key={paso.key} className="flex flex-col items-center gap-2 z-10 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all shadow-sm
                    ${done ? 'bg-green-500 text-white' : current ? 'bg-white border-2 border-green-500 shadow-green-100' : 'bg-gray-100 text-gray-400'}`}>
                    {done ? '✓' : paso.icon}
                  </div>
                  <p className={`text-[9px] font-bold text-center leading-tight
                    ${current ? 'text-green-600' : done ? 'text-green-400' : 'text-gray-400'}`}>
                    {paso.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Productos */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-green-500" />
              <p className="font-black text-gray-900 text-sm">Tu pedido</p>
            </div>
            <div className="space-y-4">
              {items.map((item, i) => {
                const receta = formatRecetaItem(item)
                const ojolbl = ojoLabel(item.ojo)
                return (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 text-base">👁</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-snug">{item.nombre}</p>
                      {ojolbl && (
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          item.ojo === 'OD' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{ojolbl}</span>
                      )}
                      {receta && (
                        <div className="mt-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
                          <p className="text-[10px] text-blue-400 font-semibold mb-0.5">Receta</p>
                          <p className="text-xs font-mono font-bold text-blue-800">{receta}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-black text-gray-900 text-sm shrink-0">
                      RD${((item.precio ?? 0) * (item.cantidad ?? 1)).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
            {/* Totales */}
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>RD${order.subtotal?.toLocaleString()}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Descuento</span>
                  <span>-RD${order.descuento?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span>{order.envio > 0 ? `RD$${order.envio?.toLocaleString()}` : '🎁 Gratis'}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-100 pt-2">
                <span>Total pagado</span>
                <span className="text-green-600">RD${order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Entrega + Pago en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-green-500" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Entrega a</p>
            </div>
            <p className="font-bold text-gray-900 text-sm">{order.cliente_nombre}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{order.direccion_texto}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <CreditCard className="w-3.5 h-3.5 text-green-500" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pago</p>
            </div>
            <p className="font-bold text-gray-900 text-sm">Tarjeta AZUL</p>
            <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              ✓ Aprobado
            </span>
          </div>
        </div>

        {/* Email */}
        {order.cliente_email && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">📧</span>
            <div>
              <p className="font-bold text-blue-900 text-sm">Confirmación enviada por email</p>
              <p className="text-blue-600 text-xs mt-0.5">
                Revisa <span className="font-semibold">{order.cliente_email}</span> — también puede estar en spam.
              </p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3 pt-1">
          <Link href="/cuenta"
            className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.99] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-200">
            <Package className="w-5 h-5" /> Seguir mi pedido
          </Link>
          {orderId && (
            <a href={`/recibo?orden=${orderId}`} target="_blank" rel="noopener noreferrer"
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm">
              🖨️ Ver comprobante de pago
            </a>
          )}
          <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm">
            <MessageCircle className="w-4 h-4 text-green-500" /> ¿Preguntas? Escríbenos por WhatsApp
          </a>
          <Link href="/catalogo"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm">
            Seguir comprando <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Nota médica */}
        {items.some((i:any) => i.tipo === 'esferico' || i.tipo === 'torico' || i.tipo === 'multifocal') && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Recordatorio:</strong> Los lentes de contacto son dispositivos médicos. Consulta a tu optometrista si presentas molestias, enrojecimiento o visión borrosa con los lentes puestos.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  )
}
