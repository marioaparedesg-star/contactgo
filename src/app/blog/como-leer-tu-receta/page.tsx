import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'

// Redirect permanente (HTTP 308 en Next.js App Router, equivalente a 301)
// Consolida la autoridad SEO en la URL canónica
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.contactgo.net/blog/como-leer-receta-optica-rd',
  },
}

export default function Page() {
  permanentRedirect('/blog/como-leer-receta-optica-rd')
}
