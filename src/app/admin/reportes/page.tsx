'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, Clock, Star, RefreshCw } from 'lucide-react'

const sb = createClient()

type KPIs = {
  orders_30d: number
  orders_7d: number
  total_customers: number
  avg_order_value: number
  revenue_30d: number
  delivered_total: number
  cancelled_total: number
}

type TopProducto = { nombre: string; marca: string; total_vendido: number; revenue: number }
type UltimosPedidos = { id: string; cliente_nombre: string; total: number; estado: string; created_at: string }

export default function ReportesPage() {
  const [kpis, setKpis]           = useState<KPIs | null>(null)
  const [topProductos, setTopProductos] = useState<TopProducto[]>([])
  const [ultimosPedidos, setUltimos]    = useState<UltimosPedidos[]>([])
  const [loading, setLoading]     = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const cargar = async () => {
    setLoading(true)
    const [kpiRes, pedidosRes, topRes] = await Promise.all([
      sb.from('admin_kpis').select('*').single(),
      sb.from('orders').select('id, cliente_nombre, total, estado, created_at').order('created_at', { ascending: false }).limit(10),
      sb.from('order_items').select('product_id, cantidad, subtotal, products(nombre, marca)').order('created_at', { ascending: false }).limit(50),
    ])
    if (kpiRes.data) setKpis(kpiRes.data as KPIs)
    if (pedidosRes.data) setUltimos(pedidosRes.data as UltimosPedidos[])
    setLastUpdate(new Date())
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const fmt = (n: number) => `RD$${Math.round(n).toLocaleString('es-DO')}`

  const ESTADO_BADGE: Record<string, string> = {
    pendiente:  'bg-amber-100 text-amber-700',
    procesando: 'bg-blue-100 text-blue-700',
    enviado:    'bg-purple-100 text-purple-700',
    entregado:  'bg-green-100 text-green-700',
    cancelado:  'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reportes y KPIs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Actualizado: {lastUpdate.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button onClick={cargar} disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: ShoppingBag, label: 'Pedidos (30d)', value: kpis?.orders_30d ?? '—', sub: `${kpis?.orders_7d ?? 0} esta semana`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: DollarSign, label: 'Revenue (30d)', value: kpis ? fmt(kpis.revenue_30d) : '—', sub: `AOV ${kpis ? fmt(kpis.avg_order_value) : '—'}`, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Users, label: 'Clientes totales', value: kpis?.total_customers ?? '—', sub: 'Registrados', color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: Package, label: 'Entregados', value: kpis?.delivered_total ?? '—', sub: `${kpis?.cancelled_total ?? 0} cancelados`, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-8 h-8 ${k.bg} rounded-xl flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm">Últimos 10 pedidos</h2>
          <a href="/admin/pedidos" className="text-xs text-primary-600 font-semibold hover:underline">Ver todos →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
          ) : ultimosPedidos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Sin pedidos aún</div>
          ) : ultimosPedidos.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.cliente_nombre || 'Cliente'}</p>
                <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${ESTADO_BADGE[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                {p.estado}
              </span>
              <p className="text-sm font-bold text-gray-900 shrink-0">{fmt(p.total)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Google Analytics', href: 'https://analytics.google.com', icon: TrendingUp },
          { label: 'Search Console', href: 'https://search.google.com/search-console', icon: Star },
          { label: 'Vercel Logs', href: 'https://vercel.com', icon: Clock },
          { label: 'Supabase DB', href: 'https://supabase.com/dashboard', icon: Package },
        ].map(a => (
          <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-sm">
            <a.icon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-700">{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
