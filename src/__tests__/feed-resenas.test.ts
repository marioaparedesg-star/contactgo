import { describe, it, expect } from 'vitest'
import { buildReviewsFeed, resenasVerificables, type ResenaFeed, type ProductoFeed } from '../lib/feeds/resenas-producto'
// Datos FICTICIOS
const P: ProductoFeed[] = [{ id: 'p1', nombre: 'Lente ficticio', slug: 'lente-ficticio', sku: 'SKU-1' }]
const base: ResenaFeed = { id: 'r1', product_id: 'p1', nombre: 'Cliente Prueba', rating: 5, comentario: 'Muy cómodo', orden_id: 'o1', aprobado: true, created_at: '2026-11-01T12:00:00Z' }
describe('identificadores para Merchant Center', () => {
  it('usa GTIN cuando existe y SKU si no', () => {
    const xml1 = buildReviewsFeed([base], [{ ...P[0], gtin: '733905579042' }])
    expect(xml1).toContain('<gtin>733905579042</gtin>')
    const xml2 = buildReviewsFeed([base], [{ ...P[0], gtin: null }])
    expect(xml2).toContain('<sku>SKU-1</sku>')
  })
  it('omite reseñas de productos sin GTIN ni SKU (no envía IDs internos)', () => {
    const sinId: ProductoFeed[] = [{ id: 'p1', nombre: 'X', slug: 'x', sku: null, gtin: null }]
    expect(resenasVerificables([base], sinId)).toEqual([])
    expect(buildReviewsFeed([base], sinId)).not.toContain('<review>')
  })
})
describe('feed de reseñas de producto', () => {
  it('incluye solo reseñas aprobadas, con pedido, producto y calificación válida', () => {
    const r = resenasVerificables([base, { ...base, id: 'r2', orden_id: null }, { ...base, id: 'r3', aprobado: false }, { ...base, id: 'r4', rating: 9 }, { ...base, id: 'r5', product_id: 'otro' }, { ...base, id: 'r6', comentario: '  ' }], P)
    expect(r.map(x => x.id)).toEqual(['r1'])
  })
  it('sin reseñas verificables devuelve un feed válido y vacío', () => {
    const xml = buildReviewsFeed([{ ...base, orden_id: null }], P)
    expect(xml).toContain('<reviews>')
    expect(xml).not.toContain('<review>')
  })
  it('escapa caracteres peligrosos', () => {
    const xml = buildReviewsFeed([{ ...base, comentario: 'Bueno & <b>"ok"</b>' }], P)
    expect(xml).toContain('Bueno &amp; &lt;b&gt;&quot;ok&quot;&lt;/b&gt;')
    expect(xml).not.toContain('<b>')
  })
  it('incluye el identificador del producto y la calificación', () => {
    const xml = buildReviewsFeed([base], P)
    expect(xml).toContain('<sku>SKU-1</sku>')
    expect(xml).toContain('<overall min="1" max="5">5</overall>')
  })
})
