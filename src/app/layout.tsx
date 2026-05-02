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
  alternates: { canonical: 'https://contactgo.net' },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
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
