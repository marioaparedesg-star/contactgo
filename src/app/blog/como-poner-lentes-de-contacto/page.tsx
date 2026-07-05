export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Cómo Ponerse los Lentes de Contacto Paso a Paso',
    url: 'https://www.contactgo.net/blog/como-poner-lentes-de-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/como-poner-lentes-de-contacto' },
  title: 'Cómo poner y quitar lentes de contacto — ContactGo',
  description: 'Guía paso a paso para principiantes. Aprende a colocarte y quitarte lentes de contacto de forma segura en República Dominicana.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">como-poner-lentes-de-contacto</span>
        </div>
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Tutoriales</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Cómo poner y quitar lentes de contacto por primera vez</h1>
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
          <span>⏱ 5 min lectura</span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li key="0"><a href="#preparacion" className="text-primary-600 hover:underline text-sm">Antes de empezar</a></li>
            <li key="1"><a href="#pasos" className="text-primary-600 hover:underline text-sm">Cómo ponerse los lentes paso a paso</a></li>
            <li key="2"><a href="#quitar" className="text-primary-600 hover:underline text-sm">Cómo quitarse los lentes</a></li>
            <li key="3"><a href="#errores" className="text-primary-600 hover:underline text-sm">Errores comunes</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
        </div>


        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Ponerse lentes de contacto por primera vez puede parecer intimidante, pero con práctica se vuelve tan natural como cepillarse los dientes. Sigue estos pasos y lo lograrás.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">⚠️ Antes de empezar</p>
            <p>Lávate las manos con jabón y agua. Sécalas con una toalla limpia que no deje pelusa. Nunca toques los lentes con las manos sucias.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Cómo ponerse los lentes</h2>
            {[
              ['Coloca el lente en la yema del dedo índice', 'Asegúrate que esté en forma de copa (no al revés). Un lente al revés tendrá los bordes hacia afuera como un plato.'],
              ['Usa el dedo medio para bajar el párpado inferior', 'Con la misma mano, jala suavemente el párpado inferior hacia abajo.'],
              ['Usa el otro dedo índice para subir el párpado superior', 'Mantén el ojo bien abierto mirando hacia arriba.'],
              ['Coloca el lente sobre el iris', 'Posa el lente suavemente sobre el centro del ojo mirando hacia arriba o hacia un lado.'],
              ['Suelta los párpados y parpadea', 'El lente debe asentarse solo. Si sientes incomodidad, cierra el ojo y masajea suavemente.'],
            ].map(([titulo, desc], i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{titulo}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Cómo quitarse los lentes</h2>
            {[
              ['Lávate las manos', 'Siempre antes de tocar tus ojos o lentes.'],
              ['Mira hacia arriba y jala el párpado inferior', 'Con el dedo medio de la mano dominante.'],
              ['Toca el borde inferior del lente', 'Con el dedo índice, deslízalo hacia abajo de la córnea.'],
              ['Pellizca el lente suavemente', 'Con el pulgar e índice, retira el lente con un movimiento suave.'],
            ].map(([titulo, desc], i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{titulo}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿Necesitas tu primera caja?</p>
            <Link href="/catalogo" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              Ver catálogo →
            </Link>
          </div>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Cómo poner y quitar lentes de contacto",
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
        "url": "https://www.contactgo.net/blog/como-poner-lentes-de-contacto"
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
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cómo se ponen los lentes de contacto paso a paso?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Lávate las manos, coloca el lente en el índice comprobando que no esté al revés, abre el ojo con los dedos de la otra mano, mira hacia arriba y coloca el lente sobre la parte blanca del ojo, luego parpadea para centrarlo sobre la córnea.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cómo sé si el lente de contacto está al revés?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Coloca el lente en la punta del dedo y míralo de lado: si tiene forma de cuenco con bordes rectos apuntando hacia arriba, está correcto. Si los bordes se abren hacia afuera como un platillo, está al revés. Muchas marcas tienen marcas de orientación para facilitar esto.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Por qué se me cae el lente al intentar ponerlo?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Generalmente es por falta de técnica o nerviosismo. Asegúrate de que el lente esté bien centrado en el dedo, el ojo completamente abierto y de mirar hacia arriba al colocarlo. Con práctica, en una o dos semanas se vuelve automático.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto tiempo tarda aprender a ponerse los lentes?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">La mayoría de principiantes domina la técnica en 3-7 días de práctica. Al principio puede tomar 10-15 minutos, pero con el tiempo se hace en segundos. La clave es la calma y una técnica consistente.</p>
          </details>
          </div>
        </section>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda RD</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18295430580" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
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
