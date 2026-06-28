export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ACUVUE Oasys precio en República Dominicana 2026',
  description: 'Precio actualizado de ACUVUE Oasys en RD: desde RD$3,875 la caja de 6 lentes. Compara modelos, conoce las diferencias y recibe en 24h en toda la RD.',
  alternates: { canonical: 'https://www.contactgo.net/blog/acuvue-oasys-precio-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'ACUVUE Oasys precio en República Dominicana 2026',
    description: 'Precio actualizado ACUVUE Oasys en RD. Todos los modelos disponibles con entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/acuvue-oasys-precio-republica-dominicana',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/acuvue-oasys-precio-rd.webp', width: 1200, height: 630, alt: 'ACUVUE Oasys precio República Dominicana 2026' }],
  },
}

export default function Page() {
  const productos = [
    { nombre: 'ACUVUE® Oasys® (6u)', tipo: 'Quincenal esférico', precio: 3875, link: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana', disponible: true },
    { nombre: 'ACUVUE® 2 (6u)', tipo: 'Quincenal esférico', precio: 3600, link: '/producto/acuvue-2-lentes-contacto-quincenales-dominicana', disponible: true },
    { nombre: '1-DAY ACUVUE® Moist® (30u)', tipo: 'Diario esférico', precio: 3875, link: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana', disponible: true },
    { nombre: 'ACUVUE® Oasys® Astigmatismo (6u)', tipo: 'Quincenal tórico', precio: 6250, link: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', disponible: true },
    { nombre: '1-DAY MOIST® Astigmatismo (30u)', tipo: 'Diario tórico', precio: 6250, link: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', disponible: true },
    { nombre: 'ACUVUE® Oasys® Multifocal (6u)', tipo: 'Quincenal multifocal', precio: 8200, link: '/producto/acuvue-oasys-multifocal-lentes-contacto-dominicana', disponible: true },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "ACUVUE Oasys precio en República Dominicana 2026",
            "description": "Precio actualizado de ACUVUE Oasys en RD. Todos los modelos disponibles con entrega en 24-48 horas.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/acuvue-oasys-precio-republica-dominicana",
            "inLanguage": "es-DO"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Cuánto cuesta ACUVUE Oasys en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "En ContactGo, ACUVUE Oasys (6 lentes quincenales) cuesta RD$3,875. El modelo para astigmatismo está en RD$6,250 y el multifocal en RD$8,200. Los precios incluyen envío en 24-48h en toda la RD." } },
              { "@type": "Question", "name": "¿Dónde comprar ACUVUE Oasys en RD?", "acceptedAnswer": { "@type": "Answer", "text": "Puedes comprar ACUVUE Oasys 100% originales en ContactGo con entrega en 24-48h en toda República Dominicana. Son los mismos lentes que encuentras en clínicas y tiendas físicas pero con la comodidad de recibirlos en tu puerta." } },
              { "@type": "Question", "name": "¿Cuál es la diferencia entre ACUVUE Oasys y ACUVUE 2?", "acceptedAnswer": { "@type": "Answer", "text": "ACUVUE Oasys usa silicona hidrogel (Senofilcon A) con tecnología HYDRACLEAR Plus y ofrece mayor transmisión de oxígeno y comodidad. ACUVUE 2 usa hidrogel estándar. El Oasys es más cómodo, especialmente para uso prolongado o frente a pantallas." } },
              { "@type": "Question", "name": "¿Cuánto duran los ACUVUE Oasys?", "acceptedAnswer": { "@type": "Answer", "text": "ACUVUE Oasys son lentes quincenales — se usan durante 14 días y luego se descartan. Cada caja de 6 lentes equivale a aproximadamente 3 meses de uso para ambos ojos." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "ACUVUE Oasys precio RD", "item": "https://www.contactgo.net/blog/acuvue-oasys-precio-republica-dominicana" }
            ]
          }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">ACUVUE Oasys precio RD</span>
        </div>

        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">ACUVUE · Precios 2026</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          ACUVUE Oasys precio en República Dominicana 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Precios actualizados junio 2026 · Entrega 24-48h en RD</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
          <span>📅 Actualizado: junio 2026</span>
          <span>·</span>
          <span>⏱ 6 min lectura</span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            <li key="0"><a href="#precios" className="text-primary-600 hover:underline">Precios de toda la línea ACUVUE Oasys</a></li>
            <li key="1"><a href="#que-es" className="text-primary-600 hover:underline">¿Qué es ACUVUE Oasys?</a></li>
            <li key="2"><a href="#hydraclear" className="text-primary-600 hover:underline">Tecnología HYDRACLEAR Plus</a></li>
            <li key="3"><a href="#linea" className="text-primary-600 hover:underline">Toda la línea disponible</a></li>
            <li key="4"><a href="#receta" className="text-primary-600 hover:underline">Cómo comprar con tu receta</a></li>
            <li key="5"><a href="#faq" className="text-primary-600 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </div>

        {/* Precio destacado */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Precio actualizado junio 2026</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-gray-900">RD$3,875</p>
            <p className="text-gray-500 text-sm">caja de 6 lentes</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">ACUVUE® Oasys® quincenal · Entrega en 24-48h</p>
          <Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana"
            className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm">
            Comprar ACUVUE Oasys →
          </Link>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>Si buscas el precio de <strong>ACUVUE Oasys en República Dominicana</strong>, llegaste al lugar correcto. En ContactGo somos la tienda especializada en lentes de contacto con el catálogo completo de la línea ACUVUE — originales, sellados de fábrica y con entrega en 24-48 horas a toda la República Dominicana.</p>

          {/* Tabla de precios */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Precios ACUVUE completos en RD — junio 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-3 text-left font-bold">Producto</th>
                    <th className="p-3 text-left font-bold">Tipo</th>
                    <th className="p-3 text-right font-bold">Precio</th>
                    <th className="p-3 text-center font-bold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(({ nombre, tipo, precio, link, disponible }, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{nombre}</td>
                      <td className="p-3 border border-gray-100 text-gray-500 text-xs">{tipo}</td>
                      <td className="p-3 border border-gray-100 text-right font-black text-primary-600">RD${precio.toLocaleString()}</td>
                      <td className="p-3 border border-gray-100 text-center">
                        {disponible
                          ? <Link href={link} className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-primary-700 transition-colors">Comprar</Link>
                          : <span className="text-xs text-gray-400">No disponible</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">*Precios en pesos dominicanos (RD$) con envío incluido a toda la RD. Actualizados junio 2026.</p>
          </section>

          {/* Por qué ACUVUE Oasys */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Por qué ACUVUE Oasys es el lente más vendido en RD?</h2>
            <p>Los <strong>ACUVUE Oasys</strong> son los lentes de contacto quincenales más recomendados por optometristas a nivel mundial, y en República Dominicana no es diferente. Hay razones concretas para esa popularidad:</p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { icono: '💧', titulo: 'Tecnología HYDRACLEAR® Plus', desc: 'El agente humectante está integrado directamente en el material del lente, no solo en la superficie. Esto significa hidratación constante durante las 14 horas típicas de uso, sin que el lente se reseque.' },
                { icono: '🌬️', titulo: 'Silicona hidrogel de alta permeabilidad', desc: 'Con un Dk/t de 147, ACUVUE Oasys permite casi 5 veces más oxígeno a la córnea que los lentes de hidrogel convencionales. Resultado: ojos más saludables y menos rojez.' },
                { icono: '🛡️', titulo: 'Protección UV Clase 1', desc: 'La más alta protección UV disponible en lentes de contacto. Bloquea más del 90% de los rayos UVA y más del 99% de los UVB.' },
                { icono: '💻', titulo: 'Ideal para pantallas', desc: 'Especialmente recomendados para personas que trabajan frente a computadoras o teléfonos. La tecnología HYDRACLEAR Plus reduce la fatiga ocular digital.' },
                { icono: '📊', titulo: '29 estudios clínicos', desc: 'Según Johnson & Johnson, ACUVUE Oasys no ha sido superado en comodidad en 29 estudios clínicos comparativos con otros lentes del mercado.' },
              ].map(({ icono, titulo, desc }, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl">{icono}</span>
                  <div><strong className="text-gray-900">{titulo}:</strong> <span className="text-gray-600">{desc}</span></div>
                </li>
              ))}
            </ul>
          </section>

          {/* Guía de modelos */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cuál modelo ACUVUE necesito?</h2>
            <div className="space-y-3">
              {[
                {
                  pregunta: 'Tengo miopía o hipermetropía simple',
                  respuesta: 'ACUVUE Oasys (6u) — quincenal',
                  precio: 'RD$3,875',
                  link: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana',
                  color: 'border-blue-200 bg-blue-50',
                },
                {
                  pregunta: 'Quiero lentes diarios (sin estuche ni solución)',
                  respuesta: '1-DAY ACUVUE Moist (30u) — diario',
                  precio: 'RD$3,875',
                  link: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana',
                  color: 'border-green-200 bg-green-50',
                },
                {
                  pregunta: 'Tengo astigmatismo (valor CYL en mi receta)',
                  respuesta: 'ACUVUE Oasys for Astigmatism (6u)',
                  precio: 'RD$6,250',
                  link: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana',
                  color: 'border-purple-200 bg-purple-50',
                },
                {
                  pregunta: 'Necesito astigmatismo en lentes diarios',
                  respuesta: '1-DAY ACUVUE Moist for Astigmatism (30u)',
                  precio: 'RD$6,250',
                  link: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana',
                  color: 'border-indigo-200 bg-indigo-50',
                },
                {
                  pregunta: 'Tengo presbicia (dificultad para ver de cerca)',
                  respuesta: 'ACUVUE Oasys for Presbyopia Multifocal (6u)',
                  precio: 'RD$8,200',
                  link: '/producto/acuvue-oasys-multifocal-lentes-contacto-dominicana',
                  color: 'border-amber-200 bg-amber-50',
                },
              ].map(({ pregunta, respuesta, precio, link, color }, i) => (
                <div key={i} className={`border rounded-2xl p-4 ${color}`}>
                  <p className="text-sm font-bold text-gray-700 mb-1">Si: {pregunta}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">→ {respuesta}</p>
                      <p className="text-lg font-black text-primary-600">{precio}</p>
                    </div>
                    <Link href={link} className="text-xs bg-primary-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-700 transition-colors">
                      Comprar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl p-3 text-sm">
              <p>¿No sabes qué modelo necesitas? Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold hover:underline">calculadora de receta gratuita</Link> o <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">escríbenos por WhatsApp</a> y te asesoramos.</p>
            </div>
          </section>

          {/* Comparativa con competidores */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">ACUVUE Oasys vs. alternativas disponibles en RD</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-red-700">ACUVUE Oasys</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-blue-700">Biofinity</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-teal-700">Air Optix HG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Reemplazo', 'Quincenal', 'Mensual', 'Mensual'],
                    ['Material', 'Silicona hidrogel', 'Silicona hidrogel', 'Silicona hidrogel'],
                    ['Dk/t (oxígeno)', '147', '160', '138'],
                    ['Tecnología hidratación', 'HYDRACLEAR Plus', 'Aquaform', 'HydraGlyde'],
                    ['Precio en ContactGo', 'RD$3,875', 'RD$4,750', 'RD$4,375'],
                    ['Precio/día de uso', '~RD$92/día', '~RD$52/día', '~RD$48/día'],
                    ['Protección UV', '✅ Clase 1', '❌', '❌'],
                    ['Mejor para', 'Pantallas + comodidad', 'Precio/mes bajo', 'Ojos secos'],
                  ].map(([car, acu, bio, air], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{car}</td>
                      <td className="p-3 border border-gray-100 text-center text-red-700 font-medium">{acu}</td>
                      <td className="p-3 border border-gray-100 text-center text-blue-700">{bio}</td>
                      <td className="p-3 border border-gray-100 text-center text-teal-700">{air}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3 text-gray-600">Ver también: <Link href="/blog/biofinity-vs-acuvue-comparacion" className="text-primary-600 hover:underline">Biofinity vs ACUVUE comparación completa</Link> · <Link href="/blog/acuvue-oasys-vs-air-optix-hydraglyde" className="text-primary-600 hover:underline">ACUVUE Oasys vs Air Optix HydraGlyde</Link></p>
          </section>

          {/* Cómo comprar */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo comprar ACUVUE Oasys en República Dominicana</h2>
            <p>El proceso en ContactGo es de 3 pasos:</p>
            <div className="mt-4 space-y-3">
              {[
                { paso: '1', desc: 'Selecciona tu modelo ACUVUE y la graduación de tu receta (SPH, y CYL/AXIS si tienes astigmatismo)' },
                { paso: '2', desc: 'Paga de forma segura con tu tarjeta VISA o Mastercard a través de AZUL/Banco Popular' },
                { paso: '3', desc: 'Recibe tu pedido en 24-48h en Santo Domingo, Santiago o donde estés en RD' },
              ].map(({ paso, desc }) => (
                <div key={paso} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0">{paso}</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/marca/acuvue" className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm">
                Ver toda la línea ACUVUE →
              </Link>
              <a href="https://wa.me/18294728328?text=Hola%2C%20quiero%20comprar%20ACUVUE%20Oasys%20en%20Rep%C3%BAblica%20Dominicana" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
                Pedir por WhatsApp
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre ACUVUE Oasys en RD</h2>
            <div className="space-y-3">
              {[
                { q: '¿Cuánto cuesta ACUVUE Oasys en República Dominicana?', a: 'En ContactGo, ACUVUE Oasys (6 lentes quincenales) cuesta RD$3,875. El modelo para astigmatismo está en RD$6,250 y el multifocal en RD$8,200. Los precios incluyen envío en 24-48h en toda la RD.' },
                { q: '¿Dónde comprar ACUVUE Oasys originales en RD?', a: 'En ContactGo encontrarás ACUVUE Oasys 100% originales, sellados de fábrica, con entrega a domicilio en 24-48 horas. Son los mismos lentes de Johnson & Johnson que encuentras en clínicas físicas.' },
                { q: '¿Cuánto duran los ACUVUE Oasys?', a: 'Son lentes quincenales — se usan durante 14 días consecutivos y luego se descartan. Una caja de 6 lentes equivale a aproximadamente 3 meses de uso para ambos ojos.' },
                { q: '¿Cuál es la diferencia entre ACUVUE Oasys y ACUVUE 2?', a: 'ACUVUE Oasys usa silicona hidrogel con HYDRACLEAR Plus (mayor oxígeno, mayor comodidad). ACUVUE 2 usa hidrogel convencional y es una opción más económica a RD$3,600.' },
                { q: '¿ACUVUE Oasys sirve para astigmatismo?', a: 'Sí, pero necesitas el modelo específico: ACUVUE Oasys for Astigmatism. Este tiene un diseño tórico que estabiliza el lente para corregir el astigmatismo con precisión. Cuesta RD$6,250 en ContactGo.' },
                { q: '¿Hay que tener receta para comprar ACUVUE Oasys en RD?', a: 'Sí, necesitas una prescripción médica actualizada con los valores SPH (y CYL/AXIS si tienes astigmatismo) emitida por tu optometrista u oftalmólogo.' },
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
              { href: '/blog/biofinity-vs-acuvue-comparacion', titulo: '→ Biofinity vs ACUVUE Oasys: comparación completa', desc: 'Cuál es mejor para ti según tu estilo de vida' },
              { href: '/blog/lentes-diarios-vs-mensuales', titulo: '→ Lentes diarios vs mensuales: ¿cuál conviene?', desc: 'Análisis de costo y conveniencia real' },
              { href: '/blog/cuanto-cuestan-lentes-contacto-rd', titulo: '→ Cuánto cuestan los lentes en RD 2026', desc: 'Guía de precios todas las marcas' },
              { href: '/marca/acuvue', titulo: '→ Ver toda la línea ACUVUE disponible', desc: 'ACUVUE Oasys, MOIST, Astigmatismo, Multifocal' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-10 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">ACUVUE Oasys originales — entrega en 24-48h</h3>
          <p className="text-sm text-gray-600 mb-1">Los mismos lentes que en la clínica, directo a tu puerta en toda República Dominicana.</p>
          <p className="text-xs text-gray-400 mb-4">100% originales · Sellados de fábrica · Pago seguro AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana"
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm">
              Comprar ACUVUE Oasys — RD$3,875 →
            </Link>
            <Link href="/marca/acuvue" className="inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm">
              Ver todos los modelos ACUVUE
            </Link>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda República Dominicana</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
