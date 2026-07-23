'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type PriceSpec = null | { slug: string; fallback: number }

type Slide = {
  badge:      string
  tag:        string | null
  title:      string
  subtitle:   string
  cta:        { label: string; href: string }
  cta2:       { label: string; href: string } | null
  glow:       string
  accent:     string   // color sólido de marca para el CTA y el acento del título
  image:      string
  imageAlt:   string
  precio:     PriceSpec
  textColor:  'dark' | 'light'   // color del texto según el fondo de CADA imagen
}

const OASYS_SLUG = 'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana'

const SLIDES: Slide[] = [
  {
    badge:      '⭐ El más pedido en RD',
    tag:        '🔥 Más popular',
    title:      'Ponte tus lentes\ny sal volando',
    subtitle:   'ACUVUE® OASYS con tecnología HYDRACLEAR® Plus. Comodidad todo el día, uso quincenal.',
    cta:        { label: 'Pedir ACUVUE OASYS', href: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana' },
    cta2:       { label: 'Ver toda ACUVUE', href: '/catalogo?marca=acuvue' },
    glow:       'rgba(37,99,235,0.25)',
    accent:     '#1d4ed8',
    image:      '/hero-oasys.jpg',
    imageAlt:   'ACUVUE OASYS con HYDRACLEAR Plus',
    precio:     { slug: OASYS_SLUG, fallback: 3700 },
    textColor:  'dark',
  },
  {
    badge:      '🇩🇴 La tienda de lentes más completa de RD',
    tag:        null,
    title:      'Todas las marcas,\nun solo lugar',
    subtitle:   'ACUVUE, Air Optix, Biofinity, Bausch+Lomb y más. Con o sin graduación, en un mismo pedido.',
    cta:        { label: 'Ver catálogo completo', href: '/catalogo' },
    cta2:       { label: 'Buscar con mi receta', href: '/receta' },
    glow:       'rgba(79,70,229,0.25)',
    accent:     '#4338ca',
    image:      '/hero-general.jpg',
    imageAlt:   'Todas las marcas de lentes de contacto en ContactGo',
    precio:     null,
    textColor:  'dark',
  },
  {
    badge:      '🎨 +12 tonos disponibles',
    tag:        '✨ Sin graduación disponible',
    title:      'Otro color,\notra tú',
    subtitle:   'AIR OPTIX® COLORS en 12 tonos únicos. Cambia tu mirada cuando quieras.',
    cta:        { label: 'Pedir AIR OPTIX Colors', href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
    cta2:       { label: 'Ver todos los colores', href: '/catalogo?tipo=color' },
    glow:       'rgba(147,51,234,0.25)',
    accent:     '#9333ea',
    image:      '/hero-air-optix-colors.jpg',
    imageAlt:   'AIR OPTIX COLORS — cambia el color de tus ojos',
    precio:     null,
    textColor:  'dark',
  },
  {
    badge:      '🛵 Directo a tu puerta',
    tag:        null,
    title:      'Tocan la puerta,\ny son tus lentes',
    subtitle:   'Pides hoy, llegan mañana. Entregamos en 24-48h a todo el país, sin filas ni complicaciones.',
    cta:        { label: 'Ver catálogo', href: '/catalogo' },
    cta2:       { label: '¿Cómo funciona?', href: '/envios-y-entregas' },
    glow:       'rgba(217,119,6,0.22)',
    accent:     '#c2620a',
    image:      '/hero-entrega.jpg',
    imageAlt:   'Entrega de lentes de contacto en toda República Dominicana',
    precio:     null,
    textColor:  'dark',
  },
  {
    badge:      '👓 Para ver de cerca y de lejos',
    tag:        null,
    title:      'Lee, maneja y vive\nsin cambiar de lente',
    subtitle:   'Biofinity® Multifocal. Visión nítida a todas las distancias, sin lentes de armazón.',
    cta:        { label: 'Pedir Biofinity Multifocal', href: '/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana' },
    cta2:       { label: 'Ver multifocales', href: '/catalogo?tipo=multifocal' },
    glow:       'rgba(124,58,237,0.22)',
    accent:     '#7c3aed',
    image:      '/hero-multifocal.jpg',
    imageAlt:   'Biofinity Multifocal — visión de cerca y de lejos',
    precio:     null,
    textColor:  'dark',
  },
  {
    badge:      '✅ Para toda la familia',
    tag:        null,
    title:      'Aquí siempre\nhay para ti',
    subtitle:   'Sin importar tu graduación o marca. Y si no lo tenemos, te avisamos rápido por WhatsApp.',
    cta:        { label: 'Ver catálogo', href: '/catalogo' },
    cta2:       { label: 'Escríbenos por WhatsApp', href: 'https://wa.me/18096942268?text=Hola%20ContactGo%20%F0%9F%91%8B' },
    glow:       'rgba(5,150,105,0.25)',
    accent:     '#047857',
    image:      '/hero-garantia.jpg',
    imageAlt:   'ContactGo — lentes de contacto para toda la familia',
    precio:     null,
    textColor:  'dark',
  },
]

export default function HeroSlider({
  precioOasys,
  preciosHero = {},
}: {
  lentesCount?: number
  precioOasys?: number
  preciosHero?: Record<string, number>
}) {
  const [current, setCurrent]             = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchEndX   = useRef<number>(0)
  const autoRef     = useRef<ReturnType<typeof setInterval>|null>(null)

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 240)
  }, [current, transitioning])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

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

  const precioTexto = (() => {
    if (!s.precio) return null
    const val = s.precio.slug === OASYS_SLUG && precioOasys
      ? precioOasys
      : (preciosHero[s.precio.slug] ?? s.precio.fallback)
    return `RD$${val.toLocaleString('es-DO')}`
  })()

  const isDark = s.textColor === 'dark'
  const textMain   = isDark ? '#0B2540' : '#ffffff'
  const textSub    = isDark ? 'rgba(11,37,64,0.72)' : 'rgba(255,255,255,0.82)'
  const textFaint  = isDark ? 'rgba(11,37,64,0.5)'  : 'rgba(255,255,255,0.6)'

  // ─── Dots ──────────────────────────────────────────────────────────
  const Dots = () => (
    <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Slide ${i + 1}`}
          onClick={() => { goTo(i); resetAuto() }}
          className="rounded-full transition-all duration-300 focus:outline-none"
          style={{
            width:      i === current ? 16 : 5,
            height:     5,
            background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
          }}
        />
      ))}
    </div>
  )

  return (
    <section
      aria-label="Hero — ContactGo lentes de contacto"
      className="relative overflow-hidden select-none bg-[#eef3f8]"
    >
      {/* Capa de swipe */}
      <div
        className="absolute inset-0 z-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-hidden="true"
      />

      {/* Altura FIJA por dispositivo (no depende del ancho) — así nunca se dispara
          en monitores grandes ni exige scroll de más para ver el resto de la página */}
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[540px]">
        <Image
          src={s.image}
          alt={s.imageAlt}
          fill
          className="object-cover transition-opacity duration-300"
          style={{ opacity: transitioning ? 0 : 1 }}
          sizes="100vw"
          quality={88}
          priority={current === 0}
          fetchPriority={current === 0 ? 'high' : 'auto'}
          onError={(e) => { (e.target as HTMLImageElement).src = '/hero-lens-1.png' }}
        />

        {/* Scrim de legibilidad — degradado suave detrás del texto, se adapta a cada foto */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-[58%]"
            style={{ background: `linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 60%, transparent 100%)` }}
          />
          <div
            className="absolute top-0 left-0 w-[45%] h-full opacity-50 transition-colors duration-500"
            style={{ background: `radial-gradient(ellipse at 15% 40%, ${s.glow} 0%, transparent 68%)` }}
          />
        </div>

        {/* ── Texto + CTAs — flotando en el espacio libre de la imagen, NUNCA en una caja ── */}
        <div
          className="absolute inset-y-0 left-0 flex flex-col justify-center transition-opacity duration-300"
          style={{
            width: 'min(44%, 560px)',
            paddingLeft: 'clamp(1rem, 3.5vw, 3rem)',
            paddingRight: 'clamp(0.75rem, 1.8vw, 1.25rem)',
            opacity: transitioning ? 0 : 1,
          }}
        >
          <p
            className="font-bold uppercase hidden sm:block"
            style={{ color: textFaint, fontSize: 'clamp(0.55rem, 0.85vw, 0.68rem)', letterSpacing: '0.1em', marginBottom: 'clamp(0.3rem, 0.9vw, 0.5rem)' }}
          >
            {s.badge}
          </p>

          {s.tag && (
            <span
              className="hidden md:inline-flex items-center font-black rounded-full w-fit"
              style={{
                fontSize: 'clamp(0.55rem, 0.8vw, 0.68rem)',
                padding: '0.3em 0.8em',
                marginBottom: 'clamp(0.35rem, 1vw, 0.6rem)',
                background: '#fbbf24',
                color: '#451a03',
              }}
            >
              {s.tag}
            </span>
          )}

          <h1
            className="font-display font-black whitespace-pre-line"
            style={{ lineHeight: 1.06, letterSpacing: '-0.01em' }}
          >
            {s.title.split('\n').map((line, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  color: i === 0 ? textMain : s.accent,
                  fontSize: 'clamp(1.2rem, 3.1vw, 2.5rem)',
                  textShadow: isDark ? '0 1px 12px rgba(255,255,255,0.4)' : '0 1px 12px rgba(0,0,0,0.25)',
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="hidden sm:block"
            style={{
              color: textSub,
              fontSize: 'clamp(0.68rem, 1.05vw, 0.9rem)',
              lineHeight: 1.4,
              marginTop: 'clamp(0.4rem, 1vw, 0.7rem)',
              maxWidth: '32ch',
            }}
          >
            {s.subtitle}
          </p>

          {precioTexto && (
            <div className="flex items-baseline gap-1.5" style={{ marginTop: 'clamp(0.5rem, 1.3vw, 0.9rem)' }}>
              <span style={{ color: textFaint, fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)' }}>Desde</span>
              <span style={{ color: s.accent, fontWeight: 900, fontSize: 'clamp(1.05rem, 1.9vw, 1.5rem)' }}>{precioTexto}</span>
            </div>
          )}

          <div
            className="flex flex-col items-start"
            style={{ gap: 'clamp(0.35rem, 0.9vw, 0.55rem)', marginTop: 'clamp(0.55rem, 1.5vw, 1.1rem)' }}
          >
            <Link
              href={s.cta.href}
              onClick={() => { if (autoRef.current) clearInterval(autoRef.current) }}
              className="inline-flex items-center gap-1.5 font-black rounded-lg sm:rounded-xl active:scale-[0.97] hover:brightness-110 transition-all"
              style={{
                background: s.accent,
                color: '#ffffff',
                fontSize: 'clamp(0.66rem, 0.95vw, 0.85rem)',
                padding: 'clamp(0.5rem, 1.15vw, 0.8rem) clamp(0.85rem, 2vw, 1.4rem)',
                boxShadow: `0 8px 24px -6px ${s.accent}99, 0 2px 8px -2px rgba(0,0,0,0.15)`,
              }}
            >
              {s.cta.label}
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {s.cta2 && (
              <Link
                href={s.cta2.href}
                className="hidden sm:inline-flex items-center gap-1 font-semibold rounded-lg sm:rounded-xl transition-all"
                style={{
                  border: `1.5px solid ${isDark ? 'rgba(11,37,64,0.25)' : 'rgba(255,255,255,0.35)'}`,
                  color: textSub,
                  fontSize: 'clamp(0.65rem, 0.95vw, 0.8rem)',
                  padding: 'clamp(0.4rem, 1.1vw, 0.7rem) clamp(0.7rem, 1.8vw, 1.25rem)',
                }}
              >
                {s.cta2.label}
              </Link>
            )}
          </div>
        </div>

        {/* ── Controles — esquina inferior derecha, sobre la foto ── */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 flex items-center gap-2 z-10">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2">
            <Dots />
            <div className="flex gap-1">
              {[
                { fn: prev, label: 'Anterior', path: 'M15 19l-7-7 7-7' },
                { fn: next, label: 'Siguiente', path: 'M9 5l7 7-7 7' },
              ].map(({ fn, label, path }) => (
                <button
                  key={label}
                  onClick={() => { fn(); resetAuto() }}
                  aria-label={label}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
