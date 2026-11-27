import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Row = Record<string, any>

const TZ = 'America/Santo_Domingo'
const PAGE_SIZE = 1000
const fmt = (value: number) => 'RD$' + Math.round(Number(value || 0)).toLocaleString('es-DO')
const fmtShort = (value: number) => {
  const n = Number(value || 0)
  if (Math.abs(n) >= 1000000) return 'RD$' + (n / 1000000).toFixed(2) + ' MM'
  if (Math.abs(n) >= 1000) return 'RD$' + (n / 1000).toFixed(1) + ' mil'
  return fmt(n)
}
const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c] as string))
const sum = (rows: Row[], field = 'monto') => rows.reduce((total, row) => total + Number(row[field] || 0), 0)
const pct = (current: number, previous: number) => previous > 0 ? Math.round(((current - previous) / previous) * 100) : null

async function fetchAll<T>(makeQuery: () => any): Promise<T[]> {
  const result: T[] = []
  for (let offset = 0; offset < 100000; offset += PAGE_SIZE) {
    const { data, error } = await makeQuery().range(offset, offset + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    const page = (data ?? []) as T[]
    result.push(...page)
    if (page.length < PAGE_SIZE) return result
  }
  throw new Error('La consulta superó el límite de paginación del reporte.')
}

function dateLabel(value: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Date(value).toLocaleString('es-DO', { timeZone: TZ, ...options })
}
function daysAgo(value: string | null | undefined) {
  if (!value) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000))
}
function section(title: string, body: string) {
  return '<section style="background:#fff;border:1px solid #e7edf3;border-radius:14px;padding:19px 20px;margin:0 0 14px">' +
    '<h2 style="font-size:13px;line-height:1.3;letter-spacing:.45px;text-transform:uppercase;color:#002455;margin:0 0 13px;font-weight:800">' + title + '</h2>' +
    body + '</section>'
}
function metric(label: string, value: string, note = '', color = '#002455') {
  return '<div style="background:#f7f9fc;border:1px solid #edf1f5;border-radius:11px;padding:13px 12px;min-width:0">' +
    '<div style="font-size:20px;line-height:1.2;font-weight:850;color:' + color + '">' + value + '</div>' +
    '<div style="font-size:10px;letter-spacing:.35px;text-transform:uppercase;font-weight:750;color:#64748b;margin-top:5px">' + label + '</div>' +
    (note ? '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' + note + '</div>' : '') + '</div>'
}
function table(headers: string[], rows: string[][]) {
  const head = '<tr>' + headers.map(h => '<th style="text-align:left;padding:8px 7px;background:#f7f9fc;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.3px;border-bottom:1px solid #e8edf3">' + h + '</th>').join('') + '</tr>'
  const body = rows.length
    ? rows.map(row => '<tr>' + row.map((cell, i) => '<td style="padding:8px 7px;border-bottom:1px solid #f0f3f7;font-size:12px;color:#334155;vertical-align:top;' + (i === row.length - 1 ? 'text-align:right;font-weight:700;white-space:nowrap' : '') + '">' + cell + '</td>').join('') + '</tr>').join('')
    : '<tr><td colspan="' + headers.length + '" style="padding:13px 7px;color:#94a3b8;font-size:12px;text-align:center">Sin registros en este período.</td></tr>'
  return '<div style="overflow-x:auto"><table role="presentation" style="width:100%;border-collapse:collapse">' + head + body + '</table></div>'
}
function badge(text: string, color = '#475569', bg = '#f1f5f9') {
  return '<span style="display:inline-block;border-radius:20px;padding:3px 8px;font-size:10px;font-weight:750;color:' + color + ';background:' + bg + '">' + text + '</span>'
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== 'Bearer ' + secret) {
    return NextResponse.json({ error: 'No autorizado o CRON_SECRET no configurado' }, { status: 401 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Falta configuración de Supabase o Resend para el cierre diario.' }, { status: 500 })
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // República Dominicana: UTC-4 todo el año. Vercel ejecuta 01:00 UTC = 21:00 RD.
  const rdNow = new Date(Date.now() - 4 * 3600000)
  const today = rdNow.toISOString().slice(0, 10)
  const yesterday = new Date(Date.parse(today + 'T04:00:00.000Z') - 86400000).toISOString().slice(0, 10)
  const sevenDaysAgo = new Date(Date.parse(today + 'T04:00:00.000Z') - 7 * 86400000).toISOString().slice(0, 10)
  const dueLimit = new Date(Date.parse(today + 'T04:00:00.000Z') + 7 * 86400000).toISOString().slice(0, 10)
  const monthStart = today.slice(0, 7) + '-01'
  const startToday = new Date(today + 'T04:00:00.000Z')
  const startTomorrow = new Date(startToday.getTime() + 86400000)
  const startMonthISO = new Date(monthStart + 'T04:00:00.000Z').toISOString()
  const startTodayISO = startToday.toISOString()
  const startTomorrowISO = startTomorrow.toISOString()
  const startSevenDaysISO = new Date(startToday.getTime() - 7 * 86400000).toISOString()
  const dayOfMonth = Number(today.slice(8, 10))
  const dateTitle = dateLabel(startToday, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  try {
    // Idempotencia: evita duplicar el cierre si Vercel vuelve a invocar el cron.
    const { data: alreadySent, error: duplicateError } = await sb.from('email_log')
      .select('id').eq('template', 'reporte_diario').eq('status', 'sent')
      .gte('created_at', startTodayISO).lt('created_at', startTomorrowISO).limit(1).maybeSingle()
    if (duplicateError) throw new Error('No se pudo verificar si el cierre ya fue enviado: ' + duplicateError.message)
    if (alreadySent) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'reporte_diario_ya_enviado', fecha: today })
    }

    const [
      cashMonth, cashSevenDays, ordersMonth, deliveredMonthOrders, activeOrders, activeProducts,
      abandonedCarts, activeSubscriptions, leadsMonth, customersMonth,
      emailErrors, allPayments, allSalesMovements, paymentsMonth, paidOrdersByPaidAtMonth, testProductItems,
    ] = await Promise.all([
      fetchAll<Row>(() => sb.from('cash_movements').select('monto,order_id,order_payment_id,metodo,categoria,tipo,descripcion,fecha,created_at')
        .gte('fecha', monthStart).lte('fecha', today)),
      fetchAll<Row>(() => sb.from('cash_movements').select('monto,order_id,order_payment_id,metodo,categoria,tipo,fecha')
        .gte('fecha', sevenDaysAgo).lt('fecha', today)),
      fetchAll<Row>(() => sb.from('orders').select('id,numero_orden,cliente_nombre,total,subtotal,descuento,estado,pago_estado,canal,metodo_pago,created_at,updated_at,pagado_en,entregado_at')
        .eq('es_prueba', false).gte('created_at', startMonthISO).lt('created_at', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('orders').select('id,numero_orden,cliente_nombre,total,entregado_at')
        .eq('es_prueba', false).gte('entregado_at', startMonthISO).lt('entregado_at', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('orders').select('id,numero_orden,cliente_nombre,cliente_telefono,total,estado,pago_estado,canal,metodo_pago,created_at,updated_at,pagado_en')
        .eq('es_prueba', false).neq('estado', 'entregado').neq('estado', 'cancelado')),
      fetchAll<Row>(() => sb.from('products').select('id,nombre,stock,stock_minimo,stock_critico,stock_reorden,costo,activo,archivado')
        .eq('activo', true)),
      fetchAll<Row>(() => sb.from('abandoned_carts').select('id,total,created_at,recuperado')
        .eq('recuperado', false).gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())),
      fetchAll<Row>(() => sb.from('subscriptions').select('id,cliente_nombre,producto_nombre,proximo_envio,frecuencia')
        .eq('activa', true).eq('cancelada', false)),
      fetchAll<Row>(() => sb.from('calculator_leads').select('id,convertido,created_at')
        .gte('created_at', startMonthISO).lt('created_at', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('profiles').select('id,created_at')
        .eq('role', 'customer').gte('created_at', startMonthISO).lt('created_at', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('email_log').select('id,template,status,created_at')
        .gte('created_at', startSevenDaysISO).in('status', ['error', 'failed', 'bounced', 'rejected'])),
      fetchAll<Row>(() => sb.from('order_payments').select('monto,order_id,created_at')),
      fetchAll<Row>(() => sb.from('cash_movements').select('monto,order_id,order_payment_id')
        .eq('categoria', 'venta').eq('tipo', 'ingreso')),
      fetchAll<Row>(() => sb.from('order_payments').select('order_id,monto,created_at,metodo')
        .gte('created_at', startMonthISO).lt('created_at', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('orders').select('id,total,pagado_en,metodo_pago')
        .eq('pago_estado', 'pagado').eq('es_prueba', false)
        .gte('pagado_en', startMonthISO).lt('pagado_en', startTomorrowISO)),
      fetchAll<Row>(() => sb.from('order_items').select('order_id').eq('nombre', 'Producto de prueba')),
    ])

    const cashToday = cashMonth.filter(r => r.fecha === today && r.categoria === 'venta' && r.tipo === 'ingreso')
    const cashOutToday = sum(cashMonth.filter(r => r.fecha === today && r.tipo === 'egreso'))
    const cashOutMonth = sum(cashMonth.filter(r => r.tipo === 'egreso'))

    const testOrderIds = new Set((testProductItems ?? []).map((i: Row) => i.order_id).filter(Boolean))
    const cleanOrdersMonth = ordersMonth.filter(o => !testOrderIds.has(o.id))
    const cleanActiveOrders = activeOrders.filter(o => !testOrderIds.has(o.id))
    const ordersToday = cleanOrdersMonth.filter(o => o.created_at >= startTodayISO && o.created_at < startTomorrowISO)
    const validOrdersToday = ordersToday.filter(o => o.estado !== 'cancelado' && o.pago_estado !== 'declinado')
    const cancelledOrdersToday = ordersToday.filter(o => o.estado === 'cancelado')
    const cancelledOrdersMonth = cleanOrdersMonth.filter(o => o.estado === 'cancelado')
    const deliveredOrdersMonthClean = deliveredMonthOrders.filter(o => !testOrderIds.has(o.id))
    const deliveredOrdersToday = deliveredOrdersMonthClean.filter(o => o.entregado_at >= startTodayISO && o.entregado_at < startTomorrowISO)
    const deliveredValueToday = sum(deliveredOrdersToday, 'total')
    const deliveredValueMonth = sum(deliveredOrdersMonthClean, 'total')
    const validOrdersMonth = cleanOrdersMonth.filter(o => o.estado !== 'cancelado' && o.pago_estado !== 'declinado')
    const paidOrdersMonth = validOrdersMonth.filter(o => o.pago_estado === 'pagado')
    const orderValueToday = sum(validOrdersToday, 'total')
    const orderValueMonth = sum(validOrdersMonth, 'total')
    const paidOrderValueMonth = sum(paidOrdersMonth, 'total')

    const paymentTotalsByOrder: Record<string, number> = {}
    allPayments.forEach((p: Row) => { if (p.order_id) paymentTotalsByOrder[p.order_id] = (paymentTotalsByOrder[p.order_id] || 0) + Number(p.monto || 0) })
    const paymentsMonthClean = paymentsMonth.filter((p: Row) => !testOrderIds.has(p.order_id))
    const paymentsToday = paymentsMonthClean.filter((p: Row) => p.created_at >= startTodayISO && p.created_at < startTomorrowISO)
    const paidOrdersByPaidAtClean = paidOrdersByPaidAtMonth.filter((o: Row) => !testOrderIds.has(o.id))
    const gatewayRemaindersMonth = paidOrdersByPaidAtClean.map((o: Row) => ({
      order_id: o.id, monto: Math.max(0, Number(o.total || 0) - (paymentTotalsByOrder[o.id] || 0)),
      metodo: o.metodo_pago || 'Pasarela', created_at: o.pagado_en,
    })).filter((p: Row) => p.monto > 0)
    const gatewayRemaindersToday = gatewayRemaindersMonth.filter((p: Row) => p.created_at >= startTodayISO && p.created_at < startTomorrowISO)
    const standaloneSalesMonth = cashMonth.filter(r => r.categoria === 'venta' && r.tipo === 'ingreso' && !r.order_id && !r.order_payment_id)
    const standaloneSalesToday = standaloneSalesMonth.filter(r => r.fecha === today)
    const receiptsToday = [...paymentsToday, ...gatewayRemaindersToday, ...standaloneSalesToday]
    const receiptsMonth = [...paymentsMonthClean, ...gatewayRemaindersMonth, ...standaloneSalesMonth]
    const salesToday = sum(receiptsToday)
    const cashInMonth = sum(receiptsMonth)
    const paymentsYesterday = paymentsMonthClean.filter((p: Row) => p.created_at >= new Date(Date.parse(yesterday + 'T04:00:00.000Z')).toISOString() && p.created_at < startTodayISO)
    const gatewayRemaindersYesterday = gatewayRemaindersMonth.filter((p: Row) => p.created_at >= new Date(Date.parse(yesterday + 'T04:00:00.000Z')).toISOString() && p.created_at < startTodayISO)
    const standaloneSalesYesterday = cashSevenDays.filter(r => r.fecha === yesterday && r.categoria === 'venta' && r.tipo === 'ingreso' && !r.order_id)
    const salesYesterday = sum([...paymentsYesterday, ...gatewayRemaindersYesterday, ...standaloneSalesYesterday])
    const paymentsSevenDays = paymentsMonthClean.filter((p: Row) => p.created_at >= startSevenDaysISO && p.created_at < startTodayISO)
    const gatewayRemaindersSevenDays = gatewayRemaindersMonth.filter((p: Row) => p.created_at >= startSevenDaysISO && p.created_at < startTodayISO)
    const standaloneSalesSevenDays = cashSevenDays.filter(r => r.fecha >= sevenDaysAgo && r.fecha < today && r.categoria === 'venta' && r.tipo === 'ingreso' && !r.order_id)
    const salesSevenDays = sum([...paymentsSevenDays, ...gatewayRemaindersSevenDays, ...standaloneSalesSevenDays])
    const averageSevenDays = salesSevenDays / 7
    const orderIdsWithReceiptToday = new Set(receiptsToday.map((r: Row) => r.order_id).filter(Boolean))
    const receiptlessMovementsToday = standaloneSalesToday
    const unassignedMethodsToday = [...standaloneSalesToday.filter(r => !r.metodo), ...paymentsToday.filter((r: Row) => !r.metodo)]
    const avgReceiptPerOrder = orderIdsWithReceiptToday.size ? salesToday / orderIdsWithReceiptToday.size : 0
    const netToday = salesToday - cashOutToday
    const netMonth = cashInMonth - cashOutMonth
    const trendYesterday = pct(salesToday, salesYesterday)
    const trendSevenDays = pct(salesToday, averageSevenDays)

    // Cobros por método y ventas originadas por canal.
    const byMethod: Record<string, number> = {}
    receiptsToday.forEach((r: Row) => { const key = String(r.metodo || 'Sin método registrado'); byMethod[key] = (byMethod[key] || 0) + Number(r.monto || 0) })
    const methodRows = Object.entries(byMethod).sort((a, b) => b[1] - a[1])
      .map(([name, value]) => [esc(name), fmt(value)])
    const byChannel: Record<string, { count: number; value: number }> = {}
    validOrdersMonth.forEach(o => {
      const key = String(o.canal || 'Sin canal')
      if (!byChannel[key]) byChannel[key] = { count: 0, value: 0 }
      byChannel[key].count++
      byChannel[key].value += Number(o.total || 0)
    })
    const channelRows = Object.entries(byChannel).sort((a, b) => b[1].value - a[1].value)
      .map(([name, v]) => [esc(name), String(v.count), fmt(v.value)])

    // Cartera: saldo por pedido calculado contra los movimientos reales de caja.
    const activeIds = cleanActiveOrders.map(o => o.id)
    const activePayments: Row[] = []
    for (let i = 0; i < activeIds.length; i += 100) {
      const batch = activeIds.slice(i, i + 100)
      if (!batch.length) continue
      activePayments.push(...await fetchAll<Row>(() => sb.from('order_payments').select('order_id,monto')
        .in('order_id', batch)))
    }
    const collectedByOrder: Record<string, number> = {}
    activePayments.forEach(r => { collectedByOrder[r.order_id] = (collectedByOrder[r.order_id] || 0) + Number(r.monto || 0) })
    const openBalances: Row[] = cleanActiveOrders.map((o: Row): Row => {
      const paid = o.pago_estado === 'pagado' || o.pago_estado === 'declinado'
      const collected = collectedByOrder[o.id] || 0
      const balance = paid ? 0 : Math.max(0, Number(o.total || 0) - collected)
      return { ...o, collected, balance, stageDays: daysAgo(o.updated_at || o.created_at), ageDays: daysAgo(o.created_at) }
    }).filter((o: Row) => o.balance > 0.5).sort((a: Row, b: Row) => b.ageDays - a.ageDays)
    const receivables = openBalances.reduce((v, o) => v + o.balance, 0)
    const receivablesOver3 = openBalances.filter(o => o.ageDays > 3)
    const staleOrders: Row[] = cleanActiveOrders.map((o: Row): Row => ({ ...o, stageDays: daysAgo(o.updated_at || o.created_at) }))
      .filter((o: Row) => o.stageDays >= 3).sort((a: Row, b: Row) => b.stageDays - a.stageDays)
    const pipeline: Record<string, number> = {}
    cleanActiveOrders.forEach(o => { const key = String(o.estado || 'Sin etapa'); pipeline[key] = (pipeline[key] || 0) + 1 })
    const pipelineRows = Object.entries(pipeline).sort((a, b) => b[1] - a[1])
      .map(([stage, count]) => [esc(stage.replace(/_/g, ' ')), String(count)])

    // Productos: se separa demanda (pedidos creados hoy) de pedidos pagados del mes.
    const itemOrderIds = Array.from(new Set([...validOrdersToday.map(o => o.id), ...paidOrdersMonth.map(o => o.id)]))
    const items: Row[] = []
    for (let i = 0; i < itemOrderIds.length; i += 100) {
      const batch = itemOrderIds.slice(i, i + 100)
      if (!batch.length) continue
      items.push(...await fetchAll<Row>(() => sb.from('order_items').select('order_id,product_id,nombre,cantidad,precio,subtotal')
        .in('order_id', batch)))
    }
    const productIds = Array.from(new Set(items.map(i => i.product_id).filter(Boolean)))
    const costs: Row[] = []
    for (let i = 0; i < productIds.length; i += 100) {
      const batch = productIds.slice(i, i + 100)
      costs.push(...await fetchAll<Row>(() => sb.from('product_costs').select('product_id,costo_promedio')
        .in('product_id', batch)))
    }
    const productsById: Record<string, Row> = {}
    activeProducts.forEach(p => { productsById[p.id] = p })
    const costById: Record<string, number> = {}
    costs.forEach(c => { if (c.costo_promedio !== null && c.costo_promedio !== undefined) costById[c.product_id] = Number(c.costo_promedio) })
    const itemTotals = (sourceOrders: Row[]) => {
      const ids = new Set(sourceOrders.map(o => o.id))
      const grouped: Record<string, { name: string; units: number; revenue: number; cost: number; costUnits: number }> = {}
      items.filter(i => ids.has(i.order_id)).forEach(i => {
        const key = String(i.product_id || i.nombre)
        const units = Number(i.cantidad || 1)
        const revenue = Number(i.subtotal ?? (Number(i.precio || 0) * units))
        const product = i.product_id ? productsById[i.product_id] : null
        const unitCost = i.product_id && costById[i.product_id] !== undefined
          ? costById[i.product_id]
          : (product && product.costo !== null ? Number(product.costo) : null)
        if (!grouped[key]) grouped[key] = { name: String(i.nombre || 'Producto sin nombre'), units: 0, revenue: 0, cost: 0, costUnits: 0 }
        grouped[key].units += units
        grouped[key].revenue += revenue
        if (unitCost !== null && Number.isFinite(unitCost)) {
          grouped[key].cost += unitCost * units
          grouped[key].costUnits += units
        }
      })
      return Object.values(grouped).sort((a, b) => b.revenue - a.revenue)
    }
    const productsToday = itemTotals(validOrdersToday).slice(0, 8)
    const allProductsMonth = itemTotals(paidOrdersMonth)
    const productsMonth = allProductsMonth.slice(0, 10)
    const costCoveredUnits = allProductsMonth.reduce((v, p) => v + p.costUnits, 0)
    const totalMonthUnits = allProductsMonth.reduce((v, p) => v + p.units, 0)
    const productsWithCost = allProductsMonth.filter(p => p.costUnits > 0)
    const monthItemsRevenue = productsWithCost.reduce((v, p) => v + p.revenue, 0)
    const monthItemsCost = productsWithCost.reduce((v, p) => v + p.cost, 0)
    const estimatedGrossProfit = monthItemsRevenue - monthItemsCost

    // Inventario: usa el punto de reposición configurado por producto.
    const lowStock: Row[] = activeProducts.filter((p: Row) => !p.archivado).map((p: Row): Row => {
      const threshold = Number(p.stock_reorden ?? p.stock_minimo ?? p.stock_critico ?? 3)
      return { ...p, threshold }
    }).filter((p: Row) => Number(p.stock || 0) <= Number(p.threshold)).sort((a: Row, b: Row) => Number(a.stock) - Number(b.stock))

    // Indicadores comerciales y de retención.
    const abandonedValue = sum(abandonedCarts, 'total')
    const leadsConverted = leadsMonth.filter(l => l.convertido === true).length
    const leadConversion = leadsMonth.length ? Math.round(leadsConverted / leadsMonth.length * 100) : 0
    const subscriptionsDue = activeSubscriptions.filter(s => s.proximo_envio && s.proximo_envio <= dueLimit)
    const subscriptionsOverdue = subscriptionsDue.filter(s => s.proximo_envio < today)
    const subscriptionsNext7 = subscriptionsDue.filter(s => s.proximo_envio >= today)
    const cashSalesLifetime = sum(allSalesMovements)
    const paymentRowsLifetime = sum(allPayments)
    const reconciliationGap = cashSalesLifetime - paymentRowsLifetime
    const unlinkedSalesLifetime = allSalesMovements.filter(r => !r.order_id && !r.order_payment_id).length
    const unlinkedSalesAmount = sum(allSalesMovements.filter(r => !r.order_id && !r.order_payment_id))
    const todayUnlinkedAmount = sum(receiptlessMovementsToday)
    const todayMissingMethodAmount = sum(unassignedMethodsToday)
    const emailFailureCount = emailErrors.length
    const todayOrderRows = ordersToday.slice().sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(0, 12)
    const oldOrdersRows = staleOrders.slice(0, 15)
    const oldBalancesRows = openBalances.slice(0, 12)

    const trend = (value: number | null, label: string) => {
      if (value === null) return '<span style="font-size:11px;color:#94a3b8">Sin base comparable ' + label + '</span>'
      const up = value >= 0
      return badge((up ? '▲ ' : '▼ ') + Math.abs(value) + '% ' + label, up ? '#166534' : '#991b1b', up ? '#dcfce7' : '#fee2e2')
    }

    const executive = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px">' +
      metric('Cobrado hoy', fmt(salesToday), orderIdsWithReceiptToday.size + ' pedidos con cobro') +
      metric('Egresos registrados hoy', fmt(cashOutToday), 'Movimientos de caja', '#b91c1c') +
      metric('Flujo neto de caja', fmt(netToday), 'Cobros menos egresos', netToday >= 0 ? '#15803d' : '#b91c1c') +
      metric('Pedidos nuevos', String(validOrdersToday.length), 'Valor generado: ' + fmt(orderValueToday) + ' · cancelados: ' + cancelledOrdersToday.length) +
      metric('Entregados hoy', String(deliveredOrdersToday.length), 'Valor de pedidos: ' + fmt(deliveredValueToday), '#15803d') +
      metric('Cancelados hoy', String(cancelledOrdersToday.length), 'Mes: ' + cancelledOrdersMonth.length, cancelledOrdersToday.length ? '#b91c1c' : '#64748b') +
      metric('Cobro promedio por pedido', fmt(avgReceiptPerOrder), orderIdsWithReceiptToday.size + ' pedidos con cobro') +
      metric('Por cobrar', fmt(receivables), openBalances.length + ' pedidos con saldo', receivables > 0 ? '#b45309' : '#15803d') +
      metric('Pedidos atrasados', String(staleOrders.length), 'Sin actualización por 3 días o más', staleOrders.length ? '#b91c1c' : '#15803d') +
      '</div><div style="margin-top:12px;padding:12px 13px;background:#f7f9fc;border-radius:10px">' +
      '<div style="font-size:11px;color:#64748b;margin-bottom:7px">TENDENCIA DE COBROS</div>' +
      trend(trendYesterday, 'vs. ayer') + ' &nbsp; ' + trend(trendSevenDays, 'vs. promedio de 7 días') +
      '<div style="font-size:11px;color:#64748b;margin-top:8px">Promedio diario de cobros últimos 7 días: <strong style="color:#002455">' + fmt(averageSevenDays) + '</strong></div></div>'

    const monthSummary = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px">' +
      metric('Cobros acumulados', fmt(cashInMonth), 'Dinero ingresado en caja') +
      metric('Egresos acumulados', fmt(cashOutMonth), 'Gastos y compras registrados', '#b91c1c') +
      metric('Flujo neto del mes', fmt(netMonth), 'Cobros menos egresos', netMonth >= 0 ? '#15803d' : '#b91c1c') +
      metric('Pedidos registrados', String(validOrdersMonth.length), 'Valor no cancelado: ' + fmt(orderValueMonth)) +
      metric('Pedidos pagados', String(paidOrdersMonth.length), 'Total de pedidos: ' + fmt(paidOrderValueMonth)) +
      metric('Promedio diario cobrado', fmt(cashInMonth / Math.max(dayOfMonth, 1)), 'Mes hasta el día ' + dayOfMonth) +
      metric('Entregados este mes', String(deliveredMonthOrders.length), 'Valor entregado: ' + fmt(deliveredValueMonth), '#15803d') +
      metric('Pedidos cancelados', String(cancelledOrdersMonth.length), 'Pedidos creados este mes', cancelledOrdersMonth.length ? '#b91c1c' : '#64748b') +
      metric('Ganancia bruta estimada', fmt(estimatedGrossProfit), 'Sobre ' + fmt(monthItemsRevenue) + ' con costo registrado', '#15803d') +
      '</div><p style="font-size:10px;color:#94a3b8;margin:10px 0 0">No se muestra avance contra meta porque no hay una meta mensual configurada en el sistema.</p>'

    const productRows = productsMonth.map(p => [
      esc(p.name) + ' <span style="color:#94a3b8">×' + p.units + '</span>',
      fmt(p.revenue),
      p.costUnits > 0 ? fmt(p.revenue - p.cost) : badge('Costo sin dato', '#92400e', '#fef3c7'),
    ])
    const productSection = table(['Producto · unidades', 'Venta de pedidos pagados', 'Ganancia bruta estimada'], productRows) +
      '<p style="font-size:10px;color:#94a3b8;margin:9px 0 0">Productos de pedidos pagados creados este mes. El margen es una estimación con el costo promedio vigente del producto; no es utilidad neta ni costo histórico. Cobertura de costo: ' +
      costCoveredUnits + ' de ' + totalMonthUnits + ' unidades (' + (totalMonthUnits ? Math.round(costCoveredUnits / totalMonthUnits * 100) : 0) + '%).</p>'

    const todayProductsSection = productsToday.length
      ? table(['Producto pedido hoy', 'Unidades', 'Importe de artículos'], productsToday.map(p => [esc(p.name), String(p.units), fmt(p.revenue)])) +
        '<p style="font-size:10px;color:#94a3b8;margin:8px 0 0">Demanda de los pedidos creados hoy; no equivale necesariamente al efectivo cobrado hoy.</p>'
      : '<p style="font-size:12px;color:#94a3b8;margin:0">No hubo artículos en pedidos nuevos hoy.</p>'

    const pipelineSection = '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px">' +
      Object.entries(pipeline).sort((a, b) => b[1] - a[1]).map(([stage, count]) =>
        '<div style="padding:8px 10px;background:#f7f9fc;border-radius:9px;min-width:90px"><strong style="font-size:17px;color:#002455">' + count +
        '</strong><div style="font-size:10px;color:#64748b;text-transform:capitalize">' + esc(stage.replace(/_/g, ' ')) + '</div></div>').join('') +
      '</div>' + table(['Pedido / cliente', 'Etapa', 'Días sin cambio'], oldOrdersRows.map(o => [
        '<strong>' + esc(o.numero_orden) + '</strong><br>' + esc(o.cliente_nombre || 'Sin nombre'),
        esc(String(o.estado || '').replace(/_/g, ' ')),
        badge(o.stageDays + ' días', o.stageDays >= 15 ? '#991b1b' : '#92400e', o.stageDays >= 15 ? '#fee2e2' : '#fef3c7'),
      ])) +
      '<p style="font-size:10px;color:#94a3b8;margin:8px 0 0">Se considera atrasado un pedido activo sin actualización durante 3 días o más. El tiempo se calcula desde updated_at, no desde la fecha de creación. Se muestran ' + oldOrdersRows.length + ' de ' + staleOrders.length + ' pedidos atrasados.</p>'

    const receivablesSection = '<div style="display:flex;gap:9px;margin-bottom:12px">' +
      metric('Saldo pendiente', fmt(receivables), openBalances.length + ' pedidos') +
      metric('Con más de 3 días', fmt(receivablesOver3.reduce((v, o) => v + o.balance, 0)), receivablesOver3.length + ' pedidos', '#b91c1c') +
      '</div>' + table(['Pedido / cliente', 'Saldo', 'Antigüedad'], oldBalancesRows.map(o => [
        '<strong>' + esc(o.numero_orden) + '</strong><br>' + esc(o.cliente_nombre || 'Sin nombre') + '<br><span style="color:#94a3b8">' + esc(String(o.estado || '').replace(/_/g, ' ')) + '</span>',
        fmt(o.balance),
        o.ageDays + ' días',
      ])) + (openBalances.length > oldBalancesRows.length ? '<p style="font-size:10px;color:#94a3b8;margin:8px 0 0">Se muestran ' + oldBalancesRows.length + ' de ' + openBalances.length + ' pedidos con saldo.</p>' : '')

    const ordersTodaySection = table(['Pedido / hora', 'Estado', 'Total'], todayOrderRows.map(o => [
      '<strong>' + esc(o.numero_orden) + '</strong><br>' + esc(o.cliente_nombre || 'Sin nombre') + '<br><span style="color:#94a3b8">' + dateLabel(o.created_at, { hour: '2-digit', minute: '2-digit' }) + ' · ' + esc(o.canal || 'Sin canal') + '</span>',
      esc(String(o.estado || '').replace(/_/g, ' ')) + '<br>' + (o.pago_estado === 'pagado' ? badge('Pagado', '#166534', '#dcfce7') : badge('Pago ' + (o.pago_estado || 'pendiente'), '#92400e', '#fef3c7')),
      fmt(Number(o.total || 0)),
    ])) + (ordersToday.length > todayOrderRows.length ? '<p style="font-size:10px;color:#94a3b8;margin:8px 0 0">Se muestran ' + todayOrderRows.length + ' de ' + ordersToday.length + ' pedidos nuevos.</p>' : '')

    const lowStockSection = lowStock.length
      ? table(['Producto', 'Existencia', 'Punto de reposición'], lowStock.slice(0, 15).map(p => [
        esc(p.nombre), String(p.stock), String(p.threshold),
      ])) + (lowStock.length > 15 ? '<p style="font-size:10px;color:#94a3b8;margin:8px 0 0">Y ' + (lowStock.length - 15) + ' productos más.</p>' : '')
      : '<p style="font-size:12px;color:#15803d;margin:0">No hay productos activos en o por debajo de su punto de reposición configurado.</p>'

    const channelSection = table(['Canal', 'Pedidos', 'Valor generado'], channelRows)
    const methodSection = table(['Método de cobro', 'Cobrado hoy'], methodRows)
    const expenseCategories: Record<string, number> = {}
    cashMonth.filter(r => r.fecha === today && r.tipo === 'egreso').forEach(r => {
      const key = String(r.categoria || 'Sin categoría')
      expenseCategories[key] = (expenseCategories[key] || 0) + Number(r.monto || 0)
    })
    const expenseRows = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])
      .map(([name, value]) => [esc(name.replace(/_/g, ' ')), fmt(value)])
    const expenseSection = '<div style="margin-bottom:9px">' + table(['Categoría de egreso', 'Monto'], expenseRows) + '</div>' +
      '<p style="font-size:10px;color:#94a3b8;margin:0">Los egresos se toman de los movimientos tipo egreso de Caja. Solo se incluyen gastos y compras que estén registrados en el sistema.</p>'

    const commercialSection = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px">' +
      metric('Clientes nuevos este mes', String(customersMonth.length), 'Perfiles con rol cliente') +
      metric('Leads de calculadora', String(leadsMonth.length), 'Captados este mes') +
      metric('Leads convertidos', String(leadsConverted), 'Conversión: ' + leadConversion + '%', leadConversion >= 15 ? '#15803d' : '#002455') +
      metric('Carritos abandonados', String(abandonedCarts.length), 'Valor: ' + fmt(abandonedValue), abandonedCarts.length ? '#b45309' : '#15803d') +
      metric('Suscripciones activas', String(activeSubscriptions.length), 'Clientes en ciclo de reposición') +
      metric('Reposiciones vencidas', String(subscriptionsOverdue.length), 'Requieren seguimiento', subscriptionsOverdue.length ? '#b91c1c' : '#15803d') +
      metric('Reposiciones próximos 7 días', String(subscriptionsNext7.length), 'Suscripciones activas') +
      '</div>'

    const paidMonthIds = new Set(paidOrdersMonth.map(o => o.id))
    const testOrdersInMonth = ordersMonth.filter(o => testOrderIds.has(o.id))
    const dataWarnings: string[] = []
    if (testOrdersInMonth.length > 0) dataWarnings.push(testOrdersInMonth.length + ' pedido(s) con artículos llamados “Producto de prueba” están marcados como reales. Se excluyen de los indicadores; corrige su clasificación.')
    if (Math.abs(reconciliationGap) > 1) {
      dataWarnings.push('Diferencia histórica entre movimientos de caja de ventas y order_payments: ' + fmt(reconciliationGap) +
        '. Caja: ' + fmt(cashSalesLifetime) + '; order_payments: ' + fmt(paymentRowsLifetime) +
        '. Requiere conciliación; no debe interpretarse automáticamente como dinero faltante.')
    }
    if (unlinkedSalesLifetime > 0) {
      dataWarnings.push(unlinkedSalesLifetime + ' movimientos históricos de venta no están asociados a un pedido (' + fmt(unlinkedSalesAmount) + ').')
    }
    if (todayUnlinkedAmount > 0) dataWarnings.push('Hoy hay cobros sin pedido asociado por ' + fmt(todayUnlinkedAmount) + '.')
    if (todayMissingMethodAmount > 0) dataWarnings.push('Hoy hay cobros sin método de pago registrado por ' + fmt(todayMissingMethodAmount) + '.')
    if (emailFailureCount > 0) dataWarnings.push('Se registraron ' + emailFailureCount + ' errores/rechazos de correo en los últimos 7 días.')
    const qualitySection = dataWarnings.length
      ? '<ul style="margin:0;padding-left:18px">' + dataWarnings.map(w => '<li style="font-size:12px;line-height:1.55;color:#92400e;margin:0 0 7px">' + esc(w) + '</li>').join('') + '</ul>'
      : '<p style="font-size:12px;color:#15803d;margin:0">No se detectaron diferencias de conciliación ni incidencias de registro con las verificaciones incluidas.</p>'

    const html = '<!doctype html><html><body style="margin:0;padding:0;background:#eef2f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#172033">' +
      '<div style="max-width:760px;margin:0 auto;padding:18px 12px 30px">' +
      '<header style="background:#002455;border-radius:16px 16px 0 0;padding:25px 22px;color:#fff">' +
      '<div style="font-size:20px;font-weight:900;letter-spacing:1.2px">CONTACTGO</div>' +
      '<div style="font-size:12px;color:#c7d9ec;margin-top:6px;text-transform:capitalize">Cierre ejecutivo diario · ' + esc(dateTitle) + '</div>' +
      '<div style="font-size:10px;color:#a9c2dd;margin-top:4px">Generado ' + dateLabel(new Date(), { hour: '2-digit', minute: '2-digit' }) + ' · Hora de República Dominicana</div>' +
      '</header><main style="background:#f4f7fa;padding:16px 13px;border-radius:0 0 16px 16px">' +
      section('Resumen ejecutivo del día', executive) +
      section('Acumulado del mes', monthSummary) +
      section('Pedidos y cobros recibidos hoy', ordersTodaySection) +
      section('Cartera pendiente de cobro', receivablesSection) +
      section('Operación y retrasos por etapa', pipelineSection) +
      section('Productos más vendidos del mes', productSection) +
      section('Productos incluidos en pedidos nuevos hoy', todayProductsSection) +
      section('Canales de venta · pedidos creados este mes', channelSection) +
      section('Métodos de cobro de hoy', methodSection) +
      section('Gastos y salidas de caja', expenseSection) +
      section('Inventario y reposición', lowStockSection) +
      section('Clientes, marketing y recompra', commercialSection) +
      section('Calidad de datos y alertas', qualitySection) +
      '<div style="padding:12px 6px;text-align:center;color:#94a3b8;font-size:10px;line-height:1.6">' +
      'Reporte interno automático · ContactGo<br>' +
      '<a href="https://www.contactgo.net/M1Alexander" style="color:#006b8f;font-weight:800;text-decoration:none">Abrir panel administrativo seguro</a><br>' +
      'Las cifras reflejan los movimientos registrados en ContactGo; los movimientos no registrados no aparecen en este cierre.</div>' +
      '</main></div></body></html>'

    const subject = 'Cierre ContactGo · ' + fmt(salesToday) + ' cobrados · ' + ordersToday.length + ' pedidos nuevos · ' + staleOrders.length + ' atrasos'
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data: sent, error: sendError } = await resend.emails.send({
      from: 'ContactGo Cierre Diario <info@contactgo.net>',
      to: 'info@contactgo.net',
      subject,
      html,
    })

    if (sendError || !sent?.id) {
      const reason = sendError?.message || 'Resend no devolvió un identificador de mensaje.'
      await sb.from('email_log').insert({
        to_email: 'info@contactgo.net', subject, template: 'reporte_diario',
        status: 'error', resend_id: sent?.id ?? null,
      })
      console.error('[reporte-diario] envío fallido:', reason)
      return NextResponse.json({ error: 'No se pudo enviar el cierre diario.', detail: reason }, { status: 502 })
    }

    const { error: logError } = await sb.from('email_log').insert({
      to_email: 'info@contactgo.net', subject, template: 'reporte_diario',
      status: 'sent', resend_id: sent.id,
    })
    if (logError) console.error('[reporte-diario] correo enviado pero no se pudo guardar el log:', logError.message)

    return NextResponse.json({
      ok: true, fecha: today, resend_id: sent.id,
      cobrado_hoy: salesToday, egresos_hoy: cashOutToday, flujo_neto_hoy: netToday,
      pedidos_nuevos: ordersToday.length, pedidos_atrasados: staleOrders.length,
      por_cobrar: receivables, pedidos_con_saldo: openBalances.length,
    })
  } catch (error: any) {
    console.error('[reporte-diario]', error)
    return NextResponse.json({ error: error?.message || 'Error al generar el cierre diario.' }, { status: 500 })
  }
}
