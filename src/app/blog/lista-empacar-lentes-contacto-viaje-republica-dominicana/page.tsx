export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lista para empacar lentes de contacto en tu viaje a RD — Checklist 2026',
  description: 'Checklist completo de qué llevar de lentes de contacto para tu viaje a República Dominicana: cuántos pares, solución, estuche y qué hacer si algo falta.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana' },
  openGraph: {
    type: 'article', title: 'Lista para empacar lentes de contacto en tu viaje a RD — Checklist 2026',
    description: 'Checklist completo de qué llevar de lentes de contacto para tu viaje a República Dominicana: cuántos pares, solución, estuche y qué hacer si algo falta.',
    url: 'https://www.contactgo.net/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: 'Lista para empacar tus lentes de contacto antes de viajar a República Dominicana' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Cuántos lentes de contacto debo llevar para un viaje de 2 semanas a RD?", a: "Si usas diarios, lleva al menos 16-17 unidades (14 días + repuesto). Si usas mensuales, un par nuevo es suficiente, pero lleva un segundo par de respaldo por seguridad." },
                { q: "¿Debo llevar gafas graduadas aunque solo use lentes de contacto?", a: "Sí, se recomienda siempre como respaldo en caso de irritación ocular, pérdida de un lente o que decidas descansar los ojos durante el viaje." },
                { q: "¿Qué hago si se me rompe el estuche de lentes en el viaje?", a: "Puedes comprar un estuche nuevo en cualquier farmacia local, o pedir uno junto con tu próximo pedido de lentes en ContactGo con entrega a tu hotel." },
                { q: "¿Puedo pedir lentes de contacto de emergencia si se me olvidaron en casa?", a: "Sí. ContactGo entrega en 24-48 horas en toda República Dominicana, incluyendo hoteles en zonas turísticas como Punta Cana y Bávaro." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lista para empacar tus lentes de contacto antes de viajar a República Dominicana",
            "description": "Checklist completo de qué llevar de lentes de contacto para tu viaje a República Dominicana: cuántos pares, solución, estuche y qué hacer si algo falta.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Cuántos lentes de contacto debo llevar para un viaje de 2 semanas a RD?", "acceptedAnswer": { "@type": "Answer", "text": "Si usas diarios, lleva al menos 16-17 unidades (14 días + repuesto). Si usas mensuales, un par nuevo es suficiente, pero lleva un segundo par de respaldo por seguridad." } },
              { "@type": "Question", "name": "¿Debo llevar gafas graduadas aunque solo use lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, se recomienda siempre como respaldo en caso de irritación ocular, pérdida de un lente o que decidas descansar los ojos durante el viaje." } },
              { "@type": "Question", "name": "¿Qué hago si se me rompe el estuche de lentes en el viaje?", "acceptedAnswer": { "@type": "Answer", "text": "Puedes comprar un estuche nuevo en cualquier farmacia local, o pedir uno junto con tu próximo pedido de lentes en ContactGo con entrega a tu hotel." } },
              { "@type": "Question", "name": "¿Puedo pedir lentes de contacto de emergencia si se me olvidaron en casa?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. ContactGo entrega en 24-48 horas en toda República Dominicana, incluyendo hoteles en zonas turísticas como Punta Cana y Bávaro." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lista para empacar tus lentes de contacto antes de viajar a República Dominicana", "item": "https://www.contactgo.net/blog/lista-empacar-lentes-contacto-viaje-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lista para empacar tus lentes de contacto antes de viajar a República Dominicana</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-teal-50 px-2 py-0.5 rounded-full">🧳 Checklist de viaje</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lista para empacar tus lentes de contacto antes de viajar a República Dominicana</h1>

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
            {[['cuantos-pares','¿Cuántos pares de lentes debo llevar?'],
['checklist','Checklist completa'],
['si-falta-algo','¿Y si algo de esto se te olvida?']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Ya sea que vengas de vacaciones, en viaje de negocios o te estés mudando a República Dominicana, olvidar algo relacionado con tus lentes de contacto puede arruinar los primeros días de tu viaje. Esta checklist cubre exactamente qué empacar y cuánto.</p>

          <section id="cuantos-pares">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cuántos pares de lentes debo llevar?</h2>
            <p>La regla general de los optometristas es llevar <strong>al menos un 30-50% más</strong> de lo que calculas necesitar para la duración exacta del viaje. Si usas lentes diarios, cuenta un lente por cada día completo más 2-3 de repuesto. Si usas mensuales, lleva el par que vas a usar más uno de respaldo por si se rompe, se pierde o se contamina.</p>
          </section>

          <section id="checklist">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Checklist completa</h2>
            <ul className="list-disc list-inside space-y-2 mt-2">
               <li>✅ Lentes de contacto suficientes para toda la duración del viaje + repuesto</li>
               <li>✅ Estuche de lentes (idealmente uno nuevo o recién desinfectado)</li>
               <li>✅ Solución multipropósito en envase de 100ml o menos para el equipaje de mano</li>
               <li>✅ Gafas graduadas de respaldo (por si tienes que descansar los ojos o pierdes un lente)</li>
               <li>✅ Copia de tu receta óptica (foto en el celular es suficiente)</li>
               <li>✅ Gotas lubricantes compatibles con lentes (el aire del avión y el clima tropical resecan más de lo normal)</li>
             </ul>
          </section>

          <section id="si-falta-algo">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Y si algo de esto se te olvida?</h2>
            <p>Si llegas a República Dominicana y te falta algo de la lista —ya sea que se te olvidó, se dañó en el vuelo o simplemente calculaste mal la cantidad— no necesitas encontrar una óptica física. ContactGo entrega lentes, solución y accesorios directo a tu hotel, Airbnb o residencia en 24-48 horas en cualquier parte del país.</p>
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
            <a href="/blog/lentes-contacto-equipaje-mano-aeropuerto-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Puedo llevar lentes de contacto en el avión?</p><p className="text-xs text-gray-500 mt-0.5">Reglas de equipaje de mano</p></a>
            <a href="/blog/forgot-contact-lenses-punta-cana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Forgot Your Contact Lenses in Punta Cana?</p><p className="text-xs text-gray-500 mt-0.5">Entrega de emergencia al hotel</p></a>
            <a href="/blog/agua-lentes-contacto-viaje-hoteles-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-teal-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ¿Puedo usar agua del hotel con mis lentes?</p><p className="text-xs text-gray-500 mt-0.5">Lo que debes saber antes de viajar</p></a>
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
