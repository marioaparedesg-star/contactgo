import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | ContactGo — Lentes de Contacto RD',
  description: 'Conoce a ContactGo, la tienda dominicana especializada en lentes de contacto originales con entrega a domicilio en toda la República Dominicana.',
}

export default function SobreNosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="pb-20">

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white py-16 px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Somos ContactGo</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            La tienda dominicana especializada en lentes de contacto originales, con entrega rápida en toda la República Dominicana.
          </p>
        </section>

        {/* Nuestra historia */}
        <section className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Nuestra historia</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            ContactGo nació de una necesidad real: encontrar lentes de contacto de calidad, a buen precio y sin tener que recorrer múltiples ópticas en Santo Domingo. Sabíamos que miles de dominicanos enfrentaban el mismo problema — productos escasos, precios elevados y poca transparencia.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Decidimos construir una solución 100% dominicana: una plataforma donde puedas encontrar las marcas que confías — Acuvue, Air Optix, Biofinity y más — con precios justos, entrega a domicilio en 24 horas y la seguridad de que cada producto es original y certificado.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Hoy servimos a clientes en Santo Domingo, Santiago, La Romana, Punta Cana y todo el país. Cada pedido es una responsabilidad que tomamos en serio, porque entendemos que tus ojos merecen solo lo mejor.
          </p>
        </section>

        {/* Valores */}
        <section className="bg-gray-50 border-y border-gray-100 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8 text-center">Por qué elegirnos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🔬', title: '100% Originales', desc: 'Solo trabajamos con marcas certificadas. Acuvue, Alcon, Bausch+Lomb — todos con garantía de autenticidad.' },
                { icon: '🚀', title: 'Entrega en 24-72h', desc: 'Despacho rápido a todo el país. Lentes negativos en 24h, positivos en 24-72h.' },
                { icon: '💬', title: 'Soporte real', desc: 'Un equipo humano te atiende por WhatsApp. Sin bots, sin esperas largas.' },
                { icon: '🩺', title: 'Guía especializada', desc: 'Nuestro buscador inteligente detecta tu tipo de lente según tu receta médica.' },
                { icon: '💰', title: 'Precios justos', desc: 'Sin intermediarios innecesarios. El precio que ves es el precio que pagas.' },
                { icon: '🔒', title: 'Compra segura', desc: 'Múltiples métodos de pago. Contra entrega y próximamente Azul (tarjeta).' },
              ].map((v, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <span className="text-3xl mb-3 block">{v.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Números */}
        <section className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8 text-center">ContactGo en números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { numero: '+1,000', label: 'Clientes satisfechos' },
              { numero: '24h', label: 'Tiempo de entrega' },
              { numero: '10+', label: 'Marcas disponibles' },
              { numero: '100%', label: 'Productos originales' },
            ].map((n, i) => (
              <div key={i} className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-center">
                <p className="font-display text-3xl font-bold text-primary-700 mb-1">{n.numero}</p>
                <p className="text-sm text-gray-600">{n.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compromiso */}
        <section className="bg-gradient-to-r from-primary-50 to-teal-50 border-y border-primary-100 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Nuestro compromiso</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              En ContactGo entendemos que los lentes de contacto no son un accesorio — son un producto de salud visual. Por eso siempre recomendamos consultar con un oftalmólogo antes de comprar, y nos aseguramos de que cada producto que vendemos cumpla con los estándares de calidad más altos.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Tu confianza es nuestra prioridad. Si tienes alguna duda, nuestro equipo está disponible para ayudarte a tomar la mejor decisión para tu salud visual.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">¿Listo para ver mejor?</h2>
          <p className="text-gray-500 mb-6">Explora nuestro catálogo y encuentra los lentes que necesitas.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogo" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Ver catálogo
            </Link>
            <Link href="/receta" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Buscar por receta
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
