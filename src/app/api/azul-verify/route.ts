import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    OrderNumber, Amount, AuthorizationCode, DateTime,
    ResponseCode, IsoCode, ResponseMessage, ErrorDescription,
    RRN, AuthHash,
  } = body

  const authKey = process.env.AZUL_AUTH_KEY!

  const raw =
    OrderNumber + Amount + AuthorizationCode + DateTime +
    ResponseCode + IsoCode + ResponseMessage + ErrorDescription +
    RRN + authKey

  const utf16 = Buffer.from(raw, 'utf16le')
  const computed = createHmac('sha512', authKey).update(utf16).digest('hex')

  return NextResponse.json({ valid: computed === AuthHash })
}
