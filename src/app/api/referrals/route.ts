import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })
export async function GET(req: NextRequest) {
 try {
  const token=req.headers.get('authorization')?.replace(/^Bearer\\s+/i,'')
  if(!token)return NextResponse.json({error:'Sesión requerida'},{status:401})
  const db=admin(); const auth=await db.auth.getUser(token); const user=auth.data.user
  if(auth.error||!user)return NextResponse.json({error:'Sesión inválida'},{status:401})
  const profile=await db.from('profiles').select('referral_code').eq('id',user.id).maybeSingle()
  let code=profile.data?.referral_code
  if(!code){code=createHash('sha256').update(user.id).digest('hex').slice(0,8).toUpperCase();await db.from('profiles').update({referral_code:code}).eq('id',user.id)}
  if(!code)return NextResponse.json({error:'No se pudo generar tu enlace'},{status:500})
  const results=await Promise.all([
   db.from('referrals').select('id,status,created_at,referrer_coupon_code').eq('referrer_user_id',user.id).order('created_at',{ascending:false}),
   db.from('referrals').select('friend_coupon_code').eq('referred_user_id',user.id).maybeSingle(),
   db.from('coupons').select('codigo,valor,fecha_expira').eq('email_requerido',(user.email||'').toLowerCase()).like('codigo','INVITA-%').eq('activo',true).lt('usos_actuales',1)
  ])
  const list=results[0].data||[]
  return NextResponse.json({referral_code:code,referred_count:list.length,pending_count:list.filter((x:any)=>x.status==='pending').length,rewarded_count:list.filter((x:any)=>x.status==='rewarded').length,rewards:list,friend_coupon_code:results[1].data?.friend_coupon_code||null,reward_coupons:results[2].data||[]},{headers:{'Cache-Control':'no-store'}})
 } catch(e:any){console.error('[api/referrals]',e?.message);return NextResponse.json({error:'No se pudo consultar el programa'},{status:500})}
}
