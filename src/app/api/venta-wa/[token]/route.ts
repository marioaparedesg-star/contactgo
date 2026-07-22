// ============================================================
// ContactGo — /api/venta-wa/[token]
// GET  → datos públicos del link (items, total, estado)
// POST → cliente completa sus datos → crea la orden pendiente de pago
// ============================================================
import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

async function getLinkValido(token: string) {
  const sb = getSb()
  const { data: link } = await sb
    .from('venta_whatsapp_links')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (!link) return { error: 'Link no encontrado', status: 404, link: null, sb }
  if (link.estado === 'completado') return { error: 'completado', status: 409, link, sb }
  if (link.estado === 'cancelado') return { error: 'Este link fue cancelado', status: 410, link: null, sb }
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return { error: 'Este link ha expirado. Escríbenos por WhatsApp para generar uno nuevo.', status: 410, link: null, sb }
  }
  return { error: null, status: 200, link, sb }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { error, status, link } = await getLinkValido(params.token)
    if (error && error !== 'completado') {
      return NextResponse.json({ error }, { status })
    }
    if (error === 'completado') {
      return NextResponse.json({ estado: 'completado', numero_orden: null }, { status: 200 })
    }
    // Solo datos necesarios para la vista pública
    return NextResponse.json({
      estado: link.estado,
      items: (link.items ?? []).map((i: any) => ({
        nombre: i.nombre, precio: i.precio, cantidad: i.cantidad,
        sph: i.sph, cyl: i.cyl, axis: i.axis, add_power: i.add_power,
        sph_od: i.sph_od, sph_oi: i.sph_oi, color: i.color, size: i.size,
      })),
      subtotal: link.subtotal,
      envio: link.envio,
      total: link.total,
      expires_at: link.expires_at,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const guardErr = guardRequest(req, { limitPerMin: 10, requireOrigin: false })
    if (guardErr) return guardErr

    const { error, status, link, sb } = await getLinkValido(params.token)
    if (error) return NextResponse.json({ error: error === 'completado' ? 'Este pedido ya fue registrado.' : error }, { status })

    const body = await req.json()
    const nombre  = String(body.nombre ?? '').trim()
    const cedula  = String(body.cedula ?? '').replace(/\D/g, '')
    const fnac    = String(body.fecha_nacimiento ?? '').trim()
    const tel     = String(body.telefono ?? '').replace(/\D/g, '')
    const email   = String(body.email ?? '').trim().toLowerCase()
    const dir     = String(body.direccion ?? '').trim()
    const ciudad  = String(body.ciudad ?? '').trim()

    // Validaciones
    if (nombre.length < 3) return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    if (cedula.length !== 11) return NextResponse.json({ error: 'La cédula debe tener 11 dígitos' }, { status: 400 })
    if (!fnac || isNaN(Date.parse(fnac))) return NextResponse.json({ error: 'Fecha de nacimiento inválida' }, { status: 400 })
    const edad = (Date.now() - Date.parse(fnac)) / (365.25 * 24 * 3600 * 1000)
    if (edad < 16 || edad > 110) return NextResponse.json({ error: 'Fecha de nacimiento fuera de rango' }, { status: 400 })
    if (tel.length < 10) return NextResponse.json({ error: 'Teléfono/WhatsApp inválido' }, { status: 400 })
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'Correo inválido' }, { status: 400 })
    if (dir.length < 8) return NextResponse.json({ error: 'Dirección demasiado corta' }, { status: 400 })
    if (ciudad.length < 3) return NextResponse.json({ error: 'Ciudad requerida' }, { status: 400 })

    // Crear orden — misma estructura que el checkout web
    const orderNum = `CG-${Date.now().toString().slice(-8)}`
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .insert({
        user_id: null,
        cliente_nombre: nombre,
        cliente_email: email,
        cliente_telefono: tel,
        cliente_cedula: cedula,
        cliente_fecha_nacimiento: fnac,
        direccion_texto: `${dir}, ${ciudad}`,
        ciudad,
        estado: 'pendiente',
        subtotal: link.subtotal,
        envio: link.envio,
        descuento: 0,
        total: link.total,
        metodo_pago: 'tarjeta',
        pago_estado: 'pendiente',
        numero_orden: orderNum,
        canal: 'whatsapp',
        notas_admin: link.notas ? `[Venta WhatsApp] ${link.notas}` : '[Venta WhatsApp]',
      })
      .select()
      .single()

    if (orderErr || !order) {
      console.error('[venta-wa] error creando orden:', orderErr?.message)
      return NextResponse.json({ error: 'Error al registrar el pedido' }, { status: 500 })
    }

    // Items de la orden
    const itemsRows = (link.items ?? []).map((i: any) => ({
      order_id: order.id,
      product_id: i.product_id,
      nombre: i.nombre,
      precio: i.precio,
      precio_original: i.precio_original ?? i.precio,
      descuento_pct: 0,
      cantidad: i.cantidad,
      ojo_mode: i.ojo_mode ?? null,
      misma_receta: i.misma_receta ?? null,
      sph: i.sph ?? null, cyl: i.cyl ?? null, axis: i.axis ?? null,
      add_power: i.add_power ?? null,
      sph_od: i.sph_od ?? null, sph_oi: i.sph_oi ?? null,
      cyl_od: i.cyl_od ?? null, cyl_oi: i.cyl_oi ?? null,
      axis_od: i.axis_od ?? null, axis_oi: i.axis_oi ?? null,
      color: i.color ?? null,
      ojo: i.ojo_mode ?? null,
      size: i.size ?? null,
      suscripcion: null,
    }))
    const { error: itemsErr } = await sb.from('order_items').insert(itemsRows)
    if (itemsErr) console.error('[venta-wa] order_items error:', itemsErr.message)

    // Marcar link como completado
    await sb
      .from('venta_whatsapp_links')
      .update({ estado: 'completado', order_id: order.id, completado_at: new Date().toISOString() })
      .eq('id', link.id)

    // NOTA: En ventas por WhatsApp el cliente ya está siendo atendido manualmente,
    // así que NO se le envía ningún email ni WhatsApp automático. Solo se notifica al admin.

    // Notificar al admin por WhatsApp (mejor esfuerzo, no bloquea)
    try {
      const { sendText } = await import('@/lib/whatsapp')
      const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE ?? '18294089097'
      const resumen = (link.items ?? [])
        .map((i: any) => `• ${i.cantidad}x ${i.nombre}`)
        .join('\n')
      await sendText(
        ADMIN_PHONE,
        `🛒 *Venta WhatsApp completada*\n\nPedido: *${orderNum}*\nCliente: ${nombre}\nTel: ${tel}\n\n${resumen}\n\nTotal: *RD$${Number(link.total).toLocaleString('es-DO')}*\n\n✅ El cliente completó sus datos. Ya puedes enviarle el link de pago AZUL.`
      )
    } catch (waErr: any) {
      console.error('[venta-wa] WA admin notify error:', waErr?.message)
    }

    return NextResponse.json({ ok: true, numero_orden: orderNum })
  } catch (err: any) {
    console.error('[venta-wa/completar]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
