'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { LoyaltySection } from '@/components/ui/LoyaltySection'
import {
  User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut,
  ChevronRight, FileText, CreditCard, MessageCircle, Lock, Fingerprint, ShieldCheck,
  Eye, EyeOff, KeyRound, Repeat, Calendar, RefreshCw
} from 'lucide-react'
import LocationPicker, { type LocationData } from '@/components/ui/LocationPicker'

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
    try { localStorage.setItem(STORAGE_KEY, bufferToBase64url(cred.rawId)) } catch {}
    return true
  } catch { return false }
}

async function authenticatePasskey(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false
  const storedId = (() => { try { return localStorage.getItem(STORAGE_KEY) } catch { return null } })()
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
  try {
    if (typeof window === 'undefined') return false
    if (!window.PublicKeyCredential) return false
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') return false
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function CuentaPage() {
  const router = useRouter()

  const [user, setUser]       = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [perfil, setPerfil]   = useState<any>(null)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [suscripciones, setSuscripciones]   = useState<any[]>([])
  const [itemsPedido, setItemsPedido]   = useState<any[]>([])
  const [historialPedido, setHistorialPedido] = useState<any[]>([])
  const [cancelandoSub, setCancelandoSub] = useState<any>(null)
  const [cancelConfirm, setCancelConfirm] = useState<any>(null)
  const [motivoCancel, setMotivoCancel] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [tab, setTab] = useState('')  // ← siempre empieza vacío (evita hydration mismatch)
  const [editando, setEditando] = useState(false)
  const [form, setForm]       = useState({ nombre: '', telefono: '' })
  const [direcciones, setDirecciones] = useState<any[]>([])
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [nuevaCiudad, setNuevaCiudad]   = useState('Santo Domingo')
  const [showMap,       setShowMap]       = useState(false)
  const [profileLat,    setProfileLat]    = useState<number|null>(null)
  const [profileLng,    setProfileLng]    = useState<number|null>(null)
  const [profileAddr,   setProfileAddr]   = useState<string|null>(null)
  // Dirección seleccionada para nueva dirección con mapa
  const [mapEditId,     setMapEditId]     = useState<string|null>(null)  // id de direccion editando mapa
  const [showAddDir,    setShowAddDir]    = useState(false)              // formulario nueva dirección
  const [newDirData,    setNewDirData]    = useState({ etiqueta:'Casa', direccion:'', ciudad:'Santo Domingo', referencias:'' })
  const [newDirStep,    setNewDirStep]    = useState<'form'|'map'>('form')  // paso: form o mapa
  const [newDirLat,     setNewDirLat]     = useState<number|null>(null)
  const [newDirLng,     setNewDirLng]     = useState<number|null>(null)
  const [newDirMapAddr, setNewDirMapAddr] = useState<string|null>(null)
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
  const [subiendoReceta, setSubiendoReceta] = useState(false)
  const [analizandoIA, setAnalizandoIA] = useState(false)
  const [recetaAnalizada, setRecetaAnalizada] = useState<any>(null)
  const [recetaImagenPreview, setRecetaImagenPreview] = useState<string | null>(null)
  const [fechaEmisionForm, setFechaEmisionForm] = useState('')
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
  const [reordering, setReordering] = useState<string|null>(null) // ← Movido aquí: ANTES de los early returns

  // ── useEffect principal — blindado contra crashes Safari iOS ────────────────
  useEffect(() => {
    // 1. Leer hash de URL post-hydration (nunca durante SSR)
    try {
      const hash = window.location.hash.replace('#', '')
      const validTabs = ['perfil','pedidos','suscripciones','recetas','direcciones','pagos']
      if (validTabs.includes(hash)) setTab(hash)
    } catch {}

    // 2. Passkey — con .catch() para Safari iOS (puede rechazar la promesa)
    passkeyAvailable()
      .then(v => setPasskeySupported(v))
      .catch(() => setPasskeySupported(false))

    // 3. localStorage — con try-catch para Safari private mode
    try { setPasskeyRegistered(!!localStorage.getItem(STORAGE_KEY)) } catch { setPasskeyRegistered(false) }

    // 4. Cargar datos del usuario
    const sb = createClient()
    sb.auth.getUser()
      .then(({ data: { user } }) => {
        setAuthChecked(true)
        if (!user) return
        setUser(user)
        Promise.allSettled([
          sb.from('profiles').select('*').eq('id', user.id).single(),
          sb.from('orders').select('*').eq('user_id', user.id).order('fecha', { ascending: false }),
          sb.from('addresses').select('*').eq('user_id', user.id).order('created_at'),
          sb.from('saved_prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          sb.from('payment_methods').select('*').eq('user_id', user.id).order('created_at'),
          sb.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ]).then(([rPerfil, rOrdenes, rDirs, rRecetas, rPagos, rSubs]) => {
          if (rPerfil.status === 'fulfilled' && rPerfil.value.data) {
            const d = rPerfil.value.data
            setPerfil(d)
            setForm({ nombre: d.nombre || '', telefono: d.telefono || '' })
            setProfileLat(d.lat ?? null)
            setProfileLng(d.lng ?? null)
            setProfileAddr(d.direccion_completa ?? null)
          }
          if (rOrdenes.status === 'fulfilled')  setPedidos(rOrdenes.value.data || [])
          if (rDirs.status === 'fulfilled')     setDirecciones(rDirs.value.data || [])
          if (rRecetas.status === 'fulfilled')  setRecetas(rRecetas.value.data || [])
          if (rPagos.status === 'fulfilled')    setPagos(rPagos.value.data || [])
          if (rSubs.status === 'fulfilled')     setSuscripciones(rSubs.value.data || [])
        }).catch(err => console.error('[cuenta] load error:', err))
      })
      .catch(err => { console.error('[cuenta] getUser error:', err); setAuthChecked(true) })
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
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setPasskeyRegistered(false)
    setPasskeyMsg({ type:'ok', text:'Acceso biométrico eliminado.' })
  }

  const subirYAnalizarReceta = async (file: File) => {
    setAnalizandoIA(true)
    setRecetaAnalizada(null)
    try {
      // Preview local
      const reader = new FileReader()
      reader.onload = (e) => setRecetaImagenPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      // Redimensionar a max 1024px y convertir a base64
      const imgEl = new Image()
      const objUrl = URL.createObjectURL(file)
      imgEl.onload = async () => {
        const MAX = 1024
        let w = imgEl.width, h = imgEl.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else       { w = Math.round(w * MAX / h); h = MAX }
        }
        const cv = document.createElement('canvas')
        cv.width = w; cv.height = h
        cv.getContext('2d')!.drawImage(imgEl, 0, 0, w, h)
        URL.revokeObjectURL(objUrl)
        const base64 = cv.toDataURL('image/jpeg', 0.85).split(',')[1]
        const mediaType = 'image/jpeg'

        const res = await fetch('/api/ocr-receta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: mediaType }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok || !data.receta) {
          // Mostrar error sin alert() — dejar que el usuario ingrese manualmente
          console.error('OCR error:', data.error)
          setAnalizandoIA(false)
          // Abrir formulario manual automáticamente
          setAgregandoReceta(true)
          return
        }

        const rx = data.receta
        setRecetaAnalizada(rx)
        // Pre-llenar formulario con valores leídos
        setRecetaForm(f => ({
          ...f,
          od_sph:  rx.od_sph  != null ? String(rx.od_sph)  : f.od_sph,
          od_cyl:  rx.od_cyl  != null ? String(rx.od_cyl)  : f.od_cyl,
          od_axis: rx.od_axis != null ? String(rx.od_axis) : f.od_axis,
          oi_sph:  rx.oi_sph  != null ? String(rx.oi_sph)  : f.oi_sph,
          oi_cyl:  rx.oi_cyl  != null ? String(rx.oi_cyl)  : f.oi_cyl,
          oi_axis: rx.oi_axis != null ? String(rx.oi_axis) : f.oi_axis,
          od_add:  rx.add_power != null ? String(Math.abs(rx.add_power)) : f.od_add,
          diagnostico: rx.diagnostico ?? f.diagnostico,
        }))
        setAnalizandoIA(false)
        setAgregandoReceta(true)
      }
    } catch (err) {
      console.error(err)
      setAnalizandoIA(false)
      alert('Error al analizar la imagen. Intenta de nuevo.')
    }
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
    if (!newDirData.direccion.trim()) return
    const sb = createClient()
    const { data, error } = await sb.from('addresses').insert({
      user_id: user.id,
      etiqueta:    newDirData.etiqueta,
      direccion:   newDirData.direccion,
      ciudad:      newDirData.ciudad,
      referencias: newDirData.referencias || null,
      lat:         newDirLat,
      lng:         newDirLng,
      principal:   direcciones.length === 0,
    }).select().single()
    if (error) { alert(error.message); return }
    if (data) {
      setDirecciones(d => [...d, data])
      setShowAddDir(false)
      setNewDirData({ etiqueta:'Casa', direccion:'', ciudad:'Santo Domingo', referencias:'' })
      setNewDirLat(null); setNewDirLng(null); setNewDirMapAddr(null)
      setNewDirStep('form')
    }
  }

  const marcarPrincipal = async (id: string) => {
    const sb = createClient()
    await sb.from('addresses').update({ principal: false }).eq('user_id', user.id)
    await sb.from('addresses').update({ principal: true }).eq('id', id)
    setDirecciones(ds => ds.map(d => ({ ...d, principal: d.id === id })))
  }

  const guardarMapaDireccion = async (id: string, lat: number, lng: number) => {
    const sb = createClient()
    await sb.from('addresses').update({ lat, lng }).eq('id', id)
    setDirecciones(ds => ds.map(d => d.id === id ? { ...d, lat, lng } : d))
    setMapEditId(null)
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

  const cancelarSuscripcion = async (sub: any, confirmar = false) => {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/suscripciones/cancelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: sub.id, motivo: motivoCancel, confirmar_pedido: confirmar }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error ?? 'Error'); return }

      if (data.requiere_confirmacion) {
        // Mostrar modal de confirmación con info del cobro
        setCancelConfirm({ ...data, sub })
        setCancelandoSub(null)
      } else {
        // Cancelada
        setSuscripciones(ss => ss.filter(s => s.id !== sub.id))
        setCancelandoSub(null)
        setCancelConfirm(null)
        setMotivoCancel('')
        const msg = data.pedido_id
          ? '✅ Suscripción cancelada. Tu último pedido fue generado — lo verás en Pedidos.'
          : '✅ Suscripción cancelada correctamente.'
        alert(msg)
      }
    } finally { setCancelLoading(false) }
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
      const stored = (() => { try { return localStorage.getItem('cg_passkey_email') } catch { return null } })()
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
  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
      <div className="w-full max-w-md">
        {/* Link de vuelta a la tienda — siempre visible en el login */}
        <div className="mb-6 flex items-center">
          <a href="/"
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la tienda
          </a>
        </div>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Social login */}
          <div className="space-y-2 mb-5">
            <button onClick={async () => {
              const sb = createClient()
              await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/cuenta' } })
            }} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-sm">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuar con Google
            </button>

          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">o con email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
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
                <input type="text" autoComplete="name" value={nombre} onChange={e => setNombre(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Teléfono</label>
                <input type="tel" autoComplete="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="809-000-0000" />
              </div>
            </>)}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email</label>
              <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Contraseña</label>
              <input type="password" autoComplete="current-password" value={pass} onChange={e => setPass(e.target.value)} required minLength={6}
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
          {modo === 'login' && passkeySupported && ((() => { try { return localStorage.getItem(STORAGE_KEY) } catch { return null } })()) && (
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
  // ── Repetir pedido en 1 clic ──────────────────────────────────────────────
  const reorderPedido = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation()
    setReordering(orderId)
    try {
      const res = await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.items?.length) {
        try { sessionStorage.setItem('reorder_items', JSON.stringify(data.items)) } catch {}
        toast.success('✅ Llevándote al carrito...')
        router.push('/cart?reorder=1')
      }
    } catch { toast.error('Error al repetir el pedido') }
    finally { setReordering(null) }
  }


  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header premium */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tab !== '' && (
              <button onClick={() => setTab('')}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors mr-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm shadow-primary-200">
              <span className="text-white font-black text-base">{(perfil?.nombre || user.email)[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{perfil?.nombre || 'Mi cuenta'}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Volver a la tienda — visible siempre */}
            <a href="/catalogo"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50 font-medium border border-gray-200 hover:border-primary-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Tienda
            </a>
            <a href="/" className="sm:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-primary-50 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} points="9 22 9 12 15 12 15 22" />
              </svg>
            </a>
            <button onClick={cerrarSesion}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 font-medium">
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Dashboard premium — menú principal */}
        {tab === '' ? (
          <div className="space-y-3 mb-4 pt-2">
            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-black text-gray-900">{pedidos.filter(p => p.pago_estado==='pagado').length}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Pedidos</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-black text-primary-600">{suscripciones.filter(s => s.activa).length}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Suscripciones</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-black text-gray-900">{recetas.length}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Recetas</p>
              </div>
            </div>

            {/* Suscripción activa — highlight card si existe */}
            {suscripciones.filter(s => s.activa).length > 0 && (() => {
              const s = suscripciones.find(s => s.activa)!
              const proxDias = s.proximo_envio ? Math.ceil((new Date(s.proximo_envio).getTime() - Date.now()) / 86400000) : null
              return (
                <button onClick={() => setTab('suscripciones')}
                  className="w-full bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl p-4 text-left text-white shadow-md shadow-primary-100 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-200">Suscripción activa</span>
                    <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">-{s.descuento_pct}%</span>
                  </div>
                  <p className="font-bold text-base leading-tight">
                    {({'15_dias':'Cada 15 días','mensual':'Mensual','trimestral':'Cada 3 meses'} as any)[s.frecuencia] ?? s.frecuencia}
                  </p>
                  {proxDias != null && (
                    <p className="text-xs text-primary-100 mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Próxima entrega {proxDias === 0 ? 'hoy' : `en ${proxDias} día${proxDias !== 1 ? 's' : ''}`}
                    </p>
                  )}
                </button>
              )
            })()}

            {/* Grid de acciones principales */}
            <div className="grid grid-cols-2 gap-2">
              {[
                {id:'pedidos',       label:'Pedidos',         desc:'Historial',              icon:Package,     grad:'from-blue-50 to-blue-50',     iconBg:'bg-blue-100 text-blue-600'},
                {id:'suscripciones', label:'Suscripciones',   desc:'Entregas automáticas',   icon:Repeat,      grad:'from-violet-50 to-violet-50', iconBg:'bg-violet-100 text-violet-600'},
                {id:'recetas',       label:'Mis Recetas',     desc:'Prescripciones',         icon:FileText,    grad:'from-teal-50 to-teal-50',     iconBg:'bg-teal-100 text-teal-600'},
                {id:'pagos',         label:'Métodos de pago', desc:'Tarjetas',               icon:CreditCard,  grad:'from-emerald-50 to-emerald-50',iconBg:'bg-emerald-100 text-emerald-600'},
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`bg-gradient-to-br ${t.grad} border border-white rounded-2xl p-4 text-left hover:shadow-md transition-all active:scale-[0.98]`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${t.iconBg}`}>
                    <t.icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{t.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Fila secundaria */}
            <div className="grid grid-cols-2 gap-2">
              {[
                {id:'perfil',      label:'Mi Perfil',   desc:'Datos personales',  icon:User,        iconBg:'bg-orange-100 text-orange-600'},
                {id:'direcciones', label:'Direcciones', desc:'Puntos de entrega', icon:MapPin,      iconBg:'bg-pink-100 text-pink-600'},
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-gray-200 hover:shadow-sm transition-all active:scale-[0.98]">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${t.iconBg}`}>
                    <t.icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{t.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Seguridad */}
            <button onClick={() => setTab('seguridad')}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">Seguridad</p>
                <p className="text-[10px] text-gray-400">Contraseña y autenticación</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>

            <button onClick={cerrarSesion}
              className="w-full border border-red-100 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-all text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        ) : null}

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
                    {p.pago_estado === 'pagado' && (
                      <a
                        href={`/pedido/${p.numero_orden}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs border border-primary-200 text-primary-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-primary-50 transition-colors">
                        📦 Seguir pedido
                      </a>
                    )}
                    {p.pago_estado === 'pagado' && (
                      <button
                        onClick={e => reorderPedido(e, p.id)}
                        disabled={reordering === p.id}
                        className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm">
                        <RefreshCw className={`w-3 h-3 ${reordering===p.id?'animate-spin':''}`} />
                        {reordering === p.id ? 'Añadiendo...' : 'Repetir pedido'}
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}


        {/* TAB: SUSCRIPCIONES */}
        {tab==='suscripciones' && (
          <div className="space-y-3 pt-1">
            {/* Encabezado de sección */}
            <div className="mb-2">
              <h2 className="font-black text-gray-900 text-lg">Suscripciones</h2>
              <p className="text-xs text-gray-400 mt-0.5">Entregas automáticas con descuento garantizado</p>
            </div>

            {suscripciones.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Repeat className="w-7 h-7 text-violet-400" />
                </div>
                <p className="font-bold text-gray-800 mb-1">Sin suscripciones aún</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Activa la suscripción al comprar y recibe tus lentes automáticamente con hasta 15% de descuento.
                </p>
                <a href="/catalogo"
                  className="mt-5 inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">
                  Ver catálogo →
                </a>
              </div>
            ) : suscripciones.map(s => {
              let items: any[] = []
              try { items = typeof s.items === 'string' ? JSON.parse(s.items) : (s.items ?? []) } catch {}
              const proxDias = s.proximo_envio ? Math.ceil((new Date(s.proximo_envio).getTime() - Date.now()) / 86400000) : null
              const FREQ: Record<string,string> = { '15_dias':'Cada 15 días', mensual:'Mensual', bimestral:'Bimestral', trimestral:'Cada 3 meses'}
              const totalBruto = items.reduce((a: number, i: any) => a + (i.precio ?? 0) * (i.cantidad ?? 1), 0)
              const totalDesc  = Math.round(totalBruto * (1 - (s.descuento_pct ?? 0) / 100))
              const ahorro     = totalBruto - totalDesc
              const urgente    = proxDias != null && proxDias <= 3

              return (
                <div key={s.id} className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${s.activa ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200 opacity-70'}`}>

                  {/* Banda superior de estado */}
                  <div className={`px-4 py-2 flex items-center justify-between ${s.activa ? 'bg-gradient-to-r from-primary-600 to-emerald-600' : 'bg-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.activa ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-xs font-bold text-white/90">
                        {s.activa ? 'Suscripción activa' : 'Pausada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                        {FREQ[s.frecuencia] ?? s.frecuencia}
                      </span>
                      {s.descuento_pct > 0 && (
                        <span className="text-[10px] font-bold bg-white text-primary-700 px-2 py-0.5 rounded-full">
                          -{s.descuento_pct}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Productos */}
                    <div className="space-y-2 mb-3">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 text-sm">👁</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight">{item.nombre}{item.size ? ` · ${item.size}` : ''}</p>
                            {(item.sph != null || item.ojo) && (
                              <p className="text-[10px] font-mono text-blue-600 mt-0.5">
                                {[item.sph!=null?`Esf. ${parseFloat(item.sph)>0?'+':''}${item.sph}`:null,item.cyl?`Cil. ${item.cyl}`:null,item.ojo].filter(Boolean).join(' · ')}
                              </p>
                            )}
                            {item.color && <p className="text-[10px] text-gray-400 mt-0.5">Color: {item.color}</p>}
                          </div>
                          <p className="text-xs font-bold text-gray-700 shrink-0">×{item.cantidad}</p>
                        </div>
                      ))}
                    </div>

                    {/* Precio + ahorro */}
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Precio por entrega</p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-black text-gray-900">RD${totalDesc.toLocaleString()}</span>
                          {ahorro > 0 && <span className="text-[10px] text-gray-400 line-through">RD${totalBruto.toLocaleString()}</span>}
                        </div>
                      </div>
                      {ahorro > 0 && (
                        <div className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1.5 rounded-xl text-right">
                          <p className="text-[10px] font-medium">Ahorras</p>
                          <p>RD${ahorro.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Próxima entrega */}
                    {s.proximo_envio && (
                      <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 ${urgente ? 'bg-amber-50 border border-amber-100' : 'bg-blue-50'}`}>
                        <Calendar className={`w-3.5 h-3.5 shrink-0 ${urgente ? 'text-amber-600' : 'text-blue-500'}`} />
                        <div className="flex-1">
                          <p className={`text-[10px] font-semibold ${urgente ? 'text-amber-600' : 'text-blue-500'}`}>Próxima entrega</p>
                          <p className={`text-xs font-bold ${urgente ? 'text-amber-800' : 'text-blue-800'}`}>
                            {new Date(s.proximo_envio).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'})}
                          </p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${urgente ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {proxDias === 0 ? 'Hoy' : proxDias === 1 ? 'Mañana' : `${proxDias} días`}
                        </span>
                      </div>
                    )}

                    {s.direccion_texto && (
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" />{s.direccion_texto}
                      </p>
                    )}

                    {/* Cancelar */}
                    <button onClick={() => { setCancelandoSub(s); setMotivoCancel('') }}
                      className="w-full border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                      <X className="w-3.5 h-3.5" /> Cancelar suscripción
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal: motivo cancelación */}
        {cancelandoSub && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="font-black text-gray-900">Cancelar suscripción</p>
                <button onClick={() => setCancelandoSub(null)} className="p-1.5 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-amber-800 font-semibold text-sm">¿Seguro que quieres cancelar?</p>
                  <p className="text-amber-600 text-xs mt-1">Perderás el descuento del {cancelandoSub.descuento_pct}% y las entregas automáticas.</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Motivo (opcional)</label>
                  <select value={motivoCancel} onChange={e => setMotivoCancel(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                    <option value="">Seleccionar motivo...</option>
                    <option value="ya_no_uso_lentes">Ya no uso lentes de contacto</option>
                    <option value="precio">El precio es muy alto</option>
                    <option value="cambio_de_lente">Cambié de tipo de lente</option>
                    <option value="problemas_entrega">Problemas con las entregas</option>
                    <option value="pausar_temporalmente">Solo quiero pausar temporalmente</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>
              </div>
              <div className="px-5 pb-5 flex gap-3">
                <button onClick={() => setCancelandoSub(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  Mantener
                </button>
                <button onClick={() => cancelarSuscripcion(cancelandoSub)} disabled={cancelLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
                  {cancelLoading ? 'Procesando...' : 'Cancelar suscripción'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: confirmación de cobro pendiente */}
        {cancelConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-black text-gray-900">⚠️ Pedido pendiente de pago</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-red-800 font-semibold text-sm leading-snug">{cancelConfirm.mensaje}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total a cobrar</span>
                  <span className="font-black text-gray-900 text-lg">RD${cancelConfirm.total_pendiente?.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">Se procesará el cobro con la tarjeta registrada</p>
              </div>
              <div className="px-5 pb-5 space-y-2">
                <button onClick={() => cancelarSuscripcion(cancelConfirm.sub, true)} disabled={cancelLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                  {cancelLoading ? 'Procesando...' : 'Aceptar cobro y cancelar suscripción'}
                </button>
                <button onClick={() => { setCancelConfirm(null); setMotivoCancel('') }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  Mantener mi suscripción
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECETAS */}
        {tab==='recetas' && (
          <div className="space-y-3">

            {/* Recetas guardadas */}
            {recetas.map(r => {
              const fechaEmision = r.fecha_emision ? new Date(r.fecha_emision) : null
              const ahora = new Date()
              const mesesDesde = fechaEmision ? (ahora.getFullYear() - fechaEmision.getFullYear()) * 12 + (ahora.getMonth() - fechaEmision.getMonth()) : null
              const vencida = mesesDesde !== null && mesesDesde >= 12
              const proxVencer = mesesDesde !== null && mesesDesde >= 10 && mesesDesde < 12
              return (
                <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-4 ${vencida ? 'border-red-200' : proxVencer ? 'border-amber-200' : 'border-gray-100'}`}>
                  {/* Alerta vencimiento */}
                  {vencida && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-3 flex items-start gap-2">
                      <span className="text-red-500 text-base shrink-0 mt-0.5">⚠️</span>
                      <div>
                        <p className="text-red-700 font-bold text-xs">Receta vencida ({mesesDesde} meses)</p>
                        <p className="text-red-600 text-xs mt-0.5">Tu receta tiene más de un año. Te recomendamos visitar un optometrista antes de comprar.</p>
                        <a href="https://wa.me/18294728328?text=Hola%2C%20necesito%20información%20sobre%20revisión%20visual"
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold text-red-600 underline mt-1 inline-block">Solicitar consulta →</a>
                      </div>
                    </div>
                  )}
                  {proxVencer && !vencida && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-3 flex items-start gap-2">
                      <span className="text-amber-500 text-base shrink-0 mt-0.5">🕐</span>
                      <p className="text-amber-700 text-xs font-medium">Tu receta está próxima a vencer ({mesesDesde} meses). Considera hacer una revisión pronto.</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900 text-sm">{r.nombre}</p>
                    <div className="flex items-center gap-1.5">
                      {r.diagnostico && <span className="text-xs font-semibold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full capitalize">{r.diagnostico}</span>}
                      {fechaEmision && <span className="text-xs text-gray-400">{fechaEmision.getFullYear()}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[['OD Derecho',r.od_sph,r.od_cyl,r.od_axis,r.od_add],['OI Izquierdo',r.oi_sph,r.oi_cyl,r.oi_axis,r.oi_add]].map(([label,sph,cyl,axis,add]) => (
                      <div key={String(label)} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 mb-1.5">{label}</p>
                        <div className="space-y-1 text-xs font-mono">
                          {sph && <p><span className="text-gray-400">Esfera </span><span className="font-bold text-gray-800">{Number(sph) > 0 ? '+' : ''}{sph}</span></p>}
                          {cyl && <p><span className="text-gray-400">Cil. </span><span className="font-bold text-gray-800">{cyl}</span></p>}
                          {axis && <p><span className="text-gray-400">Eje </span><span className="font-bold text-gray-800">{String(axis).padStart(3,'0')}°</span></p>}
                          {add && <p><span className="text-gray-400">Ad. </span><span className="font-bold text-gray-800">{add}</span></p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botones acción */}
                  <div className="flex gap-2">
                    <a href={`/receta?od_sph=${r.od_sph}&od_cyl=${r.od_cyl}&oi_sph=${r.oi_sph}&oi_cyl=${r.oi_cyl}`}
                      className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary-700 transition-colors">
                      🛒 Ver mis lentes
                    </a>
                    <button onClick={() => eliminarReceta(r.id)}
                      className="px-3 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Sección: subir imagen */}
            {!agregandoReceta && (
              <div className="space-y-3">
                {/* Upload con IA */}
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🤖</span>
                    <p className="font-bold text-gray-900 text-sm">Subir foto de mi receta</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold ml-auto">IA</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Toma una foto clara de tu receta óptica y la IA leerá automáticamente la Esfera, Cilindro, Eje y Adición, y te recomendará los lentes ideales.
                  </p>
                  <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-5 cursor-pointer transition-all
                    ${analizandoIA ? 'border-blue-400 bg-blue-50' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                    {analizandoIA ? (
                      <div className="text-center">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-blue-700 font-semibold text-sm">Analizando tu receta...</p>
                        <p className="text-blue-500 text-xs mt-0.5">La IA está leyendo los valores</p>
                      </div>
                    ) : recetaImagenPreview && recetaAnalizada ? (
                      <div className="text-center">
                        <span className="text-2xl">✅</span>
                        <p className="text-green-700 font-bold text-sm mt-1">Receta leída correctamente</p>
                        <p className="text-green-600 text-xs mt-0.5 capitalize">{recetaAnalizada.diagnostico}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl mb-1 block">📷</span>
                        <p className="text-blue-700 font-semibold text-sm">Toca para subir foto</p>
                        <p className="text-gray-400 text-xs mt-0.5">JPG, PNG o PDF · máx 10MB</p>
                      </div>
                    )}
                    <input type="file" accept="image/*,application/pdf" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) subirYAnalizarReceta(f) }} />
                  </label>
                  {recetaAnalizada && (
                    <div className="mt-3 bg-white rounded-xl p-3 border border-green-100">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Valores detectados</p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {recetaAnalizada.od_sph != null && <span className="bg-gray-50 rounded-lg px-2 py-1">OD Esf: <b>{recetaAnalizada.od_sph > 0 ? '+' : ''}{recetaAnalizada.od_sph}</b></span>}
                        {recetaAnalizada.od_cyl != null && <span className="bg-gray-50 rounded-lg px-2 py-1">OD Cil: <b>{recetaAnalizada.od_cyl}</b></span>}
                        {recetaAnalizada.oi_sph != null && <span className="bg-gray-50 rounded-lg px-2 py-1">OI Esf: <b>{recetaAnalizada.oi_sph > 0 ? '+' : ''}{recetaAnalizada.oi_sph}</b></span>}
                        {recetaAnalizada.oi_cyl != null && <span className="bg-gray-50 rounded-lg px-2 py-1">OI Cil: <b>{recetaAnalizada.oi_cyl}</b></span>}
                        {recetaAnalizada.add_power != null && <span className="bg-purple-50 rounded-lg px-2 py-1 col-span-2">ADD: <b>+{recetaAnalizada.add_power}</b></span>}
                      </div>
                      {recetaAnalizada.notas && <p className="text-xs text-amber-600 mt-2 italic">💡 {recetaAnalizada.notas}</p>}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setAgregandoReceta(true) }}
                          className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-xs font-bold transition-colors hover:bg-primary-700">
                          Revisar y guardar receta
                        </button>
                        <a href={`/receta?od_sph=${recetaAnalizada.od_sph}&oi_sph=${recetaAnalizada.oi_sph}&od_cyl=${recetaAnalizada.od_cyl}&oi_cyl=${recetaAnalizada.oi_cyl}`}
                          className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-xs font-bold text-center transition-colors hover:bg-teal-700">
                          Ver mis lentes 🛒
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Agregar manual */}
                <button onClick={() => { setAgregandoReceta(true); setRecetaAnalizada(null); setRecetaImagenPreview(null) }}
                  className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors text-sm">
                  <Plus className="w-4 h-4" /> Ingresar valores manualmente
                </button>
              </div>
            )}

            {/* Formulario manual */}
            {agregandoReceta && (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-900 text-sm">Nueva receta</p>
                  {recetaAnalizada && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">🤖 Completada por IA</span>}
                </div>
                <input value={recetaForm.nombre} onChange={e => setRecetaForm(f => ({...f,nombre:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nombre (ej: Receta 2025)" />
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Fecha de emisión de la receta</label>
                  <input type="date" value={fechaEmisionForm} onChange={e => setFechaEmisionForm(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    max={new Date().toISOString().slice(0,10)} />
                  <p className="text-xs text-gray-400 mt-1">Si tiene más de 1 año, te avisaremos que necesitas una revisión</p>
                </div>
                {(recetaForm.od_sph||recetaForm.oi_sph) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-blue-800 font-semibold">
                    Diagnóstico: {detectarDiagnostico(recetaForm)||'—'}
                  </div>
                )}
                {[['OD Ojo Derecho','od'],['OI Ojo Izquierdo','oi']].map(([label,side]) => (
                  <div key={side}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                          { label: 'Esfera (SPH)', key: 'sph', ph: '-2.50',  hint: 'Tu graduación principal' },
                          { label: 'Cilindro (CYL)', key: 'cyl', ph: '-0.75', hint: 'Astigmatismo' },
                          { label: 'Eje (AXIS)', key: 'axis', ph: '180',    hint: 'Orientación' },
                          { label: 'Adición (ADD)', key: 'add', ph: '+1.50', hint: 'Para lectura' },
                        ].map(({ label: fieldLabel, key: fieldKey, ph, hint }) => {
                        const k = side+'_'+fieldKey
                        return (
                          <div key={fieldKey}>
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">{fieldLabel}</p>
                            <p className="text-[9px] text-gray-400 mb-1">{hint}</p>
                            <input value={(recetaForm as any)[k]} onChange={e => setRecetaForm(f => ({...f,[k]:e.target.value}))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder={ph} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={async () => {
                    const diagnostico = detectarDiagnostico(recetaForm)
                    const sb = createClient()
                    const { data } = await sb.from('prescriptions').insert({
                      user_id: user.id, ...recetaForm, diagnostico,
                      fecha_emision: fechaEmisionForm || null,
                    }).select().single()
                    if (data) {
                      setRecetas(rs => [data, ...rs])
                      setAgregandoReceta(false)
                      setRecetaAnalizada(null)
                      setRecetaImagenPreview(null)
                      setFechaEmisionForm('')
                      setRecetaForm({ nombre:'Mi receta',diagnostico:'',od_sph:'',od_cyl:'',od_axis:'',od_add:'',oi_sph:'',oi_cyl:'',oi_axis:'',oi_add:'' })
                    }
                  }} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar receta</button>
                  <button onClick={() => { setAgregandoReceta(false); setRecetaAnalizada(null); setFechaEmisionForm('') }}
                    className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PAGOS */}
        {tab==='pagos' && (
          <div className="space-y-3 pt-1">
            <div className="mb-2">
              <h2 className="font-black text-gray-900 text-lg">Métodos de pago</h2>
              <p className="text-xs text-gray-400 mt-0.5">Referencia de tus tarjetas — nunca guardamos el número completo</p>
            </div>

            {/* Security badge */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pago 100% seguro</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Procesado por AZUL · Banco Popular · Cifrado SHA-512</p>
              </div>
              <div className="ml-auto flex gap-1">
                <span className="text-[9px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded font-bold">VISA</span>
                <span className="text-[9px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded font-bold">MC</span>
              </div>
            </div>

            {pagos.length===0 && !agregandoPago && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-gray-300" />
                </div>
                <p className="font-bold text-gray-700 text-sm">Sin tarjetas guardadas</p>
                <p className="text-xs text-gray-400 mt-1">Agrega una referencia para identificar tu tarjeta</p>
              </div>
            )}

            {pagos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card visual */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[0,1,2,3].map(i => <div key={i} className="w-5 h-1.5 bg-white/30 rounded-full" />)}
                      <span className="text-white font-bold text-sm ml-2">{p.ultimos4}</span>
                    </div>
                  </div>
                  <button onClick={() => eliminarPago(p.id)} className="text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.titular}</p>
                    <p className="text-[10px] text-gray-400">Vence {p.vencimiento}</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">Activa</span>
                </div>
              </div>
            ))}

            {agregandoPago ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-5 space-y-3">
                <p className="font-bold text-gray-900 text-sm mb-1">Agregar referencia de tarjeta</p>
                <input value={pagoForm.titular} onChange={e => setPagoForm(f => ({...f,titular:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Nombre del titular" />
                <input value={pagoForm.ultimos4} onChange={e => setPagoForm(f => ({...f,ultimos4:e.target.value.slice(0,4)}))}
                  maxLength={4} inputMode="numeric"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono tracking-widest"
                  placeholder="Últimos 4 dígitos" />
                <input value={pagoForm.vencimiento} onChange={e => setPagoForm(f => ({...f,vencimiento:e.target.value}))}
                  maxLength={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="MM/AA" />
                <div className="flex gap-2 pt-1">
                  <button onClick={guardarPago} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-bold transition-colors">Guardar</button>
                  <button onClick={() => setAgregandoPago(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoPago(true)}
                className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2.5 text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all group">
                <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">Agregar tarjeta</span>
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

            {/* Lista de direcciones guardadas */}
            {direcciones.map(d => {
              const isEditingMap = mapEditId === d.id
              const ETIQUETA_ICON: Record<string,string> = { Casa:'🏠', Trabajo:'💼', Otro:'📍' }
              return (
                <div key={d.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${d.principal ? 'border-primary-300' : 'border-gray-100'}`}>
                  {/* Header dirección */}
                  <div className="flex items-start gap-3 p-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg ${d.principal ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      {ETIQUETA_ICON[d.etiqueta ?? 'Casa'] ?? '📍'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{d.etiqueta ?? 'Dirección'}</p>
                        {d.principal && <span className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">Principal</span>}
                        {d.lat && d.lng && <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">📍 Mapa</span>}
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{d.direccion}</p>
                      <p className="text-xs text-gray-400">{d.ciudad}</p>
                      {d.referencias && <p className="text-xs text-gray-400 italic mt-0.5">{d.referencias}</p>}
                    </div>
                    <button onClick={() => eliminarDireccion(d.id)} className="text-gray-300 hover:text-red-500 p-1 shrink-0">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 px-4 pb-3">
                    {!d.principal && (
                      <button onClick={() => marcarPrincipal(d.id)}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors">
                        ★ Marcar principal
                      </button>
                    )}
                    <button onClick={() => setMapEditId(isEditingMap ? null : d.id)}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                        isEditingMap
                          ? 'border-gray-300 bg-gray-100 text-gray-600'
                          : d.lat ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                      }`}>
                      {isEditingMap ? 'Cerrar mapa' : d.lat ? '✏️ Editar pin' : '📍 Agregar pin'}
                    </button>
                    {d.lat && d.lng && (
                      <a href={`https://www.google.com/maps?q=${d.lat},${d.lng}`} target="_blank" rel="noopener"
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                        Ver
                      </a>
                    )}
                  </div>

                  {/* Mapa edición inline */}
                  {isEditingMap && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                      <LocationPicker
                        initialLat={d.lat}
                        initialLng={d.lng}
                        initialAddress={d.direccion + ', ' + d.ciudad}
                        onSave={async (data: LocationData) => {
                          await guardarMapaDireccion(d.id, data.lat, data.lng)
                        }}
                        onCancel={() => setMapEditId(null)}
                      />
                    </div>
                  )}

                  {/* Mini preview si tiene pin y no está editando */}
                  {d.lat && d.lng && !isEditingMap && process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                    <div className="border-t border-gray-50">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${d.lat},${d.lng}&zoom=16&size=600x120&scale=2&markers=color:green%7C${d.lat},${d.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                        alt="Mapa de ubicación de entrega"
                        className="w-full object-cover"
                        style={{height:100}}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Formulario nueva dirección */}
            {showAddDir ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">Nueva dirección</p>
                  <button onClick={() => { setShowAddDir(false); setNewDirStep('form') }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4"/>
                  </button>
                </div>

                {newDirStep === 'form' ? (
                  <div className="p-4 space-y-3">
                    {/* Etiqueta */}
                    <div className="flex gap-2">
                      {['Casa','Trabajo','Otro'].map(e => (
                        <button key={e} onClick={() => setNewDirData(d => ({...d, etiqueta:e}))}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${newDirData.etiqueta===e ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                          {e === 'Casa' ? '🏠' : e === 'Trabajo' ? '💼' : '📍'} {e}
                        </button>
                      ))}
                    </div>
                    <input value={newDirData.direccion} onChange={e => setNewDirData(d => ({...d,direccion:e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Calle, número, sector *"/>
                    <select value={newDirData.ciudad} onChange={e => setNewDirData(d => ({...d,ciudad:e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                      {['Santo Domingo','Santiago','La Romana','San Pedro de Macorís','Puerto Plata','Punta Cana','San Cristóbal','La Vega','Bonao','Baní','Otra ciudad'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input value={newDirData.referencias} onChange={e => setNewDirData(d => ({...d,referencias:e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Referencias: portón azul, cerca del parque... (opcional)"/>

                    {/* Preview pin si ya marcó */}
                    {newDirLat && newDirLng && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <MapPin className="w-4 h-4 text-green-600 shrink-0"/>
                        <p className="text-xs text-green-700 flex-1 truncate">{newDirMapAddr ?? 'Pin marcado'}</p>
                        <button onClick={() => { setNewDirLat(null); setNewDirLng(null); setNewDirMapAddr(null) }}
                          className="text-green-500 hover:text-green-700">
                          <X className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setNewDirStep('map')}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                        {newDirLat ? '✏️ Editar pin' : '📍 Marcar en mapa'}
                      </button>
                      <button onClick={agregarDireccion}
                        disabled={!newDirData.direccion.trim()}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition-colors">
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-3">Marca el pin exacto de tu dirección</p>
                    <LocationPicker
                      initialLat={newDirLat}
                      initialLng={newDirLng}
                      initialAddress={newDirData.direccion ? `${newDirData.direccion}, ${newDirData.ciudad}` : null}
                      onSave={(data: LocationData) => {
                        setNewDirLat(data.lat)
                        setNewDirLng(data.lng)
                        setNewDirMapAddr(data.direccion_completa)
                        setNewDirStep('form')
                      }}
                      onCancel={() => setNewDirStep('form')}
                    />
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAddDir(true)}
                className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5"/> Nueva dirección
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
            <a href={"https://wa.me/18294728328?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido%20%23"+selectedPedido.id.slice(-6).toUpperCase()}
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
