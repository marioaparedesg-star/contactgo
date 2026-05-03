import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function EnviosPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Envíos y Entregas</h1>
          <p className="text-gray-500">Todo lo que necesitas saber sobre cómo entregamos tu pedido.</p>
        </div>
        <div className="space-y-6">
          {[
            { title: '⏱️ Tiempo de entrega', body: 'Santo Domingo y Santiago: 24 a 48 horas hábiles. Otras provincias: 2 a 4 días hábiles. Los pedidos realizados antes de las 2pm se procesan el mismo día.' },
            { title: '💵 Costo de envío', body: 'Envío fijo de RD$200 a cualquier parte de República Dominicana, sin importar la cantidad de productos.' },
            { title: '🗺️ Cobertura', body: 'Hacemos envíos a todas las provincias de República Dominicana, incluyendo zonas rurales y turísticas como Punta Cana, Samaná y Las Terrenas.' },
            { title: '📱 Seguimiento de pedido', body: 'Una vez confirmado tu pedido te notificamos por WhatsApp. Cuando esté en camino recibirás los datos del mensajero para coordinar la entrega.' },
            { title: '🏠 ¿Dónde entregan?', body: 'Entregamos directamente en tu domicilio, lugar de trabajo o cualquier dirección que indiques al momento de hacer el pedido.' },
            { title: '📦 ¿Cómo viene empacado?', body: 'Todos los pedidos vienen empacados de forma segura para proteger los productos durante el transporte.' },
            { title: '❓ Mi pedido no llegó', body: 'Si tu pedido no llegó en el tiempo estimado, contáctanos por WhatsApp al 829-408-9097 con tu número de pedido y lo verificamos de inmediato.' },
          ].map(({ title, body }) => (
            <div key={title} className="border border-gray-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">{title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">¿Tienes preguntas sobre tu envío?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos y te respondemos en minutos.</p>
          <a href="https://wa.me/18294089097" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Contactar por WhatsApp
          </a>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
