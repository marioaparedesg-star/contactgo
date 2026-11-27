import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en Santo Domingo RD — ContactGo',
  description: 'Compra lentes de contacto con entrega a domicilio en Santo Domingo. ACUVUE, Biofinity y Air Optix. Envío RD$250. Transporte estimado de 24-48 horas; el plazo total depende del tipo de lente.',
  alternates: { canonical: 'https://www.contactgo.net/lentes-de-contacto/santo-domingo' },
  openGraph: {
    title: 'Lentes de Contacto en Santo Domingo | ContactGo',
    description: 'Transporte estimado de 24-48 horas en Santo Domingo. El plazo total depende del tipo de lente.',
    url: 'https://www.contactgo.net/lentes-de-contacto/santo-domingo',
    locale: 'es_DO', siteName: 'ContactGo', type: 'website',
  },
}

export const revalidate = 60

const faqs = [
  { q: '¿Cuánto tarda el envío en Santo Domingo?', a: 'El transporte hacia Santo Domingo se estima en 24-48 horas. El plazo total depende del producto: color disponible al día siguiente, esféricos 24-48 horas, multifocales 1-5 días y tóricos 25-45 días.' },
  { q: '¿Cuánto cuesta el envío a Santo Domingo?', a: 'El envío a Santo Domingo tiene un costo fijo de RD$250. Es gratuito en compras desde RD$8,000.' },
  { q: '¿Hacen entregas en todos los sectores de Santo Domingo?', a: 'Sí, cubrimos todos los sectores: Piantini, Naco, Evaristo Morales, Los Prados, Bella Vista, Gazcue, Los Cacicazgos, La Esperilla, El Millón, Los Alcarrizos, Herrera, Villa Mella y más.' },
  { q: '¿Qué métodos de pago aceptan en Santo Domingo?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard procesado por AZUL — Banco Popular. Pago 100% seguro con tecnología 3D Secure.' },
]

export default async function Page() {
  const sb = await createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('id, nombre, slug, precio, imagen_url, tipo, stock, marca, reemplazo, contenido, sph_disponibles, colores_disponibles, activo, archivado')
    .eq('activo', true).gt('stock', 0)
    .in('tipo', ['esferico','torico','multifocal','color'])
    .order('nombre').limit(8)

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/lentes-de-contacto" className="hover:text-primary-600">Lentes de Contacto</Link><span>/</span>
          <span className="text-gray-700 font-medium">Santo Domingo</span>
        </nav>

        <section className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Envío RD$250 · transporte 24-48h</span>
          <h1 className="cg-page-title mb-4">Lentes de Contacto en Santo Domingo</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">Entrega a domicilio en toda el área metropolitana. ACUVUE, Biofinity, Air Optix y más, de marcas reconocidas, en su empaque original y sellado.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors">Usar mi receta</Link>
            <Link href="/catalogo" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">Ver catálogo completo</Link>
          </div>
        </section>

        {/* Productos populares */}
        {(products ?? []).length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Productos más pedidos en Santo Domingo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
            </div>
            <div className="text-center mt-6">
              <Link href="/catalogo" className="btn-primary px-8 py-3">Ver todos los productos</Link>
            </div>
          </section>
        )}

        {/* Contenido SEO */}
        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Compra lentes de contacto en Santo Domingo sin salir de casa</h2>
          <p>ContactGo es la única tienda dominicana especializada 100% en lentes de contacto, con entrega a domicilio en toda el área metropolitana de <strong>Santo Domingo</strong>. El plazo estimado depende del producto; el transporte en la capital suele tomar 24-48 horas.</p>
          <p>Trabajamos con marcas reconocidas y entregamos los productos en su empaque original sellado; los productos se entregan sellados y en su empaque original. El envío a Santo Domingo tiene un costo fijo de <strong>RD$250</strong> y es gratuito en compras desde RD$8,000.</p>
          <p>¿Tienes tu receta óptica? Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta inteligente</Link> y encontramos el lente exacto según tu SPH, CYL y AXIS en minutos.</p>

          {/* Trust strip */}

          <h3 className="font-bold text-gray-900 text-lg mt-6">Marcas más pedidas en Santo Domingo</h3>
          <p>Los clientes de la capital prefieren <strong>ACUVUE® OASYS®</strong> para uso diario y laboral, y <strong>AIR OPTIX® Colors</strong> para ocasiones especiales. Los lentes <strong>Biofinity®</strong> mensuales son favoritos en zonas como Piantini y Naco por su comodidad duradera.</p>

          <h3 className="font-bold text-gray-900 text-lg mt-6">Sectores con entrega en 24 horas</h3>
          <p>Cubrimos toda la Gran Santo Domingo: <strong>Piantini, Naco, Mirador Sur, Bella Vista, Gazcue, Zona Colonial, Los Cacicazgos, Arroyo Hondo, La Esperilla, Serralles, Los Prados, Evaristo Morales</strong> y también sectores populares como <strong>Los Mina, Villa Mella, Herrera, Cristo Rey, Villas Agrícolas, Alma Rosa y Km 13</strong>. También entregamos en el Distrito Nacional y la provincia Santo Domingo Este, Oeste y Norte.</p>

          <h3 className="font-bold text-gray-900 text-lg mt-6">¿Cómo enviar tu receta desde Santo Domingo?</h3>
          <p>Tienes tres opciones: (1) Usa nuestra <a href="/receta" className="text-primary-600 font-semibold">calculadora de receta</a> con los valores de tu prescripción. (2) Envíanos foto de tu receta por WhatsApp al (809) 694-2268.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[['🚚','Envío RD$250'],['📦','Transporte 24-48h'],['✅','Productos originales'],['↩️','Devolución 7 días']].map(([i,t]) => (
              <div key={String(t)} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <span className="text-xl block mb-1">{i}</span>
                <span className="text-xs font-semibold text-gray-600">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes — Santo Domingo</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
        })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ContactGo — Lentes de Contacto Santo Domingo",
        "url": "https://www.contactgo.net/lentes-de-contacto/santo-domingo",
        "telephone": "+1-809-694-2268",
        "email": "info@contactgo.net",
        "areaServed": {
          "@type": "City",
          "name": "Santo Domingo",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Distrito Nacional",
            "addressCountry": "DO"
          }
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Lentes de contacto en Santo Domingo",
          "url": "https://www.contactgo.net/catalogo"
        }
      })}} />
      </main>
      <Footer />
    </>
  )
}
