'use client'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function ConsentMetrics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => {
      try {
        const value = JSON.parse(localStorage.getItem('cg-cookie-consent') || 'null')
        setEnabled(value?.level === 'all')
      } catch {
        setEnabled(false)
      }
    }
    sync()
    window.addEventListener('cg-consent-change', sync)
    return () => window.removeEventListener('cg-consent-change', sync)
  }, [])

  if (!enabled) return null
  return <><Analytics /><SpeedInsights /></>
}
