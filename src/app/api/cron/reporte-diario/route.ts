// ============================================================
// ContactGo — GET /api/cron/reporte-diario
// Envía por email a info@contactgo.net el reporte de ventas del día,
// todos los días a las 9:00pm hora de República Dominicana — incluso
// si no hubo ventas (se envía en cero, nunca se omite).
//
// REDISEÑO (2026-08-13): Mario reportó que el reporte se veía "raro"
// y difícil de entender. El problema real: mezclaba 2 historias
// distintas como si fueran una — "dinero cobrado hoy" (cash_movements,
// puede incluir pagos de pedidos viejos) y "pedidos generados hoy"
// (orders, puede incluir pedidos aún sin pagar) — números que casi
// nunca coinciden exactamente, sin explicar por qué. Un gerente de
// ventas quiere UNA cifra clara arriba de todo con contexto (¿subió o
// bajó vs ayer?), no dos narrativas peleando por atención.
//
// Estructura nueva: Ventas del día (pedidos pagados hoy, una sola
// fuente de verdad) con tendencia vs ayer y vs promedio de 7 días →
// KPIs secundarios en una fila → avance del mes → top productos →
// pedidos del día → por cobrar (con los más viejos resaltados).
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
const fmtCorto = (n: number) => n >= 1000 ? `RD$${(n/1000).toFixed(1)}K` : fmt(n)

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()

  // ── Fechas clave en calendario dominicano (UTC-4, sin DST) ──────────────
  const drNow = new Date(Date.now() - 4 * 60 * 60 * 1000)
  const hoyDR = drNow.toISOString().slice(0, 10)
  const inicioHoyUTC = `${hoyDR}T04:00:00.000Z`
  const finHoyUTC = new Date(new Date(inicioHoyUTC).getTime() + 24 * 60 * 60 * 1000).toISOString()
  const inicioAyerUTC = new Date(new Date(inicioHoyUTC).getTime() - 24 * 60 * 60 * 1000).toISOString()
  const inicio7diasUTC = new Date(new Date(inicioHoyUTC).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const inicioMesUTC = `${hoyDR.slice(0, 7)}-01T04:00:00.000Z`
  const diaDelMes = new Date(inicioHoyUTC).getUTCDate()

  const fechaBonita = new Date(inicioHoyUTC).toLocaleDateString('es-DO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Santo_Domingo',
  })

  try {
    // ═══ 1. VENTAS DEL DÍA — única fuente de verdad: pedidos PAGADOS hoy ═══
    const { data: pagadosHoy } = await sb
      .from('orders').select('numero_orden, cliente_nombre, total, canal, pagado_en, created_at')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .gte('pagado_en', inicioHoyUTC).lt('pagado_en', finHoyUTC)
      .order('pagado_en', { ascending: true })

    const ventasHoy = (pagadosHoy ?? []).reduce((s, o) => s + Number(o.total), 0)
    const pedidosHoyCount = pagadosHoy?.length ?? 0
    const ticketPromedioHoy = pedidosHoyCount > 0 ? ventasHoy / pedidosHoyCount : 0

    // ── Comparativo: ayer y promedio de los últimos 7 días ──
    const { data: pagadosAyer } = await sb
      .from('orders').select('total')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .gte('pagado_en', inicioAyerUTC).lt('pagado_en', inicioHoyUTC)
    const ventasAyer = (pagadosAyer ?? []).reduce((s, o) => s + Number(o.total), 0)

    const { data: pagados7dias } = await sb
      .from('orders').select('total')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .gte('pagado_en', inicio7diasUTC).lt('pagado_en', inicioHoyUTC)
    const promedio7dias = (pagados7dias ?? []).reduce((s, o) => s + Number(o.total), 0) / 7

    const cambioVsAyer = ventasAyer > 0 ? Math.round(((ventasHoy - ventasAyer) / ventasAyer) * 100) : null
    const cambioVsPromedio = promedio7dias > 0 ? Math.round(((ventasHoy - promedio7dias) / promedio7dias) * 100) : null

    // ═══ 2. AVANCE DEL MES ══════════════════════════════════════════════════
    const { data: pagadosMes } = await sb
      .from('orders').select('total')
      .eq('pago_estado', 'pagado').eq('es_prueba', false)
      .gte('pagado_en', inicioMesUTC).lt('pagado_en', finHoyUTC)
    const ventasMes = (pagadosMes ?? []).reduce((s, o) => s + Number(o.total), 0)
    const pedidosMesCount = pagadosMes?.length ?? 0
    const promedioDiarioMes = diaDelMes > 0 ? ventasMes / diaDelMes : 0

    // ═══ 3. PRODUCTOS VENDIDOS HOY (+ costo y ganancia real del día) ═══════
    let productosVendidos: { nombre: string; cantidad: number; ingreso: number }[] = []
    let costoHoyReporte = 0
    if (pedidosHoyCount > 0) {
      const { data: ordersHoyIds } = await sb
        .from('orders').select('id')
        .eq('pago_estado', 'pagado').eq('es_prueba', false)
        .gte('pagado_en', inicioHoyUTC).lt('pagado_en', finHoyUTC)
      const orderIds = (ordersHoyIds ?? []).map((o: any) => o.id)
      if (orderIds.length > 0) {
        const { data: items } = await sb.from('order_items').select('nombre, cantidad, precio, product_id').in('order_id', orderIds)
        const mapa: Record<string, { cantidad: number; ingreso: number }> = {}
        const idsProductos = Array.from(new Set((items ?? []).map((i: any) => i.product_id).filter(Boolean)))
        const { data: costosProd } = idsProductos.length > 0
          ? await sb.from('products').select('id,costo').in('id', idsProductos)
          : { data: [] as any[] }
        const costoPorId: Record<string, number> = {}
        ;(costosProd ?? []).forEach((p: any) => { costoPorId[p.id] = Number(p.costo ?? 0) })
        for (const it of items ?? []) {
          if (!mapa[it.nombre]) mapa[it.nombre] = { cantidad: 0, ingreso: 0 }
          mapa[it.nombre].cantidad += Number(it.cantidad ?? 1)
          mapa[it.nombre].ingreso += Number(it.precio ?? 0) * Number(it.cantidad ?? 1)
          const costoUnit = it.product_id ? (costoPorId[it.product_id] ?? 0) : 0
          costoHoyReporte += costoUnit * Number(it.cantidad ?? 1)
        }
        productosVendidos = Object.entries(mapa).map(([nombre, v]) => ({ nombre, ...v })).sort((a, b) => b.ingreso - a.ingreso)
      }
    }
    const gananciaHoyReporte = ventasHoy - costoHoyReporte

    // ═══ 4. PEDIDOS NUEVOS DE HOY (generados, pagados o no — para contexto operativo) ═══
    const { data: pedidosNuevosHoy } = await sb
      .from('orders').select('numero_orden, cliente_nombre, total, pago_estado, canal, created_at')
      .gte('created_at', inicioHoyUTC).lt('created_at', finHoyUTC).eq('es_prueba', false)
      .order('created_at', { ascending: true })

    // ═══ 5. PENDIENTE POR COBRAR (acumulado) ═══════════════════════════════
    const { data: pendientesTotal } = await sb
      .from('orders').select('id, numero_orden, cliente_nombre, total, created_at')
      .eq('pago_estado', 'pendiente').eq('es_prueba', false)
      .order('created_at', { ascending: true })

    const detallePendientes: { numero_orden: string; cliente: string; saldo: number; dias: number }[] = []
    for (const o of pendientesTotal ?? []) {
      const { data: pagos } = await sb.from('order_payments').select('monto').eq('order_id', o.id)
      const abonado = (pagos ?? []).reduce((s, p) => s + Number(p.monto), 0)
      const saldo = Number(o.total) - abonado
      const dias = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000)
      if (saldo > 0.5) detallePendientes.push({ numero_orden: o.numero_orden, cliente: o.cliente_nombre, saldo, dias })
    }
    const totalPorCobrar = detallePendientes.reduce((s, p) => s + p.saldo, 0)
    const pendientesUrgentes = detallePendientes.filter(p => p.dias > 3)

    // ═══ CONSTRUIR EMAIL ═══════════════════════════════════════════════════
    const tendenciaBadge = (pct: number | null, label: string) => {
      if (pct === null) return ''
      const positivo = pct >= 0
      const color = positivo ? '#15803D' : '#B91C1C'
      const bg = positivo ? '#DCFCE7' : '#FEE2E2'
      const flecha = positivo ? '▲' : '▼'
      return `<span style="display:inline-block;font-size:12px;font-weight:800;color:${color};background:${bg};padding:3px 10px;border-radius:20px;margin-right:6px">${flecha} ${Math.abs(pct)}% ${label}</span>`
    }

    const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;background:#F3F4F6">
  <div style="background:linear-gradient(135deg,#002455,#01B2B7);padding:28px 24px;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0;letter-spacing:1px">CONTACTGO</p>
    <p style="color:#9CC5E8;font-size:13px;margin:6px 0 0;text-transform:capitalize">Reporte de ventas · ${fechaBonita}</p>
  </div>

  <div style="padding:20px">

    <!-- ═══ HERO: VENTAS DEL DÍA — la única cifra que importa arriba de todo ═══ -->
    <div style="background:white;border-radius:16px;padding:26px 24px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,0.07);text-align:center">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.6px;margin:0 0 8px">Ventas de hoy</p>
      <p style="font-size:44px;font-weight:900;color:${ventasHoy > 0 ? '#002455' : '#9CA3AF'};margin:0;line-height:1">${fmt(ventasHoy)}</p>
      <p style="font-size:13px;color:#6B7280;margin:8px 0 14px">${pedidosHoyCount} pedido${pedidosHoyCount === 1 ? '' : 's'} pagado${pedidosHoyCount === 1 ? '' : 's'} · ticket promedio ${fmt(ticketPromedioHoy)}</p>
      <div>${tendenciaBadge(cambioVsAyer, 'vs. ayer')}${tendenciaBadge(cambioVsPromedio, 'vs. promedio 7 días')}</div>
    </div>

    <!-- ═══ KPIs secundarios en fila ═══ -->
    <div style="display:flex;gap:10px;margin-bottom:14px">
      <div style="flex:1;background:white;border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <p style="font-size:20px;font-weight:900;color:#111;margin:0">${pedidosNuevosHoy?.length ?? 0}</p>
        <p style="font-size:10px;color:#9CA3AF;margin:2px 0 0;text-transform:uppercase;font-weight:600">Pedidos nuevos hoy</p>
      </div>
      <div style="flex:1;background:white;border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <p style="font-size:20px;font-weight:900;color:${totalPorCobrar > 0 ? '#B45309' : '#15803D'};margin:0">${fmtCorto(totalPorCobrar)}</p>
        <p style="font-size:10px;color:#9CA3AF;margin:2px 0 0;text-transform:uppercase;font-weight:600">Por cobrar total</p>
      </div>
      <div style="flex:1;background:white;border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <p style="font-size:20px;font-weight:900;color:${pendientesUrgentes.length > 0 ? '#B91C1C' : '#15803D'};margin:0">${pendientesUrgentes.length}</p>
        <p style="font-size:10px;color:#9CA3AF;margin:2px 0 0;text-transform:uppercase;font-weight:600">Cobros +3 días</p>
      </div>
    </div>

    <!-- ═══ COSTO Y GANANCIA DEL DÍA ═══ -->
    <div style="display:flex;gap:10px;margin-bottom:14px">
      <div style="flex:1;background:white;border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <p style="font-size:20px;font-weight:900;color:#B91C1C;margin:0">${fmtCorto(costoHoyReporte)}</p>
        <p style="font-size:10px;color:#9CA3AF;margin:2px 0 0;text-transform:uppercase;font-weight:600">Costo de hoy</p>
      </div>
      <div style="flex:1;background:white;border-radius:14px;padding:16px 12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <p style="font-size:20px;font-weight:900;color:#15803D;margin:0">${fmtCorto(gananciaHoyReporte)}</p>
        <p style="font-size:10px;color:#9CA3AF;margin:2px 0 0;text-transform:uppercase;font-weight:600">Ganancia de hoy</p>
      </div>
    </div>

    <!-- ═══ AVANCE DEL MES ═══ -->
    <div style="background:white;border-radius:14px;padding:18px 20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;justify-content:space-between;align-items:center">
      <div>
        <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px">Este mes (día ${diaDelMes})</p>
        <p style="font-size:22px;font-weight:900;color:#002455;margin:0">${fmt(ventasMes)}</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:11px;color:#9CA3AF;margin:0 0 4px">${pedidosMesCount} pedidos · promedio</p>
        <p style="font-size:15px;font-weight:700;color:#374151;margin:0">${fmt(promedioDiarioMes)}/día</p>
      </div>
    </div>

    <!-- ═══ PRODUCTOS VENDIDOS HOY ═══ -->
    ${productosVendidos.length > 0 ? `
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">📦 Qué se vendió hoy</p>
      ${productosVendidos.map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #F9FAFB">
        <span style="font-size:13px;color:#374151;flex:1">${p.nombre} <span style="color:#9CA3AF">×${p.cantidad}</span></span>
        <span style="font-size:13px;font-weight:700;color:#111">${fmt(p.ingreso)}</span>
      </div>`).join('')}
    </div>` : ''}

    <!-- ═══ PEDIDOS DE HOY (detalle operativo) ═══ -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">🛒 Pedidos de hoy</p>
      ${(pedidosNuevosHoy?.length ?? 0) > 0 ? (pedidosNuevosHoy ?? []).map(o => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #F9FAFB">
        <div style="flex:1;min-width:0">
          <p style="font-size:13px;font-weight:600;color:#111;margin:0">${o.cliente_nombre ?? '—'}</p>
          <p style="font-size:11px;color:#9CA3AF;margin:1px 0 0;font-family:monospace">${o.numero_orden} · <span style="text-transform:capitalize">${o.canal ?? 'web'}</span></p>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <p style="font-size:13px;font-weight:700;color:#111;margin:0">${fmt(Number(o.total))}</p>
          <span style="font-size:10px;font-weight:700;padding:1px 8px;border-radius:10px;background:${o.pago_estado === 'pagado' ? '#DCFCE7' : '#FEF3C7'};color:${o.pago_estado === 'pagado' ? '#15803D' : '#B45309'}">${o.pago_estado === 'pagado' ? 'Pagado' : 'Pendiente'}</span>
        </div>
      </div>`).join('') : `<p style="font-size:13px;color:#9CA3AF;margin:0">No se generaron pedidos nuevos hoy.</p>`}
    </div>

    <!-- ═══ POR COBRAR (acumulado, con urgentes resaltados) ═══ -->
    <div style="background:white;border-radius:14px;padding:20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <p style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px">⏳ Pendiente por cobrar</p>
      ${detallePendientes.length > 0 ? detallePendientes
        .sort((a, b) => b.dias - a.dias)
        .slice(0, 12)
        .map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #F9FAFB">
        <div>
          <p style="font-size:13px;color:#374151;margin:0">${p.cliente ?? '—'}</p>
          <p style="font-size:11px;color:#9CA3AF;margin:1px 0 0;font-family:monospace">${p.numero_orden}</p>
        </div>
        <div style="text-align:right">
          <p style="font-size:13px;font-weight:700;color:#B45309;margin:0">${fmt(p.saldo)}</p>
          <p style="font-size:11px;font-weight:700;margin:1px 0 0;color:${p.dias > 3 ? '#B91C1C' : '#9CA3AF'}">${p.dias} día${p.dias === 1 ? '' : 's'}${p.dias > 3 ? ' ⚠️' : ''}</p>
        </div>
      </div>`).join('')
        : `<p style="font-size:13px;color:#15803D;margin:0">✅ No hay pedidos pendientes de cobro — todo al día.</p>`}
      ${detallePendientes.length > 12 ? `<p style="font-size:11px;color:#9CA3AF;margin:10px 0 0;text-align:center">+ ${detallePendientes.length - 12} pedido(s) más — ver panel completo</p>` : ''}
    </div>

    <p style="text-align:center;font-size:11px;color:#9CA3AF;margin:16px 0 0">
      Reporte automático diario · ContactGo® · <a href="https://www.contactgo.net/admin" style="color:#002455;font-weight:600">Ver panel de administración →</a>
    </p>
  </div>
</div>`

    const asuntoTendencia = cambioVsAyer !== null ? (cambioVsAyer >= 0 ? `▲${cambioVsAyer}%` : `▼${Math.abs(cambioVsAyer)}%`) : ''
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'ContactGo Reportes <info@contactgo.net>',
      to: 'info@contactgo.net',
      subject: `${fmt(ventasHoy)} en ventas hoy ${asuntoTendencia ? `(${asuntoTendencia} vs ayer)` : ''} · ${pedidosHoyCount} pedido(s) pagado(s)`,
      html,
    })

    // ── Resumen también por WhatsApp al número de servicio ────────────────
    // Mario pidió recibirlo también ahí. Este número (809-694-2268) NUNCA
    // procesa mensajes entrantes de forma automática (protección aparte en
    // el webhook) — esto es distinto: es SOLO un mensaje saliente de
    // administración hacia Mario, mismo patrón ya usado para
    // aviso_nuevo_mensaje_admin. No toca nada del trato con clientes.
    try {
      const WA_API = 'https://graph.facebook.com/v20.0'
      await fetch(`${WA_API}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: '18096942268',
          type: 'template',
          template: {
            name: 'reporte_diario_ventas',
            language: { code: 'es' },
            components: [{
              type: 'body',
              parameters: [
                { type: 'text', text: fmt(ventasHoy) },
                { type: 'text', text: asuntoTendencia || 'sin datos de ayer' },
                { type: 'text', text: String(pedidosHoyCount) },
                { type: 'text', text: fmt(totalPorCobrar) },
              ],
            }],
          },
        }),
      })
    } catch (e) {
      console.error('[reporte-diario] WhatsApp falló (el email ya se mandó):', e)
    }

    return NextResponse.json({
      ok: true, fecha: hoyDR,
      ventas_hoy: ventasHoy, pedidos_hoy: pedidosHoyCount,
      ventas_mes: ventasMes, total_por_cobrar: totalPorCobrar,
    })
  } catch (err: any) {
    console.error('[reporte-diario]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
