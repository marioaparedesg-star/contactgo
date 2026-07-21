import { NextRequest, NextResponse } from 'next/server'

// Envía el WhatsApp de resultado de la calculadora usando LOS MISMOS
// productos y precios que la persona vio en pantalla (el frontend los
// pasa tras el cálculo). Así el mensaje y la web nunca se contradicen.
//
// Plantillas v2 (formato en bloques, fácil de leer en móvil):
//   cg_receta_v2        → 6 params: nombre, ojos, condiciones, eco, rec, prem
//   cg_receta_v2_unica  → 4 params: nombre, ojos, condiciones, producto

const WA_PHONE_ID = '1237770472751989'

function fmtSph(v: number | null | undefined): string {
  if (v == null || Number(v) === 0) return 'Plano'
  const n = Number(v)
  return (n > 0 ? '+' : '') + n.toFixed(2)
}

/** Una línea por ojo — mucho más legible que todo junto */
function buildOjos(b: any): string {
  const linea = (label: string, sph: any, cyl: any, axis: any) => {
    let s = `👁️ ${label}: ${fmtSph(sph)}`
    if (cyl) s += `  cil ${Number(cyl).toFixed(2)}  eje ${axis}°`
    return s
  }
  return [
    linea('Derecho', b.od_sph, b.od_cyl, b.od_axis),
    linea('Izquierdo', b.oi_sph, b.oi_cyl, b.oi_axis),
  ].join('\n')
}

/** Condiciones separadas con · en vez de comas y paréntesis */
function buildCondiciones(condiciones: any): string {
  if (!Array.isArray(condiciones) || !condiciones.length) return 'Visión simple'
  return condiciones.join(' · ')
}

/** Nombre en una línea, precio en otra — evita cortes feos */
function fmtProducto(p: any): string {
  const nombre = String(p.nombre).replace(/[®™]/g, '').trim()
  return `${nombre}\n💰 RD$${Number(p.precio).toLocaleString()}`
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.WHATSAPP_TOKEN
    if (!token) return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 500 })

    const b = await req.json()
    const { nombre, telefono, condiciones, productos } = b

    if (!telefono) return NextResponse.json({ ok: false, reason: 'no_phone' }, { status: 400 })
    if (!Array.isArray(productos) || !productos.length) {
      return NextResponse.json({ ok: false, reason: 'no_products' }, { status: 400 })
    }

    // Teléfono a formato internacional
    let phone = String(telefono).replace(/\D/g, '')
    if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

    const ojos = buildOjos(b)
    const cond = buildCondiciones(condiciones)

    // Deduplicar: el motor repite productos cuando solo hay 1-2 compatibles
    const seen = new Set<string>()
    const unique = productos.filter((p: any) => {
      if (seen.has(p.nombre)) return false
      seen.add(p.nombre); return true
    })

    // 1 producto → plantilla única (sin renglones de relleno)
    // 2+ → plantilla de 3 tiers
    let templateName: string
    let productParams: { type: string; text: string }[]
    if (unique.length === 1) {
      templateName = 'cg_receta_v2_unica'
      productParams = [{ type: 'text', text: fmtProducto(unique[0]) }]
    } else {
      templateName = 'cg_receta_v2'
      productParams = [
        { type: 'text', text: fmtProducto(unique[0]) },
        { type: 'text', text: fmtProducto(unique[1] ?? unique[0]) },
        { type: 'text', text: fmtProducto(unique[2] ?? unique[unique.length - 1]) },
      ]
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'es' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: (nombre || 'Cliente').split(' ')[0] },
              { type: 'text', text: ojos },
              { type: 'text', text: cond },
              ...productParams,
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
