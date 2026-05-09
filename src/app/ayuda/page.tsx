import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ayuda — Envíos, Devoluciones y Garantías | ContactGo RD',
  description: 'Todo sobre envíos, tiempos de entrega, devoluciones y garantías de ContactGo. Envíos en 24-48h a toda la República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/ayuda' },
}

const SECCIONES = [
  {
    id: 'envios',
    emoji: '🚚',
    titulo: 'Envíos y Entregas',
    color: 'bg-blue-50 border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    items: [
      { q: '¿Cuánto tarda en llegar mi pedido?', a: 'Santo Domingo: 24-48 horas. Santiago: 48-72 horas. Resto del país: 3-5 días hábiles. Todos los pedidos se procesan de lunes a sábado.' },
      { q: '¿Cuánto cuesta el envío?', a: 'Santo Domingo y Santiago: RD$200. Interior del país: RD$350. Pedidos mayores a RD$8,000: envío GRATIS.' },
      { q: '¿Cómo sé dónde está mi pedido?', a: 'Recibirás un mensaje de WhatsApp con tu número de seguimiento. También puedes ver el estado en Mi cuenta → Pedidos.' },
      { q: '¿Entregan en toda la República Dominicana?', a: 'Sí, hacemos envíos a todo el país a través de nuestra red de mensajería. Zonas remotas pueden tomar 1-2 días adicionales.' },
      { q: '¿Puedo cambiar la dirección después de hacer el pedido?', a: 'Sí, siempre que el pedido no haya sido enviado. Escríbenos por WhatsApp lo antes posible.' },
    ],
  },
  {
    id: 'devoluciones',
    emoji: '🔄',
    titulo: 'Devoluciones y Cambios',
    color: 'bg-amber-50 border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    items: [
      { q: '¿Puedo devolver un producto?', a: 'Sí. Aceptamos devoluciones dentro de los 7 días calendario desde la entrega, siempre que el producto esté en su empaque original, sin abrir y sin usar.' },
      { q: '¿Qué productos NO son devolvibles?', a: 'Por razones de higiene y salud: lentes de contacto abiertos, soluciones y gotas ya usadas. Las devoluciones aplican solo a productos sin abrir.' },
      { q: '¿Cómo inicio una devolución?', a: 'Escríbenos por WhatsApp con tu número de pedido y la razón. Te damos instrucciones para devolver el producto. El reembolso se procesa en 3-5 días hábiles.' },
      { q: '¿Me devuelven el dinero completo?', a: 'Sí, reembolsamos el valor del producto. El costo de envío de la devolución corre por cuenta del cliente, excepto si el error fue nuestro (producto incorrecto o defectuoso).' },
      { q: '¿Qué pasa si recibo un producto incorrecto?', a: 'Si recibiste el producto equivocado, hacemos el cambio sin costo y con envío prioritario. Contáctanos dentro de las 48 horas de recibido.' },
    ],
  },
  {
    id: 'garantias',
    emoji: '✅',
    titulo: 'Garantías y Autenticidad',
    color: 'bg-green-50 border-green-100',
    badge: 'bg-green-100 text-green-700',
    items: [
      { q: '¿Son originales los productos?', a: 'Todos nuestros productos son 100% originales, importados directamente de distribuidores oficiales de ACUVUE (J&J), Alcon, Bausch+Lomb y CooperVision.' },
      { q: '¿Qué garantía tienen los lentes de contacto?', a: 'Los lentes tienen la garantía del fabricante. Si detectas algún defecto de fabricación (rotura, deformación), lo reemplazamos sin costo.' },
      { q: '¿Los lentes están dentro de su fecha de vencimiento?', a: 'Sí, todos los productos tienen al menos 18 meses de vida útil desde la fecha de compra. Nunca vendemos productos próximos a vencer.' },
    ],
  },
  {
    id: 'pagos',
    emoji: '💳',
    titulo: 'Pagos y Seguridad',
    color: 'bg-purple-50 border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    items: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta de crédito/débito (Visa, Mastercard vía AZUL), PayPal, y pago en efectivo contra entrega.' },
      { q: '¿Es seguro pagar con tarjeta?', a: 'Sí. Usamos AZUL (Banco Popular), el procesador de pagos más confiable de RD, con encriptación SSL y verificación 3D Secure.' },
      { q: '¿Puedo pagar contra entrega?', a: 'Sí, disponible para Santo Domingo y Santiago. Solo efectivo, monto exacto por favor.' },
    ],
  },
]

export default function AyudaPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Centro de Ayuda</h1>
          <p className="text-gray-500">Encuentra respuestas sobre envíos, devoluciones, garantías y pagos.</p>
        </div>

        {/* Índice rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {SECCIONES.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{s.titulo}</p>
            </a>
          ))}
        </div>

        {/* Secciones */}
        <div className="space-y-10">
          {SECCIONES.map(s => (
            <section key={s.id} id={s.id}>
              <div className={`border rounded-2xl overflow-hidden ${s.color}`}>
                <div className="px-5 py-4 flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <h2 className="font-black text-gray-900 text-xl">{s.titulo}</h2>
                  <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
                    {s.items.length} preguntas
                  </span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {s.items.map((item, i) => (
                    <details key={i} className="group px-5 py-4">
                      <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                        <p className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</p>
                        <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 group-open:bg-primary-100 flex items-center justify-center text-xs text-gray-500 group-open:text-primary-600 transition-colors mt-0.5">
                          <svg className="w-3 h-3 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">💬</p>
          <h3 className="font-black text-gray-900 text-lg mb-1">¿No encontraste tu respuesta?</h3>
          <p className="text-gray-500 text-sm mb-4">Estamos disponibles de lunes a sábado de 9am a 7pm</p>
          <a href="https://wa.me/18294089097?text=Hola%20ContactGo,%20tengo%20una%20pregunta"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Escribir por WhatsApp
          </a>
        </div>

        {/* Links relacionados */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm">
          <Link href="/seguridad" className="text-gray-500 hover:text-primary-600 underline">Seguridad de pagos</Link>
          <span className="text-gray-300">·</span>
          <Link href="/terminos" className="text-gray-500 hover:text-primary-600 underline">Términos y condiciones</Link>
          <span className="text-gray-300">·</span>
          <Link href="/privacidad" className="text-gray-500 hover:text-primary-600 underline">Política de privacidad</Link>
        </div>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
