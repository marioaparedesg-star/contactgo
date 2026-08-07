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
