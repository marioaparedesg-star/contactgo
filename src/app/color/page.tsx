import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes de Color RD | FreshLook, Air Optix Colors — ContactGo',
  description: 'Lentes de contacto de color en República Dominicana. FreshLook Colorblends, Air Optix Colors. Con y sin graduación. Entrega a domicilio en 24-48h.',
  alternates: { canonical: 'https://contactgo.net/color' },
  openGraph: {
    title: 'Lentes de Color RD | FreshLook, Air Optix Colors',
    description: 'Lentes de contacto de color en República Dominicana. AIR OPTIX Colors, FreshLook Colorblends, Lunare Tri-Kolor. Colores naturales y dramáticos.',
    url: 'https://contactgo.net/color',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}
export const revalidate = 60

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'color').order('nombre')

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <span className="text-gray-700 font-medium">Lentes de Color</span>
        </nav>
        <section className="bg-gradient-to-br from-pink-600 via-purple-600 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Con y sin graduación</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes de Contacto de Color en RD</h1>
          <p className="text-pink-100 text-lg max-w-xl mx-auto">FreshLook Colorblends, Air Optix Colors y más. Cambia tu mirada con colores naturales y vibrantes. Entrega en 24-48h.</p>
        </section>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Lentes de color en República Dominicana</h2>
          <p>Los lentes de contacto de color son una forma segura y cómoda de cambiar o realzar el color de tus ojos. En ContactGo manejamos las marcas más populares: <strong>FreshLook® Colorblends</strong> de Alcon (con 12 colores disponibles) y <strong>AIR OPTIX® Colors</strong>, perfectos para ojos oscuros dominicanos.</p>
          <p>Disponibles con y sin graduación. Si tienes miopía, astigmatismo o hipermetropía, puedes usar lentes de color con tu prescripción. Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta</Link> para encontrar el tuyo.</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Los lentes de color son seguros?', a: 'Sí, siempre que sean lentes certificados de marcas reconocidas como FreshLook (Alcon) o Air Optix Colors. Nunca compres lentes de color sin certificación médica o de vendedores no autorizados.' },
              { q: '¿Los lentes de color se ven naturales en ojos oscuros?', a: 'FreshLook Colorblends y Air Optix Colors están diseñados específicamente para ojos oscuros y producen un efecto natural. Los colores más populares en RD para ojos oscuros son: gris, miel, verde y avellana.' },
              { q: '¿Puedo usar lentes de color si tengo graduación?', a: 'Sí. Manejamos lentes de color con prescripción para miopía e hipermetropía. Usa nuestra calculadora de receta para encontrar la graduación correcta.' },
            ].map(f => (
              <div key={f.q} className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Schema ItemList para rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Lentes de contacto color en República Dominicana",
          "description": "Lista de lentes de contacto color disponibles en ContactGo RD",
          "url": "https://contactgo.net/color",
          "itemListElement": []
        })}} />

        {/* FAQPage Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": "¿Se pueden usar lentes de color sin graduación?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, existen lentes de color con graduación 0.00 (plano) para uso puramente estético. También están disponibles con graduación para personas que necesitan corrección visual."}}, {"@type": "Question", "name": "¿Cuánto duran los lentes de contacto de color?", "acceptedAnswer": {"@type": "Answer", "text": "Depende del tipo: los diarios se descartan cada día, los quincenales cada 15 días y los mensuales cada 30 días. Siempre siguiendo las indicaciones del fabricante."}}, {"@type": "Question", "name": "¿Son seguros los lentes de contacto de color?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, siempre que sean de marcas certificadas como AIR OPTIX, FreshLook o equivalentes, y se usen con una prescripción válida de un profesional óptico."}}]
        })}} />
      </main>
      <Footer />
    </>
  )
}
