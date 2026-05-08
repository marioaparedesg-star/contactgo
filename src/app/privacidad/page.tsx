import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

// canonical añadido
// alternates: { canonical: 'https://contactgo.net/privacidad' }
export const metadata = {
  title: 'Política de Privacidad | ContactGo',
  description: 'Política de privacidad y tratamiento de datos personales de ContactGo.',
}

const SECCIONES = [
  {
    title: '1. Responsable del Tratamiento',
    body: 'ContactGo (contactgo.net) es responsable del tratamiento de los datos personales que usted proporciona al utilizar nuestra plataforma. Operamos desde República Dominicana conforme a las disposiciones de la Ley 172-13 sobre Protección de Datos Personales.'
  },
  {
    title: '2. Datos que Recopilamos',
    body: 'Recopilamos los siguientes datos: nombre completo, correo electrónico, número de teléfono, dirección de entrega, parámetros ópticos de la prescripción (SPH, CYL, AXIS, ADD), historial de pedidos e información de pago (no almacenamos datos de tarjetas de crédito). Esta información es necesaria para procesar y entregar sus pedidos correctamente.'
  },
  {
    title: '3. Uso de los Datos',
    body: 'Sus datos son utilizados para: procesar y gestionar pedidos, coordinar envíos y entregas, enviar confirmaciones y actualizaciones de pedidos, recordatorios de reposición de lentes, mejorar nuestros servicios y atención al cliente. No utilizamos sus datos para publicidad de terceros ni los vendemos a otras empresas.'
  },
  {
    title: '4. Datos de Salud Visual',
    body: 'Los parámetros ópticos (graduación, curvatura base, diámetro) que usted proporciona son datos sensibles de salud. ContactGo los almacena de forma segura y cifrada, los utiliza exclusivamente para procesar su pedido y personalizar recomendaciones de productos. Nunca son compartidos con terceros sin su consentimiento explícito.'
  },
  {
    title: '5. Compartición de Datos',
    body: 'Sus datos pueden ser compartidos con empresas de mensajería y logística para coordinar la entrega de su pedido. Nunca compartimos sus datos con terceros para fines comerciales o publicitarios. En caso de requerimiento legal por autoridades competentes, procederemos conforme a la ley.'
  },
  {
    title: '6. Seguridad',
    body: 'Implementamos medidas técnicas y organizativas para proteger sus datos: conexiones HTTPS cifradas, bases de datos seguras con acceso restringido, autenticación de dos factores para el panel administrativo. Sin embargo, ningún sistema es 100% infalible. Le recomendamos usar contraseñas seguras y no compartir su cuenta.'
  },
  {
    title: '7. Cookies y Analytics',
    body: 'Utilizamos Google Analytics (GA4) para analizar el tráfico y comportamiento en el sitio. Esta herramienta puede recopilar datos anónimos de navegación. Puede desactivar las cookies en su navegador, aunque esto puede afectar la funcionalidad del sitio.'
  },
  {
    title: '8. Sus Derechos',
    body: 'Usted tiene derecho a: acceder a sus datos personales, rectificar datos incorrectos, solicitar la eliminación de sus datos, oponerse al tratamiento de sus datos, solicitar la portabilidad de sus datos. Para ejercer estos derechos, contáctenos vía WhatsApp o correo electrónico.'
  },
  {
    title: '9. Retención de Datos',
    body: 'Conservamos sus datos mientras mantenga una cuenta activa o sean necesarios para el servicio. Los datos de pedidos se conservan por 5 años por obligaciones fiscales y legales. Puede solicitar la eliminación de su cuenta en cualquier momento.'
  },
  {
    title: '10. Cambios a esta Política',
    body: 'Podemos actualizar esta política periódicamente. Los cambios serán notificados en el sitio web. El uso continuado de ContactGo después de los cambios implica su aceptación.'
  },
]

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-black text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-gray-400 text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="space-y-8">
          {SECCIONES.map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">Contacto para asuntos de privacidad</p>
          <a href="https://wa.me/18294089097" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            💬 Contactar por WhatsApp
          </a>
          <p className="text-xs text-gray-400 mt-6 text-center">ContactGo · contactgo.net · República Dominicana · Mayo 2026</p>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
