// ============================================================
// ContactGo — POST /api/admin/pedidos
// Acciones de admin sobre pedidos con service role (evita bloqueos de RLS desde el navegador).
// acciones: cambiar_estado | marcar_pagado | cancelar | eliminar
// ============================================================
import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const guardErr = guardRequest(req, { limitPerMin: 60, requireOrigin: false })
    if (guardErr) return guardErr

    const auth = await requireAdmin()
    if (auth.ok === false) return auth.response

    const body = await req.json()
    const { accion, order_id, nuevo_estado } = body
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

    const sb = getSb()

    if (accion === 'cambiar_estado') {
      if (!nuevo_estado) return NextResponse.json({ error: 'nuevo_estado requerido' }, { status: 400 })
      const { error } = await sb.from('orders').update({ estado: nuevo_estado }).eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (accion === 'marcar_pagado') {
      const { error } = await sb.from('orders')
        .update({ pago_estado: 'pagado', estado: 'confirmado', pagado_en: new Date().toISOString() })
        .eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    // ── Registrar pago o abono parcial ──────────────────────────────────
    // Reemplaza a marcar_pagado para casos que necesitan control fino:
    //   - Pagos parciales (cliente pagó 50%, resto contra entrega)
    //   - Marcar como pagado SIN notificar al cliente
    //   - Trazabilidad completa de pagos por método
    if (accion === 'registrar_pago') {
      const monto = Number(body.monto)
      const metodo = String(body.metodo ?? 'efectivo')
      const nota = body.nota ? String(body.nota).slice(0, 500) : null
      const notificar = body.notificar !== false // default true

      if (!monto || monto <= 0) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
      if (!['efectivo', 'transferencia', 'tarjeta', 'otro', 'azul'].includes(metodo)) {
        return NextResponse.json({ error: 'Método inválido' }, { status: 400 })
      }

      // Traer orden actual + suma de pagos previos
      const { data: order, error: orderErr } = await sb.from('orders')
        .select('id, numero_orden, total, pago_estado')
        .eq('id', order_id).single()
      if (orderErr || !order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

      const { data: pagosPrevios } = await sb.from('order_payments')
        .select('monto').eq('order_id', order_id)
      const totalPagadoPrevio = (pagosPrevios ?? []).reduce((s, p: any) => s + Number(p.monto), 0)
      const totalPagadoNuevo = totalPagadoPrevio + monto

      // No permitir exceder el total del pedido (evita errores de captura)
      if (totalPagadoNuevo > Number(order.total) + 0.01) {
        return NextResponse.json({
          error: `El pago excede el total. Ya pagado: RD$${totalPagadoPrevio.toLocaleString()} · Total pedido: RD$${Number(order.total).toLocaleString()} · Puedes registrar hasta RD$${(Number(order.total) - totalPagadoPrevio).toLocaleString()}`
        }, { status: 400 })
      }

      // Insertar el pago
      const { error: payErr } = await sb.from('order_payments').insert({
        order_id, monto, metodo, nota, notified: notificar,
      })
      if (payErr) return NextResponse.json({ error: payErr.message }, { status: 500 })

      // Registrar el movimiento de caja INMEDIATAMENTE.
      // Esto asegura que abonos parciales aparezcan en las ventas del día
      // aunque la orden siga en 'pendiente'. Sin esto, el dinero real cobrado
      // no aparecería en /admin/caja hasta completar el 100%.
      const notaCaja = `Venta ${order.numero_orden}${nota ? ` — ${nota}` : ''}${totalPagadoNuevo < Number(order.total) - 0.5 ? ' (abono parcial)' : ''}`
      await sb.from('cash_movements').insert({
        tipo: 'ingreso',
        categoria: 'venta',
        descripcion: notaCaja,
        monto,
        metodo,
        referencia: order.numero_orden,
        order_id,
        fecha: new Date().toISOString().split('T')[0],
      }).then(({ error }) => {
        if (error) console.error('[registrar_pago] cash_movements insert falló (no bloquea):', error.message)
      })

      // Determinar si el pedido queda totalmente pagado (tolerancia RD$1)
      const totalPedido = Number(order.total)
      const cubrio100 = totalPagadoNuevo >= totalPedido - 0.5
      const nuevoPagoEstado = cubrio100 ? 'pagado' : 'pendiente'

      // Solo cambiamos el estado del pedido si:
      //   - Se completó el 100% → pagado + confirmado
      //   - Sigue en pendiente → no hacemos nada
      if (cubrio100) {
        await sb.from('orders').update({
          pago_estado: 'pagado',
          estado: 'confirmado',
          pagado_en: new Date().toISOString(),
        }).eq('id', order_id)
      }

      // Notificar al cliente solo si el usuario lo pidió Y el pedido llegó a 100%
      // (si es abono parcial, no tiene sentido notificar 'tu pedido está pagado')
      if (notificar && cubrio100) {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
        fetch(`${base}/api/notify`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id, evento: 'estado_cambio', nuevo_estado: 'confirmado' }),
        }).catch(err => console.error('[admin/pedidos registrar_pago] notify falló:', err))

        // Confirmación completa de pedido por WhatsApp (nombre + # orden + productos + total).
        // Antes solo se enviaba automáticamente para pagos AZUL vía /confirmacion — los pedidos
        // pagados manualmente aquí (venta WhatsApp, transferencia, efectivo) nunca la recibían.
        // Tiene dedup incorporado por evento_id, así que es seguro llamarla siempre sin
        // riesgo de duplicar el mensaje si ya se envió por otra vía.
        fetch(`${base}/api/wa/dispatch`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'pedido_pagado', order_id }),
        }).catch(err => console.error('[admin/pedidos registrar_pago] wa/dispatch falló:', err))
      }

      // Registrar recordatorios de recompra (7/3/0 días antes de que se acaben los lentes)
      // SIEMPRE que el pedido se complete al 100%, sin importar el canal ni el toggle de
      // notificar — son recordatorios de un evento futuro (reponer producto), no una
      // notificación de esta compra. Antes solo se registraba para pagos AZUL vía
      // /confirmacion, dejando fuera pedidos de venta WhatsApp y pagos manuales — que
      // es la mayoría del volumen real. Tiene dedup incorporado por order_id.
      if (cubrio100) {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
        fetch(`${base}/api/recompra/registrar`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id }),
        }).catch(err => console.error('[admin/pedidos registrar_pago] recompra/registrar falló:', err))
      }

      return NextResponse.json({
        ok: true,
        pago_estado: nuevoPagoEstado,
        total_pagado: totalPagadoNuevo,
        total_pedido: totalPedido,
        cubrio_total: cubrio100,
        pendiente: Math.max(0, totalPedido - totalPagadoNuevo),
      })
    }

    // Consulta: obtener historial de pagos de un pedido
    if (accion === 'listar_pagos') {
      const { data, error } = await sb.from('order_payments')
        .select('id, monto, metodo, nota, notified, created_at')
        .eq('order_id', order_id)
        .order('created_at', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, pagos: data ?? [] })
    }

    if (accion === 'cancelar') {
      // NOTA: el check constraint orders_pago_estado_check solo permite:
      // pendiente | pagado | declinado | verificado | rechazado.
      // Usamos 'declinado' (semanticamente = pago no completado) — antes
      // intentaba 'cancelado' y fallaba silenciosamente.
      const { data: order, error } = await sb.from('orders')
        .update({ estado: 'cancelado', pago_estado: 'declinado' })
        .eq('id', order_id)
        .select('numero_orden, cliente_telefono, cliente_email')
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Notificar al cliente (WhatsApp + email) — server-side para no depender del frontend.
      // Falla silenciosa: si notify no responde no bloqueamos la cancelación.
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
      fetch(`${base}/api/notify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, evento: 'estado_cambio', nuevo_estado: 'cancelado' }),
      }).catch(err => console.error('[admin/pedidos cancelar] notify falló:', err))

      return NextResponse.json({ ok: true, order })
    }

    if (accion === 'eliminar') {
      // Elimina items primero (FK), luego la orden. Solo para limpieza de pruebas.
      await sb.from('order_items').delete().eq('order_id', order_id)
      await sb.from('venta_whatsapp_links').update({ order_id: null }).eq('order_id', order_id)
      const { error } = await sb.from('orders').delete().eq('id', order_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  } catch (err: any) {
    console.error('[admin/pedidos]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
