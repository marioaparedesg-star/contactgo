import { NextRequest, NextResponse } from 'next/server';

const AZUL_BASE_URL = 'https://sandbox.azul.com.do'; // Cambia a https://pagos.azul.com.do cuando vayas a producción

export async function POST(req: NextRequest) {
  try {
    const { orderId, total, customerEmail, customerName } = await req.json();

    const formData = new URLSearchParams({
      MerchantId: process.env.AZUL_MERCHANT_ID!,
      MerchantName: "ContactGo",
      MerchantType: "0",
      CurrencyCode: "DOP",
      OrderNumber: orderId.toString(),
      Amount: Number(total).toFixed(2),
      ITBIS: "0",
      ApprovedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${orderId}`,
      DeclinedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/error?orderId=${orderId}`,
      CancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/carrito`,
      CustomerEmail: customerEmail || '',
      CustomerName: customerName || '',
      Use3DSecure: "1",
    });

    const response = await fetch(`${AZUL_BASE_URL}/WebServices/TPG/TPG.svc/Process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'AuthHash': process.env.AZUL_AUTH_KEY!,
      },
      body: formData.toString(),
    });

    const html = await response.text();

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error conectando con Azul' }, { status: 500 });
  }
}
