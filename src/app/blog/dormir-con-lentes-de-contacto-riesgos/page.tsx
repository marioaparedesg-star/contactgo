export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dormir con lentes de contacto: riesgos y consecuencias 2026',
  description: 'Los peligros reales de dormir con lentes de contacto. Qué le pasa a tu ojo, qué hacer si se te olvidó quitártelos y cuándo es la única excepción. Guía médica.',
  alternates: { canonical: 'https://www.contactgo.net/blog/dormir-con-lentes-de-contacto-riesgos' },
  openGraph: {
    type: 'article',
    title: 'Dormir con lentes de contacto: riesgos reales',
    description: 'Los riesgos médicos reales de dormir con lentes de contacto y qué hacer si se te olvidó quitártelos.',
    url: 'https://www.contactgo.net/blog/dormir-con-lentes-de-contacto-riesgos',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/dormir-con-lentes-contacto.webp', width: 1200, height: 630, alt: 'Riesgos de dormir con lentes de contacto' }],
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
            "headline": "Dormir con lentes de contacto: riesgos y consecuencias",
            "description": "Los peligros médicos reales de dormir con lentes de contacto y qué hacer si se te olvidó quitártelos.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/dormir-con-lentes-de-contacto-riesgos",
            "inLanguage": "es-DO"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Qué pasa si duermo con lentes de contacto una noche?", "acceptedAnswer": { "@type": "Answer", "text": "Una sola noche aumenta el riesgo de infección ocular hasta 8 veces. Al despertar es normal encontrar el lente pegado o sentir molestia. Aplica solución para hidratarlo antes de retirarlo suavemente." } },
              { "@type": "Question", "name": "¿Se puede morir por dormir con lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "No directamente, pero las infecciones graves como la queratitis por Acanthamoeba, favorecida por dormir con lentes, pueden causar pérdida permanente de visión en casos severos sin tratamiento." } },
              { "@type": "Question", "name": "¿Existen lentes de contacto para dormir?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, existen lentes de ortoqueratología (OK o Ortho-K) diseñados específicamente para usarse durante la noche. Son lentes rígidos que remodelan temporalmente la córnea. Deben ser prescritos y adaptados por un especialista." } },
              { "@type": "Question", "name": "¿Qué hago si me dormí con los lentes puestos?", "acceptedAnswer": { "@type": "Answer", "text": "Al despertar, no los retires de inmediato. Aplica gotas lubricantes o solución salina para reidratarlos. Parpadea varias veces. Cuando el lente se sienta libre de moverse, retíralo suavemente. Descansa tus ojos al menos 1 hora sin lentes." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Dormir con lentes de contacto", "item": "https://www.contactgo.net/blog/dormir-con-lentes-de-contacto-riesgos" }
            ]
          }
        ]) }} />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Dormir con lentes: riesgos</span>
        </div>

        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Salud ocular</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          ¿Qué pasa si duermes con lentes de contacto? Riesgos reales
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Especialistas en salud visual · Revisado por optometrista certificado</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
          <span>📅 1 de junio, 2026</span>
          <span>·</span>
          <span>⏱ 9 min lectura</span>
        </div>

        {/* Alerta de salud */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-800 text-sm">Aviso de salud importante</p>
              <p className="text-red-700 text-sm mt-1">Dormir con lentes de contacto convencionales <strong>aumenta el riesgo de infección ocular grave hasta 8 veces</strong> según estudios del CDC de EE.UU. Esta guía te explica exactamente qué sucede y qué hacer.</p>
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[
              ['oxigeno', 'Por qué el oxígeno es crítico para la córnea'],
              ['riesgos', 'Los riesgos reales de dormir con lentes'],
              ['infecciones', 'Infecciones más peligrosas asociadas'],
              ['que-hacer', 'Qué hacer si te dormiste con los lentes puestos'],
              ['excepcion', 'La única excepción: lentes de ortho-K'],
              ['mitos', 'Mitos y verdades'],
              ['prevencion', 'Cómo nunca más olvidar quitártelos'],
              ['faq', 'Preguntas frecuentes'],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>Probablemente te ha pasado más de una vez: te quedas dormido viendo televisión o por un descuido llegas a la cama sin quitarte los <strong>lentes de contacto</strong>. Al día siguiente, el ojo irritado y el lente pegado te recuerdan que cometiste un error. Pero, ¿qué tan grave es realmente? ¿Una noche es suficiente para causar daño permanente? Esta guía te explica exactamente qué sucede en tu ojo cuando duermes con lentes y cuáles son los riesgos reales.</p>

          {/* Sección 1 */}
          <section id="oxigeno">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Por qué el oxígeno es crítico para la córnea</h2>
            <p>Para entender por qué dormir con lentes es peligroso, primero debes entender algo fundamental sobre la córnea: <strong>es el único tejido del cuerpo humano que obtiene su oxígeno directamente del aire</strong>, no de los vasos sanguíneos (porque no tiene ninguno — si los tuviera, bloquearían la visión).</p>
            <p className="mt-3">Durante el día, cuando tienes los ojos abiertos, la córnea recibe oxígeno del aire ambiente. Cuando parpadeas, la película lacrimal distribuye este oxígeno uniformemente. Incluso de noche, aunque el ojo está cerrado, recibe algo de oxígeno a través del párpado.</p>
            <p className="mt-3">Cuando llevas un lente de contacto, <strong>reduces este suministro de oxígeno</strong>. Cuánto depende del material:</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Material</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Dk/t (oxígeno)</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Riesgo al dormir</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Hidrogel convencional', '20-30', 'MUY ALTO — oxígeno insuficiente'],
                    ['Silicona hidrogel estándar', '100-150', 'ALTO — aunque mejor, sigue siendo riesgoso'],
                    ['Silicona hidrogel alta Dk', '150+', 'MEDIO — algunos aprobados para uso nocturno ocasional'],
                    ['Lentes de ortoqueratología (OK)', 'Diseñados para ello', 'APROBADOS para uso nocturno únicamente'],
                  ].map(([mat, dk, riesgo], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{mat}</td>
                      <td className="p-3 border border-gray-100 text-center">{dk}</td>
                      <td className={`p-3 border border-gray-100 text-sm font-medium ${riesgo.includes('MUY') ? 'text-red-600' : riesgo.includes('ALTO') ? 'text-orange-600' : riesgo.includes('MEDIO') ? 'text-amber-600' : 'text-green-600'}`}>{riesgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sección 2 */}
          <section id="riesgos">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Los riesgos reales de dormir con lentes de contacto</h2>
            <p>Según el Centro para el Control y la Prevención de Enfermedades (CDC) de los Estados Unidos, el 99% de las personas que usan lentes de contacto tienen al menos un hábito de riesgo, y dormir con lentes es el más peligroso de todos.</p>
            <div className="space-y-4 mt-4">
              {[
                {
                  nivel: 'RIESGO ALTO',
                  color: 'border-red-200 bg-red-50',
                  titulo: '1. Hipoxia corneal (falta de oxígeno)',
                  desc: 'Durante el sueño, ya de por sí la córnea recibe menos oxígeno porque el ojo está cerrado. Al añadir un lente de contacto encima, la situación empeora drásticamente. La respuesta del cuerpo es intentar llevar oxígeno a la córnea creando nuevos vasos sanguíneos — un proceso llamado neovascularización corneal que puede dañar la visión de forma permanente.',
                },
                {
                  nivel: 'RIESGO MUY ALTO',
                  color: 'border-red-300 bg-red-50',
                  titulo: '2. Acumulación de bacterias y microorganismos',
                  desc: 'Durante el día, el parpadeo ayuda a eliminar bacterias. De noche, con el ojo cerrado y el lente actuando como "trampa" de microorganismos, las bacterias tienen 6-8 horas para multiplicarse sin interrupciones. Esto crea el ambiente perfecto para una infección.',
                },
                {
                  nivel: 'RIESGO ALTO',
                  color: 'border-orange-200 bg-orange-50',
                  titulo: '3. Microrrasguños en la córnea',
                  desc: 'Al dormir, los movimientos oculares normales y el rozamiento del párpado con el lente pueden crear pequeñas abrasiones en la superficie corneal. Estas microfisuras son puertas de entrada para las bacterias.',
                },
                {
                  nivel: 'RIESGO MEDIO',
                  color: 'border-amber-200 bg-amber-50',
                  titulo: '4. Ojo seco y molestias matutinas',
                  desc: 'Al despertar con lentes puestos, el ojo suele estar seco y el lente puede estar "pegado" a la córnea. Intentar retirarlo a la fuerza sin hidratarlo primero puede causar abrasiones cornéales.',
                },
              ].map(({ nivel, color, titulo, desc }, i) => (
                <div key={i} className={`border rounded-2xl p-4 ${color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{nivel}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{titulo}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm">
              <p className="font-bold text-gray-900 mb-1">📊 El dato que lo cambia todo</p>
              <p>Según un estudio publicado en la revista <em>Ophthalmology</em>, las personas que duermen con lentes de contacto tienen <strong>6 a 8 veces más probabilidades</strong> de desarrollar queratitis (inflamación de la córnea) que las que se los quitan correctamente cada noche.</p>
            </div>
          </section>

          {/* Sección 3 */}
          <section id="infecciones">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Las infecciones más peligrosas asociadas</h2>
            <div className="space-y-4">
              {[
                {
                  nombre: 'Queratitis bacteriana',
                  peligro: '⭐⭐⭐⭐',
                  desc: 'La infección más común. Causada por bacterias como Staphylococcus o Pseudomonas. Síntomas: ojo rojo intenso, dolor, sensación de cuerpo extraño, secreción. Requiere tratamiento inmediato con antibióticos tópicos.',
                },
                {
                  nombre: 'Queratitis por Acanthamoeba',
                  peligro: '⭐⭐⭐⭐⭐',
                  desc: 'La más grave. Causada por un microorganismo que vive en agua (piscinas, agua del grifo). Extremadamente difícil de tratar y puede causar pérdida de visión permanente. Especialmente relacionada con uso de agua no estéril en lentes y con dormir con lentes puestos.',
                },
                {
                  nombre: 'Úlcera corneal',
                  peligro: '⭐⭐⭐⭐⭐',
                  desc: 'Lesión abierta en la superficie de la córnea causada por infección sin tratar. Puede dejar cicatriz permanente afectando la visión. Requiere atención médica urgente.',
                },
                {
                  nombre: 'Conjuntivitis infecciosa',
                  peligro: '⭐⭐⭐',
                  desc: 'Inflamación de la conjuntiva. Menos grave pero muy contagiosa y molesta. Los lentes aumentan el riesgo al actuar como reservorio de bacterias.',
                },
              ].map(({ nombre, peligro, desc }, i) => (
                <div key={i} className="border border-red-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{nombre}</h3>
                    <span className="text-xs text-red-500 font-bold">Peligrosidad: {peligro}</span>
                  </div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 4 */}
          <section id="que-hacer">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Qué hacer si te dormiste con los lentes puestos</h2>
            <p>Primero lo más importante: <strong>no entres en pánico</strong>. Una noche es preocupante, pero con el protocolo correcto puedes minimizar el daño.</p>
            <div className="mt-4 space-y-3">
              {[
                { paso: '1', titulo: 'No los retires inmediatamente', desc: 'El ojo está seco y el lente puede estar adherido a la córnea. Forzarlo puede causar abrasiones.' },
                { paso: '2', titulo: 'Aplica gotas lubricantes o solución salina', desc: 'Varias veces durante 5-10 minutos. Esto rehidrata el lente y la superficie ocular.' },
                { paso: '3', titulo: 'Parpadea suavemente', desc: 'Cuando el lente se mueva libremente, ya puedes retirarlo con cuidado.' },
                { paso: '4', titulo: 'Descansa el ojo', desc: 'No vuelvas a ponerte lentes ese día. Usa tus gafas si las tienes.' },
                { paso: '5', titulo: 'Observa los síntomas', desc: 'Si tienes dolor, visión borrosa persistente, enrojecimiento intenso o secreción en las siguientes 24-48h, consulta al oftalmólogo.' },
                { paso: '6', titulo: 'Desecha el lente si es reutilizable', desc: 'Un lente que ha estado toda la noche en el ojo debe desecharse aunque le quede vida útil.' },
              ].map(({ paso, titulo, desc }) => (
                <div key={paso} className="flex items-start gap-3 text-sm p-3 bg-blue-50 rounded-xl">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">{paso}</span>
                  <div><strong className="text-gray-900">{titulo}:</strong> <span className="text-gray-600">{desc}</span></div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 5 */}
          <section id="excepcion">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">La única excepción: lentes de ortoqueratología (Ortho-K)</h2>
            <p>Existe un tipo especial de lentes de contacto diseñados <strong>exclusivamente</strong> para usarse durante la noche: los lentes de ortoqueratología (Ortho-K o OK lens).</p>
            <p className="mt-3">Son lentes rígidos permeables al gas que, al usarse durante el sueño, remodelan suavemente la córnea para corregir temporalmente la miopía. Al retirarlos por la mañana, la persona puede ver con claridad sin ninguna corrección durante el día.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-3 text-sm">
              <p className="font-bold text-green-800">✅ Lentes de orto-K — solo con prescripción especializada</p>
              <p className="text-green-700 mt-1">Si te interesa esta opción, debes consultar con un especialista en ortoqueratología. Requieren un proceso de adaptación específico y seguimiento profesional. ContactGo actualmente ofrece lentes de contacto blandos para uso diurno.</p>
            </div>
          </section>

          {/* Mitos y verdades */}
          <section id="mitos">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Mitos y verdades sobre dormir con lentes</h2>
            <div className="space-y-3 text-sm">
              {[
                {
                  mito: 'Si son de silicona hidrogel, es seguro dormir con ellos',
                  verdad: false,
                  explicacion: 'FALSO. Aunque la silicona hidrogel transmite más oxígeno, la FDA solo aprueba algunos modelos específicos de uso extendido para dormir ocasionalmente. La mayoría de lentes de silicona hidrogel cotidianos NO están aprobados para uso nocturno.',
                },
                {
                  mito: 'Una siesta corta no hace daño',
                  verdad: false,
                  explicacion: 'PARCIALMENTE FALSO. Una siesta de 20-30 minutos no es tan peligrosa como una noche completa, pero sigue siendo un riesgo. Si habitualmente duermes siestas, consúltalo con tu especialista.',
                },
                {
                  mito: 'Solo me pasa algo si llevo años haciéndolo',
                  verdad: false,
                  explicacion: 'FALSO. Las infecciones oculares graves pueden desarrollarse en cuestión de horas. No hace falta ser un hábito crónico para sufrir consecuencias serias.',
                },
                {
                  mito: 'Si no siento molestias, no hay problema',
                  verdad: false,
                  explicacion: 'FALSO. Muchas infecciones inicialmente no producen síntomas intensos. Para cuando el dolor es notable, la infección puede estar avanzada.',
                },
                {
                  mito: 'Dormir con lentes daña permanentemente la visión',
                  verdad: true,
                  explicacion: 'PUEDE SER VERDAD en casos graves no tratados. La queratitis severa o las úlceras corneales sin tratamiento adecuado pueden dejar cicatrices permanentes que afectan la visión. Sin embargo, la mayoría de casos tratados a tiempo se resuelven sin secuelas.',
                },
              ].map(({ mito, verdad, explicacion }, i) => (
                <div key={i} className={`border rounded-xl p-4 ${verdad ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${verdad ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {verdad ? '⚠️ PUEDE SER CIERTO' : '❌ MITO'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">"{mito}"</p>
                  <p className="text-gray-600 text-xs">{explicacion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Prevención */}
          <section id="prevencion">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo nunca más olvidar quitarte los lentes</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Establece una rutina de noche — siempre los lentes antes que el cepillo de dientes.',
                'Pon el estuche de los lentes junto a tu cepillo o en el baño como recordatorio visual.',
                'Usa los recordatorios de tu teléfono para la hora que normalmente vas a dormir.',
                'Si usas lentes mensuales o quincenales, pon el estuche con solución lista en el baño.',
                'Considera pasarte a lentes diarios si frecuentemente olvidas quitártelos — el ritual de descartarlos es más definitivo.',
                'Si sabes que vas a llegar tarde a casa, lleva el estuche contigo.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-primary-600">💡</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Artículos relacionados */}
          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>
            {[
              { href: '/blog/infecciones-lentes-de-contacto', titulo: '→ Cómo prevenir infecciones por lentes de contacto', desc: 'Guía completa de higiene y prevención' },
              { href: '/blog/como-limpiar-lentes-de-contacto', titulo: '→ Cómo limpiar correctamente los lentes', desc: 'El protocolo de limpieza correcto' },
              { href: '/blog/cuanto-tiempo-usar-lentes-de-contacto', titulo: '→ Cuántas horas puedo usar lentes al día', desc: 'Los límites de uso recomendados' },
              { href: '/blog/como-usar-lentes-de-contacto-primera-vez', titulo: '→ Guía para principiantes', desc: 'Todo lo que necesitas saber al empezar' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {[
                { q: '¿Qué pasa si duermo con lentes de contacto una noche?', a: 'Una sola noche aumenta el riesgo de infección hasta 8 veces. Al despertar, aplica solución para hidratar el lente antes de retirarlo. Observa los síntomas durante las siguientes 24-48 horas y descansa el ojo.' },
                { q: '¿Cuánto tiempo puede durar el daño?', a: 'Depende de si se produce infección y de su gravedad. Una infección bacteriana tratada a tiempo generalmente se resuelve en días sin secuelas. Una queratitis grave sin tratar puede dejar daño permanente.' },
                { q: '¿Existen lentes de contacto para dormir?', a: 'Sí, los lentes de ortoqueratología (Ortho-K) están diseñados para usarse de noche y remodelан la córnea mientras duermes. Deben ser prescritos por un especialista.' },
                { q: '¿Qué hago si me dormí con los lentes puestos?', a: 'No los retires de inmediato. Aplica gotas lubricantes o solución salina y parpadea suavemente hasta que el lente se mueva con libertad. Luego retíralo con cuidado y descansa los ojos.' },
                { q: '¿Puedo dormir una siesta corta con lentes?', a: 'Aunque una siesta muy corta es menos riesgosa que una noche completa, sigue siendo un riesgo. Si tiendes a dormir siestas, consulta con tu especialista sobre qué tipo de lente usar.' },
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

          {/* Conclusión */}
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Conclusión</h2>
            <p>La regla es clara: <strong>nunca duermas con lentes de contacto convencionales</strong>. El riesgo simplemente no vale la pena. Una infección ocular grave puede tratarse, pero en casos severos puede dejar secuelas permanentes. Y la visión es demasiado valiosa para arriesgarla por algo tan evitable.</p>
            <p className="mt-3">Si frecuentemente olvidas quitarte los lentes, considera los lentes <Link href="/esfericos" className="text-primary-600 hover:underline font-semibold">diarios</Link> — al final del día los descartas y nunca hay lente que quitarse. En ContactGo los encontrarás disponibles con entrega en 24-48h en toda República Dominicana.</p>
          </section>
        </div>

        {/* Medical badge */}
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-0.5">Información médica verificada</p>
              <p className="text-gray-600">Basado en información del <a href="https://www.cdc.gov/contact-lens/about/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">CDC</a> y la <a href="https://www.aao.org/eye-health/tips-prevention/contact-lens-safety" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Academia Americana de Oftalmología</a>. Revisado por Equipo ContactGo, junio 2026.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900">
          <strong>⚠️ Aviso médico:</strong> Si tienes síntomas de infección ocular (dolor, visión borrosa, enrojecimiento intenso, secreción), consulta a un oftalmólogo inmediatamente. No esperes.
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">¿Cansado de preocuparte por los lentes de la noche anterior?</h3>
          <p className="text-sm text-gray-600 mb-4">Los lentes diarios son la solución más higiénica — al final del día los descartas. Sin estuche, sin solución, sin olvidar quitártelos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/esfericos" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
              Ver lentes diarios disponibles →
            </Link>
            <a href="https://wa.me/18096942268?text=Hola%2C%20quiero%20cambiarme%20a%20lentes%20diarios%2C%20%C2%BFme%20pueden%20asesorar%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Asesoría por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
