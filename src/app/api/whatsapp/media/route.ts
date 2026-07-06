// ============================================================
// ContactGo — GET /api/whatsapp/media?id=MEDIA_ID
// Proxy para descargar medios de WhatsApp (imágenes, videos, audio, docs)
// Meta requiere token para acceder a los medios — este endpoint lo proxea
// ============================================================
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const mediaId = req.nextUrl.searchParams.get('id')
  if (!mediaId) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const TOKEN = process.env.WHATSAPP_TOKEN ?? ''
  const WA_API = 'https://graph.facebook.com/v20.0'

  try {
    // Step 1: Get the media URL from Meta
    const metaRes = await fetch(`${WA_API}/${mediaId}`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    })
    const metaData = await metaRes.json()
    
    if (!metaData.url) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Step 2: Download the actual media file
    const fileRes = await fetch(metaData.url, {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    })

    if (!fileRes.ok) {
      return NextResponse.json({ error: 'Failed to download media' }, { status: 502 })
    }

    const contentType = metaData.mime_type || fileRes.headers.get('content-type') || 'application/octet-stream'
    const buffer = await fileRes.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache 24h
      },
    })
  } catch (err: any) {
    console.error('[WA/media]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
