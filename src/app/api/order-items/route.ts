import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { order_id, items } = await req.json()

    if (!order_id || !items?.length) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Intentar con service role si está disponible, sino usar anon key
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const rows = items.map((i: any) => ({
      order_id,
      product_id: i.product_id,
      nombre:     i.nombre,
      precio:     parseFloat(String(i.precio)),
      cantidad:   parseInt(String(i.cantidad)),
      sph:        i.sph != null ? parseFloat(String(i.sph)) : null,
      cyl:        i.cyl != null ? parseFloat(String(i.cyl)) : null,
      axis:       i.axis != null ? parseInt(String(i.axis)) : null,
      add_power:  i.add_power != null ? parseFloat(String(i.add_power).replace('+','')) : null,
      color:      i.color ?? null,
      ojo:        i.ojo ?? null,
      size:       i.size ?? null,
      subtotal:   parseFloat(String(i.subtotal)),
    }))

    const { error } = await sb.from('order_items').insert(rows)

    if (error) {
      console.error('order-items insert error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }

    return NextResponse.json({ ok: true, count: rows.length })
  } catch (err: any) {
    console.error('order-items route error:', err?.message)
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 })
  }
}
