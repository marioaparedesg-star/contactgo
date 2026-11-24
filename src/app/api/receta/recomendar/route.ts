import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { evaluarReceta, TIPOS, type TipoLente, type ProductoFabricacion } from '@/lib/prescription-recommend'


function nearestAxis(values: unknown, target: number): number | null {
  if (!Array.isArray(values)) return null
  const axes = [...new Set(values.map(Number).filter(v => Number.isFinite(v) && v >= 1 && v <= 180))]
  if (!axes.length) return null
  const circularDistance = (a: number, b: number) => {
    const d = Math.abs(a - b)
    return Math.min(d, 180 - d)
  }
  const nearest = axes.sort((a, b) => circularDistance(a, target) - circularDistance(b, target) || a - b)[0]
  // Un eje a más de 10° ya no se considera una aproximación útil.
  return circularDistance(nearest, target) <= 10 ? nearest : null
}

function nearestSphere(values: unknown, target: number): number | null {
  if (!Array.isArray(values)) return null
  const powers = [...new Set(values.map(Number).filter(v => Number.isFinite(v)))]
  if (!powers.length) return null
  const nearest = powers.sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || Math.abs(a) - Math.abs(b))[0]
  return Math.abs(nearest - target) <= 0.5 ? nearest : null
}

function nearestCylinder(values: unknown, target: number): number | null {
  if (!Array.isArray(values)) return null
  const cylinders = [...new Set(values.map(Number).filter(v => Number.isFinite(v) && v < 0))]
  if (!cylinders.length) return null
  // Solo se considera una alternativa de fabricación cercana (máximo 0.50 D).
  // Se prioriza el valor de mayor magnitud cuando existe empate.
  const nearest = cylinders.sort((a, b) =>
    Math.abs(a - target) - Math.abs(b - target) || Math.abs(b) - Math.abs(a)
  )[0]
  return Math.abs(nearest - target) <= 0.5 ? nearest : null
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

    const catalogo = (data ?? []) as ProductoFabricacion[]
    // Cada producto se evalúa con SUS ejes reales de fabricación. Se selecciona
    // el eje disponible más cercano (distancia circular 1°–180°); SPH y CYL
    // siguen siendo coincidencias exactas con los parámetros publicados.
    const alternativasRevision: any[] = []
    const evaluados = tipo === 'torico' || tipo === 'multifocal_torico'
      ? catalogo.flatMap((producto: any) => {
          const odSph = nearestSphere(producto.sph_disponibles, receta.od.sph)
          const oiSph = nearestSphere(producto.sph_disponibles, receta.oi.sph)
          const odAxis = receta.od.axis == null ? null : nearestAxis(producto.axis_disponibles, receta.od.axis)
          const oiAxis = receta.oi.axis == null ? null : nearestAxis(producto.axis_disponibles, receta.oi.axis)
          const odCyl = nearestCylinder(producto.cyl_disponibles, receta.od.cyl)
          const oiCyl = nearestCylinder(producto.cyl_disponibles, receta.oi.cyl)
          if (odSph == null || oiSph == null || odAxis == null || oiAxis == null || odCyl == null || oiCyl == null) return []
          const recetaFabricable = {
            ...receta,
            od: { ...receta.od, sph: odSph, cyl: odCyl, axis: odAxis },
            oi: { ...receta.oi, sph: oiSph, cyl: oiCyl, axis: oiAxis },
          }
          const evaluacion = evaluarReceta(recetaFabricable, [producto])
          if (evaluacion.ok === false || evaluacion.productos.length === 0 || odSph !== receta.od.sph || oiSph !== receta.oi.sph) {
            // Cualquier cambio de esfera queda solo como alternativa para validación,
            // nunca como producto de compra directa.
            alternativasRevision.push({
              ...producto,
              receta_ajustada: {
                od: { sph: odSph, cyl: odCyl, axis: odAxis, add: receta.od.add },
                oi: { sph: oiSph, cyl: oiCyl, axis: oiAxis, add: receta.oi.add },
              },
              parametros_revision: {
                od: { sph: odSph, cyl_disponible: odCyl, axis_disponible: odAxis },
                oi: { sph: oiSph, cyl_disponible: oiCyl, axis_disponible: oiAxis },
              },
            })
            return []
          }
          return [{
            ...producto,
            receta_ajustada: {
              od: { ...recetaFabricable.od },
              oi: { ...recetaFabricable.oi },
            },
            ejes_ajustados: odAxis !== receta.od.axis || oiAxis !== receta.oi.axis,
            cilindros_ajustados: odCyl !== receta.od.cyl || oiCyl !== receta.oi.cyl,
            requiere_revision: odSph !== receta.od.sph || oiSph !== receta.oi.sph || odCyl !== receta.od.cyl || oiCyl !== receta.oi.cyl || odAxis !== receta.od.axis || oiAxis !== receta.oi.axis,
          }]
        }).sort((a: any, b: any) => Number(a.precio) - Number(b.precio))
      : (() => {
          const evaluacion = evaluarReceta(receta, catalogo)
          if (evaluacion.ok && evaluacion.productos.length) return evaluacion.productos

          // Si no hay coincidencia exacta de SPH, buscamos una alternativa de fabricación
          // cercana (máximo 0.50 D) y la separamos de las recomendaciones confirmadas.
          // Nunca se presenta como coincidencia exacta ni habilita compra directa.
          for (const producto of catalogo) {
            const odSphCercana = nearestSphere(producto.sph_disponibles, receta.od.sph)
            const oiSphCercana = nearestSphere(producto.sph_disponibles, receta.oi.sph)
            if (odSphCercana == null || oiSphCercana == null) continue
            const recetaCercana = {
              ...receta,
              od: { ...receta.od, sph: odSphCercana },
              oi: { ...receta.oi, sph: oiSphCercana },
            }
            const validacion = evaluarReceta(recetaCercana, [producto])
            if (!validacion.ok || validacion.productos.length === 0) continue
            alternativasRevision.push({
              ...producto,
              requiere_revision: true,
              receta_ajustada: { od: recetaCercana.od, oi: recetaCercana.oi },
              parametros_revision: {
                od: { sph: odSphCercana, cyl_disponible: receta.od.cyl, axis_disponible: receta.od.axis },
                oi: { sph: oiSphCercana, cyl_disponible: receta.oi.cyl, axis_disponible: receta.oi.axis },
              },
            })
          }
          return []
        })()

    const seleccion = evaluados.length > 3
      ? [evaluados[0], evaluados[Math.floor(evaluados.length / 2)], evaluados[evaluados.length - 1]]
      : evaluados
    return NextResponse.json({
      productos: seleccion,
      alternativas_revision: alternativasRevision.sort((a: any, b: any) => Number(a.precio) - Number(b.precio)).slice(0, 3),
      total: evaluados.length,
      sin_parametros: catalogo.filter(p => !Array.isArray(p.sph_disponibles) || p.sph_disponibles.length === 0).length,
      nota: seleccion.some((p: any) => p.requiere_revision)
        ? 'Encontramos modelos con parámetros de fabricación cercanos. Los ajustes de cilindro o eje requieren confirmación de un especialista antes de comprar.'
        : undefined,
    })
  } catch (error) {
    console.error('[receta/recomendar] unexpected error:', error)
    return NextResponse.json({ error: 'No fue posible procesar la receta' }, { status: 500 })
  }
}
