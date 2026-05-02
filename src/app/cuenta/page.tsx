'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, Mail, Lock, User, Phone } from 'lucide-react'

export default function CuentaPage() {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { setMsg('Email o contraseña incorrectos'); setLoading(false); return }
    router.push('/')
    router.refresh()
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
      setMsg('Cuenta creada exitosamente. Revisa tu email para confirmar.')
    }
    setLoading(false)
  }

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
            <button onClick={() => setModo('login')}
              className={'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ' + (modo === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
              Iniciar sesión
            </button>
            <button onClick={() => setModo('registro')}
              className={'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ' + (modo === 'registro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
              Crear cuenta
            </button>
          </div>
          {msg && <p className={'text-sm text-center mb-4 p-3 rounded-lg ' + (msg.includes('exitosamente') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>{msg}</p>}
          <form onSubmit={modo === 'login' ? login : registro} className="space-y-4">
            {modo === 'registro' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tu nombre" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="809-000-0000" />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">← Volver al catálogo</a>
          </div>
        </div>
      </div>
    </div>
  )
}
