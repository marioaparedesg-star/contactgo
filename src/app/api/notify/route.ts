import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { enviarNotificacionPedido } from '@/lib/email/order-notifications'

export async function POST(req: NextRequest) {
  // Endpoint de compatibilidad HTTP. El panel administrativo invoca el
  // servicio interno directamente y no pasa por una petición HTTP pública.
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return guardErr

  try {
    const { order_id, evento = 'nuevo_pedido', nuevo_estado } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })
    if (!['nuevo_pedido', 'estado_cambio', 'pago_aprobado'].includes(evento)) {
      return NextResponse.json({ error: 'Evento no permitido' }, { status: 400 })
    }

    const result = await enviarNotificacionPedido(order_id, evento, nuevo_estado)
    const failed = result.email_cliente === 'error' || result.email_admin === 'error'
    return NextResponse.json({ ok: !failed, ...result }, { status: failed ? 502 : 200 })
  } catch (error: any) {
    console.error('[notify]', error)
    return NextResponse.json({ error: error?.message ?? 'Error de notificación' }, { status: 500 })
  }
}
