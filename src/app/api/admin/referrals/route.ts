import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'

const db = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 30, requireOrigin: false })
  if (guardErr) return guardErr
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  try {
    const sb = db()
    const { data: referrals, error } = await sb.from('referrals')
      .select('id,referrer_user_id,referred_user_id,referral_code,status,friend_coupon_code,referrer_coupon_code,qualifying_order_id,created_at,rewarded_at')
      .order('created_at', { ascending: false })
    if (error) throw error

    const rows = referrals ?? []
    const userIds = [...new Set(rows.flatMap((r: any) => [r.referrer_user_id, r.referred_user_id]).filter(Boolean))]
    const orderIds = [...new Set(rows.map((r: any) => r.qualifying_order_id).filter(Boolean))]
    const couponCodes = [...new Set(rows.flatMap((r: any) => [r.friend_coupon_code, r.referrer_coupon_code]).filter(Boolean))]

    const [profilesRes, ordersRes, couponsRes] = await Promise.all([
      userIds.length ? sb.from('profiles').select('id,nombre,email,telefono').in('id', userIds) : Promise.resolve({ data: [], error: null }),
      orderIds.length ? sb.from('orders').select('id,numero_orden,estado,pago_estado,total,created_at,es_prueba').in('id', orderIds) : Promise.resolve({ data: [], error: null }),
      couponCodes.length ? sb.from('coupons').select('codigo,tipo,valor,activo,usos_actuales,uso_maximo,email_requerido,fecha_expira,valido_hasta').in('codigo', couponCodes) : Promise.resolve({ data: [], error: null }),
    ])
    if (profilesRes.error || ordersRes.error || couponsRes.error) throw profilesRes.error || ordersRes.error || couponsRes.error

    const profiles = new Map<string, any>((profilesRes.data ?? []).map((p: any) => [p.id, p] as [string, any]))
    const orders = new Map<string, any>((ordersRes.data ?? []).map((o: any) => [o.id, o] as [string, any]))
    const coupons = new Map<string, any>((couponsRes.data ?? []).map((c: any) => [c.codigo, c] as [string, any]))
    const enriched = rows.map((r: any) => ({
      ...r,
      inviter: profiles.get(r.referrer_user_id) ?? null,
      referred: profiles.get(r.referred_user_id) ?? null,
      friend_coupon: coupons.get(r.friend_coupon_code) ?? null,
      reward_coupon: coupons.get(r.referrer_coupon_code) ?? null,
      order: orders.get(r.qualifying_order_id) ?? null,
    }))

    return NextResponse.json({
      stats: {
        total: enriched.length,
        pending: enriched.filter((r: any) => r.status === 'pending').length,
        rewarded: enriched.filter((r: any) => r.status === 'rewarded').length,
        friendCouponsUsed: enriched.filter((r: any) => Number(r.friend_coupon?.usos_actuales ?? 0) > 0).length,
        rewardCouponsUsed: enriched.filter((r: any) => Number(r.reward_coupon?.usos_actuales ?? 0) > 0).length,
      },
      referrals: enriched,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error: any) {
    console.error('[admin/referrals] query failed:', error?.message)
    return NextResponse.json({ error: 'No se pudo cargar el reporte de referidos' }, { status: 500 })
  }
}
