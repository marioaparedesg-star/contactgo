import { getEntregaTextoEmail } from '@/lib/delivery-times'

type Order = Record<string, any>
type OrderItem = Record<string, any>

const BRAND = '#002455'
const ACCENT = '#01B2B7'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
const WA = (process.env.NEXT_PUBLIC_WHATSAPP ?? '18096942268').replace(/\D/g, '')

function esc(value: unknown): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }
  return String(value ?? '').replace(/[&<>"']/g, (char) => entities[char] ?? char)
}
function money(value: unknown): string {
  return `RD$${Number(value ?? 0).toLocaleString('es-DO', { maximumFractionDigits: 2 })}`
}
function orderNumber(order: Order): string {
  return String(order.numero_orden ?? order.id?.slice(-8)?.toUpperCase() ?? '')
}
function deliveryText(items: OrderItem[]): string {
  const estimates = items.map((item) => {
    const tipo = item.products?.tipo ?? item.tipo
    if (!tipo) return ''
    return getEntregaTextoEmail(String(tipo), String(item.nombre ?? ''), item.sph ?? null)
  }).filter(Boolean)
  const unique = [...new Set(estimates)]
  return unique.length
    ? unique.join(' · ')
    : 'El tiempo de entrega se confirmará según la disponibilidad de los productos.'
}

const STATUS: Record<string, { subject: string; title: string; message: string; tag: string }> = {
  pendiente: { subject: 'Pedido recibido', title: 'Recibimos tu pedido', message: 'Tu pedido fue registrado y está pendiente de confirmación.', tag: 'RECIBIDO' },
  recibido: { subject: 'Pedido recibido', title: 'Tu pedido está en revisión', message: 'Recibimos tu pedido y estamos verificando los detalles para continuar.', tag: 'RECIBIDO' },
  confirmado: { subject: 'Pedido confirmado', title: 'Tu pedido está confirmado', message: 'Estamos organizando tu pedido para iniciar su preparación.', tag: 'CONFIRMADO' },
  pago_aprobado: { subject: 'Pago aprobado', title: 'Tu pago fue aprobado', message: 'El pago de tu pedido fue confirmado. Continuaremos con la preparación y te avisaremos en cada etapa.', tag: 'PAGO APROBADO' },
  preparando: { subject: 'Estamos preparando tu pedido', title: 'Estamos preparando tus lentes', message: 'Tu pedido entró en preparación. Te notificaremos cuando avance a la siguiente etapa.', tag: 'EN PREPARACIÓN' },
  fabricante: { subject: 'Pedido solicitado al fabricante', title: 'Tu pedido está en fabricación', message: 'Uno o más productos requieren gestión con el fabricante. Te mantendremos informado sobre el avance.', tag: 'CON FABRICANTE' },
  enviado: { subject: 'Tu pedido fue enviado', title: 'Tu pedido fue despachado', message: 'Tu pedido salió de nuestras instalaciones. Mantente atento a las indicaciones de entrega.', tag: 'DESPACHADO' },
  transito: { subject: 'Tu pedido está en tránsito', title: 'Tus lentes están en camino', message: 'El pedido está en tránsito hacia el destino indicado.', tag: 'EN TRÁNSITO' },
  entregado: { subject: 'Pedido entregado', title: 'Tu pedido fue entregado', message: 'Confirmamos la entrega de tu pedido. Gracias por elegir ContactGo.', tag: 'ENTREGADO' },
  cancelado: { subject: 'Actualización de tu pedido', title: 'Tu pedido fue cancelado', message: 'El pedido fue marcado como cancelado. Si necesitas ayuda, nuestro equipo está disponible para asistirte.', tag: 'CANCELADO' },
}

function itemRows(items: OrderItem[]): string {
  if (!items.length) return '<tr><td style="padding:16px;color:#64748b">No hay productos disponibles para mostrar.</td></tr>'
  return items.map((item) => {
    const name = esc(item.nombre)
    const quantity = Math.max(1, Number(item.cantidad ?? 1))
    const fmt = (value: unknown) => value == null || value === '' ? '' : `${Number(value) > 0 ? '+' : ''}${Number(value).toFixed(2)}`
    const details = [
      item.color ? `Color: ${esc(item.color)}` : '',
      item.sph_od != null || item.sph_oi != null ? `OD ${fmt(item.sph_od)} · OI ${fmt(item.sph_oi)}` : item.sph != null ? `SPH ${fmt(item.sph)}` : '',
      item.cyl_od != null || item.cyl_oi != null ? `CYL OD ${fmt(item.cyl_od)} · OI ${fmt(item.cyl_oi)}` : item.cyl != null && Number(item.cyl) !== 0 ? `CYL ${fmt(item.cyl)}` : '',
      item.axis_od != null || item.axis_oi != null ? `EJE OD ${esc(item.axis_od)}° · OI ${esc(item.axis_oi)}°` : item.axis != null ? `EJE ${esc(item.axis)}°` : '',
      item.add_od || item.add_oi ? `ADD OD ${esc(item.add_od ?? '—')} · OI ${esc(item.add_oi ?? '—')}` : item.add_power ? `ADD ${esc(item.add_power)}` : '',
      item.ojo_mode || item.ojo ? `Ojo: ${esc(item.ojo_mode ?? item.ojo)}` : '',
    ].filter(Boolean).join(' · ')
    return `<tr>
      <td style="padding:14px 0;border-bottom:1px solid #e8edf3">
        <div style="font-size:14px;font-weight:700;color:#172b4d">${name}</div>
        ${details ? `<div style="margin-top:5px;font-size:12px;line-height:1.5;color:#64748b">${details}</div>` : ''}
        <div style="margin-top:4px;font-size:12px;color:#64748b">Cantidad: ${quantity}</div>
      </td>
      <td align="right" valign="top" style="padding:14px 0;border-bottom:1px solid #e8edf3;font-size:13px;font-weight:700;color:#172b4d;white-space:nowrap">${money(Number(item.precio ?? 0) * quantity)}</td>
    </tr>`
  }).join('')
}

export function buildCustomerOrderEmail(order: Order, items: OrderItem[], event: string, state: string): string {
  const meta = event === 'pago_aprobado'
    ? STATUS.pago_aprobado
    : STATUS[state] ?? STATUS.recibido
  const id = esc(orderNumber(order))
  const name = esc(String(order.cliente_nombre ?? 'Cliente').trim().split(/\s+/)[0])
  const total = money(order.total)
  const shipping = Number(order.envio ?? 0)
  const trackingUrl = `${SITE}/cuenta/pedidos`
  const isPaid = order.pago_estado === 'pagado'
  const delivery = deliveryText(items)
  const eventTitle = event === 'nuevo_pedido' && isPaid ? 'Pedido recibido y pago confirmado' : meta.title
  const eventMessage = event === 'nuevo_pedido' && isPaid
    ? 'Recibimos tu pedido y confirmamos el pago. Te mantendremos informado sobre cada etapa.'
    : event === 'nuevo_pedido' ? STATUS.recibido.message : meta.message
  const subject = event === 'pago_aprobado' || (event === 'nuevo_pedido' && isPaid) ? 'Pago aprobado y pedido recibido' : event === 'nuevo_pedido' ? 'Pedido recibido' : meta.subject
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)} · ContactGo</title></head>
  <body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#172b4d">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fa;padding:28px 12px"><tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="padding:22px 32px;background:#fff;border-bottom:1px solid #edf1f5">
          <img src="${SITE}/contactgo-logo.svg" alt="ContactGo" width="210" style="display:block;width:210px;max-width:100%;height:auto;border:0">
          <div style="margin-top:9px;font-size:10px;letter-spacing:1.2px;color:${BRAND}">LENTES DE CONTACTO · REPÚBLICA DOMINICANA</div>
        </td></tr>
        <tr><td style="padding:30px 32px 10px">
          <div style="display:inline-block;padding:6px 10px;border-radius:20px;background:#e8f8f8;color:#007f84;font-size:10px;font-weight:800;letter-spacing:.8px">${esc(event === 'pago_aprobado' || (event === 'nuevo_pedido' && isPaid) ? 'PAGO APROBADO' : event === 'nuevo_pedido' ? 'PEDIDO RECIBIDO' : meta.tag)}</div>
          <h1 style="margin:16px 0 8px;font-size:25px;line-height:1.25;letter-spacing:-.5px;color:${BRAND}">${eventTitle}</h1>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#52647a">Hola ${name}, ${eventMessage}</p>
          <p style="margin:15px 0 0;font-size:12px;color:#64748b">Pedido <strong style="color:${BRAND}">#${id}</strong></p>
        </td></tr>
        ${event === 'nuevo_pedido' ? `<tr><td style="padding:14px 32px 0"><div style="padding:15px 17px;border:1px solid #d9ecee;background:#f3fbfb;border-radius:10px"><div style="font-size:10px;font-weight:800;letter-spacing:.8px;color:#007f84">TIEMPO ESTIMADO</div><div style="margin-top:6px;font-size:13px;line-height:1.6;color:#35536a">${esc(delivery)}</div></div></td></tr>` : ''}
        <tr><td style="padding:24px 32px 0">
          <div style="font-size:11px;font-weight:800;letter-spacing:1px;color:#7b899a">RESUMEN DEL PEDIDO</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${itemRows(items)}</table>
        </td></tr>
        <tr><td style="padding:8px 32px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;border-radius:10px">
            <tr><td style="padding:10px 14px;font-size:12px;color:#64748b">Envío</td><td align="right" style="padding:10px 14px;font-size:12px;color:#334155">${shipping > 0 ? money(shipping) : 'Gratis'}</td></tr>
            <tr><td style="padding:12px 14px;border-top:1px solid #e5eaf0;font-size:14px;font-weight:800;color:${BRAND}">Total del pedido</td><td align="right" style="padding:12px 14px;border-top:1px solid #e5eaf0;font-size:17px;font-weight:800;color:${BRAND}">${total}</td></tr>
            <tr><td colspan="2" style="padding:0 14px 13px;font-size:11px;color:${isPaid ? '#087f5b' : '#9a6700'}">Estado del pago: <strong>${isPaid ? 'Aprobado' : 'Pendiente'}</strong></td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:25px 32px 10px">
          <a href="${esc(trackingUrl)}" style="display:inline-block;padding:13px 22px;background:${ACCENT};border-radius:8px;color:#002b35;text-decoration:none;font-size:13px;font-weight:800">Consultar mi pedido</a>
        </td></tr>
        <tr><td style="padding:20px 32px 26px">
          <div style="border-top:1px solid #edf1f5;padding-top:18px;text-align:center;font-size:12px;line-height:1.7;color:#718096">¿Necesitas ayuda? Escríbenos por <a href="https://wa.me/${WA}" style="color:#007f84;font-weight:700;text-decoration:none">WhatsApp</a>.<br><strong style="color:${BRAND}">ContactGo</strong> · contactgo.net · info@contactgo.net</div>
        </td></tr>
      </table>
      <div style="padding:15px 10px;font-size:10px;color:#9aa6b2;text-align:center">Recibes este correo porque realizaste una compra o solicitaste una actualización de tu pedido.</div>
    </td></tr></table>
  </body></html>`
}

export function buildAdminOrderEmail(order: Order, items: OrderItem[], event: string, state: string): string {
  const id = esc(orderNumber(order))
  const meta = event === 'pago_aprobado' ? STATUS.pago_aprobado : STATUS[state] ?? STATUS.recibido
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#172b4d">
    <div style="max-width:580px;margin:auto;background:#fff;border-radius:14px;overflow:hidden">
      <div style="padding:18px 26px;background:#fff;border-bottom:1px solid #edf1f5"><img src="${SITE}/contactgo-logo.svg" alt="ContactGo" width="190" style="display:block;width:190px;max-width:100%;height:auto;border:0"><div style="margin-top:8px;font-size:10px;letter-spacing:1px;color:${BRAND}">AVISO OPERATIVO</div></div>
      <div style="padding:25px 26px"><div style="font-size:10px;font-weight:800;letter-spacing:1px;color:#00858a">${esc(event === 'pago_aprobado' ? 'PAGO APROBADO' : meta.tag)}</div>
        <h2 style="margin:9px 0;font-size:21px;color:${BRAND}">${esc(event === 'nuevo_pedido' && order.pago_estado === 'pagado' ? 'Nuevo pedido · pago aprobado' : event === 'nuevo_pedido' ? 'Nuevo pedido recibido' : event === 'pago_aprobado' ? 'Pago confirmado' : meta.title)}</h2>
        <p style="font-size:13px;color:#64748b">Pedido #${id} · ${money(order.total)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px">
          <tr><td style="padding:7px 0;color:#64748b">Cliente</td><td align="right" style="font-weight:700">${esc(order.cliente_nombre)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b">Correo</td><td align="right">${esc(order.cliente_email)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b">Teléfono</td><td align="right">${esc(order.cliente_telefono)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b">Pago</td><td align="right">${esc(order.pago_estado)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b">Estado</td><td align="right">${esc(state)}</td></tr>
        </table>
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid #e8edf3;font-size:13px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody>${itemRows(items)}</tbody></table></div>
        <p style="margin:20px 0 0;text-align:center"><a href="${SITE}/admin/pedidos" style="display:inline-block;padding:12px 20px;border-radius:8px;background:${ACCENT};color:#002b35;text-decoration:none;font-size:13px;font-weight:800">Abrir pedidos en administración</a></p>
      </div>
    </div></body></html>`
}
