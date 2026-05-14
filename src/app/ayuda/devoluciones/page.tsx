import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devoluciones y Garantías | ContactGo RD',
  description: 'Política de devoluciones y garantías de ContactGo. Productos 100% originales con respaldo de marca.',
  alternates: { canonical: 'https://contactgo.net/ayuda/devoluciones' },
  openGraph: {
    title: 'Devoluciones y Garantías | ContactGo RD',
    description: 'Política de devoluciones y garantías de ContactGo. Productos 100% originales con respaldo de marca.',
    url: 'https://contactgo.net/ayuda/devoluciones',
    locale: 'es_DO',
    siteName: 'ContactGo',
  },
}

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function DevolucionesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Devoluciones y Garantía</h1>
          <p className="text-gray-500">Conoce nuestra política de devoluciones y garantía de productos.</p>
        </div>
        <div className="space-y-6">
          {[
            { title: '✅ ¿Cuándo puedo devolver un producto?', body: 'Aceptamos devoluciones dentro de los 7 días posteriores a la entrega, siempre que el producto esté sellado, sin abrir y en su empaque original.' },
            { title: '❌ ¿Qué productos NO son devolvibles?', body: 'No aceptamos devoluciones de lentes de contacto que hayan sido abiertos o usados, por razones de higiene y salud.' },
            { title: '📦 ¿Cómo hago una devolución?', body: 'Contáctanos por WhatsApp al 829-472-8328 dentro de los 7 días con tu número de pedido y foto del producto. Coordinamos la devolución sin costo adicional.' },
            { title: '💰 ¿Cómo recibo mi reembolso?', body: 'El reembolso se procesa por el mismo método de pago original dentro de 3 a 5 días hábiles tras recibir el producto devuelto.' },
            { title: '🔄 ¿Puedo cambiar por otro producto?', body: 'Sí. Si prefieres un cambio en lugar de reembolso, lo gestionamos sin costo adicional de envío.' },
            { title: '⚠️ Producto dañado o incorrecto', body: 'Si recibiste un producto dañado o diferente al pedido, contáctanos inmediatamente. Lo reemplazamos sin ningún costo para ti.' },
            { title: '🛡️ Garantía de autenticidad', body: 'Todos nuestros productos son 100% originales y certificados. Garantizamos la autenticidad de cada producto vendido en ContactGo.' },
          ].map(({ title, body }) => (
            <div key={title} className="border border-gray-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-2">{title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">¿Necesitas iniciar una devolución?</p>
          <p className="text-gray-500 text-sm mb-4">Escríbenos por WhatsApp y te ayudamos de inmediato.</p>
          <a href="https://wa.me/18294728328" target="_blank"
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
