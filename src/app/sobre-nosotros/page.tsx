import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | ContactGo — Lentes de Contacto RD',
  description: 'Conoce a ContactGo, la única tienda dominicana especializada 100% en lentes de contacto originales. Distribuidores autorizados de ACUVUE, Alcon, CooperVision y Bausch+Lomb.',
}

const VALORES = [
  { icon: '🏥', title: 'Especialización total', desc: 'Solo lentes de contacto. No somos una óptica genérica — somos expertos en una sola cosa y la hacemos muy bien.' },
  { icon: '✅', title: '100% originales', desc: 'Cada producto viene directamente de distribuidores autorizados. Nunca imitaciones, nunca productos vencidos.' },
  { icon: '🚚', title: 'Entrega en 24-48h', desc: 'Cubrimos Santo Domingo, Santiago y todo el país. Tu pedido sale el mismo día si ordenas antes de las 3pm.' },
  { icon: '👁️', title: 'Soporte especializado', desc: 'Nuestro equipo conoce cada producto a fondo. Si tienes dudas sobre tu receta, te ayudamos antes de comprar.' },
]

const MARCAS = [
  { nombre: 'ACUVUE®', fabricante: 'Johnson & Johnson Vision', pais: '🇺🇸', descripcion: 'La marca #1 de lentes de contacto en el mundo.' },
  { nombre: 'AIR OPTIX®', fabricante: 'Alcon', pais: '🇨🇭', descripcion: 'Tecnología de silicona hidrogel con máxima transpirabilidad.' },
  { nombre: 'Biofinity® / Proclear®', fabricante: 'CooperVision', pais: '🇬🇧', descripcion: 'Líderes en comodidad para usuarios exigentes.' },
  { nombre: 'ULTRA® / ReNu®', fabricante: 'Bausch+Lomb', pais: '🇺🇸', descripcion: 'Innovación constante en salud ocular desde 1853.' },
]

const STATS = [
  { valor: '60+', label: 'Pedidos entregados' },
  { valor: '41', label: 'Productos disponibles' },
  { valor: '4', label: 'Marcas autorizadas' },
  { valor: '24h', label: 'Tiempo de entrega' },
]

export default function SobreNosotrosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-20">

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">La única tienda especializada en RD</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Somos ContactGo
            </h1>
            <p className="text-primary-100 text-lg max-w-xl mx-auto leading-relaxed">
              Nacimos para resolver un problema real: conseguir lentes de contacto originales en República Dominicana era difícil, caro y lleno de incertidumbre. Lo cambiamos.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-primary-600">{s.valor}</p>
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
              ContactGo nació de una necesidad real: encontrar lentes de contacto de calidad en la República Dominicana era un proceso frustrante. Precios elevados, productos escasos, poca información y ninguna garantía de autenticidad.
            </p>
            <p>
              Decidimos crear la única tienda dominicana especializada <strong>100% en lentes de contacto</strong>. Sin distracciones, sin productos genéricos. Solo lentes, soluciones y gotas de las mejores marcas del mundo — directamente de distribuidores autorizados.
            </p>
            <p>
              Hoy operamos con tecnología de primer nivel: receta inteligente que recomienda el lente exacto según tu graduación, recompra automática para que nunca te quedes sin lentes, y entrega en 24-48 horas a todo el país.
            </p>
          </div>
        </section>

        {/* Misión */}
        <section className="bg-primary-50 border-y border-primary-100 py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-4xl mb-4 block">🎯</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Nuestra misión</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Ser la plataforma líder de salud visual recurrente en República Dominicana — haciendo que conseguir lentes de contacto sea tan fácil, seguro y confiable como cualquier compra en línea en el mundo.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-10 text-center">Por qué elegirnos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALORES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="text-3xl mb-3 block">{v.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marcas autorizadas */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3 text-center">Distribuidores autorizados</h2>
            <p className="text-gray-500 text-sm text-center mb-10">Trabajamos directamente con las mejores marcas del mundo</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MARCAS.map(m => (
                <div key={m.nombre} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
                  <span className="text-2xl">{m.pais}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{m.nombre}</p>
                    <p className="text-xs text-primary-600 font-semibold mb-1">{m.fabricante} · Distribuidor Autorizado</p>
                    <p className="text-xs text-gray-500">{m.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">¿Listo para empezar?</h2>
          <p className="text-gray-600 mb-8">Encuentra tus lentes exactos en segundos con nuestra calculadora de receta inteligente.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/receta" className="btn-primary px-8 py-3 text-base">
              Usar mi receta
            </Link>
            <Link href="/catalogo" className="btn-secondary px-8 py-3 text-base">
              Ver catálogo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-8">
            ¿Preguntas? Escríbenos a{' '}
            <a href="mailto:info@contactgo.net" className="text-primary-600 font-semibold hover:underline">
              info@contactgo.net
            </a>
          </p>
        </section>

      </main>
      <Footer />
    </>
  )
}
