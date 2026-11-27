'use client'

interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

// El valor es conveniencia + envío gratis + nunca quedarte sin lentes
// Cero descuentos = margen protegido
const OPCIONES = [
  {
    val: null,
    label: 'Una sola vez',
    sublabel: 'Sin compromiso',
    color: 'gray',
    beneficios: [] as string[],
    popular: false,
  },
  {
    val: 'mensual',
    label: 'Mensual',
    sublabel: 'Cada 30 días',
    color: 'primary',
    beneficios: ['Recordatorio por WhatsApp antes de la fecha de reposición', 'Realizas el pedido cuando lo necesites'],
    popular: false,
  },
  {
    val: 'trimestral',
    label: 'Trimestral',
    sublabel: 'Cada 90 días',
    color: 'primary',
    beneficios: ['Recordatorio por WhatsApp cada 90 días', 'Sin cobros automáticos'],
    popular: true,
  },
  {
    val: 'semestral',
    label: 'Semestral',
    sublabel: 'Cada 6 meses',
    color: 'primary',
    beneficios: ['Recordatorio por WhatsApp cada 6 meses', 'Sin cobros automáticos'],
    popular: false,
  },
]

const COLORS = {
  gray:    { border: 'border-gray-200',    bg: 'bg-white',         text: 'text-gray-900',  sub: 'text-gray-500',  badge: '' },
  blue:    { border: 'border-primary-300', bg: 'bg-[#EEF2F8]', text: 'text-primary-700', sub: 'text-primary-500', badge: 'bg-primary-600' },
  primary: { border: 'border-[#01B2B7]', bg: 'bg-[#F0FAFA]', text: 'text-teal-900', sub: 'text-teal-700', badge: 'bg-teal-600' },
  purple:  { border: 'border-primary-300', bg: 'bg-[#EEF2F8]', text: 'text-primary-700', sub: 'text-primary-500', badge: 'bg-primary-600' },
}

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isProducto = ['esferico','torico','multifocal','color','solucion','gota'].includes(tipo)
  if (!isProducto) return null

  const selected = OPCIONES.find(o => o.val === value) ?? OPCIONES[0]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-700">Frecuencia de entrega</p>
        <span className="text-[10px] text-slate-500">Sin descuentos ni cargos recurrentes</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {OPCIONES.map(op => {
          const isSelected = value === op.val
          const col = COLORS[op.color as keyof typeof COLORS]
          return (
            <button
              key={String(op.val)}
              type="button"
              onClick={() => onChange(op.val, 0)}
              className={`relative flex flex-col p-2.5 rounded-xl border-2 text-left transition-all min-h-[82px] ${
                isSelected ? `${col.border} ${col.bg} ` : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {op.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black bg-primary-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  Recomendado
                </span>
              )}
              
              <p className={`text-[11px] font-black leading-tight ${isSelected ? col.text : 'text-gray-800'}`}>
                {op.label}
              </p>
              <p className={`text-[9px] mt-0.5 ${isSelected ? col.sub : 'text-gray-400'}`}>
                {op.sublabel}
              </p>
              <p className={`text-[11px] font-black mt-auto pt-1.5 ${isSelected ? col.text : 'text-gray-700'}`}>
                RD${precio.toLocaleString()}
              </p>
            </button>
          )
        })}
      </div>

      {value && selected.beneficios.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 space-y-1">
          {selected.beneficios.map((b, i) => (
            <p key={i} className="text-[10px] text-gray-700 font-medium">{b}</p>
          ))}
          <p className="text-[9px] text-gray-400 pt-0.5">No se realiza ningún cobro automático.</p>
        </div>
      )}
    </div>
  )
}
