import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/ui/BottomNav'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CookieConsent from '@/components/ui/CookieConsent'
import { Toaster } from 'react-hot-toast'
import WelcomePopup from '@/components/ui/WelcomePopup'
import ScrollToTop from '@/components/ui/ScrollToTop'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.contactgo.net'),
  title: 'ContactGo | Lentes de Contacto en RD',
  manifest: '/manifest.json',


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
  description: 'Compra lentes de contacto originales en RD. Acuvue, Air Optix, Biofinity y más. Envío 24-48h a Santo Domingo, Santiago y todo el país. Tóricos, multifocales y color.',
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
    images: [{ url: '/og-1200x630.png', width: 1200, height: 630, alt: 'ContactGo — Lentes de Contacto RD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContactGo | Lentes de Contacto en RD',
    description: 'Lentes de contacto con envío en 24-48h en República Dominicana.',
    images: ['https://www.contactgo.net/og-1200x630.png'],
  },
}

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Necesario para que env(safe-area-inset-bottom) funcione en iPhone notch
  viewportFit: 'cover' as const,
}



const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": "https://www.contactgo.net/#organization",
  "name": "ContactGo",
  "url": "https://www.contactgo.net",
  "logo": "https://www.contactgo.net/og-1200x630.png",
  "image": "https://www.contactgo.net/og-1200x630.png",
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
  "paymentAccepted": "Tarjeta de crédito/débito Visa y Mastercard procesada por AZUL (Banco Popular)",
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
    "target": "https://www.contactgo.net/catalogo?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="lESKC-PqCyerfH9lDLzKi1em3nnRvh7LwKXKuPOmn1k" />
        

        <meta name="facebook-domain-verification" content="521fb5uvf0p1bbtgc59jz9j7fumekg" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://atendbjolicwcsqfyiyh.supabase.co" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.resend.com" />
        {/* Google Tag Manager — GTM-M9GZGJJQ */}
      
        {/* Microsoft Clarity — usando next/script para garantizar carga */}
      </head>
      <body>
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">Ir al contenido principal</a>
        {/* GTM noscript fallback */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M9GZGJJQ" height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>

                {/* Polyfill webkit.messageHandlers — Facebook iOS In-App Browser */}
        <Script
          id="webkit-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `try{if(window.webkit&&!window.webkit.messageHandlers)window.webkit.messageHandlers={}}catch(e){}` }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M9GZGJJQ');` }}
        />

        {/* ── Google Ads — AW-830060688 ────────────────────────────────────── */}
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-830060688"
        />
        <Script
          id="google-ads-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-830060688');
          ` }}
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

        {/* Meta Pixel — ID: 1516674003159165 */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1516674003159165');
            fbq('track', 'PageView');
          `}}
        />
        <noscript>
          <img height="1" width="1" alt="" role="presentation" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1516674003159165&ev=PageView&noscript=1"
          />
        </noscript>
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
