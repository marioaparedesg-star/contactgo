import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const start = Date.now()
  try {
    // Usar cliente directo sin cookies para el health check
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await sb.from('products').select('id').limit(1)
    if (error) throw error

    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - start,
      services: { supabase: 'ok' },
      version: 'ok'
    })
  } catch (error: any) {
    return Response.json({
      status: 'degraded',
      error: error.message,
      latency_ms: Date.now() - start
    }, { status: 503 })
  }
}
