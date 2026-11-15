import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cron de avisos por WhatsApp desactivado a petición del administrador.
// Se conserva la ruta para evitar 404 en ejecuciones antiguas ya programadas.
export async function GET() {
  return NextResponse.json({ ok: true, paused: true, reason: 'WHATSAPP_AUTOMATIONS_DISABLED' }, { status: 202 })
}
