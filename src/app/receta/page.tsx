'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import {
  convertGlassesToContacts, fmtSph, fmtCyl, fmtAxis, fmtAdd,
  SPH_GLASSES, CYL_GLASSES, AXIS_VALS, ADD_VALS,
  type GlassesRx, type ConvertedRx,
} from '@/lib/prescription'
import { Eye, Camera, Upload, RotateCcw, ShoppingCart, ChevronRight, Info, AlertTriangle, CheckCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Tipos ──────────────────────────────────────────────────────────────────────
type Step = 'entrada' | 'resultado' | 'productos'
type InputMode = 'manual' | 'imagen'
type Eye = 'od' | 'oi'

interface EyeInput { sph: string; cyl: string; axis: string; add: string }
const EMPTY_EYE: EyeInput = { sph: '', cyl: '', axis: '', add: '' }

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseN(v: string): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

function sph2select(v: string) {
  if (!v) return ''
  const n = parseFloat(v)
  if (isNaN(n)) return ''
  // Mostrar con signo
  return n > 0 ? `+${n.toFixed(2)}` : n === 0 ? '0.00' : n.toFixed(2)
}

function condicionColor(tipo: string) {
  return tipo === 'torico'
    ? { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '🎯' }
    : tipo === 'multifocal'
    ? { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: '🔭' }
    : { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '👁️' }
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function RecetaPage() {
  const [step, setStep] = useState<Step>('entrada')
  const [inputMode, setInputMode] = useState<InputMode>('manual')
  const [od, setOd] = useState<EyeInput>(EMPTY_EYE)
  const [oi, setOi] = useState<EyeInput>(EMPTY_EYE)
  const [mismaReceta, setMismaReceta] = useState(false)
  const [converted, setConverted] = useState<ConvertedRx | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrInfo, setOcrInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addItem = useCartStore(s => s.addItem)

  // ── OCR ─────────────────────────────────────────────────────────────────────
  const handleImage = useCallback(async (file: File) => {
    setOcrLoading(true)
    setOcrInfo(null)
    setImgPreview(URL.createObjectURL(file))

    try {
      // Resize a máx 1024px para no gastar tokens
      const base64 = await new Promise<string>((resolve, reject) => {
        const img = new (window as any).Image()
        img.onload = () => {
          const MAX = 1024
          let w = img.width, h = img.height
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX }
            else       { w = Math.round(w * MAX / h); h = MAX }
          }
          const canvas = document.createElement('canvas')
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.88).split(',')[1])
        }
        img.onerror = reject
        img.src = URL.createObjectURL(file)
      })

      const res = await fetch('/api/ocr-receta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: 'image/jpeg' })
      })
      const json = await res.json()

      if (!res.ok || !json.ok) {
        // Mostrar error descriptivo pero no bloquear — el usuario puede ingresar manualmente
        setOcrInfo('⚠️ No se pudo leer automáticamente — ingresa los valores manualmente abajo')
        setOcrLoading(false)
        return
      }

      const r = json.receta
      // Llenar formulario
      if (r.od_sph != null) setOd(prev => ({ ...prev, sph: String(r.od_sph) }))
      if (r.od_cyl != null) setOd(prev => ({ ...prev, cyl: String(r.od_cyl) }))
      if (r.od_axis != null) setOd(prev => ({ ...prev, axis: String(r.od_axis) }))
      if (r.add_power != null) {
        setOd(prev => ({ ...prev, add: String(r.add_power) }))
        setOi(prev => ({ ...prev, add: String(r.add_power) }))
      }
      if (r.oi_sph != null) setOi(prev => ({ ...prev, sph: String(r.oi_sph) }))
      if (r.oi_cyl != null) setOi(prev => ({ ...prev, cyl: String(r.oi_cyl) }))
      if (r.oi_axis != null) setOi(prev => ({ ...prev, axis: String(r.oi_axis) }))

      const confianza = r.confianza === 'alta' ? '✅ Alta confianza' : r.confianza === 'media' ? '⚠️ Verifica los valores' : '⚠️ Baja confianza — revisa manualmente'
      setOcrInfo(`${confianza}${r.notas ? ' · ' + r.notas : ''}`)
      toast.success('Receta leída. Verifica los valores antes de continuar.')
    } catch (err) {
      toast.error('Error procesando imagen.')
    } finally {
      setOcrLoading(false)
    }
  }, [])

  // ── Copiar OD → OI ──────────────────────────────────────────────────────────
  const handleMismaReceta = (checked: boolean) => {
    setMismaReceta(checked)
    if (checked) setOi({ ...od })
  }

  // ── Calcular ─────────────────────────────────────────────────────────────────
  const calcular = async () => {
    const odSph = parseN(od.sph)
    const oiSph = parseN(oi.sph)
    if (odSph == null && oiSph == null) {
      toast.error('Ingresa al menos la esfera (SPH) de un ojo')
      return
    }

    const rx: GlassesRx = {
      od: { sph: odSph ?? 0, cyl: parseN(od.cyl), axis: parseN(od.axis), add: parseN(od.add) },
      oi: { sph: oiSph ?? 0, cyl: parseN(oi.cyl), axis: parseN(oi.axis), add: parseN(oi.add) },
    }

    const result = convertGlassesToContacts(rx)
    setConverted(result)
    setStep('resultado')

    // Cargar productos reales
    setLoadingProducts(true)
    try {
      const sb = createClient()
      const { data } = await sb
        .from('products')
        .select('id,nombre,marca,tipo,precio,precio_original,imagen_url,slug,descripcion_corta,sph_disponibles')
        .eq('activo', true)
        .eq('tipo', result.tipo)
        .order('precio', { ascending: true })

      // Filtrar por rango de SPH disponible
      const odSphContact = result.od.sph ?? 0
      const oiSphContact = result.oi.sph ?? 0
      const maxSph = Math.max(Math.abs(odSphContact), Math.abs(oiSphContact))

      const filtered = (data ?? []).filter((p: any) => {
        if (!p.sph_disponibles?.length) return true
        const sphs = p.sph_disponibles.map(Number)
        const minAvail = Math.min(...sphs)
        const maxAvail = Math.max(...sphs)
        return odSphContact >= minAvail && odSphContact <= maxAvail &&
               oiSphContact >= minAvail && oiSphContact <= maxAvail
      })

      setProducts(filtered.length > 0 ? filtered : (data ?? []).slice(0, 6))
    } catch {
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  const resetear = () => {
    setOd(EMPTY_EYE); setOi(EMPTY_EYE); setMismaReceta(false)
    setConverted(null); setProducts([]); setImgPreview(null)
    setOcrInfo(null); setStep('entrada')
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">

        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="font-display text-xl md:text-2xl font-black text-gray-900">
                  Calculadora de Lentes de Contacto
                </h1>
                <p className="text-xs text-gray-500">Convierte tu receta de gafas a lentes de contacto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* ── PASO 1: Entrada ──────────────────────────────────────────────── */}
          {step === 'entrada' && (
            <>
              {/* Selector modo */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">¿Cómo quieres ingresar tu receta?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setInputMode('manual')}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${inputMode === 'manual' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <Eye className="w-5 h-5" />
                    Ingreso manual
                  </button>
                  <button onClick={() => setInputMode('imagen')}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${inputMode === 'imagen' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <Camera className="w-5 h-5" />
                    Foto de receta
                  </button>
                </div>
              </div>

              {/* Upload imagen */}
              {inputMode === 'imagen' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Sube una foto de tu receta</p>
                    <p className="text-xs text-gray-500">Funciona en cualquier idioma · Lee recetas de cualquier óptica del mundo</p>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f) }} />

                  {!imgPreview ? (
                    <button onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-10 flex flex-col items-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all group">
                      <Upload className="w-8 h-8 text-gray-300 group-hover:text-primary-400 transition-colors" />
                      <div className="text-center">
                        <p className="font-semibold text-gray-500 text-sm">Toca para subir imagen</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC · Cámara o galería</p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative">
                      <img src={imgPreview} alt="Receta" className="w-full rounded-xl object-contain max-h-48 bg-gray-50" />
                      <button onClick={() => { setImgPreview(null); setOcrInfo(null); if(fileInputRef.current) fileInputRef.current.value = '' }}
                        className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50">
                        Cambiar
                      </button>
                    </div>
                  )}

                  {ocrLoading && (
                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                      <p className="text-xs text-blue-700 font-medium">Leyendo receta con IA — puede tomar unos segundos...</p>
                    </div>
                  )}

                  {ocrInfo && !ocrLoading && (
                    <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-xs ${ocrInfo.includes('Alta') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{ocrInfo}</span>
                    </div>
                  )}

                  {imgPreview && !ocrLoading && (
                    <p className="text-xs text-gray-400 text-center">Verifica los valores detectados en el formulario</p>
                  )}
                </div>
              )}

              {/* Aviso informativo */}
              <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>¿Receta de gafas o de lentes de contacto?</strong> Si tienes una receta de gafas, la calculadora aplica automáticamente la corrección de distancia vertex (para graduaciones {'>'} ±4.00D). Si ya tienes una receta de lentes de contacto, ingresa esos valores directamente.
                </p>
              </div>

              {/* Formulario OD */}
              <EyeForm
                label="👁️ Ojo Derecho (OD)"
                eye={od}
                onChange={setOd}
                colorClass="border-blue-200 bg-blue-50/30"
              />

              {/* Checkbox misma receta */}
              <label className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <input type="checkbox" checked={mismaReceta} onChange={e => handleMismaReceta(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 cursor-pointer" />
                <span className="text-sm font-medium text-gray-700">Ambos ojos tienen la misma receta</span>
              </label>

              {/* Formulario OI */}
              <EyeForm
                label="👁️ Ojo Izquierdo (OI)"
                eye={oi}
                onChange={setOi}
                colorClass="border-green-200 bg-green-50/30"
                disabled={mismaReceta}
              />

              {/* CTA calcular */}
              <button onClick={calcular}
                className="w-full btn-primary py-4 text-base font-black rounded-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Calcular mis lentes de contacto
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* ── PASO 2: Resultado ────────────────────────────────────────────── */}
          {step === 'resultado' && converted && (
            <>
              <ConversionResult rx={converted} od_input={od} oi_input={oi} />

              {/* Botones acción */}
              <div className="flex gap-3">
                <button onClick={resetear}
                  className="flex-none flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 font-semibold px-4 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm">
                  <RotateCcw className="w-4 h-4" />
                  Nueva
                </button>
                <button onClick={() => setStep('productos')}
                  className="flex-1 btn-primary py-3 font-black rounded-xl flex items-center justify-center gap-2">
                  Ver productos compatibles
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* ── PASO 3: Productos ────────────────────────────────────────────── */}
          {step === 'productos' && converted && (
            <>
              {/* Back */}
              <button onClick={() => setStep('resultado')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                ← Volver al resultado
              </button>

              <div className={`rounded-2xl border p-4 ${condicionColor(converted.tipo).bg} ${condicionColor(converted.tipo).border}`}>
                <p className="font-bold text-gray-900 text-sm">
                  {condicionColor(converted.tipo).icon} {converted.tipo === 'torico' ? 'Lentes Tóricos' : converted.tipo === 'multifocal' ? 'Lentes Multifocales' : 'Lentes Esféricos'} · {converted.condiciones.join(', ')}
                </p>
                <p className="text-xs text-gray-600 mt-1">{converted.descripcion}</p>
              </div>

              {loadingProducts ? (
                <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-sm">Buscando productos compatibles...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                  <p className="text-gray-500 text-sm mb-3">No encontramos productos exactos para esta graduación.</p>
                  <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-xl">
                    Consultar por WhatsApp →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} converted={converted} onAddCart={addItem} />
                  ))}
                </div>
              )}

              <button onClick={resetear}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm">
                <RotateCcw className="w-4 h-4" />
                Calcular otra receta
              </button>
            </>
          )}

          {/* Disclaimer médico */}
          <div className="flex items-start gap-3 bg-gray-100 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Esta herramienta es orientativa. Los resultados no reemplazan la prescripción de un profesional de la salud visual. Consulta nuestra{' '}
              <Link href="/politica-receta" className="underline hover:text-gray-700">Política de Receta</Link>.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Sub-componente: Formulario por ojo ────────────────────────────────────────
function EyeForm({ label, eye, onChange, colorClass, disabled }: {
  label: string
  eye: EyeInput
  onChange: (e: EyeInput) => void
  colorClass: string
  disabled?: boolean
}) {
  const set = (key: keyof EyeInput) => (val: string) => onChange({ ...eye, [key]: val })
  const hasAstig = eye.cyl !== '' && eye.cyl !== '0'
  const hasAdd   = eye.add !== ''

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm p-4 space-y-3 ${colorClass} ${disabled ? 'opacity-60 pointer-events-none select-none' : ''}`}>
      <p className="font-bold text-gray-800 text-sm">{label}</p>

      {/* SPH */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Esfera (SPH) *</label>
        <p className="text-[10px] text-gray-400 mb-1.5">Graduación principal · Ej: -3.25 o +1.50 o Plano</p>
        <select value={eye.sph} onChange={e => set('sph')(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none">
          <option value="">— Selecciona —</option>
          {SPH_GLASSES.map(v => (
            <option key={v} value={String(v)}>
              {v === 0 ? 'Plano (0.00)' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* CYL */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Cilindro (CYL)</label>
        <p className="text-[10px] text-gray-400 mb-1.5">Astigmatismo · Ej: -0.75 · Déjalo vacío si no tienes</p>
        <select value={eye.cyl} onChange={e => set('cyl')(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none">
          <option value="">— Sin cilindro —</option>
          {CYL_GLASSES.filter(v => v !== 0).map(v => (
            <option key={v} value={String(v)}>{v.toFixed(2)}</option>
          ))}
        </select>
      </div>

      {/* AXIS — solo si hay CYL */}
      {hasAstig && (
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Eje (AXIS) *</label>
          <p className="text-[10px] text-gray-400 mb-1.5">Orientación del cilindro · Ej: 90 o 180</p>
          <select value={eye.axis} onChange={e => set('axis')(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none">
            <option value="">— Selecciona eje —</option>
            {AXIS_VALS.map(v => (
              <option key={v} value={String(v)}>{String(v).padStart(3, '0')}°</option>
            ))}
          </select>
        </div>
      )}

      {/* ADD */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Adición (ADD)</label>
        <p className="text-[10px] text-gray-400 mb-1.5">Solo para presbicia / multifocal · Ej: +2.00</p>
        <select value={eye.add} onChange={e => set('add')(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none">
          <option value="">— Sin adición —</option>
          {ADD_VALS.map(v => (
            <option key={v} value={String(v)}>+{v.toFixed(2)}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ── Sub-componente: Resultado de conversión ───────────────────────────────────
function ConversionResult({ rx, od_input, oi_input }: { rx: ConvertedRx; od_input: EyeInput; oi_input: EyeInput }) {
  const colors = condicionColor(rx.tipo)

  const RxRow = ({ label, glasses, contact }: { label: string; glasses: string; contact: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 w-16">{label}</span>
      <div className="flex items-center gap-3 flex-1 justify-end">
        <span className="text-sm text-gray-400 line-through">{glasses}</span>
        <ArrowRight className="w-3 h-3 text-gray-300" />
        <span className="text-sm font-black text-gray-900">{contact}</span>
      </div>
    </div>
  )

  const odSphG = od_input.sph ? (parseFloat(od_input.sph) > 0 ? `+${parseFloat(od_input.sph).toFixed(2)}` : parseFloat(od_input.sph) === 0 ? 'Plano' : parseFloat(od_input.sph).toFixed(2)) : '—'
  const oiSphG = oi_input.sph ? (parseFloat(oi_input.sph) > 0 ? `+${parseFloat(oi_input.sph).toFixed(2)}` : parseFloat(oi_input.sph) === 0 ? 'Plano' : parseFloat(oi_input.sph).toFixed(2)) : '—'

  return (
    <div className="space-y-4">
      {/* Banner tipo */}
      <div className={`rounded-2xl border-2 p-4 ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{colors.icon}</span>
          <div>
            <p className="font-black text-gray-900 text-base">
              {rx.tipo === 'torico' ? 'Necesitas lentes TÓRICOS' : rx.tipo === 'multifocal' ? 'Necesitas lentes MULTIFOCALES' : 'Necesitas lentes ESFÉRICOS'}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {rx.condiciones.map(c => (
                <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{c}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{rx.descripcion}</p>
      </div>

      {/* Tabla conversión */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Conversión de receta</p>
          {rx.needsVertex && (
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Con corrección vertex</span>
          )}
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-4">
          {/* OD */}
          <div>
            <p className="text-xs font-bold text-blue-600 mb-2">👁️ OD (Ojo Derecho)</p>
            <RxRow label="SPH" glasses={odSphG} contact={fmtSph(rx.od.sph)} />
            {(od_input.cyl || rx.od.cyl) && (
              <>
                <RxRow label="CYL" glasses={od_input.cyl ? od_input.cyl : '—'} contact={fmtCyl(rx.od.cyl)} />
                <RxRow label="AXIS" glasses={od_input.axis ? od_input.axis + '°' : '—'} contact={fmtAxis(rx.od.axis)} />
              </>
            )}
            {rx.od.add && <RxRow label="ADD" glasses={od_input.add ? `+${parseFloat(od_input.add).toFixed(2)}` : '—'} contact={fmtAdd(rx.od.add)} />}
          </div>

          {/* OI */}
          <div>
            <p className="text-xs font-bold text-green-600 mb-2">👁️ OI (Ojo Izquierdo)</p>
            <RxRow label="SPH" glasses={oiSphG} contact={fmtSph(rx.oi.sph)} />
            {(oi_input.cyl || rx.oi.cyl) && (
              <>
                <RxRow label="CYL" glasses={oi_input.cyl ? oi_input.cyl : '—'} contact={fmtCyl(rx.oi.cyl)} />
                <RxRow label="AXIS" glasses={oi_input.axis ? oi_input.axis + '°' : '—'} contact={fmtAxis(rx.oi.axis)} />
              </>
            )}
            {rx.oi.add && <RxRow label="ADD" glasses={oi_input.add ? `+${parseFloat(oi_input.add).toFixed(2)}` : '—'} contact={fmtAdd(rx.oi.add)} />}
          </div>
        </div>

        {rx.needsVertex && (
          <div className="px-4 pb-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Corrección de distancia vertex aplicada.</strong> Las gafas están a ~12mm del ojo, los lentes de contacto directamente sobre la córnea. Para graduaciones superiores a ±4.00D esto cambia el poder efectivo del lente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-componente: Tarjeta de producto ───────────────────────────────────────
function ProductCard({ product: p, converted }: { product: any; converted: ConvertedRx; onAddCart?: any }) {
  const descPct = p.precio_original && p.precio_original > p.precio
    ? Math.round((1 - p.precio / p.precio_original) * 100) : 0

  // Guardar receta en sessionStorage antes de ir al PDP
  const handleGoToProduct = () => {
    try {
      sessionStorage.setItem('cg_rx_pending', JSON.stringify({
        od: converted.od,
        oi: converted.oi,
        tipo: converted.tipo,
        timestamp: Date.now(),
      }))
    } catch { /* silencioso si no hay sessionStorage */ }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-3 p-4">
        {p.imagen_url && (
          <img src={p.imagen_url} alt={p.nombre} className="w-14 h-14 object-contain rounded-xl bg-gray-50 border border-gray-100 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{p.marca}</p>
          <p className="font-bold text-gray-900 text-sm leading-tight">{p.nombre}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-black text-gray-900 text-base">RD${Number(p.precio).toLocaleString()}</span>
            {descPct > 0 && (
              <>
                <span className="text-xs text-gray-300 line-through">RD${Number(p.precio_original).toLocaleString()}</span>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">-{descPct}%</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Parámetros que coinciden */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {converted.od.sph != null && (
          <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 font-mono px-2 py-0.5 rounded-lg">
            OD {converted.od.sph > 0 ? `+${converted.od.sph.toFixed(2)}` : converted.od.sph.toFixed(2)}
          </span>
        )}
        {converted.oi.sph != null && (
          <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 font-mono px-2 py-0.5 rounded-lg">
            OI {converted.oi.sph > 0 ? `+${converted.oi.sph.toFixed(2)}` : converted.oi.sph.toFixed(2)}
          </span>
        )}
        {converted.od.cyl != null && converted.od.cyl !== 0 && (
          <span className="text-[10px] bg-purple-50 border border-purple-200 text-purple-700 font-mono px-2 py-0.5 rounded-lg">
            CYL {converted.od.cyl.toFixed(2)}
          </span>
        )}
      </div>

      <div className="px-4 pb-4">
        <Link href={`/producto/${p.slug}`} onClick={handleGoToProduct}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm py-3 rounded-xl transition-colors">
          <Eye className="w-4 h-4" />
          Ir al producto con mi receta →
        </Link>
      </div>
    </div>
  )
}
