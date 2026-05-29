'use client'
import { getEntrega } from '@/lib/delivery-times'

interface Props {
  tipo:     string
  nombre?:  string
  variant?: 'pdp' | 'cart' | 'checkout' | 'compact'
}

export default function EntregaBadge({ tipo, nombre = '', variant = 'pdp' }: Props) {
  const info = getEntrega(tipo, nombre)

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
        ${info.especial ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
        {info.icono} {info.etiqueta}
      </span>
    )
  }

  if (variant === 'cart' || variant === 'checkout') {
    return (
      <p className={`text-[11px] font-semibold flex items-center gap-1
        ${info.especial ? 'text-amber-700' : 'text-green-700'}`}>
        {info.icono} {info.detalle}
      </p>
    )
  }

  // PDP — bloque completo
  return (
    <div className={`rounded-xl px-3 py-2.5 flex items-start gap-2 border
      ${info.especial
        ? 'bg-amber-50 border-amber-100'
        : 'bg-green-50 border-green-100'}`}>
      <span className={`shrink-0 mt-0.5 ${info.especial ? 'text-amber-500' : 'text-green-500'}`}>
        {info.icono}
      </span>
      <div>
        <p className={`font-bold text-xs ${info.especial ? 'text-amber-800' : 'text-green-800'}`}>
          {info.especial ? 'Fabricación especial' : 'Envío rápido'}
        </p>
        <p className={`text-[10px] mt-0.5 leading-relaxed ${info.especial ? 'text-amber-600' : 'text-green-600'}`}>
          {info.detalle}
        </p>
      </div>
    </div>
  )
}
