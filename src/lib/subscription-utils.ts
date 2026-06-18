/**
 * Suscripciones ContactGo — Modelo de conveniencia (CERO descuentos)
 * El valor es el auto-replenishment, no el precio.
 * Amazon lo probó: la retención sube con conveniencia, no con descuento.
 */

export const FRECUENCIAS = {
  'mensual':    { label: 'Mensual',    sublabel: 'Cada 30 días',  dias: 30,  descuento: 0, badge: 'Envío gratis',         puntos: 0,   popular: false },
  'trimestral': { label: 'Trimestral', sublabel: 'Cada 90 días',  dias: 90,  descuento: 0, badge: 'Envío gratis + Stock',  puntos: 0,   popular: true  },
  'semestral':  { label: 'Semestral',  sublabel: 'Cada 6 meses',  dias: 180, descuento: 0, badge: 'VIP + Regalo',          puntos: 0,   popular: false },
} as const

export type Frecuencia = keyof typeof FRECUENCIAS

export const DESCUENTOS: Record<string, number> = {
  'mensual': 0, 'trimestral': 0, 'semestral': 0,
}

/** Siempre precio completo — el valor es la conveniencia */
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
  return precioBase // siempre precio completo
}

export const SOLUTION_PRICES: Record<string, Record<string, number>> = {
  'RENU-MULTI': { '60ml': 562, '120ml': 655, '355ml': 1353 },
  'OPTI-MULTI': { '90ml': 450, '120ml': 700, '300ml': 1250 },
  'PRO-60ML':   { '60ml': 419 },
  'DRE-80ML':   { '80ml': 333 },
  'SPR-FOAM':   { 'Frasco único': 350 },
}

export const SOLUTION_SIZES: Record<string, string[]> = {
  'RENU-MULTI': ['60ml', '120ml', '355ml'],
  'OPTI-MULTI': ['90ml', '120ml', '300ml'],
  'PRO-60ML':   ['60ml'],
  'DRE-80ML':   ['80ml'],
  'SPR-FOAM':   ['Frasco único'],
}
