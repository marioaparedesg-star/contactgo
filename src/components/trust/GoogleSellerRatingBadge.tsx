'use client'
/**
 * Google Seller Rating Badge (Inline)
 * Merchant ID: 5786261428
 *
 * Usa la insignia INLINE para máxima compatibilidad y performance.
 * Carga el script de Google de forma diferida (afterInteractive).
 * El badge se posiciona inline dentro del Footer — no invasivo.
 */
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gapi?: { load?: (lib: string, cb: () => void) => void }
    _googCsa?: (...args: unknown[]) => void
  }
}

export default function GoogleSellerRatingBadge() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SCRIPT_ID = 'gcr-badge-js'

    const initBadge = () => {
      if (!containerRef.current) return
      // La API del badge de Google usa la tag g-seller-ratings
      // que se renderiza automáticamente cuando el script de platform.js carga
      // Solo necesitamos asegurar que el script esté presente
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script    = document.createElement('script')
      script.id       = SCRIPT_ID
      script.src      = 'https://apis.google.com/js/platform.js'
      script.async    = true
      script.defer    = true
      script.onload   = initBadge
      document.head.appendChild(script)
    } else {
      initBadge()
    }
  }, [])

  return (
    <div ref={containerRef} className="flex items-center justify-center">
      {/* Google Seller Rating Badge — renderizado por Google platform.js */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error custom element from Google */}
      <g-seller-ratings
        merchant_id="5786261428"
        position="INLINE"
      />
    </div>
  )
}
