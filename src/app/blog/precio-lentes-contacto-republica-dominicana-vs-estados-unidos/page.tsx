export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precio de lentes de contacto en RD vs Estados Unidos — Comparativa 2026',
  description: '¿Es más barato comprar lentes de contacto en República Dominicana o en Estados Unidos? Comparativa de precios por marca para turistas y residentes.',
  alternates: { canonical: 'https://www.contactgo.net/blog/precio-lentes-contacto-republica-dominicana-vs-estados-unidos' },
  openGraph: {
    type: 'article', title: 'Precio de lentes de contacto en RD vs Estados Unidos — Comparativa 2026',
    description: '¿Es más barato comprar lentes de contacto en República Dominicana o en Estados Unidos? Comparativa de precios por marca para turistas y residentes.',
    url: 'https://www.contactgo.net/blog/precio-lentes-contacto-republica-dominicana-vs-estados-unidos',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: '¿Comprar lentes de contacto en República Dominicana es más barato que en Estados Unidos?' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Los lentes de contacto son más baratos en RD que en Estados Unidos?", a: "Depende de la marca y de si tienes seguro de visión en EE.UU. Sin seguro, los precios directo del fabricante en RD suelen ser competitivos o más bajos que el precio de lista en EE.UU." },
                { q: "¿Puedo usar mi receta de Estados Unidos para comprar en ContactGo?", a: "Sí, la notación de graduación es estándar internacional (SPH, CYL, AXIS, BC, DIA) y funciona igual en cualquier país." },
                { q: "¿Vale la pena traer varias cajas de lentes desde mi país si voy a RD?", a: "Si tu seguro de visión cubre gran parte del costo en tu país, sí puede convenir. Si no tienes seguro, comparar precios directos puede mostrarte que es igual o más barato comprar en RD." },
                { q: "¿ContactGo tiene los mismos precios para turistas y residentes?", a: "Sí, el precio del catálogo es el mismo para todos los compradores, sin diferenciar por nacionalidad o residencia." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "¿Comprar lentes de contacto en República Dominicana es más barato que en Estados Unidos?",
            "description": "¿Es más barato comprar lentes de contacto en República Dominicana o en Estados Unidos? Comparativa de precios por marca para turistas y residentes.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/precio-lentes-contacto-republica-dominicana-vs-estados-unidos", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Los lentes de contacto son más baratos en RD que en Estados Unidos?", "acceptedAnswer": { "@type": "Answer", "text": "Depende de la marca y de si tienes seguro de visión en EE.UU. Sin seguro, los precios directo del fabricante en RD suelen ser competitivos o más bajos que el precio de lista en EE.UU." } },
              { "@type": "Question", "name": "¿Puedo usar mi receta de Estados Unidos para comprar en ContactGo?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, la notación de graduación es estándar internacional (SPH, CYL, AXIS, BC, DIA) y funciona igual en cualquier país." } },
              { "@type": "Question", "name": "¿Vale la pena traer varias cajas de lentes desde mi país si voy a RD?", "acceptedAnswer": { "@type": "Answer", "text": "Si tu seguro de visión cubre gran parte del costo en tu país, sí puede convenir. Si no tienes seguro, comparar precios directos puede mostrarte que es igual o más barato comprar en RD." } },
              { "@type": "Question", "name": "¿ContactGo tiene los mismos precios para turistas y residentes?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, el precio del catálogo es el mismo para todos los compradores, sin diferenciar por nacionalidad o residencia." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "¿Comprar lentes de contacto en República Dominicana es más barato que en Estados Unidos?", "item": "https://www.contactgo.net/blog/precio-lentes-contacto-republica-dominicana-vs-estados-unidos" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">¿Comprar lentes de contacto en República Dominicana es más barato que en Estados Unidos?</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">⚖️ Comparativa de precios</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Comprar lentes de contacto en República Dominicana es más barato que en Estados Unidos?</h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Actualizado julio 2026 · Entrega en toda RD</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['factores','Qué factores cambian el precio de un país a otro'],
['cuando-conviene-rd','¿Cuándo conviene comprar en RD?'],
['cuando-conviene-traerlos','¿Cuándo conviene traerlos de tu país?']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Si eres turista, expatriado o estás decidiendo dónde reabastecerte, esta es una pregunta muy común: ¿conviene comprar lentes de contacto en RD o traerlos de Estados Unidos u otro país? La respuesta depende de la marca, de si compras directo del fabricante o en una óptica con intermediarios, y de si cuentas con seguro médico que cubra parte del costo en tu país de origen.</p>

          <section id="factores">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Qué factores cambian el precio de un país a otro</h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
               <li><strong>Seguro médico:</strong> en EE.UU., si tienes cobertura de visión (vision insurance), el costo real después del seguro puede ser mucho menor que el precio de lista — algo que no aplica igual en RD.</li>
               <li><strong>Intermediarios:</strong> las ópticas físicas suelen tener márgenes más altos que las tiendas online que compran directo del fabricante, en cualquier país.</li>
               <li><strong>Impuestos y aranceles:</strong> los productos importados en RD pueden llevar impuestos que no siempre aplican igual en el país de fabricación.</li>
               <li><strong>Tipo de cambio:</strong> el precio final en dólares varía según la tasa RD$/USD del momento.</li>
             </ul>
          </section>

          <section id="cuando-conviene-rd">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cuándo conviene comprar en RD?</h2>
            <p>Si no tienes seguro de visión en tu país (muchos planes de salud en EE.UU. no incluyen "vision insurance" por defecto, es un add-on aparte), comprar directo del fabricante en RD a través de una tienda especializada suele ser competitivo frente al precio de lista sin seguro en EE.UU. Además, evitas cargar cajas extra en la maleta y el riesgo de que se dañen o se queden en casa.</p>
          </section>

          <section id="cuando-conviene-traerlos">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cuándo conviene traerlos de tu país?</h2>
            <p>Si tu seguro de visión en EE.UU., Canadá o Europa cubre una parte importante del costo (algunos planes cubren cajas completas por un copago mínimo), probablemente te convenga surtirte antes de viajar. En ese caso, usa nuestra <a href="/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana" className="text-primary-600 hover:underline font-medium">checklist de viaje</a> para calcular exactamente cuánto necesitas.</p>
          </section>

          <section id="faq">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {FAQS.map((item, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">{item.q}<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="grid gap-2">
            <h3 className="font-bold text-gray-900">También puede interesarte</h3>
            <a href="/blog/cuanto-cuestan-lentes-contacto-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Cuánto cuestan los lentes de contacto en RD?</p><p className="text-xs text-gray-500 mt-0.5">Guía completa de precios 2026</p></a>
            <a href="/blog/lentes-contacto-extranjeros-residentes-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto para extranjeros residentes en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía para expatriados</p></a>
            <a href="/blog/comprar-lentes-contacto-online-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Comprar lentes de contacto online en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía segura de compra</p></a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-teal-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-1">Recibe en toda República Dominicana en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">Directo del fabricante · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-teal-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18096942268?text=Hola%2C%20tengo%20una%20consulta%20sobre%20lentes%20de%20contacto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
