'use client'
// ============================================================
// ContactGo — /venta/[token]
// El cliente abre el link que le enviaron por WhatsApp,
// ve su pedido y completa sus datos → orden pendiente de pago.
// ============================================================
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { ShoppingBag, CheckCircle, Clock, User, CreditCard, Phone, Mail, MapPin, Calendar } from 'lucide-react'

const CIUDADES = [
  'Santo Domingo', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste',
  'Distrito Nacional', 'Santiago', 'La Vega', 'San Cristóbal', 'Puerto Plata',
  'San Pedro de Macorís', 'La Romana', 'Higüey', 'Moca', 'San Francisco de Macorís',
  'Baní', 'Bonao', 'Azua', 'Barahona', 'Otra ciudad',
]

function fmtRD(n: number) {
  return 'RD$' + Number(n).toLocaleString('es-DO')
}

function recetaTexto(i: any): string {
  const parts: string[] = []
  if (i.sph_od != null || i.sph_oi != null) {
    if (i.sph_od != null) parts.push(`OD: ${i.sph_od > 0 ? '+' : ''}${i.sph_od}`)
    if (i.sph_oi != null) parts.push(`OI: ${i.sph_oi > 0 ? '+' : ''}${i.sph_oi}`)
  } else if (i.sph != null) {
    parts.push(`SPH: ${i.sph > 0 ? '+' : ''}${i.sph}`)
  }
  if (i.cyl != null) parts.push(`CYL: ${i.cyl}`)
  if (i.axis != null) parts.push(`EJE: ${i.axis}°`)
  if (i.add_power) parts.push(`ADD: ${i.add_power}`)
  if (i.color) parts.push(`Color: ${i.color}`)
  if (i.size) parts.push(`${i.size}`)
  return parts.join(' · ')
}

export default function VentaWhatsAppPage() {
  const params = useParams()
  const token = String(params?.token ?? '')

  const [data, setData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [ordenCreada, setOrdenCreada] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: '', cedula: '', fecha_nacimiento: '', telefono: '',
    email: '', direccion: '', ciudad: '', ciudadPersonalizada: '',
  })

  useEffect(() => {
    if (!token) return
    fetch(`/api/venta-wa/${token}`)
      .then(async r => {
        const j = await r.json()
        if (!r.ok) { setErrorMsg(j.error ?? 'Link no válido'); return }
        if (j.estado === 'completado') { setErrorMsg('Este pedido ya fue registrado. Si tienes dudas, escríbenos por WhatsApp.'); return }
        setData(j)
      })
      .catch(() => setErrorMsg('Error de conexión. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }, [token])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const formatCedula = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 10) return `${d.slice(0,3)}-${d.slice(3)}`
    return `${d.slice(0,3)}-${d.slice(3,10)}-${d.slice(10)}`
  }

  const submit = async () => {
    const cedulaDigits = form.cedula.replace(/\D/g, '')
    const telDigits = form.telefono.replace(/\D/g, '')
    if (form.nombre.trim().length < 3) return toast.error('Escribe tu nombre completo')
    if (cedulaDigits.length !== 11) return toast.error('La cédula debe tener 11 dígitos')
    if (!form.fecha_nacimiento) return toast.error('Selecciona tu fecha de nacimiento')
    if (telDigits.length < 10) return toast.error('Escribe tu número de WhatsApp (10 dígitos)')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return toast.error('Escribe un correo válido')
    if (form.direccion.trim().length < 8) return toast.error('Escribe tu dirección completa')
    const ciudadFinal = form.ciudad === 'Otra ciudad' ? form.ciudadPersonalizada.trim() : form.ciudad
    if (!ciudadFinal || ciudadFinal.length < 3) return toast.error('Selecciona tu ciudad')

    setEnviando(true)
    try {
      const r = await fetch(`/api/venta-wa/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          cedula: cedulaDigits,
          fecha_nacimiento: form.fecha_nacimiento,
          telefono: telDigits,
          email: form.email.trim(),
          direccion: form.direccion.trim(),
          ciudad: ciudadFinal,
        }),
      })
      const j = await r.json()
      if (!r.ok) { toast.error(j.error ?? 'Error al registrar'); setEnviando(false); return }
      setOrdenCreada(j.numero_orden)
    } catch {
      toast.error('Error de conexión. Intenta de nuevo.')
      setEnviando(false)
    }
  }

  // ───────── Estados de pantalla ─────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Cargando tu pedido…</div>
    </div>
  )

  if (errorMsg) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md text-center">
        <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <p className="text-gray-800 font-medium">{errorMsg}</p>
        <a href="https://wa.me/18096942268" className="inline-block mt-5 bg-[#25D366] text-white font-semibold px-6 py-2.5 rounded-full">
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  )

  if (ordenCreada) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-gray-900">¡Pedido registrado!</h1>
        <p className="text-gray-600 mt-2">
          Tu número de pedido es <span className="font-bold text-[#0B3D66]">{ordenCreada}</span>.
        </p>
        <p className="text-gray-600 mt-3 text-sm">
          En unos minutos te enviaremos por WhatsApp el <b>link de pago seguro</b> para completar tu compra. 💙
        </p>
      </div>
    </div>
  )

  const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30 focus:border-[#0B3D66]'

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-[#0B3D66] text-white py-5 px-6 text-center">
        <div className="text-2xl font-extrabold">Contact<span className="text-[#0FB5AE]">Go</span></div>
        <div className="text-xs text-blue-100 mt-1">Confirma tus datos para completar tu pedido</div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-5">
        {/* Resumen del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-[#0B3D66]" />
            <h2 className="font-bold text-gray-900">Tu pedido</h2>
          </div>
          <div className="space-y-3">
            {data.items.map((i: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start gap-3 pb-3 border-b border-dashed last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{i.cantidad}× {i.nombre}</div>
                  {recetaTexto(i) && <div className="text-xs text-gray-500 mt-0.5">{recetaTexto(i)}</div>}
                </div>
                <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">{fmtRD(i.precio * i.cantidad)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmtRD(data.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Envío</span><span>{data.envio > 0 ? fmtRD(data.envio) : 'Gratis'}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1"><span>Total</span><span>{fmtRD(data.total)}</span></div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#0B3D66]" />
            <h2 className="font-bold text-gray-900">Tus datos</h2>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre completo</label>
              <input className={inputCls} placeholder="Ej: María Rodríguez" value={form.nombre}
                onChange={e => set('nombre', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Cédula</label>
                <input className={inputCls} placeholder="000-0000000-0" inputMode="numeric" value={form.cedula}
                  onChange={e => set('cedula', formatCedula(e.target.value))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Fecha de nacimiento</label>
                <input type="date" className={inputCls} value={form.fecha_nacimiento}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={e => set('fecha_nacimiento', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">WhatsApp</label>
              <input className={inputCls} placeholder="809-000-0000" inputMode="tel" value={form.telefono}
                onChange={e => set('telefono', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Correo electrónico</label>
              <input type="email" className={inputCls} placeholder="tu@correo.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Dirección de entrega</label>
              <input className={inputCls} placeholder="Calle, número, sector, referencia" value={form.direccion}
                onChange={e => set('direccion', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Ciudad</label>
              <select className={inputCls} value={form.ciudad} onChange={e => set('ciudad', e.target.value)}>
                <option value="">Selecciona tu ciudad</option>
                {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {form.ciudad === 'Otra ciudad' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">¿Cuál ciudad?</label>
                <input className={inputCls} placeholder="Escribe tu ciudad" value={form.ciudadPersonalizada}
                  onChange={e => set('ciudadPersonalizada', e.target.value)} />
              </div>
            )}
          </div>

          <button onClick={submit} disabled={enviando}
            className="w-full mt-5 bg-[#0B3D66] hover:bg-[#0d4a7c] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition">
            {enviando ? 'Registrando…' : 'Confirmar mis datos'}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <CreditCard className="w-3.5 h-3.5" />
            Después de confirmar, recibirás el link de pago seguro por WhatsApp
          </div>
        </div>
      </div>
    </div>
  )
}
