import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/ui/BottomNav'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CookieConsent from '@/components/ui/CookieConsent'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.contactgo.net'),
  title: 'ContactGo — Lentes de Contacto RD',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ContactGo',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  description: 'Compra lentes de contacto en República Dominicana con envío en 24-48h. Acuvue, Air Optix, FreshLook, Biofinity. Lentes para miopía, astigmatismo y multifocales. Entrega a domicilio en Santo Domingo, Santiago y todo RD.',
  authors: [{ name: 'ContactGo', url: 'https://www.contactgo.net' }],
  creator: 'ContactGo',
  publisher: 'ContactGo',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },

  openGraph: {
    type: 'website',
    locale: 'es_DO',
    title: 'ContactGo — Lentes de Contacto en República Dominicana',
    description: 'Compra lentes de contacto en RD con envío en 24-48h. Acuvue, Air Optix, FreshLook y más marcas premium.',
    url: 'https://www.contactgo.net',
    siteName: 'ContactGo',
    images: [{ url: '/og-1200x630.svg', width: 512, height: 512, alt: 'ContactGo — Lentes de Contacto RD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContactGo — Lentes de Contacto RD',
    description: 'Lentes de contacto con envío en 24-48h en República Dominicana.',
    images: ['https://www.contactgo.net/og-1200x630.svg'],
  },
}



const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": "https://contactgo.net/#organization",
  "name": "ContactGo",
  "url": "https://www.contactgo.net",
  "logo": "https://www.contactgo.net/og-1200x630.svg",
  "image": "https://www.contactgo.net/og-1200x630.svg",
  "description": "Tienda online especializada en lentes de contacto y soluciones oftálmicas en República Dominicana. Entrega a domicilio en 24-48 horas.",
  "telephone": "+18294728328",
  "email": "info@contactgo.net",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "DO",
    "addressRegion": "Santo Domingo"
  },
  "areaServed": {
    "@type": "Country",
    "name": "República Dominicana"
  },
  "priceRange": "RD$500 - RD$15,000",
  "currenciesAccepted": "DOP",
  "paymentAccepted": "Tarjeta de crédito, débito, PayPal, transferencia bancaria, efectivo contra entrega",
  "sameAs": [
    "https://www.instagram.com/contactgord",
    "https://www.facebook.com/profile.php?id=1063834443484441"
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ContactGo",
  "url": "https://www.contactgo.net",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://contactgo.net/catalogo?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="lESKC-PqCyerfH9lDLzKi1em3nnRvh7LwKXKuPOmn1k" />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ContactGo",
          "url": "https://www.contactgo.net",
          "logo": "https://contactgo.net/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-829-472-8328",
            "contactType": "customer service",
            "availableLanguage": "Spanish",
            "contactOption": "TollFree"
          },
          "sameAs": [
            "https://www.instagram.com/contactgord",
            "https://www.facebook.com/contactgord"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DO",
            "addressRegion": "Distrito Nacional",
            "addressLocality": "Santo Domingo"
          }
        })}} />
        <meta name="facebook-domain-verification" content="521fb5uvf0p1bbtgc59jz9j7fumekg" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://atendbjolicwcsqfyiyh.supabase.co" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preload" as="image" href="/hero-lens-1.png" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
        {/* Google Tag Manager — GTM-M9GZGJJQ */}
      
        {/* Microsoft Clarity — usando next/script para garantizar carga */}
      </head>
      <body>
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">Ir al contenido principal</a>
        {/* GTM noscript fallback */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M9GZGJJQ" height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>

        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M9GZGJJQ');` }}
        />

        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wslp0l9vex");
          `}}
        />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        <BottomNav />
        <WhatsAppButton />
        <CookieConsent />
      <Analytics />
      <SpeedInsights />
        {/* Skip link accesibilidad WCAG */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Saltar al contenido principal
      </a>
      <Toaster
          position="top-center"
          toastOptions={{
            className: '!rounded-xl !shadow-soft !font-medium',
            success: { className: '!bg-primary-50 !text-primary-800 !border !border-primary-200' },
            error: { className: '!bg-red-50 !text-red-800 !border !border-red-200' },
          }}
        />
      </body>
    </html>
  )
}
