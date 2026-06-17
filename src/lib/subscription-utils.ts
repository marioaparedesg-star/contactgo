/**
 * Suscripciones ContactGo — Modelo de beneficios (no solo descuentos)
 * Prioridad: LTV > margen puntual
 */

export const FRECUENCIAS = {
  'mensual':    { label: 'Mensual',    sublabel: 'Cada 30 días',    dias: 30,  descuento: 0.00, badge: 'Envío gratis',  puntos: 50,  regalo: null,            popular: false },
  'trimestral': { label: 'Trimestral', sublabel: 'Cada 3 meses',    dias: 90,  descuento: 0.05, badge: '5% + Envío',    puntos: 150, regalo: null,            popular: true  },
  'semestral':  { label: 'Semestral',  sublabel: 'Cada 6 meses',    dias: 180, descuento: 0.08, badge: '8% + Regalo',   puntos: 350, regalo: 'Refresh Tears', popular: false },
} as const

export type Frecuencia = keyof typeof FRECUENCIAS

export const DESCUENTOS: Record<string, number> = {
  'mensual':    0.00,
  'trimestral': 0.05,
  'semestral':  0.08,
}

/** 1ª entrega: siempre precio completo */
export function descuentoPct(_val: string | null): number { return 0 }

/** Siguientes entregas automáticas */
export function descuentoPctSiguiente(val: string | null): number {
  return Math.round((DESCUENTOS[val ?? ''] ?? 0) * 100)
}

export function labelFrecuencia(val: string | null): string {
  if (!val) return 'Compra única'
  return FRECUENCIAS[val as Frecuencia]?.label ?? val
}

export function labelDescuento(val: string | null): string {
  if (!val) return ''
  const f = FRECUENCIAS[val as Frecuencia]
  if (!f) return ''
  const parts = []
  if (f.descuento > 0) parts.push(`${Math.round(f.descuento * 100)}% OFF`)
  if (f.regalo) parts.push(`+ ${f.regalo}`)
  return parts.join(' ')
}

export function proxEnvio(frecuencia: string): Date {
  const dias = FRECUENCIAS[frecuencia as Frecuencia]?.dias ?? 30
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d
}

export function precioConSuscripcion(precioBase: number, frecuencia: string | null): number {
  if (!frecuencia) return precioBase
  const desc = DESCUENTOS[frecuencia] ?? 0
  return Math.round(precioBase * (1 - desc))
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
