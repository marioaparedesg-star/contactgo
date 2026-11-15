import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// La recuperación automática de carritos por WhatsApp queda pausada.
// Se conserva el endpoint para compatibilidad; no modifica carritos ni envía mensajes.
serve(async () => new Response(JSON.stringify({ ok: true, paused: true, reason: 'WHATSAPP_AUTOMATIONS_DISABLED' }), {
  status: 202,
  headers: { 'Content-Type': 'application/json' },
}))
