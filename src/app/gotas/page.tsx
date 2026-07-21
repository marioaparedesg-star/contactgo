import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'

export const metadata: Metadata = {
  title: 'Gotas para Ojos en República Dominicana — ContactGo',
  description: 'Gotas lubricantes y artificiales para ojos en RD. Refresh, Systane, Manzanilla Sophia. Para ojos secos, lentes de contacto y alergia. Envío 24h.',
  alternates: { canonical: 'https://www.contactgo.net/gotas' },
  openGraph: {
    title: 'Gotas para Ojos en RD | Refresh, Systane — ContactGo',
    description: 'Gotas lubricantes y artificiales para ojos en República Dominicana. Refresh Tears, Manzanilla Sophia, Systane Ultra. Alivio inmediato para ojos secos.',
    url: 'https://www.contactgo.net/gotas',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export const revalidate = 60

const faqs = [
  {
    q: '¿Para qué sirven las gotas para ojos?',
    a: 'Las gotas lubricantes alivian la sequedad, el picor y la irritación ocular. Son especialmente útiles para usuarios de lentes de contacto, personas que pasan muchas horas frente a pantallas, o quienes viven en climas con aire acondicionado constante.',
  },
  {
    q: '¿Puedo usar gotas con mis lentes de contacto puestos?',
    a: 'Depende del tipo de gota. Las gotas sin conservantes como Refresh Tears son compatibles con lentes de contacto. Las que contienen conservantes deben usarse sin lentes o esperar 15 minutos antes de ponérselos.',
  },
  {
    q: '¿Cuántas veces al día puedo usar las gotas?',
    a: 'Las gotas lubricantes sin conservantes se pueden usar tan frecuentemente como sea necesario, incluso varias veces por hora si hay mucha sequedad. Las que contienen conservantes se recomiendan máximo 4-6 veces al día.',
  },
  {
    q: '¿Cuál es la diferencia entre Refresh Optive y Refresh Tears?',
    a: 'Refresh Tears contiene 0.5% de carboximetilcelulosa, ideal para sequedad leve. Refresh Optive Advanced tiene una fórmula triple acción con lípidos, CMC y glicerina, para sequedad moderada a severa. Si tus ojos están muy secos, Optive Advanced es la mejor opción.',
  },
]

export default async function Page() {
  const sb = createServerSupabaseClient()
  const { data: gotas } = await sb
    .from('products')
    .select('*')
    .eq('activo', true)
    .eq('tipo', 'gota')
    .order('nombre')

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link href="/soluciones" className="hover:text-primary-600">Soluciones</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Gotas para Ojos</span>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-600 via-blue-600 to-teal-600 text-white py-14 px-4 text-center mt-2">
          <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            💧 Lubricación ocular
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Gotas para Ojos en República Dominicana
          </h1>
          <p className="text-sky-100 text-lg max-w-xl mx-auto">
            Alivio inmediato para ojos secos e irritados. Refresh, Systane y más marcas certificadas con envío a domicilio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {['✅ Certificados', '🚚 Envío 24h', '💊 Sin receta', '💧 Para lentes'].map(b => (
              <span key={b} className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{b}</span>
            ))}
          </div>
        </section>

        {/* Info banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <p className="text-center text-sm text-blue-800 font-medium max-w-2xl mx-auto">
            💡 <strong>¿Usas lentes de contacto?</strong> Elige gotas sin conservantes para mayor comodidad durante el día.
          </p>
        </div>

        {/* Productos */}
        <section className="max-w-7xl mx-auto px-4 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-lg">💧</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-900 text-lg">Gotas Lubricantes</h2>
              <p className="text-xs text-gray-500">Para ojos secos, irritados o con alergias</p>
            </div>
            <span className="ml-auto text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
              {(gotas ?? []).length} productos
            </span>
          </div>

          {(gotas ?? []).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {(gotas ?? []).map(p => <ProductCard key={p.id} product={p as any} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <span className="text-4xl block mb-3">💧</span>
              <p className="font-semibold">Próximamente disponibles</p>
            </div>
          )}
        </section>

        {/* Cross-sell a soluciones */}
        <section className="max-w-7xl mx-auto px-4 pb-6">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-black text-gray-900 text-sm">¿También necesitas solución multipropósito?</p>
              <p className="text-xs text-gray-500 mt-0.5">Para limpiar y guardar tus lentes de contacto</p>
            </div>
            <Link href="/soluciones"
              className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors">
              Ver soluciones →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-800 list-none">
                  {faq.q}
                  <span className="ml-3 text-gray-400 group-open:rotate-180 transition-transform shrink-0">▾</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Links a otras categorías */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <h2 className="text-base font-bold text-gray-700 mb-4">Explorar más productos</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/esfericos',   label: '👁️ Lentes esféricos'   },
              { href: '/toricos',     label: '🎯 Lentes tóricos'     },
              { href: '/multifocales',label: '🔭 Lentes multifocales'},
              { href: '/color',       label: '🎨 Lentes de color'    },
              { href: '/soluciones',  label: '🧴 Soluciones'         },
            ].map(c => (
              <Link key={c.href} href={c.href}
                className="text-xs font-semibold bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-200 text-gray-600 hover:text-primary-700 px-3 py-2 rounded-xl transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
