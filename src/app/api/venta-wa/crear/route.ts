// ============================================================
// ContactGo — POST /api/venta-wa/crear
// Admin genera un link de venta por WhatsApp con productos pre-cargados.
// El cliente abre el link, completa sus datos y se crea la orden.
// ============================================================
import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

export async function POST(req: NextRequest) {
  try {
    const guardErr = guardRequest(req, { limitPerMin: 30, requireOrigin: false })
    if (guardErr) return guardErr

    const auth = await requireAdmin()
    if (auth.ok === false) return auth.response

    const body = await req.json()
    const { items, envio = 0, notas = null } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items es requerido' }, { status: 400 })
    }

    const sb = getSb()

    // SEGURIDAD: validar productos contra la DB; precio admin permite override (negociado por WhatsApp)
    const ids = items.map((i: any) => i.product_id).filter(Boolean)
    const { data: productos, error: prodErr } = await sb
      .from('products')
      .select('id, nombre, precio, activo')
      .in('id', ids)

    if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 })

    const mapProd = new Map((productos ?? []).map((p: any) => [p.id, p]))
    let itemsFinal: any[]
    try {
      itemsFinal = items.map((i: any) => {
        const p = mapProd.get(i.product_id)
        if (!p) throw new Error(`Producto no encontrado: ${i.product_id}`)
        const precio = i.precio != null && Number(i.precio) > 0 ? Number(i.precio) : Number(p.precio)
        return {
          product_id: i.product_id,
          nombre: p.nombre,
          precio,
          precio_original: Number(p.precio),
          cantidad: Math.max(1, Number(i.cantidad ?? 1)),
          ojo_mode: i.ojo_mode ?? null,
          misma_receta: i.misma_receta ?? null,
          sph: i.sph != null && i.sph !== '' ? Number(i.sph) : null,
          cyl: i.cyl != null && i.cyl !== '' ? Number(i.cyl) : null,
          axis: i.axis != null && i.axis !== '' ? Number(i.axis) : null,
          add_power: i.add_power ?? null,
          sph_od: i.sph_od != null && i.sph_od !== '' ? Number(i.sph_od) : null,
          sph_oi: i.sph_oi != null && i.sph_oi !== '' ? Number(i.sph_oi) : null,
          cyl_od: i.cyl_od != null && i.cyl_od !== '' ? Number(i.cyl_od) : null,
          cyl_oi: i.cyl_oi != null && i.cyl_oi !== '' ? Number(i.cyl_oi) : null,
          axis_od: i.axis_od != null && i.axis_od !== '' ? Number(i.axis_od) : null,
          axis_oi: i.axis_oi != null && i.axis_oi !== '' ? Number(i.axis_oi) : null,
          color: i.color ?? null,
          size: i.size ?? null,
        }
      })
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }

    const subtotal = itemsFinal.reduce((s: number, i: any) => s + i.precio * i.cantidad, 0)
    const envioNum = Number(envio) || 0
    const total = subtotal + envioNum

    const token = randomBytes(8).toString('hex')

    const { data: link, error: insErr } = await sb
      .from('venta_whatsapp_links')
      .insert({ token, items: itemsFinal, subtotal, envio: envioNum, total, estado: 'pendiente', notas })
      .select()
      .single()

    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

    return NextResponse.json({ ok: true, link: `${BASE}/venta/${token}`, token, id: link.id, total })
  } catch (err: any) {
    console.error('[venta-wa/crear]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
