// ============================================================
// ContactGo — Gestión de plantillas de WhatsApp (Meta Graph API)
// POST /api/admin/whatsapp-templates  { accion: 'crear', ...datos }
// POST /api/admin/whatsapp-templates  { accion: 'listar' }
// Usa WHATSAPP_TOKEN + WHATSAPP_BUSINESS_ID ya configurados en el servidor.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'

const GRAPH_URL = 'https://graph.facebook.com/v21.0'

export async function POST(req: NextRequest) {
  const token = process.env.WHATSAPP_TOKEN
  const wabaId = process.env.WHATSAPP_BUSINESS_ID
  if (!token || !wabaId) {
    return NextResponse.json({ error: 'faltan_credenciales' }, { status: 500 })
  }

  const body = await req.json()

  if (body.accion === 'diagnosticar') {
    const results: any = {}

    // 1. ¿El token es válido en general? ¿Qué permisos tiene?
    const debugRes = await fetch(
      `${GRAPH_URL}/debug_token?input_token=${token}&access_token=${token}`
    )
    results.debug_token = await debugRes.json()

    // 2. ¿El Phone Number ID configurado responde? ¿Cuál es su WABA real?
    const phoneId = process.env.WHATSAPP_PHONE_ID
    if (phoneId) {
      const phoneRes = await fetch(
        `${GRAPH_URL}/${phoneId}?fields=whatsapp_business_account,display_phone_number`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      results.phone_info = await phoneRes.json()
    }

    // 3. ¿El WABA_ID configurado en env responde a algo básico (nombre)?
    const wabaRes = await fetch(`${GRAPH_URL}/${wabaId}?fields=name,id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.waba_configurado = await wabaRes.json()
    results.waba_id_usado = wabaId

    return NextResponse.json(results)
  }

  if (body.accion === 'listar') {
    const res = await fetch(`${GRAPH_URL}/${wabaId}/message_templates?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  }

  if (body.accion === 'crear') {
    const { name, category, language, components } = body
    if (!name || !components) {
      return NextResponse.json({ error: 'faltan_campos' }, { status: 400 })
    }
    const res = await fetch(`${GRAPH_URL}/${wabaId}/message_templates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category: category ?? 'UTILITY',
        language: language ?? 'es',
        components,
      }),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  }

  if (body.accion === 'eliminar') {
    const { name } = body
    if (!name) return NextResponse.json({ error: 'falta_name' }, { status: 400 })
    const res = await fetch(`${GRAPH_URL}/${wabaId}/message_templates?name=${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json({ error: 'accion_no_soportada' }, { status: 400 })
}
