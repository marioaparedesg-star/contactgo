'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type PriceSpec = null | string | { slug: string; fallback: number }

type Slide = {
  badge:      string
  title:      string
  sub:        string
  subtitle:   string
  cta:        { label: string; href: string }
  cta2:       { label: string; href: string }
  accent:     string
  bg:         { from: string; via: string; to: string }
  glow:       string
  image:      string
  imageAlt:   string
  stats:      { num: string; label: string }[] | null
  tag:        string | null
  precio:     PriceSpec
}

const OASYS_SLUG = 'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana'
const COLORS_SLUG = 'air-optix-colors-lentes-contacto-color-dominicana'
const MULTIFOCAL_SLUG = 'biofinity-multifocal-lentes-presbicia-coopervision-dominicana'

const SLIDES: Slide[] = [
  {
    badge:      '⭐ El más pedido en RD',
    title:      'Ponte tus lentes\ny sal volando',
    sub:        'Comodidad todo el día, uso quincenal.',
    subtitle:   'ACUVUE® OASYS con tecnología HYDRACLEAR® Plus. Te lo llevamos hasta la puerta, listo para usar.',
    cta:        { label: 'Pedir ACUVUE OASYS', href: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana' },
    cta2:       { label: 'Ver toda ACUVUE', href: '/catalogo?marca=acuvue' },
    accent:     '#2563eb',
    bg:         { from: '#010b20', via: '#021030', to: '#031642' },
    glow:       'rgba(37,99,235,0.22)',
    image:      '/hero-oasys.jpg',
    imageAlt:   'ACUVUE OASYS con HYDRACLEAR Plus',
    tag:        '🔥 Más popular',
    precio:     { slug: OASYS_SLUG, fallback: 3700 },
    stats:      null,
  },
  {
    badge:      '🇩🇴 La tienda de lentes más completa de RD',
    title:      'Todas las marcas,\nun solo lugar',
    sub:        'ACUVUE, Air Optix, Biofinity, Bausch+Lomb y más.',
    subtitle:   'Con o sin graduación. Todo lo que necesitas para tus ojos, en un mismo pedido, sin correr de tienda en tienda.',
    cta:        { label: 'Ver catálogo completo', href: '/catalogo' },
    cta2:       { label: 'Buscar con mi receta', href: '/receta' },
    accent:     '#4f46e5',
    bg:         { from: '#050818', via: '#0b1030', to: '#141a42' },
    glow:       'rgba(79,70,229,0.22)',
    image:      '/hero-general.jpg',
    imageAlt:   'Todas las marcas de lentes de contacto en ContactGo',
    tag: null,
    precio: null,
    stats: null,
  },
  {
    badge:      '🎨 +12 tonos disponibles',
    title:      'Otro color,\notra tú',
    sub:        'Con o sin graduación. Envío en 24h.',
    subtitle:   'AIR OPTIX® COLORS en 12 tonos únicos. Cambia tu mirada cuando quieras, sin complicarte.',
    cta:        { label: 'Pedir AIR OPTIX Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    cta2:       { label: 'Ver todos los colores', href: '/catalogo?tipo=color' },
    accent:     '#9333ea',
    bg:         { from: '#0d0618', via: '#180a28', to: '#221038' },
    glow:       'rgba(147,51,234,0.22)',
    image:      '/hero-air-optix-colors.jpg',
    imageAlt:   'AIR OPTIX COLORS — cambia el color de tus ojos',
    tag:        '✨ Sin graduación disponible',
    precio:     { slug: COLORS_SLUG, fallback: 2500 },
    stats: null,
  },
  {
    badge:      '🛵 Directo a tu puerta',
    title:      'Tocan la puerta,\ny son tus lentes',
    sub:        'Sin filas, sin salir de casa.',
    subtitle:   'Pides hoy, llegan mañana. Entrega en 24-48h en Santo Domingo y Santiago, 2-3 días al resto del país.',
    cta:        { label: 'Ver catálogo', href: '/catalogo' },
    cta2:       { label: '¿Cómo funciona?', href: '/envios-y-entregas' },
    accent:     '#d97706',
    bg:         { from: '#160e01', via: '#241a02', to: '#332504' },
    glow:       'rgba(217,119,6,0.20)',
    image:      '/hero-entrega.jpg',
    imageAlt:   'Entrega de lentes de contacto en toda República Dominicana',
    tag: null,
    precio: null,
    stats: null,
  },
  {
    badge:      '👓 Para ver de cerca y de lejos',
    title:      'Lee, maneja y vive\nsin cambiar de lente',
    sub:        'Visión nítida a todas las distancias.',
    subtitle:   'Biofinity® Multifocal. Olvídate de los lentes de armazón para leer — un solo lente para todo tu día.',
    cta:        { label: 'Pedir Biofinity Multifocal', href: '/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana' },
    cta2:       { label: 'Ver multifocales', href: '/catalogo?tipo=multifocal' },
    accent:     '#7c3aed',
    bg:         { from: '#0b0614', via: '#160a26', to: '#201036' },
    glow:       'rgba(124,58,237,0.20)',
    image:      '/hero-multifocal.jpg',
    imageAlt:   'Biofinity Multifocal — visión de cerca y de lejos',
    tag: null,
    precio:     { slug: MULTIFOCAL_SLUG, fallback: 9500 },
    stats: null,
  },
  {
    badge:      '✅ Para toda la familia',
    title:      'Aquí siempre\nhay para ti',
    sub:        'Sin importar tu graduación o marca.',
    subtitle:   'En ContactGo casi siempre tenemos lo que buscas — y si no, te avisamos rápido por WhatsApp.',
    cta:        { label: 'Ver catálogo', href: '/catalogo' },
    cta2:       { label: 'Escríbenos por WhatsApp', href: 'https://wa.me/18096942268?text=Hola%20ContactGo%20%F0%9F%91%8B' },
    accent:     '#059669',
    bg:         { from: '#010f0c', via: '#021d17', to: '#032a22' },
    glow:       'rgba(5,150,105,0.22)',
    image:      '/hero-garantia.jpg',
    imageAlt:   'ContactGo — lentes de contacto para toda la familia',
    tag: null,
    precio: null,
    stats: null,
  },
]

export default function HeroSlider({
  lentesCount = 4200,
  precioOasys,
  preciosHero = {},
}: {
  lentesCount?: number
  precioOasys?: number
  preciosHero?: Record<string, number>
}) {
  const [current, setCurrent]             = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection]         = useState<'next'|'prev'>('next')
  const touchStartX = useRef<number>(0)
  const touchEndX   = useRef<number>(0)
  const autoRef     = useRef<ReturnType<typeof setInterval>|null>(null)

  const goTo = useCallback((idx: number, dir: 'next'|'prev' = 'next') => {
    if (transitioning || idx === current) return
    setDirection(dir)
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 260)
  }, [current, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 'next'), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, 'prev'), [current, goTo])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(next, 6000)
  }, [next])

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [resetAuto])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX }
  const onTouchMove  = (e: React.TouchEvent) => { touchEndX.current   = e.targetTouches[0].clientX }
  const onTouchEnd   = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 44) { diff > 0 ? next() : prev(); resetAuto() }
  }

  useEffect(() => {
    // Guard: Yandex Browser y webviews con window sin document (Sentry JAVASCRIPT-NEXTJS-E)
    try {
      if (typeof window === 'undefined' || !window || !window.document) return
      const handler = (e: KeyboardEvent) => {
        try {
          if (e.key === 'ArrowLeft')  { prev(); resetAuto() }
          if (e.key === 'ArrowRight') { next(); resetAuto() }
        } catch { /* silenciar errores en browsers no estándar */ }
      }
      window.addEventListener('keydown', handler)
      return () => { try { window.removeEventListener('keydown', handler) } catch {} }
    } catch { /* silenciar errores de acceso a window en webviews */ }
  }, [next, prev, resetAuto])

  const s = SLIDES[current]

  // Resuelve el precio a mostrar: dinámico desde Supabase, con fallback si aún no cargó
  const precioTexto = (() => {
    if (!s.precio) return null
    if (typeof s.precio === 'string') return s.precio
    const val = s.precio.slug === OASYS_SLUG && precioOasys
      ? precioOasys
      : (preciosHero[s.precio.slug] ?? s.precio.fallback)
    return `RD$${val.toLocaleString('es-DO')}`
  })()

  const bgStyle = {
    background:  `linear-gradient(135deg, ${s.bg.from} 0%, ${s.bg.via} 55%, ${s.bg.to} 100%)`,
    transition:  'background 600ms ease',
  }

  // ─── Dots shared ──────────────────────────────────────────────────────────
  const Dots = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-1.5 justify-center ${className}`} role="tablist" aria-label="Slides">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Slide ${i + 1}`}
          onClick={() => { goTo(i, i > current ? 'next' : 'prev'); resetAuto() }}
          className="rounded-full transition-all duration-300 focus:outline-none"
          style={{
            width:      i === current ? 18 : 5,
            height:     5,
            background: i === current ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
          }}
        />
      ))}
    </div>
  )

  return (
    <section
      aria-label="Hero — ContactGo lentes de contacto"
      className="relative overflow-hidden select-none min-h-[480px] md:min-h-0"
      style={bgStyle}
    >
      {/* Capa de swipe — intercepta el touch PERO los botones la superan con z-index */}
      <div
        className="absolute inset-0 z-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-hidden="true"
      />
      {/* Ambient glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-16 right-[5%] w-[360px] h-[360px] rounded-full opacity-20 blur-[90px] transition-colors duration-700"
          style={{ background: s.glow }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT — imagen SIEMPRE completa (object-contain, nunca se corta)
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 md:hidden px-5 pt-6 pb-4">
        <div
          className="flex flex-col gap-3 transition-all duration-260 ease-out"
          style={{
            opacity:   transitioning ? 0 : 1,
            transform: transitioning
              ? `translateX(${direction === 'next' ? '-12px' : '12px'})`
              : 'translateX(0)',
          }}
        >
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15">
              {s.badge}
            </span>
            {s.tag && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full">
                {s.tag}
              </span>
            )}
          </div>

          {/* 2. Título */}
          <h1 className="font-display text-3xl font-black text-white leading-[1.08] tracking-tight whitespace-pre-line">
            {s.title}
          </h1>

          {/* 3. Imagen producto — SIEMPRE completa, jamás recortada */}
          <div className="flex justify-center py-1">
            <div
              className="relative rounded-2xl overflow-hidden w-full max-w-[280px] aspect-square"
              style={{
                background: 'radial-gradient(ellipse at 60% 35%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 65%, transparent 100%)',
                boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.40), 0 0 32px ${s.glow}`,
              }}
            >
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                className="object-contain p-3"
                priority={current <= 1}
                fetchPriority={current === 0 ? 'high' : 'auto'}
                sizes="280px"
                quality={85}
                onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
              />
            </div>
          </div>

          {/* 4. Precio dinámico */}
          {precioTexto && (
            <div className="flex items-baseline gap-1.5 justify-center -mt-1">
              <span className="text-white/45 text-xs">Desde</span>
              <span className="text-white font-black text-2xl">{precioTexto}</span>
            </div>
          )}

          {/* 5 + 6. CTAs */}
          <div className="flex flex-col gap-2">
            <Link
              href={s.cta.href}
              onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
              className="w-full flex items-center justify-center gap-1.5 bg-white text-gray-900 font-black py-3 rounded-xl active:scale-[0.98] transition-all text-sm"
            >
              {s.cta.label}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={s.cta2.href}
              className="w-full flex items-center justify-center gap-1 border border-white/20 text-white/80 font-semibold py-2.5 rounded-xl text-sm active:scale-[0.98] transition-all"
            >
              {s.cta2.label}
            </Link>
          </div>

          {/* 7. Dots + flechas — esquina derecha para navegar con el dedo */}
          <div className="flex items-center justify-between">
            <Dots />
            <div className="flex gap-1.5">
              {[
                { fn: prev, label: 'Anterior', path: 'M15 19l-7-7 7-7' },
                { fn: next, label: 'Siguiente', path: 'M9 5l7 7-7 7' },
              ].map(({ fn, label, path }) => (
                <button
                  key={label}
                  onClick={() => { fn(); resetAuto() }}
                  aria-label={label}
                  className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Stats / beneficios (solo slide 1) */}
          {s.stats && (
            <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-white/8">
              {s.stats.map(stat => (
                <div key={stat.label} className="text-center">
                <p className="text-white font-black text-lg leading-tight">{stat.num === 'DYNAMIC' ? `${lentesCount.toLocaleString()}+` : stat.num}</p>
                  <p className="text-white/35 text-[9px] uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT — 2 columnas, desde md en adelante
          Imagen SIEMPRE completa (object-contain, nunca se corta)
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="py-10 lg:py-12 transition-all duration-260 ease-out"
            style={{
              opacity:   transitioning ? 0 : 1,
              transform: transitioning
                ? `translateX(${direction === 'next' ? '-12px' : '12px'})`
                : 'translateX(0)',
            }}
          >
            <div className="grid grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* TEXTO */}
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40">
                  {s.sub}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/15">
                    {s.badge}
                  </span>
                  {s.tag && (
                    <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-full">
                      {s.tag}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-[2.4rem] lg:text-[2.8rem] xl:text-5xl font-black text-white leading-[1.08] tracking-tight whitespace-pre-line">
                  {s.title}
                </h1>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">
                  {s.subtitle}
                </p>
                {precioTexto && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-white/45 text-xs">Desde</span>
                    <span className="text-white font-black text-2xl">{precioTexto}</span>
                    <span className="text-white/45 text-xs">/ caja</span>
                  </div>
                )}
                {s.stats && (
                  <div className="flex gap-5">
                    {s.stats.map(stat => (
                      <div key={stat.label} className="flex items-baseline gap-1.5">
                        <span className="text-white font-black text-xl">{stat.num === 'DYNAMIC' ? `${lentesCount.toLocaleString()}+` : stat.num}</span>
                        <span className="text-white/40 text-[10px] uppercase tracking-wide">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <Link
                    href={s.cta.href}
                    onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
                    className="inline-flex items-center gap-1.5 bg-white text-gray-900 font-black px-5 py-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg shadow-black/25 text-sm group"
                  >
                    {s.cta.label}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href={s.cta2.href}
                    className="inline-flex items-center gap-1 border border-white/20 text-white/80 font-semibold px-5 py-3 rounded-xl hover:bg-white/10 hover:border-white/35 active:scale-[0.98] transition-all text-sm"
                  >
                    {s.cta2.label}
                  </Link>
                </div>
              </div>

              {/* IMAGEN — SIEMPRE completa, jamás recortada (object-contain) */}
              <div className="flex justify-center items-center relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-18 scale-50 transition-all duration-700"
                  style={{ background: s.glow }}
                  aria-hidden="true"
                />
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                  <div
                    className="relative w-full h-full rounded-2xl overflow-hidden"
                    style={{
                      background:  'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
                      boxShadow:   `0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${s.glow}`,
                    }}
                  >
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className="object-contain p-5 lg:p-6 drop-shadow-xl"
                      sizes="(max-width: 1024px) 256px, 384px"
                      priority={current <= 1}
                      fetchPriority={current === 0 ? 'high' : 'auto'}
                      quality={85}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles desktop — con flechas */}
          <div className="flex items-center gap-3 pb-5">
            <Dots className="justify-start" />
            <div className="flex-1 h-px bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / SLIDES.length) * 100}%`, background: 'rgba(255,255,255,0.35)' }}
              />
            </div>
            <span className="text-white/30 text-[10px] font-mono tabular-nums">{current + 1}/{SLIDES.length}</span>
            <div className="flex gap-1.5">
              {[
                { fn: prev, label: 'Anterior', path: 'M15 19l-7-7 7-7' },
                { fn: next, label: 'Siguiente', path: 'M9 5l7 7-7 7'  },
              ].map(({ fn, label, path }) => (
                <button
                  key={label}
                  onClick={() => { fn(); resetAuto() }}
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
