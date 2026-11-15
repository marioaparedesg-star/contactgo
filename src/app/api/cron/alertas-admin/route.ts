// Avisos administrativos: falta de pago (2 h) y entrega a 45 días desde el pago.
// Se envían SOLO al correo administrativo, nunca a clientes. Ejecución diaria (ver vercel.json).
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { seleccionarAlertas, type PedidoAlerta, type Alerta } from '@/lib/alertas/alertas-admin'

export const dynamic = 'force-dynamic'

const ADMIN = process.env.ADMIN_EMAIL ?? 'maparedes0113@gmail.com'
const FROM = 'ContactGo Alertas <info@contactgo.net>'

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c])
const fmt = (d: string | null) => d ? new Date(d).toLocaleString('es-DO', { timeZone: 'America/Santo_Domingo', dateStyle: 'medium', timeStyle: 'short' }) : '-'

function asunto(a: Alerta): string {
  const n = a.pedido.numero_orden ?? a.pedido.id.slice(-8)
  return a.tipo === 'alerta_falta_pago'
    ? `ALERTA · Falta de pago · Pedido ${n}`
    : `ALERTA · Entrega a 45 días · Pedido ${n}`
}
function cuerpo(a: Alerta): string {
  const p = a.pedido
  const motivo = a.tipo === 'alerta_falta_pago'
    ? 'El pedido sigue sin pago confirmado 2 horas o más después de su creación.'
    : 'Han pasado 45 días desde la fecha de pago y el pedido todavía no está entregado.'
  return `<div style="font-family:Arial,sans-serif;color:#172033;max-width:560px">
<p style="font-size:12px;color:#64748b;margin:0 0 6px">Aviso interno de ContactGo. No es un correo para clientes.</p>
<h2 style="color:#002455;margin:0 0 10px">${esc(asunto(a))}</h2>
<p>${esc(motivo)}</p>
<table style="border-collapse:collapse;font-size:14px">
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Pedido</td><td>${esc(p.numero_orden)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Cliente</td><td>${esc(p.cliente_nombre)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Total</td><td>RD$${esc(p.total)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Estado</td><td>${esc(p.estado)} · pago ${esc(p.pago_estado)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Creado</td><td>${esc(fmt(p.created_at))}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#64748b">Pagado</td><td>${esc(fmt(p.pagado_en))}</td></tr>
</table></div>`
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const desde = new Date(Date.now() - 60 * 24 * 3600e3).toISOString()
  const { data: pedidos, error } = await sb.from('orders')
    .select('id, numero_orden, cliente_nombre, total, estado, pago_estado, created_at, pagado_en, es_prueba')
    .gte('created_at', desde).eq('es_prueba', false)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: logs } = await sb.from('email_log').select('order_id, template, status')
    .in('template', ['alerta_falta_pago', 'alerta_entrega_45d']).eq('status', 'sent')
  const yaEnviadas = new Set((logs ?? []).map((l: any) => `${l.template}:${l.order_id}`))

  const alertas = seleccionarAlertas((pedidos ?? []) as PedidoAlerta[], new Date(), yaEnviadas)
  if (!alertas.length) return NextResponse.json({ ok: true, enviadas: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let enviadas = 0, fallidas = 0
  for (const a of alertas) {
    const { data, error: sendErr } = await resend.emails.send({
      from: FROM, to: ADMIN, subject: asunto(a), html: cuerpo(a),
    })
    const ok = !sendErr
    if (ok) enviadas++; else fallidas++
    await sb.from('email_log').insert({
      to_email: ADMIN, subject: asunto(a), template: a.tipo, order_id: a.pedido.id,
      status: ok ? 'sent' : 'error', resend_id: data?.id ?? null,
    })
    if (sendErr) console.error('[alertas-admin] fallo de envío:', sendErr.message)
  }
  return NextResponse.json({ ok: true, enviadas, fallidas })
}
