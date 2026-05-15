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
// Admin recibe notificaciones en este email
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'maparedes0113@gmail.com'
// FROM: si RESEND_FROM está configurado con dominio verificado, úsalo.
// Si no, usa onboarding@resend.dev (funciona sin verificar dominio propio)
const FROM_EMAIL  = process.env.RESEND_FROM ?? 'ContactGo <onboarding@resend.dev>'

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
  const estado      = nuevoEstado ?? order.estado
  const estadoMsg   = ESTADO_MSG[estado] ?? ''
  const pedidoId    = (order.numero_orden ?? order.id.slice(-8).toUpperCase())
  const isNuevo     = evento === 'nuevo_pedido'
  const totalNum    = order.total ?? 0
  const envioNum    = order.envio ?? 0
  const descNum     = order.descuento ?? 0
  const subtotalConITBIS = totalNum - envioNum - descNum
  const itbis       = Math.round(subtotalConITBIS * 18 / 118)
  const subtotalSinITBIS = subtotalConITBIS - itbis
  const fecha       = new Date(order.created_at ?? Date.now())
    .toLocaleDateString('es-DO', { day:'2-digit', month:'long', year:'numeric' })

  const metodoPagoLabel = order.metodo_pago === 'tarjeta'
    ? '💳 Tarjeta de crédito/débito (AZUL)'
    : '💵 Contra entrega — Efectivo'

  // Fila de cada producto con prescripción completa
  const itemsRows = items.map(i => {
    const sph = i.sph != null ? (Number(i.sph) > 0 ? `+${Number(i.sph).toFixed(2)}` : Number(i.sph).toFixed(2)) : null
    const receta = [
      sph ? `SPH ${sph}` : null,
      i.cyl && i.cyl !== 0 ? `CYL ${Number(i.cyl).toFixed(2)}` : null,
      i.axis ? `${i.axis}°` : null,
      i.add_power ? `ADD ${i.add_power}` : null,
      i.color ? i.color : null,
    ].filter(Boolean).join(' · ')
    const ojoLabel = i.ojo === 'OD' ? '👁 Ojo Derecho' : i.ojo === 'OI' ? '👁 Ojo Izquierdo' : null
    const subtotal = (Number(i.precio ?? 0) * Number(i.cantidad ?? 1))
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;vertical-align:top;">
          <p style="margin:0;font-weight:700;color:#111;font-size:13px;">${i.nombre}</p>
          ${ojoLabel ? `<span style="display:inline-block;background:${i.ojo==='OD'?'#dbeafe':'#ccfbf1'};color:${i.ojo==='OD'?'#1d4ed8':'#0f766e'};font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px;margin:3px 0;">${ojoLabel}</span>` : ''}
          ${receta ? `<p style="margin:3px 0 0;color:#4b5563;font-size:11px;font-family:monospace;">${receta}</p>` : ''}
          <p style="margin:3px 0 0;color:#9ca3af;font-size:11px;">Cantidad: ${i.cantidad}</p>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;vertical-align:top;white-space:nowrap;">
          <p style="margin:0;font-weight:700;color:#111;font-size:13px;">RD$${subtotal.toLocaleString()}</p>
          <p style="margin:2px 0 0;color:#9ca3af;font-size:11px;">RD$${Number(i.precio ?? 0).toLocaleString()} c/u</p>
        </td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Comprobante ContactGo #${pedidoId}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 16px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr><td style="background:#16a34a;padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <p style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">ContactGo</p>
          <p style="margin:2px 0 0;color:#bbf7d0;font-size:12px;">Lentes de Contacto · República Dominicana</p>
        </td>
        <td style="text-align:right;">
          <p style="margin:0;color:#bbf7d0;font-size:11px;">COMPROBANTE DE PAGO</p>
          <p style="margin:2px 0 0;color:#ffffff;font-weight:700;font-size:14px;">#${pedidoId}</p>
          <p style="margin:2px 0 0;color:#bbf7d0;font-size:11px;">${fecha}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SALUDO -->
  <tr><td style="padding:24px 32px 0;">
    <p style="margin:0;font-size:16px;color:#111;font-weight:700;">
      ${isNuevo ? `¡Hola ${order.cliente_nombre?.split(' ')[0] ?? ''}, tu pedido está confirmado! 🎉` : `Actualización de tu pedido #${pedidoId}`}
    </p>
    <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
      ${isNuevo ? 'Hemos recibido tu pedido y estamos procesándolo. A continuación tu comprobante completo.' : estadoMsg}
    </p>
  </td></tr>

  <!-- DATOS CLIENTE Y ENTREGA -->
  <tr><td style="padding:16px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;" colspan="2">
          <p style="margin:0;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Datos del pedido</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 16px;border-right:1px solid #e5e7eb;vertical-align:top;width:50%;">
          <p style="margin:0;font-size:10px;color:#9ca3af;font-weight:600;">CLIENTE</p>
          <p style="margin:3px 0 0;font-size:13px;font-weight:700;color:#111;">${order.cliente_nombre}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">${order.cliente_email}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">${order.cliente_telefono ?? ''}</p>
        </td>
        <td style="padding:10px 16px;vertical-align:top;width:50%;">
          <p style="margin:0;font-size:10px;color:#9ca3af;font-weight:600;">ENTREGA</p>
          <p style="margin:3px 0 0;font-size:13px;font-weight:700;color:#111;">${order.cliente_nombre}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">${order.direccion_texto ?? ''}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">República Dominicana</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- PRODUCTOS -->
  ${items.length > 0 ? `
  <tr><td style="padding:16px 32px 0;">
    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Productos ordenados</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#f9fafb;">
        <td style="padding:8px 12px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;">Producto</td>
        <td style="padding:8px 12px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Subtotal</td>
      </tr>
      ${itemsRows}
    </table>
  </td></tr>` : ''}

  <!-- TOTALES -->
  <tr><td style="padding:12px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">Subtotal (sin ITBIS)</td>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6;">RD$${subtotalSinITBIS.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">ITBIS (18%)</td>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6;">RD$${itbis.toLocaleString()}</td>
      </tr>
      ${descNum > 0 ? `<tr>
        <td style="padding:8px 16px;font-size:12px;color:#16a34a;border-bottom:1px solid #f3f4f6;">Descuento</td>
        <td style="padding:8px 16px;font-size:12px;color:#16a34a;text-align:right;border-bottom:1px solid #f3f4f6;">-RD$${descNum.toLocaleString()}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">Envío</td>
        <td style="padding:8px 16px;font-size:12px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6;">${envioNum > 0 ? `RD$${envioNum.toLocaleString()}` : 'Gratis'}</td>
      </tr>
      <tr style="background:#f0fdf4;">
        <td style="padding:12px 16px;font-size:16px;font-weight:900;color:#16a34a;">TOTAL</td>
        <td style="padding:12px 16px;font-size:16px;font-weight:900;color:#16a34a;text-align:right;">RD$${totalNum.toLocaleString()}</td>
      </tr>
    </table>
  </td></tr>

  <!-- MÉTODO DE PAGO -->
  <tr><td style="padding:12px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:10px 16px;border-right:1px solid #e5e7eb;width:50%;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;">Método de pago</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:700;color:#111;">${metodoPagoLabel}</p>
          ${order.azul_auth_code ? `<p style="margin:2px 0 0;font-size:11px;color:#6b7280;">Auth: ${order.azul_auth_code}</p>` : ''}
          <p style="margin:2px 0 0;font-size:11px;color:#6b7280;">Moneda: Peso Dominicano (RD$)</p>
        </td>
        <td style="padding:10px 16px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#9ca3af;font-weight:600;text-transform:uppercase;">Estado</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:900;color:${order.pago_estado==='pagado'?'#16a34a':'#d97706'};">
            ${order.pago_estado === 'pagado' ? '✅ PAGADO' : '⏳ PENDIENTE'}
          </p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BOTONES CTA -->
  <tr><td style="padding:20px 32px;text-align:center;">
    <a href="${BASE_URL}/recibo?orden=${order.id}" 
       style="display:inline-block;background:#0d6efd;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:11px 24px;border-radius:8px;margin:0 6px 8px;">
      🧾 Ver comprobante completo
    </a>
    <a href="${BASE_URL}/cuenta"
       style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:11px 24px;border-radius:8px;margin:0 6px 8px;">
      📦 Seguir mi pedido
    </a>
    <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
      ¿Dudas? Escríbenos por
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? '18294728328'}?text=Hola%2C+tengo+una+pregunta+sobre+mi+pedido+%23${pedidoId}" style="color:#16a34a;font-weight:600;"> WhatsApp (829) 472-8328</a>
    </p>
  </td></tr>

  <!-- SEGURIDAD -->
  <tr><td style="padding:0 32px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;">
      <tr>
        <td style="font-size:10px;color:#9ca3af;padding:0 8px 0 0;white-space:nowrap;">Pago seguro:</td>
        <td>
          <span style="font-size:10px;background:#1a1f71;color:#fff;padding:2px 7px;border-radius:3px;font-weight:700;margin-right:4px;">VISA</span>
          <span style="font-size:10px;background:#EB001B;color:#fff;padding:2px 7px;border-radius:3px;font-weight:700;margin-right:4px;">Mastercard</span>
          <span style="font-size:10px;border:1px solid #1a1f71;color:#1a1f71;padding:2px 7px;border-radius:3px;font-weight:700;margin-right:4px;">Verified by VISA</span>
          <span style="font-size:10px;border:1px solid #EB001B;color:#EB001B;padding:2px 7px;border-radius:3px;font-weight:700;margin-right:4px;">Mastercard ID Check</span>
          <span style="font-size:10px;background:#16a34a;color:#fff;padding:2px 7px;border-radius:3px;font-weight:700;">🔒 SSL</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#f9fafb;padding:14px 32px;text-align:center;border-top:1px solid #f3f4f6;">
    <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
      <strong style="color:#6b7280;">ContactGo</strong> · contactgo.net · info@contactgo.net · (829) 472-8328<br>
      Santo Domingo, República Dominicana · No aceptamos devoluciones después de 30 días.
    </p>
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

    // WhatsApp al cliente — solo para pedidos nuevos
    if (evento === 'nuevo_pedido' && order.cliente_telefono) {
      const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
      fetch(`${BASE}/api/whatsapp/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id,
          cliente_nombre: order.cliente_nombre,
          cliente_telefono: order.cliente_telefono,
          total: order.total,
          numero_orden: order.numero_orden,
          metodo_pago: order.metodo_pago,
        })
      }).then(r => r.json())
        .then(d => console.log('[notify] WA:', d?.success ? '✅ enviado' : d))
        .catch(e => console.error('[notify] WA error:', e))
    }

    // Email al admin (siempre)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL, 'maparedes0113@gmail.com'].filter((v,i,a)=>a.indexOf(v)===i),
      subject: evento === 'nuevo_pedido'
        ? `🛍️ Nuevo pedido #${pedidoId} — RD$${order.total?.toLocaleString()}`
        : `📋 Pedido #${pedidoId} → ${estadoLabel}`,
      html: emailAdmin(order, itemsList, evento, nuevo_estado),
    })

    // Registrar recompra automáticamente para pedidos nuevos
    if (evento === 'nuevo_pedido') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'}/api/recompra/registrar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id })
        })
      } catch (e) { /* no bloquear si falla */ }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[notify]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
