/**
 * Verifica que el request viene de un admin autenticado (server-side).
 * Usa para proteger API routes administrativas.
 * 
 * @returns { user, profile } si es admin válido
 * @throws NextResponse 401/403 si no está autorizado
 */
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from './supabase-server'

export type AdminGuardResult =
  | { ok: true; user: { id: string; email?: string }; profile: { role: string } }
  | { ok: false; response: NextResponse }

export async function requireAdmin(): Promise<AdminGuardResult> {
  try {
    const sbServer = await createServerSupabaseClient()
    const { data: { user }, error: userErr } = await sbServer.auth.getUser()

    if (userErr || !user) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
      }
    }

    const { data: profile, error: profileErr } = await sbServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // An admin role alone is not sufficient for the private ContactGo panel.
    // All server-side endpoints using requireAdmin must belong to the
    // explicitly designated primary account as well.
    const primaryAdminId = process.env.CONTACTGO_PRIMARY_ADMIN_ID ?? '0ae25176-4cb9-45da-bd19-5b1b5806c4ef'
    if (profileErr || !profile || profile.role !== 'admin' || user.id !== primaryAdminId) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }),
      }
    }

    return { ok: true, user: { id: user.id, email: user.email }, profile }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Error de autenticación' }, { status: 401 }),
    }
  }
}
