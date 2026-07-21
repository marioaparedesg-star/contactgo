import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Endpoint server-side para guardar leads de la calculadora de recetas.
// Usa SERVICE_ROLE_KEY (bypassa RLS de forma segura) — el cliente en el
// navegador NUNCA escribe directo a la tabla.
// El WhatsApp de resultado se envía desde /api/calculator-leads/notify
// DESPUÉS del cálculo, con los productos exactos que se muestran en pantalla.

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[calculator-leads/save] Exception:', e)
    return NextResponse.json({ ok: false, reason: 'exception', detail: e.message }, { status: 500 })
  }
}
