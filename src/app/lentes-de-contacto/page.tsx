import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en República Dominicana | ContactGo',
  description: 'Compra lentes de contacto originales en República Dominicana. Acuvue, Air Optix, Biofinity, FreshLook. Entrega en 24-48h. Distribuidores autorizados.',
  keywords: 'lentes de contacto RD, lentes contacto dominicana, comprar lentes contacto, lentes contacto santo domingo',
  openGraph: {
    title: 'Lentes de Contacto en República Dominicana — ContactGo',
    description: 'La tienda especializada #1 en lentes de contacto originales en RD.',
    url: 'https://contactgo.net/lentes-de-contacto',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'website',
  },
}

const SEO_LINKS = [
  { href: '/catalogo?tipo=esferico', label: 'Lentes de contacto para miopía en RD' },
  { href: '/catalogo?tipo=torico', label: 'Lentes de contacto para astigmatismo RD' },
  { href: '/catalogo?tipo=multifocal', label: 'Lentes multifocales dominicana' },
  { href: '/catalogo?tipo=color', label: 'Lentes de colores República Dominicana' },
  { href: '/marca/acuvue', label: 'ACUVUE República Dominicana' },
  { href: '/marca/alcon', label: 'Air Optix RD' },
  { href: '/marca/coopervision', label: 'Biofinity dominicana' },
  { href: '/marca/bausch-lomb', label: 'Bausch+Lomb RD' },
  { href: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana', label: 'Biofinity precio RD' },
  { href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana', label: 'Acuvue Oasys dominicana' },
  { href: '/catalogo?tipo=solucion', label: 'Solución para lentes de contacto RD' },
  { href: '/catalogo?tipo=gota', label: 'Gotas para ojos secos República Dominicana' },
]

export default async function LentesContactoPage() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products')
    .select('*').eq('activo', true).gt('stock', 0)
    .in('tipo', ['esferico','torico','multifocal','color'])
    .order('nombre').limit(12)

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Lentes de Contacto en República Dominicana",
    "description": "Los mejores lentes de contacto originales disponibles en República Dominicana",
    "url": "https://contactgo.net/lentes-de-contacto",
    "numberOfItems": products?.length ?? 0,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Lentes de Contacto en<br />República Dominicana
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              La tienda especializada #1 en lentes de contacto originales en RD. Acuvue, Air Optix, Biofinity y más marcas premium. Entrega en 24-48 horas.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="bg-primary-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-700 transition-all">Ver catálogo completo</Link>
              <Link href="/receta" className="border-2 border-primary-600 text-primary-600 font-bold px-6 py-3 rounded-2xl hover:bg-primary-50 transition-all">Buscar con mi receta</Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Lentes más populares en RD</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(products ?? []).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-10 border-t border-gray-100">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Guía completa de lentes de contacto en República Dominicana</h2>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-4 text-gray-700">
            <p>Los lentes de contacto son dispositivos médicos de uso frecuente en República Dominicana para corregir problemas visuales como miopía, hipermetropía, astigmatismo y presbicia. ContactGo es la tienda especializada líder en RD para comprar lentes de contacto originales con entrega rápida a domicilio.</p>
            <p>En ContactGo encontrarás las principales marcas internacionales: <strong>ACUVUE® de Johnson & Johnson</strong>, la marca #1 de lentes de contacto mundialmente; <strong>Air Optix® y FreshLook® de Alcon</strong>, conocidos por su tecnología HydraGlyde; <strong>Biofinity® y Proclear® de CooperVision</strong>, con tecnología Aquaform; y <strong>Bausch+Lomb ULTRA®</strong> con tecnología MoistureSeal.</p>
            <p>Para comprar lentes de contacto en RD necesitas una prescripción óptica vigente (no mayor a 1 año). Puedes subir tu receta directamente en nuestra web o enviárnosla por WhatsApp al (829) 472-8328. Nuestro equipo de soporte verifica que los parámetros sean correctos antes de procesar tu pedido.</p>
            <p>Los precios de lentes de contacto en República Dominicana van desde RD$3,720 para lentes diarios hasta RD$18,000 para lentes multifocales tóricos de alta graduación. Ofrecemos precios competitivos porque compramos directamente a distribuidores autorizados, sin intermediarios.</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-100">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Explora por tipo de lente</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SEO_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="text-primary-600 hover:text-primary-700 text-sm font-medium py-2 px-3 rounded-xl hover:bg-primary-50 transition-all">
                → {l.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
