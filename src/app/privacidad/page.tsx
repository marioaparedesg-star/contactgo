export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — ContactGo',
  description: 'Política de privacidad de ContactGo. Cómo recopilamos, usamos y protegemos tus datos personales conforme a la Ley 172-13 de República Dominicana.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.contactgo.net/privacidad' },
}

const secciones = [
  {
    title: '1. Responsable del tratamiento',
    body: 'ContactGo (en adelante "la Empresa") es responsable del tratamiento de los datos personales recopilados a través del sitio web contactgo.net. Correo de contacto: info@contactgo.net | Teléfono: (809) 694-2268 | Santo Domingo, República Dominicana.'
  },
  {
    title: '2. Base legal (Ley 172-13)',
    body: 'El tratamiento de tus datos personales se basa en: (a) Ejecución del contrato de compraventa; (b) Consentimiento explícito para comunicaciones de marketing; (c) Interés legítimo para mejora del servicio y prevención de fraudes; (d) Cumplimiento de obligaciones legales.'
  },
  {
    title: '3. Datos que recopilamos',
    body: 'Recopilamos: Datos de identificación (nombre, email, teléfono), Datos de envío (dirección), Datos de navegación (cookies, IP, dispositivo), Datos de prescripción óptica (SPH, CYL, AXIS) proporcionados voluntariamente, Datos de pago procesados por AZUL (Banco Popular) — ContactGo NO almacena datos de tarjetas.'
  },
  {
    title: '4. Finalidad del tratamiento',
    body: 'Usamos tus datos para: Procesar y gestionar pedidos, Enviar notificaciones de pedido por email/WhatsApp, Validar prescripciones ópticas, Mejorar la experiencia en el sitio web, Enviar comunicaciones de marketing (solo con consentimiento), Cumplir obligaciones legales y fiscales, Prevenir fraudes.'
  },
  {
    title: '5. Destinatarios (transferencias)',
    body: 'Tus datos son compartidos con: Vercel Inc. (hosting, EEUU — acogido a SCCs), Supabase Inc. (base de datos, EEUU/UE — acogido a SCCs), Resend Inc. (emails transaccionales, EEUU — acogido a SCCs), AZUL/Banco Popular Dominicano (procesamiento de pagos, RD), Google LLC (Analytics/GTM — acogido a SCCs), Meta Platforms Inc. (Pixel — acogido a SCCs). No vendemos ni cedemos datos a terceros con fines comerciales.'
  },
  {
    title: '6. Plazo de conservación',
    body: 'Datos de cuenta: mientras la cuenta esté activa + 2 años tras cierre. Datos de pedidos: 5 años (obligación fiscal). Prescripciones: 2 años. Datos de marketing: hasta que retires el consentimiento. Logs de acceso: 90 días.'
  },
  {
    title: '7. Tus derechos (ARCO)',
    body: 'Conforme a la Ley 172-13, tienes derecho a: Acceso a tus datos, Rectificación de datos incorrectos, Cancelación (eliminación), Oposición al tratamiento. Para ejercerlos escríbenos a info@contactgo.net indicando tu nombre, email y el derecho que deseas ejercer. Respondemos en máximo 15 días hábiles.'
  },
  {
    title: '8. Cookies',
    body: 'Usamos cookies esenciales (sesión, carrito), de análisis (Google Analytics, Microsoft Clarity) y de marketing (Meta Pixel). Puedes gestionar tus preferencias en el banner de cookies al ingresar al sitio, o desde la configuración de tu navegador. Las cookies esenciales no pueden desactivarse.'
  },
  {
    title: '9. Seguridad',
    body: 'Implementamos medidas técnicas y organizativas: cifrado SSL/TLS en tránsito, Row Level Security en base de datos, autenticación multifactor en sistemas de administración, acceso restringido a datos sensibles. Ante una brecha de seguridad, notificaremos a los afectados en el plazo que establezca la ley.'
  },
  {
    title: '10. Menores de edad',
    body: 'Nuestros servicios no están dirigidos a menores de 18 años sin supervisión de un tutor. Si un padre/tutor detecta que su hijo menor ha proporcionado datos, puede solicitar su eliminación en info@contactgo.net.'
  },
  {
    title: '11. Modificaciones',
    body: 'Podemos actualizar esta política. Notificaremos los cambios significativos por email o mediante aviso destacado en el sitio. El uso continuado tras la notificación implica aceptación.'
  },
  {
    title: '12. Autoridad de control',
    body: 'Si consideras que el tratamiento de tus datos vulnera la Ley 172-13, puedes presentar una reclamación ante el Instituto Dominicano de las Telecomunicaciones (INDOTEL) o ante los tribunales competentes de la República Dominicana.'
  },
]

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-4"><Link href="/" className="text-sm text-primary-600 font-semibold">← Inicio</Link></div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: mayo 2026 · Conforme a la Ley 172-13 de República Dominicana</p>

        <div className="space-y-6">
          {secciones.map(s => (
            <section key={s.title} className="border-b border-gray-100 pb-6">
              <h2 className="font-bold text-gray-900 text-base mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 rounded-2xl p-5 text-sm text-gray-500">
          <p>¿Preguntas sobre tu privacidad? Escríbenos a{' '}
            <a href="mailto:info@contactgo.net" className="text-primary-600 font-semibold">info@contactgo.net</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}