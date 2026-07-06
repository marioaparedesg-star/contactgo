export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '¿Se puede nadar con lentes de contacto? La verdad médica — 2026', description: 'La verdad sobre nadar con lentes de contacto: piscinas, playa, ríos. Por qué los especialistas dicen NO y qué hacer si ya lo hiciste. Guía de ContactGo para RD.',
  alternates: { canonical: 'https://www.contactgo.net/blog/se-puede-nadar-con-lentes-contacto' },
  openGraph: { type: 'article', title: '¿Se puede nadar con lentes de contacto? La respuesta definitiva', description: 'La verdad sobre nadar con lentes de contacto: piscinas, playa, ríos. Por qué los especialistas dicen NO y qué hacer si ya lo hiciste. Guía de ContactGo para RD.', url: 'https://www.contactgo.net/blog/se-puede-nadar-con-lentes-contacto', siteName: 'ContactGo', locale: 'es_DO', images: [{ url: 'https://www.contactgo.net/blog/se-puede-nadar-con-lentes-contacto.webp', width: 1200, height: 630, alt: '¿Se puede nadar con lentes de contacto? La respuesta definitiva' }] },
}
export default function Page() {
  return (<><Navbar /><main className="max-w-2xl mx-auto px-4 py-12 pb-24">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      {"@context":"https://schema.org","@type":"Article","headline":"¿Se puede nadar con lentes de contacto? La respuesta definitiva","description":"La verdad sobre nadar con lentes de contacto: piscinas, playa, ríos. Por qué los especialistas dicen NO y qué hacer si ya lo hiciste. Guía de ContactGo para RD.","author":{"@type":"Organization","name":"Equipo ContactGo"},"publisher":{"@type":"Organization","name":"ContactGo","url":"https://www.contactgo.net","logo":{"@type":"ImageObject","url":"https://www.contactgo.net/logo.png"}},"datePublished":"2026-07-02","dateModified":"2026-07-02","url":"https://www.contactgo.net/blog/se-puede-nadar-con-lentes-contacto","inLanguage":"es-DO"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":'Se puede nadar con lentes de contacto en el mar?',"acceptedAnswer":{"@type":"Answer","text":'No se recomienda. El agua salada puede deshidratar el lente, hacerlo incómodo y desplazarlo. Además, el mar contiene bacterias y microorganismos que pueden adherirse al lente y causar infecciones oculares. Si nadas en el mar frecuentemente, usa gafas de natación graduadas.'}},{"@type":"Question","name":'¿Qué pasa si abro los ojos bajo el agua con lentes de contacto?',"acceptedAnswer":{"@type":"Answer","text":'El lente absorbe el agua, puede deformarse ligeramente y los microorganismos del agua pueden quedar atrapados entre el lente y la córnea. El mayor riesgo es la Acanthamoeba keratitis, una infección muy grave y difícil de tratar. Si ocurrió, retírate el lente inmediatamente al salir y observa síntomas.'}},{"@type":"Question","name":'¿Los lentes de contacto desechables diarios son más seguros para nadar?',"acceptedAnswer":{"@type":"Answer","text":'Ligeramente, porque se descartan después — pero el riesgo de infección es el mismo mientras están en el agua. La recomendación médica es la misma para todos los tipos de lente: no nadar con ellos puestos.'}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://www.contactgo.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://www.contactgo.net/blog"},{"@type":"ListItem","position":3,"name":"¿Se puede nadar con lentes de contacto? La respues","item":"https://www.contactgo.net/blog/se-puede-nadar-con-lentes-contacto"}]}
    ]) }} />
    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4"><a href="/" className="hover:text-primary-600">Inicio</a><span>/</span><a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span><span className="text-gray-600 truncate">¿Se puede nadar con lentes de contacto? </span></div>
    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">🏊 Salud ocular · Natación</span>
    <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Se puede nadar con lentes de contacto? La respuesta definitiva</h1>
    <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
      <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en salud visual · 7 min · Julio 2026</p></div>
    </div>
    <div className="space-y-8 text-gray-700 leading-relaxed">
      <p>La respuesta corta y directa es <strong>NO</strong>. Los especialistas en salud visual de todo el mundo recomiendan no usar lentes de contacto en piscinas, playas, ríos ni ningún cuerpo de agua. Aquí te explicamos por qué, qué hacer si ya lo hiciste, y cuáles son tus alternativas.</p>
    <section id="por-que-no">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Por qué no se debe nadar con lentes de contacto</h2>
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h3 className="font-bold text-red-800 mb-2">El peligro principal: Acanthamoeba</h3>
          <p className="text-sm text-red-700">Acanthamoeba keratitis es una infección corneal causada por un parásito microscópico presente en el agua del grifo, piscinas y aguas abiertas. Es extremadamente difícil de tratar, puede ser muy dolorosa y en casos severos puede causar pérdida de visión permanente. El lente de contacto facilita que el parásito se adhiera a la córnea.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="font-bold text-amber-800 mb-2">Otros riesgos</h3>
          <ul className="space-y-1 text-sm text-amber-700">
            {['Pseudomonas y otras bacterias en piscinas', 'Cloro que cambia la forma del lente y lo hace incómodo', 'El lente puede desplazarse o perderse al abrir los ojos bajo el agua', 'Agua salada del mar que deshidrata el material del lente'].map((r,i) => <li key={i}>→ {r}</li>)}
          </ul>
        </div>
      </div>
    </section>
    <section id="ya-lo-hice">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Ya nadé con los lentes puestos — ¿qué hago?</h2>
      <ol className="space-y-2 text-sm list-decimal list-inside">
        {['Retírate los lentes inmediatamente al salir del agua.',
          'Descártalos si son lentes diarios. Si son mensuales, límpialos bien con solución multipropósito.',
          'Aplica gotas lubricantes para hidratar los ojos.',
          'Observa los próximos 24-48 horas: si aparece dolor, enrojecimiento intenso o visión borrosa, ve al médico.',
          'NO reutilices lentes que estuvieron en contacto con agua de piscina o mar sin limpiarlos correctamente.'].map((p,i) => <li key={i} className="py-1 border-b border-gray-50">{p}</li>)}
      </ol>
    </section>
    <section id="alternativas">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Alternativas para nadar con corrección visual</h2>
      <div className="space-y-3 text-sm">
        <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/30">
          <p className="font-bold text-gray-900">Gafas de natación graduadas</p>
          <p className="text-gray-600 mt-0.5">La mejor opción. Se fabrican con tu graduación exacta o en graduaciones estándar. Disponibles en ópticas especializadas en RD.</p>
        </div>
        <div className="p-4 border border-gray-100 rounded-xl">
          <p className="font-bold text-gray-900">Lentes de contacto + gafas de natación sin graduación encima</p>
          <p className="text-gray-600 mt-0.5">Técnicamente reduce el riesgo de que el lente se moje, pero no lo elimina. No es la opción ideal.</p>
        </div>
        <div className="p-4 border border-gray-100 rounded-xl">
          <p className="font-bold text-gray-900">Ortoqueratología</p>
          <p className="text-gray-600 mt-0.5">Lentes nocturnos que remodelan la córnea para que durante el día puedas ver sin lentes. Ideal para nadadores frecuentes. Consulta a un especialista en RD.</p>
        </div>
      </div>
    </section>
      <section id="productos"><h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo — Entrega 24-48h</h2>
        <div className="space-y-2">            <a href="/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Optive Advanced</p><p className="text-xs text-gray-500">Para hidratar tras exposición al agua</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$1,000</span></a>
            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">ACUVUE Oasys 6u</p><p className="text-xs text-gray-500">El favorito de deportistas</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a>
            <a href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">1-DAY ACUVUE MOIST 30u</p><p className="text-xs text-gray-500">Diarios — descartar tras uso</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a></div><a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
      </section>
      <section id="faq"><h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2><div className="space-y-3">          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Se puede nadar con lentes de contacto en el mar?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No se recomienda. El agua salada puede deshidratar el lente, hacerlo incómodo y desplazarlo. Además, el mar contiene bacterias y microorganismos que pueden adherirse al lente y causar infecciones oculares. Si nadas en el mar frecuentemente, usa gafas de natación graduadas.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué pasa si abro los ojos bajo el agua con lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">El lente absorbe el agua, puede deformarse ligeramente y los microorganismos del agua pueden quedar atrapados entre el lente y la córnea. El mayor riesgo es la Acanthamoeba keratitis, una infección muy grave y difícil de tratar. Si ocurrió, retírate el lente inmediatamente al salir y observa síntomas.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Los lentes de contacto desechables diarios son más seguros para nadar?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Ligeramente, porque se descartan después — pero el riesgo de infección es el mismo mientras están en el agua. La recomendación médica es la misma para todos los tipos de lente: no nadar con ellos puestos.</p></details></div></section>
      <div className="grid gap-2"><h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>            <a href="/blog/lentes-contacto-deporte-actividad-fisica" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto para deporte</p><p className="text-xs text-gray-500 mt-0.5">Qué deportes son seguros</p></a>
            <a href="/blog/ojo-rojo-lentes-contacto-que-hacer" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ojo rojo con lentes — qué hacer</p><p className="text-xs text-gray-500 mt-0.5">Guia de emergencia ocular</p></a>
            <a href="/blog/dormir-con-lentes-de-contacto-riesgos" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Riesgos de dormir con lentes</p><p className="text-xs text-gray-500 mt-0.5">Otros errores peligrosos</p></a></div>
    </div>
    <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6"><p className="font-bold text-gray-900 text-sm">Verificado · Equipo ContactGo · Julio 2026</p></div>
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900"><strong>Aviso médico:</strong> Ante molestias oculares consulta siempre a tu especialista.</div>
    <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
      <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
      <p className="text-sm text-gray-500 mb-4">100% originales · Pago seguro con AZUL/Banco Popular</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
        <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
        <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
      </div>
    </div>
  </main><Footer /></>)
}
