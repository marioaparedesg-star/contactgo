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
 *
 * BUG CRÍTICO CORREGIDO (2026-08-03): este componente se monta de nuevo
 * en cada navegación entre páginas (Footer.tsx se importa por página, no
 * vive en el layout raíz persistente). Cada montaje volvía a llamar
 * merchantwidget.start() — y el script de Google NO soporta llamarse dos
 * veces: lanza "Error: Store widget iFrame already exists, blocking a
 * second render" SIN CAPTURAR (handled:no en Sentry), lo que tumbaba TODA
 * la página con un 500 en cuanto el cliente navegaba a una segunda vista
 * (ej. catálogo → producto). Confirmado en Sentry (JAVASCRIPT-NEXTJS-N),
 * reportado por Mario como "error 500 en toda la web". Fix: (1) una
 * bandera a nivel de módulo asegura que start() se llame como máximo una
 * vez por carga de página completa, sin importar cuántas veces se monte
 * el componente; (2) try/catch como red de seguridad — si Google llegara
 * a lanzar un error de todos modos, nunca debe tumbar el árbol de React.
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

// Nivel de módulo (no de componente): sobrevive a que Footer se desmonte y
// remonte en cada navegación entre páginas, así que realmente garantiza
// "una sola vez por carga de página", que es lo que exige el script de Google.
let widgetYaIniciado = false

export default function GoogleSellerRatingBadge() {
  useEffect(() => {
    if (typeof window === 'undefined' || widgetYaIniciado) return

    const SCRIPT_ID = 'gcr-merchant-widget-js'

    const initWidget = () => {
      if (widgetYaIniciado) return
      if (typeof window.merchantwidget?.start !== 'function') return
      try {
        window.merchantwidget.start({
          merchant_id: 5786261428,
          position: 'LEFT_BOTTOM',
          // BottomNav.tsx mide 64px de alto (h-16) en TODAS las pantallas —
          // el margen debe superar eso para que la insignia no quede tapada.
          bottomMargin: 76,
          mobileBottomMargin: 76,
        })
        widgetYaIniciado = true
      } catch (e) {
        // Red de seguridad: un error de un script de terceros NUNCA debe
        // tumbar la página del cliente. Se marca como iniciado igual para
        // no reintentar en un loop si Google sigue fallando.
        console.error('[GoogleSellerRatingBadge] merchantwidget.start falló:', e)
        widgetYaIniciado = true
      }
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
