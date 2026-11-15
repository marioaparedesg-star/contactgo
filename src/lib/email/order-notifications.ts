import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { buildCustomerOrderEmail, buildAdminOrderEmail } from '@/lib/email/order-templates'

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
function esperar(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }
async function enviarEmailConReintentos(resend: Resend, params: { from: string; to: string; subject: string; html: string }) {
  const waits = [800, 1600]
  let lastError: string | undefined
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, error } = await resend.emails.send(params)
      if (!error) return { resendId: data?.id, error: undefined }
      lastError = error.message
    } catch (error: any) { lastError = error?.message ?? 'Error desconocido' }
    if (attempt < 3) await esperar(waits[attempt - 1])
  }
  return { resendId: undefined, error: lastError ?? 'No se pudo enviar el correo' }
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'maparedes0113@gmail.com'
const FROM_EMAIL = process.env.RESEND_FROM ?? 'ContactGo <notifications@contactgo.net>'
const ESTADO_LABEL: Record<string, string> = {
  recibido: 'Pedido recibido', pendiente: 'Pedido recibido', pago_aprobado: 'Pago aprobado',
  confirmado: 'Pedido confirmado', preparando: 'En preparación', fabricante: 'En fabricación',
  enviado: 'En camino', transito: 'En tránsito', entregado: 'Entregado', cancelado: 'Cancelado',
}
const EVENT_STATUS: Record<string, string> = {
  pendiente: 'Pedido recibido', recibido: 'Pedido recibido', pago_aprobado: 'Pago aprobado',
  confirmado: 'Pedido confirmado', preparando: 'En preparación', fabricante: 'En fabricación',
  enviado: 'Pedido despachado', transito: 'Pedido en tránsito', entregado: 'Pedido entregado',
  cancelado: 'Pedido cancelado',
}

type EmailEvent = 'nuevo_pedido' | 'estado_cambio' | 'pago_aprobado'
type EmailStatus = 'sent' | 'error' | 'skipped'
function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function enviarNotificacionPedido(orderId: string, evento: EmailEvent, nuevoEstado?: string) {
  if (!orderId) return { email_cliente: 'error', error: 'order_id requerido' }
  if (!process.env.RESEND_API_KEY) return { email_cliente: 'error', error: 'RESEND_API_KEY no configurado' }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const sb = supabaseAdmin()
    const { data: order, error: orderError } = await sb.from('orders').select('*').eq('id', orderId).single()
    if (orderError || !order) return { email_cliente: 'error', error: 'Orden no encontrada' }

    // State is always taken from the persisted order, never from caller-controlled input.
    const validStates = ['pendiente', 'recibido', 'pago_aprobado', 'confirmado', 'preparando', 'fabricante', 'enviado', 'transito', 'entregado', 'cancelado']
    const requestedState = String(nuevoEstado ?? '')
    const state = evento === 'estado_cambio' && validStates.includes(requestedState) && requestedState === String(order.estado)
      ? requestedState
      : String(order.estado ?? 'recibido')
    if (evento === 'pago_aprobado' && order.pago_estado !== 'pagado') {
      return { email_cliente: 'error', error: 'No se puede notificar un pago que no está aprobado' }
    }
    const { data: itemsData, error: itemsError } = await sb.from('order_items')
      .select('*, products(tipo, imagen_url)').eq('order_id', orderId)
    if (itemsError) console.error('[order-notifications] no se pudieron leer artículos:', itemsError.message)
    const items = itemsData ?? []

    const isPaidEvent = evento === 'pago_aprobado' || (evento === 'nuevo_pedido' && order.pago_estado === 'pagado')
    const stateLabel = ESTADO_LABEL[state] ?? state
    const subject = isPaidEvent
      ? `Pago aprobado · Pedido #${order.numero_orden ?? order.id.slice(-8).toUpperCase()} — ContactGo`
      : evento === 'nuevo_pedido'
        ? `Pedido #${order.numero_orden ?? order.id.slice(-8).toUpperCase()} recibido — ContactGo`
        : `ContactGo · ${EVENT_STATUS[state] ?? stateLabel}`
    // The orders UPDATE trigger writes one immutable row per real state transition.
    // Use that row's ID as the idempotency key: returning to the same state is
    // a new event, while retrying the same transition must not send twice.
    let transitionId: string | null = null
    if (evento === 'estado_cambio') {
      const { data: history, error: historyError } = await sb.from('order_status_history')
        .select('id, estado').eq('order_id', orderId)
        .order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (historyError || !history || history.estado !== state) {
        console.error('[order-notifications] no se pudo identificar transición:', historyError?.message ?? 'historial no coincide')
        return { email_cliente: 'error', error: 'No se pudo identificar el cambio de estado para notificar' }
      }
      transitionId = history.id
    }
    const template = isPaidEvent ? 'pago_aprobado' : evento === 'nuevo_pedido' ? 'confirmacion_orden'
      : `actualizacion_estado_${state}__${transitionId}`
    const result: { email_cliente: EmailStatus; email_error?: string; email_admin?: EmailStatus } = { email_cliente: 'skipped' }
    if (order.cliente_email) {
      const { data: prior, error: priorError } = await sb.from('email_log').select('id')
        .eq('order_id', orderId).eq('template', template).eq('status', 'sent').maybeSingle()
      if (priorError) console.error('[order-notifications] duplicado: consulta de email_log falló:', priorError.message)
      // Deduplicate the same transition, not every occurrence of this state.
      if (prior) {
        result.email_cliente = 'sent'
      } else {
        const sent = await enviarEmailConReintentos(resend, {
          from: FROM_EMAIL, to: order.cliente_email, subject,
          html: buildCustomerOrderEmail(order, items, evento, state),
        })
        result.email_cliente = sent.error ? 'error' : 'sent'
        if (sent.error) result.email_error = sent.error
        // Only a successfully accepted email participates in the unique
        // (order_id, template) sent-event dedup index. Failed attempts stay
        // in the audit log but can be retried without a unique-index conflict.
        if (sent.error) {
          const { error: logError } = await sb.from('email_log').insert({
            order_id: orderId, template, to_email: order.cliente_email, subject,
            resend_id: null, status: 'error',
          })
          if (logError) console.error('[order-notifications] no se pudo guardar error de email cliente:', logError.message)
        } else {
          const { error: logError } = await sb.from('email_log').insert({
            order_id: orderId, template, to_email: order.cliente_email, subject,
            resend_id: sent.resendId ?? null, status: 'sent',
          })
          if (logError) console.error('[order-notifications] no se pudo guardar email_log cliente:', logError.message)
        }
      }
    } else {
      result.email_cliente = 'skipped'
      result.email_error = 'La orden no tiene correo electrónico de cliente'
    }

    const adminTemplate = isPaidEvent ? 'admin_pago_aprobado' : evento === 'nuevo_pedido' ? 'admin_nuevo_pedido'
      : `admin_estado_${state}__${transitionId}`
    const adminSubject = isPaidEvent
      ? `Pago aprobado #${order.numero_orden ?? order.id.slice(-8).toUpperCase()} — RD$${Number(order.total ?? 0).toLocaleString('es-DO')}`
      : evento === 'nuevo_pedido'
        ? `Nuevo pedido #${order.numero_orden ?? order.id.slice(-8).toUpperCase()} — RD$${Number(order.total ?? 0).toLocaleString('es-DO')}`
        : `Pedido #${order.numero_orden ?? order.id.slice(-8).toUpperCase()} → ${stateLabel}`
    const adminRecipientIsCustomer = String(ADMIN_EMAIL).trim().toLowerCase() === String(order.cliente_email ?? '').trim().toLowerCase()
    if (adminRecipientIsCustomer) {
      // Never send the internal admin template to the customer's address.
      result.email_admin = 'skipped'
      console.warn('[order-notifications] aviso administrativo omitido: ADMIN_EMAIL coincide con el correo del cliente')
    } else {
      const { data: adminPrior, error: adminPriorError } = await sb.from('email_log').select('id')
        .eq('order_id', orderId).eq('template', adminTemplate).eq('status', 'sent').maybeSingle()
      if (adminPriorError) console.error('[order-notifications] dedup admin lookup failed:', adminPriorError.message)
      // Same event key also protects the administrative notification.
      if (adminPrior) {
        result.email_admin = 'sent'
      } else {
        // Los avisos internos usan la misma política de reintentos que los correos
        // al cliente. Un fallo transitorio de Resend no debe dejar sin alerta al equipo.
        const adminSent = await enviarEmailConReintentos(resend, {
          from: FROM_EMAIL, to: ADMIN_EMAIL, subject: adminSubject,
          html: buildAdminOrderEmail(order, items, evento, state),
        })
        const adminError = adminSent.error
        const adminResendId = adminSent.resendId
        result.email_admin = adminError ? 'error' : 'sent'
        // Persist failed attempts for diagnostics, but never let a failed
        // attempt occupy the unique sent-event slot.
        if (adminError) {
          const { error: logError } = await sb.from('email_log').insert({
            order_id: orderId, template: adminTemplate, to_email: ADMIN_EMAIL, subject: adminSubject,
            resend_id: null, status: 'error',
          })
          if (logError) console.error('[order-notifications] no se pudo guardar error email_log admin:', logError.message)
        } else {
          const { error: logError } = await sb.from('email_log').insert({
            order_id: orderId, template: adminTemplate, to_email: ADMIN_EMAIL, subject: adminSubject,
            resend_id: adminResendId ?? null, status: 'sent',
          })
          if (logError) console.error('[order-notifications] no se pudo guardar email_log admin:', logError.message)
        }
      }
    }
    return result
  } catch (error: any) {
    console.error('[order-notifications]', error)
    return { email_cliente: 'error', error: error?.message ?? 'Error de notificación' }
  }
}
