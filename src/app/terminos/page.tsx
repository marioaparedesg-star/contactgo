export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import MailLink from '@/components/ui/MailLink'
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
    body: 'ContactGo es una tienda en línea especializada en lentes de contacto y productos para el cuidado visual. Nuestro catálogo incluye marcas como ACUVUE®, Air Optix®, Biofinity® y Bausch+Lomb®.'
  },
  {
    title: '3. Productos y disponibilidad',
    body: 'Los productos, precios y disponibilidad se muestran en sus respectivas fichas y pueden cambiar según el inventario y las condiciones de los fabricantes. ContactGo se reserva el derecho de actualizar el catálogo y limitar cantidades cuando corresponda.'
  },
  {
    title: '4. Precios y pagos',
    body: 'Todos los precios se muestran en pesos dominicanos (RD$). Aceptamos tarjeta de crédito y débito mediante la pasarela de pago indicada durante el checkout. ContactGo no almacena datos de tarjetas.'
  },
  {
    title: '5. Envíos y entregas',
    body: 'Realizamos entregas en toda la República Dominicana. El envío cuesta RD$250 en Santo Domingo y Gran Santo Domingo y RD$350 en el interior. En compras desde RD$8,000, el envío es gratis. Los tiempos estimados son: esféricos, 24-48 horas en Santo Domingo y 24-72 horas en el interior; color disponible, al día siguiente; multifocales, de 1 a 5 días; tóricos, de 25 a 45 días; soluciones y gotas, 24 horas. Los tiempos pueden variar por disponibilidad y factores externos. Los lentes tóricos se solicitan bajo pedido y pueden cancelarse dentro de las primeras 48 horas desde la confirmación.'
  },
  {
    title: '6. Devoluciones y reembolsos',
    body: 'Aceptamos devoluciones dentro de los 7 días posteriores a la entrega, siempre que el producto esté sellado, sin abrir y en su empaque original. No aceptamos devoluciones de productos abiertos por razones de higiene y seguridad. Los lentes tóricos pueden cancelarse dentro de las primeras 48 horas desde la confirmación; después de ese plazo no admiten cancelación ni devolución. Los reembolsos aprobados se procesan en 3-5 días hábiles por el mismo método de pago original. Para iniciar una solicitud: info@contactgo.net o WhatsApp (809) 694-2268.'
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
            <MailLink className="text-primary-600 font-semibold">info@contactgo.net</MailLink>
            {' '}o al WhatsApp{' '}
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold">(809) 694-2268</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
