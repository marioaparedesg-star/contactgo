export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de contacto en Jimaní — Entrega a domicilio 2026 — ContactGo',
  description: 'Compra lentes de contacto con entrega en Jimaní, Independencia. ACUVUE, Biofinity, Air Optix originales. Entrega 24-48h. Sin salir de casa. Pago con AZUL.',
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-contacto-jimani' },
  openGraph: {
    type: 'article', title: 'Lentes de contacto en Jimaní — Entrega a tu puerta 2026',
    description: 'Compra lentes de contacto con entrega en Jimaní, Independencia. ACUVUE, Biofinity, Air Optix originales. Entrega 24-48h. Sin salir de casa. Pago con AZUL.',
    url: 'https://www.contactgo.net/blog/lentes-contacto-jimani',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/lentes-contacto-entrega-rd.webp', width: 1200, height: 630, alt: 'Lentes de contacto en Jimaní — Entrega a tu puerta 2026' }],
  },
}

export default function Page() {
  const MARCAS = [
    { nombre: 'ACUVUE® Oasys', precio: 'RD$3,875', slug: 'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana', tipo: 'Quincenal' },
    { nombre: 'Air Optix® HydraGlyde', precio: 'RD$4,375', slug: 'air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana', tipo: 'Mensual' },
    { nombre: 'Biofinity®', precio: 'RD$4,750', slug: 'biofinity-lentes-contacto-mensuales-coopervision-dominicana', tipo: 'Mensual' },
    { nombre: '1-DAY ACUVUE® MOIST®', precio: 'RD$3,875', slug: '1-day-acuvue-moist-lentes-contacto-diarios-dominicana', tipo: 'Diario' },
    { nombre: 'Air Optix® COLORS', precio: 'RD$2,625', slug: 'air-optix-colors-lentes-contacto-color-dominicana', tipo: 'Color mensual' },
    { nombre: 'Bausch+Lomb ULTRA®', precio: 'RD$4,500', slug: 'bausch-lomb-ultra-lentes-contacto-mensuales-dominicana', tipo: 'Mensual' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Lentes de contacto en Jimaní — Entrega a tu puerta 2026",
            "description": "Compra lentes de contacto con entrega en Jimaní, Independencia. ACUVUE, Biofinity, Air Optix originales. Entrega 24-48h. Sin salir de casa. Pago con AZUL.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-20", "dateModified": "2026-06-20",
            "url": "https://www.contactgo.net/blog/lentes-contacto-jimani", "inLanguage": "es-DO",
            "about": { "@type": "Place", "name": "Jimaní", "addressCountry": "DO" } },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "¿Hacen entrega de lentes de contacto en Jimaní?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. ContactGo entrega lentes de contacto originales en Jimaní y la provincia de Independencia en 24-48 horas. El proceso es 100% online y el pago con tarjeta a través de AZUL/Banco Popular." } },
              { "@type": "Question", "name": "¿Cuánto cuesta el envío a Jimaní?", "acceptedAnswer": { "@type": "Answer", "text": "El costo de envío a Jimaní se calcula al momento del checkout. Los pedidos superiores a RD$8,000 tienen envío gratuito. Consulta el costo exacto al agregar tu dirección de entrega." } },
              { "@type": "Question", "name": "¿Cuánto tarda la entrega en Jimaní?", "acceptedAnswer": { "@type": "Answer", "text": "La entrega en Jimaní es en 24-48 horas hábiles para la mayoría de los pedidos. Pedidos realizados antes de las 3pm salen el mismo día." } },
              { "@type": "Question", "name": "¿Qué marcas de lentes puedo comprar con entrega en Jimaní?", "acceptedAnswer": { "@type": "Answer", "text": "En ContactGo tienes acceso a más de 35 productos de ACUVUE, Air Optix, Biofinity, Bausch+Lomb, CooperVision y más, todos originales y sellados de fábrica." } }
            ] },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Lentes en Jimaní", "item": "https://www.contactgo.net/blog/lentes-contacto-jimani" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Lentes en Jimaní</span>
        </div>

        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">📍 Entrega en Jimaní</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto en Jimaní — Entrega a tu puerta 2026</h1>

        <div className="flex items-center gap-3 mb-5 p-4 bg-green-50 border border-green-100 rounded-2xl">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="text-sm font-bold text-green-800">Entrega 24-48h en Jimaní y Jimaní y la provincia de Independencia</p>
            <p className="text-xs text-green-600">100% originales · Pago seguro con AZUL/Banco Popular</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Comprar lentes de contacto en Jimaní nunca fue tan fácil. ContactGo entrega directamente en Jimaní y la provincia de Independencia en 24-48 horas — sin necesidad de visitar ninguna tienda. Más de 35 productos de las marcas más reconocidas del mundo, 100% originales y sellados de fábrica.</p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Productos más vendidos disponibles en Jimaní</h2>
            <div className="space-y-2">
              {MARCAS.map(m => (
                <a key={m.slug} href={`/producto/${m.slug}`} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group">
                  <div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">{m.nombre}</p><p className="text-xs text-gray-500">{m.tipo}</p></div>
                  <div className="text-right shrink-0 ml-3"><p className="font-black text-gray-900 text-sm">{m.precio}</p><p className="text-[11px] text-primary-600">Ver →</p></div>
                </a>
              ))}
            </div>
            <Link href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo (35+ productos) →</Link>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cómo recibir lentes en Jimaní?</h2>
            <div className="space-y-3">
              {[
                { paso: '1', titulo: 'Elige tu lente en línea', desc: 'Busca por marca, tipo o graduación. Más de 35 productos disponibles.' },
                { paso: '2', titulo: 'Ingresa tu dirección en Jimaní', desc: 'Al hacer checkout, ingresa tu dirección exacta en Jimaní y la provincia de Independencia.' },
                { paso: '3', titulo: 'Paga con AZUL de forma segura', desc: 'Tarjeta VISA o Mastercard. Procesado por AZUL/Banco Popular.' },
                { paso: '4', titulo: 'Recibe en 24-48h', desc: 'El mensajero te contacta para coordinar. Sin necesidad de estar en un lugar fijo.' },
              ].map(s => (
                <div key={s.paso} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">{s.paso}</div>
                  <div><p className="font-bold text-gray-900 text-sm">{s.titulo}</p><p className="text-xs text-gray-600">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Preguntas frecuentes — Entrega en Jimaní</h2>
            <div className="space-y-3">
              {[
                { q: '¿Hacen entrega en Jimaní?', a: 'Sí. ContactGo entrega lentes de contacto originales en Jimaní y la provincia de Independencia en 24-48 horas hábiles.' },
                { q: '¿Necesito receta para pedir?', a: 'Para lentes graduados sí necesitas tu prescripción. Para lentes de color sin graduación no es necesaria.' },
                { q: '¿Cuánto tarda la entrega en Jimaní?', a: 'Entre 24 y 48 horas hábiles para la mayoría de los pedidos. Pedidos antes de las 3pm suelen salir el mismo día.' },
                { q: '¿Cómo pago?', a: 'Con tarjeta de crédito o débito VISA/Mastercard a través de AZUL/Banco Popular. Pago 100% seguro.' },
              ].map((item, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">{item.q}<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="grid gap-2">
            <h3 className="font-bold text-gray-900">También puede interesarte</h3>
            <a href="/blog/comprar-lentes-contacto-online-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo comprar lentes online en RD con seguridad</p><p className="text-xs text-gray-500 mt-0.5">Guía completa de compra segura</p></a>
            <a href="/blog/acuvue-oasys-precio-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ ACUVUE Oasys precio en RD</p><p className="text-xs text-gray-500 mt-0.5">Los más vendidos con precio actualizado</p></a>
            <a href="/blog/como-leer-receta-optica-rd" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo leer tu receta óptica</p><p className="text-xs text-gray-500 mt-0.5">Qué significa cada valor</p></a>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-1">Recibe en Jimaní en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL · Sin salir de casa</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18295430580?text=Hola%2C%20quiero%20lentes%20con%20entrega%20en%20Jimaní" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Pedir por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
