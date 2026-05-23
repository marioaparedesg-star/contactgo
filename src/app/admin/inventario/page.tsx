'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Save, ChevronDown, ChevronRight, Package, Eye, EyeOff, History, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const sb = createClient()
type Producto = { id:string; nombre:string; tipo:string; marca:string; stock:number; activo:boolean; precio:number; stock_minimo:number }
type InvItem = { id:string; product_id:string; sph:number; cyl?:number; stock:number }

const TIPO_META: Record<string,{label:string;color:string;bg:string}> = {
  esferico:   {label:'Esférico',   color:'#1d4ed8',bg:'#eff6ff'},
  color:      {label:'Color',      color:'#be185d',bg:'#fdf2f8'},
  torico:     {label:'Tórico',     color:'#7c3aed',bg:'#f5f3ff'},
  multifocal: {label:'Multifocal', color:'#b45309',bg:'#fffbeb'},
  solucion:   {label:'Solución',   color:'#0f766e',bg:'#f0fdfa'},
  gota:       {label:'Gota',       color:'#0369a1',bg:'#f0f9ff'},
}

export default function InventarioPage() {
  const [productos,  setProductos]  = useState<Producto[]>([])
  const [inventario, setInventario] = useState<Record<string,InvItem[]>>({})
  const [expandido,  setExpandido]  = useState<string|null>(null)
  const [editando,   setEditando]   = useState<Record<string,number>>({})
  const [busqueda,   setBusqueda]   = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [loading,    setLoading]    = useState(true)
  const [guardando,  setGuardando]  = useState<string|null>(null)
  const [soloProblemas, setSoloProblemas] = useState(false)
  const [historial,  setHistorial]  = useState<any[]>([])
  const [showHistorial, setShowHistorial] = useState(false)
  const [umbral, setUmbral] = useState(3)

  useEffect(()=>{
    sb.from('products').select('id,nombre,tipo,marca,stock,activo,precio,stock_minimo')
      .order('tipo').order('nombre')
      .then(({data})=>{ setProductos(data??[]); setLoading(false) })
  },[])

  const cargarInventario = async (pid:string) => {
    if (inventario[pid]) return
    const {data} = await sb.from('product_inventory').select('*').eq('product_id',pid).order('sph')
    setInventario(prev=>({...prev,[pid]:data??[]}))
  }

  const toggle = async (p:Producto) => {
    if (expandido===p.id) { setExpandido(null); return }
    setExpandido(p.id)
    await cargarInventario(p.id)
  }

  const setEdit = (pid:string, key:string, v:number) =>
    setEditando(prev=>({...prev,[`${pid}-${key}`]:v}))

  const guardarItem = async (item:InvItem) => {
    const key = `${item.product_id}-${item.sph}${item.cyl!=null?`-${item.cyl}`:''}`
    const val = editando[key]
    if (val===undefined||val===item.stock) return
    setGuardando(key)
    await sb.from('product_inventory').update({stock:val,updated_at:new Date().toISOString()}).eq('id',item.id)
    setInventario(prev=>({...prev,[item.product_id]:prev[item.product_id].map(i=>i.id===item.id?{...i,stock:val}:i)}))
    setEditando(prev=>{const n={...prev};delete n[key];return n})
    const sphLabel = `SPH ${item.sph>0?'+':''}${item.sph}${item.cyl!=null?` CYL ${item.cyl}`:''}`
    toast.success(`${sphLabel} → ${val}u ✓`)
    setGuardando(null)
  }

  const guardarTodos = async (pid:string) => {
    const its = (inventario[pid]??[]).filter(i=>{
      const key=`${pid}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`
      return editando[key]!==undefined
    })
    if (!its.length) return
    setGuardando(pid)
    for (const item of its) {
      const key=`${pid}-${item.sph}${item.cyl!=null?`-${item.cyl}`:''}`
      const val=editando[key]
      if (val!==undefined) await sb.from('product_inventory').update({stock:val,updated_at:new Date().toISOString()}).eq('id',item.id)
    }
    setInventario(prev=>({...prev,[pid]:prev[pid].map(i=>{
      const key=`${pid}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`
      const v=editando[key]; return v!==undefined?{...i,stock:v}:i
    })}))
    setEditando(prev=>{const n={...prev};its.forEach(i=>{const k=`${pid}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`; delete n[k]});return n})
    toast.success(`${its.length} dioptrías guardadas ✓`)
    setGuardando(null)
  }

  const verHistorial = async () => {
    const {data} = await sb.from('inventory_log').select('*').order('created_at',{ascending:false}).limit(50)
    setHistorial(data??[])
    setShowHistorial(true)
  }

  const exportarExcel = () => {
    const filas: {producto:string;marca:string;tipo:string;sph:any;cyl:any;stock:number}[] = []
    productos.forEach(p=>{
      const its = inventario[p.id]??[]
      if (its.length===0) { filas.push({producto:p.nombre,marca:p.marca,tipo:p.tipo,sph:'—',cyl:'—',stock:p.stock}); return }
      its.forEach(i=>filas.push({producto:p.nombre,marca:p.marca,tipo:p.tipo,sph:i.sph,cyl:i.cyl??'',stock:i.stock}))
    })
    const csv = ['Producto,Marca,Tipo,SPH,CYL,Stock',...filas.map(r=>Object.values(r).join(','))].join('\n')
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download=`inventario_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  }

  const filtrados = productos.filter(p=>{
    if (tipoFiltro!=='todos'&&p.tipo!==tipoFiltro) return false
    if (busqueda&&!p.nombre.toLowerCase().includes(busqueda.toLowerCase())&&!p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (soloProblemas) {
      const its = inventario[p.id]??[]
      if (its.length>0) return its.some(i=>(editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock)<=umbral)
      return p.stock<=umbral
    }
    return true
  })

  const statsGlobal = {
    agotadas: productos.reduce((s,p)=>{
      const its=inventario[p.id]??[]
      return s+(its.length>0?its.filter(i=>i.stock===0).length:(p.stock===0?1:0))
    },0),
    bajas: productos.reduce((s,p)=>{
      const its=inventario[p.id]??[]
      return s+(its.length>0?its.filter(i=>i.stock>0&&i.stock<=umbral).length:(p.stock>0&&p.stock<=umbral?1:0))
    },0),
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"/>
        <p className="text-sm text-gray-500">Cargando inventario...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventario</h1>
          <div className="flex items-center gap-3 mt-1">
            {statsGlobal.agotadas>0&&<span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{statsGlobal.agotadas} agotadas</span>}
            {statsGlobal.bajas>0&&<span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{statsGlobal.bajas} stock bajo</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <span>Umbral:</span>
            <input type="number" min="1" max="10" value={umbral} onChange={e=>setUmbral(parseInt(e.target.value)||3)}
              className="w-8 text-center font-bold text-gray-700 border-0 outline-none bg-transparent"/>
            <span>u</span>
          </div>
          <button onClick={verHistorial}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <History className="w-3.5 h-3.5"/>Historial
          </button>
          <button onClick={exportarExcel}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <Download className="w-3.5 h-3.5"/>Exportar CSV
          </button>
          <button onClick={()=>setSoloProblemas(p=>!p)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${soloProblemas?'bg-red-50 border-red-200 text-red-700':'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {soloProblemas?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
            {soloProblemas?'Ver todos':'Solo problemas'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"/>
          <input type="text" placeholder="Buscar producto o marca..."
            value={busqueda} onChange={e=>setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"/>
        </div>
        {[['todos','Todos'],['esferico','Esféricos'],['color','Color'],['torico','Tóricos'],['multifocal','Multifocales'],['solucion','Soluciones']].map(([v,l])=>(
          <button key={v} onClick={()=>setTipoFiltro(v)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tipoFiltro===v?'bg-gray-900 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrados.length===0&&(
          <div className="text-center py-12 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30"/>
            <p className="text-sm">No hay productos que coincidan</p>
          </div>
        )}
        {filtrados.map(p=>{
          const meta = TIPO_META[p.tipo]??{label:p.tipo,color:'#6b7280',bg:'#f9fafb'}
          const abierto = expandido===p.id
          const its = inventario[p.id]??[]
          const pendientes = its.filter(i=>{const k=`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`; return editando[k]!==undefined}).length
          const agotadas  = its.filter(i=>(editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock)===0).length
          const bajas     = its.filter(i=>{const s=editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock; return s>0&&s<=umbral}).length

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={()=>toggle(p)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50/80">
                <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{color:meta.color,background:meta.bg}}>{meta.label}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</span>
                    <span className="text-xs text-gray-400">{p.marca}</span>
                  </div>
                  {abierto&&its.length>0&&(
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-gray-400">{its.length} dioptrías</span>
                      {agotadas>0&&<span className="text-[11px] font-semibold text-red-500">{agotadas} agotadas</span>}
                      {bajas>0&&<span className="text-[11px] font-semibold text-amber-500">{bajas} bajo umbral</span>}
                    </div>
                  )}
                </div>
                {/* Alertas compactas cuando cerrado */}
                {!abierto&&its.length>0&&(agotadas>0||bajas>0)&&(
                  <div className="flex gap-1.5">
                    {agotadas>0&&<span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{agotadas} agotadas</span>}
                    {bajas>0&&<span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">{bajas} bajas</span>}
                  </div>
                )}
                {/* Stock general si no tiene product_inventory */}
                {!abierto&&its.length===0&&(
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock===0?'bg-red-100 text-red-600':p.stock<=umbral?'bg-amber-100 text-amber-600':'bg-green-100 text-green-700'}`}>
                    {p.stock} u
                  </span>
                )}
                {pendientes>0&&(
                  <button onClick={e=>{e.stopPropagation();guardarTodos(p.id)}} disabled={guardando===p.id}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                    <Save className="w-3 h-3"/>Guardar {pendientes}
                  </button>
                )}
                {abierto?<ChevronDown className="w-4 h-4 text-gray-400 shrink-0"/>:<ChevronRight className="w-4 h-4 text-gray-400 shrink-0"/>}
              </button>

              {abierto&&(
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
                  {its.length===0?(
                    <div className="text-center py-3">
                      <p className="text-sm text-gray-400 mb-2">Sin dioptrías registradas</p>
                      <p className="text-xs text-gray-300">Stock general: <span className="font-bold text-gray-500">{p.stock} unidades</span></p>
                    </div>
                  ):(
                    <>
                      <div className="grid gap-1.5" style={{gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))'}}>
                        {its.map(item=>{
                          const key=`${p.id}-${item.sph}${item.cyl!=null?`-${item.cyl}`:''}`
                          const val=editando[key]??item.stock
                          const modificado=editando[key]!==undefined
                          const sphLabel=`${item.sph>0?'+':''}${item.sph}${item.cyl!=null?`/${item.cyl}`:''}`
                          const bgClass=val===0?'bg-red-50 border-red-200':val<=umbral?'bg-amber-50 border-amber-200':modificado?'bg-primary-50 border-primary-200':'bg-white border-gray-200'
                          const textClass=val===0?'text-red-600':val<=umbral?'text-amber-600':modificado?'text-primary-700':'text-gray-800'
                          return (
                            <div key={item.id} className={`border rounded-xl p-2 text-center transition-all ${bgClass}`}>
                              <p className="text-[10px] font-bold text-gray-500 mb-1 leading-none">{sphLabel}</p>
                              <input type="number" min="0" max="999" value={val}
                                onChange={e=>setEdit(p.id,`${item.sph}${item.cyl!=null?`-${item.cyl}`:''}`,Math.max(0,parseInt(e.target.value)||0))}
                                onBlur={()=>guardarItem(item)}
                                onKeyDown={e=>e.key==='Enter'&&guardarItem(item)}
                                className={`w-full text-center text-sm font-bold bg-transparent border-0 outline-none focus:ring-1 focus:ring-primary-400 rounded ${textClass}`}/>
                              {guardando===key&&<div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mt-0.5"/>}
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-3 text-center">
                        Edita el número y presiona Enter · Rojo = agotado · Amarillo = bajo umbral ({umbral}u)
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal historial */}
      {showHistorial&&(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4" onClick={()=>setShowHistorial(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[70vh] overflow-hidden shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Historial de movimientos</h3>
              <button onClick={()=>setShowHistorial(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2 max-h-[55vh]">
              {historial.length===0?(
                <p className="text-center text-gray-400 text-sm py-6">Sin movimientos registrados</p>
              ):historial.map(h=>(
                <div key={h.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${h.diferencia>0?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>
                    {h.diferencia>0?'+':''}{h.diferencia}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      SPH {h.sph>0?'+':''}{h.sph} · {h.stock_anterior}→{h.stock_nuevo}u
                    </p>
                    <p className="text-[11px] text-gray-400">{new Date(h.created_at).toLocaleString('es-DO')}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 bg-gray-50 px-2 py-0.5 rounded">{h.motivo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
