import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { record } = await req.json()
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_AqekKyoh_64vfZkea9Uwqtds4DSYVYrEy',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ContactGo <onboarding@resend.dev>',
        to: ['maparedes0113@gmail.com'],
        subject: `🛒 Nuevo pedido — RD$${record.total?.toLocaleString() ?? '0'}`,
        html: `
          <h2>Nuevo pedido en ContactGo</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #eee"><b>Cliente</b></td><td style="padding:8px;border:1px solid #eee">${record.cliente_nombre ?? '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Teléfono</b></td><td style="padding:8px;border:1px solid #eee">${record.cliente_telefono ?? '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Total</b></td><td style="padding:8px;border:1px solid #eee">RD$${record.total?.toLocaleString() ?? '0'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Pago</b></td><td style="padding:8px;border:1px solid #eee">${record.metodo_pago ?? '—'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee"><b>Dirección</b></td><td style="padding:8px;border:1px solid #eee">${record.direccion ?? '—'}</td></tr>
          </table>
          <br>
          <a href="https://contactgo.net/admin/pedidos" style="background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Ver pedido en admin</a>
        `,
      }),
    })
    const data = await res.json()
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
