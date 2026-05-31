'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'
import { trackEcommerce } from '@/lib/analytics'
import { getEntrega } from '@/lib/delivery-times'
import toast from 'react-hot-toast'

interface Props { product: Product; isBestseller?: boolean }

const TIPO_BADGE: Record<string, { label: string; color: string }> = {
  esferico:   { label: 'Esférico',   color: 'bg-blue-100 text-blue-700' },
  torico:     { label: 'Tórico',     color: 'bg-purple-100 text-purple-700' },
  multifocal: { label: 'Multifocal', color: 'bg-amber-100 text-amber-700' },
  color:      { label: 'Color',      color: 'bg-pink-100 text-pink-700' },
  solucion:   { label: 'Solución',   color: 'bg-teal-100 text-teal-700' },
  gota:       { label: 'Gotas',      color: 'bg-cyan-100 text-cyan-700' },
}

// Calcula días totales de uso por caja


export default function ProductCard({ product, isBestseller }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const needsRx = ['esferico','torico','multifocal'].includes(product.tipo ?? '')
  const [isFav, setIsFav] = React.useState(false)

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/cuenta'; return }
    if (isFav) {
      await sb.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id)
    } else {
      await sb.from('favorites').insert({ user_id: user.id, product_id: product.id })
    }
    setIsFav(!isFav)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsRx) { window.location.href = `/producto/${(product as any).slug || product.id}`; return }
    addItem(product)
    toast.success(`${product.nombre} agregado`)
    trackEcommerce('add_to_cart', {
      items: [{ item_id: product.id, item_name: product.nombre, item_brand: product.marca ?? '', item_category: product.tipo ?? '', price: product.precio, quantity: 1 }],
      value: product.precio
    })
  }

  const badge = product.tipo ? TIPO_BADGE[product.tipo] : null
  const stockCritical = product.stock > 0 && product.stock <= 4

  // Etiqueta de contenido
  const contenidoLabel = product.tipo === 'gota' || product.tipo === 'solucion'
    ? '1 frasco'
    : (product as any).dias_uso === 1 ? 'caja de 30u'
    : (product as any).dias_uso === 14 ? 'caja de 6u'
    : (product as any).dias_uso === 30 ? 'caja de 6u'
    : product.tipo === 'color' ? '2 lentes'
    : (product as any).contenido ?? 'por caja'

  return (
    <Link
      href={`/producto/${(product as any).slug || product.id}`}
      className="card group flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      {/* ── Imagen ── */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {/* Favorito */}
        <button onClick={toggleFav}
          aria-label={isFav ? `Quitar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`}
          className={"absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm " + (isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-400')}>
          <Heart className={"w-3.5 h-3.5 " + (isFav ? 'fill-current' : '')} aria-hidden="true" />
        </button>

        {/* Días badge */}
        {(product as any).dias_uso && (
          <span className="absolute bottom-2 left-2 z-10 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md">
            {(product as any).dias_uso === 1 ? 'Diario' : (product as any).dias_uso === 14 ? 'Quincenal' : 'Mensual'}
          </span>
        )}
        {/* MEJORA-1: Aviso entrega especial para tóricos y multifocales */}
        {(product.tipo === 'torico' || product.tipo === 'multifocal') && (
          <span className="absolute bottom-2 right-2 z-10 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md leading-tight">
            ⏱ 25-30 días
          </span>
        )}

        {product.imagen_url ? (
          <Image
            src={product.imagen_url} unoptimized
            alt={`${product.nombre}${product.marca ? ' — ' + product.marca : ''} — lente de contacto en República Dominicana`}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-100">
            <Eye className="w-10 h-10 text-gray-300" aria-hidden="true" />
            <span className="text-[10px] text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Badge tipo + bestseller */}
        <div className="absolute top-2 left-2 pointer-events-none flex flex-col gap-1">
          {isBestseller && (
            <span className="badge text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500 text-white">
              🔥 Más vendido
            </span>
          )}
          {badge && (
            <span className={`badge text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>

        {/* Stock crítico */}
        {stockCritical && (
          <div className="absolute top-2 right-8 pointer-events-none">
            <span className="badge bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
              ¡Solo {product.stock}!
            </span>
          </div>
        )}

        {/* Sin stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="badge bg-gray-100 text-gray-500 text-xs">Sin stock</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        {/* Marca */}
        <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest truncate">
          {product.marca}
        </p>

        {/* Nombre */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug min-h-[2.5rem]">
          {product.nombre}
        </h3>

        {/* Stock real + duración en meses MEJORA-4 */}
        <div className="flex items-center justify-between gap-1">
          <p className="text-[10px] font-semibold">
            {product.stock === 0
              ? <span className="text-red-500">Sin stock</span>
              : product.stock <= 4
                ? <span className="text-orange-700">¡Solo {product.stock}!</span>
                : <span className="text-green-700">✅ En stock</span>
            }
          </p>
          {/* Duración en meses por caja */}
          {product.tipo && ['esferico','torico','multifocal','color'].includes(product.tipo) && (product as any).dias_uso && (
            <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
              {(product as any).dias_uso === 1  ? '30u = 1 mes'  :
               (product as any).dias_uso === 14 ? '6u = 3 meses' :
               (product as any).dias_uso === 30 ? '6u = 6 meses' : null}
            </span>
          )}
        </div>

        {/* Precio + precio/día */}
        <div className="mt-auto pt-1.5 flex flex-col gap-2">
          <div>
            {(product as any).precio_anterior && (product as any).precio_anterior > product.precio ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <p className="text-base font-bold text-gray-900">RD${product.precio.toLocaleString()}</p>
                <p className="text-xs text-gray-400 line-through">RD${(product as any).precio_anterior.toLocaleString()}</p>
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  -{Math.round(((product as any).precio_anterior - product.precio) / (product as any).precio_anterior * 100)}%
                </span>
              </div>
            ) : (
              <p className="text-base font-bold text-gray-900">RD${product.precio.toLocaleString()}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] text-gray-400">{contenidoLabel}</p>

            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={product.stock === 0 ? `${product.nombre} sin stock` : needsRx ? `Ver opciones de ${product.nombre}` : `Agregar ${product.nombre} al carrito`}
            className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{needsRx ? 'Ver opciones' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
