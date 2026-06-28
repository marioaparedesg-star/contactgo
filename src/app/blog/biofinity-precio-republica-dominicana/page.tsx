export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biofinity precio en República Dominicana 2026 — ContactGo',
  description: 'Precio de Biofinity en RD: desde RD$4,750 la caja de 6 lentes. Biofinity Toric, Multifocal y XR disponibles. Originales CooperVision. Entrega 24-48h.',
  alternates: { canonical: 'https://www.contactgo.net/blog/biofinity-precio-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'Biofinity precio en República Dominicana 2026',
    description: 'Precio actual de todos los Biofinity en RD. Esférico, Toric, Multifocal y XR. Entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/biofinity-precio-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/biofinity-precio-rd.webp', width: 1200, height: 630, alt: 'Biofinity precio República Dominicana 2026' }],
  },
}

export default function Page() {
  const LINEA = [
    { nombre: 'Biofinity® 6u', tipo: 'Esférico mensual', precio: 4750, slug: 'biofinity-lentes-contacto-mensuales-coopervision-dominicana', tag: 'El más popular', color: 'bg-blue-600' },
    { nombre: 'Biofinity® XR 6u', tipo: 'Esférico alta graduación', precio: 5500, slug: 'biofinity-xr-lentes-contacto-alta-graduacion-esferica-dominicana', tag: 'Graduaciones XR', color: 'bg-indigo-600' },
    { nombre: 'Biofinity® Toric 6u', tipo: 'Tórico mensual', precio: 5750, slug: 'biofinity-toric-lentes-astigmatismo-coopervision-dominicana', tag: 'Astigmatismo', color: 'bg-purple-600' },
    { nombre: 'Biofinity® XR Toric 6u', tipo: 'Tórico alta graduación', precio: 12000, slug: 'biofinity-xr-toric-lentes-alta-graduacion-dominicana', tag: 'Astig. severo', color: 'bg-pink-600' },
    { nombre: 'Biofinity® Multifocal 6u', tipo: 'Multifocal mensual', precio: 9500, slug: 'biofinity-multifocal-lentes-presbicia-coopervision-dominicana', tag: 'Presbicia', color: 'bg-teal-600' },
  ]

  const FAQS = [
    { q: '¿Cuánto cuestan los Biofinity en República Dominicana?', a: 'En ContactGo los Biofinity esféricos cuestan RD$4,750 la caja de 6 lentes. La línea Biofinity incluye también Toric desde RD$5,750, XR desde RD$5,500, XR Toric desde RD$12,000 y Multifocal desde RD$9,500.' },
    { q: '¿Son los Biofinity buenos lentes de contacto?', a: 'Sí, Biofinity es una de las marcas más reconocidas de CooperVision. Son lentes mensuales de silicona hidrogel con tecnología Aquaform® que proporciona un Dk/t de 160, uno de los más altos del mercado, lo que significa excelente transmisión de oxígeno.' },
    { q: '¿Cuánto duran los lentes Biofinity?', a: 'Los Biofinity son lentes de reemplazo mensual — se usan hasta 30 días consecutivos y luego se descartan. Una caja de 6 lentes es suficiente para 3 meses de uso por un ojo (6 meses si es para un solo ojo).' },
    { q: '¿Biofinity sirve para astigmatismo?', a: 'No el Biofinity estándar, pero sí el Biofinity Toric, diseñado específicamente para corregir el astigmatismo. Disponible en ContactGo desde RD$5,750 la caja de 6 lentes, con entrega en 24-48h.' },
    { q: '¿Dónde comprar Biofinity originales en RD?', a: 'En ContactGo todos los Biofinity son 100% originales de CooperVision, sellados de fábrica. Entregamos en 24-48 horas en toda la República Dominicana con pago seguro mediante AZUL/Banco Popular.' },
    { q: '¿Biofinity o ACUVUE Oasys — cuál es mejor?', a: 'Depende del uso. Biofinity es mensual con mayor Dk/t (160 vs 147) y menor costo por día de uso. ACUVUE Oasys es quincenal, con tecnología HYDRACLEAR Plus ideal para pantallas. Para uso intensivo diario, Biofinity suele ser más económico. Para renovación frecuente, ACUVUE Oasys.' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Biofinity precio en República Dominicana 2026",
            "description": "Precio actualizado de toda la línea Biofinity (Esférico, Toric, XR, Multifocal) en República Dominicana.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-15", "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/biofinity-precio-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "ItemList",
            "name": "Precios Biofinity en República Dominicana",
            "itemListElement": LINEA.map((p, i) => ({
              "@type": "ListItem", "position": i + 1,
              "item": { "@type": "Product", "name": p.nombre, "brand": { "@type": "Brand", "name": "CooperVision" },
                "offers": { "@type": "Offer", "price": p.precio.toString(), "priceCurrency": "DOP",
                  "availability": "https://schema.org/InStock",
                  "url": `https://www.contactgo.net/producto/${p.slug}` } }
            })) },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Biofinity precio RD", "item": "https://www.contactgo.net/blog/biofinity-precio-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Biofinity precio RD</span>
        </div>

        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">💰 Guía de precios</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Biofinity® precio en República Dominicana — Guía completa 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Precios actualizados junio 2026 · Toda la línea Biofinity</p></div>
        </div>

        {/* Grid de precios de toda la línea */}
        <div className="space-y-3 mb-6">
          <h2 className="font-bold text-gray-900 text-lg">Precios de toda la línea Biofinity en RD</h2>
          {LINEA.map(({ nombre, tipo, precio, slug, tag, color }) => (
            <Link key={slug} href={`/producto/${slug}`}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 ${color} rounded-full shrink-0`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm">{nombre}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ${color} text-white rounded-full`}>{tag}</span>
                  </div>
                  <p className="text-xs text-gray-500">{tipo}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="font-black text-gray-900">RD${precio.toLocaleString()}</p>
                <p className="text-[11px] text-primary-600 font-semibold group-hover:underline">Ver →</p>
              </div>
            </Link>
          ))}
          <p className="text-xs text-gray-400 text-center">*Precios incluyen entrega a toda RD · Actualizados junio 2026</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-bold text-blue-800 mb-2">🚀 Entrega Biofinity en 24-48 horas</p>
          <p className="text-sm text-blue-700 mb-3">En Santo Domingo, Santiago y toda la República Dominicana. Pago seguro con AZUL/Banco Popular.</p>
          <div className="flex gap-2">
            <Link href="/marca/coopervision" className="flex-1 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center hover:bg-blue-700 transition-colors">Ver todos los Biofinity →</Link>
            <a href="https://wa.me/18294728328?text=Hola%2C%20quiero%20comprar%20Biofinity%20en%20RD" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center">Pedir por WhatsApp</a>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['precios','Todos los precios Biofinity'],['que-es','Qué son los lentes Biofinity'],['linea','La línea completa explicada'],['vs','Biofinity vs ACUVUE Oasys'],['aquaform','Tecnología Aquaform® de CooperVision'],['receta','Cómo saber cuál Biofinity necesitas'],['faq','Preguntas frecuentes']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Los <strong>Biofinity®</strong> de CooperVision son los lentes de contacto mensuales más vendidos en muchos países de América Latina — y con razón. En República Dominicana, cada vez más personas los eligen por su comodidad, transmisión de oxígeno superior y un precio competitivo por día de uso. Esta guía tiene todo lo que necesitas saber sobre los precios y versiones de Biofinity disponibles en RD.</p>

          <section id="que-es">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Qué son los lentes de contacto Biofinity</h2>
            <p>Biofinity es la línea premium de lentes de contacto mensuales de <strong>CooperVision</strong>, fabricados con el material patentado <strong>Comfilcon A</strong>, un tipo de silicona hidrogel de tercera generación que ofrece un Dk/t de 160 — uno de los más altos del mercado en lentes de reemplazo mensual.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Material', value: 'Comfilcon A (silicona hidrogel)' },
                { label: 'Reemplazo', value: 'Mensual (30 días)' },
                { label: 'Dk/t (oxígeno)', value: '160 — muy alto' },
                { label: 'Contenido de agua', value: '48%' },
                { label: 'Radio de curvatura', value: '8.6 mm' },
                { label: 'Diámetro', value: '14.0 mm' },
              ].map(({ label, value }, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="linea">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">La línea Biofinity explicada — ¿Cuál necesito?</h2>
            <div className="space-y-4">
              {[
                { nombre: 'Biofinity® Esférico', precio: 4750, para: 'Miopía e hipermetropía sin astigmatismo', rangos: 'SPH: +4.00 a -12.00', desc: 'El Biofinity estándar es para personas con miopía o hipermetropía que no tienen astigmatismo. Es el más popular y el más económico de la línea.', link: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana' },
                { nombre: 'Biofinity® XR', precio: 5500, para: 'Miopía o hipermetropía alta (XR = Extended Range)', rangos: 'SPH: +8.50 a +15.00 / -12.50 a -20.00', desc: 'Para personas con graduaciones muy altas que los lentes estándar no cubren. Si tu SPH es mayor de -12 o mayor de +4, probablemente necesitas la versión XR.', link: '/producto/biofinity-xr-lentes-contacto-alta-graduacion-esferica-dominicana' },
                { nombre: 'Biofinity® Toric', precio: 5750, para: 'Astigmatismo moderado', rangos: 'CYL: -0.75, -1.25, -1.75, -2.25', desc: 'Diseñado específicamente para el astigmatismo. El estabilizador de orientación Optimised Toric Lens Geometry (OTLG) de CooperVision mantiene el lente estable en el ojo para una visión nítida.', link: '/producto/biofinity-toric-lentes-astigmatismo-coopervision-dominicana' },
                { nombre: 'Biofinity® XR Toric', precio: 12000, para: 'Astigmatismo severo con alta graduación', rangos: 'CYL: -2.75 a -5.75', desc: 'Para personas con astigmatismo severo que el Biofinity Toric estándar no puede corregir. Es el lente más especializado de la línea.', link: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana' },
                { nombre: 'Biofinity® Multifocal', precio: 9500, para: 'Presbicia (vista cansada)', rangos: 'ADD: +1.00 a +4.00 en adición', desc: 'Para personas mayores de 40 años con presbicia que necesitan ver bien tanto de cerca como de lejos. Disponible en tres variantes de ADD: D, N y EN según el patrón de dominancia ocular.', link: '/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana' },
              ].map(({ nombre, precio, para, rangos, desc, link }) => (
                <div key={nombre} className="border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{nombre}</h3>
                    <span className="font-black text-blue-700 shrink-0">RD${precio.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold mb-1">✓ Para: {para}</p>
                  <p className="text-xs text-gray-500 mb-2">Rangos: {rangos}</p>
                  <p className="text-sm text-gray-600 mb-3">{desc}</p>
                  <Link href={link} className="inline-block text-xs bg-blue-600 text-white font-bold px-4 py-1.5 rounded-xl hover:bg-blue-700 transition-colors">Ver {nombre} →</Link>
                </div>
              ))}
            </div>
          </section>

          <section id="aquaform">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tecnología Aquaform® — Lo que diferencia a Biofinity</h2>
            <p>La tecnología <strong>Aquaform®</strong> de CooperVision es la razón por la que Biofinity puede tener un contenido de agua del 48% (relativamente alto para silicona hidrogel) y al mismo tiempo un Dk/t de 160 (muy alto). Normalmente más agua significa menos silicona y por lo tanto menos oxígeno — Aquaform resuelve ese compromiso.</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-sm">
              <p className="font-bold text-blue-900 mb-1">¿Qué significa Dk/t = 160 para ti?</p>
              <p className="text-blue-800">Un Dk/t de 160 significa que la córnea recibe prácticamente el mismo oxígeno que si no llevaras ningún lente. El mínimo recomendado por la FDA para uso diario es 24 Dk/t. Biofinity está muy por encima — lo que se traduce en ojos más sanos a largo plazo.</p>
            </div>
          </section>

          <section id="vs">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Biofinity vs ACUVUE Oasys — Comparativa directa</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-blue-700">Biofinity®</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-red-700">ACUVUE® Oasys®</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fabricante', 'CooperVision', 'Johnson & Johnson'],
                    ['Reemplazo', 'Mensual (30 días)', 'Quincenal (14 días)'],
                    ['Material', 'Comfilcon A', 'Senofilcon A'],
                    ['Dk/t (oxígeno)', '160 ⭐', '147'],
                    ['Agua', '48%', '38%'],
                    ['Precio en RD (6u)', 'RD$4,750', 'RD$3,875'],
                    ['Precio por día', '~RD$52 ⭐', '~RD$92'],
                    ['Disponible tórico', '✅ Biofinity Toric', '✅ Oasys Astig'],
                    ['Disponible multifocal', '✅ Biofinity Multi', '✅ Oasys Multi'],
                  ].map(([c, bio, acu], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{c}</td>
                      <td className="p-3 border border-gray-100 text-center text-blue-700">{bio}</td>
                      <td className="p-3 border border-gray-100 text-center text-red-700">{acu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mt-4 text-sm">
              <p className="font-bold text-gray-900 mb-1">💡 Cuándo elegir Biofinity</p>
              <p>Biofinity gana en <strong>mayor oxígeno (Dk/t 160)</strong> y <strong>menor costo por día (~RD$52)</strong>. Es la elección lógica si usas los lentes todo el día y quieres el máximo cuidado corneal al menor costo de uso.</p>
              <p className="mt-2">Elige ACUVUE Oasys si tu optometrista lo ha recomendado específicamente o prefieres el cambio quincenal por mayor higiene.</p>
            </div>
            <Link href="/blog/biofinity-vs-acuvue-comparacion" className="mt-3 inline-block text-xs text-primary-600 font-semibold hover:underline">→ Ver comparativa completa Biofinity vs ACUVUE</Link>
          </section>

          <section id="receta">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo saber qué Biofinity necesitas</h2>
            <p>Tu receta óptica te dirá exactamente qué Biofinity debes elegir:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Tu receta dice...</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Biofinity que necesitas</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Solo SPH (sin CYL/AXIS, SPH entre -12 y +4)', 'Biofinity® Esférico'],
                    ['Solo SPH con valor alto (SPH > +4 o < -12)', 'Biofinity® XR'],
                    ['SPH + CYL + AXIS (astigmatismo moderado)', 'Biofinity® Toric'],
                    ['SPH + CYL alto + AXIS (CYL > -2.25)', 'Biofinity® XR Toric'],
                    ['SPH + ADD (presbicia/vista cansada)', 'Biofinity® Multifocal'],
                  ].map(([receta, biofinity], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 text-gray-600">{receta}</td>
                      <td className="p-3 border border-gray-100 font-bold text-blue-700">{biofinity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm">¿Tienes dudas? Usa nuestra <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="text-primary-600 font-semibold hover:underline">calculadora de receta gratuita</a> o escríbenos por WhatsApp y te ayudamos a identificar el Biofinity correcto para tu prescripción.</p>
          </section>

          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900">Artículos relacionados</h3>
            {[
              { href: '/blog/biofinity-vs-acuvue-comparacion', titulo: '→ Biofinity vs ACUVUE Oasys — comparativa completa', desc: 'Cuál es mejor para ti' },
              { href: '/blog/lentes-astigmatismo-precio-republica-dominicana', titulo: '→ Lentes para astigmatismo precio en RD', desc: 'Todas las opciones tóricas' },
              { href: '/blog/lentes-multifocales-precio-republica-dominicana', titulo: '→ Lentes multifocales precio en RD', desc: 'Opciones para presbicia' },
              { href: '/blog/air-optix-hydraglyde-precio-republica-dominicana', titulo: '→ Air Optix HydraGlyde precio RD', desc: 'Otra opción mensual premium' },
              { href: '/blog/lentes-diarios-vs-mensuales', titulo: '→ Lentes diarios vs mensuales', desc: '¿Cuál tipo es para ti?' },
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
            <p>Los Biofinity son una de las mejores opciones de lentes de contacto mensuales disponibles en República Dominicana — y en ContactGo los encuentras en toda su línea: esférico, XR, Toric, XR Toric y Multifocal, con precios desde RD$4,750 y entrega en 24-48 horas.</p>
            <p className="mt-3">Su Dk/t de 160 y la tecnología Aquaform® los posicionan como uno de los lentes con mejor relación calidad-precio por día de uso disponibles en el mercado dominicano.</p>
          </section>
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <p className="font-bold text-gray-900 text-sm mb-0.5">Información verificada</p>
          <p className="text-gray-600 text-sm">Precios y especificaciones verificados por el Equipo ContactGo · Actualizado junio 2026</p>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Biofinity originales en tu puerta en 24-48h</h3>
          <p className="text-sm text-gray-600 mb-4">Toda la línea Biofinity disponible · CooperVision originales · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/marca/coopervision" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">Ver todos los Biofinity →</Link>
            <Link href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">Calcular mi receta</Link>
            <a href="https://wa.me/18294728328?text=Hola%2C%20quiero%20comprar%20Biofinity%20en%20Rep%C3%BAblica%20Dominicana" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
