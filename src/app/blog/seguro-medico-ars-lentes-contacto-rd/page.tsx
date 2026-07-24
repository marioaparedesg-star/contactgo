export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿El seguro médico (ARS) cubre lentes de contacto en RD? Guía 2026',
  description: 'Cómo funciona la cobertura óptica de las ARS en República Dominicana para lentes de contacto: SENASA, Humano, Universal, Mapfre BHD. Qué cubren y qué no.',
  alternates: { canonical: 'https://www.contactgo.net/blog/seguro-medico-ars-lentes-contacto-rd' },
  openGraph: {
    type: 'article', title: '¿El seguro médico (ARS) cubre lentes de contacto en RD? Guía 2026',
    description: 'Cómo funciona la cobertura óptica de las ARS en República Dominicana para lentes de contacto: SENASA, Humano, Universal, Mapfre BHD. Qué cubren y qué no.',
    url: 'https://www.contactgo.net/blog/seguro-medico-ars-lentes-contacto-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: '¿Mi seguro médico (ARS) cubre lentes de contacto en República Dominicana?' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿SENASA cubre lentes de contacto?", a: "El Plan Básico de Salud de SENASA incluye un subsidio óptico enfocado en anteojos, no en lentes de contacto. La cobertura de lentes de contacto solo aplica en casos médicamente justificados por un oftalmólogo." },
                { q: "¿Puedo pedir reembolso a mi ARS por lentes de contacto comprados en ContactGo?", a: "Depende de tu plan específico. Te recomendamos llamar a tu ARS y preguntar por el beneficio de óptica de tu póliza. Podemos proporcionarte factura con RNC para que hagas el trámite de reembolso." },
                { q: "¿Qué ARS tiene mejor cobertura óptica en RD?", a: "Varía según el plan contratado (básico vs complementario), no solo la aseguradora. Los planes complementarios de empresas privadas suelen tener mejor cobertura óptica que el Plan Básico de Salud estándar." },
                { q: "¿Necesito receta de un oftalmólogo o de un optometrista para el seguro?", a: "Para reclamaciones médicas justificadas (no cosméticas), la mayoría de ARS piden receta y diagnóstico de un oftalmólogo, no solo de un optometrista." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "¿Mi seguro médico (ARS) cubre lentes de contacto en República Dominicana?",
            "description": "Cómo funciona la cobertura óptica de las ARS en República Dominicana para lentes de contacto: SENASA, Humano, Universal, Mapfre BHD. Qué cubren y qué no.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/seguro-medico-ars-lentes-contacto-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿SENASA cubre lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "El Plan Básico de Salud de SENASA incluye un subsidio óptico enfocado en anteojos, no en lentes de contacto. La cobertura de lentes de contacto solo aplica en casos médicamente justificados por un oftalmólogo." } },
              { "@type": "Question", "name": "¿Puedo pedir reembolso a mi ARS por lentes de contacto comprados en ContactGo?", "acceptedAnswer": { "@type": "Answer", "text": "Depende de tu plan específico. Te recomendamos llamar a tu ARS y preguntar por el beneficio de óptica de tu póliza. Podemos proporcionarte factura con RNC para que hagas el trámite de reembolso." } },
              { "@type": "Question", "name": "¿Qué ARS tiene mejor cobertura óptica en RD?", "acceptedAnswer": { "@type": "Answer", "text": "Varía según el plan contratado (básico vs complementario), no solo la aseguradora. Los planes complementarios de empresas privadas suelen tener mejor cobertura óptica que el Plan Básico de Salud estándar." } },
              { "@type": "Question", "name": "¿Necesito receta de un oftalmólogo o de un optometrista para el seguro?", "acceptedAnswer": { "@type": "Answer", "text": "Para reclamaciones médicas justificadas (no cosméticas), la mayoría de ARS piden receta y diagnóstico de un oftalmólogo, no solo de un optometrista." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "¿Mi seguro médico (ARS) cubre lentes de contacto en República Dominicana?", "item": "https://www.contactgo.net/blog/seguro-medico-ars-lentes-contacto-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">¿Mi seguro médico (ARS) cubre lentes de contacto en República Dominicana?</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">🏥 Seguros y salud</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Mi seguro médico (ARS) cubre lentes de contacto en República Dominicana?</h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Actualizado julio 2026 · Entrega en toda RD</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['como-funciona','Cómo funciona la cobertura óptica en el sistema dominicano'],
['planes-complementarios','Los planes complementarios sí pueden ayudar'],
['como-comprar-sin-cobertura','Comprar sin depender del seguro']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Es una de las preguntas que más recibimos de residentes y expatriados en RD: si tienes una ARS (Administradora de Riesgos de Salud) como SENASA, Humano, Universal, Mapfre BHD o ARS Palic, ¿te cubre la compra de lentes de contacto? La respuesta corta es: depende del plan, y casi nunca cubre el 100%.</p>

          <section id="como-funciona">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Cómo funciona la cobertura óptica en el sistema dominicano</h2>
            <p>En República Dominicana, la Ley 87-01 de Seguridad Social establece un <strong>subsidio óptico</strong> dentro del Plan Básico de Salud (PBS), pero está pensado principalmente para <strong>anteojos (armazón + cristales)</strong>, no para lentes de contacto. El beneficio óptico típico es un monto fijo cada 2 años (varía por ARS, usualmente entre RD$1,500 y RD$3,500) que se puede aplicar en centros ópticos afiliados.</p>
             <p className="mt-2">Los <strong>lentes de contacto</strong> generalmente <strong>no están dentro de la cobertura básica del PBS</strong>. Algunas ARS los incluyen únicamente si son <strong>medicamente necesarios</strong> (por ejemplo, queratocono, anisometropía severa o post-cirugía), y en ese caso se requiere justificación de un oftalmólogo, no de un optometrista.</p>
          </section>

          <section id="planes-complementarios">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Los planes complementarios sí pueden ayudar</h2>
            <p>Si tienes un <strong>seguro complementario privado</strong> (a través de tu empleador, por ejemplo con Humano, Universal o Mapfre BHD en su modalidad de "seguro de salud" fuera del PBS), es más común que exista un beneficio óptico más amplio que sí incluya lentes de contacto o un reembolso parcial. Esto varía mucho de una póliza a otra — lo más seguro es llamar directamente a tu ARS y preguntar por el "beneficio de óptica" o "subsidio óptico" de tu plan específico.</p>
          </section>

          <section id="como-comprar-sin-cobertura">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Comprar sin depender del seguro</h2>
            <p>Como la gran mayoría de compradores de lentes de contacto en RD terminan pagando de su bolsillo (total o parcialmente), en ContactGo trabajamos para que el precio directo del fabricante sea lo más competitivo posible, sin intermediarios de óptica física. Puedes solicitar tu factura/recibo de compra para intentar un reembolso con tu ARS si tu plan lo permite — muchas ARS aceptan facturas de compras online siempre que incluyan RNC y detalle del producto.</p>
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
            <a href="/blog/cuanto-cuestan-lentes-contacto-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Cuánto cuestan los lentes de contacto en RD?</p><p className="text-xs text-gray-500 mt-0.5">Guía completa de precios 2026</p></a>
            <a href="/blog/como-leer-receta-optica-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo leer tu receta óptica</p><p className="text-xs text-gray-500 mt-0.5">Qué significa cada valor de tu prescripción</p></a>
            <a href="/blog/lentes-contacto-extranjeros-residentes-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto para extranjeros residentes en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía para expatriados</p></a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-1">Recibe en toda República Dominicana en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">Directo del fabricante · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18096942268?text=Hola%2C%20tengo%20una%20consulta%20sobre%20lentes%20de%20contacto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
