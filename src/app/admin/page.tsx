import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'

export const revalidate = 0

async function getStats() {
  const sb = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

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

  return { totalOrders: totalOrders ?? 0, pendingOrders: pendingOrders ?? 0,
           monthRevenue, totalClients: totalClients ?? 0, lowStock: lowStock ?? 0 }
}

async function getRecentOrders() {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('orders')
    .select('*, profiles(nombre, email)')
    .order('fecha', { ascending: false })
    .limit(10)
  return data ?? []
}

const ESTADO_BADGE: Record<string, { label: string; cls: string; icon: any }> = {
  pendiente:   { label: 'Pendiente',   cls: 'bg-amber-100 text-amber-700',   icon: Clock },
  confirmado:  { label: 'Confirmado',  cls: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  preparando:  { label: 'Preparando',  cls: 'bg-purple-100 text-purple-700', icon: Package },
  enviado:     { label: 'Enviado',     cls: 'bg-indigo-100 text-indigo-700', icon: Truck },
  entregado:   { label: 'Entregado',   cls: 'bg-green-100 text-green-700',   icon: CheckCircle },
  cancelado:   { label: 'Cancelado',   cls: 'bg-red-100 text-red-700',       icon: AlertCircle },
}

export default async function AdminDashboard() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [stats, orders] = await Promise.all([getStats(), getRecentOrders()])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Resumen de ContactGo</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Pedidos totales', value: stats.totalOrders, icon: ShoppingBag, color: 'blue' },
              { label: 'Pendientes',      value: stats.pendingOrders, icon: Clock,      color: 'amber' },
              { label: 'Ventas del mes',  value: `RD$${stats.monthRevenue.toLocaleString()}`, icon: TrendingUp, color: 'green' },
              { label: 'Clientes',        value: stats.totalClients, icon: Users,       color: 'purple' },
              { label: 'Stock bajo',      value: stats.lowStock,     icon: AlertCircle, color: 'red' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3
                  bg-${color}-100`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Pedidos recientes */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
              <a href="/admin/pedidos" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                Ver todos →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID','Cliente','Total','Pago','Estado','Fecha'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o: any) => {
                    const b = ESTADO_BADGE[o.estado] ?? ESTADO_BADGE.pendiente
                    const BIcon = b.icon
                    return (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{o.id.slice(0,8)}…</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {o.profiles?.nombre ?? o.cliente_nombre ?? '—'}
                        </td>
                        <td className="px-4 py-3 font-semibold">RD${(o.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 capitalize">{(o.metodo_pago ?? '—').replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${b.cls} flex items-center gap-1 w-fit`}>
                            <BIcon className="w-3 h-3" /> {b.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(o.fecha).toLocaleDateString('es-DO')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
