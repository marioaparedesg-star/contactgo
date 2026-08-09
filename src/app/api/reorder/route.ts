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

  // FIX CRÍTICO AUDITORÍA (2026-08-09): este endpoint devolvía el contenido
  // completo de CUALQUIER pedido (productos, precios, y la receta médica
  // exacta: SPH/CYL/eje/ADD) con solo conocer el orderId — sin verificar
  // que perteneciera al usuario que hace la solicitud. Un UUID de pedido
  // puede filtrarse fácilmente (aparece en URLs de seguimiento, WhatsApp,
  // capturas de pantalla) y con eso cualquiera podía ver la receta y
  // compras de otro cliente. Ahora se verifica sesión + dueño real del
  // pedido antes de devolver nada — como este endpoint usa la service role
  // key (necesaria para leer datos de receta que RLS no expone directo),
  // la verificación de dueño se hace aquí mismo, a mano.
  const cookieSb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )
  const { data: { user } } = await cookieSb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: order } = await sb.from('orders').select('user_id').eq('id', orderId).single()
  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { data: items } = await sb
    .from('order_items')
    .select('product_id, nombre, precio, cantidad, sph, sph_od, sph_oi, cyl, cyl_od, cyl_oi, axis, axis_od, axis_oi, add_power, color, ojo_mode, size, suscripcion, precio_original, product:products(id, nombre, precio, tipo, slug, imagen_url)')
    .eq('order_id', orderId)
  if (!items?.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ items })
}
