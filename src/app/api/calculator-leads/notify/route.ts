import { NextRequest, NextResponse } from 'next/server'

// Envía el WhatsApp de resultado de la calculadora con LOS MISMOS productos
// y precios que la persona vio en pantalla.
//
// IMPORTANTE: Meta rechaza parámetros con saltos de línea, tabs o más de 4
// espacios seguidos (error 132018). Por eso cada dato va en su propio
// parámetro y los saltos de línea viven en el cuerpo de la plantilla.
//
//   cg_receta_v3        → 10 params: nombre, OD, OI, cond, y 3× (producto, precio)
//   cg_receta_v3_unica  →  6 params: nombre, OD, OI, cond, producto, precio

const WA_PHONE_ID = '1237770472751989'

/** Limpia texto para que Meta lo acepte como parámetro de plantilla */
function safeParam(s: string): string {
  return String(s)
    .replace(/[\r\n\t]+/g, ' ')   // sin saltos de línea ni tabs
    .replace(/\s{2,}/g, ' ')      // sin espacios múltiples
    .trim()
}

function fmtSph(v: number | null | undefined): string {
  if (v == null || Number(v) === 0) return 'Plano'
  const n = Number(v)
  return (n > 0 ? '+' : '') + n.toFixed(2)
}

/** Un ojo en una sola línea: "-11.75 cil -2.25 eje 20°" */
function fmtOjo(sph: any, cyl: any, axis: any): string {
  let s = fmtSph(sph)
  if (cyl) s += ` cil ${Number(cyl).toFixed(2)} eje ${axis}°`
  return safeParam(s)
}

function fmtNombre(p: any): string {
  return safeParam(String(p.nombre).replace(/[®™]/g, ''))
}

function fmtPrecio(p: any): string {
  return safeParam(Number(p.precio).toLocaleString('en-US'))
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

    let phone = String(telefono).replace(/\D/g, '')
    if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

    const od = fmtOjo(b.od_sph, b.od_cyl, b.od_axis)
    const oi = fmtOjo(b.oi_sph, b.oi_cyl, b.oi_axis)
    const cond = Array.isArray(condiciones) && condiciones.length
      ? safeParam(condiciones.join(' · '))
      : 'Visión simple'

    // Deduplicar: el motor repite productos cuando solo hay 1-2 compatibles
    const seen = new Set<string>()
    const unique = productos.filter((p: any) => {
      if (seen.has(p.nombre)) return false
      seen.add(p.nombre); return true
    })

    let templateName: string
    let productParams: { type: string; text: string }[]
    if (unique.length === 1) {
      templateName = 'cg_receta_v3_unica'
      productParams = [
        { type: 'text', text: fmtNombre(unique[0]) },
        { type: 'text', text: fmtPrecio(unique[0]) },
      ]
    } else {
      templateName = 'cg_receta_v3'
      const eco = unique[0]
      const rec = unique[1] ?? unique[0]
      const prem = unique[2] ?? unique[unique.length - 1]
      productParams = [
        { type: 'text', text: fmtNombre(eco) },  { type: 'text', text: fmtPrecio(eco) },
        { type: 'text', text: fmtNombre(rec) },  { type: 'text', text: fmtPrecio(rec) },
        { type: 'text', text: fmtNombre(prem) }, { type: 'text', text: fmtPrecio(prem) },
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
              { type: 'text', text: safeParam((nombre || 'Cliente').split(' ')[0]) },
              { type: 'text', text: od },
              { type: 'text', text: oi },
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
      return NextResponse.json({ ok: false, reason: 'wa_error', detail: data.error.message }, { status: 200 })
    }
    return NextResponse.json({ ok: true, message_id: data.messages?.[0]?.id })
  } catch (e: any) {
    console.error('[calculator-leads/notify] Exception:', e?.message)
    return NextResponse.json({ ok: false, reason: 'exception', detail: e?.message }, { status: 200 })
  }
}
