import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enviarNotificacionPedido } from '@/lib/email/order-notifications'

export async function POST(req: NextRequest) {
  // Endpoint de compatibilidad HTTP. El panel administrativo invoca el
  // servicio interno directamente y no pasa por una petición HTTP pública.
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return guardErr

  try {
    const { order_id, evento = 'nuevo_pedido', nuevo_estado } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })
    if (!['nuevo_pedido', 'estado_cambio', 'pago_aprobado'].includes(evento)) {
      return NextResponse.json({ error: 'Evento no permitido' }, { status: 400 })
    }

    const result = await enviarNotificacionPedido(order_id, evento, nuevo_estado)

    // Read the persisted order and preserve legacy non-email side effects.
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: order } = await sb.from('orders').select('id, estado, cliente_email, cliente_telefono').eq('id', order_id).single()
    if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    const nuevoEstadoSeguro = String(order.estado ?? 'recibido')
    const sbAdmin = sb

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
          console.log('[notify] WA estado:', nuevo_estado, d?.ok ? 'OK' : d)
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

    const failed = result.email_cliente === 'error' || result.email_admin === 'error'
    return NextResponse.json({ ok: !failed, ...result }, { status: failed ? 502 : 200 })
  } catch (error: any) {
    console.error('[notify]', error)
    return NextResponse.json({ error: error?.message ?? 'Error de notificación' }, { status: 500 })
  }
}
