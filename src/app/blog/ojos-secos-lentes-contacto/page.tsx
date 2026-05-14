import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Ojos secos y lentes de contacto: soluciones reales — ContactGo',
  description: 'Tienes ojos secos y usas lentes de contacto? Descubre qué productos y marcas funcionan mejor para mantener tus ojos hidratados en RD.',
  keywords: 'ojos secos lentes contacto RD, sequedad ocular, gotas lubricantes dominicana',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Salud ocular</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Ojos secos y lentes de contacto: guía completa</h1>
        <p className="text-gray-400 text-sm mb-8">5 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>La sequedad ocular es la queja más común entre usuarios de lentes de contacto en República Dominicana, especialmente en oficinas con aire acondicionado o al pasar horas frente a pantallas. La buena noticia: hay soluciones concretas para cada nivel de sequedad.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Por qué se secan los ojos con lentes?</h2>
            <p>Los lentes de contacto absorben parte de la película lagrimal que lubrica el ojo. Además, el parpadeo se reduce un 50% al trabajar frente a pantallas, y el aire acondicionado evapora la humedad. Resultado: ojos rojos, irritados y sensación de arenilla.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Lentes diseñados para ojos secos</h2>
            {[
              { nombre: 'ACUVUE® OASYS® with HYDRACLEAR®', detalle: 'Tecnología HYDRACLEAR PLUS — la más avanzada de J&J. Retiene la humedad incluso después de 10+ horas de uso.', href: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana' },
              { nombre: 'Bausch+Lomb ULTRA®', detalle: 'Tecnología MoistureSeal — mantiene el 95% de la humedad durante 16 horas. Ideal para trabajadores de oficina.', href: '/producto/bausch-lomb-ultra-lentes-contacto-mensuales-dominicana' },
              { nombre: 'AIR OPTIX® plus HydraGlyde®', detalle: 'Capa HydraGlyde que forma una película de agua en la superficie del lente. Excelente para ambientes secos.', href: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana' },
            ].map(p => (
              <div key={p.nombre} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                <h3 className="font-bold text-gray-900 mb-1">{p.nombre}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.detalle}</p>
                <Link href={p.href} className="text-sm text-primary-600 font-semibold">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Gotas para usar con lentes de contacto</h2>
            <p className="mb-3 text-sm">No todas las gotas son compatibles con lentes de contacto. Asegúrate de usar gotas específicamente formuladas para uso con lentes:</p>
            {[
              { nombre: 'Systane Ultra', desc: 'Formulada para uso con lentes blandos. Alivia la sequedad rápidamente.', href: '/producto/systane-ultra-gotas-ojos-secos-alcon-dominicana' },
              { nombre: 'Prolub Ofteno', desc: 'Gotas lubricantes compatibles con lentes de contacto. Muy popular en RD.', href: '/producto/prolub-ofteno-gotas-lubricantes-oculares-dominicana' },
              { nombre: 'Refresh Optive Advanced', desc: 'Triple acción: hidrata, lubrica y protege. Para sequedad moderada a severa.', href: '/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana' },
            ].map(g => (
              <div key={g.nombre} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-2">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{g.nombre}</p>
                  <p className="text-xs text-gray-600 mb-1">{g.desc}</p>
                  <Link href={g.href} className="text-xs text-primary-600 font-semibold">Ver →</Link>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5 hábitos para reducir la sequedad</h2>
            <ol className="space-y-2 text-sm list-none">
              {[
                'Parpadea conscientemente cada 20 minutos al trabajar frente a pantalla',
                'Aplica gotas lubricantes antes de ponerte los lentes, no solo cuando sientas molestia',
                'Mantén humidificadores en tu oficina o habitación con AC',
                'No uses lentes más horas de las recomendadas — respeta el horario de tu tipo de lente',
                'Descansa de los lentes al menos 1-2 días por semana si usas mensuales o quincenales',
              ].map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-gray-700">{h}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿Cuándo ver a un oftalmólogo?</p>
            <p className="text-sm text-gray-600">Si la sequedad persiste incluso con gotas y cambiando de marca de lentes, puede ser síndrome de ojo seco clínico que requiere tratamiento médico. No lo ignores — puede afectar la córnea.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
