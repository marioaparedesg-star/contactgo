'use client'
/**
 * Google Customer Reviews Opt-In
 * Merchant ID: 5786261428
 * Implementación exacta según Google Merchant Center docs (junio 2026)
 * Usa window.gapi.surveyoptin.render — el método actual oficial de Google
 */
import { useEffect } from 'react'

interface Props {
  orderId:               string   // numero_orden real (CG-XXXXXXXX)
  email:                 string
  estimatedDeliveryDate: string   // YYYY-MM-DD
  gtins?:                string[] // GTINs opcionales de productos
}

declare global {
  interface Window {
    renderOptIn?: () => void
    gapi?: {
      load?: (lib: string, cb: () => void) => void
      surveyoptin?: {
        render?: (config: Record<string, unknown>) => void
      }
    }
  }
}

export default function GoogleCustomerReviewsOptIn({ orderId, email, estimatedDeliveryDate, gtins }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!email || !orderId) return

    // Deduplicar por orden en la sesión
    const dedupeKey = `gcr_optin_${orderId}`
    try {
      if (sessionStorage.getItem(dedupeKey)) return
      sessionStorage.setItem(dedupeKey, '1')
    } catch { /* Safari privado */ }

    const MERCHANT_ID = 5786261428  // número, no string
    const SCRIPT_ID   = 'gcr-platform-js'

    // Configuración exacta según Google Merchant Center
    const config: Record<string, unknown> = {
      merchant_id:             MERCHANT_ID,
      order_id:                orderId,
      email,
      delivery_country:        'DO',
      estimated_delivery_date: estimatedDeliveryDate,
      opt_in_style:            'CENTER_DIALOG',
    }
    if (gtins && gtins.length > 0) {
      config.products = gtins.map(g => ({ gtin: g }))
    }

    // Función que Google llama cuando el script carga (onload=renderOptIn)
    window.renderOptIn = function () {
      window.gapi?.load?.('surveyoptin', function () {
        window.gapi?.surveyoptin?.render?.(config)
      })
    }

    // Si el script ya está cargado, ejecutar directamente
    if (document.getElementById(SCRIPT_ID)) {
      window.renderOptIn?.()
      return
    }

    // Insertar script exactamente como lo pide Google:
    // <script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>
    const script    = document.createElement('script')
    script.id       = SCRIPT_ID
    script.src      = 'https://apis.google.com/js/platform.js?onload=renderOptIn'
    script.async    = true
    script.defer    = true
    document.head.appendChild(script)

  }, [orderId, email, estimatedDeliveryDate])  // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
