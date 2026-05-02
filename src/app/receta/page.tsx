'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { analyzePrescription } from '@/lib/prescription'
import { Eye, Search, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react'

const SPH_OPTS = [-12,-11.5,-11,-10.5,-10,-9.5,-9,-8.5,-8,-7.5,-7,-6.5,-6,-5.75,-5.5,-5.25,-5,
  -4.75,-4.5,-4.25,-4,-3.75,-3.5,-3.25,-3,-2.75,-2.5,-2.25,-2,-1.75,-1.5,-1.25,-1,-0.75,-0.5,
  0,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.5,4,4.5,5,5.5,6,7,8]

const CYL_OPTS = [0,-0.75,-1.25,-1.75,-2.25,-2.75,-3.25,-3.75,-4.25]

const ADD_OPTS = ['', '+1.00 LOW', '+1.25 LOW', '+1.50 MID', '+1.75 MID', '+2.00 HIGH', '+2.50 HIGH']

const TIPO_INFO = {
  esferico:   { label: 'Lente Esférico',   emoji: '👁️',  color: 'blue',   query: 'esferico' },
  torico:     { label: 'Lente Tórico',     emoji: '🎯',  color: 'purple', query: 'torico' },
  multifocal: { label: 'Lente Multifocal', emoji: '🔭',  color: 'amber',  query: 'multifocal' },
}

export default function RecetaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    od_sph: '', od_cyl: '', oi_sph: '', oi_cyl: '', add_power: ''
  })
  const [result, setResult] = useState<ReturnType<typeof analyzePrescription> | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setResult(null)
  }

  const analyze = () => {
    const rx = {
      od_sph: form.od_sph ? parseFloat(form.od_sph) : null,
      od_cyl: form.od_cyl ? parseFloat(form.od_cyl) : null,
      oi_sph: form.oi_sph ? parseFloat(form.oi_sph) : null,
      oi_cyl: form.oi_cyl ? parseFloat(form.oi_cyl) : null,
      add_power: form.add_power ? parseFloat(form.add_power) : null,
    }
    setResult(analyzePrescription(rx))
  }

  const info = result ? TIPO_INFO[result.recomendacion] : null
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
  }

  return (
    <>
      <Navbar />
      <main className="pb-20 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Buscador inteligente de lentes
          </h1>
          <p className="text-gray-500">
            Ingresa los datos de tu receta y te decimos exactamente qué lentes necesitas.
          </p>
        </div>

        <div className="card p-6 space-y-6">
          {/* OD */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-bold">OD</span>
              Ojo derecho
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Esfera (SPH)</label>
                <select value={form.od_sph} onChange={set('od_sph')} className="input text-sm">
                  <option value="">— Seleccionar —</option>
                  {SPH_OPTS.map(v => <option key={v} value={v}>{v > 0 ? `+${v}` : v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Cilindro (CYL)</label>
                <select value={form.od_cyl} onChange={set('od_cyl')} className="input text-sm">
                  {CYL_OPTS.map(v => <option key={v} value={v}>{v === 0 ? '0.00' : v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* OI */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-bold">OI</span>
              Ojo izquierdo
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Esfera (SPH)</label>
                <select value={form.oi_sph} onChange={set('oi_sph')} className="input text-sm">
                  <option value="">— Seleccionar —</option>
                  {SPH_OPTS.map(v => <option key={v} value={v}>{v > 0 ? `+${v}` : v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Cilindro (CYL)</label>
                <select value={form.oi_cyl} onChange={set('oi_cyl')} className="input text-sm">
                  {CYL_OPTS.map(v => <option key={v} value={v}>{v === 0 ? '0.00' : v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ADD */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Adición (ADD) — solo si tienes presbicia
            </label>
            <select value={form.add_power} onChange={set('add_power')} className="input text-sm">
              {ADD_OPTS.map(v => <option key={v} value={v}>{v || '— Sin adición —'}</option>)}
            </select>
          </div>

          <button onClick={analyze}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
            <Search className="w-5 h-5" /> Analizar mi receta
          </button>
        </div>

        {/* Resultado */}
        {result && info && (
          <div className={`mt-6 card p-6 border-2 ${colorMap[info.color]}`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{info.emoji}</span>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {result.condicion.map(c => (
                    <span key={c} className="badge bg-white/60 text-xs font-semibold">{c}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-1">Recomendación: {info.label}</h3>
                <p className="text-sm opacity-80 mb-4">{result.descripcion}</p>

                <div className="flex gap-2 p-3 bg-white/50 rounded-xl text-xs mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                  <span>Esta recomendación es orientativa. Consulta siempre con un profesional de la salud visual antes de comprar.</span>
                </div>

                <button
                  onClick={() => router.push(`/catalogo?tipo=${info.query}`)}
                  className="btn-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Ver {info.label}s disponibles <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
