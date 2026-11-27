import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Envíos y Entregas | ContactGo República Dominicana',
  description: 'Esféricos: Santo Domingo 24-48 horas e interior 24-72 horas. Consulta los tiempos estimados de entrega según el tipo de lente.',
  alternates: { canonical: 'https://www.contactgo.net/ayuda/envios' },
  openGraph: {
    title: 'Envíos y Entregas | ContactGo República Dominicana',
    description: 'Envíos a toda República Dominicana. Consulta costos y tiempos estimados según destino y tipo de lente.',
    url: 'https://www.contactgo.net/ayuda/envios',
    locale: 'es_DO',
    siteName: 'ContactGo',
  },
}

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export default function EnviosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10">
          <h1 className="cg-page-title text-gray-900 mb-3">Envíos y Entregas</h1>
          <p className="text-gray-500">Todo lo que necesitas saber sobre cómo entregamos tu pedido.</p>
        </div>
        <div className="space-y-6">
          {[
            { title: '⏱️ Tiempo de entrega', body: 'Santo Domingo y Santiago: 24-48 horas para lentes esféricos. Interior del país: 24-72 horas. Lentes de color disponibles: al día siguiente; multifocales: de 1 a 5 días; tóricos: de 25 a 45 días; soluciones y gotas: 24 horas.' },
            { title: '💵 Costo de envío', body: 'Santo Domingo y Gran Santo Domingo: RD$250. Interior del país: RD$350. En compras desde RD$8,000, el envío es GRATIS.' },
            { title: '🗺️ Cobertura', body: 'Hacemos envíos a todas las provincias de República Dominicana, incluyendo zonas rurales y turísticas como Punta Cana, Samaná y Las Terrenas.' },
            { title: '📱 Seguimiento de pedido', body: 'Una vez confirmado tu pedido te notificamos por WhatsApp. Cuando esté en camino recibirás los datos del mensajero para coordinar la entrega.' },
            { title: '🏠 ¿Dónde entregan?', body: 'Entregamos directamente en tu domicilio, lugar de trabajo o cualquier dirección que indiques al momento de hacer el pedido.' },
            { title: '📦 ¿Cómo viene empacado?', body: 'Todos los pedidos vienen empacados de forma segura para proteger los productos durante el transporte.' },
            { title: '❓ Mi pedido no llegó', body: 'Si tu pedido no llegó en el tiempo estimado, contáctanos por WhatsApp al 809-694-2268 con tu número de pedido y lo verificamos de inmediato.' },
          ].map(({ title, body }) => (
            <div key={title} className="border border-gray-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">{title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">¿Tienes preguntas sobre tu envío?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos y te respondemos en minutos.</p>
          <a href="https://wa.me/18096942268" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Contactar por WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
