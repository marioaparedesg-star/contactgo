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

const ALL_SPH = [-20,-19.5,-19,-18.5,-18,-17.5,-17,-16.5,-16,-15.5,-15,-14.5,-14,-13.5,-13,-12.5,-12,-11.5,-11,-10.5,-10,-9.5,-9,-8.5,-8,-7.5,-7,-6.5,-6,-5.75,-5.5,-5.25,-5,-4.75,-4.5,-4.25,-4,-3.75,-3.5,-3.25,-3,-2.75,-2.5,-2.25,-2,-1.75,-1.5,-1.25,-1,-0.75,-0.5,-0.25,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75,4,4.25,4.5,4.75,5,5.25,5.5,5.75,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12]
const ALL_CYL = [-6,-5.75,-5.5,-5.25,-5,-4.75,-4.5,-4.25,-4,-3.75,-3.5,-3.25,-3,-2.75,-2.5,-2.25,-2,-1.75,-1.5,-1.25,-1,-0.75,-0.5,-0.25]

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
    if (needsSph && selectedSph === null) { toast.error('Selecciona una graduacion'); return }
    addItem(product, { cantidad: qty, sph: selectedSph, cyl: selectedCyl, add_power: selectedAdd ?? undefined })
    toast.success('Agregado al carrito')
  }

  const handleBuyNow = () => {
    if (!product) return
    if (needsSph && selectedSph === null) { toast.error('Selecciona una graduacion'); return }
    addItem(product, { cantidad: qty, sph: selectedSph, cyl: selectedCyl, add_power: selectedAdd ?? undefined })
    router.push('/sugeridos')
  }

  if (loading) return (<><Navbar /><div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div></>)
  if (!product) return (<><Navbar /><div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-gray-500">Producto no encontrado.</p><button onClick={() => router.back()} className="mt-4 btn-primary">Volver</button></div></>)

  const sphs: number[] = product.sph_disponibles ?? []
  const cyls: number[] = product.cyl_disponibles ?? []
  const adds: string[] = product.add_disponibles ?? []

  const sphRange = sphs.length > 0 ? ALL_SPH.filter(v => v >= Math.min(...sphs) && v <= Math.max(...sphs)) : []
  const cylRange = cyls.length > 0 ? ALL_CYL.filter(v => v >= Math.min(...cyls) && v <= Math.max(...cyls)) : []

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="card overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
            {product.imagen_url ? (
              <Image src={product.imagen_url} alt={product.nombre} width={400} height={400} className="object-contain p-8" />
            ) : (
              <Eye className="w-24 h-24 text-gray-200" />
            )}
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-primary-600 mb-1">{product.marca}</p>
              {product.tipo && <span className="badge bg-primary-100 text-primary-700 mb-3 inline-block">{TIPO_LABELS[product.tipo]}</span>}
              <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">RD${product.precio.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-0.5">{product.stock > 0 ? product.stock <= 5 ? `Solo ${product.stock} en stock` : 'En stock' : 'Sin stock'}</p>
            </div>
            {product.descripcion && <p className="text-gray-600 text-sm leading-relaxed">{product.descripcion}</p>}

            {needsSph && sphRange.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Graduacion (SPH) <span className="text-red-500">*</span></label>
                <select value={selectedSph ?? ''} onChange={e => setSelectedSph(e.target.value === '' ? null : parseFloat(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">-- Selecciona tu graduacion --</option>
                  {sphRange.map(s => {
                    const ok = sphs.includes(s)
                    return <option key={s} value={s} disabled={!ok}>{s > 0 ? '+' + s : s}{ok ? '' : ' (no disponible)'}</option>
                  })}
                </select>
              </div>
            )}

            {cylRange.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cilindro (CYL)</label>
                <select value={selectedCyl ?? ''} onChange={e => setSelectedCyl(e.target.value === '' ? null : parseFloat(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">-- Selecciona cilindro --</option>
                  {cylRange.map(c => {
                    const ok = cyls.includes(c)
                    return <option key={c} value={c} disabled={!ok}>{c}{ok ? '' : ' (no disponible)'}</option>
                  })}
                </select>
              </div>
            )}

            {adds.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adicion (ADD)</label>
                <select value={selectedAdd ?? ''} onChange={e => setSelectedAdd(e.target.value === '' ? null : e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="">-- Selecciona adicion --</option>
                  {adds.sort().map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-gray-700">Cantidad</p>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">-</button>
                <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
              </div>
            </div>

            {['esferico','torico','multifocal'].includes(product.tipo ?? '') && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Esta recomendacion es orientativa. Consulta siempre con un profesional de la salud visual antes de comprar lentes de contacto.</span>
              </div>
            )}

            <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-lg disabled:opacity-50">
              Comprar ahora
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
