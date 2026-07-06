export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Soluciones para Limpiar Lentes de Contacto',
    url: 'https://www.contactgo.net/blog/solucion-limpieza-lentes-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/solucion-limpieza-lentes-contacto' },
  title: 'Cómo elegir la mejor solución para lentes de contacto — ContactGo',
  description: 'Guía completa sobre soluciones de limpieza para lentes de contacto en RD. Opti-Free, ReNu, Prolub — cuál usar y cómo limpiar correctamente.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">Cómo elegir la mejor solución para lente</span>
        </div>

        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Cuidado</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Cómo elegir la mejor solución para tus lentes de contacto</h1>
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
            <li key="0"><a href="#tipos" className="text-primary-600 hover:underline text-sm">Tipos de soluciones disponibles</a></li>
            <li key="1"><a href="#opti-free" className="text-primary-600 hover:underline text-sm">Opti-Free Puremoist</a></li>
            <li key="2"><a href="#dream-eye" className="text-primary-600 hover:underline text-sm">Dream Eye y Prolub</a></li>
            <li key="3"><a href="#uso" className="text-primary-600 hover:underline text-sm">Cómo usar correctamente</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
        </div>


        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>La solución de limpieza es tan importante como los lentes mismos. Usar la solución incorrecta puede causar irritación, infección o dañar el material del lente. Aquí te explicamos todo lo que necesitas saber.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las soluciones disponibles en ContactGo</h2>
            {[
              { nombre: 'Opti-Free® PureMoist', marca: 'Alcon', precio: 'RD$900', desc: 'La más recomendada para lentes de silicona hidrogel (Biofinity, Air Optix, ACUVUE Oasys). Tecnología POLYQUAD + ALDOX sin mercurio.', ideal: 'Silicona hidrogel', href: '/producto/opti-free-puremoist-solucion-multiproposito-dominicana' },
              { nombre: 'ReNu Advanced', marca: 'Bausch+Lomb', precio: 'RD$850', desc: 'Fórmula HydraGlyde para alta hidratación. Compatible con todos los lentes blandos. Precio muy accesible.', ideal: 'Todos los lentes blandos', href: '/producto/opti-free-puremoist-solucion-multiproposito-dominicana' },
              { nombre: 'Prolub Hyfresh', marca: 'Norsa', precio: 'RD$900', desc: 'La solución más popular en el mercado dominicano. Multipropósito — limpia, enjuaga, desinfecta y conserva. Precio competitivo.', ideal: 'Lentes blandos convencionales', href: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana' },
              { nombre: 'Dream Eye Solución', marca: 'Dream Eye', precio: 'RD$800', desc: 'Opción económica para uso diario. Funciona bien con lentes de hidrogel convencional.', ideal: 'Lentes blandos estándar', href: '/producto/dream-eye-solucion-lentes-contacto-dominicana' },
            ].map(s => (
              <div key={s.nombre} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{s.nombre}</h3>
                  <span className="text-primary-600 font-black shrink-0 text-sm">{s.precio}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{s.marca} · Ideal para: {s.ideal}</p>
                <p className="text-xs text-gray-700 mb-2">{s.desc}</p>
                <Link href={s.href} className="text-xs text-primary-600 font-semibold">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">El proceso correcto de limpieza</h2>
            <ol className="space-y-3">
              {[
                { paso: 'Lávate las manos', desc: 'Con jabón neutro y agua, sécalas con toalla de papel (no tela). Las bacterias de las manos son la principal causa de infecciones.' },
                { paso: 'Frota el lente', desc: 'Pon el lente en la palma, agrega unas gotas de solución y frota suavemente con el dedo por 20 segundos cada lado. Nunca saltes este paso aunque la solución diga "no requiere frotación".' },
                { paso: 'Enjuaga', desc: 'Enjuaga con abundante solución — nunca con agua del grifo, nunca con saliva.' },
                { paso: 'Almacena', desc: 'En estuche limpio con solución fresca. Cambia la solución cada día — nunca la reutilices. Limpia el estuche semanalmente y reemplázalo cada 3 meses.' },
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.paso}</p>
                    <p className="text-sm text-gray-600">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h3 className="font-bold text-red-900 mb-2">🚫 Lo que NUNCA debes hacer</h3>
            <ul className="text-sm text-red-800 space-y-1">
              {[
                'Nunca uses agua del grifo para enjuagar — puede causar acanthamoeba, una infección ocular grave',
                'Nunca mezcles soluciones de marcas diferentes en el mismo estuche',
                'Nunca uses solución vencida — revisa la fecha en el frasco',
                'Nunca uses solución salina (suero fisiológico) para almacenar lentes',
              ].map((r, i) => <li key={i}>✕ {r}</li>)}
            </ul>
          </div>

          <Link href="/catalogo?tipo=solucion"
            className="block bg-primary-600 text-white font-bold px-6 py-4 rounded-2xl text-center hover:bg-primary-700 transition-all">
            Ver todas las soluciones disponibles →
          </Link>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Cómo elegir la mejor solución para lentes de contacto",
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
        "url": "https://www.contactgo.net/blog/solucion-limpieza-lentes-contacto"
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
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué solución multipropósito es mejor para lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Para uso general, Opti-Free Puremoist de Alcon es una de las mejores opciones: limpia, desinfecta, aclara y lubrica en un solo paso. Para ojos secos, Prolub Hyfresh ofrece mayor hidratación. Ambas disponibles en ContactGo.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Puedo usar agua para limpiar los lentes de contacto?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">No. El agua del grifo puede contener microorganismos como Acanthamoeba que causan infecciones graves. Solo usa solución multipropósito específica para lentes de contacto.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto dura una solución multipropósito?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Una vez abierta, Opti-Free 300ml dura aproximadamente 2-3 meses con uso diario para un par de lentes mensuales. Siempre respeta la fecha de caducidad y la vida útil tras apertura indicada en el envase.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cada cuánto hay que cambiar el estuche de los lentes?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">El estuche debe cambiarse cada 1-3 meses, aunque muchas soluciones incluyen un estuche nuevo. Nunca uses el mismo estuche indefinidamente ya que acumula bacterias incluso si lo limpias regularmente.</p>
          </details>
          </div>
        </section>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda RD</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
