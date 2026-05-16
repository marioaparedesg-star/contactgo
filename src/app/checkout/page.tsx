'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/ui/Navbar'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase'
import DisclaimerMedico, { DisclaimerData, DISCLAIMER_VERSION } from '@/components/legal/DisclaimerMedico'
import toast from 'react-hot-toast'
import { Shield, Truck, RotateCcw, Lock, ChevronRight, Tag, Check, MapPin, User, Phone, Mail } from 'lucide-react'

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

const CUPONES: Record<string,number> = { 'BIENVENIDO10': 0.10, 'CONTACTGO15': 0.15 }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, clearCart } = useCartStore()
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
  const [authMode, setAuthMode] = useState<'login'|'register'>('register')
  const [authEmail, setAuthEmail] = useState('')
  const [authPass, setAuthPass] = useState('')
  const [authNombre, setAuthNombre] = useState('')
  const [authTel, setAuthTel] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMsg, setAuthMsg] = useState('')
  const [step, setStep] = useState<1|2|3>(1)
  const [metodoPago, setMetodoPago] = useState<'contra_entrega'|'tarjeta'>('contra_entrega')

  const sub = subtotal()
  const tot = total()
  const envio = sub >= 8000 ? 0 : 200
  const totalFinal = tot + envio - descuento

  const { register, handleSubmit, getValues, setValue, trigger, formState: { errors } } = useForm<FormData>({
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
          if (a?.[0]) { setValue('direccion', a[0].direccion); if (a[0].ciudad) setValue('ciudad', a[0].ciudad) }
        })
      }
    })
  }, [items, router])

  const aplicarCupon = () => {
    const code = cupon.trim().toUpperCase()
    if (CUPONES[code]) {
      setDescuento(Math.round(sub * CUPONES[code]))
      setCuponAplicado(true)
      toast.success('Cupón aplicado: ' + Math.round(CUPONES[code]*100) + '% off')
    } else { toast.error('Cupón inválido') }
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
  }

  const createOrder = async (data: FormData) => {
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()

    // ─── TARJETA: primero preparar AZUL, luego crear orden ───────────────
    if (metodoPago === 'tarjeta') {
      // 1. Pre-generar campos AZUL con un order_number temporal
      const tempOrderNum = `CG-${Date.now().toString().slice(-8)}`
      const preRes = await fetch('/api/azul/preparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: tempOrderNum, total: totalFinal })
      })
      if (!preRes.ok) {
        toast.error('Error al conectar con pasarela de pago. Usa contra entrega.')
        setLoading(false)
        return
      }
      const { url, fields } = await preRes.json()

      // 2. Crear la orden en Supabase
      const { data: order, error } = await sb.from('orders').insert({
        user_id: user?.id ?? null,
        cliente_nombre: data.nombre, cliente_email: data.email, cliente_telefono: data.telefono,
        direccion_texto: `${data.direccion}, ${data.ciudad}`,
        estado: 'pendiente', subtotal: sub, envio, total: totalFinal,
        metodo_pago: 'tarjeta', pago_estado: 'pendiente',
        numero_orden: tempOrderNum,
        disclaimer_acceptance_id: disclaimerId || null, disclaimer_version: DISCLAIMER_VERSION,
      }).select().single()

      if (error || !order) {
        toast.error('Error al procesar pedido: ' + (error?.message ?? 'Sin respuesta'))
        setLoading(false)
        return
      }

      // 3. Guardar items
      await fetch('/api/orders/items', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ order_id: order.id, items: items.map(i => ({
          order_id: order.id, product_id: i.product.id, nombre: i.product.nombre,
          precio: Number((i as any).precio_final ?? i.product.precio), cantidad: i.cantidad,
          sph: i.sph != null ? Number(i.sph) : null, cyl: i.cyl != null ? Number(i.cyl) : null,
          add_power: i.add_power ? parseFloat(String(i.add_power).replace('+','')) : null,
          axis: (i as any).axis != null ? Number((i as any).axis) : null,
          color: (i as any).color ?? null, ojo: (i as any).ojo ?? null,
        })) }) })

      // 4. Actualizar ApprovedUrl con el order_id real
      fields['ApprovedUrl'] = `${window.location.origin}/confirmacion?orden=${order.id}&origen=azul&resultado=aprobado`

      // 5. Limpiar carrito y enviar al portal AZUL
      clearCart()
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = url
      Object.entries(fields as Record<string,string>).forEach(([k,v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'; input.name = k; input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
      return
    }

    // ─── CONTRA ENTREGA ──────────────────────────────────────────────────
    const { data: order, error } = await sb.from('orders').insert({
      user_id: user?.id ?? null,
      cliente_nombre: data.nombre, cliente_email: data.email, cliente_telefono: data.telefono,
      direccion_texto: `${data.direccion}, ${data.ciudad}`,
      estado: 'pendiente', subtotal: sub, envio, total: totalFinal,
      metodo_pago: 'contra_entrega', pago_estado: 'pendiente',
      disclaimer_acceptance_id: disclaimerId || null, disclaimer_version: DISCLAIMER_VERSION,
    }).select().single()
    if (error || !order) {
      toast.error('Error al procesar pedido: ' + (error?.message ?? 'Sin respuesta'))
      setLoading(false)
      return
    }
    await fetch('/api/orders/items', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ order_id: order.id, items: items.map(i => ({
        order_id: order.id, product_id: i.product.id, nombre: i.product.nombre,
        precio: Number((i as any).precio_final ?? i.product.precio), cantidad: i.cantidad,
        sph: i.sph != null ? Number(i.sph) : null, cyl: i.cyl != null ? Number(i.cyl) : null,
        add_power: i.add_power ? parseFloat(String(i.add_power).replace('+','')) : null,
        axis: (i as any).axis != null ? Number((i as any).axis) : null,
        color: (i as any).color ?? null, ojo: (i as any).ojo ?? null,
      })) }) })
    fetch('/api/notify', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ order_id: order.id, evento: 'nuevo_pedido' }) }).catch(console.error)
    clearCart(); setLoading(false)
    router.push('/confirmacion?orden=' + order.id)
  }

  const handleAuth = async () => {
    setAuthLoading(true); setAuthMsg('')
    const sb = createClient()
    if (authMode === 'register') {
      const { error } = await sb.auth.signUp({ email: authEmail, password: authPass, options: { data: { nombre: authNombre } } })
      if (error) { setAuthMsg(error.message); setAuthLoading(false); return }
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
        if (a?.[0]) { setValue('direccion', a[0].direccion); if (a[0].ciudad) setValue('ciudad', a[0].ciudad) }
      }
    }
    setIsLoggedIn(true); setShowAuthModal(false); setAuthLoading(false)
    setStep(2)
  }

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger(['nombre','email','telefono'])
      if (!ok) return
      if (!isLoggedIn) { setShowAuthModal(true); return }
      setStep(2)
    } else if (step === 2) {
      const ok = await trigger(['direccion','ciudad'])
      if (!ok) return
      if (!disclaimerAceptado) { setShowDisclaimer(true); return }
      setStep(3)
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
      {showDisclaimer && (
        <DisclaimerMedico showModal items={items} onAceptar={handleDisclaimerAceptado} onCancelar={() => setShowDisclaimer(false)} />
      )}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
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
                <input placeholder="Nombre completo" value={authNombre} onChange={e => setAuthNombre(e.target.value)} className="input w-full" />
                <input placeholder="Teléfono (opcional)" value={authTel} onChange={e => setAuthTel(e.target.value)} className="input w-full" />
              </>}
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="input w-full" />
              <input type="password" placeholder="Contraseña" value={authPass} onChange={e => setAuthPass(e.target.value)} className="input w-full" />
              {authMsg && <p className="text-red-500 text-xs">{authMsg}</p>}
              <button onClick={handleAuth} disabled={authLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                {authLoading ? 'Procesando...' : authMode === 'register' ? 'Crear cuenta y continuar' : 'Entrar y continuar'}
              </button>
              <button onClick={() => setShowAuthModal(false)} className="w-full text-sm text-gray-400 hover:text-gray-600 py-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-gray-50 pb-24">
        {/* Barra de progreso */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-sm text-green-700 font-semibold">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Pago seguro</span>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <button onClick={() => step > s.n && setStep(s.n)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      step === s.n ? 'bg-primary-600 text-white shadow-md' :
                      step > s.n ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                    {step > s.n ? <Check className="w-3 h-3" /> : <span>{s.n}</span>}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 rounded-full ${step > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 font-medium hidden sm:block">contactgo.net</div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-6">
          <div className="grid lg:grid-cols-5 gap-6 items-start">

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
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                      {errors.nombre && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {errors.nombre.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input id="email" {...register('email')} type="email" placeholder="Email" autoComplete="email"
                          aria-label="Correo electrónico"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email.message}</p>}
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <label htmlFor="telefono" className="sr-only">Teléfono</label>
                        <input id="telefono" {...register('telefono')} type="tel" placeholder="WhatsApp / Teléfono" autoComplete="tel"
                          aria-label="Número de teléfono"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
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
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <label htmlFor="direccion" className="sr-only">Dirección</label>
                      <input id="direccion" {...register('direccion')} placeholder="Calle, número, sector, referencias" autoComplete="street-address"
                        aria-label="Dirección de entrega"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                      {errors.direccion && <p className="text-red-500 text-xs mt-1">⚠️ {errors.direccion.message}</p>}
                    </div>
                    <select {...register('ciudad')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white transition-colors">
                      <option value="">Selecciona tu ciudad</option>
                      {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.ciudad && <p className="text-red-500 text-xs">⚠️ {errors.ciudad.message}</p>}

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
                  <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-3">

                    {/* Resumen info cliente */}
                    <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="font-semibold">{getValues('nombre')}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500">{getValues('telefono')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="text-sm">{getValues('direccion')}, {getValues('ciudad')}</span>
                      </div>
                    </div>

                    {/* MÉTODO DE PAGO */}
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Método de pago</p>
                      <div className="grid grid-cols-1 gap-2">

                        {/* Contra entrega */}
                        <button type="button"
                          onClick={() => setMetodoPago('contra_entrega')}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full ${
                            metodoPago === 'contra_entrega'
                              ? 'border-primary-500 bg-primary-50 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            metodoPago === 'contra_entrega' ? 'border-primary-600' : 'border-gray-300'
                          }`}>
                            {metodoPago === 'contra_entrega' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">Contra entrega</p>
                            <p className="text-xs text-gray-500 mt-0.5">Pagas en efectivo cuando recibes tu pedido</p>
                          </div>
                          <span className="text-xl shrink-0">💵</span>
                        </button>

                        {/* Tarjeta AZUL */}
                        <button type="button"
                          onClick={() => setMetodoPago('tarjeta')}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full ${
                            metodoPago === 'tarjeta'
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-blue-200'
                          }`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            metodoPago === 'tarjeta' ? 'border-blue-600' : 'border-gray-300'
                          }`}>
                            {metodoPago === 'tarjeta' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">Tarjeta de crédito / débito</p>
                            <p className="text-xs text-gray-500 mt-0.5">Procesado por AZUL · Banco Popular</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <img src="/visa-blue.png" alt="Visa" className="h-4 object-contain" />
                            <img src="/mastercard.png" alt="MC" className="h-5 object-contain" />
                          </div>
                        </button>
                      </div>

                      {/* Aviso tarjeta */}
                      {metodoPago === 'tarjeta' && (
                        <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                          <span className="shrink-0">🔒</span>
                          <p className="text-xs text-blue-800 leading-relaxed">
                            Al confirmar serás redirigido al portal seguro de <strong>AZUL (Banco Popular)</strong> para ingresar los datos de tu tarjeta. ContactGo <strong>no almacena</strong> datos de tarjetas.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Logos seguridad */}
                    <div className="flex items-center gap-2 flex-wrap p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold">Pago seguro:</span>
                      <img src="/visa-blue.png" alt="Visa" className="h-3.5 object-contain" />
                      <img src="/mastercard.png" alt="Mastercard" className="h-4 object-contain" />
                      <span className="text-[9px] bg-blue-700 text-white px-1.5 py-0.5 rounded font-bold">Verified by VISA</span>
                      <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold">Mastercard ID Check</span>
                      <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold">🔒 SSL</span>
                    </div>

                    {/* TOTAL + MÉTODO */}
                    <div className={`rounded-xl p-4 flex items-center justify-between ${metodoPago === 'tarjeta' ? 'bg-blue-50 border border-blue-100' : 'bg-primary-50 border border-primary-100'}`}>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${metodoPago === 'tarjeta' ? 'text-blue-600' : 'text-primary-600'}`}>Total a pagar</p>
                        <p className={`text-2xl font-black ${metodoPago === 'tarjeta' ? 'text-blue-700' : 'text-primary-700'}`}>RD${totalFinal.toLocaleString()}</p>
                      </div>
                      <div className={`text-right text-xs font-semibold ${metodoPago === 'tarjeta' ? 'text-blue-600' : 'text-primary-600'}`}>
                        {metodoPago === 'tarjeta' ? (
                          <><p>💳 Tarjeta</p><p className="font-normal text-gray-400">Portal AZUL</p></>
                        ) : (
                          <><p>💵 Efectivo</p><p className="font-normal text-gray-400">Al recibir</p></>
                        )}
                      </div>
                    </div>

                    {/* T&C */}
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAceptaTerminos(!aceptaTerminos)}>
                      <div className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${aceptaTerminos ? 'bg-primary-600 border-primary-600' : 'border-gray-300 hover:border-primary-400'}`}>
                        {aceptaTerminos && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs text-gray-500 leading-relaxed select-none">
                        He leído y acepto los{' '}
                        <a href="/terminos" target="_blank" onClick={e => e.stopPropagation()} className="text-primary-600 underline font-semibold">Términos y Condiciones</a>
                        {' '}y la{' '}
                        <a href="/privacidad" target="_blank" onClick={e => e.stopPropagation()} className="text-primary-600 underline font-semibold">Política de Privacidad</a>
                        {' '}de ContactGo
                      </span>
                    </div>

                    {/* Botón principal — cambia según método */}
                    <button
                      onClick={handleSubmit(data => {
                        if (!aceptaTerminos) { toast.error('Acepta los Términos y Condiciones para continuar'); return }
                        createOrder(data)
                      })}
                      disabled={loading || !aceptaTerminos}
                      className={`w-full active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base shadow-lg ${
                        metodoPago === 'tarjeta'
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                          : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                      }`}>
                      {loading ? (
                        <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {metodoPago === 'tarjeta' ? 'Conectando con AZUL...' : 'Procesando pedido...'}</>
                      ) : metodoPago === 'tarjeta' ? (
                        <><span>Pagar con tarjeta · RD${totalFinal.toLocaleString()}</span><ChevronRight className="w-5 h-5" /></>
                      ) : (
                        <><span>Confirmar pedido · RD${totalFinal.toLocaleString()}</span><ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-5 pt-1">
                      {[{ icon: Lock, t:'Pago seguro' },{ icon: Shield, t:'100% original' },{ icon: Truck, t:'24-48h' },{ icon: RotateCcw, t:'7 días' }].map(b => (
                        <div key={b.t} className="flex items-center gap-1 text-[10px] text-gray-400">
                          <b.icon className="w-3 h-3" />{b.t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — resumen sticky */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border-2 border-gray-100 sticky top-20 overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50">
                  <p className="font-black text-gray-900 text-sm">Resumen del pedido</p>
                  <p className="text-xs text-gray-500 mt-0.5">{items.length} {items.length===1?'producto':'productos'}</p>
                </div>

                {/* Items */}
                <div className="p-4 space-y-3 max-h-56 overflow-y-auto border-b border-gray-50">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      {item.product.imagen_url && (
                        <img src={item.product.imagen_url} alt="" className="w-11 h-11 object-contain rounded-lg bg-gray-50 shrink-0 border border-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">{item.product.nombre}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(item as any).ojo && (item as any).ojo !== 'AMBOS' && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${(item as any).ojo === 'OD' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                              {(item as any).ojo === 'OD' ? '👁 OD' : '👁 OI'}
                            </span>
                          )}
                          {item.sph != null && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">SPH {Number(item.sph)>0?`+${Number(item.sph).toFixed(2)}`:Number(item.sph).toFixed(2)}</span>}
                          {(item as any).cyl != null && (item as any).cyl !== 0 && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">CYL {Number((item as any).cyl).toFixed(2)}</span>}
                          {(item as any).axis && <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">{(item as any).axis}°</span>}
                          {(item as any).add_power && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">ADD {(item as any).add_power}</span>}
                          {(item as any).color && <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">{(item as any).color}</span>}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-gray-400">×{item.cantidad}</span>
                          <span className="text-xs font-bold">RD${(Number((item as any).precio_final ?? item.product.precio)*item.cantidad).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupón */}
                <div className="p-4 border-b border-gray-50">
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
                  {cuponAplicado && (
                    <p className="text-green-600 text-xs mt-1.5 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cupón aplicado correctamente
                    </p>
                  )}
                </div>

                {/* Totales */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span><span>RD${sub.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span className={envio===0 ? 'text-green-600 font-semibold' : ''}>
                      {envio===0 ? '🎁 Gratis' : `RD$${envio}`}
                    </span>
                  </div>
                  {descuento > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Descuento</span><span>-RD${descuento.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-100 pt-3 flex justify-between">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-xl text-primary-600">RD${totalFinal.toLocaleString()}</span>
                  </div>
                  {envio > 0 && (
                    <div className="bg-amber-50 rounded-lg px-3 py-2 text-[10px] text-amber-700 text-center">
                      Agrega <strong>RD${(8000-sub).toLocaleString()}</strong> más para envío gratis 🚀
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
