export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — ContactGo',
  description: 'Términos y condiciones de uso de ContactGo. Plataforma de venta de lentes de contacto en República Dominicana.',
  alternates: { canonical: 'https://www.contactgo.net/terminos' },
  robots: { index: false, follow: false },
}

const secciones = [
  {
    title: '1. Aceptación de los términos',
    body: 'Al acceder y usar ContactGo (contactgo.net) aceptas estos términos en su totalidad. Si no estás de acuerdo con alguna parte, debes abstenerte de usar el sitio.'
  },
  {
    title: '2. Descripción del servicio',
    body: 'ContactGo es la única tienda dominicana especializada exclusivamente en lentes de contacto y productos de cuidado ocular. Todos nuestros productos son 100% originales y certificados por las marcas fabricantes: ACUVUE®, Air Optix®, Biofinity® y Bausch+Lomb®.'
  },
  {
    title: '3. Productos y disponibilidad',
    body: 'Todos los productos ofrecidos son 100% originales, 100% originales y adquiridos a través de canales oficiales de las marcas. ContactGo se reserva el derecho de modificar precios, descontinuar productos o limitar cantidades sin previo aviso. La disponibilidad de stock se actualiza en tiempo real.'
  },
  {
    title: '4. Precios y pagos',
    body: 'Todos los precios están expresados en pesos dominicanos (RD$) e incluyen ITBIS del 18% conforme a la Ley 11-92. Aceptamos tarjeta de crédito/débito Visa y Mastercard procesada por AZUL (Banco Popular) con verificación 3D Secure. ContactGo no almacena datos de tarjetas de crédito.'
  },
  {
    title: '5. Envíos y entregas',
    body: 'Realizamos entregas en toda la República Dominicana. Costo de envío: RD$200 en Santo Domingo, RD$350 en el interior del país. Envío gratuito en pedidos superiores a RD$6,000. Tiempo estimado: 24-48 horas en Santo Domingo, 48-72 horas en otras provincias. Los lentes tóricos requieren 20-30 días por fabricación a medida. Los tiempos son estimados y pueden variar por factores externos ajenos a ContactGo.'
  },
  {
    title: '6. Devoluciones y reembolsos',
    body: 'Aceptamos devoluciones dentro de las 7 días desde la recepción del pedido, siempre que el producto esté en su empaque original sellado y sin abrir. No se aceptan devoluciones de lentes abiertos por razones de higiene y seguridad médica. Los reembolsos se procesan en 3-5 días hábiles por el mismo método de pago original. Para iniciar una devolución: info@contactgo.net o WhatsApp (809) 694-2268.'
  },
  {
    title: '7. Responsabilidad médica',
    body: 'Los lentes de contacto son dispositivos médicos. ContactGo no presta servicios de optometría ni oftalmología. La calculadora de receta es informativa y no reemplaza la evaluación de un profesional de la visión certificado. El cliente es responsable de verificar que los parámetros de su receta sean correctos antes de realizar la compra. ContactGo no se responsabiliza por daños derivados del uso incorrecto de los productos.'
  },
  {
    title: '8. Propiedad intelectual',
    body: 'Todo el contenido de ContactGo (textos, imágenes, logotipos, diseño) es propiedad de ContactGo o está licenciado. Las marcas ACUVUE®, Air Optix®, Biofinity® y Bausch+Lomb® son propiedad de sus respectivos titulares. Queda prohibida la reproducción sin autorización escrita.'
  },
  {
    title: '9. Ley aplicable',
    body: 'Estos términos se rigen por las leyes de la República Dominicana, incluyendo la Ley 358-05 de Protección al Consumidor y la Ley 172-13 de Protección de Datos Personales. Cualquier disputa se someterá a los tribunales competentes de Santo Domingo.'
  },
  {
    title: '10. Modificaciones',
    body: 'ContactGo se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor al publicarse en el sitio. El uso continuado del sitio implica aceptación de los términos actualizados.'
  },
]

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-4"><Link href="/" className="text-sm text-primary-600 font-semibold">← Inicio</Link></div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: mayo 2026 · Vigentes desde enero 2025</p>

        <div className="space-y-6">
          {secciones.map(s => (
            <section key={s.title} className="border-b border-gray-100 pb-6">
              <h2 className="font-bold text-gray-900 text-base mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl p-5 text-sm text-gray-500">
          <p>¿Preguntas sobre estos términos? Escríbenos a{' '}
            <a href="mailto:info@contactgo.net" className="text-primary-600 font-semibold">info@contactgo.net</a>
            {' '}o al WhatsApp{' '}
            <a href="https://wa.me/18096942268" className="text-primary-600 font-semibold">(809) 694-2268</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
