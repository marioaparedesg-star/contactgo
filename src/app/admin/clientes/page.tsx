'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Users, ShoppingBag, Mail, Phone, X, ChevronRight, Calendar, TrendingUp } from 'lucide-react'

export default function ClientesPage() {
  const sb = createClient()
  
  const [clientes, setClientes]   = useState<any[]>([])
  const [pedidos,  setPedidos]    = useState<Record<string,any[]>>({})
  const [selected, setSelected]   = useState<any>(null)
  const [search,   setSearch]     = useState('')
  const [loading,  setLoading]    = useState(true)
  const [statsMap, setStatsMap]   = useState<Record<string,{total:number,ltv:number}>>({})

  useEffect(()=>{
    sb.from('profiles').select('id,nombre,email,telefono,created_at,activo').eq('role','customer').order('created_at',{ascending:false})
      .then(async ({data})=>{
        const cs = data??[]
        setClientes(cs)
        // Cargar LTV y conteo de pedidos para todos
        if (cs.length>0) {
          const ids = cs.map((c:any)=>c.id)
          const {data:ords} = await sb.from('orders')
            .select('user_id,total,estado')
            .in('user_id',ids)
            .not('pago_estado','eq','declinado')
          const map: Record<string,{total:number,ltv:number}> = {}
          ;(ords??[]).forEach((o:any)=>{
            if(!map[o.user_id]) map[o.user_id]={total:0,ltv:0}
            map[o.user_id].total++
            map[o.user_id].ltv+=Number(o.total??0)
          })
          setStatsMap(map)
        }
        setLoading(false)
      })
  },[])

  const abrirCliente = async (c:any) => {
    setSelected(c)
    if (!pedidos[c.id]) {
      const {data} = await sb.from('orders').select('id,total,estado,metodo_pago,numero_orden,created_at')
        .eq('user_id',c.id).not('pago_estado','eq','declinado').order('created_at',{ascending:false})
      setPedidos(p=>({...p,[c.id]:data??[]}))
    }
  }

  const filtrados = clientes.filter(c=>
    !search||c.nombre?.toLowerCase().includes(search.toLowerCase())||
    c.email?.toLowerCase().includes(search.toLowerCase())||
    c.telefono?.includes(search)
  )

  const ESTADO_COLOR: Record<string,string> = {
    pendiente:'bg-amber-100 text-amber-700', confirmado:'bg-blue-100 text-blue-700',
    entregado:'bg-green-100 text-green-700', cancelado:'bg-red-100 text-red-700',
    enviado:'bg-indigo-100 text-indigo-700', preparando:'bg-purple-100 text-purple-700',
  }

  const totalLTV = clientes.reduce((s,c)=>s+(statsMap[c.id]?.ltv??0),0)

  return (
    <div className="max-w-7xl mx-auto w-full">
<div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Clientes</h1>
              <p className="text-gray-400 text-sm mt-0.5">{clientes.length} registrados</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {icon:Users, label:'Total clientes',     val:clientes.length,                              color:'text-blue-600',   bg:'bg-blue-50'},
              {icon:ShoppingBag, label:'Con pedidos',  val:Object.keys(statsMap).length,                 color:'text-green-600',  bg:'bg-green-50'},
              {icon:TrendingUp, label:'LTV total',     val:`RD$${Math.round(totalLTV).toLocaleString()}`,color:'text-purple-600', bg:'bg-purple-50'},
              {icon:Calendar, label:'Esta semana',     val:clientes.filter(c=>new Date(c.created_at)>new Date(Date.now()-7*24*3600*1000)).length, color:'text-indigo-600',bg:'bg-indigo-50'},
            ].map(({icon:Icon,label,val,color,bg})=>(
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`}/>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input placeholder="Buscar por nombre, email o teléfono..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"/>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Lista */}
            <div className="space-y-2">
              {loading&&<p className="text-center text-gray-400 text-sm py-8">Cargando...</p>}
              {filtrados.map(c=>{
                const stats=statsMap[c.id]
                const isSelected=selected?.id===c.id
                return (
                  <button key={c.id} onClick={()=>abrirCliente(c)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${isSelected?'border-primary-400 bg-primary-50/50 shadow-md':'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600 shrink-0">
                        {c.nombre?.charAt(0)?.toUpperCase()??'?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{c.nombre??'Sin nombre'}</p>
                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {stats?(
                          <>
                            <p className="text-xs font-bold text-green-600">RD${Math.round(stats.ltv).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">{stats.total} pedido{stats.total!==1?'s':''}</p>
                          </>
                        ):<p className="text-[10px] text-gray-300">Sin pedidos</p>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Detalle cliente */}
            {selected&&(
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-black text-primary-600">
                      {selected.nombre?.charAt(0)?.toUpperCase()??'?'}
                    </div>
                    <div>
                      <h2 className="font-black text-gray-900">{selected.nombre??'Sin nombre'}</h2>
                      <p className="text-xs text-gray-400">Cliente desde {new Date(selected.created_at).toLocaleDateString('es-DO',{month:'short',year:'numeric'})}</p>
                    </div>
                  </div>
                  <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-green-700">RD${Math.round(statsMap[selected.id]?.ltv??0).toLocaleString()}</p>
                    <p className="text-xs text-green-600">Valor total (LTV)</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-blue-700">{statsMap[selected.id]?.total??0}</p>
                    <p className="text-xs text-blue-600">Pedidos</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {selected.email&&<div className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400"/>{selected.email}</div>}
                  {selected.telefono&&<div className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400"/>{selected.telefono}</div>}
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Historial de pedidos</p>
                  {(pedidos[selected.id]??[]).length===0?(
                    <p className="text-xs text-gray-400 text-center py-4">Sin pedidos</p>
                  ):(pedidos[selected.id]??[]).map((p:any)=>(
                    <div key={p.id} className="flex items-center gap-2 py-2 border-b border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800">#{(p.numero_orden??p.id.slice(-8)).toUpperCase()}</p>
                        <p className="text-[11px] text-gray-400">{new Date(p.created_at).toLocaleDateString('es-DO')}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO_COLOR[p.estado]??'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                      <span className="text-xs font-bold text-gray-700 shrink-0">RD${p.total?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
