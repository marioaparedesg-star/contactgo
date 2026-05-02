'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Home } from 'lucide-react'

function ConfirmacionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orden')
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { router.push('/'); return }
    const sb = createClient()
    sb.from('orders').select('*').eq('id', orderId).single().then(({ data }) => {
      setOrder(data)
      setLoading(false)
    })
    sb.from('order_items').select('*, products(nombre, imagen_url)').eq('order_id', orderId).then(({ data }) => {
      setItems(data || [])
    })
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!order) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido confirmado</h1>
          <p className="text-gray-500 mt-1">Gracias por tu compra</p>
          <div className="mt-3 bg-primary-50 rounded-xl px-4 py-2 inline-block">
            <p className="text-primary-700 font-bold text-lg">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-gray-900">Productos</h2>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    {item.products?.imagen_url ?
                      <img src={item.products.imagen_url} className="w-full h-full object-cover rounded-xl" alt="" /> :
                      <span className="text-lg">👁</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.nombre}</p>
                    {item.sph && <p className="text-xs text-gray-400">Grad: {item.sph > 0 ? '+' : ''}{item.sph}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">x{item.cantidad}</p>
                    <p className="font-semibold text-sm">RD${(item.precio * item.cantidad).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>RD${order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envio</span><span>RD$200</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 mt-1">
                <span>Total</span><span>RD${order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-gray-900">Entrega</h2>
            </div>
            <p className="text-gray-700 font-medium">{order.cliente_nombre}</p>
            <p className="text-gray-500 text-sm">{order.direccion_texto}</p>
            <p className="text-gray-500 text-sm">{order.cliente_telefono}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-gray-900">Pago</h2>
            </div>
            <p className="text-gray-700 capitalize font-medium">{order.metodo_pago?.replace('_', ' ')}</p>
            <span className={"px-2 py-1 rounded-lg text-xs font-semibold mt-1 inline-block " + (order.estado === 'entregado' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700')}>
              {order.estado}
            </span>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-blue-700 text-sm font-medium">Tu pedido llegara en 24-48 horas</p>
            <p className="text-blue-500 text-xs mt-1">Te contactaremos al {order.cliente_telefono}</p>
          </div>

          <div className="space-y-3 mt-4">
            <button onClick={() => router.push('/cuenta')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              <Package className="w-5 h-5" /> Ver mis pedidos
            </button>
            <button onClick={() => router.push('/')}
              className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Home className="w-4 h-4" /> Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ConfirmacionContent />
    </Suspense>
  )
}
