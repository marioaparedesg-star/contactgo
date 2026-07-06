// ============================================================
// ContactGo — Servicio Central de Notificaciones WhatsApp
// ============================================================
// - Deduplicación por evento_id (evita mensajes duplicados)
// - Reintentos automáticos con backoff exponencial
// - Firma unificada con número de soporte
// - Log completo para auditoría
// - Cero acoplamiento con AZUL (solo lectura de orders)
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { sendText, normalizePhone } from '@/lib/whatsapp'

// Número visible al cliente (para dudas/soporte)
export const SUPPORT_NUMBER = '18096942268'
export const SUPPORT_DISPLAY = '(809) 694-2268'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Firma unificada — todos los mensajes automáticos la incluyen
export function firma(): string {
  return `\n\n———\n💬 ¿Tienes alguna duda? Escríbenos: wa.me/${SUPPORT_NUMBER}`
}

/**
 * Envía un WhatsApp con protección anti-duplicados y reintentos.
 * @param eventoId - Identificador único del evento (ej: "order_123_estado_enviado")
 * @param telefono - Teléfono del destinatario
 * @param mensaje - Cuerpo del mensaje (sin firma, la agrego yo)
 * @param tipo - Categoría para dashboard (envio, bienvenida, resena, etc)
 * @param opts - Contexto opcional
 */
export async function notificar(
  eventoId: string,
  telefono: string | null | undefined,
  mensaje: string,
  tipo: string,
  opts?: { order_id?: string; user_id?: string; conFirma?: boolean }
): Promise<{ ok: boolean; skipped?: string; error?: string; wa_id?: string }> {
  if (!telefono) return { ok: false, skipped: 'sin_telefono' }
  
  const phone = normalizePhone(telefono)
  if (phone.length < 10) return { ok: false, skipped: 'telefono_invalido' }

  const sb = getSb()

  // 1) Verificar duplicado por evento_id
  const { data: yaEnviado } = await sb
    .from('wa_automation_log')
    .select('id, wa_message_id')
    .eq('evento_id', eventoId)
    .eq('estado', 'sent')
    .maybeSingle()
  
  if (yaEnviado) {
    return { ok: true, skipped: 'ya_enviado', wa_id: yaEnviado.wa_message_id ?? undefined }
  }

  // 2) Preparar mensaje con firma
  const texto = (opts?.conFirma !== false) ? mensaje + firma() : mensaje

  // 3) Intentar enviar
  try {
    const res = await sendText(phone, texto)
    const wa_id = res?.messages?.[0]?.id ?? null

    await sb.from('wa_automation_log').insert({
      evento_id: eventoId,
      telefono: phone,
      tipo,
      estado: 'sent',
      wa_message_id: wa_id,
      order_id: opts?.order_id ?? null,
      user_id: opts?.user_id ?? null,
      attempt: 1,
    })

    return { ok: true, wa_id }
  } catch (err: any) {
    const errMsg = err.message?.slice(0, 500) ?? 'unknown'

    // 4) Registrar fallo
    await sb.from('wa_automation_log').insert({
      evento_id: eventoId,
      telefono: phone,
      tipo,
      estado: 'failed',
      error: errMsg,
      order_id: opts?.order_id ?? null,
      user_id: opts?.user_id ?? null,
      attempt: 1,
    })

    // 5) Encolar reintento (solo si no es error de negocio permanente)
    const esErrorTemporal = !errMsg.match(/invalid|recipient|not.*whatsapp|132000|131047|131026/i)
    if (esErrorTemporal) {
      await sb.from('wa_retry_queue').upsert({
        evento_id: eventoId,
        telefono: phone,
        mensaje: texto,
        tipo,
        order_id: opts?.order_id ?? null,
        user_id: opts?.user_id ?? null,
        attempt: 0,
        next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // reintento en 5 min
        last_error: errMsg,
      }, { onConflict: 'evento_id' })
    }

    return { ok: false, error: errMsg }
  }
}

// ═══════════════════════════════════════════════════════════
// MENSAJES POR EVENTO (todos con nombre, cortos y humanos)
// ═══════════════════════════════════════════════════════════

/** #1 - Bienvenida al registrarse */
export async function notificarBienvenida(user: { user_id: string; nombre?: string; telefono?: string }) {
  if (!user.telefono) return { ok: false, skipped: 'sin_telefono' }
  const nombre = user.nombre?.split(' ')[0] ?? ''
  const mensaje = `¡Bienvenido/a a *ContactGo*${nombre ? `, ${nombre}` : ''}! 👋\n\n` +
    `Ya eres parte de la única tienda 100% especializada en lentes de contacto en RD 🇩🇴\n\n` +
    `Con tu cuenta puedes:\n` +
    `✅ Guardar tu receta para pedir en 30 segundos\n` +
    `✅ Ver todos tus pedidos y recibos\n` +
    `✅ Recibir recordatorios para no quedarte sin lentes\n` +
    `✅ Acceder a descuentos exclusivos\n\n` +
    `🛒 Explora el catálogo: www.contactgo.net\n` +
    `👤 Mi cuenta: www.contactgo.net/cuenta`
  
  return notificar(`user_${user.user_id}_bienvenida`, user.telefono, mensaje, 'bienvenida', { user_id: user.user_id })
}

/** #2 - Confirmación de pedido pagado */
export async function notificarPedidoConfirmado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const total = `RD$${Number(order.total ?? 0).toLocaleString('es-DO')}`
  const items = Array.isArray(order.items) 
    ? order.items.slice(0, 5).map((i: any) => `• ${i.nombre ?? 'Producto'}${i.cantidad > 1 ? ` x${i.cantidad}` : ''}`).join('\n')
    : ''
  
  const mensaje = `👁️ *¡Pedido confirmado, ${nombre}!*\n\n` +
    `📦 *Pedido #${num}*\n` +
    `${items}\n\n` +
    `💳 Total pagado: *${total}*\n` +
    `📍 ${order.direccion_texto?.slice(0, 60) ?? 'Dirección registrada'}\n` +
    `🚚 Entrega estimada: 24-48h\n\n` +
    `Ya comenzamos a preparar tu pedido. Te avisaremos en cada paso.\n\n` +
    `🔍 Sigue tu pedido: www.contactgo.net/pedido/${num}`
  
  return notificar(`order_${order.id}_confirmado`, order.cliente_telefono, mensaje, 'confirmacion', { order_id: order.id })
}

/** #3 - Estado: confirmado */
export async function notificarConfirmado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const mensaje = `✅ *${nombre}, recibimos tu pedido #${num}*\n\n` +
    `Ya comenzamos a prepararlo con mucho cuidado.\n\n` +
    `Te iremos avisando en cada paso hasta que llegue a tu puerta.`
  return notificar(`order_${order.id}_confirmado`, order.cliente_telefono, mensaje, 'estado_confirmado', { order_id: order.id })
}

/** #4 - Estado: preparando */
export async function notificarPreparando(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const mensaje = `🔬 *${nombre}, estamos preparando tu pedido #${num}*\n\n` +
    `Nuestro equipo está verificando cada lente cuidadosamente antes de empacarlo.\n\n` +
    `Muy pronto estará en camino. 🚚`
  return notificar(`order_${order.id}_preparando`, order.cliente_telefono, mensaje, 'estado_preparando', { order_id: order.id })
}

/** #5 - Estado: enviado / en camino */
export async function notificarEnviado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const empresa = order.empresa_envio ?? 'nuestro courier'
  const guia = order.tracking_number ?? null
  
  const mensaje = `🚚 *¡Tu pedido está en camino, ${nombre}!*\n\n` +
    `📦 Pedido #${num}\n` +
    `🏢 Empresa: ${empresa}\n` +
    (guia ? `🔢 Guía: ${guia}\n` : '') +
    `📅 Entrega estimada: hoy o mañana\n` +
    `📍 ${order.direccion_texto?.slice(0, 60) ?? 'Tu dirección'}\n\n` +
    `🔍 Sigue tu pedido: www.contactgo.net/pedido/${num}`
  
  return notificar(`order_${order.id}_enviado`, order.cliente_telefono, mensaje, 'estado_enviado', { order_id: order.id })
}

/** #6 - Estado: entregado */
export async function notificarEntregado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const mensaje = `🎉 *¡Tu pedido #${num} fue entregado, ${nombre}!*\n\n` +
    `Esperamos que disfrutes tu compra al máximo.\n\n` +
    `Gracias por confiar en ContactGo, la única tienda 100% especializada en lentes de contacto en RD. 💚\n\n` +
    `En unos días te preguntaremos cómo te fue. ⭐`
  return notificar(`order_${order.id}_entregado`, order.cliente_telefono, mensaje, 'estado_entregado', { order_id: order.id })
}

/** #7 - Estado: cancelado */
export async function notificarCancelado(order: any) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const motivo = order.notas_admin?.startsWith('Auto-cancelado') 
    ? 'no se completó el pago a tiempo' 
    : (order.notas_admin?.slice(0, 100) ?? 'motivos operativos')
  
  const mensaje = `Hola *${nombre}* 👋\n\n` +
    `Te informamos que tu pedido *#${num}* fue cancelado.\n\n` +
    `📋 Motivo: ${motivo}\n\n` +
    `Si quieres retomar la compra, escríbenos y te ayudamos personalmente.\n\n` +
    `🎁 *5% de descuento* si retomas hoy: *VUELVE5*\n` +
    `👉 www.contactgo.net`
  
  return notificar(`order_${order.id}_cancelado`, order.cliente_telefono, mensaje, 'estado_cancelado', { order_id: order.id })
}

/** #8 - Pedido especial / demora */
export async function notificarPedidoEspecial(order: any, tiempoEstimadoDias: number) {
  const nombre = order.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const num = order.numero_orden ?? String(order.id).slice(0, 8)
  const mensaje = `Hola *${nombre}* 👋\n\n` +
    `Sobre tu pedido *#${num}*: uno de los productos requiere importación especial.\n\n` +
    `📅 Nuevo tiempo estimado: *${tiempoEstimadoDias} días hábiles*\n\n` +
    `Te iremos avisando el progreso. Gracias por tu paciencia. 🙏`
  return notificar(`order_${order.id}_especial`, order.cliente_telefono, mensaje, 'pedido_especial', { order_id: order.id })
}

/** #9 - Reset password */
export async function notificarResetPassword(data: { user_id?: string; nombre?: string; telefono: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const mensaje = `🔐 *Restablecer contraseña*${nombre ? `\n\nHola ${nombre},` : '\n\nHola,'}\n\n` +
    `Recibimos tu solicitud para restablecer tu contraseña en ContactGo.\n\n` +
    `📧 Revisa tu correo — te enviamos un enlace seguro para crear una nueva contraseña.\n\n` +
    `⚠️ Si tú no solicitaste esto, ignora este mensaje.`
  return notificar(`user_${data.user_id ?? data.telefono}_reset_${Date.now()}`, data.telefono, mensaje, 'reset_password', { user_id: data.user_id })
}

/** #10 - Cambio de dirección */
export async function notificarCambioDireccion(data: { user_id: string; nombre?: string; telefono: string; direccion: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const mensaje = `✅ *Dirección actualizada*${nombre ? `\n\nHola ${nombre},` : ''}\n\n` +
    `Tu nueva dirección de envío es:\n📍 ${data.direccion.slice(0, 120)}\n\n` +
    `Todos tus próximos pedidos serán enviados aquí.\n\n` +
    `⚠️ Si no fuiste tú, contáctanos inmediatamente.`
  return notificar(`user_${data.user_id}_direccion_${Date.now()}`, data.telefono, mensaje, 'cambio_direccion', { user_id: data.user_id })
}

/** #11 - Cambio de teléfono */
export async function notificarCambioTelefono(data: { user_id: string; nombre?: string; telefono: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const mensaje = `📱 *Teléfono actualizado*${nombre ? `\n\nHola ${nombre},` : ''}\n\n` +
    `Confirmamos el cambio de tu número de contacto en ContactGo.\n\n` +
    `⚠️ Si no fuiste tú, contáctanos inmediatamente.`
  return notificar(`user_${data.user_id}_telefono_${Date.now()}`, data.telefono, mensaje, 'cambio_telefono', { user_id: data.user_id })
}

/** #12 - Cambio de correo */
export async function notificarCambioCorreo(data: { user_id: string; nombre?: string; telefono: string; email: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const mensaje = `✉️ *Correo actualizado*${nombre ? `\n\nHola ${nombre},` : ''}\n\n` +
    `Tu nuevo correo en ContactGo es: *${data.email}*\n\n` +
    `⚠️ Si no fuiste tú, contáctanos inmediatamente.`
  return notificar(`user_${data.user_id}_email_${Date.now()}`, data.telefono, mensaje, 'cambio_email', { user_id: data.user_id })
}

/** #13 - Receta guardada */
export async function notificarRecetaGuardada(data: { user_id: string; nombre?: string; telefono: string; esNueva: boolean }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const accion = data.esNueva ? 'guardada' : 'actualizada'
  const mensaje = `👁️ *Tu receta fue ${accion}*${nombre ? `\n\nHola ${nombre},` : ''}\n\n` +
    `Ahora puedes pedir tus lentes en solo 30 segundos — cada vez que compres, ya sabemos tu graduación exacta.\n\n` +
    `📋 Ver mi receta: www.contactgo.net/cuenta/receta`
  return notificar(`user_${data.user_id}_receta_${Date.now()}`, data.telefono, mensaje, data.esNueva ? 'receta_guardada' : 'receta_actualizada', { user_id: data.user_id })
}

/** #14 - Cumpleaños */
export async function notificarCumpleanos(data: { user_id: string; nombre?: string; telefono: string }) {
  const nombre = data.nombre?.split(' ')[0] ?? ''
  const mensaje = `🎂 *¡Feliz cumpleaños${nombre ? `, ${nombre}` : ''}!* 🎉\n\n` +
    `De parte de todo el equipo de ContactGo, te deseamos un día increíble. 💚\n\n` +
    `🎁 Como regalo, tienes *15% de descuento* en tu próxima compra:\n` +
    `Código: *CUMPLE15*\n` +
    `✨ Válido por 7 días\n\n` +
    `👉 www.contactgo.net`
  const anio = new Date().getFullYear()
  return notificar(`user_${data.user_id}_cumple_${anio}`, data.telefono, mensaje, 'cumpleanos', { user_id: data.user_id })
}
