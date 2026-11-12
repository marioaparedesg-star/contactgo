import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 30 })
  if (guardErr) return guardErr

  try {
    const cookieStore = await cookies()
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => { try { cookieStore.set(name, value, options) } catch {} },
          remove: (name, options) => { try { cookieStore.delete(name) } catch {} },
        },
      }
    )
    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para completar este pedido.' }, { status: 401 })
    }

    const body = await req.json()
    const { order_id, items } = body
    if (!order_id || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'order_id e items válidos requeridos' }, { status: 400 })
    }

    const sb = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar en servidor que la orden pertenece al usuario autenticado.
    // El service role solo se usa después de validar la sesión con cookies.
    const { data: order, error: orderError } = await sb
      .from('orders')
      .select('id,user_id,pago_estado,created_at')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .eq('pago_estado', 'pendiente')
      .gt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .maybeSingle()

    if (orderError) {
      console.error('[order_items API] order lookup error:', orderError)
      return NextResponse.json({ error: 'No se pudo validar el pedido.' }, { status: 500 })
    }
    if (!order) {
      return NextResponse.json({ error: 'Orden no válida o no pertenece a tu cuenta.' }, { status: 403 })
    }

    const { data, error } = await sb.rpc('insert_order_items_secure', {
      p_order_id: order_id,
      p_items: items,
    })

    if (error) {
      console.error('[order_items API] RPC error:', error)
      return NextResponse.json({ error: 'No se pudieron guardar los productos del pedido.' }, { status: 500 })
    }

    const result = Array.isArray(data) ? data[0] : data
    if (!result?.ok) {
      return NextResponse.json({ error: result?.error_msg ?? 'Orden no válida' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, count: result.count })
  } catch (err) {
    console.error('[order_items API] Exception:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
