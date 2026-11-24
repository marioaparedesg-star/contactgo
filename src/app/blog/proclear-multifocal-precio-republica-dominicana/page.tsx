export const revalidate = 3600

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Proclear Multifocal en RD: disponibilidad y alternativas actuales — ContactGo',
  description: 'Actualización de Proclear Multifocal en República Dominicana: las versiones estándar y XR no aparecen en el catálogo actual. Consulta alternativas multifocales y Proclear Multifocal Toric.',
  alternates: { canonical: 'https://www.contactgo.net/blog/proclear-multifocal-precio-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'Proclear Multifocal: disponibilidad y alternativas en RD',
    description: 'Estado de disponibilidad de Proclear Multifocal, alternativas multifocales actuales y ficha de Proclear Multifocal Toric.',
    url: 'https://www.contactgo.net/blog/proclear-multifocal-precio-republica-dominicana',
    siteName: 'ContactGo',
    locale: 'es_DO',
  },
}

export default function Page() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Proclear Multifocal: disponibilidad y alternativas en República Dominicana',
      description: 'Actualización del catálogo ContactGo sobre Proclear Multifocal y alternativas multifocales.',
      author: { '@type': 'Organization', name: 'Equipo ContactGo' },
      publisher: { '@type': 'Organization', name: 'ContactGo', url: 'https://www.contactgo.net' },
      datePublished: '2026-06-28',
      dateModified: '2026-11-24',
      url: 'https://www.contactgo.net/blog/proclear-multifocal-precio-republica-dominicana',
      inLanguage: 'es-DO',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Está disponible Proclear Multifocal estándar en ContactGo?',
          acceptedAnswer: { '@type': 'Answer', text: 'Proclear Multifocal estándar y Proclear Multifocal XR no aparecen disponibles en el catálogo activo de ContactGo. No mostramos sus precios anteriores como si fueran vigentes.' },
        },
        {
          '@type': 'Question',
          name: '¿Proclear Multifocal Toric sigue disponible?',
          acceptedAnswer: { '@type': 'Answer', text: 'Proclear Multifocal Toric sí aparece en el catálogo actual. Su precio de referencia es RD$12,000 y, por ser tórico, el plazo estimado es de 25 a 45 días. Confirma precio y disponibilidad en su ficha antes de comprar.' },
        },
        {
          '@type': 'Question',
          name: '¿Qué alternativas multifocales hay actualmente?',
          acceptedAnswer: { '@type': 'Answer', text: 'El catálogo actual incluye Biofinity Multifocal, ACUVUE OASYS Multifocal, AIR OPTIX HydraGlyde Multifocal, clariti 1 day multifocal y Bausch+Lomb ULTRA for Presbyopia. La elección depende de la receta y adaptación del usuario.' },
        },
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">Proclear Multifocal</span>
        </nav>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        <span className="inline-flex text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">Actualización de catálogo</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-4">Proclear Multifocal en República Dominicana: disponibilidad y alternativas</h1>
        <p className="text-sm text-gray-500 mb-7">Actualizado el 24 de noviembre de 2026 · Equipo ContactGo</p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <h2 className="font-bold text-amber-900 text-lg mb-2">Estado actual del catálogo</h2>
          <p className="text-sm text-amber-900 leading-relaxed">
            Proclear Multifocal estándar y Proclear Multifocal XR no aparecen disponibles en el catálogo activo de ContactGo. Por eso retiramos sus precios anteriores: no deben interpretarse como precios ni disponibilidad vigentes.
          </p>
        </section>

        <div className="space-y-7 text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">¿Qué opciones multifocales puedes consultar?</h2>
            <p className="mb-4">Estas son las alternativas multifocales que sí figuran en el catálogo actual. Los precios se muestran en sus fichas y pueden cambiar; confirma el importe y la disponibilidad antes de completar el pedido.</p>
            <div className="space-y-3">
              <Link href="/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana" className="block border border-gray-200 rounded-xl p-4 hover:border-primary-300">
                <strong>Biofinity Multifocal</strong>
                <p className="text-sm text-gray-500">Multifocal mensual · precio de catálogo de referencia RD$5,900</p>
              </Link>
              <Link href="/producto/acuvue-oasys-multifocal-lentes-contacto-dominicana" className="block border border-gray-200 rounded-xl p-4 hover:border-primary-300">
                <strong>ACUVUE OASYS Multifocal</strong>
                <p className="text-sm text-gray-500">Multifocal quincenal · precio de catálogo de referencia RD$5,900</p>
              </Link>
              <Link href="/producto/air-optix-hydraglyde-multifocal-lentes-presbicia-dominicana" className="block border border-gray-200 rounded-xl p-4 hover:border-primary-300">
                <strong>AIR OPTIX HydraGlyde Multifocal</strong>
                <p className="text-sm text-gray-500">Multifocal mensual · precio de catálogo de referencia RD$6,500</p>
              </Link>
              <Link href="/producto/clariti-1-day-multifocal-lentes-presbicia-diarios-dominicana" className="block border border-gray-200 rounded-xl p-4 hover:border-primary-300">
                <strong>clariti 1 day multifocal</strong>
                <p className="text-sm text-gray-500">Multifocal diario · precio de catálogo de referencia RD$4,450</p>
              </Link>
              <Link href="/producto/bausch-lomb-ultra-presbyopia-lentes-multifocales-dominicana" className="block border border-gray-200 rounded-xl p-4 hover:border-primary-300">
                <strong>Bausch+Lomb ULTRA for Presbyopia</strong>
                <p className="text-sm text-gray-500">Multifocal mensual · precio de catálogo de referencia RD$4,750</p>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">¿Y Proclear Multifocal Toric?</h2>
            <p className="mb-3">La versión Proclear Multifocal Toric sí aparece en el catálogo actual. Combina corrección multifocal y tórica para usuarios que necesitan corregir presbicia y astigmatismo. Su precio de referencia es RD$12,000 y el plazo estimado de entrega es de 25 a 45 días.</p>
            <Link href="/producto/proclear-multifocal-toric-lentes-presbicia-astigmatismo-dominicana" className="inline-flex items-center justify-center bg-primary-700 text-white font-semibold rounded-xl px-5 py-3 text-sm">
              Consultar Proclear Multifocal Toric
            </Link>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">¿Cómo elegir una alternativa?</h2>
            <p>La alternativa correcta depende de tu receta, graduación, adición (ADD), diseño multifocal y adaptación. No sustituyas un modelo por otro únicamente por el nombre o el precio. Si utilizabas Proclear Multifocal, comparte tu receta vigente para revisar opciones compatibles con un profesional de la salud visual.</p>
          </section>

          <p className="text-xs text-gray-500">Los precios indicados son referencias contrastadas con el catálogo de ContactGo el 24 de noviembre de 2026. El precio final y la disponibilidad vigentes son los que aparecen en la ficha del producto al momento de la compra.</p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link href="/catalogo" className="bg-teal-600 text-white font-bold rounded-xl px-6 py-3 text-center">Ver catálogo actual</Link>
          <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="border border-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 text-center">Consultar por WhatsApp</a>
        </div>
      </main>
      <Footer />
    </>
  )
}
