// API: Guardar aceptación de disclaimer médico/legal
// POST /api/disclaimer
// { user_id?, order_id?, version, tipo, user_agent, items_snapshot, accepted_at }
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, order_id, version, tipo, user_agent, items_snapshot, accepted_at } = body

    // Obtener IP del cliente
    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const { data, error } = await sb.from('disclaimer_acceptances').insert({
      user_id:        user_id || null,
      order_id:       order_id || null,
      version:        version || '1.0',
      tipo:           tipo || 'compra',
      ip_address,
      user_agent:     user_agent || '',
      items_snapshot: items_snapshot || [],
      accepted_at:    accepted_at || new Date().toISOString(),
    }).select('id').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, disclaimer_id: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
