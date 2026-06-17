'use client'
import type { Frecuencia } from '@/lib/subscription-utils'

interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

type Opcion = {
  val: string | null
  label: string
  sublabel: string
  icon: string
  badge?: string
  popular?: boolean
  descuento: number
  puntos: number
  regalo?: string
  envioGratis: boolean
}

const OPCIONES: Opcion[] = [
  { val: null,         label: 'Única vez',   sublabel: 'Sin compromiso',    icon: '🛍️', descuento: 0,    puntos: 0,   envioGratis: false },
  { val: 'mensual',    label: 'Mensual',     sublabel: 'Cada 30 días',      icon: '📦', badge: 'Envío gratis', descuento: 0, puntos: 50, envioGratis: true  },
  { val: 'trimestral', label: 'Trimestral',  sublabel: 'Cada 3 meses',      icon: '⭐', badge: '5% + Envío',   descuento: 0.05, puntos: 150, envioGratis: true, popular: true },
  { val: 'semestral',  label: 'Semestral',   sublabel: 'Cada 6 meses',      icon: '💎', badge: '8% + Regalo',  descuento: 0.08, puntos: 350, envioGratis: true, regalo: 'Refresh Tears' },
]

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isProducto = ['esferico','torico','multifocal','color','solucion','gota'].includes(tipo)
  if (!isProducto) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-700">Frecuencia de entrega</p>
        <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
          Cancela cuando quieras
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {OPCIONES.map(op => {
          const selected = value === op.val
          const precioDesdeSig = op.descuento > 0 ? Math.round(precio * (1 - op.descuento)) : null
          const beneficios = [
            op.envioGratis ? '✓ Envío gratis' : null,
            op.descuento > 0 ? `✓ ${Math.round(op.descuento*100)}% OFF (2ª+)` : null,
            op.puntos > 0 ? `✓ ${op.puntos} puntos` : null,
            op.regalo ? `✓ Regalo: ${op.regalo}` : null,
          ].filter((b): b is string => !!b)

          return (
            <button key={String(op.val)} type="button"
              onClick={() => onChange(op.val, 0)}
              className={`relative flex flex-col items-start text-left p-2.5 rounded-xl border-2 transition-all min-h-[90px] ${
                selected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              {op.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black bg-amber-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                  ★ Popular
                </span>
              )}
              {op.badge && (
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full mb-1 self-start ${
                  selected ? 'bg-primary-600 text-white' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>{op.badge}</span>
              )}
              <p className={`text-[11px] font-black ${selected ? 'text-primary-700' : 'text-gray-900'}`}>{op.label}</p>
              <p className={`text-[9px] mt-0.5 ${selected ? 'text-primary-400' : 'text-gray-400'}`}>{op.sublabel}</p>
              <div className="mt-1 space-y-0.5 flex-1">
                {beneficios.slice(0,2).map((b,i) => (
                  <p key={i} className="text-[8px] text-green-600 font-semibold leading-tight">{b}</p>
                ))}
              </div>
              <p className={`text-[10px] font-black mt-1 ${selected ? 'text-primary-700' : 'text-gray-600'}`}>
                RD${precio.toLocaleString()}
              </p>
              {precioDesdeSig && (
                <p className="text-[8px] text-green-600 font-bold">Sig: RD${precioDesdeSig.toLocaleString()}</p>
              )}
            </button>
          )
        })}
      </div>

      {value && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 space-y-0.5">
          <p className="text-[10px] font-bold text-green-800">✓ Primera entrega hoy — precio completo</p>
          {value === 'mensual'    && <p className="text-[10px] text-green-700">✓ Envío gratis en cada reposición automática</p>}
          {value === 'trimestral' && <p className="text-[10px] text-green-700">✓ 2ª entrega: 5% OFF + envío gratis</p>}
          {value === 'semestral'  && <p className="text-[10px] text-green-700">✓ 2ª entrega: 8% OFF + Refresh Tears incluido</p>}
          <p className="text-[9px] text-green-500">Aviso por WhatsApp antes de cada envío · Cancela cuando quieras</p>
        </div>
      )}
    </div>
  )
}
