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

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[ocr-receta] GEMINI_API_KEY no configurada')
    return NextResponse.json({ error: 'Servicio no disponible. Ingresa los valores manualmente.' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: { mime_type: mimeType, data: image }
              },
              {
                text: `Eres un optometrista experto en República Dominicana. Analiza esta receta óptica y extrae los valores exactos.

CAMPOS A BUSCAR:
- OD = Ojo Derecho (también "Right", "R", "OD")
- OI = Ojo Izquierdo (también "Left", "L", "OS")
- Esfera / SPH: número con signo (+1.50, -2.25, plano=0)
- Cilindro / CYL: casi siempre negativo (-0.25, -0.75)
- Eje / AXIS / EJE: número SIN signo (88, 180)
- Adición / ADD: positivo (+1.50, +2.00)
- Si un campo está vacío, en blanco o con "—" → null

REGLAS:
- Esfera positiva siempre lleva signo + (ej: +1.50)
- Cilindro es negativo (ej: -0.25 no +0.25)
- Eje nunca lleva signo
- "esf" o "---" o "—" = null

Responde SOLO con JSON válido, sin markdown ni texto extra:
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
  "notas": "texto si algo es dudoso" | null
}`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[ocr-receta] Gemini error:', res.status, err)
      return NextResponse.json({ error: 'Error del servicio. Ingresa los valores manualmente.' }, { status: 502 })
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
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
    return NextResponse.json({ error: 'Error procesando la imagen.' }, { status: 500 })
  }
}
