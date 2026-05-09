import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sube tu Receta de Lentes | ContactGo RD',
  description: 'Sube tu receta óptica y encuentra los lentes de contacto exactos para tu graduación. Esféricos, tóricos y multifocales disponibles en República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/receta' },
  openGraph: {
    title: 'Sube tu Receta de Lentes | ContactGo RD',
    description: 'Sube tu receta óptica y encuentra los lentes de contacto exactos para tu graduación.',
    url: 'https://contactgo.net/receta',
    locale: 'es_DO',
    siteName: 'ContactGo',
  },
}

export default function RecetaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
