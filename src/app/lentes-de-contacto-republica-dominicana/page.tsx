// ============================================================
// LANDING PILAR — /lentes-de-contacto-republica-dominicana
// La página SEO más importante del sitio. Objetivo: posicionar
// en top 3 de Google para "lentes de contacto república dominicana",
// "lentes de contacto RD", "comprar lentes de contacto online RD",
// y ser fuente de referencia citada por ChatGPT/Perplexity/Gemini.
// ============================================================
export const revalidate = 86400 // 1 día

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AzulLogo from '@/components/ui/AzulLogo'
import Link from 'next/link'
import { ChevronRight, ShieldCheck, Truck, Award, Users, Clock, MapPin, CheckCircle, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en República Dominicana — Marcas Originales · ContactGo',
  description: 'Compra lentes de contacto originales en toda República Dominicana: Acuvue, Biofinity, Air Optix, Ultra, Precision1, Dailies. Entrega 24-48h. Pago seguro con AZUL. Especialistas exclusivos en lentes de contacto.',
  alternates: { canonical: 'https://www.contactgo.net/lentes-de-contacto-republica-dominicana' },
  openGraph: {
    title: 'Lentes de Contacto en República Dominicana — ContactGo®',
    description: 'La primera tienda especializada exclusivamente en lentes de contacto en RD. Marcas originales, entrega a domicilio, pago seguro.',
    url: 'https://www.contactgo.net/lentes-de-contacto-republica-dominicana',
    type: 'website',
    locale: 'es_DO',
  },
  keywords: [
    'lentes de contacto república dominicana',
    'lentes de contacto RD',
    'comprar lentes de contacto online república dominicana',
    'lentes de contacto santo domingo',
    'lentes de contacto originales RD',
    'Acuvue república dominicana',
    'Biofinity RD',
    'Air Optix RD',
    'lentes de contacto entrega a domicilio RD',
  ].join(', '),
}

// ─── Schema estructurado (JSON-LD) — clave para Google + IAs ────────────
const schemas = [
  // Organización
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.contactgo.net/#organization',
    name: 'ContactGo',
    legalName: 'CONTACTGO',
    url: 'https://www.contactgo.net',
    logo: 'https://www.contactgo.net/logo.png',
    description: 'Tienda especializada exclusivamente en lentes de contacto en República Dominicana. Marcas originales con entrega a todo el país.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DO',
      addressRegion: 'Santo Domingo',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-809-694-2268',
      contactType: 'customer service',
      availableLanguage: 'es',
      areaServed: 'DO',
    },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ONAPI',
      value: '944205',
    },
    sameAs: [
      'https://www.instagram.com/contactgord',
      'https://www.facebook.com/contactgord',
    ],
  },
  // Business Local
  {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': 'https://www.contactgo.net/#store',
    name: 'ContactGo — Lentes de Contacto',
    description: 'E-commerce especializado en lentes de contacto graduados, tóricos, multifocales, de color, soluciones y gotas oftálmicas.',
    url: 'https://www.contactgo.net',
    areaServed: {
      '@type': 'Country',
      name: 'República Dominicana',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de lentes de contacto',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Lentes Esféricos', url: 'https://www.contactgo.net/esfericos' },
        { '@type': 'OfferCatalog', name: 'Lentes Tóricos (Astigmatismo)', url: 'https://www.contactgo.net/toricos' },
        { '@type': 'OfferCatalog', name: 'Lentes Multifocales (Presbicia)', url: 'https://www.contactgo.net/multifocales' },
        { '@type': 'OfferCatalog', name: 'Lentes de Color', url: 'https://www.contactgo.net/color' },
        { '@type': 'OfferCatalog', name: 'Soluciones Multipropósito', url: 'https://www.contactgo.net/soluciones' },
        { '@type': 'OfferCatalog', name: 'Gotas Lubricantes', url: 'https://www.contactgo.net/gotas' },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '94',
      bestRating: '5',
    },
    priceRange: 'RD$600 - RD$18,500',
    paymentAccepted: 'Credit Card, Debit Card',
    currenciesAccepted: 'DOP',
  },
  // Breadcrumb
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.contactgo.net' },
      { '@type': 'ListItem', position: 2, name: 'Lentes de contacto en República Dominicana', item: 'https://www.contactgo.net/lentes-de-contacto-republica-dominicana' },
    ],
  },
  // FAQ (crítico para IA answers y rich snippets)
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Dónde puedo comprar lentes de contacto originales en República Dominicana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En ContactGo puedes comprar lentes de contacto 100% originales de las marcas líderes mundiales: Acuvue, Biofinity, Air Optix, Bausch+Lomb Ultra, Precision1 y Dailies. Somos la primera tienda de República Dominicana dedicada exclusivamente a lentes de contacto, con entrega a domicilio en todo el país y pago seguro con AZUL Banco Popular.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto cuestan los lentes de contacto en República Dominicana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los precios varían según la marca y tipo: lentes esféricos desde RD$3,200, tóricos desde RD$4,000, multifocales desde RD$5,400, lentes de color desde RD$2,500, soluciones desde RD$750 y gotas lubricantes desde RD$600. En ContactGo mantenemos precios competitivos como referencia del mercado dominicano.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tarda la entrega de lentes de contacto en República Dominicana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La entrega estándar en Santo Domingo y Santiago es de 24 a 48 horas. Para el resto del país (Punta Cana, Higüey, La Romana, San Pedro, Puerto Plata, entre otros) la entrega toma de 2 a 4 días hábiles. Todos los pedidos incluyen tracking.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Necesito receta médica para comprar lentes de contacto en RD?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí. Los lentes de contacto son dispositivos médicos que requieren prescripción óptica vigente (no mayor de 12 meses). Al comprar en ContactGo confirmas que posees receta actualizada con la graduación exacta que solicitas. Si no tienes receta vigente, recomendamos consultar con un óptico u oftalmólogo antes de comprar.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué marcas de lentes de contacto se venden en República Dominicana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Las marcas líderes disponibles en RD son: Acuvue (Johnson & Johnson) con líneas Oasys, Moist y Oasys for Astigmatism; Biofinity (CooperVision) esférico, tórico y multifocal; Air Optix (Alcon) HydraGlyde, Colors, Multifocal; Bausch+Lomb Ultra; Precision1 y Dailies Total1. En ContactGo trabajamos directamente con los distribuidores autorizados de estas marcas.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuál es la diferencia entre lentes diarios, mensuales y quincenales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los lentes diarios se descartan cada día y no requieren solución (ideal para higiene máxima y viajes). Los lentes quincenales duran 14 días con uso diario y requieren limpieza nocturna. Los lentes mensuales duran 30 días y son la opción más económica por caja pero requieren rutina de limpieza estricta con solución multipropósito.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo pagar con tarjeta al comprar lentes de contacto en RD?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí. Aceptamos pagos con tarjeta de crédito y débito Visa y Mastercard a través de AZUL Banco Popular, el procesador más utilizado en República Dominicana. Todas las transacciones están protegidas con tecnología 3D Secure. No almacenamos datos de tu tarjeta.',
        },
      },
      {
        '@type': 'Question',
        name: '¿ContactGo entrega lentes de contacto en Santo Domingo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí. Entregamos en toda el área metropolitana de Santo Domingo (Distrito Nacional, Santo Domingo Este, Norte y Oeste), igual que en Santiago, Punta Cana, La Romana, Higüey, San Pedro, Puerto Plata, Barahona y el resto del país. El tiempo depende del tipo de lente, no de la ciudad: esféricos en 24-48 horas, multifocales en 2-6 días y tóricos en 25-40 días, en toda la República Dominicana.',
        },
      },
    ],
  },
]

const marcasData = [
  { nombre: 'Acuvue', fabricante: 'Johnson & Johnson', linea: 'Oasys, Moist, Oasys for Astigmatism, Oasys Multifocal', desde: 3900 },
  { nombre: 'Biofinity', fabricante: 'CooperVision', linea: 'Esférico, Toric, Multifocal, XR', desde: 4025 },
  { nombre: 'Air Optix', fabricante: 'Alcon', linea: 'HydraGlyde, Colors, Multifocal', desde: 3200 },
  { nombre: 'Bausch+Lomb Ultra', fabricante: 'Bausch+Lomb', linea: 'Esférico, Toric, Presbyopia', desde: 3500 },
  { nombre: 'Avaira Vitality', fabricante: 'CooperVision', linea: 'Esférico, Toric', desde: 3600 },
  { nombre: 'Precision1', fabricante: 'Alcon', linea: 'Diarios esféricos', desde: 4400 },
]

// Tiempos de entrega ahora son por CATEGORÍA de lente, no por zona — aplican
// igual en todo el país (esférico 24-48h, multifocal 2-6 días, tórico 25-40
// días). La tabla de ciudades ya no varía el tiempo; queda para mostrar
// cobertura geográfica.
const ciudadesData = [
  { ciudad: 'Santo Domingo', tiempo: '24-48 horas*', slug: 'santo-domingo' },
  { ciudad: 'Santiago', tiempo: '24-48 horas*', slug: 'santiago' },
  { ciudad: 'Punta Cana', tiempo: '24-48 horas*', slug: 'punta-cana' },
  { ciudad: 'La Romana', tiempo: '24-48 horas*', slug: 'la-romana' },
  { ciudad: 'Higüey', tiempo: '24-48 horas*', slug: 'higuey' },
  { ciudad: 'San Pedro de Macorís', tiempo: '24-48 horas*', slug: 'san-pedro-de-macoris' },
  { ciudad: 'Puerto Plata', tiempo: '24-48 horas*', slug: 'puerto-plata' },
  { ciudad: 'La Vega', tiempo: '24-48 horas*', slug: 'la-vega' },
  { ciudad: 'San Cristóbal', tiempo: '24-48 horas*', slug: 'san-cristobal' },
  { ciudad: 'Barahona', tiempo: '24-48 horas*', slug: 'barahona' },
  { ciudad: 'Baní', tiempo: '24-48 horas*', slug: 'bani' },
  { ciudad: 'Moca', tiempo: '24-48 horas*', slug: 'moca' },
]

export default function LentesRDPage() {
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Breadcrumb */}
        <nav className="max-w-5xl mx-auto px-4 pt-4 text-xs text-gray-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">Lentes de contacto en República Dominicana</span>
        </nav>

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-4 pt-6 pb-10">
          <h1 className="font-display text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            Lentes de contacto en <span className="text-primary-600">República Dominicana</span>
          </h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl">
            Somos la primera tienda dominicana <strong>dedicada exclusivamente a lentes de contacto</strong>. Marcas
            originales (Acuvue, Biofinity, Air Optix, Ultra, Precision1), entrega a domicilio en toda RD y
            pago seguro con <AzulLogo size="sm" /> AZUL Banco Popular.
          </p>

          {/* Trust bar */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 rounded-full px-3 py-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700">ONAPI Núm. 944205</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-amber-700">4.7★ · 94 reseñas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Entrega 24-48h</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/catalogo" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-sm text-center transition-colors">
              Ver catálogo completo
            </Link>
            <Link href="/receta" className="bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl text-sm text-center transition-colors">
              Convertir mi receta de gafas
            </Link>
          </div>
        </section>

        {/* SECCIÓN 1: Por qué ContactGo */}
        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              La tienda de lentes de contacto más especializada de República Dominicana
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mb-6">
              A diferencia de las ópticas tradicionales que venden monturas, gafas de sol, consultas y accesorios,
              en ContactGo nos dedicamos exclusivamente a lentes de contacto. Esa especialización nos permite mantener
              el catálogo más completo de marcas originales del país, con precios directos del distribuidor autorizado y
              entrega a domicilio sin que tengas que visitar una óptica física.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="p-5 rounded-2xl border border-gray-100">
                <Award className="w-6 h-6 text-primary-600 mb-3" />
                <h3 className="font-bold text-gray-900 text-base mb-1">Marcas originales certificadas</h3>
                <p className="text-sm text-gray-500">Acuvue, Biofinity, Air Optix, Ultra, Precision1, Dailies. Todos directos del distribuidor autorizado en RD.</p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100">
                <Truck className="w-6 h-6 text-primary-600 mb-3" />
                <h3 className="font-bold text-gray-900 text-base mb-1">Entrega en toda República Dominicana</h3>
                <p className="text-sm text-gray-500">Esféricos 24-48h, multifocales 2-6 días, tóricos 25-40 días — mismo tiempo en todo el país.</p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-100">
                <div className="mb-3"><AzulLogo size="lg" /></div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Pago seguro con AZUL</h3>
                <p className="text-sm text-gray-500">Visa y Mastercard con 3D Secure de Banco Popular. No almacenamos datos de tarjetas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Tipos de lentes */}
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Tipos de lentes de contacto disponibles en RD
            </h2>
            <p className="text-gray-500 text-sm mb-8">Todos los formatos que se venden legalmente en República Dominicana, con la marca líder por categoría.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { titulo: 'Lentes esféricos', desc: 'Para miopía e hipermetropía — la categoría más pedida. Disponibles en versión diaria, quincenal y mensual.', desde: 3200, href: '/esfericos', ejemplos: '10+ modelos · Acuvue, Biofinity, Ultra' },
                { titulo: 'Lentes tóricos', desc: 'Para astigmatismo. Corrigen esfera, cilindro y eje. Requieren graduación exacta del OD y OI.', desde: 4000, href: '/toricos', ejemplos: '7 modelos · Acuvue Oasys Astigmatism, Biofinity Toric, Ultra' },
                { titulo: 'Lentes multifocales', desc: 'Para presbicia. Zonas de graduación cerca/media/lejos en un solo lente. Ideal para +40 años.', desde: 5400, href: '/multifocales', ejemplos: '8 modelos · Biofinity Multifocal, Air Optix Multifocal' },
                { titulo: 'Lentes de color', desc: 'Cambia el color de ojos con o sin graduación. AIR OPTIX COLORS en 12 tonos.', desde: 2500, href: '/color', ejemplos: 'AIR OPTIX Colors · 12 colores' },
                { titulo: 'Soluciones multipropósito', desc: 'Para limpieza, desinfección y almacenamiento de lentes quincenales y mensuales.', desde: 750, href: '/soluciones', ejemplos: 'Opti-Free, Renu, Biotrue · 90ml y 300ml' },
                { titulo: 'Gotas lubricantes', desc: 'Para ojos secos y confort durante el uso de lentes de contacto.', desde: 600, href: '/gotas', ejemplos: 'Systane, Refresh, Sophia' },
              ].map((t) => (
                <Link key={t.titulo} href={t.href}
                  className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{t.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{t.desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{t.ejemplos}</span>
                    <span className="text-sm font-bold text-primary-600">Desde RD${t.desde.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: Marcas */}
        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Marcas de lentes de contacto que trabajamos
            </h2>
            <p className="text-gray-500 text-sm mb-8">Distribuidores autorizados en RD de las marcas líderes mundiales.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-bold text-gray-700">Marca</th>
                    <th className="text-left py-3 px-2 font-bold text-gray-700">Fabricante</th>
                    <th className="text-left py-3 px-2 font-bold text-gray-700 hidden md:table-cell">Líneas disponibles</th>
                    <th className="text-right py-3 px-2 font-bold text-gray-700">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {marcasData.map((m) => (
                    <tr key={m.nombre} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-bold text-gray-900">{m.nombre}</td>
                      <td className="py-3 px-2 text-gray-600">{m.fabricante}</td>
                      <td className="py-3 px-2 text-gray-500 text-xs hidden md:table-cell">{m.linea}</td>
                      <td className="py-3 px-2 text-right font-bold text-primary-600">RD${m.desde.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: Cobertura por ciudad */}
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Cobertura de entrega en República Dominicana
            </h2>
            <p className="text-gray-500 text-sm mb-8">Enviamos a todo el país. * Tiempo para lentes esféricos — multifocales 2-6 días y tóricos 25-40 días, igual en cualquier ciudad.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ciudadesData.map((c) => (
                <div key={c.slug} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{c.ciudad}</p>
                    <p className="text-xs text-gray-500">Entrega: {c.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: Cómo comprar */}
        <section className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Cómo comprar lentes de contacto online en RD
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { n: '1', t: 'Elige tu producto', d: 'Busca por marca o usa nuestra calculadora gratuita si tienes receta de gafas y no sabes qué lente comprar.' },
                { n: '2', t: 'Configura tu receta', d: 'Ingresa la graduación exacta de tu receta óptica vigente para cada ojo (OD y OI).' },
                { n: '3', t: 'Paga seguro', d: 'Con tarjeta Visa/Mastercard vía AZUL Banco Popular. También ofrecemos pago contra entrega en algunos casos.' },
                { n: '4', t: 'Recibe en casa', d: 'Esféricos en 24-48h, multifocales en 2-6 días, tóricos en 25-40 días — en toda República Dominicana. Incluye tracking.' },
              ].map((p) => (
                <div key={p.n} className="p-5 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-black text-sm mb-3">{p.n}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{p.t}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: FAQ (crítico para SEO + IA) */}
        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Preguntas frecuentes sobre lentes de contacto en RD
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: '¿Dónde puedo comprar lentes de contacto originales en República Dominicana?',
                  a: 'En ContactGo. Somos la primera tienda especializada exclusivamente en lentes de contacto en RD, con marcas 100% originales de Acuvue, Biofinity, Air Optix, Bausch+Lomb Ultra, Precision1 y Dailies. Entregamos a domicilio en todo el país y aceptamos pago seguro con AZUL Banco Popular.',
                },
                {
                  q: '¿Cuánto cuestan los lentes de contacto en República Dominicana?',
                  a: 'Los precios varían por marca y tipo: esféricos desde RD$3,200, tóricos desde RD$4,000, multifocales desde RD$5,400, de color desde RD$2,500. Soluciones multipropósito desde RD$750 y gotas lubricantes desde RD$600.',
                },
                {
                  q: '¿Cuánto tarda la entrega en toda República Dominicana?',
                  a: 'El tiempo depende del tipo de lente, no de la ciudad: esféricos en 24-48 horas, multifocales en 2-6 días y tóricos en 25-40 días (se fabrican a medida), en toda la República Dominicana. Todos los pedidos incluyen tracking.',
                },
                {
                  q: '¿Necesito receta médica para comprar lentes de contacto en RD?',
                  a: 'Sí. Los lentes de contacto son dispositivos médicos que requieren prescripción óptica vigente (no mayor de 12 meses). Si no tienes receta actualizada, consulta primero con un óptico u oftalmólogo.',
                },
                {
                  q: '¿Qué diferencia hay entre lentes diarios, quincenales y mensuales?',
                  a: 'Los diarios se descartan cada día (ideal higiene y viajes). Quincenales duran 14 días con limpieza nocturna. Mensuales duran 30 días — la opción más económica por caja pero requieren rutina estricta con solución multipropósito.',
                },
                {
                  q: '¿Puedo pagar con tarjeta al comprar lentes de contacto?',
                  a: 'Sí. Aceptamos Visa y Mastercard con tecnología 3D Secure vía AZUL Banco Popular. Todas las transacciones están protegidas y no almacenamos datos de tarjetas.',
                },
                {
                  q: '¿ContactGo tiene tienda física en Santo Domingo?',
                  a: 'No. Operamos 100% online — ese es exactamente nuestro modelo: eliminar las visitas a óptica para clientes que ya tienen su receta. Nuestro equipo atiende consultas por WhatsApp al 809-694-2268.',
                },
                {
                  q: '¿Los lentes son originales del fabricante?',
                  a: 'Sí. Trabajamos exclusivamente con distribuidores autorizados en República Dominicana. Cada producto viene con su empaque original sellado y garantía del fabricante.',
                },
              ].map((f, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <summary className="cursor-pointer px-5 py-4 font-bold text-gray-900 text-sm flex items-center justify-between hover:bg-gray-50">
                    {f.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Encuentra tus lentes en menos de 2 minutos
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
              Convierte tu receta de gafas a lentes de contacto o busca directamente tu marca en el catálogo.
              Sin visitar ninguna óptica.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/receta" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                Calcular con mi receta →
              </Link>
              <Link href="/catalogo" className="bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                Ver todo el catálogo
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-6">
              ContactGo® · ONAPI Núm. 944205 · WhatsApp (809) 694-2268
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
