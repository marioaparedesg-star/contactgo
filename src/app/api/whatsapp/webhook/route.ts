// ============================================================
// ContactGo — WhatsApp Webhook
// GET  — verificación de Meta
// POST — recibir mensajes, auto-bienvenida, notificación admin
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? 'contactgo_webhook_2026'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]?.value
    const sb = getSb()

    // ── Handle incoming messages ──
    const messages = changes?.messages
    if (messages?.length > 0) {
      const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE ?? '18294089097'
      const WA_API = 'https://graph.facebook.com/v20.0'
      const PHONE_ID = process.env.WHATSAPP_PHONE_ID ?? ''
      const TOKEN = process.env.WHATSAPP_TOKEN ?? ''

      for (const msg of messages) {
        const from = msg.from ?? ''
        const contactName = changes?.contacts?.[0]?.profile?.name ?? null
        const msgType = msg.type ?? 'text'
        let msgBody = ''
        let mediaUrl: string | null = null

        if (msgType === 'text') {
          msgBody = msg.text?.body ?? ''
        } else if (msgType === 'image') {
          msgBody = msg.image?.caption ?? ''
          mediaUrl = msg.image?.id ?? null
        } else if (msgType === 'audio') {
          msgBody = ''
          mediaUrl = msg.audio?.id ?? null
        } else if (msgType === 'document') {
          msgBody = msg.document?.filename ?? ''
          mediaUrl = msg.document?.id ?? null
        } else if (msgType === 'video') {
          msgBody = msg.video?.caption ?? ''
          mediaUrl = msg.video?.id ?? null
        } else if (msgType === 'location') {
          msgBody = `📍 ${msg.location?.latitude}, ${msg.location?.longitude}`
        } else if (msgType === 'reaction') {
          msgBody = msg.reaction?.emoji ?? ''
        } else {
          msgBody = `[${msgType}]`
        }

        // ── Deduplicación: si ya existe este wa_message_id, ignorar ──
        if (msg.id) {
          const { count } = await sb
            .from('whatsapp_messages')
            .select('*', { count: 'exact', head: true })
            .eq('wa_message_id', msg.id)
          if (count && count > 0) {
            console.log(`[WA/webhook] Duplicado ignorado: ${msg.id}`)
            continue
          }
        }

        // ── Guardar mensaje ──
        await sb.from('whatsapp_messages').insert({
          wa_message_id: msg.id ?? null,
          phone: from,
          phone_name: contactName,
          direction: 'inbound',
          message_type: msgType,
          body: msgBody || null,
          media_url: mediaUrl,
          status: 'received',
          read: false,
        })

        // ── Skip auto-reply para admin y reacciones ──
        if (from === ADMIN_PHONE.replace(/^1/, '') || msgType === 'reaction') continue

        // ── Bienvenida DESACTIVADA — clientes ahora escriben al 809-694-2268 (chat humano) ──
        // El 829-543-0580 es exclusivo para automation API. Si alguien escribe aquí, solo notificamos al admin.

        // ── Notificación al admin ──
        const displayPhone = from.length === 11 && from.startsWith('1')
          ? `(${from.slice(1,4)}) ${from.slice(4,7)}-${from.slice(7)}`
          : from
        const nombre = contactName ?? displayPhone
        const preview = msgBody || (mediaUrl ? `[${msgType}]` : '[mensaje]')

        await fetch(`${WA_API}/${PHONE_ID}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: ADMIN_PHONE,
            type: 'text',
            text: { body: `📩 *Nuevo mensaje en ContactGo*\n\n👤 *${nombre}*\n📱 ${displayPhone}\n💬 ${preview.slice(0, 300)}\n\n👉 Responder: https://www.contactgo.net/admin/whatsapp` },
          }),
        })
      }
    }

    // ── Handle status updates ──
    const statuses = changes?.statuses
    if (statuses?.length > 0) {
      for (const s of statuses) {
        await sb.from('whatsapp_messages')
          .update({ status: s.status })
          .eq('wa_message_id', s.id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[WA/webhook]', err.message)
    return NextResponse.json({ ok: true })
  }
}
