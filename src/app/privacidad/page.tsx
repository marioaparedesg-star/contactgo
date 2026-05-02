import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'Política de Privacidad — ContactGo' }

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: mayo 2026</p>
        {[
          { title: '1. Información que recopilamos', body: 'Recopilamos información que usted nos proporciona al crear una cuenta, realizar una compra o contactarnos: nombre completo, correo electrónico, teléfono, dirección de entrega y datos de receta óptica (SPH, CYL, AXIS). También recopilamos datos de uso como IP, tipo de dispositivo y páginas visitadas.' },
          { title: '2. Uso de la información', body: 'Utilizamos su información para procesar y entregar pedidos, enviar confirmaciones, brindar soporte y mejorar nuestra plataforma. No vendemos ni compartimos su información personal con terceros para fines comerciales.' },
          { title: '3. Datos de receta óptica', body: 'Los datos de graduación que usted ingresa se usan exclusivamente para facilitar la selección correcta de lentes. Esta información se almacena de forma segura y no es compartida sin su consentimiento expreso.' },
          { title: '4. Seguridad de los datos', body: 'Implementamos medidas técnicas y organizativas para proteger su información. Nuestra plataforma usa cifrado SSL/TLS en todas las transmisiones.' },
          { title: '5. Cookies', body: 'Usamos cookies esenciales para el funcionamiento de la plataforma (sesión, carrito). No usamos cookies de seguimiento publicitario de terceros.' },
          { title: '6. Sus derechos', body: 'De conformidad con la Ley 172-13 de República Dominicana, usted puede acceder, corregir, eliminar u oponerse al tratamiento de sus datos. Contáctenos en privacidad@contactgo.net.' },
          { title: '7. Retención de datos', body: 'Conservamos su información mientras su cuenta esté activa. Si solicita eliminación, procesamos la solicitud en 30 días, salvo obligación legal.' },
          { title: '8. Menores de edad', body: 'Nuestros servicios no están dirigidos a menores de 18 años. Si usted es tutor y cree que su hijo nos proporcionó datos, contáctenos para eliminarlos.' },
          { title: '9. Cambios a esta política', body: 'Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos por correo o aviso en la plataforma.' },
          { title: '10. Contacto', body: 'Preguntas sobre privacidad: privacidad@contactgo.net | contactgo.net | República Dominicana.' },
        ].map(({ title, body }) => (
          <section key={title} className="mb-8">
            <h2 className="font-semibold text-gray-900 text-lg mb-2">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
          </section>
        ))}
      </main>
      <Footer />
    </>
  )
}
