// POST /api/rx-save — Guarda la receta del usuario automáticamente tras una compra pagada
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { order_id } = await req.json()
  if (!order_id) return NextResponse.json({ ok: false })

  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )

  // Obtener el pedido con sus items
  const { data: order } = await sb
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', order_id)
    .eq('pago_estado', 'pagado')
    .single()

  if (!order) return NextResponse.json({ ok: false, error: 'Pedido no encontrado' })

  // Obtener el user_id desde el email
  const { data: profile } = await sb
    .from('profiles')
    .select('id')
    .eq('email', order.cliente_email)
    .single()

  if (!profile) return NextResponse.json({ ok: false, error: 'Usuario no encontrado' })

  // Guardar receta por cada item con graduación
  let saved = 0
  for (const item of (order.order_items ?? [])) {
    // Solo guardar si tiene SPH (es un lente con receta)
    if (!item.sph && !item.sph_od && !item.sph_oi) continue

    const rxData = {
      user_id: profile.id,
      nombre: item.nombre?.slice(0, 40) ?? 'Mi receta',
      od_sph: item.sph_od ?? (item.ojo_mode !== 'OI' ? item.sph : null),
      od_cyl: item.cyl_od ?? (item.ojo_mode !== 'OI' ? item.cyl : null),
      od_axis: item.axis_od ?? (item.ojo_mode !== 'OI' ? item.axis : null),
      oi_sph: item.sph_oi ?? (item.ojo_mode !== 'OD' ? item.sph : null),
      oi_cyl: item.cyl_oi ?? (item.ojo_mode !== 'OD' ? item.cyl : null),
      oi_axis: item.axis_oi ?? (item.ojo_mode !== 'OD' ? item.axis : null),
      add_power: item.add_power ?? null,
      es_principal: true,
    }

    // Actualizar o insertar (solo una receta principal por usuario)
    const { data: existing } = await sb
      .from('saved_prescriptions')
      .select('id')
      .eq('user_id', profile.id)
      .eq('nombre', rxData.nombre)
      .single()

    if (existing) {
      await sb.from('saved_prescriptions').update(rxData).eq('id', existing.id)
    } else {
      await sb.from('saved_prescriptions').insert(rxData)
    }
    saved++
  }

  return NextResponse.json({ ok: true, saved })
}
