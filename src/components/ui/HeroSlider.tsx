'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type LegacySlide = {
  variant: 'legacy'
  badge: string
  title: string
  sub: string
  subtitle: string
  cta: { label: string; href: string }
  cta2: { label: string; href: string }
  accent: string
  bg: { from: string; via: string; to: string }
  glow: string
  image: string
  imageAlt: string
  stats: { num: string; label: string }[] | null
  tag: string | null
  precio: string | null
}

type FullBleedSlide = {
  variant: 'fullbleed'
  image: string
  imageAlt: string
  priceSlug: string
  priceFallback: number
  ctaLabel: string
  ctaHref: string
  cta2Label: string
  cta2Href: string
  glow: string
}

type Slide = LegacySlide | FullBleedSlide

const OASYS_SLUG = 'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana'

const SLIDES: Slide[] = [
  {
    variant:    'legacy',
    badge:      '🇩🇴 Entregamos en toda República Dominicana',
    title:      'Tus lentes,\nen tu puerta.',
    sub:        'Los mejores lentes del mundo. En tu puerta mañana.',
    subtitle:   'Elige, paga y recibe en 24h. Sin filas, sin citas, sin complicaciones. La forma más sencilla de cuidar tu salud visual en RD.',
    cta:        { label: 'Encontrar mi lente ideal', href: '/catalogo' },
    cta2:       { label: 'Calcular mi receta gratis', href: '/receta' },
    accent:     '#0d6efd',
    bg:         { from: '#020d1e', via: '#021535', to: '#031d4a' },
    glow:       'rgba(13,110,253,0.22)',
    image:      '/hero-lens-1.png',
    imageAlt:   'Lentes de contacto certificados República Dominicana',
    stats:      [
      { num: 'DYNAMIC', label: 'lentes entregados' },
      { num: '24h',     label: 'entrega SD' },
      { num: '100%',    label: 'certificados' },
    ],
    tag: null, precio: null,
  },
  {
    variant:      'fullbleed',
    image:        '/hero-oasys.jpg',
    imageAlt:     'ACUVUE OASYS con HYDRACLEAR Plus — comodidad que dura todo el día',
    priceSlug:    OASYS_SLUG,
    priceFallback: 3700,
    ctaLabel:     'Pedir ACUVUE OASYS',
    ctaHref:      '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana',
    cta2Label:    'Ver toda ACUVUE',
    cta2Href:     '/catalogo?marca=acuvue',
    glow:         'rgba(37,99,235,0.25)',
  },
  {
    variant:      'fullbleed',
    image:        '/hero-acuvue-moist.jpg',
    imageAlt:     '1-DAY ACUVUE MOIST — lentes diarios, cero complicaciones',
    priceSlug:    '1-day-acuvue-moist-lentes-contacto-diarios-dominicana',
    priceFallback: 3800,
    ctaLabel:     'Pedir ACUVUE MOIST',
    ctaHref:      '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana',
    cta2Label:    'Ver toda ACUVUE',
    cta2Href:     '/catalogo?marca=acuvue',
    glow:         'rgba(56,189,248,0.25)',
  },
  {
    variant:      'fullbleed',
    image:        '/hero-air-optix-colors.jpg',
    imageAlt:     'AIR OPTIX COLORS — cambia tu look con colores',
    priceSlug:    'air-optix-colors-lentes-contacto-color-dominicana',
    priceFallback: 2500,
    ctaLabel:     'Pedir AIR OPTIX Colors',
    ctaHref:      '/producto/air-optix-colors-lentes-contacto-color-dominicana',
    cta2Label:    'Ver todos los colores',
    cta2Href:     '/catalogo?tipo=color',
    glow:         'rgba(124,58,237,0.25)',
  },
  {
    variant:      'fullbleed',
    image:        '/hero-air-optix-hydraglyde.jpg',
    imageAlt:     'AIR OPTIX plus HydraGlyde — hidratación que dura todo el mes',
    priceSlug:    'air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana',
    priceFallback: 4400,
    ctaLabel:     'Pedir Air Optix HydraGlyde',
    ctaHref:      '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana',
    cta2Label:    'Ver marca Alcon',
    cta2Href:     '/catalogo?marca=alcon',
    glow:         'rgba(14,165,233,0.25)',
  },
  {
    variant:      'fullbleed',
    image:        '/hero-biofinity.jpg',
    imageAlt:     'Biofinity CooperVision — un mes de visión clara y cómoda',
    priceSlug:    'biofinity-lentes-contacto-mensuales-coopervision-dominicana',
    priceFallback: 4750,
    ctaLabel:     'Pedir Biofinity',
    ctaHref:      '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana',
    cta2Label:    'Ver CooperVision',
    cta2Href:     '/catalogo?marca=coopervision',
    glow:         'rgba(147,51,234,0.22)',
  },
  {
    variant:      'fullbleed',
    image:        '/hero-oasys-astig.jpg',
    imageAlt:     'ACUVUE OASYS for Astigmatism — visión nítida con astigmatismo',
    priceSlug:    'acuvue-oasys-for-astigmatism-lentes-toricos-dominicana',
    priceFallback: 6250,
    ctaLabel:     'Pedir lentes tóricos',
    ctaHref:      '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana',
    cta2Label:    'Ver todos los tóricos',
    cta2Href:     '/catalogo?tipo=torico',
    glow:         'rgba(13,148,136,0.25)',
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

  // ─── Dots shared ──────────────────────────────────────────────────────────
  const Dots = ({ className = '', dark = false }: { className?: string; dark?: boolean }) => (
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
            background: i === current
              ? (dark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)')
              : (dark ? 'rgba(20,20,20,0.28)' : 'rgba(255,255,255,0.22)'),
          }}
        />
      ))}
    </div>
  )

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE FULL-BLEED — imagen completa con texto ya integrado en el diseño.
  // Solo superponemos precio dinámico + botón de compra en la zona limpia.
  // ═══════════════════════════════════════════════════════════════════════
  if (s.variant === 'fullbleed') {
    const price = s.priceSlug === OASYS_SLUG && precioOasys
      ? precioOasys
      : (preciosHero[s.priceSlug] ?? s.priceFallback)

    return (
      <section
        aria-label="Hero — ContactGo lentes de contacto"
        className="relative overflow-hidden select-none bg-[#eef3f8]"
      >
        <div
          className="absolute inset-0 z-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true"
        />
        <div
          className="relative w-full aspect-video min-h-[260px] max-h-[640px] transition-opacity duration-260 ease-out"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <Image
            src={s.image}
            alt={s.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority={current === 0}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
          />

          {/* Tarjeta de precio + CTA — sobre la zona limpia del diseño */}
          <div
            className="absolute z-10 flex flex-col gap-1.5 sm:gap-2"
            style={{ right: '4%', top: '64%', width: 'min(34%, 280px)' }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-2.5 sm:p-4 border border-black/5">
              <div className="flex items-baseline gap-1 mb-1.5 sm:mb-2">
                <span className="text-gray-400 text-[9px] sm:text-xs">Desde</span>
                <span className="text-[#0B3D66] font-black text-base sm:text-2xl leading-none">
                  RD${price.toLocaleString('es-DO')}
                </span>
              </div>
              <Link
                href={s.ctaHref}
                onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
                className="block bg-[#0B3D66] hover:bg-[#0d4a7c] text-white text-[10px] sm:text-sm font-bold py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl text-center active:scale-[0.98] transition-all"
              >
                {s.ctaLabel}
              </Link>
              <Link
                href={s.cta2Href}
                className="block text-center text-[#0B3D66]/70 hover:text-[#0B3D66] text-[9px] sm:text-xs font-semibold mt-1 sm:mt-1.5 underline underline-offset-2"
              >
                {s.cta2Label}
              </Link>
            </div>
          </div>

          {/* Controles — dots + flechas, en barra flotante inferior */}
          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Dots />
              <span className="text-white/70 text-[9px] font-mono tabular-nums hidden sm:inline">{current + 1}/{SLIDES.length}</span>
            </div>
          </div>

          {/* Flechas — solo desktop */}
          <div className="hidden md:flex absolute inset-y-0 left-3 right-3 items-center justify-between z-10 pointer-events-none">
            {[
              { fn: prev, label: 'Anterior', path: 'M15 19l-7-7 7-7' },
              { fn: next, label: 'Siguiente', path: 'M9 5l7 7-7 7' },
            ].map(({ fn, label, path }) => (
              <button
                key={label}
                onClick={() => { fn(); resetAuto() }}
                aria-label={label}
                className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white bg-black/25 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE LEGACY — el diseño original (badge / título / subtítulo separados
  // + imagen pequeña de producto). Se conserva intacto para el slide general.
  // ═══════════════════════════════════════════════════════════════════════
  const bgStyle = {
    background:  `linear-gradient(135deg, ${s.bg.from} 0%, ${s.bg.via} 55%, ${s.bg.to} 100%)`,
    transition:  'background 600ms ease',
  }

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
          MOBILE LAYOUT
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

          {/* 3. Imagen producto */}
          <div className="flex justify-center py-1">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: 230,
                height: 230,
                background: 'radial-gradient(ellipse at 60% 35%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 65%, transparent 100%)',
                boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.40), 0 0 32px ${s.glow}`,
              }}
            >
              <Image
                src={s.image}
                alt={s.imageAlt}
                width={230}
                height={230}
                className="object-contain p-4 drop-shadow-lg"
                priority={current <= 1}
                fetchPriority={current === 0 ? 'high' : 'auto'}
                sizes="230px"
                quality={85}
                onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
              />
            </div>
            {/* Precio flotante si aplica */}
            {s.precio && (
              <div className="absolute bottom-2 right-[calc(50%-115px+8px)] bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-black px-2.5 py-1 rounded-full leading-none">
                Desde {s.precio === 'DYNAMIC_OASYS' ? (precioOasys ? `RD$${Number(precioOasys).toLocaleString()}` : 'RD$3,875') : s.precio}
              </div>
            )}
          </div>

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

          {/* 7. Dots discretos — sin flechas en mobile */}
          <Dots className="mb-1" />

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
                {s.precio && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-white/45 text-xs">Desde</span>
                    <span className="text-white font-black text-2xl">
                      {s.precio === 'DYNAMIC_OASYS' ? (precioOasys ? `RD$${Number(precioOasys).toLocaleString()}` : 'RD$3,875') : s.precio}
                    </span>
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

              {/* IMAGEN */}
              <div className="flex justify-center items-center relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-18 scale-50 transition-all duration-700"
                  style={{ background: s.glow }}
                  aria-hidden="true"
                />
                <div className="relative w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
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
                      sizes="(max-width: 1024px) 256px, 320px"
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
