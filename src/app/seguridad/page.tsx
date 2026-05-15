import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Política de Seguridad | ContactGo',
  description: 'Políticas de seguridad para la transmisión de datos de tarjetas en ContactGo. Verified by Visa y Mastercard ID Check.',
}

export default function SeguridadPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <h1 className="font-display text-3xl font-black text-gray-900 mb-2">Política de Seguridad</h1>
        <p className="text-gray-500 text-sm mb-8">Protección de datos de tarjetas y transmisión segura</p>

        {/* LOGOS 3D SECURE — Requerido por AZUL en página de seguridad */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-8 flex-wrap">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pagos seguros con:</span>
          <Image src="/visa-blue.png" alt="Visa" width={60} height={20} className="object-contain h-5 w-auto" />
          <Image src="/mastercard.png" alt="Mastercard" width={32} height={24} className="object-contain h-6 w-auto" />
          <div className="flex items-center gap-1 border border-blue-200 rounded px-2 py-0.5">
            <span className="text-[10px] font-bold text-blue-800">Verified by</span>
            <Image src="/visa-blue.png" alt="Verified by Visa" width={28} height={10} className="object-contain h-3 w-auto" />
          </div>
          <div className="flex items-center gap-1 border border-orange-200 rounded px-2 py-0.5">
            <Image src="/mastercard.png" alt="Mastercard" width={16} height={12} className="object-contain h-3 w-auto" />
            <span className="text-[10px] font-bold text-gray-700">ID Check</span>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">🔒 SSL Seguro</span>
        </div>

        <div className="space-y-8 text-gray-700">

          {/* WEBSITE */}
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">Seguridad del sitio web</h2>
            <p className="text-sm leading-relaxed mb-3">
              Tomamos todas las medidas y precauciones razonables para proteger tu información personal y seguimos las mejores prácticas de la industria para asegurar que tu información no sea utilizada de manera inapropiada, alterada o destruida.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              Ciframos la información de tu tarjeta de crédito utilizando la tecnología de capa de puertos seguros o <strong>Secure Sockets Layer (SSL)</strong>, y la almacenamos con el cifrado AES-256. Seguimos todos los requerimientos del estándar <strong>PCI-DSS</strong> para la seguridad de datos de tarjetas de pago.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-1">🔒 Importante</p>
              <p className="text-blue-800">El correo electrónico <strong>no es un método de comunicación seguro</strong> y nunca debe utilizarse para enviar números de tarjeta ni otras informaciones sensibles. Nunca te solicitaremos esta información por correo.</p>
            </div>
          </section>

          {/* PAGOS */}
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">Seguridad de los pagos</h2>
            <p className="text-sm leading-relaxed mb-3">
              Los métodos de pago utilizados por ContactGo son servicios de terceros certificados. Estos servicios cumplen con todos los estándares de seguridad y cifrado para mantener tu información segura. Solo utilizarán la información necesaria para completar el proceso requerido.
            </p>
            <p className="text-sm leading-relaxed">
              ContactGo <strong>no almacena datos de tarjetas de crédito o débito</strong>. Toda la información de pago es procesada directamente por la pasarela de pago certificada (AZUL / Servicios Digitales Popular) que cumple con los más altos estándares de seguridad internacionales.
            </p>
          </section>

          {/* VERIFIED BY VISA + MASTERCARD ID CHECK */}
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">Verified by Visa y Mastercard ID Check</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2">
                <Image src="/visa-blue.png" alt="Visa" width={40} height={14} className="object-contain h-4 w-auto" />
                <span className="text-xs font-bold text-blue-800">Verified by VISA</span>
              </div>
              <div className="flex items-center gap-1.5 border border-orange-200 bg-orange-50 rounded-lg px-3 py-2">
                <Image src="/mastercard.png" alt="Mastercard" width={24} height={18} className="object-contain h-5 w-auto" />
                <span className="text-xs font-bold text-gray-800">Mastercard ID Check</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              <strong>"Verified by Visa"</strong> y <strong>"Mastercard ID Check"</strong> son programas de las marcas Visa y Mastercard, respectivamente, que proporcionan un método de autenticación del tarjetahabiente para asegurar que la compra la está efectuando el propietario legítimo de la tarjeta.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              <strong>¿Cómo funciona?</strong> Cuando un tarjetahabiente procesa su pago, si su tarjeta está enrolada al programa, será dirigido a la página de Visa o Mastercard (según corresponda), en la que deberá autenticarse según el método definido por su banco emisor. Una vez el cliente es autenticado, se completa la transacción de la forma habitual.
            </p>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm">
              <p className="text-green-800">✅ Este proceso adicional protege al tarjetahabiente contra el uso no autorizado de su tarjeta de crédito o débito en compras en línea.</p>
            </div>
          </section>

          {/* PROTECCIÓN AL COMPRADOR */}
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">Protección al comprador</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Todas las transacciones se realizan bajo conexión HTTPS cifrada con SSL',
                'Los datos de tu tarjeta son procesados directamente por AZUL (Servicios Digitales Popular, S.A.) — ContactGo nunca los almacena',
                'Cumplimos con el estándar PCI-DSS para el manejo seguro de datos de tarjetas',
                'Las transacciones están protegidas por autenticación 3D Secure (Verified by Visa / Mastercard ID Check)',
                'Nunca compartiremos tu información de pago con terceros no autorizados',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CONTACTO */}
          <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-2">¿Tienes dudas de seguridad?</h2>
            <p className="text-sm text-gray-600 mb-3">Si tienes alguna pregunta sobre la seguridad de tus datos o detectas alguna actividad sospechosa, contáctanos de inmediato:</p>
            <div className="flex flex-col gap-1 text-sm">
              <span>📧 <a href="mailto:info@contactgo.net" className="text-primary-600 font-semibold">info@contactgo.net</a></span>
              <span>📱 <a href="https://wa.me/18294728328" className="text-primary-600 font-semibold">(829) 472-8328</a></span>
              <span>🌐 Santo Domingo, República Dominicana</span>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
