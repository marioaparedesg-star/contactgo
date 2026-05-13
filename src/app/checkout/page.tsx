'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase'
import DisclaimerMedico, { DisclaimerData, DISCLAIMER_VERSION } from '@/components/legal/DisclaimerMedico'
import toast from 'react-hot-toast'
import { CreditCard, Building2, Package, ChevronRight, Copy, CheckCircle } from 'lucide-react'

const schema = z.object({
  nombre:    z.string().min(3, 'Nombre requerido'),
  email:     z.string().email('Email inválido'),
  telefono:  z.string().min(10, 'Teléfono requerido'),
  direccion: z.string().min(5, 'Dirección requerida'),
  ciudad:    z.string().min(2, 'Ciudad requerida'),
})
type FormData = z.infer<typeof schema>

const CIUDADES = ['Santo Domingo','Santiago','La Romana','San Pedro de Macorís','Puerto Plata',
  'Punta Cana','San Cristóbal','La Vega','Bonao','Baní','Otra ciudad']

const SEGURIDAD = [
  { icon: '🔒', text: 'Pago 100% seguro' },
  { icon: '✅', text: 'Productos originales' },
  { icon: '🚚', text: 'Envío en 24-48h' },
  { icon: '↩️', text: 'Devolución en 7 días' },
]

const PAYPAL_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, clearCart, updateItem, removeByIndex } = useCartStore()
  const [payMethod, setPayMethod] = useState<'paypal'|'contra_entrega'>('contra_entrega')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cupon, setCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(false)
  const [descuento, setDescuento] = useState(0)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [disclaimerAceptado, setDisclaimerAceptado] = useState(false)
  const [disclaimerId, setDisclaimerId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
  const [authEmail, setAuthEmail] = useState('')
  const [authPass, setAuthPass] = useState('')
  const [authNombre, setAuthNombre] = useState('')
  const [authTel, setAuthTel] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMsg, setAuthMsg] = useState('')

  const CUPONES: Record<string, number> = {
    'BIENVENIDO10': 0.10,
    'CONTACTGO15': 0.15,
  }

  const aplicarCupon = () => {
    const code = cupon.trim().toUpperCase()
    if (CUPONES[code]) {
      const pct = CUPONES[code]
      setDescuento(Math.round(sub * pct))
      setCuponAplicado(true)
      toast.success('Cupón aplicado: ' + Math.round(pct * 100) + '% de descuento')
    } else {
      toast.error('Cupón inválido')
      setCuponAplicado(false)
      setDescuento(0)
    }
  }
  const [direcciones, setDirecciones] = useState([])

  const sub = subtotal(); const tot = total()

  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  // Guardar carrito abandonado cuando hay telefono
  const guardarCarritoAbandonado = (telefono: string, nombre: string, email: string) => {
    if (!telefono || telefono.length < 10) return
    const sb = createClient()
    const itemsData = items.map(i => ({
      nombre: i.product.nombre,
      cantidad: i.cantidad,
      precio: (i as any).precio_final ?? i.product.precio,
      sph: i.sph,
      color: (i as any).color,
      ojo: (i as any).ojo,
    }))
    try {
      sb.from('abandoned_carts').insert({
        cliente_nombre: nombre,
        cliente_telefono: telefono,
        cliente_email: email,
        items: JSON.stringify(itemsData),
        total: subtotal(),
      })
    } catch (_e) {}
  }

  useEffect(() => {
    if (items.length === 0) router.push('/cart')
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      if (user) {
        sb.from('profiles').select('*').eq('id', user.id).single().then(({ data: perfil }) => {
          if (perfil) {
            if (perfil.nombre) setValue('nombre', perfil.nombre)
            if (perfil.email) setValue('email', perfil.email)
            if (perfil.telefono) setValue('telefono', perfil.telefono)
          }
        })
        sb.from('addresses').select('*').eq('user_id', user.id).order('principal', { ascending: false }).then(({ data: addrs }) => {
          if (addrs && addrs.length > 0) {
            setDirecciones(addrs)
            setValue('direccion', addrs[0].direccion)
            if (addrs[0].ciudad) setValue('ciudad', addrs[0].ciudad)
          }
        })
      }
    })
  }, [items, router])

  const saveDisclaimer = async (dData: DisclaimerData, userId?: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/disclaimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || null,
          version: dData.version,
          tipo: 'compra',
          user_agent: dData.user_agent,
          items_snapshot: dData.items_snapshot,
          accepted_at: dData.accepted_at,
        }),
      })
      const result = await res.json()
      return result.disclaimer_id ?? null
    } catch { return null }
  }

  const handleDisclaimerAceptado = async (dData: DisclaimerData) => {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const id = await saveDisclaimer(dData, user?.id)
    if (id) setDisclaimerId(id)
    setDisclaimerAceptado(true)
    setShowDisclaimer(false)
  }

  const createOrder = async (data: FormData, payRef?: string) => {
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()

    const { data: order, error } = await sb.from('orders').insert({
      user_id: user?.id ?? null,
      cliente_nombre: data.nombre,
      cliente_email: data.email,
      cliente_telefono: data.telefono,
      direccion_texto: `${data.direccion}, ${data.ciudad}`,
      estado: 'pendiente',
      subtotal: sub,
      envio: 200,
      total: tot - descuento,
      metodo_pago: payMethod,
      pago_estado: payMethod === 'paypal' ? 'verificado' : 'pendiente',
      pago_referencia: payRef ?? null,
      disclaimer_acceptance_id: disclaimerId || null,
      disclaimer_version: DISCLAIMER_VERSION,
    }).select().single()

    if (error || !order) { toast.error('Error al procesar pedido'); setLoading(false); return }

    // Insertar items directo en Supabase (RLS abierta)
    const itemsPayload = items.map(i => ({
      order_id:   order.id,
      product_id: i.product.id,
      nombre:     i.product.nombre,
      precio:     Number((i as any).precio_final ?? i.product.precio),
      cantidad:   i.cantidad,
      sph:        i.sph != null ? Number(i.sph) : null,
      cyl:        i.cyl != null ? Number(i.cyl) : null,
      add_power:  i.add_power ? parseFloat(String(i.add_power).replace('+','')) : null,
      axis:       (i as any).axis != null ? Number((i as any).axis) : null,
      color:      (i as any).color ?? null,
      ojo:        (i as any).ojo ?? null,
      size:       (i as any).size ?? null,
      // subtotal es GENERATED (precio*cantidad) — Postgres lo calcula solo
    }))

    // Insertar via API route (service_role) para garantizar que no falle por RLS
    const itemsRes = await fetch('/api/orders/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order.id,
        items: itemsPayload.map(i => ({ ...i, product_id: i.product_id }))
      })
    })
    if (!itemsRes.ok) {
      const err = await itemsRes.json()
      console.error('Error insertando order_items:', err)
      toast.error('Error guardando productos del pedido: ' + (err.error ?? 'desconocido'))
    } else {
      console.log('order_items insertados:', itemsPayload.length)
    }

    // Crear suscripciones si aplica
    const itemsConSub = items.filter(i => (i as any).suscripcion)
    if (itemsConSub.length > 0) {
      for (const item of itemsConSub) {
        const frec = (item as any).suscripcion as string
        const dias = frec === '15_dias' ? 15 : frec === 'mensual' ? 30 : 90
        const proximo = new Date()
        proximo.setDate(proximo.getDate() + dias)
        await sb.from('subscriptions').insert({
          user_id: user?.id ?? null,
          cliente_nombre: getValues('nombre'),
          cliente_email:  getValues('email'),
          cliente_telefono: getValues('telefono'),
          direccion_texto: `${getValues('direccion')}, ${getValues('ciudad')}`,
          items: JSON.stringify([{
            product_id: item.product.id,
            nombre: item.product.nombre,
            cantidad: item.cantidad,
            sph: item.sph,
            cyl: item.cyl,
            axis: (item as any).axis,
            add_power: item.add_power,
            color: (item as any).color,
            ojo: (item as any).ojo,
            size: (item as any).size,
            precio: (item as any).precio_final ?? item.product.precio,
          }]),
          frecuencia: frec,
          descuento_pct: frec === '15_dias' ? 5 : frec === 'mensual' ? 10 : 15,
          proximo_envio: proximo.toISOString().split('T')[0],
          activa: true,
        })
      }
    }

    // Recordatorio: 25 días si son lentes mensuales
    if (user?.id) {
      const hasMonthly = items.some(i => ['esferico','torico','multifocal','color'].includes(i.product.tipo ?? ''))
      if (hasMonthly) {
        const fecha = new Date(); fecha.setDate(fecha.getDate() + 25)
        await sb.from('reminders').insert({
          user_id: user.id, order_id: order.id,
          tipo: 'recompra',
          fecha_recordatorio: fecha.toISOString().split('T')[0]
        })
      }
    }

    // Notificar por email
    fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: order.id, evento: 'nuevo_pedido' }) }).catch(console.error)

    clearCart()
    setLoading(false)
    router.push('/confirmacion?orden=' + order.id)
    toast.success('¡Pedido confirmado! 🎉')
  }

  const handleAuth = async () => {
    setAuthLoading(true); setAuthMsg('')
    const sb = createClient()
    if (authMode === 'register') {
      const { error } = await sb.auth.signUp({ email: authEmail, password: authPass, options: { data: { nombre: authNombre } } })
      if (error) { setAuthMsg(error.message); setAuthLoading(false); return }
      // Create profile
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        await sb.from('profiles').upsert({ id: user.id, nombre: authNombre, email: authEmail, telefono: authTel, role: 'customer' })
        setValue('nombre', authNombre); setValue('email', authEmail); if (authTel) setValue('telefono', authTel)
      }
      setIsLoggedIn(true); setShowAuthModal(false)
    } else {
      const { error } = await sb.auth.signInWithPassword({ email: authEmail, password: authPass })
      if (error) { setAuthMsg('Email o contraseña incorrectos'); setAuthLoading(false); return }
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        const { data: perfil } = await sb.from('profiles').select('*').eq('id', user.id).single()
        if (perfil?.nombre) setValue('nombre', perfil.nombre)
        if (perfil?.email) setValue('email', perfil.email)
        if (perfil?.telefono) setValue('telefono', perfil.telefono)
        const { data: addrs } = await sb.from('addresses').select('*').eq('user_id', user.id).order('principal', { ascending: false })
        if (addrs && addrs.length > 0) { setValue('direccion', addrs[0].direccion); if (addrs[0].ciudad) setValue('ciudad', addrs[0].ciudad) }
      }
      setIsLoggedIn(true); setShowAuthModal(false)
    }
    setAuthLoading(false)
  }

  return (
    <>
      <Navbar />
      {/* ── Modal Disclaimer Médico ── */}
      {showDisclaimer && (
        <DisclaimerMedico
          showModal={true}
          items={items}
          onAceptar={handleDisclaimerAceptado}
          onCancelar={() => setShowDisclaimer(false)}
        />
      )}

      {/* ── Modal Registro/Login obligatorio ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-lg">
                {authMode === 'register' ? '👋 Crea tu cuenta' : '¡Bienvenido de vuelta!'}
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {authMode === 'register' ? 'Para finalizar tu pedido necesitas registrarte' : 'Ingresa para continuar con tu pedido'}
              </p>
            </div>
            <div className="p-5 space-y-3">
              {authMode === 'register' && (
                <>
                  <input value={authNombre} onChange={e => setAuthNombre(e.target.value)}
                    placeholder="Nombre completo" className="input w-full" />
                  <input value={authTel} onChange={e => setAuthTel(e.target.value)}
                    placeholder="Teléfono / WhatsApp" type="tel" className="input w-full" />
                </>
              )}
              <input value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                placeholder="Correo electrónico" type="email" className="input w-full" />
              <input value={authPass} onChange={e => setAuthPass(e.target.value)}
                placeholder="Contraseña (mínimo 6 caracteres)" type="password" className="input w-full" />
              {authMsg && <p className="text-red-500 text-sm">{authMsg}</p>}
              <button onClick={handleAuth} disabled={authLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
                {authLoading ? 'Procesando...' : authMode === 'register' ? 'Crear cuenta y continuar' : 'Entrar y continuar'}
              </button>
              <button onClick={() => setAuthMode(m => m === 'register' ? 'login' : 'register')}
                className="w-full text-primary-600 text-sm font-medium py-1 hover:underline">
                {authMode === 'register' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="pb-20 max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>

        <form onSubmit={handleSubmit(data => { if (!isLoggedIn) { setShowAuthModal(true); return }; if (!disclaimerAceptado) { setShowDisclaimer(true); return }; if (!aceptaTerminos) { toast.error("Debes aceptar los Términos y Condiciones"); return }; createOrder(data) })}
          className="grid lg:grid-cols-5 gap-8">

          {/* LEFT - Formulario */}
          <div className="lg:col-span-3 space-y-5">
            {/* Datos del cliente */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Datos de entrega</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nombre completo</label>
                  <input {...register('nombre')} className="input" placeholder="Juan Pérez" />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                  <input {...register('email')} type="email" className="input" placeholder="tu@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Teléfono / WhatsApp</label>
                  <input {...register('telefono')}
                  onBlur={(e) => {
                    const tel = e.target.value
                    const nom = getValues('nombre')
                    const em  = getValues('email')
                    if (tel.length >= 10) guardarCarritoAbandonado(tel, nom, em)
                  }} type="tel" className="input" placeholder="809-000-0000" />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Dirección</label>
                  {direcciones.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {direcciones.map((d, i) => (
                        <button key={d.id} type="button"
                          onClick={() => { setValue('direccion', d.direccion); if (d.ciudad) setValue('ciudad', d.ciudad) }}
                          className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-primary-400 hover:bg-primary-50 text-gray-600 transition-colors text-left">
                          {d.direccion}
                        </button>
                      ))}
                    </div>
                  )}
                  <input {...register('direccion')} className="input" placeholder="Calle, numero, sector" />
                  {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Ciudad</label>
                  <select {...register('ciudad')} className="input">
                    <option value="">Seleccionar...</option>
                    {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad.message}</p>}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Método de pago</h2>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {([
                  { id: 'contra_entrega', emoji: '💵', label: 'Contra entrega', desc: 'Pagas en efectivo al recibir' },
                  { id: 'paypal',         emoji: '🔵', label: 'PayPal',          desc: 'Tarjeta o cuenta PayPal' },
                ] as const).map(m => (
                  <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                    className={`flex flex-col items-start gap-1 p-4 rounded-2xl border-2 transition-all text-left
                      ${payMethod === m.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className="text-xl">{m.emoji}</span>
                    <p className={`text-sm font-bold ${payMethod === m.id ? 'text-primary-700' : 'text-gray-800'}`}>{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </button>
                ))}
              </div>

              {payMethod === 'contra_entrega' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-sm font-bold text-green-800 mb-1">💵 Pago en efectivo al recibir</p>
                    <p className="text-xs text-green-700 mb-3">Ten el monto exacto listo. El mensajero no tiene cambio.</p>
                    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5">
                      <span className="text-sm text-gray-600">Total a pagar</span>
                      <span className="font-black text-gray-900 text-lg">RD${(tot - descuento).toLocaleString()}</span>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-base">
                    {loading ? 'Procesando...' : <><span>Confirmar pedido</span><ChevronRight className="w-5 h-5" /></>}
                  </button>
                </div>
              )}

              {payMethod === 'paypal' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                    <p className="text-sm font-bold text-blue-800 mb-1">🔵 PayPal</p>
                    <p className="text-xs text-blue-700">Paga con tu cuenta PayPal o con tarjeta internacional.</p>
                    <p className="text-xs text-blue-600 mt-2 font-semibold">
                      USD${((tot - descuento) / 58).toFixed(2)} ≈ RD${(tot - descuento).toLocaleString()}
                    </p>
                  </div>
                  {aceptaTerminos && disclaimerAceptado ? (
                    <PayPalScriptProvider options={{ clientId: PAYPAL_ID, currency: 'USD' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', color: 'blue', shape: 'pill', height: 48 }}
                        createOrder={(_, actions) => actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: { currency_code: 'USD', value: ((tot - descuento) / 58).toFixed(2) },
                            description: 'ContactGo — Lentes de contacto RD'
                          }]
                        })}
                        onApprove={async (_, actions) => {
                          const capture = await actions.order!.capture()
                          await createOrder(getValues(), capture.id)
                        }}
                        onError={() => toast.error('Error con PayPal. Intenta de nuevo o usa contra entrega.')}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <p className="text-xs text-red-500 text-center py-2">Acepta los términos y el aviso médico para continuar</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT — Resumen del pedido */}
          <div className="lg:col-span-2 space-y-4">

            {/* Productos */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Tu pedido</h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    {item.product.imagen_url && (
                      <img src={item.product.imagen_url} alt={item.product.nombre}
                        className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{item.product.nombre}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(item as any).ojo && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{(item as any).ojo}</span>}
                        {item.sph != null && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono">SPH {Number(item.sph) > 0 ? '+' : ''}{item.sph}</span>}
                        {(item as any).cyl != null && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono">CYL {(item as any).cyl}</span>}
                        {(item as any).color && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">{(item as any).color}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">×{item.cantidad}</span>
                        <span className="text-sm font-bold text-gray-900">
                          RD${(Number((item as any).precio_final ?? item.product.precio) * item.cantidad).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cupón */}
            <div className="card p-4">
              <div className="flex gap-2">
                <input placeholder="Código de cupón" id="coupon-input"
                  value={cupon} onChange={e => setCupon(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <button type="button" onClick={aplicarCupon}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Aplicar
                </button>
              </div>
            </div>

            {/* Totales */}
            <div className="card p-5 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>RD${sub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className={sub >= 8000 ? 'text-green-600 font-semibold' : ''}>
                  {sub >= 8000 ? '🎁 Gratis' : 'RD$200'}
                </span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Descuento cupón</span><span>-RD${descuento.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900">
                <span>Total</span>
                <span className="text-xl text-primary-600">RD${(tot - descuento).toLocaleString()}</span>
              </div>
            </div>

            {/* T&C */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary-600 shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                Acepto los{' '}
                <a href="/terminos" target="_blank" className="text-primary-600 underline font-medium">Términos y Condiciones</a>
                {' '}y la{' '}
                <a href="/privacidad" target="_blank" className="text-primary-600 underline font-medium">Política de Privacidad</a>
              </span>
            </label>

          </div>

        </form>
      </main>
    </>
  )
}
