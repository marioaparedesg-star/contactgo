'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Consent = { level: 'all' | 'essential'; ts: number }

function syncClarityConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  const w = window as any
  const consent = {
    ad_Storage: granted ? 'granted' : 'denied',
    analytics_Storage: granted ? 'granted' : 'denied',
  }

  // Queue consent before loading Clarity. Without consent, Clarity stays cookieless.
  if (!w.clarity) {
    const clarityFn: any = function (...args: any[]) {
      ;(clarityFn.q = clarityFn.q || []).push(args)
    }
    w.clarity = clarityFn
  }
  w.clarity('consentv2', consent)

  if (!document.getElementById('cg-clarity-script')) {
    const script = document.createElement('script')
    script.id = 'cg-clarity-script'
    script.async = true
    script.src = 'https://www.clarity.ms/tag/wslp0l9vex'
    document.head.appendChild(script)
  }
}

function loadOptionalVendors() {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.__cgOptionalVendorsLoaded) {
    syncClarityConsent(true)
    return
  }
  w.__cgOptionalVendorsLoaded = true
  syncClarityConsent(true)

  w.dataLayer = w.dataLayer || []
  w.gtag = w.gtag || function() { w.dataLayer.push(arguments) }
  w.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'granted',
    ad_user_data: 'granted', ad_personalization: 'granted',
    functionality_storage: 'granted', personalization_storage: 'granted',
    security_storage: 'granted',
  })
  w.gtag('js', new Date())
  w.gtag('config', 'AW-830060688')
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const googleAds = document.createElement('script')
  googleAds.async = true
  googleAds.src = 'https://www.googletagmanager.com/gtag/js?id=AW-830060688'
  document.head.appendChild(googleAds)

  const gtm = document.createElement('script')
  gtm.async = true
  gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-M9GZGJJQ'
  document.head.appendChild(gtm)

  const n: any = w.fbq || function(this: any) {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  }
  if (!w.fbq) {
    if (!w._fbq) w._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    w.fbq = n
    const pixel = document.createElement('script')
    pixel.async = true
    pixel.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(pixel)
  }
  w.fbq('init', '1516674003159165')
  w.fbq('track', 'PageView')
}
export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reopen = () => setShow(true)
    window.addEventListener('cg-open-cookie-preferences', reopen)
    return () => window.removeEventListener('cg-open-cookie-preferences', reopen)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cg-cookie-consent')
      if (!stored) {
        syncClarityConsent(false)
        const timer = window.setTimeout(() => setShow(true), 1500)
        return () => window.clearTimeout(timer)
      }
      const consent = JSON.parse(stored) as Consent
      if (consent.level === 'all') loadOptionalVendors()
      else syncClarityConsent(false)
    } catch {
      setShow(true)
    }
  }, [])

  const accept = (level: Consent['level']) => {
    let withdrawing = false
    try {
      const previous = JSON.parse(localStorage.getItem('cg-cookie-consent') || 'null')
      withdrawing = previous?.level === 'all' && level === 'essential'
      localStorage.setItem('cg-cookie-consent', JSON.stringify({ level, ts: Date.now() }))
      if (level === 'all') loadOptionalVendors()
      else syncClarityConsent(false)
    } catch {}
    window.dispatchEvent(new Event('cg-consent-change'))
    if (withdrawing) { window.location.reload(); return }
    setShow(false)
  }

  if (!show) return null

  return (
    <div role="dialog" aria-label="Preferencias de cookies" aria-live="polite" className="fixed bottom-20 md:bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">Preferencias de cookies</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Usamos cookies y tecnologías similares. Las herramientas de analítica y publicidad se activan solo si las aceptas. Consulta nuestra{' '}
            <Link href="/privacidad" className="text-primary-600 underline">política de privacidad</Link> y nuestro{' '}
            <Link href="/aviso-legal" className="text-primary-600 underline">aviso legal</Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => accept('essential')} className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Solo esenciales
          </button>
          <button onClick={() => accept('all')} className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors">
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
