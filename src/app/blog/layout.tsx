import { createClient } from '@supabase/supabase-js'
import BlogRelatedProducts from '@/components/blog/BlogRelatedProducts'

export const revalidate = 600

type BlogProduct = {
  id: string
  nombre: string
  slug: string
  marca: string | null
  precio: number | string
  imagen_url: string | null
  tipo: string | null
}

async function getBlogProducts(): Promise<BlogProduct[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data, error } = await supabase.from('products')
    .select('id,nombre,slug,marca,precio,imagen_url,tipo')
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
    .order('nombre', { ascending: true })
    .limit(100)
  if (error) {
    console.error('[blog] No se pudieron cargar productos relacionados:', error.message)
    return []
  }
  return (data ?? []) as BlogProduct[]
}

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const products = await getBlogProducts()
  return <>{children}<BlogRelatedProducts products={products} /></>
}
