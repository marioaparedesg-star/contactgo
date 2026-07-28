// ============================================================
// POST /api/welcome-coupon
// Captura email de visitante → genera cupón 10% off primera compra
// → guarda en welcome_coupons + coupons → envía email de bienvenida.
// Idempotente por email (case-insensitive).
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const DISCOUNT_PCT = 10           // 10% off — cambiar aquí si Mario quiere otro
const CODE_PREFIX = 'BIENVENIDO'
const CODE_LEN = 5                // BIENVENIDO-XXXXX

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function randomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sin caracteres ambiguos
  let out = ''
  for (let i = 0; i < CODE_LEN; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `${CODE_PREFIX}-${out}`
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const source = ['popup', 'exit_intent', 'footer_form'].includes(body.source) ? body.source : 'popup'

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 })
    }

    const db = sb()

    // ¿Ya existe cupón para este email? — idempotente
    const { data: existing } = await db.from('welcome_coupons')
      .select('codigo, usado')
      .ilike('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        ok: true,
        codigo: existing.codigo,
        already_registered: true,
        message: existing.usado
          ? 'Ya usaste tu cupon de bienvenida'
          : 'Ya tienes tu cupon guardado — revisa tu correo',
      })
    }

    // Generar código único (intentar hasta 3 veces por colisión)
    let codigo = ''
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidato = randomCode()
      const { data: colision } = await db.from('coupons').select('id').eq('codigo', candidato).maybeSingle()
      if (!colision) { codigo = candidato; break }
    }
    if (!codigo) return NextResponse.json({ error: 'Reintenta en un momento' }, { status: 500 })

    // Crear cupón activo en la tabla coupons (para que funcione al aplicar en checkout)
    const { error: cupErr } = await db.from('coupons').insert({
      codigo,
      tipo: 'porcentaje',
      valor: DISCOUNT_PCT,
      uso_maximo: 1,
      usos_actuales: 0,
      activo: true,
      // 60 dias de validez desde generacion
      fecha_expira: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    })
    if (cupErr) {
      console.error('[welcome-coupon] error creando coupon:', cupErr)
      return NextResponse.json({ error: 'No se pudo generar el cupon' }, { status: 500 })
    }

    // Registrar en welcome_coupons para trazabilidad y evitar duplicados
    const { error: wcErr } = await db.from('welcome_coupons').insert({ codigo, email, source })
    if (wcErr) console.error('[welcome-coupon] error en welcome_coupons:', wcErr)

    // Enviar email de bienvenida con el cupón — falla silenciosa (el cupón ya está creado)
    if (resend) {
      try {
        await resend.emails.send({
          from: 'ContactGo <hola@contactgo.net>',
          to: email,
          subject: `Tu ${DISCOUNT_PCT}% de descuento — bienvenido a ContactGo`,
          html: emailBienvenidaHTML(codigo),
        })
      } catch (err) {
        console.error('[welcome-coupon] Resend fallo (cupon ya creado):', err)
      }
    }

    return NextResponse.json({
      ok: true,
      codigo,
      descuento_pct: DISCOUNT_PCT,
      message: `Revisa tu correo — te enviamos el codigo ${codigo}`,
    })
  } catch (err: any) {
    console.error('[welcome-coupon]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function emailBienvenidaHTML(codigo: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1a1a1a">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f9fc;padding:40px 20px">
    <tr><td align="center">
      <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
        <tr><td style="padding:32px 32px 8px 32px;text-align:center">
          <p style="margin:0;color:#0B3D66;font-size:14px;font-weight:600;letter-spacing:0.5px">CONTACTGO&reg;</p>
          <h1 style="margin:16px 0 8px 0;font-size:26px;font-weight:800;color:#1a1a1a;line-height:1.2">
            ${DISCOUNT_PCT}% OFF tu primera compra
          </h1>
          <p style="margin:0;font-size:15px;color:#666;line-height:1.5">
            Bienvenido&nbsp;a&nbsp;ContactGo &mdash; el especialista de lentes de contacto en Rep&uacute;blica&nbsp;Dominicana.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
            style="background:linear-gradient(135deg,#0B3D66 0%,#0d4a7c 100%);border-radius:12px;padding:28px 20px;text-align:center">
            <tr><td>
              <p style="margin:0 0 8px 0;color:rgba(255,255,255,0.75);font-size:12px;font-weight:600;letter-spacing:1.5px">TU CODIGO</p>
              <p style="margin:0;color:#ffffff;font-size:32px;font-weight:900;letter-spacing:2px;font-family:'SF Mono',Menlo,Consolas,monospace">
                ${codigo}
              </p>
              <p style="margin:12px 0 0 0;color:rgba(255,255,255,0.75);font-size:11px">V&aacute;lido por 60 d&iacute;as &middot; Un solo uso</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 32px 32px;text-align:center">
          <a href="https://www.contactgo.net/catalogo" style="display:inline-block;background:#0B3D66;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px">
            Empezar a comprar &rarr;
          </a>
          <p style="margin:24px 0 0 0;color:#999;font-size:12px;line-height:1.6">
            Aplica el c&oacute;digo al finalizar tu compra.<br>
            Env&iacute;o a todo el pa&iacute;s desde RD$200.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f7f9fc;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;color:#999;font-size:11px">
            ContactGo&reg; &mdash; ONAPI N&uacute;m. 944205<br>
            WhatsApp: (809)&nbsp;694-2268 &middot; hola@contactgo.net
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
