export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ACUVUE Oasys vs Air Optix HydraGlyde 2026 — ¿Cuál elegir?',
  description: 'Comparativa ACUVUE Oasys vs Air Optix HydraGlyde en República Dominicana. Precio, oxígeno, hidratación y disponibilidad. La guía definitiva para elegir.',
  alternates: { canonical: 'https://www.contactgo.net/blog/acuvue-oasys-vs-air-optix-hydraglyde' },
  openGraph: {
    type: 'article',
    title: 'ACUVUE Oasys vs Air Optix HydraGlyde — ¿Cuál elegir?',
    description: 'Comparativa completa en RD 2026. Precio, oxígeno, hidratación y cuál comprar.',
    url: 'https://www.contactgo.net/blog/acuvue-oasys-vs-air-optix-hydraglyde',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/acuvue-oasys-vs-air-optix.webp', width: 1200, height: 630, alt: 'ACUVUE Oasys vs Air Optix HydraGlyde comparativa RD' }],
  },
}

export default function Page() {
  const COMPARATIVA = [
    ['Fabricante', 'Johnson & Johnson', 'Alcon'],
    ['Reemplazo', 'Quincenal (14 días)', 'Mensual (30 días)'],
    ['Material', 'Senofilcon A', 'Lotrafilcon B'],
    ['Dk/t (oxígeno)', '147', '138'],
    ['Contenido agua', '38%', '33%'],
    ['Tecnología hidrat.', 'HYDRACLEAR® Plus', 'HydraGlyde® + SmartShield®'],
    ['Precio en RD (6u)', 'RD$3,875', 'RD$4,375'],
    ['Precio por día', '~RD$92', '~RD$73 ⭐'],
    ['Disponible tórico', '✅ Oasys Astig', '❌ No disponible'],
    ['Disponible multi', '✅ Oasys Multi', '✅ Air Optix Multi'],
    ['Disponible color', '❌ No', '✅ Air Optix Colors'],
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "ACUVUE Oasys vs Air Optix HydraGlyde — ¿Cuál elegir? 2026",
            "description": "Comparativa completa entre ACUVUE Oasys y Air Optix HydraGlyde en República Dominicana.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-20", "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/acuvue-oasys-vs-air-optix-hydraglyde", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": "\u00bfACUVUE Oasys o Air Optix HydraGlyde \u2014 cu\u00e1l es mejor?", "acceptedAnswer": {"@type": "Answer", "text": "Depende del uso. Air Optix HydraGlyde tiene mayor Dk/t (138 vs 147 \u2014 diferencia m\u00ednima) y es mensual con menor costo por d\u00eda (~RD$73 vs ~RD$92). ACUVUE Oasys es quincenal, con tecnolog\u00eda HYDRACLEAR Plus ideal para pantallas. Para uso diario intensivo, Air Optix. Para renovaci\u00f3n m\u00e1s frecuente o uso con pantallas, ACUVUE Oasys."}}, {"@type": "Question", "name": "\u00bfCu\u00e1l es m\u00e1s barato: ACUVUE Oasys o Air Optix HydraGlyde?", "acceptedAnswer": {"@type": "Answer", "text": "Por precio de caja, ACUVUE Oasys es m\u00e1s barato (RD$3,875 vs RD$4,375). Pero por costo por d\u00eda de uso, Air Optix HydraGlyde gana: ~RD$73/d\u00eda mensual vs ~RD$92/d\u00eda quincenal."}}, {"@type": "Question", "name": "\u00bfQu\u00e9 tecnolog\u00eda de hidrataci\u00f3n es mejor, HYDRACLEAR Plus o HydraGlyde?", "acceptedAnswer": {"@type": "Answer", "text": "Son diferentes enfoques. HYDRACLEAR Plus de J&J incorpora un agente humectante interno en la matriz del lente. HydraGlyde de Alcon aplica una capa molecular en la superficie exterior que previene la deshidrataci\u00f3n y la adherencia de dep\u00f3sitos. Ambas son excelentes; el resultado depende de la qu\u00edmica individual de cada ojo."}}, {"@type": "Question", "name": "\u00bfPuedo cambiar de ACUVUE Oasys a Air Optix HydraGlyde?", "acceptedAnswer": {"@type": "Answer", "text": "S\u00ed, siempre que la graduaci\u00f3n (SPH) est\u00e9 disponible en Air Optix HydraGlyde. Los par\u00e1metros base son ligeramente diferentes (BC 8.6 en ambos, DIA 14.2 en ambos) as\u00ed que la compatibilidad suele ser buena. Te recomendamos consultar a tu optometrista antes del cambio."}}] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "ACUVUE Oasys vs Air Optix HydraGlyde", "item": "https://www.contactgo.net/blog/acuvue-oasys-vs-air-optix-hydraglyde" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">ACUVUE Oasys vs Air Optix</span>
        </div>

        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">⚖️ Comparativa 2026</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">ACUVUE® Oasys® vs Air Optix® HydraGlyde® — ¿Cuál elegir en RD?</h1>

        <div className="flex items-center gap-3 mb-5 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Comparativa técnica actualizada junio 2026 · ⏱ 8 min</p></div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            <li key="0"><a href="#comparativa" className="text-primary-600 hover:underline">Comparativa técnica completa</a></li>
            <li key="1"><a href="#precios" className="text-primary-600 hover:underline">Precios en RD 2026</a></li>
            <li key="2"><a href="#cuando" className="text-primary-600 hover:underline">¿Cuándo elegir cada uno?</a></li>
            <li key="3"><a href="#tecnologia" className="text-primary-600 hover:underline">Tecnologías de hidratación</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-bold text-indigo-800 mb-2">⚡ Veredicto rápido</p>
          <p className="text-sm text-indigo-700"><strong>Elige ACUVUE Oasys</strong> si usas pantallas intensivamente, prefieres cambiar cada 2 semanas, o tu optometrista lo recomienda específicamente.</p>
          <p className="text-sm text-indigo-700 mt-2"><strong>Elige Air Optix HydraGlyde</strong> si buscas el menor costo por día de uso (~RD$73 vs ~RD$92), usas los lentes todo el día o prefieres un lente mensual.</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>La pregunta más frecuente que recibimos en ContactGo: <strong>¿ACUVUE Oasys o Air Optix HydraGlyde?</strong> Ambos son lentes de silicona hidrogel premium, disponibles en RD con entrega en 24-48 horas. La diferencia real está en el período de reemplazo, el costo por día de uso y la tecnología de hidratación. Esta comparativa te da los datos para decidir.</p>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Comparativa técnica completa</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-red-700">ACUVUE Oasys</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-teal-700">Air Optix HydraGlyde</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARATIVA.map(([car, v1, v2], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{car}</td>
                      <td className="p-3 border border-gray-100 text-center text-red-700">{v1}</td>
                      <td className="p-3 border border-gray-100 text-center text-teal-700">{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Precios en República Dominicana — Junio 2026</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="border-2 border-red-100 rounded-2xl p-4 hover:border-red-300 hover:shadow-sm transition-all">
                <p className="text-xs font-bold text-red-600 mb-1">Johnson & Johnson</p>
                <p className="font-bold text-gray-900">ACUVUE® Oasys® 6u</p>
                <p className="text-xs text-gray-500 mt-0.5">Quincenal · 14 días</p>
                <p className="text-2xl font-black text-gray-900 mt-2">RD$3,875</p>
                <p className="text-xs text-gray-500">~RD$92/día de uso</p>
                <p className="text-xs text-red-600 font-semibold mt-2">Ver producto →</p>
              </Link>
              <Link href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="border-2 border-teal-100 rounded-2xl p-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <p className="text-xs font-bold text-teal-600 mb-1">Alcon</p>
                <p className="font-bold text-gray-900">Air Optix® HydraGlyde® 6u</p>
                <p className="text-xs text-gray-500 mt-0.5">Mensual · 30 días</p>
                <p className="text-2xl font-black text-gray-900 mt-2">RD$4,375</p>
                <p className="text-xs text-gray-500">~RD$73/día ⭐ Menor costo</p>
                <p className="text-xs text-teal-600 font-semibold mt-2">Ver producto →</p>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cuándo elegir cada uno?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-red-100 rounded-xl p-4 bg-red-50/30">
                <h3 className="font-bold text-gray-900 mb-2">Elige ACUVUE Oasys si...</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  {['Trabajas muchas horas con pantallas (Dk/t 147)','Tu optometrista lo recomendó específicamente','Prefieres cambiar el lente cada 2 semanas','Tienes astigmatismo (hay versión Oasys Astig)','Tienes presbicia (hay versión Oasys Multi)'].map((item,i) => <li key={i} className="flex items-start gap-1.5"><span className="text-red-500">✓</span>{item}</li>)}
                </ul>
              </div>
              <div className="border border-teal-100 rounded-xl p-4 bg-teal-50/30">
                <h3 className="font-bold text-gray-900 mb-2">Elige Air Optix HydraGlyde si...</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  {['Quieres el menor costo por día (~RD$73)','Prefieres lente mensual (menos cambios)','Tienes ojos secos moderados','Quieres lentes de color (hay Air Optix Colors)','Usas los lentes hasta 16 horas diarias'].map((item,i) => <li key={i} className="flex items-start gap-1.5"><span className="text-teal-500">✓</span>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿ACUVUE Oasys o Air Optix HydraGlyde — cuál es mejor?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Depende del uso. Air Optix HydraGlyde tiene mayor Dk/t (138 vs 147 — diferencia mínima) y es mensual con menor costo por día (~RD$73 vs ~RD$92). ACUVUE Oasys es quincenal, con tecnología HYDRACLEAR Plus ideal para pantallas. Para uso diario intensivo, Air Optix. Para renovación más frecuente o uso con pantallas, ACUVUE Oasys.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuál es más barato: ACUVUE Oasys o Air Optix HydraGlyde?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Por precio de caja, ACUVUE Oasys es más barato (RD$3,875 vs RD$4,375). Pero por costo por día de uso, Air Optix HydraGlyde gana: ~RD$73/día mensual vs ~RD$92/día quincenal.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué tecnología de hidratación es mejor, HYDRACLEAR Plus o HydraGlyde?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Son diferentes enfoques. HYDRACLEAR Plus de J&J incorpora un agente humectante interno en la matriz del lente. HydraGlyde de Alcon aplica una capa molecular en la superficie exterior que previene la deshidratación y la adherencia de depósitos. Ambas son excelentes; el resultado depende de la química individual de cada ojo.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Puedo cambiar de ACUVUE Oasys a Air Optix HydraGlyde?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí, siempre que la graduación (SPH) esté disponible en Air Optix HydraGlyde. Los parámetros base son ligeramente diferentes (BC 8.6 en ambos, DIA 14.2 en ambos) así que la compatibilidad suele ser buena. Te recomendamos consultar a tu optometrista antes del cambio.</p>
          </details>

            </div>
          </section>

          <div className="grid gap-2">
            <h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>
            <a href="/blog/acuvue-oasys-precio-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ACUVUE Oasys precio en RD</p><p className="text-xs text-gray-500 mt-0.5">Precios completos de toda la línea ACUVUE</p></a>
            <a href="/blog/air-optix-hydraglyde-precio-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Air Optix HydraGlyde precio en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía completa de la línea Air Optix</p></a>
            <a href="/blog/biofinity-vs-acuvue-comparacion" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Biofinity vs ACUVUE Oasys</p><p className="text-xs text-gray-500 mt-0.5">Otra comparativa popular</p></a>
            <a href="/blog/lentes-diarios-vs-mensuales" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes diarios vs mensuales</p><p className="text-xs text-gray-500 mt-0.5">Cuál tipo de reemplazo conviene</p></a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Ambos disponibles con entrega en 24-48h en RD</h3>
          <p className="text-sm text-gray-600 mb-4">100% originales · ACUVUE y Air Optix sellados de fábrica · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm">Comprar ACUVUE Oasys →</Link>
            <Link href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm">Comprar Air Optix HydraGlyde →</Link>
            <a href="https://wa.me/18295430580?text=Hola%2C%20no%20s%C3%A9%20si%20ACUVUE%20Oasys%20o%20Air%20Optix%2C%20%C2%BFme%20pueden%20asesorar%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Asesoría WhatsApp</a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda República Dominicana</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18295430580" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
