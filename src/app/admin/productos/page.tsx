'use client'
import { useState, useEffect } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'
import { Plus, Edit, Trash2, Search, Eye, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const TIPOS = ['esferico','torico','multifocal','color','solucion','gota'] as const

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ nombre:'', marca:'', precio:'', costo:'', stock:'', tipo:'esferico' as typeof TIPOS[number], descripcion:'', imagen_url:'' })
  const [uploading, setUploading] = useState(false)

  const sb = createClient()

  const load = async () => {
    const { data } = await sb.from('products').select('*, categories(*)').order('nombre')
    setProducts(data ?? []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ nombre: p.nombre, marca: p.marca ?? '', precio: String(p.precio), costo: String(p.costo ?? 0), stock: String(p.stock), tipo: (p.tipo ?? 'esferico') as any, descripcion: p.descripcion ?? '', imagen_url: p.imagen_url ?? '' })
    setShowForm(true)
  }


  const uploadImage = async (file: File) => {
    setUploading(true)
    const sb = createClient()
    const ext = file.name.split('.').pop()
    const path = `product-${Date.now()}.${ext}`
    const { error } = await sb.storage.from('products').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = sb.storage.from('products').getPublicUrl(path)
      setForm(f => ({ ...f, imagen_url: data.publicUrl }))
    }
    setUploading(false)
  }

  const save = async () => {
    const payload = { nombre: form.nombre, marca: form.marca, precio: parseFloat(form.precio), costo: parseFloat(form.costo), stock: parseInt(form.stock), tipo: form.tipo, descripcion: form.descripcion, imagen_url: form.imagen_url || null }
    if (editing) {
      const { error } = await sb.from('products').update(payload).eq('id', editing.id)
      if (!error) { toast.success('Producto actualizado'); setShowForm(false); setEditing(null); load() }
      else toast.error('Error al actualizar')
    } else {
      const { error } = await sb.from('products').insert([{ ...payload, activo: true }])
      if (!error) { toast.success('Producto creado'); setShowForm(false); load() }
      else toast.error('Error al crear')
    }
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return
    await sb.from('products').update({ activo: false }).eq('id', id)
    toast.success('Producto desactivado'); load()
  }

  const filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.marca ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Productos</h1>
              <p className="text-gray-500 text-sm">{products.length} productos</p>
            </div>
            <button onClick={() => { setEditing(null); setForm({ nombre:'',marca:'',precio:'',costo:'',stock:'',tipo:'esferico',descripcion:'' }); setShowForm(true) }}
              className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nuevo producto
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-5 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..." className="input !pl-9" />
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Producto','Marca','Tipo','Precio','Costo','Stock','Estado','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-900 text-xs leading-snug max-w-xs">{p.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.marca ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary-100 text-primary-700 capitalize">{p.tipo}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold">RD${p.precio.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">RD${(p.costo ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                          {p.stock}
                          {p.stock <= 5 && p.stock > 0 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => del(p.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-5">
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre</label>
                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Marca</label>
                  <input value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as any }))} className="input">
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Precio RD$</label>
                  <input type="number" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Costo RD$</label>
                  <input type="number" value={form.costo} onChange={e => setForm(f => ({ ...f, costo: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Descripción</label>
                <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Imagen del producto</label>
                {form.imagen_url && <img src={form.imagen_url} alt="preview" className="w-20 h-20 object-cover rounded-lg mb-2" />}
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  className="input text-sm" />
                {uploading && <p className="text-xs text-primary-500 mt-1">Subiendo imagen...</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Descripcion</label>
                <textarea rows={2} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} className="input resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={save} className="btn-primary flex-1">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
