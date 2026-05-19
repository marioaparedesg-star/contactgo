import { guardRequest } from '@/lib/api-guard'
// GET /api/azul-logs
// Endpoint público para certificación técnica AZUL — solo muestra parámetros del formulario
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function GET(req: NextRequest) {
  // Rate limit anti-abuse — público pero limitado
  const guardErr = guardRequest(req, { limitPerMin: 60, requireOrigin: false })
  if (guardErr) return guardErr

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
  const MERCHANT_ID  = process.env.AZUL_MERCHANT_ID  ?? '39038540035'
  const MERCHANT_NAME = 'ContactGo'
  const MERCHANT_TYPE = 'ECommerce'
  const CURRENCY = '$'
  const ORDER_NUM = `CG-TEST-${Date.now()}`
  const AMOUNT = '500000'   // RD$5,000.00 (en centavos sin punto)
  const ITBIS = '076271'    // 18% de 500000 = 90000, en centavos
  const APPROVED = `${BASE_URL}/confirmacion?origen=azul&resultado=aprobado`
  const DECLINED  = `${BASE_URL}/confirmacion?origen=azul&resultado=declinado`
  const CANCEL    = `${BASE_URL}/cart`
  const AUTH_KEY  = process.env.AZUL_AUTH_KEY ?? 'PENDIENTE_CREDENCIALES'

  // Generar AuthHash según especificación AZUL (HMAC SHA-512 UTF-16LE)
  let authHash = 'REQUIRES_AUTH_KEY_FROM_AZUL'
  if (AUTH_KEY && AUTH_KEY !== 'PENDIENTE_CREDENCIALES') {
    const raw = [
      MERCHANT_ID, MERCHANT_NAME, MERCHANT_TYPE, CURRENCY,
      ORDER_NUM, AMOUNT, ITBIS, APPROVED, DECLINED, CANCEL,
      '1' // UseCustomField1
    ].join('')
    const keyBuf  = Buffer.from(AUTH_KEY, 'utf16le')
    const dataBuf = Buffer.from(raw, 'utf16le')
    authHash = createHmac('sha512', keyBuf).update(dataBuf).digest('hex').toUpperCase()
  }

  const paymentUrl = process.env.AZUL_PAYMENT_URL ?? 'https://pruebas.azul.com.do/PaymentPage/'

  return NextResponse.json({
    status: 'SANDBOX_MODE',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    payment_url: paymentUrl,
    form_fields: {
      MerchantId:    MERCHANT_ID,
      MerchantName:  MERCHANT_NAME,
      MerchantType:  MERCHANT_TYPE,
      CurrencyCode:  CURRENCY,
      OrderNumber:   ORDER_NUM,
      Amount:        AMOUNT,
      ITBIS:         ITBIS,
      ApprovedUrl:   APPROVED,
      DeclinedUrl:   DECLINED,
      CancelUrl:     CANCEL,
      UseCustomField1: '1',
      UseCustomField2: '0',
      CustomField2Label: '',
      CustomField2Value: '',
      UseGooglePay: '1',
      AuthHash:      authHash,
    },
    notes: {
      amount_dop: 'RD$5,000.00',
      itbis_pct: '18%',
      hash_algo: 'HMAC-SHA512 UTF-16LE',
      auth_key_status: AUTH_KEY === 'PENDIENTE_CREDENCIALES' 
        ? 'PENDIENTE — Esperando credenciales de AZUL (fparedes@azul.com.do)'
        : 'CONFIGURADO'
    }
  }, {
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
