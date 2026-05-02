import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function InventarioPage() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: productos } = await sb.from('products')
    .select('*')
    .order('stock', { ascending: true })

  const sinStock = (productos ?? []).filter((p: any) => p.stock === 0).length
  const stockBajo = (productos ?? []).filter((p: any) => p.stock > 0 && p.stock <= 5).length
  const stockOk = (productos ?? []).filter((p: any) => p.stock > 5).length

  return (
    <>
      <AdminNav />
      <main className="ml-64 p-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-500">{productos?.length ?? 0} productos en total</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-red-600 font-bold text-2xl">{sinStock}</p>
            <p className="text-red-500 text-sm font-medium mt-1">Sin stock</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
            <p className="text-yellow-600 font-bold text-2xl">{stockBajo}</p>
            <p className="text-yellow-500 text-sm font-medium mt-1">Stock bajo (1-5)</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-green-600 font-bold text-2xl">{stockOk}</p>
            <p className="text-green-500 text-sm font-medium mt-1">Stock normal</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Marca</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(productos ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{p.marca}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold capitalize">{p.tipo}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">RD${p.precio?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-lg ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-yellow-500' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
