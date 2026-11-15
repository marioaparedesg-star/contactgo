import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMarketingUnsubscribeToken } from '@/lib/email/marketing-consent'

export const dynamic = 'force-dynamic'

function confirmationPage(token: string) {
  return new NextResponse(
    '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preferencias de correo</title><body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px 16px;color:#002455"><main style="max-width:520px;margin:auto;background:white;padding:32px;border-radius:16px"><h1>Preferencias de correo</h1><p>¿Deseas dejar de recibir comunicaciones comerciales de ContactGo? Los avisos necesarios sobre tus pedidos seguirán llegando.</p><form method="post"><input type="hidden" name="token" value="' + token.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"><button type="submit" style="background:#002455;color:white;border:0;border-radius:8px;padding:12px 18px;font-weight:bold">Confirmar baja</button></form></main></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!verifyMarketingUnsubscribeToken(token)) return new NextResponse('Enlace de baja no válido o vencido.', { status: 400 })
  // Los escáneres de seguridad de correo suelen abrir enlaces GET automáticamente.
  // La baja solo se registra cuando la persona confirma mediante POST.
  return confirmationPage(token)
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const token = String(form.get('token') ?? '')
  const email = verifyMarketingUnsubscribeToken(token)
  if (!email) return new NextResponse('Enlace de baja no válido o vencido.', { status: 400 })

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const now = new Date().toISOString()
  const values = {
    email,
    marketing_consent: false,
    unsubscribed_at: now,
    suppression_reason: 'user_unsubscribe',
    updated_at: now,
  }
  const { data: current, error: lookupError } = await sb.from('email_marketing_preferences')
    .select('id').ilike('email', email).maybeSingle()
  if (lookupError) {
    console.error('[email/unsubscribe] No se pudo consultar la preferencia:', lookupError.message)
    return new NextResponse('No pudimos procesar tu solicitud. Inténtalo nuevamente.', { status: 500 })
  }
  const { error } = current?.id
    ? await sb.from('email_marketing_preferences').update(values).eq('id', current.id)
    : await sb.from('email_marketing_preferences').insert(values)

  if (error) {
    console.error('[email/unsubscribe] No se pudo registrar la baja:', error.message)
    return new NextResponse('No pudimos procesar tu solicitud. Inténtalo nuevamente.', { status: 500 })
  }

  return new NextResponse(
    '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preferencias actualizadas</title><body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px 16px;color:#002455"><main style="max-width:520px;margin:auto;background:white;padding:32px;border-radius:16px"><h1>Preferencias actualizadas</h1><p>Tu correo fue dado de baja de las comunicaciones comerciales de ContactGo. Seguirás recibiendo únicamente mensajes necesarios sobre tus pedidos.</p></main></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}
