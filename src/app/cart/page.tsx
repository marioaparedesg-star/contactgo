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
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
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
      <main className="max-w-6xl mx-auto px-4 py-8">
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
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{item.product.nombre}</p>
                  {item.sph !== undefined && item.sph !== null && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      SPH: {item.sph > 0 ? `+${item.sph}` : item.sph}
                      {item.cyl ? ` · CYL: ${item.cyl}` : ''}
                      {item.add_power ? ` · ADD: ${item.add_power}` : ''}
                    </p>
                  )}
                  <p className="text-primary-600 font-bold mt-1">
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
            <Link href="/checkout" className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-3.5">
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/catalogo" className="btn-secondary w-full mt-2 flex items-center justify-center text-sm py-2.5">
              Seguir comprando
            </Link>
            <p className="text-xs text-gray-400 text-center mt-4">
              🔒 Pago seguro · PayPal · BHD · Contra entrega
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
