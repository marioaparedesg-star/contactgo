'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('cg-cookie-consent')) {
        setTimeout(() => setShow(true), 1500)
      }
    } catch {}
  }, [])

  const accept = (level: 'all' | 'essential') => {
    try {
      localStorage.setItem('cg-cookie-consent', JSON.stringify({ level, ts: Date.now() }))
      if (level === 'all' && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })
      }
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">Usamos cookies 🍪</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Usamos cookies para mejorar tu experiencia y medir el tráfico. Al continuar aceptas nuestra{' '}
            <Link href="/privacidad" className="text-primary-600 underline">política de privacidad</Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => accept('essential')}
            className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Solo esenciales
          </button>
          <button onClick={() => accept('all')}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors">
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
