import Link from 'next/link'
import { Eye, Truck, Shield, Clock, ChevronRight, Star } from 'lucide-react'
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

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ContactGo",
        "url": "https://contactgo.net",
        "logo": "https://contactgo.net/logo.png",
        "description": "Tienda online de lentes de contacto originales en República Dominicana.",
        "address": {"@type":"PostalAddress","addressCountry":"DO","addressLocality":"Santo Domingo"},
        "contactPoint": {"@type":"ContactPoint","telephone":"+1-829-408-9097","contactType":"customer service","availableLanguage":"Spanish"},
        "sameAs": ["https://wa.me/18294089097"]
      })}} />
      <Navbar />
      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <HeroSlider />

        {/* ── BENEFICIOS ────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Envío en 24–48h', desc: 'A todo el país' },
              { icon: Shield, title: '100% Originales', desc: 'Productos auténticos certificados' },
              { icon: Star, title: '+1,000 clientes', desc: 'Satisfechos en RD' },
              { icon: Clock, title: 'Asesoría gratis', desc: 'Te ayudamos a elegir' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORÍAS ───────────────────────────────────────── */}
        <PersonalizedSection />

        <section className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-7">Compra por tipo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Esféricos',    slug: 'esferico',   emoji: '👁️',  desc: 'Miopía e hipermetropía' },
              { label: 'Tóricos',      slug: 'torico',     emoji: '🎯',  desc: 'Para astigmatismo' },
              { label: 'Multifocales', slug: 'multifocal', emoji: '🔭',  desc: 'Para presbicia' },
              { label: 'Color',        slug: 'color',      emoji: '🎨',  desc: 'Con y sin graduación' },
              { label: 'Soluciones',   slug: 'solucion',   emoji: '💧',  desc: 'Limpieza y cuidado' },
              { label: 'Gotas',        slug: 'gota',       emoji: '💊',  desc: 'Lubricación ocular' },
            ].map(cat => (
              <Link key={cat.slug} href={`/catalogo?tipo=${cat.slug}`}
                className="card p-4 text-center hover:border-primary-200 hover:-translate-y-0.5 group">
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-semibold text-gray-900 text-sm">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── RECETA INTELIGENTE BANNER ─────────────────────────── */}
        <section className="bg-gradient-to-r from-primary-50 to-teal-50 border-y border-primary-100">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <span className="badge bg-primary-100 text-primary-700">Nuevo</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                Buscador inteligente de lentes
              </h3>
              <p className="text-gray-600 max-w-md">
                Ingresa los datos de tu receta y te mostramos exactamente qué tipo de lentes necesitas.
                Con filtro automático por graduación.
              </p>
            </div>
            <Link href="/receta" className="btn-primary whitespace-nowrap flex items-center gap-2">
              Buscar con mi receta <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── PRODUCTOS DESTACADOS ──────────────────────────────── */}
        <PersonalizedSection />

        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-7">
            <h2 className="font-display text-2xl font-bold text-gray-900">Más populares</h2>
            <Link href="/catalogo" className="text-sm font-semibold text-primary-600 hover:text-primary-700
              flex items-center gap-1">
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

        {/* ── MARCAS ───────────────────────────────────────────── */}
        {/* Testimonios */}
        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-500">Más de 1,000 dominicanos ya confían en ContactGo</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { nombre: 'Paola R.', ciudad: 'Santo Domingo', texto: 'Llegaron rapidísimo y son 100% originales. Ya hice mi segunda compra. Super recomendado!', producto: 'Acuvue Oasys', stars: 5 },
              { nombre: 'Carlos M.', ciudad: 'Santiago', texto: 'Nunca pensé que comprar lentes online fuera tan fácil. El sistema de receta es increíble, me detectó el tipo exacto.', producto: '1-Day Acuvue Moist', stars: 5 },
              { nombre: 'Daniela F.', ciudad: 'Punta Cana', texto: 'Precio mucho mejor que en las ópticas. Llegaron en 24 horas y con empaque sellado. 100% confiable.', producto: 'Air Optix COLOR', stars: 5 },
              { nombre: 'Ramón G.', ciudad: 'La Romana', texto: 'Tengo astigmatismo y siempre me costaba encontrar mis lentes. Aquí los tienen todos disponibles.', producto: 'Acuvue Oasys for Astigmatism', stars: 5 },
              { nombre: 'Génesis P.', ciudad: 'San Pedro', texto: 'El chat de WhatsApp responde enseguida. Me ayudaron a escoger el lente correcto para mi receta.', producto: 'Biofinity', stars: 5 },
              { nombre: 'Luis A.', ciudad: 'Santo Domingo', texto: 'Compré Acuvue Moist 90u y me ahorraron como RD$800 vs la óptica. La calidad es la misma, son originales.', producto: '1-Day Acuvue Moist 90u', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_,s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">"{t.texto}"</p>
                <div className="mt-auto pt-3 border-t border-gray-50">
                  <p className="font-semibold text-gray-900 text-sm">{t.nombre}</p>
                  <p className="text-xs text-gray-400">{t.ciudad} · {t.producto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 border-y border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Marcas disponibles
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {['Acuvue', 'Air Optix', 'FreshLook', 'Bausch+Lomb', 'CooperVision', 'Opti-Free'].map(m => (
                <span key={m} className="text-gray-500 font-semibold text-sm">{m}</span>
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
