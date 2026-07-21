import { NextRequest, NextResponse } from 'next/server'

// Envía el WhatsApp de resultado de la calculadora usando LOS MISMOS
// productos y precios que la persona vio en pantalla (el frontend los
// pasa tras el cálculo). Así el mensaje y la web nunca se contradicen.
//
// Plantilla: cg_receta_lista (UTILITY) — 5 parámetros:
// {{1}} nombre · {{2}} receta · {{3}} económico · {{4}} recomendado · {{5}} premium

const WA_PHONE_ID = '1237770472751989'

function fmtSph(v: number | null | undefined): string {
  if (v == null || Number(v) === 0) return 'Plano'
  const n = Number(v)
  return (n > 0 ? '+' : '') + n.toFixed(2)
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.WHATSAPP_TOKEN
    if (!token) return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 500 })

    const b = await req.json()
    const { nombre, telefono, od_sph, od_cyl, od_axis, oi_sph, oi_cyl, oi_axis, condiciones, productos } = b

    if (!telefono) return NextResponse.json({ ok: false, reason: 'no_phone' }, { status: 400 })
    if (!Array.isArray(productos) || !productos.length) {
      return NextResponse.json({ ok: false, reason: 'no_products' }, { status: 400 })
    }

    // Teléfono a formato internacional
    let phone = String(telefono).replace(/\D/g, '')
    if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

    // Receta en una línea (parámetros de plantilla no permiten saltos de línea)
    let od = `OD ${fmtSph(od_sph)}`
    if (od_cyl) od += ` CYL ${Number(od_cyl).toFixed(2)} EJE ${od_axis}°`
    let oi = `OI ${fmtSph(oi_sph)}`
    if (oi_cyl) oi += ` CYL ${Number(oi_cyl).toFixed(2)} EJE ${oi_axis}°`
    const cond = Array.isArray(condiciones) && condiciones.length ? ` (${condiciones.join(', ')})` : ''
    const receta = `${od} · ${oi}${cond}`

    // Los 3 tiers vienen en orden [económico, recomendado, premium] del
    // motor de recomendación. Deduplicar por si el motor repitió productos
    // (pasa cuando solo hay 1-2 compatibles con la graduación).
    const fmt = (p: any) => `${p.nombre} — RD$${Number(p.precio).toLocaleString()}`
    const seen = new Set<string>()
    const unique = productos.filter((p: any) => {
      const k = p.nombre
      if (seen.has(k)) return false
      seen.add(k); return true
    })
    const eco  = fmt(unique[0])
    const rec  = unique[1] ? fmt(unique[1]) : 'Pregúntanos por más opciones 😊'
    const prem = unique[2] ? fmt(unique[2]) : 'Pregúntanos por más opciones 😊'

    const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: 'cg_receta_lista',
          language: { code: 'es' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: (nombre || 'Cliente').split(' ')[0] },
              { type: 'text', text: receta },
              { type: 'text', text: eco },
              { type: 'text', text: rec },
              { type: 'text', text: prem },
            ]
          }]
        }
      }),
    })
    const data = await res.json()
    if (data.error) {
      console.error('[calculator-leads/notify] WA error:', JSON.stringify(data.error))
      return NextResponse.json({ ok: false, reason: 'wa_error', detail: data.error }, { status: 502 })
    }
    return NextResponse.json({ ok: true, message_id: data.messages?.[0]?.id })
  } catch (e: any) {
    console.error('[calculator-leads/notify] Exception:', e)
    return NextResponse.json({ ok: false, reason: 'exception' }, { status: 500 })
  }
}
