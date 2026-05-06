'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Plus, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ALL_SPH = [0,-0.25,-0.5,-0.75,-1,-1.25,-1.5,-1.75,-2,-2.25,-2.5,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.5,-4.75,-5,-5.25,-5.5,-5.75,-6,-6.5,-7,-7.5,-8,-8.5,-9,-9.5,-10,-10.5,-11,-11.5,-12,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75,4,4.25,4.5,4.75,5,5.25,5.5,5.75,6,6.5,7,7.5,8]
const ALL_CYL = [0,-0.25,-0.5,-0.75,-1,-1.25,-1.5,-1.75,-2,-2.25,-2.5,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.5,-4.75,-5,-5.25,-5.5,-5.75,-6]
const ALL_AXIS = Array.from({length:180},(_,i)=>i+1)
const ALL_ADD = ['+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00']
const TIPO_LABEL: Record<string,string> = {esferico:'Esférico',torico:'Tórico',multifocal:'Multifocal',color:'Color',solucion:'Solución',gota:'Gotas'}

export default function InventarioPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [variantes, setVariantes] = useState<Record<string,any[]>>({})
  const [expandido, setExpandido] = useState<string|null>(null)
  const [nuevaVariante, setNuevaVariante] = useState<Record<string,any>>({})
  const sb = createClient()

  useEffect(() => {
    sb.from('products').select('*').order('tipo').order('nombre').then(({data}) => setProductos(data??[]))
    sb.from('product_variants').select('*').then(({data}) => {
      const map: Record<string,any[]> = {}
      ;(data??[]).forEach((v:any) => { if(!map[v.product_id]) map[v.product_id]=[]; map[v.product_id].push(v) })
      setVariantes(map)
    })
  }, [])

  const toggleExpand = (id: string) => setExpandido(e => e===id ? null : id)

  const agregarVariante = async (p: any) => {
    const nv = nuevaVariante[p.id] ?? {}
    if (nv.sph === undefined && p.tipo !== 'color') { toast.error('Selecciona SPH'); return }
    const {data, error} = await sb.from('product_variants').upsert({
      product_id: p.id,
      sph: nv.sph ?? null,
      cyl: nv.cyl ?? null,
      axis: nv.axis ?? null,
      add_power: nv.add_power ?? null,
      color: nv.color ?? null,
      stock: parseInt(nv.stock ?? '0')
    }, {onConflict: 'product_id,sph,cyl,axis,add_power,color'}).select().single()
    if (error) { toast.error('Error: '+error.message); return }
    setVariantes(v => ({...v, [p.id]: [...(v[p.id]??[]).filter((x:any)=>x.id!==data.id), data]}))
    setNuevaVariante(n => ({...n, [p.id]: {}}))
    toast.success('Variante guardada')
  }

  const actualizarStock = async (varianteId: string, productId: string, stock: number) => {
    await sb.from('product_variants').update({stock}).eq('id', varianteId)
    setVariantes(v => ({...v, [productId]: v[productId].map((x:any) => x.id===varianteId ? {...x, stock} : x)}))
    toast.success('Stock actualizado')
  }

  const eliminarVariante = async (varianteId: string, productId: string) => {
    await sb.from('product_variants').delete().eq('id', varianteId)
    setVariantes(v => ({...v, [productId]: v[productId].filter((x:any)=>x.id!==varianteId)}))
    toast.success('Variante eliminada')
  }

  const setNV = (pid: string, key: string, val: any) => setNuevaVariante(n => ({...n, [pid]: {...(n[pid]??{}), [key]: val}}))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Inventario por Dioptría</h1>
            <p className="text-gray-500 text-sm">Gestiona el stock de cada graduación por producto</p>
          </div>
          <div className="space-y-3">
            {productos.filter(p => ['esferico','torico','multifocal','color'].includes(p.tipo)).map(p => {
              const pvs = variantes[p.id] ?? []
              const totalStock = pvs.reduce((a:number,v:any)=>a+v.stock,0)
              const nv = nuevaVariante[p.id] ?? {}
              const isOpen = expandido === p.id
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => toggleExpand(p.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm text-left">{p.nombre}</p>
                        <p className="text-xs text-gray-400">{TIPO_LABEL[p.tipo]} · {pvs.length} variantes · Stock total: {totalStock}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalStock === 0 && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-semibold">Sin stock</span>}
                      {totalStock > 0 && totalStock < 10 && <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full font-semibold">Stock bajo</span>}
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 p-4 space-y-4">
                      {/* Variantes existentes */}
                      {pvs.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-xs text-gray-400 uppercase">
                                <th className="text-left py-2 pr-4">SPH</th>
                                {p.tipo==='torico' && <><th className="text-left py-2 pr-4">CYL</th><th className="text-left py-2 pr-4">EJE</th></>}
                                {p.tipo==='multifocal' && <th className="text-left py-2 pr-4">ADD</th>}
                                {p.tipo==='color' && <th className="text-left py-2 pr-4">Color</th>}
                                <th className="text-center py-2 pr-4">Stock</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {pvs.sort((a:any,b:any)=>a.sph-b.sph).map((v:any) => (
                                <tr key={v.id}>
                                  <td className="py-2 pr-4 font-mono text-sm">{v.sph > 0 ? '+'+v.sph : v.sph}</td>
                                  {p.tipo==='torico' && <><td className="py-2 pr-4 font-mono text-sm">{v.cyl}</td><td className="py-2 pr-4 font-mono text-sm">{v.axis}</td></>}
                                  {p.tipo==='multifocal' && <td className="py-2 pr-4 font-mono text-sm">{v.add_power}</td>}
                                  {p.tipo==='color' && <td className="py-2 pr-4 text-sm">{v.color}</td>}
                                  <td className="py-2 pr-4 text-center">
                                    <input type="number" min="0" defaultValue={v.stock}
                                      onBlur={e => actualizarStock(v.id, p.id, parseInt(e.target.value))}
                                      className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm font-semibold" />
                                  </td>
                                  <td className="py-2 text-right">
                                    <button onClick={() => eliminarVariante(v.id, p.id)} className="text-gray-300 hover:text-red-500 p-1">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {/* Agregar nueva variante */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Agregar variante</p>
                        <div className="flex flex-wrap gap-2 items-end">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">SPH</p>
                            <select value={nv.sph??''} onChange={e=>setNV(p.id,'sph',e.target.value===''?undefined:parseFloat(e.target.value))}
                              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                              <option value="">--</option>
                              {ALL_SPH.map(s=><option key={s} value={s}>{s>0?'+'+s:s}</option>)}
                            </select>
                          </div>
                          {p.tipo==='torico' && <>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">CYL</p>
                              <select value={nv.cyl??''} onChange={e=>setNV(p.id,'cyl',e.target.value===''?undefined:parseFloat(e.target.value))}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                                <option value="">--</option>
                                {ALL_CYL.filter(c=>c!==0).map(c=><option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">EJE</p>
                              <select value={nv.axis??''} onChange={e=>setNV(p.id,'axis',e.target.value===''?undefined:parseInt(e.target.value))}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                                <option value="">--</option>
                                {ALL_AXIS.map(a=><option key={a} value={a}>{String(a).padStart(3,'0')}</option>)}
                              </select>
                            </div>
                          </>}
                          {p.tipo==='multifocal' && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">ADD</p>
                              <select value={nv.add_power??''} onChange={e=>setNV(p.id,'add_power',e.target.value||undefined)}
                                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
                                <option value="">--</option>
                                {ALL_ADD.map(a=><option key={a} value={a}>{a}</option>)}
                              </select>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Stock</p>
                            <input type="number" min="0" value={nv.stock??''} onChange={e=>setNV(p.id,'stock',e.target.value)}
                              placeholder="0" className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center" />
                          </div>
                          <button onClick={() => agregarVariante(p)}
                            className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-primary-700">
                            <Plus className="w-4 h-4" /> Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
