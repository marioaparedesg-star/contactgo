export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¿Cuánto cuestan los lentes de contacto en República Dominicana? — ContactGo',
  description: 'Guía de precios de lentes de contacto en RD 2026. Compara Acuvue, Air Optix, Biofinity vs ópticas físicas. Descubre por qué comprar online es hasta 40% más barato.',
  alternates: { canonical: 'https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd' },
  openGraph: {
    title: '¿Cuánto cuestan los lentes de contacto en RD? Guía de precios 2026',
    description: 'Compara precios de lentes de contacto en ópticas vs online en República Dominicana.',
    url: 'https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd',
    locale: 'es_DO', siteName: 'ContactGo', type: 'article',
  },
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 pb-32">
      <div className="mb-6">
        <Link href="/blog" className="text-xs text-primary-600 font-semibold hover:underline">← Blog</Link>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
        ¿Cuánto cuestan los lentes de contacto en República Dominicana en 2026?
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
          <span>⏱ 6 min lectura</span>
        </div>
      <p className="text-gray-500 text-sm mb-8">Actualizado mayo 2026 · 6 min de lectura</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>Una de las preguntas más frecuentes que recibimos es: <strong>"¿cuánto me va a costar?"</strong> La respuesta depende de tu receta, la marca y dónde compres. En esta guía desglosamos los precios reales del mercado dominicano en 2026.</p>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-3">Precio promedio en RD (online vs óptica)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-green-200">
                <th className="text-left py-2 pr-4 font-bold text-gray-900">Producto</th>
                <th className="text-right py-2 pr-4 font-bold text-gray-900">Óptica física</th>
                <th className="text-right py-2 font-bold text-green-700">ContactGo online</th>
              </tr></thead>
              <tbody>
                {[
                  { nombre: 'Acuvue Moist (30u)', optica: 'RD$5,500–7,000', online: 'RD$3,720' },
                  { nombre: 'Acuvue Oasys (6u)', optica: 'RD$5,000–6,500', online: 'RD$3,720' },
                  { nombre: 'Air Optix HydraGlyde', optica: 'RD$6,000–7,500', online: 'RD$4,200' },
                  { nombre: 'Biofinity mensual', optica: 'RD$5,500–7,000', online: 'RD$4,560' },
                  { nombre: 'Air Optix Colors', optica: 'RD$3,500–5,000', online: 'RD$2,520' },
                ].map(r => (
                  <tr key={r.nombre} className="border-b border-green-100">
                    <td className="py-2 pr-4 text-gray-700">{r.nombre}</td>
                    <td className="py-2 pr-4 text-right text-gray-500">{r.optica}</td>
                    <td className="py-2 text-right font-bold text-green-700">{r.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">*Precios de ópticas son estimados basados en nuestro análisis de mercado. Los precios de ContactGo son exactos.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Por qué son más baratos online?</h2>
          <p>Las ópticas físicas tienen costos fijos enormes: alquiler en centros comerciales, empleados, electricidad, equipos. Todos esos costos se trasladan al precio del producto. Una tienda online como ContactGo opera con muchos menos gastos, y ese ahorro te lo pasamos a ti.</p>
          <p className="mt-3">Además, compramos directamente a los distribuidores autorizados en volumen, lo que nos permite precios más competitivos sin sacrificar la autenticidad del producto.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuánto ahorro al mes comprando online?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { tipo: 'Lentes diarios', optica: 'RD$6,500/mes', online: 'RD$3,720/mes', ahorro: 'RD$2,780' },
              { tipo: 'Lentes mensuales', optica: '~RD$26,000/año', online: '~RD$18,240/año', ahorro: '~RD$7,760' },
            ].map(c => (
              <div key={c.tipo} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="font-bold text-gray-900 text-sm mb-2">{c.tipo}</p>
                <p className="text-xs text-gray-500">Óptica: <span className="line-through">{c.optica}</span></p>
                <p className="text-xs text-gray-500">Online: <span className="font-bold text-green-700">{c.online}</span></p>
                <p className="text-sm font-black text-primary-600 mt-2">Ahorras {c.ahorro}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">¿Listo para ahorrar?</h2>
          <p className="text-sm text-gray-700 mb-4">Revisa nuestro catálogo completo con todos los precios. Envío gratis en pedidos superiores a RD$6,000.</p>
          <div className="flex gap-3">
            <Link href="/catalogo" className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">Ver catálogo y precios</Link>
            <Link href="/receta" className="border border-primary-300 text-primary-700 px-4 py-2.5 rounded-xl font-bold text-sm">Usar mi receta</Link>
          </div>
        </div>
      </div>
    
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "¿Cuánto cuestan los lentes de contacto en República Dominicana?",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-19",
      "reviewedBy": {
        "@type": "Organization",
        "name": "Colegio Dominicano de Optometría",
        "url": "https://www.contactgo.net/sobre-nosotros"
      },
      "specialty": "Optometry",
      "medicalAudience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "inLanguage": "es-DO",
        "url": "https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd"
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
  )
}
