'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function AdminCalculadoraPage() {
  const router = useRouter()
  const [loading, setLoading]   = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [leads, setLeads]       = useState<any[]>([])

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const hace30 = new Date(); hace30.setDate(hace30.getDate() - 30)
      Promise.all([
        sb.from('calculator_sessions').select('evento,tipo_receta,created_at').gte('created_at', hace30.toISOString()),
        sb.from('calculator_leads').select('id,nombre,email,tipo_receta,complejidad,convertido,created_at').order('created_at', { ascending: false }).limit(50),
      ]).then(([{ data: s }, { data: l }]) => {
        setSessions(s ?? [])
        setLeads(l ?? [])
        setLoading(false)
      })
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400"/>
    </div>
  )

  // Calcular métricas
  const ev = sessions.reduce((acc: Record<string,number>, r) => { acc[r.evento] = (acc[r.evento]??0)+1; return acc }, {} as Record<string,number>)
  const calculos  = ev['calcular']        ?? 0
  const uploads   = ev['upload_started']  ?? 0
  const ocrOk     = ev['ocr_ok']          ?? 0
  const ocrFail   = ev['ocr_fail']        ?? 0
  const addCart   = ev['add_to_cart']     ?? 0
  const waClicks  = ev['whatsapp_click']  ?? 0
  const leadsN    = leads.length
  const ocrRate   = uploads > 0 ? Math.round((ocrOk/uploads)*100) : 0
  const convRate  = calculos > 0 ? Math.round((addCart/calculos)*100) : 0

  // Tipos de receta
  const tipoCount = sessions.reduce((acc: Record<string,number>, r) => {
    if (r.tipo_receta) acc[r.tipo_receta] = (acc[r.tipo_receta]??0)+1; return acc
  }, {} as Record<string,number>)

  const kpis = [
    { l: 'Cálculos', v: calculos, s: '30 días', c: 'text-blue-700' },
    { l: 'Fotos subidas', v: uploads, s: 'OCR intentos', c: 'text-purple-700' },
    { l: 'OCR exitoso', v: `${ocrRate}%`, s: `${ocrOk}/${uploads}`, c: ocrRate>=70?'text-green-700':'text-amber-600' },
    { l: 'OCR fallido', v: ocrFail, s: 'sin API key?', c: 'text-red-600' },
    { l: 'Al carrito', v: addCart, s: `${convRate}% conv.`, c: 'text-green-700' },
    { l: 'WhatsApp', v: waClicks, s: 'clics', c: 'text-green-600' },
    { l: 'Leads', v: leadsN, s: 'emails capturados', c: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-5">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Admin</Link>
          <h1 className="font-black text-gray-900 text-xl">📊 Calculadora — Métricas</h1>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full ml-auto">Últimos 30 días</span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-5">
          {kpis.map(k => (
            <div key={k.l} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
              <p className={`text-2xl font-black ${k.c}`}>{k.v}</p>
              <p className="text-[11px] font-bold text-gray-700 mt-0.5">{k.l}</p>
              <p className="text-[10px] text-gray-400">{k.s}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-5">

          {/* Funnel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">📉 Funnel de conversión</h3>
            {[
              { step: '1. Subió foto', n: uploads },
              { step: '2. OCR ok', n: ocrOk },
              { step: '3. Calculó', n: calculos },
              { step: '4. Lead email', n: leadsN },
              { step: '5. Carrito', n: addCart },
            ].map((s, i, arr) => {
              const prev = i > 0 ? arr[i-1].n : s.n
              const drop = prev > 0 && i > 0 ? Math.round(((prev-s.n)/prev)*100) : null
              const pct  = calculos > 0 ? Math.round((s.n/calculos)*100) : 0
              return (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] text-gray-500 w-24 shrink-0">{s.step}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full transition-all" style={{ width: `${Math.max(pct,2)}%` }}/>
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8 text-right">{s.n}</span>
                  {drop != null && <span className={`text-[9px] font-bold w-12 ${drop>60?'text-red-500':drop>30?'text-amber-500':'text-green-500'}`}>-{drop}%</span>}
                </div>
              )
            })}
          </div>

          {/* Tipos de receta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">🎯 Tipos calculados</h3>
            {Object.entries(tipoCount).sort(([,a],[,b])=> Number(b) - Number(a)).map(([tipo, nRaw]: [string, unknown]) => { const n = Number(nRaw);
              const total = (Object.values(tipoCount) as number[]).reduce((a: number,b: number)=>a+b,0)
              const pct = total > 0 ? Math.round((n/total)*100) : 0
              return (
                <div key={tipo} className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] text-gray-500 w-28 shrink-0 capitalize">{tipo.replace('_',' ')}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-purple-400 h-2.5 rounded-full" style={{ width: `${Math.max(pct,2)}%` }}/>
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-6 text-right">{n}</span>
                </div>
              )
            })}
            {!Object.keys(tipoCount).length && <p className="text-xs text-gray-400">Sin datos aún — espera los primeros cálculos</p>}
          </div>
        </div>

        {/* Tabla leads */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">📧 Leads capturados</h3>
          {!leads.length ? (
            <p className="text-xs text-gray-400">Sin leads aún. Los leads aparecen cuando un usuario ingresa su email antes de ver resultados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-[10px] text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left py-2 pr-3">Email</th>
                  <th className="text-left py-2 pr-3">Nombre</th>
                  <th className="text-left py-2 pr-3">Tipo receta</th>
                  <th className="text-left py-2 pr-3">Complejidad</th>
                  <th className="text-left py-2 pr-3">Convirtió</th>
                  <th className="text-left py-2">Fecha</th>
                </tr></thead>
                <tbody>
                  {leads.map((l: any) => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-medium">{l.email ?? '—'}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{l.nombre ?? '—'}</td>
                      <td className="py-1.5 pr-3"><span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded-full">{l.tipo_receta?.replace('_',' ')}</span></td>
                      <td className="py-1.5 pr-3">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${l.complejidad==='verde'?'bg-green-100 text-green-700':l.complejidad==='amarillo'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>
                          {l.complejidad}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3">{l.convertido ? <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">SÍ</span> : '—'}</td>
                      <td className="py-1.5 text-gray-400">{new Date(l.created_at).toLocaleDateString('es-DO',{day:'2-digit',month:'short'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
