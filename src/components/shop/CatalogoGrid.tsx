'use client'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import ViewItemListTracker from '@/components/analytics/ViewItemListTracker'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export default function CatalogoGrid({ products }: Props) {
  const sp = useSearchParams()
  const tipo     = sp.get('tipo')     ?? ''
  const marca    = sp.get('marca')    ?? ''
  const q        = sp.get('q')        ?? ''
  const orden    = sp.get('orden')    ?? 'nombre'
  const duracion = sp.get('duracion') ?? ''

  const filtered = useMemo(() => {
    let result = [...products]
    if (tipo)     result = result.filter(p => p.tipo === tipo)
    if (marca)    result = result.filter(p => p.marca?.toLowerCase().includes(marca.toLowerCase()))
    if (q)        result = result.filter(p => p.nombre?.toLowerCase().includes(q.toLowerCase()))
    if (duracion) result = result.filter(p => (p as any).dias_uso === parseInt(duracion))

    switch (orden) {
      case 'precio_asc':  result.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));  break
      case 'precio_desc': result.sort((a, b) => (b.precio ?? 0) - (a.precio ?? 0)); break
      case 'novedad':     break  // orden del servidor (created_at desc)
      default:            result.sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''))
    }
    return result
  }, [products, tipo, marca, q, orden, duracion])

  if (filtered.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-gray-600 font-semibold text-lg">No encontramos productos</p>
      <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros</p>
      <a href="/catalogo" className="mt-4 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Ver todos los productos</a>
    </div>
  )

  return (
    <>
      <ViewItemListTracker
        items={filtered.map(p => ({ id: p.id, nombre: p.nombre, marca: p.marca, tipo: p.tipo, precio: p.precio }))}
        listName={tipo ? `Catálogo — ${tipo}` : 'Catálogo'}
      />
      <p className="text-gray-500 text-xs mb-3">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  )
}
