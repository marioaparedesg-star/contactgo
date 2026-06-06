import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Carrito de Compras | ContactGo',
  description: 'Tu carrito de lentes de contacto. Revisa tu pedido y procede al pago seguro con AZUL.',
  robots: 'noindex',
}
export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
