export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Qué son los lentes de contacto — Guía completa 2026',
  description: 'Todo sobre los lentes de contacto: qué son, cómo funcionan, tipos, materiales y para qué sirven. La guía más completa en español para República Dominicana.',
  alternates: { canonical: 'https://www.contactgo.net/blog/que-son-los-lentes-de-contacto' },
  openGraph: {
    type: 'article',
    title: 'Qué son los lentes de contacto — Guía completa',
    description: 'Todo sobre los lentes de contacto: qué son, tipos, materiales y cómo funcionan. Guía 2026 para República Dominicana.',
    url: 'https://www.contactgo.net/blog/que-son-los-lentes-de-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/que-son-lentes-contacto.webp', width: 1200, height: 630, alt: 'Qué son los lentes de contacto — Guía completa ContactGo' }],
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
            "headline": "Qué son los lentes de contacto — Guía completa 2026",
            "description": "Todo sobre los lentes de contacto: qué son, cómo funcionan, tipos, materiales y para qué sirven.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-01",
            "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/que-son-los-lentes-de-contacto",
            "inLanguage": "es-DO",
            "image": "https://www.contactgo.net/blog/que-son-lentes-contacto.webp",
            "about": { "@type": "MedicalDevice", "name": "Lentes de contacto" },
            "medicalAudience": { "@type": "MedicalAudience", "audienceType": "Patient" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Qué son los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Los lentes de contacto son dispositivos médicos ópticos que se colocan directamente sobre la córnea del ojo para corregir defectos visuales como miopía, hipermetropía, astigmatismo y presbicia, o para cambiar el color de los ojos." } },
              { "@type": "Question", "name": "¿Cuántos tipos de lentes de contacto existen?", "acceptedAnswer": { "@type": "Answer", "text": "Existen principalmente dos grandes categorías: lentes blandos (hidrogel y silicona hidrogel) y lentes rígidos permeables al gas. Los blandos se dividen según su reemplazo en diarios, quincenales y mensuales." } },
              { "@type": "Question", "name": "¿Los lentes de contacto necesitan receta médica?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. Los lentes de contacto graduados requieren una prescripción óptica actualizada, emitida por un optometrista u oftalmólogo. Solo los lentes de color sin graduación pueden adquirirse sin receta." } },
              { "@type": "Question", "name": "¿Cuánto duran los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Depende del tipo: los lentes diarios se descartan al final del día, los quincenales duran 14 días y los mensuales duran 30 días de uso. Nunca se deben usar más allá de su período indicado." } },
              { "@type": "Question", "name": "¿Son seguros los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, cuando se usan correctamente. Son seguros para millones de personas en todo el mundo. La clave está en seguir las instrucciones de uso, higiene y reemplazo indicadas por el fabricante y tu especialista." } },
              { "@type": "Question", "name": "¿Dónde comprar lentes de contacto en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "En ContactGo puedes comprar lentes de contacto 100% originales de ACUVUE, Air Optix, Biofinity, Bausch+Lomb y más marcas con entrega en 24-48 horas a toda República Dominicana." } }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Qué son los lentes de contacto", "item": "https://www.contactgo.net/blog/que-son-los-lentes-de-contacto" }
            ]
          }
        ]) }} />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Qué son los lentes de contacto</span>
        </div>

        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Guía para principiantes</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          ¿Qué son los lentes de contacto? Guía completa 2026
        </h1>

        {/* Author */}
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
          <span>⏱ 12 min lectura</span>
        </div>

        {/* Tabla de contenido */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[
              ['que-son', '¿Qué son exactamente los lentes de contacto?'],
              ['historia', 'Historia y evolución'],
              ['como-funcionan', '¿Cómo funcionan los lentes de contacto?'],
              ['tipos', 'Tipos de lentes de contacto'],
              ['materiales', 'Materiales: hidrogel vs silicona hidrogel'],
              ['quien-puede', '¿Quién puede usarlos?'],
              ['ventajas', 'Ventajas y desventajas'],
              ['receta', 'Cómo obtener tu receta'],
              ['marcas', 'Las mejores marcas disponibles en RD'],
              ['faq', 'Preguntas frecuentes'],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Introducción */}
          <p>Los <strong>lentes de contacto</strong> son uno de los inventos más transformadores de la salud visual moderna. Millones de personas en todo el mundo los usan a diario para ver con claridad sin necesidad de gafas — y en República Dominicana, cada vez más personas descubren la libertad que ofrecen. Si nunca has usado lentes de contacto y quieres entender exactamente qué son, cómo funcionan y si son para ti, esta guía te lo explica todo.</p>

          {/* Sección 1 */}
          <section id="que-son">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Qué son exactamente los lentes de contacto?</h2>
            <p>Los lentes de contacto son <strong>dispositivos médicos ópticos</strong> de forma circular y muy delgada que se colocan directamente sobre la superficie del ojo — específicamente sobre la córnea — para corregir defectos visuales o cambiar la apariencia del color de los ojos.</p>
            <p className="mt-3">A diferencia de las gafas, que corrigen la visión desde una distancia de varios centímetros del ojo, los lentes de contacto trabajan en contacto directo con la córnea. Esto los convierte en una alternativa más natural visualmente, con un campo de visión más amplio y sin los reflejos o distorsiones que a veces producen las gafas.</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
              <p className="text-sm font-semibold text-blue-800">📌 Dato importante</p>
              <p className="text-sm text-blue-700 mt-1">Los lentes de contacto son dispositivos médicos regulados. En muchos países, incluida República Dominicana, los lentes graduados requieren prescripción médica emitida por un optometrista u oftalmólogo.</p>
            </div>
            <p className="mt-4">Los lentes de contacto pueden corregir:</p>
            <ul className="space-y-2 mt-2">
              {[
                { condicion: 'Miopía', descripcion: 'Dificultad para ver de lejos. Los lentes de contacto con valor SPH negativo corrigen este defecto.' },
                { condicion: 'Hipermetropía', descripcion: 'Dificultad para ver de cerca. Se corrige con lentes SPH positivo.' },
                { condicion: 'Astigmatismo', descripcion: 'Curvatura irregular de la córnea. Se corrige con lentes tóricos que tienen valor CYL y AXIS.' },
                { condicion: 'Presbicia', descripcion: 'Pérdida de la capacidad de enfocar de cerca con la edad. Se corrige con lentes multifocales.' },
              ].map(({ condicion, descripcion }, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary-600 font-bold mt-0.5">→</span>
                  <span><strong>{condicion}:</strong> {descripcion}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sección 2 */}
          <section id="historia">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Historia y evolución de los lentes de contacto</h2>
            <p>La idea de colocar algo directamente sobre el ojo para mejorar la visión tiene siglos de historia. Leonardo da Vinci ya describió el concepto en 1508. Sin embargo, los primeros lentes de contacto prácticos aparecieron en el siglo XIX, hechos de vidrio y casi imposibles de usar cómodamente durante más de unas pocas horas.</p>
            <p className="mt-3">La gran revolución llegó en la segunda mitad del siglo XX:</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-gray-400 font-mono">1960s</span><span>Se desarrollaron los primeros lentes blandos de hidrogel, mucho más cómodos que los anteriores de PMMA.</span></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 font-mono">1987</span><span>Aparecen los primeros lentes de contacto desechables diarios, revolucionando la higiene y la comodidad.</span></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 font-mono">1999</span><span>Se introducen los lentes de silicona hidrogel, con transmisión de oxígeno hasta 5 veces superior al hidrogel tradicional.</span></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 font-mono">2000s</span><span>Proliferan los lentes de color, tóricos y multifocales de silicona hidrogel, ofreciendo opciones para casi cualquier necesidad visual.</span></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 font-mono">2020s</span><span>Los lentes inteligentes y con tecnología de hidratación avanzada (HYDRACLEAR, Aquaform, HydraGlyde) dominan el mercado premium.</span></li>
            </ul>
          </section>

          {/* Sección 3 */}
          <section id="como-funcionan">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Cómo funcionan los lentes de contacto?</h2>
            <p>Para entender cómo funcionan los lentes de contacto, primero necesitamos entender cómo ve el ojo humano. La córnea es la superficie transparente y curva en la parte frontal del ojo. Cuando la luz entra al ojo, la córnea la refracta (la dobla) para enfocarse en la retina. Cuando hay un defecto visual, esta refracción no es perfecta y la imagen que llega a la retina aparece borrosa.</p>
            <p className="mt-3">El lente de contacto actúa como una primera superficie refractante que corrige el error de la córnea antes de que la luz entre al ojo. Al estar en contacto directo con la córnea, el lente forma una nueva superficie óptica que redirige la luz exactamente como se necesita para una visión nítida.</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">¿Por qué los lentes de contacto necesitan oxígeno?</h3>
              <p className="text-sm">La córnea, a diferencia de otros tejidos del cuerpo, no tiene vasos sanguíneos. Obtiene el oxígeno que necesita directamente del aire. Cuando colocamos un lente sobre la córnea, estamos bloqueando parcialmente ese suministro de oxígeno. Por eso los materiales modernos de los lentes de contacto están diseñados para ser altamente permeables al oxígeno — especialmente la silicona hidrogel, que permite hasta 5 veces más oxígeno que el hidrogel tradicional.</p>
            </div>
          </section>

          {/* Sección 4 */}
          <section id="tipos">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tipos de lentes de contacto</h2>
            <p>Existe una amplia variedad de lentes de contacto diseñados para diferentes necesidades visuales, estilos de vida y presupuestos. Conocer los tipos disponibles es fundamental para elegir el que mejor se adapta a ti.</p>

            <h3 className="font-bold text-gray-900 mt-5 mb-3">Por período de reemplazo</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Tipo</th>
                    <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Duración</th>
                    <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Ventaja principal</th>
                    <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Mejor para</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Diarios', '1 día', 'Máxima higiene, sin mantenimiento', 'Uso ocasional o piel sensible'],
                    ['Quincenales', '14 días', 'Balance precio-higiene', 'Uso regular moderado'],
                    ['Mensuales', '30 días', 'Menor costo por día', 'Uso diario intensivo'],
                  ].map(([tipo, dur, ventaja, mejor], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium border border-gray-100">{tipo}</td>
                      <td className="p-3 border border-gray-100">{dur}</td>
                      <td className="p-3 border border-gray-100">{ventaja}</td>
                      <td className="p-3 border border-gray-100">{mejor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-gray-900 mt-6 mb-3">Por tipo de corrección visual</h3>
            <ul className="space-y-3">
              {[
                { nombre: 'Lentes esféricos', desc: 'Para miopía e hipermetropía. Son los más comunes y están disponibles en la mayor variedad de graduaciones. En ContactGo los encuentras en marcas como ACUVUE Oasys, Biofinity, Air Optix HydraGlyde y más.', link: '/esfericos' },
                { nombre: 'Lentes tóricos', desc: 'Diseñados específicamente para el astigmatismo. Tienen un diseño especial que los mantiene estables en el ojo para corregir la curvatura irregular de la córnea con precisión.', link: '/toricos' },
                { nombre: 'Lentes multifocales', desc: 'Para personas con presbicia (vista cansada) que necesitan ver bien tanto de cerca como de lejos. Funcionan de manera similar a las gafas progresivas.', link: '/multifocales' },
                { nombre: 'Lentes de color', desc: 'Pueden tener graduación o ser simplemente estéticos (sin corrección). Cambian o intensifican el color natural de los ojos.', link: '/color' },
              ].map(({ nombre, desc, link }, i) => (
                <li key={i} className="border border-gray-100 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{nombre}</h4>
                  <p className="text-sm text-gray-600">{desc}</p>
                  <Link href={link} className="text-xs text-primary-600 font-semibold mt-2 inline-block hover:underline">Ver {nombre} disponibles →</Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Sección 5 */}
          <section id="materiales">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Materiales: hidrogel vs silicona hidrogel</h2>
            <p>El material del lente de contacto es uno de los factores más importantes para la comodidad y la salud ocular. Actualmente existen dos familias principales de materiales para lentes blandos:</p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">💧 Hidrogel</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  <li>→ Alta retención de agua (45-80%)</li>
                  <li>→ Sensación de humedad inicial excelente</li>
                  <li>→ Menor transmisión de oxígeno</li>
                  <li>→ Precio generalmente más bajo</li>
                  <li>→ Pueden resecar los ojos en uso prolongado</li>
                </ul>
              </div>
              <div className="border border-primary-100 rounded-xl p-4 bg-primary-50/30">
                <h3 className="font-bold text-gray-900 mb-2">⭐ Silicona hidrogel</h3>
                <ul className="text-sm space-y-1.5 text-gray-600">
                  <li>→ Transmisión de oxígeno 5x superior</li>
                  <li>→ Mayor comodidad en uso prolongado</li>
                  <li>→ Mejor para ojos secos</li>
                  <li>→ Material estándar en marcas premium</li>
                  <li>→ Recomendado por la mayoría de especialistas</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm bg-green-50 border border-green-100 rounded-xl p-3"><strong>Recomendación:</strong> Si usas lentes de contacto más de 6 horas al día o trabajas frente a pantallas, la silicona hidrogel es la opción más indicada. Marcas como ACUVUE Oasys (Senofilcon A), Biofinity (Comfilcon A) y Air Optix HydraGlyde (Lotrafilcon B) son ejemplos de silicona hidrogel premium disponibles en ContactGo.</p>
          </section>

          {/* Sección 6 */}
          <section id="quien-puede">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Quién puede usar lentes de contacto?</h2>
            <p>La gran mayoría de personas con defectos visuales pueden usar lentes de contacto. Sin embargo, existen algunos factores que pueden afectar la idoneidad:</p>

            <h3 className="font-bold text-gray-900 mt-4 mb-2">✅ Pueden usar lentes de contacto:</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                'Personas con miopía, hipermetropía, astigmatismo o presbicia',
                'Adultos y jóvenes (desde los 12-14 años aproximadamente)',
                'Personas activas que practican deporte',
                'Trabajadores con pantallas (con lentes específicos para uso digital)',
                'Personas que prefieren evitar la apariencia de las gafas',
              ].map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-green-500">✓</span>{item}</li>)}
            </ul>

            <h3 className="font-bold text-gray-900 mt-4 mb-2">⚠️ Casos que requieren evaluación especial:</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                'Síndrome de ojo seco severo',
                'Alergias oculares frecuentes',
                'Enfermedades de la córnea (queratocono)',
                'Embarazo (puede afectar la hidratación ocular)',
                'Diabetes (el especialista evaluará la idoneidad)',
              ].map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-amber-500">→</span>{item}</li>)}
            </ul>

            <p className="mt-4">Si tienes alguna de estas condiciones, consulta con tu oftalmólogo u optometrista antes de comenzar a usar lentes de contacto. En muchos casos, existen opciones específicas diseñadas para estas situaciones.</p>
          </section>

          {/* Sección 7 */}
          <section id="ventajas">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Ventajas y desventajas de los lentes de contacto</h2>

            <h3 className="font-bold text-gray-900 mb-3">Ventajas</h3>
            <ul className="space-y-2 text-sm">
              {[
                { icon: '👁️', titulo: 'Campo visual completo', desc: 'Sin el marco de las gafas que limita la visión periférica. Ves exactamente como si no tuvieras ningún problema visual.' },
                { icon: '🏃', titulo: 'Libertad de movimiento', desc: 'Perfectos para deportes, actividades físicas, o cualquier situación donde las gafas sean incómodas o un riesgo.' },
                { icon: '🪞', titulo: 'Apariencia natural', desc: 'No alteran el aspecto físico. Para muchas personas, la comodidad estética es uno de los principales beneficios.' },
                { icon: '☔', titulo: 'No se empañan', desc: 'Nada de gafas que se empañan con el calor, la lluvia o al entrar en espacios con temperatura diferente.' },
                { icon: '🎨', titulo: 'Opción de color', desc: 'Disponibles en versiones que cambian o intensifican el color de los ojos, algo que las gafas no pueden ofrecer.' },
                { icon: '💻', titulo: 'Compatibles con pantallas', desc: 'Los lentes específicos para uso digital reducen la fatiga ocular frente a computadoras y dispositivos.' },
              ].map(({ icon, titulo, desc }, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-lg">{icon}</span>
                  <div><strong className="text-gray-900">{titulo}:</strong> <span className="text-gray-600">{desc}</span></div>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-gray-900 mt-6 mb-3">Desventajas y consideraciones</h3>
            <ul className="space-y-2 text-sm">
              {[
                { icon: '💧', titulo: 'Requieren cuidado diario', desc: 'Los lentes mensuales y quincenales necesitan limpieza y almacenamiento correctos. Los diarios eliminan este inconveniente.' },
                { icon: '⏰', titulo: 'Tiempo de adaptación', desc: 'Puede tomar unos días acostumbrarse a la sensación de tener un lente en el ojo.' },
                { icon: '💰', titulo: 'Costo recurrente', desc: 'A diferencia de las gafas, los lentes de contacto son un gasto mensual. Aunque los precios en ContactGo son muy competitivos.' },
                { icon: '🚫', titulo: 'No se pueden usar 24/7', desc: 'Deben retirarse para dormir (salvo indicación médica expresa de lentes de uso prolongado).' },
                { icon: '🦠', titulo: 'Riesgo de infección si no se cuidan', desc: 'El no seguir las normas de higiene puede llevar a infecciones. Por eso la limpieza correcta es fundamental.' },
              ].map(({ icon, titulo, desc }, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                  <span className="text-lg">{icon}</span>
                  <div><strong className="text-gray-900">{titulo}:</strong> <span className="text-gray-600">{desc}</span></div>
                </li>
              ))}
            </ul>
          </section>

          {/* Sección 8 */}
          <section id="receta">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo obtener tu receta para lentes de contacto</h2>
            <p>Para comprar lentes de contacto graduados, necesitas una <strong>prescripción específica para lentes de contacto</strong> — que es diferente a la receta para gafas. Tu optometrista u oftalmólogo realizará una evaluación completa que incluye:</p>
            <ol className="list-decimal list-inside space-y-2 mt-3 text-sm">
              <li><strong>Examen visual completo:</strong> Para determinar tu graduación exacta.</li>
              <li><strong>Medición de la córnea:</strong> Para determinar el radio de curvatura base (BC) y el diámetro (DIA) adecuados.</li>
              <li><strong>Prueba de adaptación:</strong> Te pondrán un lente de muestra para verificar el ajuste y la comodidad.</li>
              <li><strong>Seguimiento:</strong> Después de usar los lentes durante unas semanas, suele haber una revisión de seguimiento.</li>
            </ol>
            <p className="mt-3">¿No tienes tu receta a mano? Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold hover:underline">calculadora de receta gratuita</Link> para encontrar los lentes más compatibles con tu prescripción de gafas. También puedes <Link href="/blog/como-leer-receta-optica-rd" className="text-primary-600 hover:underline">aprender a leer tu receta óptica aquí</Link>.</p>
          </section>

          {/* Sección 9 */}
          <section id="marcas">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Las mejores marcas disponibles en República Dominicana</h2>
            <p>En ContactGo ofrecemos las principales marcas de lentes de contacto del mundo, todas 100% originales y selladas de fábrica:</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { marca: 'ACUVUE®', fab: 'Johnson & Johnson', estrella: 'ACUVUE Oasys', link: '/marca/acuvue' },
                { marca: 'AIR OPTIX®', fab: 'Alcon', estrella: 'Air Optix HydraGlyde', link: '/marca/alcon' },
                { marca: 'Biofinity®', fab: 'CooperVision', estrella: 'Biofinity mensual', link: '/marca/coopervision' },
                { marca: 'Bausch+Lomb', fab: 'Bausch+Lomb', estrella: 'ULTRA mensual', link: '/marca/bausch-lomb' },
              ].map(({ marca, fab, estrella, link }, i) => (
                <Link key={i} href={link} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:shadow-sm transition-all">
                  <p className="font-bold text-gray-900 text-sm">{marca}</p>
                  <p className="text-[11px] text-gray-500">{fab}</p>
                  <p className="text-xs text-primary-600 mt-1">★ {estrella}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Errores comunes */}
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Errores comunes al empezar con lentes de contacto</h2>
            <ul className="space-y-3 text-sm">
              {[
                { error: 'Dormir con los lentes puestos', consecuencia: 'Reduce drásticamente el oxígeno a la córnea y aumenta el riesgo de infecciones graves.' },
                { error: 'Usar agua del grifo para limpiarlos', consecuencia: 'El agua puede contener microorganismos como Acanthamoeba que causan infecciones graves.' },
                { error: 'Usar los lentes más tiempo del indicado', consecuencia: 'Un lente mensual usado 45 días pierde sus propiedades y acumula depósitos dañinos.' },
                { error: 'No lavarse las manos antes de manipularlos', consecuencia: 'Las bacterias de las manos son la causa más común de infecciones oculares por lentes.' },
                { error: 'Compartir lentes de contacto', consecuencia: 'Los lentes están adaptados a la curvatura específica de cada ojo. Compartirlos puede causar daños y transmitir infecciones.' },
              ].map(({ error, consecuencia }, i) => (
                <li key={i} className="border-l-4 border-red-300 pl-4 py-2">
                  <p className="font-bold text-gray-900">❌ {error}</p>
                  <p className="text-gray-600 mt-0.5">{consecuencia}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Resumen */}
          <section className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">📝 Resumen — Lo más importante</h2>
            <ul className="space-y-1.5 text-sm">
              {[
                'Los lentes de contacto son dispositivos médicos que corrigen la visión directamente sobre la córnea.',
                'Existen diarios, quincenales y mensuales — cada uno con sus ventajas específicas.',
                'La silicona hidrogel es el material premium actual, con 5x más transmisión de oxígeno.',
                'Necesitas una prescripción médica para los lentes graduados.',
                'La higiene correcta es fundamental para evitar infecciones.',
                'La mayoría de personas con defectos visuales pueden usar lentes de contacto.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Artículos relacionados */}
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Artículos relacionados</h2>
            <div className="grid gap-3">
              {[
                { href: '/blog/como-usar-lentes-de-contacto-primera-vez', titulo: '→ Cómo usar lentes de contacto por primera vez', desc: 'Guía paso a paso para principiantes' },
                { href: '/blog/tipos-de-lentes-de-contacto', titulo: '→ Tipos de lentes de contacto explicados', desc: 'Diarios, quincenales, mensuales y especiales' },
                { href: '/blog/como-leer-receta-optica-rd', titulo: '→ Cómo leer tu receta óptica', desc: 'Qué significa cada valor de tu prescripción' },
                { href: '/blog/cuanto-cuestan-lentes-contacto-rd', titulo: '→ Cuánto cuestan los lentes en RD', desc: 'Guía de precios actualizada 2026' },
                { href: '/blog/dormir-con-lentes-de-contacto-riesgos', titulo: '→ Riesgos de dormir con lentes de contacto', desc: 'Por qué nunca debes hacerlo' },
              ].map(({ href, titulo, desc }) => (
                <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                  <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {[
                { q: '¿Qué son los lentes de contacto?', a: 'Los lentes de contacto son dispositivos médicos ópticos que se colocan directamente sobre la córnea para corregir defectos visuales como miopía, hipermetropía, astigmatismo y presbicia, o para cambiar el color de los ojos.' },
                { q: '¿Cuántos tipos de lentes de contacto existen?', a: 'Existen dos grandes categorías: blandos (los más comunes, de hidrogel o silicona hidrogel) y rígidos permeables al gas. Los blandos se dividen según su frecuencia de reemplazo: diarios, quincenales y mensuales.' },
                { q: '¿Los lentes de contacto necesitan receta médica?', a: 'Sí, los lentes graduados requieren prescripción de un optometrista u oftalmólogo. Solo los lentes de color puramente estéticos (sin graduación) pueden adquirirse sin receta.' },
                { q: '¿Cuánto duran los lentes de contacto?', a: 'Depende del tipo: los diarios se descartan al final del día, los quincenales duran 14 días y los mensuales 30 días. Nunca deben usarse más tiempo del indicado.' },
                { q: '¿Son seguros los lentes de contacto?', a: 'Sí, cuando se usan correctamente y se mantiene una buena higiene. Millones de personas los usan a diario sin problemas. La clave está en seguir las instrucciones del fabricante y tu especialista.' },
                { q: '¿Dónde comprar lentes de contacto en República Dominicana?', a: 'En ContactGo ofrecemos más de 35 productos de las principales marcas mundiales, 100% originales, con entrega en 24-48 horas a todo el país.' },
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
            <p>Los lentes de contacto son una solución óptica moderna, segura y cómoda para millones de personas en todo el mundo. Desde corregir la miopía hasta cambiar el color de los ojos, la variedad de opciones disponibles hace que prácticamente cualquier persona pueda encontrar el lente perfecto para su estilo de vida y necesidades visuales.</p>
            <p className="mt-3">En República Dominicana, ContactGo te ofrece acceso a las mejores marcas del mundo — ACUVUE, Air Optix, Biofinity, Bausch+Lomb — con entrega directa a tu puerta en 24-48 horas. Si quieres dar el paso a los lentes de contacto, el primer paso siempre es consultar con tu optometrista para obtener tu prescripción. Lo segundo es encontrar la marca y el tipo que más se adapta a ti. Y lo tercero... es que te los llevamos a donde estés.</p>
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
              <p className="text-gray-600">Escrito por el <strong>Equipo ContactGo</strong>, Especialistas en Salud Visual · <span className="text-gray-400">Última revisión: junio 2026</span></p>
            </div>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900">
          <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta con un profesional óptico u oftalmólogo. Los lentes de contacto son dispositivos médicos que requieren prescripción. Si experimentas molestias, suspende su uso y consulta a tu especialista.
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">¿Listo para encontrar tus lentes de contacto?</h3>
          <p className="text-sm text-gray-600 mb-4">Más de 35 productos 100% originales. Entrega en 24-48h en toda República Dominicana.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
              Ver catálogo completo →
            </Link>
            <Link href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">
              Calcular mi receta gratis
            </Link>
            <a href="https://wa.me/18096942268?text=Hola%20ContactGo%2C%20quiero%20saber%20más%20sobre%20los%20lentes%20de%20contacto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
