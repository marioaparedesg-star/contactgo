'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, Calendar, ChevronDown } from 'lucide-react'

const PERIODOS = [
  { value: 'hoy',       label: 'Hoy' },
  { value: 'semana',    label: 'Esta semana' },
  { value: 'mes',       label: 'Este mes' },
  { value: 'mes_ant',   label: 'Mes anterior' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'año',       label: 'Este año' },
  { value: 'todo',      label: 'Todo el tiempo' },
  { value: 'custom',    label: 'Personalizado' },
]

function getRango(periodo: string, desde?: string, hasta?: string): { start: string; end: string } {
  const now = new Date()
  const pad = (d: Date) => d.toISOString()
  switch (periodo) {
    case 'hoy':
      return { start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(), end: pad(now) }
    case 'semana': {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      return { start: new Date(now.getFullYear(), now.getMonth(), diff).toISOString(), end: pad(now) }
    }
    case 'mes':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), end: pad(now) }
    case 'mes_ant':
      return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(), end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString() }
    case 'trimestre':
      return { start: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(), end: pad(now) }
    case 'año':
      return { start: new Date(now.getFullYear(), 0, 1).toISOString(), end: pad(now) }
    case 'todo':
      return { start: '2020-01-01T00:00:00Z', end: pad(now) }
    case 'custom':
      return { start: desde ? new Date(desde).toISOString() : new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), end: hasta ? new Date(hasta + 'T23:59:59').toISOString() : pad(now) }
    default:
      return { start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), end: pad(now) }
  }
}

const METODO_LABEL: Record<string, string> = { azul: 'Tarjeta AZUL', paypal: 'PayPal', contra_entrega: 'Contra Entrega', bhd: 'Transferencia BHD' }
const ESTADO_COLOR: Record<string, string> = { entregado: 'bg-green-100 text-green-700', enviado: 'bg-blue-100 text-blue-700', preparando: 'bg-yellow-100 text-yellow-700', confirmado: 'bg-purple-100 text-purple-700', pendiente: 'bg-gray-100 text-gray-600', cancelado: 'bg-red-100 text-red-700' }

export default function ReportesPage() {
  const sb = createClient()
  const [periodo, setPeriodo] = useState('mes')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [showPeriodo, setShowPeriodo] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { start, end } = getRango(periodo, desde, hasta)

    const [{ data: orders }, { data: items }, { data: clientes }] = await Promise.all([
      sb.from('orders').select('id,total,estado,fecha,metodo_pago,cliente_email').gte('fecha', start).lte('fecha', end).order('fecha', { ascending: false }),
      sb.from('order_items').select('nombre,cantidad,precio,product_id,order_id'),
      sb.from('profiles').select('id,created_at').eq('role', 'customer'),
    ])

    const ords = orders ?? []
    const its  = items  ?? []
    
    const orderIds = new Set(ords.map((o: any) => o.id))
    const itsFiltered = its.filter((i: any) => orderIds.has(i.order_id))

    const ventas = ords.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0)
    const ticket = ords.length ? Math.round(ventas / ords.length) : 0

    // Top productos
    const prodAgg: Record<string, { nombre: string; unidades: number; revenue: number }> = {}
    itsFiltered.forEach((i: any) => {
      if (!prodAgg[i.nombre]) prodAgg[i.nombre] = { nombre: i.nombre, unidades: 0, revenue: 0 }
      prodAgg[i.nombre].unidades += i.cantidad ?? 1
      prodAgg[i.nombre].revenue  += Number(i.precio ?? 0) * (i.cantidad ?? 1)
    })
    const topProductos = Object.values(prodAgg).sort((a, b) => b.unidades - a.unidades).slice(0, 8)

    // Por método de pago
    const metodoAgg: Record<string, { count: number; total: number }> = {}
    ords.forEach((o: any) => {
      const k = o.metodo_pago ?? 'otro'
      if (!metodoAgg[k]) metodoAgg[k] = { count: 0, total: 0 }
      metodoAgg[k].count++
      metodoAgg[k].total += Number(o.total ?? 0)
    })

    // Por estado
    const estadoAgg: Record<string, number> = {}
    ords.forEach((o: any) => {
      estadoAgg[o.estado ?? 'sin_estado'] = (estadoAgg[o.estado ?? 'sin_estado'] ?? 0) + 1
    })

    // Ventas por día (últimos 30 días del rango)
    const porDia: Record<string, number> = {}
    ords.forEach((o: any) => {
      const dia = o.fecha?.slice(0, 10)
      if (dia) porDia[dia] = (porDia[dia] ?? 0) + Number(o.total ?? 0)
    })

    setData({ ventas, ticket, ords, clientes: clientes ?? [], topProductos, metodoAgg, estadoAgg, porDia })
    setLoading(false)
  }, [periodo, desde, hasta])

  useEffect(() => { cargar() }, [cargar])

  const periodoLabel = PERIODOS.find(p => p.value === periodo)?.label ?? 'Período'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-6xl mx-auto p-4 md:p-8">

          {/* Header + filtro */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Reportes</h1>
              <p className="text-gray-400 text-sm mt-0.5">{data ? `${data.ords.length} pedidos en el período` : 'Cargando...'}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Selector período */}
              <div className="relative">
                <button onClick={() => setShowPeriodo(!showPeriodo)}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-gray-300 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {periodoLabel}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {showPeriodo && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 py-1 min-w-[180px]">
                    {PERIODOS.map(p => (
                      <button key={p.value} onClick={() => { setPeriodo(p.value); setShowPeriodo(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${periodo === p.value ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Fechas custom */}
              {periodo === 'custom' && (
                <div className="flex items-center gap-2">
                  <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="text-gray-400 text-sm">—</span>
                  <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : !data ? null : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Ventas totales', value: `RD$${data.ventas.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Pedidos',         value: data.ords.length,                    icon: ShoppingBag,  color: 'text-blue-600',  bg: 'bg-blue-50' },
                  { label: 'Ticket promedio', value: `RD$${data.ticket.toLocaleString()}`, icon: TrendingUp,   color: 'text-purple-600',bg: 'bg-purple-50' },
                  { label: 'Clientes',         value: data.clientes.length,               icon: Users,        color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(k => (
                  <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className={`w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <k.icon className={`w-5 h-5 ${k.color}`} />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{k.value}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                {/* Top productos */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-4">🏆 Top productos</p>
                  {data.topProductos.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">Sin datos en el período</p>
                  ) : (
                    <div className="space-y-2">
                      {data.topProductos.map((p: any, i: number) => (
                        <div key={p.nombre} className="flex items-center gap-3">
                          <span className="text-xs font-black text-gray-400 w-4">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{p.nombre}</p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                              <div className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${Math.round((p.unidades / data.topProductos[0].unidades) * 100)}%` }} />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-gray-700">{p.unidades} uds</p>
                            <p className="text-xs text-gray-400">RD${p.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Por estado */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-4">📊 Por estado</p>
                  <div className="space-y-2">
                    {Object.entries(data.estadoAgg).sort(([,a],[,b]) => (b as number)-(a as number)).map(([estado, count]) => (
                      <div key={estado} className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_COLOR[estado] ?? 'bg-gray-100 text-gray-600'}`}>{estado}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-blue-400 h-1.5 rounded-full"
                              style={{ width: `${Math.round(((count as number) / data.ords.length) * 100)}%` }} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 w-6 text-right">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Por método de pago */}
                  <p className="font-bold text-gray-900 mt-6 mb-3">💳 Por método de pago</p>
                  <div className="space-y-2">
                    {Object.entries(data.metodoAgg).sort(([,a],[,b]) => (b as any).total-(a as any).total).map(([metodo, val]: any) => (
                      <div key={metodo} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{METODO_LABEL[metodo] ?? metodo}</span>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">RD${val.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{val.count} pedidos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pedidos recientes del período */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900">Pedidos del período</p>
                  <span className="text-xs text-gray-400">{data.ords.length} pedidos</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Pedido', 'Cliente', 'Total', 'Estado', 'Método', 'Fecha'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.ords.slice(0, 50).map((o: any) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">#{o.id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{o.cliente_email}</td>
                          <td className="px-4 py-3 font-bold text-gray-900">RD${Number(o.total).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${ESTADO_COLOR[o.estado] ?? 'bg-gray-100 text-gray-600'}`}>{o.estado}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{METODO_LABEL[o.metodo_pago] ?? o.metodo_pago}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.fecha).toLocaleDateString('es-DO',{day:'numeric',month:'short'})}</td>
                        </tr>
                      ))}
                      {data.ords.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Sin pedidos en este período</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
