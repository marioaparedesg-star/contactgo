'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { CheckCircle, Package, MapPin, CreditCard, Phone, ChevronRight, RefreshCw, MessageCircle } from 'lucide-react'

const ESTADO_STEPS = [
  { key: 'pendiente',  label: 'Recibido',    icon: '📋' },
  { key: 'confirmado', label: 'Confirmado',  icon: '✅' },
  { key: 'preparando', label: 'Preparando',  icon: '📦' },
  { key: 'enviado',    label: 'En camino',   icon: '🚚' },
  { key: 'entregado',  label: 'Entregado',   icon: '🎉' },
]

const METODO_LABEL: Record<string, string> = {
  azul:           '💳 Tarjeta (AZUL)',
  paypal:         'PayPal',
  bhd:            'Transferencia BHD',
  contra_entrega: '💵 Pago al recibir',
}

function fmtSph(v: any) {
  if (v == null) return null
  return parseFloat(v) > 0 ? `+${v}` : String(v)
}

function ConfirmacionContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const orderId = params.get('orden')
  const [order, setOrder]   = useState<any>(null)
  const [items, setItems]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!orderId) { router.push('/'); return }
    const sb = createClient()
    Promise.all([
      sb.from('orders').select('*').eq('id', orderId).single(),
      sb.from('order_items').select('*').eq('order_id', orderId),
    ]).then(([{ data: o }, { data: i }]) => {
      setOrder(o)
      setItems(i ?? [])
      setLoading(false)
      setTimeout(() => setShowConfetti(true), 300)
    })
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Cargando tu pedido...</p>
      </div>
    </div>
  )

  if (!order) return null

  const pedidoId     = order.id.slice(-8).toUpperCase()
  const stepIdx      = ESTADO_STEPS.findIndex(s => s.key === order.estado)
  const currentStep  = Math.max(stepIdx, 0)
  const whatsappMsg  = encodeURIComponent(`Hola ContactGo, quiero consultar sobre mi pedido #${pedidoId}`)
  const waNumber     = process.env.NEXT_PUBLIC_WHATSAPP ?? '18294089097'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Hero confirmación */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 px-4 pt-10 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {showConfetti && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-white animate-bounce"
              style={{ left: `${(i * 5.2) % 100}%`, top: `${(i * 7.3) % 80}%`, animationDelay: `${i * 0.1}s`, animationDuration: `${0.8 + (i % 4) * 0.2}s` }} />
          ))}
        </div>
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">¡Pedido confirmado!</h1>
          <p className="text-green-100 text-sm mb-4">Gracias por comprar en ContactGo</p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-5 py-2.5">
            <span className="text-white/70 text-sm">Pedido</span>
            <span className="text-white font-black text-lg tracking-wider">#{pedidoId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6">

        {/* Timeline estado */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Estado del pedido</p>
          <div className="flex items-center justify-between relative">
            {/* línea de fondo */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0" />
            {/* línea progreso */}
            <div className="absolute top-4 left-4 h-0.5 bg-green-400 z-0 transition-all duration-500"
              style={{ width: `${currentStep > 0 ? (currentStep / (ESTADO_STEPS.length - 1)) * 100 : 0}%` }} />
            {ESTADO_STEPS.map((step, i) => {
              const done    = i < currentStep
              const current = i === currentStep
              return (
                <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                    ${done ? 'bg-green-500 text-white' : current ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                    {done ? '✓' : step.icon}
                  </div>
                  <p className={`text-[10px] font-medium text-center leading-tight
                    ${current ? 'text-green-600 font-bold' : done ? 'text-green-500' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Tu pedido llegará en <span className="font-semibold text-gray-600">24-48 horas</span>
          </p>
        </div>

        {/* Productos */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-green-500" />
              <p className="font-bold text-gray-900 text-sm">Productos</p>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 text-lg">
                    👁
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{item.nombre}</p>
                    {item.sph != null && (
                      <p className="text-xs font-mono text-blue-600 mt-0.5">
                        SPH: {fmtSph(item.sph)}
                        {item.cyl != null ? ` · CYL: ${item.cyl}` : ''}
                        {item.axis != null ? ` · EJE: ${String(item.axis).padStart(3,'0')}` : ''}
                        {item.add_power ? ` · ADD: ${item.add_power}` : ''}
                        {item.color ? ` · ${item.color}` : ''}
                        {item.ojo ? ` · ${item.ojo}` : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.cantidad}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm shrink-0">
                    RD${((item.precio ?? 0) * (item.cantidad ?? 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>RD${order.subtotal?.toLocaleString()}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-RD${order.descuento?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span>{order.envio > 0 ? `RD${order.envio?.toLocaleString()}` : 'Gratis'}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 border-t border-gray-100 pt-2">
                <span>Total</span>
                <span className="text-green-600">RD${order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Entrega + pago */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-green-500" />
              <p className="text-xs font-bold text-gray-500 uppercase">Entrega</p>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{order.cliente_nombre}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{order.direccion_texto}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <CreditCard className="w-3.5 h-3.5 text-green-500" />
              <p className="text-xs font-bold text-gray-500 uppercase">Pago</p>
            </div>
            <p className="font-semibold text-gray-900 text-sm">
              {METODO_LABEL[order.metodo_pago] ?? order.metodo_pago?.replace('_', ' ')}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block
              ${order.pago_estado === 'verificado' || order.pago_estado === 'pagado'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'}`}>
              {order.pago_estado === 'verificado' || order.pago_estado === 'pagado' ? 'Pagado' : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* Info email */}
        {order.cliente_email && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <span className="text-blue-500 text-lg shrink-0">📧</span>
            <div>
              <p className="text-blue-800 font-semibold text-sm">Confirmación enviada</p>
              <p className="text-blue-600 text-xs mt-0.5">
                Revisa tu correo en <span className="font-medium">{order.cliente_email}</span>
              </p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <Link href="/cuenta"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <Package className="w-5 h-5" /> Seguir mi pedido
          </Link>
          <a href={`https://wa.me/${waNumber}?text=${whatsappMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <MessageCircle className="w-4 h-4 text-green-500" /> ¿Tienes dudas? WhatsApp
          </a>
          <Link href="/catalogo"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm">
            Seguir comprando <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  )
}
