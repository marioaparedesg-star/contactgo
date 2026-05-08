import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const FAQS = [
  {
    categoria: '🚚 Envíos',
    preguntas: [
      { q: '¿Cuánto tarda el envío?', a: 'Entregamos en 24 a 48 horas hábiles en Santo Domingo y Santiago. Para otras provincias puede tomar de 2 a 4 días hábiles.' },
      { q: '¿Cuánto cuesta el envío?', a: 'El envío tiene un costo fijo de RD$200 a cualquier parte de República Dominicana.' },
      { q: '¿Envían a todo el país?', a: 'Sí, hacemos envíos a todas las provincias de República Dominicana.' },
      { q: '¿Puedo rastrear mi pedido?', a: 'Sí. Una vez confirmado tu pedido, te notificamos por WhatsApp cuando esté en camino con los datos del mensajero.' },
    ]
  },
  {
    categoria: '💳 Pagos',
    preguntas: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos PayPal y pago contra entrega. Próximamente tarjeta de crédito/débito vía Azul.' },
      { q: '¿El pago contra entrega tiene costo extra?', a: 'No, el costo de envío es el mismo RD$200 independientemente del método de pago.' },
    ]
  },
  {
    categoria: '👁️ Productos',
    preguntas: [
      { q: '¿Los productos son originales?', a: 'Sí, todos nuestros productos son 100% originales y certificados. Trabajamos directamente con distribuidores autorizados de Acuvue, Alcon, Bausch+Lomb y CooperVision.' },
      { q: '¿Necesito receta para comprar lentes de contacto?', a: 'Recomendamos tener una receta actualizada de tu oftalmólogo antes de comprar. Contamos con un buscador por receta para ayudarte a elegir el tipo correcto.' },
      { q: '¿Qué pasa si mi graduación no está disponible?', a: 'Escríbenos por WhatsApp y buscamos la graduación específica para ti. Podemos hacer pedidos especiales.' },
      { q: '¿Los lentes de color necesitan graduación?', a: 'No. Tenemos lentes de color sin graduación (plano) y con graduación para miopía e hipermetropía.' },
    ]
  },
  {
    categoria: '🔄 Devoluciones y Garantía',
    preguntas: [
      { q: '¿Puedo devolver un producto?', a: 'Aceptamos devoluciones dentro de los 7 días posteriores a la entrega, siempre que el producto esté sellado y sin abrir.' },
      { q: '¿Qué hago si recibí un producto dañado o incorrecto?', a: 'Contáctanos inmediatamente por WhatsApp con una foto del producto. Lo reemplazamos sin costo adicional.' },
      { q: '¿Los productos tienen garantía?', a: 'Garantizamos la autenticidad de todos nuestros productos. Si detectas algún problema con la calidad, nos hacemos responsables.' },
    ]
  },
  {
    categoria: '📦 Cómo pedir',
    preguntas: [
      { q: '¿Cómo hago un pedido?', a: 'Selecciona tus productos, elige tu graduación, agrégalos al carrito y completa el checkout con tu dirección y método de pago. Es rápido y seguro.' },
      { q: '¿Necesito crear una cuenta?', a: 'No es necesario. Puedes comprar como invitado. Sin embargo, crear una cuenta te permite ver el historial de pedidos y guardar tu dirección.' },
      { q: '¿Puedo modificar o cancelar mi pedido?', a: 'Sí, mientras el pedido esté en estado "pendiente". Escríbenos por WhatsApp lo antes posible.' },
      { q: '¿Tienen atención al cliente?', a: 'Sí, respondemos por WhatsApp de lunes a sábado de 9am a 7pm. También puedes escribirnos a info@contactgo.net.' },
    ]
  },
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Preguntas Frecuentes</h1>
          <p className="text-gray-500">Todo lo que necesitas saber sobre ContactGo</p>
        </div>

        <div className="space-y-8">
          {FAQS.map(({ categoria, preguntas }) => (
            <div key={categoria}>
              <h2 className="font-semibold text-lg text-gray-900 mb-4">{categoria}</h2>
              <div className="space-y-3">
                {preguntas.map(({ q, a }) => (
                  <div key={q} className="border border-gray-100 rounded-2xl p-5">
                    <p className="font-semibold text-gray-900 text-sm mb-2">{q}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">¿No encontraste tu respuesta?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos por WhatsApp y te respondemos en minutos.</p>
          <a href="https://wa.me/18294089097" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Abrir WhatsApp
          </a>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
