'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingCart, ArrowRight, X } from 'lucide-react'

export default function SugeridosPage() {
  const router = useRouter()
  const { items, addItem } = useCartStore()
  const [sugeridos, setSugeridos] = useState([])
  const [agregados, setAgregados] = useState([])

  useEffect(() => {
    if (items.length === 0) { router.push('/catalogo'); return }
    const sb = createClient()
    const tipos = [...new Set(items.map(i => i.product.tipo).filter(Boolean))]
    const ids = items.map(i => i.product.id)
    sb.from('products')
      .select('*')
      .in('tipo', tipos)
      .not('id', 'in', '(' + ids.join(',') + ')')
      .eq('activo', true)
      .gt('stock', 0)
      .limit(3)
      .then(({ data }) => setSugeridos(data || []))
  }, [])

  const agregar = (p) => {
    addItem(p, { cantidad: 1 })
    setAgregados(a => [...a, p.id])
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Producto agregado</h1>
          <p className="text-gray-500 mt-1">Los clientes que compraron esto tambien llevaron:</p>
        </div>

        {sugeridos.length > 0 && (
          <div className="space-y-3 mb-8">
            {sugeridos.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover rounded-xl" /> :
                    <span className="text-2xl">👁</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</p>
                  <p className="text-xs text-gray-400">{p.marca} · {p.tipo}</p>
                  <p className="text-primary-600 font-bold mt-0.5">RD${p.precio?.toLocaleString()}</p>
                </div>
                {agregados.includes(p.id) ? (
                  <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1.5 rounded-xl">Agregado</span>
                ) : (
                  <button onClick={() => agregar(p)}
                    className="bg-primary-600 text-white text-sm font-semibold px-3 py-1.5 rounded-xl hover:bg-primary-700 transition-colors shrink-0">
                    Agregar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <button onClick={() => router.push('/checkout')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-lg">
            Continuar al pago <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => router.push('/catalogo')}
            className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4" /> Seguir comprando
          </button>
        </div>
      </div>
    </div>
  )
}
