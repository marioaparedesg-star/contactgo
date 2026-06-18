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
    icon: '🛍️',
    color: 'gray',
    beneficios: [] as string[],
    popular: false,
  },
  {
    val: 'mensual',
    label: 'Mensual',
    sublabel: 'Cada 30 días',
    icon: '📦',
    color: 'blue',
    beneficios: ['✓ Envío siempre gratis', '✓ Aviso 3 días antes por WA', '✓ Cancela cuando quieras'],
    popular: false,
  },
  {
    val: 'trimestral',
    label: 'Trimestral',
    sublabel: 'Cada 90 días',
    icon: '⭐',
    color: 'primary',
    beneficios: ['✓ Envío siempre gratis', '✓ Stock garantizado para ti', '✓ Aviso por WA antes de envío'],
    popular: true,
  },
  {
    val: 'semestral',
    label: 'Semestral',
    sublabel: 'Cada 6 meses',
    icon: '💎',
    color: 'purple',
    beneficios: ['✓ Envío siempre gratis', '✓ Cliente VIP ContactGo', '✓ Regalo sorpresa cada 6 meses'],
    popular: false,
  },
]

const COLORS = {
  gray:    { border: 'border-gray-200',    bg: 'bg-white',         text: 'text-gray-900',  sub: 'text-gray-400',  badge: '' },
  blue:    { border: 'border-blue-300',    bg: 'bg-blue-50',       text: 'text-blue-800',  sub: 'text-blue-400',  badge: 'bg-blue-600' },
  primary: { border: 'border-primary-400', bg: 'bg-primary-50',    text: 'text-primary-800',sub:'text-primary-400',badge:'bg-primary-600'},
  purple:  { border: 'border-purple-300',  bg: 'bg-purple-50',     text: 'text-purple-800',sub:'text-purple-400', badge:'bg-purple-600'},
}

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isProducto = ['esferico','torico','multifocal','color','solucion','gota'].includes(tipo)
  if (!isProducto) return null

  const selected = OPCIONES.find(o => o.val === value) ?? OPCIONES[0]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-700">Frecuencia de entrega</p>
        <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
          Siempre al mismo precio
        </span>
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
                isSelected ? `${col.border} ${col.bg} shadow-sm` : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {op.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black bg-amber-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                  ★ Más elegido
                </span>
              )}
              <span className="text-base mb-1">{op.icon}</span>
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
          <p className="text-[9px] text-gray-400 pt-0.5">Cancela o pausa cuando quieras · Sin cargos extra</p>
        </div>
      )}
    </div>
  )
}
