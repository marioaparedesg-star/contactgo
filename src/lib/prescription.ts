/**
 * prescription.ts — Motor de recomendación de lentes de contacto
 * 
 * NO convierte ni modifica la receta del cliente.
 * Toma los valores exactos y busca productos compatibles.
 */

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
  needsVertex: boolean
  tipo: 'esferico' | 'torico' | 'multifocal' | 'multifocal_torico' | 'color'
  condiciones: string[]
  descripcion: string
}

// ─── Rangos de parámetros por producto ────────────────────────────────────────
// Cada producto tiene rangos SPH, CYL, ADD que soporta
export interface ProductRange {
  slug: string
  nombre: string
  marca: string
  tipo: 'esferico' | 'torico' | 'multifocal' | 'multifocal_torico'
  sph_min: number
  sph_max: number
  cyl_min?: number   // para tóricos
  cyl_max?: number
  add_min?: number   // para multifocales
  add_max?: number
  reemplazo: string  // Diario, Quincenal, Mensual
  extended?: boolean // rango extendido (XR)
}

export const PRODUCT_RANGES: ProductRange[] = [
  // ─── ESFÉRICOS ───
  { slug: '1-day-acuvue-moist-lentes-contacto-diarios-dominicana', nombre: '1-DAY ACUVUE MOIST', marca: 'ACUVUE', tipo: 'esferico', sph_min: -12, sph_max: 6, reemplazo: 'Diario' },
  { slug: 'acuvue-2-lentes-contacto-quincenales-dominicana', nombre: 'ACUVUE 2', marca: 'ACUVUE', tipo: 'esferico', sph_min: -12, sph_max: 8, reemplazo: 'Quincenal' },
  { slug: 'acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana', nombre: 'ACUVUE OASYS', marca: 'ACUVUE', tipo: 'esferico', sph_min: -12, sph_max: 8, reemplazo: 'Quincenal' },
  { slug: 'air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana', nombre: 'AIR OPTIX plus HydraGlyde', marca: 'ALCON', tipo: 'esferico', sph_min: -10, sph_max: 6, reemplazo: 'Mensual' },
  { slug: 'bausch-lomb-ultra-lentes-contacto-mensuales-dominicana', nombre: 'Bausch+Lomb ULTRA', marca: 'BAUSCH+LOMB', tipo: 'esferico', sph_min: -12, sph_max: 6, reemplazo: 'Mensual' },
  { slug: 'biotrue-oneday-lentes-contacto-diarios-dominicana', nombre: 'Biotrue ONEday', marca: 'BAUSCH+LOMB', tipo: 'esferico', sph_min: -9, sph_max: 6, reemplazo: 'Diario' },
  { slug: 'avaira-vitality-lentes-contacto-mensuales-coopervision-dominicana', nombre: 'Avaira Vitality', marca: 'COOPERVISION', tipo: 'esferico', sph_min: -12, sph_max: 8, reemplazo: 'Mensual' },
  { slug: 'biofinity-lentes-contacto-mensuales-coopervision-dominicana', nombre: 'Biofinity', marca: 'COOPERVISION', tipo: 'esferico', sph_min: -12, sph_max: 8, reemplazo: 'Mensual' },
  { slug: 'biofinity-xr-lentes-contacto-alta-graduacion-esferica-dominicana', nombre: 'Biofinity XR', marca: 'COOPERVISION', tipo: 'esferico', sph_min: -20, sph_max: 15, reemplazo: 'Mensual', extended: true },
  { slug: 'clariti-1-day-lentes-contacto-diarios-dominicana', nombre: 'clariti 1 day', marca: 'COOPERVISION', tipo: 'esferico', sph_min: -10, sph_max: 8, reemplazo: 'Diario' },
  { slug: 'proclear-sphere-lentes-contacto-mensuales-dominicana', nombre: 'Proclear Sphere', marca: 'COOPERVISION', tipo: 'esferico', sph_min: -12, sph_max: 8, reemplazo: 'Mensual' },

  // ─── TÓRICOS ───
  { slug: 'acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', nombre: 'ACUVUE MOIST for Astigmatism', marca: 'ACUVUE', tipo: 'torico', sph_min: -9, sph_max: 4, cyl_min: -2.75, cyl_max: -0.75, reemplazo: 'Diario' },
  { slug: 'acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', nombre: 'ACUVUE OASYS for Astigmatism', marca: 'ACUVUE', tipo: 'torico', sph_min: -9, sph_max: 4, cyl_min: -2.75, cyl_max: -0.75, reemplazo: 'Quincenal' },
  { slug: 'bausch-lomb-ultra-astigmatism-lentes-toricos-dominicana', nombre: 'Bausch+Lomb ULTRA for Astigmatism', marca: 'BAUSCH+LOMB', tipo: 'torico', sph_min: -9, sph_max: 6, cyl_min: -2.75, cyl_max: -0.75, reemplazo: 'Mensual' },
  { slug: 'avaira-vitality-toric-lentes-astigmatismo-dominicana', nombre: 'Avaira Vitality Toric', marca: 'COOPERVISION', tipo: 'torico', sph_min: -10, sph_max: 6, cyl_min: -2.25, cyl_max: -0.75, reemplazo: 'Mensual' },
  { slug: 'biofinity-toric-lentes-astigmatismo-coopervision-dominicana', nombre: 'Biofinity Toric', marca: 'COOPERVISION', tipo: 'torico', sph_min: -10, sph_max: 10, cyl_min: -5.75, cyl_max: -0.75, reemplazo: 'Mensual' },
  { slug: 'biofinity-xr-toric-lentes-alta-graduacion-dominicana', nombre: 'Biofinity XR Toric', marca: 'COOPERVISION', tipo: 'torico', sph_min: -20, sph_max: 20, cyl_min: -5.75, cyl_max: -0.75, reemplazo: 'Mensual', extended: true },
  { slug: 'clariti-1-day-toric-lentes-contacto-diarios-astigmatismo-dominicana', nombre: 'clariti 1 day toric', marca: 'COOPERVISION', tipo: 'torico', sph_min: -9, sph_max: 4, cyl_min: -2.25, cyl_max: -0.75, reemplazo: 'Diario' },

  // ─── MULTIFOCALES ───
  { slug: 'acuvue-oasys-multifocal-lentes-contacto-dominicana', nombre: 'ACUVUE OASYS Multifocal', marca: 'ACUVUE', tipo: 'multifocal', sph_min: -9, sph_max: 6, add_min: 0.75, add_max: 2.50, reemplazo: 'Quincenal' },
  { slug: 'air-optix-hydraglyde-multifocal-lentes-presbicia-dominicana', nombre: 'AIR OPTIX Multifocal', marca: 'ALCON', tipo: 'multifocal', sph_min: -10, sph_max: 6, add_min: 0.75, add_max: 3.00, reemplazo: 'Mensual' },
  { slug: 'bausch-lomb-ultra-presbyopia-lentes-multifocales-dominicana', nombre: 'Bausch+Lomb ULTRA for Presbyopia', marca: 'BAUSCH+LOMB', tipo: 'multifocal', sph_min: -10, sph_max: 6, add_min: 0.75, add_max: 2.50, reemplazo: 'Mensual' },
  { slug: 'biofinity-multifocal-lentes-presbicia-coopervision-dominicana', nombre: 'Biofinity Multifocal', marca: 'COOPERVISION', tipo: 'multifocal', sph_min: -10, sph_max: 8, add_min: 0.75, add_max: 4.00, reemplazo: 'Mensual' },
  { slug: 'clariti-1-day-multifocal-lentes-presbicia-diarios-dominicana', nombre: 'clariti 1 day multifocal', marca: 'COOPERVISION', tipo: 'multifocal', sph_min: -6, sph_max: 5, add_min: 0.75, add_max: 2.50, reemplazo: 'Diario' },
  { slug: 'proclear-multifocal-lentes-presbicia-mensual-dominicana', nombre: 'Proclear Multifocal', marca: 'COOPERVISION', tipo: 'multifocal', sph_min: -8, sph_max: 6, add_min: 0.75, add_max: 4.00, reemplazo: 'Mensual' },
  { slug: 'proclear-multifocal-xr-lentes-presbicia-alta-graduacion-dominicana', nombre: 'Proclear Multifocal XR', marca: 'COOPERVISION', tipo: 'multifocal', sph_min: -20, sph_max: 20, add_min: 0.75, add_max: 4.00, reemplazo: 'Mensual', extended: true },

  // ─── MULTIFOCAL TÓRICO ───
  { slug: 'proclear-multifocal-toric-lentes-presbicia-astigmatismo-dominicana', nombre: 'Proclear Multifocal Toric', marca: 'COOPERVISION', tipo: 'multifocal_torico', sph_min: -20, sph_max: 20, cyl_min: -5.75, cyl_max: -0.75, add_min: 0.75, add_max: 4.00, reemplazo: 'Mensual', extended: true },
]

// ─── Conversión vertex (solo para recetas de GAFAS) ──────────────────────────

const VERTEX_MM = 12

function vertexCorrect(D: number): number {
  if (Math.abs(D) < 4.0) return D
  const d = VERTEX_MM / 1000
  return D / (1 - d * D)
}

function roundStep(val: number): number {
  if (val === 0) return 0
  const step = Math.abs(val) > 4 ? 0.5 : 0.25
  return Math.round(val / step) * step
}

function convertEyeFromGlasses(eye: EyeRx): ContactRx {
  const sph = eye.sph ?? 0
  const cyl = eye.cyl ?? 0
  if (sph === 0 && cyl === 0) return { sph: 0, cyl: null, axis: eye.axis, add: eye.add }
  if (cyl === 0) return { sph: roundStep(vertexCorrect(sph)), cyl: null, axis: null, add: eye.add }
  const F1c = roundStep(vertexCorrect(sph))
  const F2c = roundStep(vertexCorrect(sph + cyl))
  const newCyl = parseFloat((F2c - F1c).toFixed(2))
  return {
    sph: F1c,
    cyl: newCyl !== 0 ? newCyl : null,
    axis: eye.axis,
    add: eye.add,
  }
}

// ─── Motor principal ─────────────────────────────────────────────────────────

/**
 * Procesa la receta del cliente.
 * @param rx - Receta ingresada
 * @param source - 'contacto' = tomar como está, 'gafas' = convertir con vertex
 */
export function convertGlassesToContacts(rx: GlassesRx, source: 'contacto' | 'gafas' = 'contacto'): ConvertedRx {
  let od: ContactRx
  let oi: ContactRx
  let needsVertex = false

  if (source === 'gafas') {
    od = convertEyeFromGlasses(rx.od)
    oi = convertEyeFromGlasses(rx.oi)
    needsVertex = Math.abs(rx.od.sph ?? 0) >= 4 || Math.abs(rx.oi.sph ?? 0) >= 4
  } else {
    // Contacto: valores TAL CUAL
    od = {
      sph: rx.od.sph ?? 0,
      cyl: (rx.od.cyl && rx.od.cyl !== 0) ? rx.od.cyl : null,
      axis: rx.od.axis,
      add: rx.od.add,
    }
    oi = {
      sph: rx.oi.sph ?? 0,
      cyl: (rx.oi.cyl && rx.oi.cyl !== 0) ? rx.oi.cyl : null,
      axis: rx.oi.axis,
      add: rx.oi.add,
    }
  }

  // Determinar tipo y condiciones basado en la receta
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
  if (maxSph >= 8)    condiciones.push('Alta graduación')
  if (!condiciones.length) condiciones.push('Sin graduación')

  let tipo: ConvertedRx['tipo'] = 'esferico'
  let descripcion = ''

  if (allAdd.length > 0 && allCyl.length > 0) {
    tipo = 'multifocal_torico'
    descripcion = 'Tu receta tiene presbicia y astigmatismo. Necesitas lentes multifocales tóricos.'
  } else if (allAdd.length > 0) {
    tipo = 'multifocal'
    descripcion = 'Tu receta incluye adición (ADD) — necesitas lentes multifocales.'
  } else if (allCyl.length > 0) {
    tipo = 'torico'
    descripcion = 'Tu receta tiene cilindro (CYL) — necesitas lentes tóricos para astigmatismo.'
  } else {
    tipo = 'esferico'
    descripcion = maxSph >= 8
      ? 'Graduación alta. Tenemos lentes de rango extendido (XR) para tu receta.'
      : 'Lentes esféricos estándar.'
  }

  return { od, oi, needsVertex: false, tipo, condiciones, descripcion }
}

// ─── Buscar productos compatibles con la receta ──────────────────────────────

export function findCompatibleProducts(rx: ConvertedRx): { slug: string; nombre: string; marca: string; reemplazo: string; extended?: boolean; score: number }[] {
  const sphOD = rx.od.sph ?? 0
  const sphOI = rx.oi.sph ?? 0
  const maxSph = Math.max(Math.abs(sphOD), Math.abs(sphOI))
  const minSphVal = Math.min(sphOD, sphOI) // más negativo
  const maxSphVal = Math.max(sphOD, sphOI) // más positivo
  const cylOD = rx.od.cyl ?? 0
  const cylOI = rx.oi.cyl ?? 0
  const maxCyl = Math.min(cylOD, cylOI) // más negativo = peor caso
  const addOD = rx.od.add ?? 0
  const addOI = rx.oi.add ?? 0
  const maxAdd = Math.max(addOD, addOI)

  const compatible = PRODUCT_RANGES
    .filter(p => p.tipo === rx.tipo)
    .filter(p => {
      // SPH: ambos ojos deben estar dentro del rango
      if (minSphVal < p.sph_min || maxSphVal > p.sph_max) return false
      
      // CYL: para tóricos, verificar rango
      if (rx.tipo === 'torico' || rx.tipo === 'multifocal_torico') {
        if (p.cyl_min == null || p.cyl_max == null) return false
        if (maxCyl < p.cyl_min) return false // CYL demasiado alto para este producto
        if (Math.abs(maxCyl) < Math.abs(p.cyl_max)) return false // CYL demasiado bajo
      }
      
      // ADD: para multifocales
      if (rx.tipo === 'multifocal' || rx.tipo === 'multifocal_torico') {
        if (p.add_min == null || p.add_max == null) return false
        if (maxAdd < p.add_min || maxAdd > p.add_max) return false
      }
      
      return true
    })
    .map(p => {
      // Score: preferir productos de rango estándar sobre XR (más comunes, más baratos)
      let score = 100
      if (p.extended) score -= 10 // XR tiene menos prioridad si hay estándar
      // Preferir marcas premium
      if (p.marca === 'COOPERVISION') score += 5
      if (p.marca === 'ACUVUE') score += 3
      // Preferir si la graduación cae cómodamente dentro del rango (no en los extremos)
      const sphRange = p.sph_max - p.sph_min
      const sphCenter = (p.sph_max + p.sph_min) / 2
      const distFromCenter = Math.abs(((sphOD + sphOI) / 2) - sphCenter) / (sphRange / 2)
      score -= Math.round(distFromCenter * 10) // penalizar si está en extremos
      
      return { slug: p.slug, nombre: p.nombre, marca: p.marca, reemplazo: p.reemplazo, extended: p.extended, score }
    })
    .sort((a, b) => b.score - a.score)

  return compatible
}

// ─── Análisis sin conversión (compatibilidad) ────────────────────────────────

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

// ─── Helpers de formato ──────────────────────────────────────────────────────

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

// ─── SPH/CYL/AXIS/ADD disponibles ────────────────────────────────────────────

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
