'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BASE = 'https://atendbjolicwcsqfyiyh.supabase.co/storage/v1/object/public/products'

const SLIDES = [
  {
    badge: '🇩🇴 La #1 en lentes de contacto en RD',
    title: 'Tus lentes en\n24 horas',
    subtitle: 'Originales. Seguros. Con soporte profesional. Entrega a todo el país.',
    cta:  { label: 'Comprar ahora', href: '/catalogo' },
    cta2: { label: 'Subir mi receta', href: '/receta' },
    bg: 'from-[#0a4d8c] via-[#0a5fa8] to-[#0d6efd]',
    image: '/hero-lens-1.png',
    imageAlt: 'Lentes de contacto originales República Dominicana',
    stats: [
      { num: '+1,000', label: 'clientes' },
      { num: '24h', label: 'entrega' },
      { num: '100%', label: 'originales' },
    ],
  },
  {
    badge: '⭐ Más vendido en ContactGo',
    title: 'ACUVUE® Oasys®\ncon HYDRACLEAR®',
    subtitle: 'Silicona hidrogel de alta respirabilidad. 2 semanas de comodidad extrema.',
    cta:  { label: 'Comprar ahora', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
    cta2: { label: 'Ver ACUVUE', href: '/catalogo?marca=acuvue' },
    bg: 'from-[#003087] via-[#00408f] to-[#0057b8]',
    image: `${BASE}/oasys-v2.png`,
    imageAlt: 'ACUVUE Oasys lentes de contacto',
    precio: 'RD$3,952',
    tag: '🔥 Más popular',
  },
  {
    badge: '🎨 +12 colores disponibles',
    title: 'Cambia tu look\ncon colores',
    subtitle: 'FreshLook® y Air Optix® COLORS. Con o sin graduación. Envío en 24h.',
    cta:  { label: 'Ver colores', href: '/catalogo?tipo=color' },
    cta2: { label: 'Air Optix Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    bg: 'from-[#6b21a8] via-[#7c3aed] to-[#a855f7]',
    image: `${BASE}/freshlook_colorblends.png`,
    imageAlt: 'Lentes de colores FreshLook',
    tag: '✨ Sin graduación disponible',
  },
  {
    badge: '💙 Solución para astigmatismo',
    title: 'Lentes para\nastigmatismo',
    subtitle: 'Visión nítida y estable todo el día. Acuvue, Air Optix y CooperVision disponibles.',
    cta:  { label: 'Ver tóricos', href: '/catalogo?tipo=torico' },
    cta2: { label: 'Buscar con receta', href: '/receta' },
    bg: 'from-[#0f766e] via-[#0d8a80] to-[#0d9488]',
    image: `${BASE}/oasys_astig-v2.png`,
    imageAlt: 'Lentes para astigmatismo tóricos',
    tag: null,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 250)
  }, [current, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const s = SLIDES[current]

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${s.bg} transition-colors duration-700`}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className={`transition-all duration-250 ${transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center gap-4 md:grid md:grid-cols-2 md:gap-12">

            {/* ── TEXTO ── */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] md:text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {s.badge}
                </span>
                {s.tag && (
                  <span className="bg-yellow-400 text-yellow-900 text-[11px] md:text-xs font-black px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-3 whitespace-pre-line">
                {s.title}
              </h1>

              {/* Subtítulo */}
              <p className="text-white/80 text-sm md:text-lg leading-relaxed mb-5 max-w-md hidden sm:block">
                {s.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Link href={s.cta.href}
                  className="bg-white text-gray-900 font-bold px-5 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-lg shadow-black/25 text-sm md:text-base flex items-center gap-2 group">
                  {s.cta.label}
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href={s.cta2.href}
                  className="border-2 border-white/50 text-white font-semibold px-5 py-3 rounded-2xl hover:bg-white/10 transition-all text-sm md:text-base hidden sm:flex items-center gap-1.5">
                  {s.cta2.label}
                </Link>
              </div>

              {/* Stats (solo slide 1) */}
              {'stats' in s && s.stats && (
                <div className="flex gap-5 md:gap-8">
                  {(s.stats as {num:string,label:string}[]).map(stat => (
                    <div key={stat.label}>
                      <p className="text-white font-black text-xl md:text-2xl">{stat.num}</p>
                      <p className="text-white/60 text-xs uppercase tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Precio (slides con producto) */}
              {'precio' in s && s.precio && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Desde</span>
                  <span className="text-white font-black text-2xl">{s.precio}</span>
                  <span className="text-white/60 text-xs">/ caja</span>
                </div>
              )}
            </div>

            {/* ── IMAGEN ── */}
            <div className="flex justify-center items-center shrink-0">
              <div className="relative w-36 h-36 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div className="absolute inset-4 rounded-full bg-white/10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-28 h-28 md:w-64 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden bg-white/10 shadow-2xl">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 112px, 256px"
                      priority={current === 0}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── CONTROLES ── */}
        <div className="flex items-center gap-3 mt-6 md:mt-10">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${i === current
                  ? 'w-7 h-2.5 bg-white shadow-sm'
                  : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'}`} />
            ))}
          </div>
          <span className="text-white/40 text-xs font-mono ml-1">{current + 1}/{SLIDES.length}</span>
          <div className="ml-auto flex gap-2">
            {[prev, next].map((fn, i) => (
              <button key={i} onClick={fn}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i === 0 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
