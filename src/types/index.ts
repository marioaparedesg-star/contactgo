export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  nombre: string | null
  telefono: string | null
  email: string | null
  role: Role
  created_at: string
}

export interface Category {
  id: number
  nombre: string
  slug: string
  descripcion: string | null
}

export interface Product {
  id: string
  nombre: string
  descripcion: string | null
  marca: string | null
  precio: number
  costo: number
  stock: number
  categoria_id: number | null
  tipo: 'esferico' | 'torico' | 'multifocal' | 'color' | 'solucion' | 'gota' | null
  imagen_url: string | null
  activo: boolean
  sph_disponibles: number[]
  cyl_disponibles: number[]
  add_disponibles: string[]
  colores_disponibles: string[]
  categories?: Category
  // Campos extendidos de la BD
  slug?: string | null
  reemplazo?: string | null
  dias_uso?: number | null
  contenido?: string | null
  updated_at?: string | null
  precio_anterior?: number | null
  ojo?: string | null
  size?: string | null
  precio_final?: number | null
}

export interface Address {
  id: string
  user_id: string
  nombre: string
  direccion: string
  ciudad: string
  provincia: string | null
  telefono: string | null
  principal: boolean
}

export interface Prescription {
  id: string
  user_id: string
  od_sph: number | null
  od_cyl: number | null
  od_axis: number | null
  oi_sph: number | null
  oi_cyl: number | null
  oi_axis: number | null
  add_power: number | null
  imagen_url: string | null
  notas: string | null
  fecha: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
  sph: number | null
  cyl: number | null
  axis: number | null
  add_power: string | null  // texto: 'LOW'/'MID'/'HIGH' o '1.5' para ADD numérico
  products?: Product
}

export interface Order {
  id: string
  user_id: string | null
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado'
  subtotal: number
  envio: number
  descuento: number
  total: number
  metodo_pago: 'paypal' | 'transferencia' | 'tarjeta' | null
  pago_estado: 'pendiente' | 'verificado' | 'rechazado'
  pago_referencia: string | null
  direccion_texto: string | null
  notas_admin: string | null
  fecha: string
  order_items?: OrderItem[]
  profiles?: Profile
}

// Carrito (estado local con Zustand)
export interface CartItem {
  product: Product
  cantidad: number
  // ── Modo de compra ────────────────────────────────────
  ojo_mode: 'AMBOS' | 'OD' | 'OI' | null  // reemplaza 'ojo' legacy
  misma_receta?: boolean          // solo aplica cuando ojo_mode='AMBOS'
  // ── Receta única (OD solo, OI solo, o AMBOS+mismaReceta) ──
  sph?: number | null
  cyl?: number | null
  axis?: number | null
  add_power?: string | null
  // ── Receta diferente por ojo (AMBOS+mismaReceta=false) ────
  sph_od?: number | null
  sph_oi?: number | null
  cyl_od?: number | null
  cyl_oi?: number | null
  axis_od?: number | null
  axis_oi?: number | null
  // ── Otros ─────────────────────────────────────────────
  color?: string | null
  size?: string | null
  precio_final?: number | null
  precio_original?: number | null
  suscripcion?: string | null
  // Legacy — no usar en nuevo código
  ojo?: string | null
}

// Análisis de receta
export interface PrescriptionAnalysis {
  condicion: string[]
  recomendacion: 'esferico' | 'torico' | 'multifocal'
  descripcion: string
}
