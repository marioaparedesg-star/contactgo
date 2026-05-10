import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/ui/BottomNav'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
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
  keywords: 'lentes de contacto República Dominicana, lentes de contacto RD, comprar lentes de contacto, Acuvue República Dominicana, Air Optix RD, lentes para miopía RD, lentes tóricos astigmatismo, lentes multifocales, solución lentes de contacto, FreshLook colores, ContactGo, óptica online RD, lentes a domicilio Santo Domingo',
  authors: [{ name: 'ContactGo', url: 'https://contactgo.net' }],
  creator: 'ContactGo',
  publisher: 'ContactGo',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },

  openGraph: {
    type: 'website',
    locale: 'es_DO',
    title: 'ContactGo — Lentes de Contacto en República Dominicana',
    description: 'Compra lentes de contacto en RD con envío en 24-48h. Acuvue, Air Optix, FreshLook y más marcas premium.',
    url: 'https://contactgo.net',
    siteName: 'ContactGo',
    images: [{ url: 'https://contactgo.net/icon-512.png', width: 512, height: 512, alt: 'ContactGo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContactGo — Lentes de Contacto RD',
    description: 'Lentes de contacto con envío en 24-48h en República Dominicana.',
    images: ['https://contactgo.net/icon-512.png'],
  },
}



const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": "https://contactgo.net/#organization",
  "name": "ContactGo",
  "url": "https://contactgo.net",
  "logo": "https://contactgo.net/icon-512.png",
  "image": "https://contactgo.net/icon-512.png",
  "description": "Tienda online especializada en lentes de contacto y soluciones oftálmicas en República Dominicana. Entrega a domicilio en 24-48 horas.",
  "telephone": "+18294089097",
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
    "https://www.instagram.com/contactgo.rd",
    "https://www.facebook.com/contactgo.rd"
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ContactGo",
  "url": "https://contactgo.net",
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
      {/* Google Analytics — reemplaza G-KGM473ZPDB con tu Measurement ID */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-KGM473ZPDB" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KGM473ZPDB');
          `,
        }}
      />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
        </>}
        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && 
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');fbq('track','PageView');` }} />
        }
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        <BottomNav />
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
