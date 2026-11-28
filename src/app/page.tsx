import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContactGo — Lentes de contacto en República Dominicana',
  description: 'Compra lentes de contacto ACUVUE, Air Optix, Biofinity y más en ContactGo. Encuentra opciones según tu receta, paga de forma segura y recibe en toda República Dominicana.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://www.contactgo.net' },
}
import { ChevronRight, Truck, Shield, Star, Clock, Zap, RefreshCw, Award, Users, CheckCircle, Package, FileSearch } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import HeroSlider from '@/components/ui/HeroSlider'
import Footer from '@/components/ui/Footer'
import AzulLogo from '@/components/ui/AzulLogo'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'
import PersonalizedSection from '@/components/shop/PersonalizedSection'
import type { Product } from '@/types'

// Menos regeneraciones en Vercel Hobby: datos públicos pueden tardar hasta 10 min en refrescar.
export const revalidate = 600

async function getFeaturedProducts(): Promise<{ products: Product[], reseñasCount: number, reseñasAvg: number, precioOasys: number, preciosHero: Record<string, number> }> {
  const sb = await createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('id, nombre, slug, precio, imagen_url, tipo, stock, marca, reemplazo, contenido, sph_disponibles, cyl_disponibles, axis_disponibles, add_disponibles, colores_disponibles, precio_anterior')
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
    .gt('stock', 0)
    .in('tipo', ['esferico','torico','multifocal','color'])
    .order('nombre', { ascending: true })
    .limit(8)

  // Precio real de ACUVUE Oasys para el HeroSlider — fuente única: Supabase
  const { data: oasysData } = await sb.from('products')
    .select('precio')
    .eq('sku', 'AOASYS-6U')
    .eq('activo', true)
    .single()

  // Precios reales de los productos destacados del HeroSlider (6 slides nuevos)
  // Fuente única: Supabase — así si Mario cambia el precio en el admin, el hero se actualiza solo.
  const HERO_SLUGS = [
    'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana',
    'air-optix-colors-lentes-contacto-color-dominicana',
    'biofinity-multifocal-lentes-presbicia-coopervision-dominicana',
  ]
  const { data: heroPrices } = await sb.from('products')
    .select('slug, precio')
    .in('slug', HERO_SLUGS)
    .eq('activo', true)

  const preciosHero: Record<string, number> = {}
  for (const p of heroPrices ?? []) {
    preciosHero[p.slug] = Number(p.precio)
  }

  // Reseñas reales de productos: solo aprobadas y verificadas.
  const { data: reseñasData, count: reseñasCount } = await sb.from('product_reviews')
    .select('rating', { count: 'exact' })
    .eq('approved', true)
    .eq('verified', true)
    .gte('rating', 1)
    .lte('rating', 5)
    .not('comment', 'is', null)
  const reseñasAvg = reseñasData?.length
    ? reseñasData.reduce((s, r: any) => s + Number(r.rating), 0) / reseñasData.length
    : 0

  return {
    products: (data ?? []) as unknown as Product[],
    reseñasCount: reseñasCount ?? 0,
    reseñasAvg,
    precioOasys: oasysData ? Number(oasysData.precio) : 3350,
    preciosHero,
  }
}

const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Cuánto tarda el envío en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "24 a 72 horas laborables en todo el país para lentes esféricos." } },
    { "@type": "Question", "name": "¿Son certificados los lentes de ContactGo?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. Trabajamos con productos de marcas reconocidas y distribuidores autorizados. Nunca vendemos imitaciones." } },
    { "@type": "Question", "name": "¿Necesito receta médica?", "acceptedAnswer": { "@type": "Answer", "text": "Para lentes graduados sí. Para lentes de color sin graduación no es necesaria." } },
    { "@type": "Question", "name": "¿Cómo pago mis lentes?", "acceptedAnswer": { "@type": "Answer", "text": "Aceptamos tarjeta de crédito/débito Visa y Mastercard procesadas por AZUL, plataforma de Banco Popular. El pago es 100% seguro con tecnología 3D Secure." } }
  ]
}

export default async function HomePage() {
  const { products: featured, precioOasys, preciosHero } = await getFeaturedProducts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }} />
      <Navbar />
      <main id="main-content">

        {/* ── HERO ── */}
        <HeroSlider precioOasys={precioOasys} preciosHero={preciosHero} />

        {/* ── Buscador rápido — el cliente lo necesita en mobile ─────────── */}
        <section className="bg-white px-4 py-3 border-b border-gray-50 sticky top-14 z-30 shadow-sm">
          <a href="/catalogo"
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 transition-colors w-full max-w-2xl mx-auto">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-400 flex-1">Busca ACUVUE, Air Optix, graduación...</span>
            <span className="text-xs font-bold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full flex-shrink-0">Buscar</span>
          </a>
        </section>

        {/* ── CATEGORÍAS — reordenado: justo debajo del slider ── */}
        <PersonalizedSection />

        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Compra por tipo</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              {
                label: 'Esféricos', slug: 'esferico',
                desc: 'Miopía e hipermetropía',
                bg: 'bg-slate-50', fg: 'text-[#002455]',
                // LENTE DE CONTACTO simple — disco con anillo interno y highlight de curvatura
                svg: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="16" r="12"/>
                    <circle cx="16" cy="16" r="8" opacity="0.45"/>
                    <path d="M9 11 Q 13 7 19 8" strokeWidth="1.4" opacity="0.75"/>
                  </svg>
                ),
              },
              {
                label: 'Tóricos', slug: 'torico',
                desc: 'Para astigmatismo',
                bg: 'bg-slate-50', fg: 'text-[#002455]',
                // LENTE DE CONTACTO tórico — con marca de eje inclinada + punto de orientación
                svg: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="16" r="12"/>
                    <circle cx="16" cy="16" r="8" opacity="0.35"/>
                    <line x1="8" y1="20" x2="24" y2="12" strokeWidth="1.4" opacity="0.75"/>
                    <circle cx="16" cy="28" r="1.1" fill="currentColor"/>
                    <path d="M9 11 Q 13 7 19 8" strokeWidth="1.2" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                label: 'Multifocales', slug: 'multifocal',
                desc: 'Cerca y lejos a la vez',
                bg: 'bg-slate-50', fg: 'text-[#002455]',
                // LENTE DE CONTACTO multifocal — anillos concéntricos (zonas de graduación)
                svg: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="16" r="12"/>
                    <circle cx="16" cy="16" r="9" opacity="0.55"/>
                    <circle cx="16" cy="16" r="6" opacity="0.4"/>
                    <circle cx="16" cy="16" r="3" opacity="0.3"/>
                    <path d="M9 11 Q 13 7 19 8" strokeWidth="1.2" opacity="0.6"/>
                  </svg>
                ),
              },
              {
                label: 'Color', slug: 'color',
                desc: 'Con o sin graduación',
                bg: 'bg-slate-50', fg: 'text-[#002455]',
                // LENTE DE CONTACTO cosmético — disco con iris coloreado y patrón radial
                svg: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="16" cy="16" r="12"/>
                    <circle cx="16" cy="16" r="7" fill="currentColor" fillOpacity="0.15"/>
                    <circle cx="16" cy="16" r="7" strokeWidth="1.3"/>
                    <circle cx="16" cy="16" r="2.3" fill="currentColor"/>
                    <path d="M16 9.5 L16 11.5 M16 20.5 L16 22.5 M9.5 16 L11.5 16 M20.5 16 L22.5 16 M11.5 11.5 L12.9 12.9 M19.1 19.1 L20.5 20.5 M20.5 11.5 L19.1 12.9 M12.9 19.1 L11.5 20.5" strokeWidth="1.2" opacity="0.6"/>
                    <path d="M9 11 Q 13 7 19 8" strokeWidth="1.2" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                label: 'Soluciones', slug: 'solucion', href: '/soluciones',
                desc: 'Limpieza y cuidado',
                bg: 'bg-slate-50', fg: 'text-[#002455]',
                // Frasco de solución para lentes de contacto
                svg: (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4 h8 v3 h-8 z"/>
                    <path d="M11 7 h10 l1 3 v15 a3 3 0 0 1 -3 3 h-6 a3 3 0 0 1 -3 -3 v-15 z"/>
                    <path d="M11 15 h10" opacity="0.5"/>
                    <circle cx="16" cy="20" r="2" opacity="0.55"/>
                  </svg>
                ),
              },
            ].map(cat => (
              <Link key={cat.slug} href={cat.href ?? `/catalogo?tipo=${cat.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-3 md:p-5 text-center hover:border-slate-400 group transition-colors">
                <div className={`w-11 h-11 md:w-16 md:h-16 mx-auto mb-2 rounded-xl border border-slate-200 ${cat.bg} ${cat.fg} flex items-center justify-center`}>
                  <div className="w-7 h-7 md:w-9 md:h-9">{cat.svg}</div>
                </div>
                <p className="font-semibold text-gray-900 text-xs md:text-sm">{cat.label}</p>
                <p className="text-[10px] leading-snug md:text-xs text-slate-500 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Herramienta para revisar la receta ── */}
        <section className="mx-4 md:mx-8 mb-8 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileSearch className="h-5 w-5 text-[#002455]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Herramienta gratuita</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#002455] mb-2">
                Revisa tu receta y encuentra opciones
              </h2>
              <p className="text-slate-600 max-w-md text-sm md:text-base">
                Introduce los datos de tu receta para revisar qué productos del catálogo pueden coincidir con sus parámetros.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/receta" className="bg-[#002455] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#001F4A] transition-colors flex items-center gap-2 justify-center">
                <FileSearch className="w-4 h-4" /> Revisar mi receta
              </Link>
              <Link href="/catalogo" className="border border-slate-300 text-[#002455] font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors flex items-center gap-2 justify-center">
                Ver catálogo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR — reordenado: tercero ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: Truck,    title: 'Envíos a todo el país',  desc: 'Santo Domingo 24-48h · Santiago 24-48h · Resto del país 24-72 horas',    color: 'text-[#002455]',   bg: 'bg-slate-100' },
                { icon: Package,  title: 'Marcas originales',   desc: 'Distribuidores autorizados de cada marca',        color: 'text-[#002455]',  bg: 'bg-slate-100' },
                { icon: Shield, title: 'Pago seguro', desc: 'Tarjeta con AZUL · Banco Popular', color: 'text-[#002455]', bg: 'bg-slate-100' },
                { icon: Clock,    title: 'Atención personalizada', desc: 'WhatsApp · Email · Chat',  color: 'text-[#002455]', bg: 'bg-slate-100' },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTOS POPULARES ── */}
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Productos destacados</h2>
              <p className="text-gray-500 text-sm mt-0.5">Una selección del catálogo disponible</p>
            </div>
            <Link href="/catalogo" className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 items-start gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">Cargando productos...</div>
          )}
        </section>

        {/* ── SUSCRIPCIÓN ── */}
        <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-[#008F95]" />
                <span className="text-[#008F95] font-semibold text-sm">Reposición de tus lentes</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[#002455] mb-2">Recuerda cuándo toca reponerlos</h3>
              <p className="text-slate-600 max-w-md text-sm md:text-base">
                Puedes escribirnos para consultar cómo programar un aviso según la frecuencia de reemplazo de tus lentes.
              </p>
            </div>
            <a href="https://wa.me/18096942268?text=Hola%20ContactGo%2C%20quiero%20activar%20recordatorio%20de%20recompra"
              target="_blank" rel="noopener noreferrer"
              className="bg-[#002455] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#001F4A] transition-colors flex items-center gap-2 shrink-0">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white"><path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667z"/></svg>
              Activar por WhatsApp
            </a>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Cuánto tarda el envío?', a: 'El tiempo depende de tu ubicación y del tipo de lente. Los productos bajo pedido pueden requerir un plazo de preparación adicional.' },
              { q: '¿Los productos son originales?', a: 'Trabajamos con distribuidores oficiales. Recibes los productos sellados y en su empaque original.' },
              { q: '¿Necesito receta médica?', a: 'Para lentes graduados necesitas conocer los parámetros de tu receta. Si tienes dudas, podemos orientarte antes de comprar. Los lentes de color sin graduación no requieren graduación.' },
              { q: '¿Cómo pago?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard, procesado por AZUL de Banco Popular con tecnología 3D Secure. El proceso es 100% seguro y ContactGo nunca almacena datos de tu tarjeta.' },
              { q: '¿Qué marcas tienen?', a: 'Acuvue, Air Optix, FreshLook, Biofinity, CooperVision, Bausch+Lomb Ultra, clariti, Proclear y más.' },
              { q: '¿Puedo suscribirme para recompra automática?', a: 'Sí. Te enviamos recordatorio cuando tus lentes estén por terminarse para que puedas recomprar sin complicaciones.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm md:text-base list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                </summary>
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── MARCAS ── */}
        <section className="bg-gray-50 border-y border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Marcas originales y canales autorizados</p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-5">
              {['ACUVUE®', 'AIR OPTIX®', 'FreshLook®', 'Bausch+Lomb', 'CooperVision®', 'Biofinity®', 'Opti-Free®', 'Prolub®'].map(m => (
                <span key={m} className="text-gray-700 font-bold text-sm">{m}</span>
              ))}
            </div>
            {/* Logos tarjetas en homepage — Requerido por Visa/Mastercard/AZUL */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200 flex-wrap">
              <span className="text-xs text-gray-600 font-semibold">Pagos seguros:</span>
              <img src="/visa-blue.png" alt="Visa" width={40} height={16} style={{height:"1rem",width:"auto",objectFit:"contain"}} />
              <img src="/visa-secure.png" alt="Visa Secure" width={40} height={16} style={{height:"1rem",width:"auto",objectFit:"contain"}} />
              <img src="/mastercard-id-check.png" alt="Mastercard ID Check" width={50} height={20} style={{height:"1.25rem",width:"auto",objectFit:"contain"}} />
              <img src="/mastercard.png" alt="Mastercard" width={50} height={20} style={{height:"1.25rem",width:"auto",objectFit:"contain"}} />
              <span className="text-[9px] border border-gray-400 text-gray-600 px-1.5 py-0.5 rounded font-medium">Verified by VISA</span>
              <span className="text-[9px] border border-gray-400 text-gray-600 px-1.5 py-0.5 rounded font-medium">Mastercard ID Check</span>
              <span className="text-[9px] border border-gray-400 text-gray-600 px-1.5 py-0.5 rounded font-medium">🔒 SSL</span>
            </div>
          </div>
        </section>


      </main>
      <div className="pb-20 md:pb-0" />
      <Footer />
    </>
  )
}
