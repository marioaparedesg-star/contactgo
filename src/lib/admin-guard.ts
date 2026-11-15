/**
 * Verifica que el request viene de un administrador autenticado y activo.
 * Todas las API administrativas deben usar esta protección.
 */
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from './supabase-server'

export type AdminGuardResult =
  | { ok: true; user: { id: string; email?: string }; profile: { role: string; activo: boolean } }
  | { ok: false; response: NextResponse }

export async function requireAdmin(): Promise<AdminGuardResult> {
  try {
    const sbServer = await createServerSupabaseClient()
    const { data: { user }, error: userErr } = await sbServer.auth.getUser()
    if (userErr || !user) return { ok: false, response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) }
    const { data: profile, error: profileErr } = await sbServer.from('profiles')
      .select('role, activo').eq('id', user.id).single()
    if (profileErr || !profile || profile.role !== 'admin' || profile.activo !== true) {
      return { ok: false, response: NextResponse.json({ error: 'Acceso denegado o cuenta desactivada' }, { status: 403 }) }
    }
    return { ok: true, user: { id: user.id, email: user.email }, profile }
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Error de autenticación' }, { status: 401 }) }
  }
}
