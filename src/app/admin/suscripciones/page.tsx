'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Plus, X, MessageCircle, Pause, Play, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const FRECUENCIAS = ['mensual','bimestral','trimestral']
const ESTADOS_COLOR: Record<string,string> = {
  activa: 'bg-green-50 text-green-700 border-green-200',
  pausada: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelada: 'bg-red-50 text-red-700 border-red-200',
}

export default function SuscripcionesPage() {
  const sb = createClient()
  const [subs, setSubs] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filtro, setFiltro] = useState('todas')
  const [form, setForm] = useState({
    cliente_nombre:'', cliente_email:'', cliente_telefono:'',
    direccion_texto:'', product_id:'', frecuencia:'mensual',
    proximo_envio:'', precio:'', notas:''
  })

  useEffect(() => {
    Promise.all([
      sb.from('subscriptions').select('*, products(nombre, imagen_url)').order('created_at', {ascending:false}),
      sb.from('products').select('id, nombre, precio').in('tipo',['esferico','torico','multifocal','color']).order('nombre')
    ]).then(([{data:s},{data:p}]) => {
      setSubs(s??[]); setProductos(p??[]); setLoading(false)
    })
  }, [])

  const actualizarEstado = async (id: string, estado: string) => {
    await sb.from('subscriptions').update({estado, updated_at: new Date().toISOString()}).eq('id', id)
    setSubs(ss => ss.map(s => s.id===id ? {...s, estado} : s))
    toast.success(`Suscripción ${estado}`)
  }

  const crearSuscripcion = async () => {
    if (!form.cliente_nombre || !form.product_id) { toast.error('Nombre y producto son requeridos'); return }
    const {data, error} = await sb.from('subscriptions').insert({
      ...form,
      precio: parseFloat(form.precio)||0,
      proximo_envio: form.proximo_envio || null,
    }).select('*, products(nombre, imagen_url)').single()
    if (error) { toast.error('Error: '+error.message); return }
    setSubs(s => [data, ...s])
    setShowForm(false)
    setForm({cliente_nombre:'',cliente_email:'',cliente_telefono:'',direccion_texto:'',product_id:'',frecuencia:'mensual',proximo_envio:'',precio:'',notas:''})
    toast.success('Suscripción creada')
  }

  const filtradas = subs.filter(s => filtro==='todas' || s.estado===filtro)
  const stats = { activas: subs.filter(s=>s.estado==='activa').length, pausadas: subs.filter(s=>s.estado==='pausada').length, canceladas: subs.filter(s=>s.estado==='cancelada').length }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suscripciones</h1>
              <p className="text-gray-500 text-sm">{subs.length} suscripciones en total</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary-700">
              <Plus className="w-4 h-4" /> Nueva
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {label:'Activas', count:stats.activas, color:'text-green-600', bg:'bg-green-50', key:'activa'},
              {label:'Pausadas', count:stats.pausadas, color:'text-amber-600', bg:'bg-amber-50', key:'pausada'},
              {label:'Canceladas', count:stats.canceladas, color:'text-red-500', bg:'bg-red-50', key:'cancelada'},
            ].map(s => (
              <button key={s.key} onClick={() => setFiltro(filtro===s.key?'todas':s.key)}
                className={`${s.bg} rounded-2xl p-4 text-center border-2 transition-all ${filtro===s.key?'border-current':'border-transparent'}`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {filtradas.map(s => (
                <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-gray-900">{s.cliente_nombre}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${ESTADOS_COLOR[s.estado]}`}>{s.estado}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.frecuencia}</span>
                      </div>
                      <p className="text-sm text-gray-600">{s.products?.nombre}</p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-400">
                        {s.cliente_telefono && <span>📞 {s.cliente_telefono}</span>}
                        {s.proximo_envio && <span>📅 Próximo: {new Date(s.proximo_envio).toLocaleDateString('es-DO')}</span>}
                        {s.precio > 0 && <span>💰 RD${s.precio?.toLocaleString()}</span>}
                      </div>
                      {s.direccion_texto && <p className="text-xs text-gray-400 mt-0.5">📍 {s.direccion_texto}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {s.cliente_telefono && (
                        <a href={`https://wa.me/${s.cliente_telefono.replace(/\D/g,'')}?text=Hola ${s.cliente_nombre}, te contactamos de ContactGo sobre tu suscripción de ${s.products?.nombre}.`}
                          target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      {s.estado === 'activa' && (
                        <button onClick={() => actualizarEstado(s.id, 'pausada')}
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors" title="Pausar">
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {s.estado === 'pausada' && (
                        <button onClick={() => actualizarEstado(s.id, 'activa')}
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors" title="Reactivar">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {s.estado !== 'cancelada' && (
                        <button onClick={() => { if(confirm('¿Cancelar suscripción?')) actualizarEstado(s.id, 'cancelada') }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors" title="Cancelar">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filtradas.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-semibold mb-1">No hay suscripciones</p>
                  <p className="text-sm">Crea la primera con el botón "Nueva"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal nueva suscripción */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Nueva Suscripción</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.cliente_nombre} onChange={e=>setForm(f=>({...f,cliente_nombre:e.target.value}))}
                placeholder="Nombre del cliente *" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input value={form.cliente_email} onChange={e=>setForm(f=>({...f,cliente_email:e.target.value}))}
                placeholder="Email" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input value={form.cliente_telefono} onChange={e=>setForm(f=>({...f,cliente_telefono:e.target.value}))}
                placeholder="Teléfono" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input value={form.direccion_texto} onChange={e=>setForm(f=>({...f,direccion_texto:e.target.value}))}
                placeholder="Dirección de entrega" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <select value={form.product_id} onChange={e=>setForm(f=>({...f,product_id:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                <option value="">Selecciona producto *</option>
                {productos.map(p=><option key={p.id} value={p.id}>{p.nombre} — RD${p.precio?.toLocaleString()}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.frecuencia} onChange={e=>setForm(f=>({...f,frecuencia:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  {FRECUENCIAS.map(f=><option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>)}
                </select>
                <input value={form.precio} onChange={e=>setForm(f=>({...f,precio:e.target.value}))}
                  placeholder="Precio RD$" type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <input value={form.proximo_envio} onChange={e=>setForm(f=>({...f,proximo_envio:e.target.value}))}
                type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <textarea value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}
                placeholder="Notas internas" rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              <button onClick={crearSuscripcion}
                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                Crear Suscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
