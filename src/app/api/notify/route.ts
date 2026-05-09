// ============================================================
// ContactGo — API: Notificaciones de pedidos
// Envía email al cliente + email al admin cuando cambia estado
// POST /api/notify  { order_id, evento: 'nuevo_pedido' | 'estado_cambio', nuevo_estado? }
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'info@contactgo.net'
const FROM_EMAIL  = process.env.RESEND_FROM ?? 'ContactGo <pedidos@contactgo.net>'

const ESTADO_LABEL: Record<string, string> = {
  pendiente:  '⏳ Recibido',
  confirmado: '✅ Confirmado',
  preparando: '📦 Preparando',
  enviado:    '🚚 En camino',
  entregado:  '🎉 Entregado',
  cancelado:  '❌ Cancelado',
}

const ESTADO_MSG: Record<string, string> = {
  pendiente:  'Hemos recibido tu pedido y está pendiente de confirmación.',
  confirmado: 'Tu pedido ha sido confirmado y está siendo procesado.',
  preparando: 'Estamos preparando tus lentes con mucho cuidado.',
  enviado:    'Tu pedido está en camino. Te contactaremos al llegar.',
  entregado:  '¡Tu pedido fue entregado! Esperamos que lo disfrutes.',
  cancelado:  'Tu pedido fue cancelado. Si tienes dudas, contáctanos.',
}

function emailCliente(order: any, items: any[], evento: string, nuevoEstado?: string): string {
  const estado     = nuevoEstado ?? order.estado
  const estadoLabel = ESTADO_LABEL[estado] ?? estado
  const estadoMsg   = ESTADO_MSG[estado] ?? ''
  const pedidoId    = order.id.slice(-8).toUpperCase()
  const isNuevo     = evento === 'nuevo_pedido'

  const itemsHTML = items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <strong style="color:#111;">${i.nombre}</strong>
        ${i.sph != null ? `<br><span style="color:#6b7280;font-size:12px;">Grad: ${i.sph > 0 ? '+' : ''}${i.sph}${i.cyl ? ` · CYL: ${i.cyl}` : ''}${i.color ? ` · ${i.color}` : ''}${i.ojo ? ` · ${i.ojo}` : ''}</span>` : ''}
        <br><span style="color:#9ca3af;font-size:12px;">x${i.cantidad}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;color:#111;">
        RD$${((i.precio ?? 0) * (i.cantidad ?? 1)).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr><td style="background:#16a34a;padding:24px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">ContactGo</h1>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px;">Lentes de Contacto · República Dominicana</p>
        </td></tr>

        <!-- Estado -->
        <tr><td style="padding:28px 32px 16px;text-align:center;">
          <p style="font-size:28px;margin:0;">${isNuevo ? '🎉' : (ESTADO_LABEL[estado]?.split(' ')[0] ?? '📦')}</p>
          <h2 style="margin:8px 0 4px;color:#111;font-size:20px;">
            ${isNuevo ? '¡Pedido recibido!' : `Pedido ${estadoLabel}`}
          </h2>
          <p style="color:#6b7280;margin:0;font-size:14px;">${estadoMsg}</p>
          <div style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:6px 16px;margin-top:12px;">
            <span style="color:#16a34a;font-weight:700;font-size:15px;">#${pedidoId}</span>
          </div>
        </td></tr>

        <!-- Productos -->
        ${items.length > 0 ? `
        <tr><td style="padding:0 32px 16px;">
          <p style="font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Productos</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHTML}
            <tr>
              <td style="padding:12px 0 0;font-weight:600;color:#111;">Total</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;color:#16a34a;font-size:16px;">RD$${order.total?.toLocaleString()}</td>
            </tr>
          </table>
        </td></tr>` : ''}

        <!-- Entrega -->
        <tr><td style="padding:0 32px 16px;">
          <div style="background:#f9fafb;border-radius:10px;padding:14px 16px;">
            <p style="font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">📍 Entrega</p>
            <p style="margin:0;color:#111;font-weight:600;">${order.cliente_nombre}</p>
            <p style="margin:2px 0 0;color:#6b7280;font-size:13px;">${order.direccion_texto ?? ''}</p>
            <p style="margin:2px 0 0;color:#6b7280;font-size:13px;">📞 ${order.cliente_telefono ?? ''}</p>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 32px 28px;text-align:center;">
          <a href="${BASE_URL}/cuenta" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:10px;">
            Ver mis pedidos
          </a>
          <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;">
            ¿Preguntas? Escríbenos al 
            <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '18294089097'}" style="color:#16a34a;">WhatsApp</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">ContactGo · contactgo.net · República Dominicana</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function emailAdmin(order: any, items: any[], evento: string, nuevoEstado?: string): string {
  const pedidoId = order.id.slice(-8).toUpperCase()
  const isNuevo  = evento === 'nuevo_pedido'
  const estado   = nuevoEstado ?? order.estado

  return `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;padding:24px;background:#f9fafb;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 4px;color:#111;">${isNuevo ? '🛍️ Nuevo pedido' : `📋 Estado actualizado: ${ESTADO_LABEL[estado] ?? estado}`}</h2>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">Pedido #${pedidoId}</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
      <tr><td style="padding:4px 0;color:#6b7280;">Cliente</td><td style="padding:4px 0;font-weight:600;text-align:right;">${order.cliente_nombre}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Teléfono</td><td style="padding:4px 0;text-align:right;"><a href="https://wa.me/${(order.cliente_telefono ?? '').replace(/\D/g, '')}" style="color:#16a34a;">${order.cliente_telefono}</a></td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;text-align:right;">${order.cliente_email ?? '—'}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Total</td><td style="padding:4px 0;font-weight:700;text-align:right;color:#16a34a;">RD$${order.total?.toLocaleString()}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Método</td><td style="padding:4px 0;text-align:right;">${order.metodo_pago?.replace('_', ' ')}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Dirección</td><td style="padding:4px 0;text-align:right;">${order.direccion_texto ?? '—'}</td></tr>
    </table>

    ${items.length > 0 ? `
    <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;">
    <p style="font-weight:600;font-size:12px;color:#6b7280;margin:0 0 8px;">PRODUCTOS</p>
    ${items.map(i => `<p style="margin:2px 0;font-size:13px;"><strong>${i.nombre}</strong>${i.sph != null ? ` · Grad:${i.sph > 0 ? '+' : ''}${i.sph}` : ''}${i.cyl ? ` CYL:${i.cyl}` : ''}${i.color ? ` ${i.color}` : ''}${i.ojo ? ` ${i.ojo}` : ''} × ${i.cantidad}</p>`).join('')}
    ` : ''}

    <div style="margin-top:16px;text-align:center;">
      <a href="${BASE_URL}/admin/pedidos" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;">Ver en Admin</a>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { order_id, evento = 'nuevo_pedido', nuevo_estado } = await req.json()

    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'RESEND_API_KEY no configurado' }, { status: 500 })

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Obtener orden + items
    const { data: order } = await sb.from('orders').select('*').eq('id', order_id).single()
    if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

    const { data: items } = await sb.from('order_items').select('*').eq('order_id', order_id)
    const itemsList = items ?? []

    const pedidoId = order.id.slice(-8).toUpperCase()
    const estadoLabel = ESTADO_LABEL[nuevo_estado ?? order.estado] ?? (nuevo_estado ?? order.estado)

    const subject = evento === 'nuevo_pedido'
      ? `✅ Pedido #${pedidoId} recibido — ContactGo`
      : `📦 Tu pedido #${pedidoId} · ${estadoLabel} — ContactGo`

    // Email al cliente
    if (order.cliente_email) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: order.cliente_email,
        subject,
        html: emailCliente(order, itemsList, evento, nuevo_estado),
      })
    }

    // Email al admin (siempre)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: evento === 'nuevo_pedido'
        ? `🛍️ Nuevo pedido #${pedidoId} — RD$${order.total?.toLocaleString()}`
        : `📋 Pedido #${pedidoId} → ${estadoLabel}`,
      html: emailAdmin(order, itemsList, evento, nuevo_estado),
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[notify]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
