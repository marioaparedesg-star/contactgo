'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { FileText, Download, Plus, Trash2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function AdminDGII() {
  const sb = createClient()
  const now   = new Date()
  const [mes,  setMes]    = useState(`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`)
  const [datos,setDatos]  = useState<any>(null)
  const [ncfSeq,setNcfSeq]= useState<any[]>([])
  const [compras,setCompras]=useState<any[]>([])
  const [loading,setLoading]=useState(false)
  const [tab,setTab]      = useState<'607'|'606'|'ncf'>('607')
  const [formCompra,setFormCompra]=useState({fecha:'',rnc_suplidor:'',nombre_suplidor:'',ncf:'',monto:'',itbis:'0'})
  const [showFormCompra,setShowFormCompra]=useState(false)

  useEffect(()=>{
    sb.from('ncf_sequences').select('*').order('serie').then(({data})=>setNcfSeq(data??[]))
  },[])

  const cargar607 = async () => {
    setLoading(true)
    const r = await fetch(`/api/dgii/607?mes=${mes}&formato=json`)
    const d = await r.json()
    setDatos(d)
    setLoading(false)
  }

  const cargar606 = async () => {
    setLoading(true)
    const year=parseInt(mes.slice(0,4)), month=parseInt(mes.slice(4,6))
    const desde=new Date(year,month-1,1).toISOString().slice(0,10)
    const hasta=new Date(year,month,0).toISOString().slice(0,10)
    const {data}=await sb.from('compras_606').select('*').gte('fecha',desde).lte('fecha',hasta).order('fecha')
    setCompras(data??[])
    setLoading(false)
  }

  const guardarCompra = async () => {
    if (!formCompra.fecha||!formCompra.rnc_suplidor||!formCompra.ncf||!formCompra.monto) {
      toast.error('Completa todos los campos obligatorios'); return
    }
    const {error}=await sb.from('compras_606').insert({
      ...formCompra, monto:parseFloat(formCompra.monto), itbis:parseFloat(formCompra.itbis||'0')
    })
    if (error) { toast.error(error.message); return }
    toast.success('Compra registrada ✅')
    setShowFormCompra(false)
    setFormCompra({fecha:'',rnc_suplidor:'',nombre_suplidor:'',ncf:'',monto:'',itbis:'0'})
    cargar606()
  }

  const eliminarCompra = async (id:string) => {
    if (!confirm('¿Eliminar esta compra?')) return
    await sb.from('compras_606').delete().eq('id',id)
    setCompras(c=>c.filter(x=>x.id!==id))
    toast.success('Eliminada')
  }

  const mesLabel = () => { const y=mes.slice(0,4),m=parseInt(mes.slice(4,6))-1; return `${MESES[m]} ${y}` }
  const fmt = (n:number) => `RD$${Math.round(n).toLocaleString()}`

  return (
    <div className="pb-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Panel DGII</h1>
          <p className="text-gray-400 text-sm mt-0.5">Formularios 606 y 607 · {mesLabel()}</p>
        </div>

        {/* Selector período */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center gap-3 flex-wrap">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Período</label>
            <input type="month" value={`${mes.slice(0,4)}-${mes.slice(4,6)}`}
              onChange={e=>setMes(e.target.value.replace('-',''))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>{setTab('607');cargar607()}}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
              {loading&&tab==='607'?'Cargando...':'📋 Ver 607 (Ventas)'}
            </button>
            <button onClick={()=>{setTab('606');cargar606()}}
              className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
              {loading&&tab==='606'?'Cargando...':'📦 Ver 606 (Compras)'}
            </button>
            <button onClick={()=>setTab('ncf')}
              className="bg-gray-700 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-800">
              🔢 NCF
            </button>
          </div>
        </div>

        {/* Tab 607 */}
        {tab==='607'&&datos&&(
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-700">Reporte 607 — Ventas · {mesLabel()}</h2>
              <div className="flex gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${datos.modo==='PRUEBA'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                  {datos.modo??'PRUEBA'}
                </span>
                <button onClick={()=>window.open(`/api/dgii/607?mes=${mes}&formato=txt`,'_blank')}
                  className="flex items-center gap-1.5 bg-green-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-green-700">
                  <Download className="w-3.5 h-3.5"/>Descargar .txt
                </button>
              </div>
            </div>

            {datos.total_registros===0?(
              <p className="text-gray-400 text-sm text-center py-6">Sin ventas con NCF en este período</p>
            ):(
              <>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-blue-700">{datos.total_registros}</p>
                    <p className="text-xs text-blue-500">Ventas</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-green-700">{fmt(parseFloat(datos.total_monto))}</p>
                    <p className="text-xs text-green-500">Monto facturado</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-gray-500">RD$0</p>
                    <p className="text-xs text-gray-400">ITBIS (exento)</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-gray-400 border-b">
                      <th className="text-left py-2 pr-3">NCF</th>
                      <th className="text-left py-2 pr-3">Fecha</th>
                      <th className="text-left py-2 pr-3">Cliente</th>
                      <th className="text-right py-2 pr-3">Monto</th>
                      <th className="text-center py-2">Pago</th>
                    </tr></thead>
                    <tbody>
                      {datos.registros?.map((r:any,i:number)=>(
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-1.5 pr-3 font-mono text-blue-600">{r.ncf}</td>
                          <td className="py-1.5 pr-3 text-gray-500">{r.fecha.slice(0,4)}-{r.fecha.slice(4,6)}-{r.fecha.slice(6,8)}</td>
                          <td className="py-1.5 pr-3 text-gray-600 truncate max-w-[120px]">{r.cliente}</td>
                          <td className="py-1.5 pr-3 text-right font-semibold">{fmt(parseFloat(r.monto_facturado))}</td>
                          <td className="py-1.5 text-center text-gray-400 capitalize">{r.metodo_pago?.replace('_',' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 606 */}
        {tab==='606'&&(
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-700">Reporte 606 — Compras · {mesLabel()}</h2>
              <button onClick={()=>setShowFormCompra(true)}
                className="flex items-center gap-1.5 bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-700">
                <Plus className="w-3.5 h-3.5"/>Agregar compra
              </button>
            </div>

            {showFormCompra&&(
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                <h3 className="font-bold text-indigo-800 text-sm mb-3">Nueva compra a suplidor</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {key:'fecha',label:'Fecha',type:'date',placeholder:''},
                    {key:'rnc_suplidor',label:'RNC Suplidor *',type:'text',placeholder:'101-12345-6'},
                    {key:'nombre_suplidor',label:'Nombre Suplidor *',type:'text',placeholder:'Alcon Labs'},
                    {key:'ncf',label:'NCF *',type:'text',placeholder:'B010000001'},
                    {key:'monto',label:'Monto RD$ *',type:'number',placeholder:'5000'},
                    {key:'itbis',label:'ITBIS RD$',type:'number',placeholder:'0'},
                  ].map(f=>(
                    <div key={f.key}>
                      <label className="text-xs font-bold text-indigo-700 block mb-1">{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={(formCompra as any)[f.key]}
                        onChange={e=>setFormCompra(p=>({...p,[f.key]:e.target.value}))}
                        className="w-full border border-indigo-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={guardarCompra} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm">Guardar</button>
                  <button onClick={()=>setShowFormCompra(false)} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm">Cancelar</button>
                </div>
              </div>
            )}

            {compras.length===0?(
              <p className="text-gray-400 text-sm text-center py-6">Sin compras registradas en este período</p>
            ):(
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-gray-400 border-b">
                      <th className="text-left py-2 pr-3">Fecha</th>
                      <th className="text-left py-2 pr-3">Suplidor</th>
                      <th className="text-left py-2 pr-3">NCF</th>
                      <th className="text-right py-2 pr-3">Monto</th>
                      <th className="text-right py-2 pr-3">ITBIS</th>
                      <th className="py-2"></th>
                    </tr></thead>
                    <tbody>
                      {compras.map(c=>(
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-1.5 pr-3 text-gray-500">{c.fecha}</td>
                          <td className="py-1.5 pr-3 text-gray-700 font-medium truncate max-w-[120px]">{c.nombre_suplidor}</td>
                          <td className="py-1.5 pr-3 font-mono text-indigo-600">{c.ncf}</td>
                          <td className="py-1.5 pr-3 text-right font-semibold">{fmt(c.monto)}</td>
                          <td className="py-1.5 pr-3 text-right text-gray-500">{fmt(c.itbis??0)}</td>
                          <td className="py-1.5 text-right">
                            <button onClick={()=>eliminarCompra(c.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between text-sm">
                  <span className="font-bold text-gray-700">Total compras</span>
                  <span className="font-black text-gray-900">{fmt(compras.reduce((s,c)=>s+c.monto,0))}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab NCF */}
        {tab==='ncf'&&(
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <h2 className="font-bold text-gray-700 mb-4">Secuencias NCF</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-gray-400 border-b">
                  <th className="text-left py-2 pr-4">Serie</th>
                  <th className="text-left py-2 pr-4">Descripción</th>
                  <th className="text-right py-2 pr-4">Último NCF emitido</th>
                  <th className="text-right py-2 pr-4">Disponibles</th>
                  <th className="text-center py-2">Modo</th>
                  <th className="text-center py-2">Estado</th>
                </tr></thead>
                <tbody>
                  {ncfSeq.map(s=>(
                    <tr key={s.serie} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-mono font-bold text-blue-700">{s.serie}</td>
                      <td className="py-2 pr-4 text-gray-600 text-xs">{s.descripcion}</td>
                      <td className="py-2 pr-4 text-right font-mono text-xs">
                        {s.ultimo_numero>0?`${s.serie}${String(s.ultimo_numero).padStart(8,'0')}`:'—'}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-500 text-xs">{(s.hasta-s.ultimo_numero).toLocaleString()}</td>
                      <td className="py-2 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.modo==='prueba'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                          {s.modo==='prueba'?'PRUEBA':'PRODUCCIÓN'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.activo?'bg-green-50 text-green-600':'bg-gray-100 text-gray-400'}`}>
                          {s.activo?'Activa':'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">⚠️ Series <strong>E02/E04 son de PRUEBA</strong> — no válidas para declarar en la DGII. Cuando tengas las secuencias B01/B02 autorizadas, actualiza la tabla <code>ncf_sequences</code> en Supabase y cambia <code>modo = 'produccion'</code>.</p>
            </div>
          </div>
        )}

        {/* Guía */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/>Guía mensual DGII</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-bold mb-2">Formulario 607 (Ventas)</p>
              {['Selecciona el mes','Click en "Ver 607"','Revisa el resumen','Descarga el .txt','Súbelo en dgii.gov.do antes del día 20'].map((s,i)=>(
                <p key={i} className="flex items-center gap-2 py-1"><CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0"/>{s}</p>
              ))}
            </div>
            <div>
              <p className="font-bold mb-2">Formulario 606 (Compras)</p>
              {['Registra cada factura de suplidor','Agrega RNC, NCF y monto','Descarga desde la pestaña 606','Súbelo en dgii.gov.do antes del día 20'].map((s,i)=>(
                <p key={i} className="flex items-center gap-2 py-1"><CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0"/>{s}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
