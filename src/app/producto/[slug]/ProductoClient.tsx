'use client'
import { useState, useEffect, useMemo } from 'react'
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
import { trackEcommerce, trackBuyNow, trackEyeFlow, sendCAPI, generateEventId } from '@/lib/analytics'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import SuscripcionSelector from '@/components/shop/SuscripcionSelector'
import EntregaBadge from '@/components/shop/EntregaBadge'
import InlineCrossSell from '@/components/shop/InlineCrossSell'
import RecetaGuiaTorico from '@/components/shop/RecetaGuiaTorico'
import { getEntrega, getFechaEntrega } from '@/lib/delivery-times'
import EntregaHoy from '@/components/shop/EntregaHoy'
import { buildSPHOptions } from '@/components/shop/SPHPicker'
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
        <a href={`https://wa.me/18096942268?text=${waMsg}`} target="_blank" rel="noopener"
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
        <a href={`https://wa.me/18096942268?text=${waFoto}`} target="_blank" rel="noopener"
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
        style={{ fontSize: '16px' }}
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

  // ── Opciones del selector — memoizadas para no bloquear el hilo (INP) ──
  const selectorOpts = useMemo(() => {
    const { neg: _sphNeg, pos: _sphPos } = buildSPHOptions(
      Number(product.sph_min ?? -20),
      Number(product.sph_max ?? 8),
      Number(product.sph_step ?? 0.25),
      Boolean(product.sph_plano),
    )
    const sphOpts = [..._sphNeg, ..._sphPos]
      .map(v => Number(v)>0 ? `+${Number(v).toFixed(2)}` : Number(v)===0 ? '0.00' : Number(v).toFixed(2))
    const cylOpts = (product.cyl_disponibles?.length ? [...product.cyl_disponibles] : ALL_CYL)
      .sort((a:any,b:any)=>Number(a)-Number(b)).map((v:any)=>Number(v).toFixed(2))
    const axisOpts = (product.axis_disponibles?.length ? [...product.axis_disponibles] : ALL_AXIS)
      .sort((a:any,b:any)=>Number(a)-Number(b)).map(String)
    const addOpts = product.add_disponibles?.length ? product.add_disponibles : ALL_ADD
    const colorOpts = (product as any).colores_disponibles ?? []
    return { sphOpts, cylOpts, axisOpts, addOpts, colorOpts }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // ── Imagen dinámica por color ─────────────────────────────────────────
  const imagenesPorColor: Record<string, string> = (product as any).imagenes_por_color ?? {}
  const galeriaImagenes: string[] = Array.isArray((product as any).galeria_imagenes)
    ? (product as any).galeria_imagenes
    : []
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
    // Sincronizar cantidad según modo de ojo Y si la receta es igual o diferente
    // — Misma receta (o un solo ojo): 1 caja sirve para ambos ojos → qty = 1
    // — Receta diferente por ojo: cada ojo necesita su propia caja → qty = 2
    if (newState.ojoMode === 'AMBOS' && newState.mismaReceta === false) handleSetQty(2)
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
  const getEntregaInfo = getEntrega(tipo, product.nombre, eyeFlow.sph)
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

  // ── Scroll al top al montar el PDP — evita que Next.js conserve posición de scroll anterior ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [product.id])

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
      // Solo válido 30 min
      if (Date.now() - rx.timestamp > 30 * 60 * 1000) { sessionStorage.removeItem('cg_rx_pending'); return }
      // Aplicar si el tipo coincide O si es compatible (ej: tórico→multifocal_torico, esferico→torico)
      const tiposCompatibles: Record<string, string[]> = {
        esferico:        ['esferico','torico','multifocal','color'],
        torico:          ['torico','multifocal_torico'],
        multifocal:      ['multifocal','multifocal_torico'],
        multifocal_torico:['torico','multifocal','multifocal_torico'],
        color:           ['color','esferico'],
      }
      const compatible = !rx.tipo || tiposCompatibles[rx.tipo]?.includes(tipo) || rx.tipo === tipo
      if (!compatible) return

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
      toast.error('¿Qué color quieres? Elige uno arriba 🎨')
      return false
    }

    // ── Soluciones y gotas: flujo simple ──────────────────────────────
    if (!isLente) {
      addItem(product, {
        cantidad: qty, size: size || undefined,
        precio_override: price, precio_original: precioBase,
        suscripcion: suscripcion ?? undefined,
      })
      toast.success('¡Perfecto! Lente agregado al carrito 🎉')
      return true
    }

    // ── Lentes: requieren selección de ojo ────────────────────────────
    if (!ojoMode) {
      toast.error('Indica si los lentes son para un ojo o para ambos')
      return false
    }

    // ── Validaciones por flujo ────────────────────────────────────────
    const isAmbosIgual = ojoMode === 'AMBOS' && mismaReceta !== false
    const isAmbosDifer = ojoMode === 'AMBOS' && mismaReceta === false
    const isUnSoloOjo  = ojoMode === 'OD' || ojoMode === 'OI'

    if (isAmbosIgual || isUnSoloOjo) {
      if (!sph)  { toast.error('Selecciona tu poder esférico — el primer número de tu receta'); return false }
      if (needsToric && !cyl)  { toast.error('Selecciona el cilindro (CYL) — el segundo número de tu receta'); return false }
      if (needsToric && cyl && !axis) { toast.error('Selecciona el eje — el tercer número de tu receta para astigmatismo'); return false }
      if (isMulti && !add)  { toast.error('Selecciona la adición (ADD) — el último número de tu receta multifocal'); return false }
    }

    if (isAmbosDifer) {
      if (!sph_od && !sph_oi) {
        toast.error('Ingresa la graduación de al menos un ojo')
        return false
      }
      if (needsToric) {
        if (sph_od && !cyl_od) { toast.error('Falta el cilindro del ojo derecho (CYL)'); return false }
        if (sph_oi && !cyl_oi) { toast.error('Falta el cilindro del ojo izquierdo (CYL)'); return false }
        if (cyl_od && !axis_od) { toast.error('Falta el eje del ojo derecho (AXIS)'); return false }
        if (cyl_oi && !axis_oi) { toast.error('Falta el eje del ojo izquierdo (AXIS)'); return false }
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
    toast.success(`¡Listo! ${ojoMsg} agregado al carrito 🛍️`)
    const addToCartEventId = generateEventId()
    trackEcommerce('add_to_cart', {
      items: [{ item_id: product.id, item_name: product.nombre,
        item_brand: (product as any).marca ?? '',
        price, quantity: qty }],
    }, addToCartEventId)
    // CAPI server-side — mismo eventId que el Pixel para deduplicación en Meta
    sendCAPI('AddToCart', {
      value: price * qty,
      currency: 'DOP',
      content_ids: [product.id],
      num_items: qty,
    }, undefined, addToCartEventId)
    return true
  }

  const handleBuyNow = () => {
    trackBuyNow(product.id, product.nombre, price)
    if (handleAdd()) router.push('/checkout')
  }

  return (
    <>
      <Navbar />

      {/* ─── BREADCRUMB — compacto ─── */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-1 text-[11px] text-gray-400">
            <button onClick={() => router.push('/')} className="hover:text-primary-600">Inicio</button>
            <span>/</span>
            <button onClick={() => router.push('/catalogo')} className="hover:text-primary-600">Catálogo</button>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[180px]">{product.nombre}</span>
          </nav>
        </div>
      </div>

      <main className="bg-white">
        <div className="max-w-[1400px] mx-auto">

          {/* ══════════════════════════════════════════════════════════
              MOBILE LAYOUT — < lg
              Orden: Imagen → Info → Selectores
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:hidden">

            {/* BLOQUE 1: IMAGEN — completa, visible de inmediato */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white">
              <div className="relative w-full" style={{aspectRatio:'4/3', maxHeight:'320px'}}>
                {imagenActual ? (
                  <Image src={imagenActual} alt={product.nombre} fill unoptimized priority
                    className="object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="w-16 h-16 text-gray-200" />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[9px] font-bold text-green-700 bg-white border border-green-100 px-2 py-0.5 rounded-full shadow-sm">
                  ✅ 100% Original
                </span>
                {(product as any).proteccion_uv && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ☀️ UV
                  </span>
                )}
              </div>

              {/* Thumbnails de color */}
              {isColor && Object.keys(imagenesPorColor).length > 0 && (
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
                  {Object.entries(imagenesPorColor).map(([c, url]) => (
                    <button key={c} onClick={() => { setImagenActual(url); setEyeFlow(prev => ({...prev, color: c})) }}
                      className={`shrink-0 w-10 h-10 rounded-lg border-2 overflow-hidden transition-all ${eyeFlow.color === c ? 'border-primary-500' : 'border-gray-200'}`}>
                      <img src={url} alt={c} className="w-full h-full object-contain p-0.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BLOQUE 2: NOMBRE + PRECIO */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{product.marca}</p>
              <h1 className="text-xl font-black text-gray-900 leading-tight mt-0.5">{product.nombre}</h1>

              {/* Reviews */}
              {(product as any).avg_rating && (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-sm ${i <= Math.round(Number((product as any).avg_rating)) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-xs font-bold text-gray-800 ml-1">{Number((product as any).avg_rating).toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">({(product as any).review_count ?? 0} reseñas)</span>
                  <span className="text-[10px] font-semibold text-green-600">2,100+ clientes</span>
                </div>
              )}

              {/* Precio */}
              <div className="mt-2 flex items-end gap-3 flex-wrap">
                <p className="text-3xl font-black text-gray-900">RD${price.toLocaleString()}</p>
                {(()=>{
                  const precioOptica = Math.round(price * 1.12 / 100) * 100
                  const pct = Math.round(((precioOptica - price) / precioOptica) * 100)
                  if (pct <= 0 || !isLente) return null
                  return (
                    <div className="flex items-center gap-1.5 pb-1">
                      <span className="text-sm text-gray-400 line-through">RD${precioOptica.toLocaleString()}</span>
                      <span className="text-xs font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full">-{pct}%</span>
                    </div>
                  )
                })()}
              </div>
              {product.contenido && <p className="text-[11px] text-gray-400 mt-0.5">{product.contenido}{product.reemplazo ? ` · ${product.reemplazo}` : ''}</p>}
              {/* Precio por día — hace el producto sentir más accesible */}
              {isLente && (() => {
                const contenido = product.contenido ?? ''
                const diasCaja = product.reemplazo === 'Diario' ? 30 :
                                 product.reemplazo === 'Quincenal' ? 15 :
                                 product.reemplazo === 'Mensual' ? 30 : null
                if (!diasCaja) return null
                const pxDia = (price / diasCaja).toFixed(2)
                return (
                  <p className="text-[11px] font-bold text-green-600 mt-1">
                    Solo RD${pxDia} por día de visión perfecta
                  </p>
                )
              })()}

              {/* Disponibilidad + entrega */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Disponible
                </span>
                {(()=>{
                  const fi = getFechaEntrega(tipo, product.nombre, eyeFlow.sph)
                  const ei = getEntrega(tipo, product.nombre, eyeFlow.sph)
                  return <span className={`text-xs font-semibold ${ei.especial ? 'text-amber-600' : 'text-green-600'}`}>{ei.icono} {fi.texto}</span>
                })()}
              </div>
            </div>

            {/* Galería thumbnails — solo si tiene imágenes adicionales */}
            {galeriaImagenes.length > 0 && (
              <div className="flex gap-2 px-3 pb-1 overflow-x-auto scrollbar-hide">
                {galeriaImagenes.map((url, i) => (
                  <button key={url} onClick={() => setImagenActual(url)}
                    className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      imagenActual === url ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`} style={{width:80, height:60}}>
                    <img src={url} alt={`Vista ${i+2}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* BLOQUE 3: TRUST BAR — scroll horizontal */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-y border-gray-100">
              {['✅ 100% Original','🔒 Pago AZUL','🚚 Envío RD','↩️ 7 días dev.','💬 WA 24/7'].map(t => (
                <span key={t} className="shrink-0 text-[10px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>

            {/* BLOQUE 4: CONFIGURADOR DE RECETA */}
            <div className="px-4 pt-3 pb-2">
              {isLente && (
                  <EyeFlowSelector
                    state={eyeFlow} onChange={handleColorChange}
                    needsCyl={needsToric} needsAdd={isMulti} needsColor={isColor}
                    sphOpts={selectorOpts.sphOpts} cylOpts={selectorOpts.cylOpts} axisOpts={selectorOpts.axisOpts} addOpts={selectorOpts.addOpts} colorOpts={selectorOpts.colorOpts}
                    sphMin={Number(product.sph_min ?? -20)} sphMax={Number(product.sph_max ?? 8)}
                    sphStep={Number(product.sph_step ?? 0.25)} sphPlano={Boolean(product.sph_plano)}
                  />
              )}

              {/* Size selector para soluciones */}
              {isSolucion && sizes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-700">Tamaño</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button key={s} onClick={()=>setSize(s)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${size===s ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-700'}`}>
                        {s}{SOLUTION_PRICES[sku]?.[s] ? ` · RD$${SOLUTION_PRICES[sku][s].toLocaleString()}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isToric && <ToricWizard productName={product.nombre} />}
            </div>

            {/* BLOQUE 5: CTA MOBILE (inline, arriba de la sticky bar) */}
            <div className="px-4 pb-4 space-y-2">
              <EntregaHoy />
              <button onClick={handleAdd} disabled={product.stock===0}
                className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-40 text-white font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-primary-200/50 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {sinVariante ? 'Elegir graduación primero' : 'Agregar al carrito'}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock===0||sinVariante}
                className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-30 text-white font-bold py-3.5 rounded-2xl text-base transition-all">
                Comprar ahora ⚡
              </button>
              <a href={`https://wa.me/18096942268?text=${encodeURIComponent(`Hola, quiero info sobre ${product.nombre}`)}`}
                target="_blank" rel="noopener"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Consultar por WhatsApp
              </a>
            </div>

            {/* BELOW FOLD MOBILE */}
            <div className="px-4 pb-8 space-y-6">
              {/* Beneficios */}
              {isLente && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {icon:'👁️', label:'Comodidad todo el día'},
                    {icon:'💧', label:'Hidratación avanzada'},
                    {icon:'🎯', label:'Visión nítida'},
                    {icon:'☀️', label:(product as any).proteccion_uv?'Protección UV':'Marca certificada'},
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                      <span className="text-lg shrink-0">{b.icon}</span>
                      <p className="text-[10px] font-semibold text-gray-600 leading-tight">{b.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bundle kit */}
              {isLente && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl overflow-hidden">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <p className="text-xs font-black text-amber-800">Completa tu kit</p>
                    <span className="text-[9px] bg-amber-400 text-white font-black px-1.5 py-0.5 rounded-full">AHORRA</span>
                  </div>
                  <div className="px-3 pb-3">
                    <InlineCrossSell tipo={tipo} currentId={product.id} />
                  </div>
                </div>
              )}

              {/* Specs colapsable */}
              <SpecsAcordeon product={product} />

              {/* Garantías */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {icon:'🚚',t:'Envío nacional',s:'A todo RD'},
                  {icon:'↩️',t:'7 días dev.',s:'Sin preguntas'},
                  {icon:'✅',t:'Originales',s:'Dist. oficial'},
                ].map(b => (
                  <div key={b.t} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-base shrink-0">{b.icon}</span>
                    <div><p className="text-[10px] font-bold text-gray-800">{b.t}</p><p className="text-[9px] text-gray-400">{b.s}</p></div>
                  </div>
                ))}
                {/* Badge AZUL con logo real */}
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <img src="/azul-badge.png" alt="AZUL" width="24" height="24" className="h-6 w-6 object-contain rounded shrink-0" />
                  <div><p className="text-[10px] font-bold text-gray-800">Pago AZUL</p><p className="text-[9px] text-gray-400">100% seguro</p></div>
                </div>
              </div>

              {/* Reviews */}
              <Reviews productId={product.id} initialReviews={(product as any).reviews ?? []} />

              {/* FAQ */}
              {isLente && <ProductFAQ tipo={tipo} nombre={product.nombre} />}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              DESKTOP LAYOUT — lg+
              3 columnas: Galería | Info+Selectores | Sticky Buy Box
              ══════════════════════════════════════════════════════════ */}
          <div className="hidden lg:grid lg:grid-cols-[400px_1fr_300px] xl:grid-cols-[440px_1fr_320px] gap-6 xl:gap-8 px-6 xl:px-8 py-6 items-start">

            {/* COL 1: GALERÍA DESKTOP */}
            <div className="sticky top-20 self-start">
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm aspect-square">
                <span className="absolute top-3 left-3 z-10 text-[9px] font-bold text-green-700 bg-white border border-green-100 px-2 py-1 rounded-full">
                  ✅ 100% Original
                </span>
                {imagenActual ? (
                  <Image src={imagenActual} alt={product.nombre} fill unoptimized priority
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="w-20 h-20 text-gray-200" />
                  </div>
                )}
              </div>
              {/* Thumbnails galería lifestyle — desktop */}
              {galeriaImagenes.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                  {galeriaImagenes.map((url, i) => (
                    <button key={url} onClick={() => setImagenActual(url)}
                      className={`shrink-0 w-16 h-12 rounded-xl border-2 overflow-hidden transition-all ${
                        imagenActual === url ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <img src={url} alt={`Vista ${i+2}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {isColor && Object.keys(imagenesPorColor).length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                  {Object.entries(imagenesPorColor).map(([c, url]) => (
                    <button key={c} onClick={() => { setImagenActual(url); setEyeFlow(prev => ({...prev, color: c})) }}
                      className={`shrink-0 w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${eyeFlow.color===c ? 'border-primary-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <img src={url} alt={c} className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-1.5 mt-3">
                {[{icon:'✅',label:'100% Original'},{icon:'🚚',label:'Entrega rápida'},{icon:'🔒',label:'Pago AZUL'},{icon:'↩️',label:'7 días dev.'}].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-2">
                    <span className="text-sm shrink-0">{b.icon}</span>
                    <span className="text-[10px] text-gray-600 font-medium leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 2: INFO + SELECTORES DESKTOP */}
            <div className="space-y-4 min-w-0">
              <div>
                <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">{product.marca}</p>
                <h1 className="text-2xl xl:text-3xl font-black text-gray-900 leading-tight">{product.nombre}</h1>
              </div>
              {(product as any).avg_rating && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className={`text-base ${i<=Math.round(Number((product as any).avg_rating))?'text-amber-400':'text-gray-200'}`}>★</span>)}
                    <span className="font-black text-gray-900 ml-1">{Number((product as any).avg_rating).toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{(product as any).review_count??0} reseñas</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-green-600 font-semibold text-xs">2,100+ clientes</span>
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-3xl xl:text-4xl font-black text-gray-900">RD${price.toLocaleString()}</p>
                  {(()=>{
                    const po = Math.round(price*1.12/100)*100
                    const pct = Math.round(((po-price)/po)*100)
                    if (pct<=0||!isLente) return null
                    return (<>
                      <span className="text-base text-gray-400 line-through">RD${po.toLocaleString()}</span>
                      <span className="text-xs font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">-{pct}% vs óptica</span>
                    </>)
                  })()}
                </div>
                {product.contenido && <p className="text-xs text-gray-400 mt-1">{product.contenido}{product.reemplazo?` · ${product.reemplazo}`:''}</p>}
                {isLente && (() => {
                  const diasCaja = product.reemplazo === 'Diario' ? 30 : product.reemplazo === 'Quincenal' ? 15 : product.reemplazo === 'Mensual' ? 30 : null
                  if (!diasCaja) return null
                  return <p className="text-xs font-bold text-green-600 mt-0.5">Solo RD${(price/diasCaja).toFixed(2)} por día</p>
                })()}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />Disponible
                  </span>
                  {(()=>{
                    const fi=getFechaEntrega(tipo,product.nombre); const ei=getEntrega(tipo,product.nombre)
                    return <span className={`text-xs font-semibold ${ei.especial?'text-amber-600':'text-green-600'}`}>{ei.icono} {fi.texto}</span>
                  })()}
                </div>
              </div>
              {isLente && (
                <div className="grid grid-cols-4 gap-2">
                  {[{icon:'👁️',l:'Comodidad todo el día'},{icon:'💧',l:'Hidratación avanzada'},{icon:'🎯',l:'Visión nítida y estable'},{icon:'☀️',l:(product as any).proteccion_uv?'Protección UV':'Certificado'}].map(b => (
                    <div key={b.l} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2 border border-gray-100 text-center">
                      <span className="text-xl">{b.icon}</span>
                      <p className="text-[9px] font-semibold text-gray-600 leading-tight">{b.l}</p>
                    </div>
                  ))}
                </div>
              )}
              {isLente && (<EyeFlowSelector state={eyeFlow} onChange={handleColorChange} needsCyl={needsToric} needsAdd={isMulti} needsColor={isColor} sphOpts={selectorOpts.sphOpts} cylOpts={selectorOpts.cylOpts} axisOpts={selectorOpts.axisOpts} addOpts={selectorOpts.addOpts} colorOpts={selectorOpts.colorOpts}
                    sphMin={Number(product.sph_min ?? -20)} sphMax={Number(product.sph_max ?? 8)}
                    sphStep={Number(product.sph_step ?? 0.25)} sphPlano={Boolean(product.sph_plano)} />)}
              {isSolucion && sizes.length>0 && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Tamaño</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button key={s} onClick={()=>setSize(s)} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${size===s?'bg-primary-600 text-white border-primary-600':'border-gray-200 text-gray-700 hover:border-primary-400'}`}>
                        {s}{SOLUTION_PRICES[sku]?.[s]?` · RD$${SOLUTION_PRICES[sku][s].toLocaleString()}`:''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isToric && <ToricWizard productName={product.nombre} />}
              {isMulti && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-700 mb-1.5">¿Qué es la Adición (ADD)?</p>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    {[{r:'+0.75–+1.25',l:'Presbicia leve',c:'bg-green-100 text-green-700'},{r:'+1.50–+2.00',l:'Presbicia media',c:'bg-yellow-100 text-yellow-700'},{r:'+2.25–+3.00',l:'Presbicia alta',c:'bg-orange-100 text-orange-700'}].map(({r,l,c}) => (
                      <div key={r} className={`${c} rounded-lg px-1.5 py-1.5`}>
                        <p className="font-black text-[9px]">{r}</p>
                        <p className="leading-tight font-medium">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <a href={`https://wa.me/18096942268?text=${encodeURIComponent(`Hola, tengo una pregunta sobre ${product.nombre}.`)}`}
                target="_blank" rel="noopener"
                className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] hover:bg-[#dcfce7] rounded-xl px-4 py-3 transition-colors group">
                <svg className="w-5 h-5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <div>
                  <p className="text-sm font-bold text-gray-800">💬 ¿Tienes dudas sobre tu graduación?</p>
                  <p className="text-xs text-gray-500">Habla con un asesor · Respuesta inmediata</p>
                </div>
              </a>
              <WhyBlock tipo={tipo} proteccion_uv={(product as any).proteccion_uv} />
              {product.descripcion && <SpecsAcordeon product={product} />}
              <CrossSelling tipo={tipo} currentId={product.id} />
            </div>

            {/* COL 3: BUY BOX STICKY DESKTOP */}
            <div className="sticky top-20 self-start">
              <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider">¿Cada cuánto necesitas reponer?</p>
                  <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Sin compromiso</p>
                </div>
                <div className="p-3 space-y-2.5">
                  {isLente && (
                    <div className="space-y-1.5">
                      {([
                        {val:null, label:'Compra única', sublabel:'Solo esta vez', beneficio:null, popular:false},
                        {val:'mensual', label:'Cada 30 días', sublabel:'Ideal para lentes diarios', beneficio:'Te avisamos por WhatsApp', popular:false},
                        {val:'trimestral', label:'Cada 90 días', sublabel:'Ideal para lentes mensuales', beneficio:'Reordena en 1 clic', popular:true},
                        {val:'semestral', label:'Cada 6 meses', sublabel:'Ideal para lentes trimestrales', beneficio:'Nunca se te olvida reponer', popular:false},
                      ] as Array<{val:string|null;label:string;sublabel:string;beneficio:string|null;popular:boolean}>).map(op => {
                        const isSel = suscripcion===op.val
                        return (
                          <label key={String(op.val)} className={`flex items-start gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${isSel?'border-primary-500 bg-primary-50':'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <input type="radio" name="sub_desktop" checked={isSel} onChange={()=>setSuscripcion(op.val)} className="mt-0.5 accent-primary-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-[11px] font-bold flex items-center gap-1 ${isSel?'text-primary-700':'text-gray-800'}`}>
                                  {op.label}
                                  {op.popular && <span className="text-[7px] font-black bg-amber-400 text-white px-1.5 py-0.5 rounded-full">★ Popular</span>}
                                </p>
                              </div>
                              <p className={`text-[9px] ${isSel?'text-primary-400':'text-gray-400'}`}>{op.sublabel}</p>
                              {op.beneficio && <p className="text-[9px] text-blue-600 font-bold mt-0.5">💬 {op.beneficio}</p>}
                            </div>
                          </label>
                        )
                      })}
                      {suscripcion && (
                        <p className="text-[9px] text-gray-400 leading-tight px-1 pt-1">
                          Te escribimos por WhatsApp cuando se acerque la fecha. Tú decides si reordenas — no hacemos ningún cobro automático.
                        </p>
                      )}
                    </div>
                  )}
                  {!isLente && <div className="text-center py-2"><p className="text-2xl font-black text-gray-900">RD${price.toLocaleString()}</p>{product.contenido && <p className="text-xs text-gray-400 mt-0.5">{product.contenido}</p>}</div>}
                  <div className="bg-gray-50 rounded-xl px-3 py-2 space-y-0.5">
                    {(()=>{const fi=getFechaEntrega(tipo,product.nombre);const ei=getEntrega(tipo,product.nombre);return(<>
                      <p className={`text-xs font-bold flex items-center gap-1.5 ${ei.especial?'text-amber-600':'text-green-600'}`}>{ei.icono} {fi.texto}</p>
                      <p className="text-[10px] text-green-600 font-semibold">{suscripcion?'💬 Te recordamos por WhatsApp':'🚚 Envío a todo RD'}</p>
                    </>)})()}
                  </div>
                  {!isGota && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-700">Cantidad</p>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={()=>handleSetQty(Math.max(1,qty-1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">−</button>
                        <span className="w-8 text-center font-black text-gray-900 text-sm">{qty}</span>
                        <button onClick={()=>handleSetQty(qty+1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
                      </div>
                      {isLente&&!isColor&&qty>=2&&<span className="text-[10px] text-green-600 font-black bg-green-50 px-1.5 py-0.5 rounded-full">5% OFF</span>}
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2.5">
                    <EntregaHoy />
                    <div className="flex items-baseline justify-between mb-2.5 mt-2">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-xl font-black text-gray-900">RD${(price*(isGota?1:qty)).toLocaleString()}</p>
                    </div>
                    <button onClick={handleAdd} disabled={product.stock===0||sinVariante}
                      className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-40 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md shadow-primary-200/50">
                      <ShoppingCart className="w-4 h-4" />
                      {product.stock===0?'Sin stock':sinVariante?'Consultar':isColor?'Agregar al carrito':'Agregar al carrito'}
                    </button>
                    <button onClick={handleBuyNow} disabled={product.stock===0||sinVariante}
                      className="w-full mt-1.5 bg-gray-900 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                      {product.stock===0||sinVariante?'No disponible':'Comprar ahora ⚡'}
                    </button>
                    <a href={`https://wa.me/18096942268?text=${encodeURIComponent(`Hola, quiero comprar ${product.nombre}. ¿Está disponible?`)}`}
                      target="_blank" rel="noopener"
                      className="w-full mt-1.5 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Consultar por WhatsApp
                    </a>
                    <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                      {['✅ Producto original certificado','🔒 Pago seguro AZUL','↩️ 7 días para devoluciones'].map(g => (
                        <p key={g} className="text-[10px] text-gray-400 font-medium">{g}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {isLente && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl overflow-hidden">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-amber-100">
                    <p className="text-xs font-black text-amber-800">Completa tu kit</p>
                    <span className="text-[9px] bg-amber-400 text-white font-black px-1.5 py-0.5 rounded-full">BUNDLE</span>
                  </div>
                  <div className="p-3"><InlineCrossSell tipo={tipo} currentId={product.id} /></div>
                </div>
              )}
            </div>
          </div>

          {/* BELOW FOLD DESKTOP */}
          <div className="hidden lg:block px-6 xl:px-8 pb-8 mt-6 space-y-6">
            <div className="grid grid-cols-4 gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              {[{icon:'🚚',t:'Envío gratis',d:'Desde RD$2,500'},{icon:'🔒',t:'Pago AZUL',d:'100% protegido'},{icon:'↩️',t:'7 días dev.',d:'Sin preguntas'},{icon:'✅',t:'Originales',d:'Dist. oficial'}].map(b => (
                <div key={b.t} className="flex items-center gap-2.5">
                  <span className="text-2xl shrink-0">{b.icon}</span>
                  <div><p className="text-xs font-bold text-gray-800">{b.t}</p><p className="text-[10px] text-gray-400">{b.d}</p></div>
                </div>
              ))}
            </div>
            <Reviews productId={product.id} initialReviews={(product as any).reviews ?? []} />
            <FrequentlyBoughtTogether productId={product.id} tipo={tipo} precio={price} />
            {isLente && <ProductFAQ tipo={tipo} nombre={product.nombre} />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
