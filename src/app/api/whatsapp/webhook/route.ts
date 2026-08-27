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

    // ── PROTECCIÓN: número personal de servicio manual ──────────────────
    // +1 809-694-2268 (Phone Number ID 1174240852444859) es el número que
    // Mario usa para responder manualmente y donde vive el Meta Business
    // Agent (IA nativa de Meta, configurada directo en WhatsApp Manager —
    // no es código nuestro). Este webhook NUNCA debe procesar ni
    // auto-responder mensajes de este número: si lo hiciera, se dispararía
    // sin que el Meta Business Agent ni Mario se enteren, duplicando o
    // interfiriendo con lo que ya está pasando ahí. Cualquier mensaje que
    // llegue con este phone_number_id se ignora por completo, de inmediato.
    const NUMERO_MANUAL_PROTEGIDO = '1174240852444859'
    if (changes?.metadata?.phone_number_id === NUMERO_MANUAL_PROTEGIDO) {
      return NextResponse.json({ ok: true, ignorado: 'numero_manual_protegido' })
    }

    // ── Handle incoming messages ──
    const messages = changes?.messages
    if (messages?.length > 0) {
      const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE ?? ''
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
        // FIX (2026-08-18): se agrega captura del "referral" — el dato REAL
        // que manda WhatsApp cuando el mensaje viene de un clic en un
        // anuncio (ID del anuncio, título, URL). Antes no se guardaba nada
        // de esto, así que no había forma de confirmar con certeza si un
        // mensaje venía de publicidad o de otro lado — solo evidencia
        // circunstancial (horarios, patrones). Ahora queda el dato real.
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
          referral: msg.referral ?? null,
        })

        if (msg.referral) {
          console.log('[WA/webhook] Mensaje con origen de anuncio confirmado:', JSON.stringify(msg.referral))
        }

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

          // ── ¿Estábamos esperando algo específico de este número? (ej. número de pedido) ──
          const { data: estadoSesion } = await sb
            .from('wa_session_state').select('esperando').eq('phone', from).maybeSingle()
          const esperandoNumeroPedido = estadoSesion?.esperando === 'numero_pedido' && msgType === 'text' && msgBody.trim().length > 0

          // Guarda la auto-respuesta en la bandeja del admin (antes se perdía sin dejar rastro)
          const logAutoReply = async (texto: string) => {
            try {
              await sb.from('whatsapp_messages').insert({
                phone: from, direction: 'outbound', message_type: 'text',
                body: texto, status: 'sent', read: true,
              })
            } catch { /* no bloquea el flujo si falla el log */ }
          }

          if (buttonId === 'btn_receta') {
            const texto = '📋 ¡Perfecto! Envíanos una foto clara de tu receta y te cotizamos en minutos.\n\n' +
              'Si no tienes la receta a mano, dinos la marca y graduación que usas y te ayudamos.\n\n' +
              '👨‍⚕️ Nuestro equipo te responde personalmente. Si necesitas ayuda ahora mismo, escríbenos directo al 809-694-2268.'
            await waSendText(from, texto)
            await logAutoReply(texto)
          } else if (buttonId === 'btn_catalogo') {
            // CONECTADO DE VERDAD (2026-08-27): antes esto no existía como
            // botón — se agrega con datos reales del catálogo, no un texto
            // genérico. Trae los productos activos reales para dar contexto
            // real de precios, no una promesa vacía de "míralo en la web".
            const { data: topProductos } = await sb
              .from('products').select('nombre, precio, tipo')
              .eq('activo', true).order('precio', { ascending: true }).limit(5)
            const lista = (topProductos ?? [])
              .map((p: any) => `• ${p.nombre} — RD$${Number(p.precio).toLocaleString('es-DO')}`)
              .join('\n')
            const texto = `🛒 Este es un vistazo de nuestro catálogo (precios reales de hoy):\n\n${lista}\n\n` +
              `Ve el catálogo completo con todas las marcas y colores: www.contactgo.net/catalogo\n\n` +
              `¿Buscas algo en específico? Dime la marca o el tipo de lente y te ayudo directo. 😊`
            await waSendText(from, texto)
            await logAutoReply(texto)
          } else if (buttonId === 'btn_pedido') {
            // CONECTADO DE VERDAD (2026-08-27): antes decía "dinos tu pedido
            // y te respondemos" y ahí quedaba — un humano tenía que leerlo y
            // buscar manualmente. Ahora se marca el estado de la conversación
            // para que, cuando la persona responda con su número de pedido o
            // teléfono, el bot consulte la orden REAL y responda con el
            // estado verdadero, sin esperar a que alguien lo revise.
            await sb.from('wa_session_state').upsert({ phone: from, esperando: 'numero_pedido', updated_at: new Date().toISOString() })
            const texto = '📦 Dime tu número de pedido (ej. CG-12345678) o el número de teléfono con el que compraste, y te doy el estado al instante.'
            await waSendText(from, texto)
            await logAutoReply(texto)
          } else if (esperandoNumeroPedido) {
            // ── Ya sabemos que este mensaje es la respuesta a "Rastrear pedido" ──
            await sb.from('wa_session_state').delete().eq('phone', from)
            const textoLimpio = msgBody.trim().toUpperCase().replace(/\s+/g, '')
            const pareceNumeroOrden = /^(CG-?)?\d{5,}$/.test(textoLimpio)
            const pareceTelefono = /^\d{10}$/.test(msgBody.replace(/\D/g, ''))

              let pedido = null
              if (pareceNumeroOrden) {
                const { data } = await sb.from('orders')
                  .select('numero_orden, estado, pago_estado, total, created_at, cliente_nombre')
                  .ilike('numero_orden', `%${textoLimpio.replace(/^CG-?/, '')}%`)
                  .eq('es_prueba', false).order('created_at', { ascending: false }).limit(1).maybeSingle()
                pedido = data
              } else if (pareceTelefono) {
                const tel = msgBody.replace(/\D/g, '').slice(-10)
                const { data } = await sb.from('orders')
                  .select('numero_orden, estado, pago_estado, total, created_at, cliente_nombre')
                  .ilike('cliente_telefono', `%${tel}%`)
                  .eq('es_prueba', false).order('created_at', { ascending: false }).limit(1).maybeSingle()
                pedido = data
              }

              const ESTADO_LABEL: Record<string, string> = {
                recibido: 'Recibido — lo estamos procesando',
                confirmado: 'Confirmado, preparando tu pedido',
                preparando: 'Preparando tus lentes',
                fabricante: 'En fabricación (pedido especial, puede tardar más)',
                enviado: 'Enviado — ya va en camino',
                transito: 'En tránsito — llega pronto',
                entregado: '✅ Entregado',
                cancelado: 'Cancelado',
              }

              if (pedido) {
                const estadoTexto = pedido.pago_estado !== 'pagado'
                  ? '⏳ Pendiente de pago'
                  : (ESTADO_LABEL[pedido.estado] ?? pedido.estado)
                const texto = `📦 Encontré tu pedido *${pedido.numero_orden}*\n\n` +
                  `Estado: ${estadoTexto}\n` +
                  `Total: RD$${Number(pedido.total).toLocaleString('es-DO')}\n\n` +
                  `¿Alguna otra pregunta sobre tu pedido? Escríbenos, o directo al 809-694-2268.`
                await waSendText(from, texto)
                await logAutoReply(texto)
              } else {
                const texto = `No encontré ningún pedido con "${msgBody.trim()}" 🤔\n\n` +
                  `Verifica el número (formato CG-XXXXXXXX) o escríbenos el teléfono exacto con el que compraste. ` +
                  `Si prefieres, nuestro equipo lo busca por ti — dinos tu nombre completo.`
                await waSendText(from, texto)
                await logAutoReply(texto)
              }
          } else if (msgType === 'image' || msgType === 'document') {
            // Envió una foto — puede ser receta, o puede ser otra cosa (ej. screenshot de un error).
            // El texto deja claro que un humano lo revisa, sin asumir que es receta.
            const texto = '📸 ¡Recibido! Ya nuestro equipo está revisando tu mensaje.\n\n' +
              'Te responde en minutos. Si es algo urgente, dinos brevemente de qué se trata. ⏱️'
            await waSendText(from, texto)
            await logAutoReply(texto)
          } else if (isFirstMessage || (msgBody.toLowerCase().match(/^(hola|hi|buenos?\s*d[ií]as?|buenas?\s*tardes?|buenas?\s*noches?|hey|ey|saludos?)$/i) && !buttonId)) {
            // BUG CORREGIDO (2026-08-08): antes, un simple "Hola" a mitad de
            // una conversación ya en curso volvía a mostrar el menú desde
            // cero — el cliente sentía que el bot "se trababa y repetía todo
            // otra vez" aunque ya hubiera avanzado (ej. dado su número de
            // pedido). Ahora solo se re-muestra el menú si además es de
            // verdad su primer mensaje reciente — un saludo de cortesía en
            // medio de la conversación ya no reinicia nada.
            if (!isFirstMessage) {
              // Saludo de cortesía a mitad de conversación → seguimos sin
              // responder automáticamente (mismo camino que un mensaje libre)
              // para no repetir el menú ni interrumpir el hilo real.
            } else {
            const nombre = contactName ? contactName.split(' ')[0] : ''
            const texto = `👋 ¡Hola${nombre ? ' ' + nombre : ''}! Bienvenido/a a ContactGo 👁️\n\n` +
              `Somos la tienda 100% online especializada exclusivamente en lentes de contacto en RD — ubicados en Av. Winston Churchill, Torre Blue Mall, Santo Domingo, aunque todo el proceso es por aquí y por contactgo.net.\n\n¿En qué te ayudamos hoy?`
            await sendButtons(
              from,
              texto,
              [
                { id: 'btn_catalogo', title: '🛒 Ver catálogo' },
                { id: 'btn_receta', title: '👁️ Ayuda con receta' },
                { id: 'btn_pedido', title: '📦 Rastrear pedido' },
              ],
              'ContactGo 👁️',
              'Te contestamos en minutos'
            )
            await logAutoReply(`${texto}\n\n[Menú: 🛒 Ver catálogo | 👁️ Ayuda con receta | 📦 Rastrear pedido]`)
            }
          }
          // Si no es ninguno de los anteriores (mensaje libre), no auto-responde —
          // solo llega la notificación al admin para que Mario conteste personalmente.
        } catch (autoErr: any) {
          console.error('[WA/webhook] Auto-reply error:', autoErr.message)
          // Si falla la auto-respuesta, no importa — el admin recibe la notificación igual
        }

        // ── Notificación al admin y al número de servicio personal de Mario ──
        // BUG CORREGIDO (2026-08-08): se mandaba como texto libre, que
        // WhatsApp solo entrega si ese número le escribió a este mismo
        // número de automatización en las últimas 24h. El número de
        // servicio personal de Mario casi nunca cumple esa condición, así
        // que la notificación fallaba en silencio (el fetch no revisaba la
        // respuesta ni registraba el error). Ahora usa una plantilla
        // aprobada (aviso_nuevo_mensaje_admin), que Meta entrega siempre,
        // sin depender de ninguna ventana de tiempo.
        const displayPhone = from.length === 11 && from.startsWith('1')
          ? `(${from.slice(1,4)}) ${from.slice(4,7)}-${from.slice(7)}`
          : from
        const nombre = contactName ?? displayPhone
        const preview = msgBody || (mediaUrl ? `[${msgType}]` : '[mensaje]')
        const NOTIFY_PHONES = [ADMIN_PHONE, '18096942268'].filter(Boolean)

        for (const notifyTo of NOTIFY_PHONES) {
          const res = await fetch(`${WA_API}/${PHONE_ID}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: notifyTo,
              type: 'template',
              template: {
                name: 'aviso_nuevo_mensaje_admin',
                language: { code: 'es' },
                components: [{
                  type: 'body',
                  parameters: [
                    { type: 'text', text: nombre },
                    { type: 'text', text: displayPhone },
                    { type: 'text', text: preview.slice(0, 300) },
                  ],
                }],
              },
            }),
          })
          const resData = await res.json().catch(() => null)
          if (resData?.error) {
            console.error(`[WA/webhook] Notificación admin falló para ${notifyTo}:`, JSON.stringify(resData.error))
          }
        }
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
