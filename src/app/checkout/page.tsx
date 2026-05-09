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
  const [payMethod, setPayMethod] = useState<'paypal'|'azul'|'contra_entrega'>('azul')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [azulLoading, setAzulLoading] = useState(false)
  const [cupon, setCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(false)
  const [descuento, setDescuento] = useState(0)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

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
    router.push(order.id)
    toast.success('¡Pedido confirmado! 🎉')
  }

  const pagarConAzul = async (data: FormData) => {
    if (!aceptaTerminos) { toast.error('Debes aceptar los Términos y Condiciones'); return }
    setAzulLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()

    // Usar datos de prueba del sandbox AZUL según documento técnico
    const MERCHANT_ID   = process.env.NEXT_PUBLIC_AZUL_MERCHANT_ID ?? '39038540035'
    const MERCHANT_NAME = process.env.NEXT_PUBLIC_AZUL_MERCHANT_NAME ?? 'ContactGo'
    const MERCHANT_TYPE = 'ECommerce'
    const CURRENCY_CODE = '$'
    const BASE_URL      = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.contactgo.net'

    // Número de orden único
    const orderNumber = Date.now().toString()

    // Amount sin decimales — últimos 2 dígitos son centavos
    const totalFinal  = tot - descuento
    const amountStr   = (totalFinal * 100).toFixed(0)
    // ITBIS = 18% del total, formato sin decimales (últimos 2 = centavos)
    const itbisReal   = Math.round(totalFinal * 0.18 / 1.18 * 100)
    const itbisStr    = itbisReal.toFixed(0).padStart(3, '0')

    const approvedUrl = BASE_URL + '/azul-retorno'
    const declinedUrl = BASE_URL + '/azul-retorno'
    const cancelUrl   = BASE_URL + '/azul-retorno'

    // Calcular hash en servidor (AuthKey nunca sale al frontend)
    // El hash se calcula ANTES de definir los fields
    // Solo los campos del hash según doc técnico (no incluye CardHolder ni LogoImageUrl)
    const { hash } = await fetch('/api/azul-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        MerchantId: MERCHANT_ID, MerchantName: MERCHANT_NAME,
        MerchantType: MERCHANT_TYPE, CurrencyCode: CURRENCY_CODE,
        OrderNumber: orderNumber, Amount: amountStr, ITBIS: itbisStr,
        ApprovedUrl: approvedUrl, DeclinedUrl: declinedUrl, CancelUrl: cancelUrl,
        UseCustomField1: '0', CustomField1Label: '', CustomField1Value: '',
        UseCustomField2: '0', CustomField2Label: '', CustomField2Value: '',
      })
    }).then(r => r.json())

    // Guardar orden en Supabase ANTES de redirigir
    const { data: order } = await sb.from('orders').insert({
      user_id:            user?.id ?? null,
      cliente_nombre:     data.nombre,
      cliente_email:      data.email,
      cliente_telefono:   data.telefono,
      direccion_texto:    `${data.direccion}, ${data.ciudad}`,
      estado:             'pendiente',
      subtotal:           sub,
      envio:              200,
      total:              totalFinal,
      metodo_pago:        'azul',
      pago_estado:        'pendiente',
      azul_order_number:  orderNumber,
    }).select().single()

    if (!order) { toast.error('Error creando orden'); setAzulLoading(false); return }

    // Insertar items
    const itemsPayload = items.map(i => ({
      order_id: order.id, product_id: i.product.id,
      nombre: i.product.nombre,
      precio: Number((i as any).precio_final ?? i.product.precio),
      cantidad: i.cantidad,
      sph: i.sph != null ? Number(i.sph) : null,
      cyl: i.cyl != null ? Number(i.cyl) : null,
      add_power: i.add_power ? parseFloat(String(i.add_power).replace('+','')) : null,
      axis: (i as any).axis != null ? Number((i as any).axis) : null,
      color: (i as any).color ?? null, ojo: (i as any).ojo ?? null,
      size: (i as any).size ?? null,
      // subtotal GENERATED — no enviar
    }))
    // Insertar via API route (service_role)
    await fetch('/api/orders/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id, items: itemsPayload })
    })

    clearCart()

    // Construir y enviar formulario POST hacia AZUL sandbox
    const azulUrl = 'https://pruebas.azul.com.do/PaymentPage/'
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = azulUrl

    const fields: Record<string, string> = {
      MerchantId:         MERCHANT_ID,
      MerchantName:       MERCHANT_NAME,
      MerchantType:       MERCHANT_TYPE,
      CurrencyCode:       CURRENCY_CODE,
      OrderNumber:        orderNumber,
      Amount:             amountStr,
      ITBIS:              itbisStr,
      ApprovedUrl:        approvedUrl,
      DeclinedUrl:        declinedUrl,
      CancelUrl:          cancelUrl,
      UseCustomField1:    '0',
      CustomField1Label:  '',
      CustomField1Value:  '',
      UseCustomField2:    '0',
      CustomField2Label:  '',
      CustomField2Value:  '',
      AuthHash:           hash,
      ShowTransactionResult: '1',
      // Logo del comercio en la página de AZUL
      LogoImageUrl:       BASE_URL + '/logo.png',
      // Campos CardHolder para 3D Secure (doc técnico p.38)
      CardHolderName:     data.nombre.substring(0, 96),
      CardHolderEmail:    data.email.substring(0, 254),
      CardHolderPhoneMobile: data.telefono.replace(/\D/g,'').substring(0, 32),
      CardHolderBillingAddressLine1: data.direccion.substring(0, 96),
      CardHolderBillingAddressCity:  data.ciudad.substring(0, 96),
      CardHolderBillingAddressState: 'Santo Domingo',
      CardHolderBillingAddressCountry: 'DO',
      CardHolderBillingAddressZip:   '10000',
    }

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input')
      input.type = 'hidden'; input.name = k; input.value = v
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  const copyBank = () => {
    navigator.clipboard.writeText('')
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Datos bancarios copiados')
  }

  if (items.length === 0) return null

  return (
    <>
      <Navbar />
      <main className="pb-20 max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>

        <form onSubmit={handleSubmit(data => { if (!aceptaTerminos) { toast.error("Debes aceptar los Términos y Condiciones"); return }; if (payMethod !== 'paypal') createOrder(data) })}
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
              <div className="grid grid-cols-3 gap-2 mb-5">
                {([
                  { id: 'azul',           icon: CreditCard, label: 'Tarjeta (AZUL)' },
                  { id: 'paypal',         icon: CreditCard, label: 'PayPal' },
                  { id: 'contra_entrega', icon: Package,    label: 'Contra entrega' },
                ] as const).map(m => (
                  <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-semibold
                      ${payMethod === m.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <m.icon className="w-5 h-5" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* AZUL - Tarjeta de crédito/débito */}
              {payMethod === 'azul' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-bold mb-1">💳 Pago con tarjeta de crédito o débito</p>
                    <p>Serás redirigido a la página segura de AZUL · Banco Popular para completar tu pago.</p>
                    <div className="flex items-center gap-3 mt-3">
                      <img src="/visa_blue.svg" alt="Visa" className="h-6" />
                      <img src="/mc_symbol.png" alt="Mastercard" className="h-7" />
                      <span className="text-xs text-blue-600 font-semibold">🔒 Ambiente de pruebas</span>
                    </div>
                  </div>
                  <button type="button"
                    onClick={handleSubmit(pagarConAzul)}
                    disabled={azulLoading || !aceptaTerminos}
                    className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    {azulLoading ? 'Redirigiendo a AZUL...' : <>💳 Pagar con tarjeta RD${(tot - descuento).toLocaleString()}</>}
                  </button>
                  {!aceptaTerminos && <p className="text-xs text-red-500 text-center">Debes aceptar los T&C para continuar</p>}
                </div>
              )}

              {/* PayPal */}
              {payMethod === 'paypal' && (
                <div>
                  <p className="text-sm text-gray-500 mb-3 text-center">
                    Paga con tu cuenta PayPal o tarjeta de crédito/débito
                  </p>
                  <PayPalScriptProvider options={{ clientId: PAYPAL_ID, currency: 'USD' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'blue', shape: 'rect' }}
                      createOrder={(_, actions) => actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                          amount: { currency_code: 'USD', value: (tot / 58).toFixed(2) },
                          description: 'ContactGo — Lentes de contacto'
                        }]
                      })}
                      onApprove={async (_, actions) => {
                        if (!aceptaTerminos) { toast.error("Debes aceptar los Términos y Condiciones"); return }
                        const capture = await actions.order!.capture()
                        await createOrder(getValues(), capture.id)
                      }}
                      onError={() => toast.error('Error con PayPal. Intenta de nuevo.')}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {payMethod === 'contra_entrega' && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800">
                    <p className="font-semibold mb-1">💵 Pagas en efectivo al recibir tu pedido</p>
                    <p>Ten el monto exacto listo: <strong>RD${tot.toLocaleString()}</strong></p>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
                    {loading ? 'Procesando...' : <>Confirmar pedido <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Resumen */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium leading-snug">{item.product.nombre}</p>
                      {item.sph !== undefined && item.sph !== null && <p className="text-xs text-gray-400">Grad: {item.sph > 0 ? '+' : ''}{item.sph}</p>}
                      <p className="text-primary-600 font-bold mt-0.5">RD${(item.product.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => updateItem(i, Math.max(1, item.cantidad - 1))}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors">-</button>
                      <span className="w-6 text-center font-semibold">{item.cantidad}</span>
                      <button type="button" onClick={() => updateItem(i, Math.min(item.product.stock, item.cantidad + 1))}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors">+</button>
                      <button type="button" onClick={() => removeByIndex(i)}
                        className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg text-red-400 transition-colors ml-1 font-bold">x</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Cupón */}
              <div className="border border-dashed border-primary-200 rounded-xl p-3 mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">¿Tienes un cupón?</p>
                <div className="flex gap-2">
                  <input
                    value={cupon}
                    onChange={e => setCupon(e.target.value.toUpperCase())}
                    placeholder="BIENVENIDO10"
                    disabled={cuponAplicado}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    onClick={aplicarCupon}
                    disabled={cuponAplicado || !cupon}
                    className="px-3 py-2 bg-primary-600 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {cuponAplicado ? '✓' : 'Aplicar'}
                  </button>
                </div>
                {cuponAplicado && (
                  <p className="text-xs text-primary-600 font-semibold mt-1.5">
                    ✓ Descuento aplicado: -RD${descuento.toLocaleString()}
                  </p>
                )}
              </div>
              {/* Sellos de seguridad */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {SEGURIDAD.map(s => (
                  <div key={s.text} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-xs font-medium text-gray-600">{s.text}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal (sin ITBIS)</span>
                  <span>RD${Math.round(sub / 1.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ITBIS (18%)</span>
                  <span>RD${Math.round(sub - sub / 1.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span><span>RD$200</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span><span>-RD${descuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-100 pt-2 mt-1">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">RD${(tot - descuento).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">ITBIS incluido en el precio de venta</p>
              </div>
              {/* Logos tarjetas AZUL - SVG inline */}
              <div className="flex items-center justify-center gap-4 mt-3 mb-2">
                <img src="/visa_blue.svg" alt="Visa" className="h-6" />
                <img src="/mc_symbol.png" alt="Mastercard" className="h-7" />
              </div>
              {/* Checkbox T&C - Requisito AZUL */}
              <label className="flex items-start gap-2 cursor-pointer mt-2 mb-1">
                <input type="checkbox" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-green-600" />
                <span className="text-xs text-gray-500 leading-snug">
                  He leído y acepto los{' '}
                  <a href="/terminos" target="_blank" className="text-primary-600 underline font-semibold">Términos y Condiciones</a>
                  {' '}y la{' '}
                  <a href="/privacidad" target="_blank" className="text-primary-600 underline font-semibold">Política de Privacidad</a>
                  {' '}de ContactGo *
                </span>
              </label>
              <p className="text-xs text-gray-400 text-center mt-4">
                🔒 Pago seguro · Entrega en 24–48h
              </p>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}
