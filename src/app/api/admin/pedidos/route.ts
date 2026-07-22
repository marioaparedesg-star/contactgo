// ============================================================
// ContactGo — POST /api/admin/pedidos
// Acciones de admin sobre pedidos con service role (evita bloqueos de RLS desde el navegador).
// acciones: cambiar_estado | marcar_pagado | cancelar | eliminar
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

export async function POST(req: NextRequest) {
  try {
    const guardErr = guardRequest(req, { limitPerMin: 60, requireOrigin: false })
    if (guardErr) return guardErr

    const auth = await requireAdmin()
    if (auth.ok === false) return auth.response

    const body = await req.json()
    const { accion, order_id, nuevo_estado } = body
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    const sb = getSb()

    if (accion === 'cambiar_estado') {
      if (!nuevo_estado) return NextResponse.json({ error: 'nuevo_estado requerido' }, { status: 400 })
      const { error } = await sb.from('orders').update({ estado: nuevo_estado }).eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (accion === 'marcar_pagado') {
      const { error } = await sb.from('orders')
        .update({ pago_estado: 'pagado', estado: 'confirmado', pagado_en: new Date().toISOString() })
        .eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (accion === 'cancelar') {
      const { error } = await sb.from('orders')
        .update({ estado: 'cancelado', pago_estado: 'cancelado' })
        .eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (accion === 'eliminar') {
      // Elimina items primero (FK), luego la orden. Solo para limpieza de pruebas.
      await sb.from('order_items').delete().eq('order_id', order_id)
      await sb.from('venta_whatsapp_links').update({ order_id: null }).eq('order_id', order_id)
      const { error } = await sb.from('orders').delete().eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  } catch (err: any) {
    console.error('[admin/pedidos]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
