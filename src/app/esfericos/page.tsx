import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes Esféricos RD | Miopía e Hipermetropía — ContactGo',
  description: 'Compra lentes de contacto esféricos en República Dominicana. ACUVUE Moist, Air Optix, Biofinity para miopía e hipermetropía. Envío 24-48h a todo el país.',
  alternates: { canonical: 'https://www.contactgo.net/esfericos' },
  openGraph: { title: 'Lentes Esféricos RD | Miopía e Hipermetropía', description: 'Los mejores lentes esféricos originales con envío a domicilio en RD.', url: 'https://www.contactgo.net/esfericos', locale: 'es_DO', siteName: 'ContactGo', type: 'website' },
}

export const revalidate = 60

const faqs = [
  { q: '¿Qué son los lentes de contacto esféricos?', a: 'Son lentes diseñados para corregir miopía (dificultad para ver de lejos) e hipermetropía (dificultad para ver de cerca). Se identifican por tener solo el valor SPH en la receta, sin CYL ni AXIS.' },
  { q: '¿Cómo sé si necesito lentes esféricos?', a: 'Si tu receta óptica tiene solo un valor de Esfera (positivo o negativo) sin Cilindro, necesitas lentes esféricos. Si tienes Cilindro también, necesitas lentes tóricos.' },
  { q: '¿Cuánto duran los lentes esféricos?', a: 'Depende del tipo: los diarios se descartan cada día, los quincenales duran 2 semanas y los mensuales duran 30 días. Nunca uses un lente más tiempo del indicado.' },
  { q: '¿Cuál es la diferencia entre ACUVUE y Biofinity?', a: 'Ambas son marcas premium de silicona hidrogel. ACUVUE (J&J) es la marca más vendida del mundo, con tecnología UV Block. Biofinity (CooperVision) destaca por su hidratación natural sin aditivos.' },
]

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'esferico').order('nombre')

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <span className="text-gray-700 font-medium">Lentes Esféricos</span>
        </nav>

        <section className="bg-gradient-to-br from-blue-700 via-primary-600 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Para miopía e hipermetropía</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes de Contacto Esféricos en RD</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">ACUVUE, Air Optix, Biofinity y más. 100% originales, entrega en 24-48h en toda República Dominicana.</p>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900">{products?.length ?? 0} productos disponibles</h2>
            <Link href="/catalogo?tipo=esferico" className="text-sm text-primary-600 font-semibold hover:underline">Ver con filtros →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Todo sobre los lentes esféricos</h2>
          <p>Los lentes de contacto esféricos son el tipo más común en el mundo. Están diseñados para corregir dos de los problemas de visión más frecuentes: <strong>miopía</strong> (no ves bien de lejos) e <strong>hipermetropía</strong> (no ves bien de cerca). En República Dominicana, millones de personas los usan a diario.</p>
          <p>En ContactGo manejamos la selección más completa de lentes esféricos disponible en RD: desde los populares <strong>ACUVUE® 1-DAY MOIST®</strong> (diarios desechables) hasta los cómodos <strong>Biofinity®</strong> mensuales de CooperVision. todos son productos 100% originales, sellados de fábrica y con garantía de autenticidad.</p>
          <h3 className="font-bold text-gray-900 text-lg mt-6">¿Cómo elegir el lente esférico correcto?</h3>
          <p>Para elegir tu lente, necesitas saber el valor de <strong>Esfera</strong> de tu receta óptica. Este valor puede ser negativo (miopía) o positivo (hipermetropía). Si tu receta también tiene <strong>Cilindro</strong>, necesitas <Link href="/toricos" className="text-primary-600 font-semibold">lentes tóricos para astigmatismo</Link>.</p>
          <p>Los factores más importantes al elegir son: duración (diario, quincenal o mensual), material (silicona hidrogel para mayor transpirabilidad) y marca. Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta inteligente</Link> para encontrar el lente exacto para ti.</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
        })}} />

        {/* Schema ItemList para rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Lentes de contacto esfericos en República Dominicana",
          "description": "Lista de lentes de contacto esfericos disponibles en ContactGo RD",
          "url": "https://www.contactgo.net/esfericos",
          "itemListElement": []
        })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://contactgo.net"},
          {"@type": "ListItem", "position": 2, "name": "Lentes de Contacto Esféricos", "item": "https://www.contactgo.net/esfericos"}
        ]
      })}} />
      </main>
      <Footer />
    </>
  )
}
