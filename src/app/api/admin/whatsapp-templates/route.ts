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
  if (!token) {
    return NextResponse.json({ error: 'faltan_credenciales' }, { status: 500 })
  }

  const body = await req.json()
  const wabaId = body.waba_id ?? process.env.WHATSAPP_BUSINESS_ID ?? '998977189800215'

  if (body.accion === 'enviar_prueba') {
    // Solo para pruebas dirigidas por Mario — envía UNA plantilla a UN
    // número específico, nunca a clientes reales. El número y los
    // parámetros los decide quien llama, siempre de forma explícita.
    const r = await fetch(`${GRAPH_URL}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: body.telefono,
        type: 'template',
        template: {
          name: body.template,
          language: { code: 'es' },
          components: [{ type: 'body', parameters: (body.parametros ?? []).map((t: string) => ({ type: 'text', text: t })) }],
        },
      }),
    })
    const data = await r.json()
    return NextResponse.json(data)
  }

  if (body.accion === 'diagnosticar_numero_nuevo') {
    const results: any = {}
    const phoneId = body.phone_id ?? '1174240852444859'
    const possibleWaba = body.waba_id ?? '1544493937232309'

    // 1. Info básica del Phone Number ID nuevo (809-694-2268)
    const phoneRes = await fetch(`${GRAPH_URL}/${phoneId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.phone_info = await phoneRes.json()

    // 2. ¿El WABA (asset_id de la URL de Mario) responde con este token?
    const wabaRes = await fetch(`${GRAPH_URL}/${possibleWaba}?fields=id,name`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.waba_info = await wabaRes.json()

    // 3. Plantillas ya existentes bajo ese WABA (el "robot" puede estar usando alguna)
    const tplRes = await fetch(`${GRAPH_URL}/${possibleWaba}/message_templates?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    results.plantillas = await tplRes.json()

    // 4. Confirmar qué WABA es dueño real de este Phone Number (vía el propio phone_info si trae el campo)
    return NextResponse.json(results)
  }

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
