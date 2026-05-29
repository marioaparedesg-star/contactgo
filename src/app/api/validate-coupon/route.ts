// POST /api/validate-coupon
// Validación server-side de cupones — reemplaza lógica hardcodeada en checkout
import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 20 })
  if (guardErr) return guardErr

  try {
    const { codigo, subtotal, email } = await req.json()
    if (!codigo || typeof subtotal !== 'number') {
      return NextResponse.json({ error: 'codigo y subtotal requeridos' }, { status: 400 })
    }

    const { data, error } = await getSb().rpc('validate_coupon', {
      p_codigo:   codigo.trim().toUpperCase(),
      p_subtotal: Number(subtotal),
      p_email:    (email as string | null) ?? null,
    })

    if (error) {
      console.error('[validate-coupon] RPC error:', error)
      return NextResponse.json({ error: 'Error validando cupón', detail: error.message }, { status: 500 })
    }

    const result = Array.isArray(data) ? data[0] : data

    return NextResponse.json({
      valido:    result?.valido    ?? false,
      descuento: result?.descuento ?? 0,
      tipo:      result?.tipo      ?? '',
      mensaje:   result?.mensaje   ?? 'Cupón no válido',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
