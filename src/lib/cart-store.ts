'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, opts?: { cantidad?: number; sph?: number | null; cyl?: number | null; axis?: number | null; add_power?: string | null; color?: string | null }) => void
  removeItem: (productId: string, sph?: number | null) => void
  updateQty: (productId: string, cantidad: number, sph?: number | null) => void
  updateItem: (index: number, cantidad: number) => void
  removeByIndex: (index: number) => void
  clearCart: () => void
  total: () => number
  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, opts = {}) => {
        const { cantidad = 1, sph, cyl, axis, add_power, color } = opts
        set(state => {
          const existing = state.items.find(
            i => i.product.id === product.id && i.sph === sph && i.color === color
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id && i.sph === sph && i.color === color
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              )
            }
          }
          return { items: [...state.items, { product, cantidad, sph, cyl, axis, add_power, color }] }
        })
      },

      removeItem: (productId, sph) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.product.id === productId && i.sph === sph)
          )
        }))
      },

      updateQty: (productId, cantidad, sph) => {
        if (cantidad <= 0) { get().removeItem(productId, sph); return }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId && i.sph === sph
              ? { ...i, cantidad }
              : i
          )
        }))
      },

      updateItem: (index, cantidad) => {
        const items = [...get().items]
        if (items[index]) { items[index] = { ...items[index], cantidad }; set({ items }) }
      },
      removeByIndex: (index) => {
        const items = get().items.filter((_, i) => i !== index)
        set({ items })
      },
      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((s, i) => s + i.product.precio * i.cantidad, 0),

      total: () => {
        const sub = get().subtotal()
        return sub > 0 ? sub + 200 : 0  // +RD$200 envío
      },

      itemCount: () => get().items.reduce((s, i) => s + i.cantidad, 0),
    }),
    { name: 'contactgo-cart' }
  )
)
