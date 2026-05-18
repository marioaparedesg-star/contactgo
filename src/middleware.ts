import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting simple en memoria (Edge Runtime)
const rateMap = new Map<string, { count: number; reset: number }>()

function rateLimit(key: string, limit: number, windowMs: number): boolean {
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

// Orígenes permitidos
const ALLOWED_ORIGINS = ['https://contactgo.net', 'https://www.contactgo.net']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const userAgent = req.headers.get('user-agent') ?? ''
  const origin = req.headers.get('origin') ?? ''

  // ── 1. /admin/login es siempre pública — NO redirigir NUNCA ──
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const res = NextResponse.next()
    // Anti-cache para que Cloudflare no cachee este path
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.headers.set('X-Admin-Login', 'public')
    return res
  }

  // ── 2. Bloquear crawlers en rutas privadas ──
  const blocked = ['/admin', '/api/azul-test', '/api/carrito-abandonado', '/api/recompra']
  const isCrawler = /bot|crawler|spider|scraper|GPTBot|anthropic/i.test(userAgent)
  if (isCrawler && blocked.some(p => pathname.startsWith(p))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── 3. APIs de pago: validar origin ──
  if (pathname.startsWith('/api/azul')) {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }
    if (!rateLimit(`azul:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  // ── 4. Rate limiting en endpoints sensibles ──
  const rateLimitedPaths: Record<string, { limit: number; windowMs: number }> = {
    '/api/orders':          { limit: 20, windowMs: 60_000 },
    '/api/notify':          { limit: 10, windowMs: 60_000 },
    '/api/disclaimer':      { limit: 5,  windowMs: 60_000 },
    '/api/recompra':        { limit: 5,  windowMs: 60_000 },
    '/api/whatsapp':        { limit: 20, windowMs: 60_000 },
    '/api/analizar-receta': { limit: 10, windowMs: 60_000 },
    '/api/ocr-receta':      { limit: 10, windowMs: 60_000 },
  }

  for (const [path, config] of Object.entries(rateLimitedPaths)) {
    if (pathname.startsWith(path)) {
      if (!rateLimit(`${ip}:${path}`, config.limit, config.windowMs)) {
        return NextResponse.json(
          { error: 'Too many requests. Intenta en un momento.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      break
    }
  }

  const res = NextResponse.next()
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
