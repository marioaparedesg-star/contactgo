import Link from 'next/link'
import { Eye, Truck, Shield, Clock, ChevronRight, Star, Zap, RefreshCw } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import HeroSlider from '@/components/ui/HeroSlider'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { createServerSupabaseClient } from '@/lib/supabase'
import ProductCard from '@/components/shop/ProductCard'
import PersonalizedSection from '@/components/shop/PersonalizedSection'
import type { Product } from '@/types'

export const revalidate = 60

async function getFeaturedProducts(): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('*, categories(*)')
    .eq('activo', true)
    .gt('stock', 0)
    .in('tipo', ['esferico','torico','multifocal','color'])
    .order('nombre', { ascending: true })
    .limit(8)
  return data ?? []
}

// ── SCHEMA MARKUP COMPLETO ──────────────────────────────────────────────────
const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://contactgo.net/#org",
      "name": "ContactGo",
      "url": "https://contactgo.net",
      "logo": "https://contactgo.net/logo.png",
      "description": "Tienda especializada en lentes de contacto originales en República Dominicana. Entrega en 24-48 horas.",
      "address": { "@type": "PostalAddress", "addressCountry": "DO", "addressLocality": "Santo Domingo" },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-829-472-8328",
        "contactType": "customer service",
        "availableLanguage": "Spanish",
        "contactOption": "TollFree"
      },
      "sameAs": ["https://wa.me/18294728328", "https://www.instagram.com/contactgo.rd"]
    },
    {
      "@type": "WebSite",
      "@id": "https://contactgo.net/#website",
      "url": "https://contactgo.net",
      "name": "ContactGo — Lentes de Contacto República Dominicana",
      "description": "La tienda especializada #1 en lentes de contacto originales en RD. Acuvue, Air Optix, FreshLook, CooperVision.",
      "publisher": { "@id": "https://contactgo.net/#org" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://contactgo.net/catalogo?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Store",
      "@id": "https://contactgo.net/#store",
      "name": "ContactGo",
      "url": "https://contactgo.net",
      "image": "https://contactgo.net/logo.png",
      "description": "Lentes de contacto originales con entrega en 24-48h en República Dominicana.",
      "priceRange": "RD$800 – RD$16,800",
      "currenciesAccepted": "DOP",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "hasMap": "https://wa.me/18294728328",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuánto tarda el envío de lentes de contacto en República Dominicana?",
          "acceptedAnswer": { "@type": "Answer", "text": "Hacemos entrega en 24-48 horas en Santo Domingo y Santiago. Para otras provincias entre 2-3 días hábiles." }
        },
        {
          "@type": "Question",
          "name": "¿Los lentes de contacto de ContactGo son originales?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí, todos nuestros productos son 100% originales y certificados. Trabajamos directamente con distribuidores autorizados de Acuvue, Air Optix, FreshLook, CooperVision y Bausch+Lomb." }
        },
        {
          "@type": "Question",
          "name": "¿Necesito receta para comprar lentes de contacto?",
          "acceptedAnswer": { "@type": "Answer", "text": "Para lentes graduados sí necesitas receta médica vigente. Puedes subirla en nuestra página de receta o enviárnosla por WhatsApp. Para lentes de color sin graduación no es necesaria." }
        },
        {
          "@type": "Question",
          "name": "¿Cuáles marcas de lentes de contacto venden en ContactGo?",
          "acceptedAnswer": { "@type": "Answer", "text": "Tenemos disponibles Acuvue, Air Optix, FreshLook Colorblends, Biofinity, CooperVision, Bausch+Lomb Ultra, clariti y más marcas premium." }
        },
        {
          "@type": "Question",
          "name": "¿Cómo pago mis lentes de contacto?",
          "acceptedAnswer": { "@type": "Answer", "text": "Aceptamos transferencia bancaria, efectivo contra entrega y tarjeta de crédito/débito." }
        }
      ]
    }
  ]
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }}
      />
      <Navbar />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <HeroSlider />

        {/* ── TRUST BAR ─────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: Truck,     title: 'Envío 24–48h',      desc: 'A todo el país',                 color: 'text-blue-600',  bg: 'bg-blue-50' },
                { icon: Shield,    title: '100% Originales',   desc: 'Certificados y garantizados',    color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Star,      title: '+1,000 clientes',   desc: 'Satisfechos en RD',              color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: Clock,     title: 'Asesoría gratis',   desc: 'Soporte profesional',            color: 'text-purple-600',bg: 'bg-purple-50' },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORÍAS ───────────────────────────────────────── */}
        <PersonalizedSection />

        <section className="max-w-7xl mx-auto px-4 py-8 md:py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Compra por tipo</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Esféricos',    slug: 'esferico',   emoji: '👁️',  desc: 'Miopía e hipermetropía' },
              { label: 'Tóricos',      slug: 'torico',     emoji: '🎯',  desc: 'Para astigmatismo' },
              { label: 'Multifocales', slug: 'multifocal', emoji: '🔭',  desc: 'Para presbicia' },
              { label: 'Color',        slug: 'color',      emoji: '🎨',  desc: 'Con y sin graduación' },
              { label: 'Soluciones',   slug: 'solucion',   emoji: '💧',  desc: 'Limpieza y cuidado' },
              { label: 'Gotas',        slug: 'gota',       emoji: '💊',  desc: 'Lubricación ocular' },
            ].map(cat => (
              <Link key={cat.slug} href={`/catalogo?tipo=${cat.slug}`}
                className="card p-3 md:p-4 text-center hover:border-primary-200 hover:-translate-y-0.5 group transition-all">
                <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">{cat.emoji}</div>
                <p className="font-semibold text-gray-900 text-xs md:text-sm">{cat.label}</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden md:block">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BANNER RECETA INTELIGENTE ─────────────────────────── */}
        <section className="bg-gradient-to-r from-primary-600 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
                  Gratis · Sin registro
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
                Encuentra tus lentes exactos
              </h2>
              <p className="text-white/80 max-w-md text-sm md:text-base">
                Ingresa los datos de tu receta y te mostramos exactamente qué lentes necesitas. Sin confusión.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/receta"
                className="bg-white text-primary-700 font-bold px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4" />
                Buscar con mi receta
              </Link>
              <Link href="/catalogo"
                className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
                Ver catálogo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRODUCTOS MÁS POPULARES ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Más populares</h2>
              <p className="text-gray-500 text-sm mt-0.5">Los más vendidos esta semana</p>
            </div>
            <Link href="/catalogo" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Cargando productos...</p>
            </div>
          )}
        </section>

        {/* ── SUSCRIPCIÓN BANNER ────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-14">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm">Nunca te quedes sin lentes</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
                Recordatorio de recompra
              </h3>
              <p className="text-gray-400 max-w-md text-sm md:text-base">
                Te avisamos cuando tus lentes estén por vencer. Un click y las tienes en camino.
              </p>
            </div>
            <a
              href="https://wa.me/18294728328?text=Hola%20ContactGo%2C%20quiero%20activar%20recordatorio%20de%20recompra"
              target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#20ba58] transition-all shadow-lg flex items-center gap-2 shrink-0">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667z"/>
              </svg>
              Activar por WhatsApp
            </a>
          </div>
        </section>

        {/* ── TESTIMONIOS ───────────────────────────────────────── */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
            <div className="text-center mb-8">
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_,i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                +1,000 dominicanos confían en ContactGo
              </h2>
              <p className="text-gray-500 text-sm">Promedio 4.9/5 — 127 reseñas verificadas</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { nombre: 'Paola R.', ciudad: 'Santo Domingo', texto: 'Llegaron rapidísimo y son 100% originales. Ya hice mi segunda compra. ¡Super recomendado!', producto: 'Acuvue Oasys', stars: 5 },
                { nombre: 'Carlos M.', ciudad: 'Santiago', texto: 'El sistema de receta es increíble. Me detectó el tipo exacto de lentes que necesito sin ir a la óptica.', producto: '1-Day Acuvue Moist', stars: 5 },
                { nombre: 'Daniela F.', ciudad: 'Punta Cana', texto: 'Precio mucho mejor que en las ópticas. Llegaron en 24 horas con empaque sellado. 100% confiable.', producto: 'Air Optix COLOR', stars: 5 },
                { nombre: 'Ramón G.', ciudad: 'La Romana', texto: 'Tengo astigmatismo y siempre me costaba encontrar mis lentes. Aquí los tienen todos disponibles.', producto: 'Acuvue Oasys for Astigmatism', stars: 5 },
                { nombre: 'Génesis P.', ciudad: 'San Pedro', texto: 'El chat de WhatsApp responde enseguida. Me ayudaron a escoger el lente correcto para mi receta.', producto: 'Biofinity', stars: 5 },
                { nombre: 'Luis A.', ciudad: 'Santo Domingo', texto: 'Me ahorraron RD$800 vs la óptica. La calidad es la misma, son originales. Nunca más voy a otra parte.', producto: '1-Day Acuvue Moist 90u', stars: 5 },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_,s) => (
                      <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{t.texto}"</p>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.nombre}</p>
                      <p className="text-xs text-gray-400">{t.ciudad}</p>
                    </div>
                    <span className="text-xs bg-primary-50 text-primary-700 font-medium px-2 py-1 rounded-lg">
                      {t.producto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Cuánto tarda el envío?', a: '24-48 horas en Santo Domingo y Santiago. 2-3 días para otras provincias.' },
              { q: '¿Son 100% originales?', a: 'Sí. Trabajamos con distribuidores autorizados de Acuvue, Air Optix, CooperVision y Bausch+Lomb.' },
              { q: '¿Necesito receta médica?', a: 'Para lentes graduados sí. Puedes subirla en /receta o enviárnosla por WhatsApp. Para colores sin graduación no es necesaria.' },
              { q: '¿Cómo pago?', a: 'Transferencia bancaria, efectivo contra entrega o tarjeta de crédito/débito.' },
              { q: '¿Qué marcas tienen?', a: 'Acuvue, Air Optix, FreshLook, Biofinity, CooperVision, Bausch+Lomb, clariti y más.' },
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

        {/* ── MARCAS ───────────────────────────────────────────── */}
        <section className="bg-gray-50 border-y border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Marcas disponibles
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
              {['Acuvue', 'Air Optix', 'FreshLook', 'Bausch+Lomb', 'CooperVision', 'Biofinity', 'Opti-Free', 'Prolub'].map(m => (
                <span key={m} className="text-gray-400 font-semibold text-sm">{m}</span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
