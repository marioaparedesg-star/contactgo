import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse, type RegistrationResponseJSON } from '@simplewebauthn/server'
import { consumePasskeyChallenge, getAuthenticatedPasskeyUser, getPasskeyAdmin, getPasskeyConfig, passkeyRateLimit } from '@/lib/passkeys/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 8)
  if (blocked) return blocked
  const config = getPasskeyConfig(req)
  if ('error' in config) return config.error
  const user = await getAuthenticatedPasskeyUser()
  if (!user) return NextResponse.json({ error: 'Sesión no válida. Inicia sesión nuevamente.' }, { status: 401 })
  try {
    const body = await req.json()
    if (typeof body?.challengeId !== 'string' || !body?.response || typeof body.response !== 'object') {
      return NextResponse.json({ error: 'Respuesta biométrica incompleta.' }, { status: 400 })
    }
    const expectedChallenge = await consumePasskeyChallenge(body.challengeId, 'registration', user.id)
    if (!expectedChallenge) return NextResponse.json({ error: 'El desafío expiró o ya fue utilizado. Inténtalo de nuevo.' }, { status: 400 })
    const verification = await verifyRegistrationResponse({
      response: body.response as RegistrationResponseJSON,
      expectedChallenge, expectedOrigin: config.origins, expectedRPID: config.rpID,
      requireUserVerification: true,
    })
    if (!verification.verified || !verification.registrationInfo?.userVerified) {
      return NextResponse.json({ error: 'El dispositivo no pudo verificar la identidad biométrica.' }, { status: 400 })
    }
    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo
    const { error } = await getPasskeyAdmin().from('user_passkeys').insert({
      user_id: user.id, credential_id: credential.id,
      public_key: Buffer.from(credential.publicKey).toString('base64url'),
      counter: credential.counter, transports: credential.transports || [],
      device_type: credentialDeviceType, backed_up: credentialBackedUp,
    })
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Esta passkey ya está registrada.' }, { status: 409 })
      throw error
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[passkey/register-verify]', error)
    return NextResponse.json({ error: 'No se pudo verificar ni guardar la passkey.' }, { status: 500 })
  }
}
