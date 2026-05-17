// ── Tracking de ecommerce para GA4 + Meta Pixel ──

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}

type EcommerceItem = {
  item_id: string
  item_name: string
  item_brand?: string
  item_category?: string
  price: number
  quantity?: number
}

type EcommerceEvent =
  | 'view_item_list'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  | 'add_to_wishlist'

const FB_MAP: Partial<Record<EcommerceEvent, string>> = {
  view_item:     'ViewContent',
  add_to_cart:   'AddToCart',
  begin_checkout:'InitiateCheckout',
  purchase:      'Purchase',
  add_to_wishlist: 'AddToWishlist',
}

export function trackEcommerce(
  event: EcommerceEvent,
  data: { items: EcommerceItem[]; value?: number; transaction_id?: string; currency?: string }
) {
  if (typeof window === 'undefined') return

  const currency = data.currency ?? 'DOP'
  const value = data.value ?? data.items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0)

  // GA4 via dataLayer
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event,
    ecommerce: { currency, value, items: data.items, transaction_id: data.transaction_id },
  })

  // Meta Pixel
  const fbEvent = FB_MAP[event]
  if (fbEvent && window.fbq) {
    window.fbq('track', fbEvent, {
      content_ids: data.items.map(i => i.item_id),
      content_type: 'product',
      value,
      currency,
      num_items: data.items.length,
    })
  }
}

// Eventos de embudo de receta
export function trackReceta(action: 'started' | 'completed' | 'skipped', method?: string) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: `receta_${action}`, method })
}

// Evento de búsqueda
export function trackSearch(term: string, results: number) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'search', search_term: term, results_count: results })
}
