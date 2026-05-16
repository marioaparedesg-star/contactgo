import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lentes de Contacto en Punta Cana RD | Envío a Domicilio — ContactGo',
  description: 'Compra lentes de contacto con entrega en Punta Cana. ACUVUE, Biofinity, Air Optix 100% originales. Envío rápido en República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/lentes-de-contacto/punta-cana' },
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">
        <section className="bg-gradient-to-br from-primary-700 to-teal-600 text-white py-16 px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Lentes de Contacto en Punta Cana</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">Envío a Bávaro, Cap Cana y toda La Altagracia. ACUVUE, Biofinity, Air Optix y más marcas originales.</p>
          <Link href="/catalogo" className="inline-block mt-6 bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">Ver catálogo completo</Link>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-12 space-y-4 text-gray-600 leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-gray-900">La forma más fácil de conseguir lentes en Punta Cana</h2>
          <p>ContactGo te entrega lentes de contacto originales directamente en Punta Cana. Somos distribuidores autorizados de ACUVUE®, Air Optix®, Biofinity® y Bausch+Lomb — todos con garantía de autenticidad.</p>
          <p>Usa nuestra <Link href="/receta" className="text-primary-600 font-semibold">calculadora de receta inteligente</Link> para encontrar el lente exacto según tu graduación SPH, CYL y AXIS en minutos, sin salir de casa.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 text-center">
            {[['🚚','Envío rápido'],['✅','100% Original'],['💳','Pago seguro'],['↩️','30 días devolución']].map(([i,t])=>(
              <div key={String(t)} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="text-2xl block mb-1">{i}</span>
                <span className="text-xs font-semibold text-gray-600">{t}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="max-w-3xl mx-auto px-4 pb-12 text-center">
          <Link href="/catalogo" className="btn-primary px-8 py-3 text-base">Ver todos los productos</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
