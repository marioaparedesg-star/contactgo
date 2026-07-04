// ============================================================
// ContactGo — WhatsApp Business API Client
// Phone Number ID: 1135396942998591
// Business Account ID: 1321141390231786
// ============================================================

const WA_API_URL = 'https://graph.facebook.com/v20.0'
const PHONE_ID   = process.env.WHATSAPP_PHONE_ID ?? '1135396942998591'
const TOKEN      = process.env.WHATSAPP_TOKEN    ?? ''

// Normaliza número dominicano a formato internacional
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // Ya tiene código de país
  if (digits.startsWith('1') && digits.length === 11) return digits
  if (digits.startsWith('809') || digits.startsWith('829') || digits.startsWith('849')) {
    return '1' + digits
  }
  if (digits.length === 10) return '1' + digits
  return digits
}

// Enviar mensaje de texto libre (solo para ventana de 24h)
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
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

// Enviar plantilla de mensaje (funciona fuera de ventana de 24h)
export async function sendTemplate(to: string, template: string, components: any[] = [], lang = 'es') {
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
      type: 'template',
      template: {
        name: template,
        language: { code: lang },
        components,
      },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

// Mensaje de confirmación de pedido
export async function sendOrderConfirmation(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
  total: number
  items: Array<{ nombre: string; cantidad: number }>
}) {
  const nombre    = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const pedidoId  = order.numero_orden ?? ''
  const total     = `RD$${(order.total / 100).toLocaleString('es-DO')}`
  const productos = order.items.map(i => `• ${i.nombre} x${i.cantidad}`).join('\n')

  const mensaje = `👁️ ¡Hola ${nombre}! Tu pedido en *ContactGo* está confirmado ✅

📦 *Pedido #${pedidoId}*
${productos}

💳 *Total:* ${total}
🚚 *Entrega:* 24-48 horas en toda RD

Recibirás otro mensaje cuando tus lentes estén en camino.

¿Tienes alguna pregunta? Responde aquí y te atendemos de inmediato. 😊`

  return sendText(order.cliente_telefono, mensaje)
}

// Mensaje de pedido en camino
export async function sendShippingNotification(order: {
  cliente_telefono: string
  cliente_nombre: string
  numero_orden: string
}) {
  const nombre   = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const pedidoId = order.numero_orden ?? ''

  const mensaje = `🚚 *¡Tus lentes están en camino, ${nombre}!*

Tu pedido *#${pedidoId}* de ContactGo ya fue enviado y llegará pronto a tu puerta.

📍 Estimado de entrega: hoy o mañana

¿Tienes alguna pregunta sobre tu entrega? Responde aquí. 👇`

  return sendText(order.cliente_telefono, mensaje)
}

// Mensaje de recordatorio de renovación (25 días después de compra mensual)
export async function sendRenewalReminder(customer: {
  telefono: string
  nombre: string
  producto: string
}) {
  const nombre = customer.nombre?.split(' ')[0] ?? 'Cliente'

  const mensaje = `👁️ Hola *${nombre}*, ¿cómo van tus lentes de contacto?

En pocos días se vence tu ciclo mensual de *${customer.producto}*.

🔄 Renuévalos ahora y los recibes antes de que se te acaben:
👉 www.contactgo.net

¿Los mismos o quieres probar algo nuevo? Te ayudo aquí mismo. 😊`

  return sendText(customer.telefono, mensaje)
}

// Mensaje de recuperación de carrito abandonado
export async function sendCartRecovery(customer: {
  telefono: string
  nombre: string
  productos: string[]
}) {
  const nombre    = customer.nombre?.split(' ')[0] ?? ''
  const productos = customer.productos.join(', ')

  const mensaje = `👋 Hola${nombre ? ` *${nombre}*` : ''}! Vimos que dejaste algo en tu carrito en ContactGo.

🛒 *${productos}*

¿Tuviste algún problema al comprar? Podemos ayudarte ahora mismo o completar el pedido por WhatsApp.

👉 www.contactgo.net/cart`

  return sendText(customer.telefono, mensaje)
}
