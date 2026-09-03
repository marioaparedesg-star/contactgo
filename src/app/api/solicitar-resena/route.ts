// GET /api/solicitar-resena — Cron: envía solicitud de reseña (WhatsApp + email)
// a TODOS los pedidos marcados 'entregado' el día calendario ANTERIOR (hora RD),
// una vez al día a una sola hora fija.
//
// Usa entregado_at (timestamp exacto capturado en /api/admin/pedidos al marcar
// el pedido como entregado) en vez de updated_at — cualquier edición posterior
// del pedido (nota admin, cambio de dirección) movía updated_at y desalineaba
// la solicitud. Pedidos entregados ANTES de ayer y aún sin 'resena_solicitada'
// también se incluyen (red de seguridad: si el cron estuvo caído un día, se
// recuperan en la siguiente corrida en vez de perderse para siempre).
//
// WhatsApp usa la plantilla 'solicitar_resena_v2' (APROBADA en Meta, confirmado
// 2026-09-03 directo contra la API). Ambos canales corren siempre — 'resena_solicitada'
// se marca true si AL MENOS UNO tuvo éxito, para no reintentar (y duplicar) el canal
// que sí funcionó solo porque el otro falló.
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { sendReviewRequest } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

const getSb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// República Dominicana es UTC-4 fijo (sin horario de verano).
const RD_OFFSET_MS = 4 * 3600000

function inicioDeHoyRD(): Date {
  const nowRD = new Date(Date.now() - RD_OFFSET_MS)
  const inicioRD = Date.UTC(nowRD.getUTCFullYear(), nowRD.getUTCMonth(), nowRD.getUTCDate())
  return new Date(inicioRD + RD_OFFSET_MS)
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Todo lo entregado ANTES de hoy (00:00 RD) y aún sin reseña solicitada.
  // En la práctica esto es "lo de ayer" en la corrida normal, más cualquier
  // rezagado de días previos si el cron falló.
  const { data: ordenes } = await sb
    .from('orders')
    .select('id, cliente_email, cliente_nombre, numero_orden, cliente_telefono')
    .eq('estado', 'entregado')
    .eq('resena_solicitada', false)
    .not('entregado_at', 'is', null)
    .lt('entregado_at', inicioDeHoyRD().toISOString())
    .limit(100)

  if (!ordenes?.length) return NextResponse.json({ sent: 0, sentWhatsapp: 0 })

  let sent = 0
  let sentWhatsapp = 0
  for (const o of ordenes) {
    const nombre = (o.cliente_nombre ?? 'Cliente').split(' ')[0]
    let whatsappOk = false
    let emailOk = false

    // WhatsApp (plantilla 'solicitar_resena_v2', APROBADA en Meta — verificado
    // 2026-09-03 directo contra la API, ya trae el link de reseña de Google).
    if (o.cliente_telefono) {
      try {
        await sendReviewRequest({ telefono: o.cliente_telefono, nombre: o.cliente_nombre })
        whatsappOk = true
        sentWhatsapp++
      } catch { /* WhatsApp falló, el email de abajo puede cubrir el envío */ }
    }

    if (o.cliente_email) {
      try {
        await resend.emails.send({
          from: `ContactGo <info@contactgo.net>`,
          to: o.cliente_email,
          subject: `¿Cómo fue tu experiencia con ContactGo? 👁`,
          html: `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
  <div style="background:#002455;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0">ContactGo</p>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
    <h2 style="color:#111;font-size:18px">¡Hola, ${nombre}! 👋</h2>
    <p style="color:#374151;font-size:14px">
      Han pasado unos días desde tu pedido <strong>${o.numero_orden}</strong>.
      ¿Ya recibiste tus lentes? ¿Qué tal la experiencia?
    </p>
    <p style="color:#374151;font-size:14px">
      Tu opinión ayuda a otros clientes a elegir los lentes correctos.
      Solo toma 1 minuto dejar una reseña.
    </p>
    <a href="https://g.page/r/Cb-RwE6S9vzgEAE/review"
      style="display:block;background:#facc15;color:#111;font-weight:700;padding:14px 24px;border-radius:10px;text-align:center;text-decoration:none;font-size:15px;margin:20px 0">
      ⭐ Dejar reseña en Google
    </a>
    <p style="color:#374151;font-size:13px;text-align:center;margin-top:-10px">
      Solo toma 1 minuto · Tu opinión nos ayuda muchísimo
    </p>
    <p style="color:#9ca3af;font-size:12px;text-align:center">
      ContactGo · contactgo.net · WhatsApp: +1 809 694-2268
    </p>
  </div>
</div>`
        })
        emailOk = true
        sent++
      } catch { /* email falló, si WhatsApp funcionó igual marcamos resena_solicitada abajo */ }
    }

    // Se marca 'resena_solicitada' si AL MENOS UN canal tuvo éxito — evita
    // reintentar (y duplicar) el canal que sí funcionó solo porque el otro falló.
    if (whatsappOk || emailOk) {
      await sb.from('orders').update({ resena_solicitada: true }).eq('id', o.id)
    }
  }

  return NextResponse.json({ sent, sentWhatsapp, total: ordenes.length })
}
