export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ACUVUE Oasys Astigmatism precio en RD 2026 — ContactGo',
  description: 'Precio de ACUVUE Oasys for Astigmatism en República Dominicana: RD$6,250 la caja de 6. También 1-DAY ACUVUE Moist Astig. Entrega 24-48h. Originales J&J.',
  alternates: { canonical: 'https://www.contactgo.net/blog/acuvue-oasys-for-astigmatism-precio-rd' },
  openGraph: {
    type: 'article',
    title: 'ACUVUE Oasys for Astigmatism precio República Dominicana',
    description: 'Precio y disponibilidad de ACUVUE Oasys for Astigmatism en RD. Entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/acuvue-oasys-for-astigmatism-precio-rd',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/acuvue-oasys-astigmatism-precio-rd.webp', width: 1200, height: 630, alt: 'ACUVUE Oasys for Astigmatism precio República Dominicana' }],
  },
}

export default function Page() {
  const PRODUCTOS = [
    { nombre: 'ACUVUE® OASYS® for Astigmatism 6u', precio: 6250, tipo: 'Quincenal tórico', slug: 'acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', tag: '⭐ Más recomendado' },
    { nombre: '1-DAY ACUVUE® MOIST® for Astigmatism 30u', precio: 6250, tipo: 'Diario tórico', slug: 'acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', tag: 'Máxima higiene' },
  ]

  const FAQS = [
    { q: '¿Cuánto cuestan los ACUVUE Oasys for Astigmatism en RD?', a: 'En ContactGo el ACUVUE Oasys for Astigmatism cuesta RD$6,250 la caja de 6 lentes (uso quincenal). El 1-DAY ACUVUE Moist for Astigmatism también está disponible a RD$6,250 la caja de 30 lentes.' },
    { q: '¿Qué es el ACUVUE Oasys for Astigmatism?', a: 'Es un lente de contacto quincenal diseñado específicamente para personas con astigmatismo. Combina la tecnología HYDRACLEAR® Plus con el sistema BLINK STABILISED® que mantiene el lente orientado correctamente con cada parpadeo para una visión nítida constante.' },
    { q: '¿Sirve el ACUVUE Oasys normal para el astigmatismo?', a: 'No. El ACUVUE Oasys estándar es para miopía e hipermetropía sin astigmatismo. Para astigmatismo necesitas específicamente el ACUVUE Oasys for Astigmatism o el 1-DAY ACUVUE Moist for Astigmatism.' },
    { q: '¿Cuántos cilindros corrige el ACUVUE Oasys for Astigmatism?', a: 'El ACUVUE Oasys for Astigmatism está disponible en CYL de -0.75, -1.25, -1.75 y -2.25. Para cilindros mayores (-2.75 o más), otras opciones como Biofinity XR Toric pueden ser más adecuadas.' },
    { q: '¿Cómo sé si necesito lentes tóricos?', a: 'Si tu receta tiene valores de CYL (cilindro) y AXIS (eje), entonces tienes astigmatismo y necesitas lentes tóricos. Puedes verificarlo con nuestra calculadora de receta gratuita.' },
    { q: '¿Dónde comprar ACUVUE Oasys for Astigmatism en República Dominicana?', a: 'ContactGo ofrece el ACUVUE Oasys for Astigmatism y el 1-DAY ACUVUE Moist for Astigmatism con entrega en 24-48 horas en toda la República Dominicana. Son 100% originales de Johnson & Johnson.' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "ACUVUE Oasys for Astigmatism precio en República Dominicana 2026",
            "description": "Precio y guía completa de ACUVUE Oasys for Astigmatism y 1-DAY ACUVUE Moist for Astigmatism en RD.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-15", "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/acuvue-oasys-for-astigmatism-precio-rd", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "ACUVUE Oasys Astigmatism precio RD", "item": "https://www.contactgo.net/blog/acuvue-oasys-for-astigmatism-precio-rd" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">ACUVUE Oasys Astigmatism precio</span>
        </div>

        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">💰 Precios · Astigmatismo</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          ACUVUE® Oasys® for Astigmatism — Precio en RD 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en lentes tóricos · Actualizado junio 2026</p></div>
        </div>

        {/* Precios destacados */}
        <div className="space-y-3 mb-6">
          {PRODUCTOS.map(({ nombre, precio, tipo, slug, tag }) => (
            <Link key={slug} href={`/producto/${slug}`}
              className="flex items-center justify-between p-4 border-2 border-red-100 rounded-2xl hover:border-red-300 hover:shadow-sm transition-all bg-red-50/20 group">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 text-sm">{nombre}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full">{tag}</span>
                </div>
                <p className="text-xs text-gray-500">{tipo} · Johnson & Johnson</p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="font-black text-gray-900">RD${precio.toLocaleString()}</p>
                <p className="text-[11px] text-primary-600 font-semibold group-hover:underline">Comprar →</p>
              </div>
            </Link>
          ))}
          <p className="text-xs text-gray-400 text-center">Entrega 24-48h en toda RD · 100% originales J&J · Actualizados junio 2026</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Link href="/toricos" className="flex-1 bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center hover:bg-red-700 transition-colors">Ver todos los lentes tóricos →</Link>
          <a href="/contacto?text=Hola%2C%20quiero%20ACUVUE%20Oasys%20for%20Astigmatism%20en%20RD" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center">Pedir por WhatsApp</a>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['que-es','Qué es el ACUVUE Oasys for Astigmatism'],['oasys-vs-1day','¿Quincenal o diario? Las dos opciones'],['tecnologia','Tecnología BLINK STABILISED®'],['receta','Cómo saber si lo necesitas'],['comparativa','Vs otras marcas tóricas en RD'],['faq','Preguntas frecuentes']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Si tu receta tiene valores de <strong>CYL (cilindro) y AXIS (eje)</strong>, tienes astigmatismo — y necesitas un lente de contacto tórico. El <strong>ACUVUE® Oasys® for Astigmatism</strong> de Johnson & Johnson es uno de los más recomendados a nivel mundial para esta condición. En este artículo encontrarás el precio actual en República Dominicana, las opciones disponibles y todo lo que necesitas para tomar la mejor decisión.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
            <p className="font-bold text-amber-800 mb-1">💡 ¿Tienes astigmatismo?</p>
            <p className="text-amber-700">Si tu receta tiene los valores <strong>CYL</strong> y <strong>AXIS</strong>, necesitas lentes <strong>tóricos</strong>. Los lentes esféricos normales no corregirán tu visión correctamente. Los lentes tóricos están diseñados para mantenerse estables y orientados correctamente en el ojo.</p>
          </div>

          <section id="que-es">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Qué es el ACUVUE Oasys for Astigmatism</h2>
            <p>El <strong>ACUVUE® Oasys® for Astigmatism</strong> es el lente de contacto tórico quincenal de Johnson & Johnson. Combina la tecnología de hidratación HYDRACLEAR® Plus (la misma del ACUVUE Oasys estándar) con el sistema patentado <strong>BLINK STABILISED®</strong> de estabilización del lente para astigmatismo.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Material', value: 'Senofilcon A' },
                { label: 'Reemplazo', value: 'Quincenal (14 días)' },
                { label: 'Dk/t', value: '147' },
                { label: 'Radio base', value: '8.6 mm' },
                { label: 'Cilindros', value: '-0.75, -1.25, -1.75, -2.25' },
                { label: 'Ejes', value: '10° a 180° (10° en 10°)' },
              ].map(({ label, value }, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="oasys-vs-1day">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿ACUVUE Oasys o 1-DAY ACUVUE Moist for Astigmatism?</h2>
            <p>Ambos están diseñados para astigmatismo con la misma tecnología BLINK STABILISED®. La diferencia es el período de reemplazo:</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-red-700">Oasys Astig</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-blue-700">1-DAY Moist Astig</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Reemplazo', 'Quincenal (14 días)', 'Diario (1 día)'],
                    ['Presentación', '6 lentes por caja', '30 lentes por caja'],
                    ['Precio en RD', 'RD$6,250', 'RD$6,250'],
                    ['Precio por día', '~RD$148', '~RD$208'],
                    ['Requiere solución', 'Sí', 'No'],
                    ['Higiene', 'Buena', 'Máxima'],
                    ['Ideal para', 'Uso diario regular', 'Uso ocasional o alergias'],
                  ].map(([c, v1, v2], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{c}</td>
                      <td className="p-3 border border-gray-100 text-center text-red-700">{v1}</td>
                      <td className="p-3 border border-gray-100 text-center text-blue-700">{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mt-4 text-sm">
              <p className="font-bold text-gray-900 mb-1">💡 ¿Cuál elegir?</p>
              <p>Si usas lentes todos los días y quieres un menor costo por día: <strong>ACUVUE Oasys for Astigmatism</strong>. Si usas lentes ocasionalmente o tienes alergias y prefieres máxima higiene: <strong>1-DAY ACUVUE Moist for Astigmatism</strong>.</p>
            </div>
          </section>

          <section id="tecnologia">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tecnología BLINK STABILISED® — Qué hace diferente a este lente</h2>
            <p>El desafío único de los lentes tóricos es mantener la orientación correcta del cilindro en el ojo. Si el lente rota, la visión se vuelve borrosa. El sistema <strong>BLINK STABILISED®</strong> de Johnson & Johnson resuelve esto de manera elegante.</p>
            <div className="space-y-3 mt-4">
              {[
                { titulo: 'Zonas de estabilización en 3 y 9', desc: 'En lugar de usar zonas gruesas en la parte inferior para "anclar" el lente (como hacen algunos competidores), BLINK STABILISED usa zonas de bajo perfil en las 3 y 9 del lente que interactúan con el párpado para mantener la orientación.' },
                { titulo: 'Se adapta a cada parpadeo', desc: 'Con cada parpadeo, el lente se reorienta automáticamente a su posición correcta en milisegundos. Esto significa visión nítida constante sin el borroneo temporal que pueden causar otros diseños.' },
                { titulo: 'Más cómodo que el diseño tradicional', desc: 'Al no requerir zonas gruesas de lastre (balasto), el lente BLINK STABILISED es más delgado y cómodo en zonas clave del párpado.' },
              ].map(({ titulo, desc }, i) => (
                <div key={i} className="p-4 bg-red-50/30 border border-red-100 rounded-xl">
                  <p className="font-bold text-gray-900 text-sm mb-1">✓ {titulo}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="receta">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo saber si necesitas lentes tóricos</h2>
            <p>Si tu receta tiene estos valores, necesitas lentes tóricos:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-3 font-mono text-sm">
              <p className="text-gray-500 text-xs mb-2">Ejemplo de receta con astigmatismo:</p>
              <p><strong>OD (ojo derecho):</strong> SPH -2.50 / CYL -1.25 / AXIS 90°</p>
              <p className="mt-1"><strong>OI (ojo izquierdo):</strong> SPH -3.00 / CYL -0.75 / AXIS 180°</p>
            </div>
            <p className="mt-3 text-sm">Si ves <strong>CYL y AXIS</strong> en tu receta, necesitas lentes tóricos. El ACUVUE Oasys for Astigmatism cubre CYL de -0.75 a -2.25. ¿Tu CYL es mayor? Consulta el <Link href="/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana" className="text-primary-600 hover:underline">Biofinity XR Toric</Link> o escríbenos por WhatsApp.</p>
          </section>

          <section id="comparativa">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Comparativa de lentes tóricos disponibles en ContactGo</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Producto</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Precio</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Tipo</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">CYL máx.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nombre: 'ACUVUE Oasys for Astig.', precio: 'RD$6,250', tipo: 'Quincenal', cyl: '-2.25', slug: 'acuvue-oasys-for-astigmatism-lentes-toricos-dominicana' },
                    { nombre: '1-DAY ACUVUE Moist Astig.', precio: 'RD$6,250', tipo: 'Diario', cyl: '-1.75', slug: 'acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana' },
                    { nombre: 'Biofinity® Toric', precio: 'RD$5,750', tipo: 'Mensual', cyl: '-2.25', slug: 'biofinity-toric-lentes-astigmatismo-coopervision-dominicana' },
                    { nombre: 'clariti® 1 day toric', precio: 'RD$5,750', tipo: 'Diario', cyl: '-1.75', slug: 'clariti-1-day-toric-lentes-contacto-diarios-astigmatismo-dominicana' },
                    { nombre: 'Avaira Vitality® Toric', precio: 'RD$4,875', tipo: 'Mensual', cyl: '-2.25', slug: 'avaira-vitality-toric-lentes-astigmatismo-dominicana' },
                    { nombre: 'Biofinity® XR Toric', precio: 'RD$12,000', tipo: 'Mensual', cyl: '-5.75', slug: 'biofinity-xr-toric-lentes-alta-graduacion-dominicana' },
                  ].map(({ nombre, precio, tipo, cyl, slug }, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100">
                        <Link href={`/producto/${slug}`} className="text-primary-600 hover:underline font-medium">{nombre}</Link>
                      </td>
                      <td className="p-3 border border-gray-100 text-center font-bold">{precio}</td>
                      <td className="p-3 border border-gray-100 text-center text-gray-500">{tipo}</td>
                      <td className="p-3 border border-gray-100 text-center">{cyl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900">Artículos relacionados</h3>
            {[
              { href: '/toricos', titulo: '→ Ver todos los lentes tóricos disponibles', desc: 'Todos los productos para astigmatismo' },
              { href: '/blog/lentes-astigmatismo-precio-republica-dominicana', titulo: '→ Lentes para astigmatismo en RD — Guía de precios', desc: 'Comparativa completa de todas las opciones' },
              { href: '/blog/acuvue-oasys-precio-republica-dominicana', titulo: '→ ACUVUE Oasys precio en RD', desc: 'Para miopía/hipermetropía sin astigmatismo' },
              { href: '/blog/como-leer-receta-optica-rd', titulo: '→ Cómo leer tu receta óptica', desc: 'SPH, CYL, AXIS — qué significa cada valor' },
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
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <p className="font-bold text-gray-900 text-sm mb-0.5">Información verificada</p>
          <p className="text-gray-600 text-sm">Precios y especificaciones verificados por el Equipo ContactGo · Actualizado junio 2026</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900">
          <strong>⚠️ Aviso médico:</strong> Los lentes de contacto tóricos requieren prescripción específica de un optometrista u oftalmólogo. Asegúrate de tener tu receta actualizada antes de comprar.
        </div>

        <div className="mt-10 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Lentes para astigmatismo en tu puerta en 24h</h3>
          <p className="text-sm text-gray-600 mb-4">ACUVUE Oasys y 1-DAY MOIST for Astigmatism originales de J&J · Toda la línea tórica disponible</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/toricos" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm">Ver lentes tóricos →</Link>
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-700 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="/contacto?text=Hola%2C%20quiero%20ACUVUE%20Oasys%20for%20Astigmatism%20en%20RD" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
