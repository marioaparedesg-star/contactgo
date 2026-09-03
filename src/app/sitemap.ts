import { createServerSupabaseClient } from '@/lib/supabase-server'
import fs from 'fs'
import path from 'path'

export default async function sitemap() {
  const sb = createServerSupabaseClient()

  const { data: products } = await sb.from('products').select('slug, id, updated_at').eq('activo', true)

  // Blog: los artículos son carpetas de rutas estáticas de Next.js (no hay
  // tabla blog_posts en la DB). Antes esta lista estaba escrita a mano y
  // solo cubría 40 de 159 artículos reales — 119 artículos (75%) nunca
  // entraban al sitemap y quedaban invisibles para Google. Ahora se lee
  // el directorio real en cada build, así que todo artículo nuevo entra
  // automáticamente sin tener que tocar este archivo.
  const blogDir = path.join(process.cwd(), 'src/app/blog')
  const blogSlugs = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('[') && !d.name.startsWith('_'))
    .map(d => d.name)

  const now = new Date()

  const staticUrls = [
    { url: 'https://www.contactgo.net',                                             priority: 1.00, changeFrequency: 'daily'   },
    { url: 'https://www.contactgo.net/catalogo',                                    priority: 0.95, changeFrequency: 'daily'   },
    { url: 'https://www.contactgo.net/lentes-de-contacto',                         priority: 0.95, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/receta',                                      priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/esfericos',                                   priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/toricos',                                     priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/multifocales',                                priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/color',                                       priority: 0.80, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/lentes-de-contacto-republica-dominicana',     priority: 0.95, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/gotas',                                      priority: 0.75, changeFrequency: 'weekly' as const },
    { url: 'https://www.contactgo.net/soluciones',                                  priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/acuvue',                                priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/alcon',                                 priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/bausch-lomb',                           priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/coopervision',                          priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/faq',  priority: 0.65, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog',                                        priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/lentes-de-contacto/santo-domingo', priority: 0.85, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/lentes-de-contacto/santiago',      priority: 0.85, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/lentes-de-contacto/punta-cana',    priority: 0.80, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/referidos', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: 'https://www.contactgo.net/resenas',                                     priority: 0.80, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/autor/equipo-contactgo', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: 'https://www.contactgo.net/sobre-nosotros',                              priority: 0.60, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/envios-y-entregas',                           priority: 0.65, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/devoluciones',                                priority: 0.55, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/seguridad',                                   priority: 0.55, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/terminos',                                    priority: 0.40, changeFrequency: 'yearly'  },
    { url: 'https://www.contactgo.net/privacidad',                                  priority: 0.40, changeFrequency: 'yearly'  },
  ].map(p => ({
    url: p.url,
    lastModified: new Date('2026-05-28'),
    changeFrequency: p.changeFrequency as any,
    priority: p.priority,
  }))

  const productUrls = (products ?? []).map(p => ({
    url: `https://www.contactgo.net/producto/${p.slug || p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const blogUrls = blogSlugs.map((slug) => ({
    url: `https://www.contactgo.net/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.70,
  }))

  return [...staticUrls, ...productUrls, ...blogUrls]
}
