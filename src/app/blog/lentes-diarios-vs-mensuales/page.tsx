export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes diarios vs mensuales: cuál elegir en RD 2026',
  description: 'Comparativa completa: lentes de contacto diarios vs mensuales en República Dominicana. Precios reales, coste anual y cuál es mejor para ti según tu vida.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-diarios-vs-mensuales' },
  openGraph: {
    type: 'article',
    title: 'Lentes de contacto diarios vs mensuales — RD 2026',
    description: 'Comparativa completa con precios reales en RD. Cuál es mejor para tu estilo de vida.',
    url: 'https://www.contactgo.net/blog/lentes-diarios-vs-mensuales',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-diarios-vs-mensuales.webp', width: 1200, height: 630, alt: 'Lentes diarios vs mensuales República Dominicana comparativa 2026' }],
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Lentes de contacto diarios vs mensuales: cuál elegir en República Dominicana",
            "description": "Comparativa completa con precios reales en RD. Cuál es mejor para tu estilo de vida y presupuesto.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/lentes-diarios-vs-mensuales",
            "inLanguage": "es-DO"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Son mejores los lentes diarios o mensuales?", "acceptedAnswer": { "@type": "Answer", "text": "Depende de tu estilo de vida. Los diarios son más higiénicos y convenientes (no necesitan limpieza), ideales para uso 4-5 días por semana o personas con alergias. Los mensuales tienen menor coste diario y son ideales para uso diario intensivo." } },
              { "@type": "Question", "name": "¿Cuánto más cuestan los lentes diarios vs los mensuales?", "acceptedAnswer": { "@type": "Answer", "text": "En ContactGo, los lentes diarios cuestan entre RD$3,875-4,375 por caja de 30 (1 mes por ojo), mientras que los mensuales como Biofinity cuestan RD$4,750 por 6 meses por ojo. El coste anual de los diarios suele ser 2-3 veces mayor que los mensuales." } },
              { "@type": "Question", "name": "¿Los lentes diarios son más saludables?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, en general. Al usar un lente nuevo cada día, eliminamos la acumulación de depósitos de proteínas y bacterias. Son especialmente recomendados para personas con alergias, ojos secos o tendencia a infecciones." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes diarios vs mensuales", "item": "https://www.contactgo.net/blog/lentes-diarios-vs-mensuales" }
            ]
          }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Diarios vs mensuales</span>
        </div>

        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Comparativa · 2026</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Lentes diarios vs mensuales: ¿cuál elegir en República Dominicana?
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
          <span>⏱ 7 min lectura</span>
        </div>

        {/* TOC */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[
              ['diferencias', 'Diferencias fundamentales'],
              ['precios', 'Precios reales en RD y coste anual'],
              ['higiene', 'Higiene y salud ocular'],
              ['cuando-diarios', 'Cuándo elegir lentes diarios'],
              ['cuando-mensuales', 'Cuándo elegir lentes mensuales'],
              ['quincenales', '¿Y los quincenales? La opción intermedia'],
              ['veredicto', 'Veredicto según tu perfil'],
              ['faq', 'Preguntas frecuentes'],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>Una de las preguntas más frecuentes cuando alguien empieza a usar <strong>lentes de contacto</strong> es: ¿diarios o mensuales? No hay una respuesta universal — depende de tu estilo de vida, presupuesto y necesidades oculares. En esta guía comparamos ambas opciones con precios reales disponibles en República Dominicana para que puedas tomar la decisión correcta.</p>

          {/* Comparativa visual */}
          <section id="diferencias">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Diferencias fundamentales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Característica</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-green-700">Diarios</th>
                    <th className="p-3 text-center border border-gray-100 font-bold text-purple-700">Mensuales</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Duración', '1 día (se descartan)', '30 días de uso'],
                    ['Limpieza necesaria', '❌ No', '✅ Sí, cada noche'],
                    ['Necesita solución', '❌ No', '✅ Sí (RD$750+/mes)'],
                    ['Necesita estuche', '❌ No', '✅ Sí'],
                    ['Higiene', '⭐⭐⭐⭐⭐ Máxima', '⭐⭐⭐⭐ Muy buena'],
                    ['Coste/caja', 'RD$3,875-4,375 (30u)', 'RD$3,500-5,750 (6u)'],
                    ['Coste anual estimado', 'RD$93,000-105,000', 'RD$25,000-50,000'],
                    ['Ideal para alergias', '✅ Muy recomendado', '⚠️ Aceptable'],
                    ['Para ojos secos', '✅ Buena opción', '✅ Silicona hidrogel buena'],
                    ['Para uso ocasional', '⭐⭐⭐⭐⭐ Perfecto', '⚠️ Sale más caro por uso'],
                  ].map(([car, dia, men], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{car}</td>
                      <td className="p-3 border border-gray-100 text-center text-green-700">{dia}</td>
                      <td className="p-3 border border-gray-100 text-center text-purple-700">{men}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Precios reales RD */}
          <section id="precios">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Precios reales y coste anual en República Dominicana</h2>
            <p>Esta es la parte más importante para tu decisión. Aquí los números reales con precios de ContactGo junio 2026:</p>

            <h3 className="font-bold text-gray-900 mt-5 mb-3">Lentes diarios disponibles en ContactGo:</h3>
            <div className="space-y-2">
              {[
                { nombre: '1-DAY ACUVUE Moist 30u', precio: 3875, link: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana' },
                { nombre: 'clariti 1 day 30u (CooperVision)', precio: 4375, link: '/producto/clariti-1-day-lentes-contacto-diarios-dominicana' },
                { nombre: 'Biotrue ONEday 30u (Bausch+Lomb)', precio: 3500, link: '/producto/biotrue-oneday-lentes-contacto-diarios-dominicana' },
              ].map(({ nombre, precio, link }) => (
                <Link key={link} href={link} className="flex items-center justify-between p-3 border border-green-100 bg-green-50 rounded-xl hover:border-green-300 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{nombre}</p>
                    <p className="text-xs text-gray-500">30 lentes diarios — 1 mes por ojo</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-700">RD${precio.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{Math.round(precio/30)} RD$/día</p>
                  </div>
                </Link>
              ))}
            </div>

            <h3 className="font-bold text-gray-900 mt-5 mb-3">Lentes mensuales disponibles en ContactGo:</h3>
            <div className="space-y-2">
              {[
                { nombre: 'Biofinity 6u (CooperVision)', precio: 4750, meses: 6, link: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana' },
                { nombre: 'Air Optix HydraGlyde 6u (Alcon)', precio: 4375, meses: 6, link: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana' },
                { nombre: 'Bausch+Lomb ULTRA 6u', precio: 4500, meses: 6, link: '/producto/bausch-lomb-ultra-lentes-contacto-mensuales-dominicana' },
                { nombre: 'Proclear Sphere 6u (CooperVision)', precio: 3200, meses: 6, link: '/producto/proclear-sphere-lentes-contacto-mensuales-dominicana' },
              ].map(({ nombre, precio, meses, link }) => (
                <Link key={link} href={link} className="flex items-center justify-between p-3 border border-purple-100 bg-purple-50 rounded-xl hover:border-purple-300 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{nombre}</p>
                    <p className="text-xs text-gray-500">6 lentes mensuales — {meses} meses por ojo</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-purple-700">RD${precio.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{Math.round(precio/meses/30)} RD$/día</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
              <p className="font-bold text-amber-800 mb-2">💰 Coste anual estimado para 2 ojos:</p>
              <div className="space-y-1.5 text-amber-700">
                <p><strong>Diarios</strong> (1-DAY ACUVUE Moist): 24 cajas × RD$3,875 = <strong>~RD$93,000/año</strong></p>
                <p><strong>Mensuales</strong> (Biofinity): 4 cajas × RD$4,750 + solución 12 meses ≈ <strong>~RD$28,000/año</strong></p>
                <p className="text-amber-800 font-bold mt-2">Los mensuales pueden ser hasta 3x más económicos anualmente que los diarios.</p>
              </div>
            </div>
          </section>

          {/* Higiene */}
          <section id="higiene">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Higiene y salud ocular: la ventaja de los diarios</h2>
            <p>Desde el punto de vista de la salud ocular, los lentes diarios tienen una ventaja clara: <strong>cada día estrenas un lente nuevo, perfectamente estéril</strong>. No hay acumulación de proteínas, depósitos lipídicos ni bacterias. No hay riesgo de contaminación del estuche ni de usar solución reutilizada.</p>
            <p className="mt-3">Los estudios clínicos muestran que los usuarios de lentes diarios tienen significativamente menos casos de conjuntivitis, queratitis y otras infecciones relacionadas con el uso de lentes. Esto los convierte en la opción preferida para:</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {[
                'Personas con alergias oculares estacionales',
                'Personas con tendencia a ojo seco o irritación frecuente',
                'Usuarios que viajan frecuentemente',
                'Personas que no usan lentes todos los días',
                'Personas que buscan la máxima comodidad sin mantenimiento',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cuándo elegir diarios */}
          <section id="cuando-diarios">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cuándo elegir lentes diarios</h2>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="font-bold text-green-800 mb-3">Elige lentes diarios si:</p>
              <ul className="space-y-2 text-sm text-green-700">
                {[
                  'Usas lentes de contacto 4 días a la semana o menos — sale más económico que los mensuales',
                  'Tienes alergias oculares o ojo seco frecuente',
                  'Valoras la conveniencia por encima del precio — sin estuche, sin solución, sin mantenimiento',
                  'Olvidas frecuentemente quitarte los lentes antes de dormir (mayor riesgo con mensuales)',
                  'Practicas natación o deportes acuáticos frecuentemente',
                  'Tu presupuesto lo permite y prefieres la opción más higiénica',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span>✅</span>{item}</li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2">
                {[
                  { nombre: '1-DAY ACUVUE Moist', precio: 3875, link: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana' },
                  { nombre: 'Biotrue ONEday', precio: 3500, link: '/producto/biotrue-oneday-lentes-contacto-diarios-dominicana' },
                ].map(({ nombre, precio, link }) => (
                  <Link key={link} href={link} className="flex items-center justify-between p-2 bg-white rounded-xl border border-green-200">
                    <span className="text-sm font-semibold text-gray-900">{nombre}</span>
                    <span className="text-sm font-black text-green-700">RD${precio.toLocaleString()} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Cuándo elegir mensuales */}
          <section id="cuando-mensuales">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cuándo elegir lentes mensuales</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <p className="font-bold text-purple-800 mb-3">Elige lentes mensuales si:</p>
              <ul className="space-y-2 text-sm text-purple-700">
                {[
                  'Usas lentes todos los días — el coste por día es significativamente menor',
                  'Tu presupuesto es ajustado — los mensuales pueden costar hasta 3x menos al año',
                  'No te importa el mantenimiento diario de limpieza y almacenamiento',
                  'Quieres la opción de silicona hidrogel premium (Biofinity, Air Optix, ULTRA)',
                  'Tu gradación es alta o tienes parámetros poco comunes (mayor disponibilidad en mensuales)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span>✅</span>{item}</li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2">
                {[
                  { nombre: 'Biofinity (mensual)', precio: 4750, link: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana' },
                  { nombre: 'Air Optix HydraGlyde (mensual)', precio: 4375, link: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana' },
                ].map(({ nombre, precio, link }) => (
                  <Link key={link} href={link} className="flex items-center justify-between p-2 bg-white rounded-xl border border-purple-200">
                    <span className="text-sm font-semibold text-gray-900">{nombre}</span>
                    <span className="text-sm font-black text-purple-700">RD${precio.toLocaleString()} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Quincenales */}
          <section id="quincenales">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Y los quincenales? La opción intermedia</h2>
            <p>Los lentes quincenales como el ACUVUE Oasys se cambian cada 14 días. Ofrecen un equilibrio entre los diarios y los mensuales:</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-500">+</span> Más higiénicos que los mensuales (menor acumulación de depósitos)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">+</span> Más económicos que los diarios</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">+</span> El ACUVUE Oasys quincenal es el lente más prescrito mundialmente</li>
              <li className="flex items-start gap-2"><span className="text-amber-500">-</span> Requieren limpieza como los mensuales</li>
              <li className="flex items-start gap-2"><span className="text-amber-500">-</span> Algunos usuarios olvidan cuándo cambiarlos</li>
            </ul>
            <Link href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="mt-3 inline-flex items-center gap-2 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
              ACUVUE Oasys quincenal — RD$3,875 →
            </Link>
          </section>

          {/* Veredicto */}
          <section id="veredicto">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Veredicto según tu perfil</h2>
            <div className="space-y-3 text-sm">
              {[
                { perfil: 'Uso todos los días, quiero ahorrar al máximo', ganador: 'Mensual', razon: 'Hasta 3x más económico. Biofinity o Air Optix HydraGlyde.', color: 'bg-purple-50 border-purple-200' },
                { perfil: 'Uso 3-4 días a la semana (trabajo, salidas)', ganador: 'Diario', razon: 'El coste real es similar o menor al mensual, con más comodidad.', color: 'bg-green-50 border-green-200' },
                { perfil: 'Tengo alergias oculares', ganador: 'Diario', razon: 'Lente fresco cada día = mínima acumulación de alérgenos.', color: 'bg-green-50 border-green-200' },
                { perfil: 'Quiero comodidad + precio + calidad de silicona', ganador: 'Quincenal', razon: 'ACUVUE Oasys HydraGlyde — el equilibrio perfecto.', color: 'bg-blue-50 border-blue-200' },
                { perfil: 'Primera vez con lentes, quiero probar', ganador: 'Diario', razon: 'Sin mantenimiento, sin compromisos. Más fácil para empezar.', color: 'bg-green-50 border-green-200' },
                { perfil: 'Tengo alta graduación o astigmatismo especial', ganador: 'Mensual', razon: 'Mayor disponibilidad de parámetros en lentes mensuales.', color: 'bg-purple-50 border-purple-200' },
              ].map(({ perfil, ganador, razon, color }, i) => (
                <div key={i} className={`border rounded-2xl p-4 ${color}`}>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Si: {perfil}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${ganador === 'Diario' ? 'bg-green-200 text-green-800' : ganador === 'Mensual' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
                      → {ganador}
                    </span>
                    <p className="text-gray-600">{razon}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {[
                { q: '¿Son mejores los lentes diarios o mensuales?', a: 'Depende de tu estilo de vida. Los diarios son más higiénicos y convenientes (sin mantenimiento), mientras que los mensuales tienen un coste anual mucho menor. Si usas lentes todos los días, los mensuales son más económicos. Si los usas ocasionalmente, los diarios pueden ser más rentables.' },
                { q: '¿Cuánto más cuestan los diarios que los mensuales?', a: 'El coste anual de los diarios puede ser 2-3 veces mayor que los mensuales. En ContactGo: diarios (1-DAY MOIST) cuestan ~RD$93,000/año para 2 ojos; mensuales (Biofinity) cuestan ~RD$19,000/año para 2 ojos (sin contar solución).' },
                { q: '¿Puedo cambiar de diarios a mensuales?', a: 'Sí, pero necesitas que tu prescripción sea compatible con el modelo mensual que quieres. Algunos parámetros (BC, DIA) pueden variar entre marcas. Consulta con tu especialista si tienes dudas.' },
                { q: '¿Los lentes mensuales son peligrosos si no los limpio bien?', a: 'No son peligrosos si se limpian correctamente. El riesgo aumenta cuando no se sigue el protocolo de limpieza, se reutiliza la solución, o se usan más tiempo del indicado. Siguiendo las instrucciones, son completamente seguros.' },
                { q: '¿Qué necesito comprar además de los lentes mensuales?', a: 'Para lentes mensuales necesitas solución multipropósito (como Opti-Free Puremoist o Dream Eye, disponibles en ContactGo desde RD$750) y un estuche para almacenarlos cada noche. Los diarios no necesitan nada adicional.' },
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
              { href: '/esfericos', titulo: '→ Ver lentes esféricos disponibles', desc: 'Diarios, quincenales y mensuales con precios' },
              { href: '/blog/acuvue-oasys-precio-republica-dominicana', titulo: '→ ACUVUE Oasys precio en RD', desc: 'El quincenal más popular en República Dominicana' },
              { href: '/blog/biofinity-vs-acuvue-comparacion', titulo: '→ Biofinity vs ACUVUE: comparación completa', desc: 'Los dos mensuales líderes frente a frente' },
              { href: '/soluciones', titulo: '→ Soluciones para lentes mensuales', desc: 'Opti-Free, Dream Eye y Prolub en ContactGo' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">¿Ya sabes cuál quieres? Pídelos hoy.</h3>
          <p className="text-sm text-gray-600 mb-1">Diarios, quincenales y mensuales — todos disponibles con entrega 24-48h en toda la RD.</p>
          <p className="text-xs text-gray-400 mb-4">directo del fabricante · Pago seguro AZUL · Sin complicaciones</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/esfericos" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
              Ver todos los lentes disponibles →
            </Link>
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">
              Calcular mi receta gratis
            </a>
            <a href="https://wa.me/18096942268?text=Hola%2C%20no%20s%C3%A9%20si%20elegir%20lentes%20diarios%20o%20mensuales%2C%20%C2%BFme%20asesoran%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Asesoría WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
