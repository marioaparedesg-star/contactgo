'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Save, ChevronDown, ChevronRight, Package, Eye, EyeOff,
         History, Download, Archive, ArchiveRestore, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const sb = createClient()

type Producto = {
  id:string; nombre:string; tipo:string; marca:string
  stock:number; activo:boolean; archivado:boolean; precio:number; stock_minimo:number
}
type InvItem = { id:string; product_id:string; sph:number; cyl?:number; stock:number }

const TIPOS_CON_DIOPTRÍAS = ['esferico', 'color']
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
  const [mostrarArchivados, setMostrarArchivados] = useState(false)
  const [historial,  setHistorial]  = useState<any[]>([])
  const [showHistorial, setShowHistorial] = useState(false)
  const [umbral, setUmbral] = useState(3)
  const [stockEdit, setStockEdit] = useState<Record<string,number>>({}) // para productos sin dioptrías

  useEffect(()=>{
    sb.from('products').select('id,nombre,tipo,marca,stock,activo,archivado,precio,stock_minimo')
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
    if (TIPOS_CON_DIOPTRÍAS.includes(p.tipo)) await cargarInventario(p.id)
  }

  // Guardar stock de item con dioptría
  const guardarItem = async (item:InvItem) => {
    const key = `${item.product_id}-${item.sph}${item.cyl!=null?`-${item.cyl}`:''}`
    const val = editando[key]
    if (val===undefined||val===item.stock) return
    setGuardando(key)
    await sb.from('product_inventory').update({stock:val,updated_at:new Date().toISOString()}).eq('id',item.id)
    setInventario(prev=>{
      const newInv = (prev[item.product_id]??[]).map(i=>i.id===item.id?{...i,stock:val}:i)
      const nuevoTotal = newInv.reduce((s,i)=>s+i.stock,0)
      setProductos(ps=>ps.map(p=>p.id===item.product_id?{...p,stock:nuevoTotal}:p))
      return {...prev,[item.product_id]:newInv}
    })
    setEditando(prev=>{const n={...prev};delete n[key];return n})
    toast.success(`SPH ${item.sph>0?'+':''}${item.sph} → ${val}u ✓`)
    setGuardando(null)
  }

  // Guardar todos los cambios de un producto con dioptrías
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
    setInventario(prev=>{
      const newInvAll = (prev[pid]??[]).map(i=>{
        const key=`${pid}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`
        const v=editando[key]; return v!==undefined?{...i,stock:v}:i
      })
      const totalAll = newInvAll.reduce((s,i)=>s+i.stock,0)
      setProductos(ps=>ps.map(p=>p.id===pid?{...p,stock:totalAll}:p))
      return {...prev,[pid]:newInvAll}
    })
    setEditando(prev=>{const n={...prev};its.forEach(i=>{const k=`${pid}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`; delete n[k]});return n})
    toast.success(`${its.length} dioptrías guardadas ✓`)
    setGuardando(null)
  }

  // Guardar stock directo (productos sin dioptrías)
  const guardarStockDirecto = async (pid:string) => {
    const val = stockEdit[pid]
    if (val===undefined) return
    setGuardando(pid)
    await sb.from('products').update({stock:val}).eq('id',pid)
    setProductos(ps=>ps.map(p=>p.id===pid?{...p,stock:val}:p))
    setStockEdit(prev=>{const n={...prev};delete n[pid];return n})
    toast.success(`Stock actualizado → ${val}u ✓`)
    setGuardando(null)
  }

  // Archivar / desarchivar producto
  const toggleArchivado = async (p:Producto) => {
    const nuevoEstado = !p.archivado
    const update: any = {
      archivado: nuevoEstado,
      activo: nuevoEstado ? false : true,
    }
    if (nuevoEstado) {
      update.archivado_en = new Date().toISOString()
      update.archivado_razon = 'stock_agotado'
    } else {
      update.archivado_en = null
      update.archivado_razon = null
    }
    await sb.from('products').update(update).eq('id',p.id)
    setProductos(ps=>ps.map(pr=>pr.id===p.id?{...pr,...update}:pr))
    toast.success(nuevoEstado ? `${p.nombre} archivado` : `${p.nombre} restaurado`)
  }

  const verHistorial = async () => {
    const {data} = await sb.from('inventory_log').select('*').order('created_at',{ascending:false}).limit(60)
    setHistorial(data??[])
    setShowHistorial(true)
  }

  const exportarCSV = () => {
    const filas: any[] = []
    productos.filter(p=>!p.archivado).forEach(p=>{
      const its = inventario[p.id]??[]
      if (its.length===0) {
        filas.push({producto:p.nombre,marca:p.marca,tipo:p.tipo,sph:'—',cyl:'—',stock:p.stock})
      } else {
        its.forEach(i=>filas.push({producto:p.nombre,marca:p.marca,tipo:p.tipo,sph:i.sph,cyl:i.cyl??'',stock:i.stock}))
      }
    })
    const csv = ['Producto,Marca,Tipo,SPH,CYL,Stock',...filas.map(r=>Object.values(r).join(','))].join('\n')
    const a = document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
    a.download=`inventario_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  }

  const filtrados = productos.filter(p=>{
    if (!mostrarArchivados && p.archivado) return false
    if (mostrarArchivados && !p.archivado) return false
    if (tipoFiltro!=='todos'&&p.tipo!==tipoFiltro) return false
    if (busqueda&&!p.nombre.toLowerCase().includes(busqueda.toLowerCase())&&
        !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (soloProblemas) {
      const its = inventario[p.id]??[]
      if (its.length>0) return its.some(i=>(editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock)<=umbral)
      return p.stock<=umbral
    }
    return true
  })

  const activos = productos.filter(p=>!p.archivado)
  const archivados = productos.filter(p=>p.archivado)
  const agotadasTotal = activos.reduce((s,p)=>{
    const its=inventario[p.id]??[]
    return s+(its.length>0?its.filter(i=>i.stock===0).length:(p.stock===0?1:0))
  },0)
  const bajasTotal = activos.reduce((s,p)=>{
    const its=inventario[p.id]??[]
    return s+(its.length>0?its.filter(i=>i.stock>0&&i.stock<=umbral).length:(p.stock>0&&p.stock<=umbral?1:0))
  },0)

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
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">{activos.length} activos · {archivados.length} archivados</span>
            {agotadasTotal>0&&<span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{agotadasTotal} agotadas</span>}
            {bajasTotal>0&&<span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{bajasTotal} stock bajo</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <span>Alerta:</span>
            <input type="number" min="1" max="10" value={umbral}
              onChange={e=>setUmbral(parseInt(e.target.value)||3)}
              className="w-8 text-center font-bold text-gray-700 border-0 outline-none bg-transparent"/>
            <span>u</span>
          </div>
          <button onClick={verHistorial}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <History className="w-3.5 h-3.5"/>Historial
          </button>
          <button onClick={exportarCSV}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <Download className="w-3.5 h-3.5"/>CSV
          </button>
          <button onClick={()=>setSoloProblemas(p=>!p)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${soloProblemas?'bg-red-50 border-red-200 text-red-700':'bg-white border-gray-200 text-gray-600'}`}>
            {soloProblemas?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
            Problemas
          </button>
        </div>
      </div>

      {/* Tab activos / archivados */}
      <div className="flex gap-2">
        <button onClick={()=>setMostrarArchivados(false)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!mostrarArchivados?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600'}`}>
          Activos ({activos.length})
        </button>
        <button onClick={()=>setMostrarArchivados(true)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mostrarArchivados?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600'}`}>
          <Archive className="w-3.5 h-3.5 inline mr-1.5"/>Archivados ({archivados.length})
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"/>
          <input placeholder="Buscar producto o marca..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"/>
        </div>
        {[['todos','Todos'],['esferico','Esféricos'],['color','Color'],['torico','Tóricos'],['multifocal','Multifocales'],['solucion','Soluciones'],['gota','Gotas']].map(([v,l])=>(
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
            <p className="text-sm">{mostrarArchivados?'Sin productos archivados':'No hay productos que coincidan'}</p>
          </div>
        )}
        {filtrados.map(p=>{
          const meta = TIPO_META[p.tipo]??{label:p.tipo,color:'#6b7280',bg:'#f9fafb'}
          const abierto = expandido===p.id
          const tieneDioptrias = TIPOS_CON_DIOPTRÍAS.includes(p.tipo)
          const its = inventario[p.id]??[]
          const pendientes = its.filter(i=>{
            const k=`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`
            return editando[k]!==undefined
          }).length
          const agotadas  = its.filter(i=>(editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock)===0).length
          const bajas     = its.filter(i=>{
            const s=editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock
            return s>0&&s<=umbral
          }).length
          const stockActual = tieneDioptrias
            ? its.reduce((s,i)=>s+(editando[`${p.id}-${i.sph}${i.cyl!=null?`-${i.cyl}`:''}`]??i.stock),0)
            : (stockEdit[p.id]??p.stock)

          return (
            <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${p.archivado?'opacity-70 border-gray-200':'border-gray-100'}`}>
              <button onClick={()=>toggle(p)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50/80">
                <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{color:meta.color,background:meta.bg}}>{meta.label}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</span>
                    <span className="text-xs text-gray-400">{p.marca}</span>
                    {p.archivado&&<span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Archivado</span>}
                  </div>
                  {abierto&&tieneDioptrias&&its.length>0&&(
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-gray-400">{its.length} dioptrías · {stockActual}u total</span>
                      {agotadas>0&&<span className="text-[11px] font-semibold text-red-500">{agotadas} agotadas</span>}
                      {bajas>0&&<span className="text-[11px] font-semibold text-amber-500">{bajas} bajas</span>}
                    </div>
                  )}
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Stock badge / edit para productos SIN dioptrías */}
                  {!tieneDioptrias&&abierto&&(
                    <div className="flex items-center gap-1.5" onClick={e=>e.stopPropagation()}>
                      <input type="number" min="0" value={stockEdit[p.id]??p.stock}
                        onChange={e=>setStockEdit(prev=>({...prev,[p.id]:parseInt(e.target.value)||0}))}
                        onBlur={()=>guardarStockDirecto(p.id)}
                        onKeyDown={e=>e.key==='Enter'&&guardarStockDirecto(p.id)}
                        className="w-16 text-center text-sm font-bold border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-primary-400"/>
                      <span className="text-xs text-gray-400">u</span>
                    </div>
                  )}
                  {!tieneDioptrias&&!abierto&&(
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock===0?'bg-red-100 text-red-600':p.stock<=umbral?'bg-amber-100 text-amber-600':'bg-green-100 text-green-700'}`}>
                      {p.stock}u
                    </span>
                  )}
                  {tieneDioptrias&&!abierto&&(
                    <div className="flex items-center gap-1.5">
                      {agotadas>0&&<span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{agotadas} agot.</span>}
                      {bajas>0&&<span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">{bajas} bajas</span>}
                      {agotadas===0&&bajas===0&&<span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{p.stock}u</span>}
                    </div>
                  )}

                  {/* Guardar dioptrías pendientes */}
                  {pendientes>0&&(
                    <button onClick={e=>{e.stopPropagation();guardarTodos(p.id)}} disabled={guardando===p.id}
                      className="flex items-center gap-1.5 bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      <Save className="w-3 h-3"/>Guardar {pendientes}
                    </button>
                  )}

                  {/* Archivar / restaurar */}
                  <button onClick={e=>{e.stopPropagation();toggleArchivado(p)}}
                    title={p.archivado?'Restaurar producto':'Archivar producto'}
                    className={`p-1.5 rounded-lg border transition-colors ${p.archivado?'bg-green-50 border-green-200 text-green-600 hover:bg-green-100':'bg-gray-50 border-gray-200 text-gray-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'}`}>
                    {p.archivado?<ArchiveRestore className="w-3.5 h-3.5"/>:<Archive className="w-3.5 h-3.5"/>}
                  </button>

                  {abierto?<ChevronDown className="w-4 h-4 text-gray-400"/>:<ChevronRight className="w-4 h-4 text-gray-400"/>}
                </div>
              </button>

              {/* Panel expandido — dioptrías */}
              {abierto&&tieneDioptrias&&(
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
                  {its.length===0?(
                    <div className="text-center py-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1.5"/>
                      <p className="text-sm text-gray-500 font-medium">Sin dioptrías registradas</p>
                      <p className="text-xs text-gray-400 mt-0.5">Agrega filas en Supabase → product_inventory</p>
                    </div>
                  ):(
                    <>
                      <div className="grid gap-1.5" style={{gridTemplateColumns:'repeat(auto-fill,minmax(76px,1fr))'}}>
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
                                onChange={e=>setEditando(prev=>({...prev,[key]:Math.max(0,parseInt(e.target.value)||0)}))}
                                onBlur={()=>guardarItem(item)}
                                onKeyDown={e=>e.key==='Enter'&&guardarItem(item)}
                                className={`w-full text-center text-sm font-bold bg-transparent border-0 outline-none focus:ring-1 focus:ring-primary-400 rounded ${textClass}`}/>
                              {guardando===key&&<div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mt-0.5"/>}
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-3 text-center">
                        Edita → Enter o blur para guardar · Total: {stockActual}u
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Panel expandido — producto sin dioptrías */}
              {abierto&&!tieneDioptrias&&(
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Stock disponible</p>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" value={stockEdit[p.id]??p.stock}
                          onChange={e=>setStockEdit(prev=>({...prev,[p.id]:parseInt(e.target.value)||0}))}
                          onBlur={()=>guardarStockDirecto(p.id)}
                          onKeyDown={e=>e.key==='Enter'&&guardarStockDirecto(p.id)}
                          className="w-24 text-center text-lg font-black border-2 border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"/>
                        <span className="text-sm text-gray-500">unidades</span>
                        {guardando===p.id&&<div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"/>}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Presiona Enter para guardar</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${(stockEdit[p.id]??p.stock)===0?'bg-red-100':(stockEdit[p.id]??p.stock)<=umbral?'bg-amber-100':'bg-green-100'}`}>
                      <span className={`text-xl font-black ${(stockEdit[p.id]??p.stock)===0?'text-red-600':(stockEdit[p.id]??p.stock)<=umbral?'text-amber-600':'text-green-700'}`}>
                        {stockEdit[p.id]??p.stock}
                      </span>
                      <span className={`text-[10px] font-bold ${(stockEdit[p.id]??p.stock)===0?'text-red-500':(stockEdit[p.id]??p.stock)<=umbral?'text-amber-500':'text-green-600'}`}>
                        {(stockEdit[p.id]??p.stock)===0?'Agotado':(stockEdit[p.id]??p.stock)<=umbral?'Bajo':'OK'}
                      </span>
                    </div>
                  </div>
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
