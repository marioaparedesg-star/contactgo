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

const PRODUCT_COLORS: Record<string, string[]> = {
  'AOC-6U': ['Pure Hazel','Honey','Green','Green Esmeralda','Blue','Gray','Gray Sterling','Brown','True Sapphire'],
  'LUN-2U': ['Green','Gray','Blue Gray','Light Blue'],
  'FLC-2U': ['Blue','Brown','Gray','Green','Honey','Pure Hazel'],
  'CV-2U':  ['Blue'],
}

const COLOR_CSS: Record<string, string> = {
  'Pure Hazel':'#7B4F2E','Honey':'#C8860A','Green':'#16A34A','Green Esmeralda':'#059669',
  'Blue':'#2563EB','Gray':'#6B7280','Gray Sterling':'#9CA3AF','Brown':'#78350F',
  'True Sapphire':'#1E3A8A','Blue Gray':'#64748B','Light Blue':'#38BDF8',
}

const SOLUTION_SIZES: Record<string, string[]> = {
  'RENU-MULTI': ['60ml','120ml','355ml'],
  'OPTI-MULTI': ['90ml','120ml','300ml'],
  'PRO-60ML':   ['60ml'],
  'DRE-80ML':   ['80ml'],
  'SPR-FOAM':   ['Frasco único'],
}

const SOLUTION_PRICES: Record<string, Record<string, number>> = {
  'RENU-MULTI': { '60ml':350,'120ml':550,'355ml':950 },
  'OPTI-MULTI': { '90ml':400,'120ml':600,'300ml':1100 },
  'PRO-60ML':   { '60ml':400 },
  'DRE-80ML':   { '80ml':190 },
  'SPR-FOAM':   { 'Frasco único':350 },
}

const ALL_SPH = [
  -20,-19.5,-19,-18.5,-18,-17.5,-17,-16.5,-16,-15.5,-15,-14.5,-14,-13.5,-13,-12.5,
  -12,-11.5,-11,-10.5,-10,-9.5,-9,-8.5,-8,-7.5,-7,-6.5,-6,-5.75,-5.5,-5.25,-5,
  -4.75,-4.5,-4.25,-4,-3.75,-3.5,-3.25,-3,-2.75,-2.5,-2.25,-2,-1.75,-1.5,-1.25,
  -1,-0.75,-0.5,-0.25,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,
  3.75,4,4.25,4.5,4.75,5,5.25,5.5,5.75,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12
]
const ALL_CYL  = [-0.25,-0.5,-0.75,-1,-1.25,-1.5,-1.75,-2,-2.25,-2.5,-2.75,-3,-3.25,-3.5,-3.75,-4,-4.25,-4.5,-4.75,-5,-5.25,-5.5,-5.75,-6]
const ALL_AXIS = Array.from({ length: 180 }, (_, i) => i + 1)
const ALL_ADD  = ['+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00']

function EyeSelector({ eye, onChange }: { eye: string, onChange: (v:string) => void }) {
  const opts = [
    { val:'OD', label:'Ojo Derecho' },
    { val:'OS', label:'Ojo Izquierdo' },
    { val:'AMBOS', label:'Ambos ojos' },
  ]
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Ojo <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(o => (
          <button key={o.val} onClick={() => onChange(o.val)}
            className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
              eye === o.val ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SelectField({ label, value, options, onChange, required, format }: {
  label: string, value: string, options: (string|number)[], required?: boolean,
  onChange: (v:string) => void, format?: (v:string|number) => string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
        <option value="">-- Selecciona {label.toLowerCase()} --</option>
        {options.map(o => (
          <option key={o} value={String(o)}>{format ? format(o) : String(o)}</option>
        ))}
      </select>
    </div>
  )
}

export default function ProductoPage() {
  const { slug } = useParams() as { slug: string }
  const router  = useRouter()
  const addItem = useCartStore(s => s.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [eye,   setEye]   = useState('AMBOS')
  const [sph,   setSph]   = useState('')
  const [cyl,   setCyl]   = useState('')
  const [axis,  setAxis]  = useState('')
  const [add,   setAdd]   = useState('')
  const [color, setColor] = useState('')
  const [size,  setSize]  = useState('')
  const [qty,   setQty]   = useState(1)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const sb = createClient()
  }, [slug])

  useEffect(() => {
    if (!product || !size) return
    const prices = SOLUTION_PRICES[(product as any).sku ?? '']
    if (prices?.[size]) setPrice(prices[size])
  }, [size, product])

  const tipo   = product?.tipo ?? ''
  const sku    = (product as any)?.sku ?? ''
  const colors = PRODUCT_COLORS[sku] ?? []
  const sizes  = SOLUTION_SIZES[sku]  ?? []

  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  const isColor    = tipo === 'color'
  const isToric    = tipo === 'torico'
  const isMulti    = tipo === 'multifocal'

  const handleAdd = () => {
    if (!product) return
    if (isLente && !isColor && !sph)          { toast.error('Selecciona una graduación'); return }
    if (isColor && !color)                    { toast.error('Selecciona un color'); return }
    if (isToric && !cyl)                      { toast.error('Selecciona el cilindro (CYL)'); return }
    if (isToric && !axis)                     { toast.error('Selecciona el eje (AXIS)'); return }
    if (isMulti && !add)                      { toast.error('Selecciona la adición (ADD)'); return }
    if (isSolucion && sizes.length > 1 && !size) { toast.error('Selecciona el tamaño'); return }
    addItem(product, {
      cantidad: qty,
      sph:       sph   ? parseFloat(sph)  : undefined,
      cyl:       cyl   ? parseFloat(cyl)  : undefined,
      axis:      axis  ? parseInt(axis)   : undefined,
      add_power: add   || undefined,
      color:     color || undefined,
      ojo:       isLente ? eye : undefined,
      size:      size  || undefined,
    } as any)
    toast.success('Agregado al carrito ✓')
  }

  const handleBuyNow = () => { handleAdd(); router.push('/checkout') }

  if (loading) return (
    <><Navbar />
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div></>
  )

  if (!product) return (
    <><Navbar />
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Producto no encontrado.</p>
      <button onClick={() => router.back()} className="mt-4 btn-primary">Volver</button>
    </div></>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
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
              <p className="text-3xl font-bold text-gray-900">RD${price.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {(product as any).contenido && `${(product as any).contenido} · `}
                {(product as any).reemplazo}
              </p>
              <p className="text-xs mt-0.5 font-medium">
                {product.stock > 0
                  ? product.stock <= 5
                    ? <span className="text-orange-600">¡Solo {product.stock} en stock!</span>
                    : <span className="text-green-600">En stock ✓</span>
                  : <span className="text-red-500">Sin stock</span>
                }
              </p>
            </div>
            {product.descripcion && <p className="text-gray-600 text-sm leading-relaxed">{product.descripcion}</p>}

            {isLente && !isColor && <EyeSelector eye={eye} onChange={setEye} />}

            {isLente && (
              <SelectField label="Graduación (SPH)" value={sph} options={ALL_SPH} required
                onChange={setSph} format={v => Number(v) > 0 ? `+${v}` : String(v)} />
            )}

            {isToric && (
              <>
                <SelectField label="Cilindro (CYL)" value={cyl} options={ALL_CYL} required onChange={setCyl} />
                <SelectField label="Eje (AXIS)" value={axis} options={ALL_AXIS} required onChange={setAxis}
                  format={v => String(v).padStart(3,'0') + '°'} />
              </>
            )}

            {isMulti && (
              <SelectField label="Adición (ADD)" value={add} options={ALL_ADD} required onChange={setAdd} />
            )}

            {isColor && colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color <span className="text-red-500">*</span>
                  {color && <span className="ml-2 font-normal text-primary-600">— {color}</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button key={c} onClick={() => setColor(c)} title={c}
                      className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${
                        color === c ? 'border-primary-600 scale-110 shadow-md' : 'border-white hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: COLOR_CSS[c] ?? '#CBD5E1', outline: '1px solid #E5E7EB' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {isSolucion && sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tamaño {sizes.length > 1 && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        size === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                      }`}>
                      {s}
                      {SOLUTION_PRICES[sku]?.[s] && <span className="ml-1 text-xs opacity-75">RD${SOLUTION_PRICES[sku][s].toLocaleString()}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isGota && (
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-gray-700">Cantidad</p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">-</button>
                  <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock,q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
                </div>
              </div>
            )}

            {(product as any).curva_base && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2 bg-gray-50">Especificaciones técnicas</p>
                <div className="divide-y divide-gray-50">
                  {[
                    ['Curva base', (product as any).curva_base],
                    ['Diámetro',   (product as any).diametro && (product as any).diametro + ' mm'],
                    ['Reemplazo',  (product as any).reemplazo],
                    ['Contenido',  (product as any).contenido],
                  ].filter(([,v]) => v).map(([k,v]) => (
                    <div key={k as string} className="flex justify-between px-4 py-2.5">
                      <span className="text-xs text-gray-500">{k}</span>
                      <span className="text-xs font-semibold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {['esferico','torico','multifocal'].includes(tipo) && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Consulta siempre con un profesional de la salud visual antes de comprar lentes de contacto.</span>
              </div>
            )}

            <button onClick={handleAdd} disabled={product.stock === 0}
              className="btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base disabled:opacity-50">
              Comprar ahora →
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
