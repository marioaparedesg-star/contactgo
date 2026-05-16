// POST /api/carrito-abandonado
// Cron job que detecta carritos abandonados (2h sin completar) y envía email con cupón
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const sb  = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
const FROM = process.env.RESEND_FROM ?? 'ContactGo <onboarding@resend.dev>'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Verificar secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET ?? 'contactgo2026'}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Obtener carritos abandonados hace 2-4 horas sin recuperar
  const hace2h  = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const hace4h  = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()

  const { data: carritos, error } = await sb
    .from('abandoned_carts')
    .select('*')
    .gte('updated_at', hace4h)
    .lte('updated_at', hace2h)
    .eq('recovered', false)
    .not('cliente_email', 'is', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!carritos?.length) return NextResponse.json({ sent: 0, message: 'No hay carritos abandonados' })

  let sent = 0
  for (const cart of carritos) {
    try {
      const nombre   = cart.cliente_nombre?.split(' ')[0] ?? 'Cliente'
      const productos = Array.isArray(cart.items) ? cart.items : []
      const total    = cart.total ?? 0
      const cupon    = 'VUELVE5'

      const itemsHTML = productos.map((p: any) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
            <strong style="color:#111;font-size:13px;">${p.nombre ?? p.product?.nombre ?? 'Producto'}</strong>
            <br><span style="color:#9ca3af;font-size:11px;">x${p.cantidad ?? 1}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#111;">
            RD$${((p.precio ?? 0) * (p.cantidad ?? 1)).toLocaleString()}
          </td>
        </tr>`).join('')

      const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 16px;">
<tr><td><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:#16a34a;padding:20px 28px;">
    <p style="margin:0;color:#fff;font-size:22px;font-weight:900;">ContactGo</p>
    <p style="margin:2px 0 0;color:#bbf7d0;font-size:12px;">Lentes de Contacto · República Dominicana</p>
  </td></tr>
  <tr><td style="padding:24px 28px 0;">
    <h2 style="margin:0;font-size:20px;color:#111;">¡${nombre}, olvidaste algo! 👀</h2>
    <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">Tienes productos en tu carrito esperándote. Completa tu pedido ahora y recibe un <strong style="color:#16a34a;">5% de descuento</strong>.</p>
  </td></tr>
  ${itemsHTML ? `
  <tr><td style="padding:16px 28px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${itemsHTML}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;color:#111;">Total</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:900;color:#16a34a;font-size:16px;">RD$${Number(total).toLocaleString()}</td>
      </tr>
    </table>
  </td></tr>` : ''}
  <tr><td style="padding:16px 28px 0;">
    <div style="background:#f0fdf4;border:2px dashed #16a34a;border-radius:10px;padding:14px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#6b7280;">Tu cupón de descuento:</p>
      <p style="margin:6px 0;font-size:24px;font-weight:900;color:#16a34a;letter-spacing:3px;">${cupon}</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">5% de descuento · Válido 24 horas</p>
    </div>
  </td></tr>
  <tr><td style="padding:20px 28px;text-align:center;">
    <a href="${BASE}/cart" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 32px;border-radius:10px;">
      Completar mi pedido →
    </a>
    <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
      ¿Preguntas? <a href="https://wa.me/18294728328" style="color:#16a34a;">WhatsApp (829) 472-8328</a>
    </p>
  </td></tr>
  <tr><td style="background:#f9fafb;padding:12px 28px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">ContactGo · contactgo.net · Santo Domingo, RD</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

      await resend.emails.send({
        from: FROM,
        to: cart.cliente_email,
        subject: `${nombre}, olvidaste tus lentes en el carrito 👀 — 5% OFF esperándote`,
        html,
      })

      // Crear cupón si no existe
      const { data: existing } = await sb.from('coupons').select('id').eq('codigo', cupon).single()
      if (!existing) {
        await sb.from('coupons').insert({
          codigo: cupon, tipo: 'porcentaje', valor: 5,
          uso_maximo: 9999, usos_actuales: 0,
          activo: true,
          valido_hasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      // Marcar como email enviado (no recovered todavía)
      await sb.from('abandoned_carts').update({ email_sent: true }).eq('id', cart.id)

      sent++
      console.log(`[carrito-abandonado] Email sent to ${cart.cliente_email}`)
    } catch (e) {
      console.error(`[carrito-abandonado] Error sending to ${cart.cliente_email}:`, e)
    }
  }

  return NextResponse.json({ sent, total: carritos.length })
}
