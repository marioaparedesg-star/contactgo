import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Lentes de contacto para astigmatismo en RD — ContactGo',
  description: 'Todo lo que necesitas saber sobre lentes tóricos para astigmatismo en República Dominicana. Marcas, precios y cómo elegir el correcto.',
  keywords: 'lentes astigmatismo RD, lentes tóricos dominicana, astigmatismo lentes contacto',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Astigmatismo</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes de contacto para astigmatismo en República Dominicana</h1>
        <p className="text-gray-400 text-sm mb-8">6 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>El astigmatismo es una de las condiciones visuales más comunes en República Dominicana, afectando aproximadamente al 30% de la población. La buena noticia es que los lentes de contacto tóricos lo corrigen perfectamente, y hoy están disponibles en múltiples marcas y parámetros para encontrar el ajuste exacto que necesitas.</p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 text-lg mb-2">¿Qué es el astigmatismo?</h2>
            <p className="text-sm">El astigmatismo ocurre cuando la córnea tiene forma ovalada en lugar de esférica, causando visión borrosa tanto de cerca como de lejos. En tu receta lo verás como los valores <strong>CYL (cilindro)</strong> y <strong>AXIS (eje)</strong>. Si tienes estos valores, necesitas lentes tóricos.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Las mejores marcas de lentes tóricos disponibles en RD</h2>
            {[
              { marca: 'ACUVUE® OASYS® for Astigmatism', tipo: 'Quincenal', material: 'Senofilcon A (Silicona Hidrogel)', ventaja: 'Tecnología BLINK STABILIZED® — se estabiliza en 2-3 parpadeos. La opción más vendida para astigmatismo en RD.', href: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', precio: 'RD$5,940' },
              { marca: '1-DAY ACUVUE® MOIST® for Astigmatism', tipo: 'Diario', material: 'Etafilcon A', ventaja: 'Ideal si prefieres lentes desechables diarios. Sin mantenimiento, máxima higiene.', href: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', precio: 'RD$5,940' },
              { marca: 'Biofinity® Toric', tipo: 'Mensual', material: 'Comfilcon A (Silicona Hidrogel)', ventaja: 'Tecnología Aquaform — alta hidratación natural. La más económica por uso diario.', href: '/producto/biofinity-toric-lentes-astigmatismo-coopervision-dominicana', precio: 'RD$5,520' },
              { marca: 'Avaira Vitality® Toric', tipo: 'Mensual', material: 'Fanfilcon A', ventaja: 'Buena alternativa económica con alto contenido de agua (48%).', href: '/producto/avaira-vitality-toric-lentes-astigmatismo-dominicana', precio: 'RD$4,680' },
            ].map(m => (
              <div key={m.marca} className="bg-white border border-gray-100 rounded-2xl p-5 mb-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900">{m.marca}</h3>
                  <span className="text-xs bg-primary-50 text-primary-700 font-bold px-2 py-1 rounded-lg shrink-0">{m.precio}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Reemplazo: {m.tipo} · {m.material}</p>
                <p className="text-sm text-gray-700 mb-3">{m.ventaja}</p>
                <Link href={m.href} className="text-sm text-primary-600 font-semibold hover:text-primary-700">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuánto tiempo tardan en llegar los lentes tóricos?</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm text-amber-800">⏱️ <strong>Importante:</strong> Los lentes tóricos se fabrican a medida según tu graduación específica (SPH, CYL y AXIS). Por eso el tiempo de entrega es de <strong>20-30 días</strong>, a diferencia de los esféricos que enviamos en 24-48 horas desde nuestro inventario. Vale la pena la espera — obtendrás el lente exacto para tu graduación.</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Lo que necesitas de tu receta</h2>
            <div className="bg-gray-50 rounded-2xl p-5 font-mono text-sm space-y-1">
              <p><strong>OD (ojo derecho) / OS (ojo izquierdo)</strong></p>
              <p>SPH: -2.50 ← graduación esférica</p>
              <p>CYL: -1.25 ← cilindro (astigmatismo)</p>
              <p>AXIS: 180 ← eje (dirección del astigmatismo)</p>
            </div>
            <p className="text-sm mt-3">Si tu CYL es mayor a -2.75, es posible que necesites los <Link href="/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana" className="text-primary-600 font-semibold">Biofinity XR Toric</Link> para astigmatismo de alta graduación.</p>
          </div>

          <div className="bg-primary-600 rounded-2xl p-6 text-white text-center">
            <h3 className="font-bold text-xl mb-2">¿Tienes astigmatismo? Encuentra tu lente exacto</h3>
            <p className="text-white/80 text-sm mb-4">Ingresa tu receta y te mostramos el lente tórico correcto para ti.</p>
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-2xl inline-block hover:bg-gray-50 transition-all">
              Buscar con mi receta →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
