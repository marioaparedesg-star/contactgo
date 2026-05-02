import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { ShoppingBag, Clock, DollarSign, Users, AlertTriangle } from 'lucide-react'

export const revalidate = 0

async function getStats() {
  const sb = createServerSupabaseClient()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { data: monthOrders },
    { count: totalClients },
    { count: lowStock },
  ] = await Promise.all([
    sb.from('orders').select('*', { count: 'exact', head: true }),
    sb.from('orders').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    sb.from('orders').select('total').gte('fecha', monthStart),
    sb.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    sb.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5).gt('stock', 0),
  ])
  const monthRevenue = (monthOrders ?? []).reduce((s: number, o: any) => s + (o.total ?? 0), 0)
  return { totalOrders: totalOrders ?? 0, pendingOrders: pendingOrders ?? 0, monthRevenue, totalClients: totalClients ?? 0, lowStock: lowStock ?? 0 }
}

async function getRecentOrders() {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('orders')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(10)
  return data ?? []
}

export default async function AdminDashboard() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [stats, orders] = await Promise.all([getStats(), getRecentOrders()])

  const ESTADO_BADGE: Record<string, string> = {
    pendiente: 'bg-yellow-50 text-yellow-700',
    procesando: 'bg-blue-50 text-blue-700',
    enviado: 'bg-purple-50 text-purple-700',
    entregado: 'bg-green-50 text-green-700',
    cancelado: 'bg-red-50 text-red-700',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Resumen general de ContactGo</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total pedidos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Ingresos mes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">RD${stats.monthRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Clientes</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
          </div>
        </div>
        {stats.lowStock > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
            <p className="text-yellow-800 text-sm font-medium">{stats.lowStock} producto(s) con stock bajo (1-5 unidades)</p>
            <a href="/admin/inventario" className="ml-auto text-sm text-yellow-700 font-semibold underline">Ver inventario</a>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
            <a href="/admin/pedidos" className="text-sm text-primary-600 font-medium hover:text-primary-700">Ver todos</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['ID','Cliente','Total','Método','Estado','Fecha'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{o.id.slice(0,8)}…</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{o.profiles?.nombre ?? o.cliente_nombre ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold">RD${(o.total ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{(o.metodo_pago ?? '—').replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${ESTADO_BADGE[o.estado] ?? ESTADO_BADGE.pendiente}`}>
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
      </main>
    </div>
  )
}
