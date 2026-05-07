'use client'

const OPCIONES = [
  { val: null,         label: 'Compra única',     badge: '',          desc: 'Sin compromiso',              color: 'gray'   },
  { val: '15_dias',   label: 'Cada 15 días',     badge: '5% OFF',    desc: 'Para lentes diarios',         color: 'blue'   },
  { val: 'mensual',   label: 'Mensual',           badge: '10% OFF',   desc: 'Lentes mensuales y quincenales', color: 'primary'},
  { val: 'trimestral',label: 'Cada 3 meses',      badge: '15% OFF',   desc: 'Soluciones y gotas',          color: 'green'  },
]

const DESCUENTOS: Record<string, number> = {
  '15_dias': 0.05,
  'mensual': 0.10,
  'trimestral': 0.15,
}

interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  // Solo mostrar para productos relevantes
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

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Frecuencia de entrega
        <span className="ml-2 text-xs font-normal text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
          Ahorra hasta 15%
        </span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {OPCIONES.map(o => {
          const active = value === o.val
          const pDesc  = precioConDesc(o.val)
          return (
            <button key={String(o.val)} onClick={() => handleSelect(o.val)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                active
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              {o.badge && (
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                  {o.badge}
                </span>
              )}
              <p className={`text-xs font-bold ${active ? 'text-primary-700' : 'text-gray-700'}`}>
                {o.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{o.desc}</p>
              {o.val && (
                <p className={`text-sm font-black mt-1 ${active ? 'text-primary-600' : 'text-gray-900'}`}>
                  RD${pDesc.toLocaleString()}
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
    </div>
  )
}

export { DESCUENTOS }
