'use client'
import { getEntrega, getFechaEntrega } from '@/lib/delivery-times'

interface Props {
  tipo:    string
  nombre?: string
  sph?:    string | number | null
  variant?: 'pdp' | 'cart' | 'checkout' | 'compact'
}

export default function EntregaBadge({ tipo, nombre = '', sph, variant = 'pdp' }: Props) {
  const info  = getEntrega(tipo, nombre, sph)
  const fecha = getFechaEntrega(tipo, nombre, sph)

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
        ${info.especial ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-800'}`}>
        {info.icono} {info.etiqueta}
      </span>
    )
  }

  if (variant === 'cart' || variant === 'checkout') {
    return (
      <div className={`flex items-center gap-1.5 mt-1 ${info.especial ? 'text-amber-700' : 'text-teal-800'}`}>
        <span className="text-sm">{info.icono}</span>
        <div>
          <p className="text-[11px] font-bold leading-none">{fecha.texto}</p>
          <p className="text-[9px] text-gray-600 mt-1 leading-snug">{info.detalle}</p>
        </div>
      </div>
    )
  }

  // PDP — bloque completo Amazon-style
  return (
    <div className={`rounded-xl px-3 py-2.5 flex items-start gap-2 border
      ${info.especial ? 'bg-amber-50 border-amber-100' : 'bg-teal-50 border-teal-100'}`}>
      <span className="text-lg shrink-0 mt-0.5">{info.icono}</span>
      <div>
        <p className={`font-black text-sm leading-none ${info.especial ? 'text-amber-800' : 'text-teal-900'}`}>
          {fecha.texto}
        </p>
        <p className={`text-[10px] mt-1 leading-snug ${info.especial ? 'text-amber-700' : 'text-teal-700'}`}>{info.detalle}</p>
      </div>
    </div>
  )
}
