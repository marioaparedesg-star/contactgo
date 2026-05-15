import { NextRequest, NextResponse } from 'next/server'

const WA_TOKEN    = process.env.WHATSAPP_TOKEN
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_ID

// CallMeBot — API gratuita para enviar WhatsApp a tu propio número sin app de Meta
const CALLMEBOT_API = process.env.CALLMEBOT_API_KEY  // Tu API key de callmebot.com
const ADMIN_PHONE   = process.env.NEXT_PUBLIC_WHATSAPP ?? '18294728328'

export async function POST(req: NextRequest) {
  try {
    const { order_id, cliente_nombre, cliente_telefono, total, numero_orden, metodo_pago } = await req.json()

    const nombre    = (cliente_nombre ?? 'Cliente').split(' ')[0]
    const pedidoNum = numero_orden ?? (order_id ?? '').substring(0, 8).toUpperCase()
    const totalFmt  = `RD$${Number(total ?? 0).toLocaleString()}`
    const metodo    = metodo_pago === 'tarjeta' ? '💳 Tarjeta' : '💵 Contra entrega'

    // OPCIÓN A: WhatsApp Business API oficial (si tienes token de Meta)
    if (WA_TOKEN && WA_PHONE_ID) {
      const raw = (cliente_telefono ?? '').replace(/\D/g, '')
      const telefono = raw.length === 10 ? `1${raw}` : raw

      const mensaje = `✅ *¡Hola ${nombre}, tu pedido está confirmado!*\n\n📦 *#${pedidoNum}*\n💰 *Total:* ${totalFmt}\n${metodo}\n\n🚚 Entrega en 24-48 horas.\n\n_ContactGo — contactgo.net_`

      const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp', recipient_type: 'individual',
          to: telefono, type: 'text', text: { body: mensaje }
        }),
      })
      const data = await res.json()
      console.log('[WA/oficial]', { ok: res.ok, status: res.status })
      if (res.ok) return NextResponse.json({ success: true, via: 'meta-api' })
    }

    // OPCIÓN B: CallMeBot — notificación al ADMIN (tú) gratis, sin app
    if (CALLMEBOT_API) {
      const adminMsg = `🛍️ NUEVO PEDIDO ContactGo!%0A📦 %23${pedidoNum}%0A👤 ${encodeURIComponent(nombre)}%0A💰 ${totalFmt}%0A${encodeURIComponent(metodo)}`
      const callUrl  = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_PHONE}&text=${adminMsg}&apikey=${CALLMEBOT_API}`
      const cbRes = await fetch(callUrl)
      console.log('[WA/callmebot]', { status: cbRes.status })
      return NextResponse.json({ success: true, via: 'callmebot' })
    }

    // Sin configuración — omitir silenciosamente
    return NextResponse.json({ skipped: true, reason: 'No hay credenciales WA configuradas' })
  } catch (err: any) {
    console.error('[WA/notify] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
