import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting simple en memoria (Edge Runtime)
const rateMap = new Map<string, { count: number; reset: number }>()

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateMap.get(key)
  
  if (!entry || now > entry.reset) {
    rateMap.set(key, { count: 1, reset: now + windowMs })
    return true // permitir
  }
  
  if (entry.count >= limit) return false // bloquear
  
  entry.count++
  return true // permitir
}

export function middleware(req: NextRequest) {
  // Generar nonce para CSP más seguro
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  req.headers.set('x-nonce', nonce)
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const userAgent = req.headers.get('user-agent') ?? ''

  // ── Bloquear crawlers en rutas privadas ──
  const blocked = ['/admin', '/api/azul-test', '/api/carrito-abandonado', '/api/recompra']
  const isCrawler = /bot|crawler|spider|scraper|GPTBot|anthropic/i.test(userAgent)
  if (isCrawler && blocked.some(p => pathname.startsWith(p))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Rate limiting por IP en endpoints sensibles ──
  const rateLimitedPaths: Record<string, { limit: number; windowMs: number }> = {
    '/api/orders':    { limit: 20,  windowMs: 60_000 },  // 20 pedidos/min
    '/api/notify':    { limit: 10,  windowMs: 60_000 },  // 10 emails/min
    '/api/azul':      { limit: 30,  windowMs: 60_000 },  // 30 pagos/min
    '/api/suscripciones': { limit: 10, windowMs: 60_000 },
    '/api/recompra':  { limit: 5,   windowMs: 60_000 },
    '/api/whatsapp':  { limit: 20,  windowMs: 60_000 },
  }

  for (const [path, config] of Object.entries(rateLimitedPaths)) {
    if (pathname.startsWith(path)) {
      const key = `${ip}:${path}`
      if (!rateLimit(key, config.limit, config.windowMs)) {
        return NextResponse.json(
          { error: 'Too many requests. Intenta en un momento.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      break
    }
  }

  const res = NextResponse.next()
  res.headers.set('x-nonce', nonce)
  
  // ── X-Robots-Tag por ruta ──
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  
  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/checkout',
    '/cart',
    '/cuenta/:path*',
  ],
}
