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
  // 1 y 2. DESACTIVADOS (2026-07-24) — el paso 1 buscaba estado='enviado', un valor que
  // nunca existe en esta tabla (los estados reales son: cancelado, entregado, fabricante),
  // así que nunca se ejecutaba y por lo tanto tampoco el paso 2 (que dependía de él).
  // El aviso de "en tránsito" ya lo cubre /api/notify cuando el admin cambia el estado
  // manualmente. La solicitud de reseña ahora la maneja /api/solicitar-resena por email
  // (dispara 3 días después de estado='entregado', más confiable que WhatsApp en texto
  // libre — WhatsApp exige plantilla aprobada para mensajes iniciados por el negocio fuera
  // de la ventana de 24h, y no hay ninguna plantilla de reseña aprobada todavía).
  // ─────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────
  // 3. RECORDATORIO DE RENOVACIÓN — DESACTIVADO (2026-08-02)
  // Este bloque enviaba texto libre 25-60 días después de la compra. Dos problemas:
  //   1. Duplicaba lo que ya hace /api/recompra/cron correctamente, con plantilla
  //      aprobada de Meta y cálculo real por producto (dias_uso), no una ventana
  //      genérica de 25-60 días igual para lentes diarios que mensuales.
  //   2. WhatsApp RECHAZA mensajes de texto libre iniciados por el negocio fuera
  //      de la ventana de 24h de conversación — a los 25+ días de la compra, casi
  //      con certeza el cliente no ha escrito nada reciente, así que Meta habría
  //      devuelto error y el mensaje nunca habría llegado.
  // El sistema de recompra real y funcional es /api/recompra/cron (7/3/0 días
  // antes de que se agote el producto, con plantilla 'renovacion_lentes' aprobada).
  // ─────────────────────────────────────────────────────

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
  // ─────────────────────────────────────────────────────
  // 5. CROSS-SELL — 15 días post-compra
  // Cliente compró lentes → sugerir solución/gotas si no las tiene.
  //
  // FIX (2026-08-02): antes se enviaba por WhatsApp con texto libre (sendText),
  // que Meta rechaza fuera de la ventana de 24h de conversación — a los 15 días
  // de la compra casi seguro el cliente no ha escrito nada reciente, así que el
  // mensaje nunca llegaba (fallaba en silencio). Cambiado a email vía Resend,
  // que no tiene esa restricción y ya es el canal probado para reseñas.
  // También se corrigió el cupón COMPLETO10 mencionado en el mensaje, que no
  // existía en la base de datos — un cliente que lo intentara usar habría
  // recibido error de "cupón inválido".
  // ─────────────────────────────────────────────────────
  const resultsCross = { cross_sell: 0 }
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const hace15dias = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    const hace20dias = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()

    const { data: ventasLentes } = await sb
      .from('orders')
      .select(`
        id, cliente_nombre, cliente_email, numero_orden,
        order_items(nombre, tipo)
      `)
      .eq('pago_estado', 'pagado')
      .lt('pagado_en', hace15dias)
      .gt('pagado_en', hace20dias)
      .not('cliente_email', 'is', null)
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
        let sugerenciaHtml = ''
        if (!tieneSolucion && !tieneGotas) {
          sugerenciaHtml = `
            <p style="color:#374151;font-size:14px">Complementa tus lentes con:</p>
            <ul style="color:#374151;font-size:14px;padding-left:20px">
              <li>💧 <strong>Opti-Free Puremoist</strong> (solución) — RD$750</li>
              <li>👁️ <strong>Refresh Tears</strong> (gotas) — RD$800</li>
            </ul>
            <p style="color:#374151;font-size:14px">Mantén tus lentes limpios y tus ojos frescos todo el día.</p>`
        } else if (!tieneSolucion) {
          sugerenciaHtml = `
            <p style="color:#374151;font-size:14px">💧 Notamos que no llevaste solución de limpieza.</p>
            <p style="color:#374151;font-size:14px"><strong>Opti-Free Puremoist</strong> (RD$750) protege tus lentes y prolonga su vida útil.</p>`
        } else {
          sugerenciaHtml = `
            <p style="color:#374151;font-size:14px">👁️ Notamos que no llevaste gotas lubricantes.</p>
            <p style="color:#374151;font-size:14px"><strong>Refresh Tears</strong> (RD$800) alivia la sequedad al usar lentes todo el día.</p>`
        }

        await resend.emails.send({
          from: `ContactGo <info@contactgo.net>`,
          to: o.cliente_email,
          subject: `¿Cómo van tus lentes, ${nombre}? 👁️`,
          html: `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
  <div style="background:#16a34a;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0">ContactGo</p>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
    <h2 style="color:#111;font-size:18px">¡Hola, ${nombre}! 👋</h2>
    <p style="color:#374151;font-size:14px">
      Ya pasaron 2 semanas desde tu pedido <strong>${o.numero_orden}</strong>.
      Esperamos que estés disfrutando tus lentes.
    </p>
    ${sugerenciaHtml}
    <a href="https://www.contactgo.net?cupon=COMPLETO10"
      style="display:block;background:#16a34a;color:white;font-weight:700;padding:14px 24px;border-radius:10px;text-align:center;text-decoration:none;font-size:15px;margin:20px 0">
      🎁 10% OFF con el código COMPLETO10
    </a>
    <p style="color:#9ca3af;font-size:12px;text-align:center">
      ¿Alguna pregunta? Escríbenos por WhatsApp: +1 809 694-2268
    </p>
  </div>
</div>`,
        })

        await logAutomation(sb, o.id, o.cliente_email, 'cross_sell', true)
        resultsCross.cross_sell++
      } catch (e: any) {
        await logAutomation(sb, o.id, o.cliente_email, 'cross_sell', false, undefined, e.message)
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
