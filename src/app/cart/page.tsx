'use client'
import { useCartStore } from '@/lib/cart-store'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Eye } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, total, clearCart } = useCartStore()
  const sub = subtotal()
  const tot = total()

  if (items.length === 0) return (
    <>
      <Navbar />
      <main className="pb-20 max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Explora nuestro catálogo y encuentra los lentes perfectos para ti.</p>
        <Link href="/catalogo" className="btn-primary inline-flex items-center gap-2">
          Ver catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main className="pb-20 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-7">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Tu carrito ({items.reduce((s, i) => s + i.cantidad, 0)} items)
          </h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
            Vaciar carrito
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={`${item.product.id}-${item.sph}-${idx}`}
                className="card p-4 flex gap-4">
                {/* Imagen */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.imagen_url
                    ? <Image src={item.product.imagen_url} alt={item.product.nombre} width={80} height={80} className="object-contain p-1" />
                    : <Eye className="w-8 h-8 text-gray-200" />
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.product.marca && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{item.product.marca}</p>
                  )}
                  <p className="font-bold text-gray-900 text-sm leading-snug">{item.product.nombre}</p>

                  {/* Badges tipo + ojo */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {item.product.tipo && (
                      <span className="text-[10px] bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                        {item.product.tipo === 'esferico' ? 'Esférico' : item.product.tipo === 'torico' ? 'Tórico' : item.product.tipo === 'multifocal' ? 'Multifocal' : item.product.tipo === 'color' ? 'Color' : item.product.tipo === 'solucion' ? 'Solución' : 'Gotas'}
                      </span>
                    )}
                    {item.product.reemplazo && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{item.product.reemplazo}</span>
                    )}
                    {item.ojo && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.ojo === 'OD' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                        {item.ojo === 'OD' ? '👁 Ojo Derecho' : '👁 Ojo Izquierdo'}
                      </span>
                    )}
                  </div>

                  {/* Receta */}
                  {item.sph !== undefined && item.sph !== null && (
                    <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Receta</p>
                      <div className="flex flex-wrap gap-3">
                        <div>
                          <p className="text-[9px] text-gray-400">SPH</p>
                          <p className="text-xs font-black text-gray-900">{item.sph > 0 ? `+${item.sph.toFixed(2)}` : item.sph.toFixed(2)}</p>
                        </div>
                        {item.cyl && item.cyl !== 0 && (
                          <div>
                            <p className="text-[9px] text-gray-400">CYL</p>
                            <p className="text-xs font-black text-gray-900">{Number(item.cyl).toFixed(2)}</p>
                          </div>
                        )}
                        {item.axis && (
                          <div>
                            <p className="text-[9px] text-gray-400">AXIS</p>
                            <p className="text-xs font-black text-gray-900">{item.axis}°</p>
                          </div>
                        )}
                        {item.add_power && (
                          <div>
                            <p className="text-[9px] text-gray-400">ADD</p>
                            <p className="text-xs font-black text-gray-900">{item.add_power}</p>
                          </div>
                        )}
                        {item.color && (
                          <div>
                            <p className="text-[9px] text-gray-400">Color</p>
                            <p className="text-xs font-black text-gray-900">{item.color}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-primary-600 font-black mt-2 text-base">
                    RD${(item.product.precio * item.cantidad).toLocaleString()}
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.product.id, item.cantidad - 1, item.sph)}
                      className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.cantidad}</span>
                    <button onClick={() => updateQty(item.product.id, item.cantidad + 1, item.sph)}
                      className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.product.id, item.sph)}
                      className="ml-2 w-7 h-7 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-5 h-fit sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>RD${sub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>RD$200</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>RD${tot.toLocaleString()}</span>
              </div>
            </div>
            {/* Cross-sell soluciones */}
            {!items.some(i => i.product?.tipo === 'solucion') && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-900 mb-1">¿Tienes solución para lentes? 💧</p>
                <p className="text-xs text-gray-500 mb-3">La mayoría de nuestros clientes agrega una solución a su pedido.</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { nombre: 'ReNu Advanced 120ml', precio: 655, href: '/producto/renu-advanced-solucion-lentes-contacto-bausch-dominicana' },
                    { nombre: 'Opti-Free 90ml', precio: 450, href: '/producto/opti-free-puremoist-solucion-multiproposito-dominicana' },
                    { nombre: 'Prolub Hyfresh 350ml', precio: 869, href: '/producto/prolub-hyfresh-solucion-multiproposito-dominicana' },
                  ].map(p => (
                    <Link key={p.href} href={p.href} className="shrink-0 bg-white border border-gray-200 rounded-xl px-3 py-2 text-left hover:border-primary-300 transition-colors">
                      <p className="text-xs font-semibold text-gray-900">{p.nombre}</p>
                      <p className="text-xs text-primary-600 font-bold">RD${p.precio.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link href="/checkout" className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-3.5">
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/catalogo" className="btn-secondary w-full mt-2 flex items-center justify-center text-sm py-2.5">
              Seguir comprando
            </Link>
            <p className="text-xs text-gray-400 text-center mt-4">
              🔒 Pago seguro · PayPal · Contra entrega
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
