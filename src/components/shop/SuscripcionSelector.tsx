'use client'
import { DESCUENTOS, FRECUENCIAS } from '@/lib/subscription-utils'

interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

const OPCIONES = [
  { val: null,         label: 'Una vez',     sublabel: 'Sin compromiso', pct: 0,    badge: null,         icon: '🛍️' },
  { val: '15_dias',    label: 'Quincenal',   sublabel: 'Cada 15 días',  pct: 0.05, badge: '5% OFF',     icon: '📦' },
  { val: 'mensual',    label: 'Mensual',     sublabel: 'Cada 30 días',  pct: 0.10, badge: '10% OFF',    icon: '⭐', popular: true },
  { val: 'trimestral', label: 'Trimestral',  sublabel: 'Cada 3 meses',  pct: 0.15, badge: '15% OFF',    icon: '💎' },
]

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  if (!isLente && !isSolucion && !isGota) return null

  const precioConDesc = (pct: number) => Math.round(precio * (1 - pct))
  const ahorroAnual   = Math.round(precio * 0.10 * 12)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700">Frecuencia de entrega</label>
        {isLente && (
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Ahorra hasta RD${ahorroAnual.toLocaleString()}/año
          </span>
        )}
      </div>

      {/* Cards visuales — Warby Parker style */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {OPCIONES.map(op => {
          const selected = value === op.val
          const precioFinal = precioConDesc(op.pct)
          return (
            <button
              key={String(op.val)}
              type="button"
              onClick={() => onChange(op.val, op.pct * precio)}
              className={`relative flex flex-col items-center justify-center text-center py-2.5 px-1 rounded-xl border-2 transition-all duration-150 min-h-[72px] ${
                selected
                  ? 'border-primary-500 bg-primary-50 shadow-sm shadow-primary-100'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Badge "Más popular" */}
              {op.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black bg-amber-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap leading-tight">
                  ★ Popular
                </span>
              )}
              {/* OFF badge */}
              {op.badge && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mb-1 ${
                  selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {op.badge}
                </span>
              )}
              <p className={`text-[11px] font-black leading-tight ${selected ? 'text-primary-700' : 'text-gray-800'}`}>
                {op.label}
              </p>
              <p className={`text-[9px] mt-0.5 ${selected ? 'text-primary-500' : 'text-gray-400'}`}>
                {op.sublabel}
              </p>
              <p className={`text-[10px] font-black mt-1 ${selected ? 'text-primary-700' : 'text-gray-600'}`}>
                RD${precioFinal.toLocaleString()}
              </p>
            </button>
          )
        })}
      </div>

      {value && (
        <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
          <span>✓</span>
          Envío automático · Aviso previo por WhatsApp · Cancela cuando quieras
        </p>
      )}
    </div>
  )
}
