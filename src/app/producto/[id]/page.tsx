'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowLeft, Eye, AlertCircle } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

const TIPO_LABELS: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
  color: 'Color', solucion: 'Solución', gota: 'Gotas',
}

export default function ProductoPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSph, setSelectedSph] = useState<number | null>(null)
  const [selectedCyl, setSelectedCyl] = useState<number | null>(null)
  const [selectedAdd, setSelectedAdd] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    const sb = createClient()
    sb.from('products').select('*, categories(*)').eq('id', id).single()
      .then(({ data }) => { setProduct(data); setLoading(false) })
  }, [id])

  const needsSph = product && ['esferico','torico','multifocal','color'].includes(product.tipo ?? '')
    && (product.sph_disponibles?.length ?? 0) > 0

  const handleAdd = () => {
    if (!product) return
    if (needsSph && selectedSph === null) {
      toast.error('Selecciona una graduación')
      return
    }
    addItem(product, { cantidad: qty, sph: selectedSph, cyl: selectedCyl, add_power: selectedAdd ?? undefined })
    toast.success('Agregado al carrito ✓')
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  )

  if (!product) return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Producto no encontrado.</p>
        <button onClick={() => router.back()} className="mt-4 btn-primary">Volver</button>
      </div>
    </>
  )

  const sphs = product.sph_disponibles ?? []
  const cyls = product.cyl_disponibles ?? []
  const adds = product.add_disponibles ?? []

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Imagen */}
          <div className="card overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
            {product.imagen_url ? (
              <Image src={product.imagen_url} alt={product.nombre}
                width={400} height={400} className="object-contain p-8" />
            ) : (
              <Eye className="w-24 h-24 text-gray-200" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-primary-600 mb-1">{product.marca}</p>
              {product.tipo && (
                <span className="badge bg-primary-100 text-primary-700 mb-3 inline-block">
                  {TIPO_LABELS[product.tipo]}
                </span>
              )}
              <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.nombre}
              </h1>
            </div>

            <div>
              <p className="text-3xl font-bold text-gray-900">RD${product.precio.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {product.stock > 0
                  ? product.stock <= 5
                    ? `⚠️ Solo ${product.stock} en stock`
                    : '✓ En stock'
                  : '✗ Sin stock'}
              </p>
            </div>

            {product.descripcion && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.descripcion}</p>
            )}

            {/* Selector SPH */}
            {needsSph && sphs.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Graduación (SPH) <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {sphs.sort((a, b) => a - b).map(s => (
                    <button key={s} onClick={() => setSelectedSph(s)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                        ${selectedSph === s
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                      {s > 0 ? `+${s}` : s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector CYL */}
            {cyls.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Cilindro (CYL)</p>
                <div className="flex flex-wrap gap-2">
                  {cyls.map(c => (
                    <button key={c} onClick={() => setSelectedCyl(c)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                        ${selectedCyl === c
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector ADD */}
            {adds.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Adición (ADD)</p>
                <div className="flex flex-wrap gap-2">
                  {adds.map(a => (
                    <button key={a} onClick={() => setSelectedAdd(a)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                        ${selectedAdd === a
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-gray-700">Cantidad</p>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">−</button>
                <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
              </div>
            </div>

            {/* Disclaimer receta */}
            {['esferico','torico','multifocal'].includes(product.tipo ?? '') && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Esta recomendación es orientativa. Consulta siempre con un profesional de la salud visual antes de comprar lentes de contacto.</span>
              </div>
            )}

            {/* Botón agregar */}
            <button onClick={handleAdd} disabled={product.stock === 0}
              className="btn-primary flex items-center justify-center gap-2 py-4 text-base
                         disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
