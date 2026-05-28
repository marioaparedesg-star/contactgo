'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TrendingUp, ShoppingBag, Users, DollarSign, RefreshCw, CreditCard, Truck } from 'lucide-react'


export default function ReportesPage() {
  const sb = createClient()
  const [kpis, setKpis]       = useState<any>(null)
  const [top,  setTop]        = useState<any[]>([])
  const [recent, setRecent]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState<Date>(new Date())

  const cargar = async () => {
    setLoading(true)
    const [k, r, items] = await Promise.all([
      sb.from('admin_kpis').select('*').single(),
      sb.from('orders').select('id,numero_orden,cliente_nombre,total,estado,metodo_pago,created_at')
        .not('pago_estado','eq','declinado').not('numero_orden','like','CG-TEST%')
        .order('created_at',{ascending:false}).limit(10),
      sb.from('order_items').select('nombre,cantidad,precio').limit(500),
    ])
    if (k.data) setKpis(k.data)
    if (r.data) setRecent(r.data)
    // Agrupar top productos
    const agg: Record<string,{nombre:string,unidades:number,revenue:number}> = {}
    ;(items.data??[]).forEach((i:any)=>{
      if(!agg[i.nombre]) agg[i.nombre]={nombre:i.nombre,unidades:0,revenue:0}
      agg[i.nombre].unidades += Number(i.cantidad??1)
      agg[i.nombre].revenue  += Number(i.precio??0)*Number(i.cantidad??1)
    })
    setTop(Object.values(agg).sort((a,b)=>b.revenue-a.revenue).slice(0,5))
    setUpdated(new Date())
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[])

  const fmt = (n:number) => `RD$${Math.round(n).toLocaleString('es-DO')}`
  const ESTADO: Record<string,string> = {
    pendiente:'bg-amber-100 text-amber-700', confirmado:'bg-blue-100 text-blue-700',
    preparando:'bg-purple-100 text-purple-700', enviado:'bg-indigo-100 text-indigo-700',
    entregado:'bg-green-100 text-green-700', cancelado:'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reportes</h1>
          <p className="text-xs text-gray-400 mt-0.5">Actualizado: {updated.toLocaleTimeString('es-DO')}</p>
        </div>
        <button onClick={cargar} disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading?'animate-spin':''}`}/> Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {icon:DollarSign,  label:'Ventas 30 días',    val: fmt(kpis?.revenue_30d??0),    sub:`${kpis?.orders_30d??0} pedidos`, color:'text-green-600',bg:'bg-green-50'},
          {icon:DollarSign,  label:'Ventas 7 días',     val: fmt(kpis?.revenue_7d??0),     sub:`${kpis?.orders_7d??0} pedidos`,  color:'text-blue-600', bg:'bg-blue-50'},
          {icon:ShoppingBag, label:'Ticket promedio',   val: fmt(kpis?.avg_order_value??0),sub:'por pedido',                     color:'text-purple-600',bg:'bg-purple-50'},
          {icon:Users,       label:'Clientes',          val: String(kpis?.total_customers??0), sub:'registrados',               color:'text-indigo-600',bg:'bg-indigo-50'},
        ].map(({icon:Icon,label,val,sub,color,bg})=>(
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`}/>
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-lg font-black ${loading?'opacity-30':''}  mt-0.5`}>{val}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Top productos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-sm text-gray-700 mb-4">Top 5 productos</h2>
          {top.length===0 ? <p className="text-xs text-gray-400 text-center py-6">Sin datos</p> : (
            <div className="space-y-3">
              {top.map((p,i)=>(
                <div key={p.nombre} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                    <p className="text-[11px] text-gray-400">{p.unidades} unidades</p>
                  </div>
                  <span className="text-xs font-bold text-green-600">{fmt(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-700">Últimos pedidos</h2>
            <a href="/admin/pedidos" className="text-xs text-primary-600 font-semibold hover:underline">Ver todos →</a>
          </div>
          {recent.length===0 ? <p className="text-xs text-gray-400 text-center py-6">Sin pedidos</p> : (
            <div className="space-y-2">
              {recent.slice(0,7).map(p=>(
                <div key={p.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.cliente_nombre}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      {p.metodo_pago==='tarjeta'?<CreditCard className="w-3 h-3"/>:<Truck className="w-3 h-3"/>}
                      {p.numero_orden??p.id.slice(0,8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO[p.estado]??'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                  <span className="text-xs font-bold text-gray-700 shrink-0">{fmt(p.total??0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resumen estado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-sm text-gray-700 mb-4">Resumen general</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:'Entregados', val:kpis?.delivered_total??0, color:'text-green-600'},
            {label:'Cancelados', val:kpis?.cancelled_total??0, color:'text-red-500'},
            {label:'Tasa entrega', val:`${kpis?.delivered_total&&kpis?.orders_30d?Math.round((kpis.delivered_total/Math.max(kpis.orders_30d,1))*100):0}%`, color:'text-blue-600'},
            {label:'Suscripciones', val:'—', color:'text-purple-600'},
          ].map(({label,val,color})=>(
            <div key={label} className="text-center">
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
