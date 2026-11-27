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

const formatProductName = (name: string) =>
  name.toLocaleLowerCase('es').replace(/(^|[\s-])([\p{L}])/gu, (_, separator, letter) => separator + letter.toLocaleUpperCase('es'))

export default function ProductCard({ product }: Props) {
  const [isFav, setIsFav] = React.useState(false)
  const href = '/producto/' + ((product as any).slug || product.id)
  const days = Number((product as any).dias_uso || 0)
  const colors = ((product as any).colores_disponibles || []) as string[]
  const stock = Number(product.stock || 0)
  const stockCritical = stock > 0 && stock <= 4

  const details = product.tipo === 'color'
    ? [
        colors.length ? colors.length + ' colores disponibles' : null,
        'Caja con 2 lentes',
      ].filter(Boolean) as string[]
    : days === 1
      ? ['Uso diario · 30 lentes']
      : days === 14
        ? ['Reemplazo quincenal · 6 lentes']
        : days === 30
          ? ['Reemplazo mensual · 6 lentes']
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
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,35,65,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-white">
        <Link href={href} aria-label={'Ver ' + product.nombre} className="absolute inset-0">
          {product.imagen_url ? (
            <Image src={product.imagen_url} unoptimized alt={product.nombre + (product.marca ? ' — ' + product.marca : '')} fill
              className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300">
              <Eye className="h-8 w-8" aria-hidden="true" /><span className="text-[10px]">Imagen no disponible</span>
            </div>
          )}
        </Link>
        <span className="absolute left-2 top-2 rounded-full border border-white/80 bg-white/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#002455] shadow-sm">
          {TIPO_BADGE[product.tipo || ''] || 'ContactGo'}
        </span>
        <button type="button" onClick={toggleFav} aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={'absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/80 shadow-sm transition-colors ' + (isFav ? 'bg-rose-500 text-white' : 'bg-white/95 text-slate-600 hover:text-rose-600')}>
          <Heart className={'h-3.5 w-3.5 ' + (isFav ? 'fill-current' : '')} aria-hidden="true" />
        </button>
        {product.stock === 0 && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Agotado</span></div>}
        {stockCritical && <span className="absolute bottom-2 right-2 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-800">Últimas unidades</span>}
      </div>

      <div className="p-2">
        <div className="mb-0.5 flex items-center justify-between gap-1">
          <p className="truncate text-[8px] font-bold uppercase tracking-[0.07em] text-slate-500">{product.marca || 'ContactGo'}</p>
          <Link href={'/comparar?p=' + ((product as any).slug || product.id)} className="shrink-0 text-[9px] font-semibold text-slate-400 underline-offset-2 hover:text-[#002455] hover:underline">Comparar</Link>
        </div>
        <Link href={href} className="mb-1 block text-[15px] font-extrabold leading-[1.15] text-[#002455] transition-colors hover:text-[#009da2] sm:text-base">
          <h3 className="line-clamp-2">{formatProductName(product.nombre)}</h3>
        </Link>

        <div className="space-y-0">
          {details.map((detail, index) => (
            <p key={index} className="truncate text-[10px] leading-[15px] text-slate-600">{detail}</p>
          ))}
        </div>

        <div className="mt-1.5 border-t border-slate-100 pt-1.5">
          <div className="flex items-end justify-between gap-1.5">
            <div className="min-w-0">
              <p className="text-[8px] font-medium uppercase tracking-wide text-slate-400">Precio</p>
              <p className="truncate text-base font-extrabold tracking-tight text-[#002455] sm:text-lg">{money(Number(product.precio))}</p>
            </div>
            <span className={'mb-0.5 shrink-0 text-[8px] font-semibold ' + (product.stock === 0 ? 'text-rose-600' : stockCritical ? 'text-amber-700' : 'text-emerald-700')}>
              {product.stock === 0 ? 'No disponible' : stockCritical ? 'Pocas unidades' : 'Disponible'}
            </span>
          </div>
          <Link href={href} aria-disabled={stock === 0}
            onClick={e => { if (stock === 0) e.preventDefault() }}
            className={'mt-1.5 flex min-h-8 w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002455] focus-visible:ring-offset-2 ' + (stock === 0 ? 'pointer-events-none bg-slate-100 text-slate-400' : 'bg-[#01B2B7] text-white hover:bg-[#009da2]')}>
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
