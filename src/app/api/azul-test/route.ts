// GET /api/azul-test — solo disponible en sandbox
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const AZUL_ENV       = process.env.AZUL_ENV ?? 'sandbox'
const AZUL_URL       = AZUL_ENV === 'production'
  ? 'https://pagos.azul.com.do/PaymentPage/Default.aspx'
  : 'https://pruebas.azul.com.do/PaymentPage/'
const BASE           = 'https://www.contactgo.net'
const MERCHANT_ID    = process.env.AZUL_MERCHANT_ID    ?? '39038540035'
const MERCHANT_NAME  = process.env.AZUL_MERCHANT_NAME  ?? 'ContactGo'
const AUTH_KEY       = process.env.AZUL_AUTH_KEY       ?? ''

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  // Bloquear completamente en producción
  if (AZUL_ENV === 'production') {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 404 })
  }

  // Verificar secret
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const simular = req.nextUrl.searchParams.get('simular')

  // Simular retorno aprobado
  if (simular === 'retorno') {
    const orderNum = req.nextUrl.searchParams.get('order') ?? ''
    const params = new URLSearchParams({
      OrderNumber:       orderNum,
      Amount:            '95000',
      AuthorizationCode: 'SIMTEST',
      DateTime:          new Date().toISOString().replace(/\D/g, '').slice(0, 14),
      ResponseCode:      'ISO8583',
      IsoCode:           '00',
      ResponseMessage:   'APROBADA',
      ErrorDescription:  '',
      RRN:               `SIM${Date.now()}`,
      AzulOrderId:       `SIM${Date.now()}`,
    })
    return NextResponse.redirect(`${BASE}/api/azul/retorno?${params}`)
  }

  // Crear orden de prueba y redirigir a AZUL sandbox
  const { createHmac } = await import('crypto')
  const orderNum   = `CG-TEST${Date.now().toString().slice(-8)}`
  const amount     = '95000'
  const itbis      = '14517'
  const approvedUrl = `${BASE}/api/azul/retorno?resultado=aprobado`
  const declinedUrl = `${BASE}/api/azul/retorno?resultado=declinado`
  const cancelUrl   = `${BASE}/checkout`

  const sb = getSb()
  await sb.from('orders').insert({
    numero_orden:     orderNum,
    cliente_nombre:   'TEST SANDBOX',
    cliente_email:    'test@sandbox.com',
    total:            950,
    subtotal:         950,
    envio:            0,
    estado:           'pendiente',
    metodo_pago:      'tarjeta',
    pago_estado:      'pendiente',
    items_count:      1,
  })

  const raw = [
    MERCHANT_ID, MERCHANT_NAME, 'ECommerce', '$', orderNum,
    amount, itbis, approvedUrl, declinedUrl, cancelUrl,
    '1', 'No. Orden', orderNum, '0', '', '', AUTH_KEY,
  ].join('')

  const authHash = createHmac('sha512', AUTH_KEY).update(raw, 'utf8').digest('hex')

  const fields: Record<string, string> = {
    MerchantId: MERCHANT_ID, TrxType: 'Sale', MerchantName: MERCHANT_NAME,
    MerchantType: 'ECommerce', CurrencyCode: '$', OrderNumber: orderNum,
    Amount: amount, ITBIS: itbis, ApprovedUrl: approvedUrl,
    DeclinedUrl: declinedUrl, CancelUrl: cancelUrl,
    UseCustomField1: '1', CustomField1Label: 'No. Orden', CustomField1Value: orderNum,
    UseCustomField2: '0', CustomField2Label: '', CustomField2Value: '',
    ShowTransactionResult: '0', Locale: 'ES', AuthHash: authHash,
  }

  const simUrl = `${BASE}/api/azul-test?secret=${secret}&simular=retorno&order=${orderNum}`

  return new NextResponse(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>AZUL Sandbox Test — ContactGo</title>
<style>body{font-family:monospace;padding:2rem;background:#0f172a;color:#e2e8f0}
.card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:1.5rem;max-width:600px}
h2{color:#38bdf8;margin:0 0 1rem}p{margin:0.25rem 0;font-size:0.85rem}
.btn{display:inline-block;padding:.75rem 1.5rem;border-radius:6px;border:none;cursor:pointer;font-weight:700;margin:.5rem .5rem 0 0;font-size:1rem}
.green{background:#16a34a;color:#fff}.blue{background:#2563eb;color:#fff}
form{display:inline}</style></head>
<body><div class="card"><h2>🧪 AZUL Sandbox — ${MERCHANT_NAME}</h2>
<p>Order: <strong>${orderNum}</strong></p>
<p>Amount: RD$950.00 | ITBIS: RD$145.17</p>
<p>Env: <strong>${AZUL_ENV}</strong></p>
<hr style="border-color:#334155;margin:1rem 0">
<a href="${simUrl}" class="btn green">✅ Simular retorno APROBADO</a>
<form method="POST" action="${AZUL_URL}">
${Object.entries(fields).map(([k,v]) => `<input type="hidden" name="${k}" value="${v}">`).join('')}
<button type="submit" class="btn blue">🔵 Portal AZUL sandbox →</button>
</form>
</div></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
