export const revalidate = 3600

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Star } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Reseñas de Clientes — ContactGo República Dominicana',
  description: 'Lee opiniones de clientes con compras verificadas de lentes de contacto en ContactGo. Experiencias con Acuvue, Air Optix, Biofinity y otras marcas en RD.',
  alternates: { canonical: 'https://www.contactgo.net/resenas' },
}

async function getResenas() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const filters = (query: any) => query
      .eq('approved', true)
      .eq('verified', true)
      .gte('rating', 1)
      .lte('rating', 5)
      .not('comment', 'is', null)

    const [{ data }, { data: ratings, count }] = await Promise.all([
      filters(sb.from('product_reviews'))
        .select('id, rating, comment, user_name, ciudad, created_at, products(nombre, marca)')
        .order('created_at', { ascending: false })
        .limit(50),
      filters(sb.from('product_reviews'))
        .select('rating', { count: 'exact' }),
    ])

    const avgRating = ratings?.length
      ? ratings.reduce((sum: number, review: any) => sum + Number(review.rating), 0) / ratings.length
      : null

    return { resenas: data ?? [], totalReal: count ?? 0, avgRating }
  } catch {
    return { resenas: [], totalReal: 0, avgRating: null }
  }
}

export default async function ResenasPage() {
  const { resenas, totalReal, avgRating } = await getResenas()

  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-10 pb-32">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-2">
          Reseñas de clientes
        </h1>
        <p className="text-gray-500 text-sm">
          Opiniones de clientes con compras verificadas en ContactGo
        </p>
        {totalReal > 0 && avgRating !== null && (
          <div className="flex items-center justify-center gap-2 mt-4" aria-label={`Calificación promedio: ${avgRating.toFixed(1)} de 5, basada en ${totalReal} reseñas verificadas`}>
            <div className="flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="font-black text-gray-900 text-lg">{avgRating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">/ 5 · {totalReal} reseñas verificadas</span>
          </div>
        )}
      </div>

      {resenas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {resenas.map((r: any) => (
            <article key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{r.user_name ?? 'Cliente verificado'}</p>
                  <p className="text-xs text-gray-400">{r.ciudad ?? 'República Dominicana'}</p>
                </div>
                <div className="flex gap-0.5" aria-label={`${r.rating} de 5 estrellas`}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} aria-hidden="true" className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs bg-teal-50 text-primary-700 px-2 py-1 rounded-lg font-semibold">
                  {r.products?.nombre ?? 'Lentes de contacto'}
                </span>
                <time className="text-xs text-gray-400" dateTime={r.created_at}>
                  {new Date(r.created_at).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}
                </time>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <h2 className="font-bold text-gray-900 mb-2">Aún no hay reseñas verificadas publicadas</h2>
          <p className="text-sm text-gray-600">Cuando nuestros clientes compartan sus experiencias verificadas, aparecerán aquí.</p>
        </div>
      )}

      <div className="bg-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
        <h2 className="font-bold text-gray-900 text-lg mb-2">¿Ya compraste en ContactGo?</h2>
        <p className="text-sm text-gray-600 mb-4">Tu opinión ayuda a otros dominicanos a tomar una mejor decisión.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://g.page/r/Cb-RwE6S9vzgECE/review" target="_blank" rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors">
            Dejar reseña en Google
          </a>
          <Link href="/cuenta" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors">
            Ver mis pedidos
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </>
  )
}
