// ============================================================
// ContactGo — GET /api/cron/reporte-diario
// Envía por email a info@contactgo.net el reporte de ventas del día,
// todos los días a las 9:00pm hora de República Dominicana — incluso
// si no hubo ventas (se envía en cero, nunca se omite).
//
// Zona horaria: RD es UTC-4 todo el año (sin horario de verano).
// El cron corre a la 01:00 UTC, que equivale a las 21:00 (9pm) hora RD
// del mismo día calendario dominicano.
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const fmt = (n: number) => `RD$${Math.round(n).toLocaleString('es-DO')}`

export async function GET(req: Request) {
  // Protección: solo Vercel Cron puede llamar este endpoint
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()

  // ── Fecha de "hoy" en calendario dominicano (UTC-4, sin DST) ─────────────
  const drNow = new Date(Date.now() - 4 * 60 * 60 * 1000)
  const hoyDR = drNow.toISOString().slice(0, 10)
  const inicioDiaUTC = `${hoyDR}T04:00:00.000Z`
  const finDiaUTC = new Date(new Date(inicioDiaUTC).getTime() + 24 * 60 * 60 * 1000).toISOString()

  const fechaBonita = new Date(inicioDiaUTC).toLocaleDateString('es-DO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Santo_Domingo',
  })

  try {
    // ═══ 1. DINERO REAL COBRADO HOY (ingresos) ═══════════════════════════
    const { data: ingresosHoy } = await sb
      .from('cash_movements')
      .select('monto, metodo, categoria, descripcion, referencia')
      .eq('tipo', 'ingreso')
      .eq('fecha', hoyDR)

    const totalIngresos = (ingresosHoy ?? []).reduce((s, m) => s + Number(m.monto), 0)
    const porMetodo: Record<string, number> = {}
    for (const m of ingresosHoy ?? []) {
      const metodo = m.metodo ?? 'otro'
      porMetodo[metodo] = (porMetodo[metodo] ?? 0) + Number(m.monto)
    }

    // ═══ 2. EGRESOS HOY (gastos) ══════════════════════════════════════════
    const { data: egresosHoy } = await sb
      .from('cash_movements')
      .select('monto, categoria, descripcion')
      .eq('tipo', 'egreso')
      .eq('fecha', hoyDR)
    const totalEgresos = (egresosHoy ?? []).reduce((s, m) => s + Number(m.monto), 0)

    // ═══ 3. PEDIDOS GENERADOS HOY (nuevas órdenes, sin importar si ya se pagaron) ═══
    // es_prueba=false: evita que una compra de prueba tuya aparezca en tu
    // propio correo de ventas del día como si fuera un cliente real.
    const { data: pedidosHoy } = await sb
      .from('orders')
      .select('numero_orden, cliente_nombre, total, pago_estado, canal, created_at')
      .gte('created_at', inicioDiaUTC)
      .lt('created_at', finDiaUTC)
      .eq('es_prueba', false)
      .order('created_at', { ascending: true })

    const totalValorPedidosHoy = (pedidosHoy ?? []).reduce((s, o) => s + Number(o.total), 0)
    const pedidosPagados = (pedidosHoy ?? []).filter(o => o.pago_estado === 'pagado')
    const pedidosPendientesHoy = (pedidosHoy ?? []).filter(o => o.pago_estado === 'pendiente')

    // ═══ 4. PRODUCTOS VENDIDOS HOY (de los pedidos generados hoy) ═══════════
    const idsHoy = (pedidosHoy ?? []).map((o: any) => o.numero_orden)
    let productosVendidos: { nombre: string; cantidad: number; ingreso: number }[] = []
    if ((pedidosHoy?.length ?? 0) > 0) {
      const { data: ordersConId } = await sb
        .from('orders').select('id').gte('created_at', inicioDiaUTC).lt('created_at', finDiaUTC).eq('es_prueba', false)
      const orderIds = (ordersConId ?? []).map((o: any) => o.id)
      if (orderIds.length > 0) {
        const { data: items } = await sb
          .from('order_items')
          .select('nombre, cantidad, precio, order_id')
          .in('order_id', orderIds)
        const mapa: Record<string, { cantidad: number; ingreso: number }> = {}
        for (const it of items ?? []) {
          const key = it.nombre
          if (!mapa[key]) mapa[key] = { cantidad: 0, ingreso: 0 }
          mapa[key].cantidad += Number(it.cantidad ?? 1)
          mapa[key].ingreso += Number(it.precio ?? 0) * Number(it.cantidad ?? 1)
        }
        productosVendidos = Object.entries(mapa)
          .map(([nombre, v]) => ({ nombre, ...v }))
          .sort((a, b) => b.ingreso - a.ingreso)
      }
    }

    // ═══ 5. PENDIENTE POR COBRAR (acumulado, todos los pedidos pendientes) ═══
    const { data: pendientesTotal } = await sb
      .from('orders')
      .select('id, numero_orden, cliente_nombre, total, created_at')
      .eq('pago_estado', 'pendiente')
      .eq('es_prueba', false)
      .order('created_at', { ascending: true })

    const detallePendientes: { numero_orden: string; cliente: string; total: number; abonado: number; saldo: number; dias: number }[] = []
    for (const o of pendientesTotal ?? []) {
      const { data: pagos } = await sb.from('order_payments').select('monto').eq('order_id', o.id)
      const abonado = (pagos ?? []).reduce((s, p) => s + Number(p.monto), 0)
      const saldo = Number(o.total) - abonado
      const dias = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000)
      if (saldo > 0.5) {
        detallePendientes.push({ numero_orden: o.numero_orden, cliente: o.cliente_nombre, total: Number(o.total), abonado, saldo, dias })
      }
    }
    const totalPorCobrar = detallePendientes.reduce((s, p) => s + p.saldo, 0)

    // ═══ CONSTRUIR EMAIL ═══════════════════════════════════════════════════
    const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;background:#f9fafb">
  <div style="background:#0B3D66;padding:28px 24px;text-align:center">
    <p style="color:white;font-weight:900;font-size:22px;margin:0;letter-spacing:1px">CONTACTGO</p>
    <p style="color:#9CC5E8;font-size:13px;margin:6px 0 0;text-transform:capitalize">📊 Reporte de ventas · ${fechaBonita}</p>
  </div>

  <div style="padding:24px">

    <!-- RESUMEN FINANCIERO -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">💰 Dinero cobrado hoy</p>
      <p style="font-size:34px;font-weight:900;color:${totalIngresos > 0 ? '#15803D' : '#9CA3AF'};margin:0 0 4px">${fmt(totalIngresos)}</p>
      <p style="font-size:12px;color:#9CA3AF;margin:0 0 16px">${(ingresosHoy?.length ?? 0)} movimiento(s) de ingreso</p>
      ${Object.entries(porMetodo).length > 0 ? `
      <div style="border-top:1px solid #F3F4F6;padding-top:12px">
        ${Object.entries(porMetodo).map(([metodo, monto]) => `
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#374151;padding:3px 0">
            <span style="text-transform:capitalize">${metodo}</span><span style="font-weight:700">${fmt(monto)}</span>
          </div>`).join('')}
      </div>` : `<p style="font-size:13px;color:#9CA3AF;margin:0">Sin ingresos registrados hoy.</p>`}
      ${totalEgresos > 0 ? `
      <div style="border-top:1px solid #F3F4F6;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between">
        <span style="font-size:13px;color:#B91C1C">💸 Egresos del día</span>
        <span style="font-size:13px;color:#B91C1C;font-weight:700">-${fmt(totalEgresos)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px">
        <span style="font-size:13px;font-weight:700;color:#111">Neto del día</span>
        <span style="font-size:15px;font-weight:900;color:#0B3D66">${fmt(totalIngresos - totalEgresos)}</span>
      </div>` : ''}
    </div>

    <!-- PEDIDOS GENERADOS HOY -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">🛒 Pedidos generados hoy</p>
      <div style="display:flex;gap:16px;margin-bottom:14px">
        <div><p style="font-size:26px;font-weight:900;color:#111;margin:0">${pedidosHoy?.length ?? 0}</p><p style="font-size:11px;color:#9CA3AF;margin:0">pedidos nuevos</p></div>
        <div><p style="font-size:26px;font-weight:900;color:#111;margin:0">${fmt(totalValorPedidosHoy)}</p><p style="font-size:11px;color:#9CA3AF;margin:0">valor total</p></div>
        <div><p style="font-size:26px;font-weight:900;color:#15803D;margin:0">${pedidosPagados.length}</p><p style="font-size:11px;color:#9CA3AF;margin:0">ya pagados</p></div>
        <div><p style="font-size:26px;font-weight:900;color:#B45309;margin:0">${pedidosPendientesHoy.length}</p><p style="font-size:11px;color:#9CA3AF;margin:0">pendientes</p></div>
      </div>
      ${(pedidosHoy?.length ?? 0) > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <tr style="border-bottom:2px solid #F3F4F6">
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Orden</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Cliente</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Canal</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:right">Total</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:center">Estado</td>
        </tr>
        ${(pedidosHoy ?? []).map(o => `
        <tr style="border-bottom:1px solid #F9FAFB">
          <td style="padding:7px 4px;font-family:monospace;color:#374151">${o.numero_orden}</td>
          <td style="padding:7px 4px;color:#374151">${o.cliente_nombre ?? '—'}</td>
          <td style="padding:7px 4px;color:#6B7280;text-transform:capitalize">${o.canal ?? 'web'}</td>
          <td style="padding:7px 4px;text-align:right;font-weight:700;color:#111">${fmt(Number(o.total))}</td>
          <td style="padding:7px 4px;text-align:center">
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:${o.pago_estado === 'pagado' ? '#DCFCE7;color:#15803D' : '#FEF3C7;color:#B45309'}">${o.pago_estado === 'pagado' ? 'Pagado' : 'Pendiente'}</span>
          </td>
        </tr>`).join('')}
      </table>` : `<p style="font-size:13px;color:#9CA3AF;margin:0">No se generaron pedidos nuevos hoy.</p>`}
    </div>

    <!-- PRODUCTOS VENDIDOS HOY -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">📦 Productos vendidos hoy</p>
      ${productosVendidos.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <tr style="border-bottom:2px solid #F3F4F6">
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Producto</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:center">Cant.</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:right">Ingreso</td>
        </tr>
        ${productosVendidos.map(p => `
        <tr style="border-bottom:1px solid #F9FAFB">
          <td style="padding:7px 4px;color:#374151">${p.nombre}</td>
          <td style="padding:7px 4px;text-align:center;color:#374151">${p.cantidad}</td>
          <td style="padding:7px 4px;text-align:right;font-weight:700;color:#111">${fmt(p.ingreso)}</td>
        </tr>`).join('')}
      </table>` : `<p style="font-size:13px;color:#9CA3AF;margin:0">Sin productos vendidos hoy.</p>`}
    </div>

    <!-- PENDIENTE POR COBRAR (acumulado) -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px">⏳ Total pendiente por cobrar (acumulado)</p>
      <p style="font-size:26px;font-weight:900;color:${totalPorCobrar > 0 ? '#B45309' : '#9CA3AF'};margin:0 0 12px">${fmt(totalPorCobrar)}</p>
      ${detallePendientes.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <tr style="border-bottom:2px solid #F3F4F6">
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Orden</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700">Cliente</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:right">Saldo</td>
          <td style="padding:6px 4px;color:#9CA3AF;font-weight:700;text-align:center">Días</td>
        </tr>
        ${detallePendientes.slice(0, 15).map(p => `
        <tr style="border-bottom:1px solid #F9FAFB">
          <td style="padding:7px 4px;font-family:monospace;color:#374151">${p.numero_orden}</td>
          <td style="padding:7px 4px;color:#374151">${p.cliente ?? '—'}</td>
          <td style="padding:7px 4px;text-align:right;font-weight:700;color:#B45309">${fmt(p.saldo)}</td>
          <td style="padding:7px 4px;text-align:center;color:${p.dias > 7 ? '#B91C1C' : '#6B7280'}">${p.dias}d</td>
        </tr>`).join('')}
      </table>
      ${detallePendientes.length > 15 ? `<p style="font-size:11px;color:#9CA3AF;margin:8px 0 0">+ ${detallePendientes.length - 15} pedido(s) más pendiente(s)</p>` : ''}
      ` : `<p style="font-size:13px;color:#15803D;margin:0">✅ No hay pedidos pendientes de cobro.</p>`}
    </div>

    <p style="text-align:center;font-size:11px;color:#9CA3AF;margin:16px 0 0">
      Reporte automático diario · ContactGo® · <a href="https://www.contactgo.net/admin/pedidos" style="color:#0B3D66">Ver panel de pedidos</a>
    </p>
  </div>
</div>`

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'ContactGo Reportes <info@contactgo.net>',
      to: 'info@contactgo.net',
      subject: `📊 Ventas ${hoyDR} — ${fmt(totalIngresos)} cobrado · ${pedidosHoy?.length ?? 0} pedido(s)`,
      html,
    })

    return NextResponse.json({
      ok: true, fecha: hoyDR,
      total_ingresos: totalIngresos, pedidos_hoy: pedidosHoy?.length ?? 0,
      total_por_cobrar: totalPorCobrar,
    })
  } catch (err: any) {
    console.error('[reporte-diario]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
