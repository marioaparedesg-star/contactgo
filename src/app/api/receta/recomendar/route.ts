import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { evaluarReceta, TIPOS, type TipoLente, type ProductoFabricacion } from '@/lib/prescription-recommend'

// Solo filtra por parámetros de fabricación publicados. No sustituye la adaptación clínica.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    const tipo = body.tipo as TipoLente
    if (!TIPOS.includes(tipo)) return NextResponse.json({ error: 'Tipo de lente inválido' }, { status: 400 })

    const num = (v: unknown): number | null => (v === null || v === undefined || v === '') ? null : Number(v)
    const odSph = num(body.od_sph), oiSph = num(body.oi_sph)
    if (odSph === null || oiSph === null || !Number.isFinite(odSph) || !Number.isFinite(oiSph)) {
      return NextResponse.json({ error: 'La receta está incompleta: falta la esfera (SPH) de un ojo' }, { status: 400 })
    }
    const receta = {
      tipo,
      od: { sph: odSph, cyl: num(body.od_cyl) ?? 0, axis: num(body.od_axis), add: num(body.od_add) },
      oi: { sph: oiSph, cyl: num(body.oi_cyl) ?? 0, axis: num(body.oi_axis), add: num(body.oi_add) },
    }

    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const tipoDb = tipo === 'esferico' ? 'esferico' : tipo === 'torico' ? 'torico' : 'multifocal'
    const { data, error } = await sb.from('products')
      .select('id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,cyl_disponibles,axis_disponibles,add_disponibles,reemplazo,dias_uso,descripcion')
      .eq('activo', true).eq('archivado', false).eq('tipo', tipoDb)
    if (error) {
      console.error('[receta/recomendar] products query failed:', error.message)
      return NextResponse.json({ error: 'No pudimos validar el catálogo en este momento' }, { status: 503 })
    }

    const res = evaluarReceta(receta, (data ?? []) as ProductoFabricacion[])
    if (res.ok === false) return NextResponse.json({ error: res.error }, { status: res.status })
    return NextResponse.json({ productos: res.productos, total: res.total, sin_parametros: res.sin_parametros, nota: res.nota })
  } catch (error) {
    console.error('[receta/recomendar] unexpected error:', error)
    return NextResponse.json({ error: 'No fue posible procesar la receta' }, { status: 500 })
  }
}
