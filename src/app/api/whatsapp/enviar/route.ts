// ============================================================
// ContactGo — POST /api/whatsapp/enviar
// Enviar mensajes desde el admin + guardar en Supabase
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { sendText, sendShippingNotification, sendRenewalReminder, normalizePhone } from '@/lib/whatsapp'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { telefono, mensaje, tipo, order_id } = body

    if (!telefono) return NextResponse.json({ error: 'telefono requerido' }, { status: 400 })

    const sb = getSb()
    let result: any
    let sentBody = ''

    if (tipo === 'envio' && order_id) {
      const { data: order } = await sb
        .from('orders')
        .select('cliente_nombre, numero_orden, cliente_telefono')
        .eq('id', order_id)
        .single()

      if (order) {
        result = await sendShippingNotification({
          cliente_telefono: order.cliente_telefono,
          cliente_nombre:   order.cliente_nombre,
          numero_orden:     order.numero_orden,
        })
        sentBody = `🚚 Notificación de envío - Pedido #${order.numero_orden}`
      }
    } else if (tipo === 'renovacion') {
      result = await sendRenewalReminder({
        telefono,
        nombre:   body.nombre ?? '',
        producto: body.producto ?? 'lentes de contacto',
      })
      sentBody = `🔄 Recordatorio de renovación`
    } else if (mensaje) {
      result = await sendText(telefono, mensaje)
      sentBody = mensaje
    } else {
      return NextResponse.json({ error: 'mensaje o tipo requerido' }, { status: 400 })
    }

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
