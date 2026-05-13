'use client'
import { useState } from 'react'
import { AlertTriangle, CheckCircle, Shield, Eye, X } from 'lucide-react'

// Versión del disclaimer — incrementar cuando cambie el texto
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
  const [checks, setChecks] = useState({
    receta:      false,
    responsabilidad: false,
    uso_seguro:  false,
    optometrista: false,
  })
  const [showCompleto, setShowCompleto] = useState(false)

  const allChecked = Object.values(checks).every(Boolean)

  const toggle = (k: keyof typeof checks) =>
    setChecks(prev => ({ ...prev, [k]: !prev[k] }))

  const handleAceptar = () => {
    if (!allChecked) return
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
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">Aviso médico y legal</p>
            <p className="text-xs text-gray-400">Debes leer y aceptar antes de continuar</p>
          </div>
          {onCancelar && (
            <button onClick={onCancelar} className="ml-auto p-1.5 hover:bg-gray-100 rounded-xl">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Aviso principal */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-bold text-sm">Los lentes de contacto son dispositivos médicos</p>
              <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                Su uso incorrecto puede causar infecciones, úlceras corneales y pérdida de visión. 
                Requieren prescripción de un profesional de la salud visual.
              </p>
            </div>
          </div>

          {/* Ver texto completo */}
          <button onClick={() => setShowCompleto(!showCompleto)}
            className="text-xs text-primary-600 font-semibold underline">
            {showCompleto ? 'Ocultar texto completo' : 'Ver texto completo del aviso legal'}
          </button>

          {showCompleto && (
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 leading-relaxed space-y-2 max-h-48 overflow-y-auto border border-gray-200">
              <p className="font-bold text-gray-800">AVISO MÉDICO Y LEGAL — VERSIÓN {DISCLAIMER_VERSION}</p>
              <p><strong>1. Dispositivos médicos.</strong> Los lentes de contacto son dispositivos médicos regulados. Su adquisición y uso requieren una prescripción vigente emitida por un optometrista u oftalmólogo licenciado.</p>
              <p><strong>2. Responsabilidad del usuario.</strong> ContactGo no es responsable de daños oculares, infecciones, irritaciones o cualquier complicación derivada del uso incorrecto de los lentes, incluyendo: uso más allá del período recomendado, no seguir las instrucciones de higiene, dormir con lentes no aptos, o comprar una graduación incorrecta.</p>
              <p><strong>3. Uso seguro obligatorio.</strong> El usuario declara conocer y comprometerse a seguir las instrucciones de uso seguro: lavarse las manos antes de manipular los lentes, usar solución limpiadora adecuada, no usar lentes en presencia de infección ocular, y reemplazar los lentes según el calendario indicado.</p>
              <p><strong>4. Validez de la receta.</strong> El usuario declara que posee una receta óptica vigente (no mayor a 12 meses) que indica la graduación exacta solicitada. ContactGo recomienda renovar la prescripción anualmente.</p>
              <p><strong>5. Consulta profesional.</strong> Ante cualquier síntoma de malestar ocular (enrojecimiento, dolor, visión borrosa, secreción), el usuario debe retirar inmediatamente los lentes y consultar a un profesional de salud visual.</p>
              <p><strong>6. Mayores de edad.</strong> Los lentes de contacto son para usuarios mayores de 12 años. Menores deben contar con supervisión de un adulto responsable y prescripción pediátrica específica.</p>
              <p className="text-gray-400 text-[10px] mt-2">ContactGo · contactgo.net · República Dominicana · v{DISCLAIMER_VERSION} · {new Date().getFullYear()}</p>
            </div>
          )}

          {/* Checkboxes obligatorios */}
          <div className="space-y-3">
            {[
              {
                key: 'receta' as const,
                icon: '📋',
                titulo: 'Tengo una receta óptica vigente',
                desc: 'Confirmo que poseo una prescripción de un optometrista u oftalmólogo con la graduación que estoy comprando, emitida en los últimos 12 meses.',
              },
              {
                key: 'responsabilidad' as const,
                icon: '⚖️',
                titulo: 'Acepto los términos de responsabilidad',
                desc: 'Entiendo que ContactGo no es responsable de complicaciones por uso incorrecto. Asumo la responsabilidad de usar los lentes según las indicaciones del fabricante y mi profesional de salud.',
              },
              {
                key: 'uso_seguro' as const,
                icon: '🛡️',
                titulo: 'Me comprometo a un uso seguro',
                desc: 'Me comprometo a: lavar mis manos antes de manipular los lentes, respetar el período de uso indicado, nunca dormir con lentes no aptos para uso nocturno, y usar solución limpiadora apropiada.',
              },
              {
                key: 'optometrista' as const,
                icon: '👁️',
                titulo: 'Entiendo la recomendación de consulta profesional',
                desc: 'Ante cualquier síntoma de irritación, enrojecimiento o malestar ocular, retiraré los lentes inmediatamente y consultaré a un profesional de la salud visual.',
              },
            ].map(item => (
              <label key={item.key}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  checks[item.key]
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                <div className="relative mt-0.5 shrink-0">
                  <input type="checkbox" checked={checks[item.key]}
                    onChange={() => toggle(item.key)}
                    className="sr-only" />
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                    checks[item.key] ? 'bg-green-500' : 'border-2 border-gray-300 bg-white'
                  }`}>
                    {checks[item.key] && <CheckCircle className="w-4 h-4 text-white fill-current" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{item.icon} {item.titulo}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Disclaimer de timestamp */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Al hacer clic en "Acepto y continúo", tu aceptación quedará registrada con fecha, hora y dispositivo.
            Esta aceptación tiene validez legal bajo los términos de uso de ContactGo.
          </p>
        </div>

        {/* Botones */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex gap-3 shrink-0">
          {onCancelar && (
            <button onClick={onCancelar}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
              Cancelar
            </button>
          )}
          <button onClick={handleAceptar} disabled={!allChecked}
            className={`flex-1 font-bold py-3.5 rounded-xl text-sm transition-all ${
              allChecked
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {allChecked ? '✅ Acepto y continúo' : `Acepta los ${Object.values(checks).filter(v=>!v).length} puntos restantes`}
          </button>
        </div>
      </div>
    </div>
  )
}
