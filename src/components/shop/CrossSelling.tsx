'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Product { id: string; nombre: string; slug: string; precio: number; imagen_url?: string; tipo: string }

const CROSS_MAP: Record<string, string[]> = {
  esferico:  ['solucion', 'gota'],
  torico:    ['solucion', 'gota'],
  multifocal:['solucion', 'gota'],
  color:     ['solucion', 'gota'],
  solucion:  ['gota'],
  gota:      ['solucion'],
}

export default function CrossSelling({ tipo, currentId }: { tipo: string; currentId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    const tipos = CROSS_MAP[tipo] ?? ['solucion']
    fetch(`/api/cross-selling?tipos=${tipos.join(',')}&exclude=${currentId}`)
      .then(r => r.json()).then(d => setProducts(d.products ?? []))
  }, [tipo, currentId])

  if (!products.length) return null

  const titulo = tipo === 'gota' ? 'Completa tu rutina ocular' :
                 tipo === 'solucion' ? 'Añade lubricación extra' :
                 'Completa tu kit de lentes'

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg md:text-xl font-bold text-gray-900">{titulo}</h3>
          <p className="text-gray-500 text-sm">Productos que van perfectos con tu compra</p>
        </div>
        <Link href="/catalogo" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:text-primary-700">
          Ver más <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.slice(0, 4).map(p => (
          <div key={p.id} className="card p-3 flex flex-col gap-2 hover:-translate-y-0.5 transition-all">
            <Link href={`/producto/${p.slug}`}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                {p.imagen_url ? (
                  <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-2" sizes="160px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">💧</div>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{p.nombre}</p>
              <p className="text-primary-600 font-black text-sm">RD${p.precio?.toLocaleString()}</p>
            </Link>
            <button
              onClick={() => addItem({ id: p.id, nombre: p.nombre, precio: p.precio, imagen_url: p.imagen_url, slug: p.slug, tipo: p.tipo })}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all mt-auto">
              <ShoppingCart className="w-3 h-3" /> Agregar
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
