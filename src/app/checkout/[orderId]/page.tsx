import { redirect } from 'next/navigation'
export default async function CheckoutOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  redirect('/confirmacion?orden=' + orderId)
}
