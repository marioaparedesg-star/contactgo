'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [msg, setMsg] = useState('')

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { setMsg('Credenciales incorrectas'); setLoading(false); return }
    router.push('/admin')
  }

  const sendMagicLink = async () => {
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/admin' } })
    if (error) { setMsg('Error: ' + error.message); setLoading(false); return }
    setMagicSent(true)
    setMsg('Revisa tu email y haz clic en el link')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ContactGo</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administracion</p>
        </div>
        {msg && <p className="text-center text-sm mb-4 text-yellow-400">{msg}</p>}
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="admin@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Contrasena</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-center text-xs text-gray-500 mb-3">O entra sin contrasena</p>
          <button onClick={sendMagicLink} disabled={loading || !email}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {magicSent ? 'Email enviado!' : 'Enviar Magic Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
