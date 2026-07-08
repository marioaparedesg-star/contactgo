// ============================================================
// ContactGo — WhatsApp Business API Client
// Phone Number ID: 1237770472751989
// Business Account ID: 998977189800215
// ============================================================

const WA_API_URL = 'https://graph.facebook.com/v20.0'
const PHONE_ID   = process.env.WHATSAPP_PHONE_ID ?? '1237770472751989'
const TOKEN      = process.env.WHATSAPP_TOKEN    ?? ''

// Normaliza número dominicano a formato internacional
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('1') && digits.length === 11) return digits
  if (digits.startsWith('809') || digits.startsWith('829') || digits.startsWith('849')) {
    return '1' + digits
  }
  if (digits.length === 10) return '1' + digits
  return digits
}

// ─── Enviar mensaje de texto libre (solo ventana 24h) ───
export async function sendText(to: string, text: string) {
  const phone = normalizePhone(to)
  const res = await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: text },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data
}

// ─── Enviar template (funciona SIEMPRE, sin ventana 24h) ───
export async function sendTemplate(
  to: string,
  templateName: string,
  params: string[],
  lang = 'es'
) {
  const phone = normalizePhone(to)
  const components: any[] = []
  if (params.length > 0) {
    components.push({
      type: 'body',
      parameters: params.map(p => ({ type: 'text', text: p })),
    })
  }
  const res = await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: lang },
        components,
      },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data
}

// ─── Enviar con fallback: intenta texto libre, si falla usa template ───
export async function sendSmart(
  to: string,
  text: string,
  templateName: string,
  templateParams: string[]
) {
  try {
    // Intentar texto libre primero (mejor experiencia, más flexible)
    const res = await sendText(to, text)
    return res
  } catch (err: any) {
    const errMsg = err.message ?? ''
    // Si es error de ventana de 24h (131047) o no suscrito, usar template
    if (errMsg.includes('131047') || errMsg.includes('131026') || errMsg.includes('131049') || errMsg.includes('133010') || errMsg.includes('130429')) {
      return sendTemplate(to, templateName, templateParams)
    }
    throw err
  }
}

// ─── Funciones de notificación específicas ───

export async function sendOrderConfirmation(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
  total?: number
  items?: { nombre: string; cantidad: number }[]
}) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(order.cliente_telefono, 'confirmacion_pedido', [
    nombre,
    order.numero_orden,
  ])
}

export async function sendOrderUpdate(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
}, estado: string, descripcion: string) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(order.cliente_telefono, 'actualizacion_pedido', [
    nombre,
    order.numero_orden,
    descripcion,
  ])
}

export async function sendShippingNotification(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
}) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(order.cliente_telefono, 'pedido_enviado', [
    nombre,
    order.numero_orden,
    'hoy o mañana',
    order.numero_orden,
  ])
}

export async function sendDeliveredNotification(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
}) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(order.cliente_telefono, 'pedido_entregado', [
    order.numero_orden,
    nombre,
  ])
}

export async function sendCancelledNotification(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
  motivo?: string
}) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(order.cliente_telefono, 'pedido_cancelado', [
    nombre,
    order.numero_orden,
    order.motivo ?? 'no se completó el pago',
  ])
}

export async function sendWelcome(data: {
  telefono: string
  nombre?: string
}) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(data.telefono, 'bienvenida_cliente', [nombre])
}

export async function sendCartRecovery(data: {
  telefono: string
  nombre?: string
  productos?: string
}) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(data.telefono, 'carrito_abandonado', [
    nombre,
    data.productos ?? 'tus productos seleccionados',
  ])
}

export async function sendRenewalReminder(data: {
  telefono: string
  nombre?: string
  producto?: string
}) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(data.telefono, 'renovacion_lentes', [
    nombre,
    data.producto ?? 'tus lentes de contacto',
  ])
}

export async function sendReviewRequest(data: {
  telefono: string
  nombre?: string
}) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  return sendTemplate(data.telefono, 'solicitar_resena', [nombre])
}
