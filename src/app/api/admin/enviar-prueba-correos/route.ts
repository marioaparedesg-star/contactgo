// PRUEBA: envía a la dirección administrativa cada plantilla de pedido real, con datos ficticios.
// Protegido con CRON_SECRET. Nunca envía a clientes. Usa la misma clave y remitente de producción.
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildCustomerOrderEmail, buildAdminOrderEmail } from '@/lib/email/order-templates'
import { BIENVENIDA, buildEducationalEmail } from '@/lib/email/educational-templates'

export const dynamic = 'force-dynamic'

const ADMIN = process.env.ADMIN_EMAIL ?? 'maparedes0113@gmail.com'
const FROM = 'ContactGo <info@contactgo.net>'
const ESTADOS: Array<[string, string, string]> = [
  ['recibido', 'Pedido recibido', 'estado_cambio'],
  ['confirmado', 'Pedido confirmado', 'estado_cambio'],
  ['pago_aprobado', 'Pago aprobado', 'pago_aprobado'],
  ['preparando', 'Pedido en preparación', 'estado_cambio'],
  ['fabricante', 'Solicitado al fabricante', 'estado_cambio'],
  ['enviado', 'Pedido despachado', 'estado_cambio'],
  ['transito', 'Pedido en tránsito', 'estado_cambio'],
  ['entregado', 'Pedido entregado', 'estado_cambio'],
  ['cancelado', 'Pedido cancelado', 'estado_cambio'],
]

const order = {
  id: 'prueba-000', numero_orden: 'CG-PRUEBA-0001', cliente_nombre: 'Cliente de Prueba',
  cliente_email: ADMIN, cliente_telefono: '8090000000', total: 3650, envio: 250, subtotal: 3400,
  descuento: 0, metodo_pago: 'tarjeta', pago_estado: 'pagado', direccion_texto: 'Calle de Prueba 123, Santo Domingo',
  created_at: '2026-11-15T14:00:00Z', fecha: '2026-11-15T14:00:00Z', tracking: 'PRUEBA-TRK-0001',
}
const items = [{ nombre: 'PRUEBA · Lente diario ficticio', cantidad: 1, precio: 3400, sph_od: -2, sph_oi: -2,
  products: { tipo: 'esferico', imagen_url: '/products/dailies-aquacomfort-plus.jpg' } }] as any

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const resultados: Array<{ plantilla: string; ok: boolean; id?: string; error?: string }> = []
  const envios = [
    ...ESTADOS.map(([estado, titulo, evento]) => ({
      nombre: `Cliente · ${titulo}`,
      subject: `PRUEBA · ${titulo} (datos ficticios)`,
      html: buildCustomerOrderEmail(order as any, items, evento, estado),
    })),
    ...BIENVENIDA.map(e => ({
      nombre: `Educativo · ${e.id}`,
      subject: `PRUEBA · ${e.subject}`,
      html: buildEducationalEmail(e),
    })),
    {
      nombre: 'Administración · Nuevo pedido',
      subject: 'PRUEBA · Administración · Nuevo pedido (datos ficticios)',
      html: buildAdminOrderEmail(order as any, items, 'nuevo_pedido', 'recibido'),
    },
  ]
  for (const e of envios) {
    const { data, error } = await resend.emails.send({
      from: FROM, to: ADMIN, replyTo: 'info@contactgo.net', subject: e.subject, html: e.html,
      text: `PRUEBA con datos ficticios. Plantilla: ${e.nombre}. Vea la versión HTML.`,
    })
    resultados.push({ plantilla: e.nombre, ok: !error, id: data?.id, error: error?.message })
  }
  return NextResponse.json({ destino: ADMIN, enviados: resultados.filter(r => r.ok).length, resultados })
}
