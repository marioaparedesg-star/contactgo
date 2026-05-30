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
import { trackEcommerce } from '@/lib/analytics'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import SuscripcionSelector from '@/components/shop/SuscripcionSelector'
import EntregaBadge from '@/components/shop/EntregaBadge'
import { getEntrega } from '@/lib/delivery-times'
import { DESCUENTOS, SOLUTION_SIZES, SOLUTION_PRICES } from '@/lib/subscription-utils'

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

// SOLUTION_SIZES y SOLUTION_PRICES importados desde @/lib/subscription-utils

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
  const opts = [
    {val:'OD',   emoji:'👁', label:'Ojo Derecho',   sub:'OD'},
    {val:'OI',   emoji:'👁', label:'Ojo Izquierdo', sub:'OI'},
    {val:'AMBOS',emoji:'👀', label:'Ambos ojos',    sub:'OD + OS'},
  ]
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        ¿Para qué ojo? <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(o => (
          <button key={o.val} onClick={() => onChange(o.val)}
            className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
              eye === o.val
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
            }`}>
            <div className="text-base mb-0.5">{o.emoji}</div>
            <p className="text-[10px] font-black">{o.sub}</p>
            <p className={`text-[9px] ${eye === o.val ? 'text-white/80' : 'text-gray-400'}`}>{o.label}</p>
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
  // Receta ojo derecho (OD) y ojo izquierdo (OS)
  const [sphOD, setSphOD] = useState('')
  const [cylOD, setCylOD] = useState('')
  const [axisOD,setAxisOD]= useState('')
  const [sphOS, setSphOS] = useState('')
  const [cylOS, setCylOS] = useState('')
  const [axisOS,setAxisOS]= useState('')
  // Para un solo ojo o cuando ambos tienen igual receta
  const [sph,   setSph]   = useState('')
  const [cyl,   setCyl]   = useState('')
  const [axis,  setAxis]  = useState('')
  const [add,   setAdd]   = useState('')
  const [color, setColor] = useState('')
  const [size,  setSize]  = useState('')
  const [qty,   setQty]   = useState(1)
  const [mismaSph, setMismaSph] = useState(false) // ambos ojos misma receta
  const [price, setPrice] = useState(product.precio ?? 0)
  const [precioBase, setPrecioBase] = useState(product.precio ?? 0) // precio con size, sin descuento suscripción
  const [suscripcion, setSuscripcion] = useState<string | null>(null)

  const tipo       = product.tipo ?? ''
  const getEntregaInfo = getEntrega(tipo, product.nombre)
  const sku        = product.sku ?? ''
  const colors     = (product as any).colores_disponibles ?? []
  const sizes      = SOLUTION_SIZES[sku]  ?? []

  const isLente    = ['esferico','torico','multifocal','color'].includes(tipo)
  const isSolucion = tipo === 'solucion'
  const isGota     = tipo === 'gota'
  const isColor    = tipo === 'color'
  const isToric    = tipo === 'torico'
  const isMulti    = tipo === 'multifocal'

  // Verificar si la combinación seleccionada tiene stock real en product_inventory
  // Evita que se vendan variantes (SPH+CYL+AXIS) que no existen en inventario
  const inventario = (product as any).inventory_disponible as any[] ?? []
  const varianteSeleccionadaTieneStock = (): boolean => {
    if (!isLente || isColor || !inventario.length) return true // no aplica
    const sphNum  = sph  ? parseFloat(sph)  : null
    const cylNum  = cyl  ? parseFloat(cyl)  : null
    const axisNum = axis ? parseInt(axis)   : null
    const addVal  = add  || null
    if (sphNum === null) return true // aún no seleccionó SPH — botón habilitado (SelectField lo bloquea)
    return inventario.some((v: any) => {
      const sphMatch  = Math.abs(Number(v.sph) - sphNum) < 0.001
      const cylMatch  = cylNum  === null ? v.cyl  == null : (v.cyl  != null && Math.abs(Number(v.cyl) - cylNum) < 0.001)
      const axisMatch = axisNum === null ? v.axis == null : (v.axis != null && v.axis === axisNum)
      const addMatch  = addVal  === null ? v.add_power == null : v.add_power === addVal
      return sphMatch && cylMatch && axisMatch && addMatch
    })
  }
  const sinVariante = isLente && !isColor && sph !== '' && !varianteSeleccionadaTieneStock()

  // ── Analytics: view_item al cargar el producto ──────────────────────────
  useEffect(() => {
    trackEcommerce('view_item', {
      items: [{
        item_id:       product.id,
        item_name:     product.nombre,
        item_brand:    product.marca ?? '',
        item_category: product.tipo  ?? '',
        price:         product.precio ?? 0,
        quantity:      1,
      }],
    })
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let base = product.precio
    if (size) {
      const prices = SOLUTION_PRICES[sku]
      if (prices?.[size]) base = prices[size]
    }
    setPrecioBase(base) // precio base con size, sin descuento
    const desc = suscripcion ? DESCUENTOS[suscripcion] ?? 0 : 0
    setPrice(Math.round(base * (1 - desc)))
  }, [size, product.precio, sku, suscripcion])

  const handleAdd = (): boolean => {
    if (isColor && !color) { toast.error('Selecciona un color'); return false }
    if (isSolucion && sizes.length > 1 && !size) { toast.error('Selecciona el tamaño'); return false }

    if (isLente && !isColor) {
      if (eye === 'AMBOS') {
        // Validar ambos ojos
        if (mismaSph) {
          // Misma receta ambos ojos
          if (!sph)  { toast.error('Selecciona la graduación SPH'); return false }
          if (isToric && !cyl)  { toast.error('Selecciona el cilindro CYL'); return false }
          if (isToric && !axis) { toast.error('Selecciona el eje AXIS'); return false }
          // Agregar OD
          addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, sph:parseFloat(sph), cyl:cyl?parseFloat(cyl):undefined, axis:axis?parseInt(axis):undefined, add_power:add||undefined, ojo:'OD', size:size||undefined, precio_override:price, precio_original:precioBase } as any)
          // Agregar OS (misma receta)
          addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, sph:parseFloat(sph), cyl:cyl?parseFloat(cyl):undefined, axis:axis?parseInt(axis):undefined, add_power:add||undefined, ojo:'OS', size:size||undefined, precio_override:price, precio_original:precioBase } as any)
        } else {
          // Receta diferente por ojo
          if (!sphOD && !sphOS) { toast.error('Ingresa la receta de al menos un ojo'); return false }
          if (sphOD) {
            if (isToric && !cylOD)  { toast.error('Falta el CYL del ojo derecho'); return false }
            if (isToric && !axisOD) { toast.error('Falta el AXIS del ojo derecho'); return false }
            addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, sph:parseFloat(sphOD), cyl:cylOD?parseFloat(cylOD):undefined, axis:axisOD?parseInt(axisOD):undefined, add_power:add||undefined, ojo:'OD', size:size||undefined, precio_override:price, precio_original:precioBase } as any)
          }
          if (sphOS) {
            if (isToric && !cylOS)  { toast.error('Falta el CYL del ojo izquierdo'); return false }
            if (isToric && !axisOS) { toast.error('Falta el AXIS del ojo izquierdo'); return false }
            addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, sph:parseFloat(sphOS), cyl:cylOS?parseFloat(cylOS):undefined, axis:axisOS?parseInt(axisOS):undefined, add_power:add||undefined, ojo:'OI', size:size||undefined, precio_override:price, precio_original:precioBase } as any)
          }
        }
      } else {
        // Un solo ojo (OD o OS)
        if (!sph) { toast.error('Selecciona la graduación SPH'); return false }
        if (isToric && !cyl)  { toast.error('Selecciona el cilindro CYL'); return false }
        if (isToric && !axis) { toast.error('Selecciona el eje AXIS'); return false }
        addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, sph:parseFloat(sph), cyl:cyl?parseFloat(cyl):undefined, axis:axis?parseInt(axis):undefined, add_power:add||undefined, ojo:eye, size:size||undefined, precio_override:price, precio_original:precioBase } as any)
      }
    } else {
      // Solución, gota, color
      addItem(product, { suscripcion:suscripcion??undefined, cantidad:qty, color:color||undefined, size:size||undefined, precio_override:price, precio_original:precioBase } as any)
    }

    toast.success(eye === 'AMBOS' && isLente && !isColor ? 'Agregado para ambos ojos ✓' : 'Agregado al carrito ✓')
    // Analytics: add_to_cart
    trackEcommerce('add_to_cart', {
      items: [{
        item_id:       product.id,
        item_name:     product.nombre,
        item_brand:    product.marca ?? '',
        item_category: product.tipo  ?? '',
        price,
        quantity:      qty,
      }],
      value: price * qty,
    })
    return true
  }

  const handleBuyNow = () => { if (handleAdd()) router.push('/checkout') }

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

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 lg:gap-12 xl:gap-16 items-start">
          {/* Imagen — sticky en desktop */}
          <div className="md:sticky md:top-20">
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 aspect-square flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              {/* Badge original */}
              <span className="absolute top-3 right-3 text-[9px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full z-10 flex items-center gap-1 leading-none">
                ✓ 100% Original
              </span>
              {product.imagen_url ? (
                <Image src={product.imagen_url} alt={product.nombre} width={480} height={480}
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out" priority unoptimized />
              ) : (
                <Eye className="w-20 h-20 text-gray-200" />
              )}
            </div>
            {/* Trust strip — visible en móvil y desktop */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { icon:'✅', text:'100% Original' },
                { icon:'🚚', text:'Entrega 24-48h' },
                { icon:'💳', text:'Pago seguro AZUL' },
                { icon:'↩️', text:'48h devolución' },
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
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 ${
                  product.stock === 0   ? 'bg-red-50 text-red-600 border border-red-100' :
                  product.stock <= 3    ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                  product.stock <= 8    ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  'bg-green-50 text-green-700 border border-green-100'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block bg-current opacity-70" />
                  {product.stock === 0  ? 'Sin stock' :
                   product.stock <= 3   ? `¡Últimas ${product.stock} unidades!` :
                   product.stock <= 8   ? `Pocas unidades — ${product.stock} disponibles` :
                   'En stock · Envío hoy'}
                </span>
              </div>
            </div>

            {/* Tiempo de entrega — dinámico por categoría */}
            <EntregaBadge tipo={product.tipo} nombre={product.nombre} variant="pdp" />
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

            {isLente && !isColor && (() => {
              // Si no hay variantes reales en inventario, no mostrar opciones falsas
              const tieneVariantes = (product as any).tiene_variantes_reales !== false
              const sphOpts = product.sph_disponibles?.length
                ? [...product.sph_disponibles].sort((a:any,b:any) => Number(a)-Number(b))
                : tieneVariantes ? ALL_SPH : []
              const fmtSph = (v:any) => Number(v) > 0 ? `+${Number(v).toFixed(2)}` : Number(v) === 0 ? 'Plano (0.00)' : Number(v).toFixed(2)

              const cylOpts = product.cyl_disponibles?.length ? [...product.cyl_disponibles].sort((a:any,b:any)=>Number(a)-Number(b)) : ALL_CYL
              const axisOpts = product.axis_disponibles?.length ? [...product.axis_disponibles].sort((a:any,b:any)=>Number(a)-Number(b)) : ALL_AXIS

              if (eye === 'AMBOS') {
                return (
                  <div className="space-y-3">
                    {/* Toggle misma receta */}
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                      <input type="checkbox" id="mismaSph" checked={mismaSph} onChange={e=>setMismaSph(e.target.checked)}
                        className="w-4 h-4 accent-primary-600"/>
                      <label htmlFor="mismaSph" className="text-xs text-blue-700 font-semibold cursor-pointer">
                        Ambos ojos tienen la misma receta
                      </label>
                    </div>

                    {mismaSph ? (
                      /* Misma receta para ambos */
                      <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                        <p className="text-xs font-bold text-gray-500 uppercase">Receta (OD + OI igual)</p>
                        {sphOpts.length === 0
                          ? <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                              📞 Para esta graduación contáctanos por WhatsApp o llena el formulario de receta y te cotizamos.
                            </div>
                          : <SelectField label="SPH" value={sph} options={sphOpts} required onChange={setSph} format={fmtSph}/>
                        }
                        {isToric && <>
                          <SelectField label="CYL" value={cyl} options={cylOpts} required onChange={setCyl} format={v=>Number(v).toFixed(2)}/>
                          <SelectField label="AXIS" value={axis} options={axisOpts} required onChange={setAxis} format={v=>String(v).padStart(3,'0')+'°'}/>
                        </>}
                      </div>
                    ) : (
                      /* Receta diferente por ojo */
                      <div className="grid grid-cols-2 gap-3">
                        {/* OD */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-bold text-blue-700">👁 Ojo Derecho (OD)</p>
                          <SelectField label="SPH" value={sphOD} options={sphOpts} onChange={setSphOD} format={fmtSph}/>
                          {isToric && <>
                            <SelectField label="CYL" value={cylOD} options={cylOpts} onChange={setCylOD} format={v=>Number(v).toFixed(2)}/>
                            <SelectField label="AXIS" value={axisOD} options={axisOpts} onChange={setAxisOD} format={v=>String(v).padStart(3,'0')+'°'}/>
                          </>}
                        </div>
                        {/* OS */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-bold text-green-700">👁 Ojo Izquierdo (OI)</p>
                          <SelectField label="SPH" value={sphOS} options={sphOpts} onChange={setSphOS} format={fmtSph}/>
                          {isToric && <>
                            <SelectField label="CYL" value={cylOS} options={cylOpts} onChange={setCylOS} format={v=>Number(v).toFixed(2)}/>
                            <SelectField label="AXIS" value={axisOS} options={axisOpts} onChange={setAxisOS} format={v=>String(v).padStart(3,'0')+'°'}/>
                          </>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              // Un solo ojo (OD o OS)
              return (
                <div className="space-y-3">
                  <SelectField label="Graduación (SPH)" value={sph} options={sphOpts} required onChange={setSph} format={fmtSph}/>
                  {isToric && <>
                    <SelectField label="Cilindro (CYL)" value={cyl} options={cylOpts} required onChange={setCyl} format={v=>Number(v).toFixed(2)}/>
                    <SelectField label="Eje (AXIS)" value={axis} options={axisOpts} required onChange={setAxis} format={v=>String(v).padStart(3,'0')+'°'}/>
                  </>}
                </div>
              )
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
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-sm font-semibold text-gray-700">Cantidad</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1,q-1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">-</button>
                    <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock,q+1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
                  </div>
                </div>
                {isLente && !isColor && product.stock >= 2 && (
                  <button onClick={() => setQty(2)}
                    className={`w-full text-left flex items-center justify-between rounded-xl px-3 py-2.5 border transition-all text-xs
                      ${qty === 2
                        ? 'bg-primary-50 border-primary-400 text-primary-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-primary-50/50'
                      }`}>
                    <span className="font-bold">📦 Pack 2 cajas</span>
                    <span className={`font-black text-sm ${qty === 2 ? 'text-primary-700' : 'text-green-700'}`}>
                      RD${Math.round(precioBase * 2 * 0.95).toLocaleString()} <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full ml-1">5% OFF</span>
                    </span>
                  </button>
                )}
              </div>
            )}

            {(product.curva_base || product.material || (product as any).fabricante_nombre) && (
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-3 border-b border-gray-100">
                  Especificaciones clínicas
                </p>
                <div className="grid grid-cols-2 gap-px bg-gray-100">
                  {[
                    ['📐 Curva base',         product.curva_base],
                    ['⭕ Diámetro',            product.diametro ? product.diametro + (String(product.diametro).includes('mm') ? '' : ' mm') : null],
                    ['🔄 Reemplazo',           product.reemplazo],
                    ['📦 Contenido',           product.contenido],
                    ['🧪 Material',            product.material],
                    ['💧 Contenido de agua',   (product as any).agua ? (product as any).agua + (String((product as any).agua).includes('%') ? '' : '%') : null],
                    ['🌬️ Transmisión O₂',     (product as any).oxígeno ?? (product as any).oxigeno],
                    ['🕐 Horas de uso',        (product as any).horas_uso],
                    ['📋 Uso recomendado',     (product as any).uso_recomendado],
                    ['🏭 Fabricante',          (product as any).fabricante_nombre],
                    ['🌍 País de origen',      (product as any).pais_origen],
                    ['🛡️ Protección UV',      (product as any).proteccion_uv ? 'Clase II (bloques ≥99% UV-B y ≥95% UV-A)' : null],
                    ['🔢 EAN / GTIN',          (product as any).ean ?? (product as any).gtin ?? null],
                    ['🏷️ SKU fabricante',       (product as any).codigo_fabricante ?? null],
                  ].filter(([,v]) => v).map(([k,v]) => (
                    <div key={String(k)} className="bg-white px-4 py-3">
                      <p className="text-[10px] text-gray-400 font-medium">{String(k).replace(/^[^ ]+ /,'')}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{String(v)}</p>
                    </div>
                  ))}
                </div>
                {!(product.curva_base || product.material) && (
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400">Consultar especificaciones con tu optómetra.</p>
                  </div>
                )}
              </div>
            )}

            <SuscripcionSelector
              value={suscripcion}
              onChange={(val, descPct) => {
                setSuscripcion(val)
                // Analytics: subscription_selected
                if (val) {
                  import('@/lib/analytics').then(({ trackSubscriptionSelected }) => {
                    trackSubscriptionSelected(product.id, product.nombre, val, descPct ?? 0, price)
                  })
                }
              }}
              precio={product.precio}
              tipo={tipo}
            />

            {['esferico','torico','multifocal'].includes(tipo) && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Consulta siempre con un profesional de la salud visual antes de comprar lentes de contacto.</span>
              </div>
            )}



            <div className="flex flex-col gap-2.5">
              {/* Precio resumen antes de CTA */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">RD${price.toLocaleString()}</span>
                {suscripcion && precioBase > price && (
                  <>
                    <span className="text-base text-gray-400 line-through">RD${precioBase.toLocaleString()}</span>
                    <span className="text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      -{Math.round((1 - price/precioBase)*100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <button onClick={handleBuyNow} disabled={product.stock === 0 || sinVariante}
                className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base shadow-lg shadow-primary-200/60 disabled:opacity-40 disabled:cursor-not-allowed">
                {product.stock === 0 ? '— Sin stock —' : sinVariante ? '— Consultar disponibilidad —' : (
                  <span className="flex items-center gap-2">
                    Comprar ahora
                    <span className="opacity-80 text-sm font-bold">→</span>
                  </span>
                )}
              </button>
              <button onClick={handleAdd} disabled={product.stock === 0 || sinVariante}
                className="w-full bg-white border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 active:scale-[0.98] text-gray-700 hover:text-primary-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingCart className="w-4 h-4" />
                {sinVariante ? 'Consultar disponibilidad' : 'Agregar al carrito'}
              </button>
              {/* Trust badges — FASE 11 */}
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { icon:'🚀', label:'Entrega rápida',    show: !getEntregaInfo.especial },
                  { icon:'✅', label:'Producto original',  show: true },
                  { icon:'🏭', label:'Garantía fabricante',show: true },
                  { icon:'🔒', label:'Compra segura',      show: true },
                  { icon:'🛡️', label:'Pago protegido',    show: true },
                  { icon:'↩',  label:'Devoluciones',       show: true },
                ].filter(b => b.show).slice(0, 6).map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2 py-2">
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-[9px] font-bold text-gray-600 leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Reviews productId={product.id} />
      <CrossSelling tipo={product.tipo} currentId={product.id} />
      <ProductFAQ tipo={product.tipo} nombre={product.nombre} />

      {/* Sticky CTA móvil */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{product.nombre}</p>
            </div>
            <p className="font-black text-primary-600 text-lg shrink-0">RD${price.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-none bg-white border-2 border-primary-600 text-primary-600 font-bold px-4 py-3 rounded-xl flex items-center gap-1 text-sm">
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button onClick={handleBuyNow}
              className="flex-1 btn-primary py-3 text-sm font-black flex items-center justify-center gap-2">
              Comprar ahora →
            </button>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </>
  )
}
