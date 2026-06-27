export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Air Optix HydraGlyde precio en RD 2026 — ContactGo',
  description: 'Precio de Air Optix Plus HydraGlyde en República Dominicana. Disponibles desde RD$4,375. Entrega 24-48h. Originales de Alcon con garantía de autenticidad.',
  alternates: { canonical: 'https://www.contactgo.net/blog/air-optix-hydraglyde-precio-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'Air Optix HydraGlyde precio en República Dominicana 2026',
    description: 'Precio actual de Air Optix Plus HydraGlyde en RD. Entrega 24-48h. Originales de Alcon.',
    url: 'https://www.contactgo.net/blog/air-optix-hydraglyde-precio-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/air-optix-hydraglyde-precio-rd.webp', width: 1200, height: 630, alt: 'Air Optix HydraGlyde precio República Dominicana' }],
  },
}

export default function Page() {
  const PRECIOS = [
    { nombre: 'AIR OPTIX® plus HydraGlyde® Esférico 6u', precio: 4375, tipo: 'Mensual', link: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana' },
    { nombre: 'AIR OPTIX® plus HydraGlyde® Multifocal 6u', precio: 7250, tipo: 'Mensual', link: '/producto/air-optix-hydraglyde-multifocal-lentes-presbicia-dominicana' },
    { nombre: 'AIR OPTIX® COLORS 2u', precio: 2625, tipo: 'Mensual', link: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
  ]

  const FAQS = [
    { q: '¿Cuánto cuestan los Air Optix HydraGlyde en República Dominicana?', a: 'En ContactGo los Air Optix Plus HydraGlyde esféricos cuestan RD$4,375 la caja de 6 lentes. La versión Multifocal está disponible desde RD$7,250.' },
    { q: '¿Dónde comprar Air Optix HydraGlyde originales en RD?', a: 'ContactGo los ofrece 100% originales de Alcon con entrega en 24-48 horas en toda República Dominicana. Pago seguro con AZUL/Banco Popular.' },
    { q: '¿Air Optix HydraGlyde es bueno para ojos secos?', a: 'Sí. La tecnología HydraGlyde® de Alcon incorpora una capa molecular de lubricante en la superficie del lente que mantiene la hidratación hasta 16 horas de uso continuo, ideal para personas con ojos secos moderados.' },
    { q: '¿Cuánto tiempo dura un lente Air Optix HydraGlyde?', a: 'Son lentes de reemplazo mensual — se usan máximo 30 días y luego se descartan. Con uso diario de 8 horas, una caja de 6 lentes dura aproximadamente 3 meses por ojo.' },
    { q: '¿Air Optix HydraGlyde sirve para astigmatismo?', a: 'La línea regular (esférico) no corrige astigmatismo. Para astigmatismo, Alcon ofrece Air Optix Astig, aunque en ContactGo disponemos de otras marcas tóricas como Biofinity Toric y ACUVUE Oasys Astig.' },
    { q: '¿Cuánto oxígeno transmiten los Air Optix HydraGlyde?', a: 'Los Air Optix HydraGlyde están fabricados con Lotrafilcon B, un material de silicona hidrogel con un Dk/t de 138. Esto significa que transmiten suficiente oxígeno para un uso cómodo de hasta 16 horas diarias.' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Air Optix HydraGlyde precio en República Dominicana 2026",
            "description": "Precio actual, disponibilidad y guía completa de Air Optix Plus HydraGlyde en RD.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-15", "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/air-optix-hydraglyde-precio-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "Product",
            "name": "AIR OPTIX® plus HydraGlyde®",
            "brand": { "@type": "Brand", "name": "Alcon" },
            "description": "Lentes de contacto mensuales de silicona hidrogel con tecnología HydraGlyde para máxima hidratación",
            "offers": { "@type": "Offer", "price": "4375", "priceCurrency": "DOP",
              "availability": "https://schema.org/InStock",
              "seller": { "@type": "Organization", "name": "ContactGo" },
              "url": "https://www.contactgo.net/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" } },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Air Optix HydraGlyde precio RD", "item": "https://www.contactgo.net/blog/air-optix-hydraglyde-precio-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Air Optix HydraGlyde precio RD</span>
        </div>

        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">💰 Guía de precios</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Air Optix® plus HydraGlyde® — Precio en República Dominicana 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Precios actualizados junio 2026 · Entrega en toda RD</p>
          </div>
        </div>

        {/* Precio destacado */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-5 mb-6">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">Precio actual en ContactGo</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900">RD$4,375</span>
            <span className="text-gray-500 text-sm">caja de 6 lentes</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">≈ RD$729 por lente · Lente mensual por ojo</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Link href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana"
              className="flex-1 bg-teal-600 text-white font-bold px-5 py-3 rounded-xl text-sm text-center hover:bg-teal-700 transition-colors">
              Comprar Air Optix HydraGlyde →
            </Link>
            <a href="https://wa.me/18294728328?text=Hola%2C%20quiero%20comprar%20Air%20Optix%20HydraGlyde%20en%20RD"
              target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl text-sm text-center hover:bg-[#20ba58] transition-colors">
              Pedir por WhatsApp
            </a>
          </div>
          <p className="text-[11px] text-center text-gray-400 mt-2">✅ Originales de Alcon · Entrega 24-48h · Pago con AZUL/Banco Popular</p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['precios','Precios actualizados de Air Optix en RD'],['que-es','Qué son los Air Optix HydraGlyde'],['tecnologia','Tecnología HydraGlyde — por qué importa'],['para-quien','¿Para quién son ideales?'],['vs','Air Optix vs ACUVUE Oasys — comparativa'],['como-comprar','Cómo comprar en RD con entrega a domicilio'],['faq','Preguntas frecuentes']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Los <strong>Air Optix® plus HydraGlyde®</strong> de Alcon son uno de los lentes de contacto mensuales más recomendados a nivel mundial — y en República Dominicana cada vez más personas los eligen como su lente de uso diario. En este artículo encontrarás el precio actual en RD, todas las versiones disponibles y cómo recibirlos en tu puerta en 24-48 horas.</p>

          <section id="precios">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Precios de Air Optix HydraGlyde en República Dominicana</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-teal-50">
                    <th className="p-3 text-left border border-gray-100 font-bold text-gray-900">Producto</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-gray-900">Tipo</th>
                    <th className="p-3 text-right border border-gray-100 font-bold text-teal-700">Precio RD$</th>
                  </tr>
                </thead>
                <tbody>
                  {PRECIOS.map(({ nombre, precio, tipo, link }, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100">
                        <Link href={link} className="font-medium text-primary-600 hover:underline">{nombre}</Link>
                      </td>
                      <td className="p-3 border border-gray-100 text-center text-gray-500">{tipo}</td>
                      <td className="p-3 border border-gray-100 text-right font-black text-gray-900">RD${precio.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">*Precios en ContactGo, incluyen entrega a toda República Dominicana. Actualizados junio 2026.</p>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
              <p className="font-bold text-green-800 mb-1">🚀 Entrega en 24-48 horas</p>
              <p className="text-green-700">En Santo Domingo, Santiago y principales ciudades. Para otras zonas del país, consultar tiempos en el proceso de compra.</p>
            </div>
          </section>

          <section id="que-es">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Qué son los Air Optix® plus HydraGlyde®?</h2>
            <p>Los Air Optix plus HydraGlyde son lentes de contacto <strong>mensuales de silicona hidrogel</strong> fabricados por Alcon, una de las principales empresas de salud ocular del mundo. Son la evolución de la línea Air Optix original, con una mejora fundamental: la tecnología HydraGlyde® que mantiene los lentes hidratados y suaves durante todo el día.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Material', value: 'Lotrafilcon B (silicona hidrogel)' },
                { label: 'Reemplazo', value: 'Mensual (30 días)' },
                { label: 'Transmisión O₂', value: 'Dk/t = 138' },
                { label: 'Contenido de agua', value: '33%' },
                { label: 'Radio de curvatura', value: '8.6 mm' },
                { label: 'Diámetro', value: '14.2 mm' },
              ].map(({ label, value }, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="tecnologia">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tecnología HydraGlyde® — por qué hace la diferencia</h2>
            <p>La razón principal por la que tantas personas eligen los Air Optix HydraGlyde sobre otras marcas es su tecnología exclusiva de hidratación. El <strong>recubrimiento HydraGlyde®</strong> es una capa molecular de polimerización controlada que se une permanentemente a la superficie del lente — no es solo un lubricante que se va lavando durante el día.</p>
            <div className="space-y-3 mt-4">
              {[
                { icono: '💧', titulo: 'Hidratación que dura todo el día', desc: 'El recubrimiento HydraGlyde retiene el agua en la superficie del lente durante hasta 16 horas de uso continuo, incluso en ambientes secos o con aire acondicionado.' },
                { icono: '🌬️', titulo: 'Alta transmisión de oxígeno', desc: 'Con un Dk/t de 138, los Air Optix HydraGlyde dejan pasar una cantidad importante de oxígeno a la córnea, esencial para la salud ocular en uso prolongado.' },
                { icono: '🛡️', titulo: 'Resistencia a depósitos', desc: 'La tecnología SmartShield® protege la superficie del lente contra la acumulación de depósitos lipídicos y proteicos, manteniendo la visión nítida más tiempo.' },
                { icono: '👁️', titulo: 'Compatible con muchas graduaciones', desc: 'Disponible en un amplio rango de poderes esféricos, desde +6.00 hasta -10.00, cubriendo la mayoría de graduaciones de miopía e hipermetropía.' },
              ].map(({ icono, titulo, desc }, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl shrink-0">{icono}</span>
                  <div><p className="font-bold text-gray-900 text-sm">{titulo}</p><p className="text-xs text-gray-600 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section id="para-quien">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Para quién son ideales los Air Optix HydraGlyde?</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="border border-green-100 rounded-xl p-4 bg-green-50/30">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">✅ Son ideales si...</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  {['Usas lentes 8+ horas al día','Trabajas frente a pantallas (computadora, celular)','Tienes tendencia a ojos secos moderados','Prefieres un lente mensual (más económico)','Estás en entornos con aire acondicionado','Tienes miopía o hipermetropía sin astigmatismo'].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5"><span className="text-green-500">✓</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/30">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">⚠️ Considera otra opción si...</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  {['Tienes astigmatismo (necesitas lente tórico)','Tienes presbicia (necesitas lente multifocal)','Prefieres descartar lentes cada día (opta por diarios)','Tu ojos secos son severos (consulta tu optometrista)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5"><span className="text-amber-500">→</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="vs">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Air Optix HydraGlyde vs ACUVUE Oasys — ¿Cuál elegir?</h2>
            <p>Estos son los dos lentes de silicona hidrogel mensuales/quincenales más populares en República Dominicana. Aquí la comparativa real:</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-teal-700">Air Optix HydraGlyde</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-red-700">ACUVUE Oasys</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fabricante', 'Alcon', 'Johnson & Johnson'],
                    ['Reemplazo', '30 días', '14 días (quincenal)'],
                    ['Material', 'Lotrafilcon B', 'Senofilcon A'],
                    ['Dk/t (oxígeno)', '138', '147'],
                    ['Tecnología', 'HydraGlyde + SmartShield', 'HYDRACLEAR Plus'],
                    ['Precio en RD', 'RD$4,375 (6u)', 'RD$3,875 (6u)'],
                    ['Precio por día de uso', '~RD$73', '~RD$92'],
                    ['Mejor para', 'Uso diario extendido, pantallas', 'Sensibilidad, cambio frecuente'],
                  ].map(([c, ao, ac], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{c}</td>
                      <td className="p-3 border border-gray-100 text-center text-teal-700">{ao}</td>
                      <td className="p-3 border border-gray-100 text-center text-red-700">{ac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mt-4 text-sm">
              <p className="font-bold text-gray-900 mb-1">💡 Veredicto rápido</p>
              <p><strong>Elige Air Optix HydraGlyde</strong> si usas los lentes todo el día, trabajas con pantallas o prefieres el menor costo por día de uso con un lente mensual.</p>
              <p className="mt-2"><strong>Elige ACUVUE Oasys</strong> si prefieres cambiar el lente más frecuentemente (cada 2 semanas) o si tu optometrista específicamente lo ha recomendado.</p>
            </div>
            <Link href="/blog/acuvue-oasys-vs-air-optix-hydraglyde" className="mt-3 inline-block text-xs text-primary-600 font-semibold hover:underline">→ Ver comparativa completa ACUVUE Oasys vs Air Optix HydraGlyde</Link>
          </section>

          <section id="como-comprar">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo comprar Air Optix HydraGlyde en República Dominicana</h2>
            <p>En ContactGo los Air Optix HydraGlyde están disponibles para entrega en 24-48 horas en toda la República Dominicana. El proceso es simple:</p>
            <div className="space-y-3 mt-4">
              {[
                { paso: '1', titulo: 'Ten tu receta a mano', desc: 'Necesitas el valor de SPH (poder esférico). Los Air Optix HydraGlyde tienen radio de curvatura (BC) estándar de 8.6mm y diámetro 14.2mm.' },
                { paso: '2', titulo: 'Selecciona tu producto', desc: 'Busca "Air Optix HydraGlyde" en nuestro catálogo o haz clic en el botón de arriba para ir directamente al producto.' },
                { paso: '3', titulo: 'Elige tu graduación', desc: 'Ingresa el SPH de cada ojo según tu receta. Para dos ojos con diferente graduación, puedes seleccionarla individualmente.' },
                { paso: '4', titulo: 'Paga con AZUL', desc: 'Pago seguro con tarjeta de crédito/débito a través de AZUL/Banco Popular. El proceso es 100% seguro.' },
                { paso: '5', titulo: 'Recibe en 24-48h', desc: 'Te contactamos para coordinar la entrega. Santo Domingo y Santiago: entrega en 24h. Resto del país: 24-48h.' },
              ].map(({ paso, titulo, desc }) => (
                <div key={paso} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">{paso}</div>
                  <div><p className="font-bold text-gray-900 text-sm">{titulo}</p><p className="text-xs text-gray-600">{desc}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <p className="font-bold text-blue-800 mb-1">¿No tienes tu receta? Sin problema</p>
              <p className="text-blue-700">Usa nuestra <Link href="/receta" className="font-bold hover:underline">calculadora gratuita de receta</Link> — ingresa tu prescripción de gafas y te ayudamos a encontrar el Air Optix más compatible.</p>
            </div>
          </section>

          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900">Artículos relacionados</h3>
            {[
              { href: '/blog/acuvue-oasys-vs-air-optix-hydraglyde', titulo: '→ ACUVUE Oasys vs Air Optix HydraGlyde', desc: 'Comparativa completa para elegir' },
              { href: '/blog/acuvue-oasys-precio-republica-dominicana', titulo: '→ ACUVUE Oasys precio en RD', desc: 'Precios actualizados 2026' },
              { href: '/blog/biofinity-precio-republica-dominicana', titulo: '→ Biofinity precio en RD', desc: 'Otra opción mensual premium' },
              { href: '/blog/lentes-diarios-vs-mensuales', titulo: '→ Lentes diarios vs mensuales', desc: '¿Cuál es la mejor opción para ti?' },
              { href: '/marca/alcon', titulo: '→ Todos los productos Alcon en ContactGo', desc: 'Air Optix, COLORS, Multifocal' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>

          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                    {q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Conclusión</h2>
            <p>Los Air Optix® plus HydraGlyde® son una excelente elección para usuarios de lentes de contacto mensuales en República Dominicana. A RD$4,375 la caja de 6 lentes, son una opción competitiva que ofrece tecnología de hidratación avanzada, alta transmisión de oxígeno y resistencia a depósitos — todo lo que necesitas para un uso diario cómodo.</p>
            <p className="mt-3">En ContactGo los encuentras 100% originales de Alcon, con entrega en 24-48 horas en toda la República Dominicana. ¿Tienes dudas sobre si son el lente correcto para ti? Escríbenos por WhatsApp.</p>
          </section>
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <p className="font-bold text-gray-900 text-sm mb-0.5">Información verificada</p>
          <p className="text-gray-600 text-sm">Precios y disponibilidad verificados por el Equipo ContactGo · Actualizado junio 2026</p>
        </div>

        <div className="mt-8 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Air Optix HydraGlyde — en tu puerta en 24h</h3>
          <p className="text-sm text-gray-600 mb-4">100% originales de Alcon · Sellados de fábrica · Entrega en toda República Dominicana</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm">
              Comprar Air Optix HydraGlyde →
            </Link>
            <Link href="/marca/alcon"
              className="inline-flex items-center justify-center gap-2 bg-white border border-teal-200 text-teal-700 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm">
              Ver toda la línea Alcon
            </Link>
            <a href="https://wa.me/18294728328?text=Hola%2C%20quiero%20comprar%20Air%20Optix%20HydraGlyde"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
