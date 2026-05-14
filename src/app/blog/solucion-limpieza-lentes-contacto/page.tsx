import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Cómo elegir la mejor solución para lentes de contacto — ContactGo',
  description: 'Guía completa sobre soluciones de limpieza para lentes de contacto en RD. Opti-Free, ReNu, Prolub — cuál usar y cómo limpiar correctamente.',
  keywords: 'solucion lentes contacto RD, liquido lentes contacto dominicana, opti free RD, renu advanced',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Cuidado</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Cómo elegir la mejor solución para tus lentes de contacto</h1>
        <p className="text-gray-400 text-sm mb-8">4 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>La solución de limpieza es tan importante como los lentes mismos. Usar la solución incorrecta puede causar irritación, infección o dañar el material del lente. Aquí te explicamos todo lo que necesitas saber.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las soluciones disponibles en ContactGo</h2>
            {[
              { nombre: 'Opti-Free® PureMoist', marca: 'Alcon', precio: 'RD$900', desc: 'La más recomendada para lentes de silicona hidrogel (Biofinity, Air Optix, ACUVUE Oasys). Tecnología POLYQUAD + ALDOX sin mercurio.', ideal: 'Silicona hidrogel', href: '/producto/opti-free-puremoist-solucion-multipropósito-dominicana' },
              { nombre: 'ReNu Advanced', marca: 'Bausch+Lomb', precio: 'RD$850', desc: 'Fórmula HydraGlyde para alta hidratación. Compatible con todos los lentes blandos. Precio muy accesible.', ideal: 'Todos los lentes blandos', href: '/producto/renu-advanced-solucion-lentes-contacto-bausch-dominicana' },
              { nombre: 'Prolub Hyfresh', marca: 'Norsa', precio: 'RD$900', desc: 'La solución más popular en el mercado dominicano. Multipropósito — limpia, enjuaga, desinfecta y conserva. Precio competitivo.', ideal: 'Lentes blandos convencionales', href: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana' },
              { nombre: 'Dream Eye Solución', marca: 'Dream Eye', precio: 'RD$800', desc: 'Opción económica para uso diario. Funciona bien con lentes de hidrogel convencional.', ideal: 'Lentes blandos estándar', href: '/producto/dream-eye-solucion-lentes-contacto-dominicana' },
            ].map(s => (
              <div key={s.nombre} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{s.nombre}</h3>
                  <span className="text-primary-600 font-black shrink-0 text-sm">{s.precio}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{s.marca} · Ideal para: {s.ideal}</p>
                <p className="text-xs text-gray-700 mb-2">{s.desc}</p>
                <Link href={s.href} className="text-xs text-primary-600 font-semibold">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">El proceso correcto de limpieza</h2>
            <ol className="space-y-3">
              {[
                { paso: 'Lávate las manos', desc: 'Con jabón neutro y agua, sécalas con toalla de papel (no tela). Las bacterias de las manos son la principal causa de infecciones.' },
                { paso: 'Frota el lente', desc: 'Pon el lente en la palma, agrega unas gotas de solución y frota suavemente con el dedo por 20 segundos cada lado. Nunca saltes este paso aunque la solución diga "no requiere frotación".' },
                { paso: 'Enjuaga', desc: 'Enjuaga con abundante solución — nunca con agua del grifo, nunca con saliva.' },
                { paso: 'Almacena', desc: 'En estuche limpio con solución fresca. Cambia la solución cada día — nunca la reutilices. Limpia el estuche semanalmente y reemplázalo cada 3 meses.' },
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.paso}</p>
                    <p className="text-sm text-gray-600">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h3 className="font-bold text-red-900 mb-2">🚫 Lo que NUNCA debes hacer</h3>
            <ul className="text-sm text-red-800 space-y-1">
              {[
                'Nunca uses agua del grifo para enjuagar — puede causar acanthamoeba, una infección ocular grave',
                'Nunca mezcles soluciones de marcas diferentes en el mismo estuche',
                'Nunca uses solución vencida — revisa la fecha en el frasco',
                'Nunca uses solución salina (suero fisiológico) para almacenar lentes',
              ].map((r, i) => <li key={i}>✕ {r}</li>)}
            </ul>
          </div>

          <Link href="/catalogo?tipo=solucion"
            className="block bg-primary-600 text-white font-bold px-6 py-4 rounded-2xl text-center hover:bg-primary-700 transition-all">
            Ver todas las soluciones disponibles →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
