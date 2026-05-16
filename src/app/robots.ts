import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/cart', '/cuenta', '/confirmacion', '/azul-retorno', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai'],
        disallow: '/',
      },
    ],
    host: 'https://contactgo.net',
    sitemap: 'https://contactgo.net/sitemap.xml',
  }
}
