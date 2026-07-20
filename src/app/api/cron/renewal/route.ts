import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PHONE_NUMBER_ID = '1237770472751989'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: Request) {
  // Verificar que es Vercel Cron (header x-vercel-cron) o nuestro secret
  const authHeader = req.headers.get('authorization')
  const isCron = req.headers.get('x-vercel-cron') === '1'
  if (!isCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.WHATSAPP_TOKEN
  if (!token) return NextResponse.json({ error: 'No WHATSAPP_TOKEN' }, { status: 500 })

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Buscar clientes cuya reposición venció (25 días después de la compra)
  // y que NO han recibido un mensaje de renovación en los últimos 20 días
  const { data: candidates, error } = await supabase.rpc('get_renewal_candidates')

  // Si no hay función RPC, usar query directa
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      cliente_nombre, cliente_telefono,
      order_items!inner(nombre, product_id, products!inner(tipo, reemplazo))
    `)
    .eq('pago_estado', 'pagado')
    .not('cliente_telefono', 'is', null)
    .lt('created_at', new Date(Date.now() - 25 * 86400000).toISOString())

  if (!orders?.length) {
    return NextResponse.json({ message: 'No renewal candidates today', sent: 0 })
  }

  // Deduplicar por teléfono (un mensaje por cliente)
  const seen = new Set<string>()
  const toSend: { name: string; phone: string; product: string }[] = []

  for (const o of orders) {
    const phone = o.cliente_telefono
    if (seen.has(phone)) continue
    seen.add(phone)

    const item = (o as any).order_items?.[0]
    if (!item?.products?.tipo) continue
    if (!['esferico', 'torico', 'multifocal', 'color'].includes(item.products.tipo)) continue

    toSend.push({
      name: o.cliente_nombre?.split(' ')[0] || 'Cliente',
      phone,
      product: `tus lentes ${item.nombre}`,
    })
  }

  const results = []
  for (const c of toSend) {
    let phone = c.phone.replace(/[^0-9+]/g, '').replace(/^\+/, '')
    if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: 'renovacion_lentes',
            language: { code: 'es' },
            components: [{
              type: 'body',
              parameters: [
                { type: 'text', text: c.name },
                { type: 'text', text: c.product },
              ]
            }]
          }
        }),
      })
      const data = await res.json()
      results.push({ name: c.name, success: !!data.messages?.[0]?.id })
    } catch (e) {
      results.push({ name: c.name, success: false })
    }

    await new Promise(r => setTimeout(r, 2000))
  }

  return NextResponse.json({
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    details: results,
  })
}
