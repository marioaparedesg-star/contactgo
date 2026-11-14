import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const today = new Date()
  today.setHours(0,0,0,0)
  const [history, total, sent, errors, todayCount] = await Promise.all([
    sb.from('email_log').select('id,to_email,subject,template,order_id,status,resend_id,created_at').order('created_at', { ascending: false }).limit(150),
    sb.from('email_log').select('id', { count: 'exact', head: true }),
    sb.from('email_log').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
    sb.from('email_log').select('id', { count: 'exact', head: true }).in('status', ['error','failed']),
    sb.from('email_log').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
  ])
  if (history.error || total.error || sent.error || errors.error || todayCount.error) {
    return NextResponse.json({ error: 'No se pudo consultar el historial de correos' }, { status: 500 })
  }
  const rows = history.data ?? []
  const stats = { total: total.count ?? 0, enviados: sent.count ?? 0, errores: errors.count ?? 0, hoy: todayCount.count ?? 0 }
  return NextResponse.json({ ok: true, stats, logs: rows })
}
