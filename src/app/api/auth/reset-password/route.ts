import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )

  // Generar el link de reset desde Supabase Admin
  const { data, error } = await sb.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim(),
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'}/auth/callback?next=/cuenta/reset-password`,
    }
  })

  if (error || !data?.properties?.action_link) {
    // Fallback: usar el método estándar de Supabase
    await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'}/auth/callback?next=/cuenta/reset-password`,
    })
    return NextResponse.json({ ok: true })
  }

  const resetLink = data.properties.action_link

  // Enviar email bonito con Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const nombre = email.split('@')[0]

    await resend.emails.send({
      from: 'ContactGo <info@contactgo.net>',
      to: email.trim(),
      subject: 'Restablecer tu contraseña — ContactGo',
      html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Restablecer contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
<tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">

    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#14532d 0%,#16a34a 100%);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:8px 14px;">
          <span style="color:white;font-size:20px;font-weight:900;letter-spacing:1px;">CG</span>
        </div>
        <span style="color:white;font-size:18px;font-weight:700;">ContactGo</span>
      </div>
      <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:72px;height:72px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:36px;">🔐</span>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;line-height:1.2;">Restablece tu contraseña</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Recibimos una solicitud para tu cuenta</p>
    </td></tr>

    <!-- Body -->
    <tr><td style="background:white;padding:40px;">
      <p style="color:#374151;font-size:15px;margin:0 0 8px;">Hola <strong>${nombre}</strong> 👋</p>
      <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.6;">
        Alguien solicitó restablecer la contraseña de tu cuenta en ContactGo.
        Si fuiste tú, haz clic en el botón de abajo.
      </p>

      <!-- CTA Button -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
        <tr><td align="center">
          <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:white;font-weight:800;font-size:15px;text-decoration:none;padding:16px 40px;border-radius:14px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(22,163,74,0.35);">
            🔑 Crear nueva contraseña
          </a>
        </td></tr>
      </table>

      <!-- Timer warning -->
      <div style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;margin:24px 0;">
        <p style="color:#713f12;font-size:13px;margin:0;font-weight:600;">⏱️ Este enlace expira en <strong>1 hora</strong></p>
        <p style="color:#92400e;font-size:12px;margin:6px 0 0;">Si no lo usas a tiempo, tendrás que solicitar uno nuevo.</p>
      </div>

      <p style="color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.6;">
        Si <strong>no solicitaste</strong> este cambio, ignora este correo.
        Tu contraseña no cambiará a menos que hagas clic en el enlace.
      </p>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:28px 0;">

      <!-- Trust signals -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:0 8px;">
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;">
              <p style="color:#16a34a;font-size:18px;margin:0;">🔒</p>
              <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;">Pago Seguro<br>AZUL</p>
            </div>
          </td>
          <td align="center" style="padding:0 8px;">
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;">
              <p style="color:#16a34a;font-size:18px;margin:0;">✅</p>
              <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;">Productos<br>Originales</p>
            </div>
          </td>
          <td align="center" style="padding:0 8px;">
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;">
              <p style="color:#16a34a;font-size:18px;margin:0;">🚚</p>
              <p style="color:#374151;font-size:11px;font-weight:600;margin:4px 0 0;">Envío a<br>todo RD</p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background:#1e293b;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;">
      <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;">
        <strong style="color:white;">ContactGo</strong> — La tienda especializada en lentes de contacto de República Dominicana
      </p>
      <p style="margin:0;">
        <a href="https://www.contactgo.net" style="color:#4ade80;text-decoration:none;font-size:12px;font-weight:600;">contactgo.net</a>
        <span style="color:#475569;margin:0 8px;">·</span>
        <a href="mailto:info@contactgo.net" style="color:#4ade80;text-decoration:none;font-size:12px;">info@contactgo.net</a>
        <span style="color:#475569;margin:0 8px;">·</span>
        <span style="color:#64748b;font-size:12px;">(829) 472-8328</span>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error enviando email:', err)
    // Fallback silencioso — el link ya fue generado
    return NextResponse.json({ ok: true })
  }
}
