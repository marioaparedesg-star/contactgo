'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'
import toast from 'react-hot-toast'

interface Props { product: Product }

const TIPO_BADGE: Record<string, { label: string; color: string }> = {
  esferico:   { label: 'Esférico',    color: 'bg-blue-100 text-blue-700' },
  torico:     { label: 'Tórico',      color: 'bg-purple-100 text-purple-700' },
  multifocal: { label: 'Multifocal',  color: 'bg-amber-100 text-amber-700' },
  color:      { label: 'Color',       color: 'bg-pink-100 text-pink-700' },
  solucion:   { label: 'Solución',    color: 'bg-teal-100 text-teal-700' },
  gota:       { label: 'Gotas',       color: 'bg-cyan-100 text-cyan-700' },
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const needsRx = ['esferico','torico','multifocal'].includes(product.tipo ?? '')

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsRx && product.sph_disponibles?.length > 0) {
      // Si necesita graduación, redirigir al detalle
      window.location.href = `/producto/${product.id}`
      return
    }
    addItem(product)
    toast.success(`${product.nombre} agregado al carrito`)
  }

  const badge = product.tipo ? TIPO_BADGE[product.tipo] : null
  const stockLow = product.stock > 0 && product.stock <= 5

  return (
    <Link href={`/producto/${product.id}`} className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.imagen_url ? (
          <Image
            src={product.imagen_url}
            alt={product.nombre}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Eye className="w-14 h-14 text-gray-200" />
          </div>
        )}
        {badge && (
          <span className={`absolute top-2 left-2 badge ${badge.color} text-xs`}>
            {badge.label}
          </span>
        )}
        {stockLow && (
          <span className="absolute top-2 right-2 badge bg-orange-100 text-orange-700">
            ¡Últimas!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-gray-100 text-gray-500">Sin stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{product.marca}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{product.nombre}</h3>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900">RD${product.precio.toLocaleString()}</p>
            <p className="text-xs text-gray-400">por unidad</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary !px-3 !py-2 text-sm flex items-center gap-1.5
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {needsRx ? 'Ver' : 'Agregar'}
          </button>
        </div>
      </div>
    </Link>
  )
}
