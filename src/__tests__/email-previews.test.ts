import { it, expect } from 'vitest'
import { writeFileSync } from 'fs'
import { buildCustomerOrderEmail, buildAdminOrderEmail } from '../lib/email/order-templates'

// DATOS FICTICIOS. No corresponden a ningún pedido ni cliente real.
const order = {
  id: 'prueba-000', numero_orden: 'CG-PRUEBA-0001', cliente_nombre: 'Cliente de Prueba',
  cliente_email: 'maparedes0113@gmail.com', cliente_telefono: '8090000000',
  total: 3650, envio: 250, subtotal: 3400, descuento: 0, metodo_pago: 'tarjeta',
  pago_estado: 'pagado', direccion_texto: 'Calle de Prueba 123, Santo Domingo',
  created_at: '2026-11-15T14:00:00Z', fecha: '2026-11-15T14:00:00Z', tracking: 'PRUEBA-TRK-0001',
}
const items = [{ nombre: 'PRUEBA · Lente diario ficticio', cantidad: 1, precio: 3400, sph_od: -2.0, sph_oi: -2.0, product_id: 'x', products: { tipo: 'esferico', imagen_url: '/products/dailies-aquacomfort-plus.jpg' } }]
const estados = ['recibido', 'confirmado', 'pago_aprobado', 'preparando', 'fabricante', 'enviado', 'transito', 'entregado', 'cancelado']
const generados: string[] = []

it('renderiza plantillas de cliente y administración con datos ficticios', () => {
  for (const estado of estados) {
    const html = buildCustomerOrderEmail(order, items, estado === 'pago_aprobado' ? 'pago_aprobado' : 'estado_cambio', estado)
    expect(html.length).toBeGreaterThan(500)
    expect(html).not.toMatch(/\{\{|undefined|null/)
    expect(html).toContain('/logo.png')
    expect(html).toContain('dailies-aquacomfort-plus.jpg')
    writeFileSync(`/tmp/email-previews/cliente-${estado}.html`, '<!-- PRUEBA: datos ficticios -->\n' + html)
    generados.push(`cliente-${estado}`)
  }
  const admin = buildAdminOrderEmail(order, items, 'nuevo_pedido', 'recibido')
  writeFileSync('/tmp/email-previews/admin-nuevo_pedido.html', '<!-- PRUEBA: datos ficticios -->\n' + admin)
  generados.push('admin-nuevo_pedido')
  expect(generados.length).toBe(estados.length + 1)
})
