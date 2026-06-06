import { NextRequest, NextResponse } from 'next/server'

const OCR_PROMPT = `Eres un optometrista experto en lectura de recetas ópticas. Analiza esta imagen con MÁXIMA precisión.

BUSCA ESTOS CAMPOS (en cualquier idioma):
- OD / R / Right / Ojo Derecho
- OI / OS / L / Left / Ojo Izquierdo
- SPH / Esfera / Sphere
- CYL / Cilindro / Cylinder
- AXIS / Eje / EJE
- ADD / Adición

REGLAS: Esfera positiva con signo (+1.50). Cilindro negativo (-0.75). Eje sin signo (90). ADD positivo (+2.00).

Responde SOLO con JSON válido:
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

export async function POST(req: NextRequest) {
  let image: string, mimeType: string
  try {
    const body = await req.json()
    image    = body.image
    mimeType = body.mimeType ?? 'image/jpeg'
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!image) return NextResponse.json({ error: 'image requerido' }, { status: 400 })

  // ── Intentar Gemini 1.5 Flash ─────────────────────────────────────────────
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [
              { inline_data: { mime_type: mimeType, data: image } },
              { text: OCR_PROMPT }
            ]}],
            generationConfig: { temperature: 0.1, maxOutputTokens: 800 }
          })
        }
      )

      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
        const clean = text.replace(/```json|```/g, '').trim()
        try {
          const receta = JSON.parse(clean)
          return NextResponse.json({ ok: true, receta, provider: 'Gemini' })
        } catch {
          console.error('[ocr] Gemini JSON parse failed:', clean.slice(0, 200))
        }
      } else {
        const errBody = await res.text()
        console.error('[ocr] Gemini HTTP error', res.status, errBody.slice(0, 300))
      }
    } catch (e: any) {
      console.error('[ocr] Gemini fetch error:', e.message)
    }
  } else {
    console.warn('[ocr] GEMINI_API_KEY no configurada')
  }

  // ── Intentar Anthropic Claude ─────────────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (anthropicKey) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mimeType, data: image } },
              { type: 'text', text: OCR_PROMPT }
            ]
          }]
        })
      })

      if (res.ok) {
        const data = await res.json()
        const text = data.content?.[0]?.text?.trim() ?? ''
        const clean = text.replace(/```json|```/g, '').trim()
        try {
          const receta = JSON.parse(clean)
          return NextResponse.json({ ok: true, receta, provider: 'Claude' })
        } catch {
          console.error('[ocr] Claude JSON parse failed:', clean.slice(0, 200))
        }
      } else {
        const errBody = await res.text()
        console.error('[ocr] Claude HTTP error', res.status, errBody.slice(0, 300))
      }
    } catch (e: any) {
      console.error('[ocr] Claude fetch error:', e.message)
    }
  } else {
    console.warn('[ocr] ANTHROPIC_API_KEY no configurada')
  }

  return NextResponse.json({
    error: 'No se pudo leer la receta automáticamente.',
    canManual: true,
    debug: {
      gemini: !!geminiKey,
      anthropic: !!anthropicKey,
    }
  }, { status: 503 })
}
