import type { Metadata } from 'next'
import CatalogoFiltros from '@/components/shop/CatalogoFiltros'

const TIPO_META: Record<string, { title: string; description: string }> = {
  esferico:  { title: 'Lentes de Contacto Esféricos RD | Miopía e Hipermetropía — ContactGo', description: 'Compra lentes de contacto esféricos en República Dominicana. Acuvue, Air Optix, Biofinity para miopía e hipermetropía. Envío 24-48h.' },
  torico:    { title: 'Lentes para Astigmatismo RD | Lentes Tóricos — ContactGo', description: 'Lentes tóricos para astigmatismo en RD. Acuvue Oasys for Astigmatism, Biofinity Toric. Fabricados a medida. Entrega 20-30 días en República Dominicana.' },
  multifocal:{ title: 'Lentes Multifocales para Presbicia RD — ContactGo', description: 'Lentes de contacto multifocales para vista cansada y presbicia en República Dominicana. Acuvue Oasys Presbyopia. Envío en 24-48h.' },
  color:     { title: 'Lentes de Contacto de Colores RD | FreshLook, Air Optix Colors — ContactGo', description: 'Lentes de colores en República Dominicana. FreshLook Colorblends, Air Optix Colors. Con y sin graduación. Entrega a domicilio.' },
  solucion:  { title: 'Soluciones para Lentes de Contacto RD — ContactGo', description: 'Soluciones multipropósito para lentes de contacto en RD. ReNu, Opti-Free, Dream Eye. Envío a domicilio en República Dominicana.' },
  gota:      { title: 'Gotas Lubricantes Oculares RD | Systane, Refresh — ContactGo', description: 'Gotas lubricantes para ojos secos en República Dominicana. Systane Ultra, Refresh Optive, Frigine. Alivio inmediato. Envío 24h.' },
}

interface Props {
  searchParams: { tipo?: string; marca?: string; q?: string; orden?: string; duracion?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await Promise.resolve(searchParams)
  const tipo  = sp.tipo  ?? ''
  const marca = sp.marca ?? ''
  const orden = sp.orden ?? ''
  const duracion = sp.duracion ?? ''
  const q = sp.q ?? ''

  // ── Canonical: solo tipo limpio, sin marca/orden/duracion/q ─────────────
  // Cualquier combinación de parámetros apunta a la URL canónica del tipo
  const BASE = 'https://www.contactgo.net'
  const canonical = tipo ? `${BASE}/catalogo?tipo=${tipo}` : `${BASE}/catalogo`

  // ── noindex para URLs con combinaciones de parámetros ──────────────────
  // Solo se indexan las páginas "limpias": /catalogo y /catalogo?tipo=X
  const hasExtraParams = marca || orden || duracion || q
  const robots = hasExtraParams ? 'noindex,follow' : 'index,follow'

  const meta = TIPO_META[tipo]
  const title = meta?.title ?? 'Catálogo de Lentes de Contacto | ContactGo República Dominicana'
  const description = meta?.description ?? 'Catálogo completo de lentes de contacto en RD. Esféricos, tóricos, multifocales y de colores. Acuvue, Air Optix, Biofinity. Envío 24-48h.'

  return {
    title,
    description,
    robots,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: 'es_DO',
      siteName: 'ContactGo',
    },
  }
}

import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ProductCard from '@/components/shop/ProductCard'
import ViewItemListTracker from '@/components/analytics/ViewItemListTracker'
import type { Product } from '@/types'

export const revalidate = 30

const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'esferico', label: 'Esféricos' },
  { value: 'torico', label: 'Tóricos' },
  { value: 'multifocal', label: 'Multifocales' },
  { value: 'color', label: 'Color' },
  { value: 'solucion', label: 'Soluciones' },
  { value: 'gota', label: 'Gotas' },
]

const ORDENES = [
  { value: 'nombre',     label: 'Nombre A-Z' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc',label: 'Precio: mayor a menor' },
  { value: 'novedad',    label: 'Más nuevo' },
]

async function getProducts(tipo?: string, marca?: string, q?: string, orden?: string, duracion?: string): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  let query = sb.from('products').select('*').eq('activo', true).or('archivado.is.null,archivado.eq.false')
  if (tipo)     query = query.eq('tipo', tipo)
  if (marca)    query = query.ilike('marca', '%' + marca + '%')
  if (q)        query = query.ilike('nombre', '%' + q + '%')
  if (duracion) query = query.eq('dias_uso', parseInt(duracion))

  // Ordenamiento
  switch (orden) {
    case 'precio_asc':  query = query.order('precio', { ascending: true });  break
    case 'precio_desc': query = query.order('precio', { ascending: false }); break
    case 'novedad':     query = query.order('created_at', { ascending: false }); break
    default:            query = query.order('nombre', { ascending: true })
  }

  const { data } = await query
  return data ?? []
}

async function getMarcas(): Promise<string[]> {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products').select('marca').eq('activo', true).not('marca', 'is', null)
  const all: string[] = (data ?? []).map((d: any) => d.marca).filter(Boolean)
  const unique: string[] = []
  all.forEach((m) => { if (!unique.includes(m)) unique.push(m) })
  return unique.sort()
}

function buildUrl(current: Record<string, string | undefined>, override: Record<string, string | undefined>) {
  const params = { ...current, ...override }
  const qs = Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join('&')
  return '/catalogo' + (qs ? '?' + qs : '')
}

export default async function CatalogoPage({ searchParams }: Props) {
  const sp = await Promise.resolve(searchParams)
  const [products, marcas] = await Promise.all([
    getProducts(sp.tipo, sp.marca, sp.q, sp.orden, sp.duracion),
    getMarcas(),
  ])

  const currentParams = {
    tipo: sp.tipo, marca: sp.marca, q: sp.q, orden: sp.orden, duracion: sp.duracion,
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Breadcrumb visual */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600 transition-colors">Inicio</a>
          <span>/</span>
          <span className="text-gray-700 font-medium">Catálogo</span>
          {sp.tipo && <><span>/</span><span className="text-primary-600 font-semibold capitalize">{sp.tipo === 'esferico' ? 'Esféricos' : sp.tipo === 'torico' ? 'Tóricos' : sp.tipo === 'multifocal' ? 'Multifocales' : sp.tipo === 'solucion' ? 'Soluciones' : sp.tipo === 'gota' ? 'Gotas' : sp.tipo}</span></>}
        </nav>

        {/* Header */}
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-gray-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Búsqueda */}
        <form method="GET" action="/catalogo" className="mb-4">
          {sp.tipo  && <input type="hidden" name="tipo"  value={sp.tipo} />}
          {sp.marca && <input type="hidden" name="marca" value={sp.marca} />}
          {sp.orden && <input type="hidden" name="orden" value={sp.orden} />}
          <div className="relative">
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input name="q" defaultValue={sp.q} placeholder="Buscar producto..." className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm" />
          </div>
        </form>

        {/* ── Filtros ─────────────────────────────────────────────────── */}
        <CatalogoFiltros
          tipos={TIPOS}
          marcas={marcas}
          tipoActivo={sp.tipo ?? ''}
          marcaActiva={sp.marca ?? ''}
          duracionActiva={sp.duracion ?? ''}
          ordenActivo={sp.orden ?? 'nombre'}
          ordenes={ORDENES}
          q={sp.q ?? ''}
        />

        {/* Grid productos */}
        {/* Analytics: view_item_list */}
        <ViewItemListTracker
          items={products.map(p => ({ id: p.id, nombre: p.nombre, marca: p.marca, tipo: p.tipo, precio: p.precio }))}
          listName={sp.tipo ? `Catálogo — ${sp.tipo}` : 'Catálogo'}
        />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-600 font-semibold text-lg">No encontramos productos</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros o busca por nombre de marca</p>
            <a href="/catalogo" className="mt-4 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Ver todos los productos</a>
          </div>
        )}


      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
