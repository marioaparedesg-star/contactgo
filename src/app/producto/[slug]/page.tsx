import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductoClient from './ProductoClient'

async function getProduct(slug: string) {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('*, reviews:product_reviews(rating, comment, user_name, created_at)')
    .eq('slug', slug).single()
  return data
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
    alternates: { canonical: url },
    openGraph: {
      title: data.nombre,
      description: desc,
      url,
      images: data.imagen_url ? [{ url: data.imagen_url, width: 800, height: 800, alt: data.nombre }] : [{ url: 'https://www.contactgo.net/og-1200x630.png', width: 1200, height: 630 }],
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

  const reviews = product.reviews ?? []
  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : null

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
    "category": product.tipo,
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
          "transitTime": { "@type": "QuantitativeValue", "minValue": "1", "maxValue": "2", "unitCode": "DAY" }
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
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating?.toFixed(1),
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    }
    productSchema.review = reviews.slice(0, 5).map((r: any) => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.user_name ?? "Cliente verificado" },
      "datePublished": r.created_at?.slice(0, 10),
      "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
      "reviewBody": r.comment ?? ""
    }))
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
