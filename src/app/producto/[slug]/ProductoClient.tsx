'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowLeft, Eye, AlertCircle } from 'lucide-react'
import Reviews from '@/components/ui/Reviews'
import FrequentlyBoughtTogether from '@/components/shop/FrequentlyBoughtTogether'
import CrossSelling from '@/components/shop/CrossSelling'
import ProductFAQ from '@/components/shop/ProductFAQ'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { useCartStore } from '@/lib/cart-store'
import { trackEcommerce, trackBuyNow, trackEyeFlow } from '@/lib/analytics'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import SuscripcionSelector from '@/components/shop/SuscripcionSelector'
import EntregaBadge from '@/components/shop/EntregaBadge'
import InlineCrossSell from '@/components/shop/InlineCrossSell'
import RecetaGuiaTorico from '@/components/shop/RecetaGuiaTorico'
import { getEntrega, getFechaEntrega } from '@/lib/delivery-times'
import EyeFlowSelector, { type EyeFlowState, initialEyeFlow } from '@/components/shop/EyeFlowSelector'
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

/**
 * MEJORA #20 — Wizard tórico
 * Presenta 2 rutas claras al cliente:
 * A) Tengo mi receta → muestra guía + formulario
 * B) No tengo receta → WhatsApp directo
 * Elimina la ansiedad de "¿qué campos necesito?" antes de ver el formulario
 */
function ToricWizard({ productName }: { productName: string }) {
  const [ruta, setRuta] = useState<'pregunta' | 'tengo' | 'no_tengo'>('pregunta')
  const waMsg = encodeURIComponent(`Hola, quiero pedir el ${productName} para astigmatismo pero no tengo mi receta a mano. ¿Pueden ayudarme?`)
  const waFoto = encodeURIComponent(`Hola, quiero pedir el ${productName}. Te envío foto de mi receta para que me ayuden a configurarlo.`)

  if (ruta === 'no_tengo') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
        <p className="text-xs font-bold text-amber-700">Sin problema — te ayudamos</p>
        <p className="text-[11px] text-amber-600">Escríbenos por WhatsApp y buscamos tu receta o te asesoramos con tu optómetra.</p>
        <a href={`https://wa.me/18294728328?text=${waMsg}`} target="_blank" rel="noopener"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.347.619 4.587 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Chatear por WhatsApp
        </a>
        <button onClick={() => setRuta('pregunta')} className="text-[10px] text-amber-600 underline w-full text-center">← Volver</button>
      </div>
    )
  }

  if (ruta === 'tengo') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-blue-700">🔵 Lente fabricado a medida · 25–30 días</p>
          <RecetaGuiaTorico />
        </div>
        <p className="text-[11px] text-blue-600">Necesitas: <strong>Esfera</strong>, <strong>Cilindro</strong> y <strong>Eje</strong> de tu receta. Llena los campos de abajo.</p>
        <a href={`https://wa.me/18294728328?text=${waFoto}`} target="_blank" rel="noopener"
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#25D366] hover:underline">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.347.619 4.587 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ¿Prefieres enviarnos foto de tu receta? →
        </a>
      </div>
    )
  }

  // Pregunta inicial
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2.5">
      <p className="text-xs font-bold text-blue-700">🎯 Lente tórico — fabricado para tu astigmatismo</p>
      <p className="text-[11px] text-blue-600 leading-relaxed">
        Para fabricar tus lentes necesitamos tu graduación exacta. ¿Tienes tu receta a mano?
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setRuta('tengo')}
          className="flex flex-col items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-xl text-xs transition-colors active:scale-95">
          <span className="text-base">📋</span>
          Sí, tengo mi receta
        </button>
        <button onClick={() => setRuta('no_tengo')}
          className="flex flex-col items-center gap-1 bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-bold py-3 px-3 rounded-xl text-xs transition-colors active:scale-95">
          <span className="text-base">❓</span>
          No la tengo ahora
        </button>
      </div>
    </div>
  )
}

/**
 * EyeSelector v2 — Fase 2 CRO
 * Fusiona "¿para qué ojo?" con la cantidad implícita.
 * OD = 1 caja · OI = 1 caja · AMBOS = 2 cajas (compra más común)
 * Elimina el spinner +/− redundante y el pack de 2 botones separados.
 * El precio se calcula afuera a partir del `eye` seleccionado.
 */
function EyeSelector({ eye, onChange }: { eye: string; onChange: (v: string) => void }) {
  const opts = [
    { val:'OD',    label:'Solo ojo\nderecho',  sub:'1 caja',  badge:''               },
    { val:'OI',    label:'Solo ojo\nizquierdo', sub:'1 caja',  badge:''               },
    { val:'AMBOS', label:'Ambos\nojos',         sub:'2 cajas', badge:'✓ Más común'    },
  ]
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        ¿Para qué ojo? <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(o => (
          <button key={o.val} onClick={() => onChange(o.val)}
            className={`relative py-2.5 px-1.5 rounded-xl border-2 text-center transition-all ${
              eye === o.val
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
            }`}>
            {o.badge && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                {o.badge}
              </span>
            )}
            <p className={`text-[11px] font-bold leading-tight whitespace-pre-line ${eye === o.val ? 'text-white' : 'text-gray-800'}`}>
              {o.label}
            </p>
            <p className={`text-[10px] mt-0.5 font-medium ${eye === o.val ? 'text-white/80' : 'text-gray-400'}`}>
              {o.sub}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// normalizeAdd: separa la clave interna del label descriptivo visible al cliente
//
//   Visible (add_disponibles)          → Clave interna (product_inventory / BD)
//   "LOW (+0.75 a +1.50)"              → "LOW"
//   "MID (+1.75 a +2.25)"              → "MID"
//   "HIGH (+2.50 a +3.00)"             → "HIGH"
//   "Low (+0.75 a +1.25)"              → "LOW"   ← capitalización variable
//   "LOW (+1.25)"                       → "LOW"
//   "MED (+2.00)"                       → "MED"
//   "+1.50"                             → "+1.50" ← ADD numérico sin cambio
//   "+2.50"                             → "+2.50"
//
// Regla: extraer el primer token alfanumérico + signo antes del primer espacio o '('
// ─────────────────────────────────────────────────────────────────────────────
function normalizeAdd(label: string): string {
  if (!label) return label
  // ADD numérico como "+1.50" — mantener exactamente
  if (/^[+-]?\d/.test(label.trim())) return label.trim()
  // ADD categórico como "LOW (+0.75 a +1.50)" → "LOW"
  const match = label.trim().match(/^([A-Za-z]+)/)
  return match ? match[1].toUpperCase() : label.trim()
}

function SelectField({ label, value, options, onChange, required, format }: {
  label: string; value: string; options: (string|number)[]; required?: boolean
  onChange: (v: string) => void; format?: (v: string|number) => string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-0.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {label.includes('Esfera')   && <p className="text-[10px] text-gray-400 mb-1.5">Tu graduación principal · Ej: -3.25 o +1.50</p>}
      {label.includes('Cilindro') && <p className="text-[10px] text-gray-400 mb-1.5">Corrección del astigmatismo · Ej: -0.75</p>}
      {label.includes('Eje')      && <p className="text-[10px] text-gray-400 mb-1.5">Orientación del astigmatismo · Ej: 90 o 180</p>}
      {label.includes('Adición')  && <p className="text-[10px] text-gray-400 mb-1.5">Graduación para lectura · Ej: +1.50 o +2.00</p>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border-2 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:outline-none transition-colors bg-white ${
          value ? 'border-primary-400 text-gray-900' : 'border-gray-200 text-gray-400'
        }`}
      >
        <option value="">Selecciona</option>
        {options.map(o => (
          <option key={o} value={String(o)}>{format ? format(o) : String(o)}</option>
        ))}
      </select>
    </div>
  )
}


function WhyBlock({ tipo, proteccion_uv }: { tipo: string; proteccion_uv?: boolean }) {
  type BenefitSet = { title: string; bullets: string[] }
  const BENEFITS: Record<string, BenefitSet> = {
    esferico:   {
      title: '¿Por qué elegir este lente?',
      bullets: ['Alta comodidad durante todo el día','Hidratación avanzada — ojos frescos','Visión nítida y estable','Calidad original garantizada'],
    },
    torico:     {
      title: '¿Por qué elegir este lente?',
      bullets: ['Corrige astigmatismo con precisión','Diseño estabilizado — no rota','Ideal para graduaciones exactas','Fabricado a medida para tu receta'],
    },
    multifocal: {
      title: '¿Por qué elegir este lente?',
      bullets: ['Ve de cerca, lejos y distancia media','Sin gafas para presbicia','Transición suave entre distancias','Adaptas en 1-2 semanas'],
    },
    color:      {
      title: '¿Por qué elegir este lente?',
      bullets: ['Cambia o intensifica tu color de ojos','Cómodo para uso diario o especial','Colores naturales y vibrantes','Con o sin graduación óptica'],
    },
    solucion:   {
      title: '¿Por qué usar esta solución?',
      bullets: ['Limpieza profunda diaria','Conserva y desinfecta tus lentes','Compatible con todos los tipos','Fórmula suave para ojos sensibles'],
    },
    gota:       {
      title: '¿Por qué usar estas gotas?',
      bullets: ['Alivio inmediato del ojo seco','Compatible con lentes de contacto','Sin conservantes (formato monodosis)','Para uso durante el día'],
    },
  }
  const b = BENEFITS[tipo] ?? BENEFITS.esferico
  const bullets = proteccion_uv ? b.bullets.map((bl, i) => i === 3 ? 'Protección UV Clase II incluida' : bl) : b.bullets
  return (
    <div className="bg-gradient-to-br from-primary-50 to-green-50 border border-primary-100 rounded-2xl p-4">
      <p className="text-xs font-black text-primary-700 uppercase tracking-wide mb-3">{b.title}</p>
      <ul className="space-y-1.5">
        {bullets.map(bullet => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-500 shrink-0 mt-0.5 font-bold">✓</span>
            <span className="font-medium">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Especificaciones clínicas — colapsadas por defecto en móvil */
function SpecsAcordeon({ product }: { product: Product & Record<string,any> }) {
  const [open, setOpen] = useState(false)
  const rows = [
    ['📐 Curva base',       product.curva_base],
    ['⭕ Diámetro',          product.diametro ? product.diametro + (String(product.diametro).includes('mm') ? '' : ' mm') : null],
    ['🔄 Reemplazo',         product.reemplazo],
    ['📦 Contenido',         product.contenido],
    ['🧪 Material',          product.material],
    ['💧 Agua',              (product as any).agua ? (product as any).agua + (String((product as any).agua).includes('%') ? '' : '%') : null],
    ['🌬️ O₂',              (product as any).oxígeno ?? (product as any).oxigeno],
    ['🕐 Horas uso',         (product as any).horas_uso],
    ['🏭 Fabricante',        (product as any).fabricante_nombre],
    ['🌍 País',              (product as any).pais_origen],
    ['🛡️ UV',               (product as any).proteccion_uv ? 'Clase II UV-A y UV-B' : null],
    ['🔢 EAN',               (product as any).ean ?? (product as any).gtin ?? null],
  ].filter(([,v]) => v) as [string,string][]

  if (rows.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors"
      >
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Especificaciones clínicas
        </p>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
          {rows.map(([k,v]) => (
            <div key={k} className="bg-white px-4 py-3">
              <p className="text-[10px] text-gray-400 font-medium">{k.replace(/^[^ ]+ /,'')}</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      )}
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

  // ── Nuevo flujo óptico unificado ──────────────────────────────────────
  const [eyeFlow, setEyeFlow] = useState<EyeFlowState>(initialEyeFlow)

  // ── Imagen dinámica por color ─────────────────────────────────────────
  const imagenesPorColor: Record<string, string> = (product as any).imagenes_por_color ?? {}
  const [imagenActual, setImagenActual] = useState<string>(
    product.imagen_url ?? '/icon-512.png'
  )

  // Actualizar imagen cuando cambia el color seleccionado
  const handleColorChange = (newState: EyeFlowState) => {
    setEyeFlow(newState)
    if (newState.color && imagenesPorColor[newState.color]) {
      setImagenActual(imagenesPorColor[newState.color])
    } else {
      setImagenActual(product.imagen_url ?? '/icon-512.png')
    }
    // Sincronizar cantidad según modo de ojo
    if (newState.ojoMode === 'AMBOS') handleSetQty(2)
    else if (newState.ojoMode) handleSetQty(1)
  }
  // Aliases de lectura para código interno que usa los campos directamente
  const eye        = eyeFlow.ojoMode ?? 'AMBOS'
  const sph        = eyeFlow.sph
  const cyl        = eyeFlow.cyl
  const axis       = eyeFlow.axis
  const add        = eyeFlow.add
  const color      = eyeFlow.color
  const mismaSph   = eyeFlow.mismaReceta
  const [size,  setSize]  = useState('')
  const [qty,   setQty]   = useState(1)
  // Sin límite de cantidad — el cliente compra lo que necesite
  const handleSetQty = (n: number) => {
    if (n < 1) return
    setQty(n)
  }
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
  // Multifocal tórico: multifocal con CYL disponibles (ej. Proclear Multifocal Toric)
  const isMultiToric = isMulti && (product.cyl_disponibles?.length ?? 0) > 0
  // needsToric: cualquier producto que requiere CYL + AXIS
  const needsToric   = isToric || isMultiToric

  // Verificar si la combinación seleccionada tiene stock real en product_inventory
  // Evita que se vendan variantes (SPH+CYL+AXIS) que no existen en inventario
  // stock_map: combos con stock > 0 — solo para habilitar/deshabilitar botón
  // Separado de sph_disponibles (que siempre contiene el rango oficial completo)
  const inventario = (product as any).stock_map as any[] ?? []
  const varianteSeleccionadaTieneStock = (): boolean => {
    if (!isLente || !inventario.length) return true // solo excluye no-lentes
    const sphNum  = sph  ? parseFloat(sph)  : null
    const cylNum  = cyl  ? parseFloat(cyl)  : null
    const axisNum = axis ? parseInt(axis)   : null
    const addVal  = add ? normalizeAdd(add) : null
    if (sphNum === null) return true // SPH no seleccionado aún → habilitado
    return inventario.some((v: any) => {
      const sphMatch  = Math.abs(Number(v.sph) - sphNum) < 0.001
      const cylMatch  = cylNum  === null ? v.cyl  == null : (v.cyl  != null && Math.abs(Number(v.cyl) - cylNum) < 0.001)
      const axisMatch = axisNum === null ? v.axis == null : (v.axis != null && v.axis === axisNum)
      const addMatch  = addVal  === null ? v.add_power == null : v.add_power === addVal
      // ── NUEVO: validar color para lentes de color ──────────────────────
      // Si hay color seleccionado, buscar variante con ese color específico
      // Si no hay color seleccionado aún, cualquier variante del SPH habilita el botón
      const colorMatch = !isColor || !color || v.color === color || !v.color
      return sphMatch && cylMatch && axisMatch && addMatch && colorMatch && (v.stock ?? 1) > 0
    })
  }
  // Tóricos (25-30 días) y multifocales (5-10 días) son fabricación especial a medida
  // → siempre mostramos "Agregar". El cliente gestiona el inventario desde el admin.
  // Esféricos y color: mantienen la validación de stock real.
  // Color: ahora también se valida el stock. Si color+SPH agotado → sinVariante=true → botón 'Agotado'
  // Excepción: tórico y multifocal son fabricación especial (siempre habilitados)
  const sinVariante = isLente && !isToric && !isMulti && sph !== '' && (
    isColor ? (!!color && !varianteSeleccionadaTieneStock()) : !varianteSeleccionadaTieneStock()
  )

  // ── Analytics: view_item al cargar el producto ──────────────────────────
  // ── Pre-llenar receta desde la calculadora (/receta) ─────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cg_rx_pending')
      if (!raw) return
      const rx = JSON.parse(raw) as {
        od: { sph: number|null; cyl: number|null; axis: number|null }
        oi: { sph: number|null; cyl: number|null; axis: number|null }
        tipo: string
        timestamp: number
      }
      // Solo válido 30 min y solo si el tipo de producto coincide
      if (Date.now() - rx.timestamp > 30 * 60 * 1000) { sessionStorage.removeItem('cg_rx_pending'); return }
      if (rx.tipo && rx.tipo !== tipo) return

      // Usar una sola vez — consumir
      sessionStorage.removeItem('cg_rx_pending')

      // Pre-llenar según el modo de ojo del producto — nuevo flujo eyeFlow
      setEyeFlow(prev => ({
        ...prev,
        ojoMode: 'AMBOS',
        sph_od: rx.od.sph != null ? String(rx.od.sph) : prev.sph_od,
        sph_oi: rx.oi.sph != null ? String(rx.oi.sph) : prev.sph_oi,
        cyl_od: (rx.od.cyl != null && rx.od.cyl !== 0) ? String(rx.od.cyl) : prev.cyl_od,
        cyl_oi: (rx.oi.cyl != null && rx.oi.cyl !== 0) ? String(rx.oi.cyl) : prev.cyl_oi,
        axis_od: rx.od.axis != null ? String(rx.od.axis) : prev.axis_od,
        axis_oi: rx.oi.axis != null ? String(rx.oi.axis) : prev.axis_oi,
        mismaReceta: rx.od.sph === rx.oi.sph && rx.od.cyl === rx.oi.cyl,
        sph: (rx.od.sph === rx.oi.sph && rx.od.sph != null) ? String(rx.od.sph) : prev.sph,
      }))
      // También llenar el selector simple (modo un solo ojo)
      const sphVal = rx.od.sph ?? rx.oi.sph
      if (sphVal != null) setEyeFlow(p => ({...p, sph: String(sphVal)}))
      // cyl/axis ya pre-llenados arriba en setEyeFlow

      import('react-hot-toast').then(({ default: t }) =>
        t.success('✓ Receta de tu calculadora aplicada', { duration: 3000, icon: '👁️' })
      )
    } catch { /* sessionStorage no disponible */ }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    setPrecioBase(base) // precio base con size, sin descuento de suscripción ni pack
    const descSub  = suscripcion ? DESCUENTOS[suscripcion] ?? 0 : 0
    // Pack 2 cajas: 5% real — se aplica sobre el precio unitario
    const descPack = (qty === 2 && isLente && !isColor) ? 0.05 : 0
    // Composición de descuentos: primero suscripción, luego pack
    const descTotal = 1 - (1 - descSub) * (1 - descPack)
    setPrice(Math.round(base * (1 - descTotal)))
  }, [size, product.precio, sku, suscripcion, qty, isLente, isColor])

  const handleAdd = (): boolean => {
    const { ojoMode, mismaReceta,
            sph, cyl, axis, add,
            sph_od, sph_oi, cyl_od, cyl_oi, axis_od, axis_oi,
            color } = eyeFlow

    // ── Validación color ──────────────────────────────────────────────
    if (isColor && !color) {
      toast.error('Selecciona el color del lente')
      return false
    }

    // ── Soluciones y gotas: flujo simple ──────────────────────────────
    if (!isLente) {
      addItem(product, {
        cantidad: qty, size: size || undefined,
        precio_override: price, precio_original: precioBase,
        suscripcion: suscripcion ?? undefined,
      })
      toast.success('¡Agregado al carrito! ✓')
      return true
    }

    // ── Lentes: requieren selección de ojo ────────────────────────────
    if (!ojoMode) {
      toast.error('¿Para cuántos ojos necesitas los lentes?')
      return false
    }

    // ── Validaciones por flujo ────────────────────────────────────────
    const isAmbosIgual = ojoMode === 'AMBOS' && mismaReceta !== false
    const isAmbosDifer = ojoMode === 'AMBOS' && mismaReceta === false
    const isUnSoloOjo  = ojoMode === 'OD' || ojoMode === 'OI'

    if (isAmbosIgual || isUnSoloOjo) {
      if (!sph)  { toast.error('Selecciona tu graduación (SPH)'); return false }
      if (needsToric && !cyl)  { toast.error('Selecciona el cilindro (CYL)'); return false }
      if (needsToric && cyl && !axis) { toast.error('Selecciona el eje (AXIS)'); return false }
      if (isMulti && !add)  { toast.error('Selecciona la adición (ADD)'); return false }
    }

    if (isAmbosDifer) {
      if (!sph_od && !sph_oi) {
        toast.error('Ingresa la graduación de al menos un ojo')
        return false
      }
      if (needsToric) {
        if (sph_od && !cyl_od) { toast.error('Falta el CYL del ojo derecho'); return false }
        if (sph_oi && !cyl_oi) { toast.error('Falta el CYL del ojo izquierdo'); return false }
        if (cyl_od && !axis_od) { toast.error('Falta el AXIS del ojo derecho'); return false }
        if (cyl_oi && !axis_oi) { toast.error('Falta el AXIS del ojo izquierdo'); return false }
      }
    }

    // ── Construir el item único ───────────────────────────────────────
    const baseOpts = {
      cantidad:        qty,
      ojo_mode:        ojoMode,
      misma_receta:    mismaReceta,
      add_power:       add || undefined,
      color:           color || undefined,
      size:            size  || undefined,
      precio_override: price,
      precio_original: precioBase,
      suscripcion:     suscripcion ?? undefined,
    }

    if (isAmbosIgual || isUnSoloOjo) {
      addItem(product, {
        ...baseOpts,
        sph:  parseFloat(sph),
        cyl:  cyl  ? parseFloat(cyl)  : undefined,
        axis: axis ? parseInt(axis)   : undefined,
      })
    } else {
      // AMBOS con receta diferente — UN SOLO item con campos _od/_oi
      addItem(product, {
        ...baseOpts,
        sph_od:  sph_od  ? parseFloat(sph_od)  : undefined,
        sph_oi:  sph_oi  ? parseFloat(sph_oi)  : undefined,
        cyl_od:  cyl_od  ? parseFloat(cyl_od)  : undefined,
        cyl_oi:  cyl_oi  ? parseFloat(cyl_oi)  : undefined,
        axis_od: axis_od ? parseInt(axis_od)   : undefined,
        axis_oi: axis_oi ? parseInt(axis_oi)   : undefined,
      })
    }

    const ojoMsg = ojoMode === 'AMBOS' ? 'para ambos ojos' : ojoMode === 'OD' ? '— ojo derecho' : '— ojo izquierdo'
    toast.success(`Agregado al carrito ${ojoMsg} ✓`)
    trackEcommerce('add_to_cart', {
      items: [{ item_id: product.id, item_name: product.nombre,
        item_brand: (product as any).marca ?? '',
        price, quantity: qty }],
    })
    return true
  }

  const handleBuyNow = () => {
    trackBuyNow(product.id, product.nombre, price)
    if (handleAdd()) router.push('/checkout')
  }

  return (
    <>
      <Navbar />

      {/* ─── BREADCRUMB ─── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <button onClick={() => router.push('/')} className="hover:text-primary-600 transition-colors">Inicio</button>
            <span>/</span>
            <button onClick={() => router.push('/catalogo')} className="hover:text-primary-600 transition-colors">Catálogo</button>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-[160px] sm:max-w-xs">{product.nombre}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-8 pt-4 lg:pt-6">

        {/* ═══════════════════════════════════════════════════════════════
            3-COLUMN GRID
            Mobile:  stack col1 → col3 (buy box) → col2 (info+selectors)
            Desktop: col1 (gallery) | col2 (info) | col3 (sticky buy box)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_300px] xl:grid-cols-[400px_1fr_320px] gap-4 lg:gap-6 xl:gap-8 items-start">

          {/* ══════════════════════════════════════
              COLUMNA 1 — Galería de imágenes
              ══════════════════════════════════════ */}
          <div className="lg:sticky lg:top-20 lg:self-start order-1">
            {/* Imagen principal */}
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm aspect-square">
              <span className="absolute top-3 left-3 z-10 text-[9px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                ✓ 100% Original
              </span>
              {imagenActual ? (
                <Image
                  src={imagenActual}
                  alt={`${product.nombre}${eyeFlow.color ? ' ' + eyeFlow.color : ''}`}
                  fill unoptimized priority
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Eye className="w-20 h-20 text-gray-200" />
                </div>
              )}
            </div>

            {/* Thumbnails de colores — solo para lentes de color */}
            {isColor && Object.keys(imagenesPorColor).length > 0 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
                {Object.entries(imagenesPorColor).map(([c, url]) => (
                  <button
                    key={c}
                    onClick={() => {
                      setImagenActual(url)
                      setEyeFlow(prev => ({ ...prev, color: c }))
                    }}
                    className={`shrink-0 w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${
                      eyeFlow.color === c ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={url} alt={c} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              {[
                { icon: '✅', label: '100% Original' },
                { icon: '🚚', label: 'Entrega rápida' },
                { icon: '🔒', label: 'Pago seguro AZUL' },
                { icon: '↩️', label: '7 días devolución' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-2">
                  <span className="text-sm shrink-0">{b.icon}</span>
                  <span className="text-[10px] text-gray-600 font-medium leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════
              COLUMNA 2 — Info del producto + Selectores
              ══════════════════════════════════════ */}
          <div className="order-3 lg:order-2 min-w-0 space-y-4">

            {/* Marca + Nombre */}
            <div>
              <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">{product.marca}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{product.nombre}</h1>
            </div>

            {/* Reviews + Social Proof */}
            {(product as any).avg_rating && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-base ${i < Math.round(Number((product as any).avg_rating)) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="font-black text-gray-900 ml-1">{Number((product as any).avg_rating).toFixed(1)}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{(product as any).review_count ?? 0} reseñas verificadas</span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-semibold">2,100+ clientes satisfechos</span>
              </div>
            )}

            {/* Precio + disponibilidad */}
            <div className="space-y-1.5">
              <div className="flex items-start gap-3 flex-wrap">
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">RD${price.toLocaleString()}</p>
                  {product.contenido && (
                    <p className="text-xs text-gray-400 mt-1">
                      {product.contenido}{product.reemplazo ? ` · ${product.reemplazo}` : ''}
                    </p>
                  )}
                  {isLente && precioBase > 0 && (() => {
                    const precioOptica = product.precio_anterior
                      ? Number(product.precio_anterior)
                      : Math.round(precioBase * 1.12 / 100) * 100
                    const ahorro = precioOptica - precioBase
                    if (ahorro <= 0) return null
                    const pct = Math.round((ahorro / precioOptica) * 100)
                    return (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-sm text-gray-400 line-through">RD${precioOptica.toLocaleString()} en óptica</span>
                        <span className="text-xs font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          💰 -{pct}% vs óptica
                        </span>
                      </div>
                    )
                  })()}
                </div>
                <div className="flex flex-col gap-1.5 ml-auto">
                  <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border ${
                    product.stock === 0 ? 'bg-red-50 text-red-600 border-red-100' :
                    tipo === 'torico' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    tipo === 'multifocal' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {product.stock === 0 ? 'Sin stock' :
                     tipo === 'torico' ? '🔵 A pedido' :
                     tipo === 'multifocal' ? '🟡 A fabricar' :
                     '🟢 Disponible'}
                  </span>
                  {(() => {
                    const fechaInfo = getFechaEntrega(tipo, product.nombre)
                    return (
                      <p className={`text-xs font-semibold flex items-center gap-1 ${getEntregaInfo.especial ? 'text-amber-600' : 'text-green-600'}`}>
                        {getEntregaInfo.icono} {fechaInfo.texto}
                      </p>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Beneficios visuales con iconos */}
            {isLente && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { icon: '👁️', label: 'Comodidad todo el día' },
                  { icon: '💧', label: 'Hidratación avanzada' },
                  { icon: '🎯', label: 'Visión nítida y estable' },
                  { icon: '☀️', label: (product as any).proteccion_uv ? 'Protección UV' : 'Marca certificada' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl p-2.5 border border-gray-100 text-center">
                    <span className="text-xl">{b.icon}</span>
                    <p className="text-[9px] font-semibold text-gray-600 leading-tight">{b.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Selectores de receta ─────────────────────────────── */}
            {isLente && (() => {
              const sphOpts = (product.sph_disponibles?.length
                ? [...product.sph_disponibles].map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b)
                : ALL_SPH).map(v => Number(v) > 0 ? `+${Number(v).toFixed(2)}` : Number(v) === 0 ? '0.00' : Number(v).toFixed(2))
              const cylOpts = (product.cyl_disponibles?.length ? [...product.cyl_disponibles] : ALL_CYL)
                .sort((a: any, b: any) => Number(a) - Number(b)).map((v: any) => Number(v).toFixed(2))
              const axisOpts = (product.axis_disponibles?.length ? [...product.axis_disponibles] : ALL_AXIS)
                .sort((a: any, b: any) => Number(a) - Number(b)).map(String)
              const addOpts = product.add_disponibles?.length ? product.add_disponibles : ALL_ADD
              const colorOpts = (product as any).colores_disponibles ?? []
              return (
                <EyeFlowSelector
                  state={eyeFlow}
                  onChange={handleColorChange}
                  needsCyl={needsToric}
                  needsAdd={isMulti}
                  needsColor={isColor}
                  sphOpts={sphOpts}
                  cylOpts={cylOpts}
                  axisOpts={axisOpts}
                  addOpts={addOpts}
                  colorOpts={colorOpts}
                />
              )
            })()}

            {/* Selector de tamaño (soluciones) */}
            {isSolucion && sizes.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tamaño <span className="text-red-500">*</span>
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

            {/* ToricWizard + ADD info — solo desktop, en col 2 */}
            {isToric && <ToricWizard productName={product.nombre} />}
            {isMulti && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-1.5">¿Qué es la Adición (ADD)?</p>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  {[
                    { range: '+0.75–+1.25', label: 'Presbicia leve', color: 'bg-green-100 text-green-700' },
                    { range: '+1.50–+2.00', label: 'Presbicia media', color: 'bg-yellow-100 text-yellow-700' },
                    { range: '+2.25–+3.00', label: 'Presbicia alta', color: 'bg-orange-100 text-orange-700' },
                  ].map(({ range, label, color }) => (
                    <div key={range} className={`${color} rounded-lg px-1.5 py-1.5`}>
                      <p className="font-black text-[9px]">{range}</p>
                      <p className="leading-tight font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp consulta — col 2 */}
            <a
              href={`https://wa.me/18294728328?text=${encodeURIComponent(
                tipo === 'torico' ? `Hola, quiero información sobre el ${product.nombre} para astigmatismo. Necesito ayuda para elegir la graduación correcta.` :
                tipo === 'multifocal' ? `Hola, tengo presbicia y me interesa el ${product.nombre}. ¿Pueden orientarme?` :
                tipo === 'color' ? `Hola, me interesa el ${product.nombre}. ¿Qué colores tienen disponibles?` :
                `Hola, tengo una pregunta sobre ${product.nombre}.`
              )}`}
              target="_blank" rel="noopener"
              className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] hover:bg-[#dcfce7] rounded-xl px-4 py-3 transition-colors group"
            >
              <svg className="w-5 h-5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
                  💬 ¿Tienes dudas sobre tu graduación?
                </p>
                <p className="text-xs text-gray-500">Habla con un asesor ahora · Respuesta inmediata</p>
              </div>
            </a>

            {/* WhyBlock — debajo del WA en col 2 */}
            <WhyBlock tipo={tipo} proteccion_uv={(product as any).proteccion_uv} />

            {/* Descripción + Specs (colapsable) */}
            {product.descripcion && <SpecsAcordeon product={product} />}

            {/* Cross-selling */}
            <CrossSelling tipo={tipo} currentId={product.id} />

          </div>

          {/* ══════════════════════════════════════
              COLUMNA 3 — Caja de compra sticky (estilo Amazon)
              ══════════════════════════════════════ */}
          <div className="order-2 lg:order-3 lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Header del buy box */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Frecuencia de entrega</p>
                <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Precio siempre igual</p>
              </div>

              <div className="p-4 space-y-3">

                {/* SUBSCRIPTION — Radio compact style */}
                {isLente && (
                  <div className="space-y-1.5">
                    {([
                      { val: null,         label: 'Compra única',  sublabel: 'Sin compromiso',    beneficio: null,                        popular: false },
                      { val: 'mensual',    label: 'Mensual',       sublabel: 'Reposición 30 días', beneficio: 'Envío GRATIS',              popular: false },
                      { val: 'trimestral', label: 'Trimestral',    sublabel: 'Reposición 90 días', beneficio: 'Envío GRATIS + Stock',      popular: true  },
                      { val: 'semestral',  label: 'Semestral',     sublabel: 'Reposición 180 días',beneficio: 'Envío GRATIS + VIP',        popular: false },
                    ] as Array<{ val: string|null; label: string; sublabel: string; beneficio: string|null; popular: boolean }>).map(op => {
                      const isSelected = suscripcion === op.val
                      return (
                        <label key={String(op.val)} className={`flex items-start gap-2.5 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                          <input
                            type="radio"
                            name="suscripcion_buybox"
                            checked={isSelected}
                            onChange={() => setSuscripcion(op.val)}
                            className="mt-0.5 accent-primary-600 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <p className={`text-xs font-bold flex items-center gap-1 ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                                {op.label}
                                {op.popular && (
                                  <span className="text-[7px] font-black bg-amber-400 text-white px-1.5 py-0.5 rounded-full leading-none">★ Popular</span>
                                )}
                              </p>
                              <p className={`text-[10px] font-black ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                                RD${price.toLocaleString()}
                              </p>
                            </div>
                            <p className={`text-[9px] ${isSelected ? 'text-primary-400' : 'text-gray-400'}`}>{op.sublabel}</p>
                            {op.beneficio && (
                              <p className="text-[9px] text-green-600 font-bold mt-0.5">✓ {op.beneficio}</p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}

                {/* Para soluciones/gotas: precio simple */}
                {!isLente && (
                  <div className="text-center py-2">
                    <p className="text-3xl font-black text-gray-900">RD${price.toLocaleString()}</p>
                    {product.contenido && <p className="text-xs text-gray-400 mt-1">{product.contenido}</p>}
                  </div>
                )}

                {/* Disponibilidad + Entrega */}
                <div className="flex flex-col gap-1 bg-gray-50 rounded-xl px-3 py-2">
                  {(() => {
                    const fechaInfo = getFechaEntrega(tipo, product.nombre)
                    return (
                      <>
                        <p className={`text-xs font-bold flex items-center gap-1.5 ${getEntregaInfo.especial ? 'text-amber-600' : 'text-green-600'}`}>
                          {getEntregaInfo.icono} {fechaInfo.texto}
                        </p>
                        <p className="text-[10px] text-green-600 font-semibold">
                          {suscripcion ? '✓ Envío gratis con suscripción' : '🚚 Envío disponible a todo RD'}
                        </p>
                      </>
                    )
                  })()}
                </div>

                {/* Cantidad */}
                {!isGota && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-700">Cantidad</p>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => handleSetQty(Math.max(1, qty - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 font-bold text-lg transition-colors">−</button>
                      <span className="w-9 text-center font-black text-gray-900 text-sm">{qty}</span>
                      <button onClick={() => handleSetQty(qty + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 font-bold text-lg transition-colors">+</button>
                    </div>
                    {isLente && !isColor && qty >= 2 && (
                      <span className="text-[10px] text-green-600 font-black bg-green-50 px-1.5 py-0.5 rounded-full">5% OFF pack</span>
                    )}
                  </div>
                )}

                {/* PRECIO TOTAL */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-2xl font-black text-gray-900">RD${(price * (isGota ? 1 : qty)).toLocaleString()}</p>
                  </div>
                  {isLente && qty > 1 && !isGota && (
                    <p className="text-[10px] text-gray-400 text-right">{qty} cajas × RD${price.toLocaleString()}</p>
                  )}
                </div>

                {/* BOTÓN AGREGAR */}
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0 || sinVariante}
                  className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md shadow-primary-200/50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? 'Sin stock' :
                   sinVariante ? (isColor ? 'Color agotado' : 'Consultar disponibilidad') :
                   'Agregar al carrito'}
                </button>

                {/* BOTÓN COMPRAR AHORA */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || sinVariante}
                  className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  {product.stock === 0 || sinVariante ? 'No disponible' : (
                    <span className="flex items-center gap-2">Comprar ahora <span className="opacity-60">⚡</span></span>
                  )}
                </button>

                {/* WHATSAPP */}
                <a
                  href={`https://wa.me/18294728328?text=${encodeURIComponent(`Hola, quiero comprar ${product.nombre}. ¿Está disponible?`)}`}
                  target="_blank" rel="noopener"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>

                {/* Garantías compactas */}
                <div className="border-t border-gray-100 pt-2 space-y-1">
                  {[
                    '✅ Producto original certificado',
                    '🔒 Pago 100% seguro con AZUL',
                    '↩️ 7 días para devoluciones',
                    '📦 Empaque discreto y seguro',
                  ].map(g => (
                    <p key={g} className="text-[10px] text-gray-400 font-medium">{g}</p>
                  ))}
                </div>

              </div>
            </div>

            {/* BUNDLE — justo debajo del buy box */}
            {isLente && (
              <div className="mt-3 bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center justify-between">
                  <p className="text-xs font-black text-amber-800">Completa tu kit y ahorra</p>
                  <span className="text-[10px] bg-amber-400 text-white font-black px-2 py-0.5 rounded-full">BUNDLE</span>
                </div>
                <InlineCrossSell tipo={tipo} currentId={product.id} />
              </div>
            )}

          </div>
        </div>

        {/* ─── BELOW FOLD ─── */}
        <div className="mt-8 space-y-6">

          {/* Trust bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            {[
              { icon: '🚚', title: 'Envío gratis', desc: 'Desde RD$2,500' },
              { icon: '🔒', title: 'Pago seguro AZUL', desc: '100% protegido' },
              { icon: '↩️', title: '7 días devolución', desc: 'Sin preguntas' },
              { icon: '✅', title: 'Productos originales', desc: 'Distribuidor oficial' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-2.5">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{b.title}</p>
                  <p className="text-[10px] text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <Reviews productId={product.id} />

          {/* Productos frecuentemente comprados juntos */}
          <FrequentlyBoughtTogether productId={product.id} tipo={tipo} precio={price} />

          {/* FAQ */}
          {isLente && <ProductFAQ tipo={tipo} nombre={product.nombre} />}

        </div>
      </main>

      {/* ─── STICKY BOTTOM BAR MÓVIL ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{product.nombre}</p>
            <p className="font-black text-primary-600 text-lg leading-none">RD${price.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || sinVariante}
            className="flex-1 bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-40 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {sinVariante ? 'Ver opciones' : 'Al carrito'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0 || sinVariante}
            className="flex-1 bg-gray-900 hover:bg-gray-800 active:scale-95 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            Comprar ⚡
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}
