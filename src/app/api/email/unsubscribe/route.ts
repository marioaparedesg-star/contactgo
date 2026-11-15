import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMarketingUnsubscribeToken } from '@/lib/email/marketing-consent'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const email = verifyMarketingUnsubscribeToken(token)
  if (!email) return new NextResponse('Enlace de baja no válido o vencido.', { status: 400 })

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await sb.from('email_marketing_preferences').upsert({
    email,
    marketing_consent: false,
    unsubscribed_at: new Date().toISOString(),
    suppression_reason: 'user_unsubscribe',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'email' })

  if (error) {
    console.error('[email/unsubscribe] No se pudo registrar la baja:', error.message)
    return new NextResponse('No pudimos procesar tu solicitud. Inténtalo nuevamente.', { status: 500 })
  }

  return new NextResponse(
    '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preferencias actualizadas</title><body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px 16px;color:#002455"><main style="max-width:520px;margin:auto;background:white;padding:32px;border-radius:16px"><h1>Preferencias actualizadas</h1><p>Tu correo fue dado de baja de las comunicaciones comerciales de ContactGo. Seguirás recibiendo únicamente mensajes necesarios sobre tus pedidos.</p></main></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}
