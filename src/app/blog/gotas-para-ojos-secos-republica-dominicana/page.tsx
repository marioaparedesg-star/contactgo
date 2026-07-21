export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Las mejores gotas para ojos secos en RD 2026 — Guía completa',
  description: 'Comparativa de las mejores gotas para ojos secos disponibles en República Dominicana. Refresh Optive, Refresh Tears, Manzanilla Sophia, Prolub. Precios y entrega 24-48h.',
  alternates: { canonical: 'https://www.contactgo.net/blog/gotas-para-ojos-secos-republica-dominicana' },
  openGraph: {
    type: 'article', title: 'Las mejores gotas para ojos secos en República Dominicana 2026',
    description: 'Comparativa de las mejores gotas para ojos secos disponibles en República Dominicana. Refresh Optive, Refresh Tears, Manzanilla Sophia, Prolub. Precios y entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/gotas-para-ojos-secos-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/gotas-para-ojos-secos-republica-dominicana.webp', width: 1200, height: 630, alt: 'Las mejores gotas para ojos secos en República Dominicana 2026' }],
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Las mejores gotas para ojos secos en República Dominicana 2026",
            "description": "Comparativa de las mejores gotas para ojos secos disponibles en República Dominicana. Refresh Optive, Refresh Tears, Manzanilla Sophia, Prolub. Precios y entrega 24-48h.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-28", "dateModified": "2026-06-28",
            "url": "https://www.contactgo.net/blog/gotas-para-ojos-secos-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":'¿Cuál es la mejor gota para ojos secos en República Dominicana?',"acceptedAnswer":{"@type":"Answer","text":'Para ojo seco moderado a severo, el Refresh Optive Advanced (RD$1,000) es la mejor opción: actúa en las tres capas de la película lagrimal. Para usuarios de lentes de contacto con sequedad moderada, el Refresh Optive Lubricant (RD$900) es muy efectivo. Todas disponibles en ContactGo con entrega en 24-48h.'}},{"@type":"Question","name":'¿Puedo usar gotas para ojos secos con lentes de contacto?',"acceptedAnswer":{"@type":"Answer","text":'Sí, pero debes verificar que la etiqueta indique "compatible con lentes de contacto". Refresh Optive, Refresh Tears y Prolub Hyfresh son compatibles. Manzanilla Sophia también puede usarse, aunque algunos especialistas prefieren gotas específicamente formuladas para lentes.'}},{"@type":"Question","name":'¿Con qué frecuencia puedo usar gotas lubricantes?',"acceptedAnswer":{"@type":"Answer","text":'Las gotas lubricantes sin conservantes pueden usarse tan frecuentemente como sea necesario, incluso varias veces por hora. Las que contienen conservantes se recomienda usarlas máximo 4-6 veces al día para evitar toxicidad corneal por el conservante.'}},{"@type":"Question","name":'¿Dónde comprar gotas para ojos secos con entrega en RD?',"acceptedAnswer":{"@type":"Answer","text":'En ContactGo tienes disponibles Refresh Optive Advanced, Refresh Optive Lubricant, Refresh Tears, Manzanilla Sophia y Prolub Hyfresh con entrega en 24-48 horas en toda República Dominicana. Pago seguro con AZUL/Banco Popular.'}}] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Las mejores gotas para ojos secos en República Dom", "item": "https://www.contactgo.net/blog/gotas-para-ojos-secos-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600 truncate">Las mejores gotas para ojos secos en Repúblic</span>
        </div>

        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">💧 Salud ocular</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Las mejores gotas para ojos secos en República Dominicana 2026</h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
          <p className="text-xs text-gray-500">Especialistas en salud visual · ⏱ 9 min · Actualizado junio 2026</p></div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            <li key="0"><a href="#tipos" className="text-primary-600 hover:underline">Todas las opciones disponibles</a></li>
            <li key="1"><a href="#cuando-usar" className="text-primary-600 hover:underline">Síntomas del ojo seco</a></li>
            <li key="2"><a href="#comparativa" className="text-primary-600 hover:underline">¿Cuál elegir según tus síntomas?</a></li>
            <li key="3"><a href="#productos" className="text-primary-600 hover:underline">Disponibles en ContactGo</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>El <strong>ojo seco</strong> es una de las condiciones oculares más frecuentes en República Dominicana — y el uso de lentes de contacto, el aire acondicionado y las horas frente a pantallas lo agravan. Si buscas las mejores gotas para tratar la sequedad ocular en RD con entrega a domicilio, esta guía tiene todo lo que necesitas.</p>
        <section id="tipos">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tipos de gotas disponibles en ContactGo</h2>
          <div className="space-y-4">
            {[
              { nombre: 'Refresh Optive Advanced', precio: 'RD$1,000', para: 'Ojo seco moderado a severo · Triple acción (acuosa, mucínica y lipídica)', slug: 'refresh-optive-advanced-gotas-ojos-secos-dominicana', rec: '⭐ Más recomendada' },
              { nombre: 'Refresh Optive Lubricant', precio: 'RD$900', para: 'Ojo seco moderado · Compatible con lentes de contacto', slug: 'refresh-optive-lubricant-gotas-oculares-dominicana', rec: 'Popular' },
              { nombre: 'Refresh Tears', precio: 'RD$800', para: 'Molestias ocasionales · Alivio rápido y económico', slug: 'refresh-tears-gotas-lubricantes-ojos-dominicana', rec: 'Básica' },
              { nombre: 'Prolub Hyfresh', precio: 'RD$900', para: 'Alta hidratación · Especial para usuarios de lentes', slug: 'prolub-hyfresh-solucion-multiproposito-dominicana', rec: 'Para lentes' },
              { nombre: 'Manzanilla Sophia', precio: 'RD$600', para: 'Alivio natural · Irritación leve · Sin conservantes', slug: 'manzanilla-sophia-gotas-ojos-naturales-dominicana', rec: 'Natural' },
            ].map((g, i) => (
              <a key={i} href={`/producto/${g.slug}`} className="flex items-start gap-3 p-4 border border-gray-100 rounded-2xl hover:border-teal-200 hover:bg-teal-50/20 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-teal-700">{g.nombre}</p>
                    <span className="text-[10px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-full font-bold">{g.rec}</span>
                  </div>
                  <p className="text-xs text-gray-500">{g.para}</p>
                </div>
                <p className="font-black text-gray-900 shrink-0">{g.precio}</p>
              </a>
            ))}
          </div>
        </section>
        <section id="cuando-usar">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cuándo necesitas gotas para ojos secos?</h2>
          <p>Estos son los síntomas más comunes que indican que necesitas lubricación ocular:</p>
          <ul className="space-y-2 mt-3 text-sm">
            {['Sensación de arena o cuerpo extraño en los ojos', 'Ardor o picazón ocular sin causa aparente', 'Enrojecimiento frecuente de los ojos', 'Visión borrosa que mejora al parpadear', 'Incomodidad al usar lentes de contacto', 'Ojos muy secos al despertar o al final del día', 'Lagrimeo excesivo (paradójicamente, el ojo seco puede provocar lagrimeo reflejo)'].map((s, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-teal-500">→</span>{s}</li>
            ))}
          </ul>
        </section>
        <section id="comparativa">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Comparativa — ¿Cuál es la mejor para ti?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50"><th className="p-3 text-left border border-gray-100 font-bold">Si tienes...</th><th className="p-3 text-left border border-gray-100 font-bold">Elige</th></tr></thead>
              <tbody>
                {[
                  ['Ojo seco severo + lentes de contacto', 'Refresh Optive Advanced (RD$1,000)'],
                  ['Ojo seco moderado + lentes', 'Refresh Optive Lubricant (RD$900)'],
                  ['Irritación ocasional sin lentes', 'Refresh Tears (RD$800)'],
                  ['Ojos secos al despertar', 'Refresh Optive Advanced antes de dormir'],
                  ['Preferencia natural/sin químicos', 'Manzanilla Sophia (RD$600)'],
                  ['Ojos muy secos con lentes todo el día', 'Prolub Hyfresh (RD$900)'],
                ].map(([cond, rec], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 border border-gray-100">{cond}</td>
                    <td className="p-3 border border-gray-100 font-semibold text-teal-700">{rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

          <section id="productos">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo — Entrega 24-48h</h2>
            <div className="space-y-2">
            <a href="/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Optive Advanced</p><p className="text-xs text-gray-500">Triple acción · Ojo seco severo</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$1,000</span></a>
            <a href="/producto/refresh-optive-lubricant-gotas-oculares-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Optive Lubricant</p><p className="text-xs text-gray-500">Doble acción · Ojo seco moderado</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$900</span></a>
            <a href="/producto/refresh-tears-gotas-lubricantes-ojos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Tears</p><p className="text-xs text-gray-500">Básica · Molestias ocasionales</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$800</span></a>
            <a href="/producto/manzanilla-sophia-gotas-ojos-naturales-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Manzanilla Sophia</p><p className="text-xs text-gray-500">Natural · Sin conservantes</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$600</span></a>
            </div>
            <a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
          </section>

          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuál es la mejor gota para ojos secos en República Dominicana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Para ojo seco moderado a severo, el Refresh Optive Advanced (RD$1,000) es la mejor opción: actúa en las tres capas de la película lagrimal. Para usuarios de lentes de contacto con sequedad moderada, el Refresh Optive Lubricant (RD$900) es muy efectivo. Todas disponibles en ContactGo con entrega en 24-48h.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Puedo usar gotas para ojos secos con lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí, pero debes verificar que la etiqueta indique "compatible con lentes de contacto". Refresh Optive, Refresh Tears y Prolub Hyfresh son compatibles. Manzanilla Sophia también puede usarse, aunque algunos especialistas prefieren gotas específicamente formuladas para lentes.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Con qué frecuencia puedo usar gotas lubricantes?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Las gotas lubricantes sin conservantes pueden usarse tan frecuentemente como sea necesario, incluso varias veces por hora. Las que contienen conservantes se recomienda usarlas máximo 4-6 veces al día para evitar toxicidad corneal por el conservante.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Dónde comprar gotas para ojos secos con entrega en RD?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">En ContactGo tienes disponibles Refresh Optive Advanced, Refresh Optive Lubricant, Refresh Tears, Manzanilla Sophia y Prolub Hyfresh con entrega en 24-48 horas en toda República Dominicana. Pago seguro con AZUL/Banco Popular.</p>
          </details>
            </div>
          </section>

          <div className="grid gap-2">
            <h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>
            <a href="/blog/refresh-optive-precio-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Refresh Optive precio en RD</p><p className="text-xs text-gray-500 mt-0.5">Guía completa de la gama Refresh</p></a>
            <a href="/blog/ojos-secos-lentes-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ojos secos y lentes de contacto</p><p className="text-xs text-gray-500 mt-0.5">Los mejores lentes para sequedad ocular</p></a>
            <a href="/blog/lentes-contacto-computadora-pantallas" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto para pantallas</p><p className="text-xs text-gray-500 mt-0.5">Cómo reducir la fatiga ocular digital</p></a>
            <a href="/soluciones" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ver todas las soluciones en ContactGo</p><p className="text-xs text-gray-500 mt-0.5">Catálogo completo de soluciones</p></a>
          </div>
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <p className="font-bold text-gray-900 text-sm mb-0.5">Información verificada</p>
          <p className="text-gray-600 text-sm">Equipo ContactGo · Actualizado junio 2026</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900">
          <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta profesional. Ante molestias oculares, consulta a tu especialista.
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">directo del fabricante · Directo del fabricante · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
