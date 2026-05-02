import Link from 'next/link'
import { Eye, Truck, Shield, Clock, ChevronRight, Star } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { createServerSupabaseClient } from '@/lib/supabase'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

export const revalidate = 60

async function getFeaturedProducts(): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('*, categories(*)')
    .eq('activo', true)
    .gt('stock', 0)
    .order('stock', { ascending: false })
    .limit(8)
  return data ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 text-sm font-semibold mb-5">
                🚚 Envío en 24–48h en todo el país
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Lentes de contacto
                <br />
                <span className="text-primary-200">a tu puerta</span>
              </h1>
              <p className="text-lg text-primary-100 mb-8 leading-relaxed max-w-md">
                Acuvue, Air Optix, FreshLook y más marcas premium. Entrega rápida en República Dominicana.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/catalogo" className="bg-white text-primary-700 font-bold px-7 py-3.5 rounded-xl
                  hover:bg-primary-50 transition-colors shadow-lg shadow-primary-900/20">
                  Ver catálogo →
                </Link>
                <Link href="/receta" className="border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl
                  hover:bg-white/10 transition-colors">
                  Buscar por receta
                </Link>
              </div>
            </div>
            {/* Visual */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                {/* Decorative circles */}
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-white/10" />
                <div className="absolute inset-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Eye className="w-24 h-24 text-white opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFICIOS ────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Envío rápido', desc: '24–48h en todo RD' },
              { icon: Shield, title: 'Productos originales', desc: '100% auténticos' },
              { icon: Clock, title: 'Siempre disponible', desc: 'Atención por WhatsApp' },
              { icon: Star, title: 'Clientes satisfechos', desc: 'Miles de pedidos' },
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
