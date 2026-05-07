'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import { Search, Clock, CheckCircle, Truck, Package, AlertCircle, Phone, Mail, MapPin, X, Eye, RefreshCw, MessageSquare, Calendar, CreditCard, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

const ESTADOS = ['pendiente','confirmado','preparando','enviado','entregado','cancelado'] as const
const ESTADO_CFG: Record<string, { cls: string; bg: string; icon: any; label: string }> = {
  pendiente:  { cls: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   icon: Clock,        label: 'Pendiente'  },
  confirmado: { cls: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: CheckCircle,  label: 'Confirmado' },
  preparando: { cls: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Package,      label: 'Preparando' },
  enviado:    { cls: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: Truck,        label: 'Enviado'    },
  entregado:  { cls: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle,  label: 'Entregado'  },
  cancelado:  { cls: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: AlertCircle,  label: 'Cancelado'  },
}

function ItemDetail({ item }: { item: any }) {
  const specs: {label:string,value:string}[] = []
  if (item.ojo)         specs.push({ label:'Ojo',    value: item.ojo })
  if (item.sph != null) specs.push({ label:'SPH',   value: item.sph > 0 ? `+${item.sph}` : String(item.sph) })
  if (item.cyl != null) specs.push({ label:'CYL',   value: String(item.cyl) })
  if (item.axis != null) specs.push({ label:'AXIS', value: String(item.axis).padStart(3,'0') + '°' })
  if (item.add_power)   specs.push({ label:'ADD',   value: item.add_power })
  if (item.color)       specs.push({ label:'Color', value: item.color })
  if (item.size)        specs.push({ label:'Tamaño',value: item.size })
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex justify-between items-start gap-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{item.nombre}</p>
        <p className="font-bold text-gray-900 text-sm whitespace-nowrap">RD${(item.subtotal ?? item.precio * item.cantidad ?? 0).toLocaleString()}</p>
      </div>
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specs.map(s => (
            <span key={s.label} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-xs">
              <span className="text-gray-400">{s.label}:</span>
              <span className="font-semibold text-gray-700">{s.value}</span>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
    </div>
  )
}

export default function AdminPedidos() {
  const [orders, setOrders]     = useState<any[]>([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const sb = createClient()

  const load = useCallback(async () => {
    setRefreshing(true)
    const { data } = await sb.from('orders').select('*, order_items(*)').order('fecha', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateEstado = async (orderId: string, estado: string) => {
    const { error } = await sb.from('orders').update({ estado }).eq('id', orderId)
    if (!error) {
      toast.success(`Estado: ${estado}`)
      load()
      if (selected?.id === orderId) setSelected((s: any) => s ? { ...s, estado } : s)
    } else toast.error('Error al actualizar')
  }

  const printLabel = (o: any) => {
    const win = window.open('', '_blank')
    if (!win) return
    const items = (o.order_items ?? []).map((item: any) => {
      const specs = []
      if (item.ojo)         specs.push(`Ojo: ${item.ojo}`)
      if (item.sph != null) specs.push(`SPH: ${item.sph > 0 ? '+' : ''}${item.sph}`)
      if (item.cyl != null) specs.push(`CYL: ${item.cyl}`)
      if (item.axis != null) specs.push(`AXIS: ${String(item.axis).padStart(3,'0')}°`)
      if (item.add_power)   specs.push(`ADD: ${item.add_power}`)
      if (item.color)       specs.push(`Color: ${item.color}`)
      if (item.size)        specs.push(`Tamaño: ${item.size}`)
      return `<div style="margin-bottom:8px"><b>${item.nombre}</b> ×${item.cantidad}<br><span style="font-size:11px;color:#666">${specs.join(' · ')}</span></div>`
    }).join('')
    win.document.write(`<html><head><title>Etiqueta</title><style>body{font-family:Arial;padding:20px;max-width:400px}hr{border:1px dashed #999;margin:10px 0}@media print{body{padding:5px}}</style></head><body>
    <div style="text-align:center;margin-bottom:10px"><b style="font-size:18px">📦 ContactGo</b><br><span style="font-size:11px;color:#666">contactgo.net</span></div>
    <hr><b>PEDIDO #${o.id.slice(0,8).toUpperCase()}</b><br><span style="font-size:11px;color:#666">${new Date(o.fecha).toLocaleString('es-DO')}</span>
    <hr><b>DESTINATARIO:</b><br><b style="font-size:16px">${o.cliente_nombre ?? '—'}</b><br>
    <span>${o.direccion_texto ?? 'Sin dirección'}</span><br>
    ${o.cliente_telefono ? `📱 ${o.cliente_telefono}<br>` : ''}
    <hr><b>PRODUCTOS:</b><br>${items}
    <hr><b>TOTAL: RD$${(o.total ?? 0).toLocaleString()}</b><br>
    <span style="font-size:12px">Pago: ${(o.metodo_pago ?? '—').replace('_',' ')} · ${o.pago_estado ?? 'pendiente'}</span>
    <script>window.print();window.close()</script></body></html>`)
    win.document.close()
  }

  const filtered = orders.filter(o => {
    const matchFilter = !filter || o.estado === filter
    const matchSearch = !search || (o.cliente_nombre ?? '').toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    return matchFilter && matchSearch
  })
  const counts = ESTADOS.reduce((acc, e) => { acc[e] = orders.filter(o => o.estado === e).length; return acc }, {} as Record<string,number>)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-16 pb-24 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-500 text-sm">{orders.length} pedidos en total</p>
            </div>
            <button onClick={load} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {/* Stats por estado */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
            {ESTADOS.map(e => {
              const cfg = ESTADO_CFG[e]; const Icon = cfg.icon
              return (
                <button key={e} onClick={() => setFilter(filter === e ? '' : e)}
                  className={`p-3 rounded-xl border text-left transition-all ${filter === e ? cfg.bg + ' ' + cfg.cls + ' border-current' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                  <p className="text-lg font-bold">{counts[e] ?? 0}</p>
                  <p className="text-xs font-medium truncate">{cfg.label}</p>
                </button>
              )
            })}
          </div>

          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['#Pedido','Cliente','Productos','Total','Pago','Estado','Fecha','Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">Cargando pedidos...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">No hay pedidos</td></tr>
                  ) : filtered.map((o: any) => {
                    const cfg = ESTADO_CFG[o.estado] ?? ESTADO_CFG.pendiente
                    const items = o.order_items ?? []
                    return (
                      <tr key={o.id} onClick={() => setSelected(o)} className="hover:bg-gray-50/80 transition-colors cursor-pointer">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">#{o.id.slice(0,8).toUpperCase()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{o.cliente_nombre ?? '—'}</p>
                          <p className="text-xs text-gray-400">{o.cliente_telefono ?? ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 text-xs">{items.length} producto(s)</p>
                          <p className="text-gray-400 text-xs truncate max-w-[150px]">{items.map((i:any)=>i.nombre).join(', ')}</p>
                        </td>
                        <td className="px-4 py-3"><p className="font-bold text-gray-900">RD${(o.total??0).toLocaleString()}</p></td>
                        <td className="px-4 py-3 text-gray-500 text-xs capitalize">{(o.metodo_pago??'—').replace('_',' ')}</td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <select value={o.estado} onChange={e => updateEstado(o.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${cfg.bg} ${cfg.cls}`}>
                            {ESTADOS.map(s => <option key={s} value={s} className="bg-white text-gray-900">{ESTADO_CFG[s].label}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(o.fecha).toLocaleDateString('es-DO')}</td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="Ver detalle"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => printLabel(o)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500" title="Imprimir"><Printer className="w-4 h-4" /></button>
                            {o.cliente_telefono && (
                              <a href={`https://wa.me/${o.cliente_telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(o.cliente_nombre??'')}%2C%20tu%20pedido%20%23${o.id.slice(0,8).toUpperCase()}%20está%20${o.estado}`}
                                target="_blank" onClick={e=>e.stopPropagation()} className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="WhatsApp">
                                <MessageSquare className="w-4 h-4" />
                              </a>
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
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <p className="font-mono text-xs text-gray-400 font-bold">#{selected.id.slice(0,8).toUpperCase()}</p>
                <h3 className="font-bold text-gray-900 text-lg">Detalle del Pedido</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => printLabel(selected)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl" title="Imprimir etiqueta"><Printer className="w-5 h-5" /></button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-5">
              {/* Cambio de estado rápido */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado</p>
                <div className="flex flex-wrap gap-2">
                  {ESTADOS.map(e => {
                    const cfg = ESTADO_CFG[e]; const Icon = cfg.icon
                    return (
                      <button key={e} onClick={() => updateEstado(selected.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${selected.estado === e ? cfg.bg+' '+cfg.cls+' border-current' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Etiqueta envío */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Etiqueta de Envío</p>
                </div>
                <p className="text-xl font-black text-gray-900">{selected.cliente_nombre ?? '—'}</p>
                <p className="text-gray-600 font-medium mt-1">{selected.direccion_texto ?? 'Sin dirección'}</p>
                {selected.cliente_telefono && <div className="flex items-center gap-2 mt-2"><Phone className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-500">{selected.cliente_telefono}</p></div>}
                {selected.cliente_email && <div className="flex items-center gap-2 mt-1"><Mail className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-500">{selected.cliente_email}</p></div>}
              </div>

              {/* Productos con especificaciones completas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productos</p>
                </div>
                <div className="space-y-2">
                  {(selected.order_items ?? []).map((item: any) => <ItemDetail key={item.id} item={item} />)}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <p className="font-bold text-gray-900">Total</p>
                  <p className="font-black text-xl text-primary-600">RD${(selected.total ?? 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Pago */}
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3"><CreditCard className="w-4 h-4 text-gray-400" /><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pago</p></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Método</p><p className="font-semibold text-gray-900 capitalize mt-0.5">{(selected.metodo_pago??'—').replace('_',' ')}</p></div>
                  <div><p className="text-xs text-gray-400">Estado pago</p><p className={`font-semibold mt-0.5 ${selected.pago_estado==='pagado'?'text-green-600':'text-amber-600'} capitalize`}>{selected.pago_estado??'pendiente'}</p></div>
                  {selected.pago_referencia && <div className="col-span-2"><p className="text-xs text-gray-400">Referencia</p><p className="font-mono font-semibold text-gray-900 mt-0.5">{selected.pago_referencia}</p></div>}
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selected.fecha).toLocaleString('es-DO', { dateStyle: 'full', timeStyle: 'short' })}</span>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {selected.cliente_telefono && (
                  <a href={`https://wa.me/${selected.cliente_telefono.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(selected.cliente_nombre??'')}%2C%20tu%20pedido%20%23${selected.id.slice(0,8).toUpperCase()}%20está%20${selected.estado}`}
                    target="_blank" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    <MessageSquare className="w-4 h-4" />WhatsApp
                  </a>
                )}
                <button onClick={() => printLabel(selected)} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  <Printer className="w-4 h-4" />Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
