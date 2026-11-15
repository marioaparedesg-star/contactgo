import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { guardRequest } from '@/lib/api-guard'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Configuración segura de Supabase incompleta')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

async function getActiveAdmin(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return { error: guardErr }
  const sb = await createServerSupabaseClient()
  const { data: { user }, error } = await sb.auth.getUser()
  if (error || !user) return { error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) }
  const { data: profile, error: profileError } = await sb.from('profiles')
    .select('role, activo').eq('id', user.id).single()
  const primaryAdminId = process.env.CONTACTGO_PRIMARY_ADMIN_ID ?? '0ae25176-4cb9-45da-bd19-5b1b5806c4ef'
  if (profileError || profile?.role !== 'admin' || profile?.activo !== true || user.id !== primaryAdminId) {
    return { error: NextResponse.json({ error: 'Acceso denegado o cuenta desactivada' }, { status: 403 }) }
  }
  return { user }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getActiveAdmin(req)
    if ('error' in auth) return auth.error
    const body = await req.json()
    const nombre = String(body.nombre ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    const telefono = String(body.telefono ?? '').trim()
    const departamento = String(body.departamento ?? '').trim()
    if (!nombre || !email || !password) return NextResponse.json({ error: 'Nombre, email y contraseña son requeridos' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })

    const sbAdmin = getAdminClient()
    const { data: created, error: createError } = await sbAdmin.auth.admin.createUser({
      email, password, email_confirm: true, user_metadata: { nombre },
    })
    if (createError || !created.user) return NextResponse.json({ error: createError?.message ?? 'No se pudo crear el usuario' }, { status: 400 })

    const { error: profileError } = await sbAdmin.from('profiles').upsert({
      id: created.user.id, nombre, email, telefono: telefono || null,
      role: 'admin', departamento: departamento || null, activo: true,
    })
    if (profileError) {
      await sbAdmin.auth.admin.deleteUser(created.user.id)
      return NextResponse.json({ error: 'No se pudo crear el perfil; se revirtió el usuario de autenticación. ' + profileError.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, user_id: created.user.id })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getActiveAdmin(req)
    if ('error' in auth) return auth.error
    const body = await req.json()
    const userId = String(body.user_id ?? '')
    const activo = body.activo
    if (!userId || typeof activo !== 'boolean') return NextResponse.json({ error: 'user_id y activo son requeridos' }, { status: 400 })
    if (userId === auth.user.id) return NextResponse.json({ error: 'No puedes desactivar tu propia cuenta' }, { status: 400 })

    const sbAdmin = getAdminClient()
    const { data: target, error: targetError } = await sbAdmin.from('profiles')
      .select('id, role, activo').eq('id', userId).maybeSingle()
    if (targetError || !target || target.role !== 'admin') return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 })

    if (!activo && target.activo === true) {
      const { count, error: countError } = await sbAdmin.from('profiles')
        .select('id', { count: 'exact', head: true }).eq('role', 'admin').eq('activo', true)
      if (countError) return NextResponse.json({ error: 'No se pudo validar el último administrador activo' }, { status: 500 })
      if ((count ?? 0) <= 1) return NextResponse.json({ error: 'Debe permanecer al menos un administrador activo' }, { status: 409 })
    }
    const { error: updateError } = await sbAdmin.from('profiles').update({ activo }).eq('id', userId)
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    return NextResponse.json({ ok: true, user_id: userId, activo })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error interno' }, { status: 500 })
  }
}
