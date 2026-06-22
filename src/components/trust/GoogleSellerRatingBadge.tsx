'use client'
/**
 * Google Seller Rating Badge (Merchant Widget)
 * Merchant ID: 5786261428
 * Implementación exacta según Google Merchant Center docs (junio 2026)
 * Usa merchantwidget.js — el método actual oficial
 */
import { useEffect } from 'react'

declare global {
  interface Window {
    merchantWidgetScript?: HTMLScriptElement & {
      addEventListener: (event: string, cb: () => void) => void
    }
    merchantwidget?: {
      start: (config: Record<string, unknown>) => void
    }
  }
}

export default function GoogleSellerRatingBadge() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SCRIPT_ID = 'gcr-merchant-widget-js'

    const initWidget = () => {
      if (typeof window.merchantwidget?.start !== 'function') return
      window.merchantwidget.start({
        merchant_id: 5786261428,
        position: 'BOTTOM_RIGHT',
      })
    }

    if (document.getElementById(SCRIPT_ID)) {
      initWidget()
      return
    }

    // Insertar script exactamente como lo pide Google:
    // <script id="merchantWidgetScript" src="https://www.gstatic.com/shopping/merchant/merchantwidget.js" defer></script>
    const script    = document.createElement('script')
    script.id       = SCRIPT_ID
    script.src      = 'https://www.gstatic.com/shopping/merchant/merchantwidget.js'
    script.defer    = true
    script.addEventListener('load', initWidget)
    document.head.appendChild(script)
  }, [])

  return null  // El widget se renderiza directamente por Google, no necesita contenedor
}
