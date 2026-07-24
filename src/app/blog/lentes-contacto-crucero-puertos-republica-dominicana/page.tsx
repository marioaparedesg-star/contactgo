export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto para pasajeros de crucero en RD — Guía 2026',
  description: '¿Tu crucero hace escala en República Dominicana? Cómo recibir lentes de contacto en Puerto Plata, La Romana, Santo Domingo y Amber Cove en tu misma visita.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-crucero-puertos-republica-dominicana' },
  openGraph: {
    type: 'article', title: 'Lentes de contacto para pasajeros de crucero en RD — Guía 2026',
    description: '¿Tu crucero hace escala en República Dominicana? Cómo recibir lentes de contacto en Puerto Plata, La Romana, Santo Domingo y Amber Cove en tu misma visita.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-crucero-puertos-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto para pasajeros de crucero que visitan República Dominicana' }],
  },
}

export default function Page() {
  const FAQS = [
                { q: "¿Puedo pedir lentes de contacto durante una escala de crucero en RD?", a: "Es posible pero muy ajustado, ya que la entrega estándar toma 24-48h y la mayoría de escalas duran menos de 10 horas. Lo más seguro es pedirlos antes del crucero si te hospedas en tierra unos días, o llevar suficiente cantidad desde casa." },
                { q: "¿Qué puertos de crucero tiene República Dominicana?", a: "Los principales son Amber Cove (Puerto Plata), La Romana, Santo Domingo (Sans Souci) y Samaná." },
                { q: "¿ContactGo entrega cerca de Amber Cove en Puerto Plata?", a: "Sí, entregamos en toda la provincia de Puerto Plata en 24-48 horas, incluyendo hoteles y zonas cercanas al puerto." },
                { q: "¿Cuánto tiempo antes debo pedir si voy a embarcar en un crucero desde RD?", a: "Recomendamos pedir con al menos 2-3 días de anticipación a tu hotel antes del embarque para asegurar que llegue a tiempo." }
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lentes de contacto para pasajeros de crucero que visitan República Dominicana",
            "description": "¿Tu crucero hace escala en República Dominicana? Cómo recibir lentes de contacto en Puerto Plata, La Romana, Santo Domingo y Amber Cove en tu misma visita.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-07-24", "dateModified": "2026-07-24",
            "url": "https://www.contactgo.net/blog/lentes-contacto-crucero-puertos-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Puedo pedir lentes de contacto durante una escala de crucero en RD?", "acceptedAnswer": { "@type": "Answer", "text": "Es posible pero muy ajustado, ya que la entrega estándar toma 24-48h y la mayoría de escalas duran menos de 10 horas. Lo más seguro es pedirlos antes del crucero si te hospedas en tierra unos días, o llevar suficiente cantidad desde casa." } },
              { "@type": "Question", "name": "¿Qué puertos de crucero tiene República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "Los principales son Amber Cove (Puerto Plata), La Romana, Santo Domingo (Sans Souci) y Samaná." } },
              { "@type": "Question", "name": "¿ContactGo entrega cerca de Amber Cove en Puerto Plata?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, entregamos en toda la provincia de Puerto Plata en 24-48 horas, incluyendo hoteles y zonas cercanas al puerto." } },
              { "@type": "Question", "name": "¿Cuánto tiempo antes debo pedir si voy a embarcar en un crucero desde RD?", "acceptedAnswer": { "@type": "Answer", "text": "Recomendamos pedir con al menos 2-3 días de anticipación a tu hotel antes del embarque para asegurar que llegue a tiempo." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes de contacto para pasajeros de crucero que visitan República Dominicana", "item": "https://www.contactgo.net/blog/lentes-contacto-crucero-puertos-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lentes de contacto para pasajeros de crucero que visitan República Dominicana</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">🚢 Pasajeros de crucero</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto para pasajeros de crucero que visitan República Dominicana</h1>

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
            {[['puertos-principales','Puertos de crucero principales en RD'],
['tiempo-limitado','El reto del tiempo limitado en puerto'],
['antes-o-despues','Si te hospedas en RD antes o después del crucero']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Si tu crucero hace escala en República Dominicana —Amber Cove (Puerto Plata), La Romana, Santo Domingo o Samaná— y necesitas lentes de contacto durante tu estadía en tierra, la logística es distinta a la de un turista que se hospeda varios días. Aquí te explicamos qué opciones tienes según el tiempo que tengas en puerto.</p>

          <section id="puertos-principales">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Puertos de crucero principales en RD</h2>
            <ul className="list-disc list-inside space-y-1 mt-2">
               <li><strong>Amber Cove</strong> (Puerto Plata) — uno de los puertos de crucero más activos del Caribe, recibe barcos de Carnival y otras líneas.</li>
               <li><strong>La Romana</strong> — puerto cercano a Casa de Campo, recibe cruceros de lujo y medianos.</li>
               <li><strong>Santo Domingo</strong> (Puerto de Sans Souci / Don Diego) — en el corazón de la capital, junto a la Zona Colonial.</li>
               <li><strong>Samaná</strong> — puerto en la costa norte, popular en temporada de ballenas jorobadas.</li>
             </ul>
          </section>

          <section id="tiempo-limitado">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">El reto del tiempo limitado en puerto</h2>
            <p>La mayoría de escalas de crucero duran entre 6 y 10 horas, lo que hace prácticamente imposible pedir una entrega estándar de 24-48h y recibirla antes de zarpar de nuevo. Si sabes con anticipación que tu itinerario incluye RD y quieres asegurarte de tener lentes de repuesto, la mejor opción es <strong>pedir con antelación</strong> a una dirección donde te hospedarás antes o después del crucero (si vas a estar en un hotel previo o posterior a la salida del barco), o llevar suficiente cantidad desde casa para cubrir toda la duración del crucero.</p>
          </section>

          <section id="antes-o-despues">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Si te hospedas en RD antes o después del crucero</h2>
            <p>Muchos pasajeros llegan uno o dos días antes de embarcar, o se quedan después de desembarcar, especialmente si el crucero sale o termina en Santo Domingo o La Romana. En ese caso, ContactGo puede entregarte lentes de contacto directo a tu hotel en 24-48h antes de tu embarque o al llegar de tu crucero, cubriendo el resto de tu viaje o tu regreso a casa.</p>
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
            <a href="/blog/lentes-contacto-puerto-plata" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto en Puerto Plata</p><p className="text-xs text-gray-500 mt-0.5">Entrega en 24-48h</p></a>
            <a href="/blog/lentes-contacto-la-romana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes de contacto en La Romana</p><p className="text-xs text-gray-500 mt-0.5">Entrega a domicilio</p></a>
            <a href="/blog/contact-lenses-dominican-republic" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Contact Lenses in Dominican Republic</p><p className="text-xs text-gray-500 mt-0.5">Guía completa para turistas</p></a>
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
