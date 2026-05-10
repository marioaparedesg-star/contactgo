// API: Meta Product Catalog Feed (XML)
// URL: https://contactgo.net/api/meta-catalog
// Formato: RSS/XML compatible con Meta Commerce Manager
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TIPO_LABEL: Record<string, string> = {
  esferico:   'Lentes de Contacto Esféricos',
  torico:     'Lentes de Contacto Tóricos',
  multifocal: 'Lentes de Contacto Multifocales',
  color:      'Lentes de Contacto de Color',
  solucion:   'Solución para Lentes de Contacto',
  gota:       'Gotas Lubricantes Oculares',
}

const CONDITION = 'new'
const BRAND = 'ContactGo'
const CURRENCY = 'DOP'
const BASE = 'https://contactgo.net'

export async function GET() {
  const { data: products } = await sb
    .from('products')
    .select('id, nombre, descripcion, precio, imagen_url, slug, tipo, marca, stock, activo')
    .eq('activo', true)
    .gt('stock', 0)
    .order('tipo')

  if (!products) {
    return new NextResponse('Error loading products', { status: 500 })
  }

  const items = products.map(p => {
    const url        = `${BASE}/producto/${p.slug || p.id}`
    const imageUrl   = p.imagen_url ?? `${BASE}/icon-512.png`
    const precio     = Number(p.precio ?? 0).toFixed(2)
    const categoria  = TIPO_LABEL[p.tipo ?? ''] ?? 'Lentes de Contacto'
    const desc       = p.descripcion
      ? p.descripcion.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').slice(0, 500)
      : `${p.nombre} — disponible en ContactGo República Dominicana con entrega a domicilio.`
    const nombre     = (p.nombre ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    const marca      = (p.marca ?? BRAND).replace(/&/g,'&amp;')

    return `    <item>
      <g:id>${p.id}</g:id>
      <g:title>${nombre}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${url}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>${CONDITION}</g:condition>
      <g:availability>${p.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${precio} ${CURRENCY}</g:price>
      <g:brand>${marca}</g:brand>
      <g:google_product_category>2271</g:google_product_category>
      <g:product_type>${categoria}</g:product_type>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>DO</g:country>
        <g:price>200 ${CURRENCY}</g:price>
      </g:shipping>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ContactGo — Lentes de Contacto República Dominicana</title>
    <link>${BASE}</link>
    <description>Catálogo de lentes de contacto, soluciones y gotas lubricantes disponibles en ContactGo RD.</description>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
