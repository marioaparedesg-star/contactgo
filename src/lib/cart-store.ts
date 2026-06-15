'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface AddItemOpts {
  cantidad?:       number
  ojo_mode?:       'AMBOS' | 'OD' | 'OI' | null
  misma_receta?:   boolean
  // Receta única
  sph?:            number | null
  cyl?:            number | null
  axis?:           number | null
  add_power?:      string | null
  // Receta diferente por ojo
  sph_od?:         number | null
  sph_oi?:         number | null
  cyl_od?:         number | null
  cyl_oi?:         number | null
  axis_od?:        number | null
  axis_oi?:        number | null
  // Otros
  color?:          string | null
  size?:           string | null
  precio_override?: number | null
  precio_original?: number | null
  suscripcion?:    string | null
}

interface CartStore {
  items:            CartItem[]
  cuponCodigo:      string | null
  cuponDescuento:   number
  setCupon:         (codigo: string | null, descuento: number) => void
  clearCupon:       () => void
  addItem:          (product: Product, opts?: AddItemOpts) => void
  removeByIndex:    (index: number) => void
  updateItem:       (index: number, cantidad: number) => void
  clearCart:        () => void
  subtotal:         () => number
  total:            () => number
  itemCount:        () => number
  // Legacy — mantener para compatibilidad con checkout y analytics
  removeItem:       (productId: string, sph?: number | null, ojo?: string | null) => void
  updateQty:        (productId: string, cantidad: number, sph?: number | null, ojo?: string | null) => void
}

/** Genera una clave única por item para detectar duplicados */
const itemKey = (p: Product, o: AddItemOpts): string =>
  [p.id, o.ojo_mode, o.sph, o.sph_od, o.sph_oi,
   o.cyl, o.cyl_od, o.cyl_oi, o.axis, o.axis_od, o.axis_oi,
   o.add_power, o.color, o.suscripcion].join('|')

const cartItemKey = (i: CartItem): string =>
  [i.product.id, i.ojo_mode, i.sph, (i as any).sph_od, (i as any).sph_oi,
   i.cyl, (i as any).cyl_od, (i as any).cyl_oi,
   i.axis, (i as any).axis_od, (i as any).axis_oi,
   i.add_power, i.color, i.suscripcion].join('|')

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:          [],
      cuponCodigo:    null,
      cuponDescuento: 0,

      setCupon:  (codigo, descuento) => set({ cuponCodigo: codigo, cuponDescuento: descuento }),
      clearCupon: () => set({ cuponCodigo: null, cuponDescuento: 0 }),

      addItem: (product, opts = {}) => {
        const {
          cantidad = 1, ojo_mode = null, misma_receta = true,
          sph, cyl, axis, add_power,
          sph_od, sph_oi, cyl_od, cyl_oi, axis_od, axis_oi,
          color, size, precio_override, precio_original, suscripcion
        } = opts

        const key = itemKey(product, opts)

        set(state => {
          const existingIdx = state.items.findIndex(i => cartItemKey(i) === key)
          if (existingIdx >= 0) {
            // Incrementar cantidad del item existente
            const updated = [...state.items]
            updated[existingIdx] = { ...updated[existingIdx], cantidad: updated[existingIdx].cantidad + cantidad }
            return { items: updated }
          }
          // Nuevo item
          const newItem: CartItem = {
            product, cantidad,
            ojo_mode, misma_receta,
            sph: sph ?? null, cyl: cyl ?? null, axis: axis ?? null, add_power: add_power ?? null,
            sph_od: sph_od ?? null, sph_oi: sph_oi ?? null,
            cyl_od: cyl_od ?? null, cyl_oi: cyl_oi ?? null,
            axis_od: axis_od ?? null, axis_oi: axis_oi ?? null,
            color: color ?? null, size: size ?? null,
            suscripcion: suscripcion ?? null,
            precio_final:    precio_override ?? product.precio,
            precio_original: precio_original ?? product.precio,
          } as any
          return { items: [...state.items, newItem] }
        })
      },

      removeByIndex: (index) =>
        set(state => ({ items: state.items.filter((_, i) => i !== index) })),

      updateItem: (index, cantidad) => {
        if (cantidad <= 0) { get().removeByIndex(index); return }
        set(state => {
          const items = [...state.items]
          if (items[index]) items[index] = { ...items[index], cantidad }
          return { items }
        })
      },

      clearCart: () => set({ items: [], cuponCodigo: null, cuponDescuento: 0 }),

      // ── Legacy — mantener compatibilidad ────────────────────────────
      removeItem: (productId, _sph, _ojo) => {
        // Usar removeByIndex cuando sea posible; esto es fallback
        set(state => ({
          items: state.items.filter(i => i.product.id !== productId)
        }))
      },
      updateQty: (productId, cantidad, _sph, _ojo) => {
        const idx = get().items.findIndex(i => i.product.id === productId)
        if (idx >= 0) get().updateItem(idx, cantidad)
      },

      subtotal: () => get().items.reduce((s, i) => {
        const precio = (i as any).precio_final ?? i.product.precio
        return s + precio * i.cantidad
      }, 0),

      total: () => {
        const sub = get().subtotal()
        return sub > 0 ? sub + 200 : 0
      },

      itemCount: () => get().items.reduce((s, i) => s + i.cantidad, 0),
    }),
    { name: 'contactgo-cart-v2' }  // v2 — limpia carrito legacy automáticamente
  )
)
