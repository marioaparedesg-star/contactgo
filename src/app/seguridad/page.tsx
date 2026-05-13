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

        <div className="mt-10 flex items-center gap-5 p-4 bg-gray-50 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 16" className="h-5" aria-label="Visa">
            <rect width="48" height="16" rx="3" fill="#1A1F71"/>
            <text x="5" y="12" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="white" letterSpacing="1">VISA</text>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className="h-6" aria-label="Mastercard">
            <circle cx="13" cy="12" r="10" fill="#EB001B"/>
            <circle cx="25" cy="12" r="10" fill="#F79E1B"/>
            <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
          </svg>
          <span className="text-xs text-gray-500">Pagos protegidos · SSL · PCI-DSS</span>
        </div>
      
        {/* Logos 3D Secure - Requisito tarjeta */}
        <div className="flex flex-col items-center gap-6 mt-8 p-6 bg-white rounded-2xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Transacciones protegidas con</p>
          <div className="flex items-center justify-center gap-8">
            <img 
              src="https://www.visa.com.ec/content/dam/VCOM/regional/lac/SUR/verified-by-visa/verified-by-visa-logo.png" 
              alt="Verified by Visa" 
              className="h-10"
            />
            <img 
              src="https://www.mastercard.com/content/dam/mccom/global/logos/mastercard-id-check.svg" 
              alt="Mastercard ID Check" 
              className="h-10"
            />
          </div>
          <p className="text-xs text-center text-gray-500 max-w-md">
            Verified by Visa y Mastercard ID Check verifican la identidad del tarjetahabiente para mayor seguridad.
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
