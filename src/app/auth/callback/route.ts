// /auth/callback — maneja intercambio PKCE de Supabase Auth
// Recibe ?code= de resetPasswordForEmail() y otros flows PKCE
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/cuenta'
  const errorParam = searchParams.get('error')

  // Si viene un error explícito de Supabase, redirigir con mensaje
  if (errorParam) {
    const desc = searchParams.get('error_description') ?? 'Error de autenticación'
    return NextResponse.redirect(
      `${origin}/cuenta/reset-password?error=${encodeURIComponent(desc)}`
    )
  }

  if (code) {
    const cookieStore = await cookies()
    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get:    (name) => cookieStore.get(name)?.value,
          set:    (name, value, options) => { try { cookieStore.set(name, value, options) } catch {} },
          remove: (name, options) => { try { cookieStore.delete(name) } catch {} },
        },
      }
    )

    const { error } = await sb.auth.exchangeCodeForSession(code)

    if (!error) {
      // ✅ Código canjeado → redirigir al destino
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(
      `${origin}/cuenta/reset-password?error=${encodeURIComponent('El enlace ha expirado o ya fue usado. Solicita uno nuevo.')}`
    )
  }

  // Sin código → redirigir a cuenta (puede tener hash con access_token)
  // El cliente manejará el hash en JavaScript
  return NextResponse.redirect(`${origin}${next}`)
}
