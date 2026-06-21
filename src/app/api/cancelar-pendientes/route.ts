// /api/cancelar-pendientes — Cron que cancela pedidos pendientes > 3 horas
// Ejecuta cada hora — AZUL intacto: este endpoint no toca nada de AZUL
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Solo Vercel Cron o llamada con CRON_SECRET puede ejecutar esto
  const authHeader = req.headers.get('authorization')
  const isCron     = req.headers.get('x-vercel-cron') === '1'
  const isAdmin    = authHeader === `Bearer ${process.env.CRON_SECRET ?? 'cg-cron-2024'}`

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = createServerSupabaseClient()

  // Umbral: 3 horas atrás
  const limite = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()

  const { data: pendientes, error: fetchError } = await sb
    .from('orders')
    .select('id, numero_orden, cliente_nombre, cliente_email, total, created_at')
    .eq('pago_estado', 'pendiente')
    .lt('created_at', limite)
    .neq('estado', 'entregado')  // nunca tocar los ya entregados

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!pendientes?.length) {
    return NextResponse.json({ ok: true, cancelados: 0 })
  }

  const ids     = pendientes.map(p => p.id)
  const numeros = pendientes.map(p => p.numero_orden)

  const { error: updateError } = await sb
    .from('orders')
    .update({
      pago_estado: 'declinado',
      estado:      'cancelado',
      notas_admin: `Auto-cancelado: pendiente más de 3h sin pago — ${new Date().toLocaleString('es-DO', { timeZone: 'America/Santo_Domingo' })}`
    })
    .in('id', ids)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    ok:        true,
    cancelados: pendientes.length,
    pedidos:   numeros,
    timestamp: new Date().toISOString(),
  })
}
