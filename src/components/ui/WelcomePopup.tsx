'use client'
// ============================================================
// WelcomePopup — captura solo email a cambio de cupon 10% off
// Triggers: 20s de permanencia O exit intent (cursor hacia arriba)
// Anti-fatiga: localStorage — no vuelve a aparecer si:
//   1) El usuario completo (nunca mas)
//   2) El usuario lo cerro (7 dias de cooldown)
//   3) Esta en checkout/admin/cuenta/venta/confirmacion
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Mail, Sparkles, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'cg_welcome_popup_state'  // 'completed' | 'dismissed_YYYY-MM-DD'
const SHOW_AFTER_MS = 20_000
const DISMISS_COOLDOWN_DAYS = 7
const EXCLUDED_PATHS = ['/checkout', '/admin', '/cuenta', '/venta/', '/confirmacion', '/gracias', '/auth']

export default function WelcomePopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [codigo, setCodigo] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const shownRef = useRef(false)

  useEffect(() => {
    if (EXCLUDED_PATHS.some(p => pathname?.startsWith(p))) return
    if (shownRef.current) return

    // Anti-fatiga
    let blocked = false
    try {
      const state = localStorage.getItem(STORAGE_KEY)
      if (state === 'completed') blocked = true
      else if (state?.startsWith('dismissed_')) {
        const days = (Date.now() - new Date(state.slice(10)).getTime()) / 86_400_000
        if (days < DISMISS_COOLDOWN_DAYS) blocked = true
      }
    } catch { /* private browsing */ }
    if (blocked) return

    const delayTimer = setTimeout(() => {
      if (!shownRef.current) { shownRef.current = true; setVisible(true) }
    }, SHOW_AFTER_MS)

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shownRef.current) {
        shownRef.current = true; setVisible(true)
      }
    }
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mouseout', onMouseOut)
    }

    return () => {
      clearTimeout(delayTimer)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [pathname])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, `dismissed_${new Date().toISOString().slice(0, 10)}`)
    } catch { /* ignore */ }
  }

  const submit = async () => {
    const emailClean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailClean)) {
      toast.error('Ingresa un correo válido')
      return
    }
    setLoading(true)
    try {
      const r = await fetch('/api/welcome-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, source: 'popup' }),
      })
      const j = await r.json()
      if (!r.ok) { toast.error(j.error ?? 'No se pudo procesar'); return }
      setCodigo(j.codigo)
      try {
        localStorage.setItem(STORAGE_KEY, 'completed')
        localStorage.setItem('cg_last_email', emailClean)
      } catch { /* ignore */ }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (!codigo) return
    navigator.clipboard.writeText(codigo)
    setCopied(true)
    toast.success('Código copiado ✓')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={dismiss}>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}>

        <button onClick={dismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
          aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>

        {!codigo ? (
          <>
            <div className="bg-gradient-to-br from-[#0B3D66] to-[#0d4a7c] text-white px-6 pt-8 pb-6 text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-white/15 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight">
                Bienvenido a ContactGo®
              </h2>
              <p className="text-white/85 text-sm mt-1.5">
                Llévate <strong className="text-white">10% de descuento</strong> en tu primera compra
              </p>
            </div>

            <div className="p-6">
              <label htmlFor="cg-welcome-email" className="text-xs font-semibold text-gray-500 block mb-1.5">
                Tu correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input id="cg-welcome-email" type="email" autoComplete="email" autoFocus
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30 focus:border-[#0B3D66]"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit() }}
                  disabled={loading} />
              </div>
              <button onClick={submit} disabled={loading || !email}
                className="w-full mt-3 bg-[#0B3D66] hover:bg-[#0d4a7c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                {loading ? 'Enviando…' : 'Recibir mi 10% de descuento'}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                Solo te enviaremos ofertas y novedades de ContactGo®.<br />
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-1.5">
              ¡Listo! 🎉
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Te enviamos el código a tu correo. Aquí lo tienes también:
            </p>

            <div className="bg-gradient-to-br from-[#0B3D66] to-[#0d4a7c] rounded-xl p-5 mb-4">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1.5">Tu código</p>
              <p className="text-white text-2xl font-black font-mono tracking-wider">{codigo}</p>
              <p className="text-white/70 text-[10px] mt-2">Válido 60 días · 10% off · Un solo uso</p>
            </div>

            <div className="flex gap-2">
              <button onClick={copyCode}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-[#0B3D66] text-gray-700 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors">
                {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
              </button>
              <a href="/catalogo"
                className="flex-1 bg-[#0B3D66] hover:bg-[#0d4a7c] text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center transition-colors">
                Ver catálogo →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
