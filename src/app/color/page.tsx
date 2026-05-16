import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes de Color RD | Air Optix, FreshLook — ContactGo',
  description: 'Lentes de colores en RD con y sin graduación. Air Optix Colors, FreshLook Colorblends y más. Cambia el color de tus ojos con estilo. Envío 24-48h.',
  alternates: { canonical: 'https://contactgo.net/color' },
  openGraph: {
    title: 'Lentes de Color RD | Air Optix, FreshLook — ContactGo',
    description: 'Lentes de colores en RD con y sin graduación. Air Optix Colors, FreshLook Colorblends y más. Cambia el color de tus ojos con estilo. Envío 24-48h.',
    url: 'https://contactgo.net/color',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default function Page() {
  redirect('/catalogo?tipo=color')
}
