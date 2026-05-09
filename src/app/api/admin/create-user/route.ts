import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono, role, departamento } = await req.json()
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data: authUser, error: authError } = await sb.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { nombre, role },
    })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
    await sb.from('profiles').upsert({
      id: authUser.user.id, nombre, email,
      telefono: telefono || null, role, departamento, activo: true,
    })
    return NextResponse.json({ ok: true, user_id: authUser.user.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
