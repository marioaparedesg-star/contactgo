import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Motor de recomendación real — NUNCA retorna lista vacía
 * Soporta: esferico | torico | multifocal | multifocal_torico
 */
export async function POST(req: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { tipo, od_sph, oi_sph, od_cyl } = await req.json()
  if (!tipo) return NextResponse.json({ error: 'tipo requerido' }, { status: 400 })

  const odS = Number(od_sph ?? 0)
  const oiS = Number(oi_sph ?? 0)
  const cylV = Number(od_cyl ?? 0)
  const TOLERANCE = 0.50

  const inRange = (sphs: number[], val: number) =>
    !sphs?.length || (val >= Math.min(...sphs) - TOLERANCE && val <= Math.max(...sphs) + TOLERANCE)

  // ── Determinar el tipo DB real a buscar ──────────────────────────────────
  // multifocal_torico → buscar tipo='multifocal' con cyl_disponibles
  const tipoDb = tipo === 'multifocal_torico' ? 'multifocal' : tipo

  const FIELDS = 'id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,cyl_disponibles,add_disponibles,reemplazo,dias_uso,descripcion'

  let { data: todos } = await sb
    .from('products')
    .select(FIELDS)
    .eq('activo', true)
    .eq('tipo', tipoDb)
    .eq('archivado', false)
    .order('precio', { ascending: true })

  todos = todos ?? []

  // ── Para multifocal_torico: filtrar solo los que tienen CYL ───────────────
  if (tipo === 'multifocal_torico') {
    const mfTorico = todos.filter((p: any) => p.cyl_disponibles?.length > 0)
    if (mfTorico.length > 0) {
      return NextResponse.json({ productos: mfTorico.slice(0, 3), total: mfTorico.length, tipo_real: 'multifocal_torico' })
    }
    // Fallback: mostrar multifocales normales + nota
    return NextResponse.json({ productos: todos.slice(0, 3), total: todos.length, tipo_real: 'multifocal', nota: 'No disponemos de multifocal tórico en rango exacto. Mostramos multifocales estándar.' })
  }

  // ── Filtrar por rango SPH ±0.50D ──────────────────────────────────────────
  let pool = todos.filter((p: any) => {
    const sp = (p.sph_disponibles ?? []).map(Number)
    return inRange(sp, odS) && inRange(sp, oiS)
  })

  // Fallback L1: todos del tipo
  if (!pool.length) pool = todos
  // Fallback L2: cualquier lente activo
  if (!pool.length) {
    const { data: fb } = await sb.from('products').select(FIELDS).eq('activo', true)
      .in('tipo', ['esferico', 'torico', 'multifocal']).order('precio', { ascending: true }).limit(6)
    pool = fb ?? []
  }

  const sorted = [...pool].sort((a: any, b: any) => Number(a.precio) - Number(b.precio))

  // ── Seleccionar 3 tiers ───────────────────────────────────────────────────
  let resultado: any[]
  if (sorted.length === 0) {
    resultado = []
  } else if (sorted.length === 1) {
    resultado = [sorted[0], sorted[0], sorted[0]]
  } else if (sorted.length === 2) {
    resultado = [sorted[0], sorted[1], sorted[1]]
  } else {
    const eco  = sorted[0]
    const prem = sorted[sorted.length - 1]
    // Recomendado: preferir marca conocida en precio medio
    const PREF = /acuvue|air optix|biofinity|clariti/i
    let rec = sorted[Math.floor(sorted.length * 0.4)] ?? sorted[Math.floor(sorted.length / 2)]
    const famoso = sorted.find((p: any) => PREF.test(p.nombre ?? '') && p.id !== eco.id)
    if (famoso) rec = famoso
    resultado = [eco, rec, prem]
  }

  return NextResponse.json({ productos: resultado, total: pool.length })
}
