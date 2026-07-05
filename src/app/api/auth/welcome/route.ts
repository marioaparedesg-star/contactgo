// POST /api/auth/welcome — Email de bienvenida hermoso tras registro
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email, nombre } = await req.json()
  if (!email) return NextResponse.json({ ok: false })
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const firstName = nombre?.split(' ')[0] ?? 'Cliente'
    await resend.emails.send({
      from: 'ContactGo <info@contactgo.net>',
      to: email,
      subject: `¡Bienvenido a ContactGo, ${firstName}! 👁️`,
      html: `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#14532d,#16a34a);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">👁️</div>
    <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 8px;">¡Bienvenido a ContactGo!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">La tienda especializada en lentes de contacto de RD</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:white;padding:36px;">
    <p style="color:#374151;font-size:16px;margin:0 0 20px;font-weight:600;">Hola ${firstName} 👋</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 28px;">
      Tu cuenta está lista. Ahora puedes comprar lentes de contacto 100% originales,
      con entrega a domicilio en toda República Dominicana.
    </p>

    <!-- Beneficios -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['🚀','Entrega en 24 horas','Para productos en stock en Santo Domingo'],
        ['🔒','Pago 100% seguro','Con AZUL Banco Popular — sin riesgo'],
        ['✅','Originales certificados','Productos 100% Originales de ACUVUE, Alcon y más'],
        ['↩️','7 días de devolución','Sin preguntas, sin complicaciones'],
      ].map(([icon, title, desc]) => `
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <table><tr>
            <td style="font-size:24px;width:40px;vertical-align:top;">${icon}</td>
            <td style="padding-left:12px;">
              <p style="color:#111827;font-size:13px;font-weight:700;margin:0;">${title}</p>
              <p style="color:#6b7280;font-size:12px;margin:3px 0 0;">${desc}</p>
            </td>
          </tr></table>
        </td></tr>`).join('')}
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="https://www.contactgo.net/catalogo"
          style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:white;font-weight:800;font-size:15px;text-decoration:none;padding:16px 48px;border-radius:14px;box-shadow:0 4px 14px rgba(22,163,74,0.35);">
          Ver mis lentes →
        </a>
      </td></tr>
    </table>

    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
      ¿Necesitas ayuda? Escríbenos por
      <a href="https://wa.me/18295430580" style="color:#16a34a;font-weight:600;">WhatsApp</a>
      o a <a href="mailto:info@contactgo.net" style="color:#16a34a;">info@contactgo.net</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#1e293b;border-radius:0 0 20px 20px;padding:24px;text-align:center;">
    <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">
      <strong style="color:white;">ContactGo</strong> — contactgo.net
    </p>
    <p style="color:#475569;font-size:11px;margin:0;">(829) 543-0580 · info@contactgo.net · Santo Domingo, RD</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false })
  }
}
