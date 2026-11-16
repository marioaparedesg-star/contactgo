import type { Metadata } from 'next'
import { Suspense } from 'react'
import CatalogoFiltros from '@/components/shop/CatalogoFiltros'
import CatalogoGrid from '@/components/shop/CatalogoGrid'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Product } from '@/types'
import Link from 'next/link'

// CRÍTICO-1b: Sin searchParams en el Server Component → ISR real
// El filtrado lo hace CatalogoGrid (client) via useSearchParams
export const metadata: Metadata = {
  title: 'Catálogo de Lentes de Contacto | ContactGo República Dominicana',
  description: 'Catálogo completo de lentes de contacto en RD. Esféricos, tóricos, multifocales y de colores. Acuvue, Air Optix, Biofinity. Envíos: Santo Domingo 24-48h · Interior 2-4 días.',
  robots: 'index,follow',
  alternates: { canonical: 'https://www.contactgo.net/catalogo' },
}

export const revalidate = 60  // ISR: revalida cada 60s

const ETIQUETAS_TIPO: Record<string, string> = {
  esferico: 'Esféricos',
  torico: 'Tóricos',
  multifocal: 'Multifocales',
  color: 'Color',
  solucion: 'Soluciones',
  gota: 'Gotas',
}

const ORDENES = [
  { value: 'nombre',     label: 'Nombre A-Z' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc',label: 'Precio: mayor a menor' },
  { value: 'novedad',    label: 'Más nuevo' },
]

// Campos mínimos para cards — excluye arrays grandes (cyl, axis, add) y campos admin
const CARD_FIELDS = 'id, nombre, slug, precio, precio_anterior, imagen_url, tipo, stock, marca, reemplazo, contenido, sph_disponibles, colores_disponibles, activo, archivado, dias_uso, created_at'

async function getAllProducts(): Promise<Product[]> {
  const sb = await createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select(CARD_FIELDS)
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
    .order('nombre', { ascending: true })
  return (data ?? []) as unknown as Product[]
}

async function getMarcas(): Promise<string[]> {
  const sb = await createServerSupabaseClient()
  const { data } = await sb.from('products')
    .select('marca')
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
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

  // Solo mostrar categorías que realmente tienen productos activos.
  const tiposDisponibles = Array.from(new Set(products.map(p => p.tipo).filter((tipo): tipo is string => Boolean(tipo))))
    .filter(tipo => Boolean(ETIQUETAS_TIPO[tipo]))
    .sort((a, b) => (ETIQUETAS_TIPO[a] || a).localeCompare(ETIQUETAS_TIPO[b] || b))
    .map(tipo => ({ value: tipo, label: ETIQUETAS_TIPO[tipo] }))

  // La duración describe el reemplazo de lentes; no aplicar a soluciones/gotas.
  const duracionesDisponibles = Array.from(new Set(
    products
      .filter(p => ['esferico', 'torico', 'multifocal', 'color'].includes(p.tipo))
      .map(p => Number((p as any).dias_uso))
      .filter(dias => Number.isFinite(dias) && dias > 0)
  )).sort((a, b) => a - b).map(dias => ({
    value: String(dias),
    label: dias === 1 ? 'Diarios' : dias === 14 ? 'Quincenales' : dias === 30 ? 'Mensuales' : `${dias} días`,
  }))

  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Catálogo</span>
        </nav>

        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#002455]">Encuentra tus lentes</h1>
          <p className="mt-1 text-sm text-slate-500">Explora nuestra selección de lentes de contacto y cuidado visual.</p>
        </div>

        {/* CatalogoFiltros: navega via URL. CatalogoGrid: filtra client-side con useSearchParams */}
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5].map(i=><div key={i} className="h-9 w-24 bg-gray-100 rounded-xl"/>)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1,2,3,4,5,6,7,8].map(i=><div key={i} className="h-64 bg-gray-100 rounded-2xl"/>)}
            </div>
          </div>
        }>
          <CatalogoFiltros
            tipos={[{ value: '', label: 'Todos' }, ...tiposDisponibles]}
            duraciones={duracionesDisponibles}
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
