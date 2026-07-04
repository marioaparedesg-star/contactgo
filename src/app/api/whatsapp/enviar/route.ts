// ============================================================
// ContactGo — POST /api/whatsapp/enviar
// Endpoint genérico para enviar mensajes desde el admin
// POST { telefono, mensaje, order_id? }
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { sendText, sendShippingNotification, sendRenewalReminder } from '@/lib/whatsapp'
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

    let result

    if (tipo === 'envio' && order_id) {
      // Notificación de envío
      const sb = getSb()
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
      }
    } else if (tipo === 'renovacion') {
      // Recordatorio de renovación
      result = await sendRenewalReminder({
        telefono,
        nombre:   body.nombre ?? '',
        producto: body.producto ?? 'lentes de contacto',
      })
    } else if (mensaje) {
      // Mensaje libre
      result = await sendText(telefono, mensaje)
    } else {
      return NextResponse.json({ error: 'mensaje o tipo requerido' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, result })
  } catch (err: any) {
    console.error('[WA/enviar]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
