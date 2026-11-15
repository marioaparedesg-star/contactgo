import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { evaluarReceta, TIPOS, type TipoLente, type ProductoFabricacion } from '@/lib/prescription-recommend'


function nearest(values: unknown, target: number, circularAxis = false): number | null {
  if (!Array.isArray(values)) return null
  const nums = values.map(Number).filter(Number.isFinite)
  if (!nums.length) return null
  return nums.sort((a, b) => {
    const distance = (v: number) => {
      const raw = Math.abs(v - target)
      return circularAxis ? Math.min(raw, 180 - raw) : raw
    }
    return distance(a) - distance(b) || Math.abs(a) - Math.abs(b)
  })[0]
}

function buildReviewAlternatives(products: ProductoFabricacion[], receta: {
  tipo: TipoLente
  od: { sph: number; cyl: number; axis: number | null; add: number | null }
  oi: { sph: number; cyl: number; axis: number | null; add: number | null }
}) {
  if (receta.tipo !== 'torico' && receta.tipo !== 'multifocal_torico') return []
  return products.flatMap((p: any) => {
    const sphValues = Array.isArray(p.sph_disponibles) ? p.sph_disponibles.map(Number) : []
    const cylValues = Array.isArray(p.cyl_disponibles) ? p.cyl_disponibles.map(Number) : []
    const axisValues = Array.isArray(p.axis_disponibles) ? p.axis_disponibles.map(Number) : []
    if (!sphValues.length || !cylValues.length || !axisValues.length) return []
    const eyes = [receta.od, receta.oi]
    const review = eyes.map((eye) => {
      const sph = nearest(sphValues, eye.sph)
      const cyl = nearest(cylValues, eye.cyl)
      const axis = eye.axis == null ? null : nearest(axisValues, eye.axis, true)
      const sphExact = sph != null && Math.abs(sph - eye.sph) <= 0.01
      const cylClose = cyl != null && Math.abs(cyl - eye.cyl) <= 0.51
      const axisClose = axis != null && Math.min(Math.abs(axis - (eye.axis ?? 0)), 180 - Math.abs(axis - (eye.axis ?? 0))) <= 5
      return { sph: sphExact ? sph : null, cyl, axis, sphExact, cylClose, axisClose }
    })
    if (review.some((eye) => !eye.sphExact || !eye.cylClose || !eye.axisClose)) return []
    const exact = review.every((eye, index) =>
      eye.sphExact && Math.abs((eye.cyl ?? 99) - eyes[index].cyl) <= 0.01 &&
      eye.axis != null && eyes[index].axis != null && Math.abs(eye.axis - eyes[index].axis) <= 0.5
    )
    if (exact) return []
    return [{
      id: p.id, nombre: p.nombre, marca: p.marca, precio: p.precio,
      imagen_url: p.imagen_url, slug: p.slug,
      parametros_revision: {
        od: { sph: review[0].sph, cyl_disponible: review[0].cyl, axis_disponible: review[0].axis },
        oi: { sph: review[1].sph, cyl_disponible: review[1].cyl, axis_disponible: review[1].axis },
      },
      requiere_validacion_profesional: true,
    }]
  }).sort((a: any, b: any) => Number(a.precio) - Number(b.precio)).slice(0, 3)
}

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
    return NextResponse.json({ productos: res.productos, total: res.total, sin_parametros: res.sin_parametros, nota: res.nota, alternativas_revision: res.productos.length ? [] : buildReviewAlternatives((data ?? []) as ProductoFabricacion[], receta) })
  } catch (error) {
    console.error('[receta/recomendar] unexpected error:', error)
    return NextResponse.json({ error: 'No fue posible procesar la receta' }, { status: 500 })
  }
}
