import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enqueueWelcomeSequence } from '@/lib/email/educational-automation'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: { user }, error: authError } = await authClient.auth.getUser(token)
  if (authError || !user?.email) return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 })
  const meta = user.user_metadata ?? {}
  if (meta.acepta_privacidad !== true) return NextResponse.json({ error: 'Falta aceptar las condiciones y la política de privacidad' }, { status: 400 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const email = user.email.trim().toLowerCase()
  const consent = meta.marketing_consent === true
  const now = new Date().toISOString()
  const values: Record<string, unknown> = {
    user_id: user.id,
    email,
    marketing_consent: consent,
    consented_at: consent ? (typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : now) : null,
    consent_source: consent ? 'registro_web' : null,
    consent_version: consent ? (typeof meta.marketing_consent_version === 'string' ? meta.marketing_consent_version : '2026-11-14-v1') : null,
    terms_accepted_at: typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : now,
    terms_version: typeof meta.terminos_version === 'string' ? meta.terminos_version : '2026-11-14-v1',
    privacy_accepted_at: typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : now,
    privacy_policy_version: typeof meta.privacidad_version === 'string' ? meta.privacidad_version : '2026-11-14-v1',
    updated_at: now,
  }
  if (consent) {
    values.unsubscribed_at = null
    values.suppression_reason = null
  }

  const { data: current, error: lookupError } = await admin.from('email_marketing_preferences').select('id').eq('email', email).maybeSingle()
  if (lookupError) return NextResponse.json({ error: 'No se pudo verificar el consentimiento' }, { status: 500 })
  const result = current?.id
    ? await admin.from('email_marketing_preferences').update(values).eq('id', current.id)
    : await admin.from('email_marketing_preferences').insert({ ...values, created_at: now })
  if (result.error) return NextResponse.json({ error: 'No se pudo guardar el consentimiento' }, { status: 500 })
  let sequence = { enrolled: false, queued: 0 }
  if (consent) {
    try { sequence = await enqueueWelcomeSequence(email, user.id) }
    catch (error) { console.error('[email/consent] no se pudo encolar bienvenida educativa:', error) }
  }
  return NextResponse.json({ ok: true, marketing_consent: consent, sequence })
}
