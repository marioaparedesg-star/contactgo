// ============================================================
// ContactGo — /api/venta-wa/[token]
// GET  → datos públicos del link (items, total, estado)
// POST → cliente completa sus datos → crea la orden pendiente de pago
// ============================================================
import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { tieneNombreYApellido } from '@/lib/validation'

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
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const { error, status, link } = await getLinkValido(token)
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
        sph_od: i.sph_od, sph_oi: i.sph_oi,
        cyl_od: i.cyl_od, cyl_oi: i.cyl_oi,
        axis_od: i.axis_od, axis_oi: i.axis_oi,
        add_od: i.add_od, add_oi: i.add_oi,
        ojo_mode: i.ojo_mode, modalidad: i.modalidad,
        color: i.color, size: i.size,
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
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const guardErr = guardRequest(req, { limitPerMin: 10, requireOrigin: false })
    if (guardErr) return guardErr

    const { error, status, link, sb } = await getLinkValido(token)
    if (error) return NextResponse.json({ error: error === 'completado' ? 'Este pedido ya fue registrado.' : error }, { status })

    const body = await req.json()
    const nombre  = String(body.nombre ?? '').trim()
    const fnac    = String(body.fecha_nacimiento ?? '').trim()
    const tel     = String(body.telefono ?? '').replace(/\D/g, '')
    const email   = String(body.email ?? '').trim().toLowerCase()
    const dir     = String(body.direccion ?? '').trim()
    const ciudad  = String(body.ciudad ?? '').trim()
    const disclaimerAcceptanceId = body.disclaimer_acceptance_id ? String(body.disclaimer_acceptance_id) : null
    const disclaimerVersion = body.disclaimer_version ? String(body.disclaimer_version) : null

    // Validaciones
    if (nombre.length < 3) return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    if (!tieneNombreYApellido(nombre)) return NextResponse.json({ error: 'Escribe nombre y apellido completos' }, { status: 400 })
    if (!fnac || isNaN(Date.parse(fnac))) return NextResponse.json({ error: 'Fecha de nacimiento inválida' }, { status: 400 })
    const edad = (Date.now() - Date.parse(fnac)) / (365.25 * 24 * 3600 * 1000)
    if (edad < 16 || edad > 110) return NextResponse.json({ error: 'Fecha de nacimiento fuera de rango' }, { status: 400 })
    if (tel.length < 10) return NextResponse.json({ error: 'Teléfono/WhatsApp inválido' }, { status: 400 })
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'Correo inválido' }, { status: 400 })
    if (dir.length < 8) return NextResponse.json({ error: 'Dirección demasiado corta' }, { status: 400 })
    if (ciudad.length < 3) return NextResponse.json({ error: 'Ciudad requerida' }, { status: 400 })

    // "Contra entrega" se retiró de este flujo — urgente, a pedido directo
    // del negocio. Se ignora cualquier metodo_pago que llegue en el body
    // (aunque alguien llame la API directo) y siempre queda en 'tarjeta'.
    const metodoPago: 'tarjeta' = 'tarjeta'

    // Crear o reutilizar la cuenta SOLO después de que el cliente completa el formulario.
    // Si el email ya existe, se vincula sin cambiar su contraseña.
    let userId: string | null = null
    let accountSetupUrl: string | null = null
    const { data: perfilExistente, error: perfilError } = await sb
      .from('profiles').select('id').eq('email', email).eq('role', 'customer').maybeSingle()
    if (perfilError) throw new Error('No se pudo verificar la cuenta del cliente')

    if (perfilExistente?.id) {
      userId = perfilExistente.id
      const { error: profileUpdateError } = await sb.from('profiles').update({
        nombre, telefono: tel, direccion: dir, ciudad, fecha_nacimiento: fnac,
        updated_at: new Date().toISOString(),
      }).eq('id', userId)
      if (profileUpdateError) throw new Error('No se pudo actualizar el perfil del cliente')
    } else {
      // Buscar también en Auth por si existe una cuenta sin perfil.
      const { data: usersData, error: usersError } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 })
      if (usersError) throw new Error('No se pudo verificar la cuenta de acceso')
      const authExisting = usersData.users.find((u: any) => u.email?.toLowerCase() === email)
      if (authExisting) {
        userId = authExisting.id
        const { error: upsertError } = await sb.from('profiles').upsert({
          id: userId, nombre, email, telefono: tel, direccion: dir, ciudad,
          fecha_nacimiento: fnac, role: 'customer', activo: true,
        })
        if (upsertError) throw new Error('No se pudo vincular el perfil existente')
      } else {
        const passwordTemporal = crypto.randomUUID()
        const { data: authUser, error: authErr } = await sb.auth.admin.createUser({
          email, password: passwordTemporal, email_confirm: true,
          user_metadata: { nombre, origen: 'venta_whatsapp', requiere_configurar_password: true },
        })
        if (authErr || !authUser.user) throw new Error('No se pudo crear la cuenta del cliente')
        userId = authUser.user.id
        const { error: profileInsertError } = await sb.from('profiles').upsert({
          id: userId, nombre, email, telefono: tel, direccion: dir, ciudad,
          fecha_nacimiento: fnac, role: 'customer', activo: true,
        })
        if (profileInsertError) throw new Error('La cuenta se creó, pero no se pudo completar el perfil')
      }
    }

    if (!userId) throw new Error('No se pudo asociar el pedido a una cuenta')

    // Crear orden — misma estructura que el checkout web
    const orderNum = `CG-${Date.now().toString().slice(-8)}`
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .insert({
        user_id: userId,
        cliente_nombre: nombre,
        cliente_email: email,
        cliente_telefono: tel,
        cliente_fecha_nacimiento: fnac,
        direccion_texto: `${dir}, ${ciudad}`,
        ciudad,
        estado: 'pendiente',
        subtotal: link.subtotal,
        envio: link.envio,
        descuento: 0,
        total: link.total,
        metodo_pago: metodoPago,
        pago_estado: 'pendiente',
        numero_orden: orderNum,
        canal: 'whatsapp',
        disclaimer_acceptance_id: disclaimerAcceptanceId,
        disclaimer_version: disclaimerVersion,
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
      add_od: i.add_od ?? null, add_oi: i.add_oi ?? null,
      modalidad: i.modalidad ?? null,
      color: i.color ?? null,
      ojo: i.ojo_mode ?? null,
      size: i.size ?? null,
      suscripcion: null,
    }))
    const { error: itemsErr } = await sb.from('order_items').insert(itemsRows)
    if (itemsErr) console.error('[venta-wa] order_items error:', itemsErr.message)

    // Para cuentas nuevas, generar un enlace de un solo uso para establecer contraseña.
    // Si el enlace falla, el pedido queda registrado y el correo se reintenta desde soporte;
    // no se modifica ninguna contraseña existente.
    const { data: createdUserData } = await sb.auth.admin.getUserById(userId)
    if (createdUserData?.user?.user_metadata?.requiere_configurar_password === true) {
      const { data: recovery, error: recoveryError } = await sb.auth.admin.generateLink({
        type: 'recovery', email,
        options: { redirectTo: `${BASE}/auth/callback?next=/cuenta/reset-password` },
      })
      if (!recoveryError && recovery?.properties?.hashed_token) {
        accountSetupUrl = `${BASE}/auth/callback?token_hash=${encodeURIComponent(recovery.properties.hashed_token)}&type=recovery&next=/cuenta/reset-password`
      } else {
        console.error('[venta-wa] No se pudo generar enlace para configurar contraseña:', recoveryError?.message)
      }
    }

    // Marcar link como completado
    await sb
      .from('venta_whatsapp_links')
      .update({ estado: 'completado', order_id: order.id, completado_at: new Date().toISOString() })
      .eq('id', link.id)

    // Enviar confirmación por email. El enlace de contraseña solo se incluye
    // cuando se trata de una cuenta nueva creada desde esta venta.
    try {
      const { enviarNotificacionPedido } = await import('@/lib/email/order-notifications')
      const emailResult = await enviarNotificacionPedido(order.id, 'nuevo_pedido', undefined, accountSetupUrl)
      if (emailResult.email_cliente !== 'sent') {
        console.error('[venta-wa] correo de pedido recibido no enviado:', emailResult)
      }
    } catch (emailErr: any) {
      console.error('[venta-wa] error enviando confirmación:', emailErr?.message)
    }

    // Notificar al admin por WhatsApp (mejor esfuerzo, no bloquea)
    try {
      const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE
      if (!ADMIN_PHONE) throw new Error('WHATSAPP_ADMIN_PHONE no configurado')
      const { enviarWAManual } = await import('@/lib/whatsapp')
      const resumen = (link.items ?? [])
        .map((i: any) => `• ${i.cantidad}x ${i.nombre}`)
        .join('\n')
      await enviarWAManual(
        ADMIN_PHONE,
        { type: 'text', text: { body: `🛒 *Venta WhatsApp completada*\n\nPedido: *${orderNum}*\nCliente: ${nombre}\nTel: ${tel}\n\n${resumen}\n\nTotal: *RD${Number(link.total).toLocaleString('es-DO')}*\n\n🔗 Ya puedes enviarle el link de pago AZUL.` } }
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
