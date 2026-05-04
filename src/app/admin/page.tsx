import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { ShoppingBag, Clock, DollarSign, Users, AlertTriangle, TrendingUp, Package } from 'lucide-react'

export const revalidate = 0

async function getStats() {
  const sb = createServerSupabaseClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { data: monthOrders },
    { data: todayOrders },
    { count: totalClients },
    { count: lowStock },
    { count: sinStock },
  ] = await Promise.all([
    sb.from('orders').select('*', { count: 'exact', head: true }),
    sb.from('orders').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    sb.from('orders').select('total').gte('fecha', monthStart),
    sb.from('orders').select('total').gte('fecha', todayStart),
    sb.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    sb.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5).gt('stock', 0),
    sb.from('products').select('*', { count: 'exact', head: true }).eq('stock', 0),
  ])
  const monthRevenue = (monthOrders ?? []).reduce((s: number, o: any) => s + (o.total ?? 0), 0)
  const todayRevenue = (todayOrders ?? []).reduce((s: number, o: any) => s + (o.total ?? 0), 0)
  const todayCount = (todayOrders ?? []).length
  return { totalOrders: totalOrders ?? 0, pendingOrders: pendingOrders ?? 0, monthRevenue, todayRevenue, todayCount, totalClients: totalClients ?? 0, lowStock: lowStock ?? 0, sinStock: sinStock ?? 0 }
}

async function getRecentOrders() {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('orders').select('*').order('fecha', { ascending: false }).limit(8)
  return data ?? []
}

async function getTopProducts() {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('order_items').select('nombre, cantidad, precio').limit(100)
  if (!data) return []
  const map: Record<string, { nombre: string, total: number, unidades: number }> = {}
  data.forEach((i: any) => {
    if (!map[i.nombre]) map[i.nombre] = { nombre: i.nombre, total: 0, unidades: 0 }
    map[i.nombre].total += (i.precio ?? 0) * (i.cantidad ?? 1)
    map[i.nombre].unidades += i.cantidad ?? 1
  })
  return Object.values(map).sort((a, b) => b.unidades - a.unidades).slice(0, 5)
}

export default async function AdminDashboard() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [stats, orders, topProducts] = await Promise.all([getStats(), getRecentOrders(), getTopProducts()])

  const ESTADO_BADGE: Record<string, string> = {
    pendiente: 'bg-yellow-50 text-yellow-700',
    confirmado: 'bg-blue-50 text-blue-700',
    preparando: 'bg-purple-50 text-purple-700',
    enviado: 'bg-indigo-50 text-indigo-700',
    entregado: 'bg-green-50 text-green-700',
    cancelado: 'bg-red-50 text-red-700',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8 overflow-auto pt-16 pb-24 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Resumen general de ContactGo</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Hoy</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">RD${stats.todayRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.todayCount} pedido(s) hoy</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Mes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">RD${stats.monthRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalOrders} pedidos totales</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-500">Pendientes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-400 mt-1">Por procesar</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Clientes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              <p className="text-xs text-gray-400 mt-1">Registrados</p>
            </div>
          </div>

          {(stats.lowStock > 0 || stats.sinStock > 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
              <p className="text-yellow-800 text-sm font-medium">
                {stats.sinStock > 0 && `${stats.sinStock} sin stock · `}
                {stats.lowStock > 0 && `${stats.lowStock} con stock bajo`}
              </p>
              <a href="/admin/inventario" className="ml-auto text-sm text-yellow-700 font-semibold underline">Ver inventario</a>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
                <a href="/admin/pedidos" className="text-sm text-primary-600 font-medium hover:text-primary-700">Ver todos</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Cliente','Total','Metodo','Estado','Fecha'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{o.cliente_nombre ?? 'Sin nombre'}</td>
                        <td className="px-4 py-3 font-semibold text-sm">RD${(o.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs capitalize">{(o.metodo_pago ?? '').replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <span className={"px-2 py-1 rounded-lg text-xs font-semibold " + (ESTADO_BADGE[o.estado] ?? ESTADO_BADGE.pendiente)}>
                            {o.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.fecha).toLocaleDateString('es-DO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Top productos</h2>
              </div>
              <div className="p-4 space-y-3">
                {topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Sin datos aun</p>
                ) : topProducts.map((p, i) => (
                  <div key={p.nombre} className="flex items-center gap-3">
                    <span className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold " + (i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500')}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.nombre}</p>
                      <p className="text-xs text-gray-400">{p.unidades} unidades · RD${p.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
