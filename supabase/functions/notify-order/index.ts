import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { order_id } = await req.json()
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data: order } = await sb.from('orders').select('*').eq('id', order_id).single()
  const { data: items } = await sb.from('order_items').select('*').eq('order_id', order_id)

  if (!order) return new Response('Order not found', { status: 404 })

  const tienePositivos = (items??[]).some((i: any) => parseFloat(i.sph ?? '0') > 0)
  const tiempoEntrega = tienePositivos ? '24 a 72 horas' : '24 horas'

  const itemsHtml = (items??[]).map((i: any) => {
    const diotria = i.sph ? `SPH: ${parseFloat(i.sph) > 0 ? '+' : ''}${i.sph}${i.cyl ? ` · CYL: ${i.cyl}` : ''}${i.axis ? ` · EJE: ${String(i.axis).padStart(3,'0')}` : ''}${i.add_power ? ` · ADD: ${i.add_power}` : ''}` : 'Sin graduación'
    return `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 8px;font-size:14px;color:#111">${i.nombre}</td>
        <td style="padding:10px 8px;font-size:13px;color:#6b7280">${diotria}</td>
        <td style="padding:10px 8px;text-align:center;font-size:14px">${i.cantidad}</td>
        <td style="padding:10px 8px;text-align:right;font-size:14px;font-weight:bold">RD$${(i.subtotal ?? i.precio * i.cantidad).toLocaleString()}</td>
      </tr>`
  }).join('')

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'ContactGo <notificaciones@contactgo.net>',
      to: ['mparedes@optimax.com.do'],
      subject: `🛒 Nuevo pedido #${order.id.slice(0,8).toUpperCase()} — RD$${order.total?.toLocaleString()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#0f766e">Nuevo pedido recibido</h2>
          <p style="color:#374151">Se ha recibido un nuevo pedido en ContactGo.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f9fafb">
              <td style="padding:8px;font-size:13px;color:#6b7280">Cliente</td>
              <td style="padding:8px;font-size:14px;font-weight:bold">${order.cliente_nombre}</td>
            </tr>
            <tr>
              <td style="padding:8px;font-size:13px;color:#6b7280">Email</td>
              <td style="padding:8px;font-size:14px">${order.cliente_email}</td>
            </tr>
            <tr style="background:#f9fafb">
              <td style="padding:8px;font-size:13px;color:#6b7280">Teléfono</td>
              <td style="padding:8px;font-size:14px">${order.cliente_telefono}</td>
            </tr>
            <tr>
              <td style="padding:8px;font-size:13px;color:#6b7280">Dirección</td>
              <td style="padding:8px;font-size:14px">${order.direccion_texto}</td>
            </tr>
            <tr style="background:#f9fafb">
              <td style="padding:8px;font-size:13px;color:#6b7280">Método de pago</td>
              <td style="padding:8px;font-size:14px">${order.metodo_pago}</td>
            </tr>
            <tr>
              <td style="padding:8px;font-size:13px;color:#6b7280">⏱️ Tiempo entrega</td>
              <td style="padding:8px;font-size:14px;font-weight:bold;color:${tienePositivos?'#d97706':'#16a34a'}">${tiempoEntrega}</td>
            </tr>
          </table>
          <h3 style="color:#111;margin-top:24px">Productos</h3>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f0fdf4;border-bottom:2px solid #bbf7d0">
                <th style="padding:10px 8px;text-align:left;font-size:13px;color:#374151">Producto</th>
                <th style="padding:10px 8px;text-align:left;font-size:13px;color:#374151">Dioptría</th>
                <th style="padding:10px 8px;text-align:center;font-size:13px;color:#374151">Cant.</th>
                <th style="padding:10px 8px;text-align:right;font-size:13px;color:#374151">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align:right;margin-top:16px;padding:16px;background:#f9fafb;border-radius:12px">
            <p style="font-size:18px;font-weight:bold;color:#111">Total: RD$${order.total?.toLocaleString()}</p>
          </div>
          <div style="margin-top:24px;text-align:center">
            <a href="https://contactgo.net/admin/pedidos" style="background:#0f766e;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">
              Ver en Admin →
            </a>
          </div>
        </div>
      `
    })
  })

  return new Response('OK', { status: 200 })
})
