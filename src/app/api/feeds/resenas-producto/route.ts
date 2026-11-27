// GET /api/feeds/resenas-producto — feed público para Google Merchant Center (solo reseñas verificadas).
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildReviewsFeed, type ResenaFeed, type ProductoFeed } from '@/lib/feeds/resenas-producto'

export const revalidate = 3600

export async function GET() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const [{ data: resenas, error: e1 }, { data: productos, error: e2 }] = await Promise.all([
    sb.from('reviews').select('id,product_id,nombre,rating,comentario,orden_id,aprobado,created_at').eq('aprobado', true).not('orden_id', 'is', null).limit(5000),
    sb.from('products').select('id,nombre,slug,sku,gtin').eq('activo', true).limit(5000),
  ])
  if (e1 || e2) {
    console.error('[feed resenas] error de consulta:', (e1 ?? e2)?.message)
    return new NextResponse('feed no disponible', { status: 503 })
  }
  const xml = buildReviewsFeed((resenas ?? []) as ResenaFeed[], (productos ?? []) as ProductoFeed[])
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' } })
}
