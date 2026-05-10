'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BASE = 'https://atendbjolicwcsqfyiyh.supabase.co/storage/v1/object/public/products'

const SLIDES = [
  {
    badge: '🚚 Envío en 24-48h en todo el país',
    title: 'Lentes de contacto\na tu puerta',
    subtitle: 'Acuvue, Air Optix, FreshLook y más marcas premium. Entrega rápida en República Dominicana.',
    cta:  { label: 'Ver catálogo', href: '/catalogo' },
    cta2: { label: 'Buscar por receta', href: '/receta' },
    bg: 'from-[#0a4d8c] to-[#0d6efd]',
    image: '/hero-lens-1.png',
    imageAlt: 'Cómo poner lentes de contacto',
    tag: null,
  },
  {
    badge: '✨ Más popular',
    title: 'ACUVUE® Oasys®',
    subtitle: 'La lente más vendida en RD. Silicona hidrogel para máxima comodidad durante 2 semanas.',
    cta:  { label: 'Ver ACUVUE', href: '/marca/acuvue' },
    cta2: { label: 'Comprar ahora', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
    bg: 'from-[#003087] to-[#0057b8]',
    image: `${BASE}/oasys-v2.png`,
    imageAlt: 'ACUVUE Oasys',
    tag: 'RD$3,952',
    precio: 'RD$3,952',
  },
  {
    badge: '🎨 Sin graduación disponible',
    title: 'Lentes de colores\nFreshLook & Air Optix',
    subtitle: 'Cambia tu look al instante. Más de 12 colores. Con o sin graduación.',
    cta:  { label: 'Ver colores', href: '/catalogo?tipo=color' },
    cta2: { label: 'Air Optix Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    bg: 'from-[#6b21a8] to-[#a855f7]',
    image: '/hero-lens-2.png',
    imageAlt: 'Lentes de colores',
    tag: null,
  },
  {
    badge: '💙 Para astigmatismo',
    title: 'Air Optix® Plus\nHydraGlyde',
    subtitle: 'Visión nítida todo el mes con tecnología HydraGlyde. Disponible en versión tórica.',
    cta:  { label: 'Ver tóricos', href: '/catalogo?tipo=torico' },
    cta2: { label: 'Ver producto', href: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana' },
    bg: 'from-[#0f766e] to-[#0d9488]',
    image: `${BASE}/air_optix_hydraglyde-v3.png`,
    imageAlt: 'Air Optix HydraGlyde',
    tag: 'RD$2,750',
  },
  {
    badge: '📝 Del blog',
    title: '¿Cómo leer\ntu receta de lentes?',
    subtitle: 'Aprende a interpretar SPH, CYL y EJE para encontrar los lentes exactos para tu graduación.',
    cta:  { label: 'Leer artículo', href: '/blog/como-leer-tu-receta' },
    cta2: { label: 'Buscar mis lentes', href: '/receta' },
    bg: 'from-[#92400e] to-[#d97706]',
    image: `${BASE}/oasys-v2.png`,
    imageAlt: 'Cómo leer tu receta',
    tag: null,
    isBlog: true,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 300)
  }, [current, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const s = SLIDES[current]

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${s.bg} transition-all duration-500`}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-5 md:py-16">
        <div className={`flex items-center gap-4 md:grid md:grid-cols-2 md:gap-8 transition-all duration-300 ${transitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>

          {/* Texto */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full">
                {s.badge}
              </span>
              {s.tag && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full">
                  {s.tag}
                </span>
              )}
              {s.isBlog && (
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                  Artículo
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl md:text-5xl font-black text-white leading-tight mb-3 whitespace-pre-line">
              {s.title}
            </h1>
            <p className="text-white/80 text-sm md:text-lg leading-relaxed mb-5 max-w-md hidden sm:block">
              {s.subtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href={s.cta.href}
                className="bg-white text-gray-900 font-bold px-4 py-2.5 rounded-2xl hover:bg-gray-50 transition-all shadow-lg shadow-black/20 text-xs md:text-base flex items-center gap-1.5">
                {s.cta.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href={s.cta2.href}
                className="border-2 border-white/50 text-white font-semibold px-4 py-2.5 rounded-2xl hover:bg-white/10 transition-all text-xs md:text-base hidden sm:block">
                {s.cta2.label}
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex justify-center items-center shrink-0">
            <div className="relative w-40 h-40 md:w-80 md:h-80">
              {/* Halo decorativo */}
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 md:w-64 md:h-64 rounded-full overflow-hidden bg-white/10">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 208px, 256px"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-8">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Ir a slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${i === current
                  ? 'w-7 h-2.5 bg-white shadow-sm'
                  : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'}`} />
            ))}
          </div>

          {/* Contador */}
          <span className="text-white/50 text-xs font-mono ml-1">
            {current + 1}/{SLIDES.length}
          </span>

          {/* Prev/Next */}
          <div className="ml-auto flex gap-2">
            <button onClick={prev}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
