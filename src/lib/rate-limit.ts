/**
 * Rate limiting distribuido — funciona en Vercel Edge/Serverless
 *
 * Strategy: Si Upstash Redis está configurado → usa rate limiting real distribuido.
 * Fallback: Si no hay Redis configurado → usa límite en memoria por instancia
 * (acepta más requests que el límite real, pero no crashea).
 *
 * Para activar: agregar UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Vercel.
 * Obtener gratis en: upstash.com → New Database → REST
 */

import { NextRequest, NextResponse } from 'next/server'

// ── In-memory fallback (per-instance, no distribuido) ──────────────────────
const memMap = new Map<string, { count: number; reset: number }>()

function memRateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = memMap.get(key)
  if (!entry || now > entry.reset) {
    memMap.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// ── Upstash Redis (distribuido, compartido entre instancias) ───────────────
let Ratelimit: any = null
let redis: any = null

async function getUpstash() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (redis) return { Ratelimit, redis }
  try {
    const { Ratelimit: RL } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    Ratelimit = RL
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    return { Ratelimit, redis }
  } catch {
    return null
  }
}

/**
 * Aplica rate limiting distribuido si Upstash está configurado,
 * o in-memory como fallback.
 * Devuelve NextResponse de error si excede el límite, null si está OK.
 */
export async function applyRateLimit(
  req: NextRequest,
  opts: {
    key?: string         // Identificador del límite (default: path)
    limit?: number       // Requests permitidos por ventana (default: 30)
    windowSecs?: number  // Ventana en segundos (default: 60)
  } = {}
): Promise<NextResponse | null> {
  const { limit = 30, windowSecs = 60 } = opts
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const path = new URL(req.url).pathname
  const identifier = opts.key ?? `${ip}:${path}`

  // Intenta Upstash Redis
  const upstash = await getUpstash()
  if (upstash) {
    try {
      const rl = new upstash.Ratelimit({
        redis: upstash.redis,
        limiter: upstash.Ratelimit.slidingWindow(limit, `${windowSecs} s`),
        prefix: 'cg:rl',
      })
      const { success, remaining } = await rl.limit(identifier)
      if (!success) {
        return NextResponse.json(
          { error: 'Demasiadas solicitudes. Intenta en un momento.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(windowSecs),
              'X-RateLimit-Remaining': '0',
            },
          }
        )
      }
      // Adjuntar remaining para headers informativos
      void remaining
    } catch {
      // Redis error → fallback silencioso a in-memory
    }
  }

  // Fallback: in-memory
  const allowed = memRateLimit(identifier, limit, windowSecs * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(windowSecs) } }
    )
  }

  return null
}

/** Versión síncrona simple (solo in-memory) — para middleware Edge */
export function syncRateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  return memRateLimit(key, limit, windowMs)
}
