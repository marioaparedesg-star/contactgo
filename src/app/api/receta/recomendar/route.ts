import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { tipo, od_sph, oi_sph } = await req.json()
  if (!tipo) return NextResponse.json({ error: 'tipo requerido' }, { status: 400 })

  const odS = Number(od_sph ?? 0)
  const oiS = Number(oi_sph ?? 0)
  const TOLERANCE = 0.50

  const inRange = (sphs: number[], val: number) => {
    if (!sphs?.length) return true
    return val >= Math.min(...sphs) - TOLERANCE && val <= Math.max(...sphs) + TOLERANCE
  }

  // 1. Productos del tipo correcto
  const { data: todos } = await sb
    .from('products')
    .select('id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,reemplazo,dias_uso,descripcion')
    .eq('activo', true).eq('tipo', tipo).eq('archivado', false)
    .order('precio', { ascending: true })

  let pool = (todos ?? []).filter((p: any) =>
    inRange((p.sph_disponibles ?? []).map(Number), odS) &&
    inRange((p.sph_disponibles ?? []).map(Number), oiS)
  )

  // 2. Si no hay match por SPH → usar TODOS del tipo (siempre hay productos)
  if (!pool.length) pool = todos ?? []

  // 3. Fallback absoluto: cualquier lente si el tipo no tiene nada
  if (!pool.length) {
    const { data: fallbackData } = await sb.from('products')
      .select('id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,reemplazo,dias_uso,descripcion')
      .eq('activo', true).in('tipo', ['esferico','torico','multifocal'])
      .order('precio', { ascending: true }).limit(6)
    pool = fallbackData ?? []
  }

  const sorted = [...pool].sort((a: any, b: any) => Number(a.precio) - Number(b.precio))
  let resultado: any[]

  if (sorted.length === 0) {
    resultado = []
  } else if (sorted.length <= 2) {
    resultado = sorted
  } else {
    const eco = sorted[0]
    const prem = sorted[sorted.length - 1]
    // Recomendado: buscar ACUVUE/Air Optix/Biofinity en rango medio
    const midIdx = Math.floor(sorted.length / 2)
    let rec = sorted[midIdx]
    const famoso = sorted.find((p: any) => /acuvue|air optix|biofinity|clariti/i.test(p.nombre ?? ''))
    if (famoso && famoso.id !== eco.id) rec = famoso
    resultado = [eco, rec, prem]
  }

  return NextResponse.json({ productos: resultado, total: pool.length })
}
