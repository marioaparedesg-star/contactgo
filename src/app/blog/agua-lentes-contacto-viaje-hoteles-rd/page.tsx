export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Puedo usar agua del grifo o piscina con mis lentes en RD? Guía 2026',
  description: 'Por qué nunca debes usar agua del grifo, piscina o botella con tus lentes de contacto en hoteles de República Dominicana. Riesgos y qué usar en su lugar.',
  alternates: { canonical: 'https://www.contactgo.net/blog/agua-lentes-contacto-viaje-hoteles-rd' },
  openGraph: {
    type: 'article', title: '¿Puedo usar agua del grifo o piscina con mis lentes en RD? Guía 2026',
    description: 'Por qué nunca debes usar agua del grifo, piscina o botella con tus lentes de contacto en hoteles de República Dominicana. Riesgos y qué usar en su lugar.',
    url: 'https://www.contactgo.net/blog/agua-lentes-contacto-viaje-hoteles-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: '¿Puedo usar agua del hotel o piscina con mis lentes de contacto en RD?' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Puedo lavar mis lentes de contacto con agua del grifo en RD?", a: "No. El agua del grifo, incluso en hoteles de buena categoría, no es estéril y puede contener microorganismos que causan infecciones oculares graves. Usa siempre solución multipropósito." },
                { q: "¿Puedo guardar mis lentes en agua embotellada si se me acabó la solución?", a: "No se recomienda. El agua embotellada tampoco desinfecta ni mantiene las propiedades del lente. Es mejor comprar solución nueva o cambiar temporalmente a lentes diarios desechables." },
                { q: "¿Es seguro nadar en la piscina del hotel con lentes puestos?", a: "No se recomienda. El cloro y los microorganismos del agua de piscina pueden dañar el lente e irritar el ojo. Si vas a nadar, usa lentes diarios y descártalos después, o quítatelos antes de entrar." },
                { q: "¿Dónde puedo comprar solución para lentes de contacto en zonas turísticas de RD?", a: "En farmacias y supermercados grandes de zonas turísticas, o pidiéndola online en ContactGo con entrega directa a tu hotel en 24-48 horas." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "¿Puedo usar agua del hotel o piscina con mis lentes de contacto en RD?",
            "description": "Por qué nunca debes usar agua del grifo, piscina o botella con tus lentes de contacto en hoteles de República Dominicana. Riesgos y qué usar en su lugar.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/agua-lentes-contacto-viaje-hoteles-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Puedo lavar mis lentes de contacto con agua del grifo en RD?", "acceptedAnswer": { "@type": "Answer", "text": "No. El agua del grifo, incluso en hoteles de buena categoría, no es estéril y puede contener microorganismos que causan infecciones oculares graves. Usa siempre solución multipropósito." } },
              { "@type": "Question", "name": "¿Puedo guardar mis lentes en agua embotellada si se me acabó la solución?", "acceptedAnswer": { "@type": "Answer", "text": "No se recomienda. El agua embotellada tampoco desinfecta ni mantiene las propiedades del lente. Es mejor comprar solución nueva o cambiar temporalmente a lentes diarios desechables." } },
              { "@type": "Question", "name": "¿Es seguro nadar en la piscina del hotel con lentes puestos?", "acceptedAnswer": { "@type": "Answer", "text": "No se recomienda. El cloro y los microorganismos del agua de piscina pueden dañar el lente e irritar el ojo. Si vas a nadar, usa lentes diarios y descártalos después, o quítatelos antes de entrar." } },
              { "@type": "Question", "name": "¿Dónde puedo comprar solución para lentes de contacto en zonas turísticas de RD?", "acceptedAnswer": { "@type": "Answer", "text": "En farmacias y supermercados grandes de zonas turísticas, o pidiéndola online en ContactGo con entrega directa a tu hotel en 24-48 horas." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "¿Puedo usar agua del hotel o piscina con mis lentes de contacto en RD?", "item": "https://www.contactgo.net/blog/agua-lentes-contacto-viaje-hoteles-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">¿Puedo usar agua del hotel o piscina con mis lentes de contacto en RD?</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">💧 Seguridad ocular</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Puedo usar agua del hotel o piscina con mis lentes de contacto en RD?</h1>

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
            {[['por-que-no','Por qué el agua nunca reemplaza la solución de lentes'],
['se-me-acabo-la-solucion','¿Se te acabó la solución en tu hotel?'],
['lentes-diarios-como-alternativa','Una alternativa: cambia a lentes diarios durante el viaje']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Es uno de los errores más comunes de los viajeros: usar agua del grifo, agua embotellada o el agua de la piscina del hotel para limpiar o incluso guardar los lentes de contacto cuando se les acaba la solución. En República Dominicana, como en cualquier destino tropical, esto es un riesgo real que vale la pena entender antes de que pase.</p>

          <section id="por-que-no">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Por qué el agua nunca reemplaza la solución de lentes</h2>
            <p>El agua —sea del grifo, embotellada, de piscina o de mar— <strong>no es estéril</strong> y puede contener microorganismos como <em>Acanthamoeba</em>, una ameba que en climas cálidos y húmedos como el de RD se encuentra con más frecuencia. Si esta ameba entra en contacto con el lente y luego con tu ojo, puede causar una infección llamada queratitis por Acanthamoeba, que en casos severos puede comprometer la córnea de forma permanente.</p>
             <p className="mt-2">La solución multipropósito para lentes de contacto (como Opti-Free Puremoist o Biotrue) está formulada específicamente para desinfectar, limpiar y mantener el lente húmedo de forma segura — el agua simplemente no cumple ninguna de esas tres funciones.</p>
          </section>

          <section id="se-me-acabo-la-solucion">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Se te acabó la solución en tu hotel?</h2>
            <p>Si estás de viaje en Punta Cana, Bávaro, Santo Domingo o cualquier otra zona de RD y se te acabó la solución, la opción más segura es comprar una nueva botella —muchas farmacias y supermercados grandes la venden— o pedir que te la entreguen directo al hotel. En ContactGo puedes ordenar Opti-Free Puremoist, Biotrue y otras marcas con entrega en 24-48h en cualquier zona turística del país.</p>
          </section>

          <section id="lentes-diarios-como-alternativa">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Una alternativa: cambia a lentes diarios durante el viaje</h2>
            <p>Si sabes que vas a estar de viaje y te preocupa la logística de solución y limpieza, considera usar <Link href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="text-primary-600 hover:underline font-medium">lentes diarios desechables</Link> durante esos días. No requieren solución ni estuche — te los pones en la mañana y los descartas en la noche, eliminando por completo el riesgo de contaminación con agua.</p>
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
            <a href="/blog/lentes-contacto-clima-tropical-playa-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto en clima tropical y playa</p><p className="text-xs text-gray-500 mt-0.5">Guía de cuidado completa</p></a>
            <a href="/blog/solucion-limpieza-lentes-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo elegir la mejor solución para lentes</p><p className="text-xs text-gray-500 mt-0.5">Comparativa de soluciones</p></a>
            <a href="/blog/opti-free-puremoist-precio-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Opti-Free Puremoist precio en RD</p><p className="text-xs text-gray-500 mt-0.5">Precios actualizados</p></a>
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
