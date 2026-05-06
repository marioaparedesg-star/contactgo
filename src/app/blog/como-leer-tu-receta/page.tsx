import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Cómo leer tu receta de lentes de contacto — ContactGo',
  description: 'Aprende a interpretar SPH, CYL, EJE y ADD de tu receta óptica para comprar los lentes correctos en República Dominicana.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Guías</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Cómo leer tu receta de lentes de contacto</h1>
        <p className="text-gray-400 text-sm mb-8">3 min lectura · ContactGo</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p>Si alguna vez has mirado tu receta óptica y no entendiste nada, no te preocupes — es normal. En esta guía te explicamos cada valor de forma simple para que puedas comprar tus lentes con confianza.</p>

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
            <p className="font-bold text-gray-900 mb-3">Los valores principales de una receta:</p>
            <div className="space-y-3">
              {[
                ['SPH (Esfera)', 'Indica si eres miope (-) o hipermétrope (+). Es el valor principal de graduación.'],
                ['CYL (Cilindro)', 'Indica si tienes astigmatismo. Siempre es un valor negativo (-).'],
                ['EJE (Axis)', 'Solo aparece si tienes astigmatismo. Número entre 1 y 180 que indica la orientación del astigmatismo.'],
                ['ADD (Adición)', 'Solo para lentes multifocales. Indica la corrección extra para ver de cerca (presbicia).'],
                ['OD / RE', 'Ojo derecho (Oculus Dexter / Right Eye).'],
                ['OI / LE', 'Ojo izquierdo (Oculus Sinister / Left Eye).'],
              ].map(([term, def]) => (
                <div key={term} className="flex gap-3">
                  <span className="font-bold text-primary-700 text-sm w-24 shrink-0">{term}</span>
                  <span className="text-sm text-gray-600">{def}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Ejemplo de receta real</h2>
          <div className="bg-gray-50 rounded-2xl p-5 font-mono text-sm">
            <div className="grid grid-cols-5 gap-2 text-center mb-2 font-bold text-gray-500 text-xs uppercase">
              <span></span><span>SPH</span><span>CYL</span><span>EJE</span><span>ADD</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              <span className="font-bold text-gray-900">OD</span>
              <span>-2.50</span><span>-0.75</span><span>180</span><span>—</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center mt-1">
              <span className="font-bold text-gray-900">OI</span>
              <span>-2.25</span><span>-0.50</span><span>170</span><span>—</span>
            </div>
          </div>
          <p>Esta receta indica: miopía con astigmatismo en ambos ojos. El lente correcto sería un <strong>tórico</strong> como el Acuvue Oasys for Astigmatism o Air Optix for Astigmatism.</p>

          <h2 className="text-xl font-bold text-gray-900">¿Qué lente necesito según mi receta?</h2>
          <div className="space-y-3">
            {[
              ['Solo SPH (sin CYL)', 'Lente esférico — Acuvue Oasys, 1-Day Acuvue Moist, Air Optix'],
              ['SPH + CYL + EJE', 'Lente tórico — Acuvue Oasys for Astigmatism, Air Optix for Astigmatism'],
              ['Con ADD', 'Lente multifocal — Acuvue Oasys for Multifocal'],
              ['Sin graduación', 'Lente de color — FreshLook, Air Optix Colors'],
            ].map(([condicion, lente]) => (
              <div key={condicion} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{condicion}</p>
                  <p className="text-sm text-gray-500">{lente}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-gray-900 mb-2">¿Listo para comprar?</p>
            <p className="text-sm text-gray-600 mb-4">Usa nuestra herramienta de receta para encontrar los lentes exactos según tus valores.</p>
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
