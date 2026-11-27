// Feed de reseñas de producto para Google Merchant Center.
// SOLO incluye reseñas aprobadas y vinculadas a un pedido real (verificables).
// Función pura: no consulta la base.
export type ResenaFeed = {
  id: string; product_id: string | null; nombre: string | null; rating: number | null
  comentario: string | null; orden_id: string | null; aprobado: boolean | null; created_at: string
}
export type ProductoFeed = { id: string; nombre: string; slug: string; sku?: string | null; gtin?: string | null }

// Identificador que Merchant Center puede emparejar: GTIN primero, SKU después. Sin ninguno → null (no se envía).
export function identificadorMerchant(p: ProductoFeed): { tipo: 'gtin' | 'sku'; valor: string } | null {
  const gtin = (p.gtin ?? '').replace(/\D/g, '')
  if (gtin.length >= 8) return { tipo: 'gtin', valor: gtin }
  const sku = (p.sku ?? '').trim()
  if (sku) return { tipo: 'sku', valor: sku }
  return null
}

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' } as Record<string, string>)[c])
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

export function resenasVerificables(resenas: ResenaFeed[], productos: ProductoFeed[]) {
  const porId = new Map(productos.map(p => [p.id, p]))
  return resenas.filter(r =>
    r.aprobado === true &&
    !!r.orden_id &&
    !!r.product_id && porId.has(r.product_id) &&
    identificadorMerchant(porId.get(r.product_id)!) !== null &&
    typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 &&
    (r.comentario ?? '').trim().length > 0
  )
}

export function buildReviewsFeed(resenas: ResenaFeed[], productos: ProductoFeed[], ahora = new Date()): string {
  const validas = resenasVerificables(resenas, productos)
  const porId = new Map(productos.map(p => [p.id, p]))
  const items = validas.map(r => {
    const p = porId.get(r.product_id!)!
    return `    <review>
      <review_id>${esc(r.id)}</review_id>
      <reviewer><name>${esc((r.nombre ?? 'Cliente').slice(0, 60))}</name></reviewer>
      <review_timestamp>${esc(new Date(r.created_at).toISOString())}</review_timestamp>
      <content>${esc((r.comentario ?? '').slice(0, 3000))}</content>
      <review_url type="group">${esc(`${SITE}/producto/${p.slug}`)}</review_url>
      <ratings><overall min="1" max="5">${r.rating}</overall></ratings>
      <products><product><product_ids>${(() => { const id = identificadorMerchant(p)!; return id.tipo === 'gtin' ? `<gtins><gtin>${esc(id.valor)}</gtin></gtins>` : `<skus><sku>${esc(id.valor)}</sku></skus>` })()}</product_ids></product></products>
    </review>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:vc="http://www.w3.org/2007/XMLSchema-versioning" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <version>2.0</version>
  <publisher><name>ContactGo</name><favicon>${esc(`${SITE}/favicon-32x32.png`)}</favicon></publisher>
  <reviews>
${items}
  </reviews>
  <generado>${esc(ahora.toISOString())}</generado>
</feed>
`
}
