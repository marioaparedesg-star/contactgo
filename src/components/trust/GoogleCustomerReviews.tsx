'use client'
/**
 * Google Customer Reviews Opt-In
 * Merchant ID: 5786261428
 * Solo se activa cuando pago_estado = pagado.
 * Script cargado dinámicamente, sin bloqueo de render.
 */
import { useEffect } from 'react'

interface Props {
  orderId:               string   // numero_orden real (CG-XXXXXXXX)
  email:                 string
  estimatedDeliveryDate: string   // YYYY-MM-DD
  gtins?:                string[] // GTINs opcionales de productos
}

declare global {
  interface Window { renderOptIn?: (config: Record<string, unknown>) => void }
}

export default function GoogleCustomerReviewsOptIn({ orderId, email, estimatedDeliveryDate, gtins }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!email || !orderId) return

    // Deduplicar por orden en la sesión
    const dedupeKey = `gcr_optin_${orderId}`
    if (sessionStorage.getItem(dedupeKey)) return
    sessionStorage.setItem(dedupeKey, '1')

    const MERCHANT_ID = '5786261428'
    const SCRIPT_ID   = 'gcr-platform-js'

    const renderOptIn = () => {
      if (typeof window.renderOptIn !== 'function') return
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
      window.renderOptIn(config)
    }

    if (document.getElementById(SCRIPT_ID)) {
      renderOptIn()
      return
    }

    const script    = document.createElement('script')
    script.id       = SCRIPT_ID
    script.src      = 'https://apis.google.com/js/platform.js'
    script.async    = true
    script.onload   = renderOptIn
    document.head.appendChild(script)
  }, [orderId, email, estimatedDeliveryDate])  // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
