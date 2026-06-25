'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, AlertCircle, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIAS_GASTO = ['tecnologia','marketing','logistica','administracion','otro']
const SUBCATEGORIAS: Record<string,string[]> = {
  tecnologia: ['vercel','supabase','dominio','resend','sentry','otro_tech'],
  marketing:  ['meta_ads','google_ads','contenido','fotografia','otro_mkt'],
  logistica:  ['envio','empaque','mensajero','otro_log'],
  administracion: ['telefono','internet','oficina','legal','otro_adm'],
  otro: ['otro'],
}
const CANALES_MKT = ['meta','google','organico','whatsapp','referido','directo']

export default function ERPDashboard() {
  const sb = createClient()
  const [mes, setMes] = useState(new Date().toISOString().slice(0,7))
  const [gastos,    setGastos]    = useState<any[]>([])
  const [ventas,    setVentas]    = useState<any[]>([])
  const [compras,   setCompras]   = useState<any[]>([])
  const [costos,    setCostos]    = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [showGasto, setShowGasto] = useState(false)
  const [tab,       setTab]       = useState<'dashboard'|'gastos'|'roi'>('dashboard')
  const [gasto, setGasto] = useState({
    categoria:'tecnologia', subcategoria:'vercel', descripcion:'',
    monto:'', moneda:'DOP', fecha:new Date().toISOString().split('T')[0],
    recurrente:false, frecuencia:'mensual', canal_mkt:'', notas:''
  })

  const cargar = async () => {
    const [y,m] = mes.split('-')
    const desde = `${y}-${m}-01`
    const hasta = `${y}-${m}-31`

    const [
      {data:g}, {data:v}, {data:c}, {data:cost}
    ] = await Promise.all([
      sb.from('expenses').select('*').gte('fecha',desde).lte('fecha',hasta).order('fecha',{ascending:false}),
      sb.from('orders').select('total,created_at,pago_estado').eq('pago_estado','pagado').gte('created_at',`${desde}T00:00:00`).lte('created_at',`${hasta}T23:59:59`),
      sb.from('purchase_orders').select('total').eq('estado','recibida').gte('created_at',`${desde}T00:00:00`).lte('created_at',`${hasta}T23:59:59`),
      sb.from('product_costs').select('*,products(nombre,precio,sku,stock)'),
    ])

    setGastos(g??[]); setVentas(v??[]); setCompras(c??[]); setCostos(cost??[])
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[mes])

  // Métricas calculadas
  const totalVentas   = ventas.reduce((s,v)=>s+Number(v.total),0)
  const totalCompras  = compras.reduce((s,c)=>s+Number(c.total),0)
  const totalGastos   = gastos.reduce((s,g)=>s+Number(g.monto),0)
  const gastosMkt     = gastos.filter(g=>g.categoria==='marketing').reduce((s,g)=>s+Number(g.monto),0)
  const gastosTech    = gastos.filter(g=>g.categoria==='tecnologia').reduce((s,g)=>s+Number(g.monto),0)
  const utilidadBruta = totalVentas - totalCompras
  const utilidadNeta  = utilidadBruta - totalGastos
  const margenBruto   = totalVentas>0 ? (utilidadBruta/totalVentas*100) : 0
  const margenNeto    = totalVentas>0 ? (utilidadNeta/totalVentas*100)  : 0

  // ROI por canal
  const gastosPorCanal = gastos.filter(g=>g.canal_mkt).reduce((acc:Record<string,number>,g)=>{
    acc[g.canal_mkt] = (acc[g.canal_mkt]??0) + Number(g.monto); return acc
  },{})

  // Alertas de inventario
  const alertasStock = costos.filter(c=>{
    const stock = c.products?.stock ?? 0
    return stock <= 3 && c.products
  })

  const guardarGasto = async () => {
    if (!gasto.descripcion || !gasto.monto) { toast.error('Completa campos obligatorios'); return }
    await sb.from('expenses').insert({...gasto, monto:Number(gasto.monto)})
    // Registrar también en caja
    await sb.from('cash_movements').insert({
      tipo:'egreso', categoria:'gasto_operativo',
      descripcion:`${gasto.categoria}: ${gasto.descripcion}`,
      monto:Number(gasto.monto), metodo:'transferencia',
      fecha:gasto.fecha
    })
    toast.success('✅ Gasto registrado')
    setShowGasto(false)
    setGasto({categoria:'tecnologia',subcategoria:'vercel',descripcion:'',monto:'',moneda:'DOP',fecha:new Date().toISOString().split('T')[0],recurrente:false,frecuencia:'mensual',canal_mkt:'',notas:''})
    cargar()
  }

  const cardClass = "bg-white rounded-2xl border border-gray-100 shadow-sm p-5"

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📊 Dashboard Financiero ERP</h1>
            <p className="text-gray-500 text-sm">P&L · Gastos operativos · ROI por canal · Alertas inventario</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="month" value={mes} onChange={e=>setMes(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary-400"/>
            <button onClick={()=>setShowGasto(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700">
              <Plus className="w-4 h-4"/> Registrar gasto
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['dashboard','gastos','roi'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${tab===t?'bg-primary-600 text-white':'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {t==='dashboard'?'📊 P&L':t==='gastos'?'💸 Gastos':'📈 ROI & Canal'}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD P&L ── */}
        {tab==='dashboard' && (<>

          {/* KPIs principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:'Ventas netas', value:`RD$${totalVentas.toLocaleString()}`, sub:`${ventas.length} órdenes`, color:'text-green-700', bg:'bg-green-50 border-green-100' },
              { label:'Costo mercancía', value:`RD$${totalCompras.toLocaleString()}`, sub:'Compras recibidas', color:'text-red-600', bg:'bg-red-50 border-red-100' },
              { label:'Utilidad bruta', value:`RD$${utilidadBruta.toLocaleString()}`, sub:`${margenBruto.toFixed(1)}% margen`, color:utilidadBruta>=0?'text-primary-700':'text-red-700', bg:'bg-primary-50 border-primary-100' },
              { label:'Utilidad neta', value:`RD$${utilidadNeta.toLocaleString()}`, sub:`${margenNeto.toFixed(1)}% margen neto`, color:utilidadNeta>=0?'text-gray-900':'text-red-700', bg:'bg-white border-gray-100' },
            ].map(({label,value,sub,color,bg})=>(
              <div key={label} className={`${bg} border rounded-2xl p-4`}>
                <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                <p className={`text-lg font-black ${color}`}>{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* P&L detallado */}
          <div className={cardClass}>
            <h2 className="font-black text-gray-900 mb-4">Estado de Resultados — {mes}</h2>
            <div className="space-y-2">
              {[
                { label:'(+) Ingresos por ventas', value:totalVentas, bold:false, color:'text-green-600' },
                { label:'(-) Costo de mercancía vendida', value:-totalCompras, bold:false, color:'text-red-500' },
                { label:'= Utilidad Bruta', value:utilidadBruta, bold:true, color:utilidadBruta>=0?'text-primary-700':'text-red-700', border:true },
                { label:'(-) Gastos tecnología', value:-gastosTech, bold:false, color:'text-gray-600' },
                { label:'(-) Gastos marketing', value:-gastosMkt, bold:false, color:'text-gray-600' },
                { label:'(-) Otros gastos operativos', value:-(totalGastos-gastosTech-gastosMkt), bold:false, color:'text-gray-600' },
                { label:'= Utilidad Neta', value:utilidadNeta, bold:true, color:utilidadNeta>=0?'text-gray-900':'text-red-700', border:true, big:true },
              ].map(({label,value,bold,color,border,big})=>(
                <div key={label} className={`flex justify-between items-center py-1.5 ${border?'border-t border-gray-200 mt-2 pt-3':''}`}>
                  <span className={`text-sm ${bold?'font-black text-gray-900':'text-gray-600'}`}>{label}</span>
                  <span className={`${big?'text-lg':'text-sm'} font-black ${color}`}>
                    {value>=0?'+':''}{value<0&&value>-0.01?'':''} RD${Math.abs(value).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas de stock */}
          {alertasStock.length>0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500"/>
                <h3 className="font-black text-amber-800">⚠️ Stock bajo — {alertasStock.length} producto{alertasStock.length>1?'s':''}</h3>
              </div>
              <div className="space-y-1.5">
                {alertasStock.map(c=>(
                  <div key={c.id} className="flex justify-between items-center bg-white rounded-xl px-3 py-2 border border-amber-100">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{c.products?.nombre}</p>
                      <p className="text-[10px] text-gray-400">{c.products?.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${c.products?.stock===0?'text-red-600':'text-amber-600'}`}>
                        {c.products?.stock===0?'AGOTADO':`${c.products?.stock} unid.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>)}

        {/* ── GASTOS ── */}
        {tab==='gastos' && (
          <div className="space-y-4">
            {/* Resumen por categoría */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIAS_GASTO.map(cat=>{
                const total = gastos.filter(g=>g.categoria===cat).reduce((s,g)=>s+Number(g.monto),0)
                if (total===0) return null
                return (
                  <div key={cat} className={cardClass}>
                    <p className="text-xs text-gray-500 capitalize mb-1">{cat}</p>
                    <p className="text-lg font-black text-gray-900">RD${total.toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
            <div className={`${cardClass} overflow-hidden p-0`}>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Fecha','Descripción','Categoría','Monto'].map(h=><th key={h} className={`${h==='Monto'?'text-right':'text-left'} px-4 py-3 text-xs font-bold text-gray-500 uppercase`}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {gastos.length===0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-gray-400 text-sm">No hay gastos registrados en {mes}</td></tr>
                  ) : gastos.map(g=>(
                    <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">{g.fecha}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-xs">{g.descripcion}</p>
                        {g.subcategoria && <p className="text-[10px] text-gray-400">{g.subcategoria}</p>}
                        {g.canal_mkt && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">{g.canal_mkt}</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize">{g.categoria}</td>
                      <td className="px-4 py-3 text-right font-black text-red-600 text-xs">-RD${Number(g.monto).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ROI Y CANAL ── */}
        {tab==='roi' && (
          <div className="space-y-4">
            <div className={cardClass}>
              <h2 className="font-black text-gray-900 mb-4">ROI por Canal de Marketing</h2>
              {Object.keys(gastosPorCanal).length===0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Registra gastos con canal de marketing para ver el ROI</p>
                  <p className="text-xs mt-1">Usa el botón "Registrar gasto" y selecciona el canal</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(gastosPorCanal).map(([canal,gasto])=>{
                    const gastoNum = Number(gasto)
                    const roi = gastoNum>0 ? ((totalVentas/Object.keys(gastosPorCanal).length - gastoNum)/gastoNum*100) : 0
                    return (
                      <div key={canal} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm">
                          {canal==='meta'?'📘':canal==='google'?'🔍':canal==='organico'?'🌿':canal==='whatsapp'?'💬':'📊'}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm capitalize">{canal}</p>
                          <p className="text-xs text-gray-500">Inversión: RD${(gastoNum).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-sm ${roi>=0?'text-green-600':'text-red-600'}`}>{roi.toFixed(0)}% ROI</p>
                          <p className="text-[10px] text-gray-400">estimado</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Costos por producto con margen real */}
            <div className={`${cardClass} overflow-hidden p-0`}>
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-black text-gray-900">Margen real por producto</h2>
                <p className="text-xs text-gray-500">Basado en costo promedio ponderado actualizado</p>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Producto','Stock','Precio venta','Costo','Margen','%'].map(h=>(
                    <th key={h} className={`${['Precio venta','Costo','Margen','%'].includes(h)?'text-right':'text-left'} px-4 py-3 text-xs font-bold text-gray-500 uppercase`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {costos.filter(c=>c.products).sort((a,b)=>{
                    const mA=(Number(a.products?.precio)-Number(a.costo_promedio))/Number(a.products?.precio||1)
                    const mB=(Number(b.products?.precio)-Number(b.costo_promedio))/Number(b.products?.precio||1)
                    return mB-mA
                  }).map(c=>{
                    const precio=Number(c.products?.precio??0)
                    const costo=Number(c.costo_promedio??0)
                    const margen=precio-costo
                    const pct=precio>0?(margen/precio*100):0
                    return (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-gray-900 text-xs">{c.products?.nombre}</p>
                          <p className="text-[10px] text-gray-400">{c.products?.sku}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${c.products?.stock===0?'bg-red-100 text-red-700':c.products?.stock<=3?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                            {c.products?.stock??0}u
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs">RD${precio.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-xs text-gray-500">RD${costo.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-xs font-bold text-green-700">RD${margen.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${pct>=30?'bg-green-100 text-green-700':pct>=15?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>
                            {pct.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FORMULARIO GASTO ── */}
        {showGasto && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-gray-900">Registrar gasto operativo</h2>
                <button onClick={()=>setShowGasto(false)}><X className="w-5 h-5 text-gray-400"/></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Categoría *</label>
                  <select value={gasto.categoria} onChange={e=>setGasto(g=>({...g,categoria:e.target.value,subcategoria:SUBCATEGORIAS[e.target.value]?.[0]??''}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                    {CATEGORIAS_GASTO.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Subcategoría</label>
                  <select value={gasto.subcategoria} onChange={e=>setGasto(g=>({...g,subcategoria:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                    {(SUBCATEGORIAS[gasto.categoria]??[]).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Descripción *</label>
                  <input value={gasto.descripcion} onChange={e=>setGasto(g=>({...g,descripcion:e.target.value}))}
                    placeholder="Ej: Plan Vercel Pro junio 2026"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Monto (RD$) *</label>
                  <input type="number" value={gasto.monto} onChange={e=>setGasto(g=>({...g,monto:e.target.value}))}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Fecha</label>
                  <input type="date" value={gasto.fecha} onChange={e=>setGasto(g=>({...g,fecha:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Canal de marketing</label>
                  <select value={gasto.canal_mkt} onChange={e=>setGasto(g=>({...g,canal_mkt:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                    <option value="">No aplica</option>
                    {CANALES_MKT.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">¿Recurrente?</label>
                  <div className="flex items-center gap-3 mt-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={gasto.recurrente} onChange={e=>setGasto(g=>({...g,recurrente:e.target.checked}))}
                        className="w-4 h-4 rounded"/>
                      Sí, es recurrente
                    </label>
                  </div>
                </div>
                {gasto.recurrente && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Frecuencia</label>
                    <select value={gasto.frecuencia} onChange={e=>setGasto(g=>({...g,frecuencia:e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Notas</label>
                  <textarea value={gasto.notas} onChange={e=>setGasto(g=>({...g,notas:e.target.value}))}
                    rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"/>
                </div>
              </div>
              <button onClick={guardarGasto}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-black hover:bg-primary-700">
                Guardar gasto
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
