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

// Arma un texto legible del mensaje automático para mostrar en la bandeja.
// No reconstruye el template exacto (eso vive en Meta), pero da contexto claro
// al agente de servicio al cliente sobre qué se le envió al cliente.
function cuerpoLegible(templateName: string, params: string[], tipo: string): string {
  const p = params ?? []
  switch (templateName) {
    case 'confirmacion_pedido':
      return `✅ Confirmación de pedido enviada — ${p[1] ?? ''} · ${p[2] ?? ''} · Total ${p[3] ?? ''}`
    case 'cg_estado_pedido':
    case 'cg_estado_pedido_v2':
      return `📦 Actualización de estado — pedido ${p[1] ?? ''}: ${p[2] ?? ''}`
    case 'cg_envio':
      return `🚚 Aviso de envío enviado — pedido ${p[1] ?? ''}`
    case 'cg_entregado':
      return `📬 Confirmación de entrega enviada — pedido ${p[0] ?? ''}`
    case 'cg_cancelado':
      return `❌ Aviso de cancelación enviado — pedido ${p[1] ?? ''} (${p[2] ?? ''})`
    case 'cg_bienvenida':
      return `👋 Mensaje de bienvenida enviado a ${p[0] ?? 'cliente'}`
    case 'carrito_abandonado':
      return `🛒 Recordatorio de carrito enviado — ${p[1] ?? ''}`
    case 'renovacion_lentes':
      return `🔄 Recordatorio de renovación enviado — ${p[1] ?? ''}`
    case 'solicitar_resena_v2':
      return `⭐ Solicitud de reseña enviada a ${p[0] ?? 'cliente'}`
    default:
      return `📤 Mensaje automático enviado (${templateName})`
  }
}

// Plantillas que SIEMPRE deben llegar aunque haya una incidencia abierta —
// información esencial del pedido, no promocional (ver principio de separar
// "transaccional" de "comercial").
const TEMPLATES_TRANSACCIONALES = new Set([
  'confirmacion_pedido', 'cg_estado_pedido', 'cg_estado_pedido_v2', 'cg_envio', 'cg_entregado', 'cg_cancelado',
])

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

  // Si el cliente tiene una incidencia abierta, no se le manda NADA comercial
  // (recompra, carrito abandonado, reseña, cross-sell) hasta resolverla.
  // Los mensajes transaccionales del pedido sí pasan siempre.
  if (!TEMPLATES_TRANSACCIONALES.has(templateName)) {
    const { data: incidenciaAbierta } = await sb
      .from('incidencias')
      .select('id')
      .eq('cliente_telefono', phone)
      .neq('estado', 'resuelta')
      .maybeSingle()
    if (incidenciaAbierta) return { ok: false, skipped: 'incidencia_abierta' }
  }

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
    // También registrar en la bandeja de WhatsApp (whatsapp_messages) para que
    // el mensaje automático sea visible en Servicio al Cliente como saliente.
    try {
      await sb.from('whatsapp_messages').insert({
        wa_message_id: wa_id,
        phone,
        direction: 'outbound',
        message_type: 'template',
        body: cuerpoLegible(templateName, params, tipo),
        status: 'sent',
        read: true,
      })
    } catch (bandejaErr: any) {
      console.error('[wa-notif] bandeja insert error:', bandejaErr?.message)
    }
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

  // FIX (2026-08-10): antes decían solo "Estado actualizado: X" pegado a un
  // prefijo repetitivo ("📦 Actualización de estado — pedido X:") — se veía
  // robótico y frío, siempre la misma frase cambiando solo el final. Ahora
  // cada mensaje se siente como si alguien real te estuviera avisando, con
  // calidez y sin sonar a plantilla genérica.
  const mensajes: Record<string, string> = {
    recibido:      '🎉 ¡Ya recibimos tu pedido! Lo tenemos en nuestro sistema y en breve empezamos a prepararlo con todo el cuidado.',
    pago_aprobado: '✅ ¡Tu pago quedó aprobado! Ya estamos alistando todo para que tus lentes lleguen lo antes posible.',
    confirmado:    '👍 Tu pedido está confirmado — nuestro equipo ya está trabajando en él, un paso más cerca de tus lentes nuevos.',
    preparando:    '🔬 Estamos preparando tus lentes con mucho cuidado, verificando cada detalle antes de enviarlos.',
    fabricante:    '🏭 Tu pedido está en fabricación a tu medida exacta — por eso toma un poco más de tiempo, pero vale la pena.',
    transito:      '🚛 ¡Tus lentes ya van en camino! Muy pronto los vas a tener en tus manos.',
  }
  const desc = mensajes[estado] ?? `Estado actualizado: ${estado}`

  // NOTA (2026-08-10): el texto de arriba ya se mejoró (más cálido). La
  // plantilla en sí (cg_estado_pedido_v2, sin el prefijo repetitivo) está
  // creada y pendiente de aprobación de Meta — hasta que se apruebe, se usa
  // la plantilla vieja para no dejar a los clientes sin notificación ni un
  // solo minuto. En cuanto Meta la apruebe, cambiar esta línea a
  // 'cg_estado_pedido_v2' y listo.
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

// Avisos previos a la recompra (7 y 3 días antes de que se acabe el producto).
// Requiere las plantillas 'recompra_7dias' y 'recompra_3dias' aprobadas en Meta
// Business Manager — mientras no existan, notificar() devolverá el error de
// Meta (plantilla no encontrada) y no se enviará nada; no rompe el cron.
//
// REDISEÑO (2026-08-17): Mario pidió plantillas más cálidas, con más
// personalidad. Nuevas versiones ya creadas y pendientes de aprobación de
// Meta: 'recompra_7dias_v3' y 'recompra_3dias_v2'. Mientras se aprueban,
// se sigue usando la versión vieja (ya aprobada, funcional) para no dejar
// a ningún cliente sin su aviso — mismo patrón ya usado antes para
// cg_estado_pedido_v2. En cuanto Meta apruebe, cambiar USAR_TEMPLATE_V2
// a true y listo, sin tocar nada más.
const USAR_TEMPLATE_V2 = false
export async function notificarRecompraPrevio(
  dias: 7 | 3,
  data: { subscription_id: string; telefono: string; nombre?: string; producto?: string; proximo_envio: string }
) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  const producto = data.producto ?? 'tus lentes de contacto'
  const template = USAR_TEMPLATE_V2
    ? (dias === 7 ? 'recompra_7dias_v3' : 'recompra_3dias_v2')
    : (dias === 7 ? 'recompra_7dias' : 'recompra_3dias')
  // El evento_id incluye proximo_envio (no solo subscription_id) porque la
  // misma suscripción vuelve a generar este mismo aviso en CADA ciclo futuro
  // — sin la fecha, el dedup de notificar() bloquearía el aviso para siempre
  // después del primer envío.
  return notificar(`${template}_${data.subscription_id}_${data.proximo_envio}`, data.telefono, `recompra_${dias}d`,
    template, [nombre, producto])
}

export async function notificarResena(data: { telefono: string; nombre?: string; order_id?: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? 'Cliente'
  const res = await notificar(`resena_${data.order_id ?? normalizePhone(data.telefono)}`, data.telefono, 'resena',
    'solicitar_resena_v2', [nombre], { order_id: data.order_id })
  // BUG CORREGIDO (2026-08-06): esta función nunca marcaba resena_solicitada=true
  // en la orden — solo el cron de email (/api/solicitar-resena) lo hacía. Un
  // cliente al que se le pedía reseña por WhatsApp recibía la MISMA solicitud
  // otra vez por email 3 días después, porque el cron no tenía forma de saber
  // que ya se le había pedido por otro canal.
  if (res.ok && data.order_id) {
    await getSb().from('orders').update({ resena_solicitada: true }).eq('id', data.order_id)
  }
  return res
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
    try {
      await sb.from('whatsapp_messages').insert({
        wa_message_id: wa_id, phone, direction: 'outbound',
        message_type: 'text', body: mensaje, status: 'sent', read: true,
      })
    } catch { /* silencioso */ }
    return { ok: true, wa_id }
  } catch {
    return { ok: false, error: 'fuera_de_ventana_24h' }
  }
}
