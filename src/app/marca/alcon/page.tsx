export const revalidate = 3600

import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata = {
  title: 'Lentes Alcon en República Dominicana | ContactGo',
  description: 'Lentes Air Optix®, FreshLook® y gotas Systane® de Alcon en RD. Distribuidor autorizado. Envío a domicilio.',
  alternates: { canonical: 'https://www.contactgo.net/marca/alcon' },
  openGraph: {
    title: 'Lentes Alcon en RD | ContactGo',
    description: 'Distribuidor autorizado de Alcon en República Dominicana.',
    url: 'https://www.contactgo.net/marca/alcon',
    locale: 'es_DO',
    siteName: 'ContactGo',
    type: 'website',
  },
}

export default async function AlconPage() {
  const sb = createServerSupabaseClient()
  const { data: productos } = await sb.from('products').select('*').eq('marca', 'ALCON').order('tipo')
  const TIPO: Record<string,string> = {esferico:'Esférico',torico:'Tórico',multifocal:'Multifocal',color:'Color',gota:'Gotas',solucion:'Solución'}
  return (
    <>
      <Navbar />
      <main className="pb-20">
        <section className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white py-14 px-4 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-2">Marca oficial</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Lentes Alcon en RD</h1>
          <p className="text-blue-100 max-w-xl mx-auto">Air Optix, FreshLook Colorblends y Systane. Innovación óptica de nivel mundial disponible en República Dominicana.</p>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Productos Alcon disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(productos??[]).map((p:any) => (
              <Link key={p.id} href={`/producto/${p.id}`} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                {p.imagen_url && <div className="aspect-square mb-3 flex items-center justify-center"><Image src={p.imagen_url} alt={p.nombre} width={120} height={120} className="object-contain" /></div>}
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{TIPO[p.tipo]??p.tipo}</span>
                <p className="font-semibold text-gray-900 text-sm mt-2 leading-tight">{p.nombre}</p>
                <p className="font-bold text-gray-900 mt-1">RD${p.precio?.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>

      {/* Brand Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": "Alcon",
        "url": "https://www.alcon.com",
        "manufacturer": {
          "@type": "Organization",
          "name": "Alcon Laboratories",
          "url": "https://www.alcon.com"
        },
        "isRelatedTo": {
          "@type": "Store",
          "name": "ContactGo",
          "url": "https://www.contactgo.net"
        }
      })}} />
      </main>
      <Footer />
    </>
  )
}
