/**
 * Utilidades centralizadas de suscripciones — FUENTE DE VERDAD ÚNICA
 * Usada en frontend, checkout y backend.
 */

/** Frecuencias disponibles */
export const FRECUENCIAS = {
  '15_dias':    { label: 'Cada 15 días',   dias: 15,  descuento: 0.05, badge: '5% OFF'  },
  'mensual':    { label: 'Mensual',         dias: 30,  descuento: 0.10, badge: '10% OFF' },
  'trimestral': { label: 'Cada 3 meses',    dias: 90,  descuento: 0.15, badge: '15% OFF' },
} as const

export type Frecuencia = keyof typeof FRECUENCIAS

/** Descuentos como decimales */
export const DESCUENTOS: Record<string, number> = {
  '15_dias':    0.05,
  'mensual':    0.10,
  'trimestral': 0.15,
}

/** Nombre legible de la frecuencia */
export function labelFrecuencia(val: string | null): string {
  if (!val) return 'Compra única'
  return FRECUENCIAS[val as Frecuencia]?.label ?? val
}

/** Descuento % legible */
export function labelDescuento(val: string | null): string {
  if (!val) return ''
  const pct = Math.round((DESCUENTOS[val] ?? 0) * 100)
  return pct > 0 ? `${pct}% de descuento` : ''
}

/** Porcentaje entero para la 1ª entrega (SIEMPRE 0 — precio completo)
 *  Las entregas automáticas posteriores usarán descuentoPctSiguiente.
 */
export function descuentoPct(_val: string | null): number {
  return 0 // 1ª entrega sin descuento — aplica en la 2ª entrega automática
}

/** Porcentaje para las SIGUIENTES entregas automáticas */
export function descuentoPctSiguiente(val: string | null): number {
  return Math.round((DESCUENTOS[val ?? ''] ?? 0) * 100)
}

/** Calcular próximo envío desde hoy */
export function proxEnvio(frecuencia: string): Date {
  const dias = FRECUENCIAS[frecuencia as Frecuencia]?.dias ?? 30
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d
}

/** Precio con descuento de suscripción aplicado */
export function precioConSuscripcion(precioBase: number, frecuencia: string | null): number {
  if (!frecuencia) return precioBase
  const desc = DESCUENTOS[frecuencia] ?? 0
  return Math.round(precioBase * (1 - desc))
}

/** Precios de soluciones por SKU y tamaño — FUENTE DE VERDAD */
export const SOLUTION_PRICES: Record<string, Record<string, number>> = {
  'RENU-MULTI': { '60ml': 562,  '120ml': 655,  '355ml': 1353 },
  'OPTI-MULTI': { '90ml': 450,  '120ml': 700,  '300ml': 1250 },
  'PRO-60ML':   { '60ml': 419  },
  'PRO-350ML':  { '350ml': 869 },
  'DRE-80ML':   { '80ml': 333  },
  'SPR-FOAM':   { 'Frasco único': 350 },
}

export const SOLUTION_SIZES: Record<string, string[]> = {
  'RENU-MULTI': ['60ml', '120ml', '355ml'],
  'OPTI-MULTI': ['90ml', '120ml', '300ml'],
  'PRO-60ML':   ['60ml'],
  'DRE-80ML':   ['80ml'],
  'SPR-FOAM':   ['Frasco único'],
}
