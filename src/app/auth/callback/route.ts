// /auth/callback — maneja PKCE codes Y token_hash de recovery emails
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code        = searchParams.get('code')
  const token_hash  = searchParams.get('token_hash')
  const type        = searchParams.get('type')
  const next        = searchParams.get('next') ?? '/cuenta'
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

  // CASO 1: token_hash (nuestros emails bonitos via admin.generateLink)
  if (token_hash && type) {
    const { error } = await sb.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    if (!error) {
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
