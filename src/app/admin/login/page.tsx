'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { toast.error('Credenciales incorrectas'); setLoading(false); return }
    const { data: { user } } = await sb.auth.getUser()
    const { data: profile } = await sb.from('profiles').select('role').eq('id', user!.id).single()
    if (profile?.role !== 'admin') {
      await sb.auth.signOut()
      toast.error('No tienes acceso al panel admin')
      setLoading(false); return
    }
    toast.success('Bienvenido al panel admin')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">ContactGo</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
        </div>

        <form onSubmit={login} className="bg-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 pl-10
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="info@contactgo.net" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 pl-10
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl
                       transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
