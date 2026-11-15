import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Endpoint legacy conservado para no romper llamadas internas existentes.
// Todas las automatizaciones de WhatsApp están pausadas; no se despacha ningún mensaje.
export async function POST() {
  return NextResponse.json({ ok: true, paused: true, reason: 'WHATSAPP_AUTOMATIONS_DISABLED' }, { status: 202 })
}
