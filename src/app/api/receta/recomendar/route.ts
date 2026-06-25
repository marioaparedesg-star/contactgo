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

  const FIELDS = 'id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,cyl_disponibles,add_disponibles,reemplazo,dias_uso,descripcion'

  // ── MULTIFOCAL TÓRICO ────────────────────────────────────────────────────
  if (tipo === 'multifocal_torico') {
    const { data: mfAll } = await sb.from('products').select(FIELDS)
      .eq('activo', true).eq('tipo', 'multifocal').eq('archivado', false)
      .order('precio', { ascending: true })
    
    const conCyl = (mfAll ?? []).filter((p: any) => p.cyl_disponibles?.length > 0)
    if (conCyl.length >= 1) {
      // Dar 3 opciones aunque sean el mismo producto
      const resultado = conCyl.length >= 3 ? conCyl.slice(0, 3) :
                        conCyl.length === 2 ? [conCyl[0], conCyl[1], conCyl[1]] :
                        [conCyl[0], conCyl[0], conCyl[0]]
      return NextResponse.json({ productos: resultado, total: conCyl.length, tipo_real: 'multifocal_torico' })
    }
    // Fallback: multifocales estándar
    const fallback = (mfAll ?? []).slice(0, 3)
    return NextResponse.json({ productos: fallback, total: fallback.length, tipo_real: 'multifocal',
      nota: 'Tu receta es compleja. Te recomendamos contactarnos por WhatsApp para asesoría personalizada.' })
  }

  // ── TIPOS ESTÁNDAR ───────────────────────────────────────────────────────
  const tipoDb = tipo
  const maxSph = Math.max(Math.abs(odS), Math.abs(oiS))
  const esAltaGraduacion = maxSph > 8

  let { data: todos } = await sb.from('products').select(FIELDS)
    .eq('activo', true).eq('tipo', tipoDb).eq('archivado', false)
    .order('precio', { ascending: true })

  todos = todos ?? []

  // ── Filtrar por rango SPH ────────────────────────────────────────────────
  let pool = todos.filter((p: any) => {
    const sp = (p.sph_disponibles ?? []).map(Number)
    // Excluir XR de recomendaciones estándar (solo recomendar XR si la graduación lo requiere)
    const esXR = /XR/i.test(p.nombre ?? '')
    if (esXR && !esAltaGraduacion && tipo === 'esferico') return false
    return inRange(sp, odS) && inRange(sp, oiS)
  })

  // Para tóricos: excluir productos tóricos XR de rango normal
  if (tipo === 'torico') {
    const poolNormal = pool.filter((p: any) => !/XR/i.test(p.nombre ?? ''))
    if (poolNormal.length > 0) pool = poolNormal
  }

  // Para multifocales: excluir tóricos de la lista
  if (tipo === 'multifocal') {
    const poolNoToric = pool.filter((p: any) => !p.cyl_disponibles?.length || !/t[oó]ric/i.test(p.nombre ?? ''))
    if (poolNoToric.length > 0) pool = poolNoToric
  }

  // Fallback L1: todos del tipo sin filtro XR
  if (!pool.length) pool = todos.filter((p: any) => inRange((p.sph_disponibles ?? []).map(Number), odS))
  // Fallback L2: todos del tipo
  if (!pool.length) pool = todos
  // Fallback L3: cualquier lente activo
  if (!pool.length) {
    const { data: fb } = await sb.from('products').select(FIELDS).eq('activo', true)
      .in('tipo', ['esferico', 'torico', 'multifocal']).order('precio', { ascending: true }).limit(6)
    pool = fb ?? []
  }

  const sorted = [...pool].sort((a: any, b: any) => Number(a.precio) - Number(b.precio))

  // ── Seleccionar 3 tiers con lógica mejorada ───────────────────────────────
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
    
    // Recomendado: preferir marca conocida de precio medio
    const PREF = /acuvue|air optix|biofinity|bausch|clariti/i
    // Buscar un producto en el rango medio (40%-70% del pool)
    const midStart = Math.floor(sorted.length * 0.35)
    const midEnd = Math.floor(sorted.length * 0.70)
    const midPool = sorted.slice(midStart, midEnd + 1)
    
    let rec = midPool.find((p: any) => PREF.test(p.nombre ?? '') && p.id !== eco.id)
             ?? midPool[Math.floor(midPool.length / 2)]
             ?? sorted[Math.floor(sorted.length / 2)]

    // Asegurar que eco !== rec !== prem
    if (rec?.id === eco.id && sorted.length > 2) rec = sorted[1]
    if (rec?.id === prem.id && sorted.length > 2) rec = sorted[sorted.length - 2]

    resultado = [eco, rec, prem]
  }

  return NextResponse.json({ productos: resultado, total: pool.length })
}
