// ============================================================
// SISTEMA ÚNICO DE CARRITO ABANDONADO — consolidado 2026-08-08
//
// Antes había 2 sistemas paralelos que nunca funcionaron:
//   1. Este mismo archivo, por email — completo pero JAMÁS conectado a
//      ningún cron ni llamado desde ningún lado.
//   2. supabase/functions/recover-carts (Edge Function) — por WhatsApp,
//      pero con un bug real: nunca llamaba a la API de WhatsApp, solo
//      armaba un link wa.me y lo marcaba como "enviado" sin enviar nada.
//      Tampoco estaba conectada a ningún cron.
//
// Además, la escritura desde checkout.tsx (upsert con onConflict:
// 'cliente_email') fallaba en silencio desde el día 1 porque esa columna
// nunca tuvo una restricción única en la base de datos — por eso
// abandoned_carts tenía 0 filas siempre. Ya corregido (constraint
// agregada 2026-08-08).
//
// Este archivo reemplaza a ambos: WhatsApp real primero (plantilla
// aprobada 'carrito_abandonado'), con email como respaldo si no hay
// teléfono. recover-carts (Edge Function) queda huérfana y debe borrarse
// de Supabase manualmente — no se puede eliminar desde este repo.
//
// INTERRUPTOR DE SEGURIDAD: apagado por defecto (Mario pidió explícitamente
// "no envíe nada a nadie"). Se activa con
// CARRITO_ABANDONADO_ACTIVO=true en Vercel — sin necesidad de otro deploy.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { notificarCarritoAbandonado } from '@/lib/wa-notifications'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
const FROM = process.env.RESEND_FROM ?? 'ContactGo <info@contactgo.net>'
function getResend() { return new Resend(process.env.RESEND_API_KEY) }

const ACTIVO = process.env.CARRITO_ABANDONADO_ACTIVO === 'true'

async function enviarEmailRespaldo(cart: any) {
  const nombre = cart.cliente_nombre?.split(' ')[0] ?? 'Cliente'
  const productos = Array.isArray(cart.items) ? cart.items : []
  const total = cart.total ?? 0
  const cupon = 'VUELVE5'

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
    <h2 style="margin:0;font-size:20px;color:#111;">👋 ${nombre}, dejaste tus lentes en el carrito</h2>
    <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">Tus lentes siguen disponibles. Completa tu pedido hoy y recibe un <strong style="color:#16a34a;">5% de descuento</strong> extra.</p>
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
      <p style="margin:0;font-size:12px;color:#6b7280;">Cupón de descuento:</p>
      <p style="margin:6px 0;font-size:24px;font-weight:900;color:#16a34a;letter-spacing:3px;">${cupon}</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">5% de descuento · Válido 24 horas</p>
    </div>
  </td></tr>
  <tr><td style="padding:20px 28px;text-align:center;">
    <a href="${BASE}/cart" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;">
      Completar mi pedido →
    </a>
  </td></tr>
  <tr><td style="background:#f9fafb;padding:12px 28px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">ContactGo · contactgo.net · Santo Domingo, RD</p>
    <p style="margin:4px 0 0;font-size:10px;color:#d1d5db;">Directo del fabricante · Entrega en 24-48h · Pago Seguro</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

  await getResend().emails.send({
    from: FROM, to: cart.cliente_email,
    subject: `${nombre}, olvidaste tus lentes en el carrito 👀 — 5% OFF esperándote`,
    html,
  })

  const { data: existing } = await getSb().from('coupons').select('id').eq('codigo', cupon).single()
  if (!existing) {
    await getSb().from('coupons').insert({
      codigo: cupon, tipo: 'porcentaje', valor: 5,
      uso_maximo: 9999, usos_actuales: 0, activo: true,
      valido_hasta: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
}

export async function GET(req: NextRequest) {
  // Patrón de autenticación consistente con los demás crons (solicitar-resena,
  // wa-daily): acepta la llamada real de Vercel Cron (header x-vercel-cron) o
  // una llamada manual con el secret, para poder probarlo por curl.
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const hace2h = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const hace6h = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

  const { data: carritos, error } = await getSb()
    .from('abandoned_carts')
    .select('*')
    .gte('updated_at', hace6h)
    .lte('updated_at', hace2h)
    .eq('recuperado', false)
    .or('whatsapp_enviado.eq.false,email_sent.eq.false')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!carritos?.length) return NextResponse.json({ activo: ACTIVO, candidatos: 0, enviados: 0 })

  // Modo simulación: reporta a quién le tocaría, sin enviar nada de verdad.
  if (!ACTIVO) {
    return NextResponse.json({
      activo: false,
      mensaje: 'Interruptor apagado (CARRITO_ABANDONADO_ACTIVO no está en true) — no se envió nada.',
      candidatos: carritos.map(c => ({
        id: c.id, nombre: c.cliente_nombre, email: c.cliente_email,
        telefono: c.cliente_telefono, total: c.total,
        canal_que_usaria: c.cliente_telefono ? 'whatsapp' : 'email',
      })),
    })
  }

  let enviadosWA = 0, enviadosEmail = 0, errores = 0
  for (const cart of carritos) {
    try {
      const productos = (Array.isArray(cart.items) ? cart.items : [])
        .slice(0, 2).map((p: any) => p.nombre ?? p.product?.nombre).filter(Boolean).join(', ')

      if (cart.cliente_telefono) {
        const res = await notificarCarritoAbandonado({
          telefono: cart.cliente_telefono, nombre: cart.cliente_nombre, productos,
        })
        if (res.ok) { await getSb().from('abandoned_carts').update({ whatsapp_enviado: true }).eq('id', cart.id); enviadosWA++ }
      } else if (cart.cliente_email) {
        await enviarEmailRespaldo(cart)
        await getSb().from('abandoned_carts').update({ email_sent: true }).eq('id', cart.id)
        enviadosEmail++
      }
    } catch (e) {
      console.error(`[carrito-abandonado] Error con carrito ${cart.id}:`, e)
      errores++
    }
  }

  return NextResponse.json({ activo: true, enviadosWA, enviadosEmail, errores, total: carritos.length })
}
