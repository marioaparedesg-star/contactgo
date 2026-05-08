import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ProductoByIdPage({ params }: { params: { id: string } }) {
  const sb = createServerSupabaseClient()
  
  // Buscar por ID primero
  const { data: byId } = await sb.from('products').select('id, slug').eq('id', params.id).single()
  if (byId) {
    if (byId.slug) redirect(`/producto/${byId.slug}`)
    redirect('/catalogo')
  }

  // Si no es UUID, buscar por slug
  const { data: bySlug } = await sb.from('products').select('id, slug').eq('slug', params.id).single()
  if (bySlug) redirect(`/producto/${bySlug.slug ?? bySlug.id}`)

  redirect('/catalogo')
}
