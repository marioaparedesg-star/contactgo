import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const cookieStore = await cookies()
  // Usar anon key (no service_role) para PKCE flow correcto
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set: (n,v,o) => cookieStore.set(n,v,o), remove: (n,o) => cookieStore.delete(n) } }
  )

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

  // resetPasswordForEmail genera link PKCE (?code=) — compatible con /auth/callback
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${SITE_URL}/auth/callback?next=/cuenta/reset-password`,
  })

  if (error) {
    console.error('Reset password error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Enviar email bonito con Resend usando el link generado por Supabase
  // Nota: Supabase ya envió el email básico, usamos Resend para el diseño
  // Esto requiere deshabilitar el email de Supabase en el dashboard
  // Por ahora enviamos ambos (el de Supabase llega más rápido como fallback)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const nombre = email.split('@')[0]

    // Generar link bonito usando admin para obtener el token
    const sbAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
    )

    const { data: linkData } = await sbAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email.trim(),
      options: { redirectTo: `${SITE_URL}/auth/callback?next=/cuenta/reset-password` }
    })

    const resetLink = linkData?.properties?.action_link ?? `${SITE_URL}/cuenta/reset-password`

    await resend.emails.send({
      from: 'ContactGo <info@contactgo.net>',
      to: email.trim(),
      subject: '🔑 Restablecer tu contraseña — ContactGo',
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

  <tr><td style="background:linear-gradient(135deg,#14532d,#16a34a);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding-bottom:20px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:rgba(255,255,255,0.2);border-radius:12px;padding:8px 14px;">
              <span style="color:white;font-size:18px;font-weight:900;font-family:Arial,sans-serif;">CG</span>
            </td>
            <td style="padding-left:10px;">
              <span style="color:white;font-size:17px;font-weight:700;font-family:Arial,sans-serif;">ContactGo</span>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:72px;height:72px;margin:0 auto 20px;display:table;text-align:center;line-height:72px;">
      <span style="font-size:36px;display:table-cell;vertical-align:middle;">🔐</span>
    </div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">Restablece tu contraseña</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;font-family:Arial,sans-serif;">Recibimos una solicitud para tu cuenta</p>
  </td></tr>

  <tr><td style="background:white;padding:36px;">
    <p style="color:#374151;font-size:15px;margin:0 0 8px;font-family:Arial,sans-serif;">Hola <strong>${nombre}</strong> 👋</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 28px;font-family:Arial,sans-serif;">
      Alguien solicitó restablecer la contraseña de tu cuenta en ContactGo.
      Si fuiste tú, haz clic en el botón de abajo.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="${resetLink}"
          style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:white;font-weight:800;font-size:15px;text-decoration:none;padding:16px 48px;border-radius:14px;font-family:Arial,sans-serif;box-shadow:0 4px 14px rgba(22,163,74,0.35);">
          🔑 Crear nueva contraseña
        </a>
      </td></tr>
    </table>

    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;margin:24px 0;">
      <p style="color:#713f12;font-size:13px;margin:0;font-weight:600;font-family:Arial,sans-serif;">⏱️ Este enlace expira en <strong>1 hora</strong></p>
      <p style="color:#92400e;font-size:12px;margin:6px 0 0;font-family:Arial,sans-serif;">Si no lo usas a tiempo, tendrás que solicitar uno nuevo.</p>
    </div>

    <p style="color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.6;font-family:Arial,sans-serif;">
      Si <strong>no solicitaste</strong> este cambio, ignora este correo. Tu contraseña no cambiará.
    </p>

    <hr style="border:none;border-top:1px solid #f3f4f6;margin:28px 0;">

    <table width="100%" cellpadding="8">
      <tr>
        <td align="center" style="width:33%;">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px;text-align:center;">
            <p style="font-size:22px;margin:0;">🔒</p>
            <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;font-family:Arial,sans-serif;">Pago Seguro<br>AZUL</p>
          </div>
        </td>
        <td align="center" style="width:33%;">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px;text-align:center;">
            <p style="font-size:22px;margin:0;">✅</p>
            <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;font-family:Arial,sans-serif;">Productos<br>Originales</p>
          </div>
        </td>
        <td align="center" style="width:33%;">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px;text-align:center;">
            <p style="font-size:22px;margin:0;">🚚</p>
            <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;font-family:Arial,sans-serif;">Envío a<br>todo RD</p>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#1e293b;border-radius:0 0 20px 20px;padding:24px;text-align:center;">
    <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;font-family:Arial,sans-serif;">
      <strong style="color:white;">ContactGo</strong> — La tienda de lentes de contacto de República Dominicana
    </p>
    <p style="margin:0;font-family:Arial,sans-serif;">
      <a href="https://www.contactgo.net" style="color:#4ade80;text-decoration:none;font-size:12px;font-weight:600;">contactgo.net</a>
      <span style="color:#475569;margin:0 6px;">·</span>
      <a href="mailto:info@contactgo.net" style="color:#4ade80;text-decoration:none;font-size:12px;">info@contactgo.net</a>
      <span style="color:#475569;margin:0 6px;">·</span>
      <span style="color:#64748b;font-size:12px;">(829) 472-8328</span>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
    })
  } catch (emailErr) {
    console.error('Error enviando email Resend:', emailErr)
    // No falla — Supabase ya envió el email básico como fallback
  }

  return NextResponse.json({ ok: true })
}
