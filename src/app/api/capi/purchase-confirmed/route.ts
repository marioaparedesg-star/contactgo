// ── Purchase CAPI server-side, disparado por trigger de base de datos ──
// Complementa (no reemplaza) el tracking client-side en /confirmacion.
// Fuente de verdad: orders.pago_estado = 'pagado' en Supabase.
// Garantiza que el evento Purchase llegue a Meta incluso si el navegador
// del cliente falla en ejecutar JS después del redirect de AZUL
// (navegadores in-app de bancos, cierre prematuro de pestaña, etc.)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const PIXEL_ID = '1516674003159165'
const ACCESS_TOKEN = process.env.FB_CAPI_TOKEN ?? ''
const CRON_SECRET = process.env.PURCHASE_CAPI_SECRET ?? ''

function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  // Autenticación simple con el mismo secreto usado en otros crons/webhooks internos
  const auth = req.headers.get('authorization')
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  if (!ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 200 })
  }

  try {
    const { order_id } = await req.json()
    if (!order_id) {
      return NextResponse.json({ ok: false, reason: 'missing_order_id' }, { status: 200 })
    }

    const sb = getSb()
    const { data: order } = await sb.from('orders').select('*').eq('id', order_id).single()
    if (!order) return NextResponse.json({ ok: false, reason: 'order_not_found' }, { status: 200 })
    if (order.pago_estado !== 'pagado') {
      return NextResponse.json({ ok: false, reason: 'not_paid' }, { status: 200 })
    }

    // Dedup: no reenviar Purchase si ya se registró para este pedido
    const { data: yaEnviado } = await sb
      .from('capi_purchase_log')
      .select('id')
      .eq('order_id', order_id)
      .maybeSingle()
    if (yaEnviado) return NextResponse.json({ ok: true, skipped: 'ya_enviado' })

    const { data: items } = await sb.from('order_items').select('*').eq('order_id', order_id)

    const event: any = {
      event_name: 'Purchase',
      event_time: Math.floor(new Date(order.pagado_en ?? order.created_at).getTime() / 1000),
      action_source: 'website',
      event_source_url: 'https://www.contactgo.net/confirmacion',
      user_data: {},
    }
    if (order.cliente_email) event.user_data.em = [hashValue(order.cliente_email)]
    if (order.cliente_telefono) event.user_data.ph = [hashValue(order.cliente_telefono.replace(/\D/g, ''))]
    if (order.cliente_nombre) event.user_data.fn = [hashValue(order.cliente_nombre.split(' ')[0])]

    event.custom_data = {
      currency: 'DOP',
      value: Number(order.total ?? 0),
      content_ids: (items ?? []).map((i: any) => i.product_id ?? i.id),
      content_type: 'product',
      num_items: (items ?? []).length,
      order_id: order.numero_orden ?? order_id,
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: [event] }) }
    )
    const result = await response.json()

    if (!response.ok) {
      console.error('[Purchase CAPI server] Error de Meta:', result)
      return NextResponse.json({ ok: false, error: result }, { status: 200 })
    }

    await sb.from('capi_purchase_log').insert({
      order_id, numero_orden: order.numero_orden, value: order.total,
      fb_response: result, sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, events_received: result.events_received })
  } catch (err: any) {
    console.error('[Purchase CAPI server] Excepción:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 })
  }
}
