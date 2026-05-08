import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { order_id, items } = await req.json()
    if (!order_id || !items?.length) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }
    const rows = items.map((i: any) => ({
      order_id,
      product_id: i.product_id,
      nombre:     i.nombre,
      precio:     i.precio,
      cantidad:   i.cantidad,
      sph:        i.sph ?? null,
      cyl:        i.cyl ?? null,
      axis:       i.axis ?? null,
      add_power:  i.add_power ?? null,
      color:      i.color ?? null,
      ojo:        i.ojo ?? null,
      size:       i.size ?? null,
      subtotal:   i.subtotal,
    }))
    const { error } = await supabaseAdmin.from('order_items').insert(rows)
    if (error) {
      console.error('order-items error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('order-items route error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
