export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Biofinity vs ACUVUE: ¿Cuál es mejor en RD?',
    url: 'https://www.contactgo.net/blog/biofinity-vs-acuvue-comparacion',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/biofinity-vs-acuvue-comparacion' },
  title: 'Biofinity vs ACUVUE: ¿Cuál es mejor en RD? — ContactGo',
  description: 'Comparamos Biofinity de CooperVision vs ACUVUE Oasys de J&J. Precio, comodidad, hidratación y disponibilidad en República Dominicana.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Comparaciones</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Biofinity vs ACUVUE Oasys: ¿Cuál es mejor para ti?</h1>
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

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Biofinity de CooperVision y ACUVUE Oasys de Johnson & Johnson son las dos marcas de lentes de contacto más vendidas en República Dominicana. Ambas son de silicona hidrogel premium, pero tienen diferencias importantes que pueden hacer una de ellas mejor para ti específicamente.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Característica</th>
                  <th className="p-3 text-center font-bold text-blue-700 border border-gray-100">Biofinity®</th>
                  <th className="p-3 text-center font-bold text-red-700 border border-gray-100">ACUVUE® Oasys®</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Fabricante', 'CooperVision', 'Johnson & Johnson'],
                  ['Material', 'Comfilcon A', 'Senofilcon A'],
                  ['Contenido de agua', '48%', '38%'],
                  ['Dk/t (oxígeno)', '160', '147'],
                  ['Reemplazo', 'Mensual', 'Quincenal'],
                  ['Precio en RD', 'RD$4,750', 'RD$3,875'],
                  ['Precio por día de uso', '~RD$50', '~RD$88'],
                  ['Disponible en tórico', '✅ Sí', '✅ Sí'],
                  ['Disponible en multifocal', '✅ Sí', '✅ Sí'],
                  ['Tecnología hidratación', 'Aquaform®', 'HYDRACLEAR® Plus'],
                ].map(([cat, bio, acu], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-medium text-gray-700 border border-gray-100">{cat}</td>
                    <td className="p-3 text-center text-blue-700 border border-gray-100">{bio}</td>
                    <td className="p-3 text-center text-red-700 border border-gray-100">{acu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">💙 Biofinity — para quién es mejor</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Si quieres el menor costo por día de uso (~RD$50 vs ~RD$88)',
                'Si prefieres no tener que comprar lentes tan frecuentemente (mensual)',
                'Si tienes ojos muy secos — el 48% de agua es mayor',
                'Si necesitas lentes de alta graduación (XR llega hasta ±20.00)',
                'Primera opción en CooperVision disponible en RD',
              ].map((p, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500">✓</span>{p}</li>)}
            </ul>
            <Link href="/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana"
              className="mt-3 inline-block bg-blue-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-blue-700 transition-all">
              Ver Biofinity →
            </Link>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">❤️ ACUVUE Oasys — para quién es mejor</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Si pasas 8+ horas frente a pantallas — HYDRACLEAR Plus es superior en comodidad digital',
                'Si prefieres renovar lentes cada 2 semanas (más higiénico)',
                'Si eres sensible a cambios de temperatura (Senofilcon A es más estable)',
                'La marca más recomendada por optometristas a nivel mundial',
                'Mayor disponibilidad de parámetros en el mercado dominicano',
              ].map((p, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500">✓</span>{p}</li>)}
            </ul>
            <Link href="/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana"
              className="mt-3 inline-block bg-red-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-red-700 transition-all">
              Ver ACUVUE Oasys →
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-2">🏆 Veredicto final</h2>
            <p className="text-sm"><strong>Si el precio es tu prioridad:</strong> Biofinity gana — ~RD$50 por día vs ~RD$88 (calculado sobre 90 días/caja de 6u vs 42 días/caja de 6u).</p>
            <p className="text-sm mt-2"><strong>Si la comodidad es tu prioridad:</strong> ACUVUE Oasys gana — especialmente para trabajo digital intenso.</p>
            <p className="text-sm mt-2"><strong>Si no estás seguro:</strong> Pide una muestra de ambas con tu optometrista y comprueba cuál te sienta mejor. Ambas son excelentes opciones — la diferencia real está en cómo responde <em>tu ojo</em> específicamente.</p>
          </div>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Biofinity vs ACUVUE: ¿Cuál es mejor en RD?",
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
        "url": "https://www.contactgo.net/blog/biofinity-vs-acuvue-comparacion"
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
      
        <div className="mt-10 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Todos los lentes con precios actualizados</p>
          <a href="/catalogo" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
            Comparar precios en el catálogo →
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
