'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface Product { id: string; nombre: string; slug: string; precio: number; imagen_url?: string; tipo: string }

const CROSS_MAP: Record<string, string[]> = {
  esferico:   ['solucion', 'gota'],
  torico:     ['solucion', 'gota'],
  multifocal: ['solucion', 'gota'],
  color:      ['solucion', 'gota'],
  solucion:   ['gota'],
  gota:       ['solucion'],
}

export default function CrossSelling({ tipo, currentId }: { tipo: string; currentId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    const tipos = CROSS_MAP[tipo] ?? ['solucion']
    fetch(`/api/cross-selling?tipos=${tipos.join(',')}&exclude=${currentId}`)
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => {})
  }, [tipo, currentId])

  if (!products.length) return null

  const titulo = tipo === 'gota' ? 'Completa tu rutina ocular'
    : tipo === 'solucion' ? 'Añade lubricación extra'
    : 'Completa tu kit de lentes'

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{titulo}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Seleccionados para tu tipo de lente</p>
        </div>
        <Link href="/catalogo" className="text-xs text-primary-600 font-bold flex items-center gap-1 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-xl">
          Ver más <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
        {products.slice(0, 4).map(p => (
          <div key={p.id} className="min-w-[160px] md:min-w-0 snap-start bg-white border border-gray-100 rounded-2xl p-3 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <Link href={`/producto/${p.slug}`}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 group">
                {p.imagen_url
                  ? <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" sizes="160px" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">💧</div>
                }
              </div>
              <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">{p.nombre}</p>
              <p className="text-primary-600 font-black text-sm">RD${p.precio?.toLocaleString()}</p>
            </Link>
            <button
              onClick={() => addItem(p as any)}
              className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.97] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all mt-auto">
              <ShoppingCart className="w-3 h-3" /> Agregar
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
