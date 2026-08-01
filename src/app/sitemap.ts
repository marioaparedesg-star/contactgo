import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function sitemap() {
  const sb = createServerSupabaseClient()

  const { data: products } = await sb.from('products').select('slug, id, updated_at').eq('activo', true)

  // Blog: artículos son rutas estáticas Next.js, no tabla blog_posts (no existe en DB)
  const blogs: null = null

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
    { url: 'https://www.contactgo.net/blog/mejores-lentes-de-contacto-republica-dominicana-2026', priority: 0.85, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/suscripcion-mensual-lentes-contacto-como-funciona-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/cuanto-cuesta-un-ano-completo-lentes-contacto-rd', priority: 0.82, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/como-saber-si-lentes-contacto-son-originales-o-falsos-rd', priority: 0.80, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-contacto-para-eventos-fiestas-halloween-quinceanera-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/optica-fisica-vs-tienda-online-especializada-lentes-contacto-rd', priority: 0.78, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/regalar-lentes-contacto-idea-original-rd', priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/examen-visual-antes-de-comprar-lentes-contacto-rd', priority: 0.78, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-contacto-devolucion-cambio-graduacion-incorrecta-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/como-cambiar-optica-tradicional-a-compra-online-lentes-contacto-rd', priority: 0.78, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/mejor-momento-comprar-lentes-contacto-ahorrar-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-de-contacto-miopia-alta-graduacion-fuerte-rd', priority: 0.80, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-de-contacto-y-maquillaje-guia-completa', priority: 0.78, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/guia-principiantes-lentes-contacto-rd-2026', priority: 0.85, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/sensacion-arenilla-irritacion-lentes-contacto-causas', priority: 0.78, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/presbicia-despues-40-lentes-contacto-multifocales-vs-gafas', priority: 0.82, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/lentes-de-contacto-republica-dominicana',     priority: 0.95, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/gotas',                                      priority: 0.75, changeFrequency: 'weekly' as const },
    { url: 'https://www.contactgo.net/soluciones',                                  priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/acuvue',                                priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/alcon',                                 priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/bausch-lomb',                           priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/marca/coopervision',                          priority: 0.85, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/faq',  priority: 0.65, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog',                                        priority: 0.75, changeFrequency: 'weekly'  },
    { url: 'https://www.contactgo.net/blog/primeros-pasos-lentes-contacto-rd',      priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-de-contacto-para-astigmatismo-rd', priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-multifocales-presbicia-rd',       priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/biofinity-vs-acuvue-comparacion',        priority: 0.75, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/ojos-secos-lentes-contacto',            priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-contacto-colores-rd',            priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/cuanto-duran-lentes-contacto',          priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/solucion-limpieza-lentes-contacto',     priority: 0.70, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd', priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/cuanto-cuestan-lentes-contacto-rd',     priority: 0.72, changeFrequency: 'monthly' },
    { url: 'https://www.contactgo.net/blog/como-poner-lentes-de-contacto',      priority: 0.75, changeFrequency: 'monthly' as const },
  { url: 'https://www.contactgo.net/blog/tipos-de-lentes-de-contacto',          priority: 0.75, changeFrequency: 'monthly' as const },
  { url: 'https://www.contactgo.net/blog/como-leer-receta-optica-rd',            priority: 0.72, changeFrequency: 'monthly' },
  { url: 'https://www.contactgo.net/blog/dormir-con-lentes-contacto',             priority: 0.70, changeFrequency: 'monthly' },
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

  const blogUrls = (blogs ?? []).map((b: any) => ({
    url: `https://www.contactgo.net/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.70,
  }))

  return [...staticUrls, ...productUrls, ...blogUrls]
}
