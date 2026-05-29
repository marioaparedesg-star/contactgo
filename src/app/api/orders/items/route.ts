import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // Seguridad: origin + rate limit
  const guardErr = guardRequest(req, { limitPerMin: 30 })
  if (guardErr) return guardErr

  try {
    const body = await req.json()
    const { order_id, items } = body

    if (!order_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'order_id e items requeridos' }, { status: 400 })
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Usar RPC con validación de ownership server-side
    // Solo acepta órdenes pendientes creadas en los últimos 60 minutos
    const { data, error } = await sb.rpc('insert_order_items_secure', {
      p_order_id: order_id,
      p_items:    items,
    })

    if (error) {
      console.error('[order_items API] RPC error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const result = Array.isArray(data) ? data[0] : data

    if (!result?.ok) {
      return NextResponse.json(
        { error: result?.error_msg ?? 'Orden no válida' },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, count: result.count })
  } catch (err) {
    console.error('[order_items API] Exception:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
