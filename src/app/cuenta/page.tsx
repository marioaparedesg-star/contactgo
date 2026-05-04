'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut, FileText, CreditCard, Camera, ChevronDown, ShoppingCart, MessageCircle, RefreshCw } from 'lucide-react'

export default function CuentaPage() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [pedidos, setPedidos] = useState([])
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
  const [msg, setMsg] = useState('')
  const [recetas, setRecetas] = useState([])
  const [agregandoReceta, setAgregandoReceta] = useState(false)
  const [recetaForm, setRecetaForm] = useState({ nombre:'Mi receta', od_sph:'', od_cyl:'', od_axis:'', od_add:'', oi_sph:'', oi_cyl:'', oi_axis:'', oi_add:'' })
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrResult, setOcrResult] = useState('')
  const fileRef = useRef(null)
  const [pagos, setPagos] = useState([])
  const [agregandoPago, setAgregandoPago] = useState(false)
  const [pagoForm, setPagoForm] = useState({ titular:'', ultimos4:'', vencimiento:'', tipo:'tarjeta' })
  const [pedidoDetalle, setPedidoDetalle] = useState(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) { setPerfil(data); setForm({ nombre: data.nombre || '', telefono: data.telefono || '' }) }
        })
        sb.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setPedidos(data || []))
        sb.from('addresses').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setDirecciones(data || []))
        sb.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setRecetas(data || []))
        sb.from('payment_methods').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setPagos(data || []))
      }
    })
  }, [])

  const guardarPerfil = async () => {
    const sb = createClient()
    await sb.from('profiles').update({ nombre: form.nombre, telefono: form.telefono }).eq('id', user.id)
    setPerfil(p => ({ ...p, ...form })); setEditando(false)
  }

  const agregarDireccion = async () => {
    if (!nuevaDireccion.trim()) return
    const sb = createClient()
    const { data } = await sb.from('addresses').insert({ user_id: user.id, direccion: nuevaDireccion, ciudad: nuevaCiudad, principal: direcciones.length === 0 }).select().single()
    if (data) { setDirecciones(d => [...d, data]); setNuevaDireccion(''); setAgregandoDir(false) }
  }

  const eliminarDireccion = async (id) => {
    const sb = createClient()
    await sb.from('addresses').delete().eq('id', id)
    setDirecciones(d => d.filter(x => x.id !== id))
  }

  const guardarReceta = async () => {
    const sb = createClient()
    const { data } = await sb.from('prescriptions').insert({ user_id: user.id, ...recetaForm }).select().single()
    if (data) { setRecetas(r => [data, ...r]); setAgregandoReceta(false); setRecetaForm({ nombre:'Mi receta', od_sph:'', od_cyl:'', od_axis:'', od_add:'', oi_sph:'', oi_cyl:'', oi_axis:'', oi_add:'' }) }
  }

  const eliminarReceta = async (id) => {
    const sb = createClient()
    await sb.from('prescriptions').delete().eq('id', id)
    setRecetas(r => r.filter(x => x.id !== id))
  }

  const escanearReceta = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrLoading(true); setOcrResult('')
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1]
      try {
        const res = await fetch('/api/ocr-receta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64, mimeType: file.type }) })
        const data = await res.json()
        if (data.receta) { setRecetaForm(f => ({ ...f, ...data.receta })); setOcrResult('Receta detectada') }
        else setOcrResult('No se pudo leer. Ingresa manualmente.')
      } catch { setOcrResult('Error al procesar.') }
      setOcrLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const guardarPago = async () => {
    if (!pagoForm.titular || !pagoForm.ultimos4 || !pagoForm.vencimiento) return
    const sb = createClient()
    const { data } = await sb.from('payment_methods').insert({ user_id: user.id, ...pagoForm, principal: pagos.length === 0 }).select().single()
    if (data) { setPagos(p => [...p, data]); setAgregandoPago(false); setPagoForm({ titular:'', ultimos4:'', vencimiento:'', tipo:'tarjeta' }) }
  }

  const eliminarPago = async (id) => {
    const sb = createClient()
    await sb.from('payment_methods').delete().eq('id', id)
    setPagos(p => p.filter(x => x.id !== id))
  }

  const cerrarSesion = async () => {
    const sb = createClient()
    await sb.auth.signOut(); window.location.reload()
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
  const SPH_OPTS = Array.from({length: 41}, (_, i) => ((i * 0.25) - 10).toFixed(2)).map(v => (parseFloat(v) > 0 ? '+' : '') + v)
  const CYL_OPTS = Array.from({length: 20}, (_, i) => (-((i + 1) * 0.25)).toFixed(2))
  const AXIS_OPTS = Array.from({length: 180}, (_, i) => String(i + 1))
  const ADD_OPTS = ['+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00']

  const Sel = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white pr-8">
        <option value="">{placeholder || 'slash'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )

  const TABS = [
    {id:'pedidos', label:'Pedidos', icon:Package},
    {id:'recomprar', label:'Repetir', icon:RefreshCw},
    {id:'recetas', label:'Recetas', icon:FileText},
    {id:'pagos', label:'Pagos', icon:CreditCard},
    {id:'perfil', label:'Perfil', icon:User},
    {id:'direcciones', label:'Dirs', icon:MapPin},
  ]

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4"><User className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setModo('login')} className={" flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Iniciar sesion</button>
            <button onClick={() => setModo('registro')} className={" flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo === 'registro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Crear cuenta</button>
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
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="password" /></div>
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
          <div className="flex items-center gap-2">
            <a href="https://wa.me/18294089097" target="_blank" className="flex items-center gap-1 text-sm text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-xl">
              <MessageCircle className="w-4 h-4" /> Soporte
            </a>
            <button onClick={cerrarSesion} className="text-gray-400 hover:text-red-500 px-3 py-2 rounded-xl">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6 overflow-x-auto gap-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={" flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all min-w-[48px] " + (tab === t.id ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400')}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pedidos' && (
          <div className="space-y-3">
            {pedidoDetalle ? (
              <div className="space-y-3">
                <button onClick={() => setPedidoDetalle(null)} className="text-sm text-primary-600 font-semibold">Volver</button>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-gray-900">Pedido #{pedidoDetalle.id.slice(-6).toUpperCase()}</p>
                    <span className={" px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[pedidoDetalle.estado] || 'bg-gray-50 text-gray-600')}>{pedidoDetalle.estado}</span>
                  </div>
                  {pedidoDetalle.order_items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-xs text-gray-400">x{item.cantidad}{item.sph ? ' SPH '+item.sph : ''}</p>
                      </div>
                      <p className="font-bold">RD${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-3 border-t mt-2">
                    <span>Total</span>
                    <span className="text-primary-600">RD${(pedidoDetalle.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes pedidos aun</p>
                <a href="/catalogo" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-semibold">Ver catalogo</a>
              </div>
            ) : pedidos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at || p.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={" px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[p.estado] || 'bg-gray-50 text-gray-600')}>{p.estado}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 gap-2">
                  <span className="text-primary-600 font-bold">RD${(p.total || 0).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPedidoDetalle(p)} className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">Ver detalle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'recomprar' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Tus productos recientes. Agrega al carrito en un tap.</p>
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <RefreshCw className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">Aun no tienes pedidos</p>
              </div>
            ) : pedidos.flatMap(p => p.order_items || []).filter((item, i, arr) => arr.findIndex(x => x.product_id === item.product_id) === i).slice(0, 8).map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                  <p className="text-xs text-gray-400">RD${item.precio?.toLocaleString()}{item.sph ? ' SPH '+item.sph : ''}</p>
                </div>
                <a href="/catalogo" className="flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5" /> Agregar
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'recetas' && (
          <div className="space-y-3">
            {recetas.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.nombre}</p>
                  <button onClick={() => eliminarReceta(r.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[['OD Derecho', r.od_sph, r.od_cyl, r.od_axis, r.od_add], ['OI Izquierdo', r.oi_sph, r.oi_cyl, r.oi_axis, r.oi_add]].map(([label, sph, cyl, axis, add]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                      <div className="space-y-1 text-xs">
                        {sph && <p><span className="text-gray-400">SPH:</span> <span className="font-semibold">{sph}</span></p>}
                        {cyl && <p><span className="text-gray-400">CYL:</span> <span className="font-semibold">{cyl}</span></p>}
                        {axis && <p><span className="text-gray-400">EJE:</span> <span className="font-semibold">{axis}</span></p>}
                        {add && <p><span className="text-gray-400">ADD:</span> <span className="font-semibold">{add}</span></p>}
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/catalogo" className="w-full bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Comprar con esta receta
                </a>
              </div>
            ))}
            {agregandoReceta ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-4">
                <input value={recetaForm.nombre} onChange={e => setRecetaForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre receta" />
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={escanearReceta} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-primary-200 rounded-xl py-3 flex items-center justify-center gap-2 text-primary-600 text-sm font-semibold">
                  <Camera className="w-4 h-4" />{ocrLoading ? 'Analizando...' : 'Foto o imagen de receta'}
                </button>
                {ocrResult && <p className="text-xs text-center text-gray-600">{ocrResult}</p>}
                {[['OD Ojo Derecho', 'od'], ['OI Ojo Izquierdo', 'oi']].map(([label, side]) => (
                  <div key={side}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-xs text-gray-400 mb-1">SPH</p><Sel value={recetaForm[side+'_sph']} onChange={v => setRecetaForm(f => ({...f, [side+'_sph']: v}))} options={SPH_OPTS} placeholder="Esfera" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">CYL</p><Sel value={recetaForm[side+'_cyl']} onChange={v => setRecetaForm(f => ({...f, [side+'_cyl']: v}))} options={CYL_OPTS} placeholder="Cilindro" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">EJE</p><Sel value={recetaForm[side+'_axis']} onChange={v => setRecetaForm(f => ({...f, [side+'_axis']: v}))} options={AXIS_OPTS} placeholder="Eje" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">ADD</p><Sel value={recetaForm[side+'_add']} onChange={v => setRecetaForm(f => ({...f, [side+'_add']: v}))} options={ADD_OPTS} placeholder="Adicion" /></div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={guardarReceta} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar receta</button>
                  <button onClick={() => setAgregandoReceta(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoReceta(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400">
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
            {pagos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">XXXX XXXX XXXX {p.ultimos4}</p>
                    <p className="text-xs text-gray-400">{p.titular} Vence {p.vencimiento}</p>
                  </div>
                </div>
                <button onClick={() => eliminarPago(p.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoPago ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={pagoForm.titular} onChange={e => setPagoForm(f => ({...f, titular: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre del titular" />
                <input value={pagoForm.ultimos4} onChange={e => setPagoForm(f => ({...f, ultimos4: e.target.value.slice(0,4)}))}} maxLength={4} inputMode="numeric" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ultimos 4 digitos" />
                <input value={pagoForm.vencimiento} onChange={e => setPagoForm(f => ({...f, vencimiento: e.target.value}))} maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="MM/AA" />
                <div className="flex gap-2">
                  <button onClick={guardarPago} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoPago(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoPago(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400">
                <Plus className="w-5 h-5" /> Agregar tarjeta
              </button>
            )}
          </div>
        )}

        {tab === 'perfil' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">Informacion personal</h2>
                {!editando ? (
                  <button onClick={() => setEditando(true)} className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1.5 rounded-lg"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={guardarPerfil} className="flex items-center gap-1 text-sm text-white font-semibold bg-green-500 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" /> Guardar</button>
                    <button onClick={() => setEditando(false)} className="flex items-center gap-1 text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"><X className="w-3.5 h-3.5" /> Cancelar</button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Nombre completo</label>
                  {editando ? <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
                  : <p className="text-gray-900 font-medium py-1">{perfil?.nombre || 'Sin nombre'}</p>}
                </div>
                <div className="flex items-center gap-3 py-1">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Email</p><p className="text-gray-700 font-medium">{user.email}</p></div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Telefono</label>
                  {editando ? <input value={form.telefono} onChange={e => setForm(f => ({...f, telefono: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" placeholder="809-000-0000" />
                  : <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><p className="text-gray-700 font-medium">{perfil?.telefono || 'Sin telefono'}</p></div>}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Resumen</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{pedidos.length}</p><p className="text-xs text-gray-400 mt-1">Pedidos</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{recetas.length}</p><p className="text-xs text-gray-400 mt-1">Recetas</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{direcciones.length}</p><p className="text-xs text-gray-400 mt-1">Dirs</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'direcciones' && (
          <div className="space-y-3">
            {direcciones.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={" w-8 h-8 rounded-xl flex items-center justify-center shrink-0 " + (d.principal ? 'bg-primary-100' : 'bg-gray-100')}>
                    <MapPin className={" w-4 h-4 " + (d.principal ? 'text-primary-600' : 'text-gray-400')} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.direccion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.ciudad}</p>
                    {d.principal && <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full mt-1 inline-block">Principal</span>}
                  </div>
                </div>
                <button onClick={() => eliminarDireccion(d.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoDir ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={nuevaDireccion} onChange={e => setNuevaDireccion(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Calle, numero, sector" />
                <input value={nuevaCiudad} onChange={e => setNuevaCiudad(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Ciudad" />
                <div className="flex gap-2">
                  <button onClick={agregarDireccion} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoDir(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoDir(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400">
                <Plus className="w-5 h-5" /> Agregar direccion
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}