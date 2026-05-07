import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const treintaMinAtras = new Date(Date.now() - 30 * 60 * 1000).toISOString()

  // Carritos abandonados hace >30 min, sin WhatsApp enviado, sin recuperar
  const { data: carritos } = await sb
    .from('abandoned_carts')
    .select('*')
    .eq('whatsapp_enviado', false)
    .eq('recuperado', false)
    .lt('created_at', treintaMinAtras)
    .limit(20)

  if (!carritos || carritos.length === 0) {
    return new Response(JSON.stringify({ ok: true, enviados: 0 }))
  }

  let enviados = 0

  for (const carrito of carritos) {
    if (!carrito.cliente_telefono) continue

    const tel = carrito.cliente_telefono.replace(/\D/g, '')
    const nombre = carrito.cliente_nombre ?? 'cliente'
    const items = Array.isArray(carrito.items)
      ? carrito.items
      : JSON.parse(carrito.items || '[]')

    const productos = items.slice(0, 2).map((i: any) => i.nombre).join(', ')
    const total = `RD$${Number(carrito.total).toLocaleString()}`

    const mensaje = encodeURIComponent(
      `Hola ${nombre} 👋\n\nNotamos que dejaste estos productos en tu carrito de ContactGo:\n\n🛒 ${productos}\n💰 Total: ${total}\n\n¿Te ayudamos a completar tu pedido? Tu carrito sigue guardado:\n👉 https://contactgo.net/cart\n\n¿Tienes alguna duda sobre la graduación o el producto? Estamos aquí.`
    )

    const waUrl = `https://api.whatsapp.com/send?phone=${tel}&text=${mensaje}`

    // Marcar como enviado en BD
    await sb
      .from('abandoned_carts')
      .update({ whatsapp_enviado: true })
      .eq('id', carrito.id)

    enviados++
    console.log(`WhatsApp enviado a ${tel}: ${waUrl}`)
  }

  return new Response(JSON.stringify({ ok: true, enviados }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
