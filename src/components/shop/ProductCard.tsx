'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Heart, Palette, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'

interface Props { product: Product }

const TIPO_BADGE: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
  color: 'Lentes de color', solucion: 'Cuidado visual', gota: 'Gotas',
}

const money = (value: number) => 'RD$' + Number(value || 0).toLocaleString('es-DO')

export default function ProductCard({ product }: Props) {
  const [isFav, setIsFav] = React.useState(false)
  const href = '/producto/' + ((product as any).slug || product.id)
  const days = Number((product as any).dias_uso || 0)
  const colors = ((product as any).colores_disponibles || []) as string[]
  const stock = Number(product.stock || 0)
  const stockCritical = stock > 0 && stock <= 4
  const contenido = (product as any).contenido || (product.tipo === 'color' ? 'Caja con 2 lentes' : 'Presentación por caja')
  const duration = days === 1 ? 'Uso diario' : days === 14 ? 'Reemplazo quincenal' : days === 30 ? 'Reemplazo mensual' : null

  const details: { icon: React.ReactNode; label: string }[] = []
  if (product.tipo === 'color' && colors.length) {
    details.push({ icon: <Palette className="h-3.5 w-3.5" />, label: colors.length + ' tonos disponibles' })
  }
  if (duration) details.push({ icon: <CalendarDays className="h-3.5 w-3.5" />, label: duration })

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
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,35,65,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-[#F7FAFC] via-[#F2F7F8] to-[#EAF3F5]">
        <Link href={href} aria-label={'Ver ' + product.nombre} className="absolute inset-0">
          {product.imagen_url ? (
            <Image src={product.imagen_url} unoptimized alt={product.nombre + (product.marca ? ' — ' + product.marca : '')} fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
              sizes="(max-width: 400px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300">
              <Eye className="h-10 w-10" aria-hidden="true" /><span className="text-[10px]">Imagen no disponible</span>
            </div>
          )}
        </Link>
        <span className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#002455] shadow-sm">
          {TIPO_BADGE[product.tipo || ''] || 'ContactGo'}
        </span>
        <button type="button" onClick={toggleFav} aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 shadow-sm transition-colors ' + (isFav ? 'bg-rose-500 text-white' : 'bg-white/95 text-slate-600 hover:text-rose-600')}>
          <Heart className={'h-4 w-4 ' + (isFav ? 'fill-current' : '')} aria-hidden="true" />
        </button>
        {product.stock === 0 && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Agotado</span></div>}
        {stockCritical && <span className="absolute bottom-3 right-3 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">Últimas unidades</span>}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <div className="mb-1.5 flex min-h-4 items-center justify-between gap-2">
          <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#008F95]">{product.marca || 'ContactGo'}</p>
          <Link href={'/comparar?p=' + ((product as any).slug || product.id)} className="shrink-0 text-[10px] font-semibold text-slate-400 underline-offset-2 hover:text-[#002455] hover:underline">Comparar</Link>
        </div>
        <Link href={href} className="block text-[13px] font-bold leading-snug text-[#002455] transition-colors hover:text-[#009da2] sm:text-sm">
          <h3 className="line-clamp-2">{product.nombre}</h3>
        </Link>

        <div className="mt-2 space-y-1">
          {details.slice(0, 2).map((detail, index) => (
            <div key={index} className="flex items-center gap-1.5 text-[10px] leading-tight text-slate-600">
              <span className="shrink-0 text-[#008F95]">{detail.icon}</span>
              <span className="line-clamp-1">{detail.label}</span>
            </div>
          ))}
          <p className="truncate text-[10px] text-slate-400">{contenido}</p>
          {product.tipo === 'color' && colors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {colors.slice(0, 3).map(color => <span key={color} title={color} className="max-w-[68px] truncate rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px] leading-none text-slate-500">{color}</span>)}
              {colors.length > 3 && <span className="text-[9px] text-slate-400">+{colors.length - 3}</span>}
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-slate-100 pt-2.5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">Precio</p>
              <p className="text-lg font-extrabold tracking-tight text-[#002455] sm:text-xl">{money(Number(product.precio))}</p>
            </div>
            <span className={'mb-1 text-[9px] font-semibold ' + (product.stock === 0 ? 'text-rose-600' : stockCritical ? 'text-amber-700' : 'text-emerald-700')}>
              {product.stock === 0 ? 'No disponible' : stockCritical ? 'Pocas unidades' : 'Disponible'}
            </span>
          </div>
          <Link href={href} aria-disabled={stock === 0}
            onClick={e => { if (stock === 0) e.preventDefault() }}
            className={'mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002455] focus-visible:ring-offset-2 ' + (stock === 0 ? 'pointer-events-none bg-slate-100 text-slate-400' : 'bg-[#01B2B7] text-white hover:bg-[#009da2]')}>
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
