'use client'
import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Users, Clock, Gift, Ticket, Search, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

type Referral = {
  id: string
  status: string
  created_at: string
  rewarded_at: string | null
  referral_code: string
  friend_coupon_code: string | null
  referrer_coupon_code: string | null
  inviter: { nombre: string | null; email: string | null } | null
  referred: { nombre: string | null; email: string | null } | null
  friend_coupon: { activo: boolean; usos_actuales: number; uso_maximo: number; valor: number; fecha_expira: string | null } | null
  reward_coupon: { activo: boolean; usos_actuales: number; uso_maximo: number; valor: number; fecha_expira: string | null } | null
  order: { numero_orden: string; estado: string; pago_estado: string; total: number; created_at: string; es_prueba: boolean } | null
}

export default function AdminReferidosPage() {
  const [rows, setRows] = useState<Referral[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, rewarded: 0, friendCouponsUsed: 0, rewardCouponsUsed: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/referrals', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'No se pudo cargar')
      setRows(json.referrals ?? [])
      setStats(json.stats ?? { total: 0, pending: 0, rewarded: 0, friendCouponsUsed: 0, rewardCouponsUsed: 0 })
    } catch (error: any) {
      toast.error(error.message || 'Error cargando referidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter((r) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || [r.inviter?.nombre, r.inviter?.email, r.referred?.nombre, r.referred?.email, r.friend_coupon_code, r.referrer_coupon_code, r.order?.numero_orden]
      .some((v) => String(v ?? '').toLowerCase().includes(term))
    return matchesSearch && (filter === 'all' || r.status === filter)
  })

  const money = (n: number) => `RD$${Number(n || 0).toLocaleString('es-DO')}`
  const statusLabel = (s: string) => s === 'rewarded' ? 'Recompensa generada' : s === 'pending' ? 'Pendiente de compra' : s

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Programa de referidos</h1>
          <p className="text-sm text-gray-500 mt-1">Invitadores, clientes referidos, cupones y compras atribuidas.</p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/> Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Referidos registrados', value: stats.total, icon: Users },
          { label: 'Pendientes', value: stats.pending, icon: Clock },
          { label: 'Recompensas generadas', value: stats.rewarded, icon: Gift },
          { label: 'Cupones amigo usados', value: stats.friendCouponsUsed, icon: Ticket },
          { label: 'Cupones invitador usados', value: stats.rewardCouponsUsed, icon: Gift },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <Icon className="w-5 h-5 text-gray-400 mb-3"/>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar invitador, referido, cupón u orden" className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-3 text-sm"/>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="rewarded">Recompensa generada</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? <div className="py-16 text-center text-sm text-gray-500">Cargando actividad de referidos…</div> :
          filtered.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <Users className="w-9 h-9 text-gray-300 mx-auto mb-3"/>
              <p className="font-semibold text-gray-800">{rows.length ? 'No hay resultados para este filtro' : 'Todavía no hay referidos registrados'}</p>
              <p className="text-sm text-gray-500 mt-1 max-w-lg mx-auto">
                Cuando una persona cree su cuenta desde un enlace de invitación, aparecerá aquí. También podrás ver el cupón de RD$150, la compra que lo activó y la recompensa de RD$300.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <div key={r.id} className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr] gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-2">Invitador</p>
                    <p className="font-semibold text-gray-900">{r.inviter?.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-500 break-all">{r.inviter?.email || '—'}</p>
                    <p className="text-xs text-gray-500 mt-1">Código: <span className="font-mono">{r.referral_code}</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-2">Cliente referido</p>
                    <p className="font-semibold text-gray-900">{r.referred?.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-500 break-all">{r.referred?.email || '—'}</p>
                    <p className="text-xs text-gray-500 mt-1">Registro: {new Date(r.created_at).toLocaleDateString('es-DO')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-2">Cupones</p>
                    <p className="text-xs text-gray-700">Amigo: <span className="font-mono">{r.friend_coupon_code || '—'}</span></p>
                    <p className="text-xs text-gray-500">{r.friend_coupon ? `${money(r.friend_coupon.valor)} · ${r.friend_coupon.usos_actuales}/${r.friend_coupon.uso_maximo} usos` : 'Cupón no encontrado'}</p>
                    <p className="text-xs text-gray-700 mt-2">Invitador: <span className="font-mono">{r.referrer_coupon_code || '—'}</span></p>
                    <p className="text-xs text-gray-500">{r.reward_coupon ? `${money(r.reward_coupon.valor)} · ${r.reward_coupon.usos_actuales}/${r.reward_coupon.uso_maximo} usos` : 'Se genera al pagarse la compra'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-2">Estado y compra</p>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === 'rewarded' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{statusLabel(r.status)}</span>
                    {r.order ? <div className="mt-2 text-xs text-gray-600">
                      <p className="font-semibold">{r.order.numero_orden || 'Orden atribuida'}</p>
                      <p>{r.order.pago_estado} · {money(r.order.total)}</p>
                      <p>{new Date(r.order.created_at).toLocaleDateString('es-DO')}</p>
                    </div> : <p className="text-xs text-gray-500 mt-2">Sin compra atribuida pagada</p>}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
      <p className="text-xs text-gray-400">Esta vista solo está disponible para usuarios con rol administrativo. Los datos se consultan directamente desde la base de datos.</p>
    </div>
  )
}
