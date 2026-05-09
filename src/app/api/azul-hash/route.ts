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

  const utf16 = Buffer.from(raw, 'utf16le')
  const hash = createHmac('sha512', authKey).update(utf16).digest('hex')

  return NextResponse.json({ hash })
}
