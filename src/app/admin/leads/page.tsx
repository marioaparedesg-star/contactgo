'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Mail, MessageCircle, Search, Star, TrendingUp, Users, Eye } from 'lucide-react'

const GOOGLE_REVIEW = 'https://g.page/r/Cb-RwE6S9vzgEAE/review'

export default function LeadsPage() {
  const sb = createClient()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtro, setFiltro] = useState<'todos'|'con_email'|'sin_convertir'>('todos')

  useEffect(() => {
    sb.from('calculator_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLeads(data ?? []); setLoading(false) })
  }, [])

  const filtered = leads.filter(l => {
    if (filtro === 'con_email' && !l.email) return false
    if (filtro === 'sin_convertir' && l.convertido) return false
    if (search) {
      const q = search.toLowerCase()
      return (l.nombre?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q))
    }
    return true
  })

  const conEmail    = leads.filter(l => l.email).length
  const convertidos = leads.filter(l => l.convertido).length
  const sinConvertir = leads.filter(l => !l.convertido && l.email).length

  const waMsg = (l: any) => {
    const nombre = l.nombre?.split(' ')[0] ?? ''
    const tipo = l.tipo_receta === 'torico' ? 'tóricos' : l.tipo_receta === 'multifocal' ? 'multifocales' : 'esféricos'
    return `https://wa.me/?text=${encodeURIComponent(
      `Hola ${nombre}! 👋 Somos ContactGo. Usaste nuestra calculadora de lentes de contacto. Encontramos los lentes ${tipo} perfectos para tu receta (OD ${l.od_sph ?? '?'} / OI ${l.oi_sph ?? '?'}). ¿Te ayudamos a completar tu pedido? Entregamos en 24-48h 😊`
    )}`
  }

  const emailMsg = (l: any) =>
    `mailto:${l.email}?subject=${encodeURIComponent('Tus lentes de contacto recomendados — ContactGo')}&body=${encodeURIComponent(
      `Hola ${l.nombre ?? ''}!\n\nUsaste nuestra calculadora de lentes de contacto en ContactGo.\n\nBasado en tu receta (OD ${l.od_sph ?? '?'} / OI ${l.oi_sph ?? '?'}), tenemos los lentes perfectos para ti.\n\nVisita: https://www.contactgo.net/receta\n\n¿Tienes alguna duda? Responde este correo.\n\nSaludos,\nContactGo`
    )}`

  const badgeColor = (complejidad: string) =>
    complejidad === 'verde' ? 'bg-green-100 text-green-700' :
    complejidad === 'amarillo' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        <div>
          <h1 className="text-2xl font-black text-gray-900">🧮 Leads de Calculadora</h1>
          <p className="text-gray-500 text-sm">Personas que usaron la calculadora de receta — prospectos calificados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-gray-900">{leads.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total leads</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-primary-600">{conEmail}</p>
            <p className="text-xs text-gray-500 mt-1">Con email</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-amber-600">{sinConvertir}</p>
            <p className="text-xs text-amber-600 mt-1 font-semibold">Sin convertir</p>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-green-600">{convertidos}</p>
            <p className="text-xs text-green-600 mt-1 font-semibold">Convertidos</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 bg-white" />
          </div>
          {(['todos','con_email','sin_convertir'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${filtro === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {f === 'todos' ? 'Todos' : f === 'con_email' ? '📧 Con email' : '⚡ Sin convertir'}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(l => (
              <div key={l.id} className={`bg-white rounded-2xl border shadow-sm p-4 ${l.convertido ? 'border-green-100' : l.email ? 'border-amber-100' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${l.convertido ? 'bg-green-100' : 'bg-amber-50'}`}>
                      {l.convertido ? '✅' : '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{l.nombre ?? 'Sin nombre'}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor(l.complejidad)}`}>
                          {l.complejidad === 'verde' ? '✅ Simple' : l.complejidad === 'amarillo' ? '⚠️ Moderada' : '🔴 Compleja'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                          {l.tipo_receta}
                        </span>
                        {l.convertido && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Compró ✓</span>}
                      </div>

                      {/* Receta */}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {l.email && <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3"/>{l.email}</span>}
                        <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded-lg">
                          OD {l.od_sph ?? '?'}{l.od_cyl ? ` / ${l.od_cyl}` : ''} · OI {l.oi_sph ?? '?'}{l.oi_cyl ? ` / ${l.oi_cyl}` : ''}
                        </span>
                        {l.condiciones?.length > 0 && (
                          <span className="text-[11px] text-gray-400">{l.condiciones.join(', ')}</span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(l.created_at).toLocaleDateString('es-DO', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {l.email && (
                      <a href={emailMsg(l)}
                        className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                        <Mail className="w-3.5 h-3.5"/> Email
                      </a>
                    )}
                    <a href={waMsg(l)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5"/> WhatsApp
                    </a>
                    {l.convertido && (
                      <a href={GOOGLE_REVIEW} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors">
                        <Star className="w-3.5 h-3.5"/> Reseña
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                <p>No hay leads que coincidan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
