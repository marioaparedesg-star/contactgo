'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingCart, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  tipo: string
  precio: number
}

const COMPLEMENTOS: Record<string, { tipos: string[]; label: string }> = {
  esferico:   { tipos: ['solucion', 'gota'],    label: 'Completa tu rutina de lentes' },
  torico:     { tipos: ['solucion', 'gota'],    label: 'Completa tu rutina de lentes' },
  multifocal: { tipos: ['solucion', 'gota'],    label: 'Completa tu rutina de lentes' },
  color:      { tipos: ['solucion', 'gota'],    label: 'Esenciales para tus lentes de color' },
  solucion:   { tipos: ['esferico', 'gota'],   label: 'Los clientes también compraron' },
  gota:       { tipos: ['esferico', 'solucion'], label: 'Los clientes también compraron' },
}

export default function FrequentlyBoughtTogether({ productId, tipo, precio }: Props) {
  const [sugeridos, setSugeridos] = useState<any[]>([])
  const addItem = useCartStore(s => s.addItem)
  const sb = createClient()

  useEffect(() => {
    const cfg = COMPLEMENTOS[tipo]
    if (!cfg) return
    sb.from('products')
      .select('id,nombre,marca,tipo,precio,precio_anterior,imagen_url,slug')
      .in('tipo', cfg.tipos)
      .eq('activo', true)
      .eq('archivado', false)
      .order('precio', { ascending: true })
      .limit(3)
      .then(({ data }) => setSugeridos((data ?? []).filter(p => p.id !== productId).slice(0, 2)))
  }, [productId, tipo])

  if (!sugeridos.length) return null

  const cfg = COMPLEMENTOS[tipo]
  const totalBundle = precio + sugeridos.reduce((s, p) => s + Number(p.precio), 0)

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 border-t border-gray-100 pt-8">
      <h3 className="font-bold text-gray-900 text-base mb-4">{cfg?.label ?? 'Frecuentemente comprados juntos'}</h3>

      {/* Bundle visual */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {sugeridos.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              {i > 0 && <Plus className="w-4 h-4 text-gray-300 shrink-0" />}
              <div className="flex flex-col items-center gap-1">
                {p.imagen_url && (
                  <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
                    <img src={p.imagen_url} alt={p.nombre} className="w-12 h-12 object-contain" loading="lazy" />
                  </div>
                )}
                <p className="text-[10px] text-gray-500 text-center max-w-[64px] leading-tight">{p.nombre.split('®')[0].trim()}</p>
                <p className="text-[11px] font-black text-gray-900">RD${Number(p.precio).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-500">Precio del paquete</p>
            <p className="font-black text-lg text-gray-900">RD${totalBundle.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 font-semibold">Envío gratis en pedidos +RD$3,000</p>
          </div>
          <button
            onClick={() => {
              sugeridos.forEach(p => {
                const prod = { id: p.id, nombre: p.nombre, marca: p.marca, precio: Number(p.precio),
                  tipo: p.tipo, imagen_url: p.imagen_url, activo: true, slug: p.slug,
                  sph_disponibles: [], cyl_disponibles: [], add_disponibles: [], colores_disponibles: [],
                  stock: 99, categoria_id: null, costo: 0, descripcion: null }
                addItem(prod as any, { cantidad: 1 })
              })
              toast.success(`${sugeridos.length} productos agregados al carrito`, { duration: 3000 })
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-primary-200/60"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar todo al carrito
          </button>
        </div>
      </div>

      {/* Cards individuales */}
      <div className="grid grid-cols-2 gap-3">
        {sugeridos.map(p => (
          <Link key={p.id} href={`/producto/${p.slug}`}
            className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 hover:border-gray-200 hover:shadow-sm transition-all">
            {p.imagen_url && (
              <img src={p.imagen_url} alt={p.nombre} className="w-12 h-12 object-contain shrink-0 rounded-lg bg-gray-50" loading="lazy" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{p.marca}</p>
              <p className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">{p.nombre}</p>
              <p className="text-sm font-black text-primary-600 mt-0.5">RD${Number(p.precio).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
