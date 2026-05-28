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
    glow:     'rgba(13,110,253,0.35)',
    image:    '/hero-lens-1.png',
    imageAlt: 'Lentes de contacto originales República Dominicana',
    stats:    [
      { num: '60+',  label: 'pedidos entregados' },
      { num: '24h',  label: 'entrega en SD' },
      { num: '100%', label: 'originales' },
    ],
    tag: null,
    precio: null,
  },
  {
    badge:    '⭐ Más vendido en ContactGo',
    eyebrow:  'Johnson & Johnson · Silicona Hidrogel',
    title:    'ACUVUE® Oasys®\nHYDRACLEAR® Plus',
    subtitle: 'La tecnología más avanzada en lentes quincenales. Comodidad extrema desde la mañana hasta la noche.',
    cta:      { label: 'Comprar ahora', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
    cta2:     { label: 'Ver toda ACUVUE', href: '/catalogo?marca=acuvue' },
    accent:   '#2563eb',
    bg:       { from: '#010b20', via: '#021030', to: '#031642' },
    glow:     'rgba(37,99,235,0.40)',
    image:    `${BASE}/oasys-v2.png`,
    imageAlt: 'ACUVUE Oasys con HYDRACLEAR Plus',
    tag:      '🔥 Más popular',
    precio:   'RD$3,952',
    stats:    null,
  },
  {
    badge:    '🎨 +12 colores disponibles',
    eyebrow:  'FreshLook® · Air Optix® COLORS · Sin graduación disponible',
    title:    'Cambia tu look\ncon colores.',
    subtitle: 'Transforma tu mirada con colores vibrantes y naturales. Con o sin graduación. Entrega en 24h.',
    cta:      { label: 'Ver colores', href: '/catalogo?tipo=color' },
    cta2:     { label: 'Air Optix Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    accent:   '#7c3aed',
    bg:       { from: '#0d0618', via: '#130a28', to: '#1a1035' },
    glow:     'rgba(124,58,237,0.40)',
    image:    `${BASE}/freshlook_colorblends.png`,
    imageAlt: 'Lentes de colores FreshLook ColorBlends',
    tag:      '✨ Sin graduación disponible',
    precio:   null,
    stats:    null,
  },
  {
    badge:    '💙 Astigmatismo · Lentes Tóricos',
    eyebrow:  'ACUVUE · Air Optix · CooperVision',
    title:    'Visión nítida con\nastigmatismo.',
    subtitle: 'Tecnología de estabilización avanzada para una visión clara y estable todo el día. Disponible en RD.',
    cta:      { label: 'Ver tóricos', href: '/catalogo?tipo=torico' },
    cta2:     { label: 'Buscar con receta', href: '/receta' },
    accent:   '#0d9488',
    bg:       { from: '#011210', via: '#01201e', to: '#012a28' },
    glow:     'rgba(13,148,136,0.40)',
    image:    `${BASE}/oasys_astig-v2.png`,
    imageAlt: 'Lentes tóricos para astigmatismo',
    tag:      null,
    precio:   null,
    stats:    null,
  },
]

export default function HeroSlider() {
  const [current, setCurrent]           = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection]       = useState<'next'|'prev'>('next')
  const touchStart = useRef<number>(0)
  const touchEnd   = useRef<number>(0)
  const autoRef    = useRef<ReturnType<typeof setInterval>|null>(null)

  const goTo = useCallback((idx: number, dir: 'next'|'prev' = 'next') => {
    if (transitioning || idx === current) return
    setDirection(dir)
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 320)
  }, [current, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 'next'), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, 'prev'), [current, goTo])

  // Autoplay — 6 segundos
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(next, 6000)
  }, [next])

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [resetAuto])

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.targetTouches[0].clientX }
  const onTouchMove  = (e: React.TouchEvent) => { touchEnd.current   = e.targetTouches[0].clientX }
  const onTouchEnd   = () => {
    const diff = touchStart.current - touchEnd.current
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
      resetAuto()
    }
  }

  // Keyboard
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
      aria-label="Hero slider — lentes de contacto"
      className="relative overflow-hidden select-none"
      style={{ background: `linear-gradient(135deg, ${s.bg.from} 0%, ${s.bg.via} 50%, ${s.bg.to} 100%)`, transition: 'background 800ms ease' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── AMBIENT GLOW ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow central */}
        <div className="absolute top-0 right-[15%] w-[600px] h-[600px] rounded-full opacity-25 blur-[120px] transition-all duration-1000"
          style={{ background: s.glow }} />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* ── CONTENIDO ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning
              ? `translateX(${direction === 'next' ? '-16px' : '16px'})`
              : 'translateX(0)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">

            {/* ── TEXTO ── */}
            <div className="flex flex-col gap-4 md:gap-5 order-2 md:order-1">

              {/* Eyebrow */}
              <p className="text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase text-white/50">
                {s.eyebrow}
              </p>

              {/* Badge + Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full border border-white/15">
                  {s.badge}
                </span>
                {s.tag && (
                  <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-display text-[2rem] sm:text-4xl md:text-[2.8rem] lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight whitespace-pre-line">
                {s.title}
              </h1>

              {/* Subtítulo */}
              <p className="text-white/65 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg hidden sm:block">
                {s.subtitle}
              </p>

              {/* Precio */}
              {s.precio && (
                <div className="flex items-baseline gap-2">
                  <span className="text-white/50 text-xs">Desde</span>
                  <span className="text-white font-black text-2xl md:text-3xl" style={{ color: 'white' }}>
                    {s.precio}
                  </span>
                  <span className="text-white/50 text-xs">/ caja</span>
                </div>
              )}

              {/* Stats */}
              {s.stats && (
                <div className="flex gap-6 md:gap-8 pt-1">
                  {s.stats.map(stat => (
                    <div key={stat.label}>
                      <p className="text-white font-black text-xl md:text-2xl tracking-tight">{stat.num}</p>
                      <p className="text-white/45 text-[10px] uppercase tracking-widest mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  href={s.cta.href}
                  onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black px-6 py-3.5 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-xl shadow-black/30 text-sm md:text-base group"
                >
                  {s.cta.label}
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={s.cta2.href}
                  className="inline-flex items-center justify-center gap-1.5 border border-white/25 text-white/85 font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all text-sm md:text-base backdrop-blur-sm"
                >
                  {s.cta2.label}
                </Link>
              </div>
            </div>

            {/* ── IMAGEN ── */}
            <div className="flex justify-center items-center order-1 md:order-2 relative">
              {/* Glow de imagen */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-1000 scale-75"
                style={{ background: s.glow }}
                aria-hidden="true"
              />
              {/* Rings decorativos */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border border-white/5" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="w-40 h-40 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-full border border-white/8" />
              </div>

              {/* Card imagen */}
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                <div className="relative w-full h-full rounded-3xl overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)',
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.4), 0 0 80px ${s.glow}`,
                  }}>
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    className="object-contain p-6 md:p-8 drop-shadow-2xl"
                    sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
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

        {/* ── CONTROLES ── */}
        <div className="flex items-center gap-4 mt-8 md:mt-10">
          {/* Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => { goTo(i, i > current ? 'next' : 'prev'); resetAuto() }}
                className="relative transition-all duration-400 overflow-hidden rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  background: i === current ? 'white' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="text-white/35 text-[11px] font-mono tabular-nums">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>

          {/* Progress bar */}
          <div className="flex-1 h-px bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((current + 1) / SLIDES.length) * 100}%`,
                background: 'rgba(255,255,255,0.4)',
              }}
            />
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-2 ml-auto sm:ml-0">
            {[
              { fn: prev, dir: 'prev', label: 'Slide anterior', path: 'M15 19l-7-7 7-7' },
              { fn: next, dir: 'next', label: 'Siguiente slide',  path: 'M9 5l7 7-7 7'  },
            ].map(({ fn, label, path }) => (
              <button
                key={label}
                onClick={() => { fn(); resetAuto() }}
                aria-label={label}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
