/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',   value: 'nosniff' },
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Strict-Transport-Security',value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control',   value: 'on' },
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
