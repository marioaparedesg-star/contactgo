import type { Metadata } from 'next'


const TIPO_META: Record<string, { title: string; description: string }> = {
  esferico:  { title: 'Lentes de Contacto Esféricos RD | Miopía e Hipermetropía — ContactGo', description: 'Compra lentes de contacto esféricos en República Dominicana. Acuvue, Air Optix, Biofinity para miopía e hipermetropía. Envío 24-48h.' },
  torico:    { title: 'Lentes para Astigmatismo RD | Lentes Tóricos — ContactGo', description: 'Lentes tóricos para astigmatismo en RD. Acuvue Oasys for Astigmatism, Biofinity Toric. Entrega a domicilio en República Dominicana.' },
  multifocal:{ title: 'Lentes Multifocales para Presbicia RD — ContactGo', description: 'Lentes de contacto multifocales para vista cansada y presbicia en República Dominicana. Acuvue Oasys Presbyopia. Envío en 24-48h.' },
  color:     { title: 'Lentes de Contacto de Colores RD | FreshLook, Air Optix Colors — ContactGo', description: 'Lentes de colores en República Dominicana. FreshLook Colorblends, Air Optix Colors. Con y sin graduación. Entrega a domicilio.' },
  solucion:  { title: 'Soluciones para Lentes de Contacto RD — ContactGo', description: 'Soluciones multipropósito para lentes de contacto en RD. ReNu, Opti-Free, Dream Eye. Envío a domicilio en República Dominicana.' },
  gota:      { title: 'Gotas Lubricantes Oculares RD | Systane, Refresh — ContactGo', description: 'Gotas lubricantes para ojos secos en República Dominicana. Systane Ultra, Refresh Optive, Frigine. Alivio inmediato. Envío 24h.' },
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

interface Props {
  searchParams: { tipo?: string; marca?: string; q?: string }
}

const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'esferico', label: 'Esfericos' },
  { value: 'torico', label: 'Toricos' },
  { value: 'multifocal', label: 'Multifocales' },
  { value: 'color', label: 'Color' },
  { value: 'solucion', label: 'Soluciones' },
  { value: 'gota', label: 'Gotas' },
]

async function getProducts(tipo?: string, marca?: string, q?: string): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  let query = sb.from('products').select('*, categories(*)').eq('activo', true).gt('stock', 0)
  if (tipo) query = query.eq('tipo', tipo)
  if (marca) query = query.ilike('marca', '%' + marca + '%')
  if (q) query = query.ilike('nombre', '%' + q + '%')
  const { data } = await query.order('nombre')
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

export default async function CatalogoPage({ searchParams }: Props) {
  const [products, marcas] = await Promise.all([
    getProducts(searchParams.tipo, searchParams.marca, searchParams.q),
    getMarcas(),
  ])
  const tipoActivo = searchParams.tipo ?? ''

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">Catalogo</h1>
          <p className="text-gray-500 text-sm">{products.length} productos disponibles</p>
        </div>

        <form method="GET" action="/catalogo" className="mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input name="q" defaultValue={searchParams.q} placeholder="Buscar producto..." className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm" />
          </div>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {TIPOS.map(t => (
            <a key={t.value} href={t.value ? '/catalogo?tipo=' + t.value : '/catalogo'}
              className={"shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors " +
                (tipoActivo === t.value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300')}>
              {t.label}
            </a>
          ))}
        </div>

        {searchParams.marca && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Marca:</span>
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">{searchParams.marca}</span>
            <a href={'/catalogo' + (searchParams.tipo ? '?tipo=' + searchParams.tipo : '')} className="text-gray-400 hover:text-red-500 text-sm">x Limpiar</a>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 font-medium">No encontramos productos</p>
            <a href="/catalogo" className="mt-4 text-sm text-primary-600 font-semibold">Ver todos</a>
          </div>
        )}

        {marcas.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Filtrar por marca</p>
            <div className="flex flex-wrap gap-2">
              {marcas.map(m => (
                <a key={m} href={'/catalogo?' + (searchParams.tipo ? 'tipo=' + searchParams.tipo + '&' : '') + 'marca=' + m}
                  className={"px-3 py-1.5 rounded-full text-xs font-semibold transition-colors " +
                    (searchParams.marca === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
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
