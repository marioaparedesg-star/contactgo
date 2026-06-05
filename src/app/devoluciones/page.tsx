export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Devoluciones — ContactGo',
  description: 'Política de devoluciones de ContactGo. 7 días para devolver productos sellados y sin abrir. Reembolso por el mismo método de pago.',
  alternates: { canonical: 'https://www.contactgo.net/devoluciones' },
}

export default function DevolucionesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-4"><Link href="/" className="text-sm text-primary-600 font-semibold">← Inicio</Link></div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Política de Devoluciones</h1>
        <p className="text-gray-400 text-sm mb-8">Vigente desde enero 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <h2 className="font-bold text-primary-800 text-lg mb-2">Resumen rápido</h2>
            <ul className="space-y-1 text-sm text-primary-700">
              <li>⏱ <strong>Plazo:</strong> 7 días desde la recepción del pedido</li>
              <li>📦 <strong>Condición:</strong> Producto sellado, sin abrir y en empaque original</li>
              <li>💳 <strong>Reembolso:</strong> Por el mismo método de pago en 3-5 días hábiles</li>
              <li>📞 <strong>Contacto:</strong> WhatsApp (829) 472-8328 o info@contactgo.net</li>
            </ul>
          </div>

          <section>
            <h2 className="font-bold text-gray-900 text-xl mb-3">¿Cuándo puedo devolver un producto?</h2>
            <p>Aceptamos devoluciones dentro de las <strong>7 días</strong> siguientes a la recepción de tu pedido, siempre que el producto esté en las siguientes condiciones:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li>Empaque original sellado y sin abrir</li>
              <li>Sin signos de uso, daño o alteración</li>
              <li>Con el comprobante de compra</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-xl mb-3">Productos no elegibles para devolución</h2>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Lentes de contacto o soluciones que hayan sido abiertos o usados</li>
              <li>Productos solicitados por error del cliente (graduación incorrecta indicada)</li>
              <li>Productos con daño causado por mal manejo del cliente</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-xl mb-3">¿Cómo iniciar una devolución?</h2>
            <ol className="space-y-3 text-sm list-decimal list-inside">
              <li>Contáctanos por WhatsApp al (829) 472-8328 o escríbenos a info@contactgo.net dentro de las 7 días</li>
              <li>Indica tu número de pedido y el motivo de la devolución</li>
              <li>Te indicaremos la dirección para enviar el producto</li>
              <li>Una vez recibido y verificado, procesamos el reembolso en 3-5 días hábiles</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-xl mb-3">Reembolsos</h2>
            <p>El reembolso se realiza por el mismo método de pago utilizado en la compra:</p>
            <ul className="mt-3 space-y-1 text-sm list-disc list-inside">
              <li><strong>Tarjeta de crédito/débito (AZUL):</strong> 3-5 días hábiles bancarios</li>
            </ul>
          </section>

          <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600">
            <p>Esta política cumple con la <strong>Ley 358-05</strong> de Protección al Consumidor de la República Dominicana. Para cualquier reclamación puedes también contactar la Dirección General de Defensa al Consumidor (ProConsumidor).</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}