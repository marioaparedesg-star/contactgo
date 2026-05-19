import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/cart', '/cuenta', '/confirmacion', '/recibo', '/azul-retorno', '/api/'],
      },
      // Permitir feed de Google Merchant para Google Shopping
      {
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: ['/api/feed/google', '/'],
        disallow: ['/admin', '/checkout', '/cart', '/cuenta', '/confirmacion', '/azul-retorno'],
      },
      // Bloquear bots de IA para training (pero permitir indexación en buscadores IA)
      {
        userAgent: ['GPTBot', 'CCBot', 'anthropic-ai'],
        disallow: '/',
      },
      // Google-Extended (Gemini) — permitir para aparecer en búsquedas de Gemini
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin', '/checkout', '/cart', '/cuenta', '/api/'],
      },
    ],
    host: 'https://contactgo.net',
    sitemap: 'https://www.contactgo.net/sitemap.xml',
  }
}
