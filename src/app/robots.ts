import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ['/admin', '/M1Alexander', '/checkout', '/cart', '/cuenta', '/confirmacion', '/recibo', '/azul-retorno', '/api/']

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      { userAgent: ['Googlebot', 'Googlebot-Image'], allow: ['/api/feed/google', '/'], disallow: privatePaths },
      // Permitir rastreo de búsqueda y respuestas iniciadas por usuarios; no autorizar entrenamiento general.
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: privatePaths },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: privatePaths },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: privatePaths },
      { userAgent: 'Claude-User', allow: '/', disallow: privatePaths },
      { userAgent: ['ClaudeBot', 'anthropic-ai', 'CCBot'], disallow: '/' },
      { userAgent: 'PerplexityBot', allow: '/', disallow: privatePaths },
      { userAgent: 'Google-Extended', allow: '/', disallow: privatePaths },
    ],
    host: 'https://www.contactgo.net',
    sitemap: 'https://www.contactgo.net/sitemap.xml',
  }
}
