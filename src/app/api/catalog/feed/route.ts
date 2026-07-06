// ============================================================
// ContactGo — GET /api/catalog/feed
// Meta Commerce Manager product feed (CSV)
// Auto-syncs: Meta fetches this URL on schedule
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function escapeCSV(val: string | null | undefined): string {
  if (!val) return ''
  const s = val.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '')
  return `"${s}"`
}

function mapCondition(tipo: string): string {
  if (['solucion', 'gota'].includes(tipo)) return 'new'
  return 'new'
}

function mapCategory(tipo: string): string {
  switch (tipo) {
    case 'esferico':
    case 'torico':
    case 'multifocal':
    case 'color':
      return 'Health & Beauty > Personal Care > Vision Care > Contact Lenses'
    case 'solucion':
      return 'Health & Beauty > Personal Care > Vision Care > Contact Lens Care'
    case 'gota':
      return 'Health & Beauty > Personal Care > Vision Care > Eye Drops & Lubricants'
    default:
      return 'Health & Beauty > Personal Care > Vision Care'
  }
}

function mapAvailability(stock: number): string {
  if (stock > 5) return 'in stock'
  if (stock > 0) return 'limited availability'
  return 'out of stock'
}

export async function GET() {
  try {
    const sb = getSb()
    const { data: products, error } = await sb
      .from('products')
      .select('*')
      .eq('activo', true)
      .or('archivado.is.null,archivado.eq.false')
      .order('marca', { ascending: true })

    if (error || !products) {
      return new NextResponse('Error fetching products', { status: 500 })
    }

    const BASE = 'https://www.contactgo.net'

    // Meta Commerce Manager CSV headers
    const headers = [
      'id', 'title', 'description', 'availability', 'condition', 'price',
      'sale_price', 'link', 'image_link', 'brand', 'google_product_category',
      'fb_product_category', 'product_type', 'gtin', 'custom_label_0',
      'custom_label_1', 'custom_label_2'
    ]

    const rows = products.map(p => {
      const currentPrice = Number(p.precio)
      const oldPrice = p.precio_anterior ? Number(p.precio_anterior) : null
      
      // precio = what the customer pays (always)
      // precio_anterior = strikethrough only if HIGHER than precio (discount)
      let priceStr: string
      let salePriceStr: string
      
      if (oldPrice && oldPrice > currentPrice) {
        // Real discount: show old as price, current as sale_price
        priceStr = `${oldPrice.toFixed(2)} DOP`
        salePriceStr = `${currentPrice.toFixed(2)} DOP`
      } else {
        // No discount or price went up: just show current price
        priceStr = `${currentPrice.toFixed(2)} DOP`
        salePriceStr = ''
      }

      return [
        escapeCSV(p.id),
        escapeCSV(p.nombre),
        escapeCSV(p.descripcion?.slice(0, 5000)),
        mapAvailability(p.stock ?? 0),
        mapCondition(p.tipo),
        escapeCSV(priceStr),
        escapeCSV(salePriceStr),
        escapeCSV(`${BASE}/producto/${p.slug}`),
        escapeCSV(p.imagen_url),
        escapeCSV(p.marca),
        escapeCSV(mapCategory(p.tipo)),
        escapeCSV(mapCategory(p.tipo)),
        escapeCSV(p.tipo),
        escapeCSV(p.gtin ?? ''),
        escapeCSV(p.reemplazo ?? ''),       // custom_label_0: Diario/Quincenal/Mensual
        escapeCSV(p.material ?? ''),         // custom_label_1: Material
        escapeCSV(p.contenido ?? ''),        // custom_label_2: Contenido
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="contactgo-catalog.csv"',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err: any) {
    console.error('[Catalog Feed]', err.message)
    return new NextResponse('Error', { status: 500 })
  }
}
