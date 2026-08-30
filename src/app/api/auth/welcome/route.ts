// POST /api/auth/welcome — Email de bienvenida hermoso tras registro
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email, nombre, telefono, user_id } = await req.json()
  if (!email) return NextResponse.json({ ok: false })
  try {
    // ── Enviar WhatsApp de bienvenida (paralelo, no bloqueante) ──
    if (telefono && user_id) {
      const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
      fetch(`${BASE}/api/wa/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.CRON_SECRET ?? '' },
        body: JSON.stringify({ tipo: 'bienvenida', user_id, nombre, telefono }),
      }).catch(() => {})
    }

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
  <tr><td style="background:linear-gradient(135deg,#002455,#001F4A);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">👁️</div>
    <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 8px;">¡Bienvenido a ContactGo!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">La tienda especializada en lentes de contacto de RD</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:white;padding:36px;">
    <p style="color:#374151;font-size:16px;margin:0 0 20px;font-weight:600;">Hola ${firstName} 👋</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 28px;">
      Tu cuenta está lista. Ahora puedes comprar lentes de contacto directo del fabricante,
      con entrega a domicilio en toda República Dominicana.
    </p>

    <!-- Beneficios -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['🚀','Entrega en 24 horas','Para productos en stock en Santo Domingo'],
        ['🔒','Pago 100% seguro','Con AZUL Banco Popular — sin riesgo'],
        ['✅','Originales certificados','Directo del fabricante de ACUVUE, Alcon y más'],
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

    <!-- Cómo comprar — reduce la fricción de "¿y ahora qué hago?" -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#f8fafc;border-radius:14px;padding:20px;">
      <tr><td style="padding:4px 4px 12px;">
        <p style="color:#002455;font-size:14px;font-weight:800;margin:0;">Comprar en ContactGo es fácil:</p>
      </td></tr>
      ${[
        ['1', 'Envíanos tu receta', 'Por WhatsApp o directo en la web'],
        ['2', 'Elige tus lentes', 'Te ayudamos según tu graduación exacta'],
        ['3', 'Paga seguro', 'Con tarjeta, vía AZUL Banco Popular'],
        ['4', 'Recíbelos en casa', '24-48h en toda República Dominicana'],
      ].map(([num, title, desc]) => `
        <tr><td style="padding:6px 4px;">
          <table><tr>
            <td style="width:26px;height:26px;background:#01B2B7;border-radius:50%;text-align:center;vertical-align:middle;">
              <span style="color:white;font-size:12px;font-weight:800;">${num}</span>
            </td>
            <td style="padding-left:12px;">
              <p style="color:#111827;font-size:13px;font-weight:700;margin:0;">${title}</p>
              <p style="color:#6b7280;font-size:12px;margin:2px 0 0;">${desc}</p>
            </td>
          </tr></table>
        </td></tr>`).join('')}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="https://www.contactgo.net/catalogo"
          style="display:inline-block;background:linear-gradient(135deg,#01B2B7,#018E92);color:white;font-weight:800;font-size:15px;text-decoration:none;padding:16px 48px;border-radius:14px;box-shadow:0 4px 14px rgba(1,178,183,0.35);">
          Ver mis lentes →
        </a>
      </td></tr>
    </table>

    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
      ¿Necesitas ayuda? Escríbenos por
      <a href="https://wa.me/18096942268" style="color:#01B2B7;font-weight:600;">WhatsApp</a>
      o a <a href="mailto:info@contactgo.net" style="color:#01B2B7;">info@contactgo.net</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#1e293b;border-radius:0 0 20px 20px;padding:24px;text-align:center;">
    <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">
      <strong style="color:white;">ContactGo</strong> — contactgo.net
    </p>
    <p style="color:#475569;font-size:11px;margin:0;">(809) 694-2268 · info@contactgo.net · Santo Domingo, RD</p>
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
