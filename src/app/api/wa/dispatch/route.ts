import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  notificarPedidoConfirmado, notificarEstado, notificarEnviado,
  notificarEntregado, notificarCancelado, notificarBienvenida,
  notificarCarritoAbandonado, notificarRenovacion, notificarResena,
} from '@/lib/wa-notifications'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

async function fetchOrder(orderId: string) {
  const sb = getSb()
  const { data: order } = await sb.from('orders').select('*').eq('id', orderId).single()
  if (!order) return null
  const { data: items } = await sb.from('order_items').select('nombre, cantidad').eq('order_id', orderId)
  return { ...order, items: items ?? [] }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, ...data } = body
    let result: any = null

    switch (tipo) {
      case 'pedido_pagado': {
        const order = await fetchOrder(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarPedidoConfirmado(order)
        break
      }
      case 'estado_recibido':
      case 'estado_pago_aprobado':
      case 'estado_confirmado':
      case 'estado_preparando':
      case 'estado_fabricante':
      case 'estado_transito': {
        const order = await fetchOrder(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        const estado = tipo.replace('estado_', '')
        result = await notificarEstado(order, estado)
        break
      }
      case 'estado_enviado': {
        const order = await fetchOrder(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarEnviado(order)
        break
      }
      case 'estado_entregado': {
        const order = await fetchOrder(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarEntregado(order)
        break
      }
      case 'estado_cancelado': {
        const order = await fetchOrder(data.order_id)
        if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
        result = await notificarCancelado(order)
        break
      }
      case 'bienvenida':
        result = await notificarBienvenida(data)
        break
      case 'carrito':
        result = await notificarCarritoAbandonado(data)
        break
      case 'renovacion':
        result = await notificarRenovacion(data)
        break
      case 'resena':
        result = await notificarResena(data)
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
