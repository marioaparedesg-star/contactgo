'use client'
import { useEffect } from 'react'

interface Item {
  id: string
  nombre: string
  marca?: string
  tipo?: string
  precio?: number
}

export default function ViewItemListTracker({
  items,
  listName = 'Catálogo',
}: {
  items: Item[]
  listName?: string
}) {
  useEffect(() => {
    if (!items?.length) return
    if (typeof window === 'undefined') return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: listName,
        items: items.slice(0, 20).map((p, idx) => ({
          item_id:       p.id,
          item_name:     p.nombre,
          item_brand:    p.marca ?? '',
          item_category: p.tipo  ?? '',
          price:         p.precio ?? 0,
          index:         idx + 1,
          item_list_name: listName,
        })),
      },
    })
  }, [items, listName]) // eslint-disable-line react-hooks/exhaustive-deps

  return null // Componente invisible — solo dispara analytics
}
