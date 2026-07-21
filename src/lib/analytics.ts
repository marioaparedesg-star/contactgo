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

// ── Deduplicación Pixel + CAPI ────────────────────────────────────────────
// Meta necesita el MISMO event_id en el evento del navegador (Pixel) y en
// el evento del servidor (CAPI) para reconocerlos como el mismo evento y
// no contarlo dos veces. Sin esto, Meta reporta 0% de cobertura de
// deduplicación aunque ambos canales estén funcionando correctamente.
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function trackEcommerce(
  event: EcommerceEvent,
  data: { items: EcommerceItem[]; value?: number; transaction_id?: string; currency?: string },
  eventId?: string
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

  // Meta Pixel — eventID como 3er argumento habilita la deduplicación con CAPI
  const fbEvent = FB_MAP[event]
  if (fbEvent && window.fbq) {
    window.fbq('track', fbEvent, {
      content_ids: data.items.map(i => i.item_id),
      content_type: 'product',
      value,
      currency,
      num_items: data.items.length,
    }, eventId ? { eventID: eventId } : undefined)
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

// ── Evento: clic en WhatsApp (botón flotante, PDP, cart, etc.) ───────────
// Dispara el evento ESTÁNDAR "Contact" de Meta — permite que Ads Manager
// lo use directamente para optimización de campañas (a diferencia de un
// evento custom, que requiere configuración manual como conversión personalizada)
export function trackWhatsappHelp(source: 'no_seguro' | 'pdp' | 'cart' | 'checkout' | 'floating_button' | 'navbar' | 'footer') {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'whatsapp_contact_clicked', source })

  const eventId = generateEventId()

  if (window.fbq) {
    // Evento estándar — usable directamente en optimización de campañas de Meta
    window.fbq('track', 'Contact', { content_name: 'whatsapp_click', source }, { eventID: eventId })
  }

  // CAPI server-side — mismo eventId para que Meta lo deduplique con el del Pixel
  sendCAPI('Contact', { content_ids: [source] }, undefined, eventId)
}

// ── Facebook Conversions API (CAPI) — server-side duplicate ──────────────
// Envía eventos al servidor para que lleguen a Facebook sin depender del Pixel
// Funciona aunque las restricciones de categoría bloqueen el Pixel del browser
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

// _fbp es un cookie persistente que fbevents.js escribe de forma ASÍNCRONA
// (el script se carga con async=true). En la primera pageview de una sesión
// -sobre todo en clics desde un anuncio que caen directo a un PDP o a
// checkout- puede que AddToCart/InitiateCheckout disparen ANTES de que el
// script termine de cargar, y entonces _fbp/_fbc no existen todavía.
// Esto bajaba el Event Match Quality de esos dos eventos (solo ip+UA, sin
// fbp/fbc). Como sendCAPI ya es fire-and-forget (no bloquea la UI), esperamos
// un poco por _fbp antes de enviar.
async function waitForCookie(name: string, maxWaitMs = 1200, stepMs = 150): Promise<string | undefined> {
  let waited = 0
  let val = getCookie(name)
  while (!val && waited < maxWaitMs) {
    await new Promise(r => setTimeout(r, stepMs))
    waited += stepMs
    val = getCookie(name)
  }
  return val
}

// _fbc normalmente lo pone el Pixel a partir del parámetro ?fbclid= de la URL,
// pero si el script todavía no cargó podemos construirlo nosotros mismos con
// el mismo formato que usa Meta (fb.1.<timestamp>.<fbclid>) — no depende de
// que fbevents.js haya corrido, solo de la URL actual.
function getFbcFallback(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid')
    if (!fbclid) return undefined
    return `fb.1.${Date.now()}.${fbclid}`
  } catch {
    return undefined
  }
}

export async function sendCAPI(
  eventName: 'Purchase' | 'AddToCart' | 'InitiateCheckout' | 'ViewContent' | 'PageView' | 'Contact',
  eventData?: {
    value?: number
    currency?: string
    content_ids?: string[]
    content_type?: string
    content_name?: string
    content_category?: string
    num_items?: number
    order_id?: string
  },
  userData?: {
    email?: string
    phone?: string
    firstName?: string
    fbp?: string   // cookie _fbp
    fbc?: string   // cookie _fbc
  },
  eventId?: string  // MISMO id usado en fbq(...) del Pixel, para deduplicación
) {
  if (typeof window === 'undefined') return

  // Solo esperamos por _fbp/_fbc cuando el llamador no los pasó explícitamente
  // (evita esperar innecesariamente en eventos que sí traen su propio userData)
  const fbp = userData?.fbp ?? await waitForCookie('_fbp')
  const fbc = userData?.fbc ?? await waitForCookie('_fbc', 800, 100) ?? getFbcFallback()

  // external_id: identificador estable del visitante para mejorar Event Match Quality.
  // Usamos _fbp (que persiste entre sesiones) o generamos uno basado en sessionStorage.
  let externalId: string | undefined
  try {
    externalId = fbp ?? sessionStorage.getItem('cg_ext_id') ?? undefined
    if (!externalId) {
      externalId = 'cg_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('cg_ext_id', externalId)
    }
  } catch { /* SSR or private browsing */ }

  const mergedUserData = {
    fbp,
    fbc,
    external_id: externalId,
    ...userData,
  }

  try {
    await fetch('/api/fb-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, eventData, userData: mergedUserData, eventId }),
    })
  } catch {
    // CAPI es best-effort — no bloquear el flujo del usuario
  }
}
