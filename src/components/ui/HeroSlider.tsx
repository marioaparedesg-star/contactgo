'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    badge: '🚚 Envío en 24-48h',
    title: 'Lentes de contacto\na tu puerta',
    subtitle: 'Todas las marcas premium. Entrega rápida en toda la República Dominicana.',
    cta: { label: 'Ver catálogo →', href: '/catalogo' },
    cta2: { label: 'Buscar por receta', href: '/receta' },
    bg: 'from-primary-700 via-primary-600 to-teal-600',
    visual: '👁',
    visualBg: 'bg-white/20',
  },
  {
    badge: '✅ 100% Originales',
    title: 'Acuvue Oasys\npara astigmatismo',
    subtitle: 'La lente #1 para astigmatismo. Comodidad todo el día, graduaciones exactas.',
    cta: { label: 'Ver tóricos →', href: '/catalogo?tipo=torico' },
    cta2: { label: 'Ver ACUVUE', href: '/marca/acuvue' },
    bg: 'from-blue-700 via-blue-600 to-primary-600',
    visual: '💧',
    visualBg: 'bg-white/20',
  },
  {
    badge: '🎨 Sin graduación disponible',
    title: 'Lentes de colores\nFreshLook & Air Optix',
    subtitle: 'Cambia tu look al instante. Más de 12 colores disponibles con y sin graduación.',
    cta: { label: 'Ver colores →', href: '/catalogo?tipo=color' },
    cta2: { label: 'Buscar mi color', href: '/receta' },
    bg: 'from-purple-700 via-pink-600 to-rose-500',
    visual: '🌈',
    visualBg: 'bg-white/20',
  },
  {
    badge: '🔄 Suscripción con descuento',
    title: 'Recibe tus lentes\nautomáticamente',
    subtitle: 'Suscríbete y ahorra hasta 15%. Entrega mensual o bimestral según tus necesidades.',
    cta: { label: 'Ver suscripciones →', href: '/catalogo' },
    cta2: { label: 'Cómo funciona', href: '/faq' },
    bg: 'from-emerald-700 via-teal-600 to-cyan-600',
    visual: '🔄',
    visualBg: 'bg-white/20',
  },
  {
    badge: '⚡ Soluciones y gotas',
    title: 'Todo para el\ncuidado ocular',
    subtitle: 'Systane, ReNu, Opti-Free y más. Cuida tus ojos con los mejores productos.',
    cta: { label: 'Ver soluciones →', href: '/catalogo?tipo=solucion' },
    cta2: { label: 'Ver gotas', href: '/catalogo?tipo=gota' },
    bg: 'from-amber-600 via-orange-600 to-red-600',
    visual: '💊',
    visualBg: 'bg-white/20',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const next = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(c => (c + 1) % SLIDES.length)
    setTimeout(() => setIsAnimating(false), 400)
  }, [isAnimating])

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next])

  const goTo = (i: number) => {
    if (i === current || isAnimating) return
    setIsAnimating(true)
    setCurrent(i)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const slide = SLIDES[current]

  return (
    <section className={`bg-gradient-to-br ${slide.bg} text-white transition-all duration-500 relative overflow-hidden`}>
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
        <div className={`transition-all duration-400 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {/* Badge */}
          <span className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            {slide.badge}
          </span>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed max-w-md">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={slide.cta.href}
                  className="bg-white text-primary-700 font-bold px-6 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg shadow-black/20 text-sm md:text-base">
                  {slide.cta.label}
                </Link>
                <Link href={slide.cta2.href}
                  className="border-2 border-white/40 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm md:text-base">
                  {slide.cta2.label}
                </Link>
              </div>
            </div>

            {/* Visual emoji large */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                <div className="absolute inset-6 rounded-full bg-white/10" />
                <div className="absolute inset-12 rounded-full bg-white/20 flex items-center justify-center text-7xl">
                  {slide.visual}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
              aria-label={`Slide ${i + 1}`} />
          ))}
          {/* Prev/Next */}
          <div className="ml-auto flex gap-2">
            <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
