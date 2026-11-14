import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type Tipo = 'esferico' | 'torico' | 'multifocal' | 'multifocal_torico'

const TIPOS_VALIDOS: Tipo[] = ['esferico', 'torico', 'multifocal', 'multifocal_torico']
const cerca = (values: unknown, value: number, tolerance = 0.01) =>
  Array.isArray(values) && values.some(v => Number.isFinite(Number(v)) && Math.abs(Number(v) - value) <= tolerance)

function addCompatible(values: unknown, add: number) {
  if (!Array.isArray(values) || values.length === 0) return false
  return values.some(raw => {
    const label = String(raw).toLowerCase()
    const nums = (label.match(/[+-]?\d+(?:\.\d+)?/g) ?? []).map(Number)
    if (nums.length >= 2) {
      const min = Math.min(...nums), max = Math.max(...nums)
      return add >= min - 0.01 && add <= max + 0.01
    }
    if (nums.length === 1) return Math.abs(nums[0] - add) <= 0.01
    if (label.includes('low')) return add >= 0.75 && add <= 1.50
    if (label.includes('mid') || label.includes('medium')) return add >= 1.50 && add <= 2.25
    if (label.includes('high')) return add >= 2.00 && add <= 4.00
    return false
  })
}

function eyeCompatible(product: any, eye: { sph: number; cyl: number; axis: number | null; add: number | null }, tipo: Tipo) {
  const sphs = product.sph_disponibles
  // Sin parámetros de fabricación publicados no se puede confirmar compatibilidad.
  if (!cerca(sphs, eye.sph)) return false

  if (tipo === 'torico' || tipo === 'multifocal_torico') {
    if (Math.abs(eye.cyl) > 0.01) {
      if (!cerca(product.cyl_disponibles, eye.cyl)) return false
      if (eye.axis == null || !cerca(product.axis_disponibles, eye.axis, 0.5)) return false
    }
  }

  if (tipo === 'multifocal' || tipo === 'multifocal_torico') {
    if (eye.add == null || eye.add <= 0 || !addCompatible(product.add_disponibles, eye.add)) return false
  }

  return true
}

/**
 * Filtra exclusivamente por parámetros de fabricación cargados para cada producto.
 * No sustituye la adaptación clínica ni la confirmación de una receta de lentes de contacto.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, od_sph, oi_sph, od_cyl, oi_cyl, od_axis, oi_axis, od_add, oi_add } = body ?? {}
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo de lente inválido' }, { status: 400 })
    }

    const values = [od_sph, oi_sph, od_cyl ?? 0, oi_cyl ?? 0, od_axis, oi_axis, od_add, oi_add]
    if (values.some(v => v != null && (typeof v !== 'number' || !Number.isFinite(v)))) {
      return NextResponse.json({ error: 'La receta contiene valores inválidos' }, { status: 400 })
    }

    const od = { sph: Number(od_sph ?? 0), cyl: Number(od_cyl ?? 0), axis: od_axis == null ? null : Number(od_axis), add: od_add == null ? null : Number(od_add) }
    const oi = { sph: Number(oi_sph ?? 0), cyl: Number(oi_cyl ?? 0), axis: oi_axis == null ? null : Number(oi_axis), add: oi_add == null ? null : Number(oi_add) }

    if ([od, oi].some(e => e.sph < -30 || e.sph > 25 || e.cyl > 0.01 || e.cyl < -8 ||
      (e.axis != null && (e.axis < 1 || e.axis > 180)) || (e.add != null && (e.add < 0 || e.add > 6)))) {
      return NextResponse.json({ error: 'Los valores de la receta están fuera de los límites admitidos' }, { status: 400 })
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const tipoDb = tipo === 'multifocal_torico' ? 'multifocal' : tipo
    const { data, error } = await sb.from('products')
      .select('id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug,sph_disponibles,cyl_disponibles,axis_disponibles,add_disponibles,reemplazo,dias_uso,descripcion')
      .eq('activo', true).eq('tipo', tipoDb).eq('archivado', false)
      .order('precio', { ascending: true })

    if (error) {
      console.error('[receta/recomendar] products query failed:', error.message)
      return NextResponse.json({ error: 'No pudimos validar el catálogo en este momento' }, { status: 503 })
    }

    const productos = (data ?? []).filter((p: any) =>
      eyeCompatible(p, od, tipo) && eyeCompatible(p, oi, tipo) &&
      (tipo !== 'multifocal_torico' || /t[oó]ric/i.test(p.nombre ?? ''))
    )

    if (!productos.length) {
      return NextResponse.json({
        productos: [], total: 0,
        nota: 'No encontramos un producto con parámetros de fabricación compatibles con ambos ojos. Solicita asesoría para validar una alternativa.'
      })
    }

    // Devolver solo productos distintos y realmente compatibles; nunca duplicar una tarjeta.
    const sorted = [...productos].sort((a: any, b: any) => Number(a.precio) - Number(b.precio))
    if (sorted.length <= 2) return NextResponse.json({ productos: sorted, total: sorted.length })

    const eco = sorted[0]
    const premium = sorted[sorted.length - 1]
    const preferred = /acuvue|air optix|biofinity|bausch|clariti/i
    const middle = sorted.slice(1, -1)
    const recommended = middle.find((p: any) => preferred.test(p.nombre ?? '')) ?? middle[Math.floor(middle.length / 2)]
    return NextResponse.json({ productos: [eco, recommended, premium], total: sorted.length })
  } catch (error) {
    console.error('[receta/recomendar] unexpected error:', error)
    return NextResponse.json({ error: 'No fue posible procesar la receta' }, { status: 500 })
  }
}
