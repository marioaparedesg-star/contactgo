import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CAT = {
  gota:    '4758',
  solucion:'2592',
  default: '491',
}

function esc(s = '') {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

export async function GET() {
  const sb = createServerSupabaseClient()
  const { data: products, error } = await sb
    .from('products')
    .select('id, nombre, slug, tipo, marca, fabricante_nombre, precio, descripcion, imagen_url, gtin, upc, sku, stock')
    .eq('activo', true)
    .order('tipo')

  if (error || !products) return new NextResponse('Error', { status: 500 })

  const BASE = 'https://www.contactgo.net'

  const items = products.map(p => {
    const cat   = CAT[p.tipo as keyof typeof CAT] ?? CAT.default
    const stock = (p.stock ?? 0) > 0 ? 'in stock' : 'out of stock'
    const price = `${parseFloat(p.precio || '0').toFixed(2)} DOP`
    const desc  = esc((p.descripcion || p.nombre).substring(0, 5000))
    const img   = p.imagen_url || `${BASE}/og-image.png`
    const brand = esc(p.marca || p.fabricante_nombre || 'ContactGo')

    const gtinLine = p.gtin
      ? `\n      <g:gtin>${esc(p.gtin)}</g:gtin>`
      : `\n      <g:identifier_exists>no</g:identifier_exists>`

    const mpnLine = p.sku ? `\n      <g:mpn>${esc(p.sku)}</g:mpn>` : ''

    return `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.nombre)}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${BASE}/producto/${esc(p.slug)}</g:link>
      <g:image_link>${esc(img)}</g:image_link>
      <g:availability>${stock}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>${brand}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${cat}</g:google_product_category>
      <g:product_type>${esc(p.tipo)}</g:product_type>${gtinLine}${mpnLine}
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ContactGo — Lentes de Contacto República Dominicana</title>
    <link>${BASE}</link>
    <description>Catálogo oficial de lentes de contacto y productos ópticos ContactGo</description>${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
