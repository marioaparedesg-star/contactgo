'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

function ResetContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const [mode, setMode]       = useState<'request' | 'update'>('request')
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [pass2, setPass2]     = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Detectar modo update: usuario llegó vía link de recovery
  // /auth/callback ya ejecutó verifyOtp o exchangeCodeForSession
  useEffect(() => {
    const search = window.location.search
    const hash   = window.location.hash
    const params = new URLSearchParams(search)

    // Error del callback
    const err = params.get('error')
    if (err) {
      setMsg({ type: 'err', text: decodeURIComponent(err) })
      return
    }

    // Si Supabase pone el token en el hash (implicit flow)
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      const sb = createClient()
      sb.auth.getUser().then(({ data }) => {
        if (data.user) setMode('update')
      })
      return
    }

    // Verificar si ya hay sesión activa (callback exitoso)
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => {
      if (data.user) setMode('update')
    })

    // Escuchar cambios de sesión (cuando Supabase procesa el token)
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setMode('update')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true); setMsg(null)
    try {
      // Usar nuestra API que envía email bonito desde info@contactgo.net
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      if (res.ok) {
        setMsg({ type: 'ok', text: `✅ Te enviamos un correo a ${email}. Revisa tu bandeja de entrada y también el spam.` })
      } else {
        // Fallback: usar Supabase directo
        const sb = createClient()
        await sb.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/cuenta/reset-password`,
        })
        setMsg({ type: 'ok', text: 'Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Error al enviar el correo. Intenta de nuevo.' })
    }
    setLoading(false)
  }

  const updatePass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pass.length < 8) { setMsg({ type: 'err', text: 'La contraseña debe tener al menos 8 caracteres.' }); return }
    if (pass !== pass2)  { setMsg({ type: 'err', text: 'Las contraseñas no coinciden.' }); return }
    setLoading(true); setMsg(null)
    const sb = createClient()
    const { error } = await sb.auth.updateUser({ password: pass })
    if (error) {
      setMsg({ type: 'err', text: error.message })
    } else {
      setMsg({ type: 'ok', text: '¡Contraseña actualizada! Redirigiendo...' })
      setTimeout(() => router.push('/cuenta'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-primary-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900">
            {mode === 'request' ? 'Recuperar contraseña' : 'Nueva contraseña'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {mode === 'request'
              ? 'Ingresa tu correo y te enviaremos un enlace.'
              : 'Elige tu nueva contraseña.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {msg && (
            <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              {msg.text}
            </div>
          )}

          {mode === 'request' ? (
            <form onSubmit={sendReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="tu@correo.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-2xl text-sm transition-colors disabled:opacity-60">
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          ) : (
            <form onSubmit={updatePass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nueva contraseña</label>
                <input type="password" autoComplete="new-password" value={pass} onChange={e => setPass(e.target.value)} required minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirmar contraseña</label>
                <input type="password" autoComplete="new-password" value={pass2} onChange={e => setPass2(e.target.value)} required
                  placeholder="Repite la contraseña"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-2xl text-sm transition-colors disabled:opacity-60">
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <Link href="/cuenta" className="text-primary-600 hover:underline font-medium">
              ← Mi cuenta
            </Link>
            <a href="/" className="text-gray-400 hover:text-primary-600 transition-colors font-medium">
              Tienda →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetContent />
    </Suspense>
  )
}
