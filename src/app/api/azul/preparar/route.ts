import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createClient } from '@supabase/supabase-js'

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

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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
    const { order_number, approved_url } = body
    // SEGURIDAD: NO confiar en el total del frontend — obtener de Supabase

    // Validar campo obligatorio
    if (!order_number) {
      return NextResponse.json({ error: 'order_number es requerido' }, { status: 400 })
    }

    // Sin credenciales reales, no podemos procesar pagos con tarjeta
    if (!AUTH_KEY) {
      return NextResponse.json({
        error: 'Pago con tarjeta no disponible. Configura las credenciales AZUL.',
        sandbox: true,
        pending_credentials: true
      }, { status: 503 })
    }

    // SEGURIDAD: Consultar el total REAL desde Supabase — nunca confiar en el frontend
    const sb = getSb()
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .select('id, total, pago_estado, metodo_pago, estado')
      .eq('numero_orden', order_number)
      .single()

    if (orderErr || !order) {
      console.error('[AZUL/preparar] orden no encontrada:', order_number, orderErr?.message)
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Validar que la orden esté en estado válido para pago
    if (order.metodo_pago !== 'tarjeta') {
      return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 })
    }
    if (order.pago_estado !== 'pendiente') {
      return NextResponse.json({ error: 'Esta orden ya fue procesada' }, { status: 409 })
    }
    if (!order.total || Number(order.total) <= 0) {
      return NextResponse.json({ error: 'Total de orden inválido' }, { status: 400 })
    }

    // Usar el total REAL de la orden desde la DB
    const totalNum = Number(order.total)
    const amount   = String(Math.round(totalNum * 100)).padStart(3, '0')
    // ITBIS 18% incluido en el precio (precio final incluye ITBIS)
    const itbisNum = Math.round((totalNum * 18 / 118) * 100)
    const itbis    = String(itbisNum).padStart(3, '0')

    // Validar approved_url — solo permitir dominios ContactGo
    const allowedUrlPrefixes = [
      `${BASE}/`,
      'https://contactgo.net/',
      'http://localhost:3000/',
    ]
    let approvedUrl = approved_url ?? `${BASE}/api/azul/retorno?resultado=aprobado`
    const isAllowedUrl = allowedUrlPrefixes.some(prefix => approvedUrl.startsWith(prefix))
    if (!isAllowedUrl) {
      // URL no permitida — usar la default segura
      approvedUrl = `${BASE}/api/azul/retorno?resultado=aprobado`
    }

    const declinedUrl = `${BASE}/api/azul/retorno?resultado=declinado`
    const cancelUrl   = `${BASE}/checkout`
    const useCustom1 = '1', label1 = 'No. Orden', value1 = order_number
    const useCustom2 = '0', label2 = '', value2 = ''

    const raw = [MERCHANT_ID,MERCHANT_NAME,MERCHANT_TYPE,CURRENCY,
      order_number,amount,itbis,approvedUrl,declinedUrl,cancelUrl,
      useCustom1,label1,value1,useCustom2,label2,value2,AUTH_KEY].join('')

    const authHash = createHmac('sha512', AUTH_KEY)
      .update(raw, 'utf8').digest('hex')

    const fields: Record<string,string> = {
      MerchantId:        MERCHANT_ID,
      TrxType:           'Sale',
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
      AuthHash:          authHash,
    }

    if (process.env.NODE_ENV !== 'production') console.log('[AZUL/preparar] OK:', {
      order_number,
      total_db: totalNum,
      amount,
      itbis,
      env: AZUL_ENV
    })

    return NextResponse.json({ url: AZUL_URL, fields })
  } catch (err: any) {
    console.error('[AZUL/preparar] excepción:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
