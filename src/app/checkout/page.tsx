'use client'
import { descuentoPct, labelFrecuencia, labelDescuento, proxEnvio } from '@/lib/subscription-utils'
import { trackEcommerce, trackCheckoutReviewed, trackAzulRedirect } from '@/lib/analytics'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase'
import EntregaBadge from '@/components/shop/EntregaBadge'
import DisclaimerMedico, { DisclaimerData, DISCLAIMER_VERSION } from '@/components/legal/DisclaimerMedico'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Shield, Truck, RotateCcw, Lock, ChevronRight, Tag, Check, MapPin, User, Phone, Mail } from 'lucide-react'

const schema = z.object({
  nombre:               z.string().min(3, 'Nombre requerido'),
  email:                z.string().email('Email inválido'),
  telefono:             z.string().min(10, 'Teléfono requerido'),
  direccion:            z.string().min(5, 'Dirección requerida'),
  ciudad:               z.string().min(2, 'Ciudad requerida'),
  ciudadPersonalizada:  z.string().optional(),
})
type FormData = z.infer<typeof schema>

const CIUDADES = ['Santo Domingo','Santiago','La Romana','San Pedro de Macorís','Puerto Plata',
  'Punta Cana','San Cristóbal','La Vega','Bonao','Baní','Otra ciudad']

// AZUL disponible solo cuando hay AUTH_KEY configurada
const AZUL_READY = Boolean(process.env.NEXT_PUBLIC_AZUL_READY)

export default function CheckoutPage() {
  useEffect(() => {
    // Trackear inicio de checkout
    try {
      const cartItems = useCartStore.getState().items
      if (cartItems && cartItems.length > 0) {
        trackEcommerce('begin_checkout', {
          items: cartItems.map((i: any) => ({ item_id: i.id, item_name: i.nombre, item_brand: i.marca ?? '', price: i.precio, quantity: i.quantity ?? 1 })),
          value: cartItems.reduce((s: number, i: any) => s + i.precio * (i.quantity ?? 1), 0)
        })
      }
    } catch {}
  }, [])
  const router = useRouter()
  const { items, subtotal, total, clearCart, updateItem, removeByIndex, cuponCodigo, cuponDescuento, clearCupon } = useCartStore()
  const [loading, setLoading] = useState(false)
  // Cupón: pre-poblar desde el cart-store (el usuario lo aplicó en el carrito)
  const [cupon, setCupon] = useState(() => cuponCodigo ?? '')
  const [cuponAplicado, setCuponAplicado] = useState(() => !!cuponCodigo)
  const [descuento, setDescuento] = useState(() => cuponDescuento)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [disclaimerAceptado, setDisclaimerAceptado] = useState(false)
  const [disclaimerId, setDisclaimerId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'register'>('register')
  const [authEmail, setAuthEmail] = useState('')
  const [authPass, setAuthPass] = useState('')
  const [authFecha, setAuthFecha] = useState('')
  const [authNombre, setAuthNombre] = useState('')
  const [authTel, setAuthTel] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMsg, setAuthMsg] = useState('')
  const [step, setStep] = useState<1|2|3>(1)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddrId, setSelectedAddrId] = useState<string|null>(null)
  const metodoPago = 'tarjeta' as const

  const sub = subtotal()
  const envio = sub >= 8000 ? 0 : 200
  const totalFinal = sub + envio - descuento

  const { register, handleSubmit, getValues, setValue, trigger, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (items.length === 0) router.push('/cart')
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      if (user) {
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data: p }) => {
          if (p?.nombre) setValue('nombre', p.nombre)
          if (p?.email) setValue('email', p.email)
          if (p?.telefono) setValue('telefono', p.telefono)
        })
        sb.from('addresses').select('*').eq('user_id', user.id).order('principal', { ascending: false }).then(({ data: a }) => {
          if (a && a.length > 0) {
            setSavedAddresses(a)
            const principal = a.find((x:any) => x.principal) ?? a[0]
            setSelectedAddrId(principal.id)
            setValue('direccion', principal.direccion)
            if (principal.ciudad) setValue('ciudad', principal.ciudad)
          }
        })
      }
    })
  }, [items, router])

  const aplicarCupon = async () => {
    const code = cupon.trim().toUpperCase()
    if (!code) return
    try {
      const email = getValues('email') ?? ''
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: code, subtotal: sub, email: email || undefined }),
      })
      const result = await res.json()
      if (!result.valido) {
        toast.error(result.mensaje ?? 'Cupón no válido')
        setCuponAplicado(false)
        setDescuento(0)
        return
      }
      setDescuento(result.descuento)
      setCuponAplicado(true)
      toast.success(result.mensaje ?? 'Cupón aplicado ✓')
    } catch {
      toast.error('Error al validar cupón')
    }
  }

  const saveDisclaimer = async (dData: DisclaimerData, userId?: string) => {
    try {
      const r = await fetch('/api/disclaimer', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: userId||null, version: dData.version, tipo:'compra',
          user_agent: dData.user_agent, items_snapshot: dData.items_snapshot, accepted_at: dData.accepted_at }) })
      const res = await r.json()
      return res.disclaimer_id ?? null
    } catch { return null }
  }

  const handleDisclaimerAceptado = async (dData: DisclaimerData) => {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const id = await saveDisclaimer(dData, user?.id)
    if (id) setDisclaimerId(id)
    setDisclaimerAceptado(true)
    setShowDisclaimer(false)
    setStep(3)
    trackCheckoutReviewed(items.map((i: any) => ({ id: i.product.id, nombre: i.product.nombre, precio: Number(i.precio_final ?? i.product.precio) })), subtotal())
  }

  const createOrder = async (data: FormData) => {
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()

    // ─── TARJETA: crear orden PRIMERO, luego preparar AZUL con ID real ──
    if (metodoPago === 'tarjeta') {
      // 1. Crear la orden en Supabase primero (necesitamos el ID para la URL de retorno)
      const orderNum = `CG-${Date.now().toString().slice(-8)}`
      const { data: order, error } = await sb.from('orders').insert({
        user_id: user?.id ?? null,
        cliente_nombre: data.nombre, cliente_email: data.email, cliente_telefono: data.telefono,
        direccion_texto: `${data.direccion}, ${data.ciudad === 'Otra ciudad' && data.ciudadPersonalizada ? data.ciudadPersonalizada : data.ciudad}`,
        estado: 'pendiente', subtotal: sub, envio, total: totalFinal,
        descuento, metodo_pago: 'tarjeta', pago_estado: 'pendiente',
        numero_orden: orderNum,
        cupon_aplicado: cuponAplicado && cupon.trim() ? cupon.trim().toUpperCase() : null,
        cupon_descuento: cuponAplicado && descuento > 0 ? descuento : null,
        disclaimer_acceptance_id: disclaimerId || null, disclaimer_version: DISCLAIMER_VERSION,
        // Coordenadas de la dirección seleccionada
        ...(() => {
          const sel = savedAddresses.find((a:any) => a.id === selectedAddrId)
          return sel?.lat ? { lat: sel.lat, lng: sel.lng } : {}
        })(),
      }).select().single()

      if (error || !order) {
        toast.error('Error al procesar pedido: ' + (error?.message ?? 'Sin respuesta'))
        setLoading(false)
        return
      }
      // Marcar carrito como recuperado (usuario completó el checkout)
      try {
        const email = data.email
        if (email) createClient().from('abandoned_carts').update({ recuperado: true }).eq('cliente_email', email).then(() => {})
      } catch { /* silencioso */ }

      // 2. Guardar items — crítico: verificar que se guardan
      const itemsRes = await fetch('/api/orders/items', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ order_id: order.id, items: items.map(i => ({
          order_id:        order.id,
          product_id:      i.product.id,
          nombre:          i.product.nombre,
          precio:          Number((i as any).precio_final  ?? i.product.precio),
          precio_original: Number((i as any).precio_original ?? i.product.precio),
          descuento_pct:   descuentoPct((i as any).suscripcion ?? null),
          cantidad:        i.cantidad,
          // ── Receta unificada (nuevo modelo) ──────────────────────
          ojo_mode:      (i as any).ojo_mode   ?? null,
          misma_receta:  (i as any).misma_receta ?? null,
          sph:     i.sph     != null ? Number(i.sph)  : null,
          cyl:     i.cyl     != null ? Number(i.cyl)  : null,
          axis:    (i as any).axis   != null ? Number((i as any).axis) : null,
          add_power: i.add_power ?? null,
          sph_od:  (i as any).sph_od  != null ? Number((i as any).sph_od)  : null,
          sph_oi:  (i as any).sph_oi  != null ? Number((i as any).sph_oi)  : null,
          cyl_od:  (i as any).cyl_od  != null ? Number((i as any).cyl_od)  : null,
          cyl_oi:  (i as any).cyl_oi  != null ? Number((i as any).cyl_oi)  : null,
          axis_od: (i as any).axis_od != null ? Number((i as any).axis_od) : null,
          axis_oi: (i as any).axis_oi != null ? Number((i as any).axis_oi) : null,
          // ── Otros ────────────────────────────────────────────────
          color:   (i as any).color  ?? null,
          ojo:     (i as any).ojo_mode ?? (i as any).ojo ?? null, // legacy compat
          size:    (i as any).size   ?? null,
          suscripcion: (i as any).suscripcion ?? null,
        })) }) })
      if (!itemsRes.ok) {
        const itemsErr = await itemsRes.text().catch(() => 'unknown')
        console.error('[checkout] order_items FAILED:', itemsErr)
        // No bloqueamos el pago, pero lo logueamos
      }

      // 2b. Crear registro de suscripción si algún item tiene frecuencia
      const itemsConSubs = items.filter(i => (i as any).suscripcion)
      if (itemsConSubs.length > 0 && user?.id) {
        // Agrupa por frecuencia (puede haber ítems con distintas frecuencias)
        const frecuenciasPorItem = itemsConSubs.map(i => ({
          frecuencia:  (i as any).suscripcion as string,
          items_snap:  [{
            product_id: i.product.id,
            nombre:     i.product.nombre,
            cantidad:   i.cantidad,
            precio:     Number((i as any).precio_final ?? i.product.precio),
            size:       (i as any).size ?? null,
            ojo:        (i as any).ojo  ?? null,
            sph:        i.sph ?? null,
            cyl:        i.cyl ?? null,
          }],
          descuento_pct: descuentoPct((i as any).suscripcion),
        }))

        // Agrupar por frecuencia para crear un sub por frecuencia
        const byFreq: Record<string, typeof frecuenciasPorItem[0]> = {}
        frecuenciasPorItem.forEach(x => {
          if (!byFreq[x.frecuencia]) byFreq[x.frecuencia] = { ...x, items_snap: [] }
          byFreq[x.frecuencia].items_snap.push(...x.items_snap)
        })

        for (const [frecuencia, grp] of Object.entries(byFreq)) {
          const proximo = proxEnvio(frecuencia)
          await sb.from('subscriptions').insert({
            user_id:           user.id,
            cliente_nombre:    data.nombre,
            cliente_email:     data.email,
            cliente_telefono:  data.telefono,
            direccion_texto:   `${data.direccion}, ${data.ciudad}`,
            items:             grp.items_snap,
            frecuencia,
            descuento_pct:     grp.descuento_pct,
            proximo_envio:     proximo.toISOString().split('T')[0],
            activa:            false,   // se activa cuando el pago es confirmado
            order_id_origen:   order.id,
          })
        }
      }

      // 3. Preparar AZUL con el order.id real — el hash se calcula con la URL final correcta
      // Usamos orderNum (numero_orden) porque AZUL devuelve OrderNumber en el retorno
      const approvedUrl = `${window.location.origin}/api/azul/retorno?resultado=aprobado`
      const preRes = await fetch('/api/azul/preparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          order_number: orderNum, 
          // total omitido — el backend lo obtiene de Supabase por seguridad
          approved_url: approvedUrl
        })
      })
      if (!preRes.ok) {
        toast.error('Pago con tarjeta temporalmente no disponible. Por favor contáctanos por WhatsApp.')
        setLoading(false)
        return
      }
      const { url, fields } = await preRes.json()

      // 4. Enviar al portal AZUL con hash correcto (NO modificar fields)
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = url
      Object.entries(fields as Record<string,string>).forEach(([k,v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'; input.name = k; input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      trackAzulRedirect(orderNum, totalFinal); form.submit()
      return
    }

  }

  const handleAuth = async () => {
    setAuthLoading(true); setAuthMsg('')
    const sb = createClient()
    if (authMode === 'register') {
      const { error } = await sb.auth.signUp({ email: authEmail, password: authPass, options: { data: { nombre: authNombre, phone: authTel, fecha_nacimiento: authFecha } } })
      if (error) { setAuthMsg(error.message); setAuthLoading(false); return }
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, nombre: authNombre }),
      }).catch(() => {})
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        await sb.from('profiles').upsert({ id: user.id, nombre: authNombre, email: authEmail, telefono: authTel, role: 'customer' })
        setValue('nombre', authNombre); setValue('email', authEmail); if (authTel) setValue('telefono', authTel)
      }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email: authEmail, password: authPass })
      if (error) { setAuthMsg('Email o contraseña incorrectos'); setAuthLoading(false); return }
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        const { data: p } = await sb.from('profiles').select('*').eq('id', user.id).single()
        if (p?.nombre) setValue('nombre', p.nombre); if (p?.email) setValue('email', p.email); if (p?.telefono) setValue('telefono', p.telefono)
        const { data: a } = await sb.from('addresses').select('*').eq('user_id', user.id).order('principal', { ascending: false })
        if (a && a.length > 0) {
          setSavedAddresses(a)
          const principal = a.find((x:any) => x.principal) ?? a[0]
          setSelectedAddrId(principal.id)
          setValue('direccion', principal.direccion)
          if (principal.ciudad) setValue('ciudad', principal.ciudad)
        }
      }
    }
    setIsLoggedIn(true); setShowAuthModal(false); setAuthLoading(false)
    setStep(2)
  }

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger(['nombre','email','telefono'])
      if (!ok) return
      try {
        const sb2 = createClient()
        const vals = getValues()
        if (vals.email && items.length > 0) {
          await sb2.from('abandoned_carts').upsert({
            cliente_email:    vals.email,
            cliente_nombre:   vals.nombre ?? null,
            cliente_telefono: vals.telefono ?? null,
            items:            JSON.stringify(items.map(i => ({
              id: i.product.id, nombre: i.product.nombre,
              precio: (i as any).precio_final ?? i.product.precio,
              cantidad: i.cantidad, sph: i.sph ?? null,
            }))),
            total:            totalFinal,
            recuperado:       false,
            updated_at:       new Date().toISOString(),
          }, { onConflict: 'cliente_email', ignoreDuplicates: false })
        }
        // Guardar perfil para pre-llenar próxima compra
        const { data: { user: u } } = await sb2.auth.getUser()
        if (u && vals.nombre && vals.email) {
          sb2.from('profiles').upsert({ id: u.id, nombre: vals.nombre, email: vals.email, telefono: vals.telefono ?? null }, { onConflict: 'id' }).then(() => {})
        }
      } catch { /* no bloquear flujo si falla */ }
      if (!isLoggedIn) { setShowAuthModal(true); return }
      setStep(2)
    } else if (step === 2) {
      const ok = await trigger(['direccion','ciudad'])
      if (!ok) return
      if (!disclaimerAceptado) { setShowDisclaimer(true); return }
      // Guardar dirección principal para pre-llenar próxima compra
      try {
        const sb2 = createClient()
        const { data: { user: u } } = await sb2.auth.getUser()
        const vals = getValues()
        if (u && vals.direccion) {
          const ciudadFinal = vals.ciudad === 'Otra ciudad' && (vals as any).ciudadPersonalizada ? (vals as any).ciudadPersonalizada : vals.ciudad
          const { data: existing } = await sb2.from('addresses').select('id').eq('user_id', u.id).eq('principal', true).maybeSingle()
          if (!existing) {
            sb2.from('addresses').insert({ user_id: u.id, nombre: vals.nombre, direccion: vals.direccion, ciudad: ciudadFinal, telefono: vals.telefono ?? null, principal: true }).then(() => {})
          } else {
            sb2.from('addresses').update({ direccion: vals.direccion, ciudad: ciudadFinal, telefono: vals.telefono ?? null }).eq('id', existing.id).then(() => {})
          }
        }
      } catch { /* silencioso */ }
      setStep(3)
      trackCheckoutReviewed(items.map((i: any) => ({ id: i.product.id, nombre: i.product.nombre, precio: Number(i.precio_final ?? i.product.precio) })), subtotal())
    }
  }

  const steps = [
    { n: 1 as const, label: 'Información' },
    { n: 2 as const, label: 'Entrega' },
    { n: 3 as const, label: 'Confirmar' },
  ]

  return (
    <>
      <Navbar />
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('reintento') && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <p className="text-center text-sm text-amber-800 font-semibold">
            ⚠️ Tu pago anterior fue declinado. Verifica tu tarjeta e intenta de nuevo.
          </p>
        </div>
      )}
      {showDisclaimer && (
        <DisclaimerMedico showModal items={items} onAceptar={handleDisclaimerAceptado} onCancelar={() => setShowDisclaimer(false)} />
      )}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-md shadow-2xl p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Necesitas una cuenta</h2>
            <p className="text-sm text-gray-500 mb-5">Para rastrear tu pedido y guardar tu historial</p>
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              {(['register','login'] as const).map(m => (
                <button key={m} onClick={() => setAuthMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${authMode===m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                  {m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {authMode === 'register' && <>
                <input placeholder="Nombre completo" value={authNombre} onChange={e => setAuthNombre(e.target.value)} className="input w-full" required />
                <input placeholder="Teléfono (ej: 829-000-0000)" value={authTel} onChange={e => setAuthTel(e.target.value)} className="input w-full" type="tel" required />
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Fecha de nacimiento</label>
                  <input type="date" value={authFecha} onChange={e => setAuthFecha(e.target.value)}
                    max={new Date(Date.now()-18*365.25*24*60*60*1000).toISOString().split('T')[0]}
                    className="input w-full" required style={{fontSize:'16px'}} />
                  <p className="text-[10px] text-gray-400 mt-0.5">Solo mayores de 18 años</p>
                </div>
              </>}
              <input type="email" autoComplete="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="input w-full" />
              <input type="password" autoComplete="current-password" placeholder="Contraseña" value={authPass} onChange={e => setAuthPass(e.target.value)} className="input w-full" />
              {authMsg && <p className="text-red-500 text-xs">{authMsg}</p>}
              <button onClick={handleAuth} disabled={authLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                {authLoading ? 'Procesando...' : authMode === 'register' ? 'Crear cuenta y continuar' : 'Entrar y continuar'}
              </button>
              <button onClick={() => setShowAuthModal(false)} className="w-full text-sm text-gray-400 hover:text-gray-600 py-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="min-h-screen bg-gray-50 pb-24">
        {/* Barra de progreso */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-sm text-green-700 font-semibold">
              <Lock className="w-4 h-4" />
              <img src="/azul-badge.png" alt="Pago seguro AZUL" width="28" height="28" className="h-7 w-7 object-contain rounded" />
              <span className="hidden sm:inline text-xs">Pago seguro</span>
            </div>
            {/* Pasos */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center gap-1.5">
                  <button onClick={() => step > s.n && setStep(s.n)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-black transition-all ${
                      step === s.n ? 'bg-primary-600 text-white shadow-md scale-105' :
                      step > s.n ? 'bg-green-100 text-green-700 cursor-pointer' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                    {step > s.n ? <Check className="w-3 h-3" /> : <span>{s.n}</span>}
                    <span>{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-1 rounded-full transition-all ${step > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">{step}/3</div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="grid md:grid-cols-5 gap-6 items-start">

            {/* LEFT */}
            <div className="lg:col-span-3 space-y-3">

              {/* Paso 1 */}
              <div className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
                step === 1 ? 'border-primary-500 shadow-lg' :
                step > 1 ? 'border-green-200 cursor-pointer hover:border-green-300' :
                'border-gray-100'
              }`}>
                <div className="p-5 flex items-center justify-between" onClick={() => step > 1 && setStep(1)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Información de contacto</p>
                      {step > 1 && <p className="text-xs text-gray-400 mt-0.5">{getValues('nombre')} · {getValues('email')}</p>}
                    </div>
                  </div>
                  {step > 1 && <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Editar</span>}
                </div>

                {step === 1 && (
                  <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <label htmlFor="nombre" className="sr-only">Nombre completo</label>
                      <input id="nombre" {...register('nombre')} placeholder="Nombre completo" autoComplete="name"
                        aria-label="Nombre completo"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors" />
                      {errors.nombre && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {errors.nombre.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input id="email" {...register('email')} type="email" placeholder="Email" autoComplete="email"
                          aria-label="Correo electrónico"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email.message}</p>}
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <label htmlFor="telefono" className="sr-only">Teléfono</label>
                        <input id="telefono" {...register('telefono')} type="tel" placeholder="WhatsApp / Teléfono" autoComplete="tel"
                          aria-label="Número de teléfono"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors" />
                        {errors.telefono && <p className="text-red-500 text-xs mt-1">⚠️ {errors.telefono.message}</p>}
                      </div>
                    </div>
                    <button type="button" onClick={nextStep}
                      className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-200">
                      Continuar <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Paso 2 */}
              <div className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
                step === 2 ? 'border-primary-500 shadow-lg' :
                step > 2 ? 'border-green-200 cursor-pointer hover:border-green-300' :
                'border-gray-100 opacity-50'
              }`}>
                <div className="p-5 flex items-center justify-between" onClick={() => step > 2 && setStep(2)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Dirección de entrega</p>
                      {step > 2 && <p className="text-xs text-gray-400 mt-0.5">{getValues('direccion')}, {getValues('ciudad')}</p>}
                    </div>
                  </div>
                  {step > 2 && <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">Editar</span>}
                </div>

                {step === 2 && (
                  <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">

                    {/* Selector de direcciones guardadas */}
                    {savedAddresses.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase">Selecciona tu dirección</p>
                        {savedAddresses.map((addr:any) => {
                          const ICON: Record<string,string> = { Casa:'🏠', Trabajo:'💼', Otro:'📍' }
                          const isSelected = selectedAddrId === addr.id
                          return (
                            <button key={addr.id} type="button"
                              onClick={() => {
                                setSelectedAddrId(addr.id)
                                setValue('direccion', addr.direccion)
                                if (addr.ciudad) setValue('ciudad', addr.ciudad)
                              }}
                              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                              <div className="flex items-start gap-2">
                                <span className="text-base shrink-0 mt-0.5">{ICON[addr.etiqueta ?? 'Casa'] ?? '📍'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    {addr.etiqueta ?? 'Dirección'}
                                    {addr.principal && <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">Principal</span>}
                                    {addr.lat && <span className="text-[10px] text-green-600">📍 Pin</span>}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate">{addr.direccion}</p>
                                  <p className="text-xs text-gray-400">{addr.ciudad}</p>
                                  {addr.referencias && <p className="text-xs text-gray-400 italic">{addr.referencias}</p>}
                                </div>
                                {isSelected && <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>}
                              </div>
                              {/* Mini mapa preview si tiene pin */}
                              {isSelected && addr.lat && addr.lng && process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                                <div className="mt-2 rounded-lg overflow-hidden">
                                  <img
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${addr.lat},${addr.lng}&zoom=16&size=600x100&scale=2&markers=color:green%7C${addr.lat},${addr.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                                    alt="Mapa de ubicación de entrega" className="w-full object-cover" style={{height:80}}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                              )}
                            </button>
                          )
                        })}
                        <a href="/cuenta" className="text-xs text-primary-600 font-semibold flex items-center gap-1 pt-1">
                          <MapPin className="w-3 h-3"/> Agregar o editar direcciones
                        </a>
                      </div>
                    ) : (
                      /* Sin direcciones guardadas — input manual */
                      <div className="space-y-3">
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <label htmlFor="direccion" className="sr-only">Dirección</label>
                          <input id="direccion" {...register('direccion')} placeholder="Calle, número, sector, referencias" autoComplete="street-address"
                            aria-label="Dirección de entrega"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors" />
                          {errors.direccion && <p className="text-red-500 text-xs mt-1">⚠️ {errors.direccion.message}</p>}
                        </div>
                        <select {...register('ciudad')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 bg-white transition-colors">
                          <option value="">Selecciona tu ciudad</option>
                          {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {watch('ciudad') === 'Otra ciudad' && (
                          <input
                            {...register('ciudadPersonalizada')}
                            placeholder="Escribe tu ciudad *"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors mt-2"
                          />
                        )}
                        {errors.ciudad && <p className="text-red-500 text-xs">⚠️ {errors.ciudad.message}</p>}
                        {isLoggedIn && (
                          <a href="/cuenta" className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3"/> Guardar esta dirección en tu perfil
                          </a>
                        )}
                      </div>
                    )}

                    {items.some(i => i.product.tipo === 'torico') && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-start">
                        <span className="text-amber-500 shrink-0">⏱️</span>
                        <p className="text-xs text-amber-700 leading-relaxed"><strong>Tu pedido incluye lentes tóricos.</strong> Tiempo de fabricación: 20-30 días.</p>
                      </div>
                    )}

                    <button type="button" onClick={nextStep}
                      className="w-full bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-200">
                      Continuar <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Paso 3 */}
              <div className={`bg-white rounded-2xl border-2 transition-all duration-200 ${step === 3 ? 'border-primary-500 shadow-lg' : 'border-gray-100 opacity-50'}`}>
                <div className="p-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${step === 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                  <p className="font-bold text-gray-900 text-sm">Confirmar y pagar</p>
                </div>

                {step === 3 && (
                  <div className="px-5 pb-6 border-t border-gray-100 pt-5 space-y-4">

                    {/* Resumen cliente */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{getValues('nombre')}</p>
                          <p className="text-xs text-gray-400">{getValues('telefono')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 pl-0.5">
                        <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 pt-1.5">{getValues('direccion')}, {getValues('ciudad')}</p>
                      </div>
                    </div>

                    {/* ── REVISA TU PEDIDO ─────────────────────────────────────── */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                      <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                        📦 Revisa tu pedido
                      </p>
                      {items.map((item, idx) => {
                        const mode = (item as any).ojo_mode
                        const misma = (item as any).misma_receta !== false
                        const sph = item.sph != null ? (Number(item.sph) > 0 ? `+${Number(item.sph).toFixed(2)}` : Number(item.sph).toFixed(2)) : null
                        const sphOD = (item as any).sph_od != null ? (Number((item as any).sph_od) > 0 ? `+${Number((item as any).sph_od).toFixed(2)}` : Number((item as any).sph_od).toFixed(2)) : null
                        const sphOI = (item as any).sph_oi != null ? (Number((item as any).sph_oi) > 0 ? `+${Number((item as any).sph_oi).toFixed(2)}` : Number((item as any).sph_oi).toFixed(2)) : null
                        const precio = Number((item as any).precio_final ?? item.product.precio)
                        return (
                          <div key={idx} className="bg-white rounded-xl border border-gray-100 p-3 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{item.product.nombre}</p>
                              <p className="text-sm font-black text-gray-900 shrink-0">RD${(precio * item.cantidad).toLocaleString()}</p>
                            </div>
                            {/* ── Color del lente (si aplica) ── */}
                            {(item as any).color && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                🎨 {(item as any).color}
                              </span>
                            )}
                            {mode && (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                mode === 'AMBOS' ? 'bg-primary-100 text-primary-700' :
                                mode === 'OD'    ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {mode === 'AMBOS' ? '👀 Ambos ojos' : mode === 'OD' ? '👁 Ojo derecho' : '👁 Ojo izquierdo'}
                              </span>
                            )}
                            {mode === 'AMBOS' && !misma && (sphOD || sphOI) ? (
                              <div className="text-[10px] font-mono text-gray-600 space-y-0.5">
                                {sphOD && <p>OD: SPH {sphOD}{(item as any).cyl_od ? ` / CYL ${(item as any).cyl_od}` : ''}</p>}
                                {sphOI && <p>OI: SPH {sphOI}{(item as any).cyl_oi ? ` / CYL ${(item as any).cyl_oi}` : ''}</p>}
                              </div>
                            ) : sph ? (
                              <p className="text-[10px] font-mono text-gray-600">
                                SPH {sph}{item.cyl ? ` / CYL ${item.cyl}` : ''}{(item as any).axis ? ` / AXIS ${(item as any).axis}°` : ''}{item.add_power ? ` / ADD ${item.add_power}` : ''}
                              </p>
                            ) : null}
                            <p className="text-[10px] text-gray-500">{item.cantidad} {item.cantidad === 1 ? 'caja' : 'cajas'}</p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Método de pago — solo AZUL */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Método de pago</p>

                      {/* Tarjeta — AZUL */}
                      <div className="bg-white border-2 border-blue-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"/>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">Tarjeta de crédito / débito</p>
                            <p className="text-xs text-gray-400">Procesado por AZUL · Banco Popular</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <img src="/visa-blue.png" alt="Visa" width={36} height={14} className="h-4 object-contain" />
                            <img src="/mastercard.png" alt="Mastercard" width={44} height={18} className="h-5 object-contain" />
                            <img src="/azul-badge.png" alt="AZUL" width={28} height={28} className="h-7 w-7 object-contain rounded" />
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                          <img src="/azul-badge.png" alt="AZUL" width={20} height={20} className="h-5 w-5 object-contain rounded shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Serás redirigido al portal seguro de <strong>AZUL (Banco Popular)</strong>. ContactGo <strong>no almacena</strong> datos de tarjetas.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* T&C */}
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAceptaTerminos(!aceptaTerminos)}>
                      <div className={`w-5 h-5 rounded-lg border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${aceptaTerminos ? 'bg-primary-600 border-primary-600' : 'border-gray-300 hover:border-primary-400'}`}>
                        {aceptaTerminos && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed select-none">
                        He leído y acepto los{' '}
                        <a href="/terminos" target="_blank" onClick={e => e.stopPropagation()} className="text-primary-600 font-semibold hover:underline">Términos y Condiciones</a>
                        {', '}la{' '}
                        <a href="/privacidad" target="_blank" onClick={e => e.stopPropagation()} className="text-primary-600 font-semibold hover:underline">Política de Privacidad</a>
                        {' '}y la{' '}
                        <a href="/politica-receta" target="_blank" onClick={e => e.stopPropagation()} className="text-primary-600 font-semibold hover:underline">Política de Receta</a>
                      </p>
                    </div>

                    {/* Botón pagar */}
                    <button
                      onClick={handleSubmit(data => {
                        if (!aceptaTerminos) { toast.error('Acepta los Términos y Condiciones para continuar'); return }
                        createOrder(data)
                      })}
                      disabled={loading || !aceptaTerminos}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all text-base shadow-lg shadow-blue-200">
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Conectando con AZUL...
                        </>
                      ) : (
                        <>
                          <span>💳 Pagar · RD${totalFinal.toLocaleString()}</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Trust badges — solo 1 fila limpia */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <img src="/visa-blue.png" alt="Visa" width={36} height={14} className="h-4 object-contain opacity-60" />
                      <img src="/mastercard.png" alt="Mastercard" width={44} height={18} className="h-5 object-contain opacity-60" />
                      <img src="/visa-secure.png" alt="Visa Secure" width={44} height={18} className="h-5 object-contain opacity-60" />
                      <img src="/mastercard-id-check.png" alt="Mastercard ID Check" width={52} height={20} className="h-5 object-contain opacity-60" />
                    </div>

                    <p className="text-center text-[11px] text-gray-400">
                      🔒 Pago 100% seguro · SSL · 3D Secure · ContactGo no almacena datos de tarjetas
                    </p>

                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — resumen sticky */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-20 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900 text-sm">Resumen del pedido</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{items.length} {items.length===1?'producto':'productos'}</p>
                  </div>
                  {items.some(i => (i as any).suscripcion) && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      🔄 Con suscripción
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="p-4 space-y-3 max-h-56 overflow-y-auto border-b border-gray-50">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      {item.product.imagen_url && (
                        <Image src={item.product.imagen_url||"/placeholder-lens.png"} alt="" width={40} height={40} className="w-10 h-10 object-contain rounded-lg bg-gray-50 shrink-0 border border-gray-100" unoptimized />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2 flex-1">{item.product.nombre}</p>
                          <button onClick={() => removeByIndex(idx)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-1" title="Eliminar">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <EntregaBadge tipo={(item.product as any).tipo ?? 'esferico'} nombre={item.product.nombre} sph={item.sph} variant="checkout" />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(item as any).ojo && (item as any).ojo !== 'AMBOS' && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${(item as any).ojo === 'OD' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {(item as any).ojo === 'OD' ? '👁 OD' : '👁 OI'}
                            </span>
                          )}
                          {item.sph != null && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">Esf. {Number(item.sph)>0?`+${Number(item.sph).toFixed(2)}`:Number(item.sph).toFixed(2)}</span>}
                          {(item as any).cyl != null && (item as any).cyl !== 0 && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">Cil. {Number((item as any).cyl).toFixed(2)}</span>}
                          {(item as any).axis && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">{(item as any).axis}°</span>}
                          {(item as any).add_power && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">Ad. {(item as any).add_power}</span>}
                          {(item as any).color && <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">{(item as any).color}</span>}
                          {/* Tamaño / variante */}
                          {(item as any).size && (
                            <span className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                              📦 {(item as any).size}
                            </span>
                          )}
                        </div>
                        {/* Suscripción */}
                        {(item as any).suscripcion && (
                          <div className="mt-1 bg-green-50 border border-green-100 rounded-lg px-2 py-1">
                            <p className="text-[9px] font-black text-green-700 leading-tight">
                              🔄 Suscripción · {labelFrecuencia((item as any).suscripcion)}
                            </p>
                            <p className="text-[9px] text-green-600 leading-tight">
                              {labelDescuento((item as any).suscripcion)} · Cancela cuando quieras
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-1.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateItem(idx, Math.max(1, item.cantidad - 1))}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs transition-colors">−</button>
                            <span className="text-xs font-bold text-gray-700 w-5 text-center">{item.cantidad}</span>
                            <button onClick={() => updateItem(idx, item.cantidad + 1)}
                              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs transition-colors">+</button>
                          </div>
                          <div className="text-right">
                            {/* Precio original tachado si hay descuento */}
                            {(item as any).suscripcion && (item as any).precio_original &&
                             (item as any).precio_original > (item as any).precio_final && (
                              <p className="text-[9px] text-gray-400 line-through leading-none">
                                RD${((item as any).precio_original * item.cantidad).toLocaleString()}
                              </p>
                            )}
                            <span className="text-xs font-bold text-gray-900">
                              RD${(Number((item as any).precio_final ?? item.product.precio)*item.cantidad).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupón — si viene del carrito, mostrar banner; si no, input */}
                <div className="p-4 border-b border-gray-50">
                  {cuponAplicado ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-green-700">Cupón aplicado</p>
                          <p className="text-[11px] text-green-600 font-mono">{cupon.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-green-700">−RD${descuento.toLocaleString()}</span>
                        <button onClick={() => { setCupon(''); setCuponAplicado(false); setDescuento(0); clearCupon() }}
                          className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                          <input value={cupon} onChange={e => setCupon(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && aplicarCupon()}
                            placeholder="Código de cupón"
                            className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <button onClick={aplicarCupon} className="bg-gray-900 hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors">
                          Usar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Totales */}
                <div className="p-4 space-y-1.5">
                  {/* Descuento por suscripción */}
                  {items.some(i => (i as any).suscripcion) && (() => {
                    const ahorro = items.reduce((acc, i) => {
                      if (!(i as any).suscripcion) return acc
                      const orig = (i as any).precio_original ?? i.product.precio
                      const fin  = (i as any).precio_final    ?? i.product.precio
                      return acc + (orig - fin) * i.cantidad
                    }, 0)
                    return ahorro > 0 ? (
                      <div className="flex justify-between text-xs font-bold mb-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-3 py-2">
                        <span className="text-green-700 flex items-center gap-1">🔄 Ahorro suscripción</span>
                        <span className="text-green-700">−RD${Math.round(ahorro).toLocaleString()}</span>
                      </div>
                    ) : null
                  })()}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-700">RD${sub.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span className={envio===0 ? 'text-green-600 font-bold' : 'font-medium text-gray-700'}>
                      {envio===0 ? '✓ Gratis' : `RD$${envio}`}
                    </span>
                  </div>
                  {/* MEJORA-12: Fecha estimada de entrega en checkout */}
                  {items.length > 0 && (() => {
                    const hasToric    = items.some(i => (i as any).product?.tipo === 'torico')
                    const hasMulti    = items.some(i => (i as any).product?.tipo === 'multifocal')
                    const now         = new Date()
                    const addDays     = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
                    const fmtDate     = (d: Date) => d.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short' })
                    const dias        = hasToric ? 30 : hasMulti ? 10 : 2
                    const fechaMin    = fmtDate(addDays(now, dias === 30 ? 25 : dias === 10 ? 5 : 1))
                    const fechaMax    = fmtDate(addDays(now, dias))
                    const label       = dias === 30 ? '25–30 días (fabricación especial)' : dias === 10 ? '5–10 días' : '24–48 horas'
                    return (
                      <div className={`flex justify-between text-xs rounded-lg px-2 py-1.5 ${hasToric ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                        <span className="font-semibold">📅 Entrega estimada</span>
                        <span className="font-bold">{fechaMin}{dias > 2 ? ` – ${fechaMax}` : ''}</span>
                      </div>
                    )
                  })()}
                  {descuento > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Cupón</span><span>−RD${descuento.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-dashed border-gray-100">
                    <span>ITBIS incluido (18%)</span>
                    <span>RD${Math.round((sub - descuento) * 18 / 118).toLocaleString()}</span>
                  </div>

                  {/* Total destacado */}
                  <div className="bg-gray-50 rounded-xl px-3 py-3 flex justify-between items-center mt-1">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-2xl text-primary-600">RD${totalFinal.toLocaleString()}</span>
                  </div>

                  {envio > 0 && sub > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-[10px] text-amber-700 text-center font-medium">
                      Agrega <strong>RD${(8000-sub).toLocaleString()}</strong> más para envío gratis 🚀
                    </div>
                  )}

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-50">
                    <span className="text-[9px] text-gray-400 flex items-center gap-1">🔒 SSL</span>
                    <span className="text-[9px] text-gray-400">·</span>
                    <span className="text-[9px] text-gray-400 flex items-center gap-1">🏦 AZUL</span>
                    <span className="text-[9px] text-gray-400">·</span>
                    <span className="text-[9px] text-gray-400 flex items-center gap-1">✓ 3D Secure</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
