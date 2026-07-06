// ============================================================
// ContactGo — POST /api/carrito/track
// Guarda info del carrito cuando el usuario avanza en checkout
// pero no completa el pago. Cron hourly recupera 2h después.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { telefono, nombre, email, items, total } = body
    
    if (!telefono || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: true, skipped: 'no data' })
    }

    const phone = normalizePhone(telefono)
    if (phone.length < 10) return NextResponse.json({ ok: true, skipped: 'invalid phone' })

    const sb = getSb()

    // Buscar si ya existe carrito activo con este teléfono (últimas 24h)
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: existente } = await sb
      .from('carritos_abandonados')
      .select('id')
      .eq('telefono', phone)
      .eq('convertido', false)
      .gt('created_at', hace24h)
      .maybeSingle()

    if (existente) {
      // Actualizar en lugar de crear duplicado
      await sb.from('carritos_abandonados').update({
        nombre, email, items, total,
        updated_at: new Date().toISOString(),
      }).eq('id', existente.id)
      return NextResponse.json({ ok: true, action: 'updated' })
    }

    // Crear nuevo
    await sb.from('carritos_abandonados').insert({
      telefono: phone, nombre, email, items, total,
    })
    return NextResponse.json({ ok: true, action: 'created' })
  } catch (err: any) {
    console.error('[carrito/track]', err.message)
    return NextResponse.json({ ok: true, error: err.message })
  }
}

// Marcar carrito como convertido cuando el pedido se completa
export async function PATCH(req: NextRequest) {
  try {
    const { telefono } = await req.json()
    if (!telefono) return NextResponse.json({ ok: true })
    const phone = normalizePhone(telefono)
    const sb = getSb()
    await sb.from('carritos_abandonados')
      .update({ convertido: true })
      .eq('telefono', phone)
      .eq('convertido', false)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: true, error: err.message })
  }
}
