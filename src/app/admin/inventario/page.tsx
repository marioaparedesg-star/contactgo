'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { AlertTriangle, Package, Search, ChevronDown, ChevronRight, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const sb = createClient()

type Producto = {
  id: string
  nombre: string
  tipo: string
  marca: string
  stock: number
  activo: boolean
  precio: number
}

type Inventario = {
  id: string
  product_id: string
  sph: number
  stock: number
}

export default function InventarioPage() {
  const [productos, setProductos]   = useState<Producto[]>([])
  const [inventario, setInventario] = useState<Record<string, Inventario[]>>({})
  const [expandido, setExpandido]   = useState<string | null>(null)
  const [editando, setEditando]     = useState<Record<string, number>>({})  // key: productId-sph
  const [busqueda, setBusqueda]     = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos')
  const [loading, setLoading]       = useState(true)
  const [guardando, setGuardando]   = useState<string | null>(null)

  const cargarProductos = useCallback(async () => {
    setLoading(true)
    const { data } = await sb.from('products')
      .select('id, nombre, tipo, marca, stock, activo, precio')
      .in('tipo', ['esferico', 'color', 'torico', 'multifocal'])
      .order('tipo').order('nombre')
    setProductos(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { cargarProductos() }, [cargarProductos])

  const cargarInventario = async (productId: string) => {
    if (inventario[productId]) return // ya cargado
    const { data } = await sb.from('product_inventory')
      .select('*')
      .eq('product_id', productId)
      .order('sph')
    setInventario(prev => ({ ...prev, [productId]: data ?? [] }))
  }

  const toggleExpand = async (productId: string, tipo: string) => {
    if (tipo === 'torico' || tipo === 'multifocal') return // no tienen inventario por SPH
    if (expandido === productId) {
      setExpandido(null)
    } else {
      setExpandido(productId)
      await cargarInventario(productId)
    }
  }

  const setStockEdit = (productId: string, sph: number, valor: number) => {
    setEditando(prev => ({ ...prev, [`${productId}-${sph}`]: valor }))
  }

  const guardarStock = async (item: Inventario) => {
    const key = `${item.product_id}-${item.sph}`
    const nuevoStock = editando[key]
    if (nuevoStock === undefined || nuevoStock === item.stock) return

    setGuardando(key)
    const { error } = await sb.from('product_inventory')
      .update({ stock: nuevoStock, updated_at: new Date().toISOString() })
      .eq('id', item.id)

    if (!error) {
      setInventario(prev => ({
        ...prev,
        [item.product_id]: prev[item.product_id].map(i =>
          i.id === item.id ? { ...i, stock: nuevoStock } : i
        )
      }))
      setEditando(prev => { const n = { ...prev }; delete n[key]; return n })
      toast.success(`SPH ${item.sph > 0 ? '+' : ''}${item.sph} → ${nuevoStock} unidades`)
    } else {
      toast.error('Error al guardar')
    }
    setGuardando(null)
  }

  const guardarTodos = async (productId: string) => {
    const items = inventario[productId] ?? []
    const pendientes = items.filter(i => editando[`${productId}-${i.sph}`] !== undefined)
    if (pendientes.length === 0) return

    setGuardando(productId)
    for (const item of pendientes) {
      const key = `${productId}-${item.sph}`
      const nuevoStock = editando[key]
      if (nuevoStock === undefined) continue
      await sb.from('product_inventory')
        .update({ stock: nuevoStock, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    }

    setInventario(prev => ({
      ...prev,
      [productId]: prev[productId].map(i => {
        const key = `${productId}-${i.sph}`
        return editando[key] !== undefined ? { ...i, stock: editando[key] } : i
      })
    }))
    setEditando(prev => {
      const n = { ...prev }
      pendientes.forEach(i => delete n[`${productId}-${i.sph}`])
      return n
    })
    toast.success(`${pendientes.length} dioptría${pendientes.length !== 1 ? 's' : ''} actualizadas`)
    setGuardando(null)
  }

  const productosFiltrados = productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.marca.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = tipoFiltro === 'todos' || p.tipo === tipoFiltro
    return matchBusqueda && matchTipo
  })

  const TIPOS = ['todos', 'esferico', 'color', 'torico', 'multifocal']

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventario por Dioptría</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona el stock de cada graduación SPH para esféricos y color.
          Tóricos y multifocales se piden a pedido — no requieren inventario.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIPOS.map(t => (
            <button key={t} onClick={() => setTipoFiltro(t)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                tipoFiltro === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {t === 'todos' ? 'Todos' : t === 'esferico' ? 'Esféricos' : t === 'color' ? 'Color' : t === 'torico' ? 'Tóricos' : 'Multifocales'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        {productosFiltrados.map(p => {
          const esPedidoAMedida = p.tipo === 'torico' || p.tipo === 'multifocal'
          const estaExpandido = expandido === p.id
          const items = inventario[p.id] ?? []
          const pendientesCount = items.filter(i => editando[`${p.id}-${i.sph}`] !== undefined).length
          const stockTotal = items.reduce((acc, i) => {
            const key = `${p.id}-${i.sph}`
            return acc + (editando[key] ?? i.stock)
          }, 0)
          const sinStock = items.filter(i => (editando[`${p.id}-${i.sph}`] ?? i.stock) === 0).length
          const stockBajo = items.filter(i => {
            const s = editando[`${p.id}-${i.sph}`] ?? i.stock
            return s > 0 && s <= 2
          }).length

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header del producto */}
              <button
                onClick={() => toggleExpand(p.id, p.tipo)}
                disabled={esPedidoAMedida}
                className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${
                  esPedidoAMedida ? 'cursor-default opacity-70' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{p.nombre}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.tipo === 'esferico' ? 'bg-blue-100 text-blue-700' :
                      p.tipo === 'color' ? 'bg-pink-100 text-pink-700' :
                      p.tipo === 'torico' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.tipo === 'esferico' ? 'Esférico' : p.tipo === 'color' ? 'Color' : p.tipo === 'torico' ? 'Tórico' : 'Multifocal'}
                    </span>
                    <span className="text-xs text-gray-400">{p.marca}</span>
                    {esPedidoAMedida && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Se pide a medida — sin inventario por SPH
                      </span>
                    )}
                  </div>
                  {!esPedidoAMedida && estaExpandido && items.length > 0 && (
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>{items.length} dioptría{items.length !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{stockTotal} unidades totales</span>
                      {sinStock > 0 && <span className="text-red-500">· {sinStock} agotadas</span>}
                      {stockBajo > 0 && <span className="text-amber-500">· {stockBajo} en stock bajo</span>}
                    </div>
                  )}
                </div>

                {!esPedidoAMedida && (
                  <div className="flex items-center gap-3">
                    {pendientesCount > 0 && (
                      <button
                        onClick={e => { e.stopPropagation(); guardarTodos(p.id) }}
                        disabled={guardando === p.id}
                        className="flex items-center gap-1.5 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Guardar {pendientesCount}
                      </button>
                    )}
                    {estaExpandido ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                )}
              </button>

              {/* Grid de dioptrías */}
              {estaExpandido && !esPedidoAMedida && (
                <div className="border-t border-gray-100 p-4">
                  {items.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Cargando dioptrías...</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                      {items.map(item => {
                        const key = `${p.id}-${item.sph}`
                        const stockActual = editando[key] ?? item.stock
                        const modificado = editando[key] !== undefined && editando[key] !== item.stock
                        const sphLabel = item.sph > 0 ? `+${item.sph}` : `${item.sph}`

                        return (
                          <div key={item.id} className={`border rounded-xl p-2 text-center transition-colors ${
                            modificado ? 'border-primary-300 bg-primary-50' :
                            stockActual === 0 ? 'border-red-200 bg-red-50' :
                            stockActual <= 2 ? 'border-amber-200 bg-amber-50' :
                            'border-gray-100 bg-gray-50'
                          }`}>
                            <p className="text-[10px] font-bold text-gray-600 mb-1">{sphLabel}</p>
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={stockActual}
                              onChange={e => setStockEdit(p.id, item.sph, Math.max(0, parseInt(e.target.value) || 0))}
                              onBlur={() => guardarStock(item)}
                              onKeyDown={e => e.key === 'Enter' && guardarStock(item)}
                              className={`w-full text-center text-sm font-bold border-0 bg-transparent outline-none focus:ring-1 focus:ring-primary-400 rounded ${
                                stockActual === 0 ? 'text-red-600' :
                                stockActual <= 2 ? 'text-amber-600' :
                                modificado ? 'text-primary-700' :
                                'text-gray-900'
                              }`}
                            />
                            {guardando === key && (
                              <div className="w-3 h-3 border border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mt-1" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Haz clic en una dioptría y cambia el número · Enter o clic fuera para guardar · "Guardar X" para guardar todo
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
