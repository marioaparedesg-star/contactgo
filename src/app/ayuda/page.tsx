import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ayuda — Envíos, Devoluciones, Guía Médica | ContactGo RD',
  description: 'Centro de ayuda ContactGo: envíos, devoluciones, tiempos de adaptación, lentes secos, errores comunes y guía completa de lentes de contacto en República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/ayuda' },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Cuánto tarda en llegar mi pedido?", "acceptedAnswer": { "@type": "Answer", "text": "Santo Domingo: 24-48 horas. Santiago: 48-72 horas. Resto del país: 3-5 días hábiles." } },
    { "@type": "Question", "name": "¿Cuánto tiempo toma adaptarse a los lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "La mayoría de personas se adaptan en 1-2 semanas. Durante los primeros días es normal sentir algo de molestia leve. Si el malestar persiste más de 2 semanas, consulta a tu optometrista." } },
    { "@type": "Question", "name": "¿Qué hago si siento los lentes secos?", "acceptedAnswer": { "@type": "Answer", "text": "Usa gotas lubricantes compatibles con lentes de contacto (como Refresh, Systane o Blink). Asegúrate de no usar lentes más horas de lo recomendado y de hidratarte bien." } },
    { "@type": "Question", "name": "¿Cuándo debo dejar de usar lentes de contacto?", "acceptedAnswer": { "@type": "Answer", "text": "Deja de usarlos si tienes ojo rojo, dolor, visión borrosa repentina, secreción o infección. Consulta a tu médico antes de volver a usarlos." } },
    { "@type": "Question", "name": "¿Cuál es la diferencia entre silicona hidrogel e hidrogel?", "acceptedAnswer": { "@type": "Answer", "text": "La silicona hidrogel permite hasta 6 veces más oxígeno al ojo, es más saludable para uso prolongado. El hidrogel tradicional es más económico y cómodo para uso ocasional." } },
  ]
}

const SECCIONES = [
  {
    id: 'envios', emoji: '🚚', titulo: 'Envíos y Entregas',
    color: 'bg-blue-50 border-blue-100', badge: 'bg-blue-100 text-blue-700',
    items: [
      { q: '¿Cuánto tarda en llegar mi pedido?', a: 'Santo Domingo: 24-48 horas. Santiago: 48-72 horas. Resto del país: 3-5 días hábiles. Todos los pedidos se procesan de lunes a sábado.' },
      { q: '¿Cuánto cuesta el envío?', a: 'Santo Domingo y Santiago: RD$200. Interior del país: RD$350. Pedidos mayores a RD$8,000: envío GRATIS.' },
      { q: '¿Cómo sé dónde está mi pedido?', a: 'Recibirás un mensaje de WhatsApp con tu número de seguimiento. También puedes ver el estado en Mi cuenta → Pedidos.' },
      { q: '¿Entregan en toda la República Dominicana?', a: 'Sí, hacemos envíos a todo el país. Zonas remotas pueden tomar 1-2 días adicionales.' },
      { q: '¿Puedo cambiar la dirección después de hacer el pedido?', a: 'Sí, siempre que el pedido no haya sido enviado. Escríbenos por WhatsApp lo antes posible.' },
    ],
  },
  {
    id: 'devoluciones', emoji: '🔄', titulo: 'Devoluciones y Cambios',
    color: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-700',
    items: [
      { q: '¿Puedo devolver un producto?', a: 'Sí. Aceptamos devoluciones dentro de los 7 días calendario desde la entrega, siempre que el producto esté en su empaque original, sin abrir y sin usar.' },
      { q: '¿Qué productos NO son devolvibles?', a: 'Por razones de higiene: lentes de contacto abiertos, soluciones y gotas ya usadas. Solo aplica a productos sin abrir.' },
      { q: '¿Cómo inicio una devolución?', a: 'Escríbenos por WhatsApp con tu número de pedido. El reembolso se procesa en 3-5 días hábiles.' },
      { q: '¿Me devuelven el dinero completo?', a: 'Sí. El costo de envío de la devolución corre por cuenta del cliente, excepto si el error fue nuestro.' },
      { q: '¿Qué pasa si recibo un producto incorrecto?', a: 'Hacemos el cambio sin costo y con envío prioritario. Contáctanos dentro de las 48 horas de recibido.' },
    ],
  },
  {
    id: 'adaptacion', emoji: '👁', titulo: 'Adaptación y Uso',
    color: 'bg-teal-50 border-teal-100', badge: 'bg-teal-100 text-teal-700',
    items: [
      { q: '¿Cuánto tiempo toma adaptarse a los lentes de contacto?', a: 'La mayoría de personas se adaptan en 1-2 semanas. Los primeros días es normal sentir leve sensación de cuerpo extraño. Comienza usando los lentes pocas horas e increméntalo gradualmente. Si el malestar persiste más de 2 semanas, consulta a tu optometrista.' },
      { q: '¿Cuántas horas puedo usar mis lentes al día?', a: 'En general, 10-12 horas máximo. Los lentes de silicona hidrogel permiten uso más prolongado. Nunca duermas con lentes a menos que sean específicamente aprobados para uso nocturno.' },
      { q: '¿Puedo usar lentes de contacto por primera vez sin experiencia?', a: 'Sí, pero te recomendamos que un optometrista te enseñe a ponértelos y quitártelos. La técnica correcta evita infecciones y daños al ojo.' },
      { q: '¿Qué hago si se me dobla el lente dentro del ojo?', a: 'No entres en pánico. Cierra el ojo y muévelo suavemente en círculos. El lente se reposicionará solo. Si no, aplica unas gotas y espera unos minutos antes de intentar de nuevo.' },
      { q: '¿Puedo nadar o ducharme con lentes de contacto?', a: 'No es recomendable. El agua puede contener microbios que causan infecciones graves. Retírate los lentes antes de nadar, ducharte o bañarte en el mar.' },
    ],
  },
  {
    id: 'ojos-secos', emoji: '💧', titulo: 'Lentes Secos y Comodidad',
    color: 'bg-cyan-50 border-cyan-100', badge: 'bg-cyan-100 text-cyan-700',
    items: [
      { q: '¿Por qué siento los lentes secos?', a: 'Las causas más comunes: uso prolongado (más de 10h), aire acondicionado intenso, pantallas sin pausas, deshidratación o lentes de bajo contenido de agua. Los lentes de silicona hidrogel reducen este problema significativamente.' },
      { q: '¿Qué gotas puedo usar con lentes de contacto?', a: 'Solo gotas específicas para lentes de contacto como Blink Contacts, Refresh Contacts o Systane Ultra sin conservantes. Nunca uses gotas para ojos rojos (vasoconstrictoras) con lentes puestos.' },
      { q: '¿Cuándo debo cambiar mi tipo de lente por ojo seco?', a: 'Si el ojo seco persiste más de 2 semanas con las gotas, considera cambiar a un lente de mayor contenido de agua o silicona hidrogel como ACUVUE Oasys o Biofinity. Consulta a tu optometrista.' },
      { q: '¿Los lentes diarios son mejores para ojos secos?', a: 'En general sí. Los lentes diarios siempre son frescos y no acumulan depósitos de proteínas que irritan el ojo. ACUVUE Moist y Clariti 1-Day son excelentes para ojos sensibles.' },
      { q: '¿Cómo evitar la sequedad ocular con lentes?', a: 'Sigue la regla 20-20-20: cada 20 minutos frente a pantallas, mira a 20 pies de distancia por 20 segundos. Hidrátate bien, usa humidificador si hay AC, y no sobrepases las horas recomendadas.' },
    ],
  },
  {
    id: 'errores', emoji: '⚠️', titulo: 'Errores Comunes',
    color: 'bg-red-50 border-red-100', badge: 'bg-red-100 text-red-700',
    items: [
      { q: '¿Puedo usar el mismo par de lentes más días de lo indicado?', a: 'No. Usar lentes más tiempo del recomendado aumenta el riesgo de infecciones, úlceras corneales y daño permanente. Los plazos (diario, quincenal, mensual) existen por razones de salud, no solo de marketing.' },
      { q: '¿Puedo dormir con mis lentes de contacto?', a: 'Solo si son lentes de uso nocturno aprobados por el fabricante. Dormir con lentes convencionales reduce el oxígeno al ojo y puede causar desde irritación hasta infecciones graves.' },
      { q: '¿Está bien enjuagar los lentes con agua del grifo?', a: 'Nunca. El agua del grifo puede contener Acanthamoeba, un parásito que causa infecciones oculares muy graves. Usa siempre solución multipropósito certificada.' },
      { q: '¿Puedo compartir lentes de contacto con alguien?', a: 'Nunca. Compartir lentes transmite bacterias y virus directamente al ojo. Cada persona debe tener su propio par con su propia graduación.' },
      { q: '¿Qué pasa si uso lentes de la graduación equivocada?', a: 'Puede causar dolores de cabeza, fatiga visual y mareos. A largo plazo puede empeorar tu visión. Siempre verifica tu graduación exacta antes de pedir.' },
    ],
  },
  {
    id: 'cuando-dejar', emoji: '🚨', titulo: '¿Cuándo Dejar de Usar Lentes?',
    color: 'bg-orange-50 border-orange-100', badge: 'bg-orange-100 text-orange-700',
    items: [
      { q: '¿Cuáles son las señales de alarma para quitar los lentes inmediatamente?', a: 'Quítatelos de inmediato si sientes: dolor ocular intenso, enrojecimiento severo, visión borrosa repentina, sensibilidad extrema a la luz, o secreción inusual. Consulta a un médico el mismo día.' },
      { q: '¿Debo dejar de usar lentes si tengo conjuntivitis?', a: 'Sí, definitivamente. Con cualquier infección ocular, retírate los lentes y no los uses hasta que el médico lo autorice. Descarta el par que usabas cuando empezó la infección.' },
      { q: '¿Puedo usar lentes de contacto con alergias oculares?', a: 'Depende de la severidad. En épocas de alergia fuerte, es mejor descansar de los lentes o usar lentes diarios desechables. Los lentes acumulan alérgenos que empeoran los síntomas.' },
      { q: '¿Qué enfermedades impiden el uso de lentes de contacto?', a: 'Ojo seco severo, queratocono avanzado, blefaritis activa, rosácea ocular y ciertas enfermedades autoinmunes. Tu optometrista debe evaluarte individualmente.' },
      { q: '¿Con qué frecuencia debo ir al optometrista si uso lentes?', a: 'Mínimo una vez al año, incluso si no sientes molestias. La graduación cambia, la salud corneal debe monitorearse y la prescripción para lentes puede diferir de la de los espejuelos.' },
    ],
  },
  {
    id: 'materiales', emoji: '🔬', titulo: 'Diferencias entre Materiales',
    color: 'bg-purple-50 border-purple-100', badge: 'bg-purple-100 text-purple-700',
    items: [
      { q: '¿Cuál es la diferencia entre silicona hidrogel e hidrogel tradicional?', a: 'La silicona hidrogel transmite hasta 6 veces más oxígeno al ojo, permitiendo uso más prolongado y menor riesgo de hipoxia corneal. El hidrogel tradicional es más económico y suficiente para uso ocasional (pocas horas/día). Para uso diario intensivo, la silicona hidrogel es superior.' },
      { q: '¿Qué lentes tienen más contenido de agua?', a: 'Los hidrogeles tradicionales suelen tener 38-75% de agua. Más agua no siempre es mejor — los lentes muy húmedos evaporan más rápido y pueden resecar el ojo. La silicona hidrogel logra alta transmisión de oxígeno con menos agua.' },
      { q: '¿Qué significa la curva base (BC) de un lente?', a: 'La curva base mide la curvatura del lente (en mm). Debe coincidir con la curvatura de tu córnea. La mayoría de personas usan 8.3-8.7mm. Un lente con BC incorrecta puede moverse demasiado o apretar el ojo.' },
      { q: '¿Qué es el diámetro del lente y por qué importa?', a: 'El diámetro (13.8-14.5mm típicamente) determina la cobertura de la córnea. Los lentes de color suelen ser más grandes. Un diámetro incorrecto puede causar incomodidad o visión reducida.' },
      { q: '¿Existen lentes para astigmatismo de alta graduación?', a: 'Sí. Los lentes tóricos están diseñados específicamente para astigmatismo. Para graduaciones muy altas (más de -3.00 CYL), existen lentes especializados como Biofinity XR Toric. Siempre necesitas una prescripción específica para lentes tóricos.' },
    ],
  },
  {
    id: 'garantias', emoji: '✅', titulo: 'Garantías y Autenticidad',
    color: 'bg-green-50 border-green-100', badge: 'bg-green-100 text-green-700',
    items: [
      { q: '¿Son originales los productos?', a: 'Todos nuestros productos son 100% originales, importados directamente de distribuidores oficiales de ACUVUE (J&J), Alcon, Bausch+Lomb y CooperVision.' },
      { q: '¿Los lentes están dentro de su fecha de vencimiento?', a: 'Sí, todos los productos tienen al menos 18 meses de vida útil desde la fecha de compra.' },
      { q: '¿Qué garantía tienen los lentes de contacto?', a: 'Si detectas algún defecto de fabricación (rotura, deformación), lo reemplazamos sin costo.' },
    ],
  },
  {
    id: 'pagos', emoji: '💳', titulo: 'Pagos y Seguridad',
    color: 'bg-indigo-50 border-indigo-100', badge: 'bg-indigo-100 text-indigo-700',
    items: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta de crédito/débito (Visa, Mastercard vía AZUL), PayPal, y pago en efectivo contra entrega.' },
      { q: '¿Es seguro pagar con tarjeta?', a: 'Sí. Usamos AZUL (Banco Popular), con encriptación SSL y verificación 3D Secure.' },
      { q: '¿Puedo pagar contra entrega?', a: 'Sí, disponible para Santo Domingo y Santiago. Solo efectivo, monto exacto.' },
    ],
  },
]

export default function AyudaPage() {
  const allFaqs = SECCIONES.flatMap(s => s.items)

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <nav className="text-xs text-gray-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Centro de Ayuda</span>
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Centro de Ayuda</h1>
          <p className="text-gray-500">Todo sobre envíos, uso correcto, cuidado ocular y compras en ContactGo.</p>
        </div>

        {/* Índice rápido */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-10">
          {SECCIONES.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-3 text-center hover:border-gray-300 hover:shadow-sm transition-all">
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="text-[11px] font-semibold text-gray-700 leading-tight">{s.titulo}</p>
            </a>
          ))}
        </div>

        {/* Secciones */}
        <div className="space-y-8">
          {SECCIONES.map(s => (
            <section key={s.id} id={s.id}>
              <div className={`border rounded-2xl overflow-hidden ${s.color}`}>
                <div className="px-5 py-4 flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <h2 className="font-black text-gray-900 text-xl">{s.titulo}</h2>
                  <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
                    {s.items.length} preguntas
                  </span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {s.items.map((item, i) => (
                    <details key={i} className="group px-5 py-4">
                      <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                        <p className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</p>
                        <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 group-open:bg-primary-100 flex items-center justify-center text-xs text-gray-500 group-open:text-primary-600 transition-colors mt-0.5">
                          <svg className="w-3 h-3 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">💬</p>
          <h3 className="font-black text-gray-900 text-lg mb-1">¿No encontraste tu respuesta?</h3>
          <p className="text-gray-500 text-sm mb-4">Lunes a sábado · 9am – 7pm</p>
          <a href="https://wa.me/18294728328?text=Hola%20ContactGo%2C%20tengo%20una%20pregunta"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Escribir por WhatsApp
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm">
          <Link href="/seguridad" className="text-gray-500 hover:text-primary-600 underline">Seguridad de pagos</Link>
          <span className="text-gray-300">·</span>
          <Link href="/terminos" className="text-gray-500 hover:text-primary-600 underline">Términos</Link>
          <span className="text-gray-300">·</span>
          <Link href="/privacidad" className="text-gray-500 hover:text-primary-600 underline">Privacidad</Link>
          <span className="text-gray-300">·</span>
          <Link href="/blog" className="text-gray-500 hover:text-primary-600 underline">Blog de lentes</Link>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
