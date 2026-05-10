'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import { Suspense } from 'react'

function AzulRetornoContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading'|'approved'|'declined'|'cancelled'>('loading')
  const [orderId, setOrderId] = useState<string|null>(null)

  useEffect(() => {
    const isoCode       = params.get('IsoCode') ?? ''
    const responseCode  = params.get('ResponseCode') ?? ''
    const orderNumber   = params.get('OrderNumber') ?? ''
    const authCode      = params.get('AuthorizationCode') ?? ''
    const amount        = params.get('Amount') ?? ''
    const dateTime      = params.get('DateTime') ?? ''
    const responseMsg   = params.get('ResponseMessage') ?? ''
    const errorDesc     = params.get('ErrorDescription') ?? ''
    const rrn           = params.get('RRN') ?? ''
    const authHash      = params.get('AuthHash') ?? ''
    const azulOrderId   = params.get('AzulOrderId') ?? ''

    if (!orderNumber) { setStatus('cancelled'); return }

    // Verificar hash y actualizar orden en Supabase
    fetch('/api/azul-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ OrderNumber: orderNumber, Amount: amount, AuthorizationCode: authCode,
        DateTime: dateTime, ResponseCode: responseCode, IsoCode: isoCode,
        ResponseMessage: responseMsg, ErrorDescription: errorDesc, RRN: rrn, AuthHash: authHash })
    })
    .then(r => r.json())
    .then(async ({ valid }) => {
      const sb = createClient()
      const approved = isoCode === '00' && valid

      // Actualizar la orden en Supabase
      await sb.from('orders')
        .update({
          pago_estado:    approved ? 'verificado' : 'rechazado',
          pago_referencia: authCode,
          estado:          approved ? 'confirmado' : 'cancelado',
          azul_order_id:   azulOrderId,
          azul_rrn:        rrn,
        })
        .eq('azul_order_number', orderNumber)

      // Obtener el ID interno de la orden para redirigir
      const { data: order } = await sb.from('orders')
        .select('id')
        .eq('azul_order_number', orderNumber)
        .single()

      if (order) {
        setOrderId(order.id)
        if (approved) {
          fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: order.id, evento: 'nuevo_pedido' })
          }).catch(console.error)
        }
      }
      setStatus(approved ? 'approved' : 'declined')
    })
    .catch(() => setStatus('declined'))
  }, [])

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500">Verificando tu pago...</p>
      </div>
    </div>
  )

  return (
    <main className="max-w-lg mx-auto px-4 py-16 pb-24 text-center">
      {status === 'approved' ? (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">¡Pago aprobado!</h1>
          <p className="text-gray-500 mb-8">Tu pago con tarjeta fue procesado exitosamente.</p>
          <div className="flex flex-col gap-3">
            {orderId && (
              <Link href={`/confirmacion?orden=${orderId}`} className="bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                Ver mi pedido
              </Link>
            )}
            <Link href="/catalogo" className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
              Seguir comprando
            </Link>
          </div>
        </>
      ) : status === 'declined' ? (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Pago no procesado</h1>
          <p className="text-gray-500 mb-8">Tu tarjeta no pudo ser procesada. Puedes intentar con otro método de pago.</p>
          <div className="flex flex-col gap-3">
            <Link href="/checkout" className="bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Intentar de nuevo
            </Link>
            <Link href="/catalogo" className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
              Volver al catálogo
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">↩️</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Pago cancelado</h1>
          <p className="text-gray-500 mb-8">Cancelaste el proceso de pago. Tu carrito sigue guardado.</p>
          <Link href="/checkout" className="bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors block">
            Volver al checkout
          </Link>
        </>
      )}
    </main>
  )
}

export default function AzulRetornoPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>}>
        <AzulRetornoContent />
      </Suspense>
      <Footer />
    </>
  )
}
