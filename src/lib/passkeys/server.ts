import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { guardRequest } from '@/lib/api-guard'

export type PasskeyPurpose = 'registration' | 'authentication'

export function getPasskeyAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Supabase server credentials are not configured')
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
}

export function getPasskeyConfig(req: NextRequest) {
  const origin = req.headers.get('origin')
  const defaults = process.env.NODE_ENV === 'production'
    ? ['https://www.contactgo.net', 'https://contactgo.net']
    : ['https://www.contactgo.net', 'https://contactgo.net', 'http://localhost:3000']
  const origins = (process.env.WEBAUTHN_ORIGINS || defaults.join(','))
    .split(',').map((value) => value.trim()).filter(Boolean)
  if (!origin || !origins.includes(origin)) {
    return { error: NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 }) } as const
  }
  let hostname = ''
  try { hostname = new URL(origin).hostname } catch {
    return { error: NextResponse.json({ error: 'Origen inválido.' }, { status: 403 }) } as const
  }
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  const rpID = process.env.WEBAUTHN_RP_ID || (isLocal ? hostname : 'contactgo.net')
  if (!isLocal && hostname !== rpID && !hostname.endsWith('.' + rpID)) {
    return { error: NextResponse.json({ error: 'El dominio no coincide con el RP ID.' }, { status: 403 }) } as const
  }
  return { rpID, origins } as const
}

export async function getAuthenticatedPasskeyUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function savePasskeyChallenge(challenge: string, purpose: PasskeyPurpose, userId: string | null) {
  const admin = getPasskeyAdmin()
  await admin.from('passkey_challenges').delete().lt('expires_at', new Date().toISOString())
  const { data, error } = await admin.from('passkey_challenges')
    .insert({ challenge, purpose, user_id: userId, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() })
    .select('id').single()
  if (error || !data) throw new Error('No se pudo guardar el desafío de autenticación')
  return data.id as string
}

export async function consumePasskeyChallenge(id: string, purpose: PasskeyPurpose, userId: string | null) {
  const admin = getPasskeyAdmin()
  let query = admin.from('passkey_challenges').delete()
    .eq('id', id).eq('purpose', purpose).gt('expires_at', new Date().toISOString())
  query = userId ? query.eq('user_id', userId) : query.is('user_id', null)
  const { data, error } = await query.select('challenge').maybeSingle()
  if (error || !data?.challenge) return null
  return data.challenge as string
}

export function passkeyRateLimit(req: NextRequest, limitPerMin = 10, requireOrigin = true) {
  return guardRequest(req, { limitPerMin, requireOrigin })
}
