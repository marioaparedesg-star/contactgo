export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '¿Puedo usar lentes de contacto en el embarazo? — Guía 2026', description: '¿Los lentes de contacto son seguros durante el embarazo? Qué cambios esperar en tu visión, qué lentes son más cómodos y cuándo consultar al médico. Guía médica 2026.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-embarazo-republica-dominicana' },
  openGraph: { type: 'article', title: '¿Puedo usar lentes de contacto durante el embarazo? Guía completa', description: '¿Los lentes de contacto son seguros durante el embarazo? Qué cambios esperar en tu visión, qué lentes son más cómodos y cuándo consultar al médico. Guía médica 2026.', url: 'https://www.contactgo.net/blog/lentes-contacto-embarazo-republica-dominicana', siteName: 'ContactGo', locale: 'es_DO', images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-embarazo-republica-dominicana.webp', width: 1200, height: 630, alt: '¿Puedo usar lentes de contacto durante el embarazo? Guía completa' }] },
}
export default function Page() {
  return (
    <>
      <Navbar /><main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {"@context":"https://schema.org","@type":"Article","headline":"¿Puedo usar lentes de contacto durante el embarazo? Guía completa","description":"¿Los lentes de contacto son seguros durante el embarazo? Qué cambios esperar en tu visión, qué lentes son más cómodos y cuándo consultar al médico. Guía médica 2026.","author":{"@type":"Organization","name":"Equipo ContactGo"},"publisher":{"@type":"Organization","name":"ContactGo","url":"https://www.contactgo.net","logo":{"@type":"ImageObject","url":"https://www.contactgo.net/logo.png"}},"datePublished":"2026-06-28","dateModified":"2026-06-28","url":"https://www.contactgo.net/blog/lentes-contacto-embarazo-republica-dominicana","inLanguage":"es-DO"},
          {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":'¿Es seguro usar lentes de contacto durante el embarazo?',"acceptedAnswer":{"@type":"Answer","text":'Sí, en la mayoría de los casos es seguro. Sin embargo, los cambios hormonales pueden causar ojo seco e incomodidad. Se recomienda reducir el tiempo de uso, usar gotas lubricantes y consultar al oftalmólogo si hay cambios significativos en la visión.'}},{"@type":"Question","name":'¿Por qué se sienten raros los lentes de contacto en el embarazo?',"acceptedAnswer":{"@type":"Answer","text":'Las hormonas del embarazo reducen la producción lagrimal (causando ojo seco) y pueden cambiar ligeramente la curvatura corneal, afectando cómo se adapta el lente. Esto es temporal y generalmente se resuelve después del parto.'}},{"@type":"Question","name":'¿Debo cambiar mis lentes de contacto durante el embarazo?',"acceptedAnswer":{"@type":"Answer","text":'No necesariamente, pero si sientes incomodidad, considera: 1) cambiar a lentes de silicona hidrogel con mejor hidratación, 2) reducir las horas de uso, 3) agregar gotas lubricantes compatibles durante el día. No hagas ajustes permanentes de graduación hasta después del parto.'}},{"@type":"Question","name":'¿Cuándo debo dejar de usar lentes de contacto en el embarazo?',"acceptedAnswer":{"@type":"Answer","text":'Deja de usarlos y consulta al médico si tienes: dolor ocular, cambios repentinos en la visión, halos alrededor de las luces, visión borrosa persistente o hinchazón facial — pueden ser señales de complicaciones que requieren atención médica urgente.'}}]},
          {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://www.contactgo.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://www.contactgo.net/blog"},{"@type":"ListItem","position":3,"name":"¿Puedo usar lentes de contacto durante el embarazo","item":"https://www.contactgo.net/blog/lentes-contacto-embarazo-republica-dominicana"}]}
        ]) }} />
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span><a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span><span className="text-gray-600 truncate">¿Puedo usar lentes de contacto durante e</span>
        </div>
        <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">🤰 Embarazo · Salud ocular</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Puedo usar lentes de contacto durante el embarazo? Guía completa</h1>
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en salud visual · ⏱ 8 min · Junio 2026</p></div>
        </div>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>El embarazo produce cambios significativos en el cuerpo — incluyendo los ojos. Muchas embarazadas notan que sus lentes de contacto se sienten menos cómodos durante la gestación. En esta guía te explicamos qué ocurre, cuándo consultar al especialista y qué lentes son más cómodos durante el embarazo.</p>
        <section id="cambios">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cambios en la visión durante el embarazo</h2>
          <p>Las hormonas del embarazo (especialmente la progesterona y los estrógenos) producen varios cambios oculares que pueden afectar la comodidad de los lentes de contacto:</p>
          <ul className="space-y-2 mt-3 text-sm">
            {[
              { cambio: 'Ojo seco', desc: 'Las hormonas reducen la producción lagrimal, causando sequedad e incomodidad con los lentes.' },
              { cambio: 'Cambios en la curvatura corneal', desc: 'La córnea puede engrosarse ligeramente, cambiando cómo se adapta el lente al ojo.' },
              { cambio: 'Cambios en la graduación', desc: 'Algunos embarazadas notan visión más borrosa — aunque generalmente temporal y que se resuelve tras el parto.' },
              { cambio: 'Mayor sensibilidad', desc: 'Los ojos pueden volverse más sensibles a la luz o a la irritación.' },
            ].map((c, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
                <span className="text-pink-500 font-bold shrink-0">→</span>
                <div><p className="font-semibold text-gray-900">{c.cambio}:</p><p className="text-gray-600">{c.desc}</p></div>
              </li>
            ))}
          </ul>
        </section>
        <section id="es-seguro">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Es seguro usar lentes de contacto en el embarazo?</h2>
          <p>Sí, en la mayoría de los casos es seguro seguir usando lentes de contacto durante el embarazo. Sin embargo, es posible que necesites hacer algunos ajustes para mayor comodidad. Las principales recomendaciones son:</p>
          <ul className="space-y-2 mt-3 text-sm">
            {['Reducir las horas de uso si sientes incomodidad','Usar gotas lubricantes compatibles con lentes para compensar el ojo seco','Considerar lentes diarios si usas mensuales — menor acumulación de depósitos','Consultar a tu oftalmólogo si notas cambios significativos en la visión','No realizar ajustes permanentes de graduación hasta después del parto'].map((r, i) => <li key={i} className="flex items-start gap-2"><span className="text-pink-500">✓</span>{r}</li>)}
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 text-sm">
            <p className="font-bold text-amber-800 mb-1">⚠️ Cuándo ir al oftalmólogo</p>
            <p className="text-amber-700">Consulta a tu especialista si tienes visión borrosa persistente, dolor ocular, cambios repentinos en la visión, halos o sensibilidad extrema a la luz — pueden indicar condiciones como preeclampsia que requieren atención médica.</p>
          </div>
        </section>
        <section id="mejores-lentes">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Lentes más cómodos durante el embarazo</h2>
          <p>Para embarazadas que experimentan ojo seco o incomodidad, los lentes de silicona hidrogel con tecnología de hidratación avanzada son los más recomendados:</p>
          <ul className="space-y-2 mt-3 text-sm">
            {[
              { nombre: 'ACUVUE Oasys', razon: 'HYDRACLEAR Plus — excelente para ojo seco relacionado con cambios hormonales' },
              { nombre: 'Air Optix HydraGlyde', razon: 'HydraGlyde retiene humedad 16 horas — ideal para jornadas largas' },
              { nombre: 'Biofinity', razon: 'Aquaform + alto contenido de agua (48%) — cómodo con ojos sensibles' },
              { nombre: 'Lentes diarios (clariti o 1-DAY ACUVUE Moist)', razon: 'Sin acumulación de depósitos — más higiénicos para ojos sensibles' },
            ].map((l, i) => <li key={i} className="flex items-start gap-2 p-2"><span className="text-pink-500 font-bold">→</span><div><strong>{l.nombre}:</strong> {l.razon}</div></li>)}
          </ul>
        </section>
          <section id="productos"><h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo</h2>
            <div className="space-y-2">
            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">ACUVUE® Oasys® 6u</p><p className="text-xs text-gray-500">Quincenal · HYDRACLEAR Plus</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a>
            <a href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Air Optix® HydraGlyde® 6u</p><p className="text-xs text-gray-500">Mensual · Hidratación 16h</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$4,375</span></a>
            <a href="/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Optive Advanced</p><p className="text-xs text-gray-500">Gotas · Compatible con lentes</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$1,000</span></a>
            </div><a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
          </section>
          <section id="faq"><h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Es seguro usar lentes de contacto durante el embarazo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí, en la mayoría de los casos es seguro. Sin embargo, los cambios hormonales pueden causar ojo seco e incomodidad. Se recomienda reducir el tiempo de uso, usar gotas lubricantes y consultar al oftalmólogo si hay cambios significativos en la visión.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Por qué se sienten raros los lentes de contacto en el embarazo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Las hormonas del embarazo reducen la producción lagrimal (causando ojo seco) y pueden cambiar ligeramente la curvatura corneal, afectando cómo se adapta el lente. Esto es temporal y generalmente se resuelve después del parto.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Debo cambiar mis lentes de contacto durante el embarazo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No necesariamente, pero si sientes incomodidad, considera: 1) cambiar a lentes de silicona hidrogel con mejor hidratación, 2) reducir las horas de uso, 3) agregar gotas lubricantes compatibles durante el día. No hagas ajustes permanentes de graduación hasta después del parto.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuándo debo dejar de usar lentes de contacto en el embarazo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Deja de usarlos y consulta al médico si tienes: dolor ocular, cambios repentinos en la visión, halos alrededor de las luces, visión borrosa persistente o hinchazón facial — pueden ser señales de complicaciones que requieren atención médica urgente.</p></details></div>
          </section>
          <div className="grid gap-2"><h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>            <a href="/blog/ojos-secos-lentes-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ojos secos y lentes de contacto</p><p className="text-xs text-gray-500 mt-0.5">Soluciones para la sequedad ocular</p></a>
            <a href="/blog/gotas-para-ojos-secos-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Mejores gotas para ojos secos en RD</p><p className="text-xs text-gray-500 mt-0.5">Comparativa completa</p></a>
            <a href="/blog/lentes-contacto-ojos-secos-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Mejores lentes para ojos secos</p><p className="text-xs text-gray-500 mt-0.5">Los más cómodos para sequedad</p></a></div>
        </div>
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6"><p className="font-bold text-gray-900 text-sm">Información verificada · Equipo ContactGo · Junio 2026</p></div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900"><strong>⚠️ Aviso médico:</strong> Este artículo es informativo. Consulta a tu especialista ante cualquier duda médica.</div>
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18295430580" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main><Footer />
    </>
  )
}
