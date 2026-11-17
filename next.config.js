/** @type {import('next').NextConfig} */

// Content Security Policy — permite Supabase, GTM, Meta Pixel, AZUL, Resend, X Ads
// 2026-08-02: agregados apis.google.com y www.gstatic.com — el survey opt-in
// (GoogleCustomerReviews.tsx) y la insignia de vendedor (GoogleSellerRatingBadge.tsx)
// llevaban semanas "implementados" pero el CSP nunca los dejaba cargar: el navegador
// bloqueaba ambos scripts en silencio (sin error visible en la página, solo en la
// consola) porque sus dominios no estaban en la lista blanca. Confirmado con
// curl -I contra contactgo.net: el header content-security-policy no traía ni
// apis.google.com ni www.gstatic.com (solo maps.gstatic.com, un subdominio distinto).
const csp = [
  "default-src 'self'",
  // Scripts — GTM, Meta Pixel, Google Ads, Cloudflare Insights, X (Twitter) Ads pixel,
  // Google Customer Reviews (apis.google.com = survey opt-in, gstatic.com = merchant widget)
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://pruebas.azul.com.do https://pagos.azul.com.do https://www.clarity.ms https://*.clarity.ms https://maps.googleapis.com https://maps.gstatic.com https://apis.google.com https://www.gstatic.com https://googleads.g.doubleclick.net https://static.cloudflareinsights.com https://www.googleadservices.com https://static.ads-twitter.com",
  // Estilos
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://maps.googleapis.com",
  // Fuentes
  "font-src 'self' https://fonts.gstatic.com",
  // Imágenes — Google Ads, Clarity GIF, DoubleClick, Bing (Clarity sync), X Ads (pixel de conversión vía imagen)
  "img-src 'self' data: blob: https://atendbjolicwcsqfyiyh.supabase.co https://*.supabase.co https://atendbjolicwcsqfyiyh.supabase.co/storage https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://pixel.wp.com https://contactgo.net https://www.contactgo.net https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com https://googleads.g.doubleclick.net https://www.google.com https://c.clarity.ms https://*.clarity.ms https://www.googleadservices.com https://c.bing.com https://*.cdninstagram.com https://*.instagram.com https://*.xx.fbcdn.net https://t.co https://analytics.twitter.com https://ads-twitter.com https://ads-api.twitter.com",
  // Conexiones — Google Ads (DoubleClick), CAPI FB, Google Ads remarketing, Google Merchant Center,
  // Google Customer Reviews (apis.google.com, gstatic.com), X Ads pixel/API
  "connect-src 'self' https://atendbjolicwcsqfyiyh.supabase.co wss://atendbjolicwcsqfyiyh.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://pruebas.azul.com.do https://pagos.azul.com.do https://api.resend.com https://e.clarity.ms https://*.clarity.ms https://maps.googleapis.com https://*.googleapis.com https://apis.google.com https://www.gstatic.com https://www.facebook.com https://connect.facebook.net https://ad.doubleclick.net https://googleads.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://region1.google-analytics.com https://*.sentry.io https://*.ingest.us.sentry.io https://t.co https://analytics.twitter.com https://ads-twitter.com https://ads-api.twitter.com https://www.merchant-center-analytics.goog https://stats.g.doubleclick.net",
  // Frames — AZUL, GTM, y Google Customer Reviews (survey opt-in + merchant widget
  // renderizan su UI dentro de iframes servidos desde google.com/gstatic.com)
  "frame-src 'self' https://pruebas.azul.com.do https://pagos.azul.com.do https://www.googletagmanager.com https://www.google.com https://www.gstatic.com",
  "frame-ancestors 'self'",
  "form-action 'self' https://pruebas.azul.com.do https://pagos.azul.com.do",
  "media-src 'self'",
  "worker-src 'self' blob:",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options',             value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',      value: 'nosniff' },
  { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',          value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security',   value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control',      value: 'on' },
  { key: 'Cross-Origin-Opener-Policy',  value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
  { key: 'Content-Security-Policy',     value: csp },
]

const nextConfig = {
  poweredByHeader: false,
  eslint: {
    // ESLint runs in CI (GitHub Actions). Not in Vercel build.
    // This prevents existing legacy warnings from blocking production deploys.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors are caught in CI typecheck step
    ignoreBuildErrors: false, // Keep TS errors blocking (they're real bugs)
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    // Next.js Image Optimization habilitado — WebP/AVIF automático
    formats: ['image/avif', 'image/webp'],
    // CRÍTICO-2: deviceSizes reducidos de 7 a 4 (-43% optimizaciones)
    // RD es mobile-first (390px) con pantallas hasta 1200px
    deviceSizes: [390, 640, 828, 1200],
    imageSizes: [32, 64, 128, 256],
    // CRÍTICO-2: TTL de 30 días — imágenes Supabase son estáticas (versionadas con -v2, -v3)
    // Antes: 3600 (1 hora) → quota agotada en 2 días
    // Ahora: 2592000 (30 días) → 36 PDPs × 4 sizes × 2 formatos = 288 optimizaciones/mes total
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'atendbjolicwcsqfyiyh.supabase.co' },
      { protocol: 'https', hostname: 'www.contactgo.net' },
      { protocol: 'https', hostname: 'contactgo.net' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      // www redirect — 301 permanente (fix 307 temporal)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'contactgo.net' }],
        destination: 'https://www.contactgo.net/:path*',
        permanent: true,
      },
      // Slugs rotos → slugs correctos
      {
        source: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana',
        destination: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana',
        permanent: true,
      },
      {
        source: '/producto/1-day-acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana',
        destination: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana',
        permanent: true,
      },
      { source: '/producto/3354386b-96df-4593-9af2-16ee0e0581f1', destination: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana', permanent: true },
      { source: '/producto/1c7e69fd-5371-4f75-9d9d-07db9fb1de9c', destination: '/catalogo', permanent: true },
      { source: '/producto/3e16a63f-9155-470c-8800-6bf8ceaa3a20', destination: '/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana', permanent: true },
      { source: '/producto/35b075f1-1ce9-4296-b3ef-ea7086978a00', destination: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana', permanent: true },
      { source: '/producto/443a5dc1-b5bd-4054-acc2-22c5837cfc3d', destination: '/producto/bausch-lomb-ultra-lentes-contacto-mensuales-dominicana', permanent: true },
      { source: '/producto/90c7c9a8-215b-4d33-bed4-98391e467ea7', destination: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana', permanent: true },
      { source: '/producto/79466c40-55a8-4be4-9d6d-aac9c63beff3', destination: '/producto/clariti-1-day-lentes-contacto-diarios-dominicana', permanent: true },
      { source: '/producto/1b993e48-0d6d-422e-b2c4-6f323474c6b0', destination: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', permanent: true },
      { source: '/producto/f30224fe-63aa-4d58-a2e0-94a02145c763', destination: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', permanent: true },
      { source: '/producto/3213461e-593a-460b-81d6-4a5fe9980dda', destination: '/producto/avaira-vitality-toric-lentes-astigmatismo-dominicana', permanent: true },
      { source: '/producto/157d4891-7c8f-4604-9a88-032e50407e25', destination: '/producto/biofinity-toric-lentes-astigmatismo-coopervision-dominicana', permanent: true },
      { source: '/producto/dee8eae6-dcd5-4643-8717-90cf40e84d90', destination: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana', permanent: true },
      { source: '/producto/1bb50c75-adae-43e8-bea0-9fe2ca3be3e4', destination: '/producto/acuvue-oasys-multifocal-lentes-contacto-dominicana', permanent: true },
      { source: '/producto/e5716c37-34fe-4410-91a7-cbe2bbf5058d', destination: '/producto/air-optix-colors-lentes-contacto-color-dominicana', permanent: true },
      { source: '/producto/e5f21c08-3df4-4586-bcd7-e543dac7e69b', destination: '/catalogo', permanent: true },
      { source: '/producto/a94c0bdf-ed80-468c-97fc-419dcb800a79', destination: '/catalogo', permanent: true },
      { source: '/producto/460a37bd-f285-4632-8e37-9046d2eccab7', destination: '/catalogo', permanent: true },
      { source: '/producto/9ab3a86f-6dee-44e8-8453-8b992c2943dd', destination: '/producto/dream-eye-solucion-lentes-contacto-dominicana', permanent: true },
      { source: '/producto/d5acc50f-3882-4146-88dd-2511b4689828', destination: '/producto/opti-free-puremoist-solucion-multiproposito-dominicana', permanent: true },
      { source: '/producto/b4535d57-d3c2-489a-a807-a3d0d1601a38', destination: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana', permanent: true },
      { source: '/producto/2e0e3b22-17ff-4015-92b7-6e15c07bf0bb', destination: '/catalogo', permanent: true },
      { source: '/producto/eec58d83-f2cb-4eff-9707-1ea97785f76a', destination: '/producto/sprainer-solucion-espumosa-lentes-contacto-dominicana', permanent: true },
      { source: '/producto/db613616-b8ac-4780-bab1-fb3a6cd1f517', destination: '/catalogo', permanent: true },
      { source: '/producto/5c387841-cff8-4310-82b6-d353a2998ade', destination: '/catalogo', permanent: true },
      { source: '/producto/8d104f30-a24b-4cfe-945d-0064a0549b66', destination: '/catalogo', permanent: true },
      { source: '/producto/390bf77a-8dc8-45f4-9b23-ecf193444dc1', destination: '/catalogo', permanent: true },
      { source: '/producto/c1cba9d6-fef8-4dd1-b682-eb47bb24de23', destination: '/catalogo', permanent: true },
      { source: '/producto/d4e35f32-0458-41e7-ba36-a967a83e8625', destination: '/catalogo', permanent: true },
      { source: '/producto/50b3c325-6f0d-4827-9e8a-0b8fd9784fbd', destination: '/catalogo', permanent: true },
      { source: '/producto/ad61a65b-0392-4724-a2fb-bdecf199f673', destination: '/catalogo', permanent: true },
      { source: '/producto/c7140f09-8e27-4263-8712-0cfe9e474ac9', destination: '/catalogo', permanent: true },
      { source: '/producto/dab7dab9-fff7-4301-af6b-7d332a2966d5', destination: '/catalogo', permanent: true },
      { source: '/producto/c075e481-9aa9-4346-a73d-ae46dd73341f', destination: '/catalogo', permanent: true },
      { source: '/producto/acuvue-2-lentes-contacto-quincenales-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/bausch-lomb-ultra', destination: '/producto/bausch-lomb-ultra-lentes-contacto-mensuales-dominicana', permanent: true },
      { source: '/producto/biofinity-xr-lentes-alta-graduacion-dominicana', destination: '/producto/biofinity-xr-lentes-contacto-alta-graduacion-esferica-dominicana', permanent: true },
      { source: '/producto/biofinity-xr-toric-lentes-alta-graduacion-astigmatismo-dominicana', destination: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana', permanent: true },
      { source: '/producto/biotrue-oneday-lentes-contacto-diarios-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/dailies-total-1', destination: '/catalogo', permanent: true },
      { source: '/producto/lunare-tri-kolor-lentes-color-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/lunare-tri-kolor-lentes-contacto-color-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/proclear-multifocal-lentes-presbicia-mensual-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/proclear-multifocal-xr-lentes-presbicia-alta-graduacion-dominicana', destination: '/catalogo', permanent: true },
      { source: '/producto/proclear-sphere-lentes-contacto-mensuales-dominicana', destination: '/catalogo', permanent: true },
      // Aliases de rutas
      { source: '/login',          destination: '/cuenta', permanent: true },
      { source: '/carrito',        destination: '/cart',   permanent: true },
      { source: '/signin',         destination: '/cuenta', permanent: true },
      { source: '/iniciar-sesion', destination: '/cuenta', permanent: true },
      { source: '/register',       destination: '/cuenta', permanent: true },
      { source: '/registro',       destination: '/cuenta', permanent: true },
      // Rutas alternativas que usuarios buscan
      { source: '/inicio',         destination: '/',       permanent: true },
      { source: '/home',           destination: '/',       permanent: true },
      { source: '/tienda',         destination: '/catalogo', permanent: true },
      { source: '/lentes',         destination: '/catalogo', permanent: true },
      { source: '/pedidos',        destination: '/cuenta', permanent: true },
      { source: '/auth/login',     destination: '/cuenta', permanent: true },
      { source: '/auth/registro',  destination: '/cuenta', permanent: true },
      { source: '/mis-pedidos',    destination: '/cuenta', permanent: true },
      { source: '/mi-cuenta',      destination: '/cuenta', permanent: true },
      { source: '/checkout/cart',  destination: '/cart',   permanent: true },
      { source: '/blog/como-leer-tu-receta', destination: '/blog/como-leer-receta-optica-rd', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source: '/(cart|checkout|cuenta|confirmacion|recibo)(/.*)?',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin/login',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      // CRÍTICO-3: CDN-Cache-Control para Cloudflare — permite caché edge en páginas ISR
      // Cloudflare respeta CDN-Cache-Control sobre Cache-Control
      // PDPs: ISR 300s → CDN cachea 300s, revalida sin bloquear
      {
        source: '/producto/:slug',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      // Catálogo e home: ISR 10 min → CDN cachea 10 min
      {
        source: '/',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=1200' },
        ],
      },
      {
        source: '/catalogo',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=1200' },
        ],
      },
      // Blog: estático → cachea 24h
      {
        source: '/blog/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=3600' },
        ],
      },
      // Páginas SEO de lentes de contacto: ISR → cachea 5min
      {
        source: '/lentes-de-contacto/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ]
  },
}

// Sentry — wrapper oficial del wizard
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(nextConfig, {
  org: "contactgo",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
