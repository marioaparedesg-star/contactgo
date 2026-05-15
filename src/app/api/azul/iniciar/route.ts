// POST /api/azul/iniciar
// Genera los campos del formulario POST para AZUL Payment Page
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
const MERCHANT_ID   = process.env.AZUL_MERCHANT_ID   ?? '39038540035'
const MERCHANT_NAME = process.env.AZUL_MERCHANT_NAME ?? 'ContactGo'
const MERCHANT_TYPE = 'ECommerce'
const CURRENCY      = '$'
const AUTH_KEY      = process.env.AZUL_AUTH_KEY ?? ''
const AZUL_ENV      = process.env.AZUL_ENV ?? 'sandbox'

const AZUL_URL = AZUL_ENV === 'production'
  ? 'https://pagos.azul.com.do/PaymentPage/Default.aspx'
  : 'https://pruebas.azul.com.do/PaymentPage/'

export async function POST(req: NextRequest) {
  try {
    const { order_id, total } = await req.json()

    // Obtener datos de la orden
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: order } = await sb.from('orders').select('*').eq('id', order_id).single()
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const orderNumber = `CG-${order_id.substring(0, 8).toUpperCase()}`
    
    // Amount en centavos sin punto: RD$7,360 → 736000
    const totalNum = total ?? order.total ?? 0
    const amount   = String(Math.round(totalNum * 100)).padStart(2, '0')
    
    // ITBIS 18% del total (18/118 del total con impuesto incluido)
    const itbisNum = Math.round((totalNum * 18 / 118) * 100)
    const itbis    = String(itbisNum).padStart(3, '0')

    const approvedUrl = `${BASE}/confirmacion?orden=${order_id}&origen=azul&resultado=aprobado`
    const declinedUrl = `${BASE}/confirmacion?origen=azul&resultado=declinado`
    const cancelUrl   = `${BASE}/cart`

    const useCustom1 = '1'
    const label1     = 'No. Orden'
    const value1     = orderNumber
    const useCustom2 = '0'
    const label2     = ''
    const value2     = ''

    // Generar AuthHash HMAC-SHA512 Unicode (UTF-16LE) según spec AZUL
    const raw = [
      MERCHANT_ID, MERCHANT_NAME, MERCHANT_TYPE, CURRENCY,
      orderNumber, amount, itbis,
      approvedUrl, declinedUrl, cancelUrl,
      useCustom1, label1, value1,
      useCustom2, label2, value2,
      AUTH_KEY
    ].join('')

    let authHash = 'REQUIRES_AZUL_AUTH_KEY'
    if (AUTH_KEY) {
      const utf16 = Buffer.from(raw, 'utf16le')
      authHash = createHmac('sha512', AUTH_KEY).update(utf16).digest('hex')
    }

    // Guardar order number en la DB
    await sb.from('orders').update({ numero_orden: orderNumber }).eq('id', order_id)

    const fields: Record<string, string> = {
      MerchantId:        MERCHANT_ID,
      MerchantName:      MERCHANT_NAME,
      MerchantType:      MERCHANT_TYPE,
      CurrencyCode:      CURRENCY,
      OrderNumber:       orderNumber,
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
      SaveToDataVault:   '1',
      AuthHash:          authHash,
    }

    // Log para AZUL
    console.log('[AZUL/iniciar]', {
      order_id, orderNumber, amount, itbis, currency: CURRENCY,
      environment: AZUL_ENV, hash_generated: !!AUTH_KEY,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ url: AZUL_URL, fields })
  } catch (err: any) {
    console.error('[AZUL/iniciar] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
