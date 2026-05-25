import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: image,
            },
          },
          {
            type: 'text',
            text: `Eres un optometrista experto. Analiza esta receta óptica en español y extrae los valores exactos.

CAMPOS A BUSCAR:
- OD = Ojo Derecho (también puede aparecer como "Right", "R", "OD")
- OI = Ojo Izquierdo (también puede aparecer como "Left", "L", "OS")
- Esfera = SPH (puede ser positivo +1.50 o negativo -2.25)
- Cilindro = CYL (casi siempre negativo: -0.75, -1.25)
- Eje = AXIS o EJE (número entre 1 y 180)
- Adición = ADD (para presbicia, siempre positivo: +1.50, +2.00)

REGLAS:
- Si el valor es "esf" o "---" significa que no hay corrección en ese campo → usa null
- El eje/axis NUNCA lleva signo + ni -
- La esfera lleva signo: +1.50 o -2.25
- El cilindro es negativo: -0.75 no +0.75
- Si ves "plano" o "0" en esfera → od_sph: 0 o oi_sph: 0

Responde SOLO con JSON válido sin markdown ni texto extra:
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
  "notas": "texto breve si algo es dudoso o ilegible" | null
}`,
          },
        ],
      }],
    })

    const text = (msg.content[0] as any).text.trim()
    const clean = text.replace(/```json|```/g, '').trim()

    let receta: any
    try {
      receta = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'No se pudo leer la receta. Asegúrate de que la imagen sea clara y bien iluminada.' }, { status: 422 })
    }

    return NextResponse.json({ ok: true, receta })
  } catch (err: any) {
    console.error('[ocr-receta]', err)
    return NextResponse.json({ error: 'Error procesando la imagen' }, { status: 500 })
  }
}
