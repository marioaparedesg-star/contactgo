'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut,
  ChevronRight, FileText, CreditCard, MessageCircle, Lock, Fingerprint, ShieldCheck,
  Eye, EyeOff, KeyRound, Repeat, Calendar, RefreshCw
} from 'lucide-react'

// ─── WebAuthn helpers ────────────────────────────────────────────────────────
function bufferToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
function base64urlToBuffer(b64: string): ArrayBuffer {
  const b = b64.replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(b), c => c.charCodeAt(0)).buffer
}

const RP_ID   = 'contactgo.net'
const RP_NAME = 'ContactGo'
const STORAGE_KEY = 'cg_passkey_cred'

async function registerPasskey(userId: string, userName: string): Promise<boolean> {
  if (!window.PublicKeyCredential) return false
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { id: RP_ID, name: RP_NAME },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7,   type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential | null
    if (!cred) return false
    // Guardamos el credentialId en localStorage (en producción iría al backend)
    localStorage.setItem(STORAGE_KEY, bufferToBase64url(cred.rawId))
    return true
  } catch { return false }
}

async function authenticatePasskey(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false
  const storedId = localStorage.getItem(STORAGE_KEY)
  if (!storedId) return false
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: RP_ID,
        allowCredentials: [{
          id: base64urlToBuffer(storedId),
          type: 'public-key',
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential | null
    return !!assertion
  } catch { return false }
}

async function passkeyAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function CuentaPage() {
  const [user, setUser]       = useState<any>(null)
  const [perfil, setPerfil]   = useState<any>(null)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [suscripciones, setSuscripciones]   = useState<any[]>([])
  const [itemsPedido, setItemsPedido]   = useState<any[]>([])
  const [historialPedido, setHistorialPedido] = useState<any[]>([])
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [tab, setTab]         = useState('')
  const [editando, setEditando] = useState(false)
  const [form, setForm]       = useState({ nombre: '', telefono: '' })
  const [direcciones, setDirecciones] = useState<any[]>([])
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [nuevaCiudad, setNuevaCiudad]   = useState('Santo Domingo')
  const [agregandoDir, setAgregandoDir] = useState(false)
  const [modo, setModo]       = useState('login')
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [nombre, setNombre]   = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [recetas, setRecetas] = useState<any[]>([])
  const [agregandoReceta, setAgregandoReceta] = useState(false)
  const [recetaForm, setRecetaForm] = useState({
    nombre:'Mi receta',diagnostico:'',od_sph:'',od_cyl:'',od_axis:'',od_add:'',
    oi_sph:'',oi_cyl:'',oi_axis:'',oi_add:''
  })
  const [agregandoPago, setAgregandoPago] = useState(false)
  const [pagoForm, setPagoForm] = useState({ titular:'', ultimos4:'', vencimiento:'' })
  const [pagos, setPagos]     = useState<any[]>([])
  const [msg, setMsg]         = useState('')

  // ── Contraseña ──
  const [showPassSection, setShowPassSection] = useState(false)
  const [passForm, setPassForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [showPass, setShowPass] = useState({ actual: false, nueva: false, confirmar: false })
  const [passMsg, setPassMsg] = useState<{type:'ok'|'err', text:string}|null>(null)
  const [loadingPass, setLoadingPass] = useState(false)

  // ── Passkey (Face ID / Huella) ──
  const [passkeySupported, setPasskeySupported] = useState(false)
  const [passkeyRegistered, setPasskeyRegistered] = useState(false)
  const [passkeyMsg, setPasskeyMsg] = useState<{type:'ok'|'err', text:string}|null>(null)
  const [loadingPasskey, setLoadingPasskey] = useState(false)

  useEffect(() => {
    passkeyAvailable().then(setPasskeySupported)
    setPasskeyRegistered(!!localStorage.getItem(STORAGE_KEY))
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) { setPerfil(data); setForm({ nombre: data.nombre || '', telefono: data.telefono || '' }) }
        })
        sb.from('orders').select('*').eq('user_id', user.id).order('fecha', { ascending: false }).then(({ data }) => setPedidos(data || []))
        sb.from('addresses').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setDirecciones(data || []))
        sb.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setRecetas(data || []))
        sb.from('payment_methods').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setPagos(data || []))
        sb.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setSuscripciones(data || []))
      }
    })
  }, [])

  // ── Cambiar contraseña ──
  const cambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMsg(null)
    if (passForm.nueva.length < 8) {
      setPassMsg({ type:'err', text:'La contraseña nueva debe tener al menos 8 caracteres.' }); return
    }
    if (passForm.nueva !== passForm.confirmar) {
      setPassMsg({ type:'err', text:'Las contraseñas nuevas no coinciden.' }); return
    }
    setLoadingPass(true)
    const sb = createClient()
    // Verificar contraseña actual
    const { error: signInErr } = await sb.auth.signInWithPassword({ email: user.email, password: passForm.actual })
    if (signInErr) {
      setPassMsg({ type:'err', text:'La contraseña actual es incorrecta.' })
      setLoadingPass(false); return
    }
    const { error } = await sb.auth.updateUser({ password: passForm.nueva })
    if (error) {
      setPassMsg({ type:'err', text: error.message })
    } else {
      setPassMsg({ type:'ok', text:'¡Contraseña cambiada exitosamente! ✓' })
      setPassForm({ actual:'', nueva:'', confirmar:'' })
      setShowPassSection(false)
    }
    setLoadingPass(false)
  }

  // ── Registrar Passkey ──
  const handleRegisterPasskey = async () => {
    setLoadingPasskey(true)
    setPasskeyMsg(null)
    const ok = await registerPasskey(user.id, perfil?.nombre || user.email)
    if (ok) {
      setPasskeyRegistered(true)
      setPasskeyMsg({ type:'ok', text:'Face ID / Huella registrado ✓' })
    } else {
      setPasskeyMsg({ type:'err', text:'No se pudo registrar. Asegúrate de que tu dispositivo soporte biometría.' })
    }
    setLoadingPasskey(false)
  }

  const handleRemovePasskey = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPasskeyRegistered(false)
    setPasskeyMsg({ type:'ok', text:'Acceso biométrico eliminado.' })
  }

  const detectarDiagnostico = (f: typeof recetaForm) => {
    const sph = parseFloat(f.od_sph || f.oi_sph || '0')
    const cyl = parseFloat(f.od_cyl || f.oi_cyl || '0')
    const add = parseFloat(f.od_add || f.oi_add || '0')
    const tieneCyl = cyl !== 0 && (f.od_cyl || f.oi_cyl)
    const tieneAdd = add > 0 && (f.od_add || f.oi_add)
    if (tieneAdd && sph < 0 && tieneCyl) return 'Presbicia + Miopía + Astigmatismo'
    if (tieneAdd && sph < 0)  return 'Presbicia + Miopía'
    if (tieneAdd && sph >= 0) return 'Presbicia'
    if (sph < 0 && tieneCyl)  return 'Miopía + Astigmatismo'
    if (sph > 0 && tieneCyl)  return 'Hipermetropía + Astigmatismo'
    if (tieneCyl)             return 'Astigmatismo'
    if (sph < 0)              return 'Miopía'
    if (sph > 0)              return 'Hipermetropía'
    return ''
  }

  const guardarReceta = async () => {
    const sb = createClient()
    const diagnostico = detectarDiagnostico(recetaForm)
    const { data } = await sb.from('prescriptions').insert({ user_id: user.id, ...recetaForm, diagnostico }).select().single()
    if (data) {
      setRecetas(r => [data, ...r])
      setAgregandoReceta(false)
      setRecetaForm({ nombre:'Mi receta',diagnostico:'',od_sph:'',od_cyl:'',od_axis:'',od_add:'',oi_sph:'',oi_cyl:'',oi_axis:'',oi_add:'' })
    }
  }

  const eliminarReceta = async (id: string) => {
    const sb = createClient()
    await sb.from('prescriptions').delete().eq('id', id)
    setRecetas(r => r.filter(x => x.id !== id))
  }

  const guardarPago = async () => {
    if (!pagoForm.titular || !pagoForm.ultimos4 || !pagoForm.vencimiento) return
    const sb = createClient()
    const { data } = await sb.from('payment_methods').insert({ user_id: user.id, ...pagoForm, tipo:'tarjeta', principal: pagos.length === 0 }).select().single()
    if (data) { setPagos(p => [...p, data]); setAgregandoPago(false); setPagoForm({ titular:'', ultimos4:'', vencimiento:'' }) }
  }

  const eliminarPago = async (id: string) => {
    const sb = createClient()
    await sb.from('payment_methods').delete().eq('id', id)
    setPagos(p => p.filter(x => x.id !== id))
  }

  const guardarPerfil = async () => {
    const sb = createClient()
    await sb.from('profiles').update({ nombre: form.nombre, telefono: form.telefono }).eq('id', user.id)
    setPerfil((p: any) => ({ ...p, ...form }))
    setEditando(false)
  }

  const agregarDireccion = async () => {
    if (!nuevaDireccion.trim()) return
    const sb = createClient()
    const { data, error } = await sb.from('addresses').insert({
      user_id: user.id, direccion: nuevaDireccion, ciudad: nuevaCiudad, principal: direcciones.length === 0
    }).select().single()
    if (error) { alert(error.message); return }
    if (data) { setDirecciones(d => [...d, data]); setNuevaDireccion(''); setNuevaCiudad('Santo Domingo'); setAgregandoDir(false) }
  }

  const eliminarDireccion = async (id: string) => {
    const sb = createClient()
    await sb.from('addresses').delete().eq('id', id)
    setDirecciones(d => d.filter(x => x.id !== id))
  }

  const cerrarSesion = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    window.location.reload()
  }

  const verPedido = async (p: any) => {
    setSelectedPedido(p)
    setLoadingPedido(true)
    const sb = createClient()
    // Refresca el estado actual del pedido desde DB (no usar snapshot en memoria)
    const [{ data: pedidoFresh }, { data: items }, { data: historial }] = await Promise.all([
      sb.from('orders').select('*').eq('id', p.id).single(),
      sb.from('order_items').select('*').eq('order_id', p.id),
      sb.from('order_status_history').select('*').eq('order_id', p.id).order('created_at', { ascending: true }),
    ])
    if (pedidoFresh) {
      setSelectedPedido(pedidoFresh)
      // Actualiza también en la lista de pedidos
      setPedidos(ps => ps.map(x => x.id === p.id ? pedidoFresh : x))
    }
    setItemsPedido(items || [])
    setHistorialPedido(historial || [])
    setLoadingPedido(false)

    // Suscripción en tiempo real para actualizaciones de estado
    const channel = sb.channel('pedido-' + p.id)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'orders',
        filter: 'id=eq.' + p.id
      }, ({ new: updated }) => {
        setSelectedPedido((prev: any) => ({ ...prev, ...updated }))
        setPedidos(ps => ps.map(x => x.id === p.id ? { ...x, estado: updated.estado } : x))
        // Actualizar historial en tiempo real
        setHistorialPedido(h => [...h, { estado: updated.estado, created_at: new Date().toISOString() }])
      })
      .subscribe()

    // Guardar referencia para desuscribir al cerrar
    return () => { sb.removeChannel(channel) }
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password: pass })
    if (error) { setMsg('Email o contraseña incorrectos'); setLoading(false); return }
    window.location.reload()
  }

  const loginConPasskey = async () => {
    setMsg('')
    const ok = await authenticatePasskey()
    if (ok) {
      // Si pasa biometría, iniciamos sesión con el email guardado
      const stored = localStorage.getItem('cg_passkey_email')
      if (!stored) { setMsg('No hay sesión guardada para biometría. Inicia sesión normal primero.'); return }
      // Usamos magic link silent o simplemente recargamos con la sesión activa
      // En producción esto iría a un endpoint backend. Por ahora redirigimos.
      window.location.href = '/cuenta'
    } else {
      setMsg('Autenticación biométrica fallida o cancelada.')
    }
  }

  const registro = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg('')
    const sb = createClient()
    const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nombre, telefono } } })
    if (error) { setMsg(error.message); setLoading(false); return }
    if (data.user) {
      await sb.from('profiles').upsert({ id: data.user.id, email, nombre, telefono, role: 'customer' })
      window.location.reload()
    }
    setLoading(false)
  }

  const ESTADO: Record<string, string> = {
    pendiente:'bg-yellow-50 text-yellow-700', confirmado:'bg-blue-50 text-blue-700',
    preparando:'bg-purple-50 text-purple-700', enviado:'bg-indigo-50 text-indigo-700',
    entregado:'bg-green-50 text-green-700', cancelado:'bg-red-50 text-red-700'
  }

  // ──────────────────────────────────── LOGIN SCREEN ──────────────────────────
  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => setModo('login')}
              className={"flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo==='login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
              Iniciar sesión
            </button>
            <button onClick={() => setModo('registro')}
              className={"flex-1 py-2 rounded-lg text-sm font-semibold transition-colors " + (modo==='registro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500')}>
              Crear cuenta
            </button>
          </div>

          {msg && <p className="text-sm text-center mb-4 p-3 rounded-lg bg-red-50 text-red-600">{msg}</p>}

          <form onSubmit={modo==='login' ? login : registro} className="space-y-4">
            {modo==='registro' && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Nombre</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Teléfono</label>
                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="809-000-0000" />
              </div>
            </>)}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Contraseña</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••" />
            </div>

            {modo === 'login' && (
              <p className="text-right">
                <a href="/cuenta/reset-password" className="text-xs text-primary-600 hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Cargando...' : modo==='login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Face ID / Huella - solo en login */}
          {modo === 'login' && passkeySupported && localStorage.getItem(STORAGE_KEY) && (
            <div className="mt-4">
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">o</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button onClick={loginConPasskey}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-primary-400 bg-white text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                <Fingerprint className="w-5 h-5 text-primary-600" />
                Entrar con Face ID / Huella digital
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ──────────────────────────────────── APP SCREEN ──────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{(perfil?.nombre || user.email)[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{perfil?.nombre || 'Mi cuenta'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={cerrarSesion}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Menú vertical app-friendly — se oculta cuando hay tab activo */}
        {tab === '' ? (
          <div className="space-y-2 mb-4">
            {[
              {id:'pedidos',      label:'Pedidos',      desc:'Historial y seguimiento',  icon:Package,     color:'bg-blue-50 text-blue-600'},
              {id:'suscripciones',label:'Suscripciones',desc:'Entregas automáticas',      icon:Repeat,      color:'bg-purple-50 text-purple-600'},
              {id:'recetas',      label:'Mis Recetas',  desc:'Prescripciones guardadas',  icon:FileText,    color:'bg-teal-50 text-teal-600'},
              {id:'pagos',        label:'Métodos de pago',desc:'Tarjetas guardadas',      icon:CreditCard,  color:'bg-green-50 text-green-600'},
              {id:'perfil',       label:'Mi Perfil',    desc:'Nombre, email, teléfono',   icon:User,        color:'bg-orange-50 text-orange-600'},
              {id:'direcciones',  label:'Direcciones',  desc:'Dirección de entrega',      icon:MapPin,      color:'bg-pink-50 text-pink-600'},
              {id:'seguridad',    label:'Seguridad',    desc:'Contraseña y Face ID',      icon:ShieldCheck, color:'bg-indigo-50 text-indigo-600'},
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all text-left">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${t.color}`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            ))}
            <button onClick={cerrarSesion}
              className="w-full bg-white border border-red-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-50 transition-all text-left mt-2">
              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-500 text-sm">Cerrar sesión</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
            </button>
          </div>
        ) : (
          /* Botón volver al menú */
          <button onClick={() => setTab('')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Menú
          </button>
        )}

        {/* TAB: PEDIDOS */}
        {tab==='pedidos' && (
          <div className="space-y-3">
            {pedidos.length===0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes pedidos aún</p>
                <a href="/catalogo" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Ver catálogo</a>
              </div>
            ) : pedidos.map(p => (
              <button key={p.id} onClick={() => verPedido(p)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:border-primary-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(p.fecha).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'})}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[p.estado]||'bg-gray-50 text-gray-600')}>{p.estado}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-primary-600 font-bold text-lg">RD${(p.total||0).toLocaleString()}</span>
                  <div className="flex items-center gap-2">
                    <a href={`/confirmacion?orden=${p.id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-xs bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 hover:bg-primary-100 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Volver a pedir
                    </a>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}


        {/* TAB: SUSCRIPCIONES */}
        {tab==='suscripciones' && (
          <div className="space-y-3">
            {suscripciones.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Repeat className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes suscripciones activas</p>
                <p className="text-xs text-gray-400 mt-1">Al comprar activa la opción "suscripción" para recibir tus lentes automáticamente</p>
                <a href="/catalogo" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Ver catálogo</a>
              </div>
            ) : suscripciones.map(s => {
              let items: any[] = []
              try { items = typeof s.items === 'string' ? JSON.parse(s.items) : (s.items ?? []) } catch {}
              const proxDias = s.proximo_envio ? Math.ceil((new Date(s.proximo_envio).getTime() - Date.now()) / (1000*60*60*24)) : null
              const FREQ: Record<string,string> = { '15_dias':'Cada 15 días', mensual:'Mensual', bimestral:'Bimestral', trimestral:'Trimestral' }
              return (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.activa ? 'Activa' : 'Pausada'}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{FREQ[s.frecuencia] ?? s.frecuencia}</span>
                        {s.descuento_pct > 0 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">-{s.descuento_pct}%</span>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                        {item.sph != null && (
                          <p className="text-xs font-mono text-blue-600 mt-0.5">
                            SPH: {parseFloat(item.sph) > 0 ? '+' : ''}{item.sph}
                            {item.cyl ? ` · CYL: ${item.cyl}` : ''}
                            {item.color ? ` · ${item.color}` : ''}
                            {item.ojo ? ` · ${item.ojo}` : ''}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.cantidad} · RD${(item.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  {s.proximo_envio && (
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium mb-2 ${proxDias != null && proxDias <= 3 ? 'bg-red-50 text-red-700' : proxDias != null && proxDias <= 7 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      Próximo envío: {new Date(s.proximo_envio).toLocaleDateString('es-DO',{day:'numeric',month:'long'})}
                      {proxDias != null && proxDias >= 0 && <span className="ml-auto font-semibold">{proxDias === 0 ? 'Hoy' : `en ${proxDias} días`}</span>}
                    </div>
                  )}
                  {s.direccion_texto && <p className="text-xs text-gray-400">📍 {s.direccion_texto}</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* TAB: RECETAS */}
        {tab==='recetas' && (
          <div className="space-y-3">
            {recetas.length===0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes recetas guardadas</p>
                <p className="text-xs text-gray-400 mt-1">Agrega tu receta óptica para comprar más rápido</p>
              </div>
            )}
            {recetas.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.nombre}</p>
                  {r.diagnostico && <span className="text-xs font-semibold px-2 py-1 bg-primary-50 text-primary-700 rounded-full">{r.diagnostico}</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['OD Derecho',r.od_sph,r.od_cyl,r.od_axis,r.od_add],['OI Izquierdo',r.oi_sph,r.oi_cyl,r.oi_axis,r.oi_add]].map(([label,sph,cyl,axis,add]) => (
                    <div key={String(label)} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                      <div className="space-y-1 text-xs">
                        {sph && <p><span className="text-gray-400">SPH: </span><span className="font-semibold">{sph}</span></p>}
                        {cyl && <p><span className="text-gray-400">CYL: </span><span className="font-semibold">{cyl}</span></p>}
                        {axis && <p><span className="text-gray-400">EJE: </span><span className="font-semibold">{axis}</span></p>}
                        {add && <p><span className="text-gray-400">ADD: </span><span className="font-semibold">{add}</span></p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <a href="/catalogo" className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-primary-700 transition-colors">Comprar</a>
                  <button onClick={() => eliminarReceta(r.id)} className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
            {agregandoReceta ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={recetaForm.nombre} onChange={e => setRecetaForm(f => ({...f,nombre:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nombre (ej: Receta 2025)" />
                {(recetaForm.od_sph||recetaForm.oi_sph) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-800 font-semibold">
                    Diagnóstico detectado: {detectarDiagnostico(recetaForm)||'Ingresa SPH para detectar'}
                  </div>
                )}
                {[['OD Ojo Derecho','od'],['OI Ojo Izquierdo','oi']].map(([label,side]) => (
                  <div key={side}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['SPH','CYL','EJE','ADD'].map((field,i) => {
                        const keys = ['sph','cyl','axis','add']
                        const k = side+'_'+keys[i]
                        return (
                          <div key={field}>
                            <p className="text-xs text-gray-400 mb-1">{field}</p>
                            <input value={(recetaForm as any)[k]} onChange={e => setRecetaForm(f => ({...f,[k]:e.target.value}))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder={field==='SPH'?'-2.50':field==='CYL'?'-0.75':field==='EJE'?'180':'+1.50'} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={guardarReceta} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar receta</button>
                  <button onClick={() => setAgregandoReceta(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoReceta(true)}
                className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar receta
              </button>
            )}
          </div>
        )}

        {/* TAB: PAGOS */}
        {tab==='pagos' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
              <p className="font-semibold mb-1">Solo guardamos referencia</p>
              <p>Últimos 4 dígitos y titular. Nunca el número completo.</p>
            </div>
            {pagos.length===0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes tarjetas guardadas</p>
              </div>
            )}
            {pagos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">XXXX XXXX XXXX {p.ultimos4}</p>
                    <p className="text-xs text-gray-400">{p.titular} · Vence {p.vencimiento}</p>
                  </div>
                </div>
                <button onClick={() => eliminarPago(p.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoPago ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={pagoForm.titular} onChange={e => setPagoForm(f => ({...f,titular:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nombre del titular" />
                <input value={pagoForm.ultimos4} onChange={e => setPagoForm(f => ({...f,ultimos4:e.target.value.slice(0,4)}))}
                  maxLength={4} inputMode="numeric"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Últimos 4 dígitos" />
                <input value={pagoForm.vencimiento} onChange={e => setPagoForm(f => ({...f,vencimiento:e.target.value}))}
                  maxLength={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="MM/AA" />
                <div className="flex gap-2">
                  <button onClick={guardarPago} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoPago(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoPago(true)}
                className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar tarjeta
              </button>
            )}
          </div>
        )}

        {/* TAB: PERFIL */}
        {tab==='perfil' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Información personal</h2>
              {!editando ? (
                <button onClick={() => setEditando(true)}
                  className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={guardarPerfil} className="flex items-center gap-1 text-sm text-white font-semibold bg-green-500 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" /> Guardar</button>
                  <button onClick={() => setEditando(false)} className="flex items-center gap-1 text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"><X className="w-3.5 h-3.5" /> Cancelar</button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Nombre completo</label>
                {editando ? (
                  <input value={form.nombre} onChange={e => setForm(f => ({...f,nombre:e.target.value}))}
                    className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
                ) : <p className="text-gray-900 font-medium py-1">{perfil?.nombre||'Sin nombre'}</p>}
              </div>
              <div className="flex items-center gap-3 py-1">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Email</p>
                  <p className="text-gray-700 font-medium">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Teléfono</label>
                {editando ? (
                  <input value={form.telefono} onChange={e => setForm(f => ({...f,telefono:e.target.value}))}
                    className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                    placeholder="809-000-0000" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 font-medium">{perfil?.telefono||'Sin teléfono'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DIRECCIONES */}
        {tab==='direcciones' && (
          <div className="space-y-3">
            {direcciones.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={"w-8 h-8 rounded-xl flex items-center justify-center shrink-0 " + (d.principal?'bg-primary-100':'bg-gray-100')}>
                    <MapPin className={"w-4 h-4 " + (d.principal?'text-primary-600':'text-gray-400')} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.direccion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.ciudad}</p>
                    {d.principal && <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full mt-1 inline-block">Principal</span>}
                  </div>
                </div>
                <button onClick={() => eliminarDireccion(d.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {agregandoDir ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={nuevaDireccion} onChange={e => setNuevaDireccion(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Calle, número, sector" />
                <input value={nuevaCiudad} onChange={e => setNuevaCiudad(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Ciudad" />
                <div className="flex gap-2">
                  <button onClick={agregarDireccion} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Guardar</button>
                  <button onClick={() => setAgregandoDir(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoDir(true)}
                className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar dirección
              </button>
            )}
          </div>
        )}

        {/* TAB: SEGURIDAD ─────────────────────────────────────────────── */}
        {tab==='seguridad' && (
          <div className="space-y-4">

            {/* ── Cambiar contraseña ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => { setShowPassSection(v => !v); setPassMsg(null) }}
                className="w-full flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">Cambiar contraseña</p>
                    <p className="text-xs text-gray-400">Actualiza tu contraseña actual</p>
                  </div>
                </div>
                <ChevronRight className={"w-4 h-4 text-gray-400 transition-transform " + (showPassSection ? 'rotate-90' : '')} />
              </button>

              {showPassSection && (
                <form onSubmit={cambiarContrasena} className="px-6 pb-5 space-y-3 border-t border-gray-50">
                  <div className="pt-4" />
                  {passMsg && (
                    <div className={"p-3 rounded-xl text-sm font-medium " + (passMsg.type==='ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                      {passMsg.text}
                    </div>
                  )}
                  {[
                    { key:'actual',   label:'Contraseña actual',     ph:'••••••••' },
                    { key:'nueva',    label:'Nueva contraseña',       ph:'Mínimo 8 caracteres' },
                    { key:'confirmar',label:'Confirmar nueva contraseña', ph:'Repite la nueva' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{field.label}</label>
                      <div className="relative">
                        <input
                          type={(showPass as any)[field.key] ? 'text' : 'password'}
                          value={(passForm as any)[field.key]}
                          onChange={e => setPassForm(f => ({...f,[field.key]:e.target.value}))}
                          required minLength={field.key==='actual'?1:8}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder={field.ph}
                        />
                        <button type="button"
                          onClick={() => setShowPass(s => ({...s,[field.key]:!(s as any)[field.key]}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {(showPass as any)[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={loadingPass}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
                    {loadingPass ? 'Verificando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}
            </div>

            {/* ── Face ID / Huella ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Face ID / Huella digital</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-3">
                    Inicia sesión con biometría de tu dispositivo (iPhone, Android, Mac).
                  </p>

                  {passkeyMsg && (
                    <div className={"p-3 rounded-xl text-sm font-medium mb-3 " + (passkeyMsg.type==='ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                      {passkeyMsg.text}
                    </div>
                  )}

                  {!passkeySupported ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-500">
                      Tu dispositivo o navegador no soporta autenticación biométrica.
                    </div>
                  ) : passkeyRegistered ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                        <p className="text-sm font-semibold text-green-700">Biometría activada ✓</p>
                      </div>
                      <button onClick={handleRemovePasskey}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                        Eliminar acceso biométrico
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleRegisterPasskey} disabled={loadingPasskey}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
                      <Fingerprint className="w-4 h-4" />
                      {loadingPasskey ? 'Registrando...' : 'Activar Face ID / Huella'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Info de sesión ── */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700 mb-2">Sesión actual</p>
              <p>📧 {user.email}</p>
              <p>🔑 Autenticado via email/contraseña</p>
              <p>🌐 Sesión segura con HTTPS + JWT</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalle pedido */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
          <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0">
            <button onClick={() => setSelectedPedido(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="font-bold text-gray-900">{"Pedido #"+selectedPedido.id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-gray-400">{new Date(selectedPedido.fecha).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'})}</p>
            </div>
            <span className={"ml-auto px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[selectedPedido.estado]||'bg-gray-50 text-gray-600')}>
              {selectedPedido.estado}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Productos</p>
              </div>
              <div className="p-4 space-y-3">
                {loadingPedido ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : itemsPedido.length===0 ? (
                  <p className="text-gray-400 text-sm text-center py-2">Sin detalles disponibles</p>
                ) : itemsPedido.map(item => {
                  const specs = []
                  if (item.ojo)         specs.push({label:'Ojo',   val:item.ojo})
                  if (item.sph!=null)   specs.push({label:'SPH',   val:item.sph>0?'+'+item.sph:String(item.sph)})
                  if (item.cyl!=null)   specs.push({label:'CYL',   val:String(item.cyl)})
                  if (item.axis!=null)  specs.push({label:'AXIS',  val:String(item.axis).padStart(3,'0')+'°'})
                  if (item.add_power)   specs.push({label:'ADD',   val:item.add_power})
                  if (item.color)       specs.push({label:'Color', val:item.color})
                  if (item.size)        specs.push({label:'Tamaño',val:item.size})
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                        <p className="font-bold text-gray-900 text-sm whitespace-nowrap">RD${(item.subtotal??item.precio*item.cantidad).toLocaleString()}</p>
                      </div>
                      {specs.length>0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {specs.map(s => (
                            <span key={s.label} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-xs">
                              <span className="text-gray-400">{s.label}:</span>
                              <span className="font-semibold text-gray-700">{s.val}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400">Cantidad: {item.cantidad}</p>
                    </div>
                  )
                })}
              </div>
              <div className="px-4 py-3 border-t border-gray-50 flex justify-between">
                <p className="font-bold text-gray-900">Total</p>
                <p className="font-black text-primary-600 text-lg">RD${(selectedPedido.total||0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Dirección de envío</p>
              </div>
              <p className="text-gray-700 font-medium">{selectedPedido.direccion_texto||'Sin dirección registrada'}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-primary-600" />
                <p className="font-bold text-gray-900 text-sm">Información de pago</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Método</p>
                  <p className="font-semibold text-gray-900 capitalize mt-0.5">{(selectedPedido.metodo_pago||'—').replace('_',' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estado</p>
                  <p className={"font-semibold mt-0.5 capitalize "+(selectedPedido.pago_estado==='pagado'?'text-green-600':'text-amber-600')}>
                    {selectedPedido.pago_estado||'pendiente'}
                  </p>
                </div>
              </div>
            </div>
            {/* Historial de estados */}
            {historialPedido.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🕐</span>
                  <p className="font-bold text-gray-900 text-sm">Historial de estados</p>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100" />
                  <div className="space-y-3">
                    {historialPedido.map((h: any, i: number) => {
                      const ESTADO_ICON: Record<string,string> = { pendiente:'📋', confirmado:'✅', preparando:'📦', enviado:'🚚', entregado:'🎉', cancelado:'❌' }
                      const isLast = i === historialPedido.length - 1
                      return (
                        <div key={h.id ?? i} className="flex items-start gap-3 pl-1">
                          <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${isLast ? 'bg-primary-100 border-2 border-primary-500' : 'bg-gray-100'}`}>
                            {ESTADO_ICON[h.estado] ?? '•'}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold capitalize ${isLast ? 'text-primary-600' : 'text-gray-600'}`}>{h.estado}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(h.created_at).toLocaleDateString('es-DO',{day:'numeric',month:'short',year:'numeric'})} · {new Date(h.created_at).toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            <a href={"https://wa.me/18294089097?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido%20%23"+selectedPedido.id.slice(-6).toUpperCase()}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm transition-colors">
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
