export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lentes de Contacto para Niños y Adolescentes en RD — ¿A qué edad? — ContactGo',
  description: '¿Tu hijo puede usar lentes de contacto? Descubre la edad recomendada, los mejores tipos para jóvenes y cómo hacer la transición segura en República Dominicana.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd' },
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Lentes de contacto para adolescentes en RD — ¿Cuándo empezar?',
    description: 'Guía para padres: edad, tipos de lentes y consejos para que tu hijo use lentes de contacto de forma segura en RD.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd',
    locale: 'es_DO', siteName: 'ContactGo', type: 'article',
  },
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 pb-32">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">Lentes de contacto para niños y adolesce</span>
        </div>

      <div className="mb-6">
        <Link href="/blog" className="text-xs text-primary-600 font-semibold hover:underline">← Blog</Link>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
        Lentes de contacto para niños y adolescentes en RD — ¿A qué edad se pueden usar?
      </h1>
                <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Especialistas en salud visual · Revisado por optómetra certificado</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>📅 10 de mayo, 2026</span>
          <span>·</span>
          <a href="/autor/equipo-contactgo" className="hover:text-primary-600 transition-colors">✍️ Equipo ContactGo</a>
          <span>·</span>
          <span>⏱ 7 min lectura</span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li key="0"><a href="#edad" className="text-primary-600 hover:underline text-sm">¿Desde qué edad?</a></li>
            <li key="1"><a href="#tipos" className="text-primary-600 hover:underline text-sm">Qué tipo de lente elegir</a></li>
            <li key="2"><a href="#higiene" className="text-primary-600 hover:underline text-sm">Higiene y supervisión</a></li>
            <li key="3"><a href="#deportes" className="text-primary-600 hover:underline text-sm">Lentes y deporte</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
        </div>

      <p className="text-gray-500 text-sm mb-8">Guía para padres · 7 min de lectura</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>Una de las preguntas más comunes que recibimos de padres dominicanos es: <strong>"¿mi hijo puede usar lentes de contacto?"</strong> La respuesta depende más de la madurez del niño que de su edad, pero hay guías claras que podemos seguir.</p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-3">La edad recomendada</h2>
          <p>La Academia Americana de Oftalmología no establece una edad mínima rígida, pero la mayoría de especialistas en RD y LATAM coinciden en:</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>8-11 años:</strong> Posible en casos especiales (deportes de contacto, anisometropía severa), siempre con supervisión estricta.</span></li>
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>12-14 años:</strong> Aceptable si el niño es responsable y entiende el cuidado requerido.</span></li>
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>15+ años:</strong> Ideal. El adolescente puede manejar el cuidado de forma independiente.</span></li>
          </ul>
        </div>

        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800"><strong>⚠️ Importante:</strong> La adaptación de lentes de contacto en menores requiere evaluación previa por un optometrista o oftalmólogo pediátrico certificado. No se recomienda sin supervisión profesional.</div>

        <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cómo saber si mi hijo está listo?</h2>
          <div className="space-y-2">
            {[
              { q: '¿Se lava las manos sin que se lo recuerden?', si: 'Buena señal', no: 'Espera un poco más' },
              { q: '¿Cuida sus pertenencias (celular, mochila)?', si: 'Buena señal', no: 'Todavía no' },
              { q: '¿Sigue instrucciones médicas sin supervisión?', si: 'Listo', no: 'Supervisión constante' },
              { q: '¿Entiende que los lentes son un dispositivo médico?', si: 'Listo', no: 'Educar primero' },
            ].map(item => (
              <div key={item.q} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-gray-900 text-sm mb-2">{item.q}</p>
                <div className="flex gap-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold">✓ Sí → {item.si}</span>
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-semibold">✗ No → {item.no}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800"><strong>⚠️ Importante:</strong> La adaptación de lentes de contacto en menores requiere evaluación previa por un optometrista o oftalmólogo pediátrico certificado. No se recomienda sin supervisión profesional.</div>

        <h2 className="font-display text-xl font-bold text-gray-900 mb-3">El mejor tipo de lente para adolescentes</h2>
          <p>Para jóvenes que empiezan, siempre recomendamos <strong>lentes diarios</strong>. La razón es simple: no requieren limpieza ni mantenimiento. Se usan y se descartan. El riesgo de infección es mínimo y la higiene está garantizada.</p>
          <div className="mt-4 space-y-3">
            <Link href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">👁️</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">1-DAY ACUVUE® MOIST®</p>
                <p className="text-xs text-gray-500">Diario · El más recomendado para principiantes · RD$3,875</p>
              </div>
              <span className="ml-auto text-primary-600 font-bold text-sm">Ver →</span>
            </Link>
            <Link href="/producto/1-day-acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">🎯</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">1-DAY ACUVUE® MOIST® for Astigmatism</p>
                <p className="text-xs text-gray-500">Diario · Para astigmatismo · RD$5,940</p>
              </div>
              <span className="ml-auto text-primary-600 font-bold text-sm">Ver →</span>
            </Link>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">⚠️ Reglas de oro para adolescentes</h2>
          <ul className="text-sm space-y-1.5">
            <li>• Nunca dormir con los lentes puestos</li>
            <li>• Lavarse las manos SIEMPRE antes de tocar los lentes</li>
            <li>• Nunca usar lentes con los ojos rojos o irritados</li>
            <li>• No compartir lentes con nadie, jamás</li>
            <li>• Llevar los espejuelos de backup siempre</li>
            <li>• Visitar al oftalmólogo cada 12 meses</li>
          </ul>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">¿Listo para empezar?</h2>
          <p className="text-sm text-gray-700 mb-4">Consulta nuestro catálogo de lentes diarios, perfectos para adolescentes que empiezan. Envío a domicilio en todo RD.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/esfericos" className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">Ver lentes esféricos</Link>
            <Link href="/receta" className="border border-primary-300 text-primary-700 px-4 py-2.5 rounded-xl font-bold text-sm">Usar mi receta</Link>
          </div>
        </div>
      </div>
    
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Lentes de Contacto para Niños y Adolescentes en RD",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-19",
      "reviewedBy": {
        "@type": "Organization",
        "name": "Comité de Optometría de ContactGo",
        "url": "https://www.contactgo.net/autor/equipo-contactgo"
      },
      "specialty": "Optometry",
      "medicalAudience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "inLanguage": "es-DO",
        "url": "https://www.contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd"
      })}} />
      
          {/* Autor médico verificado */}
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-0.5">Información médica revisada</p>
              <p className="text-gray-600 leading-relaxed">
                Escrito por <strong>Equipo ContactGo</strong>, Especialistas en Salud Visual · · <span className="text-gray-400"> Última revisión: mayo 2026</span>
              </p>
            </div>
          </div>
        </div>
        {/* Disclaimer médico */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-8 text-sm text-amber-900">
            <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta con un profesional óptico u oftalmólogo. Los lentes de contacto son productos sanitarios que requieren prescripción. Si experimentas molestias, suspende su uso y consulta a tu especialista.
          </div>

        <section id="faq">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿A qué edad pueden usar lentes de contacto los niños?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No hay una edad mínima estricta, pero la mayoría de especialistas recomienda no antes de los 11-12 años, cuando el niño puede asumir la responsabilidad de la higiene. La madurez y responsabilidad son más importantes que la edad exacta.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué lentes de contacto son mejores para adolescentes?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los lentes diarios son los más recomendados para jóvenes: máxima higiene, sin mantenimiento y menor riesgo de infección. 1-DAY ACUVUE Moist y clariti 1 day son excelentes opciones disponibles en ContactGo.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Los lentes de contacto dañan la vista de los niños?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No, si se usan correctamente y con supervisión. Los lentes de contacto no detienen ni aceleran la progresión de la miopía. Para el control de miopía en jóvenes, existen lentes de ortoqueratología específicos que son diferentes a los lentes convencionales.</p>
          </details>
          </div>
        </section>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda RD</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
  )
}
