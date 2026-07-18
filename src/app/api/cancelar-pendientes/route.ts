// ============================================================
// ContactGo — Cron cancelación automática de pedidos pendientes
// Ejecuta diariamente 3am DR — Vercel Hobby plan solo permite
// crons diarios (Pro habilita frecuencia horaria/mayor si se
// necesita cancelar más cerca de las 3h reales de espera).
// Usa SERVICE_ROLE (bypass RLS) para poder ejecutar el UPDATE
// AZUL intacto: este endpoint NO toca nada de AZUL
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendText } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // service_role bypass RLS
  )
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const isCron = req.headers.get('x-vercel-cron') === '1'
  const isAdmin = authHeader === `Bearer ${process.env.CRON_SECRET ?? 'cg-cron-2024'}`
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const results = { cancelados: 0, notificados: 0, errores: 0, pedidos: [] as string[] }

  // Umbral: pedidos con más de 3h pendientes de pago
  const limite = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()

  const { data: pendientes, error: fetchError } = await sb
    .from('orders')
    .select('id, numero_orden, cliente_nombre, cliente_email, cliente_telefono, total, created_at, metodo_pago')
    .eq('pago_estado', 'pendiente')
    .lt('created_at', limite)
    .neq('estado', 'entregado')
    .neq('estado', 'cancelado')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!pendientes?.length) {
    return NextResponse.json({ ok: true, cancelados: 0, mensaje: 'Sin pedidos pendientes que cancelar' })
  }

  const nowDR = new Date().toLocaleString('es-DO', { timeZone: 'America/Santo_Domingo' })

  for (const p of pendientes) {
    try {
      // 1. Cancelar el pedido
      const { error: updErr } = await sb
        .from('orders')
        .update({
          pago_estado: 'declinado',
          estado: 'cancelado',
          notas_admin: `Auto-cancelado por no pago tras 3h — ${nowDR}`,
        })
        .eq('id', p.id)

      if (updErr) {
        results.errores++
        continue
      }

      // 2. Registrar en historial
      await sb.from('order_status_history').insert({
        order_id: p.id,
        estado: 'cancelado',
        nota: `Auto-cancelado por cron (sin pago en 3h)`,
      }).then(() => {}, () => {})

      results.cancelados++
      results.pedidos.push(p.numero_orden)

      // 3. Enviar WhatsApp al cliente ofreciendo ayuda
      if (p.cliente_telefono) {
        try {
          const nombre = p.cliente_nombre?.split(' ')[0] ?? 'Cliente'
          const mensaje = `Hola *${nombre}* 👋\n\n` +
            `Notamos que tu pedido *#${p.numero_orden}* en ContactGo quedó pendiente de pago y expiró.\n\n` +
            `¿Tuviste algún problema al completar tu compra? Te ayudamos a finalizarlo ahora mismo:\n\n` +
            `💳 Si fue un problema con la tarjeta, tenemos otras opciones (transferencia, efectivo).\n` +
            `📞 O si prefieres, coordinamos por aquí y te lo procesamos manualmente.\n\n` +
            `🎁 *Descuento especial:* usa *VUELVE5* para 5% off si completas hoy.\n\n` +
            `👉 www.contactgo.net/cart\n\n` +
            `Estamos para ayudarte. 💚`
          
          await sendText(p.cliente_telefono, mensaje)
          
          await sb.from('wa_automation_log').insert({
            order_id: p.id,
            telefono: p.cliente_telefono,
            tipo: 'pago_fallido',
            estado: 'sent',
          })
          results.notificados++
        } catch (waErr: any) {
          await sb.from('wa_automation_log').insert({
            order_id: p.id,
            telefono: p.cliente_telefono,
            tipo: 'pago_fallido',
            estado: 'failed',
            error: waErr.message?.slice(0, 200),
          })
        }
      }
    } catch (e) {
      results.errores++
    }
  }

  return NextResponse.json({
    ok: true,
    ...results,
    timestamp: new Date().toISOString(),
  })
}
