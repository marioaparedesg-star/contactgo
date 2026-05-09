import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Sugeridos para tu Receta | ContactGo RD',
  description: 'Resultados personalizados basados en tu prescripción óptica. Lentes de contacto compatibles con tu graduación con entrega en RD.',
  alternates: { canonical: 'https://contactgo.net/sugeridos' },
  openGraph: {
    title: 'Lentes Sugeridos para tu Receta | ContactGo RD',
    description: 'Resultados personalizados basados en tu prescripción óptica.',
    url: 'https://contactgo.net/sugeridos',
    locale: 'es_DO',
    siteName: 'ContactGo',
  },
}

export default function SugeridosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
