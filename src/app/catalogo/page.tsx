import type { Metadata } from 'next'

const TIPO_META: Record<string, { title: string; description: string }> = {
  esferico:  { title: 'Lentes de Contacto Esféricos RD | Miopía e Hipermetropía — ContactGo', description: 'Compra lentes de contacto esféricos en República Dominicana. Acuvue, Air Optix, Biofinity para miopía e hipermetropía. Envío 24-48h.' },
  torico:    { title: 'Lentes para Astigmatismo RD | Lentes Tóricos — ContactGo', description: 'Lentes tóricos para astigmatismo en RD. Acuvue Oasys for Astigmatism, Biofinity Toric. Fabricados a medida. Entrega 20-30 días en República Dominicana.' },
  multifocal:{ title: 'Lentes Multifocales para Presbicia RD — ContactGo', description: 'Lentes de contacto multifocales para vista cansada y presbicia en República Dominicana. Acuvue Oasys Presbyopia. Envío en 24-48h.' },
  color:     { title: 'Lentes de Contacto de Colores RD | FreshLook, Air Optix Colors — ContactGo', description: 'Lentes de colores en República Dominicana. FreshLook Colorblends, Air Optix Colors. Con y sin graduación. Entrega a domicilio.' },
  solucion:  { title: 'Soluciones para Lentes de Contacto RD — ContactGo', description: 'Soluciones multipropósito para lentes de contacto en RD. ReNu, Opti-Free, Dream Eye. Envío a domicilio en República Dominicana.' },
  gota:      { title: 'Gotas Lubricantes Oculares RD | Systane, Refresh — ContactGo', description: 'Gotas lubricantes para ojos secos en República Dominicana. Systane Ultra, Refresh Optive, Frigine. Alivio inmediato. Envío 24h.' },
}

interface Props {
  searchParams: { tipo?: string; marca?: string; q?: string; orden?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const tipo = (await Promise.resolve(searchParams)).tipo ?? ''
  const meta = TIPO_META[tipo]
  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `https://contactgo.net/catalogo${tipo ? '?tipo=' + tipo : ''}` },
      openGraph: { title: meta.title, description: meta.description, url: `https://contactgo.net/catalogo${tipo ? '?tipo=' + tipo : ''}`, locale: 'es_DO', siteName: 'ContactGo' },
    }
  }
  return {
    title: 'Catálogo de Lentes de Contacto | ContactGo República Dominicana',
    description: 'Catálogo completo de lentes de contacto en RD. Esféricos, tóricos, multifocales y de colores. Acuvue, Air Optix, Biofinity. Envío 24-48h.',
    alternates: { canonical: 'https://contactgo.net/catalogo' },
    openGraph: { title: 'Catálogo — Lentes de Contacto RD', description: 'Todas las marcas premium con entrega a domicilio.', url: 'https://contactgo.net/catalogo', locale: 'es_DO', siteName: 'ContactGo' },
  }
}

import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ProductCard from '@/components/shop/ProductCard'
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

async function getProducts(tipo?: string, marca?: string, q?: string, orden?: string): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  let query = sb.from('products').select('*, categories(*)').eq('activo', true).gt('stock', 0)
  if (tipo)  query = query.eq('tipo', tipo)
  if (marca) query = query.ilike('marca', '%' + marca + '%')
  if (q)     query = query.ilike('nombre', '%' + q + '%')

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
  const sp = searchParams
  const [products, marcas] = await Promise.all([
    getProducts(sp.tipo, sp.marca, sp.q, sp.orden),
    getMarcas(),
  ])

  const currentParams = {
    tipo: sp.tipo, marca: sp.marca, q: sp.q, orden: sp.orden,
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
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

        {/* Filtros tipo */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {TIPOS.map(t => (
            <a key={t.value} href={buildUrl(currentParams, { tipo: t.value || undefined, q: sp.q, orden: sp.orden })}
              className={"shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors " +
                ((sp.tipo ?? '') === t.value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300')}>
              {t.label}
            </a>
          ))}
        </div>

        {/* Fila: filtro marca + ordenamiento */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Marca activa */}
          {sp.marca && (
            <div className="flex items-center gap-2">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">{sp.marca}</span>
              <a href={buildUrl(currentParams, { marca: undefined })} className="text-gray-400 hover:text-red-500 text-sm font-bold">✕</a>
            </div>
          )}

          {/* Ordenamiento */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:block">Ordenar:</span>
            <div className="flex gap-1 flex-wrap">
              {ORDENES.map(o => (
                <a key={o.value} href={buildUrl(currentParams, { orden: o.value })}
                  className={"px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border " +
                    ((sp.orden ?? 'nombre') === o.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')}>
                  {o.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Grid productos */}
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

        {/* Filtro por marca */}
        {marcas.length > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Filtrar por marca</p>
            <div className="flex flex-wrap gap-2">
              {marcas.map(m => (
                <a key={m} href={buildUrl(currentParams, { marca: m })}
                  className={"px-3 py-1.5 rounded-full text-xs font-semibold transition-colors " +
                    (sp.marca === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {m}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
