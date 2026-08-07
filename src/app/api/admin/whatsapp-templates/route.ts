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
  const wabaId = process.env.WHATSAPP_BUSINESS_ID ?? '998977189800215'
  if (!token || !wabaId) {
    return NextResponse.json({ error: 'faltan_credenciales' }, { status: 500 })
  }

  const body = await req.json()

  if (body.accion === 'diagnosticar') {
    const results: any = {}
    const phoneId = process.env.WHATSAPP_PHONE_ID

    // 1. Info básica del Phone Number ID que SÍ funciona para enviar mensajes
    if (phoneId) {
      const phoneRes = await fetch(
        `${GRAPH_URL}/${phoneId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      results.phone_info_basico = await phoneRes.json()
    }

    // 2. Info de la app
    const appId = process.env.WHATSAPP_APP_ID ?? '988873594144729'
    const appRes = await fetch(`${GRAPH_URL}/${appId}?fields=name,id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.app_info = await appRes.json()

    // Vía directa: la app suele exponer su WABA conectada
    const appWabaRes = await fetch(`${GRAPH_URL}/${appId}?fields=whatsapp_business_account{id,name}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.app_whatsapp_business_account = await appWabaRes.json()

    // Vía system user: assets asignados directamente
    const suId = '122112535653316119'
    const suRes = await fetch(`${GRAPH_URL}/${suId}/assigned_business_asset_groups`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.system_user_assets = await suRes.json()

    // 3. Negocios a los que tiene acceso este system user
    const bizRes = await fetch(`${GRAPH_URL}/me/businesses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.negocios_accesibles = await bizRes.json()

    // 4. Intentar listar WABAs owned por cada negocio encontrado
    if (results.negocios_accesibles?.data?.length) {
      results.wabas_por_negocio = {}
      for (const b of results.negocios_accesibles.data) {
        const wRes = await fetch(
          `${GRAPH_URL}/${b.id}/owned_whatsapp_business_accounts`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        results.wabas_por_negocio[b.id] = await wRes.json()
      }
    }

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
