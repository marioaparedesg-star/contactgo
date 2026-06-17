import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEntrega } from '@/lib/delivery-times'
import ProductoClient from './ProductoClient'
export const revalidate = 300

// ═══════════════════════════════════════════════════════════════════
// ARQUITECTURA: Separación definitiva de responsabilidades
//
//  products.*_disponibles  → parámetros OFICIALES del fabricante
//                            Siempre completos. Nunca truncados.
//                            Son la fuente de verdad para los selectores.
//
//  product_inventory       → stock por combinación específica (logística)
//                            Solo responde: ¿hay unidades de esta combo?
//                            NUNCA determina qué opciones mostrar.
//
//  Selectores: siempre muestran el rango oficial completo del producto.
//  Botón "Comprar": desactivado solo si la combinación seleccionada
//                   no tiene stock en ese momento.
//
//  Errores eliminados:
//   - filter(Boolean): 0.00 (plano) es un valor óptico válido, no falsy
//   - Truncado a 1000 filas: la RPC get_stock_map usa SELECT DISTINCT
//     y devuelve todas las combos sin límite implícito
// ═══════════════════════════════════════════════════════════════════
async function getProduct(slug: string) {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('*, reviews:product_reviews(id, rating, comment, user_name, ciudad, verified, approved, created_at)')
    .eq('slug', slug).single()
  if (!data) return null

  // ── CAPA 1: Parámetros oficiales ────────────────────────────────
  // Vienen directamente de products.*_disponibles.
  // No se modifican. No se filtran. No se sobreescriben con inventario.
  // El plano 0.00, los positivos, los negativos — todos son válidos.

  // ── CAPA 2: Mapa de stock (solo para validar botón "Comprar") ───
  // RPC get_stock_map: SELECT DISTINCT sph, cyl, axis, add_power, color
  //   WHERE product_id = X AND stock > 0
  // Sin limit implícito. Sin truncado. Sin order (no se necesita).
  const { data: stockMap } = await sb.rpc('get_stock_map', {
    p_product_id: data.id
  })

  // tiene_variantes_reales: ¿hay al menos una combinación con stock?
  // false → PDP muestra aviso "consultar por WhatsApp"
  data.tiene_variantes_reales = !!(stockMap && stockMap.length > 0)

  // stock_map: array de combos con stock para varianteSeleccionadaTieneStock()
  // El Client Component lo usa SOLO para habilitar/deshabilitar el botón
  data.stock_map = stockMap ?? []

  // CRÍTICO: sph_disponibles, cyl_disponibles, axis_disponibles, add_disponibles
  // se pasan SIN modificar — contienen los rangos oficiales del fabricante
  // auditados contra IFUs oficiales (migración auditoria_parametros_opticos_correctos)

  return data
}


export async function generateStaticParams() {
  // Pre-renderizar los productos más visitados en build time
  // Graceful fallback si env vars no están disponibles (build local sin .env.local)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return []
  }
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data } = await sb
      .from('products')
      .select('slug')
      .eq('activo', true)
      .gt('stock', 0)
      .limit(20) // Pre-renderizar top 20 productos en build
    return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    return [] // Fallback: ISR renderizará en el primer request
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const data = await getProduct(slug)
  if (!data) return { title: 'Producto no encontrado' }

  const url = `https://www.contactgo.net/producto/${slug}`
  const desc = data.descripcion
    ? data.descripcion.slice(0, 155)
    : `${data.nombre} — Compra ${data.nombre} en ContactGo República Dominicana. Entrega en 24-48h. ${data.marca ? 'Marca: ' + data.marca + '.' : ''}`

  return {
    title: `${data.nombre} | ContactGo República Dominicana`,
    description: desc,
    alternates: { canonical: url.startsWith("https://www.") ? url : url.replace("https://", "https://www.") },
    openGraph: {
      title: data.nombre,
      description: desc,
      url,
      images: (() => {
      // Para productos de color: usar la primera imagen de color disponible como OG
      const colImgs = (data as any).imagenes_por_color as Record<string,string> | undefined
      const firstColorImg = colImgs && Object.values(colImgs)[0]
        ? `https://www.contactgo.net${Object.values(colImgs)[0]}`
        : null
      const ogImgUrl = firstColorImg ?? data.imagen_url ?? 'https://www.contactgo.net/og-1200x630.png'
      return [{ url: ogImgUrl, width: 800, height: 800, alt: data.nombre }]
    })(),
      locale: 'es_DO',
      siteName: 'ContactGo',
      type: 'website' as const, // Next.js Metadata type
      // og:type product se maneja via JSON-LD Product schema
    },
    twitter: {
      card: 'summary_large_image',
      title: data.nombre,
      description: desc,
      images: data.imagen_url ? [data.imagen_url] : ['https://www.contactgo.net/og-1200x630.png'],
    },
  }
}

export default async function ProductoPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const reviews = (product.reviews ?? []).filter((r: any) =>
    r.approved !== false   // incluye: approved=true y approved=null (legacy)
    && (r.comment ?? '').trim() !== ''  // solo reviews con texto
  )
  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : null

  const entregaInfo = getEntrega(product.tipo, product.nombre)

  // ── Product Schema ──────────────────────────────────────────
  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://www.contactgo.net/producto/${product.slug}#product`,
    "name": product.nombre,
    "description": product.descripcion ?? `${product.nombre} disponible en ContactGo República Dominicana.`,
    "image": product.imagen_url ?? "https://www.contactgo.net/icon-512.png",
    "brand": { "@type": "Brand", "name": product.marca ?? "ContactGo" },
    "sku": product.id,
    "mpn": product.sku ? String(product.sku) : `CG-${String(product.id).slice(0,8).toUpperCase()}`,
    ...((product as any).gtin ? { "gtin": String((product as any).gtin) } : {}),
    ...((product as any).ean  ? { "gtin13": String((product as any).ean) } : {}),
    // ── Colores: requerido para Google Shopping y Rich Results ─────────────────
    ...(product.colores_disponibles?.length
      ? { "color": product.colores_disponibles.join(", ") }
      : {}),
    // ── Imagen con color: primera imagen disponible para el schema ─────────────
    ...(() => {
      const colImgs = (product as any).imagenes_por_color as Record<string,string> | undefined
      if (!colImgs || !Object.values(colImgs)[0]) return {}
      return { "image": [`https://www.contactgo.net${Object.values(colImgs)[0]}`, product.imagen_url].filter(Boolean) }
    })(),
    ...((product as any).ean  ? { "gtin13": String((product as any).ean) } : {}),
    "url": `https://www.contactgo.net/producto/${product.slug}`,
    "offers": {
      "@type": "Offer",
      "url": `https://www.contactgo.net/producto/${product.slug}`,
      "priceCurrency": "DOP",
      "price": String(product.precio ?? 0),
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "ContactGo", "url": "https://contactgo.net" },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "200", "currency": "DOP" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "DO" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "1", "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": String(entregaInfo.dias_min), "maxValue": String(entregaInfo.dias_max), "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "DO",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": "2",
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "merchantReturnLink": "https://www.contactgo.net/devoluciones"
      }
    }
  }

  // ── Agregar Reviews si existen ──────────────────────────────
  if (reviews.length > 0) {
    const reviewsConTexto = reviews.filter((r: any) => r.comment || r.texto || r.comentario)
    const avgRatingReal = reviewsConTexto.length > 0
      ? reviewsConTexto.reduce((s: number, r: any) => s + (r.rating ?? r.estrellas ?? 5), 0) / reviewsConTexto.length
      : avgRating
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": String((avgRatingReal ?? 5).toFixed(1)), // siempre string
      "reviewCount": String(reviews.length), // solo reviews aprobadas con texto                  // siempre string
      "bestRating": "5",
      "worstRating": "1"
    }
    productSchema.review = reviews
      .filter((r: any) => r.comment || r.texto || r.comentario) // solo reviews con texto
      .slice(0, 5)
      .map((r: any) => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": r.user_name ?? r.nombre ?? "Cliente verificado" },
        "datePublished": r.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(r.rating ?? r.estrellas ?? 5), // string, no number
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": (r.comment ?? r.texto ?? r.comentario ?? "").trim()
      }))
    // Si después de filtrar no hay reviews con texto, eliminar el array
    if (productSchema.review.length === 0) delete productSchema.review
  }

  // ── Breadcrumb Schema ───────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://contactgo.net" },
      { "@type": "ListItem", "position": 2, "name": "Catálogo", "item": "https://www.contactgo.net/catalogo" },
      { "@type": "ListItem", "position": 3, "name": product.nombre, "item": `https://www.contactgo.net/producto/${product.slug}` }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProductoClient product={product} variants={[]} />
    </>
  )
}
