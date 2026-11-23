import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { getPasskeyConfig, passkeyRateLimit, savePasskeyChallenge } from '@/lib/passkeys/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 10)
  if (blocked) return blocked
  const config = getPasskeyConfig(req)
  if ('error' in config) return config.error
  try {
    const options = await generateAuthenticationOptions({ rpID: config.rpID, userVerification: 'required', timeout: 60000 })
    const challengeId = await savePasskeyChallenge(options.challenge, 'authentication', null)
    return NextResponse.json({ options, challengeId })
  } catch (error) {
    console.error('[passkey/authentication-options]', error)
    return NextResponse.json({ error: 'No se pudo iniciar el acceso biométrico.' }, { status: 500 })
  }
}
