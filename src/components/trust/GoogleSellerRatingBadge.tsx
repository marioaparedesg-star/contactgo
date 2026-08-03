'use client'
/**
 * Google Seller Rating Badge (Merchant Widget)
 * Merchant ID: 5786261428
 * Implementación exacta según Google Merchant Center docs (agosto 2026)
 * Usa merchantwidget.js — el método actual oficial
 *
 * BUG CORREGIDO (2026-08-02, 1ra pasada): "position" tenía el valor
 * inválido 'BOTTOM_RIGHT' → corregido a un valor real de la API.
 *
 * BUG CORREGIDO (2026-08-02, 2da pasada): con 'RIGHT_BOTTOM' la insignia
 * caía en la misma esquina que el botón flotante de WhatsApp
 * (WhatsAppButton.tsx, fixed bottom- y right- con z-50) — se tapaban.
 *
 * BUG CORREGIDO (2026-08-02, 3ra pasada): mover a 'LEFT_BOTTOM' no era
 * suficiente. BottomNav.tsx es una barra FIJA DE ANCHO COMPLETO de 64px
 * de alto (fixed bottom-0 left-0 right-0, h-16, z-40) presente en TODAS
 * las pantallas, no solo móvil — ocupa las dos esquinas inferiores. Sin
 * un bottomMargin explícito mayor a esos 64px, la insignia quedaba
 * debajo/tapada por esa barra sin importar el lado. Se sube el margen
 * inferior por encima de esos 64px, en desktop y mobile.
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
        position: 'LEFT_BOTTOM',
        // BottomNav.tsx mide 64px de alto (h-16) en TODAS las pantallas —
        // el margen debe superar eso para que la insignia no quede tapada.
        bottomMargin: 76,
        mobileBottomMargin: 76,
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
