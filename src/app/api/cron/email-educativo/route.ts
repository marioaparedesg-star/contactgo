import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { BIENVENIDA, buildEducationalEmail } from '@/lib/email/educational-templates'
import { hasMarketingConsent, marketingUnsubscribeUrl } from '@/lib/email/marketing-consent'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
const getAdmin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authorized = (secret && req.headers.get('authorization') === `Bearer ${secret}`) || req.headers.get('x-vercel-cron') === '1'
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'RESEND_API_KEY no configurado' }, { status: 500 })

  const sb = getAdmin()
  const now = new Date().toISOString()
  const { data: due, error } = await sb.from('email_automation_events')
    .select('id, recipient_email, user_id, step_key, event_key, attempts')
    .eq('automation_key', 'bienvenida_educativa')
    .in('status', ['pending', 'failed'])
    .lte('scheduled_at', now)
    .lt('attempts', 3)
    .order('scheduled_at', { ascending: true })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const results = { sent: 0, skipped: 0, failed: 0, processed: 0 }
  for (const event of due ?? []) {
    results.processed++
    const step = BIENVENIDA.find(item => item.id === event.step_key)
    if (!step) {
      await sb.from('email_automation_events').update({ status: 'skipped', last_error: 'Plantilla inexistente', updated_at: new Date().toISOString() }).eq('id', event.id)
      results.skipped++
      continue
    }
    if (!(await hasMarketingConsent(event.recipient_email))) {
      await sb.from('email_automation_events').update({ status: 'skipped', last_error: 'Sin consentimiento comercial vigente', updated_at: new Date().toISOString() }).eq('id', event.id)
      results.skipped++
      continue
    }

    const claim = await sb.from('email_automation_events')
      .update({ status: 'processing', attempts: event.attempts + 1, updated_at: new Date().toISOString() })
      .eq('id', event.id).in('status', ['pending', 'failed']).select('id').maybeSingle()
    if (claim.error || !claim.data) continue

    const firstName = (event.recipient_email.split('@')[0] || 'Cliente').split(/[._-]/)[0]
    let sent: Awaited<ReturnType<typeof resend.emails.send>>
    try {
      sent = await resend.emails.send({
        from: 'ContactGo <info@contactgo.net>',
        to: event.recipient_email,
        replyTo: 'info@contactgo.net',
        subject: step.subject,
        html: buildEducationalEmail(step, firstName, event.recipient_email),
        text: `${step.titulo}\n\n${step.parrafos.join('\n\n')}\n\nEste contenido es informativo y no sustituye las instrucciones del fabricante ni la orientación de un profesional de la salud visual.\nCancelar suscripción: ${marketingUnsubscribeUrl(event.recipient_email)}`,
      })
    } catch (sendError: any) {
      const message = String(sendError?.message ?? 'Error de envío').slice(0, 1000)
      await sb.from('email_automation_events').update({ status: 'failed', last_error: message, updated_at: new Date().toISOString() }).eq('id', event.id)
      await sb.from('email_log').insert({ to_email: event.recipient_email, subject: step.subject, template: step.id, user_id: event.user_id, status: 'error' })
      results.failed++
      continue
    }
    if (sent.error) {
      await sb.from('email_automation_events').update({ status: 'failed', last_error: sent.error.message, updated_at: new Date().toISOString() }).eq('id', event.id)
      await sb.from('email_log').insert({ to_email: event.recipient_email, subject: step.subject, template: step.id, user_id: event.user_id, status: 'error' })
      results.failed++
      continue
    }
    await sb.from('email_automation_events').update({ status: 'sent', sent_at: new Date().toISOString(), provider_message_id: sent.data?.id ?? null, last_error: null, updated_at: new Date().toISOString() }).eq('id', event.id)
    await sb.from('email_log').insert({ to_email: event.recipient_email, subject: step.subject, template: step.id, user_id: event.user_id, status: 'sent', resend_id: sent.data?.id ?? null })
    results.sent++
  }
  return NextResponse.json({ ok: true, results, executed_at: now })
}
