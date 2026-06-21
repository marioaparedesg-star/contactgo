import { redirect } from 'next/navigation'

// /carrito redirige a /cart (URL canónica)
export default function CarritoPage() {
  redirect('/cart')
}
