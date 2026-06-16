// ── Tracking de ecommerce para GA4 + Meta Pixel ──
// Meta Pixel ID: 1516674003159165

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

// Evento de suscripción seleccionada
export function trackSubscriptionSelected(
  productId: string,
  productName: string,
  frecuencia: string,
  descuentoPct: number,
  precio: number
) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'subscription_selected',
    subscription_frequency: frecuencia,
    subscription_discount_pct: descuentoPct,
    ecommerce: {
      currency: 'DOP',
      value: precio,
      items: [{
        item_id: productId,
        item_name: productName,
        item_variant: `suscripcion_${frecuencia}`,
        discount: descuentoPct,
        price: precio,
        quantity: 1,
      }],
    },
  })
  if (window.fbq) {
    window.fbq('trackCustom', 'SubscriptionSelected', {
      frequency: frecuencia,
      discount_pct: descuentoPct,
    })
  }
}

// ── Eventos del flujo óptico EyeFlow ──────────────────────────────────────

export type EyeFlowEventAction =
  | 'started'          // usuario interactúa con el selector por primera vez
  | 'ambos_selected'   // eligió "Ambos ojos"
  | 'un_ojo_selected'  // eligió "Un solo ojo"
  | 'misma_receta'     // eligió "Sí, son iguales"
  | 'diferente_receta' // eligió "No, son diferentes"
  | 'no_seguro'        // eligió "No estoy seguro"
  | 'completed'        // llegó hasta agregar al carrito o comprar ahora

export function trackEyeFlow(
  action: EyeFlowEventAction,
  meta?: { producto?: string; tipo?: string; ojo_mode?: string }
) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: `eye_flow_${action}`,
    eye_flow_action: action,
    ...meta,
  })
  // Custom Meta Pixel para análisis de embudo
  if (window.fbq) {
    window.fbq('trackCustom', 'EyeFlow', { action, ...meta })
  }
}

// ── Evento: "Comprar ahora" (skip carrito) ───────────────────────────────
export function trackBuyNow(productId: string, productName: string, precio: number) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'buy_now_clicked',
    ecommerce: {
      currency: 'DOP',
      value: precio,
      items: [{ item_id: productId, item_name: productName, price: precio, quantity: 1 }],
    },
  })
  if (window.fbq) {
    window.fbq('trackCustom', 'BuyNowClicked', {
      content_id: productId,
      content_name: productName,
      value: precio,
      currency: 'DOP',
    })
  }
}

// ── Evento: pantalla "Revisa tu pedido" vista ────────────────────────────
export function trackCheckoutReviewed(items: { id: string; nombre: string; precio: number }[], total: number) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'checkout_reviewed',
    ecommerce: {
      currency: 'DOP',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.nombre, price: i.precio })),
    },
  })
  if (window.fbq) {
    window.fbq('trackCustom', 'CheckoutReviewed', { value: total, currency: 'DOP', num_items: items.length })
  }
}

// ── Evento: redirect a AZUL ───────────────────────────────────────────────
export function trackAzulRedirect(orderNum: string, total: number) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'azul_redirect',
    order_number: orderNum,
    ecommerce: { currency: 'DOP', value: total },
  })
  if (window.fbq) {
    window.fbq('trackCustom', 'AzulRedirect', { order_number: orderNum, value: total, currency: 'DOP' })
  }
}

// ── Evento: clic en WhatsApp desde "No estoy seguro" ─────────────────────
export function trackWhatsappHelp(source: 'no_seguro' | 'pdp' | 'cart' | 'checkout') {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'whatsapp_help_clicked', source })
  if (window.fbq) {
    window.fbq('trackCustom', 'WhatsappHelp', { source })
  }
}
