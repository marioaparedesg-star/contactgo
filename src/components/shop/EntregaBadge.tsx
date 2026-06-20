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
        ${info.especial ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
        {info.icono} {info.etiqueta}
      </span>
    )
  }

  if (variant === 'cart' || variant === 'checkout') {
    return (
      <div className={`flex items-center gap-1.5 mt-1 ${info.especial ? 'text-amber-700' : 'text-green-700'}`}>
        <span className="text-sm">{info.icono}</span>
        <div>
          <p className="text-[11px] font-bold leading-none">{fecha.texto}</p>
          {info.especial && (
            <p className="text-[9px] text-amber-600 mt-0.5">Fabricación especial</p>
          )}
        </div>
      </div>
    )
  }

  // PDP — bloque completo Amazon-style
  return (
    <div className={`rounded-xl px-3 py-2.5 flex items-start gap-2 border
      ${info.especial ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
      <span className="text-lg shrink-0 mt-0.5">{info.icono}</span>
      <div>
        <p className={`font-black text-sm leading-none ${info.especial ? 'text-amber-800' : 'text-green-800'}`}>
          {fecha.texto}
        </p>
        {info.especial && (
          <p className="text-[10px] text-amber-600 mt-1 font-medium">Fabricación especial · Pedido al distribuidor</p>
        )}
        {!info.especial && (
          <p className="text-[10px] text-green-600 mt-0.5">🚚 Envío a todo RD disponible</p>
        )}
      </div>
    </div>
  )
}
