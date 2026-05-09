// API: Analizar imagen de receta óptica con Google Gemini (gratis)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imagen_base64, media_type = 'image/jpeg' } = await req.json()
    if (!imagen_base64) return NextResponse.json({ error: 'imagen_base64 requerido' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY no configurado' }, { status: 500 })

    const body = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: media_type,
              data: imagen_base64,
            }
          },
          {
            text: `Eres un optometrista experto en leer recetas ópticas. Analiza esta imagen de receta oftalmológica y extrae los valores exactos.

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
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      }
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error('[Gemini error]', err)
      return NextResponse.json({ error: 'Error en Gemini: ' + (err.error?.message ?? res.status) }, { status: 500 })
    }

    const result = await res.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)

    return NextResponse.json({ ok: true, ...data })
  } catch (err: any) {
    console.error('[analizar-receta]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
