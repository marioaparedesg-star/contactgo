export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto para extranjeros residentes en RD — Guía 2026',
  description: 'Guía para expatriados y extranjeros que viven en República Dominicana: cómo comprar lentes de contacto con receta de tu país, suscripción y entrega recurrente.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-extranjeros-residentes-rd' },
  openGraph: {
    type: 'article', title: 'Lentes de contacto para extranjeros residentes en RD — Guía 2026',
    description: 'Guía para expatriados y extranjeros que viven en República Dominicana: cómo comprar lentes de contacto con receta de tu país, suscripción y entrega recurrente.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-extranjeros-residentes-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto para extranjeros que viven en República Dominicana' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Puedo comprar lentes de contacto en RD con receta de mi país de origen?", a: "Sí. La notación de graduación (SPH, CYL, AXIS, BC, DIA) es estándar internacional, así que tu receta de Estados Unidos, Canadá o Europa funciona igual en República Dominicana." },
                { q: "¿Necesito hacerme un examen de la vista de nuevo en RD?", a: "No es obligatorio si ya tienes tu receta vigente de tu país. Solo se recomienda un nuevo examen si tu receta tiene más de un año o has notado cambios en tu visión." },
                { q: "¿ContactGo entrega en zonas de expatriados como Sosúa, Cabarete o Las Terrenas?", a: "Sí, entregamos en toda República Dominicana, incluyendo las zonas norte con alta población extranjera, en 24-72 horas según la ubicación exacta." },
                { q: "¿Puedo pagar con tarjeta de crédito de mi banco extranjero?", a: "Sí, el sistema de pago acepta tarjetas VISA y Mastercard internacionales a través de AZUL/Banco Popular." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lentes de contacto para extranjeros que viven en República Dominicana",
            "description": "Guía para expatriados y extranjeros que viven en República Dominicana: cómo comprar lentes de contacto con receta de tu país, suscripción y entrega recurrente.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/lentes-contacto-extranjeros-residentes-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Puedo comprar lentes de contacto en RD con receta de mi país de origen?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. La notación de graduación (SPH, CYL, AXIS, BC, DIA) es estándar internacional, así que tu receta de Estados Unidos, Canadá o Europa funciona igual en República Dominicana." } },
              { "@type": "Question", "name": "¿Necesito hacerme un examen de la vista de nuevo en RD?", "acceptedAnswer": { "@type": "Answer", "text": "No es obligatorio si ya tienes tu receta vigente de tu país. Solo se recomienda un nuevo examen si tu receta tiene más de un año o has notado cambios en tu visión." } },
              { "@type": "Question", "name": "¿ContactGo entrega en zonas de expatriados como Sosúa, Cabarete o Las Terrenas?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, entregamos en toda República Dominicana, incluyendo las zonas norte con alta población extranjera, en 24-72 horas según la ubicación exacta." } },
              { "@type": "Question", "name": "¿Puedo pagar con tarjeta de crédito de mi banco extranjero?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, el sistema de pago acepta tarjetas VISA y Mastercard internacionales a través de AZUL/Banco Popular." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes de contacto para extranjeros que viven en República Dominicana", "item": "https://www.contactgo.net/blog/lentes-contacto-extranjeros-residentes-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lentes de contacto para extranjeros que viven en República Dominicana</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">🌍 Para expatriados</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto para extranjeros que viven en República Dominicana</h1>

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
            {[['receta-extranjera','¿Sirve mi receta de otro país en República Dominicana?'],
['evitar-quedarte-sin','Cómo evitar quedarte sin lentes viviendo en RD'],
['precio-vs-pais-origen','¿Los precios en RD son más caros que en mi país?'],
['pago-internacional','¿Puedo pagar con tarjeta internacional?']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Cada vez más extranjeros —estadounidenses, canadienses, europeos y latinoamericanos— viven de forma permanente o semi-permanente en República Dominicana, en Santo Domingo, Santiago, Punta Cana, Sosúa, Cabarete o Las Terrenas. Si eres uno de ellos y usas lentes de contacto, esta guía resuelve las dudas más comunes sobre cómo mantener tu suministro sin depender de traer cajas desde tu país de origen.</p>

          <section id="receta-extranjera">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Sirve mi receta de otro país en República Dominicana?</h2>
            <p>Sí. Las graduaciones de lentes de contacto usan una notación internacional estándar (SPH, CYL, AXIS, BC, DIA) que es la misma en Estados Unidos, Canadá, Europa y República Dominicana. Si tienes tu receta de tu país de origen (aunque esté en inglés, francés o cualquier otro idioma), los valores numéricos son universales y los podemos usar directamente para armar tu pedido — no necesitas repetir el examen con un oftalmólogo dominicano.</p>
             <p className="mt-2">Si no tienes tu receta a mano o no estás seguro de los valores, nuestra <Link href="/receta" className="text-primary-600 font-semibold hover:underline">calculadora de receta</Link> te ayuda a identificar exactamente qué necesitas.</p>
          </section>

          <section id="evitar-quedarte-sin">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Cómo evitar quedarte sin lentes viviendo en RD</h2>
            <p>El problema más común de los residentes extranjeros es depender de familiares o viajes ocasionales a su país para reabastecerse — lo cual genera meses sin lentes o usar los mismos más tiempo del recomendado. En ContactGo puedes comprar directamente online con entrega en 24-48h en cualquier parte del país, sin necesidad de vuelos ni de una óptica física cerca de tu zona.</p>
          </section>

          <section id="precio-vs-pais-origen">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Los precios en RD son más caros que en mi país?</h2>
            <p>Depende de la marca y el país. En general, marcas como ACUVUE, Biofinity y Air Optix tienen precios similares o incluso más bajos en RD que en Estados Unidos o Europa cuando se compran directo del fabricante (sin intermediario de óptica física con márgenes altos). Puedes comparar el precio exacto de tu marca en nuestro <Link href="/catalogo" className="text-primary-600 font-semibold hover:underline">catálogo</Link> antes de decidir si te conviene traerlos de tu país o comprarlos localmente.</p>
          </section>

          <section id="pago-internacional">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Puedo pagar con tarjeta internacional?</h2>
            <p>Sí. El sistema de pago de ContactGo (AZUL/Banco Popular) acepta tarjetas VISA y Mastercard internacionales, no solo tarjetas emitidas en RD. Esto es especialmente útil si aún no tienes cuenta bancaria dominicana o estás en proceso de residencia.</p>
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
            <a href="/blog/como-leer-receta-optica-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo leer tu receta óptica</p><p className="text-xs text-gray-500 mt-0.5">Qué significa cada valor de tu prescripción</p></a>
            <a href="/blog/comprar-lentes-contacto-online-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Comprar lentes de contacto online en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía segura de compra</p></a>
            <a href="/blog/seguro-medico-ars-lentes-contacto-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿El seguro médico ARS cubre lentes de contacto?</p><p className="text-xs text-gray-500 mt-0.5">Guía de cobertura óptica en RD</p></a>
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
