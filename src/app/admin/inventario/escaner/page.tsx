'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  Scan, CheckCircle, AlertCircle, Plus, Package,
  ChevronLeft, Zap, RotateCcw, History, X
} from 'lucide-react'

type ParsedResult = {
  parsed: {
    nombre_detectado: string|null; marca: string|null; tipo: string
    sph: number|null; cyl: number|null; axis: number|null; add_power: string|null
    color: string|null; bc: number|null; dia: number|null; lot: string|null; expiry: string|null
    raw: string
  }
  product: { id:string; nombre:string; tipo:string; marca:string; stock:number; imagen_url:string|null } | null
  variant: { id:string; sph:number; cyl:number|null; axis:number|null; stock:number } | null
}

type ScanEntry = {
  id: string
  ts: string
  producto: string
  sph: number|null
  cantidad: number
  stock_nuevo: number
  es_nuevo: boolean
  ok: boolean
}

const TIPO_LABEL: Record<string,string> = {
  esferico:'Esférico', torico:'Tórico', multifocal:'Multifocal',
  color:'Color', solucion:'Solución', gota:'Gota',
}

export default function EscanerPage() {
  const router = useRouter()
  const sb     = createClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ParsedResult|null>(null)
  const [cantidad,  setCantidad]  = useState(1)
  const [history,   setHistory]   = useState<ScanEntry[]>([])
  const [showNew,   setShowNew]   = useState(false)
  const [newProd,   setNewProd]   = useState({ nombre:'', precio:'', slug:'' })
  const [isAdmin,   setIsAdmin]   = useState(false)
  const [mode,      setMode]      = useState<'scan'|'manual'>('scan')
  const [manualSph, setManualSph] = useState('')
  const [manualCyl, setManualCyl] = useState('')
  const [manualAxis,setManualAxis]= useState('')

  // Verificar auth
  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.push('/admin/login'); return }
      sb.from('profiles').select('role').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          if (p?.role !== 'admin') { router.push('/'); return }
          setIsAdmin(true)
        })
    })
  }, [])

  // Autofocus permanente en modo scan
  useEffect(() => {
    if (mode === 'scan' && !loading && !showNew) {
      const t = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(t)
    }
  }, [mode, loading, showNew, result])

  // Enter = confirmar si ya hay resultado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setResult(null); setInput(''); setCantidad(1) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const parseScan = useCallback(async (text: string) => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'parse', text }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      setResult(data)
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const commit = useCallback(async () => {
    if (!result) return
    if (!result.product && !showNew) { setShowNew(true); return }
    setLoading(true)
    try {
      const body: any = {
        action: 'commit',
        parsed: result.parsed,
        cantidad,
        lot:    result.parsed.lot    ?? undefined,
        expiry: result.parsed.expiry ?? undefined,
      }
      if (result.product) {
        body.product_id = result.product.id
      } else {
        body.create_product = {
          nombre: newProd.nombre || result.parsed.nombre_detectado || 'Producto nuevo',
          precio: parseFloat(newProd.precio) || 0,
          slug:   newProd.slug || (newProd.nombre || 'producto').toLowerCase().replace(/[^a-z0-9]+/g,'-'),
        }
      }
      const res = await fetch('/api/admin/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }

      // Beep visual + feedback
      const entry: ScanEntry = {
        id: Date.now().toString(), ts: new Date().toLocaleTimeString('es-DO', {hour:'2-digit',minute:'2-digit',second:'2-digit'}),
        producto: result.product?.nombre ?? body.create_product?.nombre ?? '—',
        sph: result.parsed.sph, cantidad, stock_nuevo: data.stock_nuevo,
        es_nuevo: data.es_nuevo ?? false, ok: true,
      }
      setHistory(h => [entry, ...h.slice(0, 49)])
      toast.success(data.es_nuevo ? '✨ Nueva dioptría creada' : `✅ Stock: ${data.stock_anterior} → ${data.stock_nuevo}`, { duration: 2500 })

      // Reset para siguiente escaneo
      setResult(null); setInput(''); setCantidad(1); setShowNew(false); setNewProd({ nombre:'', precio:'', slug:'' })
    } catch {
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }, [result, cantidad, showNew, newProd])

  if (!isAdmin) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/admin/inventario" className="text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary-400" />
          <h1 className="font-bold text-base">Escáner de Inventario</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setMode(m => m === 'scan' ? 'manual' : 'scan')}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${mode === 'scan' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {mode === 'scan' ? '⚡ Rápido' : '✏️ Manual'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Input principal */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              {mode === 'scan' ? '📦 Texto de la caja (escáner o manual)' : '✏️ Ingreso manual'}
            </label>
            <textarea
              ref={inputRef as any}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && mode === 'scan') { e.preventDefault(); parseScan(input) } }}
              rows={mode === 'scan' ? 4 : 2}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none placeholder-gray-600"
              placeholder={mode === 'scan'
                ? 'ACUVUE OASYS\nD -6.50\nBC 8.4\nDIA 14.0\nLOT B019J6X2BR\nEXP 2031-02-01\n\n[Enter para procesar]'
                : 'Pega texto o escribe los datos del producto...'}
            />
          </div>
          <div className="px-4 pb-4 flex items-center gap-2">
            <button
              onClick={() => parseScan(input)}
              disabled={loading || !input.trim()}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? 'Procesando...' : 'Analizar'}
            </button>
            <button
              onClick={() => { setInput(''); setResult(null); setCantidad(1); inputRef.current?.focus() }}
              className="w-11 h-11 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resultado del parse */}
        {result && (
          <div className={`rounded-2xl border overflow-hidden ${result.product ? 'border-green-500/30 bg-green-950/30' : 'border-amber-500/30 bg-amber-950/30'}`}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              {result.product
                ? <CheckCircle className="w-4 h-4 text-green-400" />
                : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span className="font-bold text-sm">
                {result.product ? `Encontrado: ${result.product.nombre}` : 'Producto no encontrado — crear nuevo'}
              </span>
              <button onClick={() => { setResult(null); setInput('') }} className="ml-auto text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Datos parseados */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Tipo',    TIPO_LABEL[result.parsed.tipo] ?? result.parsed.tipo],
                  ['Marca',   result.parsed.marca ?? '—'],
                  ['SPH',     result.parsed.sph?.toFixed(2) ?? '—'],
                  result.parsed.cyl    ? ['CYL',  result.parsed.cyl.toFixed(2)]  : null,
                  result.parsed.axis   ? ['AXIS', `${result.parsed.axis}°`]       : null,
                  result.parsed.add_power ? ['ADD', result.parsed.add_power]      : null,
                  result.parsed.bc     ? ['BC',   result.parsed.bc.toFixed(1)]    : null,
                  result.parsed.dia    ? ['DIA',  result.parsed.dia.toFixed(1)]   : null,
                  result.parsed.lot    ? ['Lote', result.parsed.lot]              : null,
                  result.parsed.expiry ? ['Vence', result.parsed.expiry]          : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="bg-white/5 rounded-xl px-3 py-2">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">{k}</p>
                    <p className="text-sm font-bold text-white mt-0.5 font-mono">{v}</p>
                  </div>
                ))}
              </div>

              {/* Variante existente */}
              {result.variant && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl px-3 py-2 text-sm">
                  <span className="text-blue-300 font-bold">Stock actual para SPH {result.parsed.sph?.toFixed(2)}: </span>
                  <span className="text-white font-black">{result.variant.stock} unidades</span>
                </div>
              )}

              {/* Formulario nuevo producto */}
              {!result.product && showNew && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Crear nuevo producto</p>
                  <input value={newProd.nombre} onChange={e => setNewProd(p => ({...p, nombre: e.target.value}))}
                    className="w-full bg-gray-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nombre del producto *" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={newProd.precio} onChange={e => setNewProd(p => ({...p, precio: e.target.value}))}
                      type="number" min="0"
                      className="bg-gray-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Precio (RD$)" />
                    <input value={newProd.slug} onChange={e => setNewProd(p => ({...p, slug: e.target.value}))}
                      className="bg-gray-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="slug-url" />
                  </div>
                </div>
              )}

              {/* Cantidad + confirmar */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                  <button onClick={() => setCantidad(c => Math.max(1, c-1))} className="text-gray-400 hover:text-white font-black text-lg w-6 h-6 flex items-center justify-center">−</button>
                  <input
                    type="number" min="1" value={cantidad}
                    onChange={e => setCantidad(Math.max(1, parseInt(e.target.value)||1))}
                    className="w-12 bg-transparent text-white text-center font-black text-lg focus:outline-none"
                  />
                  <button onClick={() => setCantidad(c => c+1)} className="text-gray-400 hover:text-white font-black text-lg w-6 h-6 flex items-center justify-center">+</button>
                </div>
                <span className="text-gray-400 text-sm">cajas</span>
                <button
                  onClick={commit}
                  disabled={loading || (!result.product && !showNew)}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <CheckCircle className="w-4 h-4" />}
                  {!result.product && !showNew ? 'Definir producto →' : 'Confirmar entrada'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Historial de esta sesión */}
        {history.length > 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              <span className="font-bold text-sm">Sesión actual ({history.length})</span>
              <span className="ml-auto text-xs text-gray-500">
                +{history.reduce((a, h) => a + h.cantidad, 0)} uds total
              </span>
            </div>
            <div className="divide-y divide-gray-800 max-h-64 overflow-y-auto">
              {history.map(h => (
                <div key={h.id} className="px-4 py-2.5 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${h.ok ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{h.producto}</p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {h.sph !== null ? `SPH ${h.sph >= 0 ? '+' : ''}${h.sph.toFixed(2)}` : 'Sin dioptría'} · +{h.cantidad} uds
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-green-400">→ {h.stock_nuevo}</p>
                    <p className="text-[9px] text-gray-600">{h.ts}</p>
                  </div>
                  {h.es_nuevo && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold shrink-0">NUEVO</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {!result && history.length === 0 && (
          <div className="bg-gray-900/50 rounded-2xl border border-dashed border-gray-700 p-6 text-center">
            <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="font-bold text-gray-400 text-sm mb-1">Listo para escanear</p>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Pega el texto de la caja o usa un lector de código de barras. El sistema detecta automáticamente la marca, dioptría, lote y fecha de vencimiento.
            </p>
            <div className="mt-4 text-[10px] text-gray-700 space-y-1 font-mono text-left max-w-xs mx-auto">
              <p className="text-gray-600 font-sans font-bold mb-1.5 text-xs">Ejemplo de entrada:</p>
              {['ACUVUE OASYS', 'D -6.50', 'BC 8.4', 'DIA 14.0', 'LOT B019J6X2BR', 'EXP 2031-02-01'].map(l => (
                <p key={l} className="text-gray-500">{l}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
