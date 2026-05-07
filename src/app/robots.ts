export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/checkout', '/cart', '/cuenta'] },
    ],
    sitemap: 'https://contactgo.net/sitemap.xml',
  }
}
