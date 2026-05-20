import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.contactgo.net/receta' },
  openGraph: { url: 'https://www.contactgo.net/receta' },
}

export default function RecetaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
