import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    title: '¿Cuánto Duran los Lentes de Contacto?',
    url: 'https://www.contactgo.net/blog/cuanto-duran-lentes-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/cuanto-duran-lentes-contacto' },
  title: '¿Cuánto duran los lentes de contacto? Guía completa — ContactGo',
  description: 'Lentes diarios, quincenales y mensuales: cuánto duran, cuándo cambiarlos y cómo sacarles el máximo provecho. Guía para usuarios en RD.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Guías</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">¿Cuánto duran los lentes de contacto?</h1>
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

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Una de las preguntas más frecuentes de nuestros clientes en RD es cuánto tiempo pueden usar sus lentes antes de cambiarlos. La respuesta depende completamente del tipo de lente — y nunca debes extender el tiempo más allá de lo recomendado por el fabricante.</p>

          <div className="space-y-4">
            {[
              {
                tipo: 'Lentes diarios',
                duracion: '1 día',
                emoji: '📅',
                color: 'bg-blue-50 border-blue-200',
                titulo_color: 'text-blue-900',
                desc: 'Se usan una vez y se descartan. No requieren limpieza ni estuche. La opción más higiénica y conveniente.',
                ventajas: ['Máxima higiene — cero bacterias acumuladas', 'Sin gastos de solución', 'Perfectos para uso ocasional o deportes', 'Ideales si tienes ojos sensibles o alergias'],
                ejemplos: ['1-DAY ACUVUE® MOIST®', 'clariti® 1 day', '1-DAY ACUVUE® MOIST® for Astigmatism'],
                nota: 'Nunca duermas con lentes diarios — aunque "solo sea una siesta". El riesgo de infección es real.',
                href: '/catalogo?tipo=esferico',
              },
              {
                tipo: 'Lentes quincenales',
                duracion: '14 días',
                emoji: '🗓️',
                color: 'bg-purple-50 border-purple-200',
                titulo_color: 'text-purple-900',
                desc: 'Se cambian cada 2 semanas. Requieren limpieza diaria con solución multipropósito.',
                ventajas: ['Balance entre comodidad y costo', 'Material premium (silicona hidrogel)', 'Menor costo por uso que los diarios', 'ACUVUE Oasys es el más vendido del mundo'],
                ejemplos: ['ACUVUE® OASYS® with HYDRACLEAR®', 'ACUVUE® OASYS® for Astigmatism', 'ACUVUE® OASYS® Multifocal'],
                nota: 'Cuenta los 14 días desde que abres la caja, no desde que los uses por primera vez.',
                href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana',
              },
              {
                tipo: 'Lentes mensuales',
                duracion: '48h',
                emoji: '📆',
                color: 'bg-green-50 border-green-200',
                titulo_color: 'text-green-900',
                desc: 'Se cambian cada mes. El tipo con menor costo por día de uso. Requieren limpieza y almacenamiento diarios.',
                ventajas: ['El más económico por día de uso', 'Mayor grosor — más fáciles de manejar', 'Amplia variedad de parámetros disponibles', 'Los más usados en República Dominicana'],
                ejemplos: ['Biofinity®', 'AIR OPTIX® plus HydraGlyde®', 'Bausch+Lomb ULTRA®', 'Avaira Vitality®'],
                nota: 'Cambia la solución del estuche cada vez — nunca la reutilices.',
                href: '/catalogo?tipo=esferico',
              },
            ].map(t => (
              <div key={t.tipo} className={`${t.color} border rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <h2 className={`font-bold text-lg ${t.titulo_color}`}>{t.tipo}</h2>
                    <span className="text-xs font-bold text-gray-500">Duración: {t.duracion}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{t.desc}</p>
                <ul className="text-xs space-y-1 mb-3">
                  {t.ventajas.map(v => <li key={v} className="flex items-center gap-1"><span className="text-green-500">✓</span>{v}</li>)}
                </ul>
                <p className="text-xs text-gray-500 mb-2">Ejemplos: {t.ejemplos.join(', ')}</p>
                <div className="bg-white/60 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-600">⚠️ {t.nota}</p>
                </div>
                <Link href={t.href} className="text-sm font-semibold text-primary-600 hover:text-primary-700">Ver productos →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuándo desechar los lentes antes de tiempo?</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Si sientes ardor, picazón o visión borrosa que no mejora',
                'Si el lente se ve opaco o con depósitos visibles',
                'Si se rasgó o tiene algún defecto físico',
                'Si estuviste enfermo con infección ocular',
                'Si pasó más de 3 meses desde que abriste el estuche (aunque no los hayas usado todos los días)',
              ].map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 shrink-0">✕</span>{s}</li>)}
            </ul>
          </div>

          <div className="bg-primary-600 rounded-2xl p-5 text-white text-center">
            <p className="font-bold mb-2">¿Cuándo te toca reponer?</p>
            <p className="text-sm text-white/80 mb-3">ContactGo te avisa automáticamente cuando tus lentes estén por terminarse. Activa el recordatorio ahora.</p>
            <a href="https://wa.me/18294728328?text=Hola%20quiero%20activar%20recordatorio%20de%20recompra"
              target="_blank" rel="noopener noreferrer"
              className="bg-white text-primary-700 font-bold px-5 py-2.5 rounded-2xl inline-block text-sm hover:bg-gray-50 transition-all">
              Activar recordatorio gratuito →
            </a>
          </div>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "¿Cuánto duran los lentes de contacto? Guía completa",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-17",
      "specialty": "Optometry",
      "medicalAudience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "inLanguage": "es-DO",
        "url": "https://www.contactgo.net/blog/cuanto-duran-lentes-contacto"
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
      </main>
      <Footer />
    </>
  )
}
