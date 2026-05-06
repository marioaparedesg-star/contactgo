import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Cómo poner y quitar lentes de contacto — ContactGo',
  description: 'Guía paso a paso para principiantes. Aprende a colocarte y quitarte lentes de contacto de forma segura en República Dominicana.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Tutoriales</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Cómo poner y quitar lentes de contacto por primera vez</h1>
        <p className="text-gray-400 text-sm mb-8">4 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Ponerse lentes de contacto por primera vez puede parecer intimidante, pero con práctica se vuelve tan natural como cepillarse los dientes. Sigue estos pasos y lo lograrás.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">⚠️ Antes de empezar</p>
            <p>Lávate las manos con jabón y agua. Sécalas con una toalla limpia que no deje pelusa. Nunca toques los lentes con las manos sucias.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Cómo ponerse los lentes</h2>
            {[
              ['Coloca el lente en la yema del dedo índice', 'Asegúrate que esté en forma de copa (no al revés). Un lente al revés tendrá los bordes hacia afuera como un plato.'],
              ['Usa el dedo medio para bajar el párpado inferior', 'Con la misma mano, jala suavemente el párpado inferior hacia abajo.'],
              ['Usa el otro dedo índice para subir el párpado superior', 'Mantén el ojo bien abierto mirando hacia arriba.'],
              ['Coloca el lente sobre el iris', 'Posa el lente suavemente sobre el centro del ojo mirando hacia arriba o hacia un lado.'],
              ['Suelta los párpados y parpadea', 'El lente debe asentarse solo. Si sientes incomodidad, cierra el ojo y masajea suavemente.'],
            ].map(([titulo, desc], i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{titulo}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Cómo quitarse los lentes</h2>
            {[
              ['Lávate las manos', 'Siempre antes de tocar tus ojos o lentes.'],
              ['Mira hacia arriba y jala el párpado inferior', 'Con el dedo medio de la mano dominante.'],
              ['Toca el borde inferior del lente', 'Con el dedo índice, deslízalo hacia abajo de la córnea.'],
              ['Pellizca el lente suavemente', 'Con el pulgar e índice, retira el lente con un movimiento suave.'],
            ].map(([titulo, desc], i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i+1}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{titulo}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿Necesitas tu primera caja?</p>
            <Link href="/catalogo" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
              Ver catálogo →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
