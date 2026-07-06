export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto de colores precio en RD 2026 — ContactGo',
  description: 'Air Optix Colors y Lunare precio en República Dominicana. Desde RD$2,250. Con y sin graduación. Entrega 24-48h. Originales de Alcon y CooperVision.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-colores-precio-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'Lentes de contacto de colores precio en RD 2026',
    description: 'Air Optix Colors y Lunare precio en RD. Con y sin graduación. Entrega 24-48h.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-colores-precio-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-colores-precio-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto de colores precio República Dominicana' }],
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lentes de contacto de colores precio en República Dominicana 2026",
            "description": "Precios de Air Optix Colors y Lunare Tri-Kolor en RD. Con y sin graduación.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-20", "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/lentes-contacto-colores-precio-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":'¿Cuánto cuestan los lentes de contacto de colores en República Dominicana?',"acceptedAnswer":{"@type":"Answer","text":'En ContactGo los Air Optix COLORS cuestan RD$2,625 la caja de 2 lentes (uso mensual) y los Lunare Tri-Kolor RD$2,250. Son los lentes de color originales más accesibles disponibles en RD con entrega a domicilio.'}},{"@type":"Question","name":'¿Los lentes de contacto de colores necesitan receta?',"acceptedAnswer":{"@type":"Answer","text":'Los lentes de color sin graduación (plano) no necesitan receta médica. Los lentes de color con graduación sí requieren prescripción. En ContactGo puedes comprar ambas versiones de Air Optix COLORS: con o sin graduación.'}},{"@type":"Question","name":'¿Los lentes de color dañan los ojos?',"acceptedAnswer":{"@type":"Answer","text":'Los lentes de color certificados y originales, usados correctamente, son seguros. El riesgo surge con lentes falsificados o de venta informal sin control de calidad. En ContactGo todos los lentes son 100% originales y sellados de fábrica.'}},{"@type":"Question","name":'¿Cuánto duran los lentes de contacto de colores?',"acceptedAnswer":{"@type":"Answer","text":'Los Air Optix COLORS y Lunare Tri-Kolor son de uso mensual — duran 30 días desde que abres la caja. Deben retirarse al dormir y almacenarse en solución multipropósito.'}},{"@type":"Question","name":'¿Puedo comprar lentes de color en República Dominicana con envío a domicilio?',"acceptedAnswer":{"@type":"Answer","text":'Sí. ContactGo entrega Air Optix COLORS y Lunare Tri-Kolor en toda la República Dominicana en 24-48 horas. El proceso de compra es 100% online y el pago con tarjeta a través de AZUL/Banco Popular.'}},{"@type":"Question","name":'¿Air Optix Colors o Lunare — cuál elegir?',"acceptedAnswer":{"@type":"Answer","text":'Air Optix COLORS de Alcon ofrece 12 colores y silicona hidrogel de alta calidad (Dk/t 138), ideal para uso diario hasta 16 horas. Lunare Tri-Kolor es la opción más accesible para uso ocasional. Si usas lentes frecuentemente, Air Optix COLORS es la mejor inversión.'}}] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes de color precio RD", "item": "https://www.contactgo.net/blog/lentes-contacto-colores-precio-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lentes de color precio RD</span>
        </div>

        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">🎨 Precios · Color</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Lentes de contacto de colores — Precio en República Dominicana 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Precios actualizados junio 2026 · Con y sin graduación</p></div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 mb-6">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-3">Precios actuales en ContactGo</p>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-purple-100"><th className="pb-2 text-left font-bold text-gray-900">Producto</th><th className="pb-2 text-right font-bold text-gray-900">Precio RD$</th></tr></thead>
            <tbody>
            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-3">
                <a href="/producto/air-optix-colors-lentes-contacto-color-dominicana" className="font-medium text-primary-600 hover:underline text-sm">AIR OPTIX® COLORS 2u</a>
                <span className="ml-2 text-[10px] bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full font-bold">12 colores · Mensual</span>
              </td>
              <td className="py-3 text-right font-black text-gray-900">RD$2,625</td>
            </tr>
            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-3">
                <a href="/producto/lunare-tri-kolor-lentes-contacto-color-dominicana" className="font-medium text-primary-600 hover:underline text-sm">Lunare Tri-Kolor 2u</a>
                <span className="ml-2 text-[10px] bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full font-bold">Accesible · Mensual</span>
              </td>
              <td className="py-3 text-right font-black text-gray-900">RD$2,250</td>
            </tr>

            </tbody>
          </table>
          <div className="flex gap-2 mt-4">
            <Link href="/color" className="flex-1 bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center hover:bg-purple-700 transition-colors">Ver lentes de color →</Link>
            <a href="https://wa.me/18096942268?text=Hola%2C%20quiero%20lentes%20de%20contacto%20de%20colores%20en%20RD" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center">Pedir por WhatsApp</a>
          </div>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Los <strong>lentes de contacto de colores</strong> son una de las categorías más buscadas en República Dominicana. Ya sea para cambiar el color natural de los ojos o simplemente intensificarlo, en ContactGo ofrecemos las dos marcas más confiables disponibles en el mercado dominicano: <Link href="/producto/air-optix-colors-lentes-contacto-color-dominicana" className="text-primary-600 font-semibold hover:underline">Air Optix® COLORS</Link> de Alcon y <Link href="/producto/lunare-tri-kolor-lentes-contacto-color-dominicana" className="text-primary-600 hover:underline">Lunare Tri-Kolor</Link>, ambos 100% originales con entrega en 24-48 horas.</p>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Air Optix® COLORS — La mejor opción de color en RD</h2>
            <p>Los <strong>Air Optix COLORS</strong> de Alcon son el estándar de referencia en lentes de contacto de color. Fabricados con silicona hidrogel (Lotrafilcon B, Dk/t 138), combinan comodidad de uso prolongado con una gama de 12 colores diseñados para mezclar naturalmente con el iris.</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['Pure Hazel','Honey','Gemstone Green','Sterling Gray','Brilliant Blue','True Sapphire','Brown','Gray','Green','Blue','Turquoise','Amethyst'].map((color, i) => (
                <div key={i} className="border border-purple-100 rounded-xl p-2 text-center text-xs font-medium text-gray-700 bg-purple-50/30">{color}</div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Material', value: 'Silicona hidrogel (Lotrafilcon B)' },
                { label: 'Reemplazo', value: 'Mensual (30 días)' },
                { label: 'Dk/t', value: '138 — alta transmisión O₂' },
                { label: 'Contenido agua', value: '33%' },
                { label: 'Radio base (BC)', value: '8.6 mm' },
                { label: 'Diámetro (DIA)', value: '14.2 mm' },
              ].map((spec, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{spec.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Lunare Tri-Kolor — La opción más accesible</h2>
            <p>Los <strong>Lunare Tri-Kolor</strong> son lentes de color mensuales disponibles exclusivamente en ContactGo para el mercado dominicano. Con un precio de RD$2,250 la caja de 2 lentes, son la alternativa más accesible para quienes quieren experimentar con lentes de color.</p>
            <p className="mt-3">Perfectos para uso ocasional o para quienes se inician en los lentes de color. Disponibles en los tonos más solicitados en República Dominicana.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Con o sin graduación?</h2>
            <p>Los Air Optix COLORS están disponibles en dos versiones:</p>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div className="border border-green-100 rounded-xl p-4 bg-green-50/30">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">✅ Plano (sin graduación)</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>→ No necesitas receta médica</li>
                  <li>→ SPH = 0.00 (plano)</li>
                  <li>→ Solo para cambiar el color del ojo</li>
                  <li>→ Mismo precio: RD$2,625</li>
                </ul>
              </div>
              <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/30">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">👓 Graduado (con corrección)</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>→ Requiere receta vigente</li>
                  <li>→ Corrige miopía o hipermetropía</li>
                  <li>→ SPH disponible de +6.00 a -8.00</li>
                  <li>→ Color + visión en un solo lente</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cuidado de lentes de color — Lo esencial</h2>
            <p>Los lentes de contacto de color requieren el mismo cuidado que los lentes transparentes. Como son mensuales, necesitas solución multipropósito para limpiarlos y almacenarlos:</p>
            <div className="space-y-2 mt-3">
              {[
                { nombre: 'Opti-Free Puremoist 90ml', precio: 'RD$750', slug: 'opti-free-puremoist-solucion-multiproposito-dominicana' },
                { nombre: 'Dream Eye Solución 80ml', precio: 'RD$750', slug: 'dream-eye-solucion-lentes-contacto-dominicana' },
              ].map(s => (
                <Link key={s.slug} href={`/producto/${s.slug}`} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                  <p className="text-sm font-medium text-primary-600">{s.nombre}</p>
                  <span className="font-bold text-gray-900 text-sm">{s.precio}</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Preguntas frecuentes sobre lentes de color</h2>
            <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto cuestan los lentes de contacto de colores en República Dominicana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">En ContactGo los Air Optix COLORS cuestan RD$2,625 la caja de 2 lentes (uso mensual) y los Lunare Tri-Kolor RD$2,250. Son los lentes de color originales más accesibles disponibles en RD con entrega a domicilio.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Los lentes de contacto de colores necesitan receta?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los lentes de color sin graduación (plano) no necesitan receta médica. Los lentes de color con graduación sí requieren prescripción. En ContactGo puedes comprar ambas versiones de Air Optix COLORS: con o sin graduación.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Los lentes de color dañan los ojos?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los lentes de color certificados y originales, usados correctamente, son seguros. El riesgo surge con lentes falsificados o de venta informal sin control de calidad. En ContactGo todos los lentes son 100% originales y sellados de fábrica.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto duran los lentes de contacto de colores?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los Air Optix COLORS y Lunare Tri-Kolor son de uso mensual — duran 30 días desde que abres la caja. Deben retirarse al dormir y almacenarse en solución multipropósito.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Puedo comprar lentes de color en República Dominicana con envío a domicilio?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí. ContactGo entrega Air Optix COLORS y Lunare Tri-Kolor en toda la República Dominicana en 24-48 horas. El proceso de compra es 100% online y el pago con tarjeta a través de AZUL/Banco Popular.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Air Optix Colors o Lunare — cuál elegir?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Air Optix COLORS de Alcon ofrece 12 colores y silicona hidrogel de alta calidad (Dk/t 138), ideal para uso diario hasta 16 horas. Lunare Tri-Kolor es la opción más accesible para uso ocasional. Si usas lentes frecuentemente, Air Optix COLORS es la mejor inversión.</p>
          </details>

            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 text-lg mb-3">Artículos relacionados</h3>
                      <div className="grid gap-2 mt-3">
            <a href="/blog/lentes-contacto-colores-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Guía completa de lentes de color en RD</p><p className="text-xs text-gray-500 mt-0.5">Cómo elegir y usar lentes de color</p></a>
            <a href="/color" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Ver todos los lentes de color disponibles</p><p className="text-xs text-gray-500 mt-0.5">Air Optix Colors y Lunare en ContactGo</p></a>
            <a href="/blog/como-usar-lentes-de-contacto-primera-vez" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Primera vez con lentes de contacto</p><p className="text-xs text-gray-500 mt-0.5">Guía para principiantes</p></a>
            <a href="/soluciones" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Soluciones para lentes de color</p><p className="text-xs text-gray-500 mt-0.5">Opti-Free y Dream Eye disponibles</p></a>
          </div>
          </section>
        </div>

        <div className="mt-10 bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">¿Listo para comprar? Recibe en 24-48h</h3>
          <p className="text-sm text-gray-600 mb-4">Productos 100% originales · Sellados de fábrica · Pago seguro con AZUL · Entrega en toda República Dominicana</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/color" className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors text-sm">
              Ver lentes de color →
            </a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm">
              Calcular mi receta gratis
            </a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda República Dominicana</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
