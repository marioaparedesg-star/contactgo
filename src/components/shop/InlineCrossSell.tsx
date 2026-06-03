'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import toast from 'react-hot-toast'

interface Product {
  id: string; nombre: string; slug: string; precio: number; imagen_url?: string; tipo: string
}

/**
 * MEJORA 6: Bundle lente + solución en PDP.
 * Sugiere la solución más popular. Si el tipo es multifocal o tórico,
 * muestra el bundle con énfasis en que los lentes quincenales/mensuales requieren solución.
 */
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

  // Para lentes diarios no sugerir solución (no la necesitan)
  // Los lentes de color sí la necesitan
  const needsSolution = ['esferico','torico','multifocal','color'].includes(tipo)
  if (!needsSolution) return null

  const handleAdd = () => {
    addItem(product as any, { cantidad: 1, precio_override: product.precio } as any)
    setAdded(true)
    toast.success('Solución añadida al carrito ✓')
  }

  // Mensaje contextual según el tipo de lente
  const msgs: Record<string,string> = {
    torico:     '+ Solución para tus lentes quincenales',
    multifocal: '+ Solución para tus lentes mensuales',
    color:      '+ Solución para mantener tus lentes de color',
    esferico:   '+ Solución de limpieza',
  }
  const titleMsg = msgs[tipo] ?? '+ Agrega tu solución'

  return (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/50 p-3">
      <p className="text-[10px] font-black text-primary-600 uppercase tracking-wide mb-2">{titleMsg}</p>
      <div className="flex items-center gap-3">
        <Link href={`/producto/${product.slug}`} className="shrink-0">
          {product.imagen_url
            ? <Image src={product.imagen_url} alt={product.nombre} width={44} height={44}
                className="object-contain rounded-xl bg-white border border-gray-100" sizes="44px" unoptimized />
            : <div className="w-11 h-11 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-lg">💧</div>
          }
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 truncate">{product.nombre}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-sm font-black text-gray-900">RD${Number(product.precio).toLocaleString()}</p>
            <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded">Envío gratis con tu pedido</span>
          </div>
        </div>
        {added ? (
          <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-xl border border-green-200 shrink-0 flex items-center gap-1">
            <Check className="w-3 h-3" /> Añadido
          </span>
        ) : (
          <button onClick={handleAdd}
            className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-2.5 transition-colors active:scale-95"
            aria-label={`Agregar ${product.nombre} al carrito`}>
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
