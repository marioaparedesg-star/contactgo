/** @type {import('next').NextConfig} */

// Content Security Policy — permite Supabase, GTM, Meta Pixel, AZUL, Resend
const csp = [
  "default-src 'self'",
  // Scripts: self + GTM + Meta Pixel + inline (Next.js necesita unsafe-inline)
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://pruebas.azul.com.do https://pagos.azul.com.do https://www.clarity.ms https://*.clarity.ms https://maps.googleapis.com https://maps.gstatic.com",
  // Estilos: self + inline (Tailwind genera estilos inline)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://maps.googleapis.com",
  // Fuentes
  "font-src 'self' https://fonts.gstatic.com",
  // Imágenes: self + Supabase Storage + Google + Facebook + data URIs
  "img-src 'self' data: blob: https://atendbjolicwcsqfyiyh.supabase.co https://*.supabase.co https://atendbjolicwcsqfyiyh.supabase.co/storage https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://pixel.wp.com https://contactgo.net https://www.contactgo.net https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com",
  // Conexiones API: self + Supabase + GA + AZUL + Resend
  "connect-src 'self' https://atendbjolicwcsqfyiyh.supabase.co wss://atendbjolicwcsqfyiyh.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://pruebas.azul.com.do https://pagos.azul.com.do https://api.resend.com https://e.clarity.ms https://*.clarity.ms https://maps.googleapis.com https://*.googleapis.com https://www.facebook.com https://connect.facebook.net",
  // Frames: AZUL necesita poder renderizar en frame para su portal de pago
  "frame-src 'self' https://pruebas.azul.com.do https://pagos.azul.com.do https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  // Forms: puede hacer POST a AZUL
  "form-action 'self' https://pruebas.azul.com.do https://pagos.azul.com.do",
  // Media
  "media-src 'self'",
  // Workers
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
    instrumentationHook: true,
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
      // Aliases de rutas
      { source: '/login',          destination: '/cuenta', permanent: true },
      { source: '/carrito',        destination: '/cart',   permanent: true },
      { source: '/signin',         destination: '/cuenta', permanent: true },
      { source: '/iniciar-sesion', destination: '/cuenta', permanent: true },
      { source: '/register',       destination: '/cuenta', permanent: true },
      { source: '/registro',       destination: '/cuenta', permanent: true },
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
      // Catálogo e home: ISR 60s → CDN cachea 60s
      {
        source: '/',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
        ],
      },
      {
        source: '/catalogo',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
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
