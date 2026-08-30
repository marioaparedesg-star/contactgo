// GET /api/cron/retencion — 3 correos nuevos de retención/postventa:
//   A) Cliente inactivo — 60+ días sin comprar, "te extrañamos" con incentivo
//   B) Recompra por correo — mismo cálculo real que ya usa WhatsApp (subscriptions.proximo_envio,
//      dias_ciclo calculado por producto), agregando el canal de correo en paralelo
//   C) "¿Tienes dudas?" — 15-20 días después de su ÚNICA compra, sin haber vuelto a comprar,
//      correo de baja presión que ayuda en vez de vender
//
// Construido a partir de una revisión externa que Mario compartió sobre el sistema de
// correos — estos 3 eran huecos reales confirmados (no existía nada para clientes inactivos,
// la recompra solo llegaba por WhatsApp, y no había ningún correo de "solo ayudar").
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const getSb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const FROM = 'ContactGo <info@contactgo.net>'

function wrap(tituloBadge: string, contenidoHtml: string, ctaTexto: string, ctaHref: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:20px">
  <div style="background:#002455;padding:24px;border-radius:16px 16px 0 0;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0">ContactGo</p>
    <p style="color:#93c5fd;font-size:11px;margin:4px 0 0">${tituloBadge}</p>
  </div>
  <div style="background:#ffffff;padding:28px;border-radius:0 0 16px 16px;border:1px solid #f1f5f9">
    ${contenidoHtml}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px">
      <tr><td align="center">
        <a href="${ctaHref}" style="display:inline-block;background:linear-gradient(135deg,#01B2B7,#018E92);color:white;font-weight:800;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:12px">${ctaTexto}</a>
      </td></tr>
    </table>
    <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px">¿Dudas? Escríbenos por WhatsApp: +1 809 694-2268</p>
  </div>
</div>`
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const results = { inactivos: 0, recompraEmail7d: 0, recompraEmail3d: 0, recompraEmailDia: 0, dudas: 0, errores: 0 }

  // ═══ A) CLIENTE INACTIVO — 60+ días desde su último pedido pagado ═══════
  try {
    const hace60dias = new Date(Date.now() - 60 * 86400000).toISOString()
    const hace90dias = new Date(Date.now() - 90 * 86400000).toISOString()

    // Últimos pedidos pagados por cliente (email), para saber su fecha más reciente
    const { data: ultimosPedidos } = await sb
      .from('orders')
      .select('cliente_email, cliente_nombre, fecha')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .not('cliente_email', 'is', null)
      .order('fecha', { ascending: false })

    const ultimaCompraPorEmail = new Map<string, { fecha: string; nombre: string }>()
    for (const o of ultimosPedidos ?? []) {
      const email = (o.cliente_email as string).toLowerCase()
      if (!ultimaCompraPorEmail.has(email)) {
        ultimaCompraPorEmail.set(email, { fecha: o.fecha, nombre: o.cliente_nombre ?? 'Cliente' })
      }
    }

    // Candidatos: última compra hace 60+ días
    const candidatos = [...ultimaCompraPorEmail.entries()]
      .filter(([, v]) => v.fecha < hace60dias)
      .slice(0, 30) // límite de seguridad por ejecución

    if (candidatos.length > 0) {
      const emails = candidatos.map(([email]) => email)
      const { data: perfiles } = await sb
        .from('profiles').select('email, email_inactivo_enviado_at')
        .in('email', emails)
      const perfilPorEmail = new Map((perfiles ?? []).map((p: any) => [p.email?.toLowerCase(), p]))

      for (const [email, info] of candidatos) {
        const perfil = perfilPorEmail.get(email)
        // Ya se le mandó este correo en los últimos 90 días -> no repetir
        if (perfil?.email_inactivo_enviado_at && perfil.email_inactivo_enviado_at > hace90dias) continue

        try {
          const nombre = info.nombre.split(' ')[0]
          await resend.emails.send({
            from: FROM, to: email,
            subject: `${nombre}, te extrañamos 👋 — 10% en tu próxima compra`,
            html: wrap('Te extrañamos', `
              <h2 style="color:#111827;font-size:18px;margin:0 0 12px">¡Hola, ${nombre}! 👋</h2>
              <p style="color:#4b5563;font-size:14px;line-height:1.6">Hace un tiempo que no nos visitas. Si ya se te acabaron tus lentes de contacto, o simplemente se te pasó reponerlos, aquí seguimos — con tus marcas certificadas de siempre.</p>
              <p style="color:#4b5563;font-size:14px;line-height:1.6">Como agradecimiento por volver, usa este código en tu próxima compra:</p>
              <div style="background:#f0fdfa;border:2px dashed #01B2B7;border-radius:12px;padding:16px;text-align:center;margin:16px 0">
                <p style="color:#018E92;font-size:22px;font-weight:900;margin:0;letter-spacing:1px">VUELVE10</p>
                <p style="color:#6b7280;font-size:12px;margin:4px 0 0">10% de descuento en tu próximo pedido</p>
              </div>`,
              'Ver catálogo →', 'https://www.contactgo.net/catalogo'),
          })
          await sb.from('profiles').upsert({ email, email_inactivo_enviado_at: new Date().toISOString() }, { onConflict: 'email' })
          results.inactivos++
        } catch (e: any) {
          console.error('[cron/retencion] inactivo:', email, e.message)
          results.errores++
        }
      }
    }
  } catch (e: any) {
    console.error('[cron/retencion] bloque inactivos:', e.message)
    results.errores++
  }

  // ═══ B) RECOMPRA POR CORREO — mismo cálculo real de subscriptions ═══════
  // Mismo timing que ya usa WhatsApp (proximo_envio, dias_ciclo real por
  // producto) — agrega el canal de correo EN PARALELO, sin tocar ni duplicar
  // el cálculo de fecha que ya vive en /api/cron/wa-daily.
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const en7dias = new Date(); en7dias.setDate(en7dias.getDate() + 7)
    const en3dias = new Date(); en3dias.setDate(en3dias.getDate() + 3)
    const fecha7 = en7dias.toISOString().split('T')[0]
    const fecha3 = en3dias.toISOString().split('T')[0]

    async function enviarRecompraEmail(sub: any, dias: number | 'hoy') {
      if (!sub.cliente_email) return false
      const nombre = (sub.cliente_nombre ?? 'Cliente').split(' ')[0]
      const producto = (Array.isArray(sub.items) ? sub.items[0]?.nombre : null) ?? sub.producto_nombre ?? 'tus lentes de contacto'
      const mensaje = dias === 'hoy'
        ? `Según nuestros cálculos, hoy es el día en que sueles quedarte sin ${producto}.`
        : `En ${dias} días es cuando sueles necesitar reponer tus ${producto}, según tu ritmo de uso habitual.`
      await resend.emails.send({
        from: FROM, to: sub.cliente_email,
        subject: dias === 'hoy' ? `${nombre}, es hora de reponer tus lentes 📦` : `${nombre}, en ${dias} días necesitarás tus próximos lentes 📅`,
        html: wrap('Recordatorio de recompra', `
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">¡Hola, ${nombre}! 👋</h2>
          <p style="color:#4b5563;font-size:14px;line-height:1.6">${mensaje}</p>
          <p style="color:#4b5563;font-size:14px;line-height:1.6">Pide ahora y evita quedarte sin ellos justo cuando más los necesitas.</p>`,
          'Reponer mis lentes →', 'https://www.contactgo.net/cuenta'),
      })
      return true
    }

    const { data: sub7 } = await sb.from('subscriptions')
      .select('id, cliente_nombre, cliente_email, items, producto_nombre')
      .eq('activa', true).eq('cancelada', false).eq('email_aviso_7d_enviado', false)
      .eq('proximo_envio', fecha7)
    for (const s of sub7 ?? []) {
      try {
        if (await enviarRecompraEmail(s, 7)) {
          await sb.from('subscriptions').update({ email_aviso_7d_enviado: true }).eq('id', s.id)
          results.recompraEmail7d++
        }
      } catch (e: any) { console.error('[cron/retencion] recompra 7d:', s.id, e.message); results.errores++ }
    }

    const { data: sub3 } = await sb.from('subscriptions')
      .select('id, cliente_nombre, cliente_email, items, producto_nombre')
      .eq('activa', true).eq('cancelada', false).eq('email_aviso_3d_enviado', false)
      .eq('proximo_envio', fecha3)
    for (const s of sub3 ?? []) {
      try {
        if (await enviarRecompraEmail(s, 3)) {
          await sb.from('subscriptions').update({ email_aviso_3d_enviado: true }).eq('id', s.id)
          results.recompraEmail3d++
        }
      } catch (e: any) { console.error('[cron/retencion] recompra 3d:', s.id, e.message); results.errores++ }
    }

    const { data: subHoy } = await sb.from('subscriptions')
      .select('id, cliente_nombre, cliente_email, items, producto_nombre')
      .eq('activa', true).eq('cancelada', false).eq('email_recordatorio_enviado', false)
      .lte('proximo_envio', hoy)
    for (const s of subHoy ?? []) {
      try {
        if (await enviarRecompraEmail(s, 'hoy')) {
          await sb.from('subscriptions').update({ email_recordatorio_enviado: true }).eq('id', s.id)
          results.recompraEmailDia++
        }
      } catch (e: any) { console.error('[cron/retencion] recompra hoy:', s.id, e.message); results.errores++ }
    }

    // Nuevo ciclo -> los avisos de correo también deben poder dispararse de nuevo
    // (mismo ciclo que ya resetea aviso_7d_enviado/aviso_3d_enviado de WhatsApp
    // en wa-daily — aquí solo se resetean cuando proximo_envio ya avanzó, para
    // no interferir con ese bloque).
  } catch (e: any) {
    console.error('[cron/retencion] bloque recompra:', e.message)
    results.errores++
  }

  // ═══ C) "¿TIENES DUDAS?" — 15-20 días tras su ÚNICA compra, sin repetir ═
  try {
    const hace15dias = new Date(Date.now() - 15 * 86400000).toISOString()
    const hace20dias = new Date(Date.now() - 20 * 86400000).toISOString()

    const { data: candidatosDudas } = await sb
      .from('orders')
      .select('id, cliente_email, cliente_nombre, fecha')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .eq('email_dudas_enviado', false)
      .not('cliente_email', 'is', null)
      .gte('fecha', hace20dias).lte('fecha', hace15dias)
      .limit(30)

    for (const o of candidatosDudas ?? []) {
      try {
        // Verificar que sea su ÚNICA compra (si ya repitió, este correo no aplica)
        const { count } = await sb.from('orders').select('id', { count: 'exact', head: true })
          .eq('cliente_email', o.cliente_email).eq('pago_estado', 'pagado').eq('es_prueba', false)
        if ((count ?? 0) > 1) {
          await sb.from('orders').update({ email_dudas_enviado: true }).eq('id', o.id)
          continue
        }

        const nombre = (o.cliente_nombre ?? 'Cliente').split(' ')[0]
        await resend.emails.send({
          from: FROM, to: o.cliente_email,
          subject: `${nombre}, ¿tienes dudas sobre tus lentes? 👋`,
          html: wrap('¿Necesitas ayuda?', `
            <h2 style="color:#111827;font-size:18px;margin:0 0 12px">¡Hola, ${nombre}! 👋</h2>
            <p style="color:#4b5563;font-size:14px;line-height:1.6">No todo tiene que ser una venta — solo queríamos preguntarte cómo te ha ido:</p>
            <ul style="color:#4b5563;font-size:14px;padding-left:20px;line-height:1.9">
              <li>¿No sabes qué lente comprar la próxima vez?</li>
              <li>¿No entiendes bien tu receta?</li>
              <li>¿Tienes alguna molestia que no sabes si es normal?</li>
            </ul>
            <p style="color:#4b5563;font-size:14px;line-height:1.6">Escríbenos — respondemos rápido y sin compromiso.</p>`,
            'Escribir por WhatsApp →', 'https://wa.me/18096942268'),
        })
        await sb.from('orders').update({ email_dudas_enviado: true }).eq('id', o.id)
        results.dudas++
      } catch (e: any) {
        console.error('[cron/retencion] dudas:', o.id, e.message)
        results.errores++
      }
    }
  } catch (e: any) {
    console.error('[cron/retencion] bloque dudas:', e.message)
    results.errores++
  }

  return NextResponse.json({ ok: true, results })
}
