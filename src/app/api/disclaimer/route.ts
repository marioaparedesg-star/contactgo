import { guardRequest } from '@/lib/api-guard'
// API: Guardar aceptación de disclaimer médico/legal
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 5 })
  if (guardErr) return guardErr
  try {
    const body = await req.json()
    const { user_id, order_id, version, tipo, user_agent, items_snapshot, accepted_at } = body

    // Validación mínima — al menos version y tipo son obligatorios
    if (!version || !tipo) {
      return NextResponse.json({ error: 'Faltan campos requeridos: version, tipo' }, { status: 400 })
    }

    // Si hay order_id, validar que existe
    if (order_id) {
      const { data: order, error: orderErr } = await getSb()
        .from('orders')
        .select('id')
        .eq('id', order_id)
        .single()
      if (orderErr || !order) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
      }
    }

    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const { data, error } = await getSb()
      .from('disclaimer_acceptances')
      .insert({
        user_id: user_id || null,
        order_id: order_id || null,
        version,
        tipo,
        ip_address,
        user_agent: user_agent || req.headers.get('user-agent') || '',
        items_snapshot: items_snapshot || null,
        accepted_at: accepted_at || new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[disclaimer]', error)
      return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, disclaimer_id: data.id })
  } catch (err) {
    console.error('[disclaimer] parse error', err)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
