import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SlugRedirectPage({ params }: { params: { slug: string } }) {
  const sb = createServerSupabaseClient()
  const { data } = await sb.from('products').select('id').eq('slug', params.slug).single()
  if (data) redirect(`/producto/${data.id}`)
  redirect('/catalogo')
}
