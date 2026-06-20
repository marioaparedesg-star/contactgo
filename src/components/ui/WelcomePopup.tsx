'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { X, Sparkles, Tag } from 'lucide-react'

export default function WelcomePopup() {
  const [visible, setVisible]           = useState(false)
  const [email, setEmail]               = useState('')
  const [nombre, setNombre]             = useState('')
  const [password, setPassword]         = useState('')
  const [fechaNacimiento, setFechaNac]  = useState('')
  const [paso, setPaso]                 = useState<'email'|'registro'|'exito'>('email')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const router = useRouter()

  useEffect(() => {
    try { if (sessionStorage.getItem('popup_visto')) return } catch {}
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) return
      const timer = setTimeout(() => setVisible(true), 9000)
      const exit  = (e: MouseEvent) => { if (e.clientY < 10) { setVisible(true); clearTimeout(timer) } }
      document.addEventListener('mouseleave', exit)
      return () => { clearTimeout(timer); document.removeEventListener('mouseleave', exit) }
    })
  }, [])

  const cerrar = () => { setVisible(false); sessionStorage.setItem('popup_visto', '1') }

  const onEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Email inválido'); return }
    setError(''); setPaso('registro')
  }

  const onRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim())    { setError('Ingresa tu nombre'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    if (!fechaNacimiento)  { setError('Ingresa tu fecha de nacimiento'); return }
    const edad = (Date.now() - new Date(fechaNacimiento).getTime()) / (365.25*24*60*60*1000)
    if (edad < 18) { setError('Debes ser mayor de 18 años para comprar lentes de contacto'); return }
    setLoading(true); setError('')
    try {
      const sb = createClient()
      const { error: err } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: nombre, fecha_nacimiento: fechaNacimiento } }
      })
      if (err) { setError(err.message); return }
      await fetch('/api/welcome-coupon', { method: 'POST' })
      // Email de bienvenida bonito
      await fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre }),
      }).catch(() => {})
      setPaso('exito')
      try { sessionStorage.setItem('popup_visto', '1') } catch {}
    } catch { setError('Error al crear cuenta') }
    finally { setLoading(false) }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) cerrar() }}>
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-6 pt-8 pb-6 text-center relative">
          <button onClick={cerrar} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          {paso === 'exito' ? (
            <><h2 className="text-2xl font-black text-white">¡Listo! 🎉</h2>
              <p className="text-primary-100 text-sm mt-1">Tu cupón está en tu email</p></>
          ) : (
            <><div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full mb-3">
                <Tag className="w-3 h-3" /> OFERTA EXCLUSIVA
              </div>
              <h2 className="text-3xl font-black text-white">10% OFF<br />tu primera compra</h2>
              <p className="text-primary-100 text-sm mt-2">Regístrate y recibe tu cupón al instante</p></>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {paso === 'exito' && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">Tu cupón de bienvenida</p>
                <p className="text-2xl font-black text-primary-600 tracking-widest">BIEN10-★★★★★</p>
                <p className="text-xs text-gray-400 mt-1">Revisa tu email</p>
              </div>
              <button onClick={() => { router.push('/catalogo'); cerrar() }}
                className="w-full bg-primary-600 text-white font-black py-3.5 rounded-2xl text-sm">
                Ir al catálogo →
              </button>
            </div>
          )}
          {paso === 'email' && (
            <form onSubmit={onEmail} className="space-y-3">
              <input type="email" placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ fontSize: '16px' }} />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" className="w-full bg-primary-600 text-white font-black py-3.5 rounded-2xl text-sm shadow-md">
                Quiero mi 10% →
              </button>
              <button type="button" onClick={cerrar} className="w-full text-xs text-gray-400 hover:text-gray-600">
                No gracias, prefiero pagar precio completo
              </button>
            </form>
          )}
          {paso === 'registro' && (
            <form onSubmit={onRegistro} className="space-y-2.5">
              <p className="text-xs text-gray-500 text-center">Cuenta con <strong className="text-primary-600">{email}</strong></p>
              <input type="text" placeholder="Nombre completo" value={nombre}
                onChange={e => setNombre(e.target.value)} autoComplete="name" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ fontSize: '16px' }} />
              <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password}
                onChange={e => setPassword(e.target.value)} autoComplete="new-password" required
                className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ fontSize: '16px' }} />
              <div>
                <input type="date" value={fechaNacimiento}
                  onChange={e => setFechaNac(e.target.value)}
                  max={new Date(Date.now()-18*365.25*24*60*60*1000).toISOString().split('T')[0]}
                  required
                  className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ fontSize: '16px' }} />
                <p className="text-[10px] text-gray-400 mt-0.5">Solo mayores de 18 años</p>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl text-sm shadow-md">
                {loading ? 'Creando cuenta...' : 'Crear cuenta y obtener 10% OFF 🎉'}
              </button>
              <button type="button" onClick={() => setPaso('email')}
                className="w-full text-xs text-gray-400 hover:text-gray-600">← Cambiar email</button>
            </form>
          )}
        </div>

        {paso !== 'exito' && (
          <div className="bg-gray-50 border-t px-6 py-3 flex items-center justify-center gap-4">
            {['🔒 Gratis','📦 Envío a RD','✅ Originales'].map(t => (
              <span key={t} className="text-[10px] text-gray-500">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
