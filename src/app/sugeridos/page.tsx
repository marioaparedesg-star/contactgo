'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingCart, ArrowRight, X, Droplets, Eye, Package } from 'lucide-react'
import toast from 'react-hot-toast'

const COMBO_RULES: Record<string, { tipos: string[], titulo: string, desc: string, icon: any }> = {
  esferico:   { tipos: ['solucion', 'gota'], titulo: 'Completa tu kit de cuidado', desc: 'Los lentes necesitan solución y gotas para durar más y evitar infecciones.', icon: Droplets },
  torico:     { tipos: ['solucion', 'gota'], titulo: 'Esencial para lentes tóricos', desc: 'Los lentes tóricos requieren limpieza diaria con solución certificada.', icon: Droplets },
  multifocal: { tipos: ['solucion', 'gota'], titulo: 'Cuida tus lentes multifocales', desc: 'Maximiza la durabilidad y comodidad con solución y lubricación.', icon: Droplets },
  color:      { tipos: ['solucion', 'gota'], titulo: 'Mantén el color y la comodidad', desc: 'Los lentes de color requieren solución especial para conservar la nitidez.', icon: Droplets },
}

export default function SugeridosPage() {
  const router = useRouter()
  const { items, addItem } = useCartStore()
  const [combos, setCombos] = useState<any[]>([])
  const [agregados, setAgregados] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) { router.push('/catalogo'); return }
    const sb = createClient()
    const tiposEnCarrito = [...new Set(items.map(i => i.product.tipo).filter(Boolean))]
    const idsEnCarrito = items.map(i => i.product.id)
    const tiposLente = tiposEnCarrito.filter(t => ['esferico','torico','multifocal','color'].includes(t as string))
    const tieneLente = tiposLente.length > 0
    const tipoLente = tiposLente[0] as string

    if (!tieneLente) {
      setLoading(false)
      return
    }

    const rule = COMBO_RULES[tipoLente]
    sb.from('products')
      .select('*')
      .in('tipo', rule.tipos)
      .not('id', 'in', '(' + idsEnCarrito.join(',') + ')')
      .eq('activo', true)
      .gt('stock', 0)
      .order('precio', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        setCombos(data || [])
        setLoading(false)
      })
  }, [])

  const agregar = (p: any) => {
    addItem(p, { cantidad: 1 })
    setAgregados(a => [...a, p.id])
    toast.success(p.nombre + ' agregado al carrito')
  }

  const tiposLente = [...new Set(items.map(i => i.product.tipo).filter(t => ['esferico','torico','multifocal','color'].includes(t as string)))]
  const rule = tiposLente.length > 0 ? COMBO_RULES[tiposLente[0] as string] : null
  const Icon = rule?.icon ?? Package

  const totalCombo = combos.filter(p => agregados.includes(p.id)).reduce((s, p) => s + p.precio, 0)
  const totalCarrito = items.reduce((s, i) => s + i.product.precio * i.cantidad, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Agregado al carrito</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {items.length} producto{items.length > 1 ? 's' : ''} · RD${totalCarrito.toLocaleString()}
          </p>
        </div>

        {/* Combos inteligentes */}
        {rule && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{rule.titulo}</p>
                <p className="text-xs text-gray-500">{rule.desc}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : combos.length > 0 ? (
              <div className="space-y-3">
                {combos.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {p.imagen_url
                        ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-contain p-1" />
                        : <Eye className="w-6 h-6 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={"text-xs px-1.5 py-0.5 rounded-md font-semibold " + (p.tipo === 'solucion' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700')}>
                          {p.tipo === 'solucion' ? 'Solución' : 'Gotas'}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.nombre}</p>
                      <p className="text-xs text-gray-400">{p.marca}</p>
                      <p className="text-primary-600 font-bold mt-0.5">RD${p.precio?.toLocaleString()}</p>
                    </div>
                    {agregados.includes(p.id) ? (
                      <span className="text-green-600 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-xl shrink-0">✓ Agregado</span>
                    ) : (
                      <button onClick={() => agregar(p)}
                        className="bg-primary-600 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-primary-700 transition-colors shrink-0">
                        + Agregar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-3">
          <button onClick={() => router.push('/checkout')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base">
            Ir al pago <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => router.push('/catalogo')}
            className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm">
            <X className="w-4 h-4" /> Seguir comprando
          </button>
        </div>
      </div>
    </div>
  )
}
