/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Imágenes: WebP automático + lazy loading ──────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },

  // ── Headers de caché y seguridad ─────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache agresivo para assets estáticos
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache para páginas estáticas
        source: '/(ayuda|blog|sobre-nosotros|faq|terminos|privacidad|seguridad)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  // ── Redirects UUID → slug ────────────────────────────────
  async redirects() {
    return [
      { source: '/producto/3354386b-96df-4593-9af2-16ee0e0581f1', destination: '/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana', permanent: true },
      { source: '/producto/1c7e69fd-5371-4f75-9d9d-07db9fb1de9c', destination: '/producto/acuvue-2-lentes-contacto-quincenales-dominicana', permanent: true },
      { source: '/producto/3e16a63f-9155-470c-8800-6bf8ceaa3a20', destination: '/producto/acuvue-oasys-lentes-contacto-silicona-hidrogel-dominicana', permanent: true },
      { source: '/producto/35b075f1-1ce9-4296-b3ef-ea7086978a00', destination: '/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana', permanent: true },
      { source: '/producto/443a5dc1-b5bd-4054-acc2-22c5837cfc3d', destination: '/producto/bausch-lomb-ultra-lentes-contacto-mensuales-dominicana', permanent: true },
      { source: '/producto/90c7c9a8-215b-4d33-bed4-98391e467ea7', destination: '/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana', permanent: true },
      { source: '/producto/79466c40-55a8-4be4-9d6d-aac9c63beff3', destination: '/producto/clariti-1-day-lentes-contacto-diarios-dominicana', permanent: true },
      { source: '/producto/1b993e48-0d6d-422e-b2c4-6f323474c6b0', destination: '/producto/acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana', permanent: true },
      { source: '/producto/f30224fe-63aa-4d58-a2e0-94a02145c763', destination: '/producto/acuvue-oasys-for-astigmatism-lentes-toricos-dominicana', permanent: true },
      { source: '/producto/3213461e-593a-460b-81d6-4a5fe9980dda', destination: '/producto/avaira-vitality-toric-lentes-astigmatismo-dominicana', permanent: true },
      { source: '/producto/157d4891-7c8f-4604-9a88-032e50407e25', destination: '/producto/biofinity-toric-lentes-astigmatismo-coopervision-dominicana', permanent: true },
      { source: '/producto/dee8eae6-dcd5-4643-8717-90cf40e84d90', destination: '/producto/biofinity-xr-toric-lentes-alta-graduacion-dominicana', permanent: true },
      { source: '/producto/1bb50c75-adae-43e8-bea0-9fe2ca3be3e4', destination: '/producto/acuvue-oasys-presbyopia-lentes-multifocales-presbicia-dominicana', permanent: true },
      { source: '/producto/e5716c37-34fe-4410-91a7-cbe2bbf5058d', destination: '/producto/air-optix-colors-lentes-contacto-color-dominicana', permanent: true },
      { source: '/producto/e5f21c08-3df4-4586-bcd7-e543dac7e69b', destination: '/producto/color-view-lentes-contacto-cosmeticos-dominicana', permanent: true },
      { source: '/producto/a94c0bdf-ed80-468c-97fc-419dcb800a79', destination: '/producto/freshlook-colorblends-lentes-contacto-color-dominicana', permanent: true },
      { source: '/producto/460a37bd-f285-4632-8e37-9046d2eccab7', destination: '/producto/lunare-tri-kolor-lentes-contacto-color-dominicana', permanent: true },
      { source: '/producto/9ab3a86f-6dee-44e8-8453-8b992c2943dd', destination: '/producto/dream-eye-solucion-lentes-contacto-dominicana', permanent: true },
      { source: '/producto/d5acc50f-3882-4146-88dd-2511b4689828', destination: '/producto/opti-free-puremoist-solucion-multiprop%C3%B3sito-dominicana', permanent: true },
      { source: '/producto/b4535d57-d3c2-489a-a807-a3d0d1601a38', destination: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana', permanent: true },
      { source: '/producto/2e0e3b22-17ff-4015-92b7-6e15c07bf0bb', destination: '/producto/renu-advanced-solucion-lentes-contacto-bausch-dominicana', permanent: true },
      { source: '/producto/eec58d83-f2cb-4eff-9707-1ea97785f76a', destination: '/producto/sprainer-solucion-espumosa-lentes-contacto-dominicana', permanent: true },
      { source: '/producto/db613616-b8ac-4780-bab1-fb3a6cd1f517', destination: '/producto/frigine-gotas-lubricantes-ojos-dominicana', permanent: true },
      { source: '/producto/5c387841-cff8-4310-82b6-d353a2998ade', destination: '/producto/humylub-ofteno-gotas-ojos-lubricantes-dominicana', permanent: true },
      { source: '/producto/8d104f30-a24b-4cfe-945d-0064a0549b66', destination: '/producto/humylub-ofteno-pf-gotas-preservante-dominicana', permanent: true },
      { source: '/producto/390bf77a-8dc8-45f4-9b23-ecf193444dc1', destination: '/producto/lagricel-ofteno-lubricante-ocular-dominicana', permanent: true },
      { source: '/producto/c1cba9d6-fef8-4dd1-b682-eb47bb24de23', destination: '/producto/manzanilla-sophia-gotas-ojos-naturales-dominicana', permanent: true },
      { source: '/producto/d4e35f32-0458-41e7-ba36-a967a83e8625', destination: '/producto/prolub-ofteno-gotas-lubricantes-oculares-dominicana', permanent: true },
      { source: '/producto/50b3c325-6f0d-4827-9e8a-0b8fd9784fbd', destination: '/producto/refresh-optive-advanced-gotas-ojos-secos-dominicana', permanent: true },
      { source: '/producto/ad61a65b-0392-4724-a2fb-bdecf199f673', destination: '/producto/refresh-optive-lubricant-gotas-oculares-dominicana', permanent: true },
      { source: '/producto/c7140f09-8e27-4263-8712-0cfe9e474ac9', destination: '/producto/refresh-tears-gotas-lubricantes-ojos-dominicana', permanent: true },
      { source: '/producto/dab7dab9-fff7-4301-af6b-7d332a2966d5', destination: '/producto/splash-tears-gotas-lubricantes-oculares-dominicana', permanent: true },
      { source: '/producto/c075e481-9aa9-4346-a73d-ae46dd73341f', destination: '/producto/systane-ultra-gotas-ojos-secos-alcon-dominicana', permanent: true },
    ]
  }
}

export default nextConfig
