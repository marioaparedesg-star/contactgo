export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Se me perdió el lente de contacto en el ojo — ¿Qué hago? 2026', description: 'Se te perdio el lente de contacto dentro del ojo? No entres en panico. Aqui te explicamos que hacer paso a paso, por que no puede llegar al cerebro y como encontrarlo.',
  alternates: { canonical: 'https://www.contactgo.net/blog/perdida-lente-contacto-ojo-que-hacer' },
  openGraph: { type: 'article', title: 'Se me perdio el lente de contacto en el ojo — Guia completa', description: 'Se te perdio el lente de contacto dentro del ojo? No entres en panico. Aqui te explicamos que hacer paso a paso, por que no puede llegar al cerebro y como encontrarlo.', url: 'https://www.contactgo.net/blog/perdida-lente-contacto-ojo-que-hacer', siteName: 'ContactGo', locale: 'es_DO', images: [{ url: 'https://www.contactgo.net/blog/perdida-lente-contacto-ojo-que-hacer.webp', width: 1200, height: 630, alt: 'Se me perdio el lente de contacto en el ojo — Guia completa' }] },
}
export default function Page() {
  return (<><Navbar /><main className="max-w-2xl mx-auto px-4 py-12 pb-24">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      {"@context":"https://schema.org","@type":"Article","headline":"Se me perdio el lente de contacto en el ojo — Guia completa","description":"Se te perdio el lente de contacto dentro del ojo? No entres en panico. Aqui te explicamos que hacer paso a paso, por que no puede llegar al cerebro y como encontrarlo.","author":{"@type":"Organization","name":"Equipo ContactGo"},"publisher":{"@type":"Organization","name":"ContactGo","url":"https://www.contactgo.net","logo":{"@type":"ImageObject","url":"https://www.contactgo.net/logo.png"}},"datePublished":"2026-07-02","dateModified":"2026-07-02","url":"https://www.contactgo.net/blog/perdida-lente-contacto-ojo-que-hacer","inLanguage":"es-DO"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":'Un lente de contacto puede perderse detras del ojo?',"acceptedAnswer":{"@type":"Answer","text":'No. La conjuntiva (membrana que recubre el interior del ojo y los parpados) forma un espacio sellado que impide que el lente pase detras del globo ocular. Es anatomicamente imposible. Lo que ocurre es que el lente se desplaza debajo del parpado superior o inferior.'}},{"@type":"Question","name":'Que hago si no encuentro el lente en el ojo?',"acceptedAnswer":{"@type":"Answer","text":'Aplica gotas lubricantes y mueve los ojos con los parpados cerrados. Si aun no lo encuentras, es muy probable que el lente haya salido del ojo sin que lo notaras — revisar la ropa y el suelo. Si el ojo sigue molestando aunque no encuentres el lente, consulta al medico.'}},{"@type":"Question","name":'Se puede rajar un lente de contacto dentro del ojo?',"acceptedAnswer":{"@type":"Answer","text":'Si, aunque es poco comun. Si sientes dolor agudo y sensacion de astilla, el lente puede estar roto. Aplica gotas lubricantes, NO te frotes, y ve al medico. Nunca intentes retirar fragmentos de lente sin ayuda medica si sientes dolor intenso.'}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://www.contactgo.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://www.contactgo.net/blog"},{"@type":"ListItem","position":3,"name":"Se me perdio el lente de contacto en el ojo — Guia","item":"https://www.contactgo.net/blog/perdida-lente-contacto-ojo-que-hacer"}]}
    ]) }} />
    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4"><a href="/" className="hover:text-primary-600">Inicio</a><span>/</span><a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span><span className="text-gray-600 truncate">Se me perdio el lente de contacto en el </span></div>
    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">😰 Urgencia · Salud ocular</span>
    <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Se me perdio el lente de contacto en el ojo — Guia completa</h1>
    <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
      <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en salud visual · 7 min · Julio 2026</p></div>
    </div>
    <div className="space-y-8 text-gray-700 leading-relaxed">
      <p>Primero lo primero: <strong>tranquilidad</strong>. Un lente de contacto no puede perderse detrás del ojo ni llegar al cerebro. La anatomia ocular lo hace imposible — la conjuntiva (membrana que cubre el ojo) esta conectada y forma un espacio cerrado que impide que el lente pase. Lo que sentiste fue el lente moviendose debajo del parpado.</p>
    <section id="pasos">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Que hacer paso a paso</h2>
      <div className="space-y-3">
        {[
          { paso: '1', title: 'No entres en panico ni te frotes el ojo', desc: 'Frotarse puede desplazar mas el lente, irritar el ojo o rasgarlo. Mantente calmado.' },
          { paso: '2', title: 'Aplica gotas lubricantes', desc: 'Una o dos gotas de Refresh Tears o Refresh Optive. Esto ayuda a mover el lente hacia una posicion mas accesible.' },
          { paso: '3', title: 'Cierra los ojos y muevelos suavemente', desc: 'Con los ojos cerrados, muevelos en distintas direcciones (arriba, abajo, izquierda, derecha). El lente suele salir de debajo del parpado.' },
          { paso: '4', title: 'Revisa debajo de los parpados', desc: 'Jala suavemente el parpado superior hacia arriba o el inferior hacia abajo mientras te miras en un espejo. El lente suele estar ahi, plegado.' },
          { paso: '5', title: 'Si lo ves, retiralo con cuidado', desc: 'Con el dedo limpio o una pinza de silicona para lentes, retira el lente suavemente. Si esta seco o pegado, aplica mas gotas primero.' },
          { paso: '6', title: 'Si no lo encuentras despues de 10 minutos', desc: 'Es posible que el lente haya caido fuera del ojo sin que te diera cuenta. Revisa la ropa, el suelo. Si tienes el ojo irritado pero no encuentras el lente, probablemente ya salio.' },
        ].map(s => (
          <div key={s.paso} className="flex items-start gap-3 p-4 border border-gray-100 rounded-2xl">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{s.paso}</div>
            <div><p className="font-bold text-gray-900 text-sm">{s.title}</p><p className="text-xs text-gray-600 mt-0.5">{s.desc}</p></div>
          </div>
        ))}
      </div>
    </section>
    <section id="cuando-medico">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cuando ir al medico</h2>
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm">
        <p className="font-bold text-red-800 mb-2">Ve al medico si despues de 30 minutos tienes:</p>
        <ul className="space-y-1 text-red-700">
          {['Dolor ocular intenso que no mejora','Vision borrosa persistente','Sensacion fuerte de cuerpo extrano aunque ya retiraste el lente','Enrojecimiento severo o hinchazón','No encuentras el lente y tienes los sintomas anteriores'].map((s,i) => <li key={i}>→ {s}</li>)}
        </ul>
      </div>
    </section>
      <section id="productos"><h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo — Entrega 24-48h</h2>
        <div className="space-y-2">            <a href="/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Optive Advanced</p><p className="text-xs text-gray-500">Para lubricar y mover el lente</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$1,000</span></a>
            <a href="/producto/refresh-tears-gotas-lubricantes-ojos-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Refresh Tears</p><p className="text-xs text-gray-500">Gotas lubricantes de emergencia</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$800</span></a>
            <a href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">1-DAY ACUVUE MOIST 30u</p><p className="text-xs text-gray-500">Diarios — reemplaza el perdido</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a></div><a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
      </section>
      <section id="faq"><h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2><div className="space-y-3">          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Un lente de contacto puede perderse detras del ojo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No. La conjuntiva (membrana que recubre el interior del ojo y los parpados) forma un espacio sellado que impide que el lente pase detras del globo ocular. Es anatomicamente imposible. Lo que ocurre es que el lente se desplaza debajo del parpado superior o inferior.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Que hago si no encuentro el lente en el ojo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Aplica gotas lubricantes y mueve los ojos con los parpados cerrados. Si aun no lo encuentras, es muy probable que el lente haya salido del ojo sin que lo notaras — revisar la ropa y el suelo. Si el ojo sigue molestando aunque no encuentres el lente, consulta al medico.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Se puede rajar un lente de contacto dentro del ojo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Si, aunque es poco comun. Si sientes dolor agudo y sensacion de astilla, el lente puede estar roto. Aplica gotas lubricantes, NO te frotes, y ve al medico. Nunca intentes retirar fragmentos de lente sin ayuda medica si sientes dolor intenso.</p></details></div></section>
      <div className="grid gap-2"><h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>            <a href="/blog/ojo-rojo-lentes-contacto-que-hacer" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ojo rojo con lentes — que hacer</p><p className="text-xs text-gray-500 mt-0.5">Guia de emergencias oculares</p></a>
            <a href="/blog/como-poner-lentes-de-contacto" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Como ponerse los lentes correctamente</p><p className="text-xs text-gray-500 mt-0.5">Tecnica para evitar problemas</p></a>
            <a href="/blog/dormir-con-lentes-de-contacto-riesgos" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Riesgos de dormir con lentes</p><p className="text-xs text-gray-500 mt-0.5">Otro error comun</p></a></div>
    </div>
    <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6"><p className="font-bold text-gray-900 text-sm">Verificado · Equipo ContactGo · Julio 2026</p></div>
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900"><strong>Aviso médico:</strong> Ante molestias oculares consulta siempre a tu especialista.</div>
    <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
      <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
      <p className="text-sm text-gray-500 mb-4">100% originales · Pago seguro con AZUL/Banco Popular</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
        <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
        <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
      </div>
    </div>
  </main><Footer /></>)
}
