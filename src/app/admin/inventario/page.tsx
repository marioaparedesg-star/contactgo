'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Save, ChevronDown, ChevronRight, Package, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const sb = createClient()

type Producto = { id: string; nombre: string; tipo: string; marca: string; stock: number; activo: boolean; precio: number }
type Inventario = { id: string; product_id: string; sph: number; stock: number }

const TIPO_META: Record<string, { label: string; color: string; bg: string }> = {
  esferico:   { label: 'Esférico',   color: '#1d4ed8', bg: '#eff6ff' },
  color:      { label: 'Color',      color: '#be185d', bg: '#fdf2f8' },
  torico:     { label: 'Tórico',     color: '#7c3aed', bg: '#f5f3ff' },
  multifocal: { label: 'Multifocal', color: '#b45309', bg: '#fffbeb' },
}

export default function InventarioPage() {
  const [productos, setProductos]   = useState<Producto[]>([])
  const [inventario, setInventario] = useState<Record<string, Inventario[]>>({})
  const [expandido, setExpandido]   = useState<string | null>(null)
  const [editando, setEditando]     = useState<Record<string, number>>({})
  const [busqueda, setBusqueda]     = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [loading, setLoading]       = useState(true)
  const [guardando, setGuardando]   = useState<string | null>(null)
  const [soloProblemas, setSoloProblemas] = useState(false)

  useEffect(() => {
    sb.from('products')
      .select('id, nombre, tipo, marca, stock, activo, precio')
      .in('tipo', ['esferico', 'color', 'torico', 'multifocal'])
      .order('tipo').order('nombre')
      .then(({ data }) => { setProductos(data ?? []); setLoading(false) })
  }, [])

  const cargarInventario = async (productId: string) => {
    if (inventario[productId]) return
    const { data } = await sb.from('product_inventory').select('*').eq('product_id', productId).order('sph')
    setInventario(prev => ({ ...prev, [productId]: data ?? [] }))
  }

  const toggle = async (p: Producto) => {
    if (p.tipo === 'torico' || p.tipo === 'multifocal') return
    if (expandido === p.id) { setExpandido(null); return }
    setExpandido(p.id)
    await cargarInventario(p.id)
  }

  const setEdit = (pid: string, sph: number, v: number) =>
    setEditando(prev => ({ ...prev, [`${pid}-${sph}`]: v }))

  const guardarItem = async (item: Inventario) => {
    const key = `${item.product_id}-${item.sph}`
    const val = editando[key]
    if (val === undefined || val === item.stock) return
    setGuardando(key)
    await sb.from('product_inventory').update({ stock: val, updated_at: new Date().toISOString() }).eq('id', item.id)
    setInventario(prev => ({ ...prev, [item.product_id]: prev[item.product_id].map(i => i.id === item.id ? { ...i, stock: val } : i) }))
    setEditando(prev => { const n = { ...prev }; delete n[key]; return n })
    toast.success(`SPH ${item.sph > 0 ? '+' : ''}${item.sph} → ${val}u`)
    setGuardando(null)
  }

  const guardarTodos = async (pid: string) => {
    const items = (inventario[pid] ?? []).filter(i => editando[`${pid}-${i.sph}`] !== undefined)
    if (!items.length) return
    setGuardando(pid)
    for (const item of items) {
      const val = editando[`${pid}-${item.sph}`]
      if (val !== undefined) await sb.from('product_inventory').update({ stock: val, updated_at: new Date().toISOString() }).eq('id', item.id)
    }
    setInventario(prev => ({ ...prev, [pid]: prev[pid].map(i => { const v = editando[`${pid}-${i.sph}`]; return v !== undefined ? { ...i, stock: v } : i }) }))
    setEditando(prev => { const n = { ...prev }; items.forEach(i => delete n[`${pid}-${i.sph}`]); return n })
    toast.success(`${items.length} dioptrías guardadas ✓`)
    setGuardando(null)
  }

  const filtrados = productos.filter(p => {
    if (tipoFiltro !== 'todos' && p.tipo !== tipoFiltro) return false
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (soloProblemas) {
      const items = inventario[p.id] ?? []
      if (p.tipo === 'torico' || p.tipo === 'multifocal') return false
      if (!items.length) return false
      return items.some(i => (editando[`${p.id}-${i.sph}`] ?? i.stock) <= 2)
    }
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Cargando inventario...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-5 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventario por Dioptría</h1>
          <p className="text-sm text-gray-500 mt-0.5">Stock SPH por producto · Tóricos y multifocales son a pedido</p>
        </div>
        <button onClick={() => setSoloProblemas(p => !p)}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${soloProblemas ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
          {soloProblemas ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {soloProblemas ? 'Ver todos' : 'Solo problemas'}
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Buscar producto o marca..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white" />
        </div>
        {[['todos','Todos'],['esferico','Esféricos'],['color','Color'],['torico','Tóricos'],['multifocal','Multifocales']].map(([v,l]) => (
          <button key={v} onClick={() => setTipoFiltro(v)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tipoFiltro === v ? 'bg-gray-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrados.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay productos que coincidan</p>
          </div>
        )}

        {filtrados.map(p => {
          const meta = TIPO_META[p.tipo]
          const esMedida = p.tipo === 'torico' || p.tipo === 'multifocal'
          const abierto = expandido === p.id
          const items = inventario[p.id] ?? []
          const pendientes = items.filter(i => editando[`${p.id}-${i.sph}`] !== undefined).length
          const agotados = items.filter(i => (editando[`${p.id}-${i.sph}`] ?? i.stock) === 0).length
          const bajos = items.filter(i => { const s = editando[`${p.id}-${i.sph}`] ?? i.stock; return s > 0 && s <= 2 }).length

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Fila del producto */}
              <button onClick={() => toggle(p)} disabled={esMedida}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${esMedida ? 'cursor-default' : 'hover:bg-gray-50/80'}`}>

                {/* Badge tipo */}
                <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ color: meta.color, background: meta.bg }}>
                  {meta.label}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</span>
                    <span className="text-xs text-gray-400 font-medium">{p.marca}</span>
                  </div>
                  {abierto && items.length > 0 && (
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-gray-400">{items.length} dioptrías</span>
                      {agotados > 0 && <span className="text-[11px] font-semibold text-red-500">{agotados} agotadas</span>}
                      {bajos > 0 && <span className="text-[11px] font-semibold text-amber-500">{bajos} stock bajo</span>}
                    </div>
                  )}
                </div>

                {/* Alertas compactas */}
                {!abierto && !esMedida && items.length > 0 && (agotados > 0 || bajos > 0) && (
                  <div className="flex gap-1.5">
                    {agotados > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{agotados} agotadas</span>}
                    {bajos > 0 && <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">{bajos} bajas</span>}
                  </div>
                )}

                {esMedida && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-lg shrink-0">A pedido</span>}

                {pendientes > 0 && (
                  <button onClick={e => { e.stopPropagation(); guardarTodos(p.id) }}
                    disabled={guardando === p.id}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                    <Save className="w-3 h-3" /> Guardar {pendientes}
                  </button>
                )}

                {!esMedida && (abierto
                  ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {/* Grid dioptrías */}
              {abierto && !esMedida && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
                  {items.length === 0
                    ? <p className="text-center text-sm text-gray-400 py-4">Cargando...</p>
                    : (
                      <>
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
                          {items.map(item => {
                            const key = `${p.id}-${item.sph}`
                            const val = editando[key] ?? item.stock
                            const modificado = editando[key] !== undefined
                            const sphLabel = `${item.sph > 0 ? '+' : ''}${item.sph}`
                            const bgClass = val === 0 ? 'bg-red-50 border-red-200' : val <= 2 ? 'bg-amber-50 border-amber-200' : modificado ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'
                            const textClass = val === 0 ? 'text-red-600' : val <= 2 ? 'text-amber-600' : modificado ? 'text-primary-700' : 'text-gray-800'
                            return (
                              <div key={item.id} className={`border rounded-xl p-2 text-center transition-all ${bgClass}`}>
                                <p className="text-[10px] font-bold text-gray-500 mb-1 leading-none">{sphLabel}</p>
                                <input type="number" min="0" max="999"
                                  value={val}
                                  onChange={e => setEdit(p.id, item.sph, Math.max(0, parseInt(e.target.value) || 0))}
                                  onBlur={() => guardarItem(item)}
                                  onKeyDown={e => e.key === 'Enter' && guardarItem(item)}
                                  className={`w-full text-center text-sm font-bold bg-transparent border-0 outline-none focus:ring-1 focus:ring-primary-400 rounded ${textClass}`}
                                />
                                {guardando === key && <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mt-0.5" />}
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-3 text-center">
                          Cambia el número y presiona Enter · Rojo = agotado · Amarillo = stock bajo
                        </p>
                      </>
                    )
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
