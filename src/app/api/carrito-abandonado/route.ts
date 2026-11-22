import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { hasMarketingConsent, marketingUnsubscribeUrl } from '@/lib/email/marketing-consent'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
const FROM = process.env.RESEND_FROM ?? 'ContactGo <info@contactgo.net>'
const FIRST_DELAY_MS = 2 * 60 * 60 * 1000
const SECOND_DELAY_MS = 24 * 60 * 60 * 1000
const LOCK_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function money(value: unknown): string {
  return Number(value ?? 0).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}
function emailHtml(cart: any, step: 1 | 2) {
  const firstName = escapeHtml(cart.cliente_nombre?.trim().split(/\s+/)[0] || 'Hola')
  const rows = (Array.isArray(cart.items) ? cart.items : []).map((item: any) => {
    const quantity = Math.max(1, Number(item.cantidad) || 1)
    const price = Math.max(0, Number(item.precio) || 0)
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #edf1f5;color:#172033;font-size:14px">${escapeHtml(item.nombre || 'Producto')}<br><span style="color:#718096;font-size:12px">Cantidad: ${quantity}</span></td><td style="padding:12px 0;border-bottom:1px solid #edf1f5;text-align:right;font-weight:700;color:#172033">RD$${money(price * quantity)}</td></tr>`
  }).join('')
  const title = step === 1 ? `${firstName}, tu carrito sigue esperándote` : `${firstName}, ¿todavía necesitas tus lentes?`
  const intro = step === 1
    ? 'Guardamos los productos que estabas revisando. Puedes volver a tu carrito y continuar cuando estés listo.'
    : 'Te dejamos un último recordatorio para que puedas retomar tu compra cuando te convenga.'
  const unsubscribe = marketingUnsubscribeUrl(cart.cliente_email)
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;background:#f4f7fb"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden"><tr><td style="background:#002455;padding:24px 28px"><div style="font-size:24px;font-weight:800;color:#fff">ContactGo</div><div style="font-size:12px;color:#c8d7e8;margin-top:4px">Lentes de contacto · República Dominicana</div></td></tr><tr><td style="padding:28px 28px 12px"><h1 style="font-size:21px;line-height:1.35;margin:0 0 10px;color:#002455">${title}</h1><p style="font-size:14px;line-height:1.65;color:#526174;margin:0">${intro}</p></td></tr><tr><td style="padding:8px 28px 0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}<tr><td style="padding:16px 0;font-weight:700;color:#172033">Total estimado</td><td style="padding:16px 0;text-align:right;font-size:17px;font-weight:800;color:#002455">RD$${money(cart.total)}</td></tr></table></td></tr><tr><td align="center" style="padding:18px 28px 28px"><a href="${BASE}/cart" style="display:inline-block;background:#01b2b7;color:#002455;text-decoration:none;font-size:14px;font-weight:800;padding:14px 28px;border-radius:9px">Volver a mi carrito</a></td></tr><tr><td style="background:#f8fafc;padding:18px 28px;text-align:center;font-size:11px;line-height:1.6;color:#718096">ContactGo · contactgo.net · Santo Domingo, República Dominicana<br>Recibes este correo porque aceptaste recibir comunicaciones comerciales.<br><a href="${escapeHtml(unsubscribe)}" style="color:#526174">Cancelar suscripción</a></td></tr></table></td></tr></table></body></html>`
}

async function sendReminder(cart: any, step: 1 | 2) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY no está configurada')
  const firstName = cart.cliente_nombre?.trim().split(/\s+/)[0] || 'Hola'
  const subject = step === 1
    ? `${firstName}, guardamos tu carrito en ContactGo`
    : `${firstName}, este es tu último recordatorio de ContactGo`
  const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: FROM,
    to: cart.cliente_email,
    subject,
    html: emailHtml(cart, step),
  })
  if (error) throw new Error(error.message)
  if (!data?.id) throw new Error('Resend no devolvió un ID de mensaje')
  return data.id
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authorized = (secret && req.headers.get('authorization') === `Bearer ${secret}`)
    || req.headers.get('x-vercel-cron') === '1'
  if (!authorized) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const sb = getSb()
  const now = Date.now()
  const nowIso = new Date(now).toISOString()
  const firstDue = new Date(now - FIRST_DELAY_MS).toISOString()
  const retentionStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: carts, error } = await sb.from('abandoned_carts')
    .select('*')
    .eq('recuperado', false)
    .gte('updated_at', retentionStart)
    .lte('updated_at', firstDue)
    .order('updated_at', { ascending: true })
    .limit(100)

  if (error) {
    console.error('[carrito-abandonado] Error consultando candidatos:', error.message)
    return NextResponse.json({ error: 'No se pudieron consultar los carritos' }, { status: 500 })
  }

  let sentFirst = 0, sentSecond = 0, skippedConsent = 0, converted = 0, failed = 0, locked = 0
  for (const cart of carts ?? []) {
    try {
      // Una compra pagada prevalece sobre cualquier bandera antigua del carrito.
      const { data: paidOrder, error: orderError } = await sb.from('orders')
        .select('id')
        .eq('cliente_email', cart.cliente_email)
        .eq('pago_estado', 'pagado')
        .gte('created_at', cart.updated_at)
        .limit(1)
        .maybeSingle()
      if (orderError) throw new Error(`No se pudo verificar compra: ${orderError.message}`)
      if (paidOrder) {
        await sb.from('abandoned_carts').update({ recuperado: true, email_lock_until: null, email_lock_step: null }).eq('id', cart.id)
        converted++
        continue
      }

      if (!cart.cliente_email || !(await hasMarketingConsent(cart.cliente_email))) {
        skippedConsent++
        continue
      }
      if ((Number(cart.email_attempts) || 0) >= MAX_ATTEMPTS) continue

      const firstSentAt = cart.email_reminder_1_sent_at ? new Date(cart.email_reminder_1_sent_at).getTime() : null
      const secondSentAt = cart.email_reminder_2_sent_at ? new Date(cart.email_reminder_2_sent_at).getTime() : null
      let step: 1 | 2 | null = null
      if (!firstSentAt && new Date(cart.updated_at).getTime() <= now - FIRST_DELAY_MS) step = 1
      else if (firstSentAt && !secondSentAt && firstSentAt <= now - (SECOND_DELAY_MS - FIRST_DELAY_MS)) step = 2
      if (!step) continue

      const lockUntil = new Date(now + LOCK_MS).toISOString()
      const { data: claim, error: lockError } = await sb.from('abandoned_carts')
        .update({ email_lock_until: lockUntil, email_lock_step: String(step) })
        .eq('id', cart.id)
        .eq('recuperado', false)
        .or(`email_lock_until.is.null,email_lock_until.lt.${nowIso}`)
        .select('id')
        .maybeSingle()
      if (lockError) throw new Error(`No se pudo reservar el envío: ${lockError.message}`)
      if (!claim) { locked++; continue }

      try {
        const resendId = await sendReminder(cart, step)
        const sentAt = new Date().toISOString()
        const update = step === 1
          ? { email_reminder_1_sent_at: sentAt, email_sent: true }
          : { email_reminder_2_sent_at: sentAt }
        const { error: saveError } = await sb.from('abandoned_carts').update({
          ...update, email_last_error: null, email_lock_until: null, email_lock_step: null,
        }).eq('id', cart.id)
        if (saveError) throw new Error(`Correo aceptado por Resend (${resendId}) pero no se pudo guardar el estado: ${saveError.message}`)
        if (step === 1) sentFirst++
        else sentSecond++
      } catch (sendError: any) {
        await sb.from('abandoned_carts').update({
          email_attempts: (Number(cart.email_attempts) || 0) + 1,
          email_last_error: String(sendError?.message ?? 'Error de envío').slice(0, 1000),
          email_lock_until: null,
          email_lock_step: null,
        }).eq('id', cart.id)
        throw sendError
      }
    } catch (err: any) {
      failed++
      console.error('[carrito-abandonado] Error carrito', cart.id, err?.message ?? err)
    }
  }

  return NextResponse.json({
    activo: true,
    candidatos: carts?.length ?? 0,
    enviados_primer_recordatorio: sentFirst,
    enviados_segundo_recordatorio: sentSecond,
    convertidos_detectados: converted,
    sin_consentimiento: skippedConsent,
    bloqueados_por_otro_proceso: locked,
    errores: failed,
  })
}
