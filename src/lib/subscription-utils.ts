/**
 * Suscripciones ContactGo — Recordatorio de reposición (NO cobro automático)
 * ContactGo aún no tiene cobro recurrente automático habilitado con AZUL.
 * Este sistema guarda la preferencia del cliente y le envía un recordatorio
 * por WhatsApp cerca de la fecha, con un link para reordenar en 1 clic —
 * el cliente paga manualmente cada vez, como una compra normal.
 */

export const FRECUENCIAS = {
  'mensual':    { label: 'Cada 30 días',  sublabel: 'Ideal para lentes diarios',      dias: 30,  descuento: 0, badge: 'Te avisamos por WhatsApp',       puntos: 0,   popular: false },
  'trimestral': { label: 'Cada 90 días',  sublabel: 'Ideal para lentes mensuales',    dias: 90,  descuento: 0, badge: 'Reordena en 1 clic',              puntos: 0,   popular: true  },
  'semestral':  { label: 'Cada 6 meses',  sublabel: 'Ideal para lentes trimestrales', dias: 180, descuento: 0, badge: 'Nunca se te olvida reponer',       puntos: 0,   popular: false },
} as const

export type Frecuencia = keyof typeof FRECUENCIAS

export const DESCUENTOS: Record<string, number> = {
  'mensual': 0, 'trimestral': 0, 'semestral': 0,
}

/** Sin cobro automático — el cliente paga cada compra normalmente */
export function descuentoPct(_val: string | null): number { return 0 }
export function descuentoPctSiguiente(_val: string | null): number { return 0 }

export function labelFrecuencia(val: string | null): string {
  if (!val) return 'Compra única'
  return FRECUENCIAS[val as Frecuencia]?.label ?? val
}

export function labelDescuento(val: string | null): string { return '' }

export function proxEnvio(frecuencia: string): Date {
  const dias = FRECUENCIAS[frecuencia as Frecuencia]?.dias ?? 30
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d
}

export function precioConSuscripcion(precioBase: number, _frecuencia: string | null): number {
  return precioBase // sin cobro automático, precio siempre el normal
}

export const SOLUTION_PRICES: Record<string, Record<string, number>> = {
  'RENU-MULTI': { '60ml': 562, '120ml': 655, '355ml': 1353 },
  'OPTI-MULTI': { '90ml': 750, '300ml': 1450 },
  'PRO-60ML':   { '60ml': 419 },
  'DRE-80ML':   { '80ml': 333 },
  'SPR-FOAM':   { 'Frasco único': 350 },
}

export const SOLUTION_SIZES: Record<string, string[]> = {
  'RENU-MULTI': ['60ml', '120ml', '355ml'],
  'OPTI-MULTI': ['90ml', '300ml'],
  'PRO-60ML':   ['60ml'],
  'DRE-80ML':   ['80ml'],
  'SPR-FOAM':   ['Frasco único'],
}
