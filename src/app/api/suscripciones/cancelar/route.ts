import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }

export async function POST(req: NextRequest) {
  // Seguridad: origin + rate limit
  const guardErr = guardRequest(req, { limitPerMin: 10 })
  if (guardErr) return guardErr

  try {
    const { subscription_id, motivo, confirmar_pedido = false } = await req.json()
    if (!subscription_id) return NextResponse.json({ error: 'subscription_id requerido' }, { status: 400 })

    // Auth check PRIMERO — antes de cualquier query a DB
    const sbServer = createServerSupabaseClient()
    const { data: { user } } = await sbServer.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 })

    // Verificar rol
    const { data: profile } = await sbServer.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'

    // Buscar suscripción
    const { data: sub } = await getSb().from('subscriptions').select('*').eq('id', subscription_id).single()
    if (!sub) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    if (sub.cancelada) return NextResponse.json({ error: 'Ya cancelada' }, { status: 400 })

    // Verificar que el usuario es el dueño o es admin
    if (!isAdmin && sub.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const hoy = new Date(); hoy.setHours(0,0,0,0)
    const proxEnvio = sub.proximo_envio ? new Date(sub.proximo_envio) : null
    const diasRestantes = proxEnvio ? Math.ceil((proxEnvio.getTime() - hoy.getTime()) / 86400000) : null

    let items: any[] = []
    try { items = typeof sub.items === 'string' ? JSON.parse(sub.items) : (sub.items ?? []) } catch {}
    const totalBruto = items.reduce((s: number, i: any) => s + ((i.precio ?? 0) * (i.cantidad ?? 1)), 0)
    const totalConDescuento = Math.round(totalBruto * (1 - (sub.descuento_pct ?? 0) / 100))

    // Próximo envío en ≤7 días y no ha confirmado aún
    if (proxEnvio && diasRestantes !== null && diasRestantes >= 0 && diasRestantes <= 7 && !confirmar_pedido) {
      return NextResponse.json({
        ok: false,
        requiere_confirmacion: true,
        dias_restantes: diasRestantes,
        proximo_envio: sub.proximo_envio,
        total_pendiente: totalConDescuento,
        mensaje: diasRestantes === 0
          ? 'Tu envío está programado para HOY. Se generará el pedido antes de cancelar la suscripción.'
          : `Tu próximo envío es en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} (${new Date(sub.proximo_envio).toLocaleDateString('es-DO', {day:'numeric',month:'long'})}). Se procesará y cobrará este último pedido antes de cancelar.`,
      })
    }

    // Generar pedido si aplica
    let pedidoGenerado = null
    if (confirmar_pedido && proxEnvio && diasRestantes !== null && diasRestantes <= 7 && diasRestantes >= 0) {
      const { data: order } = await getSb().from('orders').insert({
        user_id: sub.user_id, cliente_nombre: sub.cliente_nombre,
        cliente_email: sub.cliente_email, cliente_telefono: sub.cliente_telefono,
        direccion_texto: sub.direccion_texto, estado: 'pendiente',
        subtotal: totalConDescuento, envio: 0, descuento: totalBruto - totalConDescuento,
        total: totalConDescuento, metodo_pago: 'tarjeta', pago_estado: 'pendiente',
        notas_admin: `Auto-generado al cancelar suscripción #${subscription_id.slice(0,8).toUpperCase()}`,
      }).select().single()

      if (order) {
        await getSb().from('order_items').insert(items.map((i: any) => ({
          order_id: order.id, product_id: i.product_id ?? null,
          nombre: i.nombre, precio: Number(i.precio ?? 0), cantidad: Number(i.cantidad ?? 1),
          sph: i.sph != null ? Number(i.sph) : null, cyl: i.cyl != null ? Number(i.cyl) : null,
          add_power: i.add_power ? Number(i.add_power) : null, axis: i.axis != null ? Number(i.axis) : null,
          color: i.color ?? null, ojo: i.ojo ?? null,
        })))
        pedidoGenerado = order.id
      }
    }

    // Cancelar
    await getSb().from('subscriptions').update({
      activa: false, cancelada: true,
      cancelada_en: new Date().toISOString(),
      motivo_cancelacion: motivo ?? null,
      ultimo_pedido_generado: !!pedidoGenerado,
      updated_at: new Date().toISOString(),
    }).eq('id', subscription_id)

    return NextResponse.json({
      ok: true,
      pedido_id: pedidoGenerado,
      mensaje: pedidoGenerado
        ? 'Suscripción cancelada. Tu último pedido fue generado automáticamente.'
        : 'Suscripción cancelada correctamente.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
