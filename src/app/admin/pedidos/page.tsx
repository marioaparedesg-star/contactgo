'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, X, Printer, MessageCircle, Package, CheckCircle, Truck, Clock, XCircle, CreditCard, Hash, Bell, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'

const ESTADOS = ['pendiente','confirmado','preparando','enviado','entregado','cancelado']
const ESTADO_COLOR: Record<string,string> = {
  pendiente:'bg-amber-50 text-amber-700 border-amber-200', confirmado:'bg-blue-50 text-blue-700 border-blue-200',
  preparando:'bg-purple-50 text-purple-700 border-purple-200', enviado:'bg-indigo-50 text-indigo-700 border-indigo-200',
  entregado:'bg-green-50 text-green-700 border-green-200', cancelado:'bg-red-50 text-red-700 border-red-200',
}
const ESTADO_ICON: Record<string,any> = {
  pendiente:Clock, confirmado:CheckCircle, preparando:Package, enviado:Truck, entregado:CheckCircle, cancelado:XCircle,
}

export default function PedidosPage() {
  const sb = createClient()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [items, setItems] = useState<Record<string,any[]>>({})
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPago, setFiltroPago] = useState('todos')
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
    sb.from('orders').select('*')
      .not('pago_estado','eq','declinado')
      .not('numero_orden','like','CG-TEST%')
      .order('created_at',{ascending:false})
      .then(({data})=>{ setPedidos(data??[]); setLoading(false) })
  },[])

  const abrirPedido = async (p:any) => {
    setSelected(p)
    if (!items[p.id]) {
      const {data} = await sb.from('order_items').select('*').eq('order_id',p.id)
      setItems(i=>({...i,[p.id]:data??[]}))
    }
  }

  const cambiarEstado = async (orderId:string, estado:string) => {
    await sb.from('orders').update({estado}).eq('id',orderId)
    setPedidos(ps=>ps.map(p=>p.id===orderId?{...p,estado}:p))
    if (selected?.id===orderId) setSelected((s:any)=>({...s,estado}))
    toast.success(`Estado → ${estado}`)
    // Notificar al cliente automáticamente
    fetch('/api/notify',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({order_id:orderId, evento:'estado_cambio', nuevo_estado:estado})
    }).then(r=>r.ok&&toast.success('Cliente notificado ✉️',{duration:2000,icon:'📧'}))
      .catch(()=>{})
  }



  const printOrder = () => {
    if (!selected) return
    const pedidoId = (selected.numero_orden??selected.id.slice(0,8)).toUpperCase()
    const fecha = new Date(selected.created_at??Date.now()).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'})
    const its = items[selected.id]??[]
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pedido ${pedidoId}</title>
    <style>body{font-family:Arial,sans-serif;padding:20px;font-size:13px}h2{color:#16a34a}table{width:100%;border-collapse:collapse}td,th{padding:6px 8px;border:1px solid #e5e7eb}th{background:#f9fafb}.total{font-weight:bold;font-size:15px}</style></head>
    <body><h2>ContactGo — Pedido #${pedidoId}</h2>
    <p><b>Fecha:</b> ${fecha} | <b>Cliente:</b> ${selected.cliente_nombre} | <b>Tel:</b> ${selected.cliente_telefono??'—'}</p>
    <p><b>Email:</b> ${selected.cliente_email??'—'} | <b>Dirección:</b> ${selected.direccion_texto??'—'}</p>
    <p><b>Pago:</b> ${selected.metodo_pago?.replace('_',' ')} | <b>Estado pago:</b> ${selected.pago_estado} ${selected.ncf?`| <b>NCF:</b> ${selected.ncf}`:''}</p>
    <table><tr><th>Producto</th><th>Receta</th><th>Cant.</th><th>Precio</th></tr>
    ${its.map((i:any)=>`<tr><td>${i.nombre}</td><td>${[i.sph!=null?`SPH ${Number(i.sph)>0?'+':''}${Number(i.sph)>0?Number(i.sph).toFixed(2):i.sph}`:null,i.cyl?`CYL ${i.cyl}`:null,i.axis?`${i.axis}°`:null].filter(Boolean).join(' ')}</td><td>${i.cantidad}</td><td>RD$${i.precio?.toLocaleString()}</td></tr>`).join('')}
    <tr><td colspan="3" style="text-align:right" class="total">Total</td><td class="total">RD$${selected.total?.toLocaleString()}</td></tr></table>
    <script>window.print();window.close();</script></body></html>`
    const w = window.open('','_blank'); w?.document.write(html); w?.document.close()
  }

  const filtrados = pedidos.filter(p=>{
    if (filtroEstado!=='todos' && p.estado!==filtroEstado) return false
    if (filtroPago!=='todos' && p.metodo_pago!==filtroPago) return false
    if (!search) return true
    const q = search.toLowerCase()
    return p.cliente_nombre?.toLowerCase().includes(q) ||
           p.numero_orden?.toLowerCase().includes(q) ||
           p.cliente_email?.toLowerCase().includes(q) ||
           p.id.toLowerCase().includes(q)
  })

  const METODO_LABEL: Record<string,string> = {tarjeta:'💳 AZUL', contra_entrega:'💵 Contra entrega'}

  return (
    <div className="max-w-7xl mx-auto w-full">
<div className="max-w-7xl mx-auto p-4 md:p-6">

          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">{pedidos.length} total · {pedidos.filter(p=>p.estado==='confirmado'&&p.pago_estado!=='pagado').length} por preparar · {pedidos.filter(p=>p.pago_estado==='pagado'&&p.estado!=='entregado').length} pagados</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"/>
              <input placeholder="Buscar por nombre, email o # orden..." value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"/>
            </div>
            <select value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option value="todos">Todos los estados</option>
              {ESTADOS.map(e=><option key={e} value={e}>{e.charAt(0).toUpperCase()+e.slice(1)}</option>)}
            </select>
            <select value={filtroPago} onChange={e=>setFiltroPago(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option value="todos">Todos</option>
              <option value="tarjeta">💳 Tarjeta AZUL</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Lista */}
            <div className="space-y-2">
              {loading && <p className="text-center text-gray-400 text-sm py-8">Cargando...</p>}
              {!loading && filtrados.length===0 && <p className="text-center text-gray-400 text-sm py-8">Sin resultados</p>}
              {filtrados.map(p=>{
                const Icon = ESTADO_ICON[p.estado]??Clock
                const isSelected = selected?.id===p.id
                return (
                  <button key={p.id} onClick={()=>abrirPedido(p)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${isSelected?'border-primary-400 bg-primary-50/50 shadow-md':'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-900 truncate">{p.cliente_nombre}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLOR[p.estado]??'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {p.estado}
                          </span>
                          {p.pago_estado==='pagado'&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Pagado</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                          {p.metodo_pago==='tarjeta'?<CreditCard className="w-3 h-3"/>:<Truck className="w-3 h-3"/>}
                          #{(p.numero_orden??p.id.slice(-8)).toUpperCase()} · {new Date(p.created_at).toLocaleDateString('es-DO')}
                        </p>
                      </div>
                      <span className="font-black text-sm text-gray-900 shrink-0">RD${p.total?.toLocaleString()}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Detalle */}
            {selected && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-black text-gray-900">#{(selected.numero_orden??selected.id.slice(-8)).toUpperCase()}</h2>
                    <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString('es-DO')}</p>
                  </div>
                  <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                </div>

                {/* Info cliente */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm space-y-1">
                  <p className="font-semibold text-gray-800">{selected.cliente_nombre}</p>
                  <p className="text-gray-500">{selected.cliente_email}</p>
                  <p className="text-gray-500">{selected.cliente_telefono}</p>
                  <p className="text-gray-500 text-xs">{selected.direccion_texto}</p>
                  {selected.lat && selected.lng && (
                    <p className="text-[10px] text-blue-500 font-mono mt-0.5">{selected.lat?.toFixed(5)}, {selected.lng?.toFixed(5)}</p>
                  )}
                </div>

                {/* NCF */}
                {selected.ncf && (
                  <div className="flex items-center gap-2 mb-3 bg-blue-50 rounded-xl px-3 py-2">
                    <Hash className="w-3.5 h-3.5 text-blue-600"/>
                    <span className="text-xs font-mono font-bold text-blue-700">{selected.ncf}</span>
                    <span className="text-xs text-blue-500">NCF</span>
                  </div>
                )}

                {/* Pago */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500">{METODO_LABEL[selected.metodo_pago]??selected.metodo_pago}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected.pago_estado==='pagado'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>
                    {selected.pago_estado}
                  </span>
                  {selected.azul_auth_code && <span className="text-[10px] text-gray-400">Auth: {selected.azul_auth_code}</span>}
                </div>

                {/* Productos */}
                {(items[selected.id]??[]).length>0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Productos</p>
                    <div className="space-y-2">
                      {(items[selected.id]??[]).map((i:any,idx:number)=>(
                        <div key={idx} className="flex gap-2 text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-xs">{i.nombre}</p>
                            {(i.sph!=null||i.cyl||i.axis) && (
                              <p className="text-[10px] text-blue-600 font-mono">
                                {[i.sph!=null?`SPH ${Number(i.sph)>0?'+':''}${i.sph}`:null,i.cyl?`CYL ${i.cyl}`:null,i.axis?`${i.axis}°`:null,i.ojo].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-800">RD${i.precio?.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">×{i.cantidad}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-2 flex justify-between">
                      <span className="text-xs font-bold text-gray-700">Total</span>
                      <span className="text-sm font-black text-gray-900">RD${selected.total?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Cambiar estado */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Estado del pedido</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ESTADOS.map(e=>(
                      <button key={e} onClick={()=>cambiarEstado(selected.id,e)}
                        className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all ${selected.estado===e?ESTADO_COLOR[e]+' border-current':'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-1 flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2">
                    <Bell className="w-3.5 h-3.5"/>Cliente notificado al cambiar estado
                  </div>
                  <button onClick={()=>window.open(`https://wa.me/${selected.cliente_telefono?.replace(/\D/g,'')}?text=Hola+${encodeURIComponent(selected.cliente_nombre?.split(' ')[0]??'')}+tu+pedido+%23${selected.numero_orden??selected.id.slice(-8)}+está+${selected.estado}`,'_blank')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">
                    <MessageCircle className="w-3.5 h-3.5"/>WA
                  </button>
                  {selected.lat && selected.lng && (
                    <button onClick={()=>window.open(`https://www.google.com/maps?q=${selected.lat},${selected.lng}`,'_blank')}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      title="Ver ubicación del cliente en Google Maps">
                      <Navigation className="w-3.5 h-3.5"/>Mapa
                    </button>
                  )}
                  <button onClick={printOrder}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
                    <Printer className="w-3.5 h-3.5"/>Imprimir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
