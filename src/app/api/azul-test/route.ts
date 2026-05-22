// GET /api/azul-test?secret=xxx
// Endpoint de prueba AZUL: crea una orden real en DB y lanza el formulario hacia sandbox
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const BASE          = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
const MERCHANT_ID   = process.env.AZUL_MERCHANT_ID   ?? '39038540035'
const MERCHANT_NAME = process.env.AZUL_MERCHANT_NAME ?? 'ContactGo'
const AUTH_KEY      = process.env.AZUL_AUTH_KEY      ?? ''
const AZUL_ENV      = process.env.AZUL_ENV           ?? 'sandbox'
const AZUL_URL      = AZUL_ENV === 'production'
  ? 'https://pagos.azul.com.do/PaymentPage/Default.aspx'
  : 'https://pruebas.azul.com.do/PaymentPage/'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== (process.env.CRON_SECRET ?? 'contactgo2026')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const simular = req.nextUrl.searchParams.get('simular') // ?simular=retorno para simular retorno sin pasar por AZUL

  // ── Simular retorno AZUL directo (sin pasar por portal) ─────────────────────
  if (simular === 'retorno') {
    const orderNum = req.nextUrl.searchParams.get('order') ?? ''
    if (!orderNum) return NextResponse.json({ error: 'Falta ?order=CG-xxx' })
    
    // Construir URL igual a como la devolvería AZUL
    const retornoUrl = new URL(`${BASE}/api/azul/retorno`)
    retornoUrl.searchParams.set('resultado',        'aprobado')
    retornoUrl.searchParams.set('OrderNumber',      orderNum)
    retornoUrl.searchParams.set('Amount',           '100000')
    retornoUrl.searchParams.set('AuthorizationCode','SIMTEST')
    retornoUrl.searchParams.set('DateTime',         new Date().toISOString())
    retornoUrl.searchParams.set('ResponseCode',     'ISO8583')
    retornoUrl.searchParams.set('IsoCode',          '00')
    retornoUrl.searchParams.set('ResponseMessage',  'APROBADA')
    retornoUrl.searchParams.set('ErrorDescription', '')
    retornoUrl.searchParams.set('RRN',              `SIM${Date.now()}`)
    retornoUrl.searchParams.set('AzulOrderId',      `AZUL${Date.now()}`)
    
    return NextResponse.redirect(retornoUrl.toString())
  }

  // ── Crear una orden de prueba real en Supabase ────────────────────────────
  const orderNum = `CG-TEST${Date.now().toString().slice(-8)}`
  const totalNum  = 1000  // RD$10.00 (mínimo para prueba)
  const amount    = String(Math.round(totalNum * 100)).padStart(3, '0')
  const itbis     = '000'  // sandbox: siempre 000

  const { data: order, error: orderErr } = await sb.from('orders').insert({
    cliente_nombre:  'Prueba AZUL Sandbox',
    cliente_email:   'test@contactgo.net',
    cliente_telefono:'8095550000',
    direccion_texto: 'Dirección de prueba, Santo Domingo',
    estado:          'pendiente',
    subtotal:        totalNum,
    envio:           0,
    total:           totalNum,
    metodo_pago:     'tarjeta',
    pago_estado:     'pendiente',
    numero_orden:    orderNum,
    ciudad:          'Santo Domingo',
  }).select().single()

  if (orderErr || !order) {
    return NextResponse.json({ error: 'No se pudo crear orden de prueba', detail: orderErr?.message })
  }

  // ── Calcular AuthHash (igual que preparar/route.ts — UTF-8) ──────────────
  const MERCHANT_TYPE  = 'ECommerce'
  const CURRENCY       = '$'
  const approvedUrl    = `${BASE}/api/azul/retorno?resultado=aprobado`
  const declinedUrl    = `${BASE}/api/azul/retorno?resultado=declinado`
  const cancelUrl      = `${BASE}/checkout`
  const useCustom1 = '1', label1 = 'No. Orden', value1 = orderNum
  const useCustom2 = '0', label2 = '', value2 = ''

  const raw = [
    MERCHANT_ID, MERCHANT_NAME, MERCHANT_TYPE, CURRENCY,
    orderNum, amount, itbis,
    approvedUrl, declinedUrl, cancelUrl,
    useCustom1, label1, value1,
    useCustom2, label2, value2,
    AUTH_KEY
  ].join('')

  let authHash = 'REQUIRES_AUTH_KEY'
  if (AUTH_KEY) {
    authHash = createHmac('sha512', AUTH_KEY).update(raw, 'utf8').digest('hex')
  }

  const simRetornoUrl = `${BASE}/api/azul-test?secret=${secret}&simular=retorno&order=${orderNum}`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ContactGo — Prueba AZUL</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;padding:20px;background:#f9fafb;}
    .card{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin-bottom:16px;}
    h2{color:#1d4ed8;margin-bottom:8px;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    td{padding:5px 10px;border-bottom:1px solid #f0f0f0;}
    td:first-child{font-weight:700;color:#555;width:180px;}
    .btn{display:block;text-align:center;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;width:100%;margin-top:10px;border:none;text-decoration:none;}
    .btn-azul{background:#1d4ed8;color:white;}
    .btn-sim{background:#059669;color:white;}
    .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;}
    .sandbox{background:#fef3c7;color:#92400e;}
    pre{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;font-size:10px;overflow:auto;max-height:200px;}
  </style>
</head>
<body>
  <div class="card">
    <h2>🔵 ContactGo — Prueba AZUL <span class="badge sandbox">${AZUL_ENV.toUpperCase()}</span></h2>
    <p style="color:#6b7280;font-size:13px;">Orden de prueba creada: <strong>${orderNum}</strong> | ID: <code>${order.id.slice(0,8)}...</code></p>
    
    <table>
      <tr><td>MerchantID</td><td>${MERCHANT_ID}</td></tr>
      <tr><td>MerchantName</td><td>${MERCHANT_NAME}</td></tr>
      <tr><td>OrderNumber</td><td>${orderNum}</td></tr>
      <tr><td>Amount</td><td>${amount} → RD$${totalNum.toLocaleString()}</td></tr>
      <tr><td>ITBIS</td><td>${itbis} (exento / sandbox)</td></tr>
      <tr><td>ApprovedUrl</td><td style="font-size:10px">${approvedUrl}</td></tr>
      <tr><td>AuthHash</td><td style="font-size:9px;word-break:break-all">${authHash.slice(0,50)}...</td></tr>
      <tr><td>AUTH_KEY</td><td>${AUTH_KEY ? '✅ configurada (' + AUTH_KEY.slice(0,6) + '...)' : '❌ NO configurada'}</td></tr>
    </table>

    <form action="${AZUL_URL}" method="post">
      <input type="hidden" name="MerchantId"        value="${MERCHANT_ID}">
      <input type="hidden" name="TrxType"           value="Sale">
      <input type="hidden" name="MerchantName"      value="${MERCHANT_NAME}">
      <input type="hidden" name="MerchantType"      value="${MERCHANT_TYPE}">
      <input type="hidden" name="CurrencyCode"      value="${CURRENCY}">
      <input type="hidden" name="OrderNumber"       value="${orderNum}">
      <input type="hidden" name="Amount"            value="${amount}">
      <input type="hidden" name="ITBIS"             value="${itbis}">
      <input type="hidden" name="ApprovedUrl"       value="${approvedUrl}">
      <input type="hidden" name="DeclinedUrl"       value="${declinedUrl}">
      <input type="hidden" name="CancelUrl"         value="${cancelUrl}">
      <input type="hidden" name="UseCustomField1"   value="${useCustom1}">
      <input type="hidden" name="CustomField1Label" value="${label1}">
      <input type="hidden" name="CustomField1Value" value="${value1}">
      <input type="hidden" name="UseCustomField2"   value="${useCustom2}">
      <input type="hidden" name="CustomField2Label" value="${label2}">
      <input type="hidden" name="CustomField2Value" value="${value2}">
      <input type="hidden" name="ShowTransactionResult" value="0">
      <input type="hidden" name="Locale"            value="ES">
      <input type="hidden" name="AuthHash"          value="${authHash}">
      <button type="submit" class="btn btn-azul">🔵 Probar con portal AZUL sandbox →</button>
    </form>

    <a href="${simRetornoUrl}" class="btn btn-sim" style="margin-top:8px;">
      ✅ Simular retorno APROBADO (sin portal AZUL)
    </a>
  </div>

  <div class="card">
    <h3 style="font-size:14px;color:#374151;margin:0 0 8px">Tarjetas de prueba AZUL sandbox</h3>
    <table>
      <tr><td>Visa aprobada</td><td><code>4005520000000129</code> | Exp: 12/26 | CVV: 132</td></tr>
      <tr><td>MC aprobada</td><td><code>5413330089010005</code> | Exp: 12/26 | CVV: 123</td></tr>
      <tr><td>Visa declinada</td><td><code>4532819739091745</code></td></tr>
    </table>
  </div>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
