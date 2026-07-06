'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { X, Tag } from 'lucide-react'

export default function WelcomePopup() {
  const [visible, setVisible]   = useState(false)
  const [email, setEmail]       = useState('')
  const [nombre, setNombre]     = useState('')
  const [password, setPassword] = useState('')
  const [paso, setPaso]         = useState<'email'|'registro'|'exito'>('email')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [countdown, setCountdown] = useState(5) // auto-cierre en 5s
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    try { if (sessionStorage.getItem('popup_visto')) return } catch {}

    const sb = createClient()
    // Guard: Sentry undefined.then — getUser puede ser undefined si Supabase no inicializa
    const authPromise = sb?.auth?.getUser?.()
    if (!authPromise || typeof authPromise.then !== 'function') return
    authPromise.then(({ data: { user } }) => {
      if (user) return

      // Mostrar a los 5 segundos
      const timer = setTimeout(() => {
        setVisible(true)
        // Auto-cerrar a los 5 segundos de aparecer (solo si no interactuó)
        startCountdown()
      }, 5000)

      // Exit intent en desktop
      const exit = (e: MouseEvent) => {
        if (e.clientY < 10) {
          clearTimeout(timer)
          setVisible(true)
          startCountdown()
        }
      }
      document.addEventListener('mouseleave', exit)
      return () => { clearTimeout(timer); document.removeEventListener('mouseleave', exit) }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startCountdown = () => {
    setCountdown(5)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          cerrar()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(0) // 0 = no mostrar countdown
  }

  const cerrar = () => {
    setVisible(false)
    stopCountdown()
    try { sessionStorage.setItem('popup_visto', '1') } catch {}
  }

  const onInteract = () => stopCountdown() // si el usuario interactúa, cancela el auto-cierre

  const onEmail = (e: React.FormEvent) => {
    e.preventDefault()
    onInteract()
    if (!email.includes('@')) { setError('Email inválido'); return }
    setError(''); setPaso('registro')
  }

  const onRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    onInteract()
    if (!nombre.trim())      { setError('Ingresa tu nombre'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    setLoading(true); setError('')
    try {
      const sb = createClient()
      const { data: signUpData, error: err } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: nombre } }
      })
      if (err) { setError(err.message); return }
      await fetch('/api/welcome-coupon', { method: 'POST' })
      // Buscar teléfono del profile si ya existe
      let telefonoUser: string | null = null
      try {
        const { data: p } = await sb.from('profiles').select('telefono').eq('id', signUpData?.user?.id ?? '').maybeSingle()
        telefonoUser = p?.telefono ?? null
      } catch {}
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, telefono: telefonoUser, user_id: signUpData?.user?.id }),
      }).catch(() => {})
      setPaso('exito')
      try { sessionStorage.setItem('popup_visto', '1') } catch {}
    } catch { setError('Error al crear cuenta') }
    finally { setLoading(false) }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) cerrar() }}>

      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up"
        onMouseEnter={onInteract}
        onTouchStart={onInteract}>

        {/* Botón X — siempre visible y grande para mobile */}
        <button
          onClick={cerrar}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          aria-label="Cerrar">
          <X className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* Countdown ring — solo si está corriendo */}
        {countdown > 0 && paso === 'email' && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
            <div className="w-4 h-4 relative">
              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <circle cx="8" cy="8" r="6" fill="none" stroke="white" strokeWidth="2"
                  strokeDasharray={`${(countdown/5)*37.7} 37.7`}
                  style={{ transition: 'stroke-dasharray 1s linear' }}/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white">{countdown}s</span>
          </div>
        )}

        {/* Header verde */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-7 pb-6 text-center">
          {paso === 'exito' ? (
            <>
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-black text-white">¡Listo!</h2>
              <p className="text-primary-100 text-sm mt-1">Tu cupón está en tu email</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full mb-3">
                <Tag className="w-3 h-3" /> SOLO PARA NUEVOS CLIENTES
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">10% OFF<br />tu primera compra</h2>
              <p className="text-primary-100 text-sm mt-2">Regístrate gratis • Solo toma 30 segundos</p>
            </>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {paso === 'exito' && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">Tu cupón de bienvenida</p>
                <p className="text-2xl font-black text-primary-600 tracking-widest">BIEN10-★★★★★</p>
                <p className="text-xs text-gray-400 mt-1">Revisa tu email — llega en segundos</p>
              </div>
              <button onClick={() => { router.push('/catalogo'); cerrar() }}
                className="w-full bg-primary-600 text-white font-black py-3.5 rounded-2xl text-sm hover:bg-primary-700 transition-colors">
                Ver lentes →
              </button>
            </div>
          )}

          {paso === 'email' && (
            <form onSubmit={onEmail} className="space-y-3" onClick={onInteract}>
              <input type="email" placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ fontSize: '16px' }} />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-3.5 rounded-2xl text-sm shadow-md transition-colors">
                Quiero mi 10% →
              </button>
              <button type="button" onClick={cerrar}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
                No gracias, prefiero precio completo
              </button>
            </form>
          )}

          {paso === 'registro' && (
            <form onSubmit={onRegistro} className="space-y-2.5" onClick={onInteract}>
              <p className="text-xs text-gray-500 text-center mb-1">
                Creando cuenta con <strong className="text-primary-600">{email}</strong>
              </p>
              <input type="text" placeholder="Tu nombre completo" value={nombre}
                onChange={e => setNombre(e.target.value)} autoComplete="name" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ fontSize: '16px' }} />
              <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password}
                onChange={e => setPassword(e.target.value)} autoComplete="new-password" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ fontSize: '16px' }} />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-sm shadow-md hover:bg-primary-700 transition-colors">
                {loading ? 'Creando cuenta...' : 'Crear cuenta y obtener 10% OFF 🎉'}
              </button>
              <button type="button" onClick={() => setPaso('email')}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
                ← Cambiar email
              </button>
            </form>
          )}
        </div>

        {/* Trust footer */}
        {paso !== 'exito' && (
          <div className="bg-gray-50 border-t px-6 py-3 flex items-center justify-center gap-4">
            {['🔒 Gratis', '📦 Envío a RD', '✅ Originales'].map(t => (
              <span key={t} className="text-[10px] text-gray-500 font-medium">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
