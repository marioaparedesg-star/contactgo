import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function sitemap() {
  const sb = createServerSupabaseClient()
  const { data: products } = await sb.from('products').select('slug, id, updated_at')

  const productUrls = (products ?? []).map(p => ({
    url: `https://contactgo.net/producto/${p.slug || p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://contactgo.net', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: 'https://contactgo.net/catalogo', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: 'https://contactgo.net/catalogo?tipo=esferico', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://contactgo.net/catalogo?tipo=torico', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://contactgo.net/catalogo?tipo=multifocal', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://contactgo.net/catalogo?tipo=color', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://contactgo.net/catalogo?tipo=solucion', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: 'https://contactgo.net/catalogo?tipo=gota', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: 'https://contactgo.net/marca/acuvue', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://contactgo.net/marca/alcon', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://contactgo.net/marca/bausch-lomb', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://contactgo.net/marca/coopervision', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: 'https://contactgo.net/envios-y-entregas', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    ...productUrls,
  ]
}
