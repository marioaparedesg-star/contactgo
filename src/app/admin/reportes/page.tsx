import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { TrendingUp, ShoppingBag, Users, DollarSign, Package } from 'lucide-react'

export const revalidate = 0

async function getData() {
  const sb = createServerSupabaseClient()
  const now = new Date()
  const mesStart  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const mesAnteriorStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const mesAnteriorEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  const [
    { data: orders },
    { data: items },
    { data: clientes },
    { data: products },
  ] = await Promise.all([
    sb.from('orders').select('id,total,estado,fecha,metodo_pago,cliente_email').order('fecha', { ascending: false }),
    sb.from('order_items').select('nombre,cantidad,precio,product_id,order_id'),
    sb.from('profiles').select('id,email,created_at').eq('role', 'customer'),
    sb.from('products').select('id,nombre,stock,tipo,marca'),
  ])

  const allOrders   = orders ?? []
  const allItems    = items  ?? []
  const allClientes = clientes ?? []

  const ordersThisMonth = allOrders.filter(o => o.fecha >= mesStart)
  const ordersPrevMonth = allOrders.filter(o => o.fecha >= mesAnteriorStart && o.fecha <= mesAnteriorEnd)

  const ventasMes  = ordersThisMonth.reduce((s, o) => s + (o.total ?? 0), 0)
  const ventasPrev = ordersPrevMonth.reduce((s, o) => s + (o.total ?? 0), 0)
  const crecimiento = ventasPrev > 0 ? Math.round(((ventasMes - ventasPrev) / ventasPrev) * 100) : 0

  const ticket = allOrders.length ? Math.round(allOrders.reduce((s, o) => s + (o.total ?? 0), 0) / allOrders.length) : 0

  // Top productos
  const prodAgg: Record<string, { nombre: string; unidades: number; revenue: number }> = {}
  allItems.forEach((i: any) => {
    const k = i.nombre
    if (!prodAgg[k]) prodAgg[k] = { nombre: k, unidades: 0, revenue: 0 }
    prodAgg[k].unidades += i.cantidad ?? 1
    prodAgg[k].revenue  += (i.precio ?? 0) * (i.cantidad ?? 1)
  })
  const topProductos = Object.values(prodAgg).sort((a, b) => b.unidades - a.unidades).slice(0, 10)

  // Ventas por método de pago
  const metodoAgg: Record<string, { count: number; total: number }> = {}
  allOrders.forEach(o => {
    const k = o.metodo_pago ?? 'otro'
    if (!metodoAgg[k]) metodoAgg[k] = { count: 0, total: 0 }
    metodoAgg[k].count++
    metodoAgg[k].total += o.total ?? 0
  })

  // Ventas por mes (últimos 6 meses)
  const mesesChart: { label: string; ventas: number; pedidos: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d  = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const d2 = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const label  = d.toLocaleDateString('es-DO', { month: 'short' })
    const ventas = allOrders
      .filter(o => o.fecha >= d.toISOString() && o.fecha <= d2.toISOString())
      .reduce((s, o) => s + (o.total ?? 0), 0)
    const pedidos = allOrders.filter(o => o.fecha >= d.toISOString() && o.fecha <= d2.toISOString()).length
    mesesChart.push({ label, ventas, pedidos })
  }
  const maxVentas = Math.max(...mesesChart.map(m => m.ventas), 1)

  // Ventas por tipo de producto
  const tipoAgg: Record<string, number> = {}
  allItems.forEach((item: any) => {
    const p = (products ?? []).find((pr: any) => pr.id === item.product_id)
    const tipo = p?.tipo ?? 'otro'
    tipoAgg[tipo] = (tipoAgg[tipo] ?? 0) + (item.cantidad ?? 1)
  })

  return {
    ventasMes, ventasPrev, crecimiento, ticket,
    totalPedidos: allOrders.length,
    pedidosMes: ordersThisMonth.length,
    totalClientes: allClientes.length,
    topProductos,
    metodoAgg,
    mesesChart, maxVentas,
    tipoAgg,
    entregados: allOrders.filter(o => o.estado === 'entregado').length,
    cancelados:  allOrders.filter(o => o.estado === 'cancelado').length,
  }
}

export default async function ReportesPage() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const d = await getData()

  const METODO_LABEL: Record<string, string> = {
    azul: 'AZUL/Tarjeta', paypal: 'PayPal', bhd: 'BHD', contra_entrega: 'Contra entrega', otro: 'Otro'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-7xl mx-auto p-4 md:p-8">

          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">Reportes</h1>
            <p className="text-gray-400 text-sm mt-0.5">Análisis general del negocio</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Ventas este mes', value: `RD$${d.ventasMes.toLocaleString()}`, sub: `${d.crecimiento >= 0 ? '+' : ''}${d.crecimiento}% vs mes anterior`, color: 'bg-blue-500', icon: DollarSign, pos: d.crecimiento >= 0 },
              { label: 'Pedidos totales', value: d.totalPedidos, sub: `${d.pedidosMes} este mes`, color: 'bg-purple-500', icon: ShoppingBag },
              { label: 'Ticket promedio', value: `RD$${d.ticket.toLocaleString()}`, sub: 'por pedido', color: 'bg-green-500', icon: TrendingUp },
              { label: 'Clientes', value: d.totalClientes, sub: 'registrados', color: 'bg-amber-500', icon: Users },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-9 h-9 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
                  <k.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-black text-gray-900">{k.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
                <p className={`text-xs mt-0.5 font-medium ${(k as any).pos === false ? 'text-red-500' : (k as any).pos ? 'text-green-600' : 'text-gray-400'}`}>{k.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Gráfico 6 meses */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Ventas últimos 6 meses</h2>
              <div className="flex items-end gap-3 h-40">
                {d.mesesChart.map((m, i) => {
                  const pct = Math.max((m.ventas / d.maxVentas) * 100, 3)
                  const isLast = i === d.mesesChart.length - 1
                  return (
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-1 group">
                      <p className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        RD${m.ventas.toLocaleString()}
                      </p>
                      <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                        <div className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-blue-500' : 'bg-blue-200'}`}
                          style={{ height: `${pct}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${isLast ? 'text-blue-600' : 'text-gray-400'}`}>{m.label}</span>
                      <span className="text-[10px] text-gray-400">{m.pedidos}p</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Estado de pedidos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Estado de pedidos</h2>
              <div className="space-y-3">
                {[
                  { label: 'Entregados',  value: d.entregados,  pct: d.totalPedidos ? Math.round(d.entregados/d.totalPedidos*100) : 0,  color: 'bg-green-400' },
                  { label: 'Cancelados',  value: d.cancelados,  pct: d.totalPedidos ? Math.round(d.cancelados/d.totalPedidos*100) : 0,   color: 'bg-red-400' },
                  { label: 'Pendientes',  value: d.totalPedidos - d.entregados - d.cancelados,
                    pct: d.totalPedidos ? Math.round((d.totalPedidos - d.entregados - d.cancelados)/d.totalPedidos*100) : 0, color: 'bg-amber-400' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{s.label}</span>
                      <span className="font-bold text-gray-900">{s.value} <span className="text-gray-400 font-normal">({s.pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top productos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Top 10 productos más vendidos</h2>
              {d.topProductos.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Sin ventas registradas</p>
              ) : (
                <div className="space-y-2">
                  {d.topProductos.map((p, i) => (
                    <div key={p.nombre} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0
                        ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.nombre}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                          <div className="bg-blue-400 h-1 rounded-full"
                            style={{ width: `${Math.round((p.unidades / d.topProductos[0].unidades) * 100)}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700 shrink-0">{p.unidades}u</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Métodos de pago */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Métodos de pago</h2>
              <div className="space-y-3">
                {Object.entries(d.metodoAgg).sort((a, b) => b[1].count - a[1].count).map(([k, v]) => {
                  const total = Object.values(d.metodoAgg).reduce((s, m) => s + m.count, 0)
                  const pct   = total ? Math.round((v.count / total) * 100) : 0
                  return (
                    <div key={k}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{METODO_LABEL[k] ?? k}</span>
                        <span className="text-gray-500">{v.count} pedidos · <span className="font-bold text-gray-900">RD${v.total.toLocaleString()}</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
                {Object.keys(d.metodoAgg).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">Sin pedidos</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
