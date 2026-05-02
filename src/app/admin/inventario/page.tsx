import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function InventarioPage() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')
  const { data: productos } = await sb.from('products').select('*').order('tipo').order('nombre')
  const total = (productos ?? []).length
  const sinStock = (productos ?? []).filter((p: any) => p.stock === 0).length
  const stockBajo = (productos ?? []).filter((p: any) => p.stock > 0 && p.stock <= (p.stock_minimo ?? 5)).length
  const stockOk = (productos ?? []).filter((p: any) => p.stock > (p.stock_minimo ?? 5)).length
  const valorTotal = (productos ?? []).reduce((acc: number, p: any) => acc + (p.precio * p.stock), 0)
  const TIPO_LABEL: Record<string, string> = { esferico:'Esferico',torico:'Torico',multifocal:'Multifocal',color:'Color',solucion:'Solucion',gota:'Gotas' }
  const TIPO_COLOR: Record<string, string> = { esferico:'bg-blue-50 text-blue-700',torico:'bg-purple-50 text-purple-700',multifocal:'bg-indigo-50 text-indigo-700',color:'bg-pink-50 text-pink-700',solucion:'bg-cyan-50 text-cyan-700',gota:'bg-teal-50 text-teal-700' }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Inventario</h1><p className="text-gray-500">{total} productos activos</p></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Sin Stock</p><p className="text-3xl font-bold text-red-500">{sinStock}</p></div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Stock Bajo</p><p className="text-3xl font-bold text-yellow-500">{stockBajo}</p></div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Stock Normal</p><p className="text-3xl font-bold text-green-500">{stockOk}</p></div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-1">Valor Inventario</p><p className="text-xl font-bold text-gray-900">RD${valorTotal.toLocaleString()}</p></div>
          </div>
          {(sinStock > 0 || stockBajo > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="font-semibold text-amber-800 mb-2">Alertas de inventario</p>
              {(productos ?? []).filter((p: any) => p.stock === 0).map((p: any) => (<p key={p.id} className="text-sm text-red-700">Sin stock: {p.nombre}</p>))}
              {(productos ?? []).filter((p: any) => p.stock > 0 && p.stock <= (p.stock_minimo ?? 5)).map((p: any) => (<p key={p.id} className="text-sm text-amber-700">Stock bajo: {p.nombre} — {p.stock} unidades</p>))}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['SKU','Producto','Tipo','Subcategoria','Marca','Precio','Costo','Margen','Stock','Estado'].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(productos ?? []).map((p: any) => {
                    const margen = p.costo > 0 ? Math.round(((p.precio - p.costo) / p.precio) * 100) : 0
                    const stockMin = p.stock_minimo ?? 5
                    const ss = p.stock === 0 ? 'sin' : p.stock <= stockMin ? 'bajo' : 'ok'
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4"><span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-400">{p.sku ?? '-'}</span></td>
                        <td className="px-5 py-4 font-semibold text-gray-900 text-sm">{p.nombre}</td>
                        <td className="px-5 py-4"><span className={"px-2 py-1 rounded-lg text-xs font-semibold " + (TIPO_COLOR[p.tipo] ?? 'bg-gray-100 text-gray-600')}>{TIPO_LABEL[p.tipo] ?? p.tipo}</span></td>
                        <td className="px-5 py-4 text-sm text-gray-500">{p.subcategoria ?? '-'}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-600">{p.marca}</td>
                        <td className="px-5 py-4 text-right font-semibold text-sm">RD${p.precio?.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right text-sm text-gray-500">{p.costo > 0 ? 'RD$'+p.costo?.toLocaleString() : '-'}</td>
                        <td className="px-5 py-4 text-right"><span className={"text-sm font-bold "+(margen>=40?'text-green-600':margen>=20?'text-yellow-600':'text-red-500')}>{p.costo>0?margen+'%':'-'}</span></td>
                        <td className="px-5 py-4 text-center"><span className={"text-lg font-bold "+(ss==='sin'?'text-red-500':ss==='bajo'?'text-yellow-500':'text-green-600')}>{p.stock}</span><p className="text-xs text-gray-400">min:{stockMin}</p></td>
                        <td className="px-5 py-4 text-center"><span className={"px-2 py-1 rounded-full text-xs font-semibold "+(p.activo?'bg-green-50 text-green-700':'bg-gray-100 text-gray-400')}>{p.activo?'Activo':'Inactivo'}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
