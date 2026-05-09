// API: Analizar imagen de receta óptica con OpenRouter (gratis)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imagen_base64, media_type = 'image/jpeg' } = await req.json()
    if (!imagen_base64) return NextResponse.json({ error: 'imagen_base64 requerido' }, { status: 400 })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'OPENROUTER_API_KEY no configurado' }, { status: 500 })

    const prompt = `Eres un optometrista experto en leer recetas ópticas. Analiza esta imagen de receta oftalmológica y extrae los valores exactos.

INSTRUCCIONES:
1. Busca los valores de OD (ojo derecho / right) y OI (ojo izquierdo / left)
2. Extrae: SPH (esfera), CYL (cilindro), EJE/AXIS, ADD (adición si hay)
3. Identifica el tipo de corrección
4. Si ves fecha de emisión de la receta, extráela

Responde SOLO con JSON válido, sin texto extra, sin markdown:
{
  "od_sph": número o null,
  "od_cyl": número o null,
  "od_axis": número o null,
  "oi_sph": número o null,
  "oi_cyl": número o null,
  "oi_axis": número o null,
  "add_power": número o null,
  "fecha_emision": "YYYY-MM-DD" o null,
  "diagnostico": "miopía" o "hipermetropía" o "astigmatismo" o "presbicia" o "miopía con astigmatismo" o "hipermetropía con astigmatismo" o "sin corrección",
  "confianza": "alta" o "media" o "baja",
  "notas": "texto breve si algo es dudoso" o null,
  "es_receta_valida": true o false
}`

    const body = {
      model: 'baidu/qianfan-ocr-fast:free',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${media_type};base64,${imagen_base64}` }
          },
          { type: 'text', text: prompt }
        ]
      }],
      max_tokens: 1024,
      temperature: 0.1,
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://contactgo.net',
        'X-Title': 'ContactGo — Análisis de Receta',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[OpenRouter error]', err)
      return NextResponse.json({ error: 'Error en IA: ' + (err.error?.message ?? res.status) }, { status: 500 })
    }

    const result = await res.json()
    const text = result.choices?.[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()

    let data: any
    try {
      data = JSON.parse(clean)
    } catch {
      // Si no devuelve JSON válido, intentar extraer con regex
      console.error('[analizar-receta] JSON parse failed:', clean)
      return NextResponse.json({ error: 'No se pudo leer la receta. Asegúrate de que la imagen sea clara.' }, { status: 422 })
    }

    return NextResponse.json({ ok: true, ...data })
  } catch (err: any) {
    console.error('[analizar-receta]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
