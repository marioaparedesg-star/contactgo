// POST /api/auth/reset-password
// Genera link de recovery y envía email premium desde info@contactgo.net
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

  const SITE = 'https://www.contactgo.net'

  // Generar link de recovery con admin API
  const { data, error } = await sb.auth.admin.generateLink({
    type: 'recovery',
    email: email.trim(),
    options: {
      redirectTo: `${SITE}/auth/callback?next=/cuenta/reset-password`,
    }
  })

  if (error || !data?.properties?.hashed_token) {
    // Fallback: resetPasswordForEmail estándar (Supabase envía su propio email)
    await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${SITE}/auth/callback?next=/cuenta/reset-password`,
    })
    return NextResponse.json({ ok: true, via: 'fallback' })
  }

  // Construir nuestro propio link usando token_hash + type
  // El callback lo maneja con verifyOtp()
  const tokenHash = data.properties.hashed_token
  const resetLink = `${SITE}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=recovery&next=/cuenta/reset-password`

  const nombre = (email as string).split('@')[0]

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'ContactGo <info@contactgo.net>',
      to: email.trim(),
      subject: 'Restablecer contraseña — ContactGo',
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#14532d 0%,#16a34a 100%);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <!-- Logo -->
    <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:rgba(255,255,255,0.2);border-radius:14px;padding:10px 18px;vertical-align:middle;">
          <span style="color:white;font-size:22px;font-weight:900;letter-spacing:1px;font-family:Arial Black,sans-serif;">CG</span>
        </td>
        <td style="padding-left:12px;vertical-align:middle;">
          <span style="color:white;font-size:20px;font-weight:800;font-family:Arial,sans-serif;">ContactGo</span>
        </td>
      </tr>
    </table>
    <!-- Ícono -->
    <div style="background:rgba(255,255,255,0.2);border-radius:50%;width:72px;height:72px;margin:0 auto 20px;display:table-cell;vertical-align:middle;text-align:center;">
      <span style="font-size:36px;line-height:72px;">🔐</span>
    </div>
    <h1 style="color:white;font-size:24px;font-weight:900;margin:16px 0 8px;">Restablece tu contraseña</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Recibimos una solicitud para tu cuenta</p>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:white;padding:40px;">
    <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hola <strong>${nombre}</strong> 👋</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 28px;">
      Alguien solicitó restablecer la contraseña de tu cuenta en ContactGo.
      Si fuiste tú, haz clic en el botón de abajo. Si no lo solicitaste, ignora este correo.
    </p>

    <!-- BOTÓN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td align="center">
        <a href="${resetLink}"
          style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:white;font-weight:800;font-size:16px;text-decoration:none;padding:18px 48px;border-radius:14px;letter-spacing:0.3px;">
          🔑 Crear nueva contraseña
        </a>
      </td></tr>
    </table>

    <!-- ALERTA EXPIRACIÓN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:16px;">
        <p style="color:#713f12;font-size:13px;margin:0;font-weight:700;">⏱️ Este enlace expira en 1 hora</p>
        <p style="color:#92400e;font-size:12px;margin:6px 0 0;">Si no lo usas a tiempo, solicita uno nuevo en contactgo.net</p>
      </td></tr>
    </table>

    <p style="color:#9ca3af;font-size:12px;margin:0 0 20px;line-height:1.6;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${resetLink}" style="color:#16a34a;word-break:break-all;font-size:11px;">${resetLink}</a>
    </p>

    <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">

    <!-- TRUST SIGNALS -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" width="33%">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px 8px;">
            <p style="font-size:20px;margin:0;">🔒</p>
            <p style="color:#374151;font-size:11px;font-weight:700;margin:4px 0 0;text-align:center;">Pago Seguro<br>AZUL</p>
          </div>
        </td>
        <td width="8px"></td>
        <td align="center" width="33%">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px 8px;">
            <p style="font-size:20px;margin:0;">✅</p>
            <p style="color:#374151;font-size:11px;font-weight:700;margin:4px 0 0;text-align:center;">Productos<br>Originales</p>
          </div>
        </td>
        <td width="8px"></td>
        <td align="center" width="33%">
          <div style="background:#f0fdf4;border-radius:10px;padding:12px 8px;">
            <p style="font-size:20px;margin:0;">🚚</p>
            <p style="color:#374151;font-size:11px;font-weight:700;margin:4px 0 0;text-align:center;">Envío a<br>todo RD</p>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#1e293b;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;">
    <p style="color:#94a3b8;font-size:13px;margin:0 0 10px;">
      <strong style="color:white;">ContactGo</strong> — La tienda de lentes de contacto de RD
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
    return NextResponse.json({ ok: true, via: 'resend' })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ ok: true, via: 'fallback_silent' })
  }
}
