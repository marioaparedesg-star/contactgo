import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Receta Médica | ContactGo',
  description: 'Política de ContactGo sobre la receta médica para lentes de contacto graduados en cumplimiento con DIGEMAPS y la legislación dominicana.',
  robots: 'index, follow',
}

export default function PoliticaRecetaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              🏥 Marco Legal · DIGEMAPS · RD
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Política de Receta Médica
            </h1>
            <p className="text-gray-500 text-sm">Última actualización: junio 2025</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

            {/* Marco regulatorio */}
            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                📋 Marco regulatorio aplicable
              </h2>
              <p className="mb-3">
                Los lentes de contacto son dispositivos médicos regulados en la República Dominicana por la{' '}
                <strong>Dirección General de Medicamentos, Alimentos y Productos Sanitarios (DIGEMAPS)</strong>,
                organismo dependiente del Ministerio de Salud Pública.
              </p>
              <p>
                ContactGo opera en cumplimiento con la{' '}
                <strong>Ley 6-06 sobre Medicamentos</strong> y las normativas sanitarias vigentes que clasifican
                los lentes de contacto correctivos como productos sanitarios de clase II que requieren
                prescripción profesional.
              </p>
            </section>

            {/* Cuándo se requiere receta */}
            <section>
              <h2 className="font-bold text-gray-900 text-base mb-4">¿Cuándo se requiere receta médica?</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                  <span className="text-lg shrink-0">📌</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Lentes correctivos (graduados) — Receta obligatoria</p>
                    <p className="text-xs text-gray-600">
                      Esféricos, tóricos (astigmatismo) y multifocales. Incluye todos los lentes con valores de SPH, CYL, AXIS o ADD distintos de 0.00.
                      Se requiere prescripción emitida por un oftalmólogo u optometrista colegiado en RD.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                  <span className="text-lg shrink-0">✅</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Lentes de color sin graduación (plano 0.00) — Sin receta</p>
                    <p className="text-xs text-gray-600">
                      Los lentes puramente estéticos sin corrección visual (plano) no requieren prescripción médica para su adquisición.
                      Sin embargo, recomendamos consulta optométrica previa para asegurar la adaptación correcta.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Qué hacemos nosotros */}
            <section>
              <h2 className="font-bold text-gray-900 text-base mb-4">¿Qué hace ContactGo?</h2>
              <ul className="space-y-3">
                {[
                  { icon: '✅', text: 'Solicitamos confirmación de que el cliente posee una receta válida emitida por profesional de la salud visual antes de procesar pedidos de lentes correctivos.' },
                  { icon: '✅', text: 'Mostramos claramente los parámetros técnicos de cada producto para que el cliente pueda verificar que coinciden con su prescripción.' },
                  { icon: '✅', text: 'Ofrecemos orientación gratuita vía WhatsApp con nuestro equipo de soporte para interpretar recetas.' },
                  { icon: '✅', text: 'Los productos que comercializamos son 100% originales, distribuidos por los fabricantes autorizados (J&J Vision, Alcon, CooperVision, Bausch+Lomb).' },
                  { icon: '⚠️', text: 'ContactGo no emite diagnósticos visuales ni reemplaza la consulta con un profesional de la salud.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 text-base">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Responsabilidad del cliente */}
            <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 text-base mb-3">📢 Responsabilidad del cliente</h2>
              <p className="mb-3">
                Al realizar una compra de lentes correctivos en ContactGo, el cliente declara:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Poseer una prescripción médica vigente emitida por un profesional habilitado.</li>
                <li>Que los parámetros del lente seleccionado (SPH, CYL, AXIS, ADD) corresponden a su receta actual.</li>
                <li>Haber sido evaluado previamente por un oftalmólogo u optometrista para el uso de lentes de contacto.</li>
              </ol>
            </section>

            {/* Distribuidores */}
            <section>
              <h2 className="font-bold text-gray-900 text-base mb-4">🏭 Sobre nuestros productos y fabricantes</h2>
              <p className="mb-3">
                Todos los lentes que comercializamos son fabricados directamente por las marcas titulares
                o sus fabricantes:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { marca: 'ACUVUE®', fab: 'Johnson & Johnson Vision (USA)' },
                  { marca: 'AIR OPTIX® / Dailies', fab: 'Alcon Laboratories (USA)' },
                  { marca: 'Biofinity® / clariti®', fab: 'CooperVision (USA/UK)' },
                  { marca: 'Bausch+Lomb ULTRA®', fab: 'Bausch Health Companies (USA)' },
                ].map((p, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{p.marca}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.fab}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Los lentes tóricos y multifocales de fabricación especial son producidos bajo pedido
                directamente por el fabricante. Los tiempos de entrega adicionales
                (5-30 días) reflejan el proceso de fabricación a medida.
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 text-base mb-3">¿Tienes dudas sobre tu receta?</h2>
              <p className="mb-4">
                Nuestro equipo puede orientarte sobre la interpretación de tu receta y ayudarte a
                seleccionar los parámetros correctos.
              </p>
              <a
                href="https://wa.me/18294728328?text=Hola%2C+tengo+dudas+sobre+mi+receta+para+lentes+de+contacto"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.347.619 4.587 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar vía WhatsApp
              </a>
            </section>

          </div>

          {/* Breadcrumb bottom */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-gray-600">Política de Receta Médica</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
