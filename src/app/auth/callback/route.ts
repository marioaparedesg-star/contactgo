// /auth/callback — maneja PKCE codes Y token_hash de recovery emails
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code        = searchParams.get('code')
  const token_hash  = searchParams.get('token_hash')
  const type        = searchParams.get('type')
  const requestedNext = searchParams.get('next') ?? '/cuenta'
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/cuenta'
  const errorParam  = searchParams.get('error')

  if (errorParam) {
    const desc = searchParams.get('error_description') ?? 'Error de autenticación'
    return NextResponse.redirect(
      `${origin}/cuenta/reset-password?error=${encodeURIComponent(desc)}`
    )
  }

  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get:    (n) => cookieStore.get(n)?.value,
        set:    (n, v, o) => { try { cookieStore.set(n, v, o) } catch {} },
        remove: (n, o)    => { try { cookieStore.delete(n) }    catch {} },
      },
    }
  )

  
  // Crear el perfil solo si aún no existe (no altera perfiles de clientes actuales).
  const syncNewCustomerProfile = async () => {
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data: existing } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
    if (existing) return
    const meta = user.user_metadata ?? {}
    await sb.from('profiles').insert({
      id: user.id,
      email: user.email,
      nombre: typeof meta.nombre === 'string' ? meta.nombre : null,
      telefono: typeof meta.telefono === 'string' ? meta.telefono : (typeof meta.phone === 'string' ? meta.phone : null),
      fecha_nacimiento: typeof meta.fecha_nacimiento === 'string' ? meta.fecha_nacimiento : null,
      role: 'customer',
    })
  }

  // CASO 1: token_hash (nuestros emails bonitos via admin.generateLink)
  if (token_hash && type) {
    const { error } = await sb.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    if (!error) {
      await syncNewCustomerProfile()
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('verifyOtp error:', error.message)
    return NextResponse.redirect(
      `${origin}/cuenta/reset-password?error=${encodeURIComponent('El enlace ha expirado o ya fue usado. Solicita uno nuevo.')}`
    )
  }

  // CASO 2: code (PKCE flow estándar de resetPasswordForEmail cliente)
  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code)
    if (!error) {
      await syncNewCustomerProfile()
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(
      `${origin}/cuenta/reset-password?error=${encodeURIComponent('El enlace ha expirado. Solicita uno nuevo.')}`
    )
  }

  // Sin código ni token → redirigir
  return NextResponse.redirect(`${origin}${next}`)
}
