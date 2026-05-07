'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut, ChevronRight, FileText, CreditCard, RefreshCw, MessageCircle } from 'lucide-react'

export default function CuentaPage() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [itemsPedido, setItemsPedido] = useState([])
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [tab, setTab] = useState('pedidos')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nombre: '', telefono: '' })
  const [direcciones, setDirecciones] = useState([])
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [nuevaCiudad, setNuevaCiudad] = useState('Santo Domingo')
  const [agregandoDir, setAgregandoDir] = useState(false)
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [recetas, setRecetas] = useState([])
  const [agregandoReceta, setAgregandoReceta] = useState(false)
  const [recetaForm, setRecetaForm] = useState({ nombre:'Mi receta', diagnostico:'', od_sph:'', od_cyl:'', od_axis:'', od_add:'', oi_sph:'', oi_cyl:'', oi_axis:'', oi_add:'' })
  const [agregandoPago, setAgregandoPago] = useState(false)
  const [pagoForm, setPagoForm] = useState({ titular:'', ultimos4:'', vencimiento:'' })
  const [pagos, setPagos] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) { setPerfil(data); setForm({ nombre: data.nombre || '', telefono: data.telefono || '' }) }
        })
        sb.from('orders').select('*').eq('user_id', user.id).order('fecha', { ascending: false }).then(({ data }) => setPedidos(data || []))
        sb.from('addresses').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setDirecciones(data || []))
        sb.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setRecetas(data || []))
        sb.from('payment_methods').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setPagos(data || []))
      }
    })
  }, [])

  const detectarDiagnostico = (form) => {
    const sph = parseFloat(form.od_sph || form.oi_sph || '0')
    const cyl = parseFloat(form.od_cyl || form.oi_cyl || '0')
    const add = parseFloat(form.od_add || form.oi_add || '0')
    const tieneCyl = cyl !== 0 && (form.od_cyl || form.oi_cyl)
    const tieneAdd = add > 0 && (form.od_add || form.oi_add)
    if (tieneAdd && sph < 0 && tieneCyl) return 'Presbicia + Miopía + Astigmatismo'
    if (tieneAdd && sph < 0) return 'Presbicia + Miopía'
    if (tieneAdd && sph >= 0) return 'Presbicia'
    if (sph < 0 && tieneCyl) return 'Miopía + Astigmatismo'
    if (sph > 0 && tieneCyl) return 'Hipermetropía + Astigmatismo'
    if (tieneCyl) return 'Astigmatismo'
    if (sph < 0) return 'Miopía'
    if (sph > 0) return 'Hipermetropía'
    return ''
  }

  const guardarReceta = async () => {
    const sb = createClient()
    const diagnostico = detectarDiagnostico(recetaForm)
    const { data } = await sb.from('prescriptions').insert({ user_id: user.id, ...recetaForm, diagnostico }).select().single()
    if (data) { setRecetas(r => [data, ...r]); setAgregandoReceta(false); setRecetaForm({ nombre:'Mi receta', diagnostico:'', od_sph:'', od_cyl:'', od_axis:'', od_add:'', oi_sph:'', oi_cyl:'', oi_axis:'', oi_add:'' }) }
  }

  const eliminarReceta = async (id) => {
    const sb = createClient()
    await sb.from('prescriptions').delete().eq('id', id)
    setRecetas(r => r.filter(x => x.id !== id))
  }

  const guardarPago = async () => {
    if (!pagoForm.titular || !pagoForm.ultimos4 || !pagoForm.vencimiento) return
    const sb = createClient()
    const { data } = await sb.from('payment_methods').insert({ user_id: user.id, ...pagoForm, tipo:'tarjeta', principal: pagos.length === 0 }).select().single()
    if (data) { setPagos(p => [...p, data]); setAgregandoPago(false); setPagoForm({ titular:'', ultimos4:'', vencimiento:'' }) }
  }

  const eliminarPago = async (id) => {
    const sb = createClient()
    await sb.from('payment_methods').delete().eq('id', id)
    setPagos(p => p.filter(x => x.id !== id))
  }

  const guardarPerfil = async () => {
    const sb = createClient()
    await sb.from('profiles').update({ nombre: form.nombre, telefono: form.telefono }).eq('id', user.id)
    setPerfil(p => ({ ...p, ...form }))
    setEditando(false)
  }

  const agregarDireccion = async () => {
    if (!nuevaDireccion.trim()) return
    const sb = createClient()
    const { data, error } = await sb.from('addresses').insert({ user_id: user.id, direccion: nuevaDireccion, ciudad: nuevaCiudad, principal: direcciones.length === 0 }).select().single()
    if (error) { alert(error.message); return }
    if (data) { setDirecciones(d => [...d, data]); setNuevaDireccion(''); setNuevaCiudad('Santo Domingo'); setAgregandoDir(false) }
  }

  const eliminarDireccion = async (id) => {
    const sb = createClient()
    await sb.from('addresses').delete().eq('id', id)
    setDirecciones(d => d.filter(x => x.id !== id))
  }

  const cerrarSesion = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    window.location.reload()
  }

  const verPedido = async (p) => {
    setSelectedPedido(p)
    setLoadingPedido(true)
    const sb = createClient()
    const { data } = await sb.from('order_items').select('*').eq('order_id', p.id)
    setItemsPedido(data || [])
    setLoadingPedido(false)
  }

  const login = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { setMsg('Email o contrasena incorrectos'); setLoading(false); return }
    window.location.reload()
  }

  const registro = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('')
    const sb = createClient()
    const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nombre, telefono } } })
    if (error) { setMsg(error.message); setLoading(false); return }
    if (data.user) {
      await sb.from('profiles').upsert({ id: data.user.id, email, nombre, telefono, role: 'customer' })
      window.location.reload()
    }
    setLoading(false)
  }

  const ESTADO = { pendiente: 'bg-yellow-50 text-yellow-700', confirmado: 'bg-blue-50 text-blue-700', preparando: 'bg-purple-50 text-purple-700', enviado: 'bg-indigo-50 text-indigo-700', entregado: 'bg-green-50 text-green-700', cancelado: 'bg-red-50 text-red-700' }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4"><User className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setModo('login')} className={"flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Iniciar sesion</button>
            <button onClick={() => setModo('registro')} className={"flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo === 'registro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Crear cuenta</button>
          </div>
          {msg && <p className="text-sm text-center mb-4 p-3 rounded-lg bg-red-50 text-red-600">{msg}</p>}
          <form onSubmit={modo === 'login' ? login : registro} className="space-y-4">
            {modo === 'registro' && (<>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Nombre</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu nombre" /></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Telefono</label>
                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="809-000-0000" /></div>
            </>)}
            <div><label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="tu@email.com" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Contrasena</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" /></div>
            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}</button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{(perfil?.nombre || user.email)[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{perfil?.nombre || 'Mi cuenta'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={cerrarSesion} className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6">
          {[{id:'pedidos',label:'Pedidos',icon:Package},{id:'recetas',label:'Recetas',icon:FileText},{id:'pagos',label:'Pagos',icon:CreditCard},{id:'perfil',label:'Perfil',icon:User},{id:'direcciones',label:'Dirs',icon:MapPin}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={"flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold transition-all " + (tab === t.id ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600')}>
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pedidos' && (
          <div className="space-y-3">
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes pedidos aun</p>
                <a href="/catalogo" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Ver catalogo</a>
              </div>
            ) : pedidos.map(p => (
              <button key={p.id} onClick={() => verPedido(p)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:border-primary-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(p.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[p.estado] || 'bg-gray-50 text-gray-600')}>{p.estado}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-primary-600 font-bold text-lg">RD${(p.total || 0).toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg capitalize">{(p.metodo_pago || '').replace('_', ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'recetas' && (
          <div className="space-y-3">
            {recetas.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes recetas guardadas</p>
                <p className="text-xs text-gray-400 mt-1">Agrega tu receta optica para comprar mas rapido</p>
              </div>
            )}
            {recetas.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.nombre}</p>
                  {r.diagnostico && <span className="text-xs font-semibold px-2 py-1 bg-primary-50 text-primary-700 rounded-full">{r.diagnostico}</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['OD Derecho', r.od_sph, r.od_cyl, r.od_axis, r.od_add], ['OI Izquierdo', r.oi_sph, r.oi_cyl, r.oi_axis, r.oi_add]].map(([label, sph, cyl, axis, add]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                      <div className="space-y-1 text-xs">
                        {sph && <p><span className="text-gray-400">SPH: </span><span className="font-semibold">{sph}</span></p>}
                        {cyl && <p><span className="text-gray-400">CYL: </span><span className="font-semibold">{cyl}</span></p>}
                        {axis && <p><span className="text-gray-400">EJE: </span><span className="font-semibold">{axis}</span></p>}
                        {add && <p><span className="text-gray-400">ADD: </span><span className="font-semibold">{add}</span></p>}
                      </div>
                    </div>
                  ))}
                </div>
                {r.diagnostico && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                    <p className="font-semibold mb-1">Lentes recomendados para {r.diagnostico}:</p>
                    <p>{r.diagnostico === 'Miopia' || r.diagnostico === 'Miopía' ? 'Lentes esfericos con graduacion negativa (SPH -)' :
                       r.diagnostico === 'Astigmatismo' ? 'Lentes toricos (Acuvue Oasys for Astigmatism, Air Optix for Astigmatism)' :
                       r.diagnostico === 'Presbicia' ? 'Lentes multifocales (Acuvue Oasys for Multifocal)' :
                       r.diagnostico === 'Hipermetropia' || r.diagnostico === 'Hipermetropía' ? 'Lentes esfericos con graduacion positiva (SPH +)' :
                       r.diagnostico === 'Miopia + Astigmatismo' ? 'Lentes toricos con SPH negativo' : 'Consulta con tu oftalmologo'}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <a href="/catalogo" className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-primary-700 transition-colors">Comprar</a>
                  <button onClick={() => eliminarReceta(r.id)} className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
            {agregandoReceta ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={recetaForm.nombre} onChange={e => setRecetaForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre (ej: Receta 2025)" />

                {(recetaForm.od_sph || recetaForm.oi_sph) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-800 font-semibold">
                    Diagnostico detectado: {detectarDiagnostico(recetaForm) || 'Ingresa SPH para detectar'}
                  </div>
                )}
                {[['OD Ojo Derecho', 'od'], ['OI Ojo Izquierdo', 'oi']].map(([label, side]) => (
                  <div key={side}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-xs text-gray-400 mb-1">SPH</p>
                        <input value={recetaForm[side+'_sph']} onChange={e => setRecetaForm(f => ({...f, [side+'_sph']: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="-2.50" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">CYL</p>
                        <input value={recetaForm[side+'_cyl']} onChange={e => setRecetaForm(f => ({...f, [side+'_cyl']: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="-0.75" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">EJE</p>
                        <input value={recetaForm[side+'_axis']} onChange={e => setRecetaForm(f => ({...f, [side+'_axis']: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="180" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">ADD</p>
                        <input value={recetaForm[side+'_add']} onChange={e => setRecetaForm(f => ({...f, [side+'_add']: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+1.50" /></div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={guardarReceta} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar receta</button>
                  <button onClick={() => setAgregandoReceta(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoReceta(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar receta
              </button>
            )}
          </div>
        )}

        {tab === 'pagos' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
              <p className="font-semibold mb-1">Solo guardamos referencia</p>
              <p>Ultimos 4 digitos y titular. Nunca el numero completo.</p>
            </div>
            {pagos.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes tarjetas guardadas</p>
              </div>
            )}
            {pagos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">XXXX XXXX XXXX {p.ultimos4}</p>
                    <p className="text-xs text-gray-400">{p.titular} · Vence {p.vencimiento}</p>
                  </div>
                </div>
                <button onClick={() => eliminarPago(p.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoPago ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={pagoForm.titular} onChange={e => setPagoForm(f => ({...f, titular: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre del titular" />
                <input value={pagoForm.ultimos4} onChange={e => setPagoForm(f => ({...f, ultimos4: e.target.value.slice(0,4)}))} maxLength={4} inputMode="numeric" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ultimos 4 digitos" />
                <input value={pagoForm.vencimiento} onChange={e => setPagoForm(f => ({...f, vencimiento: e.target.value}))} maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="MM/AA" />
                <div className="flex gap-2">
                  <button onClick={guardarPago} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoPago(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoPago(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar tarjeta
              </button>
            )}
          </div>
        )}

        {tab === 'perfil' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Informacion personal</h2>
              {!editando ? (
                <button onClick={() => setEditando(true)} className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={guardarPerfil} className="flex items-center gap-1 text-sm text-white font-semibold bg-green-500 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" /> Guardar</button>
                  <button onClick={() => setEditando(false)} className="flex items-center gap-1 text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"><X className="w-3.5 h-3.5" /> Cancelar</button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Nombre completo</label>
                {editando ? (
                  <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
                ) : <p className="text-gray-900 font-medium py-1">{perfil?.nombre || 'Sin nombre'}</p>}
              </div>
              <div className="flex items-center gap-3 py-1">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Email</p>
                  <p className="text-gray-700 font-medium">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Telefono</label>
                {editando ? (
                  <input value={form.telefono} onChange={e => setForm(f => ({...f, telefono: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" placeholder="809-000-0000" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 font-medium">{perfil?.telefono || 'Sin telefono'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'direcciones' && (
          <div className="space-y-3">
            {direcciones.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={"w-8 h-8 rounded-xl flex items-center justify-center shrink-0 " + (d.principal ? 'bg-primary-100' : 'bg-gray-100')}>
                    <MapPin className={"w-4 h-4 " + (d.principal ? 'text-primary-600' : 'text-gray-400')} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.direccion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.ciudad}</p>
                    {d.principal && <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full mt-1 inline-block">Principal</span>}
                  </div>
                </div>
                <button onClick={() => eliminarDireccion(d.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {agregandoDir ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={nuevaDireccion} onChange={e => setNuevaDireccion(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Calle, numero, sector" />
                <input value={nuevaCiudad} onChange={e => setNuevaCiudad(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Ciudad" />
                <div className="flex gap-2">
                  <button onClick={agregarDireccion} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Guardar</button>
                  <button onClick={() => setAgregandoDir(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoDir(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar direccion
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal detalle pedido */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
          <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0">
            <button onClick={() => setSelectedPedido(null)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="font-bold text-gray-900">{"Pedido #" + selectedPedido.id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-gray-400">{new Date(selectedPedido.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className={"ml-auto px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[selectedPedido.estado] || 'bg-gray-50 text-gray-600')}>
              {selectedPedido.estado}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            {/* Productos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Productos</p>
              </div>
              <div className="p-4 space-y-3">
                {loadingPedido ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : itemsPedido.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-2">Sin detalles disponibles</p>
                ) : itemsPedido.map((item) => {
                  const specs = []
                  if (item.ojo)         specs.push({ label: 'Ojo',    val: item.ojo })
                  if (item.sph != null) specs.push({ label: 'SPH',   val: item.sph > 0 ? '+'+item.sph : String(item.sph) })
                  if (item.cyl != null) specs.push({ label: 'CYL',   val: String(item.cyl) })
                  if (item.axis != null) specs.push({ label: 'AXIS', val: String(item.axis).padStart(3,'0')+'°' })
                  if (item.add_power)   specs.push({ label: 'ADD',   val: item.add_power })
                  if (item.color)       specs.push({ label: 'Color', val: item.color })
                  if (item.size)        specs.push({ label: 'Tamaño',val: item.size })
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                        <p className="font-bold text-gray-900 text-sm whitespace-nowrap">
                          RD${(item.subtotal ?? item.precio * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                      {specs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {specs.map(s => (
                            <span key={s.label} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-xs">
                              <span className="text-gray-400">{s.label}:</span>
                              <span className="font-semibold text-gray-700">{s.val}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
                    </div>
                  )
                })}
              </div>
              <div className="px-4 py-3 border-t border-gray-50 flex justify-between">
                <p className="font-bold text-gray-900">Total</p>
                <p className="font-black text-primary-600 text-lg">RD${(selectedPedido.total || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Envío */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Dirección de envío</p>
              </div>
              <p className="text-gray-700 font-medium">{selectedPedido.direccion_texto || 'Sin dirección registrada'}</p>
            </div>

            {/* Pago */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Información de pago</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Método</p>
                  <p className="font-semibold text-gray-900 capitalize mt-0.5">{(selectedPedido.metodo_pago || '—').replace('_',' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estado</p>
                  <p className={"font-semibold mt-0.5 capitalize " + (selectedPedido.pago_estado === 'pagado' ? 'text-green-600' : 'text-amber-600')}>
                    {selectedPedido.pago_estado || 'pendiente'}
                  </p>
                </div>
                {selectedPedido.pago_referencia && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Referencia</p>
                    <p className="font-mono font-semibold text-gray-900 mt-0.5">{selectedPedido.pago_referencia}</p>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp soporte */}
            <a href={"https://wa.me/18294089097?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido%20%23"+selectedPedido.id.slice(-6).toUpperCase()}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm transition-colors">
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
