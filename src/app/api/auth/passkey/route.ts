import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedPasskeyUser, getPasskeyAdmin, getPasskeyConfig, passkeyRateLimit } from '@/lib/passkeys/server'
export const runtime = 'nodejs'
export async function GET(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 20, false); if (blocked) return blocked
  const user = await getAuthenticatedPasskeyUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { data, error } = await getPasskeyAdmin().from('user_passkeys').select('id, created_at, last_used_at, device_type, backed_up').eq('user_id', user.id).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'No se pudo consultar el acceso biométrico.' }, { status: 500 })
  return NextResponse.json({ passkeys: data || [] })
}
export async function DELETE(req: NextRequest) {
  const blocked = passkeyRateLimit(req, 5); if (blocked) return blocked
  const config = getPasskeyConfig(req); if ('error' in config) return config.error
  const user = await getAuthenticatedPasskeyUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { error } = await getPasskeyAdmin().from('user_passkeys').delete().eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'No se pudo eliminar el acceso biométrico.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
