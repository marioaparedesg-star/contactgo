import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const revalidate = 86400

export const metadata: Metadata = {
  title: '¿Puedo Dormir con Lentes de Contacto? Riesgos Reales | ContactGo RD',
  description: 'Descubre por qué dormir con lentes de contacto es peligroso para tus ojos, los síntomas de alerta y qué hacer si lo hiciste accidentalmente. Guía de...',
  alternates: { canonical: 'https://www.contactgo.net/blog/dormir-con-lentes-contacto' },
  openGraph: {
    title: '¿Puedo Dormir con Lentes de Contacto? Riesgos Reales',
    description: 'Guía completa sobre los riesgos de dormir con lentes de contacto. Infecciones, hipoxia corneal y protocolo de emergencia.',
    url: 'https://www.contactgo.net/blog/dormir-con-lentes-contacto',
    type: 'article',
    images: [{ url: 'https://www.contactgo.net/og-1200x630.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  { q: '¿Qué pasa si me quedo dormido con lentes de contacto una vez?', a: 'Retíralos lo antes posible y aplica lubricante ocular. Si solo fue una noche no debería causar daño permanente, pero puede haber molestia e inflamación temporal. Si hay dolor intenso, visión borrosa persistente o enrojecimiento severo, consulta a un optometrista.' },
  { q: '¿Existen lentes de contacto que se puedan usar para dormir?', a: 'Sí: Air Optix Night & Day y PureVision 2 están aprobados para hasta 30 días continuos. Sin embargo, incluso con estos, los especialistas recomiendan quitarlos para dormir siempre que sea posible. La aprobación existe para situaciones específicas, no como norma diaria.' },
  { q: '¿Cuáles son los signos de alerta después de dormir con lentes?', a: 'Señales urgentes: ojo rojo que no mejora, dolor al abrir el ojo, sensación de arena persistente, visión borrosa que no aclara, secreción inusual, fotofobia. Si tienes alguno, retira los lentes y busca atención médica ese día.' },
  { q: '¿Por qué los lentes diarios son los más seguros?', a: 'Cada día es un lente nuevo, sin acumulación de proteínas ni bacterias. Si accidentalmente duermes con ellos, simplemente los descartas. Los modelos de silicona hidrogel transmiten hasta 6 veces más oxígeno y eliminan el riesgo de contaminación del estuche.' },
  { q: '¿Cuánto oxígeno necesitan los ojos durante el sueño?', a: 'Con los ojos cerrados, la córnea recibe hasta un 80% menos de oxígeno que cuando están abiertos. Añadir una barrera de lentes reduce ese oxígeno aún más, causando hipoxia corneal. Como respuesta, la córnea genera nuevos vasos sanguíneos (neovascularización), proceso irreversible que puede afectar la visión permanentemente.' },
]

export default function DormirConLentesPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'MedicalWebPage'],
    headline: '¿Puedo Dormir con Lentes de Contacto? Riesgos Reales que Debes Conocer',
    url: 'https://www.contactgo.net/blog/dormir-con-lentes-contacto',
    datePublished: '2026-05-28', dateModified: '2026-05-28',
    author: { '@type': 'Organization', name: 'Equipo Editorial ContactGo', url: 'https://www.contactgo.net/autor/equipo-contactgo' },
    publisher: { '@type': 'Organization', name: 'ContactGo', logo: { '@type': 'ImageObject', url: 'https://www.contactgo.net/logo.png' } },
    medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.contactgo.net/blog/dormir-con-lentes-contacto' },
  }
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pb-20 pt-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600 font-medium">Dormir con lentes</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">⚠️ Salud ocular</span>
            <span className="text-xs text-gray-400">28 de mayo, 2026</span>
            <span className="text-xs text-gray-300">·</span>
            <Link href="/autor/equipo-contactgo" className="text-xs text-gray-400 hover:text-primary-600">✍️ Equipo ContactGo</Link>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            ¿Puedo Dormir con Lentes de Contacto? Riesgos Reales que Debes Conocer
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            La mayoría lo ha hecho accidentalmente. Pero convertirlo en hábito puede costar la salud de tus ojos — incluso de forma permanente. Aquí está todo lo que necesitas saber.
          </p>
        </header>

        <div className="prose prose-gray max-w-none space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="font-black text-red-800 text-lg mb-2">La respuesta directa: NO deberías.</p>
            <p className="text-red-700 text-sm leading-relaxed mb-0">La Academia Americana de Oftalmología y todos los organismos de salud ocular coinciden: dormir con lentes de contacto aumenta significativamente el riesgo de infecciones oculares graves y daño corneal permanente — incluso con lentes de silicona hidrogel de alta transmisión.</p>
          </div>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Por Qué Dormir con Lentes es Peligroso</h2>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Hipoxia corneal: tus ojos se asfixian</h3>
            <p className="text-gray-700 leading-relaxed">La córnea no tiene vasos sanguíneos propios. Para oxigenarse, depende del contacto directo con el aire. Al dormir, con los ojos cerrados, ya recibe hasta un 80% menos de oxígeno. Con un lente de contacto como barrera adicional, la hipoxia es crítica.</p>
            <p className="text-gray-700 leading-relaxed">Como respuesta de emergencia, la córnea genera nuevos vasos sanguíneos — <strong>neovascularización corneal</strong>. Este proceso es irreversible. Esos vasos invaden la zona central y pueden afectar la visión permanentemente. No hay cirugía que los elimine completamente.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Infecciones: riesgo 6 a 8 veces mayor</h3>
            <p className="text-gray-700 leading-relaxed">Estudios en el <em>British Journal of Ophthalmology</em> encontraron que dormir con lentes —incluso una noche— aumenta el riesgo de queratitis microbiana entre 6 y 8 veces. <em>Pseudomonas aeruginosa</em> puede destruir tejido corneal en horas. En casos graves, requiere trasplante de córnea.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Sequedad y daño mecánico</h3>
            <p className="text-gray-700 leading-relaxed">Al dormir, la producción de lágrimas disminuye. Los lentes absorben esa humedad y pueden adherirse a la córnea. Retirarlos forzosamente puede causar abrasiones corneales que tardan días en sanar.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">¿Qué Hacer Si Dormiste con Lentes?</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="font-bold text-blue-900 mb-3">Protocolo paso a paso:</p>
              <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside mb-0">
                <li>NO intentes retirar el lente inmediatamente.</li>
                <li>Aplica 2–3 gotas de lubricante ocular sin conservantes o solución salina estéril.</li>
                <li>Espera 5–10 minutos con los ojos cerrados para rehidratar el lente.</li>
                <li>Retira el lente con manos limpias.</li>
                <li>Descártalo si es desechable. Si es mensual, límpialo antes de guardarlo.</li>
                <li>Observa 24 horas. Si hay dolor, enrojecimiento intenso o visión borrosa: ve al oftalmólogo ese día.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Síntomas de Alerta que No Puedes Ignorar</h2>
            <ul className="text-gray-700 space-y-2">
              {['Dolor ocular intenso o que empeora con el tiempo','Enrojecimiento severo que no mejora al retirar el lente','Visión borrosa que no se corrige ni parpadeando','Sensación de cuerpo extraño persistente (más de 1 hora)','Secreción amarilla o verde (señal de infección bacteriana)','Fotofobia (sensibilidad extrema a la luz)'].map(s => (
                <li key={s} className="flex items-start gap-2"><span className="text-red-500 shrink-0 mt-0.5">⚠</span><span>{s}</span></li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
              <p className="text-amber-800 text-sm mb-0 font-semibold">La queratitis puede progresar de leve a grave en 24–48 horas. No esperes si tienes síntomas intensos.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">La Mejor Alternativa: Lentes Diarios</h2>
            <p className="text-gray-700 leading-relaxed">Si tiendes a quedarte dormido con los lentes, los <Link href="/catalogo?tipo=esferico" className="text-primary-600 font-semibold hover:text-primary-700">lentes desechables diarios de silicona hidrogel</Link> son la opción más segura: cada día es un lente nuevo, sin acumulación de bacterias, y si accidentalmente duermes con ellos simplemente los descartas.</p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-0">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-2xl p-6 text-white text-center">
            <h3 className="font-black text-xl mb-2">¿Buscas lentes más seguros para tu rutina?</h3>
            <p className="text-white/80 text-sm mb-5">Lentes diarios de silicona hidrogel con entrega en 24–48h en toda la República Dominicana.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/catalogo?tipo=esferico" className="inline-block bg-white text-primary-700 font-black px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">Ver lentes diarios →</Link>
              <Link href="/receta" className="inline-block border border-white/40 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">Subir mi receta</Link>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="font-bold text-gray-900 mb-4">Artículos relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['/blog/ojos-secos-lentes-contacto','Ojos secos y lentes de contacto: soluciones reales'],
                ['/blog/cuanto-duran-lentes-contacto','¿Cuánto tiempo duran los lentes de contacto?'],
                ['/blog/primeros-pasos-lentes-contacto-rd','Primeros pasos con lentes de contacto'],
                ['/blog/solucion-limpieza-lentes-contacto','Cómo limpiar correctamente tus lentes'],
              ].map(([href, title]) => (
                <Link key={href} href={href} className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">{title} →</Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm font-bold text-gray-900 mb-3">Productos recomendados en ContactGo</p>
          <div className="grid gap-2">
            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="text-sm text-primary-600 hover:underline">→ ACUVUE® Oasys® — Quincenal premium desde RD$3,875</a>
            <a href="/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana" className="text-sm text-primary-600 hover:underline">→ Biofinity® — Mensual alto oxígeno desde RD$4,750</a>
            <a href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="text-sm text-primary-600 hover:underline">→ Air Optix® HydraGlyde® — Mensual Alcon desde RD$4,375</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
