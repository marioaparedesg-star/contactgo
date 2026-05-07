import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { ShoppingBag, Clock, DollarSign, Users, AlertTriangle, TrendingUp, Package, Repeat, ArrowRight, CheckCircle, Truck } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

async function getData() {
  const sb = createServerSupabaseClient()
  const now = new Date()
  const hoy = now.toISOString().split('T')[0]
  const mesStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const semanaStart = new Date(Date.now() - 7*24*60*60*1000).toISOString()

  const [
    { data: allOrders },
    { data: items },
    { count: pendientes },
    { count: clientes },
    { data: stockBajo },
    { data: sinStock },
    { data: subs },
    { data: recentOrders },
  ] = await Promise.all([
    sb.from('orders').select('total,fecha,estado').order('fecha', { ascending: false }),
    sb.from('order_items').select('nombre,cantidad,subtotal,precio'),
    sb.from('orders').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('products').select('nombre,stock,marca').eq('activo', true).lte('stock', 3).gt('stock', 0).order('stock'),
    sb.from('products').select('nombre,marca').eq('activo', true).eq('stock', 0),
    sb.from('subscriptions').select('activa').eq('activa', true),
    sb.from('orders').select('id,cliente_nombre,total,estado,fecha,metodo_pago').order('fecha', { ascending: false }).limit(7),
  ])

  const orders = allOrders ?? []

  // KPIs
  const ventasHoy     = orders.filter(o => o.fecha?.startsWith(hoy)).reduce((s, o) => s + (o.total ?? 0), 0)
  const ventasSemana  = orders.filter(o => o.fecha >= semanaStart).reduce((s, o) => s + (o.total ?? 0), 0)
  const ventasMes     = orders.filter(o => o.fecha >= mesStart).reduce((s, o) => s + (o.total ?? 0), 0)
  const pedidosMes    = orders.filter(o => o.fecha >= mesStart).length
  const ticket        = orders.length ? Math.round(orders.reduce((s,o) => s+(o.total??0),0) / orders.length) : 0
  const entregados    = orders.filter(o => o.estado === 'entregado').length
  const conversion    = orders.length ? Math.round((entregados / orders.length) * 100) : 0

  // Gráfica 7 días
  const chart: { dia: string; ventas: number; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i*24*60*60*1000)
    const key = d.toISOString().split('T')[0]
    const ventas = orders.filter(o => o.fecha?.startsWith(key)).reduce((s,o) => s+(o.total??0),0)
    chart.push({ dia: key, ventas, label: DIAS[d.getDay()] })
  }
  const maxVentas = Math.max(...chart.map(c => c.ventas), 1)

  // Top productos
  const agg: Record<string, { nombre: string; unidades: number; revenue: number }> = {}
  ;(items ?? []).forEach((i: any) => {
    if (!agg[i.nombre]) agg[i.nombre] = { nombre: i.nombre, unidades: 0, revenue: 0 }
    agg[i.nombre].unidades += i.cantidad ?? 1
    agg[i.nombre].revenue += i.subtotal ?? (i.precio * i.cantidad) ?? 0
  })
  const topProducts = Object.values(agg).sort((a,b) => b.revenue - a.revenue).slice(0, 5)

  return {
    ventasHoy, ventasSemana, ventasMes, pedidosMes, ticket, conversion,
    pendientes: pendientes ?? 0,
    clientes: clientes ?? 0,
    suscripciones: subs?.length ?? 0,
    stockBajo: stockBajo ?? [],
    sinStock: sinStock ?? [],
    chart, maxVentas,
    topProducts,
    recentOrders: recentOrders ?? [],
    totalPedidos: orders.length,
  }
}

const ESTADO_CFG: Record<string, { cls: string; label: string }> = {
  pendiente:  { cls: 'bg-amber-100 text-amber-700',   label: 'Pendiente'  },
  confirmado: { cls: 'bg-blue-100 text-blue-700',     label: 'Confirmado' },
  preparando: { cls: 'bg-purple-100 text-purple-700', label: 'Preparando' },
  enviado:    { cls: 'bg-indigo-100 text-indigo-700', label: 'Enviado'    },
  entregado:  { cls: 'bg-green-100 text-green-700',   label: 'Entregado'  },
  cancelado:  { cls: 'bg-red-100 text-red-700',       label: 'Cancelado'  },
}

export default async function AdminDashboard() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const d = await getData()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-16 pb-24 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {new Date().toLocaleDateString('es-DO', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
            <Link href="/admin/pedidos"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              Ver pedidos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Alerta pendientes */}
          {d.pendientes > 0 && (
            <Link href="/admin/pedidos" className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm font-semibold text-amber-700">
                <span className="font-black">{d.pendientes}</span> pedido{d.pendientes > 1 ? 's' : ''} pendiente{d.pendientes > 1 ? 's' : ''} de confirmar
              </p>
              <ArrowRight className="w-4 h-4 text-amber-500 ml-auto" />
            </Link>
          )}

          {/* Alerta stock */}
          {(d.sinStock.length > 0 || d.stockBajo.length > 0) && (
            <Link href="/admin/inventario" className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6 hover:bg-red-100 transition-colors">
              <Package className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  {d.sinStock.length > 0 && <span><span className="font-black">{d.sinStock.length}</span> sin stock · </span>}
                  {d.stockBajo.length > 0 && <span><span className="font-black">{d.stockBajo.length}</span> con stock crítico (≤3)</span>}
                </p>
                {d.stockBajo.length > 0 && (
                  <p className="text-xs text-red-500 mt-0.5">{d.stockBajo.slice(0,3).map((p:any) => `${p.nombre} (${p.stock})`).join(' · ')}</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-red-400" />
            </Link>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Ventas hoy',      value: `RD$${d.ventasHoy.toLocaleString()}`,    icon: TrendingUp,  color: 'bg-primary-500', sub: `${d.recentOrders.filter((o:any) => o.fecha?.startsWith(new Date().toISOString().split('T')[0])).length} pedido(s)` },
              { label: 'Ventas del mes',  value: `RD$${d.ventasMes.toLocaleString()}`,    icon: DollarSign,  color: 'bg-blue-500',    sub: `${d.pedidosMes} pedidos` },
              { label: 'Ticket promedio', value: `RD$${d.ticket.toLocaleString()}`,        icon: ShoppingBag, color: 'bg-purple-500',  sub: `${d.totalPedidos} pedidos totales` },
              { label: 'Suscripciones',   value: d.suscripciones,                          icon: Repeat,      color: 'bg-green-500',   sub: 'activas', href: '/admin/suscripciones' },
            ].map(k => (
              <Link key={k.label} href={(k as any).href ?? '/admin/pedidos'}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
                  <k.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-black text-gray-900">{k.value}</p>
                <p className="text-sm font-semibold text-gray-500 mt-0.5">{k.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Link>
            ))}
          </div>

          {/* Stats secundarios */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Clientes',    value: d.clientes,    icon: Users,        color: 'text-purple-600 bg-purple-50' },
              { label: 'Entregados',  value: d.entregados ?? entregados,   icon: CheckCircle,  color: 'text-green-600 bg-green-50' },
              { label: 'Conversión',  value: `${d.conversion}%`, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Gráfica ventas 7 días */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-gray-900">Ventas últimos 7 días</p>
                <p className="text-xs text-gray-400">RD$</p>
              </div>
              <p className="text-3xl font-black text-primary-600 mb-4">RD${d.ventasSemana.toLocaleString()}</p>
              <div className="flex items-end gap-2 h-28">
                {d.chart.map((c, i) => {
                  const pct = Math.max((c.ventas / d.maxVentas) * 100, 3)
                  const isToday = i === 6
                  return (
                    <div key={c.dia} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {c.ventas > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          RD${c.ventas.toLocaleString()}
                        </div>
                      )}
                      <div className="w-full flex flex-col justify-end" style={{ height: '90px' }}>
                        <div
                          className={`w-full rounded-t-lg transition-all ${isToday ? 'bg-primary-500' : 'bg-primary-200 hover:bg-primary-300'}`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-primary-600' : 'text-gray-400'}`}>{c.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top productos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900">Productos top</p>
              </div>
              {d.topProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Sin ventas registradas</p>
              ) : (
                <div className="space-y-3">
                  {d.topProducts.map((p, i) => {
                    const pct = Math.round((p.revenue / d.topProducts[0].revenue) * 100)
                    return (
                      <div key={p.nombre}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                              {i+1}
                            </span>
                            <p className="text-xs font-semibold text-gray-900 truncate">{p.nombre}</p>
                          </div>
                          <p className="text-xs font-bold text-gray-500 shrink-0 ml-1">{p.unidades}u</p>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-primary-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pedidos recientes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
              <Link href="/admin/pedidos" className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['#','Cliente','Total','Método','Estado','Fecha'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {d.recentOrders.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400">Sin pedidos aún</td></tr>
                  ) : d.recentOrders.map((o: any) => {
                    const cfg = ESTADO_CFG[o.estado] ?? ESTADO_CFG.pendiente
                    return (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-gray-400">#{o.id.slice(0,6).toUpperCase()}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{o.cliente_nombre ?? '—'}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">RD${(o.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs capitalize">{(o.metodo_pago ?? '—').replace('_',' ')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.cls}`}>{cfg.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(o.fecha).toLocaleDateString('es-DO', { day:'numeric', month:'short' })}
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
