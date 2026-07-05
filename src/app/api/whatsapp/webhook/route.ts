// ============================================================
// ContactGo — WhatsApp Webhook
// GET  — verificación de Meta
// POST — recibir mensajes entrantes y guardarlos en Supabase
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
    console.log('[WA/webhook] Verificado por Meta')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]?.value
    
    // Handle incoming messages
    const messages = changes?.messages
    if (messages?.length > 0) {
      const sb = getSb()
      for (const msg of messages) {
        const from = msg.from ?? ''
        const contactName = changes?.contacts?.[0]?.profile?.name ?? null
        const msgType = msg.type ?? 'text'
        let msgBody = ''
        let mediaUrl = null

        if (msgType === 'text') {
          msgBody = msg.text?.body ?? ''
        } else if (msgType === 'image') {
          msgBody = msg.image?.caption ?? '[Imagen]'
          mediaUrl = msg.image?.id ?? null
        } else if (msgType === 'audio') {
          msgBody = '[Audio]'
          mediaUrl = msg.audio?.id ?? null
        } else if (msgType === 'document') {
          msgBody = msg.document?.filename ?? '[Documento]'
          mediaUrl = msg.document?.id ?? null
        } else if (msgType === 'video') {
          msgBody = '[Video]'
          mediaUrl = msg.video?.id ?? null
        } else if (msgType === 'location') {
          msgBody = `📍 Ubicación: ${msg.location?.latitude}, ${msg.location?.longitude}`
        } else if (msgType === 'reaction') {
          msgBody = `Reacción: ${msg.reaction?.emoji ?? ''}`
        } else {
          msgBody = `[${msgType}]`
        }

        console.log(`[WA/webhook] Mensaje de ${from} (${contactName}): "${msgBody}"`)

        try {
          await sb.from('whatsapp_messages').insert({
            wa_message_id: msg.id ?? null,
            phone: from,
            phone_name: contactName,
            direction: 'inbound',
            message_type: msgType,
            body: msgBody,
            media_url: mediaUrl,
            status: 'received',
            read: false,
          })
        } catch (dbErr: any) {
          console.error('[WA/webhook] DB insert error:', dbErr.message)
        }

        // ── Notificación al admin (829-408-9097) ──
        // Envía alerta instantánea al personal de Mario para respuesta rápida
        try {
          const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE ?? '18294089097'
          const WA_API = 'https://graph.facebook.com/v20.0'
          const PHONE_ID = process.env.WHATSAPP_PHONE_ID ?? ''
          const TOKEN = process.env.WHATSAPP_TOKEN ?? ''
          
          // No notificar mensajes propios ni reacciones
          if (from !== ADMIN_PHONE.replace(/^1/, '') && msgType !== 'reaction') {
            const displayPhone = from.length === 11 && from.startsWith('1')
              ? `(${from.slice(1,4)}) ${from.slice(4,7)}-${from.slice(7)}`
              : from
            const nombre = contactName ?? displayPhone

            const alerta = `📩 *Nuevo mensaje en ContactGo*\n\n` +
              `👤 *${nombre}*\n` +
              `📱 ${displayPhone}\n` +
              `💬 ${msgBody.slice(0, 300)}${msgBody.length > 300 ? '...' : ''}\n\n` +
              `👉 Responder: https://www.contactgo.net/admin/whatsapp`

            await fetch(`${WA_API}/${PHONE_ID}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: ADMIN_PHONE,
                type: 'text',
                text: { body: alerta },
              }),
            })
          }
        } catch (notifErr: any) {
          // Notificación es best-effort — no bloquear el webhook
          console.error('[WA/webhook] Notif error:', notifErr.message)
        }
      }
    }

    // Handle status updates (sent, delivered, read)
    const statuses = changes?.statuses
    if (statuses?.length > 0) {
      const sb = getSb()
      for (const s of statuses) {
        try {
          await sb.from('whatsapp_messages')
            .update({ status: s.status })
            .eq('wa_message_id', s.id)
        } catch (e: any) {
          // Status updates are best-effort
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[WA/webhook]', err.message)
    return NextResponse.json({ ok: true })
  }
}
