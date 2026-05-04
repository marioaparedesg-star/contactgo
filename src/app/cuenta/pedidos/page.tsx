'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase'
import { Package, ChevronRight } from 'lucide-react'

const ESTADOS: Record<string, { label: string; color: string }> = {
  pendiente:  { label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  confirmado: { label: 'Confirmado',  color: 'bg-blue-100 text-blue-700' },
  enviado:    { label: 'En camino',   color: 'bg-purple-100 text-purple-700' },
  entregado:  { label: 'Entregado',   color: 'bg-green-100 text-green-700' },
  cancelado:  { label: 'Cancelado',   color: 'bg-red-100 text-red-700' },
}

export default function MisPedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/cuenta'); return }
      sb.from('orders')
        .select('*, order_items(nombre, cantidad)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
    })
  }, [])

  if (loading) return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-16 pb-24 text-center text-gray-400">Cargando pedidos...</main>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 pb-24">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No tienes pedidos aún</p>
            <button onClick={() => router.push('/catalogo')}
              className="mt-4 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700">
              Ver catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const est = ESTADOS[order.estado] ?? { label: order.estado, color: 'bg-gray-100 text-gray-600' }
              const productos = order.order_items?.map((i: any) => i.nombre).join(', ')
              return (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">#{order.id.slice(0,8).toUpperCase()}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${est.color}`}>{est.label}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{productos}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-sm">RD${order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
