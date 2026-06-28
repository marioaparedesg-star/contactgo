export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cómo usar lentes de contacto por primera vez — Guía 2026',
  description: 'Guía paso a paso para principiantes: cómo ponerse, quitarse y cuidar tus primeros lentes de contacto. Consejos de especialistas para usuarios en RD.',
  alternates: { canonical: 'https://www.contactgo.net/blog/como-usar-lentes-de-contacto-primera-vez' },
  openGraph: {
    type: 'article',
    title: 'Cómo usar lentes de contacto por primera vez',
    description: 'Guía completa paso a paso para principiantes. Desde ponérselos hasta cuidarlos correctamente.',
    url: 'https://www.contactgo.net/blog/como-usar-lentes-de-contacto-primera-vez',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/como-usar-lentes-contacto-primera-vez.webp', width: 1200, height: 630, alt: 'Cómo usar lentes de contacto por primera vez — guía ContactGo' }],
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
            "@type": ["Article", "HowTo"],
            "headline": "Cómo usar lentes de contacto por primera vez — Guía completa",
            "description": "Guía paso a paso para principiantes sobre cómo ponerse, quitarse y cuidar lentes de contacto.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/como-usar-lentes-de-contacto-primera-vez",
            "inLanguage": "es-DO",
            "step": [
              { "@type": "HowToStep", "name": "Lávate las manos", "text": "Lava tus manos con agua y jabón durante al menos 20 segundos antes de tocar los lentes." },
              { "@type": "HowToStep", "name": "Abre el estuche o empaque", "text": "Si son mensuales, abre el estuche con cuidado. Si son diarios, abre el blíster desde la pestaña." },
              { "@type": "HowToStep", "name": "Verifica el lente", "text": "Coloca el lente en la punta de tu dedo índice. Debe tener forma de cuenco con los bordes apuntando hacia arriba." },
              { "@type": "HowToStep", "name": "Coloca el lente", "text": "Con el dedo medio baja el párpado inferior. Mira hacia arriba y coloca suavemente el lente sobre la parte blanca del ojo." },
              { "@type": "HowToStep", "name": "Parpadea y ajusta", "text": "Parpadea suavemente varias veces para que el lente se acomode sobre la córnea." }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Duele ponerse lentes de contacto por primera vez?", "acceptedAnswer": { "@type": "Answer", "text": "No, no debe doler. Puede haber una sensación leve de cuerpo extraño durante los primeros minutos mientras te adaptas, pero no debe haber dolor. Si hay dolor, retira el lente inmediatamente." } },
              { "@type": "Question", "name": "¿Cuánto tiempo tarda adaptarse a los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "La mayoría de personas se adaptan en 1-2 semanas. Al principio puedes comenzar con 4-6 horas al día y aumentar gradualmente hasta llegar al uso completo." } },
              { "@type": "Question", "name": "¿Qué solución necesito para los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Para lentes quincenales y mensuales necesitas una solución multipropósito como Opti-Free Puremoist o Dream Eye. Los lentes diarios no necesitan solución ya que se descartan al final del día." } },
              { "@type": "Question", "name": "¿Puedo dormir con mis primeros lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "No. La gran mayoría de lentes de contacto no están aprobados para dormir. Durmiendo con ellos reduces drásticamente el oxígeno a la córnea y aumentas el riesgo de infecciones graves." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Cómo usar lentes por primera vez", "item": "https://www.contactgo.net/blog/como-usar-lentes-de-contacto-primera-vez" }
            ]
          }
        ]) }} />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Primera vez con lentes</span>
        </div>

        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Guía para principiantes</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Cómo usar lentes de contacto por primera vez: guía paso a paso
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
          <a href="/autor/equipo-contactgo" className="hover:text-primary-600">✍️ Equipo ContactGo</a>
          <span>·</span>
          <span>⏱ 10 min lectura</span>
        </div>

        {/* TOC */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[
              ['antes', 'Antes de comenzar'],
              ['ponerse', 'Cómo ponerse los lentes paso a paso'],
              ['quitarse', 'Cómo quitarse los lentes'],
              ['cuidado', 'Cuidado y limpieza'],
              ['adaptacion', 'El período de adaptación'],
              ['errores', 'Errores más comunes de principiantes'],
              ['senales', 'Señales de alarma'],
              ['faq', 'Preguntas frecuentes'],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <p>Usar <strong>lentes de contacto por primera vez</strong> puede parecer intimidante — la idea de poner algo directamente sobre el ojo genera nerviosismo en casi todo el mundo. Pero la realidad es que con la técnica correcta, la mayoría de personas lo dominan en pocos intentos. Esta guía te explica exactamente qué necesitas saber para empezar con lentes de contacto de manera segura y cómoda en República Dominicana.</p>

          {/* Sección: Antes */}
          <section id="antes">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Antes de comenzar: lo que necesitas tener</h2>
            <p>Antes de tu primera experiencia con lentes de contacto, asegúrate de tener lo siguiente:</p>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { icono: '👁️', item: 'Prescripción óptica específica para lentes de contacto', desc: 'Distinta a la receta de gafas. Incluye BC (radio de curvatura), DIA (diámetro) y SPH/CYL.' },
                { icono: '💧', item: 'Solución multipropósito', desc: 'Para limpiar y almacenar lentes quincenales y mensuales. Marcas como Opti-Free Puremoist o Dream Eye. Los lentes diarios no la necesitan.' },
                { icono: '🫙', item: 'Estuche para lentes', desc: 'Generalmente viene incluido con la solución. Limpiarlo y cambiarlo regularmente es fundamental.' },
                { icono: '🪞', item: 'Espejo a nivel de los ojos', desc: 'Al principio es mucho más fácil con un espejo que se pueda colocar de frente, no inclinado.' },
                { icono: '💡', item: 'Buena iluminación', desc: 'Asegúrate de tener luz suficiente para ver bien lo que estás haciendo.' },
              ].map(({ icono, item, desc }, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg shrink-0">{icono}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{item}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Sección: Ponerse */}
          <section id="ponerse">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo ponerse los lentes de contacto paso a paso</h2>
            <p>La técnica correcta es la clave. Al principio puede tomar 5-10 minutos, pero con práctica llegarás a hacerlo en segundos.</p>

            <div className="mt-4 space-y-4">
              {[
                {
                  num: '1',
                  titulo: 'Lávate las manos — siempre primero',
                  contenido: 'Lava tus manos con agua y jabón durante al menos 20 segundos. Usa un jabón neutro sin perfume ni cremas. Sécalas completamente con una toalla limpia o papel de cocina que no deje pelusas. Este paso es no negociable — las manos sucias son la causa número 1 de infecciones por lentes de contacto.',
                  color: 'bg-blue-50 border-blue-100',
                },
                {
                  num: '2',
                  titulo: 'Prepara y verifica el lente',
                  contenido: 'Abre el estuche o el blíster con cuidado. Si es un lente mensual o quincenal, usa la solución para aclararlo. Coloca el lente en la punta de tu dedo índice dominante. Ahora observa su forma: debe verse como un cuenco perfecto con los bordes apuntando hacia arriba. Si los bordes se doblan hacia afuera como si fuera un platillo volador, el lente está al revés.',
                  color: 'bg-green-50 border-green-100',
                },
                {
                  num: '3',
                  titulo: 'Abre bien el ojo',
                  contenido: 'Con tu mano no dominante, usa el dedo medio para subir el párpado superior. Con el dedo medio de tu mano dominante (la que sostiene el lente), baja el párpado inferior. El truco es abrir el espacio entre los párpados lo suficiente para que el lente entre sin problema. Intenta no parpadear en este momento.',
                  color: 'bg-amber-50 border-amber-100',
                },
                {
                  num: '4',
                  titulo: 'Coloca el lente',
                  contenido: 'Mira hacia arriba o hacia a un punto fijo frente a ti. Acerca el dedo con el lente hacia el ojo desde abajo y toca suavemente la parte blanca del ojo (la esclerótica), no directamente la pupila. Esto te resultará más fácil al principio. El lente se adhiere naturalmente al ojo por la humedad.',
                  color: 'bg-purple-50 border-purple-100',
                },
                {
                  num: '5',
                  titulo: 'Parpadea y centra',
                  contenido: 'Suelta los párpados suavemente y parpadea varias veces. El lente debería centrarse automáticamente sobre la córnea. Si no ves con claridad, el lente puede estar descentrado — cierra el ojo y muévelo suavemente con el párpado hasta que se centre.',
                  color: 'bg-teal-50 border-teal-100',
                },
                {
                  num: '6',
                  titulo: 'Repite con el otro ojo',
                  contenido: 'Siempre empieza por el mismo ojo (establece un hábito: siempre el derecho primero, o siempre el izquierdo) para evitar confundir los lentes.',
                  color: 'bg-gray-50 border-gray-100',
                },
              ].map(({ num, titulo, contenido, color }, i) => (
                <div key={i} className={`border ${color} rounded-2xl p-4`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                      {num}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{titulo}</h3>
                      <p className="text-sm text-gray-600">{contenido}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm">
              <p className="font-bold text-primary-800 mb-1">💡 Truco para principiantes</p>
              <p className="text-primary-700">Si llevas 5 minutos intentándolo y el lente no entra, respira, pon el lente de vuelta en la solución y descansa 30 segundos. El estrés hace que el ojo parpadee más y sea más difícil. La calma es tu mejor aliada.</p>
            </div>
          </section>

          {/* Sección: Quitarse */}
          <section id="quitarse">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo quitarse los lentes de contacto</h2>
            <p>Quitarse los lentes es generalmente más fácil que ponérselos, pero también requiere técnica correcta.</p>
            <div className="mt-4 space-y-3">
              {[
                { paso: '1', texto: 'Lávate las manos (siempre, sin excepción).' },
                { paso: '2', texto: 'Mira hacia arriba. Con el dedo índice de tu mano dominante, toca el borde inferior del lente y deslízalo suavemente hacia abajo, hacia la parte blanca del ojo.' },
                { paso: '3', texto: 'Una vez en la esclerótica, pellizca suavemente el lente entre el pulgar y el índice y retíralo.' },
                { paso: '4', texto: 'Si es un lente reutilizable, deposítalo en el estuche con solución fresca. Si es diario, deséchalo.' },
              ].map(({ paso, texto }) => (
                <div key={paso} className="flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">{paso}</span>
                  <p>{texto}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm bg-red-50 border border-red-100 rounded-xl p-3"><strong>⚠️ Nunca</strong> intentes pellizcar el lente directamente sobre la córnea. Siempre deslízalo primero hacia la parte blanca del ojo.</p>
          </section>

          {/* Sección: Cuidado */}
          <section id="cuidado">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cuidado y limpieza de los lentes</h2>
            <p>Para lentes quincenales y mensuales, la limpieza diaria es fundamental. El protocolo correcto es:</p>
            <ol className="mt-3 space-y-2 text-sm list-decimal list-inside">
              <li>Al retirar el lente, colócalo en la palma de tu mano.</li>
              <li>Aplica unas gotas de solución multipropósito.</li>
              <li>Frótalo suavemente durante 20 segundos en movimientos circulares con el dedo índice.</li>
              <li>Enjuaga con solución fresca.</li>
              <li>Colócalo en el estuche limpio con solución fresca — nunca reutilices la solución del día anterior.</li>
            </ol>

            <h3 className="font-bold text-gray-900 mt-5 mb-3">¿Qué solución usar?</h3>
            <p className="text-sm">Las soluciones multipropósito más recomendadas en República Dominicana son:</p>
            <div className="mt-3 space-y-2">
              {[
                { nombre: 'Opti-Free Puremoist', desc: 'De Alcon. Excelente para ojos secos. Disponible en 90ml y 300ml.', link: '/producto/opti-free-puremoist-solucion-multiproposito-dominicana' },
                { nombre: 'Dream Eye 80ml', desc: 'Solución multipropósito accesible y efectiva para uso diario.', link: '/producto/dream-eye-solucion-lentes-contacto-dominicana' },
                { nombre: 'Prolub Hyfresh', desc: 'Opción de alta hidratación para usuarios con ojos secos.', link: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana' },
              ].map(({ nombre, desc, link }) => (
                <Link key={link} href={link} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{nombre}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <span className="text-primary-600 text-xs font-bold">Ver →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Sección: Adaptación */}
          <section id="adaptacion">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">El período de adaptación</h2>
            <p>Es normal que los primeros días con lentes de contacto sientas una ligera incomodidad o sensación de cuerpo extraño. Esto es parte del proceso de adaptación natural del ojo.</p>

            <h3 className="font-bold text-gray-900 mt-4 mb-2">Programa de adaptación recomendado:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Semana</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Horas de uso</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Qué esperar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1ª semana', '4-6 horas/día', 'Sensación leve de cuerpo extraño. Normal.'],
                    ['2ª semana', '6-8 horas/día', 'La sensación disminuye. El ojo se adapta.'],
                    ['3ª semana', '8-10 horas/día', 'Ya apenas notas el lente.'],
                    ['4ª semana+', 'Uso completo (hasta 12-14h)', 'Adaptación completa.'],
                  ].map(([semana, horas, desc], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-medium">{semana}</td>
                      <td className="p-3 border border-gray-100">{horas}</td>
                      <td className="p-3 border border-gray-100 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Errores comunes */}
          <section id="errores">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Errores más comunes de principiantes</h2>
            <div className="space-y-3 text-sm">
              {[
                { error: 'No lavarse las manos antes de manipular los lentes', riesgo: 'ALTO', solucion: 'Siempre lavarse con agua y jabón. Sin excepción.' },
                { error: 'Confundir qué lente va en cada ojo', riesgo: 'MEDIO', solucion: 'Establece un hábito: siempre el mismo ojo primero. Si la graduación es diferente en cada ojo, tenlo presente.' },
                { error: 'Usar agua del grifo en lugar de solución', riesgo: 'ALTO', solucion: 'El agua puede contener microorganismos como Acanthamoeba. Solo solución multipropósito.' },
                { error: 'Intentarlo cuando tienes mucho sueño o prisa', riesgo: 'BAJO', solucion: 'Practica cuando estés tranquilo y descansado. El estrés complica el proceso.' },
                { error: 'Poner el lente al revés', riesgo: 'BAJO', solucion: 'Aprende a verificar la forma de cuenco vs platillo. La marca de orientación (si la tiene) también ayuda.' },
                { error: 'Usar los lentes más horas de las recomendadas', riesgo: 'ALTO', solucion: 'Comienza con pocas horas y aumenta gradualmente. Nunca superes las 12-14h de uso diario.' },
              ].map(({ error, riesgo, solucion }, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-bold text-gray-900 text-sm">❌ {error}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${riesgo === 'ALTO' ? 'bg-red-100 text-red-700' : riesgo === 'MEDIO' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      Riesgo {riesgo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">✅ <strong>Solución:</strong> {solucion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Señales de alarma */}
          <section id="senales">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Señales de alarma: cuándo quitarte el lente</h2>
            <p>Retira los lentes inmediatamente y consulta a un especialista si experimentas:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                'Dolor ocular intenso o que no cede',
                'Visión borrosa que no mejora al parpadear',
                'Enrojecimiento excesivo o que empeora',
                'Sensación de ardor o picazón intensa',
                'Secreción o lagrimeo anormal',
                'Sensibilidad extrema a la luz',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm bg-red-50 border border-red-200 rounded-xl p-3">Si experimentas alguno de estos síntomas, <strong>retira el lente inmediatamente</strong> y consulta a tu oftalmólogo u optometrista. La visión es demasiado importante para ignorar señales de alarma.</p>
          </section>

          {/* Resumen */}
          <section className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">📝 Resumen para principiantes</h2>
            <ul className="space-y-1.5 text-sm">
              {[
                'Siempre lavarse las manos antes de tocar los lentes.',
                'Verificar que el lente no esté al revés (debe tener forma de cuenco).',
                'Comenzar con pocas horas y aumentar gradualmente.',
                'Nunca usar agua del grifo ni solución reutilizada.',
                'Quitarse los lentes antes de dormir.',
                'Si hay dolor o visión borrosa persistente, retirar y consultar al especialista.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Artículos relacionados */}
          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900 text-lg">Artículos que pueden interesarte</h3>
            {[
              { href: '/blog/que-son-los-lentes-de-contacto', titulo: '→ Qué son los lentes de contacto', desc: 'Guía completa sobre tipos y materiales' },
              { href: '/blog/como-limpiar-lentes-de-contacto', titulo: '→ Cómo limpiar correctamente los lentes', desc: 'Protocolo de limpieza paso a paso' },
              { href: '/blog/dormir-con-lentes-de-contacto-riesgos', titulo: '→ Por qué no debes dormir con lentes', desc: 'Los riesgos reales de dormir con ellos' },
              { href: '/blog/cuanto-tiempo-usar-lentes-de-contacto', titulo: '→ Cuántas horas puedo usar lentes al día', desc: 'Límites de uso según el tipo de lente' },
              { href: '/soluciones', titulo: '→ Soluciones para lentes disponibles en ContactGo', desc: 'Opti-Free, Dream Eye y más' },
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
                { q: '¿Duele ponerse lentes de contacto por primera vez?', a: 'No, no debe doler. Puede haber una sensación leve de cuerpo extraño durante los primeros minutos mientras te adaptas, pero no debe haber dolor. Si hay dolor, retira el lente inmediatamente y consulta a tu especialista.' },
                { q: '¿Cuánto tiempo tarda adaptarse a los lentes de contacto?', a: 'La mayoría de personas se adaptan en 1-2 semanas. Al principio puedes comenzar con 4-6 horas al día y aumentar gradualmente hasta llegar al uso completo de 12-14 horas.' },
                { q: '¿Qué solución necesito para los lentes de contacto?', a: 'Para lentes quincenales y mensuales necesitas una solución multipropósito. Los más usados en RD son Opti-Free Puremoist y Dream Eye, disponibles en ContactGo. Los lentes diarios no necesitan solución.' },
                { q: '¿Puedo dormir con mis primeros lentes de contacto?', a: 'No. La gran mayoría de lentes no están aprobados para dormir con ellos. Durmiendo con lentes reduces el oxígeno a la córnea drásticamente y aumentas el riesgo de infecciones graves.' },
                { q: '¿Qué hago si el lente se me cae al suelo?', a: 'Si es un lente diario, deséchalo. Si es reutilizable, enjuágalo con abundante solución multipropósito (nunca agua del grifo) antes de volver a usarlo. Si tiene algún daño visible, no lo uses.' },
                { q: '¿Puedo nadar con lentes de contacto?', a: 'No se recomienda. El agua de piscinas, el mar y ríos puede contener microorganismos que se adhieren al lente y causan infecciones graves. Si necesitas ver bien para nadar, usa gafas de natación graduadas.' },
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
            <p>Usar lentes de contacto por primera vez es más sencillo de lo que parece. La clave está en la higiene, la paciencia durante el período de adaptación y en respetar siempre las indicaciones de uso. Miles de dominicanos los usan a diario sin ningún problema.</p>
            <p className="mt-3">Si estás buscando tus primeros lentes de contacto, en ContactGo encontrarás las mejores marcas — ACUVUE, Air Optix, Biofinity y más — con entrega directa a tu puerta en 24-48 horas. ¿No sabes cuál elegir? Usa nuestra <a href="/receta" className="text-primary-600 font-semibold hover:underline">calculadora de receta</a> o escríbenos por WhatsApp y te asesoramos.</p>
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
              <p className="text-gray-600">Escrito por el <strong>Equipo ContactGo</strong>, Especialistas en Salud Visual · <span className="text-gray-400">Revisado: junio 2026</span></p>
            </div>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900">
          <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta con un optometrista u oftalmólogo. Los lentes de contacto son dispositivos médicos que requieren adaptación profesional. Consulta siempre a tu especialista antes de comenzar.
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">¿Listo para tus primeros lentes de contacto?</h3>
          <p className="text-sm text-gray-600 mb-4">Todos los productos que necesitas: lentes 100% originales y soluciones de limpieza. Entrega en 24-48h en toda la República Dominicana.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/esfericos" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
              Ver lentes esféricos →
            </Link>
            <Link href="/soluciones" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">
              Ver soluciones de limpieza
            </Link>
            <a href="https://wa.me/18294728328?text=Hola%2C%20es%20mi%20primera%20vez%20comprando%20lentes%20de%20contacto%2C%20%C2%BFme%20pueden%20asesorar%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Asesoría por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
