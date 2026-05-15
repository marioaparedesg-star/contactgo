import { NextRequest, NextResponse } from 'next/server'

const WA_TOKEN    = process.env.WHATSAPP_TOKEN
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_ID

export async function POST(req: NextRequest) {
  try {
    if (!WA_TOKEN || !WA_PHONE_ID) {
      console.log('[WA] No configurado — omitiendo')
      return NextResponse.json({ skipped: true, reason: 'WHATSAPP_TOKEN o WHATSAPP_PHONE_ID no configurados' })
    }

    const { order_id, cliente_nombre, cliente_telefono, total, numero_orden, metodo_pago } = await req.json()

    // Limpiar y formatear número para RD (+1-829/849/809)
    const raw = (cliente_telefono ?? '').replace(/\D/g, '')
    let telefono = raw
    if (raw.length === 10) telefono = `1${raw}`        // 8294728328 → 18294728328
    if (raw.length === 11 && raw.startsWith('1')) telefono = raw  // ya tiene código
    if (raw.length === 12 && raw.startsWith('001')) telefono = raw.slice(1) // 001829... → 1829...

    if (!telefono || telefono.length < 11) {
      return NextResponse.json({ error: 'Teléfono inválido', raw }, { status: 400 })
    }

    const nombre    = (cliente_nombre ?? 'Cliente').split(' ')[0]
    const pedidoNum = numero_orden ?? (order_id ?? '').substring(0, 8).toUpperCase()
    const totalFmt  = `RD$${Number(total ?? 0).toLocaleString()}`
    const metodo    = metodo_pago === 'tarjeta' ? '💳 Tarjeta (AZUL)' : '💵 Contra entrega'

    const mensaje = `✅ *¡Hola ${nombre}, tu pedido está confirmado!*\n\n📦 *#${pedidoNum}*\n💰 *Total:* ${totalFmt}\n${metodo}\n\n🚚 Entrega en 24-48 horas.\n\n¿Tienes alguna pregunta? Responde este mensaje.\n\n_ContactGo — contactgo.net_`

    const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: telefono,
        type: 'text',
        text: { body: mensaje, preview_url: false }
      }),
    })

    const data = await res.json()
    console.log('[WA/notify]', { order_id, tel_last4: telefono.slice(-4), status: res.status })

    if (!res.ok) {
      console.error('[WA/notify] API error:', JSON.stringify(data))
      return NextResponse.json({ error: data?.error?.message, code: data?.error?.code }, { status: 500 })
    }

    return NextResponse.json({ success: true, message_id: data?.messages?.[0]?.id })
  } catch (err: any) {
    console.error('[WA/notify] Exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
