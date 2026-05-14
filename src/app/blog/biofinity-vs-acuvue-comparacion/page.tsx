import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Biofinity vs ACUVUE: ¿Cuál es mejor en RD? — ContactGo',
  description: 'Comparamos Biofinity de CooperVision vs ACUVUE Oasys de J&J. Precio, comodidad, hidratación y disponibilidad en República Dominicana.',
  keywords: 'biofinity vs acuvue RD, mejor lente contacto dominicana, comparar lentes contacto',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Comparaciones</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Biofinity vs ACUVUE Oasys: ¿Cuál es mejor para ti?</h1>
        <p className="text-gray-400 text-sm mb-8">7 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Biofinity de CooperVision y ACUVUE Oasys de Johnson & Johnson son las dos marcas de lentes de contacto más vendidas en República Dominicana. Ambas son de silicona hidrogel premium, pero tienen diferencias importantes que pueden hacer una de ellas mejor para ti específicamente.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-bold text-gray-900 border border-gray-100">Característica</th>
                  <th className="p-3 text-center font-bold text-blue-700 border border-gray-100">Biofinity®</th>
                  <th className="p-3 text-center font-bold text-red-700 border border-gray-100">ACUVUE® Oasys®</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Fabricante', 'CooperVision', 'Johnson & Johnson'],
                  ['Material', 'Comfilcon A', 'Senofilcon A'],
                  ['Contenido de agua', '48%', '38%'],
                  ['Dk/t (oxígeno)', '160', '147'],
                  ['Reemplazo', 'Mensual', 'Quincenal'],
                  ['Precio en RD', 'RD$4,560', 'RD$3,720'],
                  ['Precio por día de uso', '~RD$152', '~RD$266'],
                  ['Disponible en tórico', '✅ Sí', '✅ Sí'],
                  ['Disponible en multifocal', '✅ Sí', '✅ Sí'],
                  ['Tecnología hidratación', 'Aquaform®', 'HYDRACLEAR® Plus'],
                ].map(([cat, bio, acu], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-medium text-gray-700 border border-gray-100">{cat}</td>
                    <td className="p-3 text-center text-blue-700 border border-gray-100">{bio}</td>
                    <td className="p-3 text-center text-red-700 border border-gray-100">{acu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">💙 Biofinity — para quién es mejor</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Si quieres el menor costo por día de uso (~RD$152 vs ~RD$266)',
                'Si prefieres no tener que comprar lentes tan frecuentemente (mensual)',
                'Si tienes ojos muy secos — el 48% de agua es mayor',
                'Si necesitas lentes de alta graduación (XR llega hasta ±20.00)',
                'Primera opción en CooperVision disponible en RD',
              ].map((p, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500">✓</span>{p}</li>)}
            </ul>
            <Link href="/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana"
              className="mt-3 inline-block bg-blue-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-blue-700 transition-all">
              Ver Biofinity →
            </Link>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">❤️ ACUVUE Oasys — para quién es mejor</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Si pasas 8+ horas frente a pantallas — HYDRACLEAR Plus es superior en comodidad digital',
                'Si prefieres renovar lentes cada 2 semanas (más higiénico)',
                'Si eres sensible a cambios de temperatura (Senofilcon A es más estable)',
                'La marca más recomendada por optometristas a nivel mundial',
                'Mayor disponibilidad de parámetros en el mercado dominicano',
              ].map((p, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500">✓</span>{p}</li>)}
            </ul>
            <Link href="/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana"
              className="mt-3 inline-block bg-red-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm hover:bg-red-700 transition-all">
              Ver ACUVUE Oasys →
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-2">🏆 Veredicto final</h2>
            <p className="text-sm"><strong>Si el precio es tu prioridad:</strong> Biofinity gana — RD$152 por día vs RD$266.</p>
            <p className="text-sm mt-2"><strong>Si la comodidad es tu prioridad:</strong> ACUVUE Oasys gana — especialmente para trabajo digital intenso.</p>
            <p className="text-sm mt-2"><strong>Si no estás seguro:</strong> Pide una muestra de ambas con tu optometrista y comprueba cuál te sienta mejor. Ambas son excelentes opciones — la diferencia real está en cómo responde <em>tu ojo</em> específicamente.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
