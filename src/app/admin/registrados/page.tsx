'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Mail, Phone, ShoppingBag, Calendar, Search, MessageCircle, Star } from 'lucide-react'

const GOOGLE_REVIEW = 'https://g.page/r/Cb-RwE6S9vzgEAE/review'

export default function RegistradosPage() {
  const sb = createClient()
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    sb.from('profiles')
      .select('id,nombre,email,telefono,created_at,role,activo')
      .order('created_at', { ascending: false })
      .then(async ({ data: profiles }) => {
        const ps = profiles ?? []
        const ids = ps.map((p: any) => p.id)
        const { data: ords } = ids.length > 0
          ? await sb.from('orders').select('user_id,total,pago_estado,numero_orden,created_at').in('user_id', ids)
          : { data: [] }

        const ordMap: Record<string, any[]> = {}
        ;(ords ?? []).forEach((o: any) => {
          if (!ordMap[o.user_id]) ordMap[o.user_id] = []
          ordMap[o.user_id].push(o)
        })

        setUsers(ps.map((p: any) => {
          const userOrds = ordMap[p.id] ?? []
          const pagadas  = userOrds.filter((o: any) => o.pago_estado === 'pagado')
          return { ...p, ordenes: userOrds.length, pagadas: pagadas.length, ltv: pagadas.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0) }
        }))
        setLoading(false)
      })
  }, [])

  const filtered = users.filter(u =>
    !search || u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) || u.telefono?.includes(search)
  )

  const waMsg = (u: any) =>
    `https://wa.me/${u.telefono?.replace(/\D/g,'')}?text=${encodeURIComponent(
      `Hola ${u.nombre?.split(' ')[0] ?? ''}! 👋 Somos ContactGo. Vimos que te registraste en nuestro sitio. ¿Podemos ayudarte a encontrar tus lentes? 😊`
    )}`

  const totalLTV = users.reduce((s, u) => s + (u.ltv ?? 0), 0)
  const conCompra = users.filter(u => u.pagadas > 0).length
  const sinCompra = users.filter(u => u.pagadas === 0).length

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        <div>
          <h1 className="text-2xl font-black text-gray-900">👥 Clientes registrados</h1>
          <p className="text-gray-500 text-sm">{users.length} usuarios · RD${totalLTV.toLocaleString()} LTV total</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total registrados', value: users.length, color: 'text-gray-900' },
            { label: 'Con compra', value: conCompra, color: 'text-green-600' },
            { label: 'Sin compra aún', value: sinCompra, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg ?? 'bg-white'} rounded-2xl border border-gray-100 shadow-sm p-4 text-center`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 bg-white" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(u => (
              <div key={u.id} className={`bg-white rounded-2xl border shadow-sm p-4 ${u.pagadas > 0 ? 'border-green-100' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${u.pagadas > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {u.pagadas > 0 ? '🛍️' : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{u.nombre ?? 'Sin nombre'}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.pagadas > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {u.pagadas > 0 ? '✅ Cliente activo' : '⏳ Sin compra'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        {u.email && <a href={`mailto:${u.email}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600"><Mail className="w-3 h-3" />{u.email}</a>}
                        {u.telefono && <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{u.telefono}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.created_at).toLocaleDateString('es-DO', { day:'numeric', month:'short', year:'numeric' })}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {u.ordenes} órdenes · {u.pagadas} pagada{u.pagadas !== 1 ? 's' : ''}
                        </span>
                        {u.ltv > 0 && <span className="text-[11px] font-bold text-green-700">LTV: RD${u.ltv.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    {u.telefono && (
                      <a href={waMsg(u)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}
                    {u.pagadas > 0 && (
                      <a href={GOOGLE_REVIEW} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors">
                        <Star className="w-3.5 h-3.5" /> Pedir reseña
      </a>
                    )}
                    {u.email && (
                      <a href={`mailto:${u.email}`}
                        className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
