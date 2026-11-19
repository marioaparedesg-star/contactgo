"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'

type BlogPost = {
  slug: string
  titulo: string
  desc: string
  emoji: string
  cat: string
  mins: number
  fecha: string
  hot?: boolean
}

const PAGE_SIZE = 12
const CATEGORY_ORDER = [
  'Todos', 'Guías', 'Comparativas', 'Salud ocular', 'Precios', 'Educación',
  'Cuidado', 'Compra', 'Soluciones', 'Astigmatismo', 'Presbicia', 'Color',
  'Consejos', 'Entrega', 'Para turistas', 'Compra segura',
]

const CATEGORY_STYLE: Record<string, string> = {
  'Guías': 'bg-sky-50 text-sky-800',
  'Comparativas': 'bg-violet-50 text-violet-800',
  'Salud ocular': 'bg-rose-50 text-rose-800',
  'Precios': 'bg-emerald-50 text-emerald-800',
  'Educación': 'bg-indigo-50 text-indigo-800',
  'Cuidado': 'bg-amber-50 text-amber-800',
  'Compra': 'bg-teal-50 text-teal-800',
  'Soluciones': 'bg-cyan-50 text-cyan-800',
  'Entrega': 'bg-slate-100 text-slate-700',
}

function categoryClass(category: string) {
  return CATEGORY_STYLE[category] ?? 'bg-slate-100 text-slate-700'
}

function formatDate(value: string) {
  const date = new Date(value + 'T12:00:00')
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export default function BlogJournal({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const categories = useMemo(() => {
    const available = new Set(posts.map((post) => post.cat))
    return CATEGORY_ORDER.filter((item) => item === 'Todos' || available.has(item))
      .concat([...available].filter((item) => !CATEGORY_ORDER.includes(item)).sort())
  }, [posts])

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    return posts.filter((post) => {
      const matchesCategory = category === 'Todos' || post.cat === category
      const searchable = [post.titulo, post.desc, post.cat, post.slug].join(' ').toLocaleLowerCase('es')
      return matchesCategory && (!term || searchable.includes(term))
    })
  }, [posts, query, category])

  const featured = posts.find((post) => post.hot && post.cat !== 'Entrega') ?? posts[0]
  const popular = posts.filter((post) => post.hot && post.slug !== featured?.slug && post.cat !== 'Entrega').slice(0, 3)
  const visible = filtered.slice(0, visibleCount)
  const hasFilters = query.trim().length > 0 || category !== 'Todos'

  function changeCategory(next: string) {
    setCategory(next)
    setVisibleCount(PAGE_SIZE)
  }

  function changeQuery(next: string) {
    setQuery(next)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] pb-20">
      <section className="relative overflow-hidden bg-[#002455] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[42px] border-white/[0.06]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-[18%] h-80 w-80 rounded-full bg-[#01b2b7]/10 blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-[#01b2b7]" />
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#8de4e3]">ContactGo Journal</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">Conocimiento que te acompaña</span>
          </div>
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="max-w-3xl">
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.65rem]">
                Mira el mundo con más claridad.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100/80 sm:text-lg">
                Guías, comparativas y consejos para conocer mejor tus lentes de contacto y cuidar tu salud visual.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-blue-100/75">
                <span>{posts.filter((post) => post.cat !== 'Entrega').length} artículos especializados</span>
                <span>Información para República Dominicana</span>
                <span>Contenido fácil de consultar</span>
              </div>
            </div>
            <div className="hidden rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm lg:block">
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c477e] to-[#007f91]">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/35">
                  <div className="h-16 w-16 rounded-full border-[10px] border-[#8de4e3]/90 shadow-[0_0_40px_rgba(141,228,227,.3)]" />
                  <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_18px_white]" />
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold">Tu guía para elegir mejor</p>
              <p className="mt-1 text-xs leading-5 text-blue-100/70">Información clara sobre tipos, marcas, cuidados y compras.</p>
            </div>
          </div>
          <form className="mt-9 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 shadow-xl shadow-slate-950/10" onSubmit={(event) => { event.preventDefault(); document.getElementById('blog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
            <svg aria-hidden="true" className="ml-3 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input
              aria-label="Buscar artículos"
              className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
              placeholder="Busca una marca, un producto o una pregunta..."
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
            />
            {query && <button type="button" onClick={() => changeQuery('')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Limpiar</button>}
            <button type="submit" className="rounded-xl bg-[#01a6ad] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#008f98]">Buscar</button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {!hasFilters && featured && (
          <section className="relative -mt-6 grid overflow-hidden rounded-3xl bg-white shadow-[0_16px_50px_rgba(0,36,85,.10)] ring-1 ring-slate-200/70 md:grid-cols-[1.05fr_.95fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#e5f8f7] px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#007f86]">Selección editorial</span>
                <span className="text-xs text-slate-400">{featured.mins} min de lectura</span>
              </div>
              <h2 className="mt-5 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-[#002455] sm:text-3xl">{featured.titulo}</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">{featured.desc}</p>
              <div className="mt-7">
                <Link href={'/blog/' + featured.slug} className="inline-flex items-center gap-2 rounded-xl bg-[#002455] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00366f]">
                  Leer artículo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#e6f6f7] via-[#d8e9f4] to-[#eef3fa] p-10 md:min-h-[330px]">
              <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border-[34px] border-white/60" />
              <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-[#01b2b7]/10" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/80 bg-white/40 shadow-[0_20px_70px_rgba(0,36,85,.12)] backdrop-blur">
                <div className="h-28 w-28 rounded-full border-[17px] border-[#01a6ad] shadow-[inset_0_0_25px_rgba(0,36,85,.12),0_0_35px_rgba(1,178,183,.2)]" />
                <div className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_20px_white]" />
              </div>
              <span className="absolute bottom-5 right-6 text-[10px] font-bold uppercase tracking-[.22em] text-[#477184]">CONTACTGO JOURNAL</span>
            </div>
          </section>
        )}

        {!hasFilters && popular.length > 0 && (
          <section className="py-12 sm:py-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00969d]">Para empezar</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#002455] sm:text-2xl">Artículos populares</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {popular.map((post) => (
                <Link key={post.slug} href={'/blog/' + post.slug} className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#9adfdf] hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className={'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ' + categoryClass(post.cat)}>{post.cat}</span>
                    <span className="text-xs text-slate-400">{post.mins} min</span>
                  </div>
                  <h3 className="mt-5 line-clamp-2 text-base font-semibold leading-snug text-[#002455] group-hover:text-[#008d95]">{post.titulo}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#008d95]">Leer artículo <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="blog-results" className="scroll-mt-8 pb-10">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00969d]">Biblioteca de contenido</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#002455] sm:text-2xl">{hasFilters ? 'Resultados' : 'Explora todos los artículos'}</h2>
                <p className="mt-1 text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'artículo disponible' : 'artículos disponibles'}</p>
              </div>
              {hasFilters && <button onClick={() => { setQuery(''); changeCategory('Todos') }} className="text-xs font-semibold text-[#008d95] hover:underline">Limpiar filtros</button>}
            </div>
          </div>

          <div className="-mx-5 mb-7 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <div className="flex min-w-max gap-2 pb-1">
              {categories.map((item) => {
                const active = category === item
                return (
                  <button key={item} type="button" onClick={() => changeCategory(item)} aria-pressed={active}
                    className={'rounded-full border px-4 py-2 text-xs font-semibold transition ' + (active ? 'border-[#002455] bg-[#002455] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-[#8fd8d9] hover:text-[#007f86]')}>
                    {item}
                  </button>
                )
              })}
            </div>
          </div>

          {visible.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((post) => (
                  <article key={post.slug} className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#a8dddd] hover:shadow-[0_14px_38px_rgba(0,36,85,.08)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className={'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ' + categoryClass(post.cat)}>{post.cat}</span>
                      <span className="text-[11px] text-slate-400">{post.mins} min</span>
                    </div>
                    <div className="mt-5 flex flex-1 flex-col">
                      <h3 className="line-clamp-3 text-base font-semibold leading-snug tracking-tight text-[#002455] group-hover:text-[#008d95]">{post.titulo}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{post.desc}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-[11px] text-slate-400">{formatDate(post.fecha)}</span>
                        <Link href={'/blog/' + post.slug} className="inline-flex items-center gap-1 text-xs font-bold text-[#008d95] hover:text-[#006d74]">Leer más <span aria-hidden="true">→</span></Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {visibleCount < filtered.length && (
                <div className="mt-9 text-center">
                  <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="rounded-xl border border-[#002455]/20 bg-white px-6 py-3 text-sm font-semibold text-[#002455] shadow-sm transition hover:border-[#01b2b7] hover:bg-[#effafa]">
                    Cargar más artículos ({filtered.length - visibleCount} restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">⌕</div>
              <h3 className="mt-4 text-lg font-semibold text-[#002455]">No encontramos artículos</h3>
              <p className="mt-2 text-sm text-slate-500">Prueba con otra palabra o selecciona una categoría diferente.</p>
              <button type="button" onClick={() => { setQuery(''); changeCategory('Todos') }} className="mt-5 text-sm font-semibold text-[#008d95] hover:underline">Ver todos los artículos</button>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl bg-[#002455] px-6 py-9 text-center text-white sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8de4e3]">ContactGo</p>
          <h2 className="mx-auto mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">La información te ayuda a elegir. Nosotros te ayudamos a encontrarlo.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100/75">Explora nuestro catálogo especializado y consulta las opciones disponibles según tu receta.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/catalogo" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#002455] transition hover:bg-blue-50">Explorar catálogo</Link>
            <Link href="/receta" className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Consultar mi receta</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
