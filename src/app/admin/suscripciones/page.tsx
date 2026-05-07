'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import { RefreshCw, Search, CheckCircle, XCircle, Clock, Calendar, Package, Phone, Mail, MapPin, ChevronDown, X } from 'lucide-react'
import toast from 'react-hot-toast'

const FREQ_CFG: Record<string, { label: string; color: string; bg: string; dias: number }> = {
  '15_dias':    { label: 'Cada 15 días', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   dias: 15 },
  'mensual':    { label: 'Mensual',       color: 'text-primary-700',bg: 'bg-primary-50 border-primary-200', dias: 30 },
  'trimestral': { label: 'Trimestral',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200', dias: 90 },
}

function diasParaProximo(fecha: string) {
  const hoy = new Date()
  const prox = new Date(fecha)
  const diff = Math.ceil((prox.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function AdminSuscripciones() {
  const [subs, setSubs]         = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'todas'|'activas'|'inactivas'>('activas')
  const [selected, setSelected] = useState<any | null>(null)
  const sb = createClient()

  const load = useCallback(async () => {
    setRefreshing(true)
    const { data } = await sb.from('subscriptions').select('*').order('created_at', { ascending: false })
    setSubs(data ?? [])
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggleActiva = async (id: string, activa: boolean) => {
    const { error } = await sb.from('subscriptions').update({ activa: !activa }).eq('id', id)
    if (!error) {
      toast.success(!activa ? 'Suscripción reactivada' : 'Suscripción pausada')
      load()
      if (selected?.id === id) setSelected((s: any) => s ? { ...s, activa: !activa } : s)
    } else toast.error('Error al actualizar')
  }

  const renovarFecha = async (id: string, frecuencia: string) => {
    const dias = FREQ_CFG[frecuencia]?.dias ?? 30
    const nueva = new Date()
    nueva.setDate(nueva.getDate() + dias)
    const { error } = await sb.from('subscriptions')
      .update({ proximo_envio: nueva.toISOString().split('T')[0] })
      .eq('id', id)
    if (!error) {
      toast.success('Próximo envío actualizado')
      load()
      if (selected?.id === id) setSelected((s: any) => s ? { ...s, proximo_envio: nueva.toISOString().split('T')[0] } : s)
    }
  }

  const filtered = subs.filter(s => {
    const matchFilter = filter === 'todas' ? true : filter === 'activas' ? s.activa : !s.activa
    const matchSearch = !search ||
      (s.cliente_nombre ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.cliente_email ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total:    subs.length,
    activas:  subs.filter(s => s.activa).length,
    proximas: subs.filter(s => s.activa && diasParaProximo(s.proximo_envio) <= 3).length,
    ingresos: subs.filter(s => s.activa).reduce((acc, s) => {
      const items = Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? JSON.parse(s.items) : [])
      const total = items.reduce((t: number, i: any) => t + (i.precio ?? 0) * (i.cantidad ?? 1), 0)
      return acc + total
    }, 0),
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-16 pb-24 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suscripciones</h1>
              <p className="text-gray-500 text-sm">{stats.activas} activas de {stats.total} totales</p>
            </div>
            <button onClick={load} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total suscriptores', val: stats.total,    icon: '👥', color: 'text-gray-900' },
              { label: 'Activas',            val: stats.activas,  icon: '✅', color: 'text-green-600' },
              { label: 'Envío en ≤3 días',   val: stats.proximas, icon: '🚚', color: 'text-amber-600' },
              { label: 'Ingreso recurrente', val: `RD$${stats.ingresos.toLocaleString()}`, icon: '💰', color: 'text-primary-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filtros + búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex gap-2">
              {(['activas','todas','inactivas'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    filter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Cliente','Frecuencia','Productos','Descuento','Próximo envío','Estado','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">Cargando...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                      {subs.length === 0 ? 'Aún no hay suscripciones — aparecerán aquí cuando un cliente elija entrega recurrente' : 'Sin resultados'}
                    </td></tr>
                  ) : filtered.map(s => {
                    const cfg   = FREQ_CFG[s.frecuencia] ?? FREQ_CFG.mensual
                    const items = Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? JSON.parse(s.items || '[]') : [])
                    const dias  = diasParaProximo(s.proximo_envio)
                    const urgente = dias <= 3 && s.activa
                    return (
                      <tr key={s.id} onClick={() => setSelected(s)}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{s.cliente_nombre ?? '—'}</p>
                          <p className="text-xs text-gray-400">{s.cliente_email ?? ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-700">{items.length} producto(s)</p>
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">
                            {items.map((i: any) => i.nombre).join(', ')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-600 font-bold text-sm">{s.descuento_pct}% OFF</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-semibold ${urgente ? 'text-amber-600' : 'text-gray-700'}`}>
                            {urgente ? `⚠️ En ${dias} día(s)` : new Date(s.proximo_envio).toLocaleDateString('es-DO')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          {s.activa
                            ? <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle className="w-3.5 h-3.5" />Activa</span>
                            : <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><XCircle className="w-3.5 h-3.5" />Pausada</span>
                          }
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleActiva(s.id, s.activa)}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                s.activa ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}>
                              {s.activa ? 'Pausar' : 'Activar'}
                            </button>
                            {s.activa && (
                              <button onClick={() => renovarFecha(s.id, s.frecuencia)}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                Renovar
                              </button>
                            )}
                          </div>
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

      {/* Panel detalle */}
      {selected && (() => {
        const cfg   = FREQ_CFG[selected.frecuencia] ?? FREQ_CFG.mensual
        const items = Array.isArray(selected.items) ? selected.items : (typeof selected.items === 'string' ? JSON.parse(selected.items || '[]') : [])
        const dias  = diasParaProximo(selected.proximo_envio)
        return (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="font-bold text-gray-900 text-lg">Detalle Suscripción</h3>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-5">
                {/* Estado + frecuencia */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                    selected.activa ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}>
                    {selected.activa ? '✅ Activa' : '⏸ Pausada'}
                  </span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                    {selected.descuento_pct}% OFF
                  </span>
                </div>

                {/* Cliente */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50">
                  <p className="text-xl font-black text-gray-900">{selected.cliente_nombre ?? '—'}</p>
                  {selected.cliente_email && (
                    <div className="flex items-center gap-2 mt-2"><Mail className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-500">{selected.cliente_email}</p></div>
                  )}
                  {selected.cliente_telefono && (
                    <div className="flex items-center gap-2 mt-1"><Phone className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-500">{selected.cliente_telefono}</p></div>
                  )}
                  {selected.direccion_texto && (
                    <div className="flex items-center gap-2 mt-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-500">{selected.direccion_texto}</p></div>
                  )}
                </div>

                {/* Próximo envío */}
                <div className={`rounded-2xl p-4 border ${dias <= 3 && selected.activa ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className={`w-4 h-4 ${dias <= 3 && selected.activa ? 'text-amber-500' : 'text-gray-400'}`} />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Próximo envío</p>
                  </div>
                  <p className={`text-lg font-black ${dias <= 3 && selected.activa ? 'text-amber-600' : 'text-gray-900'}`}>
                    {new Date(selected.proximo_envio).toLocaleDateString('es-DO', { dateStyle: 'full' })}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {dias > 0 ? `En ${dias} días` : dias === 0 ? '¡Hoy!' : `Vencido hace ${Math.abs(dias)} días`}
                  </p>
                </div>

                {/* Productos */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productos</p>
                  </div>
                  <div className="space-y-2">
                    {items.map((item: any, i: number) => {
                      const specs = []
                      if (item.ojo)       specs.push(`Ojo: ${item.ojo}`)
                      if (item.sph)       specs.push(`SPH: ${item.sph > 0 ? '+' : ''}${item.sph}`)
                      if (item.cyl)       specs.push(`CYL: ${item.cyl}`)
                      if (item.axis)      specs.push(`AXIS: ${String(item.axis).padStart(3,'0')}°`)
                      if (item.add_power) specs.push(`ADD: ${item.add_power}`)
                      if (item.color)     specs.push(`Color: ${item.color}`)
                      if (item.size)      specs.push(`Tamaño: ${item.size}`)
                      return (
                        <div key={i} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                            <p className="font-bold text-gray-900 text-sm whitespace-nowrap">
                              RD${((item.precio ?? 0) * (item.cantidad ?? 1)).toLocaleString()}
                            </p>
                          </div>
                          {specs.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {specs.map(sp => (
                                <span key={sp} className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-xs font-medium text-gray-600">
                                  {sp}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-400 mt-1">Cantidad: {item.cantidad ?? 1}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Fechas */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Creada: {new Date(selected.created_at).toLocaleDateString('es-DO', { dateStyle: 'long' })}</p>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => toggleActiva(selected.id, selected.activa)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-colors ${
                      selected.activa
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}>
                    {selected.activa ? '⏸ Pausar' : '▶ Activar'}
                  </button>
                  {selected.activa && (
                    <button onClick={() => renovarFecha(selected.id, selected.frecuencia)}
                      className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                      🔄 Renovar envío
                    </button>
                  )}
                  {selected.cliente_telefono && (
                    <a href={`https://wa.me/${selected.cliente_telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(selected.cliente_nombre??'')}%2C%20tu%20pr%C3%B3ximo%20env%C3%ADo%20de%20ContactGo%20est%C3%A1%20programado%20para%20el%20${encodeURIComponent(new Date(selected.proximo_envio).toLocaleDateString('es-DO'))}`}
                      target="_blank"
                      className="col-span-2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                      💬 Avisar por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
