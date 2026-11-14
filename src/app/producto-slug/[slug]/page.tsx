import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SlugRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sb = await createServerSupabaseClient()
  const { data } = await sb.from('products').select('id').eq('slug', slug).single()
  if (data) redirect(`/producto/${data.id}`)
  redirect('/catalogo')
}
