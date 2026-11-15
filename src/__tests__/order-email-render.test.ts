import { describe, it, expect } from 'vitest'
import { buildCustomerOrderEmail, buildAdminOrderEmail } from '../lib/email/order-templates'

// Datos FICTICIOS. No corresponden a pedidos ni clientes reales.
const order = {
  id: 'prueba-000', numero_orden: 'CG-PRUEBA-0001', cliente_nombre: 'Cliente de Prueba',
  cliente_email: 'prueba@example.invalid', total: 3650, envio: 250, subtotal: 3400, descuento: 0,
  metodo_pago: 'tarjeta', pago_estado: 'pagado', direccion_texto: 'Calle de Prueba 123, Santo Domingo',
  created_at: '2026-11-15T14:00:00Z', fecha: '2026-11-15T14:00:00Z', tracking: 'PRUEBA-TRK-0001',
}
const items = [{ nombre: 'PRUEBA · Lente diario ficticio', cantidad: 1, precio: 3400, sph_od: -2, sph_oi: -2,
  products: { tipo: 'esferico', imagen_url: '/products/dailies-aquacomfort-plus.jpg' } }]
const estados = ['recibido', 'confirmado', 'pago_aprobado', 'preparando', 'fabricante', 'enviado', 'transito', 'entregado', 'cancelado']

describe('plantillas de correo de pedido', () => {
  for (const estado of estados) {
    it(`cliente/${estado}: logo oficial, imagen de producto y sin variables sin resolver`, () => {
      const html = buildCustomerOrderEmail(order, items, estado === 'pago_aprobado' ? 'pago_aprobado' : 'estado_cambio', estado)
      expect(html).toContain('/logo.png')
      expect(html).not.toContain('contactgo-logo.svg')
      expect(html).toContain('/products/dailies-aquacomfort-plus.jpg')
      expect(html).not.toMatch(/\{\{|undefined|null/)
    })
  }
  it('administrativa: muestra el costo de envío y el total del pedido', () => {
    const html = buildAdminOrderEmail(order, items, 'nuevo_pedido', 'recibido')
    expect(html).toContain('/logo.png')
    expect(html).toContain('Envío')
    expect(html).toContain('RD$250')
    expect(html).toContain('RD$3,650')
    expect(html).not.toContain('contactgo-logo.svg')
    expect(html).not.toMatch(/\{\{|undefined|null/)
  })
  it('artículo sin imagen no deja un enlace roto', () => {
    const html = buildCustomerOrderEmail(order, [{ ...items[0], products: { tipo: 'esferico', imagen_url: null } }], 'estado_cambio', 'recibido')
    expect(html).not.toMatch(/src="undefined"|src=""/)
  })
})
