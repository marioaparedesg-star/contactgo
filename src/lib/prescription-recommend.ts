// Motor de compatibilidad receta → producto. PURO (sin base de datos) para poder probarlo.
// Regla central: si un parámetro necesario no está publicado en el producto, NO se asume
// compatibilidad. Ningún precio decide compatibilidad; el precio solo ordena resultados válidos.

export type TipoLente = 'esferico' | 'torico' | 'multifocal' | 'multifocal_torico'
export const TIPOS: TipoLente[] = ['esferico', 'torico', 'multifocal', 'multifocal_torico']

export type Ojo = { sph: number; cyl: number; axis: number | null; add: number | null }
export type Receta = { tipo: TipoLente; od: Ojo; oi: Ojo }
export type ProductoFabricacion = {
  id: string; nombre: string; tipo: string; precio: number
  sph_disponibles: unknown; cyl_disponibles: unknown; axis_disponibles: unknown; add_disponibles: unknown
  [k: string]: unknown
}
export type Resultado =
  | { ok: false; status: 400 | 422; error: string }
  | { ok: true; productos: ProductoFabricacion[]; total: number; sin_parametros: number; nota?: string }

const TOL_SPH = 0.01, TOL_CYL = 0.01, TOL_AXIS = 0.5

const numeroEn = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  return null
}
const lista = (v: unknown): unknown[] => Array.isArray(v) ? v : []

// Valor exacto dentro de tolerancia contra una lista numérica publicada
function enLista(valores: unknown, objetivo: number, tol: number): boolean {
  return lista(valores).some(x => { const n = numeroEn(x); return n !== null && Math.abs(n - objetivo) <= tol })
}

// ADD: admite rangos "Low (+0.75 a +1.25)" y valores exactos "+1.00".
// Etiquetas sin números ("Low", "Mid", "High") NO se interpretan: no se asume compatibilidad.
export function addCompatible(valores: unknown, add: number): boolean {
  return lista(valores).some(raw => {
    if (typeof raw === 'number') return Math.abs(raw - add) <= 0.01
    const texto = String(raw)
    const nums = (texto.match(/[+-]?\d+(?:\.\d+)?/g) ?? []).map(Number)
    if (nums.length >= 2) {
      const [min, max] = [Math.min(...nums), Math.max(...nums)]
      return add >= min - 0.01 && add <= max + 0.01
    }
    if (nums.length === 1) return Math.abs(nums[0] - add) <= 0.01
    return false
  })
}

const tieneCyl = (p: ProductoFabricacion) => lista(p.cyl_disponibles).length > 0
const tieneAdd = (p: ProductoFabricacion) => lista(p.add_disponibles).length > 0

// ¿El producto puede fabricar este tipo? (usa los datos publicados, no el nombre)
function productoApto(p: ProductoFabricacion, tipo: TipoLente): boolean {
  if (tipo === 'esferico') return !tieneCyl(p) && !tieneAdd(p) && p.tipo === 'esferico'
  if (tipo === 'torico') return p.tipo === 'torico' && tieneCyl(p) && !tieneAdd(p)
  if (tipo === 'multifocal') return p.tipo === 'multifocal' && !tieneCyl(p) && tieneAdd(p)
  return p.tipo === 'multifocal' && tieneCyl(p) && tieneAdd(p) // multifocal_torico
}

function ojoCompatible(p: ProductoFabricacion, ojo: Ojo, tipo: TipoLente): boolean {
  if (!enLista(p.sph_disponibles, ojo.sph, TOL_SPH)) return false
  if (tipo === 'torico' || tipo === 'multifocal_torico') {
    // Un lente tórico requiere cilindro y eje fabricables EN CADA ojo.
    // No se debe sugerir un tórico para un ojo plano ni asumir que se puede pedir CYL 0.
    if (Math.abs(ojo.cyl) <= TOL_CYL) return false
    if (!enLista(p.cyl_disponibles, ojo.cyl, TOL_CYL)) return false
    if (ojo.axis == null || !enLista(p.axis_disponibles, ojo.axis, TOL_AXIS)) return false
  }
  if (tipo === 'multifocal' || tipo === 'multifocal_torico') {
    if (ojo.add == null || ojo.add <= 0 || !addCompatible(p.add_disponibles, ojo.add)) return false
  }
  return true
}

export function evaluarReceta(receta: Receta, productos: ProductoFabricacion[]): Resultado {
  const { tipo, od, oi } = receta
  if (!TIPOS.includes(tipo)) return { ok: false, status: 400, error: 'Tipo de lente inválido' }
  for (const o of [od, oi]) {
    if (!Number.isFinite(o.sph) || !Number.isFinite(o.cyl)) return { ok: false, status: 400, error: 'La receta está incompleta: falta esfera o cilindro' }
    if (o.axis != null && (!Number.isFinite(o.axis) || o.axis < 1 || o.axis > 180)) return { ok: false, status: 400, error: 'Eje fuera de rango (1-180)' }
    if (o.add != null && (!Number.isFinite(o.add) || o.add < 0 || o.add > 6)) return { ok: false, status: 400, error: 'Adición fuera de rango' }
    if (o.sph < -30 || o.sph > 25 || o.cyl > 0.01 || o.cyl < -8) return { ok: false, status: 400, error: 'Valores de la receta fuera de los límites admitidos' }
  }

  // Coherencia: el tipo elegido debe coincidir con lo que dice la receta
  const requiereCyl = [od, oi].some(o => Math.abs(o.cyl) > TOL_CYL)
  const requiereAdd = [od, oi].some(o => o.add != null && o.add > 0)
  const esperado: TipoLente = requiereCyl
    ? (requiereAdd ? 'multifocal_torico' : 'torico')
    : (requiereAdd ? 'multifocal' : 'esferico')
  if (tipo !== esperado) {
    return { ok: false, status: 422, error: `La receta indica lente ${etiqueta(esperado)}, no ${etiqueta(tipo)}. Revisa tu receta o selecciona el tipo correcto.` }
  }
  if ((tipo === 'torico' || tipo === 'multifocal_torico') && (od.axis == null && Math.abs(od.cyl) > TOL_CYL || oi.axis == null && Math.abs(oi.cyl) > TOL_CYL)) {
    return { ok: false, status: 422, error: 'Falta el eje (AXIS) de un ojo con astigmatismo.' }
  }

  const candidatos = productos.filter(p => productoApto(p, tipo))
  const sinParametros = candidatos.filter(p => lista(p.sph_disponibles).length === 0).length
  const compatibles = candidatos
    .filter(p => ojoCompatible(p, od, tipo) && ojoCompatible(p, oi, tipo))
    .sort((a, b) => Number(a.precio) - Number(b.precio))

  if (compatibles.length === 0) {
    return { ok: true, productos: [], total: 0, sin_parametros: sinParametros,
      nota: 'No encontramos un producto con parámetros de fabricación confirmados para tu receta. Solicita asesoría para validar una alternativa.' }
  }
  // Máximo 3 opciones: económica, intermedia y premium (solo el precio ordena)
  let seleccion: ProductoFabricacion[] = compatibles
  if (compatibles.length > 3) {
    seleccion = [compatibles[0], compatibles[Math.floor(compatibles.length / 2)], compatibles[compatibles.length - 1]]
  }
  return { ok: true, productos: seleccion, total: compatibles.length, sin_parametros: sinParametros }
}

function etiqueta(t: TipoLente): string {
  return ({ esferico: 'esférico', torico: 'tórico', multifocal: 'multifocal', multifocal_torico: 'multifocal tórico' } as const)[t]
}
