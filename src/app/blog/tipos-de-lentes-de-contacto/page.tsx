import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Tipos de lentes de contacto — ContactGo',
  description: 'Diferencias entre lentes esféricos, tóricos, multifocales y de color. Cómo elegir el correcto según tu diagnóstico en RD.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Educación</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Tipos de lentes de contacto: ¿cuál es el correcto para ti?</h1>
        <p className="text-gray-400 text-sm mb-8">5 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>No todos los lentes de contacto son iguales. Cada tipo está diseñado para corregir una condición visual específica. Aquí te explicamos las diferencias para que elijas el correcto.</p>

          {[
            {
              tipo: 'Lentes Esféricos',
              emoji: '⭕',
              para: 'Miopía e Hipermetropía',
              descripcion: 'Son los más comunes. Corrigen la visión borrosa a distancia (miopía) o de cerca (hipermetropía). Si tu receta solo tiene SPH, este es tu lente.',
              ejemplos: ['Acuvue Oasys', '1-Day Acuvue Moist', 'Air Optix Plus HydraGlyde', 'Biofinity'],
              href: '/catalogo?tipo=esferico',
            },
            {
              tipo: 'Lentes Tóricos',
              emoji: '🔵',
              para: 'Astigmatismo',
              descripcion: 'Diseñados específicamente para corregir el astigmatismo. Tienen un diseño especial que los mantiene estables en el ojo. Si tu receta tiene CYL y EJE, necesitas tóricos.',
              ejemplos: ['Acuvue Oasys for Astigmatism', '1-Day Acuvue Moist for Astigmatism', 'Air Optix for Astigmatism', 'Biofinity Toric'],
              href: '/catalogo?tipo=torico',
            },
            {
              tipo: 'Lentes Multifocales',
              emoji: '🎯',
              para: 'Presbicia (vista cansada)',
              descripcion: 'Para personas mayores de 40 años que necesitan corregir tanto la visión de lejos como la de cerca. Si tu receta tiene ADD, necesitas multifocales.',
              ejemplos: ['Acuvue Oasys for Multifocal'],
              href: '/catalogo?tipo=multifocal',
            },
            {
              tipo: 'Lentes de Color',
              emoji: '🌈',
              para: 'Cambio estético de color de ojos',
              descripcion: 'Disponibles con y sin graduación. Cambian o realzan el color natural de tus ojos. Perfectos si quieres un cambio de look.',
              ejemplos: ['FreshLook Colorblends', 'Air Optix Colors'],
              href: '/catalogo?tipo=color',
            },
          ].map(item => (
            <div key={item.tipo} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{item.tipo}</h2>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Para: {item.para}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.descripcion}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Marcas disponibles:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.ejemplos.map(e => (
                  <span key={e} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{e}</span>
                ))}
              </div>
              <Link href={item.href} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Ver {item.tipo.toLowerCase()} →
              </Link>
            </div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿No sabes cuál necesitas?</p>
            <p className="text-sm text-gray-600 mb-4">Ingresa tu receta y te mostramos los lentes correctos automáticamente.</p>
            <Link href="/receta" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              Buscar por mi receta →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
