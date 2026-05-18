// Utilidad de seguridad reutilizable para todos los API routes
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = ['https://contactgo.net', 'https://www.contactgo.net']

// Rate limiting en memoria (Edge-compatible)
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

// Guard completo: origin + rate limit + devuelve ip
export function guardRequest(
  req: NextRequest,
  opts: { limitPerMin?: number; requireOrigin?: boolean } = {}
): { ok: true; ip: string } | { ok: false; response: NextResponse } {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const origin = req.headers.get('origin') ?? ''
  const { limitPerMin = 30, requireOrigin = true } = opts

  // Validar origin solo en producción con origin presente
  if (requireOrigin && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }
  }

  // Rate limit
  const path = new URL(req.url).pathname
  if (!rateLimit(`${ip}:${path}`, limitPerMin)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Too many requests. Intenta en un momento.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  return { ok: true, ip }
}
