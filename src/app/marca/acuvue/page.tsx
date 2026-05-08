import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lentes Acuvue en República Dominicana | ContactGo',
  description: 'Compra lentes de contacto Acuvue originales en RD. Acuvue Oasys, 1-Day Moist, for Astigmatism y más. Entrega a domicilio en 24-72h.',
}

export default async function AcuvuePage() {
  const sb = createServerSupabaseClient()
  const { data: productos } = await sb.from('products').select('*').eq('marca', 'ACUVUE').order('tipo')
  const TIPO: Record<string,string> = {esferico:'Esférico',torico:'Tórico',multifocal:'Multifocal',color:'Color'}
  return (
    <>
      <Navbar />
      <main className="pb-20">
        <section className="bg-gradient-to-br from-primary-700 to-teal-600 text-white py-14 px-4 text-center">
          <p className="text-primary-200 text-sm font-semibold uppercase tracking-wide mb-2">Marca oficial</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Lentes Acuvue en RD</h1>
          <p className="text-primary-100 max-w-xl mx-auto">La marca #1 de lentes de contacto del mundo. Tecnología HYDRACLEAR y BLINK STABILIZED para máxima comodidad.</p>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Productos Acuvue disponibles</h2>
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
        <section className="bg-primary-50 border-y border-primary-100 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Por qué elegir Acuvue?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {t:'Tecnología HYDRACLEAR®',d:'Hidratación superior durante todo el día, incluso con pantallas.'},
                {t:'UV Protection',d:'Los únicos lentes de contacto con protección UV clase 1 y clase 2.'},
                {t:'BLINK STABILIZED®',d:'Diseño que se estabiliza con cada parpadeo para visión nítida y estable.'},
                {t:'Disponibles en RD',d:'Entrega en 24-72h a Santo Domingo, Santiago, Punta Cana y todo el país.'},
              ].map((item,i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-primary-100">
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.t}</p>
                  <p className="text-gray-500 text-sm">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
