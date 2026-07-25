import { guardRequest, getIP } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }

export async function POST(req: NextRequest) {
  // Seguridad: origin + rate limit
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return guardErr
  const ip = getIP(req)


  try {
    const { order_id } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    const { data: order } = await getSb().from('orders')
      .select('id, user_id, cliente_email, cliente_nombre, cliente_telefono, fecha')
      .eq('id', order_id).single()

    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

    // ── El cliente acaba de comprar de nuevo: silenciar cualquier recordatorio
    // pendiente de una compra ANTERIOR (mismo teléfono o email) para que no le
    // sigan avisando de un ciclo que ya renovó. ──
    if (order.cliente_telefono || order.cliente_email) {
      const filtros = []
      if (order.cliente_telefono) filtros.push(`telefono.eq.${order.cliente_telefono}`)
      if (order.cliente_email) filtros.push(`email.eq.${order.cliente_email}`)
      await getSb().from('recompra_notifications')
        .update({ notificado_7: true, notificado_3: true, notificado_0: true })
        .neq('order_id', order_id)
        .or(filtros.join(','))
        .eq('notificado_0', false)
    }

    const { data: items } = await getSb().from('order_items')
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
      const cupon = `RENUEVA${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      // El cupón queda vigente 7 días después del último recordatorio, para dar tiempo real a usarlo
      const cuponExpira = new Date(fechaFin.getTime() + 7 * 24 * 60 * 60 * 1000)

      registros.push({
        order_id: order.id,
        user_id: order.user_id,
        email: order.cliente_email,
        telefono: order.cliente_telefono,
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
        descuento_ofrecido: 5,
        cupon_generado: cupon,
        cupon_expira: cuponExpira.toISOString().slice(0, 10),
      })
    }

    if (registros.length > 0) {
      await getSb().from('recompra_notifications').insert(
        registros.map(({ cupon_expira, ...r }) => r)
      )
      for (const r of registros) {
        await getSb().from('coupons').insert({
          codigo: r.cupon_generado,
          tipo: 'porcentaje',
          valor: r.descuento_ofrecido,
          envio_gratis: true,
          activo: false,
          uso_maximo: 1,
          limite_usos: 1,
          valido_hasta: r.cupon_expira,
          fecha_expira: r.cupon_expira,
          usos_actuales: 0,
          // Cupón personal e intransferible — vinculado al email del destinatario si lo tenemos
          email_requerido: r.email ?? null,
        })
      }
    }

    return NextResponse.json({ ok: true, registros: registros.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
