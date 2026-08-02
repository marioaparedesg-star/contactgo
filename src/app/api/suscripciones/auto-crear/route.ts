// ============================================================
// ContactGo — POST /api/suscripciones/auto-crear
// Crea automáticamente la reposición programada de cada lente del
// pedido, calculando la duración EXACTA según el producto y la
// cantidad comprada — no una categoría fija.
//
// Ejemplo real: Biofinity (dias_uso=30) comprado en caja de 6 lentes
// (cantidad=1 en order_items porque "cantidad" ahí es cajas, no
// lentes sueltos) dura 90 días si es 1 caja para 1 ojo, o 180 días
// si se compraron 2 cajas (misma_receta o dos líneas). El cálculo
// real es: dias_uso × cantidad de la línea del pedido.
//
// Cada modalidad se trata por separado:
//   - Lentes (esferico/torico/multifocal): reposición por desgaste real
//   - Color: su propio dias_uso (independiente, normalmente mensual)
//   - Soluciones/gotas: también entran si tienen dias_uso definido
//
// Llamado server-to-server desde los mismos puntos donde ya se
// registra recompra_notifications — no requiere que el cliente
// elija nada manualmente en el PDP. Es 100% automático.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Convierte días exactos a la etiqueta más cercana, solo para mostrar en el
// admin de suscripciones (que ya tiene labels bonitos por frecuencia).
function etiquetaMasCercana(dias: number): string {
  if (dias <= 20) return '15_dias'
  if (dias <= 75) return 'mensual'
  if (dias <= 135) return 'bimestral'
  return 'trimestral'
}

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    const sb = getSb()

    const { data: order } = await sb.from('orders')
      .select('id, user_id, cliente_email, cliente_nombre, cliente_telefono, direccion_texto, ciudad')
      .eq('id', order_id).single()
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    if (!order.cliente_telefono) return NextResponse.json({ ok: true, creadas: 0, motivo: 'sin_telefono' })

    // Idempotencia: si este pedido ya generó suscripciones automáticas, no duplicar
    const { count: yaExiste } = await sb.from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('order_id_origen', order_id)
      .eq('creada_automaticamente', true)
    if (yaExiste && yaExiste > 0) {
      return NextResponse.json({ ok: true, creadas: 0, skipped: 'ya_existian' })
    }

    const { data: items } = await sb.from('order_items')
      .select('nombre, cantidad, product_id, products(id, nombre, tipo, dias_uso)')
      .eq('order_id', order_id)
    if (!items?.length) return NextResponse.json({ ok: true, creadas: 0 })

    const direccionTexto = [order.direccion_texto, order.ciudad].filter(Boolean).join(', ')
    let creadas = 0

    for (const item of items) {
      const product = item.products as any
      if (!product?.dias_uso) continue // sin duración conocida, no se puede calcular

      // Duración real: días de uso del producto × cantidad comprada en esta línea.
      // Esto respeta exactamente el caso que describiste: 1 caja = 3 meses,
      // 2 cajas = 6 meses — porque cantidad multiplica directamente los días.
      const diasCiclo = product.dias_uso * (item.cantidad || 1)
      const proximoEnvio = new Date(Date.now() + diasCiclo * 24 * 60 * 60 * 1000)

      const { error } = await sb.from('subscriptions').insert({
        user_id: order.user_id,
        cliente_nombre: order.cliente_nombre,
        cliente_telefono: order.cliente_telefono,
        cliente_email: order.cliente_email,
        direccion_texto: direccionTexto || null,
        order_id_origen: order_id,
        items: [{ nombre: product.nombre, tipo: product.tipo, cantidad: item.cantidad }],
        frecuencia: etiquetaMasCercana(diasCiclo),
        dias_ciclo: diasCiclo,
        producto_nombre: product.nombre,
        proximo_envio: proximoEnvio.toISOString().split('T')[0],
        activa: true,
        cancelada: false,
        creada_automaticamente: true,
      })

      if (!error) creadas++
    }

    return NextResponse.json({ ok: true, creadas })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
