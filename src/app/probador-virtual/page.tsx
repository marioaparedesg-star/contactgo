import type { Metadata } from 'next'
import ProbadorClient from './ProbadorClient'

export const metadata: Metadata = {
  title: 'Probador Virtual de Colores — AIR OPTIX Colors | ContactGo',
  description: 'Sube tu foto y descubre cómo te ven los 12 tonos de AIR OPTIX Colors antes de comprar. Gratis, al instante, directo en tu navegador.',
  alternates: { canonical: 'https://www.contactgo.net/probador-virtual' },
  openGraph: {
    title: 'Probador Virtual de Colores — ContactGo',
    description: 'Descubre cómo te quedan los 12 tonos de AIR OPTIX Colors antes de comprar.',
    url: 'https://www.contactgo.net/probador-virtual',
    type: 'website', locale: 'es_DO', siteName: 'ContactGo',
  },
}

export default function Page() {
  return <ProbadorClient />
}
