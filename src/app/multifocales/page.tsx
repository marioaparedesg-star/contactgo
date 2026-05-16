import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Multifocales RD | Presbicia y Vista Cansada — ContactGo',
  description: 'Lentes de contacto multifocales para presbicia (vista cansada) en RD. Acuvue Oasys Multifocal, Air Optix Multifocal, Biofinity Multifocal. Entrega a domicilio.',
  alternates: { canonical: 'https://contactgo.net/multifocales' },
  openGraph: {
    title: 'Lentes Multifocales RD | Presbicia y Vista Cansada — ContactGo',
    description: 'Lentes de contacto multifocales para presbicia (vista cansada) en RD. Acuvue Oasys Multifocal, Air Optix Multifocal, Biofinity Multifocal. Entrega a domicilio.',
    url: 'https://contactgo.net/multifocales',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default function Page() {
  redirect('/catalogo?tipo=multifocal')
}
