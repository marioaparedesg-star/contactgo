'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    clarity?: (...args: any[]) => void
  }
}

// Clarity keeps one script instance in the Next.js App Router.
// Emit an explicit custom event on each client-side route so visits
// can be identified even when the root layout does not reload.
export default function ClarityRouteTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    const trackRoute = () => {
      if (!pathname || typeof window.clarity !== 'function') return
      if (lastTrackedPath.current === pathname) return

      window.clarity('set', 'page_path', pathname)
      window.clarity('event', 'route_view')
      lastTrackedPath.current = pathname
    }

    trackRoute()
    window.addEventListener('cg-clarity-consent-synced', trackRoute)
    return () => window.removeEventListener('cg-clarity-consent-synced', trackRoute)
  }, [pathname])

  return null
}
