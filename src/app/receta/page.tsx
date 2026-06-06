'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase'
import {
  convertGlassesToContacts, fmtCyl, fmtAxis,
  SPH_GLASSES, CYL_GLASSES, AXIS_VALS, ADD_VALS,
  type GlassesRx, type ConvertedRx,
} from '@/lib/prescription'
import { Eye, Camera, Upload, RotateCcw, Loader2, Sparkles, Info, AlertTriangle, ChevronRight, Mail, CheckCircle, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface EyeInput { sph: string; cyl: string; axis: string; add: string }
const EMPTY: EyeInput = { sph: '', cyl: '', axis: '', add: '' }
const parseN = (v: string) => { if (!v) return null; const n = parseFloat(v); return isNaN(n) ? null : n }
const fmtV = (v: number | null) => v == null ? '—' : v === 0 ? 'Plano' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)
const sessionId = typeof window !== 'undefined' ? (sessionStorage.getItem('cg_calc_sid') || (() => { const id = Math.random().toString(36).slice(2); sessionStorage.setItem('cg_calc_sid', id); return id })()) : ''

// ── Clasificador de complejidad ───────────────────────────────────────────────
function getComplejidad(rx: ConvertedRx): { nivel: 'verde' | 'amarillo' | 'rojo'; titulo: string; desc: string } {
  const sphMax = Math.max(Math.abs(rx.od.sph ?? 0), Math.abs(rx.oi.sph ?? 0))
  const cylMax = Math.max(Math.abs(rx.od.cyl ?? 0), Math.abs(rx.oi.cyl ?? 0))
  const addMax = Math.max(Math.abs(rx.od.add ?? 0), Math.abs(rx.oi.add ?? 0))

  if (sphMax > 10 || cylMax > 4.75 || (addMax > 0 && cylMax > 2.75)) {
    return { nivel: 'rojo', titulo: 'Receta compleja — requiere asesor', desc: 'Tu graduación es alta. Te recomendamos hablar con un especialista para garantizar la adaptación correcta.' }
  }
  if (sphMax > 6 || cylMax > 2.75 || addMax > 2.5) {
    return { nivel: 'amarillo', titulo: 'Receta moderada — revisión recomendada', desc: 'Tu receta tiene una graduación media-alta. Podemos ayudarte, pero recomendamos confirmar con un optometrista.' }
  }
  return { nivel: 'verde', titulo: 'Receta compatible — puedes comprar online', desc: 'Tu receta está dentro del rango estándar. Puedes ordenar directamente sin necesidad de consulta adicional.' }
}

// ── Precio óptica estimado ────────────────────────────────────────────────────
const OPTICA_MULT = 1.75 // Las ópticas cobran en promedio 75% más

async function trackEvento(evento: string, metadata?: Record<string, any>) {
  try {
    await createClient().from('calculator_sessions').insert({ session_id: sessionId, evento, ...metadata })
  } catch { /* silencioso */ }
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function RecetaPage() {
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
  // Lead capture
  const [showLead, setShowLead] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadNombre, setLeadNombre] = useState('')
  const [leadSkipped, setLeadSkipped] = useState(false)
  const [pendingRx, setPendingRx] = useState<GlassesRx | null>(null)
  // Consumo
  const [frecuencia, setFrecuencia] = useState<'diario' | 'quincenal' | 'mensual'>('diario')
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
        setOcrMsg('⚠️ No se pudo leer — ingresa los valores manualmente')
        trackEvento('ocr_fail')
        setOcrLoading(false); return
      }
      const r = json.receta
      if (r.od_sph != null) setOd(p => ({ ...p, sph: String(r.od_sph) }))
      if (r.od_cyl != null) setOd(p => ({ ...p, cyl: String(r.od_cyl) }))
      if (r.od_axis != null) setOd(p => ({ ...p, axis: String(r.od_axis) }))
      if (r.add_power != null) { setOd(p => ({ ...p, add: String(r.add_power) })); setOi(p => ({ ...p, add: String(r.add_power) })) }
      if (r.oi_sph != null) setOi(p => ({ ...p, sph: String(r.oi_sph) }))
      if (r.oi_cyl != null) setOi(p => ({ ...p, cyl: String(r.oi_cyl) }))
      if (r.oi_axis != null) setOi(p => ({ ...p, axis: String(r.oi_axis) }))
      const conf = r.confianza === 'alta' ? '✅ Receta leída — verifica los valores' : '⚠️ Verifica los valores detectados'
      setOcrMsg(conf)
      trackEvento('ocr_ok', { tipo_receta: r.diagnostico })
      toast.success('Receta detectada')
    } catch { setOcrMsg('⚠️ Error procesando imagen'); trackEvento('ocr_fail') }
    finally { setOcrLoading(false) }
  }, [])

  // ── Calcular (con lead capture) ───────────────────────────────────────────
  const calcular = async () => {
    if (!parseN(od.sph) && !parseN(oi.sph)) { toast.error('Ingresa al menos la Esfera (SPH)'); return }
    const rx: GlassesRx = {
      od: { sph: parseN(od.sph) ?? 0, cyl: parseN(od.cyl), axis: parseN(od.axis), add: parseN(od.add) },
      oi: { sph: parseN(oi.sph) ?? 0, cyl: parseN(oi.cyl), axis: parseN(oi.axis), add: parseN(oi.add) },
    }
    setPendingRx(rx)
    if (!leadSkipped && !leadEmail) { setShowLead(true); return }
    await ejecutarCalculo(rx)
  }

  const ejecutarCalculo = async (rx: GlassesRx) => {
    const conv = convertGlassesToContacts(rx)
    setResult(conv); setLoadingP(true); setShowLead(false)
    trackEvento('calcular', { tipo_receta: conv.tipo, complejidad: getComplejidad(conv).nivel })
    try {
      const sb = createClient()
      const { data } = await sb.from('products')
        .select('id,nombre,marca,tipo,precio,precio_original,imagen_url,slug,sph_disponibles')
        .eq('activo', true).eq('tipo', conv.tipo).order('precio', { ascending: true })
      const odS = conv.od.sph ?? 0, oiS = conv.oi.sph ?? 0
      const pool = (data ?? []).filter((p: any) => {
        if (!p.sph_disponibles?.length) return true
        const sp = p.sph_disponibles.map(Number)
        return odS >= Math.min(...sp) && odS <= Math.max(...sp) && oiS >= Math.min(...sp) && oiS <= Math.max(...sp)
      })
      const src = pool.length > 0 ? pool : (data ?? [])
      let tres: any[] = []
      if (src.length === 0) tres = []
      else if (src.length <= 3) tres = src
      else { const s = [...src].sort((a, b) => a.precio - b.precio); tres = [s[0], s[Math.floor(s.length / 2)], s[s.length - 1]] }
      setProducts(tres)
    } catch { setProducts([]) }
    finally { setLoadingP(false) }
    setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const handleLeadSubmit = async () => {
    if (pendingRx) {
      const conv = convertGlassesToContacts(pendingRx)
      const comp = getComplejidad(conv)
      try {
        await createClient().from('calculator_leads').insert({
          nombre: leadNombre || null, email: leadEmail || null,
          od_sph: pendingRx.od.sph, od_cyl: pendingRx.od.cyl, od_axis: pendingRx.od.axis,
          oi_sph: pendingRx.oi.sph, oi_cyl: pendingRx.oi.cyl, oi_axis: pendingRx.oi.axis,
          add_power: pendingRx.od.add ?? pendingRx.oi.add,
          tipo_receta: conv.tipo, complejidad: comp.nivel, condiciones: conv.condiciones,
          producto_recomendado: null,
        })
        trackEvento('lead_captured', { tipo_receta: conv.tipo })
      } catch { /* silencioso */ }
      await ejecutarCalculo(pendingRx)
    }
  }

  const skipLead = () => { setLeadSkipped(true); if (pendingRx) ejecutarCalculo(pendingRx) }

  const resetear = () => {
    setOd(EMPTY); setOi(EMPTY); setMisma(false); setResult(null)
    setProducts([]); setImgPreview(null); setOcrMsg(null); setShowLead(false)
    setPendingRx(null); setLeadSkipped(false)
  }

  // ── Cálculo consumo ────────────────────────────────────────────────────────
  const calcConsumo = (precio: number) => {
    const cajas = frecuencia === 'diario' ? 24 : frecuencia === 'quincenal' ? 8 : 4
    const anual = precio * cajas
    return { cajas, anual, mensual: Math.round(anual / 12), diario: Math.round(anual / 365) }
  }

  // ── WhatsApp con receta ────────────────────────────────────────────────────
  const buildWAMessage = (r: ConvertedRx) => {
    const lines = ['Hola ContactGo, necesito ayuda con mi receta para lentes de contacto:', '']
    const fmtEye = (label: string, e: any) => {
      const parts = [`${label}: SPH ${fmtV(e.sph)}`]
      if (e.cyl) parts.push(`CYL ${fmtCyl(e.cyl)}`)
      if (e.axis) parts.push(`EJE ${fmtAxis(e.axis)}`)
      if (e.add) parts.push(`ADD +${e.add.toFixed(2)}`)
      return parts.join(' / ')
    }
    lines.push(fmtEye('OD', r.od)); lines.push(fmtEye('OI', r.oi))
    lines.push(''); lines.push(`Tipo de lente recomendado: ${r.tipo.toUpperCase()}`)
    return encodeURIComponent(lines.join('\n'))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">

        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-5 text-center">
          <h1 className="font-display font-black text-xl flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" /> Calculadora de Lentes de Contacto
          </h1>
          <p className="text-primary-100 text-xs mt-1">Convierte tu receta · Gratis · Sin registro · Resultado inmediato</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            {['✅ Gratis', '⚡ 60 segundos', '🎯 IA especializada'].map(t => (
              <span key={t} className="text-[10px] text-primary-200 font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Modal lead capture */}
        {showLead && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-black text-gray-900 text-lg">¡Ya casi listo!</h3>
                <p className="text-sm text-gray-500 mt-1">Guarda tu receta para compras futuras y recibe ofertas personalizadas</p>
              </div>
              <div className="space-y-3 mb-4">
                <input value={leadNombre} onChange={e => setLeadNombre(e.target.value)} placeholder="Tu nombre (opcional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400" />
                <input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} type="email" placeholder="Tu correo electrónico"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400" />
              </div>
              <button onClick={handleLeadSubmit} className="w-full btn-primary py-3 font-black rounded-xl text-sm mb-2">
                Ver mis resultados →
              </button>
              <button onClick={skipLead} className="w-full text-xs text-gray-400 py-2 hover:text-gray-600 transition-colors">
                Continuar sin guardar
              </button>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">

          {/* Toggle modo */}
          <div className="flex gap-2">
            <button onClick={() => setShowFoto(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${!showFoto ? 'bg-white border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>
              <Eye className="w-4 h-4" /> Ingreso manual
            </button>
            <button onClick={() => setShowFoto(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${showFoto ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500'}`}>
              <Camera className="w-4 h-4" /> Foto de receta
            </button>
          </div>

          {/* OCR upload */}
          {showFoto && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f) }} />
              {!imgPreview
                ? <button onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-all group">
                    <Upload className="w-8 h-8 text-gray-200 group-hover:text-primary-400 transition-colors" />
                    <p className="text-sm font-semibold text-gray-500">Toca para subir tu receta</p>
                    <p className="text-xs text-gray-400">JPG · PNG · HEIC · PDF · Cualquier idioma</p>
                  </button>
                : <div className="relative">
                    <img src={imgPreview} alt="Receta" className="w-full rounded-xl max-h-44 object-contain bg-gray-50" />
                    <button onClick={() => { setImgPreview(null); setOcrMsg(null); if (fileRef.current) fileRef.current.value = '' }}
                      className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold shadow-sm">Cambiar</button>
                  </div>
              }
              {ocrLoading && <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5"><Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" /><p className="text-xs text-blue-700 font-medium">Leyendo receta con IA...</p></div>}
              {ocrMsg && !ocrLoading && <p className={`text-xs px-3 py-2 rounded-xl font-medium ${ocrMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{ocrMsg}</p>}
            </div>
          )}

          {/* Aviso vertex */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>¿Receta de gafas?</strong> Aplica conversión de vértice automática para graduaciones {'>'} ±4.00D. Si ya tienes receta de lentes, ingresa esos valores directamente.
            </p>
          </div>

          {/* ── FORMULARIO OD | OI ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={misma} onChange={e => { setMisma(e.target.checked); if (e.target.checked) setOi({ ...od }) }}
                  className="w-3.5 h-3.5 rounded text-primary-600" />
                <span className="text-xs font-medium text-gray-600">Ambos ojos tienen la misma receta</span>
              </label>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <EyePanel label="OD · Ojo Derecho" eye={od} onChange={e => { setOd(e); if (misma) setOi(e) }} color="blue" />
              <EyePanel label="OI · Ojo Izquierdo" eye={oi} onChange={setOi} color="green" disabled={misma} />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2">
            <button onClick={resetear} className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={calcular} className="flex-1 btn-primary py-3 font-black rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm">
              <Sparkles className="w-4 h-4" /> Calcular mis lentes de contacto →
            </button>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-400">Herramienta orientativa. No reemplaza la prescripción profesional. <Link href="/politica-receta" className="underline">Política de Receta</Link></p>
          </div>

          {/* ── RESULTADO ──────────────────────────────────────────────────── */}
          {result && (
            <div id="resultado" className="space-y-4 pt-2">

              {/* Diagnóstico + complejidad */}
              <DiagnosticoCard result={result} />

              {/* Ahorro vs óptica */}
              {products.length > 0 && <AhorroCard precio={products[Math.floor(products.length / 2)]?.precio ?? products[0]?.precio} />}

              {/* Calculadora consumo */}
              {products.length > 0 && (
                <ConsumoCard
                  precio={products[Math.floor(products.length / 2)]?.precio ?? products[0]?.precio}
                  frecuencia={frecuencia}
                  onChange={setFrecuencia}
                />
              )}

              {/* Productos recomendados */}
              <div>
                <p className="font-bold text-gray-900 text-sm mb-3">
                  {result.tipo === 'torico' ? '🎯 Lentes tóricos compatibles' : result.tipo === 'multifocal' ? '🔭 Lentes multifocales' : '👁️ Lentes esféricos compatibles'}
                </p>
                {loadingP
                  ? <div className="flex items-center justify-center py-10 gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Buscando...</span></div>
                  : products.length === 0
                  ? <NoProductos />
                  : <div className="grid grid-cols-3 gap-2.5">
                      {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} result={result} featured={products.length === 3 ? i === 1 : i === 0} />
                      ))}
                    </div>
                }
                <Link href={`/${result.tipo === 'esferico' ? 'esfericos' : result.tipo === 'torico' ? 'toricos' : 'multifocales'}`}
                  className="mt-3 flex items-center justify-center gap-1 text-primary-600 text-xs font-semibold hover:underline py-2">
                  Ver todos los lentes disponibles <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* WhatsApp CTA */}
              <WhatsAppCard result={result} buildMsg={buildWAMessage} onTrack={() => trackEvento('whatsapp_click', { tipo_receta: result.tipo })} />

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Panel ojo ─────────────────────────────────────────────────────────────────
function EyePanel({ label, eye, onChange, color, disabled }: { label: string; eye: EyeInput; onChange: (e: EyeInput) => void; color: 'blue' | 'green'; disabled?: boolean }) {
  const s = (k: keyof EyeInput) => (v: string) => onChange({ ...eye, [k]: v })
  const dot = color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
  const hasCyl = !!eye.cyl && parseFloat(eye.cyl) !== 0

  return (
    <div className={`p-3 space-y-2.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${dot}`} /><p className="text-[11px] font-bold text-gray-700">{label}</p></div>
      <div>
        <label className="text-[10px] font-semibold text-gray-400 block mb-1">SPH *</label>
        <select value={eye.sph} onChange={e => s('sph')(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400">
          <option value="">— Sel. —</option>
          {SPH_GLASSES.map(v => <option key={v} value={String(v)}>{v === 0 ? 'Plano' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-gray-400 block mb-1">CYL</label>
        <select value={eye.cyl} onChange={e => s('cyl')(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400">
          <option value="">— Sin —</option>
          {CYL_GLASSES.filter(v => v !== 0).map(v => <option key={v} value={String(v)}>{v.toFixed(2)}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-gray-400 block mb-1">EJE {hasCyl && <span className="text-red-400">*</span>}</label>
        <select value={eye.axis} onChange={e => s('axis')(e.target.value)} disabled={!hasCyl}
          className={`w-full border rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400 ${hasCyl ? 'border-gray-200' : 'border-gray-100 text-gray-300'}`}>
          <option value="">— —</option>
          {AXIS_VALS.map(v => <option key={v} value={String(v)}>{String(v).padStart(3, '0')}°</option>)}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-gray-400 block mb-1">ADD</label>
        <select value={eye.add} onChange={e => s('add')(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none focus:border-primary-400">
          <option value="">— Sin —</option>
          {ADD_VALS.map(v => <option key={v} value={String(v)}>+{v.toFixed(2)}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── Diagnóstico + complejidad ──────────────────────────────────────────────────
function DiagnosticoCard({ result: r }: { result: ConvertedRx }) {
  const comp = getComplejidad(r)
  const compColor = comp.nivel === 'verde' ? { bg: 'bg-green-50', border: 'border-green-300', dot: 'bg-green-500', text: 'text-green-700' }
    : comp.nivel === 'amarillo' ? { bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500', text: 'text-amber-700' }
    : { bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500', text: 'text-red-700' }
  const tipoCfg = r.tipo === 'torico' ? { icon: '🎯', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' }
    : r.tipo === 'multifocal' ? { icon: '🔭', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { icon: '👁️', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }

  return (
    <div className={`rounded-2xl border-2 p-4 ${tipoCfg.bg} ${tipoCfg.border}`}>
      {/* Tipo y condiciones */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{tipoCfg.icon}</span>
        <div>
          <p className="font-black text-gray-900 text-base">
            {r.tipo === 'torico' ? 'Lentes TÓRICOS' : r.tipo === 'multifocal' ? 'Lentes MULTIFOCALES' : 'Lentes ESFÉRICOS'}
          </p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {r.condiciones.map(c => <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 ${tipoCfg.color}`}>{c}</span>)}
          </div>
        </div>
      </div>

      {/* OD | OI */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {([['OD', r.od, 'text-blue-600'], ['OI', r.oi, 'text-green-600']] as const).map(([lbl, eye, cls]: any) => (
          <div key={lbl} className="bg-white/70 rounded-xl p-2.5 space-y-1 text-xs">
            <p className={`font-black text-[11px] ${cls}`}>{lbl}</p>
            <div className="flex justify-between"><span className="text-gray-500">SPH</span><span className="font-mono font-bold">{fmtV(eye.sph)}</span></div>
            {eye.cyl != null && eye.cyl !== 0 && <>
              <div className="flex justify-between"><span className="text-gray-500">CYL</span><span className="font-mono font-bold">{fmtCyl(eye.cyl)}</span></div>
              {eye.axis != null && <div className="flex justify-between"><span className="text-gray-500">EJE</span><span className="font-mono font-bold">{fmtAxis(eye.axis)}</span></div>}
            </>}
            {eye.add != null && eye.add !== 0 && <div className="flex justify-between"><span className="text-gray-500">ADD</span><span className="font-mono font-bold">+{eye.add.toFixed(2)}</span></div>}
          </div>
        ))}
      </div>

      {r.needsVertex && <p className="text-[10px] text-amber-700 bg-amber-100 rounded-lg px-2.5 py-1.5 mb-3">⚡ Corrección vertex aplicada (graduación &gt; ±4D)</p>}

      {/* Badge complejidad */}
      <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border ${compColor.bg} ${compColor.border}`}>
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${compColor.dot}`} />
        <div>
          <p className={`text-xs font-black ${compColor.text}`}>{comp.titulo}</p>
          <p className={`text-[10px] mt-0.5 ${compColor.text} opacity-80`}>{comp.desc}</p>
        </div>
      </div>
    </div>
  )
}

// ── Ahorro vs óptica ───────────────────────────────────────────────────────────
function AhorroCard({ precio }: { precio: number }) {
  const precioOptica = Math.round(precio * OPTICA_MULT)
  const ahorro = precioOptica - precio
  const ahorroAnual = ahorro * 2 * 12 // 2 ojos, 12 meses

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">💰 Tu ahorro comprando en ContactGo</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Óptica promedio', value: `RD$${precioOptica.toLocaleString()}`, sub: 'precio estimado', color: 'text-gray-400 line-through' },
          { label: 'ContactGo', value: `RD$${precio.toLocaleString()}`, sub: 'precio oficial', color: 'text-primary-600' },
          { label: 'Ahorras', value: `RD$${ahorro.toLocaleString()}`, sub: `RD$${ahorroAnual.toLocaleString()}/año`, color: 'text-green-600' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="text-center bg-gray-50 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            <p className={`font-black text-sm mt-0.5 ${color}`}>{value}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2">
        <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <p className="text-xs text-green-700 font-medium">¡Estás ahorrando hasta <strong>RD${ahorroAnual.toLocaleString()}</strong> al año con ContactGo!</p>
      </div>
    </div>
  )
}

// ── Calculadora consumo ────────────────────────────────────────────────────────
function ConsumoCard({ precio, frecuencia, onChange }: { precio: number; frecuencia: string; onChange: (f: any) => void }) {
  const datos: Record<string, { cajas: number; label: string }> = {
    diario: { cajas: 24, label: 'Diarios' },
    quincenal: { cajas: 8, label: 'Quincenales' },
    mensual: { cajas: 4, label: 'Mensuales' },
  }
  const { cajas, label } = datos[frecuencia]
  const anual = precio * cajas

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">📦 Calculadora de consumo anual</p>
      <div className="flex gap-1.5 mb-3">
        {(['diario', 'quincenal', 'mensual'] as const).map(f => (
          <button key={f} onClick={() => onChange(f)}
            className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${frecuencia === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
            {datos[f].label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: 'Cajas/año', v: `${cajas} cajas` },
          { l: 'Costo anual', v: `RD$${anual.toLocaleString()}` },
          { l: 'Costo/mes', v: `RD$${Math.round(anual / 12).toLocaleString()}` },
        ].map(({ l, v }) => (
          <div key={l} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-gray-500">{l}</p>
            <p className="font-black text-sm text-gray-900 mt-0.5">{v}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">Basado en {cajas} cajas/año para ambos ojos</p>
    </div>
  )
}

// ── WhatsApp CTA ───────────────────────────────────────────────────────────────
function WhatsAppCard({ result, buildMsg, onTrack }: { result: ConvertedRx; buildMsg: (r: ConvertedRx) => string; onTrack: () => void }) {
  const comp = getComplejidad(result)
  return (
    <div className={`rounded-2xl p-4 ${comp.nivel === 'rojo' ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-900'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`font-bold text-sm ${comp.nivel === 'rojo' ? 'text-red-900' : 'text-white'}`}>
            {comp.nivel === 'rojo' ? '⚠️ Necesitas orientación especializada' : '¿Dudas con tu receta?'}
          </p>
          <p className={`text-xs mt-0.5 ${comp.nivel === 'rojo' ? 'text-red-700' : 'text-gray-400'}`}>
            {comp.nivel === 'rojo' ? 'Enviaremos tu receta a un especialista gratis' : 'Consulta gratis con nuestro equipo de optometría'}
          </p>
        </div>
        <a href={`https://wa.me/18294728328?text=${buildMsg(result)}`} target="_blank" rel="noopener noreferrer"
          onClick={onTrack}
          className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap shadow-md">
          💬 WhatsApp →
        </a>
      </div>
    </div>
  )
}

// ── Sin productos ──────────────────────────────────────────────────────────────
function NoProductos() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
      <p className="text-sm text-gray-500 mb-3">No encontramos productos exactos. Un especialista puede ayudarte.</p>
      <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md">
        Consultar por WhatsApp →
      </a>
    </div>
  )
}

// ── Card producto ──────────────────────────────────────────────────────────────
function ProductCard({ product: p, result, featured }: { product: any; result: ConvertedRx; featured: boolean }) {
  const off = p.precio_original > p.precio ? Math.round((1 - p.precio / p.precio_original) * 100) : 0
  const saveRx = () => {
    try { sessionStorage.setItem('cg_rx_pending', JSON.stringify({ od: result.od, oi: result.oi, tipo: result.tipo, timestamp: Date.now() })) }
    catch { /* silent */ }
  }

  return (
    <Link href={`/producto/${p.slug}`} onClick={saveRx}
      className={`flex flex-col bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${featured ? 'border-primary-400 shadow-md ring-2 ring-primary-100 -translate-y-1' : 'border-gray-100 shadow-sm'}`}>
      {featured && <div className="bg-primary-600 text-white text-[9px] font-black text-center py-1 tracking-widest">⭐ RECOMENDADO</div>}
      <div className="p-2.5 flex-1 flex flex-col">
        {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-full h-16 object-contain mb-2 rounded-lg bg-gray-50" />}
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{p.marca}</p>
        <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 flex-1 line-clamp-2">{p.nombre}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className={`font-black text-sm ${featured ? 'text-primary-600' : 'text-gray-900'}`}>RD${Number(p.precio).toLocaleString()}</p>
          {off > 0 && <p className="text-[9px] text-green-600 font-bold">-{off}% off</p>}
          <p className="text-[9px] text-gray-400 mt-0.5">RD${Math.round(Number(p.precio) / 12).toLocaleString()}/mes aprox.</p>
        </div>
      </div>
      <div className="px-2.5 pb-2.5">
        <div className={`w-full text-center text-[10px] font-black py-2 rounded-xl ${featured ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Ver producto →
        </div>
      </div>
    </Link>
  )
}
