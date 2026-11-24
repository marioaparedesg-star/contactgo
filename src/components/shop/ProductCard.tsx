'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'
import { getEntrega } from '@/lib/delivery-times'

interface Props { product: Product; isBestseller?: boolean }

const TIPO_BADGE: Record<string, { label: string; color: string }> = {
  esferico: { label: 'Esférico', color: 'text-slate-600' },
  torico: { label: 'Tórico', color: 'text-slate-600' },
  multifocal: { label: 'Multifocal', color: 'text-slate-600' },
  color: { label: 'Color', color: 'text-slate-600' },
  solucion: { label: 'Solución', color: 'text-slate-600' },
  gota: { label: 'Gotas', color: 'text-slate-600' },
}

export default function ProductCard({ product, isBestseller }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const [isFav, setIsFav] = React.useState(false)
  const needsRx = ['esferico', 'torico', 'multifocal', 'color'].includes(product.tipo ?? '')
  const href = `/producto/${(product as any).slug || product.id}`
  const badge = product.tipo ? TIPO_BADGE[product.tipo] : null
  const stockCritical = product.stock > 0 && product.stock <= 4
  const diasUso = (product as any).dias_uso
  const contenidoLabel = product.tipo === 'gota' || product.tipo === 'solucion' ? '1 frasco'
    : diasUso === 1 ? 'Caja de 30 unidades'
    : diasUso === 14 || diasUso === 30 ? 'Caja de 6 unidades'
    : product.tipo === 'color' ? '2 lentes'
    : (product as any).contenido ?? 'Por caja'

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/cuenta'; return }
    if (isFav) await sb.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id)
    else await sb.from('favorites').insert({ user_id: user.id, product_id: product.id })
    setIsFav(!isFav)
  }

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-[#F4F6F8]">
        <Link href={href} aria-label={`Ver ${product.nombre}`} className="absolute inset-0">
          {product.imagen_url ? (
            <Image src={product.imagen_url} unoptimized alt={`${product.nombre}${product.marca ? ' — ' + product.marca : ''}`} fill
              className="object-contain p-5 sm:p-6"
              sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-50 text-slate-300">
              <Eye className="h-10 w-10" aria-hidden="true" /><span className="text-[10px]">Imagen no disponible</span>
            </div>
          )}
        </Link>
        <button type="button" onClick={toggleFav} aria-label={isFav ? `Quitar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 shadow-sm transition-colors ${isFav ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 hover:text-rose-600'}`}>
          <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
        <div className="pointer-events-none absolute left-3 top-3 z-[1] flex max-w-[75%] flex-wrap gap-1.5">
          
          {badge && <span className={`border border-slate-200 bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${badge.color}`}>{badge.label}</span>}
        </div>
        {diasUso && <span className="absolute bottom-3 left-3 rounded-sm bg-[#002455] px-2 py-1 text-[10px] font-semibold text-white">
          {diasUso === 1 ? 'Diario' : diasUso === 14 ? 'Quincenal' : 'Mensual'}
        </span>}
        {(product.tipo === 'torico' || product.tipo === 'multifocal') && (
          <span className="absolute bottom-3 right-3 rounded-sm border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-600">
            {getEntrega(product.tipo).etiqueta.replace(/^.*·\s*/, '')}
          </span>
        )}
        {stockCritical && <span className="absolute right-3 top-14 rounded-sm border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700">Últimas {product.stock}</span>}
        {product.stock === 0 && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Agotado</span></div>}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-1.5 flex min-h-4 items-center justify-between gap-2">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#008F95]">{product.marca || 'ContactGo'}</p>
          <Link href={`/comparar?p=${(product as any).slug || product.id}`} className="shrink-0 text-[10px] font-semibold text-slate-400 underline-offset-2 hover:text-[#002455] hover:underline">Comparar</Link>
        </div>
        <Link href={href} className="block min-h-[2.75rem] text-[13px] font-bold leading-snug text-[#002455] sm:text-sm transition-colors hover:text-[#01a3a8]">
          <h3 className="line-clamp-2">{product.nombre}</h3>
        </Link>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className={`text-[10px] font-medium ${product.stock === 0 ? 'text-rose-700' : stockCritical ? 'text-slate-700' : 'text-slate-500'}`}>
            {product.stock === 0 ? 'Sin stock' : stockCritical ? `Solo ${product.stock} disponibles` : 'Disponible'}
          </span>
          <span className="truncate text-[10px] text-slate-400">{contenidoLabel}</span>
        </div>
        <div className="mt-auto border-t border-slate-100 pt-3">
          {product.precio_anterior && product.precio_anterior > product.precio && (
            <div className="mb-0.5 text-[10px] text-slate-400 line-through">RD${Number(product.precio_anterior).toLocaleString()}</div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-xl font-extrabold tracking-tight text-[#002455]">RD${Number(product.precio).toLocaleString()}</p>
            {product.precio_anterior && product.precio_anterior > product.precio && (
              <span className="rounded-sm border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                -{Math.round((1 - product.precio / product.precio_anterior) * 100)}%
              </span>
            )}
          </div>
          <Link href={href} aria-disabled={product.stock === 0}
            onClick={e => { if (product.stock === 0) e.preventDefault() }}
            className={`mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002455] focus-visible:ring-offset-2 ${product.stock === 0 ? 'pointer-events-none bg-slate-100 text-slate-400' : 'bg-[#01B2B7] text-white hover:bg-[#009da2]'}`}>
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {product.stock === 0 ? 'Agotado'
              : product.tipo === 'color' ? 'Elegir color'
              : product.tipo === 'torico' || product.tipo === 'multifocal' ? 'Configurar receta'
              : product.tipo === 'esferico' ? 'Elegir graduación'
              : 'Ver producto'}
          </Link>
        </div>
      </div>
    </article>
  )
}
