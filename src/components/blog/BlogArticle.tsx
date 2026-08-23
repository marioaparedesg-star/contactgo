// ============================================================
// BlogArticle — Componente template para artículos de blog
// Provee: breadcrumbs, header, autor, schema.org Article, FAQ,
// CTA final y sidebar de artículos relacionados.
// Uso: <BlogArticle meta={{...}}> {contenido MDX-like con <Section>} </BlogArticle>
// ============================================================
import Link from 'next/link'
import { ChevronRight, Calendar, Clock } from 'lucide-react'
import type { ReactNode } from 'react'

export interface BlogMeta {
  slug: string
  title: string
  h1: string
  description: string
  publishedAt: string  // ISO date
  updatedAt?: string
  readMinutes: number
  category: string     // 'Guías' | 'Marcas' | 'Consejos' | 'Salud'
  faq?: { q: string; a: string }[]
  relatedSlugs?: string[]
}

const BASE = 'https://www.contactgo.net'

export function ArticleSchema({ meta }: { meta: BlogMeta }) {
  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.h1,
      description: meta.description,
      url: `${BASE}/blog/${meta.slug}`,
      datePublished: meta.publishedAt,
      dateModified: meta.updatedAt ?? meta.publishedAt,
      author: {
        '@type': 'Organization',
        name: 'ContactGo',
        url: BASE,
      },
      publisher: {
        '@type': 'Organization',
        name: 'ContactGo',
        logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${meta.slug}` },
      inLanguage: 'es-DO',
      articleSection: meta.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
        { '@type': 'ListItem', position: 3, name: meta.h1, item: `${BASE}/blog/${meta.slug}` },
      ],
    },
  ]
  if (meta.faq?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  )
}

export default function BlogArticle({ meta, children }: { meta: BlogMeta; children: ReactNode }) {
  return (
    <>
      <ArticleSchema meta={meta} />
      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate">{meta.h1.slice(0, 60)}{meta.h1.length > 60 ? '…' : ''}</span>
        </nav>

        {/* Category badge */}
        <div className="mb-3">
          <span className="inline-block text-[10px] font-bold text-primary-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {meta.category}
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
          {meta.h1}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(meta.publishedAt).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{meta.readMinutes} min de lectura</span>
        </div>

        {/* Author card */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo®</p>
            <p className="text-xs text-gray-500">Especialistas exclusivos en lentes de contacto · República Dominicana</p>
          </div>
        </div>

        {/* Contenido del artículo */}
        <article className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-bold prose-ul:my-3 prose-li:my-1 prose-li:text-gray-700">
          {children}
        </article>

        {/* FAQ */}
        {meta.faq && meta.faq.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="font-display text-xl md:text-2xl font-black text-gray-900 mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {meta.faq.map((f, i) => (
                <details key={i} className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <summary className="cursor-pointer px-5 py-4 font-bold text-gray-900 text-sm flex items-center justify-between hover:bg-gray-100">
                    {f.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="mt-12 p-6 bg-gradient-to-br from-teal-50 to-white border border-primary-100 rounded-2xl text-center">
          <h3 className="font-display text-lg md:text-xl font-black text-gray-900 mb-2">
            ¿Listo para tus lentes de contacto?
          </h3>
          <p className="text-sm text-gray-600 mb-4">Marcas originales, entrega a domicilio en toda RD y pago seguro con AZUL.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/catalogo" className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Ver catálogo
            </Link>
            <Link href="/receta" className="bg-white border border-primary-200 text-primary-700 hover:bg-teal-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Calcular mi receta
            </Link>
          </div>
        </section>

        {/* Artículos relacionados */}
        {meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <section className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Artículos relacionados</p>
            <ul className="space-y-2">
              {meta.relatedSlugs.map(s => (
                <li key={s}>
                  <Link href={`/blog/${s}`} className="text-sm text-primary-600 hover:underline">
                    → {s.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8">
          <Link href="/blog" className="text-xs text-gray-500 hover:text-primary-600">← Ver todos los artículos del blog</Link>
        </div>
      </main>
    </>
  )
}
