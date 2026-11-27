'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'

interface Props { product: Product }

const TIPO_BADGE: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
  color: 'Lentes de color', solucion: 'Cuidado visual', gota: 'Gotas',
}

const money = (value: number) => 'RD$' + Number(value || 0).toLocaleString('es-DO')
const formatProductName = (name: string) => name.trim().toLocaleUpperCase('es')

export default function ProductCard({ product }: Props) {
  const [isFav, setIsFav] = React.useState(false)
  const href = '/producto/' + ((product as any).slug || product.id)
  const days = Number((product as any).dias_uso || 0)
  const colors = ((product as any).colores_disponibles || []) as string[]
  const stock = Number(product.stock || 0)
  const stockCritical = stock > 0 && stock <= 4

  const details = product.tipo === 'color'
    ? [colors.length ? colors.length + ' colores disponibles' : null, 'Caja con 2 lentes'].filter(Boolean) as string[]
    : days === 1 ? ['Uso diario · 30 lentes']
    : days === 14 ? ['Reemplazo quincenal · 6 lentes']
    : days === 30 ? ['Reemplazo mensual · 6 lentes']
    : [(product as any).contenido || 'Presentación por caja']

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

  const actionLabel = stock === 0 ? 'Agotado'
    : product.tipo === 'color' ? 'Elegir color'
    : product.tipo === 'torico' || product.tipo === 'multifocal' ? 'Configurar receta'
    : product.tipo === 'esferico' ? 'Elegir graduación'
    : product.tipo === 'solucion' || product.tipo === 'gota' ? 'Ver producto'
    : 'Ver detalles'

  return (
    <article className="group relative grid h-full min-w-0 grid-rows-[auto_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,35,65,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-white">
        <Link href={href} aria-label={'Ver ' + product.nombre} className="absolute inset-0">
          {product.imagen_url ? <Image src={product.imagen_url} unoptimized alt={product.nombre + (product.marca ? ' — ' + product.marca : '')} fill className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-[1.02]" sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw" /> : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300"><Eye className="h-8 w-8" aria-hidden="true" /><span className="text-xs">Imagen no disponible</span></div>
          )}
        </Link>
        <span className="absolute left-2 top-2 rounded-full border border-white/80 bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#002455] shadow-sm">{TIPO_BADGE[product.tipo || ''] || 'ContactGo'}</span>
        <button type="button" onClick={toggleFav} aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'} className={'absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 shadow-sm transition-colors ' + (isFav ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 hover:text-rose-700')}>
          <Heart className={'h-4 w-4 ' + (isFav ? 'fill-current' : '')} aria-hidden="true" />
        </button>
        {product.stock === 0 && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">Agotado</span></div>}
        {stockCritical && <span className="absolute bottom-2 right-2 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-900">Últimas unidades</span>}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 p-2 sm:p-2.5">
        <div className="flex min-w-0 items-center justify-between gap-1">
          <p className="min-w-0 truncate text-[10px] font-bold uppercase tracking-wide text-slate-500">{product.marca || 'ContactGo'}</p>
          <Link href={'/comparar?p=' + ((product as any).slug || product.id)} className="shrink-0 text-[10px] font-semibold text-slate-500 underline-offset-2 hover:text-[#002455] hover:underline">Comparar</Link>
        </div>

        <Link href={href} className="block min-w-0 text-[12px] font-extrabold uppercase leading-[1.25] tracking-[0.01em] text-[#002455] transition-colors hover:text-[#009da2] sm:text-sm">
          <h3 className="line-clamp-2 min-h-[30px] break-words">{formatProductName(product.nombre)}</h3>
        </Link>

        <p className="truncate text-[11px] leading-4 text-slate-600">
          {details[0] || 'Presentación por caja'}
        </p>

        <div className="mt-0.5 border-t border-slate-100 pt-1.5">
          <div className="flex min-w-0 items-center justify-between gap-1.5">
            <p className="truncate text-sm font-extrabold tracking-tight text-[#002455] sm:text-base">{money(Number(product.precio))}</p>
            <span className={'shrink-0 text-[9px] font-bold ' + (product.stock === 0 ? 'text-rose-700' : stockCritical ? 'text-amber-800' : 'text-emerald-800')}>
              {product.stock === 0 ? 'Agotado' : stockCritical ? 'Pocas unidades' : 'Disponible'}
            </span>
          </div>
          <Link href={href} aria-disabled={stock === 0} onClick={e => { if (stock === 0) e.preventDefault() }} className={'mt-1.5 flex min-h-8 w-full items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002455] focus-visible:ring-offset-2 ' + (stock === 0 ? 'pointer-events-none bg-slate-100 text-slate-500' : 'bg-[#01B2B7] text-white hover:bg-[#009da2]')}>
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />{actionLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
