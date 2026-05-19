import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = ['https://contactgo.net', 'https://www.contactgo.net']

const rateMap = new Map<string, { count: number; reset: number }>()

function rateLimit(key: string, limit: number, windowMs = 60_000): boolean {
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const origin = req.headers.get('origin') ?? ''
  const userAgent = req.headers.get('user-agent') ?? ''

  // ── 1. /admin/login SIEMPRE público — sale ANTES de cualquier check ──
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return res
  }

  // ── 2. Bloquear crawlers en rutas privadas ──
  const isCrawler = /bot|crawler|spider|GPTBot|anthropic/i.test(userAgent)
  if (isCrawler && (pathname.startsWith('/admin') || pathname.startsWith('/api/azul'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── 3. APIs sensibles: validar origin + rate limit ──
  if (pathname.startsWith('/api/azul')) {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }
    if (!rateLimit(`azul:${ip}`, 30)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  // ── 4. Rate limiting en endpoints sensibles ──
  const rateLimits: Record<string, number> = {
    '/api/orders': 20,
    '/api/notify': 10,
    '/api/disclaimer': 5,
    '/api/recompra': 5,
    '/api/analizar-receta': 10,
    '/api/ocr-receta': 10,
  }

  for (const [path, limit] of Object.entries(rateLimits)) {
    if (pathname.startsWith(path)) {
      if (!rateLimit(`${ip}:${path}`, limit)) {
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
    '/admin/((?!login$|login/).*)',  // protege /admin/* EXCEPTO /admin/login
    '/api/:path*',
    '/checkout',
    '/cart',
    '/cuenta/:path*',
  ],
}
