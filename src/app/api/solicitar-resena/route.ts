// GET /api/solicitar-resena — Cron: envía solicitud de reseña por WhatsApp + email
// 3 días después de que el pedido se marca como ENTREGADO (no de la fecha de compra —
// un tórico puede tardar 45 días en llegar, pedir reseña por fecha de compra le llegaría
// antes de recibir el producto).
// WhatsApp usa la plantilla 'solicitar_resena_v2' (APROBADA en Meta, confirmado
// 2026-09-03). Ambos canales corren siempre — si uno falla, el otro sigue cubriendo,
// y 'resena_solicitada' solo se marca true si el email se envió con éxito.
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { sendReviewRequest } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

const getSb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Pedidos ENTREGADOS hace 3+ días, sin reseña solicitada aún.
  // (updated_at como aproximación de cuándo pasó a 'entregado' — no hay timestamp dedicado.)
  //
  // FIX: antes tenía tope superior de 10 días — si el cron no corría el día exacto en que
  // un pedido caía en la ventana de 3-10 días (por ejemplo si el cron estuvo caído, o el
  // pedido se marcó "entregado" con retraso), esa solicitud se perdía PARA SIEMPRE, sin
  // ninguna forma de recuperarla. Ahora el límite superior es 45 días — cualquier pedido
  // atrasado se recupera en la próxima ejecución en vez de perderse.
  const { data: ordenes } = await sb
    .from('orders')
    .select('id, cliente_email, cliente_nombre, numero_orden, cliente_telefono')
    .eq('estado', 'entregado')
    .eq('resena_solicitada', false)
    .not('cliente_email', 'is', null)
    .lte('updated_at', new Date(Date.now() - 3 * 86400000).toISOString())
    .gte('updated_at', new Date(Date.now() - 45 * 86400000).toISOString())
    .limit(20)

  if (!ordenes?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  let sentWhatsapp = 0
  for (const o of ordenes) {
    const nombre = (o.cliente_nombre ?? 'Cliente').split(' ')[0]

    // WhatsApp primero (plantilla 'solicitar_resena_v2', APROBADA en Meta —
    // verificado 2026-09-03 directo contra la API de Meta, ya trae el link
    // de reseña de Google embebido). No bloqueante: si falla, el email de
    // abajo sigue cubriendo el envío igual — nunca dependemos de un solo canal.
    if (o.cliente_telefono) {
      try {
        await sendReviewRequest({ telefono: o.cliente_telefono, nombre: o.cliente_nombre })
        sentWhatsapp++
      } catch { /* WhatsApp falló, el email de abajo cubre el envío */ }
    }

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
      await sb.from('orders').update({ resena_solicitada: true }).eq('id', o.id)
      sent++
    } catch { /* continue */ }
  }

  return NextResponse.json({ sent, sentWhatsapp })
}
