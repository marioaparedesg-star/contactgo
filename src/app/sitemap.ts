import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function sitemap() {
  const sb = createServerSupabaseClient()

  const { data: products } = await sb.from('products').select('slug, id, updated_at').eq('activo', true)

  let blogs: any[] | null = null
  try {
    const { data } = await sb.from('blog_posts').select('slug, updated_at').eq('activo', true)
    blogs = data
  } catch { blogs = null }

  const now = new Date()

  const staticUrls = [
    { url: 'https://contactgo.net',                                             priority: 1.00, changeFrequency: 'daily'   },
    { url: 'https://contactgo.net/catalogo',                                    priority: 0.95, changeFrequency: 'daily'   },
    { url: 'https://contactgo.net/lentes-de-contacto',                         priority: 0.95, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/receta',                                      priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/esfericos',                                   priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/toricos',                                     priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/multifocales',                                priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/color',                                       priority: 0.80, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/soluciones',                                  priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/marca/acuvue',                                priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/marca/alcon',                                 priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/marca/bausch-lomb',                           priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/marca/coopervision',                          priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/blog',                                        priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/blog/primeros-pasos-lentes-contacto-rd',      priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/lentes-de-contacto-para-astigmatismo-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/lentes-multifocales-presbicia-rd',       priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/biofinity-vs-acuvue-comparacion',        priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/ojos-secos-lentes-contacto',            priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/lentes-contacto-colores-rd',            priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/cuanto-duran-lentes-contacto',          priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/solucion-limpieza-lentes-contacto',     priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd', priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd',     priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/blog/como-leer-receta-optica-rd',            priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/resenas',                                     priority: 0.80, changeFrequency: 'weekly'  },
    { url: 'https://contactgo.net/sobre-nosotros',                              priority: 0.60, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/envios-y-entregas',                           priority: 0.65, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/devoluciones',                                priority: 0.55, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/seguridad',                                   priority: 0.55, changeFrequency: 'monthly' },
    { url: 'https://contactgo.net/terminos',                                    priority: 0.40, changeFrequency: 'yearly'  },
    { url: 'https://contactgo.net/privacidad',                                  priority: 0.40, changeFrequency: 'yearly'  },
  ].map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: p.changeFrequency as any,
    priority: p.priority,
  }))

  const productUrls = (products ?? []).map(p => ({
    url: `https://contactgo.net/producto/${p.slug || p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const blogUrls = (blogs ?? []).map((b: any) => ({
    url: `https://contactgo.net/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.70,
  }))

  return [...staticUrls, ...productUrls, ...blogUrls]
}
