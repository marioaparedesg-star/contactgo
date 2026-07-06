// ============================================================
// ContactGo — CRON horario (cada hora)
// Envía: recuperación de carrito abandonado (2h después)
// GET /api/cron/wa-hourly
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendText } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? 'contactgo_cron_2026'
  if (auth !== `Bearer ${cronSecret}` && req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = getSb()
  const results = { carritos: 0, errores: 0 }

  // ─────────────────────────────────────────────────────
  // Carritos abandonados: entre 2h y 24h de antigüedad
  // No enviados aún, no convertidos, con teléfono
  // ─────────────────────────────────────────────────────
  try {
    const hace2h = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: carritos } = await sb
      .from('carritos_abandonados')
      .select('*')
      .eq('wa_enviado', false)
      .eq('convertido', false)
      .lt('created_at', hace2h)
      .gt('created_at', hace24h)
      .not('telefono', 'is', null)
      .limit(30)

    for (const c of carritos ?? []) {
      try {
        const nombre = c.nombre?.split(' ')[0] ?? ''
        const items = Array.isArray(c.items) ? c.items : []
        const productos = items
          .slice(0, 3)
          .map((i: any) => `• ${i.nombre ?? 'Producto'}${i.cantidad > 1 ? ` x${i.cantidad}` : ''}`)
          .join('\n')

        const mensaje = `👋 Hola${nombre ? ` *${nombre}*` : ''}, dejaste algo esperando en tu carrito 🛒\n\n` +
          `${productos}\n\n` +
          `¿Tuviste algún problema al comprar? Te ayudamos ahora mismo.\n\n` +
          `🎁 *5% de descuento* para que completes hoy:\n` +
          `*VUELVE5*\n\n` +
          `👉 Continúa aquí: www.contactgo.net/cart\n\n` +
          `O responde este mensaje y te asistimos personalmente. 💚`

        const res = await sendText(c.telefono, mensaje)
        await sb.from('carritos_abandonados').update({
          wa_enviado: true,
          wa_enviado_at: new Date().toISOString(),
        }).eq('id', c.id)

        await sb.from('wa_automation_log').insert({
          telefono: c.telefono, tipo: 'carrito',
          estado: 'sent', wa_message_id: res?.messages?.[0]?.id,
        })
        results.carritos++
      } catch (e: any) {
        await sb.from('wa_automation_log').insert({
          telefono: c.telefono, tipo: 'carrito',
          estado: 'failed', error: e.message,
        })
        results.errores++
      }
    }
  } catch (e) { console.error('[cron/wa-hourly] carritos:', e) }

  return NextResponse.json({ ok: true, ...results, ejecutado_at: new Date().toISOString() })
}
