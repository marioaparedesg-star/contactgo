import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en Santiago RD | Envío a Domicilio — ContactGo',
  description: 'Compra lentes de contacto con entrega en Santiago. ACUVUE, Biofinity, Air Optix 100% originales. Envío RD$350. Entrega en 24-48 horas.',
  alternates: { canonical: 'https://www.contactgo.net/lentes-de-contacto/santiago' },
  openGraph: {
    title: 'Lentes de Contacto en Santiago | ContactGo',
    description: 'Entrega a domicilio en Santiago en 24-48 horas. Productos 100% Originales.',
    url: 'https://www.contactgo.net/lentes-de-contacto/santiago',
    locale: 'es_DO', siteName: 'ContactGo', type: 'website',
  },
}

export const revalidate = 60

const faqs = [
              { q: '¿Cuánto tarda el envío a Santiago?', a: 'Entregamos en 24-48 horas hábiles en Santiago de los Caballeros. Pedidos realizados antes de las 3pm salen el mismo día.' },
              { q: '¿Cuánto cuesta el envío a Santiago?', a: 'El envío a Santiago tiene un costo de RD$350. Es gratuito en pedidos superiores a RD$6,000.' },
              { q: '¿Hacen entregas en toda la región del Cibao?', a: 'Sí, cubrimos Santiago, Villa González, Licey al Medio, Tamboril, Moca, La Vega y otros municipios del Cibao.' },
              { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard procesado por AZUL — Banco Popular. Pago 100% seguro con tecnología 3D Secure.' },
]

export default async function Page() {
  const sb = createServerSupabaseClient()
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

        <section className="bg-gradient-to-br from-teal-700 via-primary-600 to-blue-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">Envío RD$350 · 24-48 horas</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes de Contacto en Santiago</h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">Entrega a domicilio en Santiago y toda la región. ACUVUE, Biofinity, Air Optix 100% originales.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">Usar mi receta</Link>
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
          <p>ContactGo es la única tienda dominicana especializada 100% en lentes de contacto, con envío a domicilio en <strong>Santiago</strong> y toda su región. No necesitas ir a una óptica — tus lentes llegan directamente donde estás en 24-48 horas.</p>
          <p>Todos nuestros productos son 100% originales, 100% originales y certificados. El envío a Santiago tiene un costo de <strong>RD$350</strong>, gratis en pedidos superiores a RD$6,000.</p>
          <p>¿Tienes tu receta óptica? Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta inteligente</Link> y encontramos el lente exacto en minutos.</p>

          <h3 className="font-bold text-gray-900 text-lg mt-6">Marcas más pedidas en Santiago</h3>
          <p>Los clientes de Santiago prefieren <strong>ACUVUE® OASYS®</strong> para uso diario intenso y <strong>Biofinity®</strong> para uso mensual. Los lentes de color <strong>FreshLook® Colorblends</strong> son muy populares entre jóvenes del Cibao.</p>
          
          <h3 className="font-bold text-gray-900 text-lg mt-6">Sectores con entrega en 24-48h</h3>
          <p>Cubrimos todos los sectores de Santiago: <strong>Centro de la Ciudad, Los Jardines, Pueblo Nuevo, Las Colinas, La Trinitaria, Bella Vista, Ensanche Bermúdez, Gurabo</strong> y todos los municipios del Gran Santiago incluyendo Licey al Medio, Tamboril, Villa González y Puñal.</p>
          
          <h3 className="font-bold text-gray-900 text-lg mt-6">¿Cómo enviar tu receta desde Santiago?</h3>
          <p>Tienes tres opciones desde Santiago: (1) Usa nuestra <a href="/receta" className="text-primary-600 font-semibold">calculadora de receta en línea</a> con los valores de tu prescripción. (2) Envíanos una foto clara de tu receta por WhatsApp al (829) 472-8328. (3) Indica los valores de Esfera, Cilindro y Eje al hacer tu pedido. Tu optómetra de confianza en Santiago puede darte estos datos.</p>
          
          <h3 className="font-bold text-gray-900 text-lg mt-6">Lo que dicen nuestros clientes en Santiago</h3>
          <div className="bg-gray-50 rounded-2xl p-4 border-l-4 border-primary-500">
            <p className="text-gray-700 text-sm italic">"Primera vez comprando lentes online y quedé impresionado. El proceso fue muy sencillo y el empaque llegó perfecto a mi casa en Santiago."</p>
            <p className="text-xs text-gray-500 mt-2 font-semibold">— Carlos M., Santiago de los Caballeros ⭐⭐⭐⭐⭐</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[['🚚','Envío RD$350'],['📦','24-48 horas'],['✅','100% Original'],['↩️','Dev. 48 horas']].map(([i,t]) => (
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
        "telephone": "+1-829-472-8328",
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
