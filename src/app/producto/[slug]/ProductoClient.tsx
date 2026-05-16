'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowLeft, Eye, AlertCircle } from 'lucide-react'
import Reviews from '@/components/ui/Reviews'
import CrossSelling from '@/components/shop/CrossSelling'
import ProductFAQ from '@/components/shop/ProductFAQ'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import SuscripcionSelector, { DESCUENTOS } from '@/components/shop/SuscripcionSelector'

const TIPO_LABELS: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal',
  color: 'Color', solucion: 'Solución', gota: 'Gotas',
}

const COLOR_CSS: Record<string, string> = {
  // Air Optix Colors — colores oficiales
  'Brilliant Blue':  '#1D4ED8',
  'Blue':            '#3B82F6',
  'True Sapphire':   '#1E3A8A',
  'Pure Hazel':      '#92400E',
  'Honey':           '#D97706',
  'Brown':           '#78350F',
  'Sterling Gray':   '#9CA3AF',
  'Gray':            '#6B7280',
  'Gemstone Green':  '#059669',
  'Green':           '#16A34A',
  'Amethyst':        '#7C3AED',
  'Turquoise':       '#0891B2',
  // FreshLook
  'True Blue':       '#2563EB',
  // Lunare / Color View (español)
  'Azul':            '#3B82F6',
  'Miel':            '#D97706',
  'Verde':           '#16A34A',
  'Gris':            '#6B7280',
  'Avellana':        '#92400E',
  'Negro':           '#111827',
  'Turquesa':        '#0891B2',
}

const SOLUTION_SIZES: Record<string, string[]> = {
  'RENU-MULTI': ['60ml','120ml','355ml'],
  'OPTI-MULTI': ['90ml','120ml','300ml'],
  'PRO-60ML':   ['60ml'],
  'DRE-80ML':   ['80ml'],
  'SPR-FOAM':   ['Frasco único'],
}

const SOLUTION_PRICES: Record<string, Record<string, number>> = {
  'RENU-MULTI': { '60ml':562,'120ml':655,'355ml':1353 },
  'OPTI-MULTI': { '90ml':450,'120ml':700,'300ml':1250 },
  'PRO-60ML':   { '60ml':419 },
  'PRO-350ML':  { '350ml':869 },
  'DRE-80ML':   { '80ml':333 },
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

function EyeSelector({ eye, onChange }: { eye: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Ojo <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-3 gap-2">
        {[{val:'OD',label:'Ojo Derecho'},{val:'OS',label:'Ojo Izquierdo'},{val:'AMBOS',label:'Ambos ojos'}].map(o => (
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
  label: string; value: string; options: (string|number)[]; required?: boolean
  onChange: (v: string) => void; format?: (v: string|number) => string
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

interface Props {
  product: Product & Record<string, any>
  variants: any[]
}

export default function ProductoClient({ product, variants }: Props) {
  const router  = useRouter()
  const addItem = useCartStore(s => s.addItem)

  const [eye,   setEye]   = useState('AMBOS')
  const [sph,   setSph]   = useState('')
  const [cyl,   setCyl]   = useState('')
  const [axis,  setAxis]  = useState('')
  const [add,   setAdd]   = useState('')
  const [color, setColor] = useState('')
  const [size,  setSize]  = useState('')
  const [qty,   setQty]   = useState(1)
  const [price, setPrice] = useState(product.precio ?? 0)
  const [suscripcion, setSuscripcion] = useState<string | null>(null)

  const tipo       = product.tipo ?? ''
  const sku        = product.sku ?? ''
  const colors     = (product as any).colores_disponibles ?? []
  const sizes      = SOLUTION_SIZES[sku]  ?? []

  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  const isColor    = tipo === 'color'
  const isToric    = tipo === 'torico'
  const isMulti    = tipo === 'multifocal'

  useEffect(() => {
    let base = product.precio
    if (size) {
      const prices = SOLUTION_PRICES[sku]
      if (prices?.[size]) base = prices[size]
    }
    const desc = suscripcion ? DESCUENTOS[suscripcion] ?? 0 : 0
    setPrice(Math.round(base * (1 - desc)))
  }, [size, product.precio, sku, suscripcion])

  const handleAdd = () => {
    if (isLente && !isColor && !sph)               { toast.error('Selecciona una graduación'); return }
    if (isColor && !color)                          { toast.error('Selecciona un color'); return }
    if (isToric && !cyl)                            { toast.error('Selecciona el cilindro (CYL)'); return }
    if (isToric && !axis)                           { toast.error('Selecciona el eje (AXIS)'); return }
    if (isMulti && !add)                            { toast.error('Selecciona la adición (ADD)'); return }
    if (isSolucion && sizes.length > 1 && !size)    { toast.error('Selecciona el tamaño'); return }
    addItem(product, {
      suscripcion: suscripcion ?? undefined,
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

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-4 pb-32 md:pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <button onClick={() => router.back()} className="hover:text-primary-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Catálogo
          </button>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-xs">{product.nombre}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Imagen — sticky en desktop */}
          <div className="md:sticky md:top-20">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 aspect-square flex items-center justify-center shadow-sm">
              {product.imagen_url ? (
                <Image src={product.imagen_url} alt={product.nombre} width={420} height={420}
                  className="object-contain p-10" priority />
              ) : (
                <Eye className="w-20 h-20 text-gray-200" />
              )}
            </div>
            {/* Trust badges bajo la imagen — solo desktop */}
            <div className="hidden md:grid grid-cols-2 gap-2 mt-3">
              {[
                { icon:'✅', text:'100% Original' },
                { icon:'🚚', text:'Entrega 24-72h' },
                { icon:'🔒', text:'Pago seguro' },
                { icon:'↩️', text:'7 días devolución' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-xs text-gray-600 font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{product.marca}</span>
                {product.tipo && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {TIPO_LABELS[product.tipo]}
                  </span>
                )}
              </div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {product.nombre}
              </h1>
            </div>

            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <p className="text-3xl font-black text-gray-900">RD${price.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {product.contenido && `${product.contenido} · `}{product.reemplazo}
                  {/* Precio por lente para lentes graduados */}
                  {product.dias_uso === 1 && price > 0 && (
                    <span className="ml-2 text-primary-600 font-semibold">
                      ≈ RD${Math.round(price / 30).toLocaleString()}/lente
                    </span>
                  )}
                  {product.dias_uso === 14 && price > 0 && (
                    <span className="ml-2 text-primary-600 font-semibold">
                      ≈ RD${Math.round(price / 6).toLocaleString()}/lente
                    </span>
                  )}
                  {product.dias_uso === 30 && price > 0 && (
                    <span className="ml-2 text-primary-600 font-semibold">
                      ≈ RD${Math.round(price / 6).toLocaleString()}/lente
                    </span>
                  )}
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                product.stock === 0 ? 'bg-red-100 text-red-600' :
                product.stock <= 5 ? 'bg-orange-100 text-orange-600' :
                'bg-green-100 text-green-700'
              }`}>
                {product.stock === 0 ? 'Sin stock' : product.stock <= 5 ? `¡Solo ${product.stock} en stock!` : 'En stock ✓'}
              </span>
            </div>

            {/* Aviso entrega tóricos */}
            {product.tipo === 'torico' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <span className="text-amber-500 shrink-0 mt-0.5">⏱️</span>
                <div>
                  <p className="text-amber-800 font-bold text-xs">Tiempo de entrega: 20-30 días</p>
                  <p className="text-amber-600 text-[10px] mt-0.5 leading-relaxed">Los lentes tóricos para astigmatismo se fabrican a medida según tu graduación exacta (SPH, CYL y EJE). El tiempo de entrega es mayor al habitual.</p>
                </div>
              </div>
            )}
            {isLente && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                <span className="text-blue-500 shrink-0 mt-0.5">⚕️</span>
                <p className="text-xs text-blue-700 leading-snug">
                  <strong>Dispositivo médico.</strong> Requiere prescripción óptica vigente. Al comprar confirmas que cuentas con una receta actualizada y aceptarás las condiciones de uso seguro.
                </p>
              </div>
            )}


            {product.descripcion && (
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-4">{product.descripcion}</p>
            )}

            {isLente && !isColor && <EyeSelector eye={eye} onChange={setEye} />}

            {isLente && (() => {
              const sphOpts = product.sph_disponibles?.length
                ? [...product.sph_disponibles].sort((a,b) => Number(a)-Number(b))
                : ALL_SPH
              return (
                <SelectField label="Graduación (SPH)" value={sph} options={sphOpts} required
                  onChange={setSph} format={v => Number(v) > 0 ? `+${Number(v).toFixed(2)}` : Number(v) === 0 ? 'Plano' : Number(v).toFixed(2)} />
              )
            })()}

            {isToric && (() => {
              const cylOpts = product.cyl_disponibles?.length
                ? [...product.cyl_disponibles].sort((a,b) => Number(a)-Number(b))
                : ALL_CYL
              const axisOpts = product.axis_disponibles?.length
                ? [...product.axis_disponibles].sort((a,b) => Number(a)-Number(b))
                : ALL_AXIS
              return (<>
                <SelectField label="Cilindro (CYL)" value={cyl} options={cylOpts} required onChange={setCyl}
                  format={v => Number(v).toFixed(2)} />
                <SelectField label="Eje (AXIS)" value={axis} options={axisOpts} required onChange={setAxis}
                  format={v => String(v).padStart(3,'0') + '°'} />
              </>)
            })()}

            {isMulti && (() => {
              const addOpts = product.add_disponibles?.length
                ? product.add_disponibles
                : ALL_ADD
              return (
                <SelectField label="Adición (ADD)" value={add} options={addOpts} required onChange={setAdd} />
              )
            })()}

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
                      {SOLUTION_PRICES[sku]?.[s] && (
                        <span className="ml-1 text-xs opacity-75">RD${SOLUTION_PRICES[sku][s].toLocaleString()}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isGota && (
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-gray-700">Cantidad</p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1,q-1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">-</button>
                  <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock,q+1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
                </div>
              </div>
            )}

            {product.curva_base && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2 bg-gray-50">
                  Especificaciones técnicas
                </p>
                <div className="divide-y divide-gray-50">
                  {[
                    ['Curva base', product.curva_base],
                    ['Diámetro',   product.diametro && product.diametro + ' mm'],
                    ['Reemplazo',  product.reemplazo],
                    ['Contenido',  product.contenido],
                  ].filter(([,v]) => v).map(([k,v]) => (
                    <div key={String(k)} className="flex justify-between px-4 py-2.5">
                      <span className="text-xs text-gray-500">{k}</span>
                      <span className="text-xs font-semibold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SuscripcionSelector
              value={suscripcion}
              onChange={setSuscripcion}
              precio={product.precio}
              tipo={tipo}
            />

            {['esferico','torico','multifocal'].includes(tipo) && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Consulta siempre con un profesional de la salud visual antes de comprar lentes de contacto.</span>
              </div>
            )}



            <div className="flex flex-col gap-2">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50">
                Comprar ahora →
              </button>
            </div>
          </div>
        </div>
      </main>

      <Reviews productId={product.id} />
      <CrossSelling tipo={product.tipo} currentId={product.id} />
      <ProductFAQ tipo={product.tipo} nombre={product.nombre} />

      {/* Sticky CTA móvil */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1">
            <p className="text-xs text-gray-500 truncate">{product.nombre}</p>
            <p className="font-black text-primary-600 text-lg">RD${price.toLocaleString()}</p>
          </div>
          <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer"
            className="bg-green-500 text-white px-3 py-3 rounded-xl text-sm font-bold flex items-center gap-1 shrink-0">
            💬
          </a>
          <button onClick={handleAdd}
            className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Agregar al carrito
          </button>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </>
  )
}
