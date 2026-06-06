'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import {
  convertGlassesToContacts, fmtSph, fmtCyl, fmtAxis,
  SPH_GLASSES, CYL_GLASSES, AXIS_VALS, ADD_VALS,
  type GlassesRx, type ConvertedRx,
} from '@/lib/prescription'
import { Eye, Camera, Upload, RotateCcw, Loader2, Sparkles, Info, AlertTriangle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface EyeInput { sph: string; cyl: string; axis: string; add: string }
const EMPTY: EyeInput = { sph: '', cyl: '', axis: '', add: '' }

function parseN(v: string): number | null {
  if (!v) return null
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

function fmtV(v: number | null): string {
  if (v == null) return '—'
  if (v === 0) return 'Plano'
  return v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function RecetaPage() {
  const [od, setOd] = useState<EyeInput>(EMPTY)
  const [oi, setOi] = useState<EyeInput>(EMPTY)
  const [misma, setMisma] = useState(false)
  const [inputMode, setInputMode] = useState<'manual'|'imagen'>('manual')
  const [imgPreview, setImgPreview] = useState<string|null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrMsg, setOcrMsg] = useState<string|null>(null)
  const [result, setResult] = useState<ConvertedRx|null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loadingP, setLoadingP] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore(s => s.addItem)

  // ── OCR ─────────────────────────────────────────────────────────────────────
  const handleImage = useCallback(async (file: File) => {
    setOcrLoading(true); setOcrMsg(null)
    setImgPreview(URL.createObjectURL(file))
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const img = new (window as any).Image()
        img.onload = () => {
          const MAX = 1024; let w = img.width, h = img.height
          if (w > MAX || h > MAX) { if (w > h) { h = Math.round(h*MAX/w); w = MAX } else { w = Math.round(w*MAX/h); h = MAX } }
          const c = document.createElement('canvas'); c.width = w; c.height = h
          c.getContext('2d')!.drawImage(img, 0, 0, w, h)
          res(c.toDataURL('image/jpeg', 0.88).split(',')[1])
        }
        img.onerror = rej; img.src = URL.createObjectURL(file)
      })
      const res = await fetch('/api/ocr-receta', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ image: base64, mimeType: 'image/jpeg' }) })
      const json = await res.json()
      if (!res.ok || !json.ok) { setOcrMsg('⚠️ No se pudo leer — ingresa los valores manualmente'); setOcrLoading(false); return }
      const r = json.receta
      if (r.od_sph != null) setOd(p => ({ ...p, sph: String(r.od_sph) }))
      if (r.od_cyl != null) setOd(p => ({ ...p, cyl: String(r.od_cyl) }))
      if (r.od_axis != null) setOd(p => ({ ...p, axis: String(r.od_axis) }))
      if (r.add_power != null) { setOd(p => ({...p, add: String(r.add_power)})); setOi(p => ({...p, add: String(r.add_power)})) }
      if (r.oi_sph != null) setOi(p => ({ ...p, sph: String(r.oi_sph) }))
      if (r.oi_cyl != null) setOi(p => ({ ...p, cyl: String(r.oi_cyl) }))
      if (r.oi_axis != null) setOi(p => ({ ...p, axis: String(r.oi_axis) }))
      const conf = r.confianza === 'alta' ? '✅ Receta leída' : '⚠️ Verifica los valores'
      setOcrMsg(`${conf}${r.notas ? ' · '+r.notas : ''}`)
      toast.success('Receta detectada — verifica los valores')
    } catch { setOcrMsg('⚠️ Error procesando imagen') }
    finally { setOcrLoading(false) }
  }, [])

  // ── Calcular ─────────────────────────────────────────────────────────────────
  const calcular = async () => {
    if (!parseN(od.sph) && !parseN(oi.sph)) { toast.error('Ingresa al menos la Esfera de un ojo'); return }
    const rx: GlassesRx = {
      od: { sph: parseN(od.sph) ?? 0, cyl: parseN(od.cyl), axis: parseN(od.axis), add: parseN(od.add) },
      oi: { sph: parseN(oi.sph) ?? 0, cyl: parseN(oi.cyl), axis: parseN(oi.axis), add: parseN(oi.add) },
    }
    const conv = convertGlassesToContacts(rx)
    setResult(conv)
    setLoadingP(true)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    try {
      const sb = createClient()
      const { data } = await sb.from('products').select('id,nombre,marca,tipo,precio,precio_original,imagen_url,slug,sph_disponibles').eq('activo', true).eq('tipo', conv.tipo).order('precio', { ascending: true })
      const odS = conv.od.sph ?? 0, oiS = conv.oi.sph ?? 0
      const filtered = (data ?? []).filter((p: any) => {
        if (!p.sph_disponibles?.length) return true
        const sphs = p.sph_disponibles.map(Number)
        return odS >= Math.min(...sphs) && odS <= Math.max(...sphs) && oiS >= Math.min(...sphs) && oiS <= Math.max(...sphs)
      })
      const pool = filtered.length > 0 ? filtered : (data ?? [])
      // 3 productos: menor, medio, mayor precio — mostrar el del medio como destacado
      let tres: any[] = []
      if (pool.length <= 3) { tres = pool }
      else {
        const sorted = [...pool].sort((a, b) => a.precio - b.precio)
        const mid = Math.floor(sorted.length / 2)
        tres = [sorted[0], sorted[mid], sorted[sorted.length - 1]]
      }
      setProducts(tres)
    } catch { setProducts([]) }
    finally { setLoadingP(false) }
  }

  const resetear = () => { setOd(EMPTY); setOi(EMPTY); setMisma(false); setResult(null); setProducts([]); setImgPreview(null); setOcrMsg(null) }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero compacto */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Eye className="w-5 h-5" />
            <h1 className="font-display font-black text-xl">Calculadora de Lentes de Contacto</h1>
          </div>
          <p className="text-primary-100 text-xs">Convierte tu receta de gafas · Gratis · Sin registro · Resultado inmediato</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

          {/* Modo de entrada */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <div className="grid grid-cols-2 gap-2">
              {(['manual','imagen'] as const).map(m => (
                <button key={m} onClick={() => setInputMode(m)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${inputMode===m ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  {m === 'manual' ? <><Eye className="w-4 h-4"/>Ingreso manual</> : <><Camera className="w-4 h-4"/>Foto de receta</>}
                </button>
              ))}
            </div>
          </div>

          {/* Upload foto */}
          {inputMode === 'imagen' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) handleImage(f) }} />
              {!imgPreview ? (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-all">
                  <Upload className="w-7 h-7 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Sube tu receta</p>
                  <p className="text-xs text-gray-400">Cualquier idioma · JPG, PNG, HEIC</p>
                </button>
              ) : (
                <div className="relative">
                  <img src={imgPreview} alt="Receta" className="w-full rounded-xl max-h-40 object-contain bg-gray-50" />
                  <button onClick={() => { setImgPreview(null); setOcrMsg(null); if(fileRef.current) fileRef.current.value='' }}
                    className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                    Cambiar
                  </button>
                </div>
              )}
              {ocrLoading && <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2"><Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin"/><p className="text-xs text-blue-700">Leyendo receta...</p></div>}
              {ocrMsg && !ocrLoading && (
                <p className={`text-xs px-3 py-2 rounded-lg ${ocrMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{ocrMsg}</p>
              )}
            </div>
          )}

          {/* Aviso receta gafas vs contacto */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5"/>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>¿Receta de gafas?</strong> La calculadora aplica la corrección de distancia vertex automáticamente para graduaciones {`>`} ±4.00D. Si ya tienes receta de lentes de contacto, ingresa esos valores directamente.
            </p>
          </div>

          {/* ── FORMULARIO COMPACTO ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* OD */}
            <EyeCompact label="OD · Ojo Derecho" eye={od} onChange={setOd} color="blue" />

            {/* Separador + checkbox */}
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={misma} onChange={e => { setMisma(e.target.checked); if(e.target.checked) setOi({...od}) }}
                  className="w-3.5 h-3.5 rounded text-primary-600"/>
                <span className="text-xs text-gray-600 font-medium">Ambos ojos tienen la misma receta</span>
              </label>
            </div>

            {/* OI */}
            <div className={misma ? 'opacity-50 pointer-events-none select-none' : ''}>
              <EyeCompact label="OI · Ojo Izquierdo" eye={oi} onChange={setOi} color="green" />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2">
            <button onClick={resetear} className="shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 text-gray-500 font-semibold px-4 py-3 rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-colors">
              <RotateCcw className="w-4 h-4"/>
            </button>
            <button onClick={calcular} className="flex-1 btn-primary py-3.5 font-black rounded-xl flex items-center justify-center gap-2 text-sm">
              <Sparkles className="w-4 h-4"/>
              Calcular mis lentes de contacto →
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"/>
            <p className="text-xs text-gray-400 leading-relaxed">Esta herramienta es orientativa. Los resultados no reemplazan la prescripción de un profesional de la salud visual. Consulta nuestra <Link href="/politica-receta" className="underline">Política de Receta</Link>.</p>
          </div>

          {/* ── RESULTADO + PRODUCTOS (misma página, aparece al calcular) ────── */}
          {result && (
            <div ref={resultRef} className="space-y-4 pt-2">

              {/* Card diagnóstico */}
              <ResultCard result={result} />

              {/* 3 productos */}
              <div>
                <p className="font-bold text-gray-900 text-sm mb-3">
                  {result.tipo === 'torico' ? '🎯 Lentes tóricos compatibles' : result.tipo === 'multifocal' ? '🔭 Lentes multifocales compatibles' : '👁️ Lentes esféricos compatibles'}
                </p>

                {loadingP ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                    <span className="text-sm">Buscando productos...</span>
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
                    <p className="text-sm text-gray-500 mb-3">No encontramos productos para esta graduación.</p>
                    <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-sm px-4 py-2.5 rounded-xl">Consultar por WhatsApp →</a>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {products.map((p, i) => {
                      // El del medio (índice 1) es el destacado
                      const featured = products.length === 3 ? i === 1 : i === 0
                      return <ProductCard key={p.id} product={p} result={result} featured={featured} />
                    })}
                  </div>
                )}

                <Link href={`/${result.tipo === 'esferico' ? 'esfericos' : result.tipo === 'torico' ? 'toricos' : 'multifocales'}`}
                  className="mt-3 flex items-center justify-center gap-1.5 text-primary-600 text-xs font-semibold hover:underline">
                  Ver todos los lentes {result.tipo === 'torico' ? 'tóricos' : result.tipo === 'multifocal' ? 'multifocales' : 'esféricos'} <ChevronRight className="w-3.5 h-3.5"/>
                </Link>
              </div>

              {/* WhatsApp help */}
              <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white text-sm">¿Dudas con tu receta?</p>
                  <p className="text-gray-400 text-xs mt-0.5">Un optometrista de ContactGo te ayuda gratis</p>
                </div>
                <a href="https://wa.me/18294728328?text=Hola%2C+necesito+ayuda+con+mi+receta" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-xs px-3 py-2 rounded-xl whitespace-nowrap">
                  Consultar →
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Formulario por ojo — compacto ─────────────────────────────────────────────
function EyeCompact({ label, eye, onChange, color }: { label: string; eye: EyeInput; onChange: (e: EyeInput) => void; color: 'blue'|'green' }) {
  const s = (k: keyof EyeInput) => (v: string) => onChange({ ...eye, [k]: v })
  const hasCyl = eye.cyl !== '' && eye.cyl !== '0'
  const dot = color === 'blue' ? 'bg-blue-500' : 'bg-green-500'

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot}`}/>
        <p className="text-xs font-bold text-gray-700">{label}</p>
      </div>

      {/* SPH + CYL lado a lado */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-gray-500 block mb-1">Esfera (SPH) *</label>
          <select value={eye.sph} onChange={e => s('sph')(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-100 outline-none">
            <option value="">— Selec. —</option>
            {SPH_GLASSES.map(v => (
              <option key={v} value={String(v)}>{v===0?'Plano':v>0?`+${v.toFixed(2)}`:v.toFixed(2)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-gray-500 block mb-1">Cilindro (CYL)</label>
          <select value={eye.cyl} onChange={e => s('cyl')(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-100 outline-none">
            <option value="">— Sin —</option>
            {CYL_GLASSES.filter(v => v!==0).map(v => (
              <option key={v} value={String(v)}>{v.toFixed(2)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AXIS — solo si hay CYL */}
      {hasCyl && (
        <div>
          <label className="text-[10px] font-semibold text-gray-500 block mb-1">Eje (AXIS) *</label>
          <select value={eye.axis} onChange={e => s('axis')(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-100 outline-none">
            <option value="">— Selecciona —</option>
            {AXIS_VALS.map(v => <option key={v} value={String(v)}>{String(v).padStart(3,'0')}°</option>)}
          </select>
        </div>
      )}

      {/* ADD */}
      <div>
        <label className="text-[10px] font-semibold text-gray-500 block mb-1">Adición (ADD) <span className="text-gray-400 font-normal">— Solo presbicia</span></label>
        <select value={eye.add} onChange={e => s('add')(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-100 outline-none">
          <option value="">— Sin adición —</option>
          {ADD_VALS.map(v => <option key={v} value={String(v)}>+{v.toFixed(2)}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── Card resultado ────────────────────────────────────────────────────────────
function ResultCard({ result: r }: { result: ConvertedRx }) {
  const colors = r.tipo==='torico'
    ? { bg:'bg-purple-50', border:'border-purple-200', badge:'bg-purple-100 text-purple-700', icon:'🎯' }
    : r.tipo==='multifocal'
    ? { bg:'bg-amber-50', border:'border-amber-200', badge:'bg-amber-100 text-amber-700', icon:'🔭' }
    : { bg:'bg-blue-50', border:'border-blue-200', badge:'bg-blue-100 text-blue-700', icon:'👁️' }

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">{colors.icon}</span>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-sm">
            {r.tipo==='torico'?'Necesitas lentes TÓRICOS':r.tipo==='multifocal'?'Necesitas lentes MULTIFOCALES':'Necesitas lentes ESFÉRICOS'}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {r.condiciones.map(c => <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{c}</span>)}
          </div>
        </div>
      </div>

      {/* Tabla compacta OD vs OI */}
      <div className="grid grid-cols-2 gap-2">
        {[['OD', r.od], ['OI', r.oi]].map(([label, eye]: any) => (
          <div key={label} className="bg-white/70 rounded-lg p-2.5 text-xs space-y-1">
            <p className={`font-bold text-[11px] ${label==='OD'?'text-blue-600':'text-green-600'}`}>{label}</p>
            <div className="flex justify-between"><span className="text-gray-500">SPH</span><span className="font-mono font-bold">{fmtV(eye.sph)}</span></div>
            {eye.cyl != null && eye.cyl !== 0 && <>
              <div className="flex justify-between"><span className="text-gray-500">CYL</span><span className="font-mono font-bold">{fmtCyl(eye.cyl)}</span></div>
              {eye.axis != null && <div className="flex justify-between"><span className="text-gray-500">EJE</span><span className="font-mono font-bold">{fmtAxis(eye.axis)}</span></div>}
            </>}
            {eye.add != null && eye.add !== 0 && <div className="flex justify-between"><span className="text-gray-500">ADD</span><span className="font-mono font-bold">+{eye.add.toFixed(2)}</span></div>}
          </div>
        ))}
      </div>

      {r.needsVertex && (
        <p className="text-[10px] text-amber-700 bg-amber-100 rounded-lg px-2.5 py-1.5 mt-2 leading-relaxed">
          ⚡ Corrección vertex aplicada (graduación &gt;±4D)
        </p>
      )}
    </div>
  )
}

// ── Card producto — grid de 3 ─────────────────────────────────────────────────
function ProductCard({ product: p, result, featured }: { product: any; result: ConvertedRx; featured: boolean }) {
  const descPct = p.precio_original && p.precio_original > p.precio
    ? Math.round((1 - p.precio / p.precio_original) * 100) : 0

  const saveRx = () => {
    try {
      sessionStorage.setItem('cg_rx_pending', JSON.stringify({ od: result.od, oi: result.oi, tipo: result.tipo, timestamp: Date.now() }))
    } catch {}
  }

  return (
    <Link href={`/producto/${p.slug}`} onClick={saveRx}
      className={`flex flex-col bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all cursor-pointer ${featured ? 'border-primary-400 shadow-md ring-1 ring-primary-200 scale-[1.02]' : 'border-gray-100 shadow-sm'}`}>
      {featured && <div className="bg-primary-600 text-white text-[10px] font-black text-center py-1 tracking-wide">⭐ RECOMENDADO</div>}
      <div className="p-2.5 flex-1 flex flex-col">
        {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-full h-14 object-contain mb-2 rounded-lg bg-gray-50"/>}
        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">{p.marca}</p>
        <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5 flex-1">{p.nombre}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="font-black text-primary-600 text-sm leading-none">RD${Number(p.precio).toLocaleString()}</p>
          {descPct > 0 && <p className="text-[10px] text-green-600 font-bold mt-0.5">-{descPct}% ahorro</p>}
        </div>
      </div>
      <div className={`px-2 pb-2`}>
        <div className={`w-full py-2 rounded-lg text-[10px] font-black text-center ${featured ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Ver →
        </div>
      </div>
    </Link>
  )
}
