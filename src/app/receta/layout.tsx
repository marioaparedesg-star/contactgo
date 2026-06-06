import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calculadora de Lentes de Contacto | ContactGo',
  description: 'Convierte tu receta de gafas a lentes de contacto gratis. IA Gemini lee tu prescripción y recomienda los mejores lentes con precios reales.',
  keywords: ['calculadora lentes contacto', 'convertir receta gafas', 'lentes contacto republica dominicana'],
  openGraph: {
    title: 'Calculadora de Lentes de Contacto | ContactGo RD',
    description: 'Sube tu receta y encuentra tus lentes perfectos en 60 segundos.',
    url: 'https://www.contactgo.net/receta',
    type: 'website',
  },
  alternates: { canonical: 'https://www.contactgo.net/receta' },
}
export default function RecetaLayout({ children }: { children: React.ReactNode }) {
  return children
}
