'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import { RefreshCw, MessageSquare, Search, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminAbandonados() {
  const [carts, setCarts]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const sb = createClient()

  const load = useCallback(async () => {
    const { data } = await sb
      .from('abandoned_carts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    setCarts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const marcarRecuperado = async (id: string) => {
    await sb.from('abandoned_carts').update({ recuperado: true }).eq('id', id)
    toast.success('Marcado como recuperado')
    load()
  }

  const filtered = carts.filter(c =>
    !search ||
    (c.cliente_nombre ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.cliente_telefono ?? '').includes(search)
  )

  const stats = {
    total:      carts.length,
    pendientes: carts.filter(c => !c.recuperado && !c.whatsapp_enviado).length,
    contactados: carts.filter(c => c.whatsapp_enviado && !c.recuperado).length,
    recuperados: carts.filter(c => c.recuperado).length,
    valorTotal:  carts.filter(c => !c.recuperado).reduce((s, c) => s + Number(c.total ?? 0), 0),
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-16 pb-24 md:pt-0 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carritos Abandonados</h1>
              <p className="text-gray-500 text-sm">{stats.total} carritos registrados</p>
            </div>
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" /> Actualizar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Sin contactar', val: stats.pendientes,   color: 'text-amber-600', bg: 'bg-amber-50'  },
              { label: 'Contactados',   val: stats.contactados,  color: 'text-blue-600',  bg: 'bg-blue-50'   },
              { label: 'Recuperados',   val: stats.recuperados,  color: 'text-green-600', bg: 'bg-green-50'  },
              { label: 'Valor perdido', val: `RD$${stats.valorTotal.toLocaleString()}`, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Cliente','Teléfono','Productos','Total','Estado','Fecha','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">Cargando...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                      {carts.length === 0 ? 'Aún no hay carritos registrados — aparecerán cuando clientes lleguen al checkout' : 'Sin resultados'}
                    </td></tr>
                  ) : filtered.map(c => {
                    const items = Array.isArray(c.items) ? c.items : JSON.parse(c.items || '[]')
                    const mins  = Math.round((Date.now() - new Date(c.created_at).getTime()) / 60000)
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3 font-semibold text-gray-900">{c.cliente_nombre ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs font-mono">{c.cliente_telefono ?? '—'}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-600 truncate max-w-[160px]">
                            {items.map((i: any) => i.nombre).join(', ')}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">RD${Number(c.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {c.recuperado
                            ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Recuperado</span>
                            : c.whatsapp_enviado
                            ? <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Contactado</span>
                            : <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Pendiente</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {mins < 60 ? `hace ${mins}min` : `hace ${Math.round(mins/60)}h`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {c.cliente_telefono && !c.recuperado && (
                              <a href={`https://wa.me/${c.cliente_telefono.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola ${c.cliente_nombre ?? ''}👋 Notamos que dejaste productos en tu carrito de ContactGo. ¿Te ayudamos? 👉 https://contactgo.net/cart`)}`}
                                target="_blank"
                                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"
                                title="WhatsApp">
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            )}
                            {!c.recuperado && (
                              <button onClick={() => marcarRecuperado(c.id)}
                                className="px-2 py-1 text-xs font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                                ✓ Recuperado
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
    </div>
  )
}
