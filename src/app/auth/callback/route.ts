// /auth/callback — maneja el intercambio PKCE de Supabase Auth
// Recibe ?code= y redirige al destino correcto
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/cuenta'

  if (code) {
    const cookieStore = await cookies()
    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get:    (name) => cookieStore.get(name)?.value,
          set:    (name, value, options) => cookieStore.set(name, value, options),
          remove: (name, options) => cookieStore.delete(name),
        },
      }
    )

    const { error } = await sb.auth.exchangeCodeForSession(code)

    if (!error) {
      // Código canjeado correctamente → redirigir al destino
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Error → redirigir a reset-password con error
  return NextResponse.redirect(
    `${origin}/cuenta/reset-password?error=El+enlace+ha+expirado+o+ya+fue+usado.+Solicita+uno+nuevo.`
  )
}
