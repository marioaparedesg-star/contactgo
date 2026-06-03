'use client'
import { DESCUENTOS } from '@/lib/subscription-utils'

/**
 * Versión compacta — 1 sola fila en lugar de grid 2×2.
 * Objetivo: reducir altura visual antes del CTA al mínimo.
 * Un <select> nativo ocupa ~44px en mobile vs 4 botones que ocupan ~160px.
 */
interface Props {
  value: string | null
  onChange: (val: string | null, descuento: number) => void
  precio: number
  tipo: string
}

const OPCIONES = [
  { val: null,         label: 'Compra única',  pct: 0    },
  { val: '15_dias',    label: 'Cada 15 días',  pct: 0.05 },
  { val: 'mensual',    label: 'Mensual',        pct: 0.10 },
  { val: 'trimestral', label: 'Cada 3 meses',  pct: 0.15 },
]

export default function SuscripcionSelector({ value, onChange, precio, tipo }: Props) {
  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  if (!isLente && !isSolucion && !isGota) return null

  const precioConDesc = (pct: number) => Math.round(precio * (1 - pct))
  const selectedPct   = OPCIONES.find(o => o.val === value)?.pct ?? 0
  const ahorroAnual   = Math.round(precio * 0.10 * 12)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor="suscripcion-sel" className="text-xs font-semibold text-gray-700">
          Frecuencia de entrega
        </label>
        {isLente && (
          <span className="text-[10px] font-bold text-green-700">
            Ahorra hasta RD${ahorroAnual.toLocaleString()}/año
          </span>
        )}
      </div>

      {/* Select nativo — mínima altura, máxima compatibilidad */}
      <select
        id="suscripcion-sel"
        value={value ?? ''}
        onChange={e => {
          const val = e.target.value === '' ? null : e.target.value
          const pct = OPCIONES.find(o => o.val === val)?.pct ?? 0
          onChange(val, pct * precio)
        }}
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 bg-white focus:border-primary-500 focus:outline-none transition-colors appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {OPCIONES.map(o => (
          <option key={String(o.val)} value={o.val ?? ''}>
            {o.label}{o.pct > 0 ? ` — ${Math.round(o.pct * 100)}% OFF · RD$${precioConDesc(o.pct).toLocaleString()}` : ` — RD$${precio.toLocaleString()}`}
          </option>
        ))}
      </select>

      {value && (
        <p className="text-[10px] text-green-600 font-semibold">
          ✓ Envío automático. Aviso previo por WhatsApp. Cancela cuando quieras.
        </p>
      )}
    </div>
  )
}
