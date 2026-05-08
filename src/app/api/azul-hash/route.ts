import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    MerchantId, MerchantName, MerchantType, CurrencyCode,
    OrderNumber, Amount, ITBIS,
    ApprovedUrl, DeclinedUrl, CancelUrl,
    UseCustomField1, CustomField1Label, CustomField1Value,
    UseCustomField2, CustomField2Label, CustomField2Value,
  } = body

  const authKey = process.env.AZUL_AUTH_KEY!

  const raw =
    MerchantId +
    MerchantName +
    MerchantType +
    CurrencyCode +
    OrderNumber +
    Amount +
    ITBIS +
    ApprovedUrl +
    DeclinedUrl +
    CancelUrl +
    UseCustomField1 +
    CustomField1Label +
    CustomField1Value +
    UseCustomField2 +
    CustomField2Label +
    CustomField2Value +
    authKey

  // UNICODE (UTF-16LE) como indica el doc técnico de AZUL
  const buf = Buffer.from(raw, 'utf8')
  const utf16 = Buffer.alloc(buf.length * 2)
  for (let i = 0; i < buf.length; i++) {
    utf16.writeUInt8(buf[i], i * 2)
    utf16.writeUInt8(0, i * 2 + 1)
  }

  const hash = createHmac('sha512', authKey)
    .update(utf16)
    .digest('hex')

  return NextResponse.json({ hash })
}
