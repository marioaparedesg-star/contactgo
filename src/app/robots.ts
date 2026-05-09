export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/checkout',
          '/cart',
          '/carrito',
          '/cuenta',
          '/confirmacion',
          '/azul-retorno',
          '/api/',
        ],
      },
      {
        // Bloquear bots agresivos de IA
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai'],
        disallow: '/',
      },
    ],
    sitemap: 'https://contactgo.net/sitemap.xml',
    host: 'https://contactgo.net',
  }
}
