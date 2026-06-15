'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import {
  convertGlassesToContacts, fmtCyl, fmtAxis,
  SPH_GLASSES, CYL_GLASSES, AXIS_VALS, ADD_VALS,
  type GlassesRx, type ConvertedRx,
} from '@/lib/prescription'
import type { Product } from '@/types'
import { Eye, Camera, Upload, RotateCcw, Loader2, Sparkles, Info, AlertTriangle, ChevronRight, Mail, CheckCircle, ShoppingCart, ArrowRight } from 'lucide-react'
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
  return { nivel: 'verde' as const, titulo: '✅ Compatible — puedes comprar directamente', desc: 'Tu receta está en rango estándar. Pedido inmediato disponible.' }
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
  const [misma, setMisma] = useState(false)
  const [showFoto, setShowFoto] = useState(false)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrMsg, setOcrMsg] = useState<string | null>(null)
  const [result, setResult] = useState<ConvertedRx | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loadingP, setLoadingP] = useState(false)
  const [totalDisp, setTotalDisp] = useState(0)
  const [showLead, setShowLead] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadNombre, setLeadNombre] = useState('')
  const [pendingRx, setPendingRx] = useState<GlassesRx | null>(null)
  const [frecuencia, setFrecuencia] = useState<'diario' | 'quincenal' | 'mensual'>('diario')
  const [cartAdded, setCartAdded] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── OCR ─────────────────────────────────────────────────────────────────────
  const handleImage = useCallback(async (file: File) => {
    setOcrLoading(true); setOcrMsg(null)
    setImgPreview(URL.createObjectURL(file))
    trackEvento('upload_started')
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const img = new (window as any).Image()
        img.onload = () => {
          const MAX = 1024; let w = img.width, h = img.height
          if (w > MAX || h > MAX) { if (w > h) { h = Math.round(h * MAX / w); w = MAX } else { w = Math.round(w * MAX / h); h = MAX } }
          const c = document.createElement('canvas'); c.width = w; c.height = h
          c.getContext('2d')!.drawImage(img, 0, 0, w, h)
          res(c.toDataURL('image/jpeg', 0.88).split(',')[1])
        }
        img.onerror = rej; img.src = URL.createObjectURL(file)
      })
      const res = await fetch('/api/ocr-receta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64, mimeType: 'image/jpeg' }) })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setOcrMsg('⚠️ No se pudo leer automáticamente — ingresa los valores manualmente')
        trackEvento('ocr_fail')
        setOcrLoading(false); return
      }
      const r = json.receta
      const newOd: EyeInput = { sph: r.od_sph != null ? String(r.od_sph) : '', cyl: r.od_cyl != null ? String(r.od_cyl) : '', axis: r.od_axis != null ? String(r.od_axis) : '', add: r.add_power != null ? String(r.add_power) : '' }
      const newOi: EyeInput = { sph: r.oi_sph != null ? String(r.oi_sph) : '', cyl: r.oi_cyl != null ? String(r.oi_cyl) : '', axis: r.oi_axis != null ? String(r.oi_axis) : '', add: r.add_power != null ? String(r.add_power) : '' }
      setOd(newOd); setOi(newOi)
      setOcrMsg(r.confianza === 'alta' ? '✅ Receta leída — verifica los valores' : '⚠️ Verifica los valores detectados')
      trackEvento('ocr_ok', { tipo_receta: r.diagnostico })
      toast.success('Receta detectada con IA')
    } catch { setOcrMsg('⚠️ Error procesando la imagen'); trackEvento('ocr_fail') }
    finally { setOcrLoading(false) }
  }, [])

  // ── Motor de recomendación ────────────────────────────────────────────────
  const cargarProductos = async (conv: ConvertedRx) => {
    setLoadingP(true)
    try {
      const res = await fetch('/api/receta/recomendar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: conv.tipo, od_sph: conv.od.sph ?? 0, oi_sph: conv.oi.sph ?? 0, od_cyl: conv.od.cyl ?? 0 })
      })
      const json = await res.json()
      setProducts(json.productos ?? [])
      setTotalDisp(json.total ?? 0)
      if (json.nota) toast(json.nota, { duration: 4000, icon: '💡' })
    } catch { setProducts([]) }
    finally { setLoadingP(false) }
  }

  // ── Calcular ───────────────────────────────────────────────────────────────
  const calcular = async () => {
    if (!parseN(od.sph) && !parseN(oi.sph)) { toast.error('Ingresa al menos la Esfera (SPH)'); return }
    const rx: GlassesRx = {
      od: { sph: parseN(od.sph) ?? 0, cyl: parseN(od.cyl), axis: parseN(od.axis), add: parseN(od.add) },
      oi: { sph: parseN(oi.sph) ?? 0, cyl: parseN(oi.cyl), axis: parseN(oi.axis), add: parseN(oi.add) },
    }
    setPendingRx(rx)
    if (!leadEmail) { setShowLead(true); return }
    await ejecutarCalculo(rx)
  }

  const ejecutarCalculo = async (rx: GlassesRx) => {
    const conv = convertGlassesToContacts(rx); setResult(conv); setShowLead(false); setCartAdded(null)
    await cargarProductos(conv)
    trackEvento('calcular', { tipo_receta: conv.tipo, complejidad: getComplejidad(conv).nivel })
    setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const handleLeadSubmit = async () => {
    if (!pendingRx) return
    const conv = convertGlassesToContacts(pendingRx)
    try {
      createClient().from('calculator_leads').insert({
        nombre: leadNombre || null, email: leadEmail || null,
        od_sph: pendingRx.od.sph, od_cyl: pendingRx.od.cyl, od_axis: pendingRx.od.axis,
        oi_sph: pendingRx.oi.sph, oi_cyl: pendingRx.oi.cyl, oi_axis: pendingRx.oi.axis,
        tipo_receta: conv.tipo, complejidad: getComplejidad(conv).nivel, condiciones: conv.condiciones
      }).then(() => {})
      trackEvento('lead_captured', { tipo_receta: conv.tipo })
    } catch {}
    await ejecutarCalculo(pendingRx)
  }

  const skipLead = () => { if (pendingRx) ejecutarCalculo(pendingRx) }
  const resetear = () => { setOd(EMPTY); setOi(EMPTY); setMisma(false); setResult(null); setProducts([]); setImgPreview(null); setOcrMsg(null); setShowLead(false); setPendingRx(null); setCartAdded(null) }

  // ── Agregar al carrito DIRECTO (para esférico y color) ────────────────────
  const handleAddToCart = (product: any) => {
    if (!result) return
    const isSimple = result.tipo === 'esferico'
    if (!isSimple) {
      // Tórico, multifocal, etc. → ir al PDP con rx pre-llenada
      saveRxToSession()
      router.push(`/producto/${product.slug}`)
      return
    }
    // Esférico: agregar directo al carrito
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
    toast.success(`¡${product.nombre} agregado con tu receta! 🛒`, { duration: 3000 })
  }

  const saveRxToSession = () => {
    if (!result) return
    try { sessionStorage.setItem('cg_rx_pending', JSON.stringify({ od: result.od, oi: result.oi, tipo: result.tipo, timestamp: Date.now() })) } catch {}
  }

  const buildWA = (r: ConvertedRx) => {
    const fmtEye = (l: string, e: any) =>
      `${l}: SPH ${fmtV(e.sph)}${e.cyl ? ` CYL ${fmtCyl(e.cyl)}` : ''}${e.axis ? ` EJE ${fmtAxis(e.axis)}` : ''}${e.add ? ` ADD +${e.add.toFixed(2)}` : ''}`
    return encodeURIComponent(`Hola ContactGo, necesito ayuda con mi receta:\n\n${fmtEye('OD', r.od)}\n${fmtEye('OI', r.oi)}\n\nTipo: ${r.tipo === 'multifocal_torico' ? 'MULTIFOCAL TÓRICO' : r.tipo.toUpperCase()}`)
  }

  const tipoLabel = (t: string) => t === 'torico' ? '🎯 Tóricos' : t === 'multifocal_torico' ? '🎯🔭 Multifocal Tórico' : t === 'multifocal' ? '🔭 Multifocales' : t === 'color' ? '🌈 Color' : '👁️ Esféricos'
  const tipoSlug  = (t: string) => t === 'torico' ? 'toricos' : t.startsWith('multifocal') ? 'multifocales' : t === 'color' ? 'catalogo?tipo=color' : 'esfericos'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">

        {/* Hero calculadora — identidad visual propia */}
        <div className="relative overflow-hidden text-white px-4 py-8 text-center"
          style={{ background: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 100%)' }}>
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #16a34a 0%, transparent 40%)'
          }}/>
          {/* Badge médico */}
          <div className="relative inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[11px] font-bold px-3 py-1.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
            Herramienta de adaptación óptica · Powered by Gemini AI
          </div>
          <h1 className="relative font-display font-black text-2xl md:text-3xl mb-2 tracking-tight">
            Convierte tu receta<br/>
            <span style={{ color: '#4ade80' }}>en tus lentes perfectos.</span>
          </h1>
          <p className="relative text-white/60 text-sm mb-4">Sube una foto o ingresa los valores · Resultado en 60 segundos</p>
          <div className="relative flex items-center justify-center flex-wrap gap-3">
            {[
              { icon: '✅', text: 'Gratis' },
              { icon: '⚡', text: '60 segundos' },
              { icon: '🤖', text: 'IA Gemini' },
              { icon: '📦', text: 'Stock real' },
              { icon: '🔒', text: 'Sin registro' },
            ].map(t => (
              <span key={t.text} className="text-[11px] text-white/50 font-medium flex items-center gap-1">
                <span>{t.icon}</span>{t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Lead modal */}
        {showLead && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><Mail className="w-6 h-6 text-primary-600" /></div>
                <h3 className="font-black text-gray-900 text-lg">¡Casi listo!</h3>
                <p className="text-xs text-gray-500 mt-1">Guarda tu receta y recibe descuentos personalizados</p>
              </div>
              <div className="space-y-3 mb-4">
                <input value={leadNombre} onChange={e => setLeadNombre(e.target.value)} placeholder="Nombre (opcional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400" />
                <input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} type="email" placeholder="Tu correo electrónico"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400" />
              </div>
              <button onClick={handleLeadSubmit} className="w-full btn-primary py-3 font-black rounded-xl text-sm mb-2">
                Ver mis productos recomendados →
              </button>
              <button onClick={skipLead} className="w-full text-xs text-gray-400 py-2 hover:text-gray-600">
                Continuar sin guardar
              </button>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">

          {/* Toggle modo */}
          <div className="flex gap-2">
            {[{id:'manual',ico:<Eye className="w-4 h-4"/>,lbl:'Manual'},{id:'imagen',ico:<Camera className="w-4 h-4"/>,lbl:'Foto de receta'}].map(m => (
              <button key={m.id} onClick={() => setShowFoto(m.id==='imagen')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${(m.id==='imagen') === showFoto ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {m.ico}{m.lbl}
              </button>
            ))}
          </div>

          {/* OCR */}
          {showFoto && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) handleImage(f) }} />
              {!imgPreview
                ? <button onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-all group">
                    <Upload className="w-8 h-8 text-gray-200 group-hover:text-primary-400 transition-colors" />
                    <p className="text-sm font-semibold text-gray-500">Toca para subir tu receta</p>
                    <p className="text-xs text-gray-400">JPG · PNG · HEIC · PDF · Cualquier idioma</p>
                  </button>
                : <div className="relative">
                    <img src={imgPreview} alt="Receta" className="w-full rounded-xl max-h-44 object-contain bg-gray-50"/>
                    <button onClick={() => { setImgPreview(null); setOcrMsg(null); if(fileRef.current) fileRef.current.value='' }}
                      className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold shadow-sm">Cambiar</button>
                  </div>
              }
              {ocrLoading && <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5"><Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin"/><p className="text-xs text-blue-700 font-medium">Leyendo con IA Gemini...</p></div>}
              {ocrMsg && !ocrLoading && <p className={`text-xs px-3 py-2.5 rounded-xl font-medium ${ocrMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{ocrMsg}</p>}
            </div>
          )}

          {/* Info vertex */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5"/>
            <p className="text-xs text-blue-700"><strong>¿Receta de gafas?</strong> La calculadora aplica la corrección de vértice automáticamente para {'>'} ±4.00D.</p>
          </div>

          {/* Formulario OD | OI */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={misma} onChange={e => { setMisma(e.target.checked); if(e.target.checked) setOi({...od}) }} className="w-3.5 h-3.5 rounded text-primary-600"/>
                <span className="text-xs font-medium text-gray-600">Ambos ojos tienen la misma receta</span>
              </label>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <EyePanel label="OD · Ojo Derecho" eye={od} onChange={e => { setOd(e); if(misma) setOi(e) }} color="blue"/>
              <EyePanel label="OI · Ojo Izquierdo" eye={oi} onChange={setOi} color="green" disabled={misma}/>
            </div>
          </div>

          {/* CTAs calcular */}
          <div className="flex gap-2">
            <button onClick={resetear} className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
              <RotateCcw className="w-4 h-4"/>
            </button>
            <button onClick={calcular} className="flex-1 btn-primary py-3 font-black rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm">
              <Sparkles className="w-4 h-4"/> Calcular y ver productos →
            </button>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-gray-300 shrink-0 mt-0.5"/>
            <p className="text-[10px] text-gray-400">Orientativa. No reemplaza prescripción profesional. <Link href="/politica-receta" className="underline">Política de Receta</Link></p>
          </div>

          {/* ── RESULTADO ──────────────────────────────────────────────────── */}
          {result && (
            <div id="resultado" className="space-y-5 pt-2">

              {/* Diagnóstico + complejidad */}
              <DiagnosticoCard result={result}/>

              {/* PRODUCTOS — foco principal CRO */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-black text-gray-900 text-base">{tipoLabel(result.tipo)}</p>
                    {totalDisp > 3 && <p className="text-xs text-gray-500">{totalDisp} disponibles · mejores 3</p>}
                  </div>
                  {result.tipo === 'esferico' && (
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">Agregar directo al carrito</span>
                  )}
                </div>

                {loadingP ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin"/>
                    <p className="text-sm">Buscando productos compatibles...</p>
                  </div>
                ) : products.length === 0 ? (
                  <FallbackProductos result={result} buildWA={buildWA}/>
                ) : (
                  <>
                    {/* Mobile: cards apiladas — Desktop: 3 columnas */}
                    <div className="flex flex-col gap-3 md:hidden">
                      {/* Featured primero en mobile */}
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
                  Ver todos los {tipoLabel(result.tipo).split(' ').slice(1).join(' ')} disponibles <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
              </div>

              {/* Ahorro vs óptica */}
              {products.length > 0 && <AhorroCard precio={Number(products[Math.min(1,products.length-1)]?.precio)}/>}

              {/* Consumo */}
              {products.length > 0 && <ConsumoCard precio={Number(products[Math.min(1,products.length-1)]?.precio)} frecuencia={frecuencia} onChange={setFrecuencia}/>}

              {/* WhatsApp */}
              <WhatsAppCard result={result} buildMsg={buildWA}/>

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
  return (
    <div className={`p-3 space-y-2.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${color==='blue'?'bg-blue-500':'bg-green-500'}`}/><p className="text-[11px] font-bold text-gray-700">{label}</p></div>
      {([
        {k:'sph' as const,lbl:'SPH *',opts:SPH_GLASSES,fmt:(v:number)=>v===0?'Plano':v>0?`+${v.toFixed(2)}`:v.toFixed(2),ph:'— Sel. —'},
        {k:'cyl' as const,lbl:'CYL',opts:CYL_GLASSES.filter(v=>v!==0),fmt:(v:number)=>v.toFixed(2),ph:'— Sin —'},
      ]).map(({k,lbl,opts,fmt,ph})=>(
        <div key={k}><label className="text-[10px] font-semibold text-gray-400 block mb-1">{lbl}</label>
          <select value={eye[k]} onChange={e=>s(k)(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400">
            <option value="">{ph}</option>
            {opts.map(v=><option key={v} value={String(v)}>{fmt(v)}</option>)}
          </select>
        </div>
      ))}
      <div><label className="text-[10px] font-semibold text-gray-400 block mb-1">EJE {hasCyl&&<span className="text-red-400">*</span>}</label>
        <select value={eye.axis} onChange={e=>s('axis')(e.target.value)} disabled={!hasCyl}
          className={`w-full border rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400 ${hasCyl?'border-gray-200':'border-gray-100 text-gray-300'}`}>
          <option value="">— —</option>
          {AXIS_VALS.map(v=><option key={v} value={String(v)}>{String(v).padStart(3,'0')}°</option>)}
        </select>
      </div>
      <div><label className="text-[10px] font-semibold text-gray-400 block mb-1">ADD</label>
        <select value={eye.add} onChange={e=>s('add')(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400">
          <option value="">— Sin —</option>
          {ADD_VALS.map(v=><option key={v} value={String(v)}>+{v.toFixed(2)}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── Diagnóstico ───────────────────────────────────────────────────────────────
function DiagnosticoCard({ result: r }: { result: ConvertedRx }) {
  const comp = getComplejidad(r)
  const compC = {verde:{bg:'bg-green-50',border:'border-green-200',dot:'bg-green-500',text:'text-green-700'},amarillo:{bg:'bg-amber-50',border:'border-amber-200',dot:'bg-amber-500',text:'text-amber-700'},rojo:{bg:'bg-red-50',border:'border-red-200',dot:'bg-red-500',text:'text-red-700'}}[comp.nivel]
  const tipC = (r.tipo==='torico'||r.tipo==='multifocal_torico') ? {icon:r.tipo==='multifocal_torico'?'🎯🔭':'🎯',border:'border-purple-200',bg:'bg-purple-50'} : r.tipo==='multifocal'?{icon:'🔭',border:'border-amber-200',bg:'bg-amber-50'} : {icon:'👁️',border:'border-blue-200',bg:'bg-blue-50'}
  const tipoNombre = r.tipo==='torico'?'Lentes Tóricos':r.tipo==='multifocal_torico'?'Multifocal Tórico (Presbicia + Astigmatismo)':r.tipo==='multifocal'?'Lentes Multifocales':'Lentes Esféricos'
  return (
    <div className={`rounded-2xl border-2 p-4 ${tipC.bg} ${tipC.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{tipC.icon}</span>
        <div>
          <p className="font-black text-gray-900 text-base">{tipoNombre}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">{r.condiciones.map(c=><span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 text-gray-600">{c}</span>)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {([['OD',r.od,'text-blue-600'],['OI',r.oi,'text-green-600']] as const).map(([lbl,eye,cls]:any)=>(
          <div key={lbl} className="bg-white/70 rounded-xl p-2.5 space-y-1 text-xs">
            <p className={`font-black text-[11px] ${cls}`}>{lbl}</p>
            <div className="flex justify-between"><span className="text-gray-500">SPH</span><span className="font-mono font-bold">{fmtV(eye.sph)}</span></div>
            {eye.cyl!=null&&eye.cyl!==0&&<><div className="flex justify-between"><span className="text-gray-500">CYL</span><span className="font-mono font-bold">{fmtCyl(eye.cyl)}</span></div>{eye.axis!=null&&<div className="flex justify-between"><span className="text-gray-500">EJE</span><span className="font-mono font-bold">{fmtAxis(eye.axis)}</span></div>}</>}
            {eye.add!=null&&eye.add!==0&&<div className="flex justify-between"><span className="text-gray-500">ADD</span><span className="font-mono font-bold">+{eye.add.toFixed(2)}</span></div>}
          </div>
        ))}
      </div>
      {r.needsVertex&&<p className="text-[10px] text-amber-700 bg-amber-100 rounded-lg px-2.5 py-1.5 mb-3">⚡ Corrección vertex aplicada</p>}
      <div className={`flex items-start gap-2 rounded-xl px-3 py-2 border ${compC.bg} ${compC.border}`}>
        <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${compC.dot}`}/>
        <div><p className={`text-xs font-black ${compC.text}`}>{comp.titulo}</p><p className={`text-[10px] mt-0.5 ${compC.text} opacity-80`}>{comp.desc}</p></div>
      </div>
    </div>
  )
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product: p, result, tier, onAction, cartAdded }: { product: any; result: ConvertedRx; tier: 'eco'|'rec'|'prem'; onAction: (p: any) => void; cartAdded: string|null }) {
  const precio = Number(p.precio)
  const precioAnt = Number(p.precio_anterior ?? 0)
  const off = precioAnt > precio ? Math.round((1 - precio/precioAnt)*100) : 0
  const featured = tier === 'rec'
  const isSimple = result.tipo === 'esferico'
  const wasAdded = cartAdded === p.id
  const tierLabel = {eco:'ECONÓMICO',rec:'⭐ MEJOR OPCIÓN',prem:'PREMIUM'}[tier]
  const tierColor = {eco:'bg-gray-100 text-gray-600',rec:'bg-primary-600 text-white',prem:'bg-gray-800 text-white'}[tier]
  return (
    <div className={`flex flex-col bg-white rounded-2xl border overflow-hidden transition-all ${featured?'border-primary-400 shadow-md ring-2 ring-primary-100':'border-gray-100 shadow-sm'}`}>
      <div className={`text-[10px] font-black text-center py-1.5 ${tierColor}`}>{tierLabel}</div>
      <div className="p-3 flex-1 flex flex-col">
        {p.imagen_url&&<img src={p.imagen_url} alt={p.nombre} className="w-full h-14 object-contain mb-2 rounded-lg bg-gray-50"/>}
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{p.marca}</p>
        <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 flex-1 line-clamp-2">{p.nombre}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className={`font-black text-sm ${featured?'text-primary-600':'text-gray-900'}`}>RD${precio.toLocaleString()}</p>
          {off > 0 && <p className="text-[9px] text-green-600 font-bold">-{off}% off</p>}
          <p className="text-[9px] text-gray-400">≈ RD${Math.round(precio/12).toLocaleString()}/mes</p>
        </div>
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        {/* CTA principal */}
        <button onClick={() => onAction(p)}
          className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${wasAdded ? 'bg-green-500 text-white' : featured ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
          {wasAdded ? (<><CheckCircle className="w-3.5 h-3.5"/> ¡En tu carrito!</>) : isSimple ? (<><ShoppingCart className="w-3.5 h-3.5"/> Agregar al carrito</>) : (<><ArrowRight className="w-3.5 h-3.5"/> Ver con mi receta</>)}
        </button>
        {/* Link al PDP */}
        <Link href={`/producto/${p.slug}`}
          className="w-full py-1.5 rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
          Ver detalles →
        </Link>
      </div>
    </div>
  )
}

// ── Fallback sin productos ─────────────────────────────────────────────────────
function FallbackProductos({ result, buildWA }: { result: ConvertedRx; buildWA: (r: ConvertedRx) => string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
      <p className="text-2xl mb-2">💬</p>
      <p className="font-bold text-gray-900 text-sm mb-1">Consultamos disponibilidad para ti</p>
      <p className="text-xs text-gray-500 mb-4">Un especialista te confirmará las opciones compatibles en minutos.</p>
      <a href={`https://wa.me/18294728328?text=${buildWA(result)}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md">
        💬 Consultar disponibilidad →
      </a>
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
      <p className="font-bold text-gray-900 text-sm mb-3">💰 Tu ahorro comprando en ContactGo</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{l:'Precio óptica',v:`RD$${optica.toLocaleString()}`,c:'text-gray-400 line-through',s:`estimado +${OPTICA_MULT*100-100|0}% aprox`},{l:'ContactGo',v:`RD$${precio.toLocaleString()}`,c:'text-primary-600',s:'precio oficial'},{l:'Ahorras',v:`RD$${ahorro.toLocaleString()}`,c:'text-green-600 font-black',s:`RD$${ahorroAnual.toLocaleString()}/año`}].map(({l,v,c,s})=>(
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
      <p className="font-bold text-gray-900 text-sm mb-3">📦 Calculadora de consumo</p>
      <div className="flex gap-1.5 mb-3">
        {(['diario','quincenal','mensual'] as const).map(f=>(
          <button key={f} onClick={()=>onChange(f)}
            className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${frecuencia===f?'bg-primary-600 text-white shadow-sm':'bg-gray-100 text-gray-500'}`}>
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
            {comp.nivel==='rojo'?'⚠️ Habla con un especialista':'¿Dudas con tu receta?'}
          </p>
          <p className={`text-xs mt-0.5 ${comp.nivel==='rojo'?'text-red-700':'text-gray-400'}`}>Respuesta en minutos</p>
        </div>
        <a href={`https://wa.me/18294728328?text=${buildMsg(result)}`} target="_blank" rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap">
          💬 WhatsApp →
        </a>
      </div>
    </div>
  )
}
