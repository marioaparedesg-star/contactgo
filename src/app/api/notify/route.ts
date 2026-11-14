import { guardRequest, getIP } from '@/lib/api-guard'
// ============================================================
// ContactGo — API: Notificaciones de pedidos
// Envía email al cliente + email al admin cuando cambia estado
// POST /api/notify  { order_id, evento: 'nuevo_pedido' | 'estado_cambio', nuevo_estado? }
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { buildCustomerOrderEmail, buildAdminOrderEmail } from '@/lib/email/order-templates'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }

function esperar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// FIX (2026-08-30): mismo hallazgo que en WhatsApp — un fallo de Resend
// (caída momentánea, timeout de red) hacía perder el correo de confirmación
// para siempre, sin ningún reintento. Ahora reintenta hasta 3 veces con
// espera progresiva antes de registrar el error final. Tiempos cortos
// deliberadamente (igual que en WhatsApp): esta función se llama con
// await desde /api/notify, que a su vez AZUL espera antes de redirigir
// al cliente — no queremos acercarnos al límite de tiempo de la función.
async function enviarEmailConReintentos(resend: Resend, params: { from: string; to: string; subject: string; html: string }) {
  const ESPERAS_MS = [800, 1600]
  let ultimoError: string | undefined
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const { data, error } = await resend.emails.send(params)
      if (!error) return { resendId: data?.id, error: undefined, intentos: intento }
      ultimoError = error.message
    } catch (e: any) {
      ultimoError = e?.message ?? 'Error desconocido'
    }
    if (intento < 3) await esperar(ESPERAS_MS[intento - 1])
  }
  return { resendId: undefined, error: ultimoError, intentos: 3 }
}

const BASE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
// Admin recibe notificaciones en este email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'info@contactgo.net'
// FROM: si RESEND_FROM está configurado con dominio verificado, úsalo.
// Si no, usa onboarding@resend.dev (funciona sin verificar dominio propio)
const FROM_EMAIL  = process.env.RESEND_FROM ?? 'ContactGo <notifications@contactgo.net>'

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Recibido', recibido: 'Recibido', confirmado: 'Confirmado',
  pago_aprobado: 'Pago aprobado', preparando: 'En preparación',
  fabricante: 'Con fabricante', enviado: 'Despachado', transito: 'En tránsito',
  entregado: 'Entregado', cancelado: 'Cancelado',
}

export async function POST(req: NextRequest) {
  // Seguridad: origin + rate limit
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return guardErr
  const ip = getIP(req)


  try {
    const { order_id, evento = 'nuevo_pedido', nuevo_estado } = await req.json()
    if (!['nuevo_pedido', 'estado_cambio', 'pago_aprobado'].includes(evento)) return NextResponse.json({ error: 'Evento no permitido' }, { status: 400 })

    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'RESEND_API_KEY no configurado' }, { status: 500 })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const sbAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Obtener orden + items
    const { data: order } = await getSb().from('orders').select('*').eq('id', order_id).single()
    if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

    // FIX AUDITORÍA (2026-08-09): antes se usaba nuevo_estado tal cual lo
    // mandara quien llamara al endpoint, sin comparar contra el estado REAL
    // de la orden — alguien con un order_id válido podía hacer que un
    // cliente real recibiera una notificación de "tu pedido fue cancelado"
    // (o cualquier otro estado) sin que eso fuera cierto de verdad. Ahora se
    // ignora cualquier nuevo_estado que no coincida con order.estado —
    // el mensaje siempre refleja el estado real guardado en la base de datos.
    const nuevoEstadoSeguro = (nuevo_estado && nuevo_estado === order.estado) ? nuevo_estado : order.estado
    if ((evento === 'pago_aprobado' || (evento === 'estado_cambio' && nuevoEstadoSeguro === 'pago_aprobado')) && order.pago_estado !== 'pagado') return NextResponse.json({ error: 'No se puede notificar un pago que no está aprobado' }, { status: 409 })

    const { data: items } = await getSb().from('order_items')
      .select('*, products(tipo)')
      .eq('order_id', order_id)
    const itemsList = items ?? []

    const pedidoId = order.id.slice(-8).toUpperCase()
    const estadoLabel = ESTADO_LABEL[nuevoEstadoSeguro] ?? nuevoEstadoSeguro

    const subject = evento === 'pago_aprobado' || (evento === 'nuevo_pedido' && order.pago_estado === 'pagado')
      ? `Pago aprobado · Pedido #${pedidoId} — ContactGo`
      : evento === 'nuevo_pedido'
        ? `Pedido #${pedidoId} recibido — ContactGo`
        : `ContactGo · Pedido #${pedidoId}: ${estadoLabel}`

    // Email al cliente + log de entrega — con protección contra duplicados
    const esPagoAprobado = evento === 'pago_aprobado' || (evento === 'nuevo_pedido' && order.pago_estado === 'pagado')
    const emailTemplate = esPagoAprobado
      ? 'pago_aprobado'
      : evento === 'nuevo_pedido' ? 'confirmacion_orden' : `actualizacion_estado_${nuevoEstadoSeguro}`
    let emailClienteStatus: 'sent' | 'error' | 'skipped' = 'skipped'
    let emailClienteError: string | undefined
    if (order.cliente_email) {
      // Verificar si ya se envió este mismo email para esta orden (evita duplicados
      // por reintentos, doble-clic del cliente, o pruebas manuales del endpoint)
      const { data: yaEnviado } = await sbAdmin.from('email_log')
        .select('id').eq('order_id', order_id).eq('template', emailTemplate).eq('status', 'sent')
        .maybeSingle()

      if (!yaEnviado) {
        const { resendId, error: emailError } = await enviarEmailConReintentos(resend, {
          from: FROM_EMAIL,
          to: order.cliente_email,
          subject,
          html: buildCustomerOrderEmail(order, itemsList, evento, nuevoEstadoSeguro),
        })
        emailClienteStatus = emailError ? 'error' : 'sent'
        emailClienteError = emailError
        // Registrar en email_log para auditoría — nombres de columna correctos
        // (bug anterior: usaba tipo/asunto/enviado/error_msg que no existen en la tabla real)
        await sbAdmin.from('email_log').insert({
          order_id:    order_id,
          template:    emailTemplate,
          to_email:    order.cliente_email,
          subject:     subject,
          resend_id:   resendId ?? null,
          status:      emailError ? 'error' : 'sent',
        }).then(() => {})
      } else {
        emailClienteStatus = 'sent'
        console.log('[notify] Email ya enviado para este estado, se omite duplicado:', emailTemplate, order_id)
      }
    } else {
      emailClienteStatus = 'skipped'
      emailClienteError = 'La orden no tiene correo electrónico de cliente'
    }

    // WhatsApp al cliente — cuando pedido cambia de estado (TODOS los estados)
    if (evento === 'estado_cambio' && nuevoEstadoSeguro && order.cliente_telefono) {
      const mapaEstadoWA: Record<string, string> = {
        recibido:      'estado_recibido',
        pago_aprobado: 'estado_pago_aprobado',
        confirmado:    'estado_confirmado',
        preparando:    'estado_preparando',
        fabricante:    'estado_fabricante',
        enviado:       'estado_enviado',
        transito:      'estado_transito',
        entregado:     'estado_entregado',
        cancelado:     'estado_cancelado',
      }
      const tipoWA = mapaEstadoWA[nuevoEstadoSeguro]
      if (tipoWA) {
        const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
        try {
          const r = await fetch(`${BASE}/api/wa/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.CRON_SECRET ?? '' },
            body: JSON.stringify({ tipo: tipoWA, order_id }),
          })
          const responseText = await r.text()
          let d: any
          try { d = JSON.parse(responseText) } catch {
            d = { ok: false, error: `Respuesta no JSON (HTTP ${r.status}): ${responseText.slice(0, 180)}` }
          }
          console.log('[notify] WA estado:', nuevoEstadoSeguro, d?.ok ? 'OK' : d)
        } catch (e) {
          console.error('[notify] WA error:', e)
        }
      }
    }

    // WhatsApp — nuevo pedido (confirmación de compra)
    // CRÍTICO: debe llevar await — en Vercel serverless, una fetch sin await
    // puede morir a medias cuando la función termina de responder, antes de
    // completar la llamada real a Meta. Esto causaba que el WhatsApp de
    // confirmación casi nunca llegara pese a que el email sí (el email sí
    // tenía await más abajo).
    if (evento === 'nuevo_pedido' && order.cliente_telefono) {
      const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
      try {
        const r = await fetch(`${BASE}/api/wa/dispatch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.CRON_SECRET ?? '' },
          body: JSON.stringify({ tipo: 'pedido_pagado', order_id }),
        })
        const responseText = await r.text()
          let d: any
          try { d = JSON.parse(responseText) } catch {
            d = { ok: false, error: `Respuesta no JSON (HTTP ${r.status}): ${responseText.slice(0, 180)}` }
          }
        console.log('[notify] WA pedido_pagado:', d?.ok ? 'OK' : d)
      } catch (e) {
        console.error('[notify] WA error:', e)
      }
    }

    // Email al admin — con la misma protección contra duplicados
    const adminTemplate = esPagoAprobado ? 'admin_pago_aprobado' : evento === 'nuevo_pedido' ? 'admin_nuevo_pedido' : `admin_estado_${nuevoEstadoSeguro}`
    const { data: adminYaEnviado } = await sbAdmin.from('email_log')
      .select('id').eq('order_id', order_id).eq('template', adminTemplate).eq('status', 'sent')
      .maybeSingle()

    if (!adminYaEnviado) {
      const adminSubject = evento === 'nuevo_pedido'
        ? `Nuevo pedido #${pedidoId} — RD${order.total?.toLocaleString()}`
        : evento === 'pago_aprobado' ? `Pago aprobado #${pedidoId} — RD${order.total?.toLocaleString()}` : `Pedido #${pedidoId} → ${estadoLabel}`
      let adminResendId: string | undefined
      let adminError: string | undefined
      try {
        const { data: sentAdmin, error: adminSendErr } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: adminSubject,
          html: buildAdminOrderEmail(order, itemsList, evento, nuevoEstadoSeguro),
        })
        adminResendId = sentAdmin?.id
        if (adminSendErr) adminError = adminSendErr.message
      } catch (e: any) {
        adminError = e?.message ?? 'Error desconocido'
      }
      await sbAdmin.from('email_log').insert({
        order_id:  order_id,
        template:  adminTemplate,
        to_email:  ADMIN_EMAIL,
        subject:   adminSubject,
        resend_id: adminResendId ?? null,
        status:    adminError ? 'error' : 'sent',
      }).then(() => {})
    } else {
      console.log('[notify] Email admin ya enviado antes, se omite duplicado:', adminTemplate, order_id)
    }

    // Marcar lead de calculadora como convertido cuando su email/teléfono
    // coincide con un pedido nuevo. No bloqueante: si falla, no afecta el
    // resto del flujo de notificación.
    if (evento === 'nuevo_pedido') {
      try {
        if (order.cliente_email) {
          await sbAdmin.from('calculator_leads')
            .update({ convertido: true, order_id: order_id })
            .eq('email', order.cliente_email.toLowerCase().trim())
            .eq('convertido', false)
        }
        if (order.cliente_telefono) {
          await sbAdmin.from('calculator_leads')
            .update({ convertido: true, order_id: order_id })
            .eq('telefono', order.cliente_telefono)
            .eq('convertido', false)
        }
      } catch (e) {
        console.error('[notify] Error marcando lead como convertido:', e)
      }
    }

    // Registrar recompra automáticamente para pedidos nuevos
    if (evento === 'nuevo_pedido') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'}/api/recompra/registrar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id })
        })
      } catch (e) { /* no bloquear si falla */ }

      // Reposición automática: suscripción con duración exacta calculada
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'}/api/suscripciones/auto-crear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id })
        })
      } catch (e) { /* no bloquear si falla */ }

      // Marcar como convertido el lead de la calculadora que originó esta compra
      // (match por email o teléfono). No bloqueante: si falla, el pedido sigue su curso.
      try {
        const telefonoOrden = order.cliente_telefono ? String(order.cliente_telefono).replace(/\D/g, '') : null
        let query = sbAdmin.from('calculator_leads').update({ convertido: true, order_id }).eq('convertido', false)
        if (order.cliente_email && telefonoOrden) {
          query = query.or(`email.eq.${order.cliente_email},telefono.eq.${telefonoOrden}`)
        } else if (order.cliente_email) {
          query = query.eq('email', order.cliente_email)
        } else if (telefonoOrden) {
          query = query.eq('telefono', telefonoOrden)
        } else {
          query = null as any
        }
        if (query) {
          const { error: convError } = await query
          if (convError) console.error('[notify] calculator_leads convertido error:', convError.message)
        }
      } catch (e) {
        console.error('[notify] calculator_leads convertido excepción:', e)
      }
    }

    return NextResponse.json({ ok: emailClienteStatus !== 'error', email_cliente: emailClienteStatus, ...(emailClienteError ? { email_error: emailClienteError } : {}) }, { status: emailClienteStatus === 'error' ? 502 : 200 })
  } catch (err: any) {
    console.error('[notify]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
