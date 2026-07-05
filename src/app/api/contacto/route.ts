import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY ?? 're_placeholder') }
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'info@contactgo.net'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, mensaje, tipo } = await req.json()

    if (!nombre || !mensaje) {
      return NextResponse.json({ error: 'Nombre y mensaje son requeridos' }, { status: 400 })
    }

    const resend = getResend()
    await resend.emails.send({
      from: 'ContactGo <notifications@contactgo.net>',
      to: [ADMIN_EMAIL],
      subject: `📩 Nuevo mensaje de contacto — ${nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0ea5e9;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0">Nuevo mensaje de ContactGo</h2>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Nombre</td><td style="padding:8px 0;font-weight:600">${nombre}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Email</td><td style="padding:8px 0">${email ?? '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Teléfono</td><td style="padding:8px 0">${telefono ?? '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Tipo</td><td style="padding:8px 0">${tipo ?? 'Consulta general'}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:white;border-radius:8px;border:1px solid #e5e7eb">
              <p style="margin:0;font-size:14px;line-height:1.6">${mensaje}</p>
            </div>
          </div>
        </div>
      `
    })

    // Confirmación al cliente si dejó email
    if (email) {
      const resend = getResend()
    await resend.emails.send({
        from: 'ContactGo <notifications@contactgo.net>',
        to: [email],
        subject: '✅ Recibimos tu mensaje — ContactGo',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0ea5e9;padding:24px;border-radius:12px 12px 0 0">
              <h2 style="color:white;margin:0">¡Hola ${nombre.split(' ')[0]}!</h2>
            </div>
            <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
              <p>Recibimos tu mensaje y te responderemos lo antes posible.</p>
              <p style="color:#6b7280;font-size:13px">Mientras tanto puedes explorar nuestro catálogo de lentes de contacto con entrega 24-48h en toda República Dominicana.</p>
              <a href="https://www.contactgo.net/catalogo" style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">Ver catálogo →</a>
            </div>
          </div>
        `
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[api/contacto]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
