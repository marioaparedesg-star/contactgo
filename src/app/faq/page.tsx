export const revalidate = 3600

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | ContactGo — Lentes de Contacto RD',
  description: '¿Cómo usar lentes de contacto? ¿Cómo pedir? ¿Cuánto tarda el envío? Todas las respuestas sobre comprar lentes en República Dominicana.',
  alternates: { canonical: 'https://www.contactgo.net/faq' },
  openGraph: {
    title: 'Preguntas Frecuentes | ContactGo — Lentes de Contacto RD',
    description: '¿Cómo usar lentes de contacto? ¿Cómo pedir? ¿Cuánto tarda el envío? Todas las respuestas sobre comprar lentes en República Dominicana.',
    url: 'https://www.contactgo.net/faq',
    locale: 'es_DO',
    siteName: 'ContactGo',
  },
}

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const FAQS = [
  {
    categoria: '🚚 Envíos',
    preguntas: [
      { q: '¿Cuánto tarda el envío?', a: 'Los plazos se aplican de forma uniforme en todo el país: lentes esféricos, 24 a 72 horas; lentes de color planos disponibles, siguiente día laborable; multifocales, 1 a 5 días laborables; tóricos, 25 a 45 días laborables; soluciones y gotas disponibles, 24 horas. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.' },
      { q: '¿Cuánto cuesta el envío?', a: 'Santo Domingo y Gran Santo Domingo: RD$250. Interior del país: RD$350. Envío gratis en compras desde RD$8,000.' },
      { q: '¿Envían a todo el país?', a: 'Sí, hacemos envíos a todas las provincias de República Dominicana.' },
      { q: '¿Puedo rastrear mi pedido?', a: 'Sí. Una vez confirmado tu pedido, te notificamos por WhatsApp cuando esté en camino con los datos del mensajero.' },
    ]
  },
  {
    categoria: '💳 Pagos',
    preguntas: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard procesado por AZUL — Banco Popular, con tecnología 3D Secure. El pago es 100% seguro y ContactGo no almacena datos de tarjetas.' },
      { q: '¿Es seguro pagar con tarjeta?', a: 'Sí, totalmente. Eres redirigido al portal oficial de AZUL (Banco Popular). ContactGo nunca ve ni almacena los datos de tu tarjeta.' },
    ]
  },
  {
    categoria: '👁️ Productos',
    preguntas: [
      { q: '¿Los productos son certificados?', a: 'Trabajamos con marcas reconocidas y canales de distribución autorizados. Los productos se entregan sellados y en su empaque original; no abrimos ni reempacamos las cajas.' },
      { q: '¿Necesito receta para comprar lentes de contacto?', a: 'Recomendamos tener una receta actualizada de tu oftalmólogo antes de comprar. Contamos con un buscador por receta para ayudarte a elegir el tipo correcto.' },
      { q: '¿Qué pasa si mi graduación no está disponible?', a: 'Escríbenos por WhatsApp y buscamos la graduación específica para ti. Podemos hacer pedidos especiales.' },
      { q: '¿Los lentes de color necesitan graduación?', a: 'No. Tenemos lentes de color sin graduación (plano) y con graduación para miopía e hipermetropía.' },
    ]
  },
  {
    categoria: '🔄 Devoluciones y Garantía',
    preguntas: [
      { q: '¿Puedo devolver un producto?', a: 'Aceptamos devoluciones dentro de los 7 días calendario posteriores a la entrega para productos sellados, sin abrir y en su empaque original. Los lentes tóricos solo pueden cancelarse durante las primeras 48 horas desde la confirmación; después no admiten cancelación ni devolución.' },
      { q: '¿Qué hago si recibí un producto dañado o incorrecto?', a: 'Contáctanos inmediatamente por WhatsApp con una foto del producto. Lo reemplazamos sin costo adicional.' },
      { q: '¿Los productos tienen garantía?', a: 'Garantizamos la autenticidad de todos nuestros productos. Si detectas algún problema con la calidad, nos hacemos responsables.' },
    ]
  },
  {
    categoria: '📦 Cómo pedir',
    preguntas: [
      { q: '¿Cómo hago un pedido?', a: 'Selecciona tus productos, elige tu graduación, agrégalos al carrito y completa el checkout con tu dirección y método de pago. Es rápido y seguro.' },
      { q: '¿Necesito crear una cuenta?', a: 'Sí. Para comprar debes iniciar sesión o crear una cuenta antes de agregar productos al carrito. Desde tu cuenta puedes consultar el estado y el historial de tus pedidos.' },
      { q: '¿Puedo modificar o cancelar mi pedido?', a: 'Sí, mientras el pedido esté en estado "pendiente". Escríbenos por WhatsApp lo antes posible.' },
      { q: '¿Tienen atención al cliente?', a: 'Atendemos por WhatsApp de lunes a viernes de 9:00 a. m. a 9:00 p. m. y los sábados de 9:00 a. m. a 6:00 p. m. Los domingos no laboramos. También puedes escribirnos a info@contactgo.net.' },
    ]
  },
]

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.flatMap(group => group.preguntas).map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  }
  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-12 pb-24">
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

        <div className="mt-12 bg-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">¿No encontraste tu respuesta?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos por WhatsApp y te respondemos en minutos.</p>
          <a href="https://wa.me/18096942268" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            💬 Abrir WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
