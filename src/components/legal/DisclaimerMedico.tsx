'use client'
import { useState } from 'react'
import { Shield, ChevronDown, X } from 'lucide-react'

export const DISCLAIMER_VERSION = '1.0'

interface Props {
  onAceptar: (data: DisclaimerData) => void
  onCancelar?: () => void
  items?: any[]
  showModal?: boolean
}

export interface DisclaimerData {
  version: string
  accepted_at: string
  user_agent: string
  items_snapshot: any[]
}

export default function DisclaimerMedico({ onAceptar, onCancelar, items = [], showModal = true }: Props) {
  const [aceptado, setAceptado] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const handleAceptar = () => {
    if (!aceptado) return
    onAceptar({
      version: DISCLAIMER_VERSION,
      accepted_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      items_snapshot: items,
    })
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-black text-gray-900 text-sm">Aviso médico</p>
          {onCancelar && (
            <button onClick={onCancelar} className="ml-auto p-1.5 hover:bg-gray-100 rounded-xl">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Los lentes de contacto son <strong>dispositivos médicos</strong> que requieren prescripción óptica vigente. Su uso incorrecto puede causar infecciones o pérdida de visión. ContactGo no asume responsabilidad por uso inadecuado.
          </p>

          {/* Ver más */}
          <button onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
            {showMore ? 'Ver menos' : 'Ver aviso legal completo'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? 'rotate-180' : ''}`} />
          </button>

          {showMore && (
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 leading-relaxed space-y-2 border border-gray-100">
              <p>Al comprar confirmas que: (1) posees una receta óptica vigente ≤12 meses con la graduación exacta que solicitas, (2) usarás los lentes según las instrucciones del fabricante, (3) te comprometes a la higiene adecuada y a respetar el período de uso, (4) ante cualquier malestar ocular retirarás los lentes y consultarás a un profesional.</p>
              <p className="text-gray-400">ContactGo · v{DISCLAIMER_VERSION} · {new Date().getFullYear()}</p>
            </div>
          )}

          {/* Checkbox único */}
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
            aceptado ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
          }`}>
            <div className={`w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all ${
              aceptado ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'
            }`}>
              {aceptado && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input type="checkbox" checked={aceptado} onChange={e => setAceptado(e.target.checked)} className="sr-only" />
            <p className="text-sm text-gray-800 font-medium leading-snug">
              Entiendo y acepto las condiciones de uso de lentes de contacto
            </p>
          </label>
        </div>

        {/* Botones */}
        <div className="px-5 pb-5 flex gap-3">
          {onCancelar && (
            <button onClick={onCancelar}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
              Cancelar
            </button>
          )}
          <button onClick={handleAceptar} disabled={!aceptado}
            className={`flex-1 font-bold py-3.5 rounded-xl text-sm transition-all ${
              aceptado
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            Acepto y continúo
          </button>
        </div>
      </div>
    </div>
  )
}
