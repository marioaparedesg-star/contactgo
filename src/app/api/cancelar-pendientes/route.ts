// La cancelación automática por falta de pago fue desactivada por decisión del negocio.
// Los pedidos pendientes permanecen activos hasta que el administrador los actualice.
// Se conserva la ruta para responder de forma segura si algún cron antiguo la invoca.
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    ok: true,
    cancelacion_automatica: false,
    mensaje: 'La cancelación automática de pedidos está desactivada.',
  })
}
