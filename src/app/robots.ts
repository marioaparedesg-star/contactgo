export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/checkout', '/carrito', '/cuenta'] },
    ],
    sitemap: 'https://contactgo.net/sitemap.xml',
  }
}
