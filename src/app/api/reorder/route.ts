import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()
  if (!orderId) return NextResponse.json({ error: 'orderId requerido' }, { status: 400 })
  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )
  const { data: items } = await sb
    .from('order_items')
    .select('product_id, nombre, precio, cantidad, sph, sph_od, sph_oi, cyl, cyl_od, cyl_oi, axis, axis_od, axis_oi, add_power, color, ojo_mode, size, suscripcion, precio_original, product:products(id, nombre, precio, tipo, slug, imagen_url)')
    .eq('order_id', orderId)
  if (!items?.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ items })
}
