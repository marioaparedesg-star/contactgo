import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en Santiago RD | Envío a Domicilio — ContactGo',
  description: 'Compra lentes de contacto con entrega en Santiago. ACUVUE, Biofinity y Air Optix de canales de distribución autorizados. Envío RD$350. Entrega estimada según el tipo de lente. Los esféricos se entregan en 24 a 72 horas.',
  alternates: { canonical: 'https://www.contactgo.net/lentes-de-contacto/santiago' },
  openGraph: {
    title: 'Lentes de Contacto en Santiago | ContactGo',
    description: 'Los lentes esféricos tienen entrega estimada de 24 a 72 horas; los demás productos tienen plazos según su categoría. Directo del fabricante.',
    url: 'https://www.contactgo.net/lentes-de-contacto/santiago',
    locale: 'es_DO', siteName: 'ContactGo', type: 'website',
  },
}

export const revalidate = 60

const faqs = [
              { q: '¿Cuánto tarda el envío a Santiago?', a: 'La entrega estimada depende del tipo de producto: esféricos, 24 a 72 horas; color disponible, siguiente día laborable; multifocales, 1 a 5 días laborables; tóricos, 25 a 45 días laborables;' },
              { q: '¿Cuánto cuesta el envío a Santiago?', a: 'El envío a Santiago tiene un costo de RD$350. Es gratuito en compras desde RD$8,000.' },
              { q: '¿Hacen entregas en toda la región del Cibao?', a: 'Sí, cubrimos Santiago, Villa González, Licey al Medio, Tamboril, Moca, La Vega y otros municipios del Cibao.' },
              { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard procesado por AZUL — Banco Popular. Pago 100% seguro con tecnología 3D Secure.' },
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
          <span className="text-gray-700 font-medium">Santiago</span>
        </nav>

        <section className="bg-gradient-to-br from-teal-700 via-teal-500 to-blue-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Envío RD$350 · entrega según producto</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes de Contacto en Santiago</h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">Entrega a domicilio en Santiago y toda la región. ACUVUE, Biofinity, Air Optix directo del fabricante.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors">Usar mi receta</Link>
            <Link href="/catalogo" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">Ver catálogo completo</Link>
          </div>
        </section>

        {(products ?? []).length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Productos disponibles con envío a Santiago</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(products ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
            </div>
            <div className="text-center mt-6">
              <Link href="/catalogo" className="btn-primary px-8 py-3">Ver todos los productos</Link>
            </div>
          </section>
        )}

        <section className="max-w-3xl mx-auto px-4 py-10 space-y-4 text-gray-600 leading-relaxed border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900">Lentes de contacto con envío a Santiago</h2>
          <p>ContactGo es la única tienda dominicana especializada 100% en lentes de contacto, con envío a domicilio en <strong>Santiago</strong> y toda su región. No necesitas ir a una óptica — los plazos de entrega dependen del tipo de producto y se aplican de forma uniforme en todo el país.</p>
          <p>Trabajamos con marcas reconocidas y canales de distribución autorizados; los productos se entregan sellados y en su empaque original. El envío a Santiago tiene un costo de <strong>RD$350</strong>, gratis en compras desde RD$8,000.</p>
          <p>¿Tienes tu receta óptica? Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta inteligente</Link> y encontramos el lente exacto en minutos.</p>

          <h3 className="font-bold text-gray-900 text-lg mt-6">Marcas más pedidas en Santiago</h3>
          <p>Los clientes de Santiago prefieren <strong>ACUVUE® OASYS®</strong> para uso diario intenso y <strong>Biofinity®</strong> para uso mensual. Los lentes de color <strong>FreshLook® Colorblends</strong> son muy populares entre jóvenes del Cibao.</p>
          
          <h3 className="font-bold text-gray-900 text-lg mt-6">Sectores con cobertura de entrega</h3>
          <p>Cubrimos todos los sectores de Santiago: <strong>Centro de la Ciudad, Los Jardines, Pueblo Nuevo, Las Colinas, La Trinitaria, Bella Vista, Ensanche Bermúdez, Gurabo</strong> y todos los municipios del Gran Santiago incluyendo Licey al Medio, Tamboril, Villa González y Puñal.</p>
          
          <h3 className="font-bold text-gray-900 text-lg mt-6">¿Cómo enviar tu receta desde Santiago?</h3>
          <p>Tienes tres opciones desde Santiago: (1) Usa nuestra <a href="/receta" className="text-primary-600 font-semibold">calculadora de receta en línea</a> con los valores de tu prescripción. (2) Envíanos una foto clara de tu receta por WhatsApp al (809) 694-2268. (3) Indica los valores de Esfera, Cilindro y Eje al hacer tu pedido. Tu optómetra de confianza en Santiago puede darte estos datos.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[['🚚','Envío RD$350'],['📦','Entrega según producto'],['✅','Canales autorizados'],['↩️','Devolución 7 días']].map(([i,t]) => (
              <div key={String(t)} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <span className="text-xl block mb-1">{i}</span>
                <span className="text-xs font-semibold text-gray-600">{t}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes — Santiago</h2>
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
        "name": "ContactGo — Lentes de Contacto Santiago de los Caballeros",
        "url": "https://www.contactgo.net/lentes-de-contacto/santiago",
        "telephone": "+1-809-694-2268",
        "email": "info@contactgo.net",
        "areaServed": {
          "@type": "City",
          "name": "Santiago de los Caballeros",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Santiago",
            "addressCountry": "DO"
          }
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Lentes de contacto en Santiago de los Caballeros",
          "url": "https://www.contactgo.net/catalogo"
        }
      })}} />
      </main>
      <Footer />
    </>
  )
}
