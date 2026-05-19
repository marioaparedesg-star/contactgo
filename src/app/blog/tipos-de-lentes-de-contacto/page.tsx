export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    title: 'Tipos de Lentes de Contacto',
    url: 'https://www.contactgo.net/blog/tipos-de-lentes-de-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/tipos-de-lentes-de-contacto' },
  title: 'Tipos de lentes de contacto — ContactGo',
  description: 'Diferencias entre lentes esféricos, tóricos, multifocales y de color. Cómo elegir el correcto según tu diagnóstico en RD.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Educación</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Tipos de lentes de contacto: ¿cuál es el correcto para ti?</h1>
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
          <p>No todos los lentes de contacto son iguales. Cada tipo está diseñado para corregir una condición visual específica. Aquí te explicamos las diferencias para que elijas el correcto.</p>

          {[
            {
              tipo: 'Lentes Esféricos',
              emoji: '⭕',
              para: 'Miopía e Hipermetropía',
              descripcion: 'Son los más comunes. Corrigen la visión borrosa a distancia (miopía) o de cerca (hipermetropía). Si tu receta solo tiene SPH, este es tu lente.',
              ejemplos: ['Acuvue Oasys', '1-Day Acuvue Moist', 'Air Optix Plus HydraGlyde', 'Biofinity'],
              href: '/catalogo?tipo=esferico',
            },
            {
              tipo: 'Lentes Tóricos',
              emoji: '🔵',
              para: 'Astigmatismo',
              descripcion: 'Diseñados específicamente para corregir el astigmatismo. Tienen un diseño especial que los mantiene estables en el ojo. Si tu receta tiene CYL y EJE, necesitas tóricos.',
              ejemplos: ['Acuvue Oasys for Astigmatism', '1-Day Acuvue Moist for Astigmatism', 'Air Optix for Astigmatism', 'Biofinity Toric'],
              href: '/catalogo?tipo=torico',
            },
            {
              tipo: 'Lentes Multifocales',
              emoji: '🎯',
              para: 'Presbicia (vista cansada)',
              descripcion: 'Para personas mayores de 40 años que necesitan corregir tanto la visión de lejos como la de cerca. Si tu receta tiene ADD, necesitas multifocales.',
              ejemplos: ['Acuvue Oasys for Multifocal'],
              href: '/catalogo?tipo=multifocal',
            },
            {
              tipo: 'Lentes de Color',
              emoji: '🌈',
              para: 'Cambio estético de color de ojos',
              descripcion: 'Disponibles con y sin graduación. Cambian o realzan el color natural de tus ojos. Perfectos si quieres un cambio de look.',
              ejemplos: ['FreshLook Colorblends', 'Air Optix Colors'],
              href: '/catalogo?tipo=color',
            },
          ].map(item => (
            <div key={item.tipo} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{item.tipo}</h2>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Para: {item.para}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.descripcion}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Marcas disponibles:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.ejemplos.map(e => (
                  <span key={e} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{e}</span>
                ))}
              </div>
              <Link href={item.href} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Ver {item.tipo.toLowerCase()} →
              </Link>
            </div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿No sabes cuál necesitas?</p>
            <p className="text-sm text-gray-600 mb-4">Ingresa tu receta y te mostramos los lentes correctos automáticamente.</p>
            <Link href="/receta" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              Buscar por mi receta →
            </Link>
          </div>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Tipos de lentes de contacto",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-17",
      "specialty": "Optometry",
      "medicalAudience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "inLanguage": "es-DO",
        "url": "https://www.contactgo.net/blog/tipos-de-lentes-de-contacto"
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
