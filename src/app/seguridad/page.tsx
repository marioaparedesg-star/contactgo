import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = {
  title: 'Política de Seguridad | ContactGo',
  description: 'Cómo protegemos tu información de pago en ContactGo.',
}

export default function SeguridadPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Política de Seguridad de Pagos</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: mayo 2026</p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-bold text-blue-900 mb-1">Tus datos están protegidos</p>
            <p className="text-sm text-blue-700">ContactGo nunca almacena ni procesa directamente datos de tarjetas de crédito o débito. Todos los pagos son procesados por proveedores certificados PCI-DSS.</p>
          </div>
        </div>

        <div className="space-y-8">
          {[
            {
              title: '1. Transmisión de datos',
              body: 'Toda la información transmitida entre tu dispositivo y nuestros servidores está protegida mediante cifrado SSL/TLS (HTTPS). Ningún dato de pago viaja en texto plano.',
            },
            {
              title: '2. Procesamiento de pagos',
              body: 'ContactGo utiliza PayPal como procesador de pagos. PayPal cumple con los estándares PCI-DSS Nivel 1, el nivel más alto de certificación en seguridad de pagos. Nunca enviamos datos de tarjetas por correo electrónico ni por WhatsApp.',
            },
            {
              title: '3. Almacenamiento',
              body: 'ContactGo no almacena números de tarjeta, CVV, fechas de expiración ni ningún dato sensible de pago en sus servidores. Esta información es manejada exclusivamente por el procesador de pagos.',
            },
            {
              title: '4. Programas de autenticación',
              body: 'Apoyamos los programas Verified by Visa y Mastercard ID Check, que añaden una capa adicional de verificación para proteger al tarjetahabiente. Cuando tu banco tenga activado este servicio, serás redirigido a su plataforma para autenticarte antes de completar el pago.',
            },
            {
              title: '5. Recomendaciones al cliente',
              body: 'Nunca compartas tus datos de tarjeta por correo, WhatsApp o redes sociales. ContactGo jamás te los solicitará por esos medios. Asegúrate de que la URL del sitio comience con https:// antes de ingresar información personal.',
            },
            {
              title: '6. Contacto',
              body: 'Si tienes dudas sobre la seguridad de un pago, contáctanos en info@contactgo.net o al 829-408-9097 antes de proceder.',
            },
          ].map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain opacity-70" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain opacity-70" />
          <span className="text-xs text-gray-500">Pagos protegidos · SSL · PCI-DSS</span>
        </div>
      </main>
      <Footer />
    </>
  )
}
