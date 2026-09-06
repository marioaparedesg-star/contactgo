'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, ShoppingBag, Users, RefreshCw,
  Package, Truck, CheckCircle, Clock, CreditCard,
  ArrowRight, AlertTriangle, Calendar, ChevronDown
} from 'lucide-react'

const ESTADO_COLOR: Record<string,string> = {
  pendiente:  'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  preparando: 'bg-purple-100 text-purple-700',
  enviado:    'bg-indigo-100 text-indigo-700',
  entregado:  'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
}

// ═══════════════════════════════════════════════════════════════
// SELECTOR DE RANGO DE FECHAS — nuevo
// Cada preset calcula { desde, hasta } en hora local de RD.
// 'trimestre' = últimos 3 meses corridos (más útil para un negocio
// pequeño que el trimestre calendario Q1/Q2/Q3/Q4).
// ═══════════════════════════════════════════════════════════════
type PresetKey = 'hoy' | 'mes_actual' | 'mes_anterior' | 'trimestre' | 'anio_actual' | 'anio_anterior' | 'personalizado'

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'hoy',            label: 'Hoy' },
  { key: 'mes_actual',     label: 'Mes actual' },
  { key: 'mes_anterior',   label: 'Mes anterior' },
  { key: 'trimestre',      label: 'Últimos 3 meses' },
  { key: 'anio_actual',    label: 'Año actual' },
  { key: 'anio_anterior',  label: 'Año anterior' },
  { key: 'personalizado',  label: 'Fecha personalizada' },
]

function rangoDePreset(preset: PresetKey, customDesde?: string, customHasta?: string): { desde: Date; hasta: Date; label: string } {
  const ahora = new Date()
  const hoy0 = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0)
  const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59)

  switch (preset) {
    case 'hoy':
      return { desde: hoy0, hasta: finHoy, label: 'Hoy' }
    case 'mes_actual':
      return { desde: new Date(ahora.getFullYear(), ahora.getMonth(), 1), hasta: finHoy, label: 'Mes actual' }
    case 'mes_anterior': {
      const desde = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
      const hasta = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59)
      return { desde, hasta, label: desde.toLocaleDateString('es-DO', { month: 'long', year: 'numeric' }) }
    }
    case 'trimestre':
      return { desde: new Date(ahora.getFullYear(), ahora.getMonth() - 2, 1), hasta: finHoy, label: 'Últimos 3 meses' }
    case 'anio_actual':
      return { desde: new Date(ahora.getFullYear(), 0, 1), hasta: finHoy, label: `Año ${ahora.getFullYear()}` }
    case 'anio_anterior': {
      const y = ahora.getFullYear() - 1
      return { desde: new Date(y, 0, 1), hasta: new Date(y, 11, 31, 23, 59, 59), label: `Año ${y}` }
    }
    case 'personalizado':
      return {
        desde: customDesde ? new Date(customDesde + 'T00:00:00') : hoy0,
        hasta: customHasta ? new Date(customHasta + 'T23:59:59') : finHoy,
        label: customDesde && customHasta
          ? `${new Date(customDesde).toLocaleDateString('es-DO')} — ${new Date(customHasta).toLocaleDateString('es-DO')}`
          : 'Personalizado',
      }
  }
}

export default function AdminDashboard() {
  const sb = createClient()
  const router = useRouter()
  const [data, setData]       = useState<any>(null)
  const [recent, setRecent]   = useState<any[]>([])
  const [top, setTop]         = useState<any[]>([])
  const [stock, setStock]     = useState<any[]>([])
  const [chartRaw, setChartRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(new Date())
  // Detalle clickeable: qué tarjeta está expandida (o null si ninguna) y
  // la lista de pedidos que componen esa cifra, con su cobrado real y su
  // saldo pendiente, para que Mario pueda ver a quién le cobró qué.
  const [detalleAbierto, setDetalleAbierto] = useState<null | 'hoy' | 'periodo' | 'ganancia' | 'porCobrar' | 'etapa'>(null)
  const [detalleOrdenes, setDetalleOrdenes] = useState<any[]>([])
  const [etapaAbierta, setEtapaAbierta] = useState<string | null>(null)
  const [pedidosEtapa, setPedidosEtapa] = useState<any[]>([])
  const [cargandoEtapa, setCargandoEtapa] = useState(false)
  const [navMovilAbierto, setNavMovilAbierto] = useState(false)
  const [ordenProductos, setOrdenProductos] = useState<'unidades'|'facturacion'>('unidades')

  // ── Estado del selector de fechas ──
  const [preset, setPreset] = useState<PresetKey>('mes_actual')
  const [customDesde, setCustomDesde] = useState('')
  const [customHasta, setCustomHasta] = useState('')
  const [selectorAbierto, setSelectorAbierto] = useState(false)

  const rango = useMemo(() => rangoDePreset(preset, customDesde, customHasta), [preset, customDesde, customHasta])

  const fmt = (n:number) => `RD$${Math.round(n).toLocaleString('es-DO')}`
  const hoy = new Date().toLocaleDateString('es-DO',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  const cargar = async () => {
    setLoading(true)
    const desdeISO = rango.desde.toISOString()
    const hastaISO = rango.hasta.toISOString()
    // "Hoy" siempre se muestra aparte, sin importar el rango elegido —
    // es información operativa del día, no del análisis histórico.
    const hoy0ISO = new Date(new Date().setHours(0,0,0,0)).toISOString()

    // FIX DE FONDO (2026-09-04): antes "Cobrado" agrupaba el dinero por la
    // fecha de CREACIÓN del pedido — un pedido creado en agosto que recibe
    // un abono HOY contaba como "venta de agosto", mientras que Caja
    // (cash_movements) correctamente lo cuenta como cobro de hoy. Por eso
    // los números nunca cuadraban entre pantallas. Ahora "Cobrado" se lee
    // directo de cash_movements (categoría 'venta'), agrupado por la fecha
    // real en que entró el dinero — la misma fuente que ya usa Caja y el
    // ERP Dashboard.
    //
    // FIX (2026-09-05): "hoyStr" antes usaba toLocaleDateString('en-CA'),
    // que toma la fecha del RELOJ/ZONA HORARIA DEL DISPOSITIVO que carga
    // el dashboard — si el celular estuviera mal configurado (viajando,
    // fecha/hora automática desactivada), "Cobrado hoy" mostraría el día
    // equivocado sin avisar. Ahora se calcula con un offset fijo de RD
    // (UTC-4, sin horario de verano) a partir del timestamp real, igual
    // que ya hace el reporte diario por email — no depende del dispositivo.
    const fechaRD = (d: Date) => new Date(d.getTime() - 4 * 3600000).toISOString().slice(0, 10)
    const desdeStr = fechaRD(rango.desde)
    const hastaStr = fechaRD(rango.hasta)
    const hoyStr   = fechaRD(new Date())

    const [periodo, ordRecent, stockLow, cobrosPeriodo] = await Promise.all([
      sb.from('orders').select('id,total,estado,fecha,metodo_pago,pago_estado,created_at,numero_orden,cliente_nombre,cliente_telefono')
        .not('estado','eq','cancelado').eq('es_prueba', false)
        .gte('fecha', desdeISO).lte('fecha', hastaISO),
      sb.from('orders').select('id,numero_orden,cliente_nombre,total,estado,metodo_pago,pago_estado,created_at')
        .not('pago_estado','eq','declinado').eq('es_prueba', false)
        .order('created_at',{ascending:false}).limit(8),
      sb.from('products').select('nombre,stock,tipo').eq('activo',true).lte('stock',3).order('stock'),
      sb.from('cash_movements')
        .select('id,monto,fecha,created_at,order_id,referencia,descripcion,orders(numero_orden,cliente_nombre,cliente_telefono)')
        .eq('categoria','venta').eq('tipo','ingreso')
        .gte('fecha', desdeStr).lte('fecha', hastaStr),
    ])

    const ords = periodo.data ?? []
    const cobros = cobrosPeriodo.data ?? []
    const cobrosHoy = cobros.filter((c:any) => c.fecha === hoyStr)

    const ventasPeriodo  = cobros.reduce((s:number,c:any)=>s+Number(c.monto??0),0)
    const ventasHoy      = cobrosHoy.reduce((s:number,c:any)=>s+Number(c.monto??0),0)
    const ticketProm     = cobros.length > 0 ? ventasPeriodo/cobros.length : 0
    const entregados     = ords.filter((o:any)=>o.estado==='entregado').length
    const conversion     = ords.length > 0 ? Math.round((entregados/ords.length)*100) : 0

    // Por cobrar: esto SÍ sigue basado en pedidos (no en cash_movements) —
    // es sobre saldo pendiente de ÓRDENES activas, no sobre cuándo entró
    // el dinero. Necesita su propio cálculo de abonos por pedido.
    const { data: abonosData } = await sb.from('order_payments').select('order_id,monto')
    const abonosPorOrden: Record<string, number> = {}
    ;(abonosData ?? []).forEach((a: any) => {
      abonosPorOrden[a.order_id] = (abonosPorOrden[a.order_id] ?? 0) + Number(a.monto ?? 0)
    })
    const cobradoDeOrden = (o: any) => o.pago_estado === 'pagado' ? Number(o.total ?? 0) : (abonosPorOrden[o.id] ?? 0)

    const hace30d = new Date(Date.now() - 30*86400000)
    let porCobrarActivo = 0, porCobrarViejo = 0, pedidosPorCobrar = 0
    ords.forEach((o:any) => {
      const saldo = Number(o.total ?? 0) - cobradoDeOrden(o)
      if (saldo <= 0) return
      pedidosPorCobrar++
      if (new Date(o.created_at) >= hace30d) porCobrarActivo += saldo
      else porCobrarViejo += saldo
    })

    // ── Costo y ganancia real del período (y de hoy) ──────────────────────
    // Mismo conjunto de transacciones que ya cuenta como "Cobrado" arriba
    // (cash_movements), no el de pedidos creados en el rango — para que
    // Costo y Ganancia cuadren exactamente contra Cobrado.
    const idsConCobro = Array.from(new Set(cobros.map((c:any) => c.order_id).filter(Boolean)))
    const { data: itemsData } = idsConCobro.length > 0
      ? await sb.from('order_items')
          .select('nombre,cantidad,precio,product_id,order_id')
          .in('order_id', idsConCobro)
          .limit(1000)
      : { data: [] as any[] }
    const items = { data: itemsData }

    // Se cruza cada item vendido contra el costo REAL actual del producto
    // (products.costo). No se guarda un "snapshot" histórico del costo al
    // momento de la venta — usa el costo vigente ahora. Es una aproximación
    // razonable mientras los costos no cambien todos los días, pero vale
    // la pena saberlo: una venta de hace 2 meses con un costo que ya
    // actualizamos, se recalcula con el costo de HOY, no el de ese momento.
    const productIds = Array.from(new Set((items.data ?? []).map((i:any) => i.product_id).filter(Boolean)))
    const { data: costosProductos } = productIds.length > 0
      ? await sb.from('products').select('id,costo').in('id', productIds)
      : { data: [] as any[] }
    const costoPorId: Record<string, number> = {}
    ;(costosProductos ?? []).forEach((p:any) => { costoPorId[p.id] = Number(p.costo ?? 0) })

    let costoTotalPeriodo = 0
    ;(items.data ?? []).forEach((i:any) => {
      const costoUnit = i.product_id ? (costoPorId[i.product_id] ?? 0) : 0
      costoTotalPeriodo += costoUnit * Number(i.cantidad ?? 1)
    })
    const gananciaPeriodo = ventasPeriodo - costoTotalPeriodo

    // Costo/ganancia de HOY: mismo cruce pero solo con los items de los
    // pedidos que tuvieron algún cobro HOY (no de pedidos creados hoy).
    const idsHoy = new Set(cobrosHoy.map((c:any) => c.order_id).filter(Boolean))
    let costoHoy = 0
    ;(items.data ?? []).forEach((i:any) => {
      if (!idsHoy.has(i.order_id)) return
      const costoUnit = i.product_id ? (costoPorId[i.product_id] ?? 0) : 0
      costoHoy += costoUnit * Number(i.cantidad ?? 1)
    })
    const gananciaHoy = ventasHoy - costoHoy

    const agg: Record<string,{nombre:string,u:number,rev:number}> = {}
    ;(items.data??[]).forEach((i:any)=>{
      if(!agg[i.nombre]) agg[i.nombre]={nombre:i.nombre,u:0,rev:0}
      agg[i.nombre].u   += Number(i.cantidad??1)
      agg[i.nombre].rev += Number(i.precio??0)*Number(i.cantidad??1)
    })
    const topProds = Object.values(agg).sort((a,b)=>b.u-a.u).slice(0,10)

    const { count: clientes } = await sb.from('profiles').select('*',{count:'exact',head:true}).eq('role','customer')

    const { data: invStats } = await sb.from('v_stock_disponible').select('id,nombre,tipo,stock,stock_minimo,stock_critico,stock_reorden,alerta_stock,precio')
    const invAll = invStats ?? []
    const invCriticos   = invAll.filter((p:any) => p.alerta_stock === 'critico').length
    const invBajoMin    = invAll.filter((p:any) => p.alerta_stock === 'bajo_minimo').length

    // ── OPERACIÓN: pedidos activos por etapa (todo lo que no es entregado
    // ni cancelado — el flujo real de "qué hay que atender hoy") ──────────
    const { data: pedidosActivosData } = await sb
      .from('orders').select('estado')
      .not('estado','in','(entregado,cancelado)').eq('es_prueba', false)
    const porEtapa: Record<string, number> = {}
    ;(pedidosActivosData ?? []).forEach((o:any) => { porEtapa[o.estado] = (porEtapa[o.estado] ?? 0) + 1 })

    // ── MARKETING: leads de la calculadora + conversión real ──────────────
    const inicioMesStr = fechaRD(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [{ data: leadsHoyData }, { data: leadsMesData }] = await Promise.all([
      sb.from('calculator_leads').select('id').gte('created_at', hoyStr),
      sb.from('calculator_leads').select('id, telefono').gte('created_at', inicioMesStr),
    ])
    const leadsHoy = leadsHoyData?.length ?? 0
    const leadsMes = leadsMesData?.length ?? 0
    // Conversión real: cruce de teléfono normalizado contra pedidos del mes
    // (el flag 'convertido' en la tabla nunca se actualiza — ver pendiente
    // ya anotado). Se normaliza a los últimos 10 dígitos para no perder
    // coincidencias por el formato +1/1 delante que a veces trae 'orders'.
    let leadsConvertidos = 0
    if ((leadsMesData ?? []).length > 0) {
      const telsLeads = new Set((leadsMesData ?? []).map((l:any) => String(l.telefono ?? '').replace(/\D/g,'').slice(-10)).filter(Boolean))
      const { data: ordsDelMes } = await sb.from('orders').select('cliente_telefono').gte('created_at', inicioMesStr).eq('es_prueba', false)
      const telsConCompra = new Set((ordsDelMes ?? []).map((o:any) => String(o.cliente_telefono ?? '').replace(/\D/g,'').slice(-10)))
      telsLeads.forEach(t => { if (telsConCompra.has(t)) leadsConvertidos++ })
    }
    const conversionLeadsPct = leadsMes > 0 ? Math.round((leadsConvertidos / leadsMes) * 100) : 0

    // Detalle por cobro real — para las tarjetas clickeables. Una fila por
    // cada pago/abono realmente recibido (no una fila por pedido), así se
    // ve exactamente "cobré X a Y a tal hora", que es lo que se pidió.
    const detalleDeCobro = (c:any) => ({
      id: c.id, cobrado: Number(c.monto??0), created_at: c.created_at, fecha: c.fecha,
      numero_orden: c.orders?.numero_orden ?? c.referencia,
      cliente_nombre: c.orders?.cliente_nombre ?? c.descripcion,
      cliente_telefono: c.orders?.cliente_telefono,
      saldo: 0, // el saldo pendiente se ve en la sección "Por cobrar", no aquí
    })
    const detalleHoyArr     = cobrosHoy.map(detalleDeCobro).sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
    const detallePeriodoArr = cobros.map(detalleDeCobro).sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
    const detallePorCobrarActivoArr = ords
      .filter((o:any) => (Number(o.total??0)-cobradoDeOrden(o)) > 0 && new Date(o.created_at) >= hace30d)
      .map((o:any) => ({ ...o, cobrado: cobradoDeOrden(o), saldo: Number(o.total??0)-cobradoDeOrden(o) }))
    const detallePorCobrarViejoArr = ords
      .filter((o:any) => (Number(o.total??0)-cobradoDeOrden(o)) > 0 && new Date(o.created_at) < hace30d)
      .map((o:any) => ({ ...o, cobrado: cobradoDeOrden(o), saldo: Number(o.total??0)-cobradoDeOrden(o) }))

    setData({ ventasPeriodo, ventasHoy, ticketProm, entregados, conversion, pedidosPeriodo:ords.length, clientes: clientes??0,
      invCriticos, invBajoMin, invTotal: invAll.length,
      costoTotalPeriodo, gananciaPeriodo, costoHoy, gananciaHoy,
      porCobrarActivo, porCobrarViejo, pedidosPorCobrar,
      detalleHoyArr, detallePeriodoArr, detallePorCobrarActivoArr, detallePorCobrarViejoArr,
      porEtapa, leadsHoy, leadsMes, leadsConvertidos, conversionLeadsPct })
    setRecent(ordRecent.data??[])
    setTop(topProds)
    setStock(stockLow.data??[])
    setChartRaw(ords)
    setUpdated(new Date())
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[rango.desde.getTime(), rango.hasta.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps

  // Drill-down de "Pedidos por etapa" — carga bajo demanda, no toca cargar()
  // ni ningún cálculo existente. Es una consulta adicional, solo cuando el
  // usuario toca una etapa específica.
  const abrirEtapa = async (etapa: string) => {
    if (etapaAbierta === etapa) { setEtapaAbierta(null); return }
    setEtapaAbierta(etapa)
    setCargandoEtapa(true)
    const { data: pedidos } = await sb.from('orders')
      .select('id,numero_orden,cliente_nombre,cliente_telefono,total,created_at,estado')
      .eq('estado', etapa).eq('es_prueba', false)
      .order('created_at', { ascending: true })
    setPedidosEtapa(pedidos ?? [])
    setCargandoEtapa(false)
  }

  // ── Gráfica: agrupa por día, semana o mes según cuánto abarque el rango ──
  const [bars, setBars] = useState<{d:string,v:number}[]>([])
  useEffect(()=>{
    if (!data) return
    const diasEnRango = Math.max(1, Math.round((rango.hasta.getTime()-rango.desde.getTime())/86400000))
    const modo: 'dia'|'semana'|'mes' = diasEnRango <= 35 ? 'dia' : diasEnRango <= 120 ? 'semana' : 'mes'

    const buckets = new Map<string, { label: string; v: number; orden: number }>()

    if (modo === 'dia') {
      for (let i = 0; i < diasEnRango; i++) {
        const d = new Date(rango.desde.getTime() + i*86400000)
        const key = d.toDateString()
        buckets.set(key, { label: d.toLocaleDateString('es-DO',{day:'numeric',month:'short'}), v: 0, orden: i })
      }
      chartRaw.forEach((ord:any)=>{
        const key = new Date(ord.fecha).toDateString()
        const b = buckets.get(key)
        if (b) b.v += Number(ord.total??0)
      })
    } else if (modo === 'semana') {
      chartRaw.forEach((ord:any)=>{
        const d = new Date(ord.fecha)
        const semanaInicio = new Date(d); semanaInicio.setDate(d.getDate() - d.getDay())
        const key = semanaInicio.toDateString()
        if (!buckets.has(key)) buckets.set(key, { label: `Sem. ${semanaInicio.toLocaleDateString('es-DO',{day:'numeric',month:'short'})}`, v: 0, orden: semanaInicio.getTime() })
        buckets.get(key)!.v += Number(ord.total??0)
      })
    } else {
      chartRaw.forEach((ord:any)=>{
        const d = new Date(ord.fecha)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (!buckets.has(key)) buckets.set(key, { label: d.toLocaleDateString('es-DO',{month:'short',year:'2-digit'}), v: 0, orden: d.getFullYear()*12+d.getMonth() })
        buckets.get(key)!.v += Number(ord.total??0)
      })
    }

    setBars(Array.from(buckets.values()).sort((a,b)=>a.orden-b.orden).map(b=>({d:b.label,v:b.v})))
  },[data, chartRaw, rango])

  const maxBar = Math.max(...bars.map(b=>b.v),1)

  if (loading && !data) return (
    <div className="space-y-4 pb-10 animate-pulse">
      <div className="h-16 bg-gray-100 rounded-2xl"/>
      <div className="h-10 bg-gray-100 rounded-2xl"/>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({length:6}).map((_,i)=>(<div key={i} className="h-28 bg-gray-100 rounded-2xl"/>))}
      </div>
      <div className="h-40 bg-gray-100 rounded-2xl"/>
    </div>
  )

  const pedidosActivosTotal = ['recibido','pago_aprobado','preparando','fabricante','transito']
    .reduce((s,k)=>s+(data?.porEtapa?.[k]??0),0)
  const porCobrarTotal = (data?.porCobrarActivo??0)+(data?.porCobrarViejo??0)
  const margenPct = (data?.ventasPeriodo??0) > 0 ? Math.round(((data?.gananciaPeriodo??0)/(data?.ventasPeriodo??0))*100) : 0
  const primerNombre = 'Mario'
  const horaActual = new Date().getHours()
  const saludo = horaActual < 12 ? 'Buenos días' : horaActual < 19 ? 'Buenas tardes' : 'Buenas noches'
  const recibidosPendientes = recent.filter((p:any)=>p.estado==='recibido' || p.pago_estado==='pendiente' && p.estado!=='cancelado').length

  // ── Centro de alertas — se arma solo con datos que ya existen, ninguna
  // consulta nueva. Cada alerta lleva su propia acción. ──────────────────
  const alertas: { icon: any; texto: string; sub?: string; color: string; bg: string; accion: () => void }[] = []
  if (porCobrarTotal > 0) alertas.push({
    icon: CreditCard, color:'text-amber-600', bg:'bg-amber-50',
    texto: `${data?.pedidosPorCobrar??0} pedido${data?.pedidosPorCobrar===1?'':'s'} con saldo pendiente`,
    sub: `${fmt(porCobrarTotal)} por cobrar`,
    accion: () => setDetalleAbierto(detalleAbierto==='porCobrar'?null:'porCobrar'),
  })
  if ((data?.porEtapa?.recibido??0) > 0) alertas.push({
    icon: Clock, color:'text-blue-600', bg:'bg-blue-50',
    texto: `${data.porEtapa.recibido} pedido${data.porEtapa.recibido===1?'':'s'} recién recibido${data.porEtapa.recibido===1?'':'s'}`,
    sub: 'Esperando procesamiento',
    accion: () => abrirEtapa('recibido'),
  })
  if ((data?.porEtapa?.fabricante??0) > 0) alertas.push({
    icon: Package, color:'text-indigo-600', bg:'bg-indigo-50',
    texto: `${data.porEtapa.fabricante} pedido${data.porEtapa.fabricante===1?'':'s'} en fabricante`,
    sub: 'Dar seguimiento si llevan varios días',
    accion: () => abrirEtapa('fabricante'),
  })
  if (stock.length > 0) alertas.push({
    icon: AlertTriangle, color:'text-red-600', bg:'bg-red-50',
    texto: `${stock.length} producto${stock.length===1?'':'s'} bajo mínimo de stock`,
    sub: stock.slice(0,2).map((p:any)=>p.nombre).join(', ') + (stock.length>2?'…':''),
    accion: () => router.push('/admin/inventario'),
  })

  return (
    <div className="space-y-5 pb-10">

      {/* ═══ HEADER ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900">{saludo}, {primerNombre}</h1>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">Resumen de ContactGo · {hoy}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={cargar} disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              title="Actualizar">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading?'animate-spin':''}`}/>
            </button>
            <button onClick={()=>setNavMovilAbierto(v=>!v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${navMovilAbierto?'rotate-180':''}`}/>
            </button>
          </div>
        </div>

        {/* Nav — desktop en línea, mobile desplegable */}
        <div className={`${navMovilAbierto?'flex':'hidden'} md:flex flex-col md:flex-row gap-1 md:gap-4 mt-4 pt-3 border-t border-gray-100 text-xs font-semibold`}>
          {[
            {label:'Dashboard', path:'/admin', activo:true},
            {label:'Pedidos', path:'/admin/pedidos'},
            {label:'Clientes', path:'/admin/registrados'},
            {label:'Productos', path:'/admin/inventario'},
            {label:'Finanzas', path:'/admin/reportes'},
            {label:'Marketing', path:'/admin/calculadora'},
          ].map(n=>(
            <button key={n.path} onClick={()=>router.push(n.path)}
              className={`text-left md:text-center px-2 py-1.5 md:py-0 rounded-lg md:rounded-none ${n.activo?'text-primary-600':'text-gray-500 hover:text-gray-800'}`}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ SELECTOR DE PERÍODO — compacto ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0"/>
          {PRESETS.map(p => (
            <button key={p.key}
              onClick={() => { setPreset(p.key); setSelectorAbierto(p.key === 'personalizado') }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0 ${
                preset === p.key ? 'bg-teal-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        {selectorAbierto && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Desde</label>
              <input type="date" value={customDesde} onChange={e=>setCustomDesde(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"/>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">Hasta</label>
              <input type="date" value={customHasta} onChange={e=>setCustomHasta(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"/>
            </div>
          </div>
        )}
        <p className="text-[11px] text-gray-400 mt-2">
          Mostrando datos del {rango.desde.toLocaleDateString('es-DO')} al {rango.hasta.toLocaleDateString('es-DO')}
        </p>
      </div>

      {/* ═══ RESUMEN EJECUTIVO — 6 KPI, cada uno clickeable ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { key:'periodo', label:'Ventas', val:fmt(data?.ventasPeriodo??0), sub:`${data?.pedidosPeriodo??0} pedidos`, color:'text-gray-900', accion:()=>setDetalleAbierto(detalleAbierto==='periodo'?null:'periodo') },
          { key:'ganancia', label:'Ganancia', val:fmt(data?.gananciaPeriodo??0), sub:`${margenPct}% margen`, color:'text-emerald-600', accion:()=>setDetalleAbierto(detalleAbierto==='ganancia'?null:'ganancia') },
          { key:null, label:'Pedidos', val:String(data?.pedidosPeriodo??0), sub:`${data?.entregados??0} entregados`, color:'text-gray-900', accion:()=>router.push('/admin/pedidos') },
          { key:null, label:'Ticket promedio', val:fmt(data?.ticketProm??0), sub:'por cobro', color:'text-gray-900', accion:undefined },
          { key:'porCobrar', label:'Por cobrar', val:fmt(porCobrarTotal), sub:`${data?.pedidosPorCobrar??0} pedidos`, color:'text-amber-600', accion:()=>setDetalleAbierto(detalleAbierto==='porCobrar'?null:'porCobrar') },
          { key:'etapa', label:'Pedidos activos', val:String(pedidosActivosTotal), sub:'en proceso', color:'text-indigo-600', accion:()=>document.getElementById('pedidos-por-etapa')?.scrollIntoView({behavior:'smooth'}) },
        ].map(({key,label,val,sub,color,accion})=>{
          const abierta = key && detalleAbierto===key
          const Tag = accion ? 'button' : 'div'
          return (
            <Tag key={label} onClick={accion}
              className={`text-left bg-white rounded-2xl border shadow-sm p-4 transition-all ${abierta?'border-primary-400 ring-2 ring-primary-100':'border-gray-100'} ${accion?'hover:border-gray-200 active:scale-[0.98]':''}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-lg sm:text-xl font-black mt-1 ${color}`}>{val}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </Tag>
          )
        })}
      </div>

      {/* Detalle desplegado — Ventas / Ganancia / Por cobrar */}
      {detalleAbierto==='periodo' && (
        <div className="bg-white rounded-2xl border border-primary-200 shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-gray-700">Ventas · {rango.label} — detalle</h2>
            <button onClick={()=>setDetalleAbierto(null)} className="text-gray-400 hover:text-gray-600 text-xs font-semibold">Cerrar ✕</button>
          </div>
          {(data?.detallePeriodoArr??[]).length===0 ? <p className="text-xs text-gray-400 text-center py-6">Sin cobros en este rango.</p> : (
            <div className="space-y-2">
              {data.detallePeriodoArr.map((o:any) => (
                <a key={o.id} href="/admin/pedidos" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{o.cliente_nombre}</p>
                    <p className="text-[11px] text-gray-400">#{o.numero_orden} · {new Date(o.created_at ?? o.fecha).toLocaleString('es-DO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                  <p className="text-sm font-black text-green-600 shrink-0">{fmt(o.cobrado)}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {detalleAbierto==='ganancia' && (
        <div className="bg-white rounded-2xl border border-primary-200 shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-gray-700">Ganancia · {rango.label} — desglose</h2>
            <button onClick={()=>setDetalleAbierto(null)} className="text-gray-400 hover:text-gray-600 text-xs font-semibold">Cerrar ✕</button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-lg font-black text-gray-900">{fmt(data?.ventasPeriodo??0)}</p>
              <p className="text-[10px] text-gray-400">Cobrado</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-lg font-black text-red-500">{fmt(data?.costoTotalPeriodo??0)}</p>
              <p className="text-[10px] text-gray-400">Costo real</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50">
              <p className="text-lg font-black text-emerald-600">{fmt(data?.gananciaPeriodo??0)}</p>
              <p className="text-[10px] text-gray-400">Ganancia ({margenPct}%)</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">Costo calculado cruzando cada producto vendido contra su costo real actual (products.costo).</p>
        </div>
      )}

      {/* ═══ REQUIERE TU ATENCIÓN ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-3">Requiere tu atención</h2>
        {alertas.length===0 ? (
          <div className="flex items-center gap-2 py-2">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0"/>
            <p className="text-sm text-gray-500">Todo está bajo control — sin pendientes urgentes.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alertas.map((a,i)=>(
              <button key={i} onClick={a.accion}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${a.bg} hover:brightness-95 transition-all text-left`}>
                <a.icon className={`w-4 h-4 shrink-0 ${a.color}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${a.color}`}>{a.texto}</p>
                  {a.sub && <p className="text-[11px] text-gray-500 truncate">{a.sub}</p>}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 -rotate-90 shrink-0"/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ POR COBRAR — sección prioritaria con acciones ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-sm text-gray-700">Por cobrar</h2>
          <span className="text-xs text-gray-400">{data?.pedidosPorCobrar??0} pedidos</span>
        </div>
        <p className="text-2xl font-black text-amber-600 mb-3">{fmt(porCobrarTotal)}</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={()=>setDetalleAbierto(detalleAbierto==='porCobrar'?null:'porCobrar')}
            className={`text-left rounded-xl bg-amber-50 p-3 transition-all ${detalleAbierto==='porCobrar'?'ring-2 ring-amber-300':''}`}>
            <p className="text-base font-black text-amber-600">{fmt(data?.porCobrarActivo??0)}</p>
            <p className="text-[10px] text-gray-500">Últimos 30 días</p>
          </button>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-base font-black text-gray-400">{fmt(data?.porCobrarViejo??0)}</p>
            <p className="text-[10px] text-gray-500">+30 días, en riesgo</p>
          </div>
        </div>
        {detalleAbierto==='porCobrar' && (
          <div className="space-y-2 pt-3 border-t border-gray-100">
            {[...(data?.detallePorCobrarActivoArr??[]), ...(data?.detallePorCobrarViejoArr??[])].length===0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Sin saldos pendientes.</p>
            ) : [...(data?.detallePorCobrarActivoArr??[]), ...(data?.detallePorCobrarViejoArr??[])].map((o:any) => {
              const dias = Math.floor((Date.now()-new Date(o.created_at).getTime())/86400000)
              return (
                <div key={o.id} className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{o.cliente_nombre}</p>
                      <p className="text-[11px] text-gray-400">#{o.numero_orden} · hace {dias}d</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-amber-600">{fmt(o.saldo)}</p>
                      <p className="text-[10px] text-gray-400">de {fmt(o.total)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>router.push('/admin/pedidos')} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100">Ver pedido</button>
                    <button onClick={()=>router.push('/admin/pedidos')} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700">Registrar pago</button>
                    {o.cliente_telefono && (
                      <button onClick={()=>window.open(`https://wa.me/${String(o.cliente_telefono).replace(/\D/g,'')}`,'_blank')}
                        className="w-8 shrink-0 text-[10px] font-bold py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">💬</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ═══ RENDIMIENTO FINANCIERO — gráfica ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-1">Rendimiento financiero</h2>
        <div className="flex items-baseline gap-4 mb-4 flex-wrap">
          <div><span className="text-lg font-black text-gray-900">{fmt(data?.ventasPeriodo??0)}</span><span className="text-[10px] text-gray-400 ml-1">ventas</span></div>
          <div><span className="text-lg font-black text-emerald-600">{fmt(data?.gananciaPeriodo??0)}</span><span className="text-[10px] text-gray-400 ml-1">ganancia</span></div>
          <div><span className="text-lg font-black text-gray-500">{margenPct}%</span><span className="text-[10px] text-gray-400 ml-1">margen</span></div>
        </div>
        <div className="flex items-end gap-1.5 h-28 overflow-x-auto">
          {bars.map((b,i)=>(
            <div key={i} className="flex-1 min-w-[24px] flex flex-col items-center gap-1.5">
              <div className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.max(4, Math.round((b.v/maxBar)*100))}%`,
                  background: b.v>0 ? '#16a34a' : '#e5e7eb'
                }}/>
              <span className="text-[9px] text-gray-400 capitalize whitespace-nowrap">{b.d}</span>
            </div>
          ))}
          {bars.length===0 && <p className="text-xs text-gray-400 w-full text-center">Sin datos en este período</p>}
        </div>
      </div>

      {/* ═══ PEDIDOS POR ETAPA — clickeable ═══ */}
      <div id="pedidos-por-etapa" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-1">Pedidos por etapa</h2>
        <p className="text-xs text-gray-400 mb-4">Todo lo activo ahora mismo. Toca una etapa para ver los pedidos.</p>
        <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto pb-1">
          {[
            {k:'recibido',      label:'Recibido',      icon:Clock,       color:'text-amber-600',  bg:'bg-amber-50'},
            {k:'pago_aprobado', label:'Pago aprobado',  icon:CreditCard,  color:'text-blue-600',   bg:'bg-blue-50'},
            {k:'preparando',    label:'Preparando',     icon:Package,     color:'text-purple-600', bg:'bg-purple-50'},
            {k:'fabricante',    label:'Fabricante',     icon:Package,     color:'text-indigo-600', bg:'bg-indigo-50'},
            {k:'transito',      label:'En tránsito',    icon:Truck,       color:'text-teal-600',   bg:'bg-teal-50'},
          ].map(({k,label,icon:Icon,color,bg})=>(
            <button key={k} onClick={()=>abrirEtapa(k)}
              className={`shrink-0 w-24 md:w-auto text-center p-3 rounded-xl transition-all ${etapaAbierta===k?'bg-gray-100 ring-2 ring-gray-300':'bg-gray-50 hover:bg-gray-100'}`}>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${color}`}/>
              </div>
              <p className="text-xl font-black text-gray-900">{data?.porEtapa?.[k] ?? 0}</p>
              <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </button>
          ))}
        </div>
        {etapaAbierta && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {cargandoEtapa ? (
              <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
            ) : pedidosEtapa.length===0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No hay pedidos en &ldquo;{etapaAbierta}&rdquo;.</p>
            ) : (
              <div className="space-y-2">
                {pedidosEtapa.map((p:any)=>{
                  const dias = Math.floor((Date.now()-new Date(p.created_at).getTime())/86400000)
                  return (
                    <a key={p.id} href="/admin/pedidos" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{p.cliente_nombre}</p>
                        <p className="text-[11px] text-gray-400">#{p.numero_orden} · {new Date(p.created_at).toLocaleDateString('es-DO')}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-gray-900">{fmt(p.total)}</p>
                        {dias >= 3 && <p className="text-[10px] text-red-500 font-bold">⏱ {dias}d en esta etapa</p>}
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ PEDIDOS RECIENTES ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 text-sm">Pedidos recientes</h2>
          <button onClick={()=>router.push('/admin/pedidos')}
            className="text-xs text-primary-600 font-semibold flex items-center gap-1 hover:underline">
            Ver todos <ArrowRight className="w-3 h-3"/>
          </button>
        </div>
        {recent.length===0 ? (
          <p className="text-xs text-gray-400 text-center py-6">Sin pedidos aún</p>
        ) : (
          <div className="space-y-1">
            {recent.slice(0,5).map(p=>(
              <a key={p.id} href="/admin/pedidos" className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  {p.metodo_pago==='tarjeta' ? <CreditCard className="w-4 h-4 text-gray-500"/> : <Truck className="w-4 h-4 text-gray-500"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.cliente_nombre}</p>
                  <p className="text-[11px] text-gray-400">#{(p.numero_orden??p.id.slice(-8)).toUpperCase()} · {new Date(p.created_at).toLocaleDateString('es-DO')}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ESTADO_COLOR[p.estado]??'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                <span className="text-xs font-black text-gray-900 shrink-0">RD${Math.round(p.total??0).toLocaleString()}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ═══ MARKETING ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-1">Marketing</h2>
        <p className="text-xs text-gray-400 mb-4">Leads de la calculadora y conversión real (cruce por teléfono contra pedidos del mes).</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <p className="text-xl font-black text-blue-700">{data?.leadsHoy ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Leads hoy</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50">
            <p className="text-xl font-black text-blue-700">{data?.leadsMes ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Leads este mes</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50">
            <p className="text-xl font-black text-green-700">{data?.conversionLeadsPct ?? 0}%</p>
            <p className="text-[10px] text-gray-500 font-medium">Conversión</p>
          </div>
        </div>
        {/* Embudo simple — solo 2 etapas reales disponibles hoy (lead → compró).
            Etapas intermedias (contactado/interesado) no se registran todavía. */}
        <div className="flex items-center gap-2">
          <div className="flex-1 text-center p-2 rounded-lg bg-blue-50">
            <p className="text-sm font-black text-blue-700">{data?.leadsMes ?? 0}</p>
            <p className="text-[9px] text-gray-500">Leads</p>
          </div>
          <ArrowRight className="w-3 h-3 text-gray-300 shrink-0"/>
          <div className="flex-1 text-center p-2 rounded-lg bg-green-50">
            <p className="text-sm font-black text-green-700">{data?.leadsConvertidos ?? 0}</p>
            <p className="text-[9px] text-gray-500">Compraron</p>
          </div>
        </div>
        <button onClick={()=>router.push('/admin/calculadora')} className="w-full mt-3 text-xs font-semibold text-primary-600 hover:underline">Ver leads →</button>
      </div>

      {/* ═══ PRODUCTOS ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900 text-sm">Top productos</h2>
          <select value={ordenProductos} onChange={e=>setOrdenProductos(e.target.value as any)}
            className="text-[11px] font-semibold text-gray-600 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
            <option value="unidades">Más vendidos</option>
            <option value="facturacion">Mayor facturación</option>
          </select>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">{rango.label}</p>
        <div className="space-y-3">
          {[...top].sort((a,b)=> ordenProductos==='unidades' ? b.u-a.u : b.rev-a.rev).slice(0,5).map((p,i)=>(
            <div key={p.nombre} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{width:`${Math.round(((ordenProductos==='unidades'?p.u:p.rev)/Math.max(...top.map(t=>ordenProductos==='unidades'?t.u:t.rev),1))*100)}%`}}/>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-700 shrink-0">{ordenProductos==='unidades' ? `${p.u}u` : fmt(p.rev)}</span>
            </div>
          ))}
          {top.length===0&&<p className="text-xs text-gray-400 text-center py-4">Sin ventas en este período</p>}
        </div>
      </div>

      {/* ═══ ACCIONES RÁPIDAS ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="font-bold text-gray-900 text-sm mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            {label:'Pedidos', path:'/admin/pedidos'},
            {label:'Registrar pago', path:'/admin/pedidos'},
            {label:'Clientes', path:'/admin/registrados'},
            {label:'Productos', path:'/admin/inventario'},
            {label:'Leads', path:'/admin/calculadora'},
            {label:'Reportes', path:'/admin/reportes'},
          ].map(a=>(
            <button key={a.label} onClick={()=>router.push(a.path)}
              className="text-[11px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 px-2 text-center transition-colors">
              {a.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
