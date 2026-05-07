import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Link from 'next/link'
import Image from 'next/image'
import { Eye } from 'lucide-react'

const MARCA_INFO: Record<string, {
  nombre: string
  descripcion: string
  tecnologia: string[]
  indicaciones: string[]
  color: string
  faqs: { q: string; a: string }[]
}> = {
  acuvue: {
    nombre: 'ACUVUE®',
    descripcion: 'Johnson & Johnson Vision es el fabricante de lentes de contacto más vendido del mundo. Sus lentes ACUVUE® combinan comodidad extrema, salud ocular y tecnología de punta, con más de 35 años de innovación continua.',
    tecnologia: ['Tecnología HYDRACLEAR® para máxima hidratación', 'Filtro UV incorporado clase 1 y 2', 'Material silicona hidrogel de alta permeabilidad al oxígeno', 'Diseño PUPIL INTELLIGENT® para visión nítida en todo momento'],
    indicaciones: ['Miopía y hipermetropía', 'Astigmatismo (lentes tóricos)', 'Presbicia / Vista cansada (multifocales)', 'Uso diario y quincenal'],
    color: 'bg-blue-600',
    faqs: [
      { q: '¿Cuánto tiempo puedo usar los ACUVUE Oasys?', a: 'Son de uso quincenal — se reemplazan cada 2 semanas. Pueden usarse hasta 14 días consecutivos con uso diario.' },
      { q: '¿Los ACUVUE tienen filtro UV?', a: 'Sí, todos los lentes ACUVUE incluyen el mayor nivel de protección UV disponible en lentes de contacto.' },
      { q: '¿Necesito receta para comprar?', a: 'Sí, recomendamos tener una prescripción vigente de un optómetra o oftalmólogo.' },
    ],
  },
  alcon: {
    nombre: 'ALCON®',
    descripcion: 'Alcon es líder mundial en cuidado ocular con más de 75 años de experiencia. Sus lentes Air Optix® y FreshLook® son reconocidos por su comodidad superior y tecnología SmartShield® que protege la superficie del lente.',
    tecnologia: ['Tecnología SmartShield® contra depósitos', 'HydraGlyde® Moisture Matrix para hidratación duradera', 'Material Lotrafilcon B de alta permeabilidad', 'Diseño para uso extendido hasta 6 noches'],
    indicaciones: ['Miopía e hipermetropía mensuales', 'Lentes de color cosméticos', 'Ojos secos o sensibles', 'Uso mensual y uso extendido'],
    color: 'bg-teal-600',
    faqs: [
      { q: '¿Air Optix se puede dormir con ellos puestos?', a: 'Air Optix Night & Day está aprobado para uso extendido hasta 30 días. El Air Optix Plus es para uso diario.' },
      { q: '¿FreshLook necesita graduación?', a: 'Sí, los FreshLook Colorblends están disponibles con y sin graduación (plano).' },
      { q: '¿Cuánto duran los Air Optix?', a: 'Son de reemplazo mensual — se cambian cada 30 días.' },
    ],
  },
  'bausch-lomb': {
    nombre: 'BAUSCH+LOMB®',
    descripcion: 'Bausch+Lomb tiene más de 165 años cuidando la salud visual. Sus lentes Ultra® y soluciones ReNu® son referencia mundial en comodidad y salud ocular, especialmente para personas con uso intensivo de pantallas digitales.',
    tecnologia: ['MoistureSeal® Technology para hidratación 16 horas', 'Material de silicona hidrogel de última generación', 'Perfil de lente optimizado para usuarios de pantalla', 'Sistema ProBalance para equilibrio lagrimal'],
    indicaciones: ['Miopía e hipermetropía mensuales', 'Usuarios intensivos de pantallas digitales', 'Personas con ojos secos', 'Uso mensual'],
    color: 'bg-red-600',
    faqs: [
      { q: '¿Cuánto dura el ReNu Advanced?', a: 'Una vez abierto, se recomienda usar en un máximo de 3 meses. Disponible en 60ml, 120ml y 355ml.' },
      { q: '¿Bausch+Lomb Ultra es buena para ojos secos?', a: 'Sí, la tecnología MoistureSeal mantiene la hidratación hasta 16 horas, ideal para ojos secos.' },
    ],
  },
  coopervision: {
    nombre: 'COOPERVISION®',
    descripcion: 'CooperVision es especialista en lentes de contacto con más de 40 años de experiencia. Sus marcas Biofinity® y clariti® son líderes en materiales de silicona hidrogel, ofreciendo excelente permeabilidad al oxígeno y comodidad todo el día.',
    tecnologia: ['Material Comfilcon A de silicona hidrogel', 'Aquaform® Technology para hidratación natural', 'Perfil de borde optimizado para inserción fácil', 'Lentes tóricos con estabilización precisa para astigmatismo'],
    indicaciones: ['Miopía e hipermetropía', 'Astigmatismo de alta graduación (Biofinity XR)', 'Uso mensual', 'Lentes diarios clariti® 1 day'],
    color: 'bg-indigo-600',
    faqs: [
      { q: '¿Qué diferencia hay entre Biofinity y Biofinity XR?', a: 'El XR cubre graduaciones extremas que el Biofinity estándar no alcanza, hasta -20.00 y +20.00.' },
      { q: '¿clariti 1 day se puede reusar?', a: 'No — son de uso diario desechable. Se usan una vez y se descartan.' },
    ],
  },
}

// Normalizar slug de marca
function normalizarMarca(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
}

function encontrarMarca(slug: string) {
  // Buscar directamente o por similitud
  if (MARCA_INFO[slug]) return { key: slug, info: MARCA_INFO[slug] }
  const normalized = normalizarMarca(slug)
  for (const [key, info] of Object.entries(MARCA_INFO)) {
    if (normalizarMarca(key) === normalized || normalizarMarca(info.nombre) === normalized) {
      return { key, info }
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: { marca: string } }) {
  const found = encontrarMarca(params.marca)
  if (!found) return { title: 'Marca no encontrada | ContactGo' }
  return {
    title: `Lentes de Contacto ${found.info.nombre} | ContactGo República Dominicana`,
    description: `Compra lentes de contacto ${found.info.nombre} originales en ContactGo. Envío rápido en toda República Dominicana. ${found.info.descripcion.slice(0, 100)}`,
  }
}

export default async function MarcaPage({ params }: { params: { marca: string } }) {
  const found = encontrarMarca(params.marca)
  if (!found) notFound()
  const { info } = found

  const sb = createServerSupabaseClient()
  // Buscar productos de esta marca
  const marcaDB = info.nombre.replace('®', '').replace('+', '+').trim()
  const { data: productos } = await sb
    .from('products')
    .select('*')
    .eq('activo', true)
    .ilike('marca', `%${marcaDB.split(' ')[0]}%`)
    .order('tipo')

  const TIPO_LABELS: Record<string, string> = {
    esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
    color: 'Color', solucion: 'Solución', gota: 'Gotas',
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 pb-24">

        {/* Hero marca */}
        <div className="mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold mb-4 ${info.color}`}>
            {info.nombre}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Lentes de Contacto {info.nombre}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">{info.descripcion}</p>
        </div>

        {/* Productos */}
        {productos && productos.length > 0 && (
          <div className="mb-12">
            <h2 className="font-bold text-xl text-gray-900 mb-5">
              Productos {info.nombre} disponibles
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productos.map(p => (
                <Link key={p.id} href={`/producto/${(p as any).slug || p.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-primary-200 transition-all group">
                  {p.imagen_url ? (
                    <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                      <Image src={p.imagen_url} alt={p.nombre} width={120} height={120} className="object-contain p-2" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-gray-200" />
                    </div>
                  )}
                  {p.tipo && (
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {TIPO_LABELS[p.tipo] ?? p.tipo}
                    </span>
                  )}
                  <p className="font-semibold text-gray-900 text-sm mt-1 leading-tight group-hover:text-primary-600 transition-colors">{p.nombre}</p>
                  <p className="font-black text-primary-600 mt-1">RD${Number(p.precio).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Tecnología */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">🔬 Tecnología</h2>
            <ul className="space-y-2">
              {info.tecnologia.map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-primary-500 mt-0.5 shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Indicaciones */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">👁 Indicaciones</h2>
            <ul className="space-y-2">
              {info.indicaciones.map(i => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-5">❓ Preguntas frecuentes</h2>
          <div className="space-y-4">
            {info.faqs.map(faq => (
              <div key={faq.q} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900 mb-1">{faq.q}</p>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advertencia médica */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <p className="text-sm text-amber-800 font-medium">
            ⚕️ Los lentes de contacto son dispositivos médicos. Consulta siempre con un profesional de la salud visual antes de usar lentes de contacto por primera vez.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href={`/catalogo?marca=${info.nombre.replace('®','').trim()}`}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold">
            Ver todos los productos {info.nombre}
          </Link>
        </div>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
