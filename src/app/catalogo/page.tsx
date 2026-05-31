import type { Metadata } from 'next'
import { Suspense } from 'react'
import CatalogoFiltros from '@/components/shop/CatalogoFiltros'
import CatalogoGrid from '@/components/shop/CatalogoGrid'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Product } from '@/types'

// CRÍTICO-1b: Sin searchParams en el Server Component → ISR real
// El filtrado lo hace CatalogoGrid (client) via useSearchParams
export const metadata: Metadata = {
  title: 'Catálogo de Lentes de Contacto | ContactGo República Dominicana',
  description: 'Catálogo completo de lentes de contacto en RD. Esféricos, tóricos, multifocales y de colores. Acuvue, Air Optix, Biofinity. Envío 24-48h.',
  robots: 'index,follow',
  alternates: { canonical: 'https://www.contactgo.net/catalogo' },
}

export const revalidate = 60  // ISR: revalida cada 60s

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

// Campos mínimos para cards — excluye arrays grandes (cyl, axis, add) y campos admin
const CARD_FIELDS = 'id, nombre, slug, precio, precio_anterior, imagen_url, tipo, stock, marca, reemplazo, contenido, sph_disponibles, colores_disponibles, activo, archivado, dias_uso'

async function getAllProducts(): Promise<Product[]> {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select(CARD_FIELDS)
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
    .order('nombre', { ascending: true })
  return (data ?? []) as unknown as Product[]
}

async function getMarcas(): Promise<string[]> {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('marca')
    .eq('activo', true)
    .not('marca', 'is', null)
  const all: string[] = (data ?? []).map((d: any) => d.marca).filter(Boolean)
  const unique: string[] = []
  all.forEach((m) => { if (!unique.includes(m)) unique.push(m) })
  return unique.sort()
}

export default async function CatalogoPage() {
  const [products, marcas] = await Promise.all([
    getAllProducts(),
    getMarcas(),
  ])

  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600 transition-colors">Inicio</a>
          <span>/</span>
          <span className="text-gray-700 font-medium">Catálogo</span>
        </nav>

        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">Catálogo</h1>
        </div>

        {/* CatalogoFiltros: navega via URL. CatalogoGrid: filtra client-side con useSearchParams */}
        <Suspense>
          <CatalogoFiltros
            tipos={TIPOS}
            marcas={marcas}
            tipoActivo={''}
            marcaActiva={''}
            duracionActiva={''}
            ordenActivo={'nombre'}
            ordenes={ORDENES}
            q={''}
          />
          <CatalogoGrid products={products} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
