'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { tieneNombreYApellido, ERROR_NOMBRE_INCOMPLETO } from '@/lib/validation'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import {
  convertGlassesToContacts, fmtCyl, fmtAxis,
  SPH_GLASSES, CYL_GLASSES, AXIS_VALS, ADD_VALS,
  type GlassesRx, type ConvertedRx,
  detectarCasoMixto, type CasoMixto, type TipoLenteOjo,
} from '@/lib/prescription'
import type { Product } from '@/types'
import { Eye, Glasses, RotateCcw, Sparkles, Info, AlertTriangle, ChevronRight, Mail, CheckCircle, ShoppingCart, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Helpers ────────────────────────────────────────────────────────────────────
interface EyeInput { sph: string; cyl: string; axis: string; add: string }
const EMPTY: EyeInput = { sph: '', cyl: '', axis: '', add: '' }
const parseN = (v: string) => { if (!v) return null; const n = parseFloat(v); return isNaN(n) ? null : n }
const fmtV = (v: number | null) => v == null ? '—' : v === 0 ? 'Plano' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)
const OPTICA_MULT = 1.12

function getComplejidad(rx: ConvertedRx) {
  const sMax = Math.max(Math.abs(rx.od.sph ?? 0), Math.abs(rx.oi.sph ?? 0))
  const cMax = Math.max(Math.abs(rx.od.cyl ?? 0), Math.abs(rx.oi.cyl ?? 0))
  const aMax = Math.max(Math.abs(rx.od.add ?? 0), Math.abs(rx.oi.add ?? 0))
  if (sMax > 10 || cMax > 4.75) return { nivel: 'rojo' as const, titulo: 'Receta compleja — recomendamos asesoría', desc: 'Graduación alta. Un especialista puede orientarte para la mejor adaptación.' }
  if (sMax > 6 || cMax > 2.75 || aMax > 2.5) return { nivel: 'amarillo' as const, titulo: 'Receta moderada — compatible online', desc: 'Puedes ordenar online. Recomendamos confirmar con tu optometrista.' }
  return { nivel: 'verde' as const, titulo: 'Compatible — puedes consultar opciones', desc: 'Tu receta está en un rango estándar. La compatibilidad final depende de los parámetros del producto.' }
}

function getSid() {
  try { return sessionStorage.getItem('cg_calc_sid') || (() => { const id = Math.random().toString(36).slice(2); sessionStorage.setItem('cg_calc_sid', id); return id })() } catch { return 'anon' }
}

function trackEvento(evento: string, meta?: Record<string, any>) {
  try { createClient().from('calculator_sessions').insert({ session_id: getSid(), evento, ...meta }).then(() => {}) } catch {}
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function RecetaPage() {
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)
  const [od, setOd] = useState<EyeInput>(EMPTY)
  const [oi, setOi] = useState<EyeInput>(EMPTY)
  // Prellenado desde "Mi cuenta" (/receta?od_sph=…&od_cyl=…&od_axis=…&od_add=…&oi_…).
  // Solo se aplica si la URL trae parámetros de receta; no altera el flujo normal.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = new URLSearchParams(window.location.search)
    const val = (k: string) => { const v = q.get(k); return v && v.trim() !== '' ? v.trim() : '' }
    const params = ['od_sph','od_cyl','od_axis','oi_sph','oi_cyl','oi_axis','od_add','oi_add'].map(val)
    if (params.every(v => v === '')) return
    setOd({ sph: val('od_sph'), cyl: val('od_cyl'), axis: val('od_axis'), add: val('od_add') })
    setOi({ sph: val('oi_sph'), cyl: val('oi_cyl'), axis: val('oi_axis'), add: val('oi_add') })
  }, [])
  const [misma, setMisma] = useState(false)
  const [rxSource, setRxSource] = useState<'contacto' | 'gafas' | null>(null)
  const [vertexDistanceMm, setVertexDistanceMm] = useState('12')
  const [result, setResult] = useState<ConvertedRx | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [alternativasRevision, setAlternativasRevision] = useState<any[]>([])
  // Caso mixto: cada ojo requiere un tipo distinto de lente
  const [productsOd, setProductsOd] = useState<any[]>([])
  const [productsOi, setProductsOi] = useState<any[]>([])
  const [casoMixto, setCasoMixto] = useState<CasoMixto | null>(null)
  const [loadingP, setLoadingP] = useState(false)
  const [totalDisp, setTotalDisp] = useState(0)
  const [showLead, setShowLead] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadNombre, setLeadNombre] = useState('')
  const [leadApellido, setLeadApellido] = useState('')
  const [leadTelefono, setLeadTelefono] = useState('')
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [pendingRx, setPendingRx] = useState<GlassesRx | null>(null)
  const [frecuencia, setFrecuencia] = useState<'diario' | 'quincenal' | 'mensual'>('diario')
  const [cartAdded, setCartAdded] = useState<string | null>(null)


  // ── Motor de recomendación ────────────────────────────────────────────────
  const cargarProductos = async (conv: ConvertedRx): Promise<any[]> => {
    setLoadingP(true)
    // Reset estado mixto en cada calculo
    setProductsOd([]); setProductsOi([]); setCasoMixto(null); setAlternativasRevision([])

    const mixto = detectarCasoMixto(conv)

    try {
      // ── CASO MIXTO: cargar productos separadamente por ojo ─────────────
      if (mixto.esMixto) {
        setCasoMixto(mixto)
        // Fetch simultaneo para OD y OI, cada uno con su tipo real
        const fetchOjo = async (tipo: TipoLenteOjo, rx: any) => {
          try {
            const res = await fetch('/api/receta/recomendar', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              // Enviamos la misma receta a od_sph y oi_sph para pasar filtros de rango
              body: JSON.stringify({
                tipo,
                od_sph: rx.sph ?? 0, oi_sph: rx.sph ?? 0,
                od_cyl: rx.cyl ?? 0, oi_cyl: rx.cyl ?? 0,
                od_axis: rx.axis ?? null, oi_axis: rx.axis ?? null,
                od_add: rx.add ?? null, oi_add: rx.add ?? null,
              })
            })
            const json = await res.json()
            if (json.error) toast.error(json.error, { duration: 5000 })
            return json.productos ?? []
          } catch { return [] }
        }
        const [listaOd, listaOi] = await Promise.all([
          fetchOjo(mixto.od.tipo, mixto.od.rx),
          fetchOjo(mixto.oi.tipo, mixto.oi.rx),
        ])
        setProductsOd(listaOd)
        setProductsOi(listaOi)
        setProducts([]) // limpia el modo simple
        setTotalDisp(listaOd.length + listaOi.length)
        return [...listaOd, ...listaOi]
      }

      // ── CASO ESTANDAR: 1 tipo de producto para ambos ojos ─────────────
      const res = await fetch('/api/receta/recomendar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: conv.tipo,
          od_sph: conv.od.sph ?? 0, oi_sph: conv.oi.sph ?? 0,
          od_cyl: conv.od.cyl ?? 0, oi_cyl: conv.oi.cyl ?? 0,
          od_axis: conv.od.axis ?? null, oi_axis: conv.oi.axis ?? null,
          od_add: conv.od.add ?? null, oi_add: conv.oi.add ?? null,
        })
      })
      const json = await res.json()
      if (json.error) toast.error(json.error, { duration: 5000 })
      const lista = json.productos ?? []
      setAlternativasRevision(json.alternativas_revision ?? [])
      setProducts(lista)
      setTotalDisp(json.total ?? 0)
      if (json.nota) toast(json.nota, { duration: 4000 })
      return lista
    } catch { setProducts([]); setAlternativasRevision([]); return [] }
    finally { setLoadingP(false) }
  }

  // ── Calcular ───────────────────────────────────────────────────────────────
  const calcular = async () => {
    const odSph = parseN(od.sph), oiSph = parseN(oi.sph)
    if (odSph === null || oiSph === null) { toast.error('Completa la Esfera (SPH) de ambos ojos'); return }
    if (!rxSource) { toast.error('Selecciona si tu receta es de gafas o lentes de contacto'); return }
    const rx: GlassesRx = {
      od: { sph: odSph, cyl: parseN(od.cyl), axis: parseN(od.axis), add: parseN(od.add) },
      oi: { sph: oiSph, cyl: parseN(oi.cyl), axis: parseN(oi.axis), add: parseN(oi.add) },
    }
    setPendingRx(rx)
    // El cálculo es libre y no exige registro ni datos personales.
    await ejecutarCalculo(rx)
  }

  const ejecutarCalculo = async (rx: GlassesRx): Promise<any[]> => {
    const conv = convertGlassesToContacts(rx, rxSource ?? 'contacto', Number(vertexDistanceMm)); setResult(conv); setCartAdded(null)
    // La ADD de gafas no se traduce directamente a la potencia/clase multifocal de un lente de contacto.
    // Se evita recomendar modelos multifocales automáticamente sin adaptación profesional.
    // La revisión clínica no debe bloquear la búsqueda: mostramos los modelos
    // técnicamente cercanos y exigimos validación profesional antes de comprar.
    const lista: any[] = await cargarProductos(conv)
    trackEvento('calcular', { tipo_receta: conv.tipo, complejidad: getComplejidad(conv).nivel })
    setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    return lista
  }

  // La captura de datos es opcional: los resultados nunca dependen de guardar un lead.
  // Si el usuario decide guardar sus datos, se procesa sin bloquear la calculadora.
  const handleLeadSubmit = async () => {
    if (!pendingRx) return
    const telClean = leadTelefono.replace(/\D/g,'')
    if (!leadNombre.trim()) { toast.error('Ingresa tu nombre'); return }
    if (!leadApellido.trim()) { toast.error('Ingresa tu apellido'); return }
    const nombreCompleto = `${leadNombre.trim()} ${leadApellido.trim()}`
    if (!tieneNombreYApellido(nombreCompleto)) { toast.error(ERROR_NOMBRE_INCOMPLETO); return }
    if (telClean.length < 10) { toast.error('Ingresa tu número de WhatsApp (10 dígitos)'); return }
    const conv = convertGlassesToContacts(pendingRx, rxSource ?? 'contacto', Number(vertexDistanceMm))
    let saveOk = false
    try {
      const res = await fetch('/api/calculator-leads/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCompleto,
          email: leadEmail.trim() ? leadEmail.trim().toLowerCase() : null,
          telefono: telClean,
          od_sph: pendingRx.od.sph, od_cyl: pendingRx.od.cyl, od_axis: pendingRx.od.axis,
          oi_sph: pendingRx.oi.sph, oi_cyl: pendingRx.oi.cyl, oi_axis: pendingRx.oi.axis,
          tipo_receta: conv.tipo, complejidad: getComplejidad(conv).nivel, condiciones: conv.condiciones
        }),
      })
      const data = await res.json()
      saveOk = !!data.ok
      if (!saveOk) console.error('[calculator-leads] Error guardando:', data)
    } catch (e) {
      console.error('[calculator-leads] Excepción guardando:', e)
    }
    if (saveOk) {
      trackEvento('lead_captured', { tipo_receta: conv.tipo, has_phone: !!leadTelefono })
    }
    setLeadCaptured(true)
    setShowLead(false)
    toast.success(saveOk ? '¡Datos guardados! Calculando tu receta...' : 'Calculando tu receta...')
    const lista = await ejecutarCalculo(pendingRx)
    // WhatsApp inmediato con LOS MISMOS productos y precios de la pantalla
    if (saveOk && lista.length) {
      const convFinal = convertGlassesToContacts(pendingRx, rxSource ?? 'contacto', Number(vertexDistanceMm))
      fetch('/api/calculator-leads/notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCompleto,
          telefono: telClean,
          od_sph: convFinal.od.sph, od_cyl: convFinal.od.cyl, od_axis: convFinal.od.axis,
          oi_sph: convFinal.oi.sph, oi_cyl: convFinal.oi.cyl, oi_axis: convFinal.oi.axis,
          condiciones: convFinal.condiciones,
          productos: lista.slice(0, 3).map((p: any) => ({ nombre: p.nombre, precio: p.precio })),
        }),
      }).catch(() => {})
    }
  }
  const resetear = () => {
    setOd(EMPTY); setOi(EMPTY); setMisma(false); setResult(null)
    setProducts([]); setProductsOd([]); setProductsOi([]); setCasoMixto(null)
    setShowLead(false); setPendingRx(null); setCartAdded(null); setRxSource(null); setVertexDistanceMm('12')
  }

  // ── Agregar al carrito DIRECTO (esférico y color) o via PDP ────────────────
  // soloOjo: cuando viene de una card del modo mixto, agrega SOLO 1 caja para ese ojo
  const handleAddToCart = (product: any, productResult?: ConvertedRx, soloOjo?: 'OD' | 'OI') => {
    if (!result) return
    const activeResult = productResult ?? result
    const isSimple = activeResult.tipo === 'esferico' && !casoMixto
    // Modo mixto o tipos complejos → ir al PDP con la receta correcta
    if (!isSimple) {
      saveRxToSession(soloOjo, activeResult)
      router.push(`/producto/${product.slug}${soloOjo ? `?ojo=${soloOjo}` : ''}`)
      return
    }
    // Esférico puro: agregar directo al carrito con la receta calculada
    const prod: Partial<Product> = {
      id: product.id, nombre: product.nombre, marca: product.marca,
      precio: Number(product.precio), tipo: product.tipo,
      imagen_url: product.imagen_url, activo: true, slug: product.slug,
      sph_disponibles: product.sph_disponibles ?? [], cyl_disponibles: [],
      add_disponibles: [], colores_disponibles: [], stock: 99,
      categoria_id: null, costo: 0, descripcion: product.descripcion ?? null,
    }
    const odSph = result.od.sph ?? 0; const oiSph = result.oi.sph ?? 0
    if (Math.abs(odSph - oiSph) < 0.01) {
      addItem(prod as Product, { sph: odSph, ojo_mode: 'AMBOS', misma_receta: true, cantidad: 2 })
    } else {
      addItem(prod as Product, { sph: odSph, ojo_mode: 'OD', cantidad: 1 })
      addItem(prod as Product, { sph: oiSph, ojo_mode: 'OI', cantidad: 1 })
    }
    setCartAdded(product.id)
    trackEvento('add_to_cart', { tipo_receta: result.tipo, producto_slug: product.slug })
    toast.success(`¡${product.nombre} agregado con tu receta!`, { duration: 3000 })
  }

  const saveRxToSession = (soloOjo?: 'OD' | 'OI', rxResult?: ConvertedRx) => {
    const activeResult = rxResult ?? result
    if (!activeResult) return
    try {
      sessionStorage.setItem('cg_rx_pending', JSON.stringify({
        od: activeResult.od, oi: activeResult.oi, tipo: activeResult.tipo,
        soloOjo: soloOjo ?? null, // el PDP puede pre-seleccionar solo ese ojo
        timestamp: Date.now()
      }))
    } catch {}
  }

  const buildWA = (r: ConvertedRx) => {
    const fmtEye = (l: string, e: any) =>
      `${l}: SPH ${fmtV(e.sph)}${e.cyl ? ` CYL ${fmtCyl(e.cyl)}` : ''}${e.axis ? ` EJE ${fmtAxis(e.axis)}` : ''}${e.add ? ` ADD +${e.add.toFixed(2)}` : ''}`
    return encodeURIComponent(`Hola ContactGo, necesito ayuda con mi receta:\n\n${fmtEye('OD', r.od)}\n${fmtEye('OI', r.oi)}\n\nTipo: ${r.tipo === 'multifocal_torico' ? 'MULTIFOCAL TÓRICO' : r.tipo.toUpperCase()}`)
  }

  const tipoLabel = (t: string) => t === 'torico' ? 'Tóricos' : t === 'multifocal_torico' ? 'Multifocal tórico' : t === 'multifocal' ? 'Multifocales' : t === 'color' ? 'Lentes de color' : 'Esféricos'
  const tipoSlug  = (t: string) => t === 'torico' ? 'toricos' : t.startsWith('multifocal') ? 'multifocales' : t === 'color' ? 'catalogo?tipo=color' : 'esfericos'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f8fb] pb-16">

        {/* Encabezado compacto: prioriza el formulario en móvil */}
        <section className="relative overflow-hidden border-b border-[#dceaf4] bg-[#0758a6] px-4 py-6 text-left text-white md:px-5 md:py-8"><div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[18px] border-white/5" /><div className="pointer-events-none absolute -right-2 -top-10 h-40 w-40 rounded-full border-[12px] border-[#01B2B7]/15" />
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 md:text-xs"><span className="h-2 w-2 rounded-full bg-[#01B2B7]" />Calculadora de receta</p><h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">Encuentra tus lentes ideales</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/85">Introduce tu graduación y descubre las opciones que se ajustan a tus parámetros.</p>
            </div>
            <div className="hidden shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white sm:block">
              Sin costo · Sin registro
            </div>
          </div>
        </section>

        {/* Pop-up de captura — aparece INMEDIATAMENTE al dar clic en "Calcular", cerrable con X */}
        {showLead && !leadCaptured && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLead(false)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="lead-dialog-title" onClick={e => e.stopPropagation()}>
              <button type="button" onClick={() => setShowLead(false)} aria-label="Cerrar formulario" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">×</button>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3"><Mail className="w-6 h-6 text-green-600" /></div>
                <h3 id="lead-dialog-title" className="font-black text-gray-900 text-lg">Guarda tu receta para la próxima vez</h3>
                <p className="text-xs text-gray-500 mt-1">Completa tus datos si quieres que guardemos esta receta y podamos ayudarte con futuras reposiciones.</p>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <input value={leadNombre} onChange={e => setLeadNombre(e.target.value)} placeholder="Nombre *"
                    className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500" />
                  <input value={leadApellido} onChange={e => setLeadApellido(e.target.value)} placeholder="Apellido *"
                    className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500" />
                </div>
                <input value={leadTelefono} onChange={e => setLeadTelefono(e.target.value)} type="tel" placeholder="WhatsApp * (ej: 809-555-1234)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500" />
                <input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} type="email" placeholder="Correo electrónico (opcional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500" />
              </div>
              <button onClick={handleLeadSubmit} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 font-black rounded-xl text-sm transition-colors mb-1">
                Guardar mi receta →
              </button>
              <p className="text-[10px] text-gray-400 text-center">Tus datos están protegidos y solo se utilizarán para gestionar tu receta.</p>
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto -mt-3 max-w-3xl space-y-3 px-3 pb-5 md:px-4 md:space-y-4">





          {/* Tipo de receta */}
          <section className="rounded-2xl border border-[#dce6ed] bg-white p-4 shadow-[0_8px_24px_rgba(15,35,65,.05)] md:p-5">
            <div className="mb-2">
              <h2 className="text-base font-bold tracking-tight text-[#002455]">¿Qué tipo de receta tienes?</h2>
              <p className="mt-1 text-xs text-slate-500">Elige de dónde provienen los valores.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRxSource('contacto')}
                className={`flex min-h-[68px] flex-row items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors md:min-h-[82px] md:gap-3 md:p-4 ${
                  rxSource === 'contacto' ? 'border-primary-500 bg-teal-50/50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'
                }`}>
                <Eye className={`h-5 w-5 ${rxSource === 'contacto' ? 'text-primary-700' : 'text-slate-400'}`} />
                <span>
                  <span className="block text-xs font-semibold text-slate-900 md:text-sm">Lentes de contacto</span>
                  <span className="mt-0.5 hidden text-[11px] leading-4 text-slate-500 sm:block">Tengo una receta de contacto.</span>
                </span>
              </button>
              <button type="button" onClick={() => setRxSource('gafas')}
                className={`flex min-h-[68px] flex-row items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors md:min-h-[82px] md:gap-3 md:p-4 ${
                  rxSource === 'gafas' ? 'border-primary-500 bg-teal-50/50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'
                }`}>
                <Glasses className={`h-5 w-5 ${rxSource === 'gafas' ? 'text-primary-700' : 'text-slate-400'}`} />
                <span>
                  <span className="block text-xs font-semibold text-slate-900 md:text-sm">Gafas / espejuelos</span>
                  <span className="mt-0.5 hidden text-[11px] leading-4 text-slate-500 sm:block">Tengo una receta de gafas.</span>
                </span>
              </button>
            </div>
            {rxSource === 'gafas' && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Distancia al vértice</label>
                <select value={vertexDistanceMm} onChange={e => setVertexDistanceMm(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800">
                  {[8,9,10,11,12,13,14,15,16,17,18,19,20].map(v => <option key={v} value={String(v)}>{v} mm{v===12?' · referencia habitual':''}</option>)}
                </select>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">Utiliza la distancia medida por tu óptica. Si no la conoces, 12 mm es una referencia general, no una medición personal. La conversión es orientativa.</p>
              </div>
            )}
          </section>

          {/* Formulario OD | OI */}
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#dce6ed] bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-[0_3px_12px_rgba(15,35,65,.03)]">
              <input type="checkbox" checked={misma} onChange={e => { setMisma(e.target.checked); if(e.target.checked) setOi({...od}) }} className="h-4 w-4 rounded accent-[#01B2B7]"/>
              Ambos ojos tienen la misma receta
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EyePanel label="OD · Ojo derecho" eye={od} onChange={e => { setOd(e); if(misma) setOi(e) }} color="blue"/>
              <EyePanel label="OI · Ojo izquierdo" eye={oi} onChange={setOi} color="green" disabled={misma}/>
            </div>
          </div>

          {/* CTAs calcular */}
          <div className="flex gap-2.5 pt-1">
            <button onClick={resetear} aria-label="Limpiar receta" className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl border border-[#dce6ed] bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
              <RotateCcw className="w-4 h-4"/>
            </button>
            <button onClick={calcular} className="flex-1 rounded-xl bg-[#01B2B7] py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-[#009da2] flex items-center justify-center gap-2 text-sm">
              <Sparkles className="w-4 h-4"/> Calcular y ver productos →
            </button>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-gray-300 shrink-0 mt-0.5"/>
            <p className="text-[10px] text-gray-400">Orientativa. No reemplaza prescripción profesional. <Link href="/politica-receta" className="underline">Política de Receta</Link></p>
          </div>

          {/* ── RESULTADO ──────────────────────────────────────────────────── */}
          {result && (
            <div id="resultado" className="space-y-4 pt-3">

              {/* Diagnóstico + complejidad */}
              <DiagnosticoCard result={result}/>

              {/* PRODUCTOS — foco principal CRO */}
              <div>
                {loadingP ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-sm">Buscando productos compatibles...</p>
                  </div>
                ) : casoMixto ? (
                  // ═══════════ CASO MIXTO — 2 columnas OD/OI ═══════════
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-xs font-bold text-amber-900 mb-0.5">Recomendaciones evaluadas por separado para cada ojo</p>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        Validamos la graduación de cada ojo contra los parámetros reales de fabricación. Si los modelos coinciden, puedes seleccionar
                        <strong> una caja para cada ojo</strong>. Las opciones que aparecen debajo cumplen los parámetros publicados para ese ojo.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ── Columna OJO DERECHO ─────────────────────── */}
                      <div className="bg-white rounded-2xl border border-primary-100 p-3">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-[10px] font-black text-primary-700 uppercase tracking-wider">Ojo Derecho</p>
                            <p className="font-black text-gray-900 text-sm">{tipoLabel(casoMixto.od.tipo)}</p>
                          </div>
                          <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">OD</span>
                        </div>
                        {productsOd.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-6">No encontramos una coincidencia confirmada para este ojo. Podemos revisar alternativas contigo.</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            {productsOd.slice(0, 3).map((p, i) => (
                              <ProductCard key={`od-${p.id}-${i}`} product={p} result={result} tier={i===0?'eco':i===1?'rec':'prem'}
                                onAction={(prod, rxResult) => handleAddToCart(prod, rxResult, 'OD')} cartAdded={cartAdded} soloOjo="OD" compact/>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── Columna OJO IZQUIERDO ───────────────────── */}
                      <div className="bg-white rounded-2xl border border-primary-100 p-3">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-[10px] font-black text-primary-700 uppercase tracking-wider">Ojo Izquierdo</p>
                            <p className="font-black text-gray-900 text-sm">{tipoLabel(casoMixto.oi.tipo)}</p>
                          </div>
                          <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full">OI</span>
                        </div>
                        {productsOi.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-6">Sin productos compatibles — contáctanos por WhatsApp</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2">
                            {productsOi.slice(0, 3).map((p, i) => (
                              <ProductCard key={`oi-${p.id}-${i}`} product={p} result={result} tier={i===0?'eco':i===1?'rec':'prem'}
                                onAction={(prod, rxResult) => handleAddToCart(prod, rxResult, 'OI')} cartAdded={cartAdded} soloOjo="OI" compact/>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs text-green-900 leading-relaxed">
                        <strong>Importante:</strong> si prefieres que armemos tu pedido personalizado y te enviemos el link de pago,{' '}
                        <a href={`https://wa.me/18096942268?text=${buildWA(result)}`} target="_blank" rel="noopener noreferrer" className="underline font-bold">contáctanos por WhatsApp</a>.
                      </p>
                    </div>
                  </>
                ) : (
                  // ═══════════ CASO ESTANDAR — flujo original ═══════════
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-black text-gray-900 text-base">{tipoLabel(result.tipo)}</p>
                        {totalDisp > 3 && <p className="text-xs text-gray-500">{totalDisp} disponibles · mejores 3</p>}
                      </div>
                      {result.tipo === 'esferico' && (
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">Agregar directo al carrito</span>
                      )}
                    </div>

                    {products.length === 0 ? (
                      alternativasRevision.length > 0
                        ? <AlternativasRevisionCard alternatives={alternativasRevision} result={result}/>
                        : <FallbackProductos result={result} buildWA={buildWA}/>
                    ) : (
                      <>
                        {/* Mobile: cards apiladas — Desktop: 3 columnas */}
                        <div className="flex flex-col gap-3 md:hidden">
                          {products[1] && <ProductCard product={products[1]} result={result} tier="rec" onAction={handleAddToCart} cartAdded={cartAdded}/>}
                          <div className="grid grid-cols-2 gap-2">
                            {products[0] && <ProductCard product={products[0]} result={result} tier="eco" onAction={handleAddToCart} cartAdded={cartAdded}/>}
                            {products[2] && <ProductCard product={products[2]} result={result} tier="prem" onAction={handleAddToCart} cartAdded={cartAdded}/>}
                          </div>
                        </div>
                        {/* Desktop: 3 columnas */}
                        <div className="hidden md:grid grid-cols-3 gap-3">
                          {products.map((p, i) => (
                            <ProductCard key={`${p.id}-${i}`} product={p} result={result} tier={i===0?'eco':i===1?'rec':'prem'} onAction={handleAddToCart} cartAdded={cartAdded}/>
                          ))}
                        </div>
                      </>
                    )}

                    <Link href={`/${tipoSlug(result.tipo)}`}
                      className="mt-3 flex items-center justify-center gap-1 text-primary-600 text-xs font-semibold hover:underline py-2">
                      Ver todos los {tipoLabel(result.tipo)} disponibles <ChevronRight className="w-3.5 h-3.5"/>
                    </Link>
                  </>
                )}
              </div>

              {/* Ahorro vs óptica */}
              {products.length > 0 && <AhorroCard precio={Number(products[Math.min(1,products.length-1)]?.precio)}/>}

              {/* Consumo */}
              {products.length > 0 && <ConsumoCard precio={Number(products[Math.min(1,products.length-1)]?.precio)} frecuencia={frecuencia} onChange={setFrecuencia}/>}

              {/* WhatsApp */}
              <WhatsAppCard result={result} buildMsg={buildWA}/>

              {/* Guardar receta — CTA opcional post-resultado */}
              {!showLead && (
                <button
                  onClick={() => setShowLead(true)}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-2xl py-3 text-xs text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Guardar mi receta por email para la próxima vez
                </button>
              )}

            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}

// ── EyePanel ──────────────────────────────────────────────────────────────────
function EyePanel({ label, eye, onChange, color, disabled }: { label: string; eye: EyeInput; onChange: (e: EyeInput) => void; color: 'blue'|'green'; disabled?: boolean }) {
  const s = (k: keyof EyeInput) => (v: string) => onChange({ ...eye, [k]: v })
  const hasCyl = !!eye.cyl && parseFloat(eye.cyl) !== 0
  const field = "w-full min-w-0 appearance-none rounded-full border border-[#e4e9ed] bg-white px-4 py-3.5 text-[15px] font-medium text-slate-800 outline-none transition focus:border-[#01B2B7] focus:ring-2 focus:ring-[#01B2B7]/15 disabled:bg-slate-50 disabled:text-slate-300"
  return (
    <section className={"rounded-2xl border border-[#e3e9ee] bg-white p-4 shadow-[0_8px_24px_rgba(15,35,65,.045)] md:p-5 " + (disabled ? "opacity-50" : "")}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className={"h-2.5 w-2.5 rounded-full " + (color === "blue" ? "bg-[#1762b3]" : "bg-[#01B2B7]")}/>
        <h3 className="text-base font-semibold tracking-tight text-[#002455]">{label}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
        <label className="min-w-0 text-xs font-medium text-slate-500">Esfera · SPH <span className="text-rose-500">*</span>
          <select value={eye.sph} onChange={e=>s("sph")(e.target.value)} disabled={disabled} className={field}>
            <option value="">Seleccionar</option>
            {SPH_GLASSES.map(v=><option key={v} value={String(v)}>{v===0?'Plano':v>0?`+${v.toFixed(2)}`:v.toFixed(2)}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium text-slate-500">Cilindro · CYL
          <select value={eye.cyl} onChange={e=>{s("cyl")(e.target.value);if(!e.target.value)s("axis")("")}} disabled={disabled} className={field}>
            <option value="">Sin cilindro</option>
            {CYL_GLASSES.filter(v=>v!==0).map(v=><option key={v} value={String(v)}>{v.toFixed(2)}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium text-slate-500">Eje · AXIS {hasCyl&&<span className="text-rose-500">*</span>}
          <select value={eye.axis} onChange={e=>s("axis")(e.target.value)} disabled={disabled||!hasCyl} className={field}>
            <option value="">—</option>
            {AXIS_VALS.map(v=><option key={v} value={String(v)}>{String(v).padStart(3,'0')}°</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium text-slate-500">Adición · ADD
          <select value={eye.add} onChange={e=>s("add")(e.target.value)} disabled={disabled} className={field}>
            <option value="">Sin adición</option>
            {ADD_VALS.map(v=><option key={v} value={String(v)}>+{v.toFixed(2)}</option>)}
          </select>
        </label>
      </div>
    </section>
  )
}
// ── Diagnóstico ───────────────────────────────────────────────────────────────
function DiagnosticoCard({ result: r }: { result: ConvertedRx }) {
  const comp = getComplejidad(r)
  const compC = {
    verde: { label: 'Rango estándar', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    amarillo: { label: 'Revisión recomendada', dot: 'bg-amber-500', text: 'text-amber-700' },
    rojo: { label: 'Requiere asesoría', dot: 'bg-rose-500', text: 'text-rose-700' },
  }[comp.nivel]
  const tipoNombre = r.tipo==='torico' ? 'Lentes tóricos' : r.tipo==='multifocal_torico' ? 'Multifocal tórico' : r.tipo==='multifocal' ? 'Lentes multifocales' : 'Lentes esféricos'
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4 md:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Resultado de tu receta</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{tipoNombre}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">{r.condiciones.map(c=><span key={c} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">{c}</span>)}</div>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold ${compC.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${compC.dot}`} />{compC.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 md:p-5">
        {([['OD',r.od],['OI',r.oi]] as const).map(([lbl,eye])=>(
          <div key={lbl} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <p className={`mb-3 text-xs font-bold ${lbl==='OD'?'text-blue-700':'text-emerald-700'}`}>{lbl}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-2"><span className="text-slate-500">SPH</span><span className="font-mono font-semibold text-slate-900">{fmtV(eye.sph)}</span></div>
              {eye.cyl!=null&&eye.cyl!==0&&<div className="flex justify-between gap-2"><span className="text-slate-500">CYL</span><span className="font-mono font-semibold text-slate-900">{fmtCyl(eye.cyl)}</span></div>}
              {eye.axis!=null&&<div className="flex justify-between gap-2"><span className="text-slate-500">EJE</span><span className="font-mono font-semibold text-slate-900">{fmtAxis(eye.axis)}</span></div>}
              {eye.add!=null&&eye.add!==0&&<div className="flex justify-between gap-2"><span className="text-slate-500">ADD</span><span className="font-mono font-semibold text-slate-900">+{eye.add.toFixed(2)}</span></div>}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 px-4 pb-4 md:px-5 md:pb-5">
        {r.needsVertex&&<p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] leading-5 text-slate-600">Conversión óptica estimada desde gafas con una distancia al vértice de {r.vertexDistanceMm} mm. Los valores pueden variar y deben ser confirmados durante una adaptación profesional.</p>}
        {r.requiresClinicalReview&&<p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-900">Tu receta de gafas incluye ADD. Ese valor no se traduce directamente a una graduación multifocal de contacto. Se requiere evaluación y selección profesional; por eso no mostramos una compatibilidad automática.</p>}
        {!r.needsVertex && r.condiciones.includes('Alta graduación')&&<p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] leading-5 text-slate-600">La graduación está en un rango elevado. La disponibilidad depende de los parámetros de fabricación específicos de cada lente.</p>}
        <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"/>
          <div><p className="text-xs font-semibold text-slate-700">{comp.titulo}</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">{comp.desc}</p></div>
        </div>
        <p className="text-[10px] leading-4 text-slate-400">Resultado orientativo. No sustituye una prescripción ni una adaptación realizada por un profesional de la salud visual.</p>
      </div>
    </section>
  )
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product: p, result, tier, onAction, cartAdded, soloOjo, compact }: {
  product: any; result: ConvertedRx; tier: 'eco'|'rec'|'prem';
  onAction: (p: any, result?: ConvertedRx) => void; cartAdded: string|null;
  soloOjo?: 'OD' | 'OI'; compact?: boolean
}) {
  const productResult: ConvertedRx = p.receta_ajustada
    ? { ...result, od: { ...result.od, ...p.receta_ajustada.od }, oi: { ...result.oi, ...p.receta_ajustada.oi } }
    : result
  const precio = Number(p.precio)
  const precioAnt = Number(p.precio_anterior ?? 0)
  const off = precioAnt > precio ? Math.round((1 - precio/precioAnt)*100) : 0
  const featured = tier === 'rec'
  const isSimple = result.tipo === 'esferico' && !soloOjo
  const wasAdded = cartAdded === p.id
  const tierLabel = {eco:'ECONÓMICO',rec:'RECOMENDADO',prem:'PREMIUM'}[tier]
  const tierColor = {eco:'bg-gray-100 text-gray-600',rec:'bg-teal-500 text-white',prem:'bg-gray-800 text-white'}[tier]
  return (
    <div className={`flex flex-col bg-white rounded-2xl border overflow-hidden transition-all ${featured?'border-primary-400 shadow-md ring-2 ring-teal-50':'border-gray-100 shadow-sm'}`}>
      <div className={`text-[10px] font-black text-center py-1.5 ${tierColor}`}>{tierLabel}</div>
      <div className="p-3 flex-1 flex flex-col">
        {p.imagen_url&&<img src={p.imagen_url} alt={p.nombre} className={`w-full ${compact?'h-12':'h-14'} object-contain mb-2 rounded-lg bg-gray-50`}/>}
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{p.marca}</p>
        <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 flex-1 line-clamp-2">{p.nombre}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className={`font-black text-sm ${featured?'text-primary-600':'text-gray-900'}`}>RD${precio.toLocaleString()}</p>
          {off > 0 && <p className="text-[9px] text-green-600 font-bold">-{off}% off</p>}
        </div>

        {/* Receta que le corresponde a ESTE producto (estilo OptiExpert de CooperVision) */}
        <RecetaMini result={productResult} soloOjo={soloOjo} />
        {p.requiere_revision && <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-[10px] leading-4 text-amber-900">Parámetros cercanos de fabricación. El cilindro o eje difiere de tu cálculo; un especialista debe validar esta alternativa antes de comprar.</p>}
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        <button onClick={() => onAction(p, productResult)}
          className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${wasAdded ? 'bg-green-500 text-white' : featured ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
          {wasAdded ? (<><CheckCircle className="w-3.5 h-3.5"/> ¡En tu carrito!</>)
           : soloOjo ? (<><ArrowRight className="w-3.5 h-3.5"/> Elegir para {soloOjo}</>)
           : isSimple ? (<><ShoppingCart className="w-3.5 h-3.5"/> Agregar al carrito</>)
           : (<><ArrowRight className="w-3.5 h-3.5"/> Ver con mi receta</>)}
        </button>
        <Link href={`/producto/${p.slug}${soloOjo ? `?ojo=${soloOjo}` : ''}`}
          onClick={() => {
            try {
              sessionStorage.setItem('cg_rx_pending', JSON.stringify({
                od: productResult.od, oi: productResult.oi, tipo: productResult.tipo,
                soloOjo: soloOjo ?? null, timestamp: Date.now()
              }))
            } catch {}
          }}
          className="w-full py-1.5 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
          Ver detalles →
        </Link>
      </div>
    </div>
  )
}

// ── RecetaMini — muestra la receta correspondiente a cada producto ──────────
// Estilo inspirado en OptiExpert de CooperVision: caja sutil con formato
// compacto por ojo, para que el cliente vea exactamente qué graduación pedir.
function RecetaMini({ result, soloOjo }: { result: ConvertedRx; soloOjo?: 'OD' | 'OI' }) {
  const od = result.od
  const oi = result.oi
  const tipo = result.tipo

  // Solo esféricos con la misma graduación en ambos ojos se pueden colapsar
  const sameSph = od?.sph === oi?.sph
  const sameCyl = od?.cyl === oi?.cyl
  const sameAxis = od?.axis === oi?.axis
  const sameAdd = od?.add === oi?.add
  const iguales = sameSph && sameCyl && sameAxis && sameAdd

  const fmtOjo = (o: any): string => {
    if (!o) return '—'
    const bits: string[] = []
    if (o.sph != null) bits.push(`${Number(o.sph) > 0 ? '+' : ''}${o.sph}`)
    if (o.cyl != null && o.cyl !== 0) bits.push(`CYL ${o.cyl}`)
    if (o.axis != null && (tipo === 'torico' || tipo === 'multifocal_torico' || (o.cyl != null && o.cyl !== 0))) bits.push(`×${o.axis}°`)
    if (o.add != null) bits.push(`ADD +${o.add}`)
    return bits.join(' ')
  }

  return (
    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 bg-blue-50/40 -mx-3 px-3 pb-2 rounded-b-lg">
      <p className="text-[8px] font-bold text-blue-700 uppercase tracking-wider mb-1">Tu receta para este lente</p>
      {soloOjo ? (
        // Modo mixto: mostrar SOLO el ojo específico
        <p className="text-[11px] font-mono font-bold text-gray-900">
          <span className="text-gray-500 font-sans">{soloOjo}:</span>{' '}
          <span className="text-primary-700">{fmtOjo(soloOjo === 'OD' ? od : oi)}</span>
        </p>
      ) : iguales ? (
        <p className="text-[11px] font-mono font-bold text-gray-900">
          Ambos ojos: <span className="text-primary-700">{fmtOjo(od)}</span>
        </p>
      ) : (
        <div className="text-[10.5px] font-mono leading-snug">
          <p className="text-gray-900">
            <span className="text-gray-500 font-sans font-semibold">OD:</span>{' '}
            <span className="font-bold text-primary-700">{fmtOjo(od)}</span>
          </p>
          <p className="text-gray-900">
            <span className="text-gray-500 font-sans font-semibold">OI:</span>{' '}
            <span className="font-bold text-primary-700">{fmtOjo(oi)}</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ── Fallback sin productos ─────────────────────────────────────────────────────
function FallbackProductos({ result, buildWA }: { result: ConvertedRx; buildWA: (r: ConvertedRx) => string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
      
      <p className="font-bold text-gray-900 text-sm mb-1">Consultamos disponibilidad para ti</p>
      <p className="text-xs text-gray-500 mb-4">Un especialista te confirmará las opciones compatibles en minutos.</p>
      <a href={`https://wa.me/18096942268?text=${buildWA(result)}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#002455] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md">
        Consultar disponibilidad →
      </a>
    </div>
  )
}


function AlternativasRevisionCard({ alternatives, result }: { alternatives: any[]; result: ConvertedRx }) {
  const message = (p: any) => {
    const fmt = (v: number | null) => v == null ? '—' : Number(v).toFixed(2)
    const fmtAxis = (v: number | null) => v == null ? '—' : String(v).padStart(3, '0') + '°'
    const a = p.parametros_revision
    return [
      'Hola ContactGo. Mi calculadora encontró un modelo para revisión profesional, no una coincidencia exacta.',
      p.nombre,
      `OD: SPH ${fmt(a.od.sph)}, CYL disponible ${fmt(a.od.cyl_disponible)}, eje disponible ${fmtAxis(a.od.axis_disponible)}`,
      `OI: SPH ${fmt(a.oi.sph)}, CYL disponible ${fmt(a.oi.cyl_disponible)}, eje disponible ${fmtAxis(a.oi.axis_disponible)}`,
      `Receta calculada: OD ${fmt(result.od.sph)} / ${fmt(result.od.cyl)} × ${fmt(result.od.axis)}; OI ${fmt(result.oi.sph)} / ${fmt(result.oi.cyl)} × ${fmt(result.oi.axis)}.`,
      'Por favor, confirmen si existe una alternativa adecuada antes de realizar el pedido.'
    ].join('\\n')
  }
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
      <div>
        <p className="text-sm font-bold text-gray-900">Modelos para revisar con un especialista</p>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          No encontramos coincidencia exacta con todos los parámetros de fabricación. Estos modelos tienen valores cercanos disponibles, pero no constituyen una receta ni una recomendación para comprar sin validación profesional.
        </p>
      </div>
      {alternatives.map((p: any) => (
        <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-16 h-16 object-contain rounded-lg bg-gray-50"/>}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{p.marca}</p>
              <p className="text-sm font-bold text-gray-900">{p.nombre}</p>
              {p.precio != null && <p className="text-sm font-semibold text-primary-700">RD${Number(p.precio).toLocaleString('es-DO')}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {(['od','oi'] as const).map((eye) => (
              <div key={eye} className="rounded-lg bg-gray-50 p-2">
                <p className="font-bold text-gray-700 mb-1">{eye.toUpperCase()}</p>
                <p>SPH: {p.parametros_revision[eye].sph?.toFixed(2) ?? 'No disponible'}</p>
                <p>CYL cercano: {p.parametros_revision[eye].cyl_disponible?.toFixed(2) ?? '—'}</p>
                <p>Eje cercano: {p.parametros_revision[eye].axis_disponible != null ? String(p.parametros_revision[eye].axis_disponible).padStart(3,'0') + '°' : '—'}</p>
              </div>
            ))}
          </div>
          <a href={`https://wa.me/18096942268?text=${encodeURIComponent(message(p))}`} target="_blank" rel="noopener noreferrer"
            className="mt-3 w-full inline-flex justify-center rounded-lg bg-[#002455] px-4 py-2.5 text-xs font-bold text-white">
            Solicitar validación del especialista
          </a>
        </div>
      ))}
    </div>
  )
}

// ── Ahorro ────────────────────────────────────────────────────────────────────
function AhorroCard({ precio }: { precio: number }) {
  const optica = Math.round(precio * OPTICA_MULT)
  const ahorro = optica - precio
  const pctAhorro = Math.round((ahorro/optica)*100)
  const ahorroAnual = ahorro * 24
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-bold text-gray-900 text-sm mb-3">Tu ahorro comprando en ContactGo</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{l:'Precio estimado',v:`RD$${optica.toLocaleString()}`,c:'text-gray-400 line-through',s:`estimado +${OPTICA_MULT*100-100|0}% aprox`},{l:'ContactGo',v:`RD$${precio.toLocaleString()}`,c:'text-primary-600',s:'precio oficial'},{l:'Ahorras',v:`RD$${ahorro.toLocaleString()}`,c:'text-green-600 font-black',s:`RD$${ahorroAnual.toLocaleString()}/año`}].map(({l,v,c,s})=>(
          <div key={l} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-gray-500">{l}</p>
            <p className={`font-black text-sm mt-0.5 ${c}`}>{v}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2">
        <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0"/>
        <p className="text-xs text-green-700 font-medium">Ahorro anual estimado: <strong>RD${ahorroAnual.toLocaleString()}</strong></p>
      </div>
    </div>
  )
}

// ── Consumo ────────────────────────────────────────────────────────────────────
function ConsumoCard({ precio, frecuencia, onChange }: { precio: number; frecuencia: string; onChange: (f: any) => void }) {
  const d: Record<string,{cajas:number;label:string}> = {diario:{cajas:24,label:'Diarios'},quincenal:{cajas:8,label:'Quincenales'},mensual:{cajas:4,label:'Mensuales'}}
  const {cajas} = d[frecuencia]; const anual = precio * cajas
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-bold text-gray-900 text-sm mb-3">Calculadora de consumo</p>
      <div className="flex gap-1.5 mb-3">
        {(['diario','quincenal','mensual'] as const).map(f=>(
          <button key={f} onClick={()=>onChange(f)}
            className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${frecuencia===f?'bg-teal-500 text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>
            {d[f].label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[{l:'Cajas/año',v:`${cajas}`},{l:'Anual',v:`RD$${anual.toLocaleString()}`},{l:'Mensual',v:`RD$${Math.round(anual/12).toLocaleString()}`},{l:'Por día',v:`RD$${Math.round(anual/365).toLocaleString()}`}].map(({l,v})=>(
          <div key={l} className="bg-gray-50 rounded-xl p-2 text-center"><p className="text-[9px] text-gray-500">{l}</p><p className="font-black text-xs text-gray-900 mt-0.5">{v}</p></div>
        ))}
      </div>
    </div>
  )
}

// ── WhatsApp ───────────────────────────────────────────────────────────────────
function WhatsAppCard({ result, buildMsg }: { result: ConvertedRx; buildMsg: (r: ConvertedRx) => string }) {
  const comp = getComplejidad(result)
  return (
    <div className={`rounded-2xl p-4 ${comp.nivel==='rojo'?'bg-red-50 border-2 border-red-200':'bg-gray-900'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`font-bold text-sm ${comp.nivel==='rojo'?'text-red-900':'text-white'}`}>
            {comp.nivel==='rojo'?'Habla con un especialista':'¿Dudas con tu receta?'}
          </p>
          <p className={`text-xs mt-0.5 ${comp.nivel==='rojo'?'text-red-700':'text-gray-400'}`}>Respuesta en minutos</p>
        </div>
        <a href={`https://wa.me/18096942268?text=${buildMsg(result)}`} target="_blank" rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-[#002455] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap">
          WhatsApp →
        </a>
      </div>
    </div>
  )
}
