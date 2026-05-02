'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, Mail, Lock, User, Phone, Package, LogOut } from 'lucide-react'

export default function CuentaPage() {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [pedidos, setPedidos] = useState<any[]>([])

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setPerfil(data))
        sb.from('orders').select('*, order_items(*, products(nombre))').eq('user_id', user.id).order('fecha', { ascending: false }).then(({ data }) => setPedidos(data ?? []))
      }
    })
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { setMsg('Email o contraseña incorrectos'); setLoading(false); return }
    window.location.reload()
  }

  const registro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const sb = createClient()
    const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nombre, telefono } } })
    if (error) { setMsg(error.message); setLoading(false); return }
    if (data.user) {
      await sb.from('profiles').upsert({ id: data.user.id, email, nombre, telefono, role: 'customer' })
      setUser(data.user)
      setPerfil({ nombre, email, telefono, role: 'customer' })
      setMsg('Cuenta creada exitosamente')
    }
    setLoading(false)
  }

  const cerrarSesion = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    window.location.reload()
  }

  if (user) return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">{(perfil?.nombre ?? user.email)[0].toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{perfil?.nombre ?? 'Mi cuenta'}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <button onClick={cerrarSesion} className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">Mis datos</h2>
          <p className="text-gray-500 text-sm">Email: {user.email}</p>
          {perfil?.telefono && <p className="text-gray-500 text-sm">Teléfono: {perfil.telefono}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-gray-900">Mis pedidos</h2>
          </div>
          {pedidos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No tienes pedidos aún</p>
              <a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:text-primary-700">Ver catálogo →</a>
            </div>
          ) : pedidos.map((p: any) => (
            <div key={p.id} className="border border-gray-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.estado === 'entregado' ? 'bg-green-50 text-green-700' : p.estado === 'pendiente' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>{p.estado}</span>
              </div>
              <p className="text-gray-500 text-xs mb-2">{new Date(p.fecha).toLocaleDateString('es-DO')}</p>
              <p className="text-primary-600 font-bold">RD${p.total?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ContactGo</h1>
          <p className="text-gray-500 text-sm mt-1">Tu tienda de lentes de contacto</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setModo('login')} className={'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ' + (modo === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Iniciar sesión</button>
            <button onClick={() => setModo('registro')} className={'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ' + (modo === 'registro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>Crear cuenta</button>
          </div>
          {msg && <p className={'text-sm text-center mb-4 p-3 rounded-lg ' + (msg.includes('exitosamente') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>{msg}</p>}
          <form onSubmit={modo === 'login' ? login : registro} className="space-y-4">
            {modo === 'registro' && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre completo</label>
                <div className="relative"><User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu nombre" /></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Teléfono</label>
                <div className="relative"><Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="809-000-0000" /></div>
              </div>
            </>)}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="tu@email.com" /></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contraseña</label>
              <div className="relative"><Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" /></div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-primary-600 font-medium">← Volver al catálogo</a>
          </div>
        </div>
      </div>
    </div>
  )
}
