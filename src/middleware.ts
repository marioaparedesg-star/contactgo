import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Solo la cuenta principal de Mario puede abrir el panel.
// Este UUID identifica la cuenta; no es una contraseña ni una clave de acceso.
const PRIMARY_ADMIN_USER_ID =
  process.env.CONTACTGO_PRIMARY_ADMIN_ID ?? '0ae25176-4cb9-45da-bd19-5b1b5806c4ef'

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const origin = req.headers.get('origin') ?? ''

  // Compatibilidad: conserva los enlaces /admin existentes, pero los redirige
  // a la ruta privada. La autenticación y validación de administrador siguen
  // ejecutándose en /M1Alexander; no se habilita el panel público antiguo.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const privateUrl = req.nextUrl.clone()
    privateUrl.pathname = '/M1Alexander' + pathname.slice('/admin'.length)
    const redirect = NextResponse.redirect(privateUrl, 307)
    redirect.headers.set('Cache-Control', 'no-store')
    redirect.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return redirect
  }

  // El formulario de acceso se sirve internamente desde /admin/login.
  if (pathname === '/M1Alexander/login' || pathname === '/M1Alexander/login/') {
    const res = NextResponse.rewrite(new URL('/admin/login', req.url))
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  // Verificación de servidor: token válido + rol admin + cuenta principal.
  // No basta con que exista una cookie: Supabase valida la sesión y el usuario.
  if (pathname === '/M1Alexander' || pathname.startsWith('/M1Alexander/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Si falta configuración crítica, cerrar el acceso en lugar de dejarlo abierto.
    if (!supabaseUrl || !supabaseKey || !PRIMARY_ADMIN_USER_ID) {
      return new NextResponse('Not Found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
      })
    }

    let supabaseResponse = NextResponse.next({ request: req })
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      const loginUrl = new URL('/M1Alexander/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      const redirect = NextResponse.redirect(loginUrl)

      // Un refresh token revocado/eliminado no se puede renovar. Limpiar
      // únicamente las cookies de sesión Supabase para evitar bucles de 400
      // y permitir que el administrador vuelva a iniciar sesión.
      const invalidRefreshToken =
        authError?.code === 'refresh_token_not_found' ||
        authError?.message?.toLowerCase().includes('invalid refresh token')

      if (invalidRefreshToken) {
        for (const cookie of req.cookies.getAll()) {
          if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
            redirect.cookies.delete(cookie.name)
          }
        }
      } else {
        supabaseResponse.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie))
      }

      redirect.headers.set('Cache-Control', 'no-store')
      redirect.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return redirect
    }

    // Exclusividad: bloquea las otras cuentas que también tengan role=admin.
    if (user.id !== PRIMARY_ADMIN_USER_ID) {
      return new NextResponse('Not Found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
      })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, activo')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || profile?.role !== 'admin' || profile?.activo !== true) {
      return new NextResponse('Not Found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
      })
    }

    const internalPath = '/admin' + pathname.slice('/M1Alexander'.length)
    const res = NextResponse.rewrite(new URL(internalPath, req.url), { request: req })
    supabaseResponse.cookies.getAll().forEach(cookie => res.cookies.set(cookie))
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  // ══════════════════════════════════════════════════════════
  // APIs de AZUL — se conserva la protección existente sin cambios.
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
  // Rate limiting en endpoints sensibles — sin cambios.
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

  const res = NextResponse.next()
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/M1Alexander',
    '/M1Alexander/:path*',
    '/api/:path*',
    '/checkout',
    '/cart',
    '/cuenta/:path*',
  ],
}
