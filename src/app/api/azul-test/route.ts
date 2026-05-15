// GET /api/azul-test
// Endpoint de prueba para certificación técnica AZUL
// Genera un formulario de prueba hacia el ambiente de pruebas de AZUL
import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function GET(req: NextRequest) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
  const MERCHANT_ID = process.env.AZUL_MERCHANT_ID ?? '39038540035'
  const MERCHANT_NAME = 'ContactGo'
  const MERCHANT_TYPE = 'ECommerce'
  const CURRENCY = '$'
  const ORDER_NUM = `CG-TEST-${Date.now()}`
  const AMOUNT = '500000'  // RD$5,000.00
  const ITBIS = '076271'   // 18% ITBIS
  const APPROVED = `${BASE_URL}/confirmacion?origen=azul&resultado=aprobado`
  const DECLINED = `${BASE_URL}/confirmacion?origen=azul&resultado=declinado`
  const CANCEL = `${BASE_URL}/cart`
  const AUTH_KEY = process.env.AZUL_AUTH_KEY ?? ''

  // Calcular AuthHash según especificación AZUL (HMAC SHA-512 Unicode)
  const raw = [
    MERCHANT_ID, MERCHANT_NAME, MERCHANT_TYPE, CURRENCY,
    ORDER_NUM, AMOUNT, ITBIS,
    APPROVED, DECLINED, CANCEL,
    '1', 'Número de orden', ORDER_NUM,
    '0', '', '',
    AUTH_KEY
  ].join('')

  const utf16 = Buffer.from(raw, 'utf16le')
  const authHash = AUTH_KEY
    ? createHmac('sha512', AUTH_KEY).update(utf16).digest('hex')
    : 'HASH_REQUIRES_AUTH_KEY'

  // Log para verificación AZUL
  const logData = {
    timestamp: new Date().toISOString(),
    merchant_id: MERCHANT_ID,
    order_number: ORDER_NUM,
    amount: AMOUNT,
    itbis: ITBIS,
    currency: CURRENCY,
    approved_url: APPROVED,
    declined_url: DECLINED,
    cancel_url: CANCEL,
    auth_hash_generated: authHash !== 'HASH_REQUIRES_AUTH_KEY',
    environment: process.env.AZUL_ENV ?? 'sandbox',
  }

  console.log('[AZUL-TEST]', JSON.stringify(logData))

  // Retornar HTML con formulario POST hacia AZUL sandbox
  const AZUL_URL = process.env.AZUL_ENV === 'production'
    ? 'https://pagos.azul.com.do/PaymentPage/Default.aspx'
    : 'https://pruebas.azul.com.do/PaymentPage/'

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ContactGo — Prueba AZUL</title>
  <style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px;background:#f9fafb;}
    .card{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:24px;}
    h2{color:#0d6efd;margin-bottom:8px;}
    table{width:100%;border-collapse:collapse;font-size:13px;}
    td{padding:6px 10px;border-bottom:1px solid #f0f0f0;}
    td:first-child{font-weight:700;color:#555;width:180px;}
    .btn{background:#0d6efd;color:white;border:none;padding:12px 24px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;width:100%;margin-top:16px;}
    .btn:hover{background:#0b5ed7;}
    .log{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;font-size:11px;font-family:monospace;margin-top:16px;white-space:pre-wrap;}
  </style>
</head>
<body>
  <div class="card">
    <h2>ContactGo — Prueba de integración AZUL</h2>
    <p style="color:#666;font-size:13px;margin-bottom:16px;">Ambiente: <strong>${AZUL_URL.includes('pruebas') ? 'SANDBOX' : 'PRODUCCIÓN'}</strong></p>
    
    <table>
      <tr><td>MerchantID</td><td>${MERCHANT_ID}</td></tr>
      <tr><td>MerchantName</td><td>${MERCHANT_NAME}</td></tr>
      <tr><td>OrderNumber</td><td>${ORDER_NUM}</td></tr>
      <tr><td>Amount</td><td>${AMOUNT} (RD$5,000.00)</td></tr>
      <tr><td>ITBIS</td><td>${ITBIS} (RD$762.71)</td></tr>
      <tr><td>CurrencyCode</td><td>${CURRENCY}</td></tr>
      <tr><td>AuthHash</td><td style="font-size:10px;word-break:break-all;">${authHash.substring(0,40)}...</td></tr>
      <tr><td>ApprovedUrl</td><td style="font-size:11px;">${APPROVED}</td></tr>
      <tr><td>DeclinedUrl</td><td style="font-size:11px;">${DECLINED}</td></tr>
      <tr><td>CancelUrl</td><td style="font-size:11px;">${CANCEL}</td></tr>
    </table>

    <form action="${AZUL_URL}" method="post" id="azulForm">
      <input type="hidden" name="MerchantId" value="${MERCHANT_ID}">
      <input type="hidden" name="MerchantName" value="${MERCHANT_NAME}">
      <input type="hidden" name="MerchantType" value="${MERCHANT_TYPE}">
      <input type="hidden" name="CurrencyCode" value="${CURRENCY}">
      <input type="hidden" name="OrderNumber" value="${ORDER_NUM}">
      <input type="hidden" name="Amount" value="${AMOUNT}">
      <input type="hidden" name="ITBIS" value="${ITBIS}">
      <input type="hidden" name="ApprovedUrl" value="${APPROVED}">
      <input type="hidden" name="DeclinedUrl" value="${DECLINED}">
      <input type="hidden" name="CancelUrl" value="${CANCEL}">
      <input type="hidden" name="UseCustomField1" value="1">
      <input type="hidden" name="CustomField1Label" value="Número de orden">
      <input type="hidden" name="CustomField1Value" value="${ORDER_NUM}">
      <input type="hidden" name="UseCustomField2" value="0">
      <input type="hidden" name="CustomField2Label" value="">
      <input type="hidden" name="CustomField2Value" value="">
      <input type="hidden" name="ShowTransactionResult" value="0">
      <input type="hidden" name="Locale" value="ES">
      <input type="hidden" name="SaveToDataVault" value="1">
      <input type="hidden" name="AuthHash" value="${authHash}">
      <input type="hidden" name="LogoImageUrl" value="https://contactgo.net/logo.png">
      <button type="submit" class="btn">🔵 Iniciar prueba en AZUL →</button>
    </form>

    <div class="log">LOG: ${JSON.stringify(logData, null, 2)}</div>
  </div>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
