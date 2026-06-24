// ── Facebook Conversions API (CAPI) — server-side events ──
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PIXEL_ID = '1516674003159165'
const ACCESS_TOKEN = process.env.FB_CAPI_TOKEN ?? ''

function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    // Sin token configurado, ignorar silenciosamente
    return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 200 })
  }

  try {
    const body = await req.json()
    const { eventName, eventData, userData } = body

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 
                     req.headers.get('x-real-ip') ?? ''
    const userAgent = req.headers.get('user-agent') ?? ''
    const eventSourceUrl = req.headers.get('referer') ?? 'https://www.contactgo.net'

    const event: any = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
        fbp: userData?.fbp ?? null,
        fbc: userData?.fbc ?? null,
      },
    }

    if (userData?.email) event.user_data.em = [hashValue(userData.email)]
    if (userData?.phone) event.user_data.ph = [hashValue(userData.phone.replace(/\D/g, ''))]
    if (userData?.firstName) event.user_data.fn = [hashValue(userData.firstName)]

    if (eventData) {
      event.custom_data = {
        currency: eventData.currency ?? 'DOP',
        value: eventData.value,
        content_ids: eventData.content_ids,
        content_type: 'product',
        num_items: eventData.num_items,
        order_id: eventData.order_id,
      }
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event] }),
      }
    )

    const result = await response.json()
    if (!response.ok) {
      console.error('[FB CAPI Error]', result)
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    return NextResponse.json({ ok: true, events_received: result.events_received })
  } catch (err) {
    console.error('[FB CAPI Exception]', err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
