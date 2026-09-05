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
  const [detalleAbierto, setDetalleAbierto] = useState<null | 'hoy' | 'periodo' | 'porCobrarActivo' | 'porCobrarViejo'>(null)
  const [detalleOrdenes, setDetalleOrdenes] = useState<any[]>([])

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
    const topProds = Object.values(agg).sort((a,b)=>b.u-a.u).slice(0,5)

    const { count: clientes } = await sb.from('profiles').select('*',{count:'exact',head:true}).eq('role','customer')

    const { data: invStats } = await sb.from('v_stock_disponible').select('id,nombre,tipo,stock,stock_minimo,stock_critico,stock_reorden,alerta_stock,precio')
    const invAll = invStats ?? []
    const invCriticos   = invAll.filter((p:any) => p.alerta_stock === 'critico').length
    const invBajoMin    = invAll.filter((p:any) => p.alerta_stock === 'bajo_minimo').length

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
      detalleHoyArr, detallePeriodoArr, detallePorCobrarActivoArr, detallePorCobrarViejoArr })
    setRecent(ordRecent.data??[])
    setTop(topProds)
    setStock(stockLow.data??[])
    setChartRaw(ords)
    setUpdated(new Date())
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[rango.desde.getTime(), rango.hasta.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5 capitalize">{hoy}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargar} disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading?'animate-spin':''}`}/>Actualizar
          </button>
          <button onClick={()=>router.push('/admin/pedidos')}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600">
            Ver pedidos <ArrowRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* ═══ SELECTOR DE RANGO DE FECHAS ═══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0"/>
            {PRESETS.map(p => (
              <button key={p.key}
                onClick={() => { setPreset(p.key); setSelectorAbierto(p.key === 'personalizado') }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  preset === p.key ? 'bg-teal-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 shrink-0">
            {rango.desde.toLocaleDateString('es-DO')} — {rango.hasta.toLocaleDateString('es-DO')}
          </p>
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
      </div>

      {/* KPIs del período seleccionado — las 2 de cobrado son clickeables,
          despliegan abajo el detalle real (a quién, qué pedido, cuánto) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key:'hoy',     icon:TrendingUp,  label:'Cobrado hoy',             val:fmt(data?.ventasHoy??0),      sub:'pagos + abonos de hoy — toca para ver detalle',           color:'text-green-600',  bg:'bg-green-50', clickable:true },
          { key:'periodo', icon:ShoppingBag, label:`Cobrado · ${rango.label}`, val:fmt(data?.ventasPeriodo??0),  sub:`${data?.pedidosPeriodo??0} pedidos — toca para ver detalle`, color:'text-blue-600',   bg:'bg-blue-50',  clickable:true },
          { key:null,      icon:Package,     label:'Ticket promedio',         val:fmt(data?.ticketProm??0),     sub:'de pedidos cobrados',              color:'text-purple-600', bg:'bg-purple-50', clickable:false },
          { key:null,      icon:AlertTriangle,label:'Bajo mínimo',            val:String((data?.invCriticos??0)+(data?.invBajoMin??0)), sub:'requieren atención', color:'text-amber-600',  bg:'bg-amber-50', clickable:false },
        ].map(({key,icon:Icon,label,val,sub,color,bg,clickable})=>{
          const abierta = clickable && detalleAbierto===key
          const Tag = clickable ? 'button' : 'div'
          return (
            <Tag key={label} onClick={clickable ? ()=>setDetalleAbierto(abierta ? null : key as any) : undefined}
              className={`text-left bg-white rounded-2xl border shadow-sm p-5 transition-all ${abierta?'border-primary-400 ring-2 ring-primary-100':'border-gray-100'} ${clickable?'hover:border-gray-200 active:scale-[0.98]':''}`}>
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`}/>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </Tag>
          )
        })}
      </div>

      {/* Detalle desplegado de "Cobrado hoy" / "Cobrado · período" */}
      {(detalleAbierto==='hoy' || detalleAbierto==='periodo') && (
        <div className="bg-white rounded-2xl border border-primary-200 shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-gray-700">
              {detalleAbierto==='hoy' ? 'Cobrado hoy — detalle' : `Cobrado · ${rango.label} — detalle`}
            </h2>
            <button onClick={()=>setDetalleAbierto(null)} className="text-gray-400 hover:text-gray-600 text-xs font-semibold">Cerrar ✕</button>
          </div>
          {(() => {
            const lista = detalleAbierto==='hoy' ? (data?.detalleHoyArr??[]) : (data?.detallePeriodoArr??[])
            if (lista.length===0) return <p className="text-xs text-gray-400 text-center py-6">Sin cobros en este rango.</p>
            return (
              <div className="space-y-2">
                {lista.map((o:any) => (
                  <a key={o.id} href="/admin/pedidos" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{o.cliente_nombre}</p>
                      <p className="text-[11px] text-gray-400">#{o.numero_orden} · {new Date(o.created_at ?? o.fecha).toLocaleString('es-DO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-green-600">{fmt(o.cobrado)}</p>
                      {o.saldo > 0 && <p className="text-[10px] text-amber-600">falta {fmt(o.saldo)}</p>}
                    </div>
                  </a>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {/* Por cobrar — saldo real pendiente (incluye pedidos con abono parcial,
          no solo los que nunca recibieron ningún pago). Clickeable también. */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-sm text-gray-700">Por cobrar</h2>
          <span className="text-xs text-gray-400">{data?.pedidosPorCobrar??0} pedidos con saldo pendiente</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Dentro del período seleccionado ({rango.label}). Incluye abonos parciales. Toca cualquiera para ver el detalle.</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={()=>setDetalleAbierto(detalleAbierto==='porCobrarActivo'?null:'porCobrarActivo')}
            className={`text-left rounded-xl bg-amber-50 p-4 transition-all ${detalleAbierto==='porCobrarActivo'?'ring-2 ring-amber-300':''}`}>
            <p className="text-2xl font-black text-amber-600">{fmt(data?.porCobrarActivo??0)}</p>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 días — todavía accionable</p>
          </button>
          <button onClick={()=>setDetalleAbierto(detalleAbierto==='porCobrarViejo'?null:'porCobrarViejo')}
            className={`text-left rounded-xl bg-gray-50 p-4 transition-all ${detalleAbierto==='porCobrarViejo'?'ring-2 ring-gray-300':''}`}>
            <p className="text-2xl font-black text-gray-400">{fmt(data?.porCobrarViejo??0)}</p>
            <p className="text-xs text-gray-500 mt-1">+30 días — probablemente perdido</p>
          </button>
        </div>
        {(detalleAbierto==='porCobrarActivo' || detalleAbierto==='porCobrarViejo') && (() => {
          const lista = detalleAbierto==='porCobrarActivo' ? (data?.detallePorCobrarActivoArr??[]) : (data?.detallePorCobrarViejoArr??[])
          return (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {lista.length===0 ? <p className="text-xs text-gray-400 text-center py-4">Sin pedidos en este grupo.</p> : lista.map((o:any) => (
                <a key={o.id} href="/admin/pedidos" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{o.cliente_nombre}</p>
                    <p className="text-[11px] text-gray-400">#{o.numero_orden} · {o.cliente_telefono}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-amber-600">falta {fmt(o.saldo)}</p>
                    <p className="text-[10px] text-gray-400">de {fmt(o.total)}</p>
                  </div>
                </a>
              ))}
            </div>
          )
        })()}
      </div>

      {/* Costo y Ganancia — cruce real contra products.costo, cualquier canal de venta */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <CreditCard className="w-5 h-5 text-red-500"/>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Costo · {rango.label}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{fmt(data?.costoTotalPeriodo??0)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Hoy: {fmt(data?.costoHoy??0)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600"/>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ganancia · {rango.label}</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{fmt(data?.gananciaPeriodo??0)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Hoy: {fmt(data?.gananciaHoy??0)}</p>
        </div>
      </div>

      {/* Fila de métricas secundarias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600"/>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{data?.pedidosPeriodo??0}</p>
            <p className="text-xs text-gray-400">Pedidos · {rango.label}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600"/>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{data?.entregados??0}</p>
            <p className="text-xs text-gray-400">Entregados · {rango.label} ({data?.conversion??0}%)</p>
          </div>
        </div>
        <button onClick={()=>router.push('/admin/calculadora')}
          className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:bg-blue-100 transition-colors text-left">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <p className="text-xl font-black text-blue-700">Calculadora</p>
            <p className="text-xs text-blue-500">Ver métricas y leads →</p>
          </div>
        </button>
      </div>

      {/* Gráfica + Top productos */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Gráfica del período (día/semana/mes según el rango) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900 text-sm">Ventas · {rango.label}</h2>
            <span className="text-xs text-gray-400">RD$</span>
          </div>
          <p className="text-2xl font-black text-primary-600 mb-5">{fmt(data?.ventasPeriodo??0)}</p>
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

        {/* Top productos del período */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-1">Top productos</h2>
          <p className="text-[11px] text-gray-400 mb-4">{rango.label}</p>
          <div className="space-y-3">
            {top.slice(0,5).map((p,i)=>(
              <div key={p.nombre} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                  <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{width:`${Math.round((p.u/Math.max(...top.map(t=>t.u),1))*100)}%`}}/>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700 shrink-0">{p.u}u</span>
              </div>
            ))}
            {top.length===0&&<p className="text-xs text-gray-400 text-center py-4">Sin ventas en este período</p>}
          </div>
        </div>
      </div>

      {/* Pedidos recientes + Alertas stock (siempre en tiempo real, no dependen del selector) */}
      <div className="grid lg:grid-cols-5 gap-4">

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Pedidos recientes</h2>
            <button onClick={()=>router.push('/admin/pedidos')}
              className="text-xs text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight className="w-3 h-3"/>
            </button>
          </div>
          {recent.length===0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Sin pedidos aún</p>
          ) : (
            <div className="space-y-2">
              {recent.map(p=>(
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    {p.metodo_pago==='tarjeta' ? <CreditCard className="w-4 h-4 text-gray-500"/> : <Truck className="w-4 h-4 text-gray-500"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{p.cliente_nombre}</p>
                    <p className="text-[11px] text-gray-400">#{(p.numero_orden??p.id.slice(-8)).toUpperCase()} · {new Date(p.created_at).toLocaleDateString('es-DO')}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO_COLOR[p.estado]??'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                  <span className="text-xs font-black text-gray-900 shrink-0">RD${Math.round(p.total??0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Alertas de stock</h2>
            <button onClick={()=>router.push('/admin/inventario')}
              className="text-xs text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              Inventario <ArrowRight className="w-3 h-3"/>
            </button>
          </div>
          {stock.length===0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2"/>
              <p className="text-xs text-gray-400">Todo el stock está bien</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stock.slice(0,6).map(p=>(
                <div key={p.nombre} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${p.stock===0?'text-red-500':'text-amber-500'}`}/>
                  <p className="text-xs text-gray-700 flex-1 truncate">{p.nombre}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${p.stock===0?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>
                    {p.stock===0?'Agotado':`${p.stock}u`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
