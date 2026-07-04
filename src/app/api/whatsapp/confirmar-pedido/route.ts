// ============================================================
// ContactGo — POST /api/whatsapp/confirmar-pedido
// Envía confirmación automática por WhatsApp cuando se confirma un pedido
// Llamado desde /api/notify cuando evento = 'nuevo_pedido'
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/whatsapp'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    // Verificar token interno
    const auth = req.headers.get('x-internal-token')
    if (auth !== process.env.INTERNAL_API_TOKEN && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sb = getSb()

    // Obtener datos completos del pedido
    const { data: order, error } = await sb
      .from('orders')
      .select(`
        id, numero_orden, total, pago_estado,
        cliente_nombre, cliente_telefono, cliente_email,
        order_items (
          nombre_producto, cantidad, precio_unitario
        )
      `)
      .eq('id', order_id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Solo enviar si el pedido está pagado
    if (order.pago_estado !== 'pagado') {
      return NextResponse.json({ skip: true, reason: 'pedido no pagado', estado: order.pago_estado })
    }

    // Verificar que tiene teléfono
    if (!order.cliente_telefono) {
      return NextResponse.json({ skip: true, reason: 'sin teléfono' })
    }

    // Enviar confirmación por WhatsApp
    const result = await sendOrderConfirmation({
      cliente_telefono: order.cliente_telefono,
      cliente_nombre:   order.cliente_nombre ?? 'Cliente',
      numero_orden:     order.numero_orden ?? order.id.slice(-8).toUpperCase(),
      total:            order.total ?? 0,
      items:            (order.order_items ?? []).map((i: any) => ({
        nombre:   i.nombre_producto,
        cantidad: i.cantidad,
      })),
    })

    // Registrar en logs
    await sb.from('order_events').insert({
      order_id,
      tipo: 'whatsapp_confirmacion',
      detalle: `WA enviado a ${order.cliente_telefono} — msg_id: ${result?.messages?.[0]?.id}`,
    }).throwOnError()

    return NextResponse.json({ ok: true, whatsapp: result })

  } catch (err: any) {
    console.error('[WA/confirmar-pedido]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
