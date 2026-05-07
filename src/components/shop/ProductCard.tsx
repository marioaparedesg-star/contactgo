'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'
import toast from 'react-hot-toast'

interface Props { product: Product }

const TIPO_BADGE: Record<string, { label: string; color: string }> = {
  esferico:   { label: 'Esférico',   color: 'bg-blue-100 text-blue-700' },
  torico:     { label: 'Tórico',     color: 'bg-purple-100 text-purple-700' },
  multifocal: { label: 'Multifocal', color: 'bg-amber-100 text-amber-700' },
  color:      { label: 'Color',      color: 'bg-pink-100 text-pink-700' },
  solucion:   { label: 'Solución',   color: 'bg-teal-100 text-teal-700' },
  gota:       { label: 'Gotas',      color: 'bg-cyan-100 text-cyan-700' },
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const needsRx = ['esferico','torico','multifocal'].includes(product.tipo ?? '')

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsRx) {
      window.location.href = `/producto/${(product as any).slug || product.id}`
      return
    }
    addItem(product)
    toast.success(`${product.nombre} agregado`)
  }

  const badge = product.tipo ? TIPO_BADGE[product.tipo] : null
  const stockLow = product.stock > 0 && product.stock <= 5

  return (
    <Link
      href={`/producto/${(product as any).slug || product.id}`}
      className="card group flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ── Imagen ── */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {product.imagen_url ? (
          <Image
            src={product.imagen_url}
            alt={product.nombre}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-100">
            <Eye className="w-10 h-10 text-gray-300" />
            <span className="text-[10px] text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badges superiores */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
          {badge && (
            <span className={`badge text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.color}`}>
              {badge.label}
            </span>
          )}
          {stockLow && (
            <span className="badge bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full ml-auto">
              ¡Últimas!
            </span>
          )}
        </div>

        {/* Sin stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="badge bg-gray-100 text-gray-500 text-xs">Sin stock</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* Marca */}
        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest truncate">
          {product.marca}
        </p>

        {/* Nombre — siempre visible completo, wrap natural */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug min-h-[2.5rem]">
          {product.nombre}
        </h3>

        {/* Precio + Botón — siempre en column en móvil */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div>
            <p className="text-base font-bold text-gray-900">
              RD${product.precio.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">por unidad</p>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-1.5
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>{needsRx ? 'Ver opciones' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
