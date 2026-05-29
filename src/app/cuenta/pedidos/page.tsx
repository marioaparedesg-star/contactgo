import { redirect } from 'next/navigation'

// /cuenta/pedidos → /cuenta#pedidos (ancla directa a la sección de pedidos)
export default function PedidosPage() {
  redirect('/cuenta#pedidos')
}
