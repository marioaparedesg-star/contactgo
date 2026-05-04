import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { image, mimeType } = await req.json()
  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: image } },
          { type: 'text', text: `Analiza esta receta óptica y extrae los valores. Responde SOLO con JSON sin markdown:
{"od_sph":"","od_cyl":"","od_axis":"","od_add":"","oi_sph":"","oi_cyl":"","oi_axis":"","oi_add":""}
od=ojo derecho, oi=ojo izquierdo. sph como +1.25 o -2.50, cyl negativo como -0.75, axis entre 1-180, add como +1.50. Si no existe dejar "".` }
        ]
      }]
    })
    const text = (msg.content[0] as any).text.trim()
    const receta = JSON.parse(text)
    return NextResponse.json({ receta })
  } catch {
    return NextResponse.json({ error: 'No se pudo procesar' }, { status: 500 })
  }
}
