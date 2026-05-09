'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Package, AlertTriangle, TrendingDown, Save, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const TIPO_LABEL: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
  color: 'Color', gota: 'Gotas', solucion: 'Solución'
}
const TIPO_COLOR: Record<string, string> = {
  esferico: 'bg-blue-100 text-blue-700', torico: 'bg-purple-100 text-purple-700',
  multifocal: 'bg-indigo-100 text-indigo-700', color: 'bg-pink-100 text-pink-700',
  gota: 'bg-cyan-100 text-cyan-700', solucion: 'bg-teal-100 text-teal-700'
}

export default function InventarioPage() {
  const sb = createClient()
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    sb.from('products')
      .select('id, nombre, tipo, marca, stock, activo, precio')
      .eq('activo', true)
      .order('tipo')
      .order('nombre')
      .then(({ data }) => { setProductos(data ?? []); setLoading(false) })
  }, [])

  const guardarStock = async (id: string) => {
    const nuevoStock = editando[id]
    if (nuevoStock === undefined) return
    setSaving(id)
    const { error } = await sb.from('products').update({ stock: nuevoStock }).eq('id', id)
    if (error) { toast.error('Error: ' + error.message); setSaving(null); return }
    setProductos(ps => ps.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
    setEditando(e => { const n = { ...e }; delete n[id]; return n })
    setSaving(null)
    toast.success('Stock actualizado')
  }

  const ajustarTodos = async (cantidad: number) => {
    if (!confirm(`¿Ajustar stock de todos los productos a ${cantidad} unidades?`)) return
    const { error } = await sb.from('products').update({ stock: cantidad }).eq('activo', true)
    if (error) { toast.error('Error: ' + error.message); return }
    setProductos(ps => ps.map(p => ({ ...p, stock: cantidad })))
    toast.success(`Stock ajustado a ${cantidad} en todos los productos`)
  }

  const filtrados = productos.filter(p => {
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo
    const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca?.toLowerCase().includes(search.toLowerCase())
    return matchTipo && matchSearch
  })

  const sinStock     = productos.filter(p => p.stock === 0).length
  const stockCritico = productos.filter(p => p.stock > 0 && p.stock <= 3).length
  const stockNormal  = productos.filter(p => p.stock > 3).length
  const tipos        = [...new Set(productos.map(p => p.tipo))]

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50'
    if (stock <= 3) return 'text-amber-600 bg-amber-50'
    if (stock <= 5) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-6xl mx-auto p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Inventario</h1>
              <p className="text-gray-400 text-sm mt-0.5">{productos.length} productos activos</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => ajustarTodos(5)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Set todos a 5
              </button>
              <button onClick={() => ajustarTodos(10)}
                className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors">
                Set todos a 10
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm text-gray-500">Stock normal</p>
              </div>
              <p className="text-3xl font-black text-gray-900">{stockNormal}</p>
            </div>
            <div className={`bg-white border rounded-2xl p-5 shadow-sm ${stockCritico > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`w-3.5 h-3.5 ${stockCritico > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-500">Stock crítico (≤3)</p>
              </div>
              <p className={`text-3xl font-black ${stockCritico > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{stockCritico}</p>
            </div>
            <div className={`bg-white border rounded-2xl p-5 shadow-sm ${sinStock > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className={`w-3.5 h-3.5 ${sinStock > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-500">Sin stock</p>
              </div>
              <p className={`text-3xl font-black ${sinStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>{sinStock}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto o marca..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="todos">Todos los tipos</option>
              {tipos.map(t => <option key={t} value={t}>{TIPO_LABEL[t] ?? t}</option>)}
            </select>
          </div>

          {/* Tabla */}
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
                      {['Producto', 'Marca', 'Tipo', 'Precio', 'Stock', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtrados.map(p => {
                      const stockEdit = editando[p.id]
                      const stockActual = stockEdit !== undefined ? stockEdit : p.stock
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {p.stock === 0 && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                              <p className="font-semibold text-gray-900 text-sm">{p.nombre}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-medium">{p.marca}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIPO_COLOR[p.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                              {TIPO_LABEL[p.tipo] ?? p.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                            RD${p.precio?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditando(e => ({ ...e, [p.id]: Math.max(0, (e[p.id] ?? p.stock) - 1) }))}
                                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center justify-center transition-colors">−</button>
                              <span className={`min-w-[40px] text-center font-black text-sm px-2 py-0.5 rounded-lg ${getStockColor(stockActual)}`}>
                                {stockActual}
                              </span>
                              <button onClick={() => setEditando(e => ({ ...e, [p.id]: (e[p.id] ?? p.stock) + 1 }))}
                                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center justify-center transition-colors">+</button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {editando[p.id] !== undefined && (
                              <button onClick={() => guardarStock(p.id)}
                                disabled={saving === p.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60">
                                {saving === p.id ? (
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                                Guardar
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No hay productos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
