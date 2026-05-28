import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Marcas conocidas y sus productos canónicos ────────────────────────────
const BRAND_MAP: Record<string, { marca: string; tipo_default: string }> = {
  'acuvue':          { marca: 'ACUVUE',          tipo_default: 'esferico' },
  'acuvue oasys':    { marca: 'ACUVUE',          tipo_default: 'esferico' },
  'air optix':       { marca: 'AIR OPTIX',       tipo_default: 'esferico' },
  'biofinity':       { marca: 'Biofinity',       tipo_default: 'esferico' },
  'dailies':         { marca: 'Alcon',           tipo_default: 'esferico' },
  'proclear':        { marca: 'CooperVision',    tipo_default: 'esferico' },
  'clariti':         { marca: 'clariti',         tipo_default: 'esferico' },
  'freshlook':       { marca: 'Alcon',           tipo_default: 'color'    },
  'bausch':          { marca: 'Bausch+Lomb',     tipo_default: 'esferico' },
  'ultra':           { marca: 'Bausch+Lomb',     tipo_default: 'esferico' },
  'renu':            { marca: 'ReNu',            tipo_default: 'solucion' },
  'opti-free':       { marca: 'Alcon',           tipo_default: 'solucion' },
  'systane':         { marca: 'Alcon',           tipo_default: 'gota'     },
  'refresh':         { marca: 'Allergan',        tipo_default: 'gota'     },
}

// ── Detectar tipo por campos clínicos ─────────────────────────────────────
function detectTipo(parsed: ParsedScan): string {
  if (parsed.cyl !== null || parsed.axis !== null) return 'torico'
  if (parsed.add_power !== null)                   return 'multifocal'
  if (parsed.sph !== null)                         return 'esferico'
  return 'solucion'
}

interface ParsedScan {
  nombre_detectado: string | null
  marca: string | null
  tipo: string
  sph: number | null
  cyl: number | null
  axis: number | null
  add_power: string | null
  color: string | null
  bc: number | null
  dia: number | null
  lot: string | null
  expiry: string | null   // ISO date
  raw: string
}

// ── Parser de texto de caja/blíster ───────────────────────────────────────
function parseScanText(text: string): ParsedScan {
  const lines = text.toUpperCase().split(/[\n\r,;]+/).map(l => l.trim()).filter(Boolean)
  const full  = text.toUpperCase()

  const result: ParsedScan = {
    nombre_detectado: null, marca: null, tipo: 'esferico',
    sph: null, cyl: null, axis: null, add_power: null,
    color: null, bc: null, dia: null, lot: null, expiry: null,
    raw: text,
  }

  // Detectar marca/producto en primera línea o full text
  for (const [key, val] of Object.entries(BRAND_MAP)) {
    if (full.includes(key.toUpperCase())) {
      result.marca             = val.marca
      result.nombre_detectado  = key.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      break
    }
  }

  for (const line of lines) {
    // SPH: D -6.50 | SPH -6.50 | PWR -6.50 | POWER -6.50
    const sphMatch = line.match(/(?:^D\b|SPH|PWR|POWER|DIOPTER)\s*([+-]?\d+\.?\d*)/i)
      ?? line.match(/^([+-]?\d+\.\d{2})$/) // standalone number like "-6.50"
    if (sphMatch && result.sph === null) {
      result.sph = parseFloat(sphMatch[1])
    }

    // CYL: CYL -1.75 | CYLINDER -1.75
    const cylMatch = line.match(/(?:CYL|CYLINDER)\s*([+-]?\d+\.?\d*)/i)
    if (cylMatch) result.cyl = parseFloat(cylMatch[1])

    // AXIS: AXIS 180 | AX 090
    const axisMatch = line.match(/(?:AXIS|AX)\s*(\d{1,3})/i)
    if (axisMatch) result.axis = parseInt(axisMatch[1])

    // ADD: ADD LOW | ADD MED | ADD HIGH | ADD +2.00
    const addMatch = line.match(/ADD\s*(LOW|MED|MEDIUM|HIGH|[+-]?\d+\.?\d*)/i)
    if (addMatch) result.add_power = addMatch[1].toUpperCase()

    // BC: BC 8.4 | BASE CURVE 8.4
    const bcMatch = line.match(/(?:BC|BASE\s*CURVE|B\.C\.)\s*(\d+\.?\d*)/i)
    if (bcMatch) result.bc = parseFloat(bcMatch[1])

    // DIA: DIA 14.0 | DIAMETER 14.0
    const diaMatch = line.match(/(?:DIA|DIAMETER|D\.I\.A\.)\s*(\d+\.?\d*)/i)
    if (diaMatch) result.dia = parseFloat(diaMatch[1])

    // LOT: LOT B019J6X2BR | LOT# ABC123 | LOTE ABC123
    const lotMatch = line.match(/(?:LOT[#:]?\s*|LOTE[#:]?\s*)([A-Z0-9]{4,20})/i)
    if (lotMatch) result.lot = lotMatch[1].toUpperCase()

    // EXPIRY: EXP 2031-02-01 | EXP 2031/02 | USE BY 02/2031
    const expMatch = line.match(/(?:EXP(?:IRY)?|EXP\.|USE\s*BY|CADUCIDAD)[:\s]*(\d{4}[-/]\d{2}[-/]?\d{0,2}|\d{2}[-/]\d{4})/i)
    if (expMatch) {
      let raw = expMatch[1].replace(/\//g, '-')
      // Normalize to ISO YYYY-MM-DD
      if (/^\d{4}-\d{2}$/.test(raw)) raw = `${raw}-01`
      if (/^\d{2}-\d{4}$/.test(raw)) {
        const [mm, yyyy] = raw.split('-')
        raw = `${yyyy}-${mm}-01`
      }
      result.expiry = raw
    }
  }

  result.tipo = detectTipo(result)
  return result
}

// ── POST /api/admin/scanner ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return (guard as any).response

  const { action, ...body } = await req.json()
  const sb = getSb()

  // ── action: parse — solo parsear, sin escribir ──────────────────────────
  if (action === 'parse') {
    const { text } = body
    if (!text) return NextResponse.json({ error: 'text requerido' }, { status: 400 })
    const parsed = parseScanText(text)

    // Buscar producto existente
    let product = null
    if (parsed.marca) {
      const { data } = await sb.from('products')
        .select('id,nombre,tipo,marca,stock,slug,imagen_url')
        .ilike('marca', `%${parsed.marca}%`)
        .eq('activo', true)
        .limit(5)
      if (data?.length) {
        // Match más preciso si hay nombre detectado
        product = parsed.nombre_detectado
          ? data.find(p => p.nombre.toLowerCase().includes(parsed.nombre_detectado!.toLowerCase())) ?? data[0]
          : data[0]
      }
    }

    // Buscar variante existente si tenemos producto y sph
    let variant = null
    if (product && parsed.sph !== null) {
      const { data: vars } = await sb.from('product_inventory')
        .select('id,sph,cyl,axis,stock')
        .eq('product_id', product.id)
        .eq('sph', parsed.sph)
        .is(parsed.cyl !== null ? null : 'cyl', parsed.cyl)
        .limit(1)
      variant = vars?.[0] ?? null
    }

    return NextResponse.json({ parsed, product, variant })
  }

  // ── action: commit — guardar en DB ──────────────────────────────────────
  if (action === 'commit') {
    const { product_id, parsed, cantidad = 1, lot, expiry, create_product } = body

    if (!product_id && !create_product) {
      return NextResponse.json({ error: 'product_id o create_product requerido' }, { status: 400 })
    }

    let pid = product_id

    // Crear producto si no existe
    if (!pid && create_product) {
      const { data: newP, error: pErr } = await sb.from('products').insert({
        nombre:       create_product.nombre,
        marca:        create_product.marca ?? parsed.marca ?? 'Desconocido',
        tipo:         parsed.tipo,
        precio:       create_product.precio ?? 0,
        stock:        0,
        activo:       true,
        curva_base:   parsed.bc?.toString() ?? null,
        diametro:     parsed.dia?.toString() ?? null,
        slug:         create_product.slug ?? create_product.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }).select('id').single()
      if (pErr || !newP) return NextResponse.json({ error: 'Error creando producto', detail: pErr?.message }, { status: 500 })
      pid = newP.id
    }

    // Upsert de stock por dioptría (atómico)
    const { data: upsertResult, error: uErr } = await sb.rpc('upsert_inventory_stock', {
      p_product_id: pid,
      p_sph:        parsed.sph,
      p_cyl:        parsed.cyl,
      p_axis:       parsed.axis,
      p_add_power:  parsed.add_power,
      p_color:      parsed.color,
      p_bc:         parsed.bc,
      p_dia:        parsed.dia,
      p_cantidad:   cantidad,
    })

    if (uErr) return NextResponse.json({ error: 'Error actualizando stock', detail: uErr.message }, { status: 500 })

    const inv = Array.isArray(upsertResult) ? upsertResult[0] : upsertResult

    // Registrar lote si se proporcionó
    let lot_id = null
    if (lot && expiry && inv?.inventory_id) {
      const { data: lotData } = await sb.from('inventory_lots').insert({
        inventory_id: inv.inventory_id,
        product_id:   pid,
        lot_number:   lot.toUpperCase(),
        expiry_date:  expiry,
        cantidad,
      }).select('id').single()
      lot_id = lotData?.id ?? null
    }

    // Log del escaneo
    await sb.from('scan_log').insert({
      product_id:   pid,
      inventory_id: inv?.inventory_id ?? null,
      lot_id,
      raw_input:    parsed.raw,
      parsed_data:  parsed,
      cantidad,
      accion:       'entrada',
      resultado:    !product_id && create_product ? 'nuevo_producto' : 'ok',
    })

    return NextResponse.json({
      ok: true,
      inventory_id:   inv?.inventory_id,
      stock_anterior: inv?.stock_anterior ?? 0,
      stock_nuevo:    inv?.stock_nuevo ?? cantidad,
      es_nuevo:       inv?.es_nuevo ?? false,
      lot_id,
    })
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 })
}
