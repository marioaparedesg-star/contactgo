'use client'
import { DESCUENTOS } from '@/lib/subscription-utils'

const OPCIONES = [
  { val: null,          label: 'Compra única',    badge: '',        desc: 'Sin compromiso',                   color: 'gray'   },
  { val: '15_dias',     label: 'Cada 15 días',    badge: '5% OFF',  desc: 'Ideal para lentes quincenales',    color: 'blue'   },
  { val: 'mensual',     label: 'Mensual',          badge: '10% OFF', desc: '✓ La más popular',                 color: 'primary'},
  { val: 'trimestral',  label: 'Cada 3 meses',     badge: '15% OFF', desc: 'Máximo ahorro',                    color: 'green'  },
]

interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  if (!isLente && !isSolucion && !isGota) return null

  const handleSelect = (val: string | null) => {
    const pct = val ? DESCUENTOS[val] : 0
    onChange(val, pct)
  }

  const precioConDesc = (val: string | null) => {
    if (!val) return precio
    return Math.round(precio * (1 - DESCUENTOS[val]))
  }

  // Calcular ahorro anual con suscripción mensual para mostrar como ancla
  const ahorroAnualMensual = Math.round(precio * DESCUENTOS['mensual'] * 12)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">
          Frecuencia de entrega
        </label>
        {isLente && (
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Ahorra hasta RD${ahorroAnualMensual.toLocaleString()}/año
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 [&>*]:min-w-0">
        {OPCIONES.map(o => {
          const active = value === o.val
          const pDesc  = precioConDesc(o.val)
          const isMensual = o.val === 'mensual'
          return (
            <button key={String(o.val)} onClick={() => handleSelect(o.val)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                active
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : isMensual && !value
                    ? 'border-primary-300 bg-primary-50/40 hover:border-primary-400'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              {/* Badge de descuento */}
              {o.badge && (
                <span className="absolute top-2 right-2 text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                  {o.badge}
                </span>
              )}
              {/* Label "Recomendado" solo en mensual cuando nada está seleccionado */}
              {isMensual && !value && (
                <span className="absolute -top-2 left-2 text-[9px] font-bold bg-primary-600 text-white px-1.5 py-0.5 rounded-full">
                  Recomendado
                </span>
              )}
              <p className={`text-xs font-bold truncate pr-6 ${active ? 'text-primary-700' : 'text-gray-700'}`}>
                {o.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{o.desc}</p>
              {o.val ? (
                <p className={`text-sm font-black mt-1 ${active ? 'text-primary-600' : 'text-gray-900'}`}>
                  RD${pDesc.toLocaleString()}
                </p>
              ) : (
                <p className="text-sm font-black mt-1 text-gray-900">
                  RD${precio.toLocaleString()}
                </p>
              )}
            </button>
          )
        })}
      </div>
      {value && (
        <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
          ✓ Recibirás un aviso por WhatsApp antes de cada envío. Cancela cuando quieras.
        </p>
      )}
      {!value && isLente && (
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          Suscríbete y nunca te quedes sin lentes · Sin permanencia
        </p>
      )}
    </div>
  )
}
