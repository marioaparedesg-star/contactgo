import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const today = new Date().toISOString().split('T')[0]

  const { data: reminders } = await sb
    .from('reminders')
    .select('*, profiles(nombre, email)')
    .eq('tipo', 'recompra')
    .eq('enviado', false)
    .lte('fecha_recordatorio', today)

  if (!reminders?.length) return new Response('No reminders today', { status: 200 })

  let sent = 0
  for (const r of reminders) {
    const nombre = r.profiles?.nombre?.split(' ')[0] || 'Cliente'
    const email = r.profiles?.email
    if (!email) continue

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ContactGo <notificaciones@contactgo.net>',
        to: [email],
        subject: `${nombre}, ya se te acabaron tus lentes? 👁️`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
            <h2 style="color:#0f766e">Hola ${nombre}</h2>
            <p style="color:#374151;font-size:16px">Han pasado 25 dias desde tu ultimo pedido de lentes de contacto.</p>
            <p style="color:#374151;font-size:16px">Haz tu reorden antes de quedarte sin lentes.</p>
            <a href="https://contactgo.net/cuenta"
               style="display:inline-block;background:#0f766e;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;margin:16px 0">
              Reordenar mis lentes
            </a>
          </div>
        `,
      }),
    })

    if (res.ok) {
      await sb.from('reminders').update({ enviado: true }).eq('id', r.id)
      sent++
    }
  }

  return new Response(`Sent ${sent} reminders`, { status: 200 })
})
