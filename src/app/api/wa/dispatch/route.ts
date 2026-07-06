// ============================================================
// ContactGo — POST /api/wa/dispatch
// Endpoint central para disparar cualquier notificación
// Usado por: notify, checkout, cuenta, etc.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  notificarBienvenida,
  notificarPedidoConfirmado,
  notificarConfirmado,
  notificarPreparando,
  notificarEnviado,
  notificarEntregado,
  notificarCancelado,
  notificarPedidoEspecial,
  notificarResetPassword,
  notificarCambioDireccion,
  notificarCambioTelefono,
  notificarCambioCorreo,
  notificarRecetaGuardada,
  notificarCumpleanos,
} from '@/lib/wa-notifications'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function fetchOrderCompleto(orderId: string) {
  const sb = getSb()
  const { data: order } = await sb
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  if (!order) return null
  const { data: items } = await sb
    .from('order_items')
    .select('nombre, cantidad')
    .eq('order_id', orderId)
  return { ...order, items: items ?? [] }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, ...data } = body

    let result: any = null

    switch (tipo) {
      // ─── Pedidos ───
      case 'pedido_pagado': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarPedidoConfirmado(order)
        break
      }
      case 'estado_confirmado': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarConfirmado(order)
        break
      }
      case 'estado_preparando': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarPreparando(order)
        break
      }
      case 'estado_enviado': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarEnviado(order)
        break
      }
      case 'estado_entregado': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarEntregado(order)
        break
      }
      case 'estado_cancelado': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarCancelado(order)
        break
      }
      case 'pedido_especial': {
        const order = await fetchOrderCompleto(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarPedidoEspecial(order, data.dias ?? 15)
        break
      }
      
      // ─── Usuario ───
      case 'bienvenida':
        result = await notificarBienvenida(data)
        break
      case 'reset_password':
        result = await notificarResetPassword(data)
        break
      case 'cambio_direccion':
        result = await notificarCambioDireccion(data)
        break
      case 'cambio_telefono':
        result = await notificarCambioTelefono(data)
        break
      case 'cambio_email':
        result = await notificarCambioCorreo(data)
        break
      case 'receta_guardada':
        result = await notificarRecetaGuardada(data)
        break
      case 'cumpleanos':
        result = await notificarCumpleanos(data)
        break
      
      default:
        return NextResponse.json({ error: 'tipo_no_soportado', tipo }, { status: 400 })
    }

    return NextResponse.json({ ok: true, tipo, result })
  } catch (err: any) {
    console.error('[wa/dispatch]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
