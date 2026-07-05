export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: '¿Qué necesito para usar lentes de contacto por primera vez? — Guía 2026', description: 'Todo lo que necesitas para empezar con lentes de contacto en RD: receta, marca, solución, técnica y primeros pasos. Guía completa para principiantes 2026.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-primera-vez-que-necesito' },
  openGraph: { type: 'article', title: '¿Qué necesito para usar lentes de contacto por primera vez? Guía completa', description: 'Todo lo que necesitas para empezar con lentes de contacto en RD: receta, marca, solución, técnica y primeros pasos. Guía completa para principiantes 2026.', url: 'https://www.contactgo.net/blog/lentes-contacto-primera-vez-que-necesito', siteName: 'ContactGo', locale: 'es_DO', images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-primera-vez-que-necesito.webp', width: 1200, height: 630, alt: '¿Qué necesito para usar lentes de contacto por primera vez? Guía completa' }] },
}
export default function Page() {
  return (<><Navbar /><main className="max-w-2xl mx-auto px-4 py-12 pb-24">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      {"@context":"https://schema.org","@type":"Article","headline":"¿Qué necesito para usar lentes de contacto por primera vez? Guía completa","description":"Todo lo que necesitas para empezar con lentes de contacto en RD: receta, marca, solución, técnica y primeros pasos. Guía completa para principiantes 2026.","author":{"@type":"Organization","name":"Equipo ContactGo"},"publisher":{"@type":"Organization","name":"ContactGo","url":"https://www.contactgo.net","logo":{"@type":"ImageObject","url":"https://www.contactgo.net/logo.png"}},"datePublished":"2026-07-02","dateModified":"2026-07-02","url":"https://www.contactgo.net/blog/lentes-contacto-primera-vez-que-necesito","inLanguage":"es-DO"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":'¿Cuánto cuesta empezar con lentes de contacto en RD?',"acceptedAnswer":{"@type":"Answer","text":'La inversión inicial es: una caja de lentes (RD$3,875-4,750) + solución multipropósito si son mensuales/quincenales (RD$750-900) = aproximadamente RD$4,625-5,650 para el primer mes. Los meses siguientes solo la caja de lentes y la solución.'}},{"@type":"Question","name":'¿Es difícil aprender a ponerse los lentes de contacto?',"acceptedAnswer":{"@type":"Answer","text":'Al principio puede tomar 10-15 minutos, pero la mayoría domina la técnica en 3-7 días. El truco está en mantener el ojo muy abierto, mirar hacia arriba y no tener miedo de tocar el ojo. Con práctica se hace en segundos.'}},{"@type":"Question","name":'¿Cuántas horas puedo usar los lentes el primer día?',"acceptedAnswer":{"@type":"Answer","text":'El primer día, entre 2-4 horas máximo. Aumenta 1-2 horas cada día hasta llegar al máximo recomendado para tu lente (12-14h para silicona hidrogel). El período de adaptación toma entre 1-2 semanas.'}},{"@type":"Question","name":'¿Qué solución necesito para mis primeros lentes de contacto?',"acceptedAnswer":{"@type":"Answer","text":'Para lentes diarios no necesitas ninguna solución — se descartan cada día. Para lentes quincenales o mensuales, necesitas Opti-Free Puremoist (RD$750) o Dream Eye (RD$750). Ambas disponibles en ContactGo con tu primer pedido.'}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://www.contactgo.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://www.contactgo.net/blog"},{"@type":"ListItem","position":3,"name":"¿Qué necesito para usar lentes de contacto por pri","item":"https://www.contactgo.net/blog/lentes-contacto-primera-vez-que-necesito"}]}
    ]) }} />
    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4"><a href="/" className="hover:text-primary-600">Inicio</a><span>/</span><a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span><span className="text-gray-600 truncate">¿Qué necesito para usar lentes de contac</span></div>
    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">🌟 Principiantes · Guía</span>
    <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Qué necesito para usar lentes de contacto por primera vez? Guía completa</h1>
    <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
      <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en salud visual · 9 min · Julio 2026</p></div>
    </div>
    <div className="space-y-8 text-gray-700 leading-relaxed">
      <p>Empezar con lentes de contacto por primera vez puede generar muchas dudas. Esta guía responde exactamente qué necesitas, cómo elegir tu primer lente y qué esperar en las primeras semanas — pensada para usuarios en República Dominicana.</p>
    <section id="lista">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Lista de lo que necesitas</h2>
      <div className="space-y-3">
        {[
          { num: '1', item: 'Tu receta óptica actualizada', desc: 'Visita un optometrista para obtener tu prescripción con SPH, y CYL/AXIS si tienes astigmatismo. Idealmente que incluya BC y DIA para lentes de contacto específicamente.' },
          { num: '2', item: 'Elegir el tipo de lente correcto', desc: 'Diarios para mayor comodidad y sin mantenimiento. Quincenales o mensuales para menor costo por día. Si tienes astigmatismo, necesitas lentes tóricos.' },
          { num: '3', item: 'Solución multipropósito (si no eliges diarios)', desc: 'Opti-Free Puremoist o Dream Eye para limpiar, desinfectar y conservar tus lentes si son quincenales o mensuales.' },
          { num: '4', item: 'Aprender la técnica básica', desc: 'Ponerse y quitarse los lentes toma práctica — generalmente una semana. No te frustres los primeros días.' },
          { num: '5', item: 'Empezar con pocas horas', desc: 'Los primeros días usa los lentes 4-6 horas, aumentando gradualmente hasta el máximo recomendado (12-14h). El ojo necesita adaptarse.' },
        ].map(s => (
          <div key={s.num} className="flex items-start gap-3 p-4 border border-gray-100 rounded-2xl">
            <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{s.num}</div>
            <div><p className="font-bold text-gray-900 text-sm">{s.item}</p><p className="text-xs text-gray-600 mt-0.5">{s.desc}</p></div>
          </div>
        ))}
      </div>
    </section>
    <section id="primer-lente">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Qué lente elegir para empezar?</h2>
      <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
        <thead><tr className="bg-teal-50"><th className="p-3 text-left border border-gray-100">Perfil</th><th className="p-3 text-left border border-gray-100">Lente recomendado</th><th className="p-3 text-right border border-gray-100">Precio RD$</th></tr></thead>
        <tbody>
          {[
            ['Solo vista (SPH)', 'ACUVUE Oasys® — quincenal, muy cómodo para principiantes', 'RD$3,875'],
            ['Vista + pantallas 8h+', 'Air Optix® HydraGlyde® — hidratación 16h', 'RD$4,375'],
            ['Astigmatismo (CYL)', 'Biofinity® Toric — mensual, estabilización probada', 'RD$5,750'],
            ['Presbicia (ADD)', 'Biofinity® Multifocal — ver cerca y lejos', 'RD$9,500'],
            ['Quiere diarios (sin solución)', '1-DAY ACUVUE® MOIST® — abres y tiras cada día', 'RD$3,875'],
          ].map(([p,l,r], i) => (
            <tr key={i} className={i%2===0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-3 border border-gray-100 font-medium">{p}</td>
              <td className="p-3 border border-gray-100">{l}</td>
              <td className="p-3 border border-gray-100 text-right font-bold">{r}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
    <section id="errores">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Los 5 errores más comunes del principiante</h2>
      <ul className="space-y-2 text-sm">
        {[
          ['No lavarse las manos antes', 'Las bacterias en las manos son la causa principal de infecciones oculares con lentes.'],
          ['Usar agua del grifo en lugar de solución', 'El agua puede contener microorganismos peligrosos. Solo solución multipropósito certificada.'],
          ['Usar los lentes más días de los indicados', 'Un lente mensual NO puede usarse el mes 2. El material se deteriora aunque se vea bien.'],
          ['Dormir con los lentes puestos', 'Reduce el oxígeno a la córnea drásticamente. Quítatelos siempre antes de dormir.'],
          ['No llevar gafas de respaldo', 'Siempre ten unas gafas disponibles por si necesitas descansar los ojos un día.'],
        ].map(([err, sol], i) => (
          <li key={i} className="p-3 bg-red-50 rounded-xl">
            <p className="font-bold text-red-800 text-sm">❌ {err}</p>
            <p className="text-xs text-red-700 mt-0.5">→ {sol}</p>
          </li>
        ))}
      </ul>
    </section>
      <section id="productos"><h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo — Entrega 24-48h en toda RD</h2>
        <div className="space-y-2">            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">ACUVUE Oasys 6u</p><p className="text-xs text-gray-500">⭐ Ideal para principiantes — quincenal</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a>
            <a href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">1-DAY ACUVUE MOIST 30u</p><p className="text-xs text-gray-500">Diarios — sin solución necesaria</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a>
            <a href="/producto/opti-free-puremoist-solucion-multiproposito-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Opti-Free Puremoist</p><p className="text-xs text-gray-500">Solución para mensuales/quincenales</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$750</span></a></div>
        <a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
      </section>
      <section id="faq"><h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2><div className="space-y-3">          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto cuesta empezar con lentes de contacto en RD?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">La inversión inicial es: una caja de lentes (RD$3,875-4,750) + solución multipropósito si son mensuales/quincenales (RD$750-900) = aproximadamente RD$4,625-5,650 para el primer mes. Los meses siguientes solo la caja de lentes y la solución.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Es difícil aprender a ponerse los lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Al principio puede tomar 10-15 minutos, pero la mayoría domina la técnica en 3-7 días. El truco está en mantener el ojo muy abierto, mirar hacia arriba y no tener miedo de tocar el ojo. Con práctica se hace en segundos.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuántas horas puedo usar los lentes el primer día?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">El primer día, entre 2-4 horas máximo. Aumenta 1-2 horas cada día hasta llegar al máximo recomendado para tu lente (12-14h para silicona hidrogel). El período de adaptación toma entre 1-2 semanas.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué solución necesito para mis primeros lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Para lentes diarios no necesitas ninguna solución — se descartan cada día. Para lentes quincenales o mensuales, necesitas Opti-Free Puremoist (RD$750) o Dream Eye (RD$750). Ambas disponibles en ContactGo con tu primer pedido.</p></details></div></section>
      <div className="grid gap-2"><h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>            <a href="/blog/como-poner-lentes-de-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo ponerse los lentes paso a paso</p><p className="text-xs text-gray-500 mt-0.5">Tutorial completo con técnica correcta</p></a>
            <a href="/blog/cuantas-horas-usar-lentes-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Cuántas horas puedo usarlos?</p><p className="text-xs text-gray-500 mt-0.5">Límites y recomendaciones</p></a>
            <a href="/receta" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Calculadora de receta</p><p className="text-xs text-gray-500 mt-0.5">Encuentra tu lente con tu graduación</p></a></div>
    </div>
    <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6"><p className="font-bold text-gray-900 text-sm">Verificado por el Equipo ContactGo · Julio 2026</p></div>
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900"><strong>Aviso:</strong> Este artículo es informativo. Ante molestias oculares, consulta a tu especialista.</div>
    <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
      <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
      <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL/Banco Popular</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
        <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
        <a href="/contacto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
      </div>
    </div>
  </main><Footer /></>)
}
