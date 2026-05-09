'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Search, ChevronRight, X, Printer, MessageCircle, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ESTADOS = ['pendiente','confirmado','preparando','enviado','entregado','cancelado']
const ESTADO_COLOR: Record<string,string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmado: 'bg-blue-50 text-blue-700 border-blue-200',
  preparando: 'bg-purple-50 text-purple-700 border-purple-200',
  enviado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  entregado: 'bg-green-50 text-green-700 border-green-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
}
const ESTADO_ICON: Record<string,any> = {
  pendiente: Clock, confirmado: CheckCircle, preparando: Package,
  enviado: Truck, entregado: CheckCircle, cancelado: XCircle,
}

export default function PedidosPage() {
  const sb = createClient()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [items, setItems] = useState<Record<string,any[]>>({})
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.from('orders').select('*').order('fecha', {ascending: false})
      .then(({data}) => { setPedidos(data??[]); setLoading(false) })
  }, [])

  const abrirPedido = async (p: any) => {
    setSelected(p)
    if (!items[p.id]) {
      const {data} = await sb.from('order_items').select('*').eq('order_id', p.id)
      setItems(i => ({...i, [p.id]: data??[]}))
    }
  }

  const printOrder = () => {
    if (!selected) return
    const pedidoId = selected.id.slice(0,8).toUpperCase()
    const fecha = new Date(selected.fecha).toLocaleDateString('es-DO', {day:'numeric',month:'long',year:'numeric'})
    const itemsRows = (items[selected.id] ?? []).map((item: any) => {
      const specs = [
        item.sph != null ? ('SPH:' + (item.sph > 0 ? '+' : '') + item.sph) : '',
        item.cyl != null ? ('CYL:' + item.cyl) : '',
        item.axis != null ? ('EJE:' + String(item.axis).padStart(3,'0')) : '',
        item.color || '',
        item.ojo || '',
      ].filter(Boolean).join(' · ')
      const subtotal = 'RD$' + ((item.precio ?? 0) * (item.cantidad ?? 1)).toLocaleString()
      return '<tr><td>' + item.nombre + '</td><td style="font-family:monospace;font-size:11px;color:#555">' + specs + '</td><td style="text-align:center">' + item.cantidad + '</td><td style="text-align:right;font-weight:600">' + subtotal + '</td></tr>'
    }).join('')

    const html = '<!DOCTYPE html><html><head><title>Pedido #' + pedidoId + '</title>' +
      '<style>* { box-sizing:border-box; margin:0; padding:0; } body { font-family:-apple-system,sans-serif; font-size:12px; color:#111; padding:20px; } .header { display:flex; justify-content:space-between; border-bottom:2px solid #111; padding-bottom:12px; margin-bottom:16px; } .logo { font-size:20px; font-weight:900; } .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px; } .section-title { font-size:10px; font-weight:700; text-transform:uppercase; color:#888; margin-bottom:6px; } .value { font-size:13px; font-weight:600; } table { width:100%; border-collapse:collapse; } th { text-align:left; font-size:10px; text-transform:uppercase; color:#888; border-bottom:1px solid #e5e7eb; padding:4px 0; } td { padding:6px 0; border-bottom:1px solid #f3f4f6; } .total-row td { font-weight:700; font-size:14px; border-top:2px solid #111; border-bottom:none; padding-top:8px; } .footer { margin-top:20px; padding-top:12px; border-top:1px solid #e5e7eb; text-align:center; color:#aaa; font-size:10px; } @page { size:A4; margin:15mm; } @media print { body { padding:0; } }</style>' +
      '</head><body>' +
      '<div class="header"><div><div class="logo">ContactGo</div><div style="color:#888;font-size:11px">contactgo.net · RD</div></div><div style="text-align:right"><div style="font-size:14px;font-weight:700">Pedido #' + pedidoId + '</div><div style="color:#888;font-size:11px">' + fecha + '</div><div style="margin-top:4px;display:inline-block;padding:2px 8px;background:#f3f4f6;border-radius:999px;font-size:10px;font-weight:700">' + selected.estado + '</div></div></div>' +
      '<div class="grid2">' +
        '<div><div class="section-title">Cliente</div><div class="value">' + selected.cliente_nombre + '</div><div style="color:#555">' + (selected.cliente_email ?? '') + '</div><div style="color:#555">' + (selected.cliente_telefono ?? '') + '</div></div>' +
        '<div><div class="section-title">Entrega</div><div style="font-size:12px;font-weight:600">' + (selected.direccion_texto ?? '—') + '</div><div style="color:#555">Método: ' + (selected.metodo_pago ?? '').replace('_',' ') + '</div><div style="color:#555">Pago: ' + (selected.pago_estado ?? 'pendiente') + '</div></div>' +
      '</div>' +
      '<div class="section-title" style="margin-bottom:6px">Productos</div>' +
      '<table><thead><tr><th>Producto</th><th>Graduación</th><th style="text-align:center">Cant</th><th style="text-align:right">Precio</th></tr></thead>' +
      '<tbody>' + itemsRows + '</tbody>' +
      '<tfoot><tr class="total-row"><td colspan="3">Total</td><td style="text-align:right">RD$' + (selected.total ?? 0).toLocaleString() + '</td></tr></tfoot></table>' +
      (selected.notas_admin ? '<div style="margin-top:14px"><div class="section-title">Notas</div><div>' + selected.notas_admin + '</div></div>' : '') +
      '<div class="footer">ContactGo · contactgo.net · República Dominicana · Impreso ' + new Date().toLocaleDateString('es-DO') + '</div>' +
      '</body></html>'

    const win = window.open('', '_blank', 'width=800,height=600')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 600)
  }


  const actualizarEstado = async (orderId: string, estado: string) => {
    await sb.from('orders').update({estado}).eq('id', orderId)
    setPedidos(ps => ps.map(p => p.id===orderId ? {...p, estado} : p))
    setSelected((s: any) => s?.id===orderId ? {...s, estado} : s)
    // Notificar al cliente por email
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, evento: 'estado_cambio', nuevo_estado: estado })
    }).catch(console.error)
    toast.success('Estado actualizado')
  }

  const filtrados = pedidos.filter(p => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    const matchSearch = !search || 
      p.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente_telefono?.includes(search) ||
      p.id.slice(0,8).toUpperCase().includes(search.toUpperCase())
    return matchEstado && matchSearch
  })

  const formatSph = (v: any) => v == null ? null : (parseFloat(v) > 0 ? '+'+v : String(v))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-gray-500 text-sm">{pedidos.length} pedidos en total</p>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {ESTADOS.map(e => {
              const count = pedidos.filter(p => p.estado === e).length
              return (
                <button key={e} onClick={() => setFiltroEstado(e === filtroEstado ? 'todos' : e)}
                  className={`rounded-xl border p-3 text-center transition-all ${filtroEstado===e ? ESTADO_COLOR[e]+' border-2' : 'bg-white border-gray-100'}`}>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 capitalize">{e}</p>
                </button>
              )
            })}
          </div>

          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono o # pedido..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#','Cliente','Teléfono','Total','Método','Estado','Fecha',''].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtrados.map(p => {
                      const Icon = ESTADO_ICON[p.estado] ?? Clock
                      return (
                        <tr key={p.id} onClick={() => abrirPedido(p)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-400">#{p.id.slice(0,8).toUpperCase()}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{p.cliente_nombre}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.cliente_telefono}</td>
                          <td className="px-4 py-3 font-bold text-sm text-gray-900">RD${p.total?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 capitalize">{p.metodo_pago?.replace('_',' ')}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${ESTADO_COLOR[p.estado]}`}>
                              <Icon className="w-3 h-3" />{p.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {p.fecha ? new Date(p.fecha).toLocaleDateString('es-DO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </td>
                        </tr>
                      )
                    })}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No hay pedidos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Panel lateral de detalle */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
            {/* Header panel */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="font-mono text-xs text-gray-400">#{selected.id.slice(0,8).toUpperCase()}</p>
                <h2 className="font-bold text-gray-900">Detalle del Pedido</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { printOrder() }} className="p-2 hover:bg-gray-100 rounded-lg no-print">
                  <Printer className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Estado con botones */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Estado</p>
                <div className="flex flex-wrap gap-2">
                  {ESTADOS.map(e => {
                    const Icon = ESTADO_ICON[e]
                    return (
                      <button key={e} onClick={() => actualizarEstado(selected.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected.estado===e ? ESTADO_COLOR[e]+' border-2' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                        <Icon className="w-3 h-3" />{e.charAt(0).toUpperCase()+e.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Etiqueta de envío */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">📍 Etiqueta de Envío</p>
                <p className="font-bold text-gray-900 text-lg">{selected.cliente_nombre}</p>
                <p className="text-gray-600 text-sm mt-1">{selected.direccion_texto}</p>
                <p className="text-gray-500 text-sm mt-1">📞 {selected.cliente_telefono}</p>
                <p className="text-gray-500 text-sm">✉️ {selected.cliente_email}</p>
              </div>

              {/* Productos */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">📦 Productos</p>
                {items[selected.id] ? (
                  items[selected.id].length > 0 ? (
                    <div className="space-y-2">
                      {items[selected.id].map((item, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                              {(item.sph != null) && (
                                <p className="text-xs text-primary-600 font-mono mt-0.5">
                                  SPH: {formatSph(item.sph)}
                                  {item.cyl != null ? ` · CYL: ${item.cyl}` : ''}
                                  {item.axis != null ? ` · EJE: ${String(item.axis).padStart(3,'0')}` : ''}
                                  {item.add_power != null ? ` · ADD: ${item.add_power}` : ''}
                                  {item.color ? ` · Color: ${item.color}` : ''}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5">x{item.cantidad}</p>
                            </div>
                            <p className="font-bold text-gray-900 text-sm">RD${(item.subtotal ?? item.precio * item.cantidad)?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-sm font-semibold text-amber-800">⚠️ Sin detalle de productos</p>
                      <p className="text-xs text-amber-700 mt-1">Total registrado: RD${selected.total?.toLocaleString()}. Contacta al cliente para confirmar.</p>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Pago */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">💳 Pago</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">RD${selected.subtotal?.toLocaleString()}</span>
                </div>
                {selected.descuento > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Descuento</span>
                    <span className="text-green-600 font-medium">-RD${selected.descuento?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium">{selected.envio > 0 ? 'RD$'+selected.envio?.toLocaleString() : 'Gratis'}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600 text-lg">RD${selected.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-500">Método</span>
                  <span className="font-semibold capitalize">{selected.metodo_pago?.replace('_',' ')}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Estado pago</span>
                  <span className={`font-semibold ${selected.pago_estado==='pagado' ? 'text-green-600' : 'text-amber-600'}`}>
                    {selected.pago_estado ?? 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Fecha */}
              <p className="text-xs text-gray-400 text-center">
                📅 {selected.fecha ? new Date(selected.fecha).toLocaleString('es-DO',{dateStyle:'full',timeStyle:'short'}) : '-'}
              </p>

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                <a href={`https://wa.me/${selected.cliente_telefono?.replace(/\D/g,'')}?text=Hola ${selected.cliente_nombre}, te contactamos de ContactGo sobre tu pedido #${selected.id.slice(0,8).toUpperCase()}.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <button onClick={() => printOrder()}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
