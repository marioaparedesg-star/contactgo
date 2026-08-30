// ============================================================
// ContactGo — CRON diario 9am (DR)
// Envía: notificación de envío, solicitud de reseña, renovación
// GET /api/cron/wa-daily  (Vercel Cron)
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendText, normalizePhone } from '@/lib/whatsapp'
import { notificarRenovacion, notificarRecompraPrevio } from '@/lib/wa-notifications'

// ═══ INTERRUPTOR DE SEGURIDAD ═══
// Apagado por defecto a propósito (Mario: "no envíe nada a nadie" hasta
// confirmar). Se activa poniendo RECOMPRA_AVISOS_PREVIOS_ACTIVO=true en las
// variables de entorno de Vercel — así no hace falta otro deploy para
// prenderlo, y se puede apagar igual de rápido si algo sale mal.
// Requiere además que las plantillas 'recompra_7dias' y 'recompra_3dias'
// estén aprobadas en Meta Business Manager — si no existen, notificar()
// simplemente falla ese envío sin tumbar el cron.
const AVISOS_PREVIOS_ACTIVO = process.env.RECOMPRA_AVISOS_PREVIOS_ACTIVO === 'true'

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
  const results = { envios: 0, resenas: 0, renovaciones: 0, errores: 0, avisos7d: 0, avisos3d: 0 }

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
  // Se crean automáticamente al completar el pago (ver /api/suscripciones/auto-crear),
  // calculando la duración EXACTA según producto × pares_por_caja × cantidad — o
  // manualmente si el cliente elige "¿Cada cuánto necesitas reponer?" en la página
  // de producto. NO es cobro automático — solo envía WhatsApp con link para
  // reordenar manualmente. Usa template ya aprobado (renovacion_lentes), no texto
  // libre, para garantizar entrega.
  //
  // REACTIVADO 2026-08-03 tras corregir el bug que causó el apagado de emergencia
  // (ver commit 777c547): dias_uso representa la duración de UN PAR de lentes, no
  // de la caja — faltaba multiplicar por pares_por_caja (nueva columna en
  // products). Confirmado con Mario y recalculadas TODAS las suscripciones
  // existentes antes de reactivar este bloque.
  // ─────────────────────────────────────────────────────
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const { data: subsVencidas } = await sb
      .from('subscriptions')
      .select('id, cliente_nombre, cliente_telefono, items, proximo_envio, frecuencia, dias_ciclo')
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
          // Calcular siguiente fecha de recordatorio (mismo ciclo, se repite).
          // Prioridad: dias_ciclo (duración exacta calculada del producto real)
          // sobre frecuencia (solo 3 categorías fijas, usada como fallback para
          // suscripciones manuales antiguas que no tienen dias_ciclo).
          const dias = (s as any).dias_ciclo ?? (s.frecuencia === 'trimestral' ? 90 : s.frecuencia === 'semestral' ? 180 : 30)
          const siguiente = new Date()
          siguiente.setDate(siguiente.getDate() + dias)
          await sb.from('subscriptions').update({
            proximo_envio: siguiente.toISOString().split('T')[0],
            // Nuevo ciclo empieza -> los avisos previos deben poder dispararse
            // otra vez cuando se acerque esta nueva fecha.
            aviso_7d_enviado: false,
            aviso_3d_enviado: false,
            updated_at: new Date().toISOString(),
          }).eq('id', s.id)
          results.renovaciones++
        }
      } catch (e: any) {
        console.error('[cron/wa-daily] recordatorio suscripción:', s.id, e.message)
        results.errores++
      }
    }

    // ── Avisos previos (7 y 3 días antes) — NUEVO, apagado hasta confirmar ──
    if (AVISOS_PREVIOS_ACTIVO) {
      const en7dias = new Date(); en7dias.setDate(en7dias.getDate() + 7)
      const en3dias = new Date(); en3dias.setDate(en3dias.getDate() + 3)
      const fecha7 = en7dias.toISOString().split('T')[0]
      const fecha3 = en3dias.toISOString().split('T')[0]

      const { data: sub7 } = await sb.from('subscriptions')
        .select('id, cliente_nombre, cliente_telefono, items, proximo_envio')
        .eq('activa', true).eq('cancelada', false).eq('aviso_7d_enviado', false)
        .eq('proximo_envio', fecha7)
      for (const s of sub7 ?? []) {
        try {
          const nombreProducto = (Array.isArray(s.items) ? s.items[0]?.nombre : null) ?? 'tus lentes de contacto'
          const res = await notificarRecompraPrevio(7, {
            subscription_id: s.id, telefono: s.cliente_telefono, nombre: s.cliente_nombre,
            producto: nombreProducto, proximo_envio: s.proximo_envio,
          })
          if (res.ok) {
            await sb.from('subscriptions').update({ aviso_7d_enviado: true }).eq('id', s.id)
            results.avisos7d = (results.avisos7d ?? 0) + 1
          }
        } catch (e: any) {
          console.error('[cron/wa-daily] aviso 7d:', s.id, e.message)
          results.errores++
        }
      }

      const { data: sub3 } = await sb.from('subscriptions')
        .select('id, cliente_nombre, cliente_telefono, items, proximo_envio')
        .eq('activa', true).eq('cancelada', false).eq('aviso_3d_enviado', false)
        .eq('proximo_envio', fecha3)
      for (const s of sub3 ?? []) {
        try {
          const nombreProducto = (Array.isArray(s.items) ? s.items[0]?.nombre : null) ?? 'tus lentes de contacto'
          const res = await notificarRecompraPrevio(3, {
            subscription_id: s.id, telefono: s.cliente_telefono, nombre: s.cliente_nombre,
            producto: nombreProducto, proximo_envio: s.proximo_envio,
          })
          if (res.ok) {
            await sb.from('subscriptions').update({ aviso_3d_enviado: true }).eq('id', s.id)
            results.avisos3d = (results.avisos3d ?? 0) + 1
          }
        } catch (e: any) {
          console.error('[cron/wa-daily] aviso 3d:', s.id, e.message)
          results.errores++
        }
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
  <div style="background:#002455;padding:20px;border-radius:12px 12px 0 0;text-align:center">
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
      style="display:block;background:#01B2B7;color:white;font-weight:700;padding:14px 24px;border-radius:10px;text-align:center;text-decoration:none;font-size:15px;margin:20px 0">
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

  // ─────────────────────────────────────────────────────
  // SECUENCIA EDUCATIVA POR EMAIL — personalizada por producto (2026-08-08)
  // 3 correos post-entrega con contenido de cuidado/higiene, no ventas.
  // Antes el texto era idéntico para todos — ahora varía según:
  //   - esDiario: si el producto es de reemplazo diario, NO se le habla de
  //     estuche/solución (no aplica) sino de por qué nunca debe reusarlo.
  //   - tipoPrincipal: tórico (nota de orientación/rotación), multifocal
  //     (nota de adaptación cerca/lejos), color (higiene de compartir),
  //     esferico (mensaje base).
  //   - Si el pedido es SOLO solución/gotas (sin lentes), se omite toda la
  //     secuencia — no tiene sentido explicarle a alguien "cómo ponerse
  //     lentes" si no compró lentes.
  // Mismo patrón de flags que resena_solicitada — evita duplicados sin
  // necesitar una tabla de eventos nueva. No se bloquea por incidencia
  // abierta (es contenido de ayuda, no comercial).
  // ─────────────────────────────────────────────────────
  const resultsEducativo = { dia3: 0, dia7: 0, dia14: 0, sin_lentes_omitidos: 0 }
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    type TipoPrincipal = 'torico' | 'multifocal' | 'color' | 'esferico'

    function notaAplicacion(tipo: TipoPrincipal): string {
      if (tipo === 'torico') return `<li>🔄 Si tu lente es tórico, puede experimentar pequeños movimientos al parpadear los primeros días. Si la visión permanece borrosa o inestable más allá de la adaptación inicial, retira el lente y escríbenos para orientarte.</li>`
      if (tipo === 'multifocal') return `<li>👓 Los multifocales necesitan un poco más de paciencia: tu cerebro tarda entre unos días y 2 semanas en acostumbrarse a ver de cerca y lejos con el mismo lente.</li>`
      if (tipo === 'color') return `<li>🎨 Nunca compartas tus lentes de color con nadie, aunque sean "de un solo uso estético" — es la misma regla de higiene que un lente graduado.</li>`
      return ''
    }
    function notaAlerta(tipo: TipoPrincipal): string {
      if (tipo === 'multifocal') return `<p style="color:#374151;font-size:14px">Si después del período de adaptación tu visión de cerca o lejos continúa sin sentirse nítida, consulta con tu optometrista — en algunos lentes multifocales puede ser necesario ajustar la graduación.</p>`
      if (tipo === 'torico') return `<p style="color:#374151;font-size:14px">Un poco de fluctuación visual al mover los ojos es normal en tóricos durante la adaptación — pero si persiste después de 2 semanas, avísanos.</p>`
      return ''
    }

    const ETAPAS_DEF = [
      {
        dias: 3, campo: 'educativo_dia3_enviado' as const,
        asunto: 'Cómo poner y quitar tus lentes correctamente 👁️',
        contenido: (nombre: string, tipo: TipoPrincipal) => `
          <h2 style="color:#111;font-size:18px">¡Hola, ${nombre}! 👋</h2>
          <p style="color:#374151;font-size:14px">Aquí tienes lo básico para empezar bien con tus lentes de contacto:</p>
          <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
            <li>✅ Lávate y sécate bien las manos antes de tocarlos</li>
            <li>✅ Revisa que el lente no esté al revés — el borde debe verse liso, no volteado</li>
            <li>✅ Colócatelo mirando hacia arriba, apoyando el párpado inferior</li>
            <li>✅ Si sientes molestia los primeros 1-2 días, es normal (período de adaptación)</li>
            ${notaAplicacion(tipo)}
            <li>⚠️ Nunca uses agua del grifo ni saliva — solo solución para lentes de contacto</li>
          </ul>
          <p style="color:#374151;font-size:14px">Si algo no se siente bien, no fuerces el lente — quítatelo y escríbenos por WhatsApp.</p>`,
      },
      {
        dias: 7, campo: 'educativo_dia7_enviado' as const,
        asunto: (esDiario: boolean) => esDiario ? 'Un tip importante sobre tus lentes diarios 🗓️' : 'El error más común con el estuche de tus lentes 🧴',
        contenido: (nombre: string, _tipo: TipoPrincipal, esDiario: boolean) => esDiario ? `
          <h2 style="color:#111;font-size:18px">${nombre}, un recordatorio rápido 🗓️</h2>
          <p style="color:#374151;font-size:14px">Tus lentes son de reemplazo diario — eso significa:</p>
          <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
            <li>✅ Se usan una sola vez y se descartan al final del día — no los reutilices ni los guardes en solución para el día siguiente</li>
            <li>✅ No necesitas estuche ni solución de limpieza para este producto</li>
            <li>⚠️ Reusar un lente diario aumenta muchísimo el riesgo de infección — el material no está diseñado para limpiarse y durar más de un día</li>
          </ul>` : `
          <h2 style="color:#111;font-size:18px">${nombre}, hablemos de tu estuche 🧴</h2>
          <p style="color:#374151;font-size:14px">Un estuche mal cuidado puede aumentar el riesgo de infecciones oculares. La recomendación es reemplazarlo cada 3-6 meses:</p>
          <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
            <li>✅ Cambia la solución del estuche cada vez que lo uses — nunca "rellenes" la de ayer</li>
            <li>✅ Enjuaga el estuche con solución (no agua) y déjalo secar boca abajo al aire</li>
            <li>✅ Cambia el estuche completo cada 3-6 meses</li>
          </ul>`,
      },
      {
        dias: 14, campo: 'educativo_dia14_enviado' as const,
        asunto: '¿Cuándo debes ver a un optometrista? 👀',
        contenido: (nombre: string, tipo: TipoPrincipal) => `
          <h2 style="color:#111;font-size:18px">${nombre}, esto es importante 👀</h2>
          <p style="color:#374151;font-size:14px">ContactGo no reemplaza a tu optometrista. Consulta a un profesional si notas:</p>
          <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
            <li>🔴 Ojo rojo que no mejora en 24 horas</li>
            <li>🔴 Dolor (no solo molestia leve de adaptación)</li>
            <li>🔴 Visión borrosa que no se corrige parpadeando</li>
            <li>🔴 Sensibilidad fuerte a la luz o secreción inusual</li>
          </ul>
          ${notaAlerta(tipo)}
          <p style="color:#374151;font-size:14px">Ante cualquiera de estas señales, quítate el lente y acude a un oftalmólogo u optometrista — no esperes a que pase solo.</p>`,
      },
    ]

    for (const etapa of ETAPAS_DEF) {
      const desde = new Date(Date.now() - (etapa.dias + 1) * 86400000).toISOString()
      const hasta = new Date(Date.now() - etapa.dias * 86400000).toISOString()

      const { data: ordenes } = await sb
        .from('orders')
        .select('id, cliente_nombre, cliente_email, order_items(nombre, products(tipo, reemplazo))')
        .eq('estado', 'entregado')
        .eq('es_prueba', false)
        .eq(etapa.campo, false)
        .not('cliente_email', 'is', null)
        .gte('updated_at', desde)
        .lte('updated_at', hasta)
        .limit(30)

      for (const o of ordenes ?? []) {
        try {
          const items = ((o as any).order_items ?? []) as { nombre: string; products: { tipo: string; reemplazo: string } | null }[]
          const tiposComprados = items.map(i => i.products?.tipo).filter(Boolean)

          // Si compró SOLO solución/gotas (sin lentes reales), esta secuencia
          // no le sirve — "cómo ponerte los lentes" no aplica.
          const soloAccesorios = tiposComprados.length > 0 && tiposComprados.every(t => t === 'solucion' || t === 'gota')
          if (soloAccesorios) {
            await sb.from('orders').update({ [etapa.campo]: true }).eq('id', o.id)
            resultsEducativo.sin_lentes_omitidos++
            continue
          }

          // Prioridad de mensaje si el carrito mezcla varios tipos: el más
          // "especializado" primero, porque necesita la nota más específica.
          const prioridad: TipoPrincipal[] = ['torico', 'multifocal', 'color', 'esferico']
          const tipoPrincipal = prioridad.find(t => tiposComprados.includes(t)) ?? 'esferico'
          const esDiario = items.some(i => i.products?.reemplazo?.toLowerCase() === 'diario')

          const nombre = o.cliente_nombre?.split(' ')[0] ?? 'Cliente'
          const asunto = typeof etapa.asunto === 'function' ? etapa.asunto(esDiario) : etapa.asunto
          const contenidoHtml = etapa.contenido(nombre, tipoPrincipal, esDiario)

          await resend.emails.send({
            from: 'ContactGo <info@contactgo.net>',
            to: o.cliente_email,
            subject: asunto,
            html: `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
  <div style="background:#0f766e;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0">ContactGo</p>
    <p style="color:#99f6e4;font-size:11px;margin:2px 0 0">Cuidado de tus lentes</p>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
    ${contenidoHtml}
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px">
      ¿Dudas? Escríbenos por WhatsApp: +1 809 694-2268
    </p>
  </div>
</div>`,
          })
          await sb.from('orders').update({ [etapa.campo]: true }).eq('id', o.id)
          if (etapa.dias === 3) resultsEducativo.dia3++
          else if (etapa.dias === 7) resultsEducativo.dia7++
          else resultsEducativo.dia14++
        } catch (e: any) {
          console.error(`[cron/wa-daily] educativo día ${etapa.dias}:`, o.id, e.message)
          results.errores++
        }
      }
    }
  } catch (e) { console.error('[cron/wa-daily] secuencia educativa:', e) }

  return NextResponse.json({ ok: true, ...results, ...resultsCarritos, ...resultsCross, ...resultsRetry, ...resultsEducativo, ejecutado_at: new Date().toISOString() })
}
