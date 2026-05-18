import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes Multifocales para Presbicia RD — ContactGo',
  description: 'Lentes multifocales para presbicia y vista cansada en República Dominicana. ACUVUE Oasys Presbyopia, AIR OPTIX Multifocal, Proclear Multifocal. Envío 24-48h.',
  alternates: { canonical: 'https://contactgo.net/multifocales' },
  openGraph: {
    title: 'Lentes Multifocales para Presbicia RD',
    description: 'Lentes de contacto multifocales en RD para presbicia. ACUVUE OASYS Multifocal, Biofinity Multifocal, Proclear Multifocal. Ve bien de cerca y lejos.',
    url: 'https://contactgo.net/multifocales',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}
export const revalidate = 60

const faqs = [
  { q: '¿Qué son los lentes multifocales?', a: 'Los lentes multifocales tienen múltiples zonas de potencia óptica en un solo lente, permitiendo ver claramente a diferentes distancias (cerca, intermedia y lejos) sin necesitar gafas de lectura.' },
  { q: '¿Para qué sirven los lentes multifocales?', a: 'Son la solución para la presbicia (vista cansada), que generalmente aparece después de los 40 años. Permiten leer, usar el computador y ver de lejos con el mismo lente.' },
  { q: '¿Cuánto tiempo toma adaptarse a los lentes multifocales?', a: 'El período de adaptación varía entre 1 y 4 semanas. Durante este tiempo el cerebro aprende a usar las diferentes zonas del lente automáticamente. Es normal sentir algo de confusión al inicio.' },
]

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'multifocal').order('nombre')

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <span className="text-gray-700 font-medium">Lentes Multifocales</span>
        </nav>
        <section className="bg-gradient-to-br from-amber-600 via-primary-600 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Para presbicia</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes Multifocales para Presbicia en RD</h1>
          <p className="text-amber-100 text-lg max-w-xl mx-auto">Ve de cerca y de lejos con el mismo lente. Sin gafas de lectura. Envío a domicilio en toda la República Dominicana.</p>
        </section>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Lentes multifocales en República Dominicana</h2>
          <p>La presbicia o vista cansada es una condición natural que afecta a casi todas las personas después de los 40 años. El ojo pierde flexibilidad para enfocar objetos cercanos. Los <strong>lentes de contacto multifocales</strong> son la solución más cómoda y discreta para mantener una vida activa sin depender de gafas de lectura.</p>
          <p>En ContactGo manejamos los mejores multifocales disponibles: <strong>ACUVUE® Oasys Presbyopia</strong>, <strong>AIR OPTIX® plus HydraGlyde® Multifocal</strong>, <strong>Proclear® Multifocal</strong> y más. Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta</Link> para encontrar el tuyo.</p>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(f => (<div key={f.q} className="bg-gray-50 rounded-2xl p-5"><h3 className="font-bold text-gray-900 text-sm mb-2">{f.q}</h3><p className="text-gray-600 text-sm leading-relaxed">{f.a}</p></div>))}
          </div>
        </section>

        {/* Schema ItemList para rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Lentes de contacto multifocales en República Dominicana",
          "description": "Lista de lentes de contacto multifocales disponibles en ContactGo RD",
          "url": "https://contactgo.net/multifocales",
          "itemListElement": []
        })}} />
      </main>
      <Footer />
    </>
  )
}
