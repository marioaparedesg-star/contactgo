import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Lentes de contacto de colores en República Dominicana — ContactGo',
  description: 'Guía completa de lentes de colores en RD. FreshLook, Air Optix Colors, con y sin graduación. Cuáles son los colores más populares y cómo elegir.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
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

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Los lentes de colores son tendencia en RD — desde looks naturales hasta cambios dramáticos. La clave está en elegir los correctos: seguros, originales y del color que mejor combine con tu tono de piel.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las marcas más populares en RD</h2>
            {[
              { marca: 'FreshLook® Colorblends', desc: 'La marca #1 en RD para lentes de color. Tecnología tri-capa que mezcla 3 tonos para un efecto 100% natural. Disponibles en 12 colores.', colores: ['Blue', 'Green', 'Honey', 'Gray', 'Brown', 'Amethyst', 'Turquoise', 'Gemstone Green'], href: '/producto/freshlook-colorblends-lentes-contacto-color-dominicana' },
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
        "author": {"@type": "Person", "name": "Equipo ContactGo", "jobTitle": "Especialistas en Salud Visual", "url": "https://contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net", "logo": {"@type": "ImageObject", "url": "https://contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-17",
        "inLanguage": "es-DO",
        "url": "https://contactgo.net/blog/lentes-contacto-colores-rd"
      })}} />
      
          {/* Disclaimer médico */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-8 text-sm text-amber-900">
            <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta con un profesional óptico u oftalmólogo. Los lentes de contacto son productos sanitarios que requieren prescripción. Si experimentas molestias, suspende su uso y consulta a tu especialista.
          </div>
      </main>
      <Footer />
    </>
  )
}
