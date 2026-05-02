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
  add_power: number | null
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
  metodo_pago: 'paypal' | 'transferencia' | 'contra_entrega' | null
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
  sph?: number | null
  cyl?: number | null
  axis?: number | null
  add_power?: string | null
  color?: string | null
}

// Análisis de receta
export interface PrescriptionAnalysis {
  condicion: string[]
  recomendacion: 'esferico' | 'torico' | 'multifocal'
  descripcion: string
}
