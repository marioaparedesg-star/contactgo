import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { Truck, Clock, MapPin, Package, Shield, RefreshCw, Phone, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Envíos y Entregas | ContactGo República Dominicana',
  description: 'Información sobre envíos, tiempos de entrega y política de devoluciones de ContactGo. Entregamos en todo el país en 24-48 horas.',
}

const CIUDADES = [
  { ciudad: 'Santo Domingo', tiempo: '24 horas', costo: 'RD$200' },
  { ciudad: 'Santiago',      tiempo: '24-48 horas', costo: 'RD$250' },
  { ciudad: 'Punta Cana',    tiempo: '24-48 horas', costo: 'RD$300' },
  { ciudad: 'La Romana',     tiempo: '24-48 horas', costo: 'RD$280' },
  { ciudad: 'Puerto Plata',  tiempo: '48 horas',    costo: 'RD$300' },
  { ciudad: 'San Pedro',     tiempo: '24-48 horas', costo: 'RD$250' },
  { ciudad: 'La Vega',       tiempo: '48 horas',    costo: 'RD$280' },
  { ciudad: 'Bonao',         tiempo: '48 horas',    costo: 'RD$280' },
  { ciudad: 'Baní',          tiempo: '48 horas',    costo: 'RD$280' },
  { ciudad: 'Otras ciudades',tiempo: '48-72 horas', costo: 'RD$350' },
]

export default function EnviosPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 pb-24">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Envíos y Entregas
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Entregamos tus lentes de contacto en toda República Dominicana con rapidez y seguridad.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Clock,     label: 'Entrega rápida',    sub: '24-48 horas' },
            { icon: Shield,    label: 'Empaque seguro',    sub: 'Protegido siempre' },
            { icon: Package,   label: 'Rastreo incluido',  sub: 'Número de guía' },
            { icon: Phone,     label: 'Soporte WhatsApp',  sub: 'Seguimiento en vivo' },
          ].map(h => (
            <div key={h.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <h.icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{h.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{h.sub}</p>
            </div>
          ))}
        </div>

        {/* Tiempos y costos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-gray-900">Tiempos y costos por ciudad</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Ciudad / Zona', 'Tiempo estimado', 'Costo de envío'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CIUDADES.map(c => (
                  <tr key={c.ciudad} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 font-semibold text-gray-900 text-sm">{c.ciudad}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary-500" />
                        {c.tiempo}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-primary-600 text-sm">{c.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proceso */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-600" />
            ¿Cómo funciona el proceso?
          </h2>
          <div className="space-y-4">
            {[
              { paso: '1', titulo: 'Haces tu pedido',       desc: 'Selecciona tus lentes con la graduación correcta y completa el checkout.' },
              { paso: '2', titulo: 'Confirmamos el pedido', desc: 'Recibirás una confirmación por email y WhatsApp con los detalles de tu compra.' },
              { paso: '3', titulo: 'Preparamos tu orden',   desc: 'Empacamos tus productos con cuidado para garantizar que lleguen en perfectas condiciones.' },
              { paso: '4', titulo: 'Enviamos',              desc: 'Te enviamos el número de guía para que puedas rastrear tu paquete en tiempo real.' },
              { paso: '5', titulo: 'Entrega en tu puerta',  desc: 'Recibes tu pedido en la dirección indicada. Si no estás, te contactamos por WhatsApp.' },
            ].map(p => (
              <div key={p.paso} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
                  {p.paso}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{p.titulo}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devoluciones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary-600" />
            Política de devoluciones
          </h2>
          <div className="space-y-3">
            {[
              'Tienes 7 días desde la recepción para reportar cualquier problema con tu pedido.',
              'Aceptamos devoluciones de productos en buen estado, sin abrir y en su empaque original.',
              'Los lentes de contacto abiertos NO pueden devolverse por razones sanitarias.',
              'Si recibiste un producto defectuoso o incorrecto, cubrimos el costo de devolución.',
              'El reembolso se procesa en 3-5 días hábiles por el mismo método de pago.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA WhatsApp */}
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-1">¿Tienes preguntas sobre tu envío?</p>
          <p className="text-sm text-gray-500 mb-4">Contáctanos por WhatsApp y te respondemos en minutos.</p>
          <a href="https://wa.me/18294089097?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20un%20envío"
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            💬 Escribir por WhatsApp
          </a>
        </div>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
