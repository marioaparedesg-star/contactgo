export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¿Cuánto cuestan los lentes de contacto en República Dominicana? — ContactGo',
  description: 'Guía de precios de lentes de contacto en RD 2026. Compara Acuvue, Air Optix, Biofinity vs ópticas físicas. Descubre por qué comprar online es hasta 40% más...',
  alternates: { canonical: 'https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd' },
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: '¿Cuánto cuestan los lentes de contacto en RD? Guía de precios 2026',
    description: 'Compara precios de lentes de contacto en ópticas vs online en República Dominicana.',
    url: 'https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd',
    locale: 'es_DO', siteName: 'ContactGo', type: 'article',
  },
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 pb-32">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">¿Cuánto cuestan los lentes de contacto e</span>
        </div>

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

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li key="0"><a href="#resumen" className="text-primary-600 hover:underline text-sm">Precios rápidos por tipo</a></li>
            <li key="1"><a href="#esfericos" className="text-primary-600 hover:underline text-sm">Lentes esféricos</a></li>
            <li key="2"><a href="#toricos" className="text-primary-600 hover:underline text-sm">Lentes tóricos</a></li>
            <li key="3"><a href="#multifocales" className="text-primary-600 hover:underline text-sm">Lentes multifocales</a></li>
            <li key="4"><a href="#color" className="text-primary-600 hover:underline text-sm">Lentes de color</a></li>
            <li key="5"><a href="#soluciones" className="text-primary-600 hover:underline text-sm">Soluciones</a></li>
            <li key="6"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
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
                  { nombre: 'Acuvue Moist (30u)', tienda_fisica: 'RD$4,166', online: 'RD$3,875' },
                  { nombre: 'Acuvue Oasys (6u)', tienda_fisica: 'RD$4,166', online: 'RD$3,875' },
                  { nombre: 'Air Optix HydraGlyde', tienda_fisica: 'RD$4,704', online: 'RD$4,200' },
                  { nombre: 'Biofinity mensual', tienda_fisica: 'RD$5,107', online: 'RD$4,750' },
                  { nombre: 'Air Optix Colors', tienda_fisica: 'RD$2,822', online: 'RD$2,520' },
                ].map(r => (
                  <tr key={r.nombre} className="border-b border-green-100">
                    <td className="py-2 pr-4 text-gray-700">{r.nombre}</td>
                    <td className="py-2 pr-4 text-right text-gray-500">{r.tienda_fisica}</td>
                    <td className="py-2 text-right font-bold text-green-700">{r.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">*Precios de referencia del mercado dominicano. Los precios de ContactGo son exactos.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Por qué son más baratos online?</h2>
          <p>Las tiendas físicas tienen costos fijos enormes: alquiler en centros comerciales, empleados, electricidad, equipos. Todos esos costos se trasladan al precio del producto. Una tienda online como ContactGo opera con muchos menos gastos, y ese ahorro te lo pasamos a ti.</p>
          <p className="mt-3">Además, somos una óptica especializada que compra en volumen, lo que nos permite precios más competitivos sin sacrificar la autenticidad.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuánto ahorro al mes comprando online?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { tipo: 'Lentes diarios', tienda_fisica: 'RD$4,166/mes', online: 'RD$3,875/mes', ahorro: 'RD$446' },
              { tipo: 'Lentes mensuales', tienda_fisica: '~RD$20,520/año', online: '~RD$18,240/año', ahorro: '~RD$2,280' },
            ].map(c => (
              <div key={c.tipo} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="font-bold text-gray-900 text-sm mb-2">{c.tipo}</p>
                <p className="text-xs text-gray-500">Precio referencia: <span className="line-through">{c.tienda_fisica}</span></p>
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
        "name": "Comité de Optometría de ContactGo",
        "url": "https://www.contactgo.net/autor/equipo-contactgo"
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

        <section id="faq">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto cuestan los lentes de contacto en República Dominicana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">En ContactGo los precios van desde RD$2,250 (Lunare color) hasta RD$20,000 (Proclear Multifocal Toric). Los más populares: ACUVUE Oasys RD$3,875, Biofinity RD$4,750, Air Optix HydraGlyde RD$4,375.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué lentes de contacto son más baratos en RD?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los más accesibles en ContactGo son Lunare Tri-Kolor a RD$2,250, ACUVUE 2 a RD$3,600, Avaira Vitality a RD$3,690 y 1-DAY ACUVUE Moist a RD$3,875. Todos con entrega en 24-48h en toda la República Dominicana.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Por qué hay tanta diferencia de precios entre marcas?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">El precio depende del material (silicona hidrogel vs hidrogel), la tecnología de hidratación, el período de reemplazo (diario vs mensual), el tipo de corrección (esférico, tórico, multifocal) y la marca. A mayor tecnología y durabilidad, mayor precio.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Vale la pena pagar más por lentes de contacto premium?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí, si usas los lentes más de 8 horas diarias o tienes ojos sensibles. Los lentes premium (silicona hidrogel) transmiten más oxígeno y son más cómodos en uso prolongado. El mayor costo por caja tiene menor costo real por día de uso.</p>
          </details>
          </div>
        </section>

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm font-bold text-gray-900 mb-3">Productos recomendados en ContactGo</p>
          <div className="grid gap-2">
            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="text-sm text-primary-600 hover:underline">→ ACUVUE® Oasys® — Quincenal premium desde RD$3,875</a>
            <a href="/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana" className="text-sm text-primary-600 hover:underline">→ Biofinity® — Mensual alto oxígeno desde RD$4,750</a>
            <a href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="text-sm text-primary-600 hover:underline">→ Air Optix® HydraGlyde® — Mensual Alcon desde RD$4,375</a>
          </div>
        </div>
      </main>
  )
}
