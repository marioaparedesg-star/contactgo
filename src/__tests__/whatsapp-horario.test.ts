import { describe, it, expect } from 'vitest'
import { enVentanaWhatsApp, proximaVentanaWhatsApp, partesRD } from '../lib/whatsapp-horario'

// RD = UTC-4. Helper: fecha local RD → Date
const rd = (iso: string) => new Date(iso + '-04:00')

describe('ventana de WhatsApp (America/Santo_Domingo, lunes–sábado 9:00–18:00)', () => {
  it('lunes 9:00 RD está dentro', () => expect(enVentanaWhatsApp(rd('2026-11-16T09:00:00'))).toBe(true))
  it('lunes 8:59 RD está fuera', () => expect(enVentanaWhatsApp(rd('2026-11-16T08:59:00'))).toBe(false))
  it('lunes 17:59 RD está dentro', () => expect(enVentanaWhatsApp(rd('2026-11-16T17:59:00'))).toBe(true))
  it('lunes 18:00 RD está fuera (6 p. m. excluido)', () => expect(enVentanaWhatsApp(rd('2026-11-16T18:00:00'))).toBe(false))
  it('sábado 12:00 RD está dentro', () => expect(enVentanaWhatsApp(rd('2026-11-21T12:00:00'))).toBe(true))
  it('domingo 12:00 RD está fuera', () => expect(enVentanaWhatsApp(rd('2026-11-22T12:00:00'))).toBe(false))
  it('usa la zona RD aunque el servidor esté en UTC', () => {
    // 13:00 UTC = 9:00 RD (lunes): debe estar dentro
    expect(enVentanaWhatsApp(new Date('2026-11-16T13:00:00Z'))).toBe(true)
    // 12:59 UTC = 8:59 RD: fuera
    expect(enVentanaWhatsApp(new Date('2026-11-16T12:59:00Z'))).toBe(false)
  })
  it('partesRD devuelve día y hora en RD', () => {
    expect(partesRD(new Date('2026-11-16T13:00:00Z'))).toMatchObject({ dow: 1, hour: 9, minute: 0 })
  })
})

describe('próxima ventana', () => {
  it('si ya está dentro, devuelve el mismo instante', () => {
    const d = rd('2026-11-16T10:00:00')
    expect(proximaVentanaWhatsApp(d).getTime()).toBe(d.getTime())
  })
  it('lunes 19:00 → martes 9:00 RD', () => {
    const r = proximaVentanaWhatsApp(rd('2026-11-16T19:00:00'))
    expect(partesRD(r)).toMatchObject({ dow: 2, hour: 9 })
  })
  it('sábado 19:00 → lunes 9:00 RD (salta el domingo)', () => {
    const r = proximaVentanaWhatsApp(rd('2026-11-21T19:00:00'))
    expect(partesRD(r)).toMatchObject({ dow: 1, hour: 9 })
  })
  it('domingo 10:00 → lunes 9:00 RD', () => {
    const r = proximaVentanaWhatsApp(rd('2026-11-22T10:00:00'))
    expect(partesRD(r)).toMatchObject({ dow: 1, hour: 9 })
  })
  it('la próxima ventana siempre es posterior a la consulta', () => {
    const d = rd('2026-11-22T23:30:00')
    expect(proximaVentanaWhatsApp(d).getTime()).toBeGreaterThan(d.getTime())
  })
})
