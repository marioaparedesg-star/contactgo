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

  const buf = Buffer.from(raw, 'utf8')
  const utf16 = Buffer.alloc(buf.length * 2)
  for (let i = 0; i < buf.length; i++) {
    utf16.writeUInt8(buf[i], i * 2)
    utf16.writeUInt8(0, i * 2 + 1)
  }

  const computed = createHmac('sha512', authKey)
    .update(utf16)
    .digest('hex')

  return NextResponse.json({ valid: computed === AuthHash })
}
