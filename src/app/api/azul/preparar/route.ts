import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const BASE          = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
const MERCHANT_ID   = process.env.AZUL_MERCHANT_ID    ?? '39038540035'
const MERCHANT_NAME = process.env.AZUL_MERCHANT_NAME  ?? 'ContactGo'
const MERCHANT_TYPE = 'ECommerce'
const CURRENCY      = '$'
const AUTH_KEY      = process.env.AZUL_AUTH_KEY ?? ''
const AZUL_ENV      = process.env.AZUL_ENV ?? 'sandbox'

const AZUL_URL = AZUL_ENV === 'production'
  ? 'https://pagos.azul.com.do/PaymentPage/Default.aspx'
  : 'https://pruebas.azul.com.do/PaymentPage/'

export async function POST(req: NextRequest) {
  try {
    // Validar origin — solo desde contactgo.net
    const origin = req.headers.get('origin') ?? ''
    const allowed = ['https://contactgo.net', 'https://www.contactgo.net']
    if (origin && !allowed.includes(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    // Rate limit para pagos
    const guardErr = guardRequest(req, { limitPerMin: 30, requireOrigin: false })
    if (guardErr) return guardErr

    const body = await req.json()
    const { order_number, total } = body

    // Validar campos obligatorios
    if (!order_number || !total) {
      return NextResponse.json({ error: 'order_number y total son requeridos' }, { status: 400 })
    }
    if (isNaN(Number(total)) || Number(total) <= 0) {
      return NextResponse.json({ error: 'total inválido' }, { status: 400 })
    }

    const totalNum = Number(total)
    const amount   = String(Math.round(totalNum * 100)).padStart(3, '0')
    const itbisNum = Math.round((totalNum * 18 / 118) * 100)
    const itbis    = String(itbisNum).padStart(3, '0')

    const approvedUrl = `${BASE}/confirmacion?origen=azul&resultado=aprobado`
    const declinedUrl = `${BASE}/confirmacion?origen=azul&resultado=declinado`
    const cancelUrl   = `${BASE}/cart`
    const useCustom1 = '1', label1 = 'No. Orden', value1 = order_number
    const useCustom2 = '0', label2 = '', value2 = ''

    const raw = [MERCHANT_ID,MERCHANT_NAME,MERCHANT_TYPE,CURRENCY,
      order_number,amount,itbis,approvedUrl,declinedUrl,cancelUrl,
      useCustom1,label1,value1,useCustom2,label2,value2,AUTH_KEY].join('')

    let authHash = 'REQUIRES_AUTH_KEY'
    if (AUTH_KEY) {
      authHash = createHmac('sha512', AUTH_KEY)
        .update(Buffer.from(raw, 'utf16le')).digest('hex')
    }

    const fields: Record<string,string> = {
      MerchantId: MERCHANT_ID, MerchantName: MERCHANT_NAME,
      MerchantType: MERCHANT_TYPE, CurrencyCode: CURRENCY,
      OrderNumber: order_number, Amount: amount, ITBIS: itbis,
      ApprovedUrl: approvedUrl, DeclinedUrl: declinedUrl, CancelUrl: cancelUrl,
      UseCustomField1: useCustom1, CustomField1Label: label1, CustomField1Value: value1,
      UseCustomField2: useCustom2, CustomField2Label: label2, CustomField2Value: value2,
      ShowTransactionResult: '0', Locale: 'ES', SaveToDataVault: '1', AuthHash: authHash,
    }

    // No exponer MerchantId en sandbox si no hay auth key configurada
    if (!AUTH_KEY) {
      console.warn('[AZUL/preparar] Sin AUTH_KEY — modo test limitado')
      return NextResponse.json({ 
        error: 'Pasarela de pago en configuración. Usa pago contra entrega.',
        sandbox: true
      }, { status: 503 })
    }

    console.log('[AZUL/preparar]', { order_number, amount, itbis, env: AZUL_ENV })
    return NextResponse.json({ url: AZUL_URL, fields })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
