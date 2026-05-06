'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export default function ConfirmacionPage() {
  const { orderId } = useParams() as { orderId: string }
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const sb = createClient()

  useEffect(() => {
    if (!orderId) return
    sb.from('orders').select('*').eq('id', orderId).single().then(({data}) => setOrder(data))
    sb.from('order_items').select('*').eq('order_id', orderId).then(({data}) => setItems(data??[]))
  }, [orderId])

  const tienePositivos = items.some(i => parseFloat(i.sph ?? '0') > 0)

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-16 pb-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        {order && <p className="text-gray-400 text-sm mb-6">Pedido #{order.id.slice(0,8).toUpperCase()}</p>}

        {/* Mensaje tiempo de entrega */}
        <div className={`rounded-2xl p-5 mb-6 text-left ${tienePositivos ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
          {tienePositivos ? (
            <>
              <p className="font-bold text-amber-800 mb-1">⏱️ Tiempo de entrega: 24 a 72 horas</p>
              <p className="text-sm text-amber-700">Tu pedido incluye lentes con graduación positiva (+) que requieren procesamiento especial. Lo recibirás en 24 a 72 horas hábiles.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-green-800 mb-1">🚀 Tiempo de entrega: 24 horas</p>
              <p className="text-sm text-green-700">Tu pedido será procesado y entregado dentro de las próximas 24 horas. ¡Pronto tendrás tus lentes!</p>
            </>
          )}
        </div>

        {/* Detalle del pedido */}
        {items.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 text-left">
            <p className="font-semibold text-gray-700 text-sm mb-3">Detalle del pedido</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.nombre}</p>
                    {item.sph && <p className="text-xs text-gray-400">
                      SPH: {parseFloat(item.sph) > 0 ? '+' : ''}{item.sph}
                      {item.cyl ? ` · CYL: ${item.cyl}` : ''}
                      {item.axis ? ` · EJE: ${item.axis}` : ''}
                      {item.add_power ? ` · ADD: ${item.add_power}` : ''}
                    </p>}
                    <p className="text-xs text-gray-400">x{item.cantidad}</p>
                  </div>
                  <p className="font-semibold text-gray-900">RD${(item.subtotal ?? item.precio * item.cantidad).toLocaleString()}</p>
                </div>
              ))}
            </div>
            {order && (
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>RD${order.total?.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/cuenta" className="bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Ver mis pedidos
          </Link>
          <Link href="/catalogo" className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Seguir comprando
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
