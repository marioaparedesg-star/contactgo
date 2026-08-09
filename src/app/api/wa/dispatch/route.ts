import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'
import {
  notificarPedidoConfirmado, notificarEstado, notificarEnviado,
  notificarEntregado, notificarCancelado, notificarBienvenida,
  notificarCarritoAbandonado, notificarRenovacion, notificarResena,
  notificarRecompraPrevio,
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
  // FIX CRÍTICO AUDITORÍA (2026-08-09): este endpoint no tenía NINGUNA
  // verificación — cualquiera en internet que conociera la URL podía
  // enviar un WhatsApp real desde la cuenta de negocio de ContactGo a
  // CUALQUIER número del mundo (spam, contenido inapropiado que parece
  // venir de ContactGo, riesgo de que Meta baje la calificación de calidad
  // del número o lo bloquee). Único uso legítimo confirmado en todo el
  // código: admin/pedidos/page.tsx, que ya requiere sesión de admin para
  // cargar. Se agrega requireAdmin() — no rompe ese uso porque quien
  // llama ya tiene sesión válida cuando usa el panel.
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

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
      // Solo para pruebas manuales — el envío real automático de estos vive
      // en el cron wa-daily, detrás del interruptor RECOMPRA_AVISOS_PREVIOS_ACTIVO.
      case 'recompra_7d':
        result = await notificarRecompraPrevio(7, data)
        break
      case 'recompra_3d':
        result = await notificarRecompraPrevio(3, data)
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
