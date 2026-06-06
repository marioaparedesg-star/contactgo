/**
 * prescription.ts — Motor de cálculo de recetas para ContactGo
 * 
 * FUNCIONES PRINCIPALES:
 * 1. convertGlassesToContacts() — Conversión gafas → lentes con vertex distance
 * 2. analyzePrescription()      — Análisis y recomendación por condición
 * 3. matchProductsToRx()        — Matching real contra inventario disponible
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface EyeRx {
  sph:  number | null
  cyl:  number | null
  axis: number | null
  add:  number | null
}

export interface GlassesRx {
  od: EyeRx
  oi: EyeRx
}

export interface ContactRx extends EyeRx {}

export interface ConvertedRx {
  od: ContactRx
  oi: ContactRx
  needsVertex: boolean   // true si la corrección vertex cambió algo
  tipo: 'esferico' | 'torico' | 'multifocal' | 'multifocal_torico' | 'multifocal_torico' | 'color'
  condiciones: string[]
  descripcion: string
}

// ─── 1. Conversión vertex distance ────────────────────────────────────────────

const VERTEX_MM = 12   // distancia vertex estándar: 12mm

/**
 * Corrección por distancia vertex.
 * Solo impacta prescripciones > |±4.00D|.
 * Fórmula: F_contact = F_glasses / (1 - d × F_glasses)   donde d en metros
 */
function vertexCorrect(D: number, d: number = VERTEX_MM / 1000): number {
  if (Math.abs(D) < 4.0) return D
  return D / (1 - d * D)
}

/** Redondear al paso disponible en lentes de contacto */
function roundContactStep(val: number): number {
  if (val === 0) return 0
  // Hasta ±4D: pasos de 0.25D
  // Más de ±4D: pasos de 0.50D
  const step = Math.abs(val) > 4 ? 0.5 : 0.25
  return Math.round(val / step) * step
}

/** Cilindros disponibles para lentes tóricos en ContactGo */
const TORIC_CYL_STEPS = [-0.75, -1.25, -1.75, -2.25, -2.75, -3.25, -3.75, -4.25, -4.75, -5.25, -5.75]

/** Redondear CYL al cilindro tórico más cercano disponible */
function roundToToricCyl(cyl: number): number {
  if (cyl === 0) return 0
  const neg = cyl < 0 ? cyl : -cyl  // siempre trabajar en negativo
  return TORIC_CYL_STEPS.reduce((prev, curr) =>
    Math.abs(curr - neg) < Math.abs(prev - neg) ? curr : prev
  )
}

/** Redondear AXIS al eje tórico más cercano (múltiplos de 10°) */
function roundToToricAxis(axis: number): number {
  const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
  return steps.reduce((prev, curr) =>
    Math.abs(curr - axis) < Math.abs(prev - axis) ? curr : prev
  )
}

/**
 * Convierte UN ojo de receta de gafas a lentes de contacto.
 * Si |SPH| ≤ 4D → no hay cambio significativo
 * Si |SPH| > 4D → aplica fórmula vertex a ambos meridianos principales
 */
function convertEye(eye: EyeRx): ContactRx {
  const sph = eye.sph ?? 0
  const cyl = eye.cyl ?? 0

  if (sph === 0 && cyl === 0) {
    return { sph: 0, cyl: null, axis: eye.axis, add: eye.add }
  }

  // Meridianos principales de la lente de gafas
  const F1 = sph           // meridiano esférico
  const F2 = sph + cyl     // meridiano cilíndrico

  // Corregir por vertex distance
  const F1c = roundContactStep(vertexCorrect(F1))
  const F2c = roundContactStep(vertexCorrect(F2))

  // Reconstruir SPH y CYL para el lente de contacto
  const newSph = F1c
  const rawCyl = parseFloat((F2c - F1c).toFixed(2))

  let newCyl: number | null = null
  let newAxis: number | null = eye.axis

  if (rawCyl !== 0) {
    newCyl = roundToToricCyl(rawCyl)
    newAxis = eye.axis != null ? roundToToricAxis(eye.axis) : null
  }

  return {
    sph:  newSph,
    cyl:  newCyl,
    axis: newAxis,
    add:  eye.add,
  }
}

/** Convierte una receta COMPLETA de gafas a lentes de contacto */
export function convertGlassesToContacts(rx: GlassesRx): ConvertedRx {
  const od = convertEye(rx.od)
  const oi = convertEye(rx.oi)

  // ¿Cambió algo por vertex distance?
  const needsVertex =
    (rx.od.sph != null && Math.abs(rx.od.sph) >= 4) ||
    (rx.oi.sph != null && Math.abs(rx.oi.sph) >= 4)

  // Determinar tipo y condiciones
  const allSph = [rx.od.sph, rx.oi.sph].filter(v => v != null) as number[]
  const allCyl = [rx.od.cyl, rx.oi.cyl].filter(v => v != null && v !== 0) as number[]
  const allAdd = [rx.od.add, rx.oi.add].filter(v => v != null && v !== 0) as number[]

  const condiciones: string[] = []
  const maxSph = allSph.reduce((m, v) => Math.max(m, Math.abs(v)), 0)
  const avgSph = allSph.length ? allSph.reduce((a, b) => a + b, 0) / allSph.length : 0

  if (avgSph < -0.25) condiciones.push('Miopía')
  if (avgSph > 0.25)  condiciones.push('Hipermetropía')
  if (allCyl.length)  condiciones.push('Astigmatismo')
  if (allAdd.length)  condiciones.push('Presbicia')
  if (maxSph >= 6)    condiciones.push('Alta graduación')
  if (!condiciones.length) condiciones.push('Sin graduación')

  let tipo: ConvertedRx['tipo'] = 'esferico'
  let descripcion = ''

  if (allAdd.length > 0 && allCyl.length > 0) {
    tipo = 'multifocal_torico'
    descripcion = 'Tu receta tiene presbicia Y astigmatismo. Necesitas lentes multifocales tóricos. El Proclear® Multifocal Toric corrige ambas condiciones simultáneamente.'
  } else if (allAdd.length > 0) {
    tipo = 'multifocal'
    descripcion = 'Tu receta incluye adición (ADD), lo que indica presbicia. Necesitas lentes multifocales que corrijan tanto la visión de lejos como de cerca.'
  } else if (allCyl.length > 0) {
    tipo = 'torico'
    descripcion = 'Tu receta tiene cilindro (CYL), lo que indica astigmatismo. Los lentes tóricos están diseñados para corregir esta condición con precisión.'
  } else {
    tipo = 'esferico'
    if (avgSph < 0) {
      descripcion = maxSph >= 6
        ? 'Tienes miopía de alta graduación. Los lentes esféricos de alta potencia corregirán tu visión de lejos.'
        : 'Tienes miopía. Los lentes esféricos corregirán tu visión de lejos.'
    } else if (avgSph > 0) {
      descripcion = 'Tienes hipermetropía. Los lentes esféricos corregirán tu visión de cerca.'
    } else {
      descripcion = 'Tu receta es plano o cosmética. Puedes usar lentes de color sin graduación.'
    }
  }

  return { od, oi, needsVertex, tipo, condiciones, descripcion }
}

// ─── 2. Análisis sin conversión (para compatibilidad) ─────────────────────────

export function analyzePrescription(rx: {
  od_sph?: number; od_cyl?: number; od_axis?: number; od_add?: number
  oi_sph?: number; oi_cyl?: number; oi_axis?: number; oi_add?: number
  add_power?: number
}) {
  const glassesRx: GlassesRx = {
    od: { sph: rx.od_sph ?? null, cyl: rx.od_cyl ?? null, axis: rx.od_axis ?? null, add: rx.od_add ?? rx.add_power ?? null },
    oi: { sph: rx.oi_sph ?? null, cyl: rx.oi_cyl ?? null, axis: rx.oi_axis ?? null, add: rx.oi_add ?? rx.add_power ?? null },
  }
  return convertGlassesToContacts(glassesRx)
}

// ─── 3. Helpers de formato ────────────────────────────────────────────────────

export function fmtSph(val: number | null): string {
  if (val == null) return '—'
  if (val === 0) return 'Plano'
  return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
}

export function fmtCyl(val: number | null): string {
  if (val == null || val === 0) return '—'
  return val.toFixed(2)
}

export function fmtAxis(val: number | null): string {
  if (val == null) return '—'
  return `${String(val).padStart(3, '0')}°`
}

export function fmtAdd(val: number | null): string {
  if (val == null || val === 0) return '—'
  return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
}

// ─── 4. SPH/CYL/AXIS disponibles en ContactGo ────────────────────────────────

export const SPH_GLASSES = [
  -20, -19.5, -19, -18.5, -18, -17.5, -17, -16.5, -16, -15.5, -15, -14.5, -14, -13.5, -13,
  -12.5, -12, -11.75, -11.5, -11.25, -11, -10.75, -10.5, -10.25, -10, -9.75, -9.5, -9.25,
  -9, -8.75, -8.5, -8.25, -8, -7.75, -7.5, -7.25, -7, -6.75, -6.5, -6.25, -6, -5.75, -5.5,
  -5.25, -5, -4.75, -4.5, -4.25, -4, -3.75, -3.5, -3.25, -3, -2.75, -2.5, -2.25, -2, -1.75,
  -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0,
  0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25,
  4.5, 4.75, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 15
]

export const CYL_GLASSES = [
  0, -0.25, -0.50, -0.75, -1.00, -1.25, -1.50, -1.75, -2.00, -2.25, -2.50,
  -2.75, -3.00, -3.25, -3.50, -3.75, -4.00, -4.50, -5.00, -5.50, -6.00
]

export const AXIS_VALS = Array.from({ length: 180 }, (_, i) => i + 1)

export const ADD_VALS = [
  0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.50
]
