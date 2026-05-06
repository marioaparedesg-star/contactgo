import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { orderId, amount } = await req.json()

    const AZUL_URL = process.env.AZUL_URL!
    const MERCHANT_ID = process.env.AZUL_MERCHANT_ID!
    const AUTH_KEY = process.env.AZUL_AUTH_KEY!

    const formData = new URLSearchParams()

    formData.append('MerchantId', MERCHANT_ID)
    formData.append('OrderNumber', orderId)
    formData.append('Amount', amount.toString())
    formData.append('Currency', 'DOP')
    formData.append('ITBIS', '0')
    formData.append('ResponseUrl', `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`)

    const response = await fetch(`${AZUL_URL}/WebServices/TPG/TPG.svc/Process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'AuthHash': AUTH_KEY,
      },
      body: formData.toString(),
    })

    const html = await response.text()

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error Azul' }, { status: 500 })
  }
}
