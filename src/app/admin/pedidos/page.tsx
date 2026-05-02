'use client'
import { useState, useEffect } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import type { Order } from '@/types'
import { Search, Clock, CheckCircle, Truck, Package, AlertCircle, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

const ESTADOS = ['pendiente','confirmado','preparando','enviado','entregado','cancelado'] as const

const BADGE: Record<string, { cls: string; icon: any }> = {
  pendiente:  { cls: 'bg-amber-100 text-amber-700',   icon: Clock },
  confirmado: { cls: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  preparando: { cls: 'bg-purple-100 text-purple-700', icon: Package },
  enviado:    { cls: 'bg-indigo-100 text-indigo-700', icon: Truck },
  entregado:  { cls: 'bg-green-100 text-green-700',   icon: CheckCircle },
  cancelado:  { cls: 'bg-red-100 text-red-700',       icon: AlertCircle },
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const sb = createClient()

  const load = async () => {
    const { data } = await sb.from('orders')
      .select('*, order_items(*, products(nombre))')
      .order('fecha', { ascending: false })
    setOrders((data as any) ?? []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateEstado = async (orderId: string, estado: string) => {
    const { error } = await sb.from('orders').update({ estado }).eq('id', orderId)
    if (!error) { toast.success(`Estado actualizado: ${estado}`); load() }
    else toast.error('Error al actualizar')
  }

  const filtered = orders.filter(o => {
    const matchFilter = !filter || o.estado === filter
    const name = (o as any).profiles?.nombre ?? o.cliente_nombre ?? ''
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search)
    return matchFilter && matchSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-gray-500 text-sm">{orders.length} pedidos en total</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cliente o ID..." className="input !pl-9 w-56" />
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setFilter('')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!filter ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                Todos
              </button>
              {ESTADOS.map(e => {
                const b = BADGE[e]; const Icon = b.icon
                return (
                  <button key={e} onClick={() => setFilter(e)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize flex items-center gap-1
                      ${filter === e ? b.cls + ' font-semibold' : 'bg-white border border-gray-200 text-gray-500'}`}>
                    <Icon className="w-3.5 h-3.5" />{e}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Pedido','Cliente','Total','Pago','Estado','Fecha','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((o: any) => {
                    const b = BADGE[o.estado] ?? BADGE.pendiente
                    const BIcon = b.icon
                    return (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelected(o)}>
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{o.id.slice(0,8)}…</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{o.profiles?.nombre ?? o.cliente_nombre ?? '—'}</p>
                          <p className="text-xs text-gray-400">{o.cliente_telefono ?? ''}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold">RD${(o.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 capitalize text-xs">{(o.metodo_pago ?? '—').replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.estado}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateEstado(o.id, e.target.value)}
                            className={`badge cursor-pointer border-0 ${b.cls} focus:outline-none`}>
                            {ESTADOS.map(s => <option key={s} value={s} className="bg-white text-gray-900">{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(o.fecha).toLocaleDateString('es-DO')}
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          {o.cliente_telefono && (
                            <a href={`https://wa.me/${o.cliente_telefono.replace(/\D/g,'')}?text=Hola%20${o.cliente_nombre}%2C%20tu%20pedido%20está%20${o.estado}`}
                              target="_blank"
                              className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 flex items-center justify-center w-8 h-8">
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
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

      {/* Detalle pedido */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-xs text-gray-400 font-mono">{selected.id}</p>
                <h3 className="font-bold text-gray-900 text-lg mt-0.5">Detalle del pedido</h3>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="card p-4 space-y-2">
                <p className="font-semibold text-gray-700 mb-2">Cliente</p>
                <p><span className="text-gray-400">Nombre:</span> <strong>{(selected as any).profiles?.nombre ?? selected.cliente_nombre}</strong></p>
                <p><span className="text-gray-400">Email:</span> {(selected as any).profiles?.email ?? selected.cliente_email}</p>
                <p><span className="text-gray-400">Tel:</span> {selected.cliente_telefono}</p>
                <p><span className="text-gray-400">Dirección:</span> {selected.direccion_texto}</p>
              </div>

              <div className="card p-4">
                <p className="font-semibold text-gray-700 mb-3">Productos</p>
                {((selected as any).order_items ?? []).map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 flex-1">{item.nombre} ×{item.cantidad}
                      {item.sph ? ` (${item.sph > 0 ? '+' : ''}${item.sph})` : ''}
                    </span>
                    <span className="font-semibold">RD${item.subtotal?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 font-bold text-gray-900">
                  <span>Total</span>
                  <span>RD${selected.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="card p-4 space-y-2">
                <p className="font-semibold text-gray-700 mb-2">Pago</p>
                <p><span className="text-gray-400">Método:</span> <span className="capitalize">{selected.metodo_pago?.replace('_',' ')}</span></p>
                <p><span className="text-gray-400">Estado:</span> <span className="capitalize">{selected.pago_estado}</span></p>
                {selected.pago_referencia && <p><span className="text-gray-400">Ref:</span> {selected.pago_referencia}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
