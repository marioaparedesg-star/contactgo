'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { X, MessageCircle, Pause, Play, XCircle, ChevronDown, ChevronUp, Repeat, Calendar, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const FRECUENCIA_LABEL: Record<string, string> = {
  '15_dias': 'Cada 15 días',
  mensual: 'Mensual',
  bimestral: 'Bimestral',
  trimestral: 'Trimestral',
}

const DESCUENTO_COLOR: Record<string, string> = {
  '15_dias': 'bg-blue-100 text-blue-700',
  mensual: 'bg-purple-100 text-purple-700',
  bimestral: 'bg-indigo-100 text-indigo-700',
  trimestral: 'bg-green-100 text-green-700',
}

function parseItems(raw: any): any[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

export default function SuscripcionesPage() {
  const sb = createClient()
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')
  const [expandida, setExpandida] = useState<string | null>(null)

  useEffect(() => {
    sb.from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Error cargando suscripciones:', error)
        setSubs(data ?? [])
        setLoading(false)
      })
  }, [])

  const actualizarEstado = async (id: string, activa: boolean) => {
    const { error } = await sb.from('subscriptions')
      .update({ activa, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) { toast.error('Error: ' + error.message); return }
    setSubs(ss => ss.map(s => s.id === id ? { ...s, activa } : s))
    toast.success(activa ? 'Suscripción activada' : 'Suscripción pausada')
  }

  const cancelar = async (id: string) => {
    if (!confirm('¿Cancelar esta suscripción? Esta acción no se puede deshacer.')) return
    const { error } = await sb.from('subscriptions')
      .update({ activa: false, cancelada: true, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) { toast.error('Error: ' + error.message); return }
    setSubs(ss => ss.filter(s => s.id !== id))
    toast.success('Suscripción cancelada')
  }

  const filtradas = subs.filter(s => {
    if (filtro === 'activas') return s.activa && !s.cancelada
    if (filtro === 'pausadas') return !s.activa && !s.cancelada
    return true
  })

  const activas   = subs.filter(s => s.activa && !s.cancelada).length
  const pausadas  = subs.filter(s => !s.activa && !s.cancelada).length
  const proximas7 = subs.filter(s => {
    if (!s.proximo_envio || !s.activa) return false
    const diff = new Date(s.proximo_envio).getTime() - Date.now()
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-6xl mx-auto p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Suscripciones</h1>
              <p className="text-gray-400 text-sm mt-0.5">{subs.length} registradas en total</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Activas',         value: activas,           color: 'bg-green-500',  key: 'activas' },
              { label: 'Pausadas',        value: pausadas,          color: 'bg-amber-500',  key: 'pausadas' },
              { label: 'Total',           value: subs.length,       color: 'bg-blue-500',   key: 'todas' },
              { label: 'Próx. 7 días',    value: proximas7,         color: 'bg-purple-500', key: 'proximas' },
            ].map(k => (
              <button key={k.key}
                onClick={() => setFiltro(filtro === k.key ? 'todas' : k.key)}
                className={`bg-white rounded-2xl border p-5 text-left shadow-sm hover:shadow-md transition-all ${filtro === k.key ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                <div className={`w-2 h-2 rounded-full ${k.color} mb-2`} />
                <p className="text-2xl font-black text-gray-900">{k.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
              </button>
            ))}
          </div>

          {/* Alert próximas renovaciones */}
          {proximas7 > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
              <p className="text-sm font-semibold text-purple-700">
                <span className="font-black">{proximas7}</span> suscripción{proximas7 > 1 ? 'es' : ''} con envío en los próximos 7 días
              </p>
            </div>
          )}

          {/* Lista */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtradas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Repeat className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-lg">No hay suscripciones</p>
              <p className="text-sm mt-1">Cuando un cliente se suscriba desde la tienda, aparecerá aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtradas.map(s => {
                const items = parseItems(s.items)
                const isExp = expandida === s.id
                const proxDias = s.proximo_envio
                  ? Math.ceil((new Date(s.proximo_envio).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null

                return (
                  <div key={s.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Cliente + badges */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-blue-700 font-black text-xs">{(s.cliente_nombre ?? '?')[0].toUpperCase()}</span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm">{s.cliente_nombre}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {s.activa ? 'Activa' : 'Pausada'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${DESCUENTO_COLOR[s.frecuencia] ?? 'bg-gray-100 text-gray-600'}`}>
                              {FRECUENCIA_LABEL[s.frecuencia] ?? s.frecuencia}
                            </span>
                            {s.descuento_pct > 0 && (
                              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">
                                -{s.descuento_pct}%
                              </span>
                            )}
                          </div>

                          {/* Productos resumidos */}
                          <div className="ml-9">
                            {items.slice(0, 2).map((item: any, i: number) => (
                              <p key={i} className="text-sm text-gray-700 font-medium">
                                {item.nombre}
                                {item.sph != null && <span className="text-xs text-blue-600 font-mono ml-1">
                                  SPH:{item.sph > 0 ? '+' : ''}{item.sph}
                                  {item.cyl != null ? ` CYL:${item.cyl}` : ''}
                                  {item.color ? ` ${item.color}` : ''}
                                  {item.ojo ? ` · ${item.ojo}` : ''}
                                </span>}
                                <span className="text-xs text-gray-400 ml-1">x{item.cantidad}</span>
                              </p>
                            ))}
                            {items.length > 2 && (
                              <p className="text-xs text-gray-400">+{items.length - 2} más</p>
                            )}
                          </div>

                          {/* Info rápida */}
                          <div className="flex flex-wrap gap-3 mt-2 ml-9 text-xs text-gray-400">
                            {s.cliente_telefono && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.cliente_telefono}</span>}
                            {s.proximo_envio && (
                              <span className={`flex items-center gap-1 font-medium ${proxDias != null && proxDias <= 3 ? 'text-red-500' : proxDias != null && proxDias <= 7 ? 'text-amber-600' : ''}`}>
                                <Calendar className="w-3 h-3" />
                                Próximo envío: {new Date(s.proximo_envio).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                                {proxDias != null && proxDias >= 0 && <span> ({proxDias}d)</span>}
                              </span>
                            )}
                            {s.direccion_texto && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.direccion_texto.slice(0, 30)}{s.direccion_texto.length > 30 ? '...' : ''}</span>}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {s.cliente_telefono && (
                            <a href={`https://wa.me/${s.cliente_telefono.replace(/\D/g, '')}?text=Hola ${s.cliente_nombre}, te contactamos de ContactGo sobre tu suscripción.`}
                              target="_blank" rel="noopener noreferrer"
                              className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {s.activa ? (
                            <button onClick={() => actualizarEstado(s.id, false)}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors" title="Pausar">
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={() => actualizarEstado(s.id, true)}
                              className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors" title="Activar">
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => cancelar(s.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors" title="Cancelar">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => setExpandida(isExp ? null : s.id)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-colors">
                            {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Detalle expandido */}
                    {isExp && (
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Detalle de productos</p>
                        <div className="space-y-2">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                                {item.sph != null && (
                                  <p className="text-xs font-mono text-blue-600 mt-0.5">
                                    SPH: {item.sph > 0 ? '+' : ''}{item.sph}
                                    {item.cyl != null ? ` · CYL: ${item.cyl}` : ''}
                                    {item.axis != null ? ` · EJE: ${String(item.axis).padStart(3, '0')}` : ''}
                                    {item.add_power ? ` · ADD: ${item.add_power}` : ''}
                                    {item.color ? ` · ${item.color}` : ''}
                                    {item.ojo ? ` · ${item.ojo}` : ''}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.cantidad}</p>
                              </div>
                              <p className="font-bold text-gray-900 text-sm">RD${(item.precio * item.cantidad).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                          <span>Creada: {new Date(s.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {s.descuento_pct > 0 && <span className="text-green-600 font-semibold">Descuento: {s.descuento_pct}%</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
