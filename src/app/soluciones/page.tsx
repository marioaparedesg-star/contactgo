import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Soluciones y Gotas para Lentes de Contacto RD — ContactGo',
  description: 'Soluciones multipropósito y gotas lubricantes para lentes de contacto en República Dominicana. ReNu, Opti-Free, Systane, Refresh. Envío 24-48h.',
  alternates: { canonical: 'https://www.contactgo.net/soluciones' },
  openGraph: {
    title: 'Soluciones y Gotas para Lentes RD',
    description: 'Soluciones multipropósito y gotas para lentes de contacto en RD.',
    url: 'https://www.contactgo.net/soluciones',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}
export const revalidate = 60

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: soluciones } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'solucion').order('nombre')
  const { data: gotas } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'gota').order('nombre')
  const products = [...(soluciones ?? []), ...(gotas ?? [])]

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <span className="text-gray-700 font-medium">Soluciones y Gotas</span>
        </nav>
        <section className="bg-gradient-to-br from-teal-700 via-primary-600 to-blue-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Cuidado ocular</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Soluciones y Gotas para Lentes en RD</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">ReNu, Opti-Free, Systane, Refresh y más. Todo para el cuidado y confort de tus lentes de contacto.</p>
        </section>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Soluciones y gotas para lentes en República Dominicana</h2>
          <p>Para mantener tus lentes de contacto en perfectas condiciones necesitas una buena solución multipropósito. En ContactGo tenemos las mejores marcas: <strong>ReNu® Advanced</strong> (Bausch+Lomb), <strong>Opti-Free® Puremoist</strong> (Alcon) y <strong>PROLUB® Hyfresh</strong> para limpieza diaria.</p>
          <p>También manejamos gotas lubricantes para ojos secos: <strong>Systane® Ultra</strong>, <strong>Refresh® Optive</strong>, <strong>Lagricel®</strong> y más. Ideales para días de mucha pantalla o aire acondicionado.</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: '¿Qué solución multipropósito es mejor?', a: 'Depende de tu tipo de lente. Opti-Free Puremoist es ideal para lentes de silicona hidrogel. ReNu Advanced funciona bien con la mayoría de lentes hidrogel convencionales. Para lentes sensibles, recomendamos Prolub Hyfresh.' },
              { q: '¿Puedo usar gotas para ojos secos con lentes de contacto?', a: 'Sí, pero deben ser gotas compatibles con lentes de contacto. Systane Ultra y Refresh Optive Advanced son las más recomendadas para uso con lentes. Evita gotas que digan "para ojos rojos" ya que pueden dañar los lentes.' },
              { q: '¿Cuánto tiempo dura una solución multipropósito?', a: 'Una vez abierta, generalmente 90 días. Siempre revisa la fecha de vencimiento en el envase y no uses la solución después de esa fecha, incluso si queda líquido.' },
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
          "name": "Lentes de contacto soluciones en República Dominicana",
          "description": "Lista de lentes de contacto soluciones disponibles en ContactGo RD",
          "url": "https://www.contactgo.net/soluciones",
          "itemListElement": []
        })}} />

        {/* FAQPage Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": "¿Cuál es la diferencia entre solución multipropósito y de peróxido?", "acceptedAnswer": {"@type": "Answer", "text": "La multipropósito limpia, aclara y desinfecta en un solo paso. La de peróxido (como AOSept) es más efectiva para limpiar depósitos pero requiere neutralización antes de usar los lentes."}}, {"@type": "Question", "name": "¿Con qué frecuencia debo cambiar la solución?", "acceptedAnswer": {"@type": "Answer", "text": "Debes cambiar la solución de tu estuche cada vez que guardes los lentes. Nunca reutilices la solución anterior ni mezcles marcas diferentes."}}, {"@type": "Question", "name": "¿Puedo usar solución salina para limpiar lentes de contacto?", "acceptedAnswer": {"@type": "Answer", "text": "No. La solución salina solo enjuaga, no desinfecta. Siempre usa una solución multipropósito o de peróxido certificada para lentes de contacto."}}]
        })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://contactgo.net"},
          {"@type": "ListItem", "position": 2, "name": "Soluciones para Lentes", "item": "https://www.contactgo.net/soluciones"}
        ]
      })}} />
      </main>
      <Footer />
    </>
  )
}
