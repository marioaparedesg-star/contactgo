export const revalidate = 3600

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import MailLink from '@/components/ui/MailLink'
import { Eye, PackageCheck, Truck, Headset } from 'lucide-react'
import type { Metadata } from 'next'

// canonical agregado
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.contactgo.net/sobre-nosotros' },
  title: 'Sobre ContactGo — La tienda de lentes de contacto en RD',
  description: 'Conoce ContactGo, una tienda dominicana especializada en lentes de contacto, con catálogo en línea, orientación sobre recetas y envíos a todo el país.',
}

const VALORES = [
  { icon: Eye, title: 'Especialización', desc: 'Nuestro catálogo se concentra en lentes de contacto, soluciones y gotas. Esto nos permite organizar la información por marca, diseño y tipo de receta.' },
  { icon: PackageCheck, title: 'Productos sellados', desc: 'Los productos se entregan en su empaque original y sellado. Trabajamos a través de canales de distribución autorizados.' },
  { icon: Truck, title: 'Entrega según el producto', desc: 'Los esféricos tienen una Entrega de 24 a 72 horas en todo el país; los multifocales, de 1 a 5 días; y los tóricos, de 25 a 45 días. Los pedidos de fin de semana o feriados comienzan a procesarse el 24 a 72 horas.' },
  { icon: Headset, title: 'Atención directa', desc: 'Puedes comunicarte con nuestro equipo para consultar disponibilidad, compartir tu receta y aclarar dudas antes de realizar tu pedido.' },
]

const MARCAS = [
  { nombre: 'ACUVUE®', fabricante: 'Johnson & Johnson Vision', pais: 'AC', descripcion: 'Lentes de reemplazo diario, quincenal y multifocal.' },
  { nombre: 'AIR OPTIX®', fabricante: 'Alcon', pais: 'AL', descripcion: 'Lentes esféricos, tóricos, multifocales y de color.' },
  { nombre: 'Biofinity® / Proclear®', fabricante: 'CooperVision', pais: 'CV', descripcion: 'Opciones de reemplazo mensual y diseños especiales.' },
  { nombre: 'ULTRA® / ReNu®', fabricante: 'Bausch+Lomb', pais: 'BL', descripcion: 'Lentes de contacto y productos para su cuidado.' },
]

const STATS = [
  { valor: '100%',   label: 'Especializados en lentes de contacto' },
  { valor: '6',      label: 'Categorías de productos' },
  { valor: '4',      label: 'Marcas de nivel mundial' },
  { valor: 'Según producto', label: 'Plazo de entrega' },
]

export default function SobreNosotrosPage() {
  return (
    <>


      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ContactGo",
        "url": "https://www.contactgo.net",
        "logo": "https://www.contactgo.net/logo.png",
        "description": "Tienda en línea especializada en lentes de contacto en República Dominicana. ACUVUE, Air Optix, Biofinity y más. Entrega según el tipo de lente y el destino.",
        "foundingDate": "2026",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Winston Churchill No. 95, Torre Empresarial Blue Mall, Piso 23",
          "addressLocality": "Santo Domingo",
          "addressRegion": "Distrito Nacional",
          "addressCountry": "DO"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-809-694-2268",
          "contactType": "customer service",
          "areaServed": "DO",
          "availableLanguage": "Spanish"
        },
        "sameAs": [
          "https://www.instagram.com/contactgord",
          "https://www.facebook.com/contactgord"
        ]
      })}} />
      <Navbar />
      <main id="main-content" className="pb-20">

        {/* Hero */}
        <section className="bg-[#F3F6F8] border-b border-slate-200 text-[#002455] py-16 md:py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-white text-[#002455] text-xs font-semibold border border-slate-200 px-3 py-1 rounded-full mb-4 tracking-widest uppercase">Especialistas en lentes de contacto</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Quiénes somos
            </h1>
            <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
              En República Dominicana, encontrar el lente indicado no siempre es sencillo: hay que revisar la receta, confirmar el diseño y saber dónde está disponible. ContactGo reúne esa información y permite consultar y comprar desde una sola tienda en línea.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#002455]">{s.valor}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historia */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Nuestra historia</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              ContactGo es una tienda en línea dominicana enfocada en lentes de contacto. La idea es facilitar una parte concreta de la compra: consultar marcas y diseños, revisar la información de cada producto y gestionar el pedido sin tener que desplazarse para cada consulta.
            </p>
            <p>
              Por eso organizamos el catálogo por tipo de lente y fabricante. Encontrarás opciones de ACUVUE, Alcon, CooperVision y Bausch+Lomb, además de soluciones y gotas para el cuidado de los lentes.
            </p>
            <p>
              La plataforma permite consultar productos según los parámetros de una receta, guardar los datos de tu cuenta y dar seguimiento a tus pedidos. Si una receta requiere una revisión adicional, puedes contactar al equipo antes de comprar.
            </p>
          </div>
        </section>

        {/* Misión */}
        <section className="bg-white border-y border-slate-200 py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Eye className="h-7 w-7 text-[#008F95] mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Nuestra misión</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Facilitar el acceso a lentes de contacto de marcas reconocidas mediante información clara, atención al cliente y entrega coordinada según el producto y la ubicación.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-10 text-center">Por qué elegirnos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALORES.map(v => (
              <div key={v.title} className="bg-white rounded-xl border border-slate-200 p-6">
                <v.icon className="h-6 w-6 text-[#002455] mb-4" aria-hidden="true" />
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marcas autorizadas */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3 text-center">Marcas disponibles</h2>
            <p className="text-gray-500 text-sm text-center mb-10">En el catálogo encontrarás productos de los siguientes fabricantes, a través de canales de distribución autorizados.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MARCAS.map(m => (
                <div key={m.nombre} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold tracking-wide text-[#002455]">{m.pais}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{m.nombre}</p>
                    <p className="text-xs text-[#008F95] font-semibold mb-1">{m.fabricante} · Productos Originales</p>
                    <p className="text-xs text-gray-500">{m.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Consulta el catálogo</h2>
          <p className="text-gray-600 mb-8">Revisa las marcas y los diseños disponibles. Si necesitas ayuda para interpretar tu receta, nuestro equipo puede orientarte.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/receta" className="btn-primary px-8 py-3 text-base">
              Revisar mi receta
            </Link>
            <Link href="/catalogo" className="btn-secondary px-8 py-3 text-base">
              Ver catálogo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-8">
            ¿Preguntas? Escríbenos a{' '}
            <MailLink className="text-primary-600 font-semibold hover:underline">
              info@contactgo.net
            </MailLink>
          </p>
        </section>

      </main>
      <Footer />
    </>
  )
}
