import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await sb.from('email_log')
    .select('id,to_email,subject,template,order_id,status,resend_id,created_at')
    .order('created_at', { ascending: false }).limit(150)

  if (error) return NextResponse.json({ error: 'No se pudo consultar el historial de correos' }, { status: 500 })
  const rows = data ?? []
  const today = new Date()
  today.setHours(0,0,0,0)
  const todayRows = rows.filter((r:any) => new Date(r.created_at) >= today)
  const stats = {
    total: rows.length,
    enviados: rows.filter((r:any) => r.status === 'sent').length,
    errores: rows.filter((r:any) => r.status === 'error' || r.status === 'failed').length,
    hoy: todayRows.length,
  }
  return NextResponse.json({ ok: true, stats, logs: rows })
}
