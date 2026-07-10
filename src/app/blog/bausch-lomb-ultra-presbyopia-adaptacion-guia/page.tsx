export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bausch+Lomb ULTRA for Presbyopia — Guía de adaptación | ContactGo',
  description: 'Guía completa de adaptación a lentes multifocales Bausch+Lomb ULTRA for Presbyopia. Tecnología 3-Zone Progressive, tips de uso y qué esperar los primeros días.',
  alternates: { canonical: 'https://www.contactgo.net/blog/bausch-lomb-ultra-presbyopia-adaptacion-guia' },
  openGraph: {
    type: 'article', title: 'Bausch+Lomb ULTRA for Presbyopia — Guía de adaptación',
    description: 'Guía completa de adaptación a lentes multifocales Bausch+Lomb ULTRA for Presbyopia. Tecnología 3-Zone Progressive, tips de uso y qué esperar los primeros días.',
    url: 'https://www.contactgo.net/blog/bausch-lomb-ultra-presbyopia-adaptacion-guia',
    siteName: 'ContactGo', locale: 'es_DO',
  },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Bausch+Lomb ULTRA for Presbyopia — Guía de adaptación",
            "description": "Guía completa de adaptación a lentes multifocales Bausch+Lomb ULTRA for Presbyopia.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "mainEntityOfPage": "https://www.contactgo.net/blog/bausch-lomb-ultra-presbyopia-adaptacion-guia"
          }
        ])}} />

        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">Guía de producto</p>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Bausch+Lomb ULTRA for Presbyopia: guía de adaptación</h1>
        <p className="text-gray-500 text-sm mb-8">Todo lo que necesitas saber para adaptarte cómodamente a tus nuevos lentes multifocales.</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-5">
          <p>Si acabas de recibir tus <strong>Bausch+Lomb ULTRA for Presbyopia</strong>, felicidades — diste el paso hacia la libertad visual sin depender de espejuelos bifocales o progresivos. Esta guía te ayuda a adaptarte rápido y sacarle el máximo provecho.</p>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">¿Qué hace especial a este lente?</h2>
          <p>Bausch+Lomb ULTRA for Presbyopia usa tecnología <strong>3-Zone Progressive</strong>, que combina de forma inteligente tres zonas de visión — lejos, intermedia y cerca — en un solo lente. Esto te permite ver el teléfono, la pantalla de la computadora y la carretera sin cambiar de lentes.</p>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Los primeros días: qué esperar</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Día 1-3:</strong> Tu cerebro está aprendiendo a usar las diferentes zonas del lente. Es normal sentir que la visión de cerca no es 100% nítida al principio.</li>
            <li><strong>Usa tus lentes al menos 4-6 horas diarias</strong> durante la primera semana — la adaptación es más rápida con uso consistente que con uso intermitente.</li>
            <li><strong>Evita cambiar entre lentes y espejuelos</strong> los primeros días — confunde al cerebro y alarga la adaptación.</li>
            <li><strong>Día 5-7:</strong> La mayoría de usuarios reporta visión clara y natural en las tres distancias.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Tips para acelerar tu adaptación</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cuando leas de cerca, <strong>baja ligeramente la mirada</strong> en vez de acercar el objeto — el diseño progresivo responde mejor al ángulo natural de lectura.</li>
            <li>Si algo se ve borroso, <strong>parpadea varias veces</strong> — reposiciona el lente sobre el ojo.</li>
            <li>Mantén tus lentes bien hidratados con solución multipropósito — la humedad optimiza la óptica del 3-Zone Progressive.</li>
            <li>Evita usarlos más de las horas recomendadas por tu especialista mientras te adaptas.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Cuidado diario</h2>
          <p>Bausch+Lomb ULTRA for Presbyopia es de reemplazo <strong>mensual</strong>. Cada noche, límpialos con solución multipropósito como Opti-Free Puremoist y guárdalos en su estuche. Nunca duermas con ellos puestos salvo indicación médica.</p>

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 my-8">
            <p className="font-bold text-gray-900 mb-2">💧 Complementa tu experiencia</p>
            <p className="text-sm text-gray-600 mb-3">Mantén tus lentes frescos e hidratados todo el día con <Link href="/producto/opti-free-puremoist-solucion-multiproposito-dominicana" className="text-primary-600 font-semibold hover:underline">Opti-Free Puremoist</Link>.</p>
          </div>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">¿Cuándo consultar a tu especialista?</h2>
          <p>Si después de 2 semanas de uso consistente aún sientes visión borrosa persistente, dolor de cabeza frecuente, o incomodidad, contacta a tu oftalmólogo — puede que necesites un ajuste de ADD (potencia de adición).</p>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 my-8 text-center">
            <p className="font-bold text-gray-900 mb-1">¿Preguntas sobre tus lentes?</p>
            <p className="text-sm text-gray-600 mb-4">Nuestro equipo te ayuda personalmente</p>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              💬 Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
