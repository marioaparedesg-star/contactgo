export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto en clima tropical y playa en RD — Guía 2026',
  description: 'Cómo cuidar tus lentes de contacto con el calor, la humedad, el sudor y el agua de mar de República Dominicana. Consejos y mejores marcas para clima tropical.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-clima-tropical-playa-rd' },
  openGraph: {
    type: 'article', title: 'Lentes de contacto en clima tropical y playa en RD — Guía 2026',
    description: 'Cómo cuidar tus lentes de contacto con el calor, la humedad, el sudor y el agua de mar de República Dominicana. Consejos y mejores marcas para clima tropical.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-clima-tropical-playa-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto en el clima tropical de República Dominicana — Guía completa' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Puedo usar lentes de contacto en la playa en República Dominicana?", a: "Puedes usarlos en la arena y bajo el sol sin problema, pero se recomienda quitarlos antes de entrar al mar para evitar infecciones oculares por microorganismos presentes en el agua." },
                { q: "¿El calor de RD afecta mis lentes de contacto?", a: "El calor y la humedad aceleran la evaporación de la lágrima, lo que puede hacer que sientas más sequedad. Usar gotas lubricantes compatibles con lentes ayuda a compensarlo." },
                { q: "¿Qué lentes de contacto son mejores para clima tropical?", a: "Los de silicona hidrogel con alta transmisión de oxígeno (como Air Optix HydraGlyde o ACUVUE Oasys) suelen ser más cómodos en climas cálidos y húmedos que los materiales hidrogel tradicionales." },
                { q: "¿Puedo dejar mis lentes de contacto al sol o en el carro caliente?", a: "No. El calor excesivo puede alterar la solución y el material del lente. Guarda siempre tu estuche en un lugar fresco, nunca expuesto al sol directo." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lentes de contacto en el clima tropical de República Dominicana — Guía completa",
            "description": "Cómo cuidar tus lentes de contacto con el calor, la humedad, el sudor y el agua de mar de República Dominicana. Consejos y mejores marcas para clima tropical.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/lentes-contacto-clima-tropical-playa-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Puedo usar lentes de contacto en la playa en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "Puedes usarlos en la arena y bajo el sol sin problema, pero se recomienda quitarlos antes de entrar al mar para evitar infecciones oculares por microorganismos presentes en el agua." } },
              { "@type": "Question", "name": "¿El calor de RD afecta mis lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "El calor y la humedad aceleran la evaporación de la lágrima, lo que puede hacer que sientas más sequedad. Usar gotas lubricantes compatibles con lentes ayuda a compensarlo." } },
              { "@type": "Question", "name": "¿Qué lentes de contacto son mejores para clima tropical?", "acceptedAnswer": { "@type": "Answer", "text": "Los de silicona hidrogel con alta transmisión de oxígeno (como Air Optix HydraGlyde o ACUVUE Oasys) suelen ser más cómodos en climas cálidos y húmedos que los materiales hidrogel tradicionales." } },
              { "@type": "Question", "name": "¿Puedo dejar mis lentes de contacto al sol o en el carro caliente?", "acceptedAnswer": { "@type": "Answer", "text": "No. El calor excesivo puede alterar la solución y el material del lente. Guarda siempre tu estuche en un lugar fresco, nunca expuesto al sol directo." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes de contacto en el clima tropical de República Dominicana — Guía completa", "item": "https://www.contactgo.net/blog/lentes-contacto-clima-tropical-playa-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lentes de contacto en el clima tropical de República Dominicana — Guía completa</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">🏖️ Guía de cuidado</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto en el clima tropical de República Dominicana — Guía completa</h1>

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
            {[['humedad-y-sudor','Calor, humedad y sudor: el reto diario'],
['agua-de-mar-piscina','Nunca entres al mar o la piscina con los lentes puestos'],
['mejores-lentes-clima-tropical','Las mejores opciones de lentes para clima tropical']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>El calor, la humedad constante, el sudor y la exposición al agua de mar hacen que usar lentes de contacto en República Dominicana tenga particularidades distintas a un clima templado o seco. Aquí te explicamos cómo cuidarlos correctamente y qué marcas se comportan mejor en un clima tropical.</p>

          <section id="humedad-y-sudor">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Calor, humedad y sudor: el reto diario</h2>
            <p>La combinación de temperaturas altas y humedad relativa elevada (típica de Santo Domingo, Punta Cana o el Cibao) hace que los ojos tiendan a producir más lágrima y, paradójicamente, también a resecarse más rápido por la evaporación acelerada. El sudor en la frente puede escurrir hacia los ojos y arrastrar bacterias hacia el lente — lávate siempre las manos y evita tocarte los ojos después de hacer ejercicio al aire libre.</p>
          </section>

          <section id="agua-de-mar-piscina">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Nunca entres al mar o la piscina con los lentes puestos</h2>
            <p>Esto aplica en cualquier país, pero cobra especial relevancia en un destino de playa como RD: el agua de mar, de piscina y de río contiene microorganismos (como la ameba <em>Acanthamoeba</em>) que pueden adherirse al lente de contacto y causar infecciones oculares graves. Si vas a nadar, lo más seguro es usar lentes de contacto diarios desechables y quitártelos antes de entrar al agua, o usar gafas de natación graduadas.</p>
          </section>

          <section id="mejores-lentes-clima-tropical">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las mejores opciones de lentes para clima tropical</h2>
            <p>Para quienes viven o pasan largas temporadas en RD, los lentes de silicona hidrogel con alta transmisión de oxígeno y buena retención de humedad tienden a funcionar mejor:</p>
             <ul className="list-disc list-inside space-y-1 mt-2">
               <li><Link href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="text-primary-600 hover:underline font-medium">Air Optix HydraGlyde</Link> — su tecnología de hidratación superficial ayuda a mantener la comodidad incluso en ambientes calurosos.</li>
               <li><Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="text-primary-600 hover:underline font-medium">ACUVUE Oasys</Link> — alta transmisión de oxígeno, ideal para días largos al aire libre.</li>
               <li><Link href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="text-primary-600 hover:underline font-medium">1-DAY ACUVUE MOIST</Link> — al ser desechables diarios, son la opción más segura si vas a estar cerca de playa o piscina, porque cada día empiezas con un lente completamente nuevo.</li>
             </ul>
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
            <a href="/blog/se-puede-nadar-con-lentes-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Se puede nadar con lentes de contacto?</p><p className="text-xs text-gray-500 mt-0.5">Riesgos y recomendaciones</p></a>
            <a href="/blog/lentes-contacto-ojos-secos-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Los mejores lentes para ojos secos en RD</p><p className="text-xs text-gray-500 mt-0.5">Ranking y precios</p></a>
            <a href="/blog/gotas-para-ojos-secos-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Las mejores gotas para ojos secos</p><p className="text-xs text-gray-500 mt-0.5">Comparativa completa</p></a>
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
