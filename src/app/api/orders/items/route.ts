import { guardRequest } from '@/lib/api-guard'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // CSRF: solo aceptar solicitudes del mismo origen. La autenticación y
  // propiedad de la orden se validan por separado; Origin no sustituye auth.
  const guardErr = guardRequest(req, { limitPerMin: 30, requireOrigin: false })
  if (guardErr) return guardErr

  const origin = req.headers.get('origin')
  if (!origin || origin !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { order_id, items } = body

    if (!order_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'order_id e items requeridos' }, { status: 400 })
    }

    // El checkout exige sesión. Nunca permitir que un visitante cambie
    // los artículos de una orden ajena conociendo solamente su UUID.
    const authSb = createServerSupabaseClient()
    const { data: { user }, error: authError } = await authSb.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminSb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: order, error: orderError } = await adminSb
      .from('orders')
      .select('user_id')
      .eq('id', order_id)
      .maybeSingle()

    if (orderError) {
      console.error('[order_items API] Order lookup error:', orderError)
      return NextResponse.json({ error: 'No se pudo validar el pedido' }, { status: 500 })
    }
    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: 'Pedido no autorizado' }, { status: 403 })
    }

    // La RPC usa service_role (no está concedida a anon/authenticated) y
    // valida estado pendiente, antigüedad, productos, precios y stock.
    const { data, error } = await adminSb.rpc('insert_order_items_secure', {
      p_order_id: order_id,
      p_items: items,
    })

    if (error) {
      console.error('[order_items API] RPC error:', error)
      return NextResponse.json({ error: 'No se pudieron guardar los artículos' }, { status: 500 })
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
