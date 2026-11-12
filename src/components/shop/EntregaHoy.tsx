'use client'

/**
 * Mensaje informativo sin prometer una fecha distinta a la calculada por
 * EntregaBadge. La disponibilidad y el plazo oficial se muestran arriba.
 */
export default function EntregaHoy({ especial = false }: { especial?: boolean }) {
  return (
    <div className="text-center text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
      {especial
        ? 'Pedido especial: el plazo estimado aparece indicado en la información de entrega.'
        : 'Entrega estimada según disponibilidad del producto.'}
    </div>
  )
}
