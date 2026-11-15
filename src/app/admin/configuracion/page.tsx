'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Plus, Shield, Eye, EyeOff, Check, X, Mail, Phone, Building2, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

const DEPARTAMENTOS = ['Administración', 'Operaciones', 'Ventas', 'Soporte', 'Contabilidad', 'Marketing']

export default function ConfiguracionPage() {
  const sb = createClient()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '', departamento: 'Administración' })

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setCurrentUser(data.user))
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    setLoading(true)
    const { data, error } = await sb.from('profiles')
      .select('id,nombre,email,telefono,role,departamento,activo,created_at')
      .eq('role', 'admin').order('created_at', { ascending: true })
    if (error) toast.error('No se pudo cargar la lista de administradores')
    setUsuarios(data ?? [])
    setLoading(false)
  }

  const crearUsuario = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password) {
      toast.error('Nombre, email y contraseña son requeridos')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.error ?? 'Error creando administrador'); return }
      toast.success('Administrador creado correctamente')
      setShowForm(false)
      setForm({ nombre: '', email: '', password: '', telefono: '', departamento: 'Administración' })
      await cargarUsuarios()
    } catch {
      toast.error('Error de conexión al crear administrador')
    } finally {
      setSaving(false)
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id, activo: !activo }),
      })
      const result = await res.json()
      if (!res.ok) { toast.error(result.error ?? 'No se pudo actualizar el acceso'); return }
      toast.success(activo ? 'Acceso revocado' : 'Acceso habilitado')
      await cargarUsuarios()
    } catch {
      toast.error('Error de conexión al actualizar acceso')
    }
  }

  return <div className="w-full max-w-5xl mx-auto">
    <div className="flex items-center justify-between gap-4 mb-6">
      <div><h1 className="text-2xl font-black text-gray-900">Configuración</h1><p className="text-gray-500 text-sm mt-1">Administradores y control de acceso</p></div>
      <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"><Plus className="w-4 h-4" /> Nuevo administrador</button>
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
      <div className="flex items-start gap-3"><Shield className="w-5 h-5 text-blue-700 mt-0.5" /><div>
        <p className="font-semibold text-blue-900 text-sm">Acceso administrativo protegido</p>
        <p className="text-blue-800 text-xs mt-1">El sistema solo reconoce el rol Administrador. Operaciones, Ventas y Soporte se habilitarán cuando existan permisos específicos en páginas, API y base de datos. No se asignarán roles que aparenten funcionar sin estar protegidos.</p>
      </div></div>
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100"><p className="font-bold text-gray-900">Administradores del sistema</p><p className="text-xs text-gray-500 mt-1">Solo las cuentas activas pueden entrar al panel o ejecutar operaciones administrativas.</p></div>
      {loading ? <div className="py-12 text-center text-gray-400">Cargando...</div> : <div className="divide-y divide-gray-50">
        {usuarios.map(u => {
          const isMe = u.id === currentUser?.id
          return <div key={u.id} className="px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shrink-0"><span className="text-white font-bold">{(u.nombre ?? u.email ?? '?')[0].toUpperCase()}</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-gray-900 text-sm">{u.nombre ?? '—'}</p>{isMe && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Tu cuenta</span>}{u.activo !== true && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactivo</span>}</div>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</p>
              {u.telefono && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{u.telefono}</p>}
              {u.departamento && <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 className="w-3 h-3" />{u.departamento}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700"><Crown className="w-3 h-3 inline mr-1" />Administrador</span>
              {!isMe && <button onClick={() => toggleActivo(u.id, u.activo === true)} className={\`p-2 rounded-lg \${u.activo === true ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}\`} title={u.activo === true ? 'Revocar acceso' : 'Habilitar acceso'}>{u.activo === true ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}</button>}
            </div>
          </div>
        })}
        {usuarios.length === 0 && <div className="py-12 text-center text-gray-400"><Users className="w-8 h-8 mx-auto mb-2 opacity-40" />No hay administradores registrados.</div>}
      </div>}
    </div>
    {showForm && <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><p className="font-bold text-gray-900">Nuevo administrador</p><button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4 text-gray-500" /></button></div>
      <div className="p-5 space-y-3">
        <label className="block text-xs font-semibold text-gray-500">Nombre completo<input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Nombre completo" /></label>
        <label className="block text-xs font-semibold text-gray-500">Email<input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="usuario@contactgo.net" /></label>
        <label className="block text-xs font-semibold text-gray-500">Contraseña temporal<div className="relative mt-1"><input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm" placeholder="Mínimo 8 caracteres" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></label>
        <label className="block text-xs font-semibold text-gray-500">Departamento<select value={form.departamento} onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">{DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}</select></label>
      </div>
      <div className="px-5 pb-5 flex gap-3"><button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl text-sm">Cancelar</button><button onClick={crearUsuario} disabled={saving} className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-60">{saving ? 'Creando...' : 'Crear administrador'}</button></div>
    </div></div>}
  </div>
}
