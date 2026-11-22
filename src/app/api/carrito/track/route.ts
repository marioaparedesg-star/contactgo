import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePhone } from '@/lib/whatsapp'
import { guardRequest } from '@/lib/api-guard'

export const dynamic = 'force-dynamic'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function validEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 20, requireOrigin: true })
  if (guardErr) return guardErr

  try {
    const body = await req.json()
    const telefono = typeof body.telefono === 'string' ? body.telefono : ''
    const email = validEmail(body.email) ? body.email.trim().toLowerCase() : ''
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 160) : null
    const itemsInput = Array.isArray(body.items) ? body.items : []
    const items = itemsInput.slice(0, 30).map((item: any) => ({
      id: typeof item?.id === 'string' ? item.id.slice(0, 100) : null,
      nombre: typeof item?.nombre === 'string' ? item.nombre.slice(0, 180) : 'Producto',
      cantidad: Math.max(1, Math.min(99, Number(item?.cantidad) || 1)),
      precio: Math.max(0, Number(item?.precio) || 0),
    }))

    if (!email || !items.length) {
      return NextResponse.json({ ok: true, skipped: 'missing email or items' })
    }

    const phone = telefono ? normalizePhone(telefono) : ''
    const sb = getSb()
    const now = new Date().toISOString()
    const payload = {
      cliente_email: email,
      cliente_nombre: nombre,
      cliente_telefono: phone.length >= 10 ? phone : null,
      items,
      total: Math.max(0, Number(body.total) || 0),
      recuperado: false,
      email_sent: false,
      email_reminder_1_sent_at: null,
      email_reminder_2_sent_at: null,
      email_attempts: 0,
      email_last_error: null,
      email_lock_until: null,
      email_lock_step: null,
      updated_at: now,
    }

    const { error } = await sb.from('abandoned_carts')
      .upsert(payload, { onConflict: 'cliente_email' })

    if (error) {
      console.error('[carrito/track] No se pudo guardar el carrito:', error.message)
      return NextResponse.json({ ok: false, error: 'No se pudo registrar el carrito' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, action: 'saved' })
  } catch (err: any) {
    console.error('[carrito/track]', err?.message ?? err)
    return NextResponse.json({ ok: false, error: 'Error al registrar el carrito' }, { status: 500 })
  }
}

// No se marca un carrito como recuperado al crear una orden pendiente.
// La conversión solo se confirma cuando existe un pedido con pago_estado='pagado'.
export async function PATCH() {
  return NextResponse.json({ ok: true, ignored: 'conversion requires confirmed payment' })
}
