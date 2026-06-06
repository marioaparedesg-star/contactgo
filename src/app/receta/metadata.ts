import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calculadora de Lentes de Contacto | Convierte tu Receta Gratis | ContactGo',
  description: 'Convierte tu receta de gafas a lentes de contacto en 60 segundos. IA Gemini lee tu receta, calcula tu graduación y recomienda los mejores lentes. Gratis, sin registro.',
  keywords: ['calculadora lentes de contacto', 'convertir receta gafas lentes contacto', 'lentes de contacto receta dominicana', 'calculadora contactgo'],
  openGraph: {
    title: 'Calculadora de Lentes de Contacto | ContactGo República Dominicana',
    description: 'Sube tu receta y encuentra tus lentes de contacto perfectos en 60 segundos. IA lee tu prescripción automáticamente.',
    url: 'https://www.contactgo.net/receta',
    type: 'website',
    images: [{ url: 'https://www.contactgo.net/og-calculadora.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.contactgo.net/receta' },
  robots: 'index, follow',
}
