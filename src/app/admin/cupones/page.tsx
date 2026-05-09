'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Plus, Tag, Trash2, X, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface Cupon {
  id: string
  codigo: string
  tipo: 'porcentaje' | 'fijo'
  valor: number
  activo: boolean
  usos_actuales: number
  uso_maximo: number | null
  fecha_expira: string | null
  created_at: string
}

export default function CuponesPage() {
  const sb = createClient()
  const [cupones, setCupones] = useState<Cupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ codigo: '', tipo: 'porcentaje', valor: '', limite_usos: '', fecha_expira: '' })

  useEffect(() => {
    sb.from('coupons').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCupones(data ?? []); setLoading(false) })
  }, [])

  const generarCodigo = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setForm(f => ({ ...f, codigo: code }))
  }

  const guardar = async () => {
    if (!form.codigo || !form.valor) { toast.error('Código y valor requeridos'); return }
    const { data, error } = await sb.from('coupons').insert({
      codigo: form.codigo.toUpperCase().trim(),
      tipo: form.tipo,
      valor: parseFloat(form.valor),
      uso_maximo: form.limite_usos ? parseInt(form.limite_usos) : null,
      limite_usos: form.limite_usos ? parseInt(form.limite_usos) : null,
      valido_hasta: form.fecha_expira || null,
      fecha_expira: form.fecha_expira || null,
      activo: true,
      usos_actuales: 0,
    }).select().single()
    if (error) { toast.error(error.message); return }
    setCupones(c => [data, ...c])
    setForm({ codigo: '', tipo: 'porcentaje', valor: '', limite_usos: '', fecha_expira: '' })
    setShowForm(false)
    toast.success('Cupón creado')
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    await sb.from('coupons').update({ activo: !activo }).eq('id', id)
    setCupones(c => c.map(x => x.id === id ? { ...x, activo: !activo } : x))
    toast.success(!activo ? 'Cupón activado' : 'Cupón desactivado')
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este cupón?')) return
    await sb.from('coupons').delete().eq('id', id)
    setCupones(c => c.filter(x => x.id !== id))
    toast.success('Cupón eliminado')
  }

  const copiar = (codigo: string) => {
    navigator.clipboard.writeText(codigo)
    toast.success('Código copiado')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-5xl mx-auto p-4 md:p-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Cupones</h1>
              <p className="text-gray-400 text-sm mt-0.5">{cupones.filter(c => c.activo).length} activos</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" /> Nuevo cupón
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Crear cupón</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Código</label>
                  <div className="flex gap-2">
                    <input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                      placeholder="DESCUENTO10"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                    <button onClick={generarCodigo} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-colors">Auto</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="fijo">Monto fijo (RD$)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                    Valor {form.tipo === 'porcentaje' ? '(%)' : '(RD$)'}
                  </label>
                  <input value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                    type="number" placeholder={form.tipo === 'porcentaje' ? '10' : '500'}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Límite de usos</label>
                  <input value={form.uso_maximo} onChange={e => setForm(f => ({ ...f, limite_usos: e.target.value }))}
                    type="number" placeholder="Sin límite"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Fecha de expiración</label>
                  <input value={form.fecha_expira} onChange={e => setForm(f => ({ ...f, fecha_expira: e.target.value }))}
                    type="date"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={guardar}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Crear cupón
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : cupones.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Sin cupones</p>
                <p className="text-sm mt-1">Crea tu primer cupón de descuento</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Código', 'Descuento', 'Usos', 'Expira', 'Estado', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cupones.map(c => {
                      const expirado = c.fecha_expira && new Date(c.fecha_expira) < new Date()
                      const agotado  = c.limite_usos != null && c.usos >= c.limite_usos
                      return (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg text-sm">{c.codigo}</span>
                              <button onClick={() => copiar(c.codigo)} className="text-gray-400 hover:text-gray-600">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {c.tipo === 'porcentaje' ? `${c.valor}%` : `RD$${c.valor.toLocaleString()}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {c.usos_actuales} {c.limite_usos != null ? `/ ${c.uso_maximo}` : '/ ∞'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {c.fecha_expira ? new Date(c.fecha_expira).toLocaleDateString('es-DO') : '—'}
                          </td>
                          <td className="px-4 py-3">
                            {expirado ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Expirado</span>
                            ) : agotado ? (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">Agotado</span>
                            ) : (
                              <button onClick={() => toggleActivo(c.id, c.activo)}
                                className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${c.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                {c.activo ? 'Activo' : 'Inactivo'}
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => eliminar(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
