export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }
const BASE = 'https://www.contactgo.net'

export async function GET() {
  const { data: products } = await getSb()
    .from('products').select('*').eq('activo', true).gt('stock', 0).order('nombre')

  const items = (products ?? []).map(p => {
    // Sanitizar slug: remover caracteres no-ASCII que causan 404 en Next.js
    const rawSlug = p.slug ?? p.id
    const slug = rawSlug
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar diacríticos
      .replace(/[^a-z0-9\-]/gi, '-')                    // no-ASCII → guión
      .replace(/-+/g, '-')                               // guiones dobles → uno
    const tipo = p.tipo === 'esferico' ? 'Lentes Esféricos' : p.tipo === 'torico' ? 'Lentes Tóricos' :
                 p.tipo === 'multifocal' ? 'Lentes Multifocales' : p.tipo === 'color' ? 'Lentes de Color' :
                 p.tipo === 'solucion' ? 'Solución para Lentes' : 'Lentes de Contacto'
    const desc = (p.descripcion ?? `${tipo} ${p.marca} en República Dominicana.`).slice(0, 500)
    const gtin = p.ean ?? p.upc ?? ''
    const mpn = p.sku ?? `CG-${p.id?.slice(0,8)}`
    return `<item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.nombre} — Lentes de Contacto RD]]></g:title>
      <g:description><![CDATA[${desc}]]></g:description>
      <g:link>${BASE}/producto/${slug}</g:link>
      <g:image_link>${p.imagen_url ?? BASE + '/icon-512.png'}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${(p.stock ?? 0) > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${p.precio}.00 DOP</g:price>
      <g:brand><![CDATA[${p.marca}]]></g:brand>
      <g:mpn>${mpn}</g:mpn>
      ${gtin ? `<g:gtin>${gtin}</g:gtin>` : '<g:identifier_exists>false</g:identifier_exists>'}
      <g:google_product_category>2271</g:google_product_category>
      <g:product_type><![CDATA[Salud > Óptica > ${tipo}]]></g:product_type>
      <g:shipping>
        <g:country>DO</g:country>
        <g:service>Envío estándar</g:service>
        <g:price>200.00 DOP</g:price>
        <g:min_handling_time>0</g:min_handling_time>
        <g:max_handling_time>1</g:max_handling_time>
        <g:min_transit_time>1</g:min_transit_time>
        <g:max_transit_time>2</g:max_transit_time>
      </g:shipping>
      <g:return_policy_label>standard-return-policy</g:return_policy_label>
      <g:custom_label_0>${p.tipo ?? 'lente'}</g:custom_label_0>
      <g:custom_label_1>${p.marca}</g:custom_label_1>
      ${p.tipo === 'color' && p.colores_disponibles?.length ? `<g:color><![CDATA[${
        // Google requiere colores base estándar — máximo 40 chars, máximo 3 colores separados por /
        (p.colores_disponibles as string[])
          .map((c: string) => c.replace('Brilliant ', '').replace('Gemstone ', '').replace('Sterling ', '').replace('Pure ', '').replace('True ', ''))
          .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i) // deduplicar
          .slice(0, 3)
          .join('/')
      }]]></g:color>` : ''}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ContactGo — Lentes de Contacto RD</title>
    <g:merchant_id>5786261428</g:merchant_id>
    <link>${BASE}</link>
    <description>Catálogo de lentes de contacto en República Dominicana</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
}
