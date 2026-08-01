// ============================================================
// ContactGo — GET /api/catalog/feed-x
// X (Twitter) Ads Shopping Manager product feed (CSV)
//
// X exige precios en USD (política de X Shopping, no acepta DOP ni
// otras monedas locales) — a diferencia de Meta Commerce Manager que
// sí acepta DOP directamente. Por eso este es un feed SEPARADO del
// feed principal (/api/catalog/feed), con los mismos productos pero
// precio y sale_price convertidos a dólares.
//
// Tasa de cambio: actualizar TASA_DOP_USD periódicamente (revisar
// tasa BCRD o mercado). Al momento de crear este feed: ~58.24 DOP = 1 USD.
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Tasa de cambio DOP → USD ────────────────────────────────────────────────
// Actualizar cada 1-2 meses o si el peso se mueve más de ~3%. Fuente:
// Banco Central RD (bancentral.gov.do) o mercado (~58-60 típico 2026).
const TASA_DOP_USD = 58.5

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

function mapCondition(_tipo: string): string {
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
    case 'gota':
      return 'Health & Beauty > Personal Care > Vision Care'
    default:
      return 'Health & Beauty > Personal Care > Vision Care'
  }
}

function mapFbCategoryId(tipo: string): string {
  switch (tipo) {
    case 'esferico':
    case 'torico':
    case 'multifocal':
    case 'color':
      return '2923' // Contact Lenses
    default:
      return '2919'
  }
}

function fixUppercaseTitle(title: string): string {
  if (title !== title.toUpperCase()) return title
  const knownBrandWords = new Set(['ACUVUE', 'AIR', 'OPTIX', 'MOIST', 'OASYS', 'HYDRACLEAR', 'ULTRA'])
  return title.split(' ').map(word => {
    const clean = word.replace(/[®\d]/g, '')
    if (knownBrandWords.has(clean)) return word
    if (clean.length <= 2) return word
    return word.charAt(0) + word.slice(1).toLowerCase()
  }).join(' ')
}

function mapAvailability(stock: number): string {
  if (stock > 5) return 'in stock'
  if (stock > 0) return 'limited availability'
  return 'out of stock'
}

// Convierte DOP a USD y redondea a 2 decimales
function dopToUsd(dop: number): number {
  return Math.round((dop / TASA_DOP_USD) * 100) / 100
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

    const headers = [
      'id', 'title', 'description', 'availability', 'condition', 'price',
      'sale_price', 'link', 'image_link', 'brand', 'google_product_category',
      'fb_product_category', 'product_type', 'gtin', 'custom_label_0',
      'custom_label_1', 'custom_label_2'
    ]

    const rows = products.map(p => {
      const currentPriceDop = Number(p.precio)
      const oldPriceDop = p.precio_anterior ? Number(p.precio_anterior) : null

      let priceStr: string
      let salePriceStr: string

      if (oldPriceDop && oldPriceDop > currentPriceDop) {
        priceStr = `${dopToUsd(oldPriceDop).toFixed(2)} USD`
        salePriceStr = `${dopToUsd(currentPriceDop).toFixed(2)} USD`
      } else {
        priceStr = `${dopToUsd(currentPriceDop).toFixed(2)} USD`
        salePriceStr = ''
      }

      return [
        escapeCSV(p.id),
        escapeCSV(fixUppercaseTitle(p.nombre)),
        escapeCSV(p.descripcion?.slice(0, 5000)),
        mapAvailability(p.stock ?? 0),
        mapCondition(p.tipo),
        escapeCSV(priceStr),
        escapeCSV(salePriceStr),
        escapeCSV(`${BASE}/producto/${p.slug}`),
        escapeCSV(p.imagen_url),
        escapeCSV(p.marca),
        escapeCSV(mapCategory(p.tipo)),
        escapeCSV(mapFbCategoryId(p.tipo)),
        escapeCSV(p.tipo),
        escapeCSV(p.gtin ?? ''),
        escapeCSV(p.reemplazo ?? ''),
        escapeCSV(p.material ?? ''),
        escapeCSV(p.contenido ?? ''),
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="contactgo-catalog-x.csv"',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err: any) {
    console.error('[Catalog Feed X]', err.message)
    return new NextResponse('Error', { status: 500 })
  }
}
