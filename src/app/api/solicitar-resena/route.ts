// POST /api/solicitar-resena — Cron: envía email de solicitud de reseña
// 7 días después de la compra (cuando probablemente ya recibió los lentes)
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const getSb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Órdenes pagadas hace 7-8 días sin reseña solicitada
  const { data: ordenes } = await sb
    .from('orders')
    .select('id, cliente_email, cliente_nombre, numero_orden')
    .eq('pago_estado', 'pagado')
    .eq('resena_solicitada', false)
    .gte('created_at', new Date(Date.now() - 8 * 86400000).toISOString())
    .lte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .limit(20)

  if (!ordenes?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const o of ordenes) {
    const nombre = (o.cliente_nombre ?? 'Cliente').split(' ')[0]
    try {
      await resend.emails.send({
        from: `ContactGo <info@contactgo.net>`,
        to: o.cliente_email,
        subject: `¿Cómo fue tu experiencia con ContactGo? 👁`,
        html: `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
  <div style="background:#16a34a;padding:20px;border-radius:12px 12px 0 0;text-align:center">
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
    <a href="${BASE}/producto?resena=true&orden=${o.numero_orden}"
      style="display:block;background:#16a34a;color:white;font-weight:700;padding:14px 24px;border-radius:10px;text-align:center;text-decoration:none;font-size:15px;margin:20px 0">
      ⭐ Dejar mi reseña
    </a>
    <p style="color:#9ca3af;font-size:12px;text-align:center">
      ContactGo · contactgo.net · WhatsApp: +1 829 472-8328
    </p>
  </div>
</div>`
      })
      await sb.from('orders').update({ resena_solicitada: true }).eq('id', o.id)
      sent++
    } catch { /* continue */ }
  }

  return NextResponse.json({ sent })
}
