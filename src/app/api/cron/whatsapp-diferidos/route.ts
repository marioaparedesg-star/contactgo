// Procesa los mensajes a clientes que quedaron encolados fuera de horario.
// Solo envía dentro de la ventana (lun–sáb 9:00–18:00 RD) y solo si la pausa está apagada.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enVentanaWhatsApp } from '@/lib/whatsapp-horario'

export const dynamic = 'force-dynamic'

const WA_API = 'https://graph.facebook.com/v21.0'
const MAX_POR_CORRIDA = 50

export async function GET(req: NextRequest) {
  // Sin CRON_SECRET configurado no se procesa nada (falla cerrado)
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!enVentanaWhatsApp()) {
    return NextResponse.json({ ok: true, skipped: 'fuera_de_horario' })
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: flag } = await sb.from('configuracion_sistema').select('valor')
    .eq('clave', 'whatsapp_clientes_pausado').single()
  if (flag?.valor !== 'false') {
    return NextResponse.json({ ok: true, skipped: 'pausado' }) // falla cerrado
  }

  const ahora = new Date().toISOString()
  const { data: filas, error } = await sb.from('wa_retry_queue').select('*')
    .eq('tipo', 'raw').eq('resolved', false).lte('next_retry_at', ahora)
    .order('created_at', { ascending: true }).limit(MAX_POR_CORRIDA)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  let enviados = 0, fallidos = 0
  for (const f of filas ?? []) {
    try {
      const res = await fetch(`${WA_API}/${phoneId}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: f.mensaje, // ya es el cuerpo JSON completo generado por enviarWA
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(JSON.stringify(data.error ?? data))
      await sb.from('wa_retry_queue').update({ resolved: true, last_error: null }).eq('id', f.id)
      enviados++
    } catch (e: any) {
      fallidos++
      const intentos = (f.attempt ?? 0) + 1
      const agotado = intentos >= (f.max_attempts ?? 5)
      await sb.from('wa_retry_queue').update({
        attempt: intentos,
        last_error: String(e.message).slice(0, 300),
        resolved: agotado,
        next_retry_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }).eq('id', f.id)
    }
  }
  return NextResponse.json({ ok: true, procesados: (filas ?? []).length, enviados, fallidos })
}
