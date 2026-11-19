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
import ReferralTracker from '@/components/ui/ReferralTracker'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.contactgo.net'),
  title: 'ContactGo — Tus lentes. En tu puerta.',
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
  description: 'ContactGo — La forma más fácil de comprar lentes de contacto en República Dominicana. ACUVUE, Air Optix, Biofinity y más. Directo del fabricante. Entrega en 24-48h a donde estés.',
  authors: [{ name: 'ContactGo', url: 'https://www.contactgo.net' }],
  creator: 'ContactGo',
  publisher: 'ContactGo',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },

  openGraph: {
    type: 'website',
    locale: 'es_DO',
    title: 'ContactGo — Tus lentes. En tu puerta.',
    description: 'La forma más fácil de comprar lentes de contacto en RD. Rápidos y directo a tu puerta.',
    url: 'https://www.contactgo.net',
    siteName: 'ContactGo',
    images: [{ url: '/og-1200x630.jpg', width: 1200, height: 630, alt: 'ContactGo — Lentes de Contacto RD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContactGo — Tus lentes. En tu puerta.',
    description: 'La forma más fácil de comprar lentes de contacto en RD. Rápidos y directo a tu puerta.',
    images: ['https://www.contactgo.net/og-1200x630.jpg'],
  },
}

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Necesario para que env(safe-area-inset-bottom) funcione en iPhone notch
  viewportFit: 'cover' as const,
  // FIX (2026-09-06): el sitio es solo modo claro (nunca implementamos modo
  // oscuro real) — sin esto, si el celular del cliente está en modo oscuro,
  // los controles NATIVOS del navegador (selector de fecha de nacimiento en
  // checkout/venta-wa, checkboxes, el desplegable de <select>) pueden salir
  // con fondo negro nativo, chocando visualmente contra las tarjetas
  // blancas del sitio. Esto le dice al navegador "esta página es solo
  // clara" para que esos controles nativos también se queden en claro.
  colorScheme: 'light' as const,
}



const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.contactgo.net/#organization",
  "name": "ContactGo",
  "url": "https://www.contactgo.net",
  "logo": "https://www.contactgo.net/og-1200x630.jpg",
  "image": "https://www.contactgo.net/og-1200x630.jpg",
  "description": "ContactGo es la forma más fácil de comprar lentes de contacto en República Dominicana. Directo del fabricante. Entrega en 24-48 horas a donde estés.",
  "telephone": "+18096942268",
  "email": "info@contactgo.net",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+18096942268",
    "contactType": "customer service",
    "areaServed": "DO",
    "availableLanguage": ["es", "en"],
    "url": "https://wa.me/18096942268"
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
    "https://www.facebook.com/profile.php?id=1063834443484441",
    "https://maps.app.goo.gl/ExyMCJBXEeptJNDt5"
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
        {/* Consent Mode v2: default consent runs before Google tags. */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          (function(){
            var saved = null;
            try { saved = JSON.parse(localStorage.getItem('cg-cookie-consent') || 'null'); } catch(e) {}
            var granted = saved && saved.level === 'all' ? 'granted' : 'denied';
            window.gtag('consent', 'default', {
              analytics_storage: granted, ad_storage: granted,
              ad_user_data: granted, ad_personalization: granted,
              functionality_storage: 'granted', personalization_storage: granted,
              security_storage: 'granted', wait_for_update: 500
            });
            if (saved && saved.level === 'all') window.gtag('consent', 'update', {
              analytics_storage:'granted', ad_storage:'granted',
              ad_user_data:'granted', ad_personalization:'granted'
            });
          })();
        ` }} />
        {/* ── Polyfill webkit.messageHandlers ────────────────────────────────────
            CRÍTICO: debe ser el primer script que corre.
            Facebook, Instagram, WeChat y cualquier WKWebView en iOS pueden
            no tener window.webkit.messageHandlers definido.
            GTM/Google Ads llaman sendDataToNative() que asume que existe.
            Este <script> inline corre sincrónicamente en el HTML, antes de
            CUALQUIER bundle de JS externo, GTM o Google Ads.
        ── */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  // ── CAPA 1: webkit.messageHandlers (Facebook/Instagram WKWebView) ──
  try {
    if(!window.webkit) window.webkit = {};
    if(!window.webkit.messageHandlers) window.webkit.messageHandlers = new Proxy({}, {
      get: function(t,k) { return t[k] || { postMessage: function(){} }; }
    });
  } catch(e) {
    try {
      if(!window.webkit) window.webkit = {};
      if(!window.webkit.messageHandlers) window.webkit.messageHandlers = {};
    } catch(e2) {}
  }

  // ── CAPA 2: postMessage seguro en webkit.messageHandlers ──
  // El error "Error invoking postMessage: Java object is gone"
  // viene de GTM/FB intentando postMessage a handlers nativos ya destruidos
  try {
    var origWH = window.webkit && window.webkit.messageHandlers;
    if(origWH) {
      var safeProxy = new Proxy(origWH, {
        get: function(target, name) {
          var handler = target[name];
          if(handler && typeof handler.postMessage === 'function') {
            return {
              postMessage: function(msg) {
                try { return handler.postMessage(msg); } catch(e) {}
              }
            };
          }
          return { postMessage: function(){} };
        }
      });
      try {
        Object.defineProperty(window.webkit, 'messageHandlers', {
          get: function() { return safeProxy; },
          configurable: true
        });
      } catch(e) {}
    }
  } catch(e) {}

  // ── CAPA 3: enableDidUserTypeOnKeyboardLogging ──
  // Error de Facebook In-App Browser intentando acceder a método privado
  try {
    if(window.webkit && window.webkit.messageHandlers) {
      if(!window.webkit.messageHandlers.enableDidUserTypeOnKeyboardLogging) {
        window.webkit.messageHandlers.enableDidUserTypeOnKeyboardLogging = { postMessage: function(){} };
      }
    }
  } catch(e) {}

  // ── CAPA 4: Suprimir errores globalmente antes de que lleguen a Sentry ──
  window.addEventListener('error', function(e) {
    if(!e || !e.message) return;
    var msg = e.message;
    if(
      msg.indexOf('webkit.messageHandlers') !== -1 ||
      msg.indexOf('postMessage') !== -1 ||
      msg.indexOf('Java object is gone') !== -1 ||
      msg.indexOf('enableDidUserTypeOnKeyboard') !== -1 ||
      msg.indexOf('KeyboardLogging') !== -1
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    }
  }, true);

  // También capturar unhandledrejection de los mismos errores
  window.addEventListener('unhandledrejection', function(e) {
    if(!e || !e.reason) return;
    var msg = String(e.reason.message || e.reason);
    if(
      msg.indexOf('postMessage') !== -1 ||
      msg.indexOf('Java object is gone') !== -1 ||
      msg.indexOf('enableDidUserTypeOnKeyboard') !== -1
    ) {
      e.preventDefault();
      return true;
    }
  }, true);

  // ── CAPA 5: sendDataToNative seguro ──
  function patchSendDataToNative() {
    if(typeof window.sendDataToNative === 'function' && !window._cgPatched) {
      var orig = window.sendDataToNative;
      window.sendDataToNative = function() {
        try { return orig.apply(this, arguments); } catch(e) {}
      };
      window._cgPatched = true;
    }
  }
  patchSendDataToNative();
  document.addEventListener('DOMContentLoaded', patchSendDataToNative, true);
  setTimeout(patchSendDataToNative, 500);
  setTimeout(patchSendDataToNative, 1500);
})();
        ` }} />
        <meta name="google-site-verification" content="lESKC-PqCyerfH9lDLzKi1em3nnRvh7LwKXKuPOmn1k" />
        

        <meta name="facebook-domain-verification" content="521fb5uvf0p1bbtgc59jz9j7fumekg" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload hero — mejora LCP (Largest Contentful Paint) */}
        <link rel="preload" as="image" href="/hero-lens-1.png" />
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



        {/* ── Google Ads — AW-830060688 ────────────────────────────────────── */}
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-830060688"
        />
        {/* Google Tag Manager — GTM-M9GZGJJQ (maneja GA4 G-KGM473ZPDB) */}
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            (function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');
          `}}
        />
        <Script
          id="gtm-src"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-M9GZGJJQ"
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

        

        <ReferralTracker />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
        <BottomNav />
        <WhatsAppButton />
        <CookieConsent />
      <Analytics />
      <SpeedInsights />
        {/* Skip link accesibilidad WCAG */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Saltar al contenido principal
      </a>
      <Toaster
          position="top-center"
          toastOptions={{
            className: '!rounded-xl !shadow-soft !font-medium',
            success: { className: '!bg-teal-50 !text-primary-800 !border !border-primary-200' },
            error: { className: '!bg-red-50 !text-red-800 !border !border-red-200' },
          }}
        />
      </body>
    </html>
  )
}
