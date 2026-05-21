// GET /api/azul-logs
// Endpoint para certificación técnica AZUL — requiere Bearer token
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { guardRequest } from '@/lib/api-guard'

export async function GET(req: NextRequest) {
  // Rate limit anti-abuse
  const guardErr = guardRequest(req, { limitPerMin: 60, requireOrigin: false })
  if (guardErr) return guardErr

  // ─── Auth: Bearer header O query param ?token=XXX ────────────
  const auth    = req.headers.get('authorization') ?? ''
  const qToken  = req.nextUrl.searchParams.get('token') ?? ''
  const token   = process.env.AZUL_LOGS_TOKEN ?? ''

  const isAuthorized = token && (
    auth === `Bearer ${token}` || qToken === token
  )
  
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'No autorizado. Endpoint de certificación técnica.' },
      { 
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer realm="ContactGo AZUL Logs"' }
      }
    )
  }

  // ─── Datos de certificación (solo con token válido) ───────────
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
  const MERCHANT_ID  = process.env.AZUL_MERCHANT_ID  ?? '39038540035'
  const ORDER_NUM = `CG-TEST-${Date.now()}`
  const AMOUNT = '500000'
  const ITBIS = '076271'
  const APPROVED = `${BASE_URL}/confirmacion?origen=azul&resultado=aprobado`
  const DECLINED  = `${BASE_URL}/confirmacion?origen=azul&resultado=declinado`
  const CANCEL    = `${BASE_URL}/cart`
  const AUTH_KEY  = process.env.AZUL_AUTH_KEY ?? ''

  let authHash = 'REQUIRES_AUTH_KEY_FROM_AZUL'
  if (AUTH_KEY && AUTH_KEY !== 'REQUIRES_AUTH_KEY_FROM_AZUL') {
    const raw = [
      MERCHANT_ID, 'ContactGo', 'ECommerce', '$',
      ORDER_NUM, AMOUNT, ITBIS, APPROVED, DECLINED, CANCEL,
      '1', '', '', '0', '', ''
    ].join('')
    const keyBuf  = Buffer.from(AUTH_KEY, 'utf16le')
    const dataBuf = Buffer.from(raw, 'utf16le')
    authHash = createHmac('sha512', keyBuf).update(dataBuf).digest('hex').toUpperCase()
  }

  const paymentUrl = process.env.AZUL_PAYMENT_URL ?? 'https://pruebas.azul.com.do/PaymentPage/'

  return NextResponse.json({
    status: AUTH_KEY ? 'PRODUCTION_READY' : 'SANDBOX_MODE',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    payment_url: paymentUrl,
    form_fields: {
      MerchantId:      MERCHANT_ID,
      MerchantName:    'ContactGo',
      MerchantType:    'ECommerce',
      CurrencyCode:    '$',
      OrderNumber:     ORDER_NUM,
      Amount:          AMOUNT,
      ITBIS:           ITBIS,
      ApprovedUrl:     APPROVED,
      DeclinedUrl:     DECLINED,
      CancelUrl:       CANCEL,
      UseCustomField1: '1',
      CustomField1Label: '',
      CustomField1Value: '',
      UseCustomField2: '0',
      CustomField2Label: '',
      CustomField2Value: '',
      UseGooglePay:    '1',
      AuthHash:        authHash,
    },
    notes: {
      amount_dop: 'RD$5,000.00',
      itbis_pct: '18%',
      hash_algo: 'HMAC-SHA512 UTF-16LE',
      auth_key_status: AUTH_KEY ? 'CONFIGURADO' : 'PENDIENTE',
    }
  }, {
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': 'https://www.contactgo.net',
    }
  })
}
