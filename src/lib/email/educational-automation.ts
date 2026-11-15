import { createClient } from '@supabase/supabase-js'
import { BIENVENIDA } from '@/lib/email/educational-templates'
import { hasMarketingConsent } from '@/lib/email/marketing-consent'

const getAdmin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Encola la secuencia solo con consentimiento comercial explícito.
// Los event_key únicos hacen idempotente la inscripción si callback/consent se ejecutan más de una vez.
export async function enqueueWelcomeSequence(email: string, userId?: string | null) {
  const normalized = email.trim().toLowerCase()
  if (!normalized || !(await hasMarketingConsent(normalized))) return { enrolled: false, queued: 0 }
  const sb = getAdmin()
  const { data: preference, error: preferenceError } = await sb.from('email_marketing_preferences')
    .select('consented_at').eq('email', normalized).maybeSingle()
  if (preferenceError || !preference?.consented_at) return { enrolled: false, queued: 0 }
  const consentKey = new Date(preference.consented_at).getTime()
  const now = Date.now()
  const rows = BIENVENIDA.map((step, index) => ({
    recipient_email: normalized,
    user_id: userId ?? null,
    automation_key: 'bienvenida_educativa',
    step_key: step.id,
    event_key: `bienvenida_educativa:${normalized}:${consentKey}:${step.id}`,
    status: 'pending',
    scheduled_at: new Date(now + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'registro', sequence_position: index + 1 },
  }))
  const { error } = await sb.from('email_automation_events').upsert(rows, { onConflict: 'event_key', ignoreDuplicates: true })
  if (error) throw new Error(`No se pudo encolar la secuencia educativa: ${error.message}`)
  return { enrolled: true, queued: rows.length }
}
