import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const BASE          = 'https://www.contactgo.net'
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
    const { order_number, total, approved_url } = body

    // Validar campos obligatorios
    if (!order_number || !total) {
      return NextResponse.json({ error: 'order_number y total son requeridos' }, { status: 400 })
    }
    if (isNaN(Number(total)) || Number(total) <= 0) {
      return NextResponse.json({ error: 'total inválido' }, { status: 400 })
    }

    const totalNum = Number(total)
    const amount   = String(Math.round(totalNum * 100)).padStart(3, '0')
    // ITBIS: en el ejemplo oficial de AZUL sandbox usan "000"
    // En producción calcular 18/118 del total
    const isProduction = process.env.AZUL_ENV === 'production'
    const itbisNum = isProduction ? Math.round((totalNum * 18 / 118) * 100) : 0
    const itbis    = String(itbisNum).padStart(3, '0')

    // Usar la URL exacta del cliente (incluye orden=ID) para que el hash coincida
    const approvedUrl = approved_url ?? `${BASE}/confirmacion?origen=azul&resultado=aprobado`
    const declinedUrl = `${BASE}/api/azul/retorno?resultado=declinado`
    const cancelUrl   = `${BASE}/checkout`
    const useCustom1 = '1', label1 = 'No. Orden', value1 = order_number
    const useCustom2 = '0', label2 = '', value2 = ''

    const raw = [MERCHANT_ID,MERCHANT_NAME,MERCHANT_TYPE,CURRENCY,
      order_number,amount,itbis,approvedUrl,declinedUrl,cancelUrl,
      useCustom1,label1,value1,useCustom2,label2,value2,AUTH_KEY].join('')

    let authHash = 'REQUIRES_AUTH_KEY'
    if (AUTH_KEY) {
      authHash = createHmac('sha512', AUTH_KEY)
        .update(raw, 'utf8').digest('hex')
    }

    const fields: Record<string,string> = {
      MerchantId:        MERCHANT_ID,
      TrxType:           'Sale',        // requerido por AZUL, NO va en el hash
      MerchantName:      MERCHANT_NAME,
      MerchantType:      MERCHANT_TYPE,
      CurrencyCode:      CURRENCY,
      OrderNumber:       order_number,
      Amount:            amount,
      ITBIS:             itbis,
      ApprovedUrl:       approvedUrl,
      DeclinedUrl:       declinedUrl,
      CancelUrl:         cancelUrl,
      UseCustomField1:   useCustom1,
      CustomField1Label: label1,
      CustomField1Value: value1,
      UseCustomField2:   useCustom2,
      CustomField2Label: label2,
      CustomField2Value: value2,
      ShowTransactionResult: '0',
      Locale:            'ES',
      // SaveToDataVault eliminado — puede causar error si no está habilitado en sandbox
      AuthHash:          authHash,
    }

    // No exponer MerchantId en sandbox si no hay auth key configurada
    if (!AUTH_KEY) {
      console.warn('[AZUL/preparar] Sin AUTH_KEY — modo sandbox')
      // Sin credenciales reales, no podemos procesar pagos con tarjeta
      return NextResponse.json({ 
        error: 'Pago con tarjeta no disponible. Usa pago contra entrega.',
        sandbox: true,
        pending_credentials: true
      }, { status: 503 })
    }

    console.log('[AZUL/preparar] campos hash:', { 
      order_number, amount, itbis, 
      approvedUrl: approvedUrl.slice(0,60),
      declinedUrl: declinedUrl.slice(0,60),
      cancelUrl,
      useCustom1, label1, value1: value1.slice(0,15),
      useCustom2,
      hash_preview: authHash.slice(0,20),
      env: AZUL_ENV 
    })
    return NextResponse.json({ url: AZUL_URL, fields })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
