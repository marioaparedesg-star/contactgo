import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { guardRequest } from '@/lib/api-guard'

export async function POST(req: NextRequest) {
  // ── 1. Rate limit ───────────────────────────────────────────
  const guardErr = guardRequest(req, { limitPerMin: 5 })
  if (guardErr) return guardErr

  // ── 2. Verificar sesión server-side ────────────────────────
  try {
    const sbServer = createServerSupabaseClient()
    const { data: { user }, error: userErr } = await sbServer.auth.getUser()

    if (userErr || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // ── 3. Verificar rol admin ──────────────────────────────
    const { data: profile, error: profileErr } = await sbServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileErr || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado. Se requiere rol admin.' }, { status: 403 })
    }

    // ── 4. Crear usuario con service role ──────────────────
    const { nombre, email, password, telefono, role, departamento } = await req.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'nombre, email y password son requeridos' }, { status: 400 })
    }

    // Solo admins pueden crear otros admins
    const allowedRoles = ['admin', 'staff', 'viewer']
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
    }

    const sbAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: authUser, error: authError } = await sbAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, role: role ?? 'staff' },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    await sbAdmin.from('profiles').upsert({
      id: authUser.user.id,
      nombre,
      email,
      telefono: telefono || null,
      role: role ?? 'staff',
      departamento: departamento || null,
      activo: true,
    })

    return NextResponse.json({ ok: true, user_id: authUser.user.id })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
