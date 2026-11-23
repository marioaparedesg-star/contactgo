import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse, type AuthenticationResponseJSON } from '@simplewebauthn/server'
import { consumePasskeyChallenge, getPasskeyAdmin, getPasskeyConfig, passkeyRateLimit } from '@/lib/passkeys/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 10); if (blocked) return blocked
  const config = getPasskeyConfig(req); if ('error' in config) return config.error
  try {
    const body = await req.json()
    if (typeof body?.challengeId !== 'string' || !body?.response || typeof body.response.id !== 'string') return NextResponse.json({ error: 'Respuesta biométrica incompleta.' }, { status: 400 })
    const expectedChallenge = await consumePasskeyChallenge(body.challengeId, 'authentication', null)
    if (!expectedChallenge) return NextResponse.json({ error: 'El desafío expiró o ya fue utilizado. Inténtalo de nuevo.' }, { status: 400 })
    const admin = getPasskeyAdmin()
    const { data: stored, error: lookupError } = await admin.from('user_passkeys').select('id, user_id, credential_id, public_key, counter, transports').eq('credential_id', body.response.id).maybeSingle()
    if (lookupError || !stored) return NextResponse.json({ error: 'No encontramos una passkey asociada. Inicia sesión con tu contraseña y regístrala.' }, { status: 401 })
    const expectedUserHandle = Buffer.from(stored.user_id, 'utf8').toString('base64url')
    if (body.response.response?.userHandle !== expectedUserHandle) return NextResponse.json({ error: 'La passkey no corresponde a la cuenta registrada.' }, { status: 401 })
    const verification = await verifyAuthenticationResponse({
      response: body.response as AuthenticationResponseJSON, expectedChallenge, expectedOrigin: config.origins, expectedRPID: config.rpID,
      credential: { id: stored.credential_id, publicKey: Buffer.from(stored.public_key, 'base64url'), counter: Number(stored.counter), transports: stored.transports || [] },
      requireUserVerification: true,
    })
    if (!verification.verified || !verification.authenticationInfo.userVerified) return NextResponse.json({ error: 'No se pudo verificar la identidad biométrica.' }, { status: 401 })
    const { error: updateError } = await admin.from('user_passkeys').update({ counter: verification.authenticationInfo.newCounter, last_used_at: new Date().toISOString() }).eq('id', stored.id)
    if (updateError) throw updateError
    const { data: userResult, error: userError } = await admin.auth.admin.getUserById(stored.user_id)
    const email = userResult?.user?.email
    if (userError || !email || !userResult?.user?.email_confirmed_at) return NextResponse.json({ error: 'La cuenta necesita un correo confirmado para completar el acceso.' }, { status: 403 })
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email })
    const tokenHash = linkData?.properties?.hashed_token
    if (linkError || !tokenHash) throw new Error('Supabase no pudo emitir el token de sesión')
    return NextResponse.json({ token_hash: tokenHash, type: 'magiclink' }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) { console.error('[passkey/authentication-verify]', error); return NextResponse.json({ error: 'No se pudo completar el inicio de sesión biométrico.' }, { status: 500 }) }
}
