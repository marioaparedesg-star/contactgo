import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { guardRequest } from '@/lib/api-guard'
import { tieneNombreYApellido } from '@/lib/validation'

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

// FIX AUDITORÍA (2026-08-23): antes se guardaba cualquier texto como email
// sin validar formato, y sin límite de longitud en nombre.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 10, requireOrigin: false })
  if (guardErr) return guardErr
  try {
    const body = await req.json()
    const { nombre, email, telefono, od_sph, od_cyl, od_axis, oi_sph, oi_cyl, oi_axis, tipo_receta, complejidad, condiciones } = body

    if (nombre && String(nombre).length > 100) {
      return NextResponse.json({ error: 'Nombre demasiado largo' }, { status: 400 })
    }
    // El frontend ya exige nombre+apellido (ver comentario más abajo: "todo
    // lead tiene nombre + WhatsApp"), pero nunca se exigía aquí — cualquiera
    // podía llamar este endpoint directo y guardar un lead sin nombre o con
    // un solo nombre. Ahora se exige igual en el servidor.
    if (!tieneNombreYApellido(nombre)) {
      return NextResponse.json({ error: 'Escribe nombre y apellido completos' }, { status: 400 })
    }
    if (email && !isValidEmail(String(email))) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

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
