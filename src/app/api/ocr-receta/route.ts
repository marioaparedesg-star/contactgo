import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let image: string, mimeType: string
  try {
    const body = await req.json()
    image    = body.image
    mimeType = body.mimeType ?? 'image/jpeg'
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!image || !mimeType) {
    return NextResponse.json({ error: 'image y mimeType son requeridos' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('[ocr-receta] ANTHROPIC_API_KEY no configurada en Vercel')
    return NextResponse.json({ error: 'Servicio de lectura no disponible. Ingresa los valores manualmente.' }, { status: 503 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: image,
              },
            },
            {
              type: 'text',
              text: `Eres un optometrista experto. Analiza esta receta óptica y extrae los valores exactos.

CAMPOS:
- OD = Ojo Derecho, OI = Ojo Izquierdo
- Esfera/SPH: número con signo (+1.50 o -2.25)
- Cilindro/CYL: casi siempre negativo (-0.25, -0.75)
- Eje/AXIS: número sin signo (88, 180)
- Adición/ADD: positivo (+1.50)
- Si un campo está vacío, en blanco o con "—" → null

Responde SOLO JSON sin markdown:
{
  "od_sph": número o null,
  "od_cyl": número o null,
  "od_axis": número o null,
  "oi_sph": número o null,
  "oi_cyl": número o null,
  "oi_axis": número o null,
  "add_power": número o null,
  "diagnostico": "miopía" | "hipermetropía" | "astigmatismo" | "miopía con astigmatismo" | "hipermetropía con astigmatismo" | "presbicia" | "sin corrección",
  "confianza": "alta" | "media" | "baja",
  "notas": string o null
}`,
            },
          ],
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[ocr-receta] API error:', response.status, err)
      return NextResponse.json({ error: 'Error del servicio de lectura. Ingresa los valores manualmente.' }, { status: 502 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text?.trim() ?? ''
    const clean = text.replace(/```json|```/g, '').trim()

    let receta: any
    try {
      receta = JSON.parse(clean)
    } catch {
      console.error('[ocr-receta] JSON parse error:', clean)
      return NextResponse.json({ error: 'No se pudo leer la receta. Asegúrate de que la imagen sea clara.' }, { status: 422 })
    }

    return NextResponse.json({ ok: true, receta })
  } catch (err: any) {
    console.error('[ocr-receta]', err)
    return NextResponse.json({ error: 'Error procesando la imagen' }, { status: 500 })
  }
}
