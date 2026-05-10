import { redirect } from 'next/navigation'
export default function CheckoutOrderPage({ params }: { params: { orderId: string } }) {
  redirect('/confirmacion?orden=' + params.orderId)
}
