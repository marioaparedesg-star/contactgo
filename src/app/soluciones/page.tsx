import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soluciones para Lentes de Contacto RD — ContactGo',
  description: 'Soluciones multipropósito y accesorios para lentes de contacto en República Dominicana. ReNu, Opti-Free, Prolub HyFresh, Dream Eye. Envío a domicilio.',
  alternates: { canonical: 'https://contactgo.net/soluciones' },
  openGraph: {
    title: 'Soluciones para Lentes de Contacto RD — ContactGo',
    description: 'Soluciones multipropósito y accesorios para lentes de contacto en República Dominicana. ReNu, Opti-Free, Prolub HyFresh, Dream Eye. Envío a domicilio.',
    url: 'https://contactgo.net/soluciones',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default function Page() {
  redirect('/catalogo?tipo=solucion')
}
