'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import toast from 'react-hot-toast'

interface Product {
  id: string; nombre: string; slug: string; precio: number; imagen_url?: string; tipo: string
}

const TITLES: Record<string, string> = {
  esferico:   '+ Agrega tu solución',
  torico:     '+ Agrega tu solución',
  multifocal: '+ Agrega tu solución',
  color:      '+ Agrega tu solución',
}

export default function InlineCrossSell({ tipo, currentId }: { tipo: string; currentId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [added, setAdded]     = useState(false)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    fetch(`/api/cross-selling?tipos=solucion&exclude=${currentId}&limit=1`)
      .then(r => r.json())
      .then(d => setProduct(d.products?.[0] ?? null))
      .catch(() => {})
  }, [currentId])

  if (!product) return null

  const handleAdd = () => {
    addItem(product as any, { cantidad: 1, precio_override: product.precio } as any)
    setAdded(true)
    toast.success('Solución añadida al carrito ✓')
  }

  return (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 p-3 flex items-center gap-3">
      <Link href={`/producto/${product.slug}`} className="shrink-0">
        {product.imagen_url
          ? <Image src={product.imagen_url} alt={product.nombre} width={44} height={44}
              className="object-contain rounded-xl bg-white border border-gray-100" unoptimized />
          : <div className="w-11 h-11 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg">💧</div>
        }
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-primary-600 uppercase tracking-wide">{TITLES[tipo] ?? '+ Completa tu kit'}</p>
        <p className="text-xs font-semibold text-gray-800 truncate">{product.nombre}</p>
        <p className="text-sm font-black text-gray-900">RD${Number(product.precio).toLocaleString()}</p>
      </div>
      {added ? (
        <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-xl border border-green-200 shrink-0">
          ✓ Añadido
        </span>
      ) : (
        <button onClick={handleAdd}
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-2.5 transition-colors active:scale-95">
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
