'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, X, Search, Check, MessageCircle, Droplets, Wind, Sun, Ruler, Layers, Factory, Globe2 } from 'lucide-react'

type Producto = {
  id: string; nombre: string; marca: string; tipo: string; reemplazo: string
  precio: number; precio_anterior: number | null; contenido: string | null
  curva_base: string | null; diametro: string | null; material: string | null
  oxígeno: string | null; agua: string | null; proteccion_uv: boolean | null
  horas_uso: string | null; uso_recomendado: string | null
  fabricante_nombre: string | null; pais_origen: string | null
  dias_uso: number | null; pares_por_caja: number | null
  imagen_url: string | null; slug: string
}

const TIPO_LABEL: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal', color: 'De color',
}

const MAX_COMPARAR = 4

export default function ComparadorClient({ productos }: { productos: Producto[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [buscando, setBuscando] = useState(false)
  const [query, setQuery] = useState('')

  // Precargar desde la URL (?p=slug1,slug2) para poder compartir/enlazar comparaciones
  useEffect(() => {
    const p = searchParams.get('p')
    if (p) {
      const slugs = p.split(',')
      const ids = slugs.map(s => productos.find(pr => pr.slug === s)?.id).filter(Boolean) as string[]
      if (ids.length) setSeleccionados(ids.slice(0, MAX_COMPARAR))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const agregar = (id: string) => {
    if (seleccionados.includes(id) || seleccionados.length >= MAX_COMPARAR) return
    const nuevos = [...seleccionados, id]
    setSeleccionados(nuevos)
    actualizarUrl(nuevos)
    setBuscando(false); setQuery('')
  }
  const quitar = (id: string) => {
    const nuevos = seleccionados.filter(s => s !== id)
    setSeleccionados(nuevos)
    actualizarUrl(nuevos)
  }
  const actualizarUrl = (ids: string[]) => {
    const slugs = ids.map(id => productos.find(p => p.id === id)?.slug).filter(Boolean)
    router.replace(slugs.length ? `/comparar?p=${slugs.join(',')}` : '/comparar', { scroll: false })
  }

  const productosSeleccionados = useMemo(
    () => seleccionados.map(id => productos.find(p => p.id === id)!).filter(Boolean),
    [seleccionados, productos]
  )

  const resultados = useMemo(() => {
    if (!query.trim()) return productos.slice(0, 8)
    const q = query.toLowerCase()
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, productos])

  type Fila = { label: string; icon: any; get: (p: Producto) => string | null; unidad?: string }
  const filas: Fila[] = [
    { label: 'Marca', icon: Factory, get: p => p.marca },
    { label: 'Tipo', icon: Layers, get: p => TIPO_LABEL[p.tipo] ?? p.tipo },
    { label: 'Reemplazo', icon: Layers, get: p => p.reemplazo },
    { label: 'Contenido', icon: Layers, get: p => p.contenido },
    { label: 'Curva base', icon: Ruler, get: p => p.curva_base ? `${p.curva_base} mm` : null },
    { label: 'Diámetro', icon: Ruler, get: p => p.diametro ? `${p.diametro} mm` : null },
    { label: 'Material', icon: Layers, get: p => p.material },
    { label: 'Contenido de agua', icon: Droplets, get: p => p.agua },
    { label: 'Transmisión de oxígeno', icon: Wind, get: p => p.oxígeno },
    { label: 'Protección UV', icon: Sun, get: p => p.proteccion_uv === true ? 'Sí' : p.proteccion_uv === false ? 'No' : null },
    { label: 'Uso recomendado', icon: Sun, get: p => p.horas_uso ?? p.uso_recomendado },
    { label: 'País de origen', icon: Globe2, get: p => p.pais_origen },
    { label: 'Fabricante', icon: Factory, get: p => p.fabricante_nombre },
  ]

  const filasConDatos = filas.filter(f => productosSeleccionados.some(p => f.get(p)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-2">ContactGo® · Comparador</p>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Compara lentes de contacto lado a lado</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Precio, curva base, diámetro, material, contenido de agua, oxígeno y más — con datos reales de cada producto, para que elijas con seguridad antes de comprar.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Selector de productos */}
        <div className="flex flex-wrap gap-3 mb-8">
          {productosSeleccionados.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl pl-3 pr-2 py-2 shadow-sm">
              <span className="text-xs font-bold text-gray-800 max-w-[140px] truncate">{p.nombre}</span>
              <button onClick={() => quitar(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {seleccionados.length < MAX_COMPARAR && (
            <div className="relative">
              <button
                onClick={() => setBuscando(!buscando)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl px-3 py-2.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Agregar producto
              </button>

              {buscando && (
                <div className="absolute z-20 top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 mb-2">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      autoFocus
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Buscar por nombre o marca..."
                      className="text-sm w-full outline-none"
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {resultados.map(p => (
                      <button
                        key={p.id}
                        onClick={() => agregar(p.id)}
                        disabled={seleccionados.includes(p.id)}
                        className="w-full flex items-center gap-3 text-left px-2 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
                      >
                        <div className="w-9 h-9 bg-gray-50 rounded-lg overflow-hidden shrink-0 relative">
                          {p.imagen_url && <Image src={p.imagen_url} alt="" fill className="object-contain p-1" unoptimized />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{p.nombre}</p>
                          <p className="text-[10px] text-gray-400">{p.marca} · RD${p.precio.toLocaleString()}</p>
                        </div>
                        {seleccionados.includes(p.id) && <Check className="w-4 h-4 text-primary-600 shrink-0" />}
                      </button>
                    ))}
                    {resultados.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {productosSeleccionados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Agrega 2 o más productos arriba para empezar a comparar.</p>
          </div>
        ) : productosSeleccionados.length === 1 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-sm">Agrega al menos un producto más para ver la comparación.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Cabecera: imagen, nombre, precio, CTA */}
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 w-40 sticky left-0 bg-white"></th>
                    {productosSeleccionados.map(p => (
                      <th key={p.id} className="p-4 min-w-[180px] text-center align-top">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden mx-auto mb-2 relative">
                          {p.imagen_url && <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-2" unoptimized />}
                        </div>
                        <Link href={`/producto/${p.slug}`} className="text-xs font-black text-gray-900 leading-tight hover:text-primary-600 block mb-1">
                          {p.nombre}
                        </Link>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">{p.marca}</p>
                        <p className="text-base font-black text-primary-600 mb-3">RD${p.precio.toLocaleString()}</p>
                        <a
                          href={`https://wa.me/18096942268?text=${encodeURIComponent(`Hola, quiero cotizar ${p.nombre}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-green-600 hover:bg-green-700 rounded-full px-3 py-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" /> Cotizar
                        </a>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filasConDatos.map((fila, i) => {
                    const valores = productosSeleccionados.map(p => fila.get(p))
                    const todosIguales = valores.every(v => v === valores[0])
                    const Icon = fila.icon
                    return (
                      <tr key={fila.label} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                        <td className="p-4 sticky left-0 bg-inherit">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {fila.label}
                          </div>
                        </td>
                        {productosSeleccionados.map((p, idx) => (
                          <td key={p.id} className="p-4 text-center">
                            <span className={`text-xs ${todosIguales ? 'text-gray-400' : 'font-bold text-gray-900'}`}>
                              {fila.get(p) ?? '—'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-6 text-center max-w-xl mx-auto">
          Los valores resaltados en negro indican dónde hay diferencia real entre los productos comparados. Datos verificados del fabricante de cada línea — si tienes dudas sobre cuál se ajusta a tu receta, escríbenos por WhatsApp.
        </p>
      </div>
    </div>
  )
}
