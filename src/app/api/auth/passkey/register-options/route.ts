import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { getAuthenticatedPasskeyUser, getPasskeyAdmin, getPasskeyConfig, passkeyRateLimit, savePasskeyChallenge } from '@/lib/passkeys/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 8); if (blocked) return blocked
  const config = getPasskeyConfig(req); if ('error' in config) return config.error
  const user = await getAuthenticatedPasskeyUser()
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para registrar Face ID o huella.' }, { status: 401 })
  if (!user.email || !user.email_confirmed_at) return NextResponse.json({ error: 'La cuenta debe tener un correo confirmado.' }, { status: 400 })
  try {
    const admin = getPasskeyAdmin()
    const { data: existing, error } = await admin.from('user_passkeys').select('credential_id, transports').eq('user_id', user.id)
    if (error) throw error
    const options = await generateRegistrationOptions({
      rpName: 'ContactGo', rpID: config.rpID, userID: new TextEncoder().encode(user.id),
      userName: user.email, userDisplayName: user.user_metadata?.nombre || user.email, attestationType: 'none',
      authenticatorSelection: { authenticatorAttachment: 'platform', residentKey: 'required', userVerification: 'required' },
      excludeCredentials: (existing || []).map(item => ({ id: item.credential_id, transports: item.transports || [] })), timeout: 60000,
    })
    const challengeId = await savePasskeyChallenge(options.challenge, 'registration', user.id)
    return NextResponse.json({ options, challengeId })
  } catch (error) { console.error('[passkey/register-options]', error); return NextResponse.json({ error: 'No se pudo iniciar el registro biométrico.' }, { status: 500 }) }
}
