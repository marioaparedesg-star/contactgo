'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BASE = 'https://atendbjolicwcsqfyiyh.supabase.co/storage/v1/object/public/products'

const SLIDES = [
  {
    badge:      '🇩🇴 Entrega a domicilio en toda RD',
    title:      'Olvídate de\nla óptica.',
    sub:        'Tus lentes en tu puerta mañana.',
    subtitle:   'Los mismos lentes de siempre, entregados en 24h. Sin filas, sin citas, sin salir de casa.',
    cta:        { label: 'Ver mis lentes', href: '/catalogo' },
    cta2:       { label: 'Calcular mi receta gratis', href: '/receta' },
    accent:     '#0d6efd',
    bg:         { from: '#020d1e', via: '#021535', to: '#031d4a' },
    glow:       'rgba(13,110,253,0.22)',
    image:      '/hero-lens-1.png',
    imageAlt:   'Lentes de contacto originales República Dominicana',
    stats:      [
      { num: 'DYNAMIC', label: 'lentes entregados' },
      { num: '24h',     label: 'entrega SD' },
      { num: '100%',    label: 'originales' },
    ],
    tag: null, precio: null,
  },
  {
    badge:      '⭐ Más vendido en ContactGo',
    title:      'ACUVUE® Oasys®\nHYDRACLEAR® Plus',
    sub:        'Silicona hidrogel. Comodidad todo el día.',
    subtitle:   'La tecnología más avanzada en lentes quincenales. Comodidad extrema todo el día.',
    cta:        { label: 'Comprar ahora', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
    cta2:       { label: 'Ver toda ACUVUE', href: '/catalogo?marca=acuvue' },
    accent:     '#2563eb',
    bg:         { from: '#010b20', via: '#021030', to: '#031642' },
    glow:       'rgba(37,99,235,0.22)',
    image:      `${BASE}/oasys-v2.png`,
    imageAlt:   'ACUVUE Oasys con HYDRACLEAR Plus',
    tag:        '🔥 Más popular',
    precio:     'RD$3,952',
    stats:      null,
  },
  {
    badge:      '🎨 +12 colores disponibles',
    title:      'Cambia tu look\ncon colores.',
    sub:        'Con o sin graduación. Envío en 24h.',
    subtitle:   'Con o sin graduación. Envío en 24h a toda la República Dominicana.',
    cta:        { label: 'Ver colores', href: '/catalogo?tipo=color' },
    cta2:       { label: 'Air Optix Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    accent:     '#7c3aed',
    bg:         { from: '#0d0618', via: '#130a28', to: '#1a1035' },
    glow:       'rgba(124,58,237,0.22)',
    image:      `${BASE}/air-optix-colors.png`,
    imageAlt:   'Lentes de contacto de colores AIR OPTIX COLORS Alcon',
    tag:        '✨ Sin graduación disponible',
    precio:     null, stats: null,
  },
  {
    badge:      '💙 Lentes para astigmatismo',
    title:      'Visión nítida con\nastigmatismo.',
    sub:        'Estabilización avanzada. Disponible en RD.',
    subtitle:   'Estabilización avanzada para una visión clara todo el día. Disponible en RD.',
    cta:        { label: 'Ver tóricos', href: '/catalogo?tipo=torico' },
    cta2:       { label: 'Buscar con receta', href: '/receta' },
    accent:     '#0d9488',
    bg:         { from: '#011210', via: '#01201e', to: '#012a28' },
    glow:       'rgba(13,148,136,0.22)',
    image:      `${BASE}/oasys_astig-v2.png`,
    imageAlt:   'Lentes tóricos para astigmatismo',
    tag: null, precio: null, stats: null,
  },
]

export default function HeroSlider({ lentesCount = 4200 }: { lentesCount?: number }) {
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
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { prev(); resetAuto() }
      if (e.key === 'ArrowRight') { next(); resetAuto() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, resetAuto])

  const s = SLIDES[current]

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
          MOBILE LAYOUT — diseñado específicamente para mobile
          Oculto en ≥md. Arquitectura independiente del desktop.
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 md:hidden px-5 pt-5 pb-4">
        <div
          className="transition-all duration-260 ease-out"
          style={{
            opacity:   transitioning ? 0 : 1,
            transform: transitioning
              ? `translateY(${direction === 'next' ? '8px' : '-8px'})`
              : 'translateY(0)',
          }}
        >
          {/* 1. Badge + tag */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <span className="inline-flex items-center bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/12 leading-none">
              {s.badge}
            </span>
            {s.tag && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full leading-none">
                {s.tag}
              </span>
            )}
          </div>

          {/* 2. Título — heading accesible sin emitir un 2º <h1> literal (el <h1> canónico vive en el bloque desktop). Evita el doble-H1 en el HTML servido. */}
          <p role="heading" aria-level={1} className="font-display text-[1.65rem] font-black text-white leading-[1.08] tracking-tight whitespace-pre-line mb-1">
            {s.title}
          </p>

          {/* 3. Subtítulo corto — mobile copy */}
          <p className="text-white/55 text-[13px] leading-snug mb-4">
            {s.sub}
          </p>

          {/* 4. PRODUCTO GRANDE — protagonista visual */}
          <div className="relative flex justify-center items-center mb-4">
            {/* Glow mínimo detrás del producto */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-25"
              style={{ background: s.glow }}
              aria-hidden="true"
            />
            {/* Card del producto */}
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
                unoptimized
                onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
              />
            </div>
            {/* Precio flotante si aplica */}
            {s.precio && (
              <div className="absolute bottom-2 right-[calc(50%-115px+8px)] bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-black px-2.5 py-1 rounded-full leading-none">
                Desde {s.precio}
              </div>
            )}
          </div>

          {/* 5 + 6. CTAs */}
          <div className="flex flex-col gap-2 mb-4">
            <Link
              href={s.cta.href}
              onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
              className="w-full flex items-center justify-center gap-1.5 bg-white text-gray-900 font-black py-3 rounded-xl text-sm shadow-lg shadow-black/25 active:scale-[0.98] transition-all"
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
                    <span className="text-white font-black text-2xl">{s.precio}</span>
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
                      unoptimized
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
