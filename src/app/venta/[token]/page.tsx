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
import { ShoppingBag, CheckCircle, Clock, User, CreditCard, Phone, Mail, MapPin, Calendar, Truck, Link2 } from 'lucide-react'
import DisclaimerMedico, { DisclaimerData, DISCLAIMER_VERSION } from '@/components/legal/DisclaimerMedico'

const CIUDADES = [
  'Santo Domingo', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste',
  'Distrito Nacional', 'Santiago', 'La Vega', 'San Cristóbal', 'Puerto Plata',
  'San Pedro de Macorís', 'La Romana', 'Higüey', 'Moca', 'San Francisco de Macorís',
  'Baní', 'Bonao', 'Azua', 'Barahona', 'Otra ciudad',
]

// Pago contra entrega — solo disponible dentro del Gran Santo Domingo
// (limitación real de logística: solo ahí se puede coordinar cobro en
// efectivo al momento de la entrega). Fuera de esa zona, la única opción
// es el link de pago seguro (AZUL).
const ZONAS_CONTRA_ENTREGA = ['Santo Domingo', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'Distrito Nacional']
function esZonaContraEntrega(ciudad: string) {
  return ZONAS_CONTRA_ENTREGA.includes(ciudad)
}

function fmtRD(n: number) {
  return 'RD$' + Number(n).toLocaleString('es-DO')
}

function recetaTexto(i: any): string {
  const parts: string[] = []

  if (i.size) parts.push(i.size)
  if (i.color) parts.push(`Color: ${i.color}`)
  if (i.modalidad === 'plano') parts.push('Plano')

  const buildOjo = (ojo: 'od' | 'oi'): string | null => {
    const sph = i[`sph_${ojo}`]
    const cyl = i[`cyl_${ojo}`]
    const axis = i[`axis_${ojo}`]
    const add = i[`add_${ojo}`]
    const bits: string[] = []
    if (sph != null && sph !== '') bits.push(`${Number(sph) > 0 ? '+' : ''}${sph}`)
    if (cyl != null && cyl !== '') bits.push(`CYL ${cyl}`)
    if (axis != null && axis !== '') bits.push(`EJE ${axis}°`)
    if (add != null && add !== '') bits.push(`ADD ${add}`)
    return bits.length ? bits.join(' ') : null
  }
  const od = buildOjo('od')
  const oi = buildOjo('oi')

  if (od || oi) {
    if (i.ojo_mode === 'OD' && od) parts.push(`OD: ${od}`)
    else if (i.ojo_mode === 'OI' && oi) parts.push(`OI: ${oi}`)
    else {
      if (od) parts.push(`OD: ${od}`)
      if (oi) parts.push(`OI: ${oi}`)
    }
  } else {
    // Fallback compat con datos viejos (sph/cyl/axis a secas)
    if (i.sph != null) parts.push(`SPH: ${Number(i.sph) > 0 ? '+' : ''}${i.sph}`)
    if (i.cyl != null) parts.push(`CYL: ${i.cyl}`)
    if (i.axis != null) parts.push(`EJE: ${i.axis}°`)
    if (i.add_power) parts.push(`ADD: ${i.add_power}`)
  }

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
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  // Pago contra entrega — solo se ofrece si la ciudad seleccionada está
  // dentro del Gran Santo Domingo. Fuera de ahí, la única opción válida
  // es el link de pago (tarjeta vía AZUL).
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'contra_entrega'>('tarjeta')

  const [form, setForm] = useState({
    nombre: '', fecha_nacimiento: '', telefono: '',
    email: '', direccion: '', ciudad: '', ciudadPersonalizada: '',
  })

  const ciudadFinal = form.ciudad === 'Otra ciudad' ? form.ciudadPersonalizada.trim() : form.ciudad
  const puedeContraEntrega = esZonaContraEntrega(ciudadFinal)

  // Blindaje: si el cliente había elegido "contra entrega" y luego cambia
  // la ciudad a una fuera del Gran Santo Domingo, revertir automáticamente
  // a link de pago — la misma protección que ya existe en el checkout web.
  useEffect(() => {
    if (metodoPago === 'contra_entrega' && !puedeContraEntrega) setMetodoPago('tarjeta')
  }, [puedeContraEntrega, metodoPago])

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

  const submit = async () => {
    const telDigits = form.telefono.replace(/\D/g, '')
    if (form.nombre.trim().length < 3) return toast.error('Escribe tu nombre completo')
    if (!form.fecha_nacimiento) return toast.error('Selecciona tu fecha de nacimiento')
    if (telDigits.length < 10) return toast.error('Escribe tu número de WhatsApp (10 dígitos)')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return toast.error('Escribe un correo válido')
    if (form.direccion.trim().length < 8) return toast.error('Escribe tu dirección completa')
    if (!ciudadFinal || ciudadFinal.length < 3) return toast.error('Selecciona tu ciudad')

    // Antes de crear la orden, el cliente debe aceptar el aviso médico —
    // igual que en el checkout normal de la web.
    setShowDisclaimer(true)
  }

  const handleDisclaimerAceptado = async (dData: DisclaimerData) => {
    setShowDisclaimer(false)
    const telDigits = form.telefono.replace(/\D/g, '')

    setEnviando(true)
    try {
      // 1. Registrar la aceptación del descargo (igual que en checkout — sin order_id todavía)
      let disclaimerId: string | null = null
      try {
        const rd = await fetch('/api/disclaimer', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            version: dData.version, tipo: 'compra_whatsapp',
            user_agent: dData.user_agent, items_snapshot: dData.items_snapshot,
            accepted_at: dData.accepted_at,
          }),
        })
        const rj = await rd.json()
        disclaimerId = rj.disclaimer_id ?? null
      } catch { /* si falla el log, igual dejamos continuar la compra */ }

      // 2. Crear la orden, incluyendo la referencia del descargo aceptado
      const r = await fetch(`/api/venta-wa/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          fecha_nacimiento: form.fecha_nacimiento,
          telefono: telDigits,
          email: form.email.trim(),
          direccion: form.direccion.trim(),
          ciudad: ciudadFinal,
          metodo_pago: metodoPago,
          disclaimer_acceptance_id: disclaimerId,
          disclaimer_version: dData.version,
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
          Tu número de pedido es <span className="font-bold text-[#002455]">{ordenCreada}</span>.
        </p>
        {metodoPago === 'contra_entrega' ? (
          <p className="text-gray-600 mt-3 text-sm">
            Pagas en <b>efectivo al recibir</b> tu pedido. Nuestro equipo coordinará contigo la entrega por WhatsApp. 💙
          </p>
        ) : (
          <p className="text-gray-600 mt-3 text-sm">
            En unos minutos te enviaremos por WhatsApp el <b>link de pago seguro</b> para completar tu compra. 💙
          </p>
        )}
      </div>
    </div>
  )

  const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#002455]/30 focus:border-[#002455]'

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="bg-[#002455] text-white py-5 px-6 text-center">
        <div className="text-2xl font-extrabold">Contact<span className="text-[#0FB5AE]">Go</span></div>
        <div className="text-xs text-blue-100 mt-1">📋 Tu cotización — completa tus datos para generar tu orden</div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-5">
        {/* Resumen del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-[#002455]" />
            <h2 className="font-bold text-gray-900">Tu cotización</h2>
          </div>
          <div className="space-y-3">
            {data.items.map((i: any, idx: number) => {
              const original = Number(i.precio_original ?? i.precio)
              const tieneDescuento = original > Number(i.precio)
              const pctDescuento = tieneDescuento ? Math.round((1 - Number(i.precio) / original) * 100) : 0
              return (
                <div key={idx} className="flex justify-between items-start gap-3 pb-3 border-b border-dashed last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{i.cantidad}× {i.nombre}</div>
                    {recetaTexto(i) && <div className="text-xs text-gray-500 mt-0.5">{recetaTexto(i)}</div>}
                    {tieneDescuento && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        🎉 {pctDescuento}% de descuento
                      </span>
                    )}
                  </div>
                  <div className="text-right whitespace-nowrap">
                    {tieneDescuento && (
                      <div className="text-xs text-gray-400 line-through">{fmtRD(original * i.cantidad)}</div>
                    )}
                    <div className={`font-semibold text-sm ${tieneDescuento ? 'text-green-700' : 'text-gray-900'}`}>
                      {fmtRD(i.precio * i.cantidad)}
                    </div>
                  </div>
                </div>
              )
            })}
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
            <User className="w-5 h-5 text-[#002455]" />
            <h2 className="font-bold text-gray-900">Tus datos</h2>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre completo</label>
              <input className={inputCls} placeholder="Ej: María Rodríguez" value={form.nombre}
                onChange={e => set('nombre', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Fecha de nacimiento</label>
              <input type="date" className={inputCls} value={form.fecha_nacimiento}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => set('fecha_nacimiento', e.target.value)} />
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

          {/* ── MÉTODO DE PAGO ── */}
          {ciudadFinal && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-gray-600 mb-1">¿Cómo prefieres pagar?</p>

              {puedeContraEntrega && (
                <button type="button" onClick={() => setMetodoPago('contra_entrega')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${metodoPago === 'contra_entrega' ? 'border-[#01B2B7] bg-teal-50/50' : 'border-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${metodoPago === 'contra_entrega' ? 'border-[#01B2B7]' : 'border-gray-300'}`}>
                    {metodoPago === 'contra_entrega' && <div className="w-2.5 h-2.5 bg-[#01B2B7] rounded-full" />}
                  </div>
                  <Truck className="w-4 h-4 text-gray-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">💵 Pago contra entrega</p>
                    <p className="text-xs text-gray-400">Pagas en efectivo cuando recibas tu pedido</p>
                  </div>
                </button>
              )}

              <button type="button" onClick={() => setMetodoPago('tarjeta')}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${metodoPago === 'tarjeta' ? 'border-[#01B2B7] bg-teal-50/50' : 'border-gray-200'}`}>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${metodoPago === 'tarjeta' ? 'border-[#01B2B7]' : 'border-gray-300'}`}>
                  {metodoPago === 'tarjeta' && <div className="w-2.5 h-2.5 bg-[#01B2B7] rounded-full" />}
                </div>
                <Link2 className="w-4 h-4 text-gray-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">🔗 Pago con link de pago</p>
                  <p className="text-xs text-gray-400">Te enviamos un link seguro por WhatsApp (tarjeta Visa/Mastercard vía AZUL)</p>
                </div>
              </button>

              {!puedeContraEntrega && (
                <p className="text-[11px] text-gray-400 pl-1">El pago contra entrega solo está disponible en el Gran Santo Domingo.</p>
              )}
            </div>
          )}

          <button onClick={submit} disabled={enviando}
            className="w-full mt-5 bg-[#002455] hover:bg-[#01B2B7] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition">
            {enviando ? 'Registrando…' : 'Confirmar mis datos'}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            {metodoPago === 'contra_entrega' ? (
              <><Truck className="w-3.5 h-3.5" />Después de confirmar, coordinamos la entrega y el cobro en efectivo</>
            ) : (
              <><CreditCard className="w-3.5 h-3.5" />Después de confirmar, recibirás el link de pago seguro por WhatsApp</>
            )}
          </div>
        </div>
      </div>

      {showDisclaimer && (
        <DisclaimerMedico
          showModal
          items={data?.items ?? []}
          onAceptar={handleDisclaimerAceptado}
          onCancelar={() => setShowDisclaimer(false)}
        />
      )}
    </div>
  )
}
