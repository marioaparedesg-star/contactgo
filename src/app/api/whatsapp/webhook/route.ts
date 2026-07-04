// ============================================================
// ContactGo — WhatsApp Webhook
// GET  — verificación de Meta
// POST — recibir mensajes entrantes de clientes
// ============================================================
import { NextRequest, NextResponse } from 'next/server'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? 'contactgo_webhook_2026'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WA/webhook] Verificado por Meta')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json()
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages

    if (messages?.length > 0) {
      const msg  = messages[0]
      const from = msg.from
      const text = msg.text?.body ?? ''
      console.log(`[WA/webhook] Mensaje de ${from}: "${text}"`)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[WA/webhook]', err.message)
    return NextResponse.json({ ok: true })
  }
}
