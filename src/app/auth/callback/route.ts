// /auth/callback — maneja PKCE codes Y token_hash de recovery emails
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { enqueueWelcomeSequence } from '@/lib/email/educational-automation'

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

  
  // Crear el perfil solo si aún no existe (no altera perfiles de clientes actuales).
  const syncNewCustomerProfile = async () => {
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { data: existing } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
    const meta = user.user_metadata ?? {}
    if (!existing) {
      await sb.from('profiles').insert({
        id: user.id,
        email: user.email,
        nombre: typeof meta.nombre === 'string' ? meta.nombre : null,
        telefono: typeof meta.telefono === 'string' ? meta.telefono : (typeof meta.phone === 'string' ? meta.phone : null),
        fecha_nacimiento: typeof meta.fecha_nacimiento === 'string' ? meta.fecha_nacimiento : null,
        role: 'customer',
      })
    }

    // Persistir el consentimiento comercial capturado en el formulario de registro.
    // El opt-in solo se activa cuando el usuario marcó expresamente la casilla.
    if (user.email && meta.acepta_privacidad === true) {
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const email = user.email.trim().toLowerCase()
      const consent = meta.marketing_consent === true
      const preference = {
        user_id: user.id,
        email,
        marketing_consent: consent,
        consented_at: consent ? (typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : new Date().toISOString()) : null,
        consent_source: consent ? 'registro_web' : null,
        consent_version: consent && typeof meta.marketing_consent_version === 'string' ? meta.marketing_consent_version : null,
        terms_accepted_at: typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : new Date().toISOString(),
        terms_version: typeof meta.terminos_version === 'string' ? meta.terminos_version : '2026-11-14-v1',
        privacy_accepted_at: typeof meta.privacidad_aceptada_at === 'string' ? meta.privacidad_aceptada_at : new Date().toISOString(),
        privacy_policy_version: typeof meta.privacidad_version === 'string' ? meta.privacidad_version : '2026-11-14-v1',
        unsubscribed_at: consent ? null : undefined,
        suppression_reason: consent ? null : undefined,
        updated_at: new Date().toISOString(),
      }
      const { data: current } = await admin.from('email_marketing_preferences').select('id').eq('email', email).maybeSingle()
      if (current?.id) await admin.from('email_marketing_preferences').update(preference).eq('id', current.id)
      else await admin.from('email_marketing_preferences').insert({ ...preference, created_at: new Date().toISOString() })
      if (consent) {
        try { await enqueueWelcomeSequence(email, user.id) }
        catch (error) { console.error('[auth/callback] no se pudo encolar bienvenida educativa:', error) }
      }
    }
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
