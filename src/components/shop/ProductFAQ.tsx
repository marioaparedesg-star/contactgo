'use client'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

// FAQ específicas por producto — tienen prioridad sobre las de categoría.
// Se usa el nombre EXACTO de products.nombre como llave. Solo los productos
// listados aquí tienen preguntas verdaderamente propias; el resto sigue
// usando el respaldo genérico de FAQS_BY_TYPE mientras se van agregando.
const FAQS_BY_PRODUCT: Record<string, { q: string; a: string }[]> = {
  'Biofinity®': [
    { q: '¿Cada cuánto debo cambiar Biofinity?', a: 'Biofinity es de reemplazo mensual — se usa durante 30 días y luego se descarta, sin importar si lo usaste todos los días o no. Necesita solución multipropósito para su limpieza nocturna.' },
    { q: '¿Qué es Aquaform Technology?', a: 'Es la tecnología de CooperVision que integra agua directamente en la estructura del material del lente (no solo en la superficie), lo que le da muy buena transmisión de oxígeno y comodidad durante todo el día de uso.' },
    { q: '¿Qué rango de graduación cubre Biofinity?', a: 'Biofinity estándar cubre miopía e hipermetropía dentro del rango habitual. Si tu graduación es muy alta (fuera de rango estándar), existe Biofinity XR, pensado específicamente para esos casos.' },
    { q: '¿Biofinity tiene versión para astigmatismo o presbicia?', a: 'Sí — Biofinity Toric corrige astigmatismo, y Biofinity Multifocal corrige presbicia (vista cansada +40 años). Son productos separados con la misma tecnología Aquaform.' },
  ],
}

const FAQS_BY_TYPE: Record<string, { q: string; a: string }[]> = {
  esferico: [
    { q: '¿Cuánto tiempo puedo usar estos lentes?', a: 'Depende del tipo: diarios se descartan cada día, quincenales cada 2 semanas, mensuales cada 30 días. Nunca uses más allá del tiempo recomendado.' },
    { q: '¿Puedo dormir con los lentes puestos?', a: 'No se recomienda dormir con lentes de contacto a menos que sean específicamente aprobados para uso extendido. Consulta con tu optometrista.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí para lentes quincenales y mensuales. Los lentes diarios no requieren solución ya que se descartan cada día.' },
    { q: '¿Los lentes son para miopía e hipermetropía?', a: 'Sí, los lentes esféricos corrigen tanto miopía (valores negativos) como hipermetropía (valores positivos). Los valores van del -12.00 al +8.00 según el producto.' },
  ],
  torico: [
    { q: '¿Por qué los lentes tóricos tardan más en llegar?', a: 'Los lentes tóricos se fabrican a medida según tu graduación específica (Esfera, Cilindro y Eje). Este proceso toma 20-30 días, a diferencia de los esféricos que enviamos desde inventario.' },
    { q: '¿Qué diferencia hay entre lentes tóricos y esféricos?', a: 'Los lentes tóricos tienen una curvatura especial que corrige el astigmatismo. Tienen un diseño estabilizado para que no roten con el parpadeo, manteniendo la visión nítida.' },
    { q: '¿Qué información de mi receta necesito?', a: 'Para lentes tóricos necesitas la Esfera, el Cilindro y el Eje de tu receta. Estos tres valores son obligatorios y aparecen en cualquier receta óptica.' },
    { q: '¿Puedo usar lentes tóricos si tengo astigmatismo leve?', a: 'Sí, los lentes tóricos están disponibles desde -0.75 de cilindro. Para astigmatismo leve suelen ser muy efectivos.' },
  ],
  multifocal: [
    { q: '¿Para qué edad son los lentes multifocales?', a: 'Son para personas con presbicia, generalmente a partir de los 40-45 años. Permiten ver bien de cerca, a distancia media y de lejos sin necesitar gafas.' },
    { q: '¿Cuánto tiempo tarda la adaptación?', a: 'La mayoría de las personas se adapta en 1-2 semanas. Tu cerebro aprende a usar las diferentes zonas del lente automáticamente.' },
    { q: '¿Qué es el valor ADD de mi receta?', a: 'La adición (ADD) indica la potencia adicional para ver de cerca. Varía de +0.75 a +4.00 dependiendo de tu prescripción. Tu optometrista lo incluirá en tu receta.' },
    { q: '¿Siguen necesitando gafas de lectura?', a: 'La mayoría de los usuarios de lentes multifocales no necesitan gafas de lectura para actividades cotidianas, aunque en condiciones de poca luz puede ser necesario.' },
  ],
  color: [
    { q: '¿Puedo pedir lentes de color sin graduación?', a: 'Sí, disponemos de lentes de color con plano (sin graduación) para quienes solo desean cambiar el color de sus ojos sin corrección visual.' },
    { q: '¿Los colores se ven naturales?', a: 'Sí, especialmente los diseños tri-capa como FreshLook Colorblends y Air Optix Colors. Tienen múltiples tonos que imitan la apariencia natural del iris.' },
    { q: '¿Es seguro usar lentes de color?', a: 'Sí, siempre que sean de marca certificada y se usen correctamente. Evita lentes de colores de vendedores no autorizados ya que pueden causar daño ocular.' },
    { q: '¿Cuánto duran los lentes de color?', a: 'Los lentes de color de nuestro catálogo son de reemplazo mensual — duran 30 días de uso con el cuidado adecuado.' },
  ],
  solucion: [
    { q: '¿Cuál es la diferencia entre las soluciones multipropósito?', a: 'Todas limpian, enjuagan, desinfectan y conservan tus lentes. Las diferencias están en la fórmula de hidratación y compatibilidad con distintos materiales de silicona hidrogel.' },
    { q: '¿Puedo usar cualquier solución con mis lentes?', a: 'En general sí, pero verifica que sea compatible con lentes de silicona hidrogel si tus lentes son de ese material. Consulta las instrucciones del fabricante.' },
    { q: '¿Cada cuánto tiempo debo cambiar la solución del estuche?', a: 'Cambia la solución del estuche cada vez que uses tus lentes — nunca reutilices la solución del día anterior para evitar infecciones.' },
    { q: '¿Cada cuánto tiempo debo comprar solución?', a: 'Una botella estándar de 300-360ml dura aproximadamente 2-3 meses con uso diario. Te enviaremos un recordatorio cuando esté por terminarse.' },
  ],
  gota: [
    { q: '¿Puedo usar gotas mientras tengo los lentes puestos?', a: 'Solo las gotas específicamente formuladas para lentes de contacto (como Prolub Ofteno, Systane Ultra). Verifica siempre la indicación en el empaque.' },
    { q: '¿Con qué frecuencia debo aplicar las gotas?', a: 'Depende del producto. Las gotas lubricantes suelen aplicarse 2-4 veces al día según necesidad. Sigue las instrucciones del fabricante o de tu médico.' },
    { q: '¿Las gotas pueden reemplazar el parpadeo?', a: 'Las gotas complementan la lubricación natural pero no la reemplazan. Si tienes ojo seco severo, consulta con un oftalmólogo para un tratamiento adecuado.' },
    { q: '¿Cada cuánto tiempo debo comprar gotas?', a: 'Un frasco de 10ml dura aproximadamente 30 días con uso regular. Te enviaremos un recordatorio automático cuando sea hora de reponer.' },
  ],
}

const FAQS_GENERAL = [
  { q: '¿Hacen envíos a toda República Dominicana?', a: 'Sí. Santo Domingo y Santiago en 24-48h. Resto del país en 2-3 días hábiles. Los lentes tóricos tardan 20-30 días por fabricación a medida.' },
  { q: '¿Los productos son directo del fabricante?', a: 'Sí. Todos los productos de ContactGo son directo del fabricante, directo del fabricante y con código de autenticidad. Nunca vendemos imitaciones.' },
  { q: '¿Puedo devolver mi pedido?', a: 'Sí, en 30 días si el producto viene defectuoso o no es lo que pediste. Los lentes sin abrir y en su empaque original también son elegibles para devolución.' },
]

export default function ProductFAQ({ tipo, nombre }: { tipo: string; nombre: string }) {
  const [open, setOpen] = useState<number | null>(null)
  // Prioridad: FAQ propia del producto (si existe) → FAQ de su categoría
  // como respaldo. Así un producto sin FAQ propia todavía no se queda sin
  // nada, mientras se van agregando las específicas una por una.
  const propias = FAQS_BY_PRODUCT[nombre] ?? []
  const faqs = [...propias, ...(FAQS_BY_TYPE[tipo] ?? []), ...FAQS_GENERAL]
  if (!faqs.length) return null

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 border-t border-gray-100 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
          <span className="text-sm">❓</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Preguntas frecuentes</h3>
          <p className="text-xs text-gray-400">Sobre {nombre}</p>
        </div>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i}
            className={`border rounded-2xl overflow-hidden transition-colors ${open === i ? 'border-primary-200 bg-teal-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
              <span className={`font-semibold text-sm leading-snug transition-colors ${open === i ? 'text-primary-700' : 'text-gray-900'}`}>
                {faq.q}
              </span>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-200 ${open === i ? 'rotate-90 text-primary-500' : 'text-gray-300'}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <div className="w-full h-px bg-teal-50 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
