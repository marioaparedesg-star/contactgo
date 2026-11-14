import { describe, it, expect } from 'vitest'
import { convertGlassesToContacts } from '../lib/prescription'

const eye = (sph: number | null, cyl: number | null = null, axis: number | null = null, add: number | null = null) => ({ sph, cyl, axis, add })
const rx = (od: ReturnType<typeof eye>, oi: ReturnType<typeof eye> = od) => ({ od, oi }) as any

// Referencia: F_c = F_g / (1 - 0.012 * F_g), vértice 12 mm, aplicado con |F| >= 4.00 D
describe('conversión gafas → lentes de contacto (vértice 12 mm)', () => {
  it('-3.00 D (menos de 4 D) no se corrige', () => {
    const r = convertGlassesToContacts(rx(eye(-3)), 'gafas')
    expect(r.od.sph).toBe(-3)
    expect(r.needsVertex).toBe(false)
  })
  it('-6.00 D → -5.597 → -5.50 D (paso 0.25 hasta ±6 D)', () => {
    const r = convertGlassesToContacts(rx(eye(-6)), 'gafas')
    expect(r.od.sph).toBe(-5.5)
    expect(r.needsVertex).toBe(true)
  })
  it('-8.00 D → -7.299 → -7.50 D (miopía alta: en contacto se necesita MENOS potencia)', () => {
    const r = convertGlassesToContacts(rx(eye(-8)), 'gafas')
    expect(r.od.sph).toBe(-7.5)
  })
  it('+6.00 D → +6.466 → +6.50 D (hipermetropía también se corrige)', () => {
    const r = convertGlassesToContacts(rx(eye(6)), 'gafas')
    expect(r.od.sph).toBe(6.5)
  })
  it('astigmatismo: -6.00 / -1.00 x 90 → meridianos -5.597 (→ -5.50) y -6.458 (→ -6.50): cilindro -1.00', () => {
    const r = convertGlassesToContacts(rx(eye(-6, -1, 90)), 'gafas')
    expect(r.od.sph).toBe(-5.5)
    expect(r.od.cyl).toBe(-1)
    expect(r.od.axis).toBe(90)
    expect(r.tipo).toBe('torico')
  })
  it('el eje no cambia con la conversión', () => {
    const r = convertGlassesToContacts(rx(eye(-2, -1.5, 175)), 'gafas')
    expect(r.od.axis).toBe(175)
  })
  it('receta de contacto se usa tal cual, sin vértice', () => {
    const r = convertGlassesToContacts(rx(eye(-6)), 'contacto')
    expect(r.od.sph).toBe(-6)
    expect(r.needsVertex).toBe(false)
  })
  it('tipo y condiciones salen de la receta CONVERTIDA: cilindro que desaparece no deja un "tórico" sin cilindro', () => {
    // -3.00 / -0.25: tras la conversión el cilindro sigue siendo -0.25 (no es 0): tórico, que el motor
    // evaluará contra los cilindros publicados (mín. -0.75) y dirá que hace falta asesoría.
    const r = convertGlassesToContacts(rx(eye(-3, -0.25, 90)), 'gafas')
    expect(r.tipo).toBe('torico')
    expect(r.od.cyl).not.toBeNull()
  })
  it('multifocal tórico se detecta cuando hay cilindro y adición', () => {
    const r = convertGlassesToContacts(rx(eye(-2, -1, 90, 2)), 'gafas')
    expect(r.tipo).toBe('multifocal_torico')
  })
  it('sin cilindro ni adición: esférico y condición "Sin graduación" solo si es plano', () => {
    expect(convertGlassesToContacts(rx(eye(-2)), 'gafas').tipo).toBe('esferico')
    expect(convertGlassesToContacts(rx(eye(0)), 'gafas').condiciones).toContain('Sin graduación')
  })
})
