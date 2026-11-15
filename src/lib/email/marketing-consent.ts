import { createHmac, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const secret = () => process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export function createMarketingUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase()
  const payload = Buffer.from(normalized).toString('base64url')
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyMarketingUnsubscribeToken(token: string): string | null {
  const [payload, signature] = token.split('.')
  if (!payload || !signature || !secret()) return null
  const expected = createHmac('sha256', secret()).update(payload).digest()
  let received: Buffer
  try { received = Buffer.from(signature, 'base64url') } catch { return null }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null
  try {
    const email = Buffer.from(payload, 'base64url').toString('utf8').trim().toLowerCase()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
  } catch { return null }
}

export function marketingUnsubscribeUrl(email: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
  return `${base}/api/email/unsubscribe?token=${encodeURIComponent(createMarketingUnsubscribeToken(email))}`
}

export async function hasMarketingConsent(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return false
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data, error } = await sb.from('email_marketing_preferences')
      .select('marketing_consent,unsubscribed_at,suppression_reason')
      .eq('email', normalized).maybeSingle()
    return !error && data?.marketing_consent === true && !data.unsubscribed_at && !data.suppression_reason
  } catch {
    return false
  }
}
