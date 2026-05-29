'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AlertTriangle, Package, ArrowDown } from 'lucide-react'

type Alerta = {
  id: string; nombre: string; tipo: string; marca: string
  stock: number; stock_minimo: number; stock_critico: number; stock_reorden: number
  stock_disponible: number; alerta_stock: string
}

const PRIORIDAD: Record<string, { label: string; color: string; bg: string; orden: number }> = {
  agotado:     { label: 'AGOTADO',     color: '#dc2626', bg: '#fef2f2', orden: 0 },
  critico:     { label: 'CRÍTICO',     color: '#ea580c', bg: '#fff7ed', orden: 1 },
  bajo_minimo: { label: 'BAJO MÍNIMO', color: '#d97706', bg: '#fffbeb', orden: 2 },
  reorden:     { label: 'REORDENAR',   color: '#2563eb', bg: '#eff6ff', orden: 3 },
}

const TIPO_LABELS: Record<string,string> = {
  esferico:'Esférico', torico:'Tórico', multifocal:'Multifocal',
  color:'Color', solucion:'Solución', gota:'Gota',
}

export default function ReabastecimientoPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [filtro,  setFiltro]  = useState<string>('todos')
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({ agotados:0, criticos:0, bajo_minimo:0, reorden:0 })
  const sb = createClient()

  useEffect(() => {
    sb.from('v_stock_disponible')
      .select('*')
      .neq('alerta_stock', 'ok')
      .order('alerta_stock')
      .order('stock')
      .then(({ data }) => {
        const d = (data ?? []) as Alerta[]
        setAlertas(d)
        setKpis({
          agotados:    d.filter(a => a.alerta_stock === 'agotado').length,
          criticos:    d.filter(a => a.alerta_stock === 'critico').length,
          bajo_minimo: d.filter(a => a.alerta_stock === 'bajo_minimo').length,
          reorden:     d.filter(a => a.alerta_stock === 'reorden').length,
        })
        setLoading(false)
      })
  }, [])

  const filtradas = filtro === 'todos' ? alertas : alertas.filter(a => a.alerta_stock === filtro)
  const sorted    = [...filtradas].sort((a,b) => PRIORIDAD[a.alerta_stock]?.orden - PRIORIDAD[b.alerta_stock]?.orden)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Reabastecimiento</h1>
            <p className="text-xs text-gray-500">Productos que requieren atención</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { key:'agotados',    label:'Agotados',    icon:'🔴', color:'text-red-700',    bg:'bg-red-50',    val:kpis.agotados },
            { key:'criticos',    label:'Críticos',    icon:'🟠', color:'text-orange-700', bg:'bg-orange-50', val:kpis.criticos },
            { key:'bajo_minimo', label:'Bajo mínimo', icon:'🟡', color:'text-amber-700',  bg:'bg-amber-50',  val:kpis.bajo_minimo },
            { key:'reorden',     label:'Reordenar',   icon:'🔵', color:'text-blue-700',   bg:'bg-blue-50',   val:kpis.reorden },
          ].map(k => (
            <button key={k.key} onClick={() => setFiltro(filtro === k.key ? 'todos' : k.key)}
              className={`${k.bg} rounded-2xl p-4 text-left border-2 transition-all ${filtro === k.key ? 'border-current shadow-md scale-[1.02]' : 'border-transparent'}`}>
              <p className="text-2xl font-black">{k.val}</p>
              <p className={`text-xs font-bold mt-1 ${k.color}`}>{k.icon} {k.label}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold">No hay alertas activas</p>
            <p className="text-sm mt-1">Todos los productos están sobre su mínimo.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Prioridad','Producto','Categoría','Stock','Mínimo','Crítico','Reordenar','Faltan'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((a, idx) => {
                    const p = PRIORIDAD[a.alerta_stock] ?? { label: a.alerta_stock, color:'#6b7280', bg:'#f9fafb', orden:5 }
                    const diferencia = a.stock_minimo - a.stock
                    return (
                      <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-3">
                          <span className="inline-block text-[10px] font-black px-2 py-1 rounded-full"
                            style={{ background: p.bg, color: p.color }}>{p.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 text-sm">{a.nombre}</p>
                          <p className="text-[10px] text-gray-400">{a.marca}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-600">{TIPO_LABELS[a.tipo] ?? a.tipo}</td>
                        <td className="px-4 py-3">
                          <span className={`text-lg font-black ${a.stock === 0 ? 'text-red-600' : a.stock <= a.stock_critico ? 'text-orange-600' : 'text-amber-600'}`}>
                            {a.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{a.stock_minimo}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{a.stock_critico}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{a.stock_reorden}</td>
                        <td className="px-4 py-3">
                          {diferencia > 0 && (
                            <span className="flex items-center gap-1 text-red-600 text-sm font-bold">
                              <ArrowDown className="w-3.5 h-3.5" /> {diferencia}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 px-4 py-3 border-t border-gray-100">
              {sorted.length} producto{sorted.length !== 1 ? 's' : ''} con alertas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
