import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function sitemap() {
  const sb = createServerSupabaseClient()

  const [{ data: products }, { data: blogs }] = await Promise.all([
    sb.from('products').select('slug, id, updated_at').eq('activo', true),
    sb.from('blog_posts').select('slug, updated_at').eq('activo', true).catch(() => ({ data: null })) as any,
  ])

  const now = new Date()

  // Páginas estáticas principales
  const staticPages = [
    { url: 'https://contactgo.net',                            priority: 1.0, freq: 'daily'   },
    { url: 'https://contactgo.net/catalogo',                   priority: 0.95, freq: 'daily'  },
    { url: 'https://contactgo.net/receta',                     priority: 0.85, freq: 'weekly' },
    { url: 'https://contactgo.net/sugeridos',                  priority: 0.75, freq: 'weekly' },

    // Marcas
    { url: 'https://contactgo.net/marca/acuvue',               priority: 0.85, freq: 'weekly' },
    { url: 'https://contactgo.net/marca/alcon',                priority: 0.85, freq: 'weekly' },
    { url: 'https://contactgo.net/marca/bausch-lomb',          priority: 0.85, freq: 'weekly' },
    { url: 'https://contactgo.net/marca/coopervision',         priority: 0.85, freq: 'weekly' },

    // Tipos de lentes — URLs semánticas de alta intención
    { url: 'https://contactgo.net/catalogo?tipo=esferico',     priority: 0.80, freq: 'weekly' },
    { url: 'https://contactgo.net/catalogo?tipo=torico',       priority: 0.80, freq: 'weekly' },
    { url: 'https://contactgo.net/catalogo?tipo=multifocal',   priority: 0.80, freq: 'weekly' },
    { url: 'https://contactgo.net/catalogo?tipo=color',        priority: 0.75, freq: 'weekly' },
    { url: 'https://contactgo.net/catalogo?tipo=solucion',     priority: 0.65, freq: 'weekly' },
    { url: 'https://contactgo.net/catalogo?tipo=gota',         priority: 0.65, freq: 'weekly' },

    // Blog
    { url: 'https://contactgo.net/blog',                       priority: 0.75, freq: 'weekly' },
    { url: 'https://contactgo.net/blog/tipos-de-lentes-de-contacto',             priority: 0.70, freq: 'monthly' },
    { url: 'https://contactgo.net/blog/como-leer-tu-receta',                     priority: 0.70, freq: 'monthly' },
    { url: 'https://contactgo.net/blog/como-poner-lentes-de-contacto',           priority: 0.70, freq: 'monthly' },

    // Ayuda e info
    { url: 'https://contactgo.net/envios-y-entregas',          priority: 0.65, freq: 'monthly' },
    { url: 'https://contactgo.net/ayuda/envios',               priority: 0.60, freq: 'monthly' },
    { url: 'https://contactgo.net/ayuda/devoluciones',         priority: 0.60, freq: 'monthly' },
    { url: 'https://contactgo.net/faq',                        priority: 0.65, freq: 'monthly' },
    { url: 'https://contactgo.net/seguridad',                  priority: 0.55, freq: 'monthly' },
    { url: 'https://contactgo.net/sobre-nosotros',             priority: 0.60, freq: 'monthly' },
    { url: 'https://contactgo.net/terminos',                   priority: 0.40, freq: 'yearly'  },
    { url: 'https://contactgo.net/privacidad',                 priority: 0.40, freq: 'yearly'  },
  ]

  const staticUrls = staticPages.map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: p.freq as any,
    priority: p.priority,
  }))

  // Productos — URL canónica con slug SEO-friendly
  const productUrls = (products ?? []).map(p => ({
    url: `https://contactgo.net/producto/${p.slug || p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Blog dinámico (si existe tabla)
  const blogUrls = (blogs ?? []).map((b: any) => ({
    url: `https://contactgo.net/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.70,
  }))

  return [...staticUrls, ...productUrls, ...blogUrls]
}
