import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    const { data: order } = await sb.from('orders')
      .select('id, user_id, cliente_email, cliente_nombre, fecha')
      .eq('id', order_id).single()

    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

    const { data: items } = await sb.from('order_items')
      .select('product_id, cantidad, products(id, nombre, tipo, dias_uso)')
      .eq('order_id', order_id)

    if (!items?.length) return NextResponse.json({ ok: true, registros: 0 })

    const fechaCompra = new Date(order.fecha || new Date())
    const registros = []

    for (const item of items) {
      const product = item.products as any
      // Todos los productos con dias_uso definido — lentes, gotas, soluciones
      if (!product?.dias_uso) continue

      const diasTotales = product.dias_uso * (item.cantidad || 1)
      const fechaFin = new Date(fechaCompra.getTime() + diasTotales * 24 * 60 * 60 * 1000)
      const alerta7 = new Date(fechaFin.getTime() - 7 * 24 * 60 * 60 * 1000)
      const alerta3 = new Date(fechaFin.getTime() - 3 * 24 * 60 * 60 * 1000)
      const cupon = `RECARGA${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      registros.push({
        order_id: order.id,
        user_id: order.user_id,
        email: order.cliente_email,
        nombre: order.cliente_nombre,
        product_id: product.id,
        product_nombre: product.nombre,
        tipo_producto: product.tipo,
        dias_uso: diasTotales,
        fecha_compra: fechaCompra.toISOString(),
        fecha_estimada_fin: fechaFin.toISOString(),
        fecha_notificacion_7: alerta7.toISOString(),
        fecha_notificacion_3: alerta3.toISOString(),
        fecha_notificacion_0: fechaFin.toISOString(),
        descuento_ofrecido: 10,
        cupon_generado: cupon,
      })
    }

    if (registros.length > 0) {
      await sb.from('recompra_notifications').insert(registros)
      for (const r of registros) {
        await sb.from('coupons').insert({
          code: r.cupon_generado,
          descripcion: `Recompra ${r.product_nombre}`,
          tipo: 'porcentaje',
          valor: r.descuento_ofrecido,
          activo: false,
          limite_usos: 1,
          fecha_expira: r.fecha_estimada_fin,
          usos: 0,
        })
      }
    }

    return NextResponse.json({ ok: true, registros: registros.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
