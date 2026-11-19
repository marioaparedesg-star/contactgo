'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type BlogProduct = {
  id: string
  nombre: string
  slug: string
  marca: string | null
  precio: number | string
  imagen_url: string | null
  tipo: string | null
}

const STOP_WORDS = new Set([
  'lentes','lente','contacto','contactos','contact','lens','lenses','precio','precios',
  'republica','dominicana','dominicano','rd','guia','comparacion','comparativa',
  'vs','como','cuando','donde','para','con','sin','que','del','las','los','una','uno',
  'por','mas','mejor','uso','comprar','online','ano','anos','dia','dias',
])

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim()
}

function tokens(value: string) {
  return normalize(value).split(/\s+/).filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

function chooseProducts(pathname: string, products: BlogProduct[]) {
  const slug = pathname.split('/').filter(Boolean).pop() ?? ''
  const articleTokens = new Set(tokens(slug.replace(/-/g, ' ')))
  const normalizedSlug = normalize(slug.replace(/-/g, ' '))

  const ranked = products.map((product) => {
    const productText = [product.nombre, product.marca ?? '', product.slug.replace(/-/g, ' ')].join(' ')
    const productTokens = tokens(productText)
    let score = productTokens.reduce((sum, token) => sum + (articleTokens.has(token) ? (token.length >= 6 ? 3 : 1) : 0), 0)
    const brand = normalize(product.marca ?? '')
    if (brand && normalizedSlug.includes(brand)) score += 8
    const meaningfulName = tokens(product.nombre).filter((token) => token.length >= 4)
    if (meaningfulName.length && meaningfulName.every((token) => articleTokens.has(token))) score += 8
    if (/astigmatismo|toric|torico/.test(normalizedSlug) && product.tipo === 'torico') score += 3
    if (/multifocal|presbicia/.test(normalizedSlug) && product.tipo === 'multifocal') score += 3
    if (/color|colores/.test(normalizedSlug) && product.tipo === 'color') score += 3
    if (/diario|diarios|oneday/.test(normalizedSlug) && /diari|oneday/.test(normalize(product.nombre + ' ' + product.slug))) score += 3
    if (/solucion|gotas|ojo seco/.test(normalizedSlug) && ['solucion','gota'].includes(product.tipo ?? '')) score += 3
    return { product, score }
  }).filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.nombre.localeCompare(b.product.nombre))

  const selected: BlogProduct[] = []
  const seen = new Set<string>()
  for (const item of ranked) {
    if (seen.has(item.product.id)) continue
    selected.push(item.product)
    seen.add(item.product.id)
    if (selected.length === 4) break
  }

  if (selected.length === 0) {
    const preferredTypes = /astigmatismo|toric|torico/.test(normalizedSlug) ? ['torico']
      : /multifocal|presbicia/.test(normalizedSlug) ? ['multifocal']
      : /color|colores/.test(normalizedSlug) ? ['color']
      : /diario|diarios/.test(normalizedSlug) ? ['esferico']
      : ['esferico','multifocal','torico']
    let fallbackCount = 0
    for (const type of preferredTypes) {
      const match = products.find((product) => product.tipo === type && !seen.has(product.id))
      if (match) { selected.push(match); seen.add(match.id); fallbackCount += 1 }
      if (fallbackCount >= 3) break
    }
  }
  return selected
}

function imageUrl(url: string | null) {
  return url || '/og-1200x630.jpg'
}

export default function BlogRelatedProducts({ products }: { products: BlogProduct[] }) {
  const pathname = usePathname() ?? ''
  const related = useMemo(() => chooseProducts(pathname, products), [pathname, products])
  if (!pathname.startsWith('/blog/') || related.length === 0) return null

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Productos relacionados disponibles en ContactGo',
    itemListElement: related.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: 'https://www.contactgo.net/producto/' + product.slug,
      name: product.nombre,
    })),
  }

  return (
    <section aria-labelledby="blog-related-products-title" className="max-w-5xl mx-auto px-4 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="border-t border-slate-200 pt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Catálogo ContactGo</p>
          <h2 id="blog-related-products-title" className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#002455]">Productos relacionados</h2>
          <p className="mt-1 text-sm text-slate-500">Consulta detalles, disponibilidad y opciones de cada producto.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {related.map((product) => (
            <Link key={product.id} href={'/producto/' + product.slug}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              aria-label={'Ver ' + product.nombre + ' en ContactGo'}>
              <div className="relative aspect-square bg-slate-50 p-3">
                <Image src={imageUrl(product.imagen_url)}
                  alt={product.nombre + (product.marca ? ' de ' + product.marca : '') + ' disponible en ContactGo'}
                  fill unoptimized sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 220px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-3">
                {product.marca && <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">{product.marca}</span>}
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-teal-800">{product.nombre}</h3>
                <p className="mt-auto pt-3 text-sm font-bold text-[#002455]">
                  {Number(product.precio) > 0 ? 'RD$' + Number(product.precio).toLocaleString('es-DO', { maximumFractionDigits: 0 }) : 'Consultar disponibilidad'}
                </p>
                <span className="mt-2 text-xs font-semibold text-teal-700">Ver producto <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
