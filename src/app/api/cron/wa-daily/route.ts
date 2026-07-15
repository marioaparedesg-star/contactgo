// ============================================================
// ContactGo — CRON diario 9am (DR)
// Envía: notificación de envío, solicitud de reseña, renovación
// GET /api/cron/wa-daily  (Vercel Cron)
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendText, normalizePhone } from '@/lib/whatsapp'
import { notificarRenovacion } from '@/lib/wa-notifications'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function logAutomation(sb: any, order_id: string | null, telefono: string, tipo: string, ok: boolean, msgId?: string, err?: string) {
  try {
    await sb.from('wa_automation_log').insert({
      order_id, telefono, tipo,
      estado: ok ? 'sent' : 'failed',
      wa_message_id: msgId ?? null,
      error: err ?? null,
    })
  } catch {}
}

export async function GET(req: NextRequest) {
  // Seguridad: solo Vercel Cron o llamadas con secret
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = getSb()
  const results = { envios: 0, resenas: 0, renovaciones: 0, errores: 0 }

  // ─────────────────────────────────────────────────────
  // 1. NOTIFICACIÓN DE ENVÍO — pedidos con estado='enviado' que no han recibido WA
  // ─────────────────────────────────────────────────────
  try {
    const { data: enviados } = await sb
      .from('orders')
      .select('id, cliente_nombre, cliente_telefono, numero_orden')
      .eq('estado', 'enviado')
      .eq('wa_envio_enviado', false)
      .not('cliente_telefono', 'is', null)
      .limit(50)

    for (const o of enviados ?? []) {
      try {
        const nombre = o.cliente_nombre?.split(' ')[0] ?? 'Cliente'
        const mensaje = `🚚 *¡Tus lentes están en camino, ${nombre}!*\n\n` +
          `Tu pedido *#${o.numero_orden}* de ContactGo ya fue enviado.\n\n` +
          `📍 *Estimado de entrega:* hoy o mañana\n` +
          `📦 Recibirás tus lentes en la dirección que registraste\n\n` +
          `¿Preguntas sobre tu entrega? Responde aquí mismo. 👇`
        
        const res = await sendText(o.cliente_telefono, mensaje)
        await sb.from('orders').update({
          wa_envio_enviado: true,
          wa_envio_fecha: new Date().toISOString(),
        }).eq('id', o.id)
        await logAutomation(sb, o.id, o.cliente_telefono, 'envio', true, res?.messages?.[0]?.id)
        results.envios++
      } catch (e: any) {
        await logAutomation(sb, o.id, o.cliente_telefono, 'envio', false, undefined, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] envios:', e) }

  // ─────────────────────────────────────────────────────
  // 2. SOLICITUD DE RESEÑA — 3 días después de envío
  // ─────────────────────────────────────────────────────
  try {
    const hace3dias = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const { data: resenas } = await sb
      .from('orders')
      .select('id, cliente_nombre, cliente_telefono, numero_orden')
      .eq('wa_envio_enviado', true)
      .lt('wa_envio_fecha', hace3dias)
      .eq('wa_resena_enviada', false)
      .eq('resena_solicitada', false)
      .not('cliente_telefono', 'is', null)
      .limit(50)

    for (const o of resenas ?? []) {
      try {
        const nombre = o.cliente_nombre?.split(' ')[0] ?? 'Cliente'
        const mensaje = `👋 Hola *${nombre}*, ¿cómo te fue con tus lentes de ContactGo?\n\n` +
          `Tu opinión ayuda a otros dominicanos a decidir con confianza. 💚\n\n` +
          `⭐ Comparte tu experiencia (30 segundos):\n` +
          `👉 www.contactgo.net/resenas\n\n` +
          `🎁 *Bonus:* Envía foto usándolos y te regalamos *RD$200 de crédito* para tu próxima compra.\n\n` +
          `Gracias por confiar en nosotros. 🙏`
        
        const res = await sendText(o.cliente_telefono, mensaje)
        await sb.from('orders').update({
          wa_resena_enviada: true,
          resena_solicitada: true,
        }).eq('id', o.id)
        await logAutomation(sb, o.id, o.cliente_telefono, 'resena', true, res?.messages?.[0]?.id)
        results.resenas++
      } catch (e: any) {
        await logAutomation(sb, o.id, o.cliente_telefono, 'resena', false, undefined, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] resenas:', e) }

  // ─────────────────────────────────────────────────────
  // 3. RECORDATORIO DE RENOVACIÓN
  // Diario: día 25 (cajas de 30)
  // Mensual: día 25 post-compra
  // Quincenal: día 12 post-compra (más frecuente, mismo criterio)
  // Trigger conservador: 25 días desde pagado_en, tenga producto renovable
  // ─────────────────────────────────────────────────────
  try {
    const hace25dias = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    const hace60dias = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()

    const { data: renovaciones } = await sb
      .from('orders')
      .select(`
        id, cliente_nombre, cliente_telefono, numero_orden, pagado_en,
        order_items(nombre, tipo)
      `)
      .eq('pago_estado', 'aprobado')
      .eq('wa_renovacion_enviada', false)
      .lt('pagado_en', hace25dias)
      .gt('pagado_en', hace60dias) // solo pedidos entre 25-60 días atrás
      .not('cliente_telefono', 'is', null)
      .limit(50)

    for (const o of renovaciones ?? []) {
      try {
        // Solo enviar si el pedido tiene lentes (no solo soluciones/gotas)
        const items = (o as any).order_items ?? []
        const tieneLentes = items.some((i: any) => 
          ['esferico', 'torico', 'multifocal', 'color'].includes(i.tipo)
        )
        if (!tieneLentes) {
          await sb.from('orders').update({ wa_renovacion_enviada: true }).eq('id', o.id)
          continue
        }

        const nombre = o.cliente_nombre?.split(' ')[0] ?? 'Cliente'
        const primerLente = items.find((i: any) => 
          ['esferico', 'torico', 'multifocal', 'color'].includes(i.tipo)
        )
        const producto = primerLente?.nombre ?? 'tus lentes de contacto'

        const mensaje = `👁️ Hola *${nombre}*, ¿cómo van tus lentes?\n\n` +
          `Ya casi es momento de reponer *${producto}*.\n\n` +
          `🔄 Renuévalos hoy y te llegan antes de que se acaben:\n` +
          `👉 www.contactgo.net\n\n` +
          `🎁 *10% de descuento* para clientes recurrentes con el código:\n` +
          `*RENUEVA10*\n\n` +
          `¿Los mismos o quieres probar algo nuevo? Responde aquí y te ayudo. 😊`
        
        const res = await sendText(o.cliente_telefono, mensaje)
        await sb.from('orders').update({
          wa_renovacion_enviada: true,
          wa_renovacion_fecha: new Date().toISOString(),
        }).eq('id', o.id)
        await logAutomation(sb, o.id, o.cliente_telefono, 'renovacion', true, res?.messages?.[0]?.id)
        results.renovaciones++
      } catch (e: any) {
        await logAutomation(sb, o.id, o.cliente_telefono, 'renovacion', false, undefined, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] renovaciones:', e) }

  // ─────────────────────────────────────────────────────
  // 3b. RECORDATORIOS DE REPOSICIÓN — suscripciones activas (tabla subscriptions)
  // Selección del cliente en "¿Cada cuánto necesitas reponer?" en la página de producto.
  // NO es cobro automático — solo envía WhatsApp con link para reordenar manualmente.
  // Usa template ya aprobado (renovacion_lentes), no texto libre, para garantizar entrega.
  // ─────────────────────────────────────────────────────
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const { data: subsVencidas } = await sb
      .from('subscriptions')
      .select('id, cliente_nombre, cliente_telefono, items, proximo_envio')
      .eq('activa', true)
      .eq('cancelada', false)
      .lte('proximo_envio', hoy)

    for (const s of subsVencidas ?? []) {
      try {
        const items = Array.isArray(s.items) ? s.items : []
        const nombreProducto = items[0]?.nombre ?? 'tus lentes de contacto'
        const res = await notificarRenovacion({
          telefono: s.cliente_telefono,
          nombre: s.cliente_nombre,
          producto: nombreProducto,
        })
        if (res.ok) {
          // Calcular siguiente fecha de recordatorio (mismo ciclo, se repite)
          const { data: freqRow } = await sb.from('subscriptions').select('frecuencia').eq('id', s.id).single()
          const dias = freqRow?.frecuencia === 'trimestral' ? 90 : freqRow?.frecuencia === 'semestral' ? 180 : 30
          const siguiente = new Date()
          siguiente.setDate(siguiente.getDate() + dias)
          await sb.from('subscriptions').update({
            proximo_envio: siguiente.toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          }).eq('id', s.id)
          results.renovaciones++
        }
      } catch (e: any) {
        console.error('[cron/wa-daily] recordatorio suscripción:', s.id, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] recordatorios suscripcion:', e) }

  // ─────────────────────────────────────────────────────
  // 4. CARRITOS ABANDONADOS — de las últimas 24h
  // (en plan Hobby solo hay 1 cron diario, así que se procesa todo aquí)
  // ─────────────────────────────────────────────────────
  const resultsCarritos = { carritos: 0 }
  try {
    const hace2h = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: carritos } = await sb
      .from('carritos_abandonados')
      .select('*')
      .eq('wa_enviado', false)
      .eq('convertido', false)
      .lt('created_at', hace2h)
      .gt('created_at', hace24h)
      .not('telefono', 'is', null)
      .limit(50)

    for (const c of carritos ?? []) {
      try {
        const nombre = c.nombre?.split(' ')[0] ?? ''
        const items = Array.isArray(c.items) ? c.items : []
        const productos = items.slice(0, 3)
          .map((i: any) => `• ${i.nombre ?? 'Producto'}${i.cantidad > 1 ? ` x${i.cantidad}` : ''}`)
          .join('\n')

        const mensaje = `👋 Hola${nombre ? ` *${nombre}*` : ''}, dejaste algo esperando en tu carrito 🛒\n\n` +
          `${productos}\n\n` +
          `¿Tuviste algún problema al comprar? Te ayudamos ahora mismo.\n\n` +
          `🎁 *5% de descuento* para que completes hoy:\n*VUELVE5*\n\n` +
          `👉 Continúa aquí: www.contactgo.net/cart\n\n` +
          `O responde este mensaje y te asistimos personalmente. 💚`

        const res = await sendText(c.telefono, mensaje)
        await sb.from('carritos_abandonados').update({
          wa_enviado: true,
          wa_enviado_at: new Date().toISOString(),
        }).eq('id', c.id)
        await logAutomation(sb, null, c.telefono, 'carrito', true, res?.messages?.[0]?.id)
        resultsCarritos.carritos++
      } catch (e: any) {
        await logAutomation(sb, null, c.telefono, 'carrito', false, undefined, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] carritos:', e) }

  // ─────────────────────────────────────────────────────
  // 5. CROSS-SELL — 15 días post-compra
  // Cliente compró lentes → sugerir solución/gotas si no las tiene
  // ─────────────────────────────────────────────────────
  const resultsCross = { cross_sell: 0 }
  try {
    const hace15dias = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    const hace20dias = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()

    // Añadir columna wa_crosssell_enviado dinámicamente si no existe (via query try/catch)
    const { data: ventasLentes } = await sb
      .from('orders')
      .select(`
        id, cliente_nombre, cliente_telefono, numero_orden,
        order_items(nombre, tipo)
      `)
      .eq('pago_estado', 'aprobado')
      .lt('pagado_en', hace15dias)
      .gt('pagado_en', hace20dias)
      .not('cliente_telefono', 'is', null)
      .limit(30)

    for (const o of ventasLentes ?? []) {
      // Verificar si ya se envió cross-sell a este pedido
      const { count: yaEnviado } = await sb
        .from('wa_automation_log')
        .select('*', { count: 'exact', head: true })
        .eq('order_id', o.id)
        .eq('tipo', 'cross_sell')
      if (yaEnviado && yaEnviado > 0) continue

      const items = (o as any).order_items ?? []
      const tieneLentes = items.some((i: any) => ['esferico', 'torico', 'multifocal', 'color'].includes(i.tipo))
      const tieneSolucion = items.some((i: any) => i.tipo === 'solucion')
      const tieneGotas = items.some((i: any) => i.tipo === 'gota')

      if (!tieneLentes || (tieneSolucion && tieneGotas)) continue

      try {
        const nombre = o.cliente_nombre?.split(' ')[0] ?? 'Cliente'
        let sugerencia = ''
        if (!tieneSolucion && !tieneGotas) {
          sugerencia = `Complementa tus lentes con:\n\n` +
            `💧 *Opti-Free Puremoist* (solución) — RD$750\n` +
            `👁️ *Refresh Tears* (gotas) — RD$800\n\n` +
            `Mantén tus lentes limpios y tus ojos frescos todo el día.`
        } else if (!tieneSolucion) {
          sugerencia = `💧 Notamos que no compraste solución de limpieza.\n\n` +
            `*Opti-Free Puremoist* (RD$750) protege tus lentes y prolonga su vida útil.`
        } else {
          sugerencia = `👁️ Notamos que no compraste gotas lubricantes.\n\n` +
            `*Refresh Tears* (RD$800) alivia la sequedad al usar lentes todo el día.`
        }

        const mensaje = `Hola *${nombre}* 👋\n\n` +
          `Han pasado 2 semanas desde tu compra. ¿Cómo van tus lentes?\n\n` +
          `${sugerencia}\n\n` +
          `🎁 *10% OFF* con el código *COMPLETO10*\n` +
          `👉 www.contactgo.net\n\n` +
          `¿Preguntas? Responde aquí. 💚`

        const res = await sendText(o.cliente_telefono, mensaje)
        await logAutomation(sb, o.id, o.cliente_telefono, 'cross_sell', true, res?.messages?.[0]?.id)
        resultsCross.cross_sell++
      } catch (e: any) {
        await logAutomation(sb, o.id, o.cliente_telefono, 'cross_sell', false, undefined, e.message)
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-daily] cross-sell:', e) }

  // ─────────────────────────────────────────────────────
  // 6. REINTENTOS — procesar cola de mensajes fallidos
  // Backoff exponencial: 5min → 30min → 2h → giveup
  // ─────────────────────────────────────────────────────
  const resultsRetry = { reintentos: 0, resueltos: 0, descartados: 0 }
  try {
    const { data: retries } = await sb
      .from('wa_retry_queue')
      .select('*')
      .eq('resolved', false)
      .lt('next_retry_at', new Date().toISOString())
      .lt('attempt', 3)
      .limit(50)

    for (const r of retries ?? []) {
      try {
        // Reintentar directamente con sendText
        const { sendText } = await import('@/lib/whatsapp')
        const res = await sendText(r.telefono, r.mensaje)
        const wa_id = res?.messages?.[0]?.id ?? null

        // Marcar como resuelto
        await sb.from('wa_retry_queue').update({ resolved: true }).eq('id', r.id)
        await sb.from('wa_automation_log').insert({
          evento_id: r.evento_id,
          telefono: r.telefono,
          tipo: r.tipo,
          estado: 'sent',
          wa_message_id: wa_id,
          order_id: r.order_id,
          user_id: r.user_id,
          attempt: (r.attempt ?? 0) + 1,
        })
        resultsRetry.resueltos++
      } catch (e: any) {
        const nextAttempt = (r.attempt ?? 0) + 1
        if (nextAttempt >= 3) {
          // Descartar tras 3 intentos
          await sb.from('wa_retry_queue').update({
            resolved: true,
            last_error: `Max attempts. Last: ${e.message?.slice(0, 200)}`,
          }).eq('id', r.id)
          resultsRetry.descartados++
        } else {
          // Backoff: 30min o 2h
          const delayMs = nextAttempt === 1 ? 30 * 60 * 1000 : 2 * 60 * 60 * 1000
          await sb.from('wa_retry_queue').update({
            attempt: nextAttempt,
            next_retry_at: new Date(Date.now() + delayMs).toISOString(),
            last_error: e.message?.slice(0, 200),
          }).eq('id', r.id)
          resultsRetry.reintentos++
        }
      }
    }
  } catch (e) { console.error('[cron/wa-daily] retry:', e) }

  return NextResponse.json({ ok: true, ...results, ...resultsCarritos, ...resultsCross, ...resultsRetry, ejecutado_at: new Date().toISOString() })
}
