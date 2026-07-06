export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto para astigmatismo en RD — Precios 2026',
  description: 'Los mejores lentes tóricos para astigmatismo en República Dominicana. Precios actualizados, guía de marcas y entrega en 24-48h. ACUVUE, Biofinity, Air Optix.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-para-astigmatismo' },
  openGraph: {
    type: 'article',
    title: 'Lentes de contacto para astigmatismo en RD 2026',
    description: 'Guía completa de lentes tóricos para astigmatismo en República Dominicana. Precios, comparativas y entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-para-astigmatismo',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-astigmatismo-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto para astigmatismo República Dominicana precios 2026' }],
  },
}

export default function Page() {
  const productos = [
    { nombre: 'ACUVUE Oasys for Astigmatism 6u', freq: 'Quincenal', precio: 6250, link: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana' },
    { nombre: '1-DAY ACUVUE Moist for Astigmatism 30u', freq: 'Diario', precio: 6250, link: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana' },
    { nombre: 'Biofinity Toric 6u', freq: 'Mensual', precio: 5750, link: '/producto/biofinity-toric-lentes-astigmatismo-coopervision-dominicana' },
    { nombre: 'Biofinity XR Toric 6u', freq: 'Mensual', precio: 12000, link: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana' },
    { nombre: 'clariti 1 day toric 30u', freq: 'Diario', precio: 5750, link: '/producto/clariti-1-day-toric-lentes-contacto-diarios-astigmatismo-dominicana' },
    { nombre: 'Avaira Vitality Toric 6u', freq: 'Mensual', precio: 4875, link: '/producto/avaira-vitality-toric-lentes-astigmatismo-dominicana' },
    { nombre: 'BL ULTRA for Astigmatism 6u', freq: 'Mensual', precio: 4000, link: '/producto/bausch-lomb-ultra-astigmatism-lentes-toricos-dominicana' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Lentes de contacto para astigmatismo en República Dominicana — Precios 2026",
            "description": "Guía completa de lentes tóricos para astigmatismo disponibles en RD con precios actualizados.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/lentes-contacto-para-astigmatismo",
            "inLanguage": "es-DO"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Qué son los lentes de contacto para astigmatismo?", "acceptedAnswer": { "@type": "Answer", "text": "Son lentes tóricos, un tipo especial de lentes de contacto diseñados para corregir el astigmatismo. Tienen una forma diferente a los lentes esféricos y un sistema de estabilización que los mantiene en la orientación correcta sobre el ojo." } },
              { "@type": "Question", "name": "¿Cuánto cuestan los lentes para astigmatismo en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "En ContactGo los lentes tóricos van desde RD$4,000 (BL Ultra Astigmatismo) hasta RD$12,000 (Biofinity XR para alta graduación). Los más populares como ACUVUE Oasys for Astigmatism y Biofinity Toric están en RD$5,750-6,250." } },
              { "@type": "Question", "name": "¿Cómo sé si tengo astigmatismo en mi receta?", "acceptedAnswer": { "@type": "Answer", "text": "Mira tu receta: si tiene un valor CYL (cilindro) diferente de 0 y un valor AXIS (eje), tienes astigmatismo y necesitas lentes tóricos. Si solo tienes SPH, tus lentes son esféricos normales." } },
              { "@type": "Question", "name": "¿Los lentes para astigmatismo son más caros?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, generalmente cuestan entre 20-40% más que los esféricos equivalentes, porque su diseño y fabricación es más compleja. Pero en ContactGo los precios son competitivos con entrega incluida en 24-48h." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes para astigmatismo RD", "item": "https://www.contactgo.net/blog/lentes-contacto-para-astigmatismo" }
            ]
          }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Lentes para astigmatismo RD</span>
        </div>

        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Tóricos · Precios 2026</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Lentes de contacto para astigmatismo en RD — Precios y guía 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Especialistas en salud visual · Precios actualizados junio 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
          <span>📅 Actualizado: junio 2026</span>
          <span>·</span>
          <span>⏱ 8 min lectura</span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            <li key="0"><a href="#precios" className="text-primary-600 hover:underline">Todos los precios tóricos</a></li>
            <li key="1"><a href="#que-es" className="text-primary-600 hover:underline">¿Qué lente necesito?</a></li>
            <li key="2"><a href="#marcas" className="text-primary-600 hover:underline">Marcas disponibles en ContactGo</a></li>
            <li key="3"><a href="#receta" className="text-primary-600 hover:underline">Tu receta y los tóricos</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </div>

        {/* Quick answer */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 mb-8">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Respuesta directa</p>
          <p className="text-sm text-gray-700">Los lentes de contacto para astigmatismo en República Dominicana van desde <strong className="text-purple-700">RD$4,000 hasta RD$12,000</strong> según la marca y el tipo. Los más populares son ACUVUE Oasys for Astigmatism (RD$6,250), Biofinity Toric (RD$5,750) y BL Ultra Astigmatismo (RD$4,000). Todos disponibles con entrega en 24-48h.</p>
          <Link href="/toricos" className="mt-3 inline-flex items-center gap-2 bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors text-sm">
            Ver todos los tóricos disponibles →
          </Link>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>Si en tu receta aparece un valor <strong>CYL (cilindro)</strong> y un valor <strong>AXIS (eje)</strong>, tienes astigmatismo y necesitas <strong>lentes de contacto tóricos</strong>. En República Dominicana, el astigmatismo es una de las condiciones visuales más comunes — y la buena noticia es que hoy existen excelentes opciones disponibles con entrega a domicilio en 24-48 horas.</p>

          {/* Diagnóstico rápido */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cómo saber si necesito lentes tóricos?</h2>
            <p>Revisa tu receta óptica. Si tienes astigmatismo, verás estos valores:</p>
            <div className="mt-4 bg-gray-900 text-green-400 rounded-2xl p-4 font-mono text-sm">
              <p className="text-gray-400 text-xs mb-3">// Ejemplo de receta con astigmatismo</p>
              <p>OD: SPH -2.50 | CYL <span className="text-yellow-400">-1.25</span> | AXIS <span className="text-yellow-400">180°</span></p>
              <p>OI: SPH -2.00 | CYL <span className="text-yellow-400">-0.75</span> | AXIS <span className="text-yellow-400">165°</span></p>
              <p className="text-gray-400 text-xs mt-3">// Si CYL ≠ 0 → necesitas lentes tóricos</p>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                { valor: 'Solo SPH', necesitas: 'Lentes esféricos normales', link: '/esfericos' },
                { valor: 'SPH + CYL + AXIS', necesitas: 'Lentes tóricos (astigmatismo)', link: '/toricos' },
                { valor: 'SPH + ADD', necesitas: 'Lentes multifocales (presbicia)', link: '/multifocales' },
                { valor: 'SPH + CYL + AXIS + ADD', necesitas: 'Lentes multifocales tóricos', link: '/toricos' },
              ].map(({ valor, necesitas, link }, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-xs font-mono text-gray-500">Tu receta tiene: {valor}</p>
                    <p className="text-sm font-semibold text-gray-900">→ {necesitas}</p>
                  </div>
                  <Link href={link} className="text-xs text-primary-600 font-bold hover:underline">Ver →</Link>
                </div>
              ))}
            </div>
          </section>

          {/* Tabla de precios */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Precios de lentes para astigmatismo en RD — junio 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-3 text-left font-bold">Producto</th>
                    <th className="p-3 text-center font-bold">Reemplazo</th>
                    <th className="p-3 text-right font-bold">Precio</th>
                    <th className="p-3 text-center font-bold">Comprar</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(({ nombre, freq, precio, link }, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium text-sm">{nombre}</td>
                      <td className="p-3 border border-gray-100 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${freq === 'Diario' ? 'bg-green-100 text-green-700' : freq === 'Quincenal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{freq}</span>
                      </td>
                      <td className="p-3 border border-gray-100 text-right font-black text-primary-600">RD${precio.toLocaleString()}</td>
                      <td className="p-3 border border-gray-100 text-center">
                        <Link href={link} className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-primary-700 transition-colors">Ver →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">Precios en RD$ con envío incluido. Actualizados junio 2026.</p>
          </section>

          {/* Guía por necesidad */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cuál lente tórico es para mí?</h2>
            <div className="space-y-3">
              {[
                {
                  perfil: 'Quiero el más cómodo (uso intensivo/pantallas)',
                  recomendacion: 'ACUVUE Oasys for Astigmatism',
                  precio: 'RD$6,250',
                  razon: 'HYDRACLEAR Plus + estabilización BLINK STABILIZED. El más prescrito por especialistas.',
                  link: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana',
                  color: 'border-red-200 bg-red-50',
                },
                {
                  perfil: 'Quiero el mejor precio mensual',
                  recomendacion: 'BL ULTRA for Astigmatism',
                  precio: 'RD$4,000',
                  razon: 'El más económico de la gama premium. Solo RD$44/día de uso.',
                  link: '/producto/bausch-lomb-ultra-astigmatism-lentes-toricos-dominicana',
                  color: 'border-amber-200 bg-amber-50',
                },
                {
                  perfil: 'Prefiero lentes diarios (sin estuche ni solución)',
                  recomendacion: 'clariti 1 day toric o 1-DAY ACUVUE Moist Astig',
                  precio: 'RD$5,750 – 6,250',
                  razon: 'Máxima higiene. Cada día estrenas lentes. Ideal para personas con alergias.',
                  link: '/toricos',
                  color: 'border-green-200 bg-green-50',
                },
                {
                  perfil: 'Tengo astigmatismo muy alto (CYL > -2.75)',
                  recomendacion: 'Biofinity XR Toric',
                  precio: 'RD$12,000',
                  razon: 'Diseñado para astigmatismos severos que no se pueden corregir con tóricos estándar.',
                  link: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana',
                  color: 'border-blue-200 bg-blue-50',
                },
              ].map(({ perfil, recomendacion, precio, razon, link, color }, i) => (
                <div key={i} className={`border rounded-2xl p-4 ${color}`}>
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Si: {perfil}</p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">→ {recomendacion}</p>
                      <p className="text-lg font-black text-primary-600">{precio}</p>
                      <p className="text-xs text-gray-600 mt-1">{razon}</p>
                    </div>
                    <Link href={link} className="shrink-0 text-xs bg-primary-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-primary-700 transition-colors">
                      Ver →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Qué es el astigmatismo */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Qué es el astigmatismo y por qué necesitas lentes especiales?</h2>
            <p>El astigmatismo es una irregularidad en la curvatura de la córnea o del cristalino del ojo. En lugar de ser perfectamente esférica como un balón, la córnea tiene forma más elíptica — como un balón de rugby. Esto hace que la luz no se enfoque en un solo punto, produciendo imágenes borrosas o distorsionadas tanto de cerca como de lejos.</p>
            <p className="mt-3">Los lentes esféricos normales no pueden corregir el astigmatismo porque tienen la misma potencia en todos sus meridianos. Los <strong>lentes tóricos</strong> tienen dos potencias diferentes — una para el meridiano plano y otra para el meridiano curvo — que corresponden exactamente con los valores CYL y AXIS de tu receta.</p>
            <p className="mt-3">Además, los tóricos tienen un sistema de <strong>estabilización</strong> que los mantiene en la orientación correcta sobre el ojo, aunque parpadees o muevas los ojos. Sin esta estabilización, el lente giraría y la corrección del astigmatismo sería ineficaz.</p>
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
              <p className="font-bold text-blue-800 mb-1">📊 Dato importante</p>
              <p className="text-blue-700">El astigmatismo es muy común — según estudios, aproximadamente el 40-50% de la población tiene algún grado de astigmatismo. La mayoría son leves y pueden corregirse con lentes tóricos estándar.</p>
            </div>
          </section>

          {/* Cuánto dura la caja */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cuánto dura una caja y cuántas necesito al año?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Tipo</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Contenido</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Duración</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Cajas/año (2 ojos)</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Gasto anual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Diarios (30u)', '30 lentes', '1 mes', '24 cajas', 'RD$138,000-150,000'],
                    ['Quincenales (6u)', '6 lentes', '3 meses', '8 cajas', 'RD$46,000-50,000'],
                    ['Mensuales (6u)', '6 lentes', '6 meses', '4 cajas', 'RD$16,000-24,000'],
                  ].map(([tipo, cont, dur, cajas, gasto], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{tipo}</td>
                      <td className="p-3 border border-gray-100 text-center">{cont}</td>
                      <td className="p-3 border border-gray-100 text-center">{dur}</td>
                      <td className="p-3 border border-gray-100 text-center font-bold">{cajas}</td>
                      <td className="p-3 border border-gray-100 text-center text-primary-600 font-bold">{gasto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">*Estimado para 2 ojos con uso diario de lunes a sábado.</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {[
                { q: '¿Los lentes tóricos se ponen diferente?', a: 'El proceso es el mismo que para cualquier lente blando. Sin embargo, los tóricos tienen marcadores de orientación que te ayudan a verificar que están en la posición correcta. Al principio pueden tardar un poco más en acomodarse, pero rápidamente lo dominarás.' },
                { q: '¿Puedo usar lentes esféricos si tengo astigmatismo leve?', a: 'Si el astigmatismo es muy leve (CYL de -0.25 o -0.50), algunos especialistas permiten usar lentes esféricos. Sin embargo, para corregir correctamente el astigmatismo y evitar fatiga visual, siempre es mejor usar el lente tórico indicado en tu receta.' },
                { q: '¿Los lentes tóricos son más caros?', a: 'Sí, generalmente cuestan entre 20-40% más que los esféricos equivalentes. En ContactGo los tóricos van desde RD$4,000 (BL Ultra Astig) hasta RD$12,000 (Biofinity XR para alta graduación).' },
                { q: '¿Se puede ver bien con lentes tóricos desde el primer día?', a: 'La mayoría de personas ve bien desde el primer momento. Algunos usuarios necesitan unos pocos días de adaptación para que la estabilización del lente funcione de manera óptima con sus movimientos oculares específicos.' },
                { q: '¿Qué pasa si el lente tórico rota en mi ojo?', a: 'Los lentes tóricos modernos tienen sistemas de estabilización avanzados (prism ballast, doble fina zona, BLINK STABILIZED) que corrigen automáticamente la rotación al parpadear. Si notas visión inestable o fluctuante, consulta a tu especialista — puede que necesites ajustar los parámetros.' },
              ].map(({ q, a }, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                    {q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900">Artículos relacionados</h3>
            {[
              { href: '/toricos', titulo: '→ Ver todos los lentes tóricos disponibles', desc: '7 modelos con precios y disponibilidad' },
              { href: '/blog/acuvue-oasys-precio-republica-dominicana', titulo: '→ ACUVUE Oasys precio en RD', desc: 'La guía completa de precios ACUVUE' },
              { href: '/blog/como-leer-receta-optica-rd', titulo: '→ Cómo leer tu receta óptica', desc: 'Qué significa CYL, AXIS y cada valor' },
              { href: '/blog/lentes-de-contacto-para-astigmatismo-rd', titulo: '→ Lentes de astigmatismo en RD — guía completa', desc: 'Todo sobre los tóricos en República Dominicana' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-0.5">Información verificada</p>
              <p className="text-gray-600">Escrito por el <strong>Equipo ContactGo</strong>, Especialistas en Salud Visual · Revisado junio 2026</p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Lentes para astigmatismo — entrega en 24-48h</h3>
          <p className="text-sm text-gray-600 mb-1">7 modelos tóricos disponibles. 100% originales. Toda la RD.</p>
          <p className="text-xs text-gray-400 mb-4">Desde RD$4,000 · Pago seguro AZUL · Sin salir de casa</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/toricos" className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors text-sm">
              Ver todos los tóricos →
            </Link>
            <Link href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm">
              Calcular mi receta gratis
            </Link>
            <a href="https://wa.me/18096942268?text=Hola%2C%20tengo%20astigmatismo%20y%20quiero%20comprar%20lentes%20t%C3%B3ricos%20en%20RD" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Asesoría WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda República Dominicana</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
