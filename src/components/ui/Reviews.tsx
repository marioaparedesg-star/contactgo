'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

// ═══════════════════════════════════════════════════════════════
// FUENTE ÚNICA: product_reviews
// La tabla 'reviews' está DEPRECATED — no leer ni escribir en ella
// ═══════════════════════════════════════════════════════════════

export default function Reviews({ productId, initialReviews }: {
  productId: string
  initialReviews?: any[]
}) {
  const [reviews, setReviews]   = useState<any[]>(initialReviews ?? [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ nombre: '', ciudad: '', rating: 5, texto: '' })
  const [enviado, setEnviado]   = useState(false)
  const [sending, setSending]   = useState(false)
  const sb = createClient()

  // Sin fallback a 'reviews'. Si initialReviews llegó vacío, mostramos estado vacío.
  // El page.tsx (server) siempre inyecta initialReviews desde product_reviews.

  const promedio = reviews.length > 0
    ? reviews.reduce((a, r) => a + (r.rating ?? 5), 0) / reviews.length
    : null

  const distribucion = [5,4,3,2,1].map(n => ({
    n,
    count: reviews.filter(r => (r.rating ?? 5) === n).length,
    pct:   reviews.length > 0
      ? Math.round(reviews.filter(r => (r.rating ?? 5) === n).length / reviews.length * 100)
      : 0,
  }))

  const enviar = async () => {
    if (!form.nombre || !form.texto) return
    setSending(true)
    // Escribe en product_reviews (fuente oficial)
    const { data } = await sb.from('product_reviews').insert({
      product_id: productId,
      user_name:  form.nombre,
      rating:     form.rating,
      comment:    form.texto,
      ciudad:     form.ciudad || null,
      verified:   false,
      approved:   true,
    }).select().single()
    setSending(false)
    setEnviado(true)
    setShowForm(false)
    if (data) setReviews(r => [data, ...r])
  }

  const Stars = ({ n, size = 'sm' }: { n: number; size?: 'sm' | 'lg' }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`${size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )

  const InteractiveStar = ({ val }: { val: number }) => (
    <button type="button" onClick={() => setForm(f => ({ ...f, rating: val }))}
      className="transition-transform hover:scale-110">
      <svg className={`w-8 h-8 ${val <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} transition-colors`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </button>
  )

  if (reviews.length === 0 && !showForm) return (
    <section className="max-w-screen-xl mx-auto px-4 pb-10">
      <div className="border-t border-gray-100 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Reseñas</h3>
          <button onClick={() => setShowForm(true)}
            className="text-sm font-semibold text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors">
            + Escribir reseña
          </button>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
          <p className="text-2xl mb-2">⭐</p>
          <p className="font-semibold text-gray-700 text-sm">Sé el primero en opinar</p>
          <p className="text-xs text-gray-400 mt-1">Tu reseña ayuda a otros clientes</p>
        </div>
        {showForm && (
          <div className="mt-5 bg-white border border-primary-200 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-gray-900 mb-4">Tu opinión</p>
            <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(v => <InteractiveStar key={v} val={v} />)}</div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu nombre *" />
                <input value={form.ciudad} onChange={e => setForm(f => ({...f, ciudad: e.target.value}))}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ciudad" />
              </div>
              <textarea value={form.texto} onChange={e => setForm(f => ({...f, texto: e.target.value}))}
                rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="¿Cómo fue tu experiencia con este producto? *" />
              <div className="flex gap-2">
                <button onClick={enviar} disabled={sending || !form.nombre || !form.texto}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {sending ? 'Enviando...' : 'Publicar reseña'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-none bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )

  return (
    <section className="max-w-screen-xl mx-auto px-4 pb-10">
      <div className="border-t border-gray-100 pt-10">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Reseñas de clientes</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}{reviews.filter(r => r.verified).length > 0 ? ` · ${reviews.filter(r => r.verified).length} verificadas ✓` : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(s => !s)}
            className="text-sm font-semibold text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors shrink-0">
            + Escribir reseña
          </button>
        </div>

        {promedio !== null && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-5 items-center">
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-gray-900">{promedio.toFixed(1)}</p>
              <Stars n={Math.round(promedio)} size="lg" />
              <p className="text-xs text-gray-400 mt-1">{reviews.length} reseñas</p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {distribucion.map(({ n, count, pct }) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3 shrink-0">{n}</span>
                  <svg className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && !enviado && (
          <div className="bg-white border border-primary-200 rounded-2xl p-5 mb-5 shadow-sm">
            <p className="font-bold text-gray-900 mb-4">Tu opinión</p>
            <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(v => <InteractiveStar key={v} val={v} />)}</div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tu nombre *" />
                <input value={form.ciudad} onChange={e => setForm(f => ({...f, ciudad: e.target.value}))}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ciudad" />
              </div>
              <textarea value={form.texto} onChange={e => setForm(f => ({...f, texto: e.target.value}))}
                rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="¿Cómo fue tu experiencia? *" />
              <div className="flex gap-2">
                <button onClick={enviar} disabled={sending || !form.nombre || !form.texto}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {sending ? 'Enviando...' : 'Publicar reseña'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-none bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {enviado && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 text-sm text-green-700 font-semibold">
            ✓ ¡Gracias! Tu reseña fue publicada.
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((r, i) => {
            const nombre = r.user_name ?? r.nombre ?? 'Cliente'
            const texto  = r.comment  ?? r.texto  ?? r.comentario ?? ''
            const stars  = r.rating   ?? 5
            const fecha  = r.created_at
              ? new Date(r.created_at).toLocaleDateString('es-DO', { month: 'short', year: 'numeric' })
              : ''
            const ciudad = r.ciudad ?? ''
            const verif  = r.verified ?? r.verificado ?? false

            return (
              <div key={r.id ?? i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-emerald-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                    {(nombre[0] ?? '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{nombre}</span>
                      {ciudad && <span className="text-xs text-gray-400">{ciudad}</span>}
                      {verif && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                          ✓ Compra verificada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars n={stars} />
                      {fecha && <span className="text-[10px] text-gray-400">{fecha}</span>}
                    </div>
                    {texto && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{texto}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
