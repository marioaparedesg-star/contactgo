'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', ciudad: '', estrellas: 5, texto: '' })
  const [enviado, setEnviado] = useState(false)
  const sb = createClient()

  useEffect(() => {
    sb.from('reviews').select('*').eq('product_id', productId).eq('aprobado', true).order('created_at', {ascending: false})
      .then(({data}) => setReviews(data ?? []))
  }, [productId])

  const promedio = reviews.length > 0 ? (reviews.reduce((a, r) => a + (r.estrellas ?? r.rating ?? 5), 0) / reviews.length).toFixed(1) : null

  const enviar = async () => {
    if (!form.nombre || !form.texto) return
    await sb.from('reviews').insert({
      product_id: productId,
      nombre: form.nombre,
      ciudad: form.ciudad,
      estrellas: form.estrellas,
      texto: form.texto,
      rating: form.estrellas,
      comentario: form.texto,
      aprobado: true,
      verificado: false
    })
    setEnviado(true)
    setShowForm(false)
    setReviews(r => [{...form, id: Date.now(), created_at: new Date().toISOString()}, ...r])
  }

  const Estrellas = ({n}: {n: number}) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900">
            Reseñas de clientes
            {promedio && <span className="ml-2 text-amber-500">⭐ {promedio}</span>}
          </h3>
          <p className="text-sm text-gray-400">{reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="text-sm font-semibold text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors">
          + Escribir reseña
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3">
          <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))}
            placeholder="Tu nombre *" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <input value={form.ciudad} onChange={e => setForm(f => ({...f, ciudad: e.target.value}))}
            placeholder="Ciudad (opcional)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Calificación</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setForm(f => ({...f, estrellas: i}))}
                  className={`text-2xl transition-all ${i <= form.estrellas ? 'text-amber-400' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
          </div>
          <textarea value={form.texto} onChange={e => setForm(f => ({...f, texto: e.target.value}))}
            placeholder="Cuéntanos tu experiencia con este producto *" rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          <button onClick={enviar}
            className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
            Publicar reseña
          </button>
        </div>
      )}

      {enviado && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 font-semibold">
          ✅ ¡Gracias por tu reseña!
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">Sé el primero en dejar una reseña</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={r.id ?? i} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.nombre}</p>
                  {r.ciudad && <p className="text-xs text-gray-400">{r.ciudad}</p>}
                </div>
                <Estrellas n={r.estrellas ?? r.rating ?? 5} />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.texto ?? r.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
