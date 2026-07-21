import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Endpoint server-side para guardar leads de la calculadora de recetas.
// Usa SERVICE_ROLE_KEY (bypassa RLS de forma segura) — el cliente en el
// navegador NUNCA escribe directo a la tabla.
//
// Tras guardar, envía INMEDIATAMENTE un WhatsApp al lead con:
// - Su receta calculada
// - Productos sugeridos CON PRECIO (según el tipo de receta)
// - Link al WhatsApp de servicio (809-694-2268) para hacer el pedido
// Usa la plantilla aprobada `cg_receta_calculadora` del Cloud API.

const WA_PHONE_ID = '1237770472751989'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function fmtSph(v: number | null | undefined): string {
  if (v == null) return 'Plano'
  const n = Number(v)
  return (n > 0 ? '+' : '') + n.toFixed(2)
}

function buildRecetaText(b: any): string {
  // Una sola línea (los parámetros de plantilla no permiten saltos de línea)
  let od = `OD ${fmtSph(b.od_sph)}`
  if (b.od_cyl) od += ` CYL ${Number(b.od_cyl).toFixed(2)} EJE ${b.od_axis}°`
  let oi = `OI ${fmtSph(b.oi_sph)}`
  if (b.oi_cyl) oi += ` CYL ${Number(b.oi_cyl).toFixed(2)} EJE ${b.oi_axis}°`
  const cond = Array.isArray(b.condiciones) && b.condiciones.length
    ? ` (${b.condiciones.join(', ')})` : ''
  return `${od} · ${oi}${cond}`
}

async function getSuggestedProducts(sb: any, body: any): Promise<string> {
  // Determinar tipo de lente necesario según la receta
  const maxAbsSph = Math.max(Math.abs(body.od_sph ?? 0), Math.abs(body.oi_sph ?? 0))
  const hasCyl = !!(body.od_cyl || body.oi_cyl)
  const tipo = body.tipo_receta === 'multifocal' ? 'multifocal'
    : hasCyl ? 'torico'
    : 'esferico'

  const { data: prods } = await sb
    .from('products')
    .select('nombre, precio, sph_min, sph_max')
    .eq('activo', true)
    .eq('tipo', tipo)
    .lte('sph_min', -maxAbsSph < 0 ? -maxAbsSph : 0)
    .order('precio', { ascending: true })
    .limit(6)

  if (!prods?.length) return 'Escríbenos y te recomendamos el ideal para tu receta'

  // Filtrar los que realmente cubren la graduación y tomar 3:
  // el más económico, uno medio y uno premium
  const compatible = prods.filter((p: any) =>
    Number(p.sph_min) <= Math.min(body.od_sph ?? 0, body.oi_sph ?? 0) &&
    Number(p.sph_max) >= Math.max(body.od_sph ?? 0, body.oi_sph ?? 0)
  )
  const list = (compatible.length ? compatible : prods)
  const picks = list.length <= 3 ? list : [list[0], list[Math.floor(list.length / 2)], list[list.length - 1]]

  return picks
    .map((p: any) => `${p.nombre} RD$${Number(p.precio).toLocaleString()}`)
    .join(' · ')
}

async function sendRecetaWhatsApp(body: any, sb: any) {
  const token = process.env.WHATSAPP_TOKEN
  if (!token || !body.telefono) return

  let phone = String(body.telefono).replace(/\D/g, '')
  if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

  const nombre = (body.nombre || 'Cliente').split(' ')[0]
  const receta = buildRecetaText(body)
  const productos = await getSuggestedProducts(sb, body)

  const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'cg_receta_calculadora',
        language: { code: 'es' },
        components: [{
          type: 'body',
          parameters: [
            { type: 'text', text: nombre },
            { type: 'text', text: receta },
            { type: 'text', text: productos },
          ]
        }]
      }
    }),
  })
  const data = await res.json()
  if (data.error) {
    console.error('[calculator-leads] WhatsApp error:', JSON.stringify(data.error))
  } else {
    console.log('[calculator-leads] WhatsApp enviado a', phone, '- id:', data.messages?.[0]?.id)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, od_sph, od_cyl, od_axis, oi_sph, oi_cyl, oi_axis, tipo_receta, complejidad, condiciones } = body

    const sb = getSb()
    const payload = {
      nombre: nombre ?? null,
      email: email ? email.toLowerCase().trim() : null,
      telefono: telefono ?? null,
      od_sph, od_cyl, od_axis, oi_sph, oi_cyl, oi_axis,
      tipo_receta, complejidad, condiciones,
    }

    const { error } = email
      ? await sb.from('calculator_leads').upsert(payload, { onConflict: 'email' })
      : await sb.from('calculator_leads').insert(payload)

    if (error) {
      console.error('[calculator-leads/save] Error:', error)
      return NextResponse.json({ ok: false, reason: 'db_error', detail: error.message }, { status: 500 })
    }

    // Enviar WhatsApp INMEDIATO con receta + productos + precios.
    // Con await para que Vercel no mate la función antes de completar el envío.
    if (telefono) {
      try {
        await sendRecetaWhatsApp(body, sb)
      } catch (waErr: any) {
        // El lead ya se guardó — un fallo del WhatsApp no rompe el flujo
        console.error('[calculator-leads] WhatsApp exception:', waErr.message)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[calculator-leads/save] Exception:', e)
    return NextResponse.json({ ok: false, reason: 'exception', detail: e.message }, { status: 500 })
  }
}
