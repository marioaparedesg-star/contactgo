// API: Analizar imagen de receta óptica con IA (Anthropic)
// POST /api/analizar-receta  { imagen_base64, media_type }
// Devuelve: { od_sph, od_cyl, od_axis, oi_sph, oi_cyl, oi_axis, add_power, diagnostico, confianza, notas }
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { imagen_base64, media_type = 'image/jpeg' } = await req.json()
    if (!imagen_base64) return NextResponse.json({ error: 'imagen_base64 requerido' }, { status: 400 })

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type, data: imagen_base64 },
          },
          {
            type: 'text',
            text: `Eres un optometrista experto en leer recetas ópticas. Analiza esta imagen de receta oftalmológica y extrae los valores exactos.

INSTRUCCIONES:
1. Busca los valores de OD (ojo derecho) y OI (ojo izquierdo)
2. Extrae: SPH (esfera), CYL (cilindro), EJE/AXIS, ADD (adición si hay)
3. Identifica el tipo de corrección
4. Si ves fecha de emisión de la receta, extráela

Responde SOLO con JSON válido, sin texto extra:
{
  "od_sph": número o null (ej: -2.50 o +1.25),
  "od_cyl": número o null (ej: -0.75),
  "od_axis": número o null (ej: 180),
  "oi_sph": número o null,
  "oi_cyl": número o null,
  "oi_axis": número o null,
  "add_power": número o null (ej: 2.00),
  "fecha_emision": "YYYY-MM-DD" o null,
  "diagnostico": "miopía" | "hipermetropía" | "astigmatismo" | "presbicia" | "miopía con astigmatismo" | "hipermetropía con astigmatismo" | "sin corrección",
  "confianza": "alta" | "media" | "baja",
  "notas": "texto breve si hay algo relevante o dudoso" o null,
  "es_receta_valida": true o false
}

Si la imagen no es una receta óptica o no puedes leer los valores, responde con es_receta_valida: false.`
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)

    return NextResponse.json({ ok: true, ...data })
  } catch (err: any) {
    console.error('[analizar-receta]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
