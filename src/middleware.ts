import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ⚠️ CRÍTICO-4: Este rate limiting in-memory NO funciona en serverless
// Cada invocación de Vercel es una instancia aislada — rateMap se resetea en cada cold start
// SOLUCIÓN REAL: Configurar Cloudflare Rate Limiting Rules en el dashboard:
//   /api/orders       → 20 req/min por IP
//   /api/validate-coupon → 30 req/min por IP
//   /api/azul/*       → 30 req/min por IP
//   /api/notify       → 10 req/min por IP
// Este código sirve como DOCUMENTACIÓN de los límites intendidos, no como protección real
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

const ALLOWED_ORIGINS = ['https://www.contactgo.net', 'https://www.contactgo.net']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const origin = req.headers.get('origin') ?? ''

  // ══════════════════════════════════════════════════════════
  // 1. /admin/login — SIEMPRE PÚBLICO, sale inmediatamente
  // ══════════════════════════════════════════════════════════
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache')
    return res
  }

  // ══════════════════════════════════════════════════════════
  // 2. /admin/* — verificar cookie de sesión de Supabase
  //    Si no hay cookie de auth → redirect al login (server-side)
  // ══════════════════════════════════════════════════════════
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/admin/login')) {
    // Supabase SSR guarda la sesión en una cookie con este patrón
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const projectRef  = supabaseUrl.replace('https://', '').split('.')[0] // ej: atendbjolicwcsqfyiyh
    // @supabase/ssr 0.4.x puede guardar la sesión como cookie única (key)
    // o como chunks (key.0, key.1…) cuando el valor supera 3180 bytes
    const cookieBase   = `sb-${projectRef}-auth-token`
    const authCookie   = req.cookies.get(cookieBase)          // sin chunks
      ?? req.cookies.get(`${cookieBase}.0`)                   // primer chunk
      ?? req.cookies.get('sb-access-token')
      ?? req.cookies.get('supabase-auth-token')

    // @supabase/ssr v0.4 almacena la sesión como JSON en texto plano (no JWT puro)
    // posiblemente dividido en chunks (.0, .1…). Intentar parsear aquí es frágil.
    // El admin layout ya valida con sb.auth.getUser() — aquí solo bloqueamos
    // requests sin cookie alguna (visitantes no autenticados).
    const cookieValue = authCookie?.value ?? ''
    if (!cookieValue) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ══════════════════════════════════════════════════════════
  // 3. APIs de AZUL — origin check
  // ══════════════════════════════════════════════════════════
  if (pathname.startsWith('/api/azul')) {
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }
    if (!rateLimit(`azul:${ip}`, 30)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  // ══════════════════════════════════════════════════════════
  // 4. Rate limiting en endpoints sensibles
  // ══════════════════════════════════════════════════════════
  const rateLimits: Record<string, number> = {
    '/api/orders': 20,
    '/api/notify': 10,
    '/api/disclaimer': 5,
    '/api/recompra': 5,
    '/api/analizar-receta': 10,
    '/api/ocr-receta': 10,
    '/api/validate-coupon': 20,
  }
  for (const [path, limit] of Object.entries(rateLimits)) {
    if (pathname.startsWith(path)) {
      if (!rateLimit(`${ip}:${path}`, limit)) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
      break
    }
  }

  // ══════════════════════════════════════════════════════════
  // 5. noindex headers en rutas privadas
  // ══════════════════════════════════════════════════════════
  const res = NextResponse.next()
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  matcher: [
    // Protege /admin exacto Y /admin/* excluyendo /admin/login
    '/admin',
    '/admin/((?!login(?:/|$)).*)',
    '/api/:path*',
    '/checkout',
    '/cart',
    '/cuenta/:path*',
  ],
}
