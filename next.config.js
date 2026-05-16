/** @type {import('next').NextConfig} */

// Content Security Policy — permite Supabase, GTM, Meta Pixel, AZUL, Resend
const csp = [
  "default-src 'self'",
  // Scripts: self + GTM + Meta Pixel + inline (Next.js necesita unsafe-inline)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://pruebas.azul.com.do https://pagos.azul.com.do",
  // Estilos: self + inline (Tailwind genera estilos inline)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fuentes
  "font-src 'self' https://fonts.gstatic.com",
  // Imágenes: self + Supabase Storage + Google + Facebook + data URIs
  "img-src 'self' data: blob: https://atendbjolicwcsqfyiyh.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://pixel.wp.com",
  // Conexiones API: self + Supabase + GA + AZUL + Resend
  "connect-src 'self' https://atendbjolicwcsqfyiyh.supabase.co wss://atendbjolicwcsqfyiyh.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://pruebas.azul.com.do https://pagos.azul.com.do https://api.resend.com",
  // Frames: AZUL necesita poder renderizar en frame para su portal de pago
  "frame-src 'self' https://pruebas.azul.com.do https://pagos.azul.com.do https://www.googletagmanager.com",
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
  { key: 'Content-Security-Policy',     value: csp },
]

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'atendbjolicwcsqfyiyh.supabase.co' },
      { protocol: 'https', hostname: 'www.contactgo.net' },
      { protocol: 'https', hostname: 'contactgo.net' },
    ],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ]
  },
}

module.exports = nextConfig
