'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { RefreshCw, Search, MessageSquareOff } from 'lucide-react'
import toast from 'react-hot-toast'

type CartRow = {
  id: string; source: 'email' | 'tracking'; nombre: string | null; telefono: string | null
  email: string | null; items: any[]; total: number; recuperado: boolean; contactado: boolean; created_at: string
}

export default function AdminAbandonados() {
  const sb = createClient()
  const [emailCarts, setEmailCarts] = useState<CartRow[]>([])
  const [trackingCarts, setTrackingCarts] = useState<CartRow[]>([])
  const [source, setSource] = useState<'email' | 'tracking'>('email')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [emailResult, trackingResult] = await Promise.all([
      sb.from('abandoned_carts').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('carritos_abandonados').select('*').order('created_at', { ascending: false }).limit(200),
    ])
    if (emailResult.error) toast.error('No se pudieron cargar los carritos del checkout')
    if (trackingResult.error) toast.error('No se pudieron cargar los carritos de seguimiento')
    setEmailCarts((emailResult.data ?? []).map((c: any) => ({
      id: c.id, source: 'email', nombre: c.cliente_nombre, telefono: c.cliente_telefono, email: c.cliente_email,
      items: Array.isArray(c.items) ? c.items : [], total: Number(c.total ?? 0),
      recuperado: c.recuperado === true, contactado: c.whatsapp_enviado === true || c.email_sent === true, created_at: c.created_at,
    })))
    setTrackingCarts((trackingResult.data ?? []).map((c: any) => ({
      id: c.id, source: 'tracking', nombre: c.nombre, telefono: c.telefono, email: c.email,
      items: Array.isArray(c.items) ? c.items : [], total: Number(c.total ?? 0),
      recuperado: c.convertido === true, contactado: c.wa_enviado === true, created_at: c.created_at,
    })))
    setLoading(false)
  }, [sb])

  useEffect(() => { load() }, [load])

  const carts = source === 'email' ? emailCarts : trackingCarts
  const filtered = carts.filter(c => !search ||
    (c.nombre ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono ?? '').includes(search) || (c.email ?? '').toLowerCase().includes(search.toLowerCase()))
  const stats = {
    total: carts.length, pendientes: carts.filter(c => !c.recuperado && !c.contactado).length,
    contactados: carts.filter(c => c.contactado && !c.recuperado).length,
    recuperados: carts.filter(c => c.recuperado).length,
    valor: carts.filter(c => !c.recuperado).reduce((sum, c) => sum + c.total, 0),
  }

  const marcarRecuperado = async (cart: CartRow) => {
    const table = cart.source === 'email' ? 'abandoned_carts' : 'carritos_abandonados'
    const field = cart.source === 'email' ? 'recuperado' : 'convertido'
    const { error } = await sb.from(table).update({ [field]: true }).eq('id', cart.id)
    if (error) { toast.error('No se pudo actualizar el estado del carrito'); return }
    toast.success('Carrito marcado como recuperado')
    await load()
  }

  const formatItems = (items: any[]) => items.map(i => i?.nombre ?? i?.name ?? i?.producto ?? i?.title ?? 'Producto').join(', ') || 'Productos no especificados'

  return <div className="max-w-7xl mx-auto">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div><h1 className="text-2xl font-bold text-gray-900">Carritos abandonados</h1><p className="text-sm text-gray-500">{emailCarts.length + trackingCarts.length} registros entre ambos seguimientos</p></div>
      <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"><RefreshCw className="w-4 h-4" /> Actualizar</button>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-5 flex items-start gap-2"><MessageSquareOff className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" /><p className="text-xs text-amber-900">Los mensajes automáticos de WhatsApp están pausados. Esta pantalla solo consulta y actualiza estados; no envía mensajes.</p></div>
    <div className="flex gap-2 mb-4 flex-wrap">
      <button onClick={() => setSource('email')} className={\`px-4 py-2 rounded-xl text-sm font-semibold \${source === 'email' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}\`}>Checkout / correo ({emailCarts.length})</button>
      <button onClick={() => setSource('tracking')} className={\`px-4 py-2 rounded-xl text-sm font-semibold \${source === 'tracking' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}\`}>Seguimiento ({trackingCarts.length})</button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {[
        { label: 'Pendientes', value: stats.pendientes, color: 'text-amber-700', bg: 'bg-amber-50' },
        { label: 'Contactados', value: stats.contactados, color: 'text-blue-700', bg: 'bg-blue-50' },
        { label: 'Recuperados', value: stats.recuperados, color: 'text-green-700', bg: 'bg-green-50' },
        { label: 'Valor no recuperado', value: \`RD$\${stats.valor.toLocaleString('es-DO')}\`, color: 'text-red-700', bg: 'bg-red-50' },
      ].map(s => <div key={s.label} className={\`\${s.bg} rounded-2xl p-4\`}><p className={\`text-2xl font-black \${s.color}\`}>{s.value}</p><p className="text-xs text-gray-500 mt-0.5">{s.label}</p></div>)}
    </div>
    <div className="relative mb-4"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, teléfono o email..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" /></div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-100"><tr>{['Cliente','Teléfono','Productos','Total','Estado','Fecha','Acción'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-gray-50">
        {loading ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Cargando...</td></tr> :
          filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">No hay registros en esta sección.</td></tr> :
          filtered.map(c => {
            const mins = Math.max(0, Math.round((Date.now() - new Date(c.created_at).getTime()) / 60000))
            return <tr key={\`\${c.source}-\${c.id}\`} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 font-semibold text-gray-900">{c.nombre ?? '—'}</td><td className="px-4 py-3 text-gray-600 text-xs font-mono">{c.telefono ?? '—'}</td>
              <td className="px-4 py-3"><p className="text-xs text-gray-600 truncate max-w-[180px]">{formatItems(c.items)}</p></td><td className="px-4 py-3 font-bold text-gray-900">RD$\{c.total.toLocaleString('es-DO')}</td>
              <td className="px-4 py-3">{c.recuperado ? <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">Recuperado</span> : c.contactado ? <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">Contactado</span> : <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">Pendiente</span>}</td>
              <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{mins < 60 ? \`hace \${mins} min\` : \`hace \${Math.round(mins / 60)} h\`}</td>
              <td className="px-4 py-3">{!c.recuperado && <button onClick={() => marcarRecuperado(c)} className="px-2 py-1 text-xs font-semibold bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100">Marcar recuperado</button>}</td>
            </tr>
          })
        }
      </tbody>
    </table></div></div>
  </div>
}
