'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut, ChevronRight } from 'lucide-react'

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
      }
    })
  }, [])

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
          {[{id:'pedidos',label:'Pedidos',icon:Package},{id:'perfil',label:'Perfil',icon:User},{id:'direcciones',label:'Direcciones',icon:MapPin}].map(t => (
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
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(p.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[p.estado] || 'bg-gray-50 text-gray-600')}>{p.estado}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-primary-600 font-bold text-lg">RD${(p.total || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg capitalize">{(p.metodo_pago || '').replace('_', ' ')}</span>
                </div>
              </div>
            ))}
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
    </div>
  )
}
