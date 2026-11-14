import { describe, it, expect } from 'vitest'
import { convertGlassesToContacts } from '../lib/prescription'
import { evaluarReceta, type ProductoFabricacion } from '../lib/prescription-recommend'

// Mismo payload que envía la página (conv.tipo + valores convertidos por ojo)
const payloadDe = (conv: ReturnType<typeof convertGlassesToContacts>) => ({
  tipo: conv.tipo,
  od: { sph: conv.od.sph ?? 0, cyl: conv.od.cyl ?? 0, axis: conv.od.axis ?? null, add: conv.od.add ?? null },
  oi: { sph: conv.oi.sph ?? 0, cyl: conv.oi.cyl ?? 0, axis: conv.oi.axis ?? null, add: conv.oi.add ?? null },
})

// Catálogo con la forma real de la base (listas numéricas de la BD)
const rango = (a: number, b: number, paso: number) => { const r: number[] = []; for (let v = a; v <= b + 1e-9; v += paso) r.push(Math.round(v * 100) / 100); return r }
const ejes10 = rango(10, 180, 10)
const cat: ProductoFabricacion[] = [
  { id: 'e1', nombre: '1-DAY ACUVUE MOIST', tipo: 'esferico', precio: 3800, sph_disponibles: rango(-10, 8, 0.25), cyl_disponibles: null, axis_disponibles: null, add_disponibles: null } as any,
  { id: 't1', nombre: '1-DAY ACUVUE MOIST for Astigmatism', tipo: 'torico', precio: 5900, sph_disponibles: rango(-10, 8, 0.25), cyl_disponibles: [-0.75, -1.25, -1.75, -2.25], axis_disponibles: ejes10, add_disponibles: null } as any,
]
const recomendar = (rx: any) => evaluarReceta(payloadDe(convertGlassesToContacts(rx, 'gafas')) as any, cat)

describe('flujo completo: gafas → conversión → motor', () => {
  it('gafas esféricas -3.00 D (ambos ojos) recomiendan lente esférico', () => {
    const rx = { od: { sph: -3, cyl: 0, axis: null, add: null }, oi: { sph: -3, cyl: 0, axis: null, add: null } }
    const r: any = recomendar(rx)
    expect(r.ok).toBe(true)
    expect(r.productos.map((p: any) => p.id)).toEqual(['e1'])
  })
  it('gafas -3.00 / -1.00 x 90 (astigmatismo) recomiendan tórico, no esférico', () => {
    const rx = { od: { sph: -3, cyl: -1, axis: 90, add: null }, oi: { sph: -3, cyl: -1, axis: 90, add: null } }
    const conv = convertGlassesToContacts(rx as any, 'gafas')
    expect(conv.tipo).toBe('torico')
    const r: any = recomendar(rx)
    expect(r.ok).toBe(true)
    expect(r.productos.map((p: any) => p.id)).toEqual(['t1'])
  })
  it('gafas -6.00 D se convierten a -5.50 y siguen recomendando un esférico compatible', () => {
    const rx = { od: { sph: -6, cyl: 0, axis: null, add: null }, oi: { sph: -6, cyl: 0, axis: null, add: null } }
    const r: any = recomendar(rx)
    expect(r.productos.map((p: any) => p.id)).toEqual(['e1'])
  })
})
