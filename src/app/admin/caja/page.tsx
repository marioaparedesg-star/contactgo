'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIAS_INGRESO  = ['venta','deposito','prestamo','otro_ingreso']
const CATEGORIAS_EGRESO   = ['compra','gasto_operativo','retiro','publicidad','logistica','otro_egreso']
const METODOS = ['azul','transferencia','efectivo','tarjeta','cheque']

export default function CajaPage() {
  const sb = createClient()
  const [movimientos, setMovimientos] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [mes, setMes] = useState(new Date().toISOString().slice(0,7))
  const [form, setForm] = useState({
    tipo:'ingreso', categoria:'venta', descripcion:'', monto:'',
    metodo:'azul', referencia:'', fecha:new Date().toISOString().split('T')[0], notas:''
  })

  const cargar = async () => {
    const [y,m] = mes.split('-')
    const desde = `${y}-${m}-01`
    const hasta = `${y}-${m}-31`
    const {data} = await sb.from('cash_movements')
      .select('*').gte('fecha',desde).lte('fecha',hasta)
      .order('fecha',{ascending:false}).order('created_at',{ascending:false})
    setMovimientos(data??[])
    setLoading(false)
  }

  useEffect(()=>{ cargar() },[mes])

  // Sincronizar ventas pagadas al cargar
  useEffect(() => {
    const syncVentas = async () => {
      const {data:ventas} = await sb.from('orders')
        .select('id,numero_orden,total,pagado_en,cliente_nombre')
        .eq('pago_estado','pagado')
        .not('id','in',
          `(SELECT order_id FROM cash_movements WHERE order_id IS NOT NULL)`
        )
      if (!ventas?.length) return
      for (const v of ventas) {
        await sb.from('cash_movements').insert({
          tipo:'ingreso', categoria:'venta',
          descripcion:`Venta ${v.numero_orden} — ${v.cliente_nombre}`,
          monto: v.total, metodo:'azul', referencia: v.numero_orden,
          order_id: v.id,
          fecha: v.pagado_en ? v.pagado_en.split('T')[0] : new Date().toISOString().split('T')[0]
        })
      }
      if (ventas.length > 0) { cargar() }
    }
    syncVentas()
  }, [])

  const ingresos = movimientos.filter(m=>m.tipo==='ingreso').reduce((s,m)=>s+Number(m.monto),0)
  const egresos  = movimientos.filter(m=>m.tipo==='egreso').reduce((s,m)=>s+Number(m.monto),0)
  const saldo    = ingresos - egresos

  const guardar = async () => {
    if (!form.descripcion || !form.monto) { toast.error('Completa los campos obligatorios'); return }
    await sb.from('cash_movements').insert({
      ...form, monto:Number(form.monto)
    })
    toast.success('✅ Movimiento registrado')
    setShowForm(false)
    setForm({tipo:'ingreso',categoria:'venta',descripcion:'',monto:'',metodo:'azul',referencia:'',fecha:new Date().toISOString().split('T')[0],notas:''})
    cargar()
  }

  const tipoColor = (tipo:string) => tipo==='ingreso' ? 'text-green-600' : 'text-red-600'
  const tipoIcon  = (tipo:string) => tipo==='ingreso' ? '+' : '-'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">💵 Caja y Banco</h1>
            <p className="text-gray-500 text-sm">Movimientos de dinero · Saldo disponible</p>
          </div>
          <button onClick={()=>setShowForm(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700">
            <Plus className="w-4 h-4"/> Nuevo movimiento
          </button>
        </div>

        {/* Selector de mes */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-600">Mes:</label>
          <input type="month" value={mes} onChange={e=>setMes(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 bg-white"/>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1"/>
            <p className="text-xs text-green-600 font-semibold">Ingresos</p>
            <p className="text-xl font-black text-green-700">RD${ingresos.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
            <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-1"/>
            <p className="text-xs text-red-500 font-semibold">Egresos</p>
            <p className="text-xl font-black text-red-600">RD${egresos.toLocaleString()}</p>
          </div>
          <div className={`${saldo>=0?'bg-primary-50 border-primary-100':'bg-amber-50 border-amber-100'} border rounded-2xl p-4 text-center`}>
            <DollarSign className={`w-5 h-5 mx-auto mb-1 ${saldo>=0?'text-primary-500':'text-amber-500'}`}/>
            <p className={`text-xs font-semibold ${saldo>=0?'text-primary-600':'text-amber-600'}`}>Saldo neto</p>
            <p className={`text-xl font-black ${saldo>=0?'text-primary-700':'text-amber-700'}`}>RD${saldo.toLocaleString()}</p>
          </div>
        </div>

        {/* Formulario nuevo movimiento */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900">Nuevo movimiento</h2>
              <button onClick={()=>setShowForm(false)}><X className="w-5 h-5 text-gray-400"/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Tipo *</label>
                <select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value,categoria:e.target.value==='ingreso'?'venta':'compra'}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                  <option value="ingreso">💚 Ingreso</option>
                  <option value="egreso">🔴 Egreso</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Categoría *</label>
                <select value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                  {(form.tipo==='ingreso'?CATEGORIAS_INGRESO:CATEGORIAS_EGRESO).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 mb-1 block">Descripción *</label>
                <input value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}
                  placeholder="Ej: Venta ACUVUE OASYS Katherine Yuen"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Monto (RD$) *</label>
                <input type="number" value={form.monto} onChange={e=>setForm(f=>({...f,monto:e.target.value}))}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Método de pago</label>
                <select value={form.metodo} onChange={e=>setForm(f=>({...f,metodo:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" style={{fontSize:'16px'}}>
                  {METODOS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Fecha</label>
                <input type="date" value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Referencia</label>
                <input value={form.referencia} onChange={e=>setForm(f=>({...f,referencia:e.target.value}))}
                  placeholder="# orden, transferencia..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
              </div>
            </div>
            <button onClick={guardar}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-black hover:bg-primary-700">
              Guardar movimiento
            </button>
          </div>
        )}

        {/* Lista de movimientos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
          ) : movimientos.length===0 ? (
            <div className="text-center py-12 text-gray-400">
              <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30"/>
              <p>No hay movimientos en {mes}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Descripción</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Método</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Monto</th>
              </tr></thead>
              <tbody>
                {movimientos.map(m=>(
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{m.fecha}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-xs">{m.descripcion}</p>
                      {m.referencia && <p className="text-[10px] text-gray-400">{m.referencia}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{m.categoria}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{m.metodo}</td>
                    <td className={`px-4 py-3 text-right font-black ${tipoColor(m.tipo)}`}>
                      {tipoIcon(m.tipo)}RD${Number(m.monto).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
