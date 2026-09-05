import { guardRequest, getIP } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  // Seguridad: origin + rate limit
  const guardErr = guardRequest(req, { limitPerMin: 30 })
  if (guardErr) return guardErr
  const ip = getIP(req)


  const { searchParams } = new URL(req.url)
  const tipos = searchParams.get('tipos')?.split(',') ?? ['solucion']
  const exclude = searchParams.get('exclude') ?? ''
  const limit = Math.min(Number(searchParams.get('limit') ?? 4) || 4, 10)

  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('id, nombre, slug, precio, imagen_url, tipo')
    .in('tipo', tipos)
    .eq('activo', true)
    .gt('stock', 0)
    .neq('id', exclude)
    .order('nombre')
    .limit(10)

  // Cuando se piden soluciones, Mario pidió explícitamente que la sugerida
  // por defecto sea Opti-Free Puremoist (no Dream Eye, que antes salía
  // primero solo por orden alfabético — ambas cuestan lo mismo, RD$650).
  let products = data ?? []
  if (tipos.includes('solucion')) {
    products = [...products].sort((a, b) => {
      const aOpti = a.nombre.toLowerCase().includes('opti-free') ? 0 : 1
      const bOpti = b.nombre.toLowerCase().includes('opti-free') ? 0 : 1
      return aOpti - bOpti
    })
  }
  products = products.slice(0, limit)

  return NextResponse.json({ products })
}
