import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Lentes multifocales para presbicia en RD — ContactGo',
  description: 'Guía completa sobre lentes de contacto multifocales para presbicia en República Dominicana. Marcas disponibles, adaptación y precios.',
  keywords: 'lentes multifocales RD, presbicia lentes contacto dominicana, vista cansada lentes',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Presbicia</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes multifocales para presbicia: la guía definitiva</h1>
        <p className="text-gray-400 text-sm mb-8">6 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Después de los 40-45 años, casi todos necesitamos ayuda para ver de cerca. La presbicia (también llamada "vista cansada") afecta a millones de dominicanos. La buena noticia: los lentes de contacto multifocales te permiten ver bien a todas las distancias sin depender de gafas de lectura.</p>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h2 className="font-bold text-orange-900 mb-2">¿Qué es la presbicia?</h2>
            <p className="text-sm text-orange-800">Es la pérdida natural de flexibilidad del cristalino que ocurre con la edad. Se manifiesta como dificultad para enfocar objetos cercanos — el menú en el restaurante, el teléfono, los mensajes de WhatsApp. En tu receta aparece como el valor <strong>ADD (adición)</strong>.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Lentes multifocales disponibles en ContactGo</h2>
            {[
              { nombre: 'ACUVUE® OASYS® Multifocal', reemplazo: 'Quincenal', precio: 'RD$7,500', add: 'Low / Mid / High', desc: 'Diseño PUPIL OPTIMIZED — se adapta automáticamente al tamaño de tu pupila. Excelente para trabajo con pantallas.', href: '/producto/acuvue-oasys-presbyopia-lentes-multifocales-presbicia-dominicana' },
              { nombre: 'AIR OPTIX® plus HydraGlyde® Multifocal', reemplazo: 'Mensual', precio: 'RD$6,960', add: 'LOW / MID / HIGH', desc: 'De Alcon. Silicona hidrogel con capa HydraGlyde. Buena opción mensual con alta transmisión de oxígeno.', href: '/producto/air-optix-hydraglyde-multifocal-lentes-presbicia-dominicana' },
              { nombre: 'Biofinity® Multifocal', reemplazo: 'Mensual', precio: 'RD$9,000', add: '+1.00 a +2.50', desc: 'Diseño Balanced Progressive — zonas suaves de transición. Adaptación muy natural, especialmente para presbicia inicial.', href: '/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana' },
              { nombre: 'Proclear® Multifocal XR', reemplazo: 'Mensual', precio: 'RD$16,800', add: '+1.00 a +4.00', desc: 'Para presbicia avanzada con ADD alto. Disponible hasta +4.00 de adición — la mayor disponibilidad del mercado.', href: '/producto/proclear-multifocal-xr-lentes-presbicia-alta-graduacion-dominicana' },
              { nombre: 'clariti® 1 day multifocal', reemplazo: 'Diario', precio: 'RD$5,760', add: 'LOW / MED / HIGH', desc: 'El único multifocal diario disponible en RD. Sin mantenimiento, máxima comodidad para presbicia leve a moderada.', href: '/producto/clariti-1-day-multifocal-lentes-presbicia-diarios-dominicana' },
            ].map(p => (
              <div key={p.nombre} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{p.nombre}</h3>
                  <span className="text-primary-600 font-black shrink-0 text-sm">{p.precio}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{p.reemplazo} · ADD disponible: {p.add}</p>
                <p className="text-xs text-gray-700 mb-2">{p.desc}</p>
                <Link href={p.href} className="text-xs text-primary-600 font-semibold">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuánto tiempo tarda la adaptación?</h2>
            <p className="text-sm mb-3">Los lentes multifocales requieren una adaptación neurológica — tu cerebro aprende a usar las diferentes zonas del lente de forma automática. El proceso típico:</p>
            <div className="space-y-2">
              {[
                { semana: 'Semana 1', desc: 'Puede haber ligero halo o sensación de adaptación. Normal.' },
                { semana: 'Semana 2', desc: 'La mayoría nota mejoría significativa. Visión más natural.' },
                { semana: 'Semana 3-4', desc: 'Adaptación completa para la mayoría de usuarios.' },
              ].map(s => (
                <div key={s.semana} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-lg shrink-0">{s.semana}</span>
                  <p className="text-sm text-gray-700">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-600 rounded-2xl p-5 text-white text-center">
            <p className="font-bold mb-1">¿Tienes presbicia? Encuentra tu lente</p>
            <p className="text-sm text-white/80 mb-3">Ingresa tu ADD y te mostramos las opciones exactas disponibles en RD.</p>
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-5 py-2.5 rounded-2xl inline-block text-sm hover:bg-gray-50 transition-all">
              Buscar multifocales →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
