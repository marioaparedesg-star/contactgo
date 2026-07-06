'use client'
import { useState } from 'react'
import { X, HelpCircle } from 'lucide-react'

/**
 * Guía visual para que el cliente identifique Esfera, Cilindro y Eje
 * en su receta óptica. Se muestra como modal desplegable en el PDP tórico.
 * No depende de datos externos, es 100% estático.
 */
export default function RecetaGuiaTorico() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition-colors"
        aria-label="Ver guía para leer tu receta tórica"
      >
        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
        ¿Cómo leer mi receta?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Guía para leer tu receta tórica"
        >
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
              <p className="font-bold text-white text-sm">¿Cómo leer tu receta tórica?</p>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Simulación visual de una receta */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Ejemplo de receta óptica</p>
                </div>
                <div className="p-3 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-gray-400 text-[10px] uppercase">
                        <th className="text-left py-1 pr-2 font-semibold">Ojo</th>
                        <th className="py-1 px-2 font-semibold text-center">
                          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Esfera</span>
                        </th>
                        <th className="py-1 px-2 font-semibold text-center">
                          <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">Cilindro</span>
                        </th>
                        <th className="py-1 px-2 font-semibold text-center">
                          <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Eje</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 pr-2 font-bold text-gray-700">OD</td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-blue-50 border border-blue-200 text-blue-800 font-black px-2 py-1 rounded-lg inline-block">-3.25</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-purple-50 border border-purple-200 text-purple-800 font-black px-2 py-1 rounded-lg inline-block">-1.25</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-orange-50 border border-orange-200 text-orange-800 font-black px-2 py-1 rounded-lg inline-block">180</span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 pr-2 font-bold text-gray-700">OI</td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-blue-50 border border-blue-200 text-blue-800 font-black px-2 py-1 rounded-lg inline-block">-2.75</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-purple-50 border border-purple-200 text-purple-800 font-black px-2 py-1 rounded-lg inline-block">-0.75</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="bg-orange-50 border border-orange-200 text-orange-800 font-black px-2 py-1 rounded-lg inline-block">90</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Leyenda de cada campo */}
              <div className="space-y-2.5">
                {[
                  {
                    color: 'bg-blue-500',
                    nombre: 'Esfera (SPH)',
                    siglas: 'Esf. / SPH / Sph / S',
                    desc: 'Tu graduación principal. Número negativo = miopía. Positivo = hipermetropía.',
                    ejemplo: 'Ej: -3.25 o +1.50',
                  },
                  {
                    color: 'bg-purple-500',
                    nombre: 'Cilindro (CYL)',
                    siglas: 'Cil. / CYL / C',
                    desc: 'Corrección para el astigmatismo. Siempre es un número negativo.',
                    ejemplo: 'Ej: -0.75 o -1.25',
                  },
                  {
                    color: 'bg-orange-500',
                    nombre: 'Eje (AXIS)',
                    siglas: 'Eje / AXIS / Ax',
                    desc: 'Orientación del astigmatismo. Número entre 1 y 180.',
                    ejemplo: 'Ej: 90 o 180',
                  },
                ].map(f => (
                  <div key={f.nombre} className="flex items-start gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${f.color}`} />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{f.nombre}</p>
                      <p className="text-[10px] text-gray-500">{f.siglas}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{f.desc}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{f.ejemplo}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* OD / OI */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-800 mb-1">OD y OI — ¿Qué significa?</p>
                <div className="flex gap-3 text-[11px] text-amber-700">
                  <span><strong>OD</strong> = Ojo Derecho (Oculus Dexter)</span>
                  <span><strong>OI</strong> = Ojo Izquierdo (Oculus Sinister)</span>
                </div>
              </div>

              {/* CTA WhatsApp si aún no entiende */}
              <a
                href="https://wa.me/18096942268?text=Hola%2C+tengo+una+duda+leyendo+mi+receta+t%C3%B3rica.+%C2%BFPueden+ayudarme%3F"
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ¿Tienes dudas? Te ayudamos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
