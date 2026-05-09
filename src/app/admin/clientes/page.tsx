'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Search, Users, ShoppingBag, Mail, Phone, X, ChevronRight, Calendar } from 'lucide-react'

export default function ClientesPage() {
  const sb = createClient()
  const [clientes, setClientes] = useState<any[]>([])
  const [pedidosPorCliente, setPedidosPorCliente] = useState<Record<string, any[]>>({})
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })
      .then(({ data }) => { setClientes(data ?? []); setLoading(false) })
  }, [])

  const abrirCliente = async (c: any) => {
    setSelected(c)
    if (!pedidosPorCliente[c.id]) {
      const { data } = await sb.from('orders').select('id,total,estado,fecha,metodo_pago')
        .eq('user_id', c.id).order('fecha', { ascending: false })
      setPedidosPorCliente(p => ({ ...p, [c.id]: data ?? [] }))
    }
  }

  const filtrados = clientes.filter(c =>
    !search ||
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono?.includes(search)
  )

  const ESTADO_COLOR: Record<string, string> = {
    pendiente: 'bg-amber-100 text-amber-700',
    confirmado: 'bg-blue-100 text-blue-700',
    entregado: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
    enviado: 'bg-indigo-100 text-indigo-700',
    preparando: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-7xl mx-auto p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Clientes</h1>
              <p className="text-gray-400 text-sm mt-0.5">{clientes.length} registrados</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: clientes.length, color: 'bg-blue-500' },
              { label: 'Este mes', value: clientes.filter(c => new Date(c.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length, color: 'bg-green-500' },
              { label: 'Con teléfono', value: clientes.filter(c => c.telefono).length, color: 'bg-purple-500' },
              { label: 'Esta semana', value: clientes.filter(c => new Date(c.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length, color: 'bg-amber-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Cliente', 'Email', 'Teléfono', 'Registro', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtrados.map(c => (
                      <tr key={c.id} onClick={() => abrirCliente(c)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-blue-700 font-bold text-sm">{(c.nombre ?? c.email ?? '?')[0].toUpperCase()}</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{c.nombre ?? 'Sin nombre'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.email ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.telefono ?? '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                      </tr>
                    ))}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No hay clientes</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Drawer cliente */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-gray-900">Perfil del cliente</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Avatar y datos */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-black text-xl">{(selected.nombre ?? selected.email ?? '?')[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selected.nombre ?? 'Sin nombre'}</p>
                  <p className="text-sm text-gray-500">Cliente desde {new Date(selected.created_at).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.email ?? '—'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.telefono ?? '—'}</span>
                </div>
              </div>
              {/* Historial pedidos */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Historial de pedidos</p>
                {pedidosPorCliente[selected.id] ? (
                  pedidosPorCliente[selected.id].length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">Sin pedidos aún</p>
                  ) : (
                    <div className="space-y-2">
                      {pedidosPorCliente[selected.id].map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                          <div>
                            <p className="font-mono text-xs text-gray-400">#{p.id.slice(0, 8).toUpperCase()}</p>
                            <p className="font-bold text-sm text-gray-900">RD${p.total?.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{p.fecha ? new Date(p.fecha).toLocaleDateString('es-DO') : '—'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ESTADO_COLOR[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {/* Acciones */}
              <div className="flex gap-3 pt-2">
                {selected.telefono && (
                  <a href={`https://wa.me/${selected.telefono.replace(/\D/g, '')}?text=Hola ${selected.nombre}, te contactamos de ContactGo.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm text-center transition-colors">
                    WhatsApp
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm text-center transition-colors">
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
