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

        // ── AUTO-RESPUESTA INTELIGENTE ──
        // Primer mensaje o mensaje genérico → menú con botones.
        // Respuestas a botones → respuesta específica + notificación.
        // Fotos de receta → confirmación + notificación prioritaria.
        try {
          const { sendText: waSendText, sendButtons } = await import('@/lib/whatsapp')

          // Verificar si es primera vez que escribe (últimos 30 días)
          const { count: prevMsgs } = await sb
            .from('whatsapp_messages')
            .select('*', { count: 'exact', head: true })
            .eq('phone', from)
            .eq('direction', 'inbound')
            .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())

          const isFirstMessage = (prevMsgs ?? 0) <= 1 // 1 = el que acabamos de guardar

          // Respuestas a los botones del menú
          const buttonId = msg.interactive?.button_reply?.id ?? ''

          if (buttonId === 'btn_receta') {
            await waSendText(from,
              '📋 ¡Perfecto! Envíanos una foto clara de tu receta y te cotizamos en minutos.\n\n' +
              'Si no tienes la receta a mano, dinos la marca y graduación que usas y te ayudamos.\n\n' +
              '👨‍⚕️ Mario te responde personalmente.'
            )
          } else if (buttonId === 'btn_color') {
            await waSendText(from,
              '🎨 ¡Excelente elección!\n\n' +
              'Tenemos AIR OPTIX COLORS (12 colores) desde RD$2,100 sin graduación.\n\n' +
              '👉 Ve los colores aquí: www.contactgo.net/producto/air-optix-colors-lentes-contacto-color-dominicana\n\n' +
              'O dime qué color te interesa y te ayudo directo. 😊'
            )
          } else if (buttonId === 'btn_pedido') {
            await waSendText(from,
              '📦 Dime tu nombre o número de pedido y te doy el estado al instante.\n\n' +
              '👨‍⚕️ Mario te responde en minutos.'
            )
          } else if (msgType === 'image' || msgType === 'document') {
            // Envió una foto (probable receta)
            await waSendText(from,
              '📸 ¡Recibido! Estoy revisando tu receta.\n\n' +
              'Te respondo con la cotización en minutos. ⏱️'
            )
          } else if (isFirstMessage || msgBody.toLowerCase().match(/^(hola|hi|buenos?\s*d[ií]as?|buenas?\s*tardes?|buenas?\s*noches?|hey|ey|saludos?)$/i)) {
            // Primer mensaje o saludo genérico → menú de botones
            const nombre = contactName ? contactName.split(' ')[0] : ''
            await sendButtons(
              from,
              `¡Hola${nombre ? ' ' + nombre : ''}! 👋 Bienvenido/a a ContactGo, tu tienda de lentes de contacto en RD.\n\n¿En qué te puedo ayudar?`,
              [
                { id: 'btn_receta', title: '📋 Cotizar con receta' },
                { id: 'btn_color', title: '🎨 Lentes de color' },
                { id: 'btn_pedido', title: '📦 Estado de pedido' },
              ],
              'ContactGo 👁️',
              'Te contestamos en minutos'
            )
          }
          // Si no es ninguno de los anteriores (mensaje libre), no auto-responde —
          // solo llega la notificación al admin para que Mario conteste personalmente.
        } catch (autoErr: any) {
          console.error('[WA/webhook] Auto-reply error:', autoErr.message)
          // Si falla la auto-respuesta, no importa — el admin recibe la notificación igual
        }

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

    // ── Handle status updates (sent → delivered → read) ──
    const statuses = changes?.statuses
    if (statuses?.length > 0) {
      for (const s of statuses) {
        // Actualizar tabla whatsapp_messages (mensajes chat)
        await sb.from('whatsapp_messages')
          .update({ status: s.status })
          .eq('wa_message_id', s.id).then(() => {}, () => {})
        
        // Actualizar log de automatizaciones si es una notificación auto
        const updates: any = {}
        if (s.status === 'delivered' && s.timestamp) {
          updates.delivered_at = new Date(Number(s.timestamp) * 1000).toISOString()
        }
        if (s.status === 'read' && s.timestamp) {
          updates.read_at = new Date(Number(s.timestamp) * 1000).toISOString()
        }
        if (Object.keys(updates).length > 0) {
          await sb.from('wa_automation_log')
            .update(updates)
            .eq('wa_message_id', s.id).then(() => {}, () => {})
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[WA/webhook]', err.message)
    return NextResponse.json({ ok: true })
  }
}
