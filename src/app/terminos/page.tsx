import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'Términos de Uso — ContactGo' }

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Términos de Uso</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: mayo 2026</p>
        {[
          { title: '1. Aceptación de los términos', body: 'Al acceder y usar ContactGo (contactgo.net), usted acepta estos Términos. ContactGo es operado por Óptica Optimax SRL, con RNC registrado en República Dominicana.' },
          { title: '2. Descripción del servicio', body: 'ContactGo es una plataforma de comercio electrónico especializada en lentes de contacto y productos de cuidado ocular con entrega a domicilio en toda República Dominicana. Todos los productos son 100% originales.' },
          { title: '3. Responsabilidad del usuario', body: 'Usted es responsable de proporcionar información de receta óptica válida, mantener la confidencialidad de su cuenta y usar los lentes según indicaciones del fabricante y su médico. ContactGo no reemplaza la consulta con un profesional de salud visual.' },
          { title: '4. Aviso médico', body: 'Los lentes de contacto son dispositivos médicos. La información en ContactGo es orientativa. Siempre consulte con un oftalmólogo antes de comprar. ContactGo no se responsabiliza por uso incorrecto de los productos.' },
          { title: '5. Pedidos y pagos', body: 'Al realizar un pedido confirma que la información es correcta. Los precios están en pesos dominicanos (RD$). Nos reservamos el derecho de cancelar pedidos por error en precio, falta de inventario o información incorrecta.' },
          { title: '6. Política de envío', body: 'Entregamos en toda la República Dominicana en 24 a 48 horas hábiles desde la confirmación. Los tiempos pueden variar. No nos responsabilizamos por retrasos causados por factores externos.' },
          { title: '7. Devoluciones y reembolsos', body: 'Aceptamos devoluciones dentro de 7 días si el producto está en empaque original sin abrir y presenta defecto de fábrica. No se aceptan devoluciones de lentes abiertos por razones de higiene. Contactar: soporte@contactgo.net.' },
          { title: '8. Propiedad intelectual', body: 'Todo el contenido de ContactGo es propiedad de Óptica Optimax SRL. Queda prohibida su reproducción sin autorización escrita.' },
          { title: '9. Limitación de responsabilidad', body: 'ContactGo no será responsable por daños indirectos derivados del uso del servicio. Nuestra responsabilidad máxima se limita al valor del pedido realizado.' },
          { title: '10. Ley aplicable', body: 'Estos términos se rigen por las leyes de República Dominicana. Disputas se resolverán ante los tribunales de Santo Domingo.' },
          { title: '11. Contacto', body: 'Consultas: soporte@contactgo.net | contactgo.net | República Dominicana.' },
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
