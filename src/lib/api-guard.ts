/**
 * Utilidad de seguridad reutilizable para API routes
 * Rate limiting: in-memory por instancia (fallback)
 * Para rate limiting distribuido real, usar applyRateLimit() de rate-limit.ts
 */
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = ['https://contactgo.net', 'https://www.contactgo.net']

// Rate limiting en memoria (fallback por instancia)
const rateMap = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.reset) {
    rateMap.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function guardRequest(
  req: NextRequest,
  opts: { limitPerMin?: number; requireOrigin?: boolean } = {}
): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const origin = req.headers.get('origin') ?? ''
  const { limitPerMin = 30, requireOrigin = true } = opts

  if (requireOrigin && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }

  const path = new URL(req.url).pathname
  if (!rateLimit(`${ip}:${path}`, limitPerMin)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un momento.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  return null
}

export function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
}
