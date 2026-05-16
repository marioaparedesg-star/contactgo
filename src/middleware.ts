import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block crawlers from protected paths
  const blocked = ['/admin', '/api/azul-test', '/api/carrito-abandonado', '/api/recompra/cron']
  const userAgent = req.headers.get('user-agent') ?? ''
  const isCrawler = /bot|crawler|spider|scraper/i.test(userAgent)

  if (isCrawler && blocked.some(p => pathname.startsWith(p))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Add security headers
  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', pathname.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow')

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
