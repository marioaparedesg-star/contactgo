import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const start = Date.now()
  try {
    const sb = createServerSupabaseClient()
    const { error } = await sb.from('products').select('id').limit(1)
    if (error) throw error
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - start,
      services: { supabase: 'ok' },
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'
    })
  } catch (error: any) {
    return Response.json({
      status: 'degraded',
      error: error.message,
      latency_ms: Date.now() - start
    }, { status: 503 })
  }
}
