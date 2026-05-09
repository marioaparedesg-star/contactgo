import { createServerSupabaseClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductoClient from './ProductoClient'

// ── Canonical + SEO por producto ──────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products').select('nombre, descripcion, imagen_url, marca, tipo').eq('slug', slug).single()
  if (!data) return { title: 'Producto no encontrado — ContactGo' }

  const TIPO: Record<string, string> = {
    esferico:'Esférico', torico:'Tórico', multifocal:'Multifocal',
    color:'Color', solucion:'Solución', gota:'Gotas',
  }
  const tipo = TIPO[data.tipo ?? ''] ?? ''
  const title = `${data.nombre} | ${tipo} ${data.marca ?? ''} | ContactGo RD`
  const description = data.descripcion ??
    `Compra ${data.nombre} en República Dominicana. Entrega en 24-48h. Producto 100% original.`
  const url = `https://contactgo.net/producto/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: data.imagen_url ? [{ url: data.imagen_url }] : [],
      type: 'website',
      locale: 'es_DO',
      siteName: 'ContactGo',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// ── Server Component: fetch en servidor, pasa data al client ──────────────────
export default async function ProductoPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const sb = createServerSupabaseClient()

  const { data: product, error } = await sb
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .single()

  if (error || !product) notFound()

  const { data: variants } = await sb
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .gt('stock', 0)

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.nombre,
    "description": product.descripcion ?? `${product.nombre} - Lentes de contacto originales en República Dominicana`,
    "brand": {"@type":"Brand","name": product.marca},
    "image": product.imagen_url ?? "https://contactgo.net/logo.png",
    "offers": {
      "@type": "Offer",
      "price": product.precio,
      "priceCurrency": "DOP",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {"@type":"Organization","name":"ContactGo"},
      "url": `https://contactgo.net/producto/${product.slug ?? product.id}`
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      <ProductoClient product={product} variants={variants ?? []} />
    </>
  )
}
