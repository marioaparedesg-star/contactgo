// ============================================================
// ContactGo — Servicio Central de Notificaciones WhatsApp
// USA TEMPLATES (no texto libre) — garantiza entrega siempre
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { sendTemplate, sendText, normalizePhone } from '@/lib/whatsapp'

export const SUPPORT_NUMBER = '18096942268'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function notificar(
  eventoId: string,
  telefono: string | null | undefined,
  tipo: string,
  templateName: string,
  params: string[],
  opts?: { order_id?: string; user_id?: string }
): Promise<{ ok: boolean; skipped?: string; error?: string; wa_id?: string }> {
  if (!telefono) return { ok: false, skipped: 'sin_telefono' }
  const phone = normalizePhone(telefono)
  if (phone.length < 10) return { ok: false, skipped: 'telefono_invalido' }

  const sb = getSb()

  // Dedup
  const { data: yaEnviado } = await sb
    .from('wa_automation_log')
    .select('id, wa_message_id')
    .eq('evento_id', eventoId)
    .eq('estado', 'sent')
    .maybeSingle()
  if (yaEnviado) return { ok: true, skipped: 'ya_enviado', wa_id: yaEnviado.wa_message_id ?? undefined }

  try {
    const res = await sendTemplate(phone, templateName, params)
    const wa_id = res?.messages?.[0]?.id ?? null
    await sb.from('wa_automation_log').insert({
      evento_id: eventoId, telefono: phone, tipo, estado: 'sent',
      wa_message_id: wa_id, order_id: opts?.order_id ?? null,
      user_id: opts?.user_id ?? null, attempt: 1,
    })
    return { ok: true, wa_id }
  } catch (err: any) {
    const errMsg = err.message?.slice(0, 500) ?? 'unknown'
    await sb.from('wa_automation_log').insert({
      evento_id: eventoId, telefono: phone, tipo, estado: 'failed',
      error: errMsg, order_id: opts?.order_id ?? null,
      user_id: opts?.user_id ?? null, attempt: 1,
    })
    return { ok: false, error: errMsg }
  }
}

// ═══════════════════════════════════════════════════════════
// NOTIFICACIONES POR EVENTO
// ═══════════════════════════════════════════════════════════

export async function notificarPedidoConfirmado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const items = Array.isArray(order.items)
    ? order.items.slice(0, 3).map((i: any) => `${i.nombre ?? 'Producto'}${i.cantidad > 1 ? ` x${i.cantidad}` : ''}`).join(' · ')
    : 'Lentes de contacto'
  const total = `RD$${Number(order.total ?? 0).toLocaleString('es-DO')}`
  return notificar(`order_${order.id}_pagado`, order.cliente_telefono, 'confirmacion',
    'confirmacion_pedido', [nombre, num, items, total], { order_id: order.id })
}

export async function notificarEstado(order: any, estado: string) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)

  const mensajes: Record<string, string> = {
    recibido:      '✅ Recibimos tu pedido y ya lo tenemos en nuestro sistema.',
    pago_aprobado: '💳 Tu pago fue aprobado. Comenzamos a preparar tu pedido.',
    confirmado:    '✅ Pedido confirmado. Ya estamos trabajando en él.',
    preparando:    '🔬 Estamos preparando cuidadosamente tus lentes.',
    fabricante:    '🏭 Estamos coordinando con el fabricante para tu producto.',
    transito:      '🚛 Tu pedido va en camino hacia tu dirección.',
  }
  const desc = mensajes[estado] ?? `Estado actualizado: ${estado}`

  return notificar(`order_${order.id}_${estado}`, order.cliente_telefono, `estado_${estado}`,
    'cg_estado_pedido', [nombre, num, desc], { order_id: order.id })
}

export async function notificarEnviado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  return notificar(`order_${order.id}_enviado`, order.cliente_telefono, 'estado_enviado',
    'cg_envio', [nombre, num, 'hoy o mañana', num], { order_id: order.id })
}

export async function notificarEntregado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  return notificar(`order_${order.id}_entregado`, order.cliente_telefono, 'estado_entregado',
    'cg_entregado', [num, nombre], { order_id: order.id })
}

export async function notificarCancelado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const motivo = order.notas_admin?.startsWith('Auto-cancelado')
    ? 'no se completó el pago a tiempo'
    : (order.notas_admin?.slice(0, 80) ?? 'motivos operativos')
  return notificar(`order_${order.id}_cancelado`, order.cliente_telefono, 'estado_cancelado',
    'cg_cancelado', [nombre, num, motivo], { order_id: order.id })
}

export async function notificarBienvenida(user: { user_id: string; nombre?: string; telefono?: string }) {
  if (!user.telefono) return { ok: false, skipped: 'sin_telefono' }
  const nombre = user.nombre?.split(' ')[0] ?? 'Cliente'
  return notificar(`user_${user.user_id}_bienvenida`, user.telefono, 'bienvenida',
    'cg_bienvenida', [nombre], { user_id: user.user_id })
}

export async function notificarCarritoAbandonado(data: { telefono: string; nombre?: string; productos?: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  const productos = data.productos ?? 'tus productos seleccionados'
  const eventoId = `carrito_${normalizePhone(data.telefono)}_${new Date().toISOString().slice(0, 10)}`
  return notificar(eventoId, data.telefono, 'carrito',
    'carrito_abandonado', [nombre, productos])
}

export async function notificarRenovacion(data: { telefono: string; nombre?: string; producto?: string; order_id?: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  const producto = data.producto ?? 'tus lentes de contacto'
  return notificar(`renovacion_${data.order_id ?? normalizePhone(data.telefono)}`, data.telefono, 'renovacion',
    'renovacion_lentes', [nombre, producto], { order_id: data.order_id })
}

export async function notificarResena(data: { telefono: string; nombre?: string; order_id?: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  return notificar(`resena_${data.order_id ?? normalizePhone(data.telefono)}`, data.telefono, 'resena',
    'solicitar_resena', [nombre], { order_id: data.order_id })
}

// Para mensajes que NO tienen template (cambios de perfil, etc.)
// Estos solo funcionan dentro de ventana 24h
export async function notificarTextoLibre(
  eventoId: string, telefono: string, mensaje: string, tipo: string,
  opts?: { order_id?: string; user_id?: string }
) {
  if (!telefono) return { ok: false, skipped: 'sin_telefono' }
  const phone = normalizePhone(telefono)
  const sb = getSb()

  const { data: yaEnviado } = await sb
    .from('wa_automation_log').select('id').eq('evento_id', eventoId).eq('estado', 'sent').maybeSingle()
  if (yaEnviado) return { ok: true, skipped: 'ya_enviado' }

  try {
    const res = await sendText(phone, mensaje)
    const wa_id = res?.messages?.[0]?.id ?? null
    await sb.from('wa_automation_log').insert({
      evento_id: eventoId, telefono: phone, tipo, estado: 'sent',
      wa_message_id: wa_id, order_id: opts?.order_id ?? null,
      user_id: opts?.user_id ?? null, attempt: 1,
    })
    return { ok: true, wa_id }
  } catch {
    return { ok: false, error: 'fuera_de_ventana_24h' }
  }
}
