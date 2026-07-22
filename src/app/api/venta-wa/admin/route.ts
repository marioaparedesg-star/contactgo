// ============================================================
// ContactGo — /api/venta-wa/admin
// GET  → lista de links de venta WhatsApp con su orden asociada
// POST → acciones: marcar_pagado | cancelar_link
// ============================================================
import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (auth.ok === false) return auth.response

    const sb = getSb()
    const { data: links, error } = await sb
      .from('venta_whatsapp_links')
      .select('id, token, items, subtotal, envio, total, estado, order_id, notas, created_at, expires_at, completado_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Traer info de órdenes asociadas
    const orderIds = (links ?? []).map(l => l.order_id).filter(Boolean)
    let ordersMap: Record<string, any> = {}
    if (orderIds.length) {
      const { data: orders } = await sb
        .from('orders')
        .select('id, numero_orden, cliente_nombre, cliente_telefono, cliente_email, pago_estado, estado, total')
        .in('id', orderIds)
      ordersMap = Object.fromEntries((orders ?? []).map(o => [o.id, o]))
    }

    return NextResponse.json({
      links: (links ?? []).map(l => ({
        ...l,
        url: `${BASE}/venta/${l.token}`,
        order: l.order_id ? ordersMap[l.order_id] ?? null : null,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const guardErr = guardRequest(req, { limitPerMin: 30, requireOrigin: false })
    if (guardErr) return guardErr

    const auth = await requireAdmin()
    if (auth.ok === false) return auth.response

    const body = await req.json()
    const { accion, link_id, order_id } = body
    const sb = getSb()

    if (accion === 'cancelar_link' && link_id) {
      const { error } = await sb
        .from('venta_whatsapp_links')
        .update({ estado: 'cancelado' })
        .eq('id', link_id)
        .eq('estado', 'pendiente')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (accion === 'marcar_pagado' && order_id) {
      const { data: order, error: getErr } = await sb
        .from('orders')
        .select('id, pago_estado, numero_orden')
        .eq('id', order_id)
        .single()
      if (getErr || !order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
      if (order.pago_estado === 'pagado') return NextResponse.json({ error: 'Ya estaba marcada como pagada' }, { status: 409 })

      const { error: updErr } = await sb
        .from('orders')
        .update({
          pago_estado: 'pagado',
          estado: 'confirmado',
          pagado_en: new Date().toISOString(),
          pago_referencia: 'AZUL manual — venta WhatsApp',
        })
        .eq('id', order_id)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

      // Al confirmar el pago SÍ se notifica al cliente (WhatsApp + email) como cualquier
      // pedido pagado — ya es una venta confirmada real.
      try {
        await fetch(`${BASE}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id, evento: 'estado_cambio', nuevo_estado: 'confirmado' }),
        })
      } catch { /* silencioso */ }

      return NextResponse.json({ ok: true, numero_orden: order.numero_orden })
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
