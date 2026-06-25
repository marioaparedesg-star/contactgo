'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Package, TrendingDown, ChevronRight, Check, X, ShoppingCart, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ComprasPage() {
  const sb = createClient()
  const [tab, setTab] = useState<'ordenes'|'costos'|'nueva'>('ordenes')
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [costos,  setCostos]  = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  // Nueva orden
  const [newOrder, setNewOrder] = useState({
    supplier_id: '', fecha_llegada: '', notas: '',
    items: [] as {product_id:string, cantidad:number, costo_unitario:number}[]
  })

  useEffect(() => {
    Promise.all([
      sb.from('purchase_orders').select('*,suppliers(nombre)').order('created_at',{ascending:false}).limit(50),
      sb.from('product_costs').select('*,products(nombre,precio,sku,imagen_url)').order('updated_at',{ascending:false}),
      sb.from('products').select('id,nombre,sku,precio,imagen_url').eq('activo',true).order('nombre'),
      sb.from('suppliers').select('*').eq('activo',true),
    ]).then(([{data:o},{data:c},{data:p},{data:s}]) => {
      setOrdenes(o??[]); setCostos(c??[]); setProducts(p??[]); setSuppliers(s??[])
      setLoading(false)
    })
  }, [])

  const addItem = () => setNewOrder(n => ({...n, items:[...n.items,{product_id:'',cantidad:1,costo_unitario:0}]}))
  const removeItem = (i:number) => setNewOrder(n=>({...n,items:n.items.filter((_,j)=>j!==i)}))
  const updateItem = (i:number, field:string, val:any) =>
    setNewOrder(n=>({...n,items:n.items.map((it,j)=>j===i?{...it,[field]:val}:it)}))

  const total = newOrder.items.reduce((s,i)=>s+(i.cantidad*(i.costo_unitario||0)),0)

  const crearOrden = async () => {
    if (!newOrder.supplier_id || newOrder.items.length===0) {
      toast.error('Selecciona proveedor y agrega productos'); return
    }
    const numero = `OC-${Date.now().toString().slice(-8)}`
    const {data:po} = await sb.from('purchase_orders').insert({
      numero, supplier_id: newOrder.supplier_id,
      fecha_llegada: newOrder.fecha_llegada||null,
      notas: newOrder.notas, total, subtotal:total, estado:'borrador'
    }).select().single()
    if (!po) { toast.error('Error creando orden'); return }

    await sb.from('purchase_order_items').insert(
      newOrder.items.filter(i=>i.product_id).map(i=>({
        purchase_order_id: po.id, ...i
      }))
    )
    toast.success(`✅ Orden ${numero} creada`)
    setTab('ordenes')
    setNewOrder({supplier_id:'',fecha_llegada:'',notas:'',items:[]})
    // Recargar
    const {data:o} = await sb.from('purchase_orders').select('*,suppliers(nombre)').order('created_at',{ascending:false}).limit(50)
    setOrdenes(o??[])
  }

  const recibirOrden = async (orden:any) => {
    if (!confirm(`¿Marcar orden ${orden.numero} como RECIBIDA? Esto actualizará el inventario y costos.`)) return
    
    // Cargar items
    const {data:items} = await sb.from('purchase_order_items')
      .select('*').eq('purchase_order_id', orden.id)
    
    if (!items?.length) { toast.error('Sin items'); return }

    // Por cada item: actualizar stock + costo promedio + movimiento inventario
    for (const item of items) {
      // Costo promedio ponderado
      const {data:prod} = await sb.from('products').select('stock').eq('id',item.product_id).single()
      const {data:costo} = await sb.from('product_costs').select('costo_promedio').eq('product_id',item.product_id).single()
      
      const stockActual = prod?.stock ?? 0
      const costoActual = costo?.costo_promedio ?? item.costo_unitario
      const nuevoCosto  = ((stockActual * costoActual) + (item.cantidad * item.costo_unitario)) / (stockActual + item.cantidad)

      await Promise.all([
        // Actualizar stock
        sb.from('products').update({ stock: stockActual + item.cantidad }).eq('id', item.product_id),
        // Actualizar costo promedio
        sb.from('product_costs').upsert({
          product_id: item.product_id,
          costo_promedio: Math.round(nuevoCosto * 100)/100,
          costo_ultimo: item.costo_unitario,
          updated_at: new Date().toISOString()
        }, { onConflict: 'product_id' }),
        // Registrar movimiento
        sb.from('inventory_movements').insert({
          product_id: item.product_id, tipo:'entrada',
          cantidad: item.cantidad, costo_unitario: item.costo_unitario,
          referencia_tipo:'purchase_order', referencia_id: orden.id,
          notas: `Recepción orden ${orden.numero}`
        }),
      ])
    }

    // Actualizar orden
    await sb.from('purchase_orders').update({ estado:'recibida', fecha_llegada: new Date().toISOString().split('T')[0] }).eq('id', orden.id)
    
    // Registrar en caja
    await sb.from('cash_movements').insert({
      tipo:'egreso', categoria:'compra',
      descripcion:`Compra a proveedor — ${orden.suppliers?.nombre ?? ''} — ${orden.numero}`,
      monto: orden.total, metodo:'transferencia', referencia: orden.numero,
      fecha: new Date().toISOString().split('T')[0]
    })

    toast.success('✅ Orden recibida — inventario y costos actualizados')
    const {data:o} = await sb.from('purchase_orders').select('*,suppliers(nombre)').order('created_at',{ascending:false}).limit(50)
    setOrdenes(o??[])
    const {data:c} = await sb.from('product_costs').select('*,products(nombre,precio,sku)').order('updated_at',{ascending:false})
    setCostos(c??[])
    setSelected(null)
  }

  const estadoColor: Record<string,string> = {
    borrador:'bg-gray-100 text-gray-600', enviada:'bg-blue-100 text-blue-700',
    recibida:'bg-green-100 text-green-700', cancelada:'bg-red-100 text-red-700'
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">🛒 Compras y Costos</h1>
            <p className="text-gray-500 text-sm">Órdenes de compra · Costo promedio ponderado · Margen real</p>
          </div>
          <button onClick={()=>setTab('nueva')}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700">
            <Plus className="w-4 h-4"/> Nueva orden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['ordenes','costos','nueva'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${tab===t?'bg-primary-600 text-white':'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
              {t==='ordenes'?'📋 Órdenes':t==='costos'?'💰 Costos':'➕ Nueva orden'}
            </button>
          ))}
        </div>

        {/* ── ÓRDENES ── */}
        {tab==='ordenes' && (
          <div className="space-y-3">
            {ordenes.length===0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                <p className="font-medium">No hay órdenes de compra aún</p>
                <button onClick={()=>setTab('nueva')} className="mt-3 text-primary-600 font-bold text-sm">+ Crear primera orden</button>
              </div>
            )}
            {ordenes.map(o=>(
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-primary-200"
                onClick={()=>setSelected(selected?.id===o.id?null:o)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900">{o.numero}</p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${estadoColor[o.estado]??'bg-gray-100 text-gray-600'}`}>{o.estado}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{o.suppliers?.nombre} · {new Date(o.created_at).toLocaleDateString('es-DO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">RD${Number(o.total).toLocaleString()}</p>
                    {o.fecha_llegada && <p className="text-xs text-gray-400">Llegada: {o.fecha_llegada}</p>}
                  </div>
                </div>
                {selected?.id===o.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    {o.estado==='borrador' && (
                      <button onClick={e=>{e.stopPropagation();recibirOrden(o)}}
                        className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700">
                        <Check className="w-4 h-4"/> Marcar como recibida
                      </button>
                    )}
                    {o.estado==='recibida' && <p className="text-sm text-green-600 font-bold">✅ Inventario y costos actualizados</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── COSTOS ── */}
        {tab==='costos' && (
          <div className="space-y-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Producto</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Precio venta</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Costo promedio</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Margen</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Margen %</th>
                </tr></thead>
                <tbody>
                  {costos.map(c=>{
                    const precio = Number(c.products?.precio??0)
                    const costo  = Number(c.costo_promedio??0)
                    const margen = precio - costo
                    const pct    = precio>0 ? (margen/precio*100) : 0
                    return (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-xs">{c.products?.nombre}</p>
                          <p className="text-[10px] text-gray-400">{c.products?.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">RD${precio.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input type="number" defaultValue={costo}
                              onBlur={async e=>{
                                const v = Number(e.target.value)
                                await sb.from('product_costs').upsert({product_id:c.product_id,costo_promedio:v,costo_ultimo:v,updated_at:new Date().toISOString()},{onConflict:'product_id'})
                                toast.success('Costo actualizado')
                              }}
                              className="w-24 text-right border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary-400"/>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold text-xs ${margen>0?'text-green-700':'text-red-600'}`}>
                          RD${margen.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-xs font-black px-2 py-1 rounded-full ${pct>=30?'bg-green-100 text-green-700':pct>=15?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>
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

        {/* ── NUEVA ORDEN ── */}
        {tab==='nueva' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-black text-gray-900">Nueva orden de compra</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Proveedor *</label>
                <select value={newOrder.supplier_id} onChange={e=>setNewOrder(n=>({...n,supplier_id:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                  <option value="">Seleccionar...</option>
                  {suppliers.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Fecha de llegada esperada</label>
                <input type="date" value={newOrder.fecha_llegada} onChange={e=>setNewOrder(n=>({...n,fecha_llegada:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-gray-500">Productos</label>
                <button onClick={addItem} className="text-xs text-primary-600 font-bold flex items-center gap-1 hover:text-primary-700">
                  <Plus className="w-3.5 h-3.5"/> Agregar producto
                </button>
              </div>
              <div className="space-y-2">
                {newOrder.items.map((item,i)=>(
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <select value={item.product_id} onChange={e=>updateItem(i,'product_id',e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                        <option value="">Producto...</option>
                        {products.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input type="number" min="1" placeholder="Cant." value={item.cantidad}
                        onChange={e=>updateItem(i,'cantidad',Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400 text-center"/>
                    </div>
                    <div className="col-span-3">
                      <input type="number" min="0" placeholder="Costo unit." value={item.costo_unitario||''}
                        onChange={e=>updateItem(i,'costo_unitario',Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-primary-400"/>
                    </div>
                    <div className="col-span-1 text-right text-xs font-bold text-gray-700">
                      RD${(item.cantidad*(item.costo_unitario||0)).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={()=>removeItem(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
                {newOrder.items.length===0 && (
                  <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-primary-300 hover:text-primary-600">
                    + Agregar primer producto
                  </button>
                )}
              </div>
            </div>

            {newOrder.items.length>0 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">{newOrder.items.length} productos</p>
                  <p className="text-xl font-black text-gray-900">Total: RD${total.toLocaleString()}</p>
                </div>
                <button onClick={crearOrden}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black hover:bg-primary-700">
                  Crear orden de compra
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Notas</label>
              <textarea value={newOrder.notas} onChange={e=>setNewOrder(n=>({...n,notas:e.target.value}))}
                rows={2} placeholder="Instrucciones especiales, referencia de pago..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"/>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
