// ============================================================
// ContactGo — POST /api/whatsapp/enviar
// Enviar mensajes desde el admin + guardar en Supabase
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { enviarWAManual, normalizePhone } from '@/lib/whatsapp'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  // FIX CRÍTICO AUDITORÍA (2026-08-09): este endpoint aceptaba texto libre
  // arbitrario y lo enviaba a cualquier número, sin ninguna verificación —
  // más grave que wa/dispatch porque ni siquiera estaba limitado a
  // plantillas aprobadas. Único uso legítimo confirmado:
  // admin/whatsapp/page.tsx (ya requiere sesión de admin para cargar).
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  try {
    const body = await req.json()
    const { telefono, mensaje, tipo, order_id } = body

    if (!telefono) return NextResponse.json({ error: 'telefono requerido' }, { status: 400 })

    const sb = getSb()
    let result: any
    let sentBody = ''
    let payload: Record<string, any>

    if (tipo === 'envio' && order_id) {
      const { data: order } = await sb
        .from('orders')
        .select('cliente_nombre, numero_orden, cliente_telefono')
        .eq('id', order_id)
        .single()

      if (order) {
        payload = { type: 'template', template: { name: 'pedido_enviado', language: { code: 'es' }, components: [{ type: 'body', parameters: [
          { type: 'text', text: order.cliente_nombre?.split(' ')[0] ?? 'Cliente' },
          { type: 'text', text: order.numero_orden },
          { type: 'text', text: 'hoy o mañana' },
          { type: 'text', text: order.numero_orden },
        ] }] } }
        sentBody = `Notificación manual de envío - Pedido #${order.numero_orden}`
      }
    } else if (tipo === 'renovacion') {
      const nombre = String(body.nombre ?? 'Cliente').split(' ')[0]
      payload = { type: 'template', template: { name: 'renovacion_lentes', language: { code: 'es' }, components: [{ type: 'body', parameters: [
        { type: 'text', text: nombre },
        { type: 'text', text: body.producto ?? 'tus lentes de contacto' },
      ] }] } }
      sentBody = 'Recordatorio manual de renovación'
    } else if (mensaje) {
      payload = { type: 'text', text: { body: String(mensaje) } }
      sentBody = String(mensaje)
    } else {
      return NextResponse.json({ error: 'mensaje o tipo requerido' }, { status: 400 })
    }

    result = await enviarWAManual(telefono, payload)

    // Save outbound message to DB
    const waMessageId = result?.messages?.[0]?.id ?? null
    try {
      await sb.from('whatsapp_messages').insert({
        wa_message_id: waMessageId,
        phone: normalizePhone(telefono),
        direction: 'outbound',
        message_type: 'text',
        body: sentBody,
        status: 'sent',
        read: true,
      })
    } catch (dbErr: any) {
      console.error('[WA/enviar] DB insert error:', dbErr.message)
    }

    return NextResponse.json({ ok: true, result })
  } catch (err: any) {
    console.error('[WA/enviar]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
