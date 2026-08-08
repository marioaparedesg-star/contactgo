// Endpoint interno de un solo uso: sube una imagen (base64) al bucket
// público 'products' de Supabase Storage usando la service role key.
// Usado para corregir las 4 imágenes de producto con proporción incorrecta
// (2026-08-08). No está enlazado desde ninguna parte del sitio.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { filename, base64 } = await req.json()
  if (!filename || !base64) {
    return NextResponse.json({ error: 'faltan filename o base64' }, { status: 400 })
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const buffer = Buffer.from(base64, 'base64')

  const { error } = await sb.storage.from('products').upload(filename, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: pub } = sb.storage.from('products').getPublicUrl(filename)
  return NextResponse.json({ ok: true, url: pub.publicUrl })
}
