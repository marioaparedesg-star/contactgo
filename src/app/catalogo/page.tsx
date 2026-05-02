import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'
import { Search } from 'lucide-react'

export const revalidate = 30

interface Props {
  searchParams: { tipo?: string; marca?: string; q?: string }
}

const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'esferico', label: 'Esféricos' },
  { value: 'torico', label: 'Tóricos' },
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
      <main className="pb-20 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Catálogo</h1>
          <p className="text-gray-500">{products.length} productos disponibles</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="card p-5 sticky top-20 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buscar</label>
                <form method="GET" action="/catalogo">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input name="q" defaultValue={searchParams.q} placeholder="Nombre..." className="input !pl-9 text-sm" />
                    {searchParams.tipo && <input type="hidden" name="tipo" value={searchParams.tipo} />}
                  </div>
                </form>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo</p>
                <div className="space-y-1">
                  {TIPOS.map(t => (
                    <a key={t.value} href={t.value ? '/catalogo?tipo=' + t.value : '/catalogo'}
                      className={'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ' +
                        (tipoActivo === t.value ? 'bg-primary-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100')}>
                      {t.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Marca</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {marcas.map(m => (
                    <a key={m} href={'/catalogo?' + (searchParams.tipo ? 'tipo=' + searchParams.tipo + '&' : '') + 'marca=' + m}
                      className={'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ' +
                        (searchParams.marca === m ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-100')}>
                      {m}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">No encontramos productos</p>
                <a href="/catalogo" className="mt-4 text-sm text-primary-600 font-semibold">Ver todos</a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
