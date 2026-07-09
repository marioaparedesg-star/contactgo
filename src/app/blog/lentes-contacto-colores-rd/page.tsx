export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Lentes de Contacto de Color en RD',
    url: 'https://www.contactgo.net/blog/lentes-contacto-colores-rd',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-colores-rd' },
  title: 'Lentes de contacto de colores en República Dominicana — ContactGo',
  description: 'Guía completa de lentes de colores en RD. FreshLook, Air Optix Colors, con y sin graduación. Cuáles son los colores más populares y cómo elegir.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">lentes-contacto-colores-rd</span>
        </div>
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">Estética</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto de colores en República Dominicana</h1>
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
            <li key="0"><a href="#marcas" className="text-primary-600 hover:underline text-sm">Marcas disponibles en RD</a></li>
            <li key="1"><a href="#sin-graduacion" className="text-primary-600 hover:underline text-sm">Lentes de color sin graduación</a></li>
            <li key="2"><a href="#con-graduacion" className="text-primary-600 hover:underline text-sm">Lentes de color con graduación</a></li>
            <li key="3"><a href="#cuidado" className="text-primary-600 hover:underline text-sm">Cómo cuidarlos</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
        </div>


        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Los lentes de colores son tendencia en RD — desde looks naturales hasta cambios dramáticos. La clave está en elegir los correctos: seguros, originales y del color que mejor combine con tu tono de piel.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las marcas más populares en RD</h2>
            {[
              { marca: 'FreshLook® Colorblends', desc: 'La marca #1 en RD para lentes de color. Tecnología tri-capa que mezcla 3 tonos para un efecto 100% natural. Disponibles en 12 colores.', colores: ['Blue', 'Green', 'Honey', 'Gray', 'Brown', 'Amethyst', 'Turquoise', 'Gemstone Green'], href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
              { marca: 'AIR OPTIX® COLORS', desc: 'De Alcon — silicona hidrogel con color. Cómodos para uso prolongado. El único lente de color de silicona hidrogel del mercado.', colores: ['Blue', 'Brown', 'Gray', 'Green', 'Honey', 'Brilliant Blue', 'True Sapphire', 'Gemstone Green'], href: '/producto/air-optix-colors-lentes-contacto-color-dominicana' },
              { marca: 'Lunare Tri-Kolor', desc: 'Opción local más accesible. Diseño de tres capas de color para un efecto vibrante y llamativo.', colores: ['Varios colores disponibles'], href: '/producto/lunare-tri-kolor-lentes-contacto-color-dominicana' },
            ].map(m => (
              <div key={m.marca} className="bg-white border border-gray-100 rounded-2xl p-5 mb-3">
                <h3 className="font-bold text-gray-900 mb-1">{m.marca}</h3>
                <p className="text-sm text-gray-600 mb-3">{m.desc}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.colores.map(c => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <Link href={m.href} className="text-sm text-primary-600 font-semibold">Ver colores disponibles →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Con o sin graduación?</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="font-bold text-blue-900 mb-1">Con graduación</p>
                <p className="text-xs text-blue-800">Si usas gafas o lentes graduados, puedes pedir los lentes de color con tu prescripción exacta. Necesitas receta médica vigente.</p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4">
                <p className="font-bold text-pink-900 mb-1">Sin graduación (Plano)</p>
                <p className="text-xs text-pink-800">Si tienes visión perfecta y solo quieres cambiar el color de tus ojos. No necesitas receta. Disponibles en todos los colores.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Los colores más populares en RD según tipo de piel</h2>
            {[
              { piel: 'Piel morena oscura', colores: 'Honey, Brown, Gemstone Green — realzan el ojo sin verse falsos' },
              { piel: 'Piel morena clara', colores: 'Gray, Blue, Turquoise — contrastan bonito con el tono de piel dominicano' },
              { piel: 'Piel clara', colores: 'Amethyst, Brilliant Blue, True Sapphire — colores más dramáticos y vibrantes' },
            ].map(p => (
              <div key={p.piel} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{p.piel}</p>
                  <p className="text-xs text-gray-600">{p.colores}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Importante sobre seguridad</h3>
            <p className="text-sm text-amber-800">Nunca compres lentes de colores en farmacias, accesorios o vendedores ambulantes. Los lentes sin certificación médica pueden causar infecciones graves o daño corneal permanente. En ContactGo todos los lentes son originales y certificados.</p>
          </div>

          <Link href="/catalogo?tipo=color"
            className="block bg-primary-600 text-white font-bold px-6 py-4 rounded-2xl text-center hover:bg-primary-700 transition-all">
            Ver todos los lentes de colores disponibles →
          </Link>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Lentes de contacto de colores en República Dominicana",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
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
        "url": "https://www.contactgo.net/blog/lentes-contacto-colores-rd"
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
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Dónde comprar lentes de contacto de colores en República Dominicana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">En ContactGo tienes Air Optix COLORS (Alcon) y Lunare Tri-Kolor con entrega en 24-48h en toda la República Dominicana. Air Optix COLORS desde RD$2,625 y Lunare desde RD$2,250, ambos 100% originales.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Los lentes de color necesitan receta?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Los de color sin graduación (plano) no necesitan receta. Los de color con graduación sí. En ContactGo disponemos de Air Optix COLORS con y sin graduación.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Son seguros los lentes de contacto de colores?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Sí, los de marcas reconocidas como Alcon (Air Optix COLORS) son seguros si se usan correctamente y son originales. Los riesgos vienen de lentes falsificados o de baja calidad, especialmente los que se venden en mercados informales sin certificación.</p>
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
