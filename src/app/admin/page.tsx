'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, ShoppingBag, Users, RefreshCw,
  Package, Truck, CheckCircle, Clock, CreditCard,
  ArrowRight, AlertTriangle
} from 'lucide-react'


const ESTADO_COLOR: Record<string,string> = {
  pendiente:  'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  preparando: 'bg-purple-100 text-purple-700',
  enviado:    'bg-indigo-100 text-indigo-700',
  entregado:  'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const sb = createClient()
  const router = useRouter()
  const [data, setData]       = useState<any>(null)
  const [recent, setRecent]   = useState<any[]>([])
  const [top, setTop]         = useState<any[]>([])
  const [stock, setStock]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(new Date())

  const fmt = (n:number) => `RD$${Math.round(n).toLocaleString('es-DO')}`
  const hoy = new Date().toLocaleDateString('es-DO',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

  const cargar = async () => {
    setLoading(true)
    const since30 = new Date(Date.now()-30*24*3600*1000).toISOString()
    const since7  = new Date(Date.now()-7*24*3600*1000).toISOString()
    const since1  = new Date(new Date().setHours(0,0,0,0)).toISOString()

    const [all, today7, ord7, ordRecent, items, stockLow] = await Promise.all([
      sb.from('orders').select('id,total,estado,fecha,metodo_pago,pago_estado,created_at')
        .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
        .gte('fecha',since30),
      sb.from('orders').select('id,total,estado,fecha')
        .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
        .gte('fecha',since1),
      sb.from('orders').select('id,total,estado,fecha')
        .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
        .gte('fecha',since7),
      sb.from('orders').select('id,numero_orden,cliente_nombre,total,estado,metodo_pago,pago_estado,created_at')
        .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
        .order('created_at',{ascending:false}).limit(8),
      sb.from('order_items').select('nombre,cantidad,precio').limit(600),
      sb.from('products').select('nombre,stock,tipo').eq('activo',true).lte('stock',3).order('stock'),
    ])

    const ords    = all.data ?? []
    const ords7   = ord7.data ?? []
    const ordsHoy = today7.data ?? []

    const ventas30  = ords.reduce((s,o)=>s+Number(o.total??0),0)
    const ventas7   = ords7.reduce((s,o)=>s+Number(o.total??0),0)
    const ventasHoy = ordsHoy.reduce((s,o)=>s+Number(o.total??0),0)
    const tickets   = ords.length > 0 ? ventas30/ords.length : 0
    const entregados = ords.filter(o=>o.estado==='entregado').length
    const conversion = ords.length > 0 ? Math.round((entregados/ords.length)*100) : 0

    const agg: Record<string,{nombre:string,u:number,rev:number}> = {}
    ;(items.data??[]).forEach((i:any)=>{
      if(!agg[i.nombre]) agg[i.nombre]={nombre:i.nombre,u:0,rev:0}
      agg[i.nombre].u   += Number(i.cantidad??1)
      agg[i.nombre].rev += Number(i.precio??0)*Number(i.cantidad??1)
    })
    const topProds = Object.values(agg).sort((a,b)=>b.u-a.u).slice(0,5)

    const { count: clientes } = await sb.from('profiles').select('*',{count:'exact',head:true}).eq('role','customer')

    setData({ ventas30, ventas7, ventasHoy, tickets, entregados, conversion, pedidos30:ords.length, pedidos7:ords7.length, clientes: clientes??0 })
    setRecent(ordRecent.data??[])
    setTop(topProds)
    setStock(stockLow.data??[])
    setUpdated(new Date())
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[])

  // Mini bar chart 7 días
  const [bars, setBars] = useState<{d:string,v:number}[]>([])
  useEffect(()=>{
    if (!data) return
    const dias = Array.from({length:7},(_,i)=>{
      const d = new Date(Date.now()-(6-i)*86400000)
      return { d: d.toLocaleDateString('es-DO',{weekday:'short'}), v: 0, date: d.toDateString() }
    })
    sb.from('orders').select('total,fecha')
      .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
      .gte('fecha',new Date(Date.now()-7*86400000).toISOString())
      .then(({data:o})=>{
        ;(o??[]).forEach((ord:any)=>{
          const od = new Date(ord.fecha).toDateString()
          const bar = dias.find(d=>d.date===od)
          if (bar) bar.v += Number(ord.total??0)
        })
        setBars(dias.map(d=>({d:d.d,v:d.v})))
      })
  },[data])

  const maxBar = Math.max(...bars.map(b=>b.v),1)

  if (loading) return (
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
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700">
            Ver pedidos <ArrowRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon:TrendingUp,  label:'Ventas hoy',    val:fmt(data?.ventasHoy??0),  sub:`${data?.pedidos30??0} pedidos total`,  color:'text-green-600',  bg:'bg-green-50' },
          { icon:ShoppingBag, label:'Ventas 30 días', val:fmt(data?.ventas30??0),  sub:`${data?.pedidos30??0} pedidos`,         color:'text-blue-600',   bg:'bg-blue-50'  },
          { icon:CreditCard,  label:'Ticket promedio',val:fmt(data?.tickets??0),   sub:'por pedido',                            color:'text-purple-600', bg:'bg-purple-50'},
          { icon:Users,       label:'Clientes',       val:String(data?.clientes??0),sub:'registrados',                         color:'text-indigo-600', bg:'bg-indigo-50'},
        ].map(({icon:Icon,label,val,sub,color,bg})=>(
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${color}`}/>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{val}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Fila de métricas secundarias */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600"/>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{data?.pedidos7??0}</p>
            <p className="text-xs text-gray-400">Pedidos esta semana</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600"/>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{data?.entregados??0}</p>
            <p className="text-xs text-gray-400">Entregados total</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-600"/>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{data?.conversion??0}%</p>
            <p className="text-xs text-gray-400">Tasa entrega</p>
          </div>
        </div>
      </div>

      {/* Gráfica + Top productos */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Gráfica 7 días */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900 text-sm">Ventas últimos 7 días</h2>
            <span className="text-xs text-gray-400">RD$</span>
          </div>
          <p className="text-2xl font-black text-primary-600 mb-5">{fmt(data?.ventas7??0)}</p>
          <div className="flex items-end gap-2 h-28">
            {bars.map((b,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(4, Math.round((b.v/maxBar)*100))}%`,
                    background: b.v>0 ? '#16a34a' : '#e5e7eb'
                  }}/>
                <span className="text-[10px] text-gray-400 capitalize">{b.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top productos */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Top productos</h2>
          <div className="space-y-3">
            {top.slice(0,5).map((p,i)=>(
              <div key={p.nombre} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                  <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{width:`${Math.round((p.u/Math.max(...top.map(t=>t.u)))*100)}%`}}/>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700 shrink-0">{p.u}u</span>
              </div>
            ))}
            {top.length===0&&<p className="text-xs text-gray-400 text-center py-4">Sin datos aún</p>}
          </div>
        </div>
      </div>

      {/* Pedidos recientes + Alertas stock */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Pedidos recientes */}
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

        {/* Alertas stock */}
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
