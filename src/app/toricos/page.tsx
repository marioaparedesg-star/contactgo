import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes para Astigmatismo RD | Lentes Tóricos — ContactGo',
  description: 'Lentes tóricos para astigmatismo en República Dominicana. ACUVUE Oasys for Astigmatism, Biofinity Toric, Air Optix for Astigmatism. Fabricados a medida.',
  alternates: { canonical: 'https://www.contactgo.net/toricos' },
  openGraph: {
    title: 'Lentes Tóricos para Astigmatismo RD',
    description: 'Lentes de contacto tóricos para astigmatismo en RD. ACUVUE Oasys for Astigmatism, Biofinity Toric, Air Optix for Astigmatism. Envío a domicilio.',
    url: 'https://www.contactgo.net/toricos',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}
export const revalidate = 60

const faqs = [
  { q: '¿Qué son los lentes tóricos?', a: 'Los lentes tóricos están diseñados específicamente para corregir el astigmatismo. A diferencia de los lentes esféricos, tienen una curvatura diferente en cada eje para compensar la forma irregular de la córnea.' },
  { q: '¿Cómo sé si necesito lentes tóricos?', a: 'Si tu receta tiene valores de CYL (cilindro) y AXIS (eje), tienes astigmatismo y necesitas lentes tóricos. El valor de AXIS indica la orientación del astigmatismo (0°–180°).' },
  { q: '¿Por qué tardan más en llegar los lentes tóricos?', a: 'Los lentes tóricos se fabrican a medida según tu graduación exacta (Esfera, Cilindro y Eje). Por eso el tiempo de entrega es de 20-30 días, en lugar de las 24-48 horas de los esféricos.' },
  { q: '¿Son más caros los lentes tóricos?', a: 'Sí, generalmente cuestan un poco más que los esféricos del mismo material porque requieren fabricación especializada. Sin embargo, son indispensables para corregir el astigmatismo correctamente.' },
]

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('*').eq('activo', true).eq('tipo', 'torico').order('nombre')

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <span className="text-gray-700 font-medium">Lentes Tóricos</span>
        </nav>
        <section className="bg-gradient-to-br from-purple-700 via-primary-600 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Para astigmatismo</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes Tóricos para Astigmatismo en RD</h1>
          <p className="text-purple-100 text-lg max-w-xl mx-auto">Fabricados a medida según tu SPH, CYL y AXIS. Entrega en 20-30 días en República Dominicana.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-100 text-xs px-4 py-2 rounded-full">
            ⏱ Tiempo de entrega: 20-30 días (fabricación a medida)
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900">{products?.length ?? 0} productos disponibles</h2>
            <Link href="/catalogo?tipo=torico" className="text-sm text-primary-600 font-semibold hover:underline">Ver con filtros →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Lentes tóricos en República Dominicana</h2>
          <p>El astigmatismo es uno de los problemas de visión más comunes en RD y el mundo. Se produce cuando la córnea tiene una forma ligeramente ovalada en lugar de perfectamente esférica, causando visión borrosa a cualquier distancia. Los <strong>lentes tóricos</strong> son la solución específica para corregirlo.</p>
          <p>En ContactGo tenemos los mejores lentes tóricos disponibles: <strong>ACUVUE® Oasys for Astigmatism</strong> (los más vendidos del mundo para astigmatismo), <strong>Biofinity® Toric</strong> y <strong>AIR OPTIX® for Astigmatism</strong>. Todos son de silicona hidrogel premium con tecnología estabilizadora que mantiene el lente orientado correctamente.</p>
          <h3 className="font-bold text-gray-900 text-lg mt-6">¿Qué necesito para pedir lentes tóricos?</h3>
          <p>Necesitas tu receta óptica completa con los valores <strong>Esfera</strong>, <strong>Cilindro</strong> y <strong>Eje</strong> para cada ojo. Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta</Link> para verificar que estás eligiendo el lente correcto.</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes sobre lentes tóricos</h2>
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
          "name": "Lentes de contacto toricos en República Dominicana",
          "description": "Lista de lentes de contacto toricos disponibles en ContactGo RD",
          "url": "https://www.contactgo.net/toricos",
          "itemListElement": []
        })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://contactgo.net"},
          {"@type": "ListItem", "position": 2, "name": "Lentes Tóricos para Astigmatismo", "item": "https://www.contactgo.net/toricos"}
        ]
      })}} />
      </main>
      <Footer />
    </>
  )
}
