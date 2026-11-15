import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Ruta conservada por compatibilidad, sin procesar ni enviar mensajes en pausa.
export async function GET() {
  return NextResponse.json({ ok: true, paused: true, reason: 'WHATSAPP_AUTOMATIONS_DISABLED' }, { status: 202 })
}
