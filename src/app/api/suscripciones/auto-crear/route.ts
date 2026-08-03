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
import { mejorFrecuencia } from '@/lib/subscription-utils'

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// BUG CORREGIDO (2026-08-02): esta función generaba '15_dias' y 'bimestral',
// valores que NO existen en el check constraint subscriptions_frecuencia_check
// (solo permite 'mensual' | 'trimestral' | 'semestral'). Cualquier producto de
// 14 días (ACUVUE® 2, ACUVUE® OASYS® y su familia) o 60 días (Sprainer) fallaba
// el INSERT en silencio — el error se atrapaba y no se sumaba a "creadas".
// Ahora reutiliza mejorFrecuencia() de subscription-utils.ts, la misma fuente
// de verdad que ya usan el selector de suscripción del PDP y la cuenta del cliente.
function etiquetaMasCercana(dias: number): string {
  return mejorFrecuencia(dias)
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

    // Idempotencia: si este pedido YA tiene una suscripción — automática o
    // manual (el cliente pudo haberla elegido en el checkout, ver
    // src/app/checkout/page.tsx) — no duplicar. Antes este chequeo solo
    // miraba creada_automaticamente=true, así que un pedido con suscripción
    // manual + notify() disparado después terminaba con DOS suscripciones
    // para el mismo pedido.
    const { count: yaExiste } = await sb.from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('order_id_origen', order_id)
    if (yaExiste && yaExiste > 0) {
      return NextResponse.json({ ok: true, creadas: 0, skipped: 'ya_existian' })
    }

    const { data: items } = await sb.from('order_items')
      .select('nombre, cantidad, product_id, products(id, nombre, tipo, dias_uso, pares_por_caja)')
      .eq('order_id', order_id)
    if (!items?.length) return NextResponse.json({ ok: true, creadas: 0 })

    const direccionTexto = [order.direccion_texto, order.ciudad].filter(Boolean).join(', ')
    let creadas = 0
    const errores: string[] = []

    for (const item of items) {
      const product = item.products as any
      if (!product?.dias_uso) continue // sin duración conocida, no se puede calcular

      // BUG CORREGIDO (2026-08-03): dias_uso es cuánto dura UN PAR de lentes
      // (uno por ojo), no la caja completa. Una caja trae pares_por_caja pares
      // (ej. 30 lentes ÷ 2 = 15 pares para diarios; 6 lentes ÷ 2 = 3 pares para
      // mensuales/quincenales). Confirmado con Mario: 1 caja de diario (30
      // lentes) = 15 días, 2 cajas = 30 días. Fórmula anterior ignoraba
      // pares_por_caja por completo → todo producto diario quedaba con un
      // ciclo de 1 día, generando un recordatorio de WhatsApp CADA DÍA para
      // siempre. Para soluciones/gotas, pares_por_caja=1 (no aplica el
      // concepto de "par"), así que la fórmula no cambia para esos productos.
      const diasCiclo = product.dias_uso * (product.pares_por_caja || 1) * (item.cantidad || 1)
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

      // Antes este error se descartaba en silencio (if (!error) creadas++ y ya).
      // Ahora queda registrado en logs de Vercel Y en la respuesta del endpoint,
      // para que un fallo futuro (constraint, columna, tipo de dato, etc.) sea
      // visible de inmediato en vez de descubrirse semanas después.
      if (error) {
        console.error('[suscripciones/auto-crear] insert falló:', order_id, product.nombre, error.message)
        errores.push(`${product.nombre}: ${error.message}`)
      } else {
        creadas++
      }
    }

    return NextResponse.json({ ok: true, creadas, ...(errores.length ? { errores } : {}) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
