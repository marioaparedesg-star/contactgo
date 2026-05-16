import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Esféricos RD | Miopía e Hipermetropía — ContactGo',
  description: 'Compra lentes de contacto esféricos en RD con envío en 24-48h. Acuvue Moist, Acuvue Oasys, Air Optix HydraGlyde, Biofinity y más marcas premium para miopía e hipermetropía.',
  alternates: { canonical: 'https://contactgo.net/esfericos' },
  openGraph: {
    title: 'Lentes Esféricos RD | Miopía e Hipermetropía — ContactGo',
    description: 'Compra lentes de contacto esféricos en RD con envío en 24-48h. Acuvue Moist, Acuvue Oasys, Air Optix HydraGlyde, Biofinity y más marcas premium para miopía e hipermetropía.',
    url: 'https://contactgo.net/esfericos',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default function Page() {
  redirect('/catalogo?tipo=esferico')
}
