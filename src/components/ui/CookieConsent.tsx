'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

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
  w.__cgClarityConsentSynced = true
  window.dispatchEvent(new Event('cg-clarity-consent-synced'))

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
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    const reopen = () => { setMinimized(false); setShow(true) }
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

  if (!show) return minimized ? (
    <button type="button" onClick={() => { setMinimized(false); setShow(true) }} aria-label="Abrir preferencias de cookies" className="fixed bottom-20 right-3 md:bottom-4 z-[60] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg transition hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
      <Cookie className="h-4 w-4" aria-hidden="true" /> Preferencias de cookies
    </button>
  ) : null

  return (
    <div role="dialog" aria-label="Preferencias de cookies" aria-live="polite" className="fixed inset-x-3 bottom-20 md:bottom-4 z-[60]">
      <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-[0_12px_40px_rgba(15,35,65,0.18)] sm:flex-row sm:items-center sm:gap-4 sm:px-4">
        <button type="button" onClick={() => { setShow(false); setMinimized(true) }} aria-label="Minimizar preferencias de cookies" className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:static sm:order-3 sm:shrink-0">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1 pr-8 sm:pr-0">
          <p className="mb-0.5 text-sm font-bold text-slate-900">Preferencias de cookies</p>
          <p className="text-xs leading-relaxed text-slate-600">
            Usamos cookies y tecnologías similares. Las herramientas de analítica y publicidad se activan solo si las aceptas. Consulta nuestra{' '}
            <Link href="/privacidad" className="text-primary-600 underline">política de privacidad</Link> y nuestro{' '}
            <Link href="/aviso-legal" className="text-primary-600 underline">aviso legal</Link>.
          </p>
        </div>
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto sm:order-2">
          <button onClick={() => accept('essential')} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none">
            Solo esenciales
          </button>
          <button onClick={() => accept('all')} className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-700 sm:flex-none">
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
