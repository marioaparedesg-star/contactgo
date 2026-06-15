'use client'
import EntregaBadge from '@/components/shop/EntregaBadge'
import { labelFrecuencia, labelDescuento } from '@/lib/subscription-utils'
import { trackEcommerce } from '@/lib/analytics'
import { fmtSph, fmtReceta } from '@/lib/sph-utils'
import { useCartStore } from '@/lib/cart-store'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Eye, Tag, Shield, Truck, RotateCcw, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'



export default function CartPage() {
  const { items, removeItem, updateQty, removeByIndex, updateItem, addItem, subtotal, clearCart, setCupon, cuponCodigo, cuponDescuento } = useCartStore()
  const [cuponInput, setCuponInput] = useState(cuponCodigo ?? '')
  const [descuento,  setDescuento]  = useState(cuponDescuento)
  const [solucionSugerida, setSolucionSugerida] = useState<any>(null)

  // Cargar solución sugerida si no hay solución en el carrito
  useEffect(() => {
    const tieneSolucion = items.some((i: any) =>
      (i.product as any)?.tipo === 'solucion' || (i.product as any)?.tipo === 'gota'
    )
    const tieneELente = items.some((i: any) =>
      ['esferico','torico','multifocal','color'].includes((i.product as any)?.tipo ?? '')
    )
    if (!tieneSolucion && tieneELente && items.length > 0) {
      fetch('/api/cross-selling?tipos=solucion&exclude=&limit=1')
        .then(r => r.json())
        .then(d => setSolucionSugerida(d.products?.[0] ?? null))
        .catch(() => {})
    } else {
      setSolucionSugerida(null)
    }
  }, [items])
  const [cuponOk, setCuponOk] = useState(false)
  const [cuponErr, setCuponErr] = useState('')

  const sub  = subtotal()
  const envio = sub >= 8000 ? 0 : 200
  const tot  = sub + envio - descuento

  const aplicarCupon = async () => {
    const code = cuponInput.trim().toUpperCase()
    if (!code) return
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: code, subtotal: sub }),
      })
      const result = await res.json()
      if (!result.valido) {
        setCuponErr(result.mensaje ?? 'Cupón no válido')
        setCuponOk(false)
        setDescuento(0)
        setCupon(null, 0)           // limpiar store
        return
      }
      setDescuento(result.descuento)
      setCupon(code, result.descuento)  // persistir en store → checkout lo leerá
      setCuponOk(true)
      setCuponErr('')
      toast.success(result.mensaje ?? 'Cupón aplicado ✓')
    } catch {
      setCuponErr('Error al validar')
    }
  }

  if (items.length === 0) return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Explora nuestro catálogo y encuentra los lentes perfectos para ti.</p>
        <Link href="/catalogo" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
          Ver catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Tu carrito</h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
            Vaciar carrito
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-6">

          {/* Items */}
          <div className="md:col-span-3 space-y-3">
            {items.map((item, idx) => {
              const receta = fmtReceta(item)
              const precioItem = Number((item as any).precio_final ?? item.product.precio)
              // ojoLabel legacy — reemplazado por nuevo bloque ojo_mode abajo
              return (
                <div key={`${item.product.id}-${item.sph}-${(item as any).ojo}-${idx}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                    {item.product.imagen_url
                      ? <Image src={item.product.imagen_url} alt={item.product.nombre} width={80} height={80} className="object-contain p-1" unoptimized />
                      : <Eye className="w-8 h-8 text-gray-200" />
                    }
                  </div>

                  {/* Detalle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {(item.product as any).marca && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{(item.product as any).marca}</p>
                        )}
                        <p className="font-bold text-gray-900 text-sm leading-snug">{item.product.nombre}</p>
                        <div className="mt-1">
                          <EntregaBadge tipo={(item.product as any).tipo ?? 'esferico'} nombre={item.product.nombre} variant="cart" />
                        </div>
                      </div>
                      <button onClick={() => {
                        trackEcommerce('remove_from_cart', {
                          items: [{ item_id: item.product.id, item_name: item.product.nombre, price: (item as any).precio_final ?? item.product.precio, quantity: item.cantidad }],
                        })
                        removeByIndex(idx)
                      }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ojo + Receta — nuevo formato single-item */}
                    {(item as any).ojo_mode && (() => {
                      const mode = (item as any).ojo_mode
                      const misma = (item as any).misma_receta !== false
                      return (
                        <div className="mt-1.5 space-y-1">
                          {/* Badge de ojo */}
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mode === 'AMBOS' ? 'bg-primary-100 text-primary-700' :
                            mode === 'OD'    ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {mode === 'AMBOS' ? '👀 Ambos ojos' : mode === 'OD' ? '👁 Ojo derecho' : '👁 Ojo izquierdo'}
                          </span>
                          {/* Receta */}
                          {mode === 'AMBOS' && !misma ? (
                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-[10px] font-mono font-bold text-gray-700 space-y-0.5">
                              {(item as any).sph_od && <p>OD: SPH {(item as any).sph_od}{(item as any).cyl_od ? ` / CYL ${(item as any).cyl_od}` : ''}{(item as any).axis_od ? ` / AXIS ${(item as any).axis_od}°` : ''}</p>}
                              {(item as any).sph_oi && <p>OI: SPH {(item as any).sph_oi}{(item as any).cyl_oi ? ` / CYL ${(item as any).cyl_oi}` : ''}{(item as any).axis_oi ? ` / AXIS ${(item as any).axis_oi}°` : ''}</p>}
                            </div>
                          ) : item.sph != null ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
                              <p className="text-[10px] font-mono font-bold text-blue-800">
                                SPH {Number(item.sph) > 0 ? '+' : ''}{Number(item.sph).toFixed(2)}
                                {item.cyl  != null ? ` / CYL ${Number(item.cyl).toFixed(2)}`  : ''}
                                {(item as any).axis != null ? ` / AXIS ${(item as any).axis}°` : ''}
                                {item.add_power ? ` / ADD ${item.add_power}` : ''}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )
                    })()}

                    {/* Suscripción */}
                    {(item as any).suscripcion && (
                      <div className="mt-1.5 space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                          🔄 Suscripción · {labelFrecuencia((item as any).suscripcion)}
                        </span>
                        <p className="text-[10px] text-green-600 font-semibold">
                          {labelDescuento((item as any).suscripcion)} aplicado · Cancela cuando quieras
                        </p>
                      </div>
                    )}

                    {/* Precio original tachado si hay suscripción */}
                    {(item as any).suscripcion && (item as any).precio_original && (item as any).precio_original > precioItem && (
                      <p className="text-xs text-gray-400 line-through mt-1">
                        RD${(item as any).precio_original.toLocaleString()}
                      </p>
                    )}
                    {/* Precio + cantidad */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateItem(idx, item.cantidad - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">{item.cantidad}</span>
                        <button onClick={() => updateItem(idx, item.cantidad + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-black text-gray-900 text-base">
                        RD${(precioItem * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Shield, text: '100% Original' },
                { icon: Truck,  text: 'Entrega 24-48h' },
                { icon: RotateCcw, text: 'Devolución 48h' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <b.icon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-[11px] text-gray-500 font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="md:col-span-2 md:sticky md:top-4 md:self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20 space-y-4">
              <h3 className="font-black text-gray-900">Resumen</h3>

              {/* Cupón */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input value={cuponInput} onChange={e => setCuponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && aplicarCupon()}
                      placeholder="Código de descuento"
                      className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                  <button onClick={aplicarCupon}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    Usar
                  </button>
                </div>
                {cuponOk && <p className="text-green-600 text-xs mt-1.5 font-semibold">✅ Cupón aplicado</p>}
                {cuponErr && <p className="text-red-500 text-xs mt-1.5">{cuponErr}</p>}
              </div>

              {/* Totales */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>RD${sub.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span className={envio === 0 ? 'text-green-600 font-semibold' : ''}>
                    {envio === 0 ? '🎁 ¡Gratis!' : `RD$${envio}`}
                  </span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Descuento</span>
                    <span>-RD${descuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-100 pt-3 flex justify-between items-baseline">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-2xl text-primary-600">RD${tot.toLocaleString()}</span>
                </div>
              </div>

              {/* Envío gratis hint */}
              {envio > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-700">
                    ¡Agrega <strong>RD${(8000 - sub).toLocaleString()}</strong> más y el envío es <strong>gratis</strong>! 🚀
                  </p>
                  <div className="mt-2 bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (sub/8000)*100)}%` }} />
                  </div>
                </div>
              )}

              {/* Cross-sell: solución si no la tienen — Bundle destacado */}
              {solucionSugerida && (
                <div className="bg-gradient-to-br from-blue-50 to-primary-50 border border-primary-100 rounded-2xl p-3">
                  <p className="text-[10px] font-black text-primary-700 uppercase tracking-wide mb-1.5">
                    💧 Agrega tu solución de limpieza
                  </p>
                  <p className="text-[10px] text-gray-500 mb-2">Los lentes quincenales y mensuales requieren solución cada uso.</p>
                  <div className="flex items-center gap-3">
                    {solucionSugerida.imagen_url && (
                      <img src={solucionSugerida.imagen_url} alt={solucionSugerida.nombre}
                        className="w-10 h-10 object-contain rounded-lg bg-white border border-blue-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{solucionSugerida.nombre}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-primary-600">RD${Number(solucionSugerida.precio).toLocaleString()}</p>
                        <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded">Envío gratis</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addItem(solucionSugerida)
                        setSolucionSugerida(null)
                        toast.success('Solución añadida ✓')
                      }}
                      className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black px-3 py-2 rounded-xl transition-colors active:scale-95">
                      + Agregar
                    </button>
                  </div>
                </div>
              )}

              <Link href="/checkout"
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base font-black rounded-2xl">
                Proceder al pago <ChevronRight className="w-5 h-5" />
              </Link>

              <p className="text-center text-[11px] text-gray-400">
                🔒 Pago seguro con AZUL · Banco Popular
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Sticky móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">{items.length} productos</p>
            <p className="font-black text-primary-600 text-lg">RD${tot.toLocaleString()}</p>
          </div>
          <Link href="/checkout"
            className="btn-primary flex items-center gap-2 px-6 py-3 font-bold text-sm">
            Pagar <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
