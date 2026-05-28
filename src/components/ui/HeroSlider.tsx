'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BASE = 'https://atendbjolicwcsqfyiyh.supabase.co/storage/v1/object/public/products'

const SLIDES = [
  {
    badge:    '🇩🇴 La #1 en lentes de contacto en RD',
    eyebrow:  'Entrega a domicilio · Santo Domingo y todo el país',
    title:    'Tus lentes,\na domicilio.',
    subtitle: 'Originales. Certificados. Con soporte de optometristas. Paga con tarjeta o contra entrega.',
    cta:      { label: 'Explorar catálogo', href: '/catalogo' },
    cta2:     { label: 'Subir mi receta', href: '/receta' },
    accent:   '#0d6efd',
    bg:       { from: '#020d1e', via: '#021535', to: '#031d4a' },
    glow:     'rgba(13,110,253,0.25)',
    image:    '/hero-lens-1.png',
    imageAlt: 'Lentes de contacto originales República Dominicana',
    stats:    [
      { num: '60+',  label: 'pedidos' },
      { num: '24h',  label: 'entrega SD' },
      { num: '100%', label: 'originales' },
    ],
    tag: null,
    precio: null,
  },
  {
    badge:    '⭐ Más vendido en ContactGo',
    eyebrow:  'Johnson & Johnson · Silicona Hidrogel',
    title:    'ACUVUE® Oasys®\nHYDRACLEAR® Plus',
    subtitle: 'La tecnología más avanzada en lentes quincenales. Comodidad extrema todo el día.',
    cta:      { label: 'Comprar ahora', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
    cta2:     { label: 'Ver toda ACUVUE', href: '/catalogo?marca=acuvue' },
    accent:   '#2563eb',
    bg:       { from: '#010b20', via: '#021030', to: '#031642' },
    glow:     'rgba(37,99,235,0.22)',
    image:    `${BASE}/oasys-v2.png`,
    imageAlt: 'ACUVUE Oasys con HYDRACLEAR Plus',
    tag:      '🔥 Más popular',
    precio:   'RD$3,952',
    stats:    null,
  },
  {
    badge:    '🎨 +12 colores disponibles',
    eyebrow:  'FreshLook® · Air Optix® COLORS',
    title:    'Cambia tu look\ncon colores.',
    subtitle: 'Con o sin graduación. Envío en 24h a toda la República Dominicana.',
    cta:      { label: 'Ver colores', href: '/catalogo?tipo=color' },
    cta2:     { label: 'Air Optix Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    accent:   '#7c3aed',
    bg:       { from: '#0d0618', via: '#130a28', to: '#1a1035' },
    glow:     'rgba(124,58,237,0.22)',
    image:    `${BASE}/freshlook_colorblends.png`,
    imageAlt: 'Lentes de colores FreshLook ColorBlends',
    tag:      '✨ Sin graduación disponible',
    precio:   null,
    stats:    null,
  },
  {
    badge:    '💙 Lentes para astigmatismo',
    eyebrow:  'ACUVUE · Air Optix · CooperVision',
    title:    'Visión nítida con\nastigmatismo.',
    subtitle: 'Estabilización avanzada para una visión clara todo el día. Disponible en RD.',
    cta:      { label: 'Ver tóricos', href: '/catalogo?tipo=torico' },
    cta2:     { label: 'Buscar con receta', href: '/receta' },
    accent:   '#0d9488',
    bg:       { from: '#011210', via: '#01201e', to: '#012a28' },
    glow:     'rgba(13,148,136,0.22)',
    image:    `${BASE}/oasys_astig-v2.png`,
    imageAlt: 'Lentes tóricos para astigmatismo',
    tag:      null,
    precio:   null,
    stats:    null,
  },
]

export default function HeroSlider() {
  const [current, setCurrent]             = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection]         = useState<'next'|'prev'>('next')
  const touchStart = useRef<number>(0)
  const touchEnd   = useRef<number>(0)
  const autoRef    = useRef<ReturnType<typeof setInterval>|null>(null)

  const goTo = useCallback((idx: number, dir: 'next'|'prev' = 'next') => {
    if (transitioning || idx === current) return
    setDirection(dir)
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 280)
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

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.targetTouches[0].clientX }
  const onTouchMove  = (e: React.TouchEvent) => { touchEnd.current   = e.targetTouches[0].clientX }
  const onTouchEnd   = () => {
    const diff = touchStart.current - touchEnd.current
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto() }
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

  return (
    <section
      aria-label="Hero — ContactGo lentes de contacto"
      className="relative overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, ${s.bg.from} 0%, ${s.bg.via} 55%, ${s.bg.to} 100%)`,
        transition: 'background 600ms ease',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient glow — reducido vs anterior */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 right-[5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] transition-colors duration-700"
          style={{ background: s.glow }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* CONTENIDO */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Altura compacta: py-6 mobile → py-10 md → py-12 lg */}
        <div
          className="py-6 sm:py-8 md:py-10 lg:py-12 transition-all duration-280 ease-out"
          style={{
            opacity:   transitioning ? 0 : 1,
            transform: transitioning
              ? `translateX(${direction === 'next' ? '-12px' : '12px'})`
              : 'translateX(0)',
          }}
        >
          {/* GRID: en mobile texto va PRIMERO (order) para CTA visible inmediato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center">

            {/* TEXTO — order-1 en mobile (CTA visible primero) */}
            <div className="flex flex-col gap-3 md:gap-4 order-1">

              {/* Eyebrow — solo desktop para ahorrar espacio mobile */}
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40 hidden md:block">
                {s.eyebrow}
              </p>

              {/* Badge + Tag en una línea */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center bg-white/10 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border border-white/15">
                  {s.badge}
                </span>
                {s.tag && (
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {s.tag}
                  </span>
                )}
              </div>

              {/* Título — más compacto */}
              <h1 className="font-display text-[1.75rem] sm:text-3xl md:text-[2.4rem] lg:text-[2.8rem] xl:text-5xl font-black text-white leading-[1.08] tracking-tight whitespace-pre-line">
                {s.title}
              </h1>

              {/* Subtítulo — oculto en mobile para brevedad */}
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md hidden sm:block">
                {s.subtitle}
              </p>

              {/* Precio (slides con producto) */}
              {s.precio && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white/45 text-xs">Desde</span>
                  <span className="text-white font-black text-xl md:text-2xl">{s.precio}</span>
                  <span className="text-white/45 text-xs">/ caja</span>
                </div>
              )}

              {/* Stats — compactos en línea horizontal */}
              {s.stats && (
                <div className="flex gap-4 md:gap-6">
                  {s.stats.map(stat => (
                    <div key={stat.label} className="flex items-baseline gap-1.5">
                      <span className="text-white font-black text-lg md:text-xl">{stat.num}</span>
                      <span className="text-white/40 text-[10px] uppercase tracking-wide">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex gap-2 sm:gap-3 pt-0.5">
                <Link
                  href={s.cta.href}
                  onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
                  className="inline-flex items-center gap-1.5 bg-white text-gray-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg shadow-black/25 text-sm group"
                >
                  {s.cta.label}
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={s.cta2.href}
                  className="inline-flex items-center gap-1 border border-white/20 text-white/80 font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl hover:bg-white/10 hover:border-white/35 active:scale-[0.98] transition-all text-sm"
                >
                  {s.cta2.label}
                </Link>
              </div>
            </div>

            {/* IMAGEN — order-2 en mobile */}
            <div className="flex justify-center items-center order-2 relative">
              {/* Glow detrás de imagen — reducido */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20 scale-50 transition-all duration-700"
                style={{ background: s.glow }}
                aria-hidden="true"
              />

              {/* Imagen principal — sin rings decorativos */}
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
                <div
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${s.glow}`,
                  }}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    className="object-contain p-5 md:p-6 drop-shadow-xl"
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, (max-width: 1024px) 256px, 320px"
                    priority={current === 0}
                    unoptimized
                    onError={(e) => {
                      const el = e.target as HTMLImageElement
                      el.src = '/hero-lens-1.png'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CONTROLES — compactos, mt reducido */}
        <div className="flex items-center gap-3 pb-4 md:pb-5">
          {/* Dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1}`}
                onClick={() => { goTo(i, i > current ? 'next' : 'prev'); resetAuto() }}
                className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  width:      i === current ? 24 : 6,
                  height:     6,
                  background: i === current ? 'white' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="flex-1 h-px bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / SLIDES.length) * 100}%`, background: 'rgba(255,255,255,0.35)' }}
            />
          </div>

          {/* Counter */}
          <span className="text-white/30 text-[10px] font-mono tabular-nums hidden sm:block">
            {current + 1}/{SLIDES.length}
          </span>

          {/* Arrows */}
          <div className="flex gap-1.5 ml-auto sm:ml-0">
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
    </section>
  )
}
