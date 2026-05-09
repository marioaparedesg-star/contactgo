'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import { Users, Plus, Trash2, Shield, Eye, EyeOff, Check, X, Mail, Phone, Building2, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'admin',       label: 'Administrador',       desc: 'Acceso total a todo el sistema', icon: Crown, color: 'text-amber-600 bg-amber-50' },
  { value: 'operaciones', label: 'Operaciones',          desc: 'Pedidos, inventario, envíos',    icon: Building2, color: 'text-blue-600 bg-blue-50' },
  { value: 'ventas',      label: 'Ventas',               desc: 'Reportes y clientes',            icon: Users, color: 'text-green-600 bg-green-50' },
  { value: 'soporte',     label: 'Soporte',              desc: 'Pedidos y clientes (solo lectura)', icon: Shield, color: 'text-purple-600 bg-purple-50' },
]

const DEPARTAMENTOS = ['Administración', 'Operaciones', 'Ventas', 'Soporte', 'Contabilidad', 'Marketing']

const PERMISOS: Record<string, string[]> = {
  admin:       ['Pedidos', 'Suscripciones', 'Productos', 'Inventario', 'Clientes', 'Reportes', 'Cupones', 'Configuración'],
  operaciones: ['Pedidos', 'Suscripciones', 'Inventario'],
  ventas:      ['Pedidos', 'Clientes', 'Reportes', 'Cupones'],
  soporte:     ['Pedidos', 'Clientes'],
}

export default function ConfiguracionPage() {
  const sb = createClient()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [form, setForm] = useState({
    nombre: '', email: '', password: '', telefono: '',
    role: 'operaciones', departamento: 'Operaciones',
  })

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setCurrentUser(data.user))
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    const { data } = await sb.from('profiles')
      .select('*')
      .in('role', ['admin', 'operaciones', 'ventas', 'soporte'])
      .order('role')
    setUsuarios(data ?? [])
    setLoading(false)
  }

  const crearUsuario = async () => {
    if (!form.nombre || !form.email || !form.password) {
      toast.error('Nombre, email y contraseña son requeridos')
      return
    }
    setSaving(true)
    try {
      // Crear usuario en Supabase Auth via API route
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.error ?? 'Error creando usuario'); return }
      toast.success(`Usuario ${form.nombre} creado correctamente`)
      setShowForm(false)
      setForm({ nombre: '', email: '', password: '', telefono: '', role: 'operaciones', departamento: 'Operaciones' })
      cargarUsuarios()
    } finally {
      setSaving(false)
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    await sb.from('profiles').update({ activo: !activo }).eq('id', id)
    setUsuarios(us => us.map(u => u.id === id ? { ...u, activo: !activo } : u))
    toast.success(activo ? 'Usuario desactivado' : 'Usuario activado')
  }

  const cambiarRol = async (id: string, role: string) => {
    await sb.from('profiles').update({ role }).eq('id', id)
    setUsuarios(us => us.map(u => u.id === id ? { ...u, role } : u))
    toast.success('Rol actualizado')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-4xl mx-auto p-4 md:p-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Configuración</h1>
              <p className="text-gray-400 text-sm mt-0.5">Gestión de usuarios y accesos</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" /> Nuevo usuario
            </button>
          </div>

          {/* Roles disponibles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {ROLES.map(r => (
              <div key={r.value} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${r.color}`}>
                  <r.icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-gray-900 text-sm">{r.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{r.desc}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {PERMISOS[r.value]?.slice(0, 3).map(p => (
                    <span key={p} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">{p}</span>
                  ))}
                  {(PERMISOS[r.value]?.length ?? 0) > 3 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">+{PERMISOS[r.value].length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Lista usuarios */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">Usuarios del sistema</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {usuarios.map(u => {
                  const rol = ROLES.find(r => r.value === u.role)
                  const isMe = u.id === currentUser?.id
                  return (
                    <div key={u.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-white font-black text-sm">{(u.nombre ?? u.email ?? '?')[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm">{u.nombre ?? '—'}</p>
                          {isMe && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Tú</span>}
                          {!u.activo && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Inactivo</span>}
                        </div>
                        <p className="text-xs text-gray-400">{u.email}</p>
                        {u.departamento && <p className="text-xs text-gray-400">{u.departamento}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!isMe ? (
                          <select value={u.role} onChange={e => cambiarRol(u.id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none">
                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rol?.color ?? 'bg-gray-100 text-gray-600'}`}>{rol?.label}</span>
                        )}
                        {!isMe && (
                          <button onClick={() => toggleActivo(u.id, u.activo !== false)}
                            className={`p-2 rounded-lg transition-colors ${u.activo !== false ? 'bg-green-50 hover:bg-green-100 text-green-600' : 'bg-red-50 hover:bg-red-100 text-red-500'}`}>
                            {u.activo !== false ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {usuarios.length === 0 && (
                  <div className="py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No hay usuarios admin. Crea el primero.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal crear usuario */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-900">Nuevo usuario</p>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre completo</label>
                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Mario Paredes"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="usuario@contactgo.net"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Contraseña temporal</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Rol</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Departamento</label>
                  <select value={form.departamento} onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mt-1">
                <p className="text-xs font-semibold text-gray-600 mb-1">Permisos del rol seleccionado:</p>
                <div className="flex flex-wrap gap-1">
                  {PERMISOS[form.role]?.map(p => (
                    <span key={p} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">{p}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                Cancelar
              </button>
              <button onClick={crearUsuario} disabled={saving}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
                {saving ? 'Creando...' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
