import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipos = searchParams.get('tipos')?.split(',') ?? ['solucion']
  const exclude = searchParams.get('exclude') ?? ''

  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('id, nombre, slug, precio, imagen_url, tipo')
    .in('tipo', tipos)
    .eq('activo', true)
    .gt('stock', 0)
    .neq('id', exclude)
    .order('nombre')
    .limit(4)

  return NextResponse.json({ products: data ?? [] })
}
