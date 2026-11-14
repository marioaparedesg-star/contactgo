import { describe, it, expect } from 'vitest'
import { evaluarReceta, type Receta, type ProductoFabricacion } from '../lib/prescription-recommend'

const ojo = (sph: number, cyl = 0, axis: number | null = null, add: number | null = null) => ({ sph, cyl, axis, add })
const base = { id: 'x', marca: 'M', slug: 'x', precio: 1000, nombre: 'P' }
const esf = (over: Partial<ProductoFabricacion> = {}): ProductoFabricacion => ({
  ...base, tipo: 'esferico', sph_disponibles: [-2, -4, -6, 0], cyl_disponibles: null, axis_disponibles: null, add_disponibles: null, ...over,
} as ProductoFabricacion)
const tor = (over: Partial<ProductoFabricacion> = {}): ProductoFabricacion => ({
  ...base, tipo: 'torico', sph_disponibles: [-2, -3, -4], cyl_disponibles: [-0.75, -1.25], axis_disponibles: [10, 90, 180], add_disponibles: null, ...over,
} as ProductoFabricacion)
const mf = (over: Partial<ProductoFabricacion> = {}): ProductoFabricacion => ({
  ...base, tipo: 'multifocal', sph_disponibles: [-2, -4], cyl_disponibles: null, axis_disponibles: null, add_disponibles: ['Low (+0.75 a +1.25)', 'High (+2.00 a +2.50)'], ...over,
} as ProductoFabricacion)
const mft = (over: Partial<ProductoFabricacion> = {}): ProductoFabricacion => ({
  ...base, tipo: 'multifocal', sph_disponibles: [-2, -4], cyl_disponibles: [-0.75, -1.25], axis_disponibles: [10, 90, 180], add_disponibles: ['+1.00', '+2.00'], ...over,
} as ProductoFabricacion)

const ok = (r: ReturnType<typeof evaluarReceta>) => { if (r.ok !== true) throw new Error('esperaba ok'); return r }

describe('motor de compatibilidad receta → producto', () => {
  it('1. esférica compatible devuelve el producto correcto', () => {
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-2) }, [esf()]))
    expect(r.productos.map(p => p.nombre)).toEqual(['P'])
  })
  it('2. esférica sin producto compatible: lista vacía con nota de asesoría, nunca inventa', () => {
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-12), oi: ojo(-12) }, [esf()]))
    expect(r.productos).toEqual([])
    expect(r.nota).toMatch(/asesoría/)
  })
  it('3. tórica con cilindro y eje válidos', () => {
    const r = ok(evaluarReceta({ tipo: 'torico', od: ojo(-3, -0.75, 90), oi: ojo(-3, -0.75, 90) }, [tor()]))
    expect(r.productos.length).toBe(1)
  })
  it('4. tórica con eje no disponible en la fabricación: no se recomienda', () => {
    const r = ok(evaluarReceta({ tipo: 'torico', od: ojo(-3, -0.75, 45), oi: ojo(-3, -0.75, 45) }, [tor()]))
    expect(r.productos).toEqual([])
  })
  it('5. multifocal con ADD dentro de rango publicado', () => {
    const r = ok(evaluarReceta({ tipo: 'multifocal', od: ojo(-2, 0, null, 1.0), oi: ojo(-2, 0, null, 1.0) }, [mf()]))
    expect(r.productos.length).toBe(1)
  })
  it('6. multifocal con ADD fuera de rango publicado: no se recomienda', () => {
    const r = ok(evaluarReceta({ tipo: 'multifocal', od: ojo(-2, 0, null, 3.0), oi: ojo(-2, 0, null, 3.0) }, [mf()]))
    expect(r.productos).toEqual([])
  })
  it('7. receta mixta: se evalúan ambos ojos; si uno no cabe, no se recomienda', () => {
    const solo2 = esf({ sph_disponibles: [-2] })
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-4) }, [solo2]))
    expect(r.productos).toEqual([])
    const ambos = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-4) }, [esf()]))
    expect(ambos.productos.length).toBe(1)
  })
  it('8. receta que exige multifocal tórico: no se recomienda un multifocal normal', () => {
    const r = ok(evaluarReceta({ tipo: 'multifocal_torico', od: ojo(-2, -1.25, 90, 2.0), oi: ojo(-2, -1.25, 90, 2.0) }, [mf(), mft()]))
    expect(r.productos.map(p => p.cyl_disponibles)).toEqual([[-0.75, -1.25]])
  })
  it('8b. elegir multifocal normal para una receta con astigmatismo devuelve error, no recomendación', () => {
    const r = evaluarReceta({ tipo: 'multifocal', od: ojo(-2, -1.25, 90, 2.0), oi: ojo(-2, -1.25, 90, 2.0) }, [mf()])
    expect(r.ok).toBe(false)
  })
  it('8c. un tórico NO se recomienda para una receta sin astigmatismo', () => {
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-2) }, [tor(), esf()]))
    expect(r.productos.every(p => p.tipo === 'esferico')).toBe(true)
  })
  it('9. valores inválidos o fuera de límites: error 400', () => {
    expect(evaluarReceta({ tipo: 'esferico', od: ojo(40), oi: ojo(-2) }, [esf()])).toMatchObject({ ok: false, status: 400 })
    expect(evaluarReceta({ tipo: 'torico', od: ojo(-2, -0.75, 200), oi: ojo(-2, -0.75, 90) }, [tor()])).toMatchObject({ ok: false, status: 400 })
    expect(evaluarReceta({ tipo: 'esferico', od: ojo(NaN), oi: ojo(-2) }, [esf()])).toMatchObject({ ok: false, status: 400 })
  })
  it('10. catálogo sin parámetros suficientes: no asume compatibilidad y lo reporta', () => {
    const sinDatos = esf({ sph_disponibles: null })
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-2) }, [sinDatos]))
    expect(r.productos).toEqual([])
    expect(r.sin_parametros).toBe(1)
  })
  it('extra: etiquetas de ADD sin números (Low/High) no se interpretan', () => {
    const etiquetas = mf({ add_disponibles: ['Low', 'High'] })
    const r = ok(evaluarReceta({ tipo: 'multifocal', od: ojo(-2, 0, null, 1.0), oi: ojo(-2, 0, null, 1.0) }, [etiquetas]))
    expect(r.productos).toEqual([])
  })
  it('extra: el precio nunca decide compatibilidad (el más barato incompatible se descarta)', () => {
    const barato = esf({ nombre: 'barato', precio: 100, sph_disponibles: [-6] })
    const caro = esf({ nombre: 'caro', precio: 9000 })
    const r = ok(evaluarReceta({ tipo: 'esferico', od: ojo(-2), oi: ojo(-2) }, [barato, caro]))
    expect(r.productos.map(p => p.nombre)).toEqual(['caro'])
  })
  it('extra: tipo elegido que no coincide con la receta devuelve 422', () => {
    const r = evaluarReceta({ tipo: 'esferico', od: ojo(-2, -1.25, 90), oi: ojo(-2) }, [esf()])
    expect(r).toMatchObject({ ok: false, status: 422 })
  })
})
