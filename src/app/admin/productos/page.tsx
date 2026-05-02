'use client'
import { useState, useEffect, useRef } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/types'
import { Plus, Edit, Trash2, Search, Eye, AlertTriangle, Download, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

const TIPOS = ['esferico','torico','multifocal','color','solucion','gota'] as const
const SUBCATS = ['Diario','Quincenal','Mensual','Color','Multiproposito','Peroxido','Lagrima artificial','Otro']

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ nombre:'', marca:'', precio:'', costo:'', stock:'', stock_minimo:'5', tipo:'esferico' as typeof TIPOS[number], subcategoria:'', sku:'', descripcion:'' })

  const sb = createClient()

  const load = async () => {
    const { data } = await sb.from('products').select('*').order('tipo').order('nombre')
    setProducts(data ?? [])
  }

  useEffect(() => { load() }, [])

  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ nombre: p.nombre, marca: p.marca??''  , precio: String(p.precio), costo: String(p.costo??0), stock: String(p.stock), stock_minimo: String(p.stock_minimo??5), tipo: (p.tipo??'esferico') as any, subcategoria: p.subcategoria??'', sku: p.sku??'', descripcion: p.descripcion??''  })
    setShowForm(true)
  }

  const save = async () => {
    const payload: any = { nombre: form.nombre, marca: form.marca, precio: parseFloat(form.precio), costo: parseFloat(form.costo), stock: parseInt(form.stock), stock_minimo: parseInt(form.stock_minimo)||5, tipo: form.tipo, subcategoria: form.subcategoria||null, sku: form.sku||null, descripcion: form.descripcion||null }
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
    if (!confirm('Desactivar producto?')) return
    await sb.from('products').update({ activo: false }).eq('id', id)
    toast.success('Producto desactivado'); load()
  }

  const exportCSV = () => {
    const headers = ['nombre','marca','tipo','subcategoria','sku','precio','costo','stock','stock_minimo','descripcion','activo']
    const rows = products.map(p => headers.map(h => {
      const v = (p as any)[h]
      return typeof v === 'string' && v.includes(',') ? `"${v}"` : (v ?? '')
    }).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'productos_contactgo.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Archivo descargado')
  }

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const text = await file.text()
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''))
    let created = 0; let updated = 0; let errors = 0
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/"/g,''))
      const row: any = {}
      headers.forEach((h, idx) => { row[h] = vals[idx] ?? '' })
      if (!row.nombre) continue
      const payload: any = {
        nombre: row.nombre, marca: row.marca||null, tipo: row.tipo||'esferico',
        subcategoria: row.subcategoria||null, sku: row.sku||null,
        precio: parseFloat(row.precio)||0, costo: parseFloat(row.costo)||0,
        stock: parseInt(row.stock)||0, stock_minimo: parseInt(row.stock_minimo)||5,
        descripcion: row.descripcion||null, activo: row.activo!=='false'
      }
      const { data: existing } = await sb.from('products').select('id').eq('nombre', row.nombre).single()
      if (existing) {
        const { error } = await sb.from('products').update(payload).eq('id', existing.id)
        if (!error) updated++; else errors++
      } else {
        const { error } = await sb.from('products').insert([payload])
        if (!error) created++; else errors++
      }
    }
    setImporting(false)
    toast.success(`Importado: ${created} creados, ${updated} actualizados${errors > 0 ? \`, ${errors} errores\` : ''}`)
    load()
    if (fileRef.current) fileRef.current.value = ''
  }

  const filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.marca ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const TIPO_COLOR: Record<string, string> = { esferico:'bg-blue-50 text-blue-700',torico:'bg-purple-50 text-purple-700',multifocal:'bg-indigo-50 text-indigo-700',color:'bg-pink-50 text-pink-700',solucion:'bg-cyan-50 text-cyan-700',gota:'bg-teal-50 text-teal-700' }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
              <p className="text-gray-500 text-sm">{products.length} productos</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
              <label className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer " + (importing ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                <Upload className="w-4 h-4" /> {importing ? 'Importando...' : 'Importar CSV'}
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={importCSV} disabled={importing} />
              </label>
              <button onClick={() => { setEditing(null); setForm({ nombre:'',marca:'',precio:'',costo:'',stock:'',stock_minimo:'5',tipo:'esferico',subcategoria:'',sku:'',descripcion:'' }); setShowForm(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Nuevo producto
              </button>
            </div>
          </div>

          <div className="relative mb-5 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="input !pl-9" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['SKU','Producto','Tipo','Subcategoria','Precio','Costo','Margen','Stock','Estado','Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p: any) => {
                    const margen = p.costo > 0 ? Math.round(((p.precio - p.costo) / p.precio) * 100) : 0
                    const stockMin = p.stock_minimo ?? 5
                    const ss = p.stock === 0 ? 'sin' : p.stock <= stockMin ? 'bajo' : 'ok'
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3"><span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-400">{p.sku??'—'}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {p.imagen_url ? <img src={p.imagen_url} className="w-8 h-8 rounded-lg object-cover" alt="" /> : <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Eye className="w-3 h-3 text-gray-400" /></div>}
                            <span className="font-medium text-gray-900 text-xs">{p.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={"px-2 py-1 rounded-lg text-xs font-semibold "+(TIPO_COLOR[p.tipo]??'bg-gray-100 text-gray-600')}>{p.tipo}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{p.subcategoria??'—'}</td>
                        <td className="px-4 py-3 font-semibold text-sm">RD${p.precio?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{p.costo>0?'RD$'+p.costo?.toLocaleString():'—'}</td>
                        <td className="px-4 py-3"><span className={"text-sm font-bold "+(margen>=40?'text-green-600':margen>=20?'text-yellow-600':'text-red-500')}>{p.costo>0?margen+'%':'—'}</span></td>
                        <td className="px-4 py-3">
                          <span className={"font-bold "+(ss==='sin'?'text-red-500':ss==='bajo'?'text-yellow-500':'text-green-600')}>{p.stock}</span>
                          {ss!=='ok' && <AlertTriangle className="w-3 h-3 inline ml-1 text-amber-400" />}
                          <p className="text-xs text-gray-400">min:{stockMin}</p>
                        </td>
                        <td className="px-4 py-3"><span className={"px-2 py-1 rounded-full text-xs font-semibold "+(p.activo?'bg-green-50 text-green-700':'bg-gray-100 text-gray-400')}>{p.activo?'Activo':'Inactivo'}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => del(p.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Nombre</label>
                <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Marca</label>
                  <input value={form.marca} onChange={e => setForm(f => ({...f, marca: e.target.value}))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))} className="input" placeholder="Ej: AOY-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value as any}))} className="input">
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Subcategoria</label>
                  <select value={form.subcategoria} onChange={e => setForm(f => ({...f, subcategoria: e.target.value}))} className="input">
                    <option value="">-- Selecciona --</option>
                    {SUBCATS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Precio RD$</label>
                  <input type="number" value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Costo RD$</label>
                  <input type="number" value={form.costo} onChange={e => setForm(f => ({...f, costo: e.target.value}))} className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Stock Minimo</label>
                <input type="number" value={form.stock_minimo} onChange={e => setForm(f => ({...f, stock_minimo: e.target.value}))} className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Descripcion</label>
                <textarea rows={2} value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion: e.target.value}))} className="input resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
