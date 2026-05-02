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

const PAYPAL_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, clearCart, updateItem, removeByIndex } = useCartStore()
  const [payMethod, setPayMethod] = useState<'paypal'|'transferencia'|'contra_entrega'>('paypal')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const sub = subtotal(); const tot = total()

  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

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
        sb.from('addresses').select('*').eq('user_id', user.id).eq('principal', true).single().then(({ data: addr }) => {
          if (addr) {
            setValue('direccion', addr.direccion)
            if (addr.ciudad) setValue('ciudad', addr.ciudad)
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
      total: tot,
      metodo_pago: payMethod,
      pago_estado: payMethod === 'paypal' ? 'verificado' : 'pendiente',
      pago_referencia: payRef ?? null,
    }).select().single()

    if (error || !order) { toast.error('Error al procesar pedido'); setLoading(false); return }

    // Insertar items
    await sb.from('order_items').insert(
      items.map(i => ({
        order_id: order.id,
        product_id: i.product.id,
        nombre: i.product.nombre,
        precio: i.product.precio,
        cantidad: i.cantidad,
        sph: i.sph ?? null,
        cyl: i.cyl ?? null,
        add_power: i.add_power ? parseFloat(i.add_power) : null,
      }))
    )

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

    clearCart()
    setLoading(false)
    router.push(order.id)
    window.open('https://wa.me/18294089097?text=' + wamsg, '_blank')
    toast.success('¡Pedido confirmado! 🎉')
  }

  const copyBank = () => {
    navigator.clipboard.writeText('BHD · Mario Paredes · Cta: 12690480037 · DO84BCBH00000000012690480037')
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Datos bancarios copiados')
  }

  if (items.length === 0) return null

  return (
    <>
      <Navbar />
      <main className="pb-20 max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>

        <form onSubmit={handleSubmit(data => payMethod !== 'paypal' && createOrder(data))}
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
                  <input {...register('telefono')} type="tel" className="input" placeholder="809-000-0000" />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Dirección</label>
                  <input {...register('direccion')} className="input" placeholder="Calle, número, sector" />
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
                  { id: 'paypal',         icon: CreditCard, label: 'PayPal' },
                  { id: 'transferencia',  icon: Building2,  label: 'Transferencia' },
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
                        const capture = await actions.order!.capture()
                        await createOrder(getValues(), capture.id)
                      }}
                      onError={() => toast.error('Error con PayPal. Intenta de nuevo.')}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Transferencia BHD */}
              {payMethod === 'transferencia' && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Datos bancarios BHD</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between"><span className="text-gray-400">Banco</span><span className="font-medium">BHD</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Titular</span><span className="font-medium">Mario Paredes</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Cuenta RD$</span><span className="font-medium font-mono">12690480037</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">IBAN</span><span className="font-medium font-mono text-xs">DO84BCBH00000000012690480037</span></div>
                  </div>
                  <button type="button" onClick={copyBank}
                    className="w-full flex items-center justify-center gap-2 text-sm btn-secondary">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar datos bancarios'}
                  </button>
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5">
                    ⚠️ Envía el comprobante por WhatsApp al 829-408-9097 para confirmar tu pedido.
                  </p>
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
                    {loading ? 'Procesando...' : <>Confirmar pedido <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )}

              {/* Contra entrega */}
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
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>RD${sub.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span><span>RD$200</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
                  <span>Total</span><span>RD${tot.toLocaleString()}</span>
                </div>
              </div>
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
