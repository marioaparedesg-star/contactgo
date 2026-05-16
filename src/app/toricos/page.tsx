import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Tóricos para Astigmatismo RD — ContactGo',
  description: 'Lentes tóricos para astigmatismo en República Dominicana. Acuvue Moist for Astigmatism, Acuvue Oasys for Astigmatism, Biofinity Toric y más. Fabricados a medida.',
  alternates: { canonical: 'https://contactgo.net/toricos' },
  openGraph: {
    title: 'Lentes Tóricos para Astigmatismo RD — ContactGo',
    description: 'Lentes tóricos para astigmatismo en República Dominicana. Acuvue Moist for Astigmatism, Acuvue Oasys for Astigmatism, Biofinity Toric y más. Fabricados a medida.',
    url: 'https://contactgo.net/toricos',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default function Page() {
  redirect('/catalogo?tipo=torico')
}
