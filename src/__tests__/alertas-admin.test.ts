import { describe, it, expect } from 'vitest'
import { seleccionarAlertas, type PedidoAlerta } from '../lib/alertas/alertas-admin'
// Datos FICTICIOS
const AHORA = new Date('2026-11-20T13:00:00Z')
const H = 3600e3, D = 24 * H
const base = (over: Partial<PedidoAlerta>): PedidoAlerta => ({ id: 'p1', numero_orden: 'CG-PRUEBA-1', cliente_nombre: 'Prueba', total: 1000, estado: 'recibido', pago_estado: 'pendiente', created_at: new Date(AHORA.getTime() - 3 * H).toISOString(), pagado_en: null, es_prueba: false, ...over })

describe('alertas administrativas', () => {
  it('falta de pago: a las 2 horas o más, sin pagar, genera alerta', () => {
    const r = seleccionarAlertas([base({})], AHORA, new Set())
    expect(r.map(a => a.tipo)).toEqual(['alerta_falta_pago'])
  })
  it('falta de pago: menos de 2 horas no genera alerta', () => {
    const r = seleccionarAlertas([base({ created_at: new Date(AHORA.getTime() - 1 * H).toISOString() })], AHORA, new Set())
    expect(r).toEqual([])
  })
  it('falta de pago: no se repite si ya se envió', () => {
    const r = seleccionarAlertas([base({})], AHORA, new Set(['alerta_falta_pago:p1']))
    expect(r).toEqual([])
  })
  it('pedido de prueba nunca alerta', () => {
    expect(seleccionarAlertas([base({ es_prueba: true })], AHORA, new Set())).toEqual([])
  })
  it('cancelado o entregado no alerta', () => {
    expect(seleccionarAlertas([base({ estado: 'cancelado' }), base({ id: 'p2', estado: 'entregado' })], AHORA, new Set())).toEqual([])
  })
  it('entrega 45 días desde el pago: alerta en la ventana', () => {
    const pagado = new Date(AHORA.getTime() - 45 * D - 1 * H).toISOString()
    const r = seleccionarAlertas([base({ pago_estado: 'pagado', pagado_en: pagado, estado: 'preparando' })], AHORA, new Set())
    expect(r.map(a => a.tipo)).toEqual(['alerta_entrega_45d'])
  })
  it('entrega: 44 días desde el pago no alerta todavía', () => {
    const pagado = new Date(AHORA.getTime() - 44 * D).toISOString()
    const r = seleccionarAlertas([base({ pago_estado: 'pagado', pagado_en: pagado, estado: 'preparando' })], AHORA, new Set())
    expect(r).toEqual([])
  })
  it('entrega: usa la fecha de pago, no la de creación', () => {
    const creado = new Date(AHORA.getTime() - 60 * D).toISOString()
    const pagado = new Date(AHORA.getTime() - 10 * D).toISOString()
    const r = seleccionarAlertas([base({ created_at: creado, pago_estado: 'pagado', pagado_en: pagado, estado: 'preparando' })], AHORA, new Set())
    expect(r).toEqual([])
  })
  it('entrega: no se repite si ya se envió', () => {
    const pagado = new Date(AHORA.getTime() - 45 * D - 1 * H).toISOString()
    const r = seleccionarAlertas([base({ pago_estado: 'pagado', pagado_en: pagado, estado: 'preparando' })], AHORA, new Set(['alerta_entrega_45d:p1']))
    expect(r).toEqual([])
  })
})
