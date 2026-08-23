export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Puedo llevar lentes de contacto en el avión? Guía aeropuertos RD 2026',
  description: 'Reglas para viajar con lentes de contacto y solución líquida en equipaje de mano hacia o desde República Dominicana. AILA, POP, STI, SDQ. Límites de líquidos.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-equipaje-mano-aeropuerto-rd' },
  openGraph: {
    type: 'article', title: '¿Puedo llevar lentes de contacto en el avión? Guía aeropuertos RD 2026',
    description: 'Reglas para viajar con lentes de contacto y solución líquida en equipaje de mano hacia o desde República Dominicana. AILA, POP, STI, SDQ. Límites de líquidos.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-equipaje-mano-aeropuerto-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: '¿Puedo llevar lentes de contacto en el avión? Guía para los aeropuertos de RD' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Puedo llevar solución para lentes de contacto en el avión hacia RD?", a: "Sí, siempre que el envase sea de 100ml o menos y vaya dentro de la bolsa transparente de líquidos junto con tus demás artículos de higiene." },
                { q: "¿Las cajas de lentes de contacto cuentan como líquido en el aeropuerto?", a: "No. Las cajas de lentes desechables (diarios, quincenales o mensuales) no se consideran líquido y puedes llevarlas sin restricción en tu equipaje de mano." },
                { q: "¿Qué aeropuertos de República Dominicana tienen esta regla?", a: "Todos: Las Américas (SDQ) en Santo Domingo, Punta Cana (AILA), Puerto Plata (POP), Santiago (STI), La Romana (LRM) y Samaná (AZS) siguen los mismos estándares de seguridad de la IATA." },
                { q: "Se me olvidaron los lentes de contacto, ¿puedo comprar en RD?", a: "Sí. ContactGo entrega lentes de las principales marcas (ACUVUE, Biofinity, Air Optix) directo a tu hotel en Punta Cana, Santo Domingo y toda República Dominicana en 24-48 horas." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "¿Puedo llevar lentes de contacto en el avión? Guía para los aeropuertos de RD",
            "description": "Reglas para viajar con lentes de contacto y solución líquida en equipaje de mano hacia o desde República Dominicana. AILA, POP, STI, SDQ. Límites de líquidos.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/lentes-contacto-equipaje-mano-aeropuerto-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Puedo llevar solución para lentes de contacto en el avión hacia RD?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, siempre que el envase sea de 100ml o menos y vaya dentro de la bolsa transparente de líquidos junto con tus demás artículos de higiene." } },
              { "@type": "Question", "name": "¿Las cajas de lentes de contacto cuentan como líquido en el aeropuerto?", "acceptedAnswer": { "@type": "Answer", "text": "No. Las cajas de lentes desechables (diarios, quincenales o mensuales) no se consideran líquido y puedes llevarlas sin restricción en tu equipaje de mano." } },
              { "@type": "Question", "name": "¿Qué aeropuertos de República Dominicana tienen esta regla?", "acceptedAnswer": { "@type": "Answer", "text": "Todos: Las Américas (SDQ) en Santo Domingo, Punta Cana (AILA), Puerto Plata (POP), Santiago (STI), La Romana (LRM) y Samaná (AZS) siguen los mismos estándares de seguridad de la IATA." } },
              { "@type": "Question", "name": "Se me olvidaron los lentes de contacto, ¿puedo comprar en RD?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. ContactGo entrega lentes de las principales marcas (ACUVUE, Biofinity, Air Optix) directo a tu hotel en Punta Cana, Santo Domingo y toda República Dominicana en 24-48 horas." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "¿Puedo llevar lentes de contacto en el avión? Guía para los aeropuertos de RD", "item": "https://www.contactgo.net/blog/lentes-contacto-equipaje-mano-aeropuerto-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">¿Puedo llevar lentes de contacto en el avión? Guía para los aeropuertos de RD</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">✈️ Guía de viaje</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Puedo llevar lentes de contacto en el avión? Guía para los aeropuertos de RD</h1>

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
            {[['liquidos','La regla de líquidos 3-1-1 aplica a la solución de lentes'],
['estuche','Lleva siempre un estuche y un par de gafas de respaldo'],
['comprar-al-llegar','¿Y si se te olvidan o se te dañan al llegar a RD?']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Si vuelas hacia o desde República Dominicana (Punta Cana AILA, Las Américas SDQ, Puerto Plata POP o Santiago STI) y usas lentes de contacto, hay reglas simples de seguridad aérea que debes conocer antes de hacer tu maleta. Aquí te explicamos exactamente qué puedes llevar en el equipaje de mano y qué conviene documentar.</p>

          <section id="liquidos">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">La regla de líquidos 3-1-1 aplica a la solución de lentes</h2>
            <p>En cualquier aeropuerto de República Dominicana (y en la mayoría de aeropuertos internacionales) los líquidos en equipaje de mano se rigen por la regla <strong>3-1-1</strong>: envases de máximo <strong>100ml (3.4oz)</strong> cada uno, todos dentro de <strong>una</strong> bolsa transparente de un litro. Esto aplica directamente a tu solución multipropósito (como Opti-Free Puremoist o Biotrue).</p>
             <ul className="list-disc list-inside space-y-1 mt-2">
               <li>Los envases de 90ml y 120ml de solución <strong>sí pasan</strong> el control de seguridad en equipaje de mano.</li>
               <li>Los envases de 300ml o más <strong>deben ir en el equipaje documentado</strong> (maleta de bodega), donde no hay límite de líquidos.</li>
               <li>Las cajas de lentes de contacto (diarios, mensuales) <strong>no cuentan como líquido</strong> y puedes llevar tantas cajas como necesites en el equipaje de mano.</li>
             </ul>
          </section>

          <section id="estuche">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Lleva siempre un estuche y un par de gafas de respaldo</h2>
            <p>Aunque no es una regla de aeropuerto, es la recomendación más práctica de cualquier optometrista: lleva un estuche de repuesto y, si usas graduación, tus gafas en el equipaje de mano. El aire seco de la cabina presurizada reseca los ojos más rápido de lo normal, y muchos viajeros prefieren quitarse los lentes durante vuelos largos.</p>
          </section>

          <section id="comprar-al-llegar">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Y si se te olvidan o se te dañan al llegar a RD?</h2>
            <p>Si llegas a República Dominicana y descubres que olvidaste tus lentes, se te dañó el estuche o se te acabó la solución, no necesitas salir a buscar una óptica física. ContactGo entrega directo a tu hotel o Airbnb en Punta Cana, Bávaro, Cap Cana, Santo Domingo y el resto del país en 24-48 horas, con pago seguro por tarjeta internacional a través de AZUL.</p>
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
            <a href="/blog/contact-lenses-dominican-republic" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Contact Lenses in Dominican Republic</p><p className="text-xs text-gray-500 mt-0.5">Guía completa para turistas</p></a>
            <a href="/blog/forgot-contact-lenses-punta-cana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Forgot Your Contact Lenses in Punta Cana?</p><p className="text-xs text-gray-500 mt-0.5">Entrega de emergencia al hotel</p></a>
            <a href="/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lista para empacar lentes de contacto de viaje</p><p className="text-xs text-gray-500 mt-0.5">Checklist completo antes de volar</p></a>
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
