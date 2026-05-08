import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Bausch+Lomb en República Dominicana | ContactGo',
  description: 'Compra lentes Bausch+Lomb Ultra y solución ReNu en RD. 170 años de experiencia en salud visual. Entrega a domicilio.',
}

export default async function BauschLombPage() {
  const sb = createServerSupabaseClient()
  const { data: productos } = await sb.from('products').select('*').eq('marca', 'BAUSCH+LOMB').order('tipo')
  const TIPO: Record<string,string> = {esferico:'Esférico',torico:'Tórico',multifocal:'Multifocal',solucion:'Solución'}
  return (
    <>
      <Navbar />
      <main className="pb-20">
        <section className="bg-gradient-to-br from-red-700 to-orange-600 text-white py-14 px-4 text-center">
          <p className="text-red-200 text-sm font-semibold uppercase tracking-wide mb-2">Marca oficial</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Lentes Bausch+Lomb en RD</h1>
          <p className="text-red-100 max-w-xl mx-auto">170 años de innovación en salud visual. Bausch+Lomb Ultra y ReNu Advanced disponibles en República Dominicana.</p>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Productos Bausch+Lomb disponibles</h2>
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
      </main>
      <Footer />
    </>
  )
}
