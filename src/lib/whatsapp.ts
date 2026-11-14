import { enVentanaWhatsApp, proximaVentanaWhatsApp } from './whatsapp-horario'
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

// ─── Interruptor de pausa (2026-10-07, a pedido explícito de Mario) ───
// Bloquea TODO mensaje saliente hacia clientes hasta que él mismo lo
// reactive — el número de Mario (809-694-2268) queda exento a propósito,
// para que él nunca se quede sin sus propias notificaciones de admin.
// Se revisa una sola vez por request y se cachea 30s para no golpear la
// base de datos en cada envío dentro del mismo lote de un cron.
const NUMERO_ADMIN_MARIO = '18096942268'
let _pausaCache: { valor: boolean; expira: number } | null = null

async function clientesPausados(): Promise<boolean> {
  if (_pausaCache && _pausaCache.expira > Date.now()) return _pausaCache.valor
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await sb.from('configuracion_sistema').select('valor')
      .eq('clave', 'whatsapp_clientes_pausado').single()
    const valor = data?.valor === 'true'
    _pausaCache = { valor, expira: Date.now() + 30000 }
    return valor
  } catch {
    // FAIL-CLOSED: si no podemos leer la bandera, NO enviar a clientes.
    // Una pausa pedida por el dueño no puede fallar abierta.
    return true
  }
}

const NUMERO_ADMIN = '18096942268' // admin exento: nunca se bloquea ni se encola

// ─── PUNTO ÚNICO DE SALIDA A WHATSAPP ───
// Toda salida (funciones, rutas, crons) pasa por aquí. Reglas:
//  1) Admin → se envía siempre.
//  2) Cliente con pausa activa → no se envía (lanza error).
//  3) Cliente fuera de horario (lun–sáb 9:00–18:00 RD) → se ENCOLA para la
//     siguiente ventana (wa_retry_queue) y lo envía el cron whatsapp-diferidos.
//  4) Cliente dentro de horario y sin pausa → se envía.
export type ResultadoEnvio = { estado: 'enviado' | 'diferido'; data?: any }

export async function enviarWA(to: string, body: Record<string, any>): Promise<ResultadoEnvio> {
  const phone = normalizePhone(to)
  const payload = { messaging_product: 'whatsapp', ...body, to: phone }
  if (phone !== NUMERO_ADMIN) {
    if (await clientesPausados()) {
      throw new Error('WHATSAPP_CLIENTES_PAUSADO: envío a clientes pausado — no se intentó.')
    }
    if (!enVentanaWhatsApp()) {
      await encolarDiferido(phone, payload)
      return { estado: 'diferido' }
    }
  }
  const res = await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return { estado: 'enviado', data }
}

async function encolarDiferido(phone: string, payload: any) {
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await sb.from('wa_retry_queue').insert({
    evento_id: `diferido:${Date.now()}:${phone}`,
    telefono: phone,
    mensaje: JSON.stringify(payload),
    tipo: 'raw',
    attempt: 0,
    max_attempts: 5,
    next_retry_at: proximaVentanaWhatsApp().toISOString(),
    resolved: false,
  })
  if (error) throw new Error('No se pudo encolar el mensaje fuera de horario: ' + error.message)
}

// Reemplazo de fetch() para rutas que construyen su propio cuerpo JSON.
// Pasa por enviarWA: pausa, horario y cola. Devuelve un Response compatible.
export async function fetchWA(phone: string, init: { body: string; [k: string]: any }): Promise<Response> {
  const body = JSON.parse(init.body)
  const r = await enviarWA(phone, body)
  if (r.estado === 'diferido') {
    return new Response(JSON.stringify({ deferred: true }), { status: 202, headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify(r.data), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function sendText(to: string, text: string) {
  const r = await enviarWA(to, { type: 'text', text: { body: text } })
  return r.data ?? { deferred: true }
}

// ─── Enviar template (funciona SIEMPRE, sin ventana 24h) ───
export async function sendTemplate(
  to: string,
  templateName: string,
  params: string[],
  lang = 'es'
) {
  const components: any[] = []
  if (params.length > 0) {
    components.push({
      type: 'body',
      parameters: params.map(p => ({ type: 'text', text: p })),
    })
  }
  const r = await enviarWA(to, {
    type: 'template',
    template: { name: templateName, language: { code: lang }, components },
  })
  return r.data ?? { deferred: true }
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
  return sendTemplate(data.telefono, 'solicitar_resena_v2', [nombre])
}

// ─── Enviar mensaje interactivo con botones (máx 3) ───
export async function sendButtons(
  to: string,
  bodyText: string,
  buttons: { id: string; title: string }[],
  headerText?: string,
  footerText?: string,
) {
  const r = await enviarWA(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      ...(headerText ? { header: { type: 'text', text: headerText } } : {}),
      body: { text: bodyText },
      ...(footerText ? { footer: { text: footerText } } : {}),
      action: {
        buttons: buttons.map(b => ({ type: 'reply', reply: { id: b.id, title: b.title } })),
      },
    },
  })
  return r.data ?? { deferred: true }
}
