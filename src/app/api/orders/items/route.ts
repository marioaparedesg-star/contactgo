import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
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

    const payload = items.map((i: any) => ({
      order_id,
      product_id: i.product_id,
      nombre:     i.nombre,
      precio:     Number(i.precio),
      cantidad:   Number(i.cantidad),
      subtotal:   Number(i.precio) * Number(i.cantidad),  // campo requerido
      sph:        i.sph        != null ? Number(i.sph)        : null,
      cyl:        i.cyl        != null ? Number(i.cyl)        : null,
      add_power:  i.add_power  != null ? Number(i.add_power)  : null,
      axis:       i.axis       != null ? Number(i.axis)       : null,
      color:      i.color      ?? null,
      ojo:        i.ojo        ?? null,
      size:       i.size       ?? null,
    }))

    const { error } = await sb.from('order_items').insert(payload)
    if (error) {
      console.error('[order_items API]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, count: payload.length })
  } catch (err) {
    console.error('[order_items API] Exception:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
