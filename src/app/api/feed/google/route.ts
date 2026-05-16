import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const BASE = 'https://contactgo.net'

export async function GET() {
  const { data: products } = await sb
    .from('products').select('*').eq('activo', true).gt('stock', 0).order('nombre')

  const items = (products ?? []).map(p => {
    const slug = p.slug ?? p.id
    const tipo = p.tipo === 'esferico' ? 'Lentes Esféricos' : p.tipo === 'torico' ? 'Lentes Tóricos' :
                 p.tipo === 'multifocal' ? 'Lentes Multifocales' : p.tipo === 'color' ? 'Lentes de Color' :
                 p.tipo === 'solucion' ? 'Solución para Lentes' : 'Lentes de Contacto'
    const desc = (p.descripcion ?? `${tipo} ${p.marca} en República Dominicana.`).slice(0, 500)
    return `<item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.nombre}]]></g:title>
      <g:description><![CDATA[${desc}]]></g:description>
      <g:link>${BASE}/producto/${slug}</g:link>
      <g:image_link>${p.imagen_url ?? BASE + '/icon-512.png'}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.precio} DOP</g:price>
      <g:brand><![CDATA[${p.marca}]]></g:brand>
      <g:google_product_category>2271</g:google_product_category>
      <g:shipping><g:country>DO</g:country><g:price>0 DOP</g:price></g:shipping>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ContactGo — Lentes de Contacto RD</title>
    <link>${BASE}</link>
    <description>Catálogo de lentes de contacto en República Dominicana</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
