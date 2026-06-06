import { NextRequest, NextResponse } from 'next/server'

const OCR_PROMPT = `Eres un optometrista experto en lectura de recetas ópticas. Analiza esta imagen con MÁXIMA precisión.

BUSCA ESTOS CAMPOS (en cualquier idioma — español, inglés, francés, etc.):
- OD / R / Right / Ojo Derecho → Ojo derecho
- OI / OS / L / Left / Ojo Izquierdo → Ojo izquierdo
- SPH / Esfera / Sphere / Sph → Potencia esférica
- CYL / Cilindro / Cylinder / Cyl → Cilindro (casi siempre negativo)
- AXIS / Eje / EJE / Ax → Eje del cilindro (0-180, SIN signo)
- ADD / Adición / Near Add / Reading → Adición para presbicia
- PD / DIP → Distancia interpupilar (solo informativo)

REGLAS CRÍTICAS:
- Esfera positiva SIEMPRE con signo: +1.50, no 1.50
- Cilindro es NEGATIVO normalmente: -0.75, no +0.75
- Si aparece "esf", "---", "DS", "plano", "Pl" → sph sin cyl = sin astigmatismo
- Eje NUNCA tiene signo (90, no +90 ni -90)
- ADD siempre positivo (+1.50, +2.00)
- Si un campo está vacío, en blanco o ilegible → null
- Decimales: siempre con punto (2.25 no 2,25)

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
  "idioma_receta": "español" | "inglés" | "francés" | "portugués" | "otro",
  "notas": "texto si algo es dudoso o importante" | null
}`

async function callAnthropic(image: string, mimeType: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY no configurada')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
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

  if (!res.ok) throw new Error(`Anthropic error ${res.status}`)
  const data = await res.json()
  const text = data.content?.[0]?.text?.trim() ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function callGemini(image: string, mimeType: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

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

  // Intentar Anthropic primero (mejor para visión), luego Gemini
  const providers = [
    { name: 'Anthropic', fn: () => callAnthropic(image, mimeType) },
    { name: 'Gemini',    fn: () => callGemini(image, mimeType) },
  ]

  for (const provider of providers) {
    try {
      const receta = await provider.fn()
      console.log(`[ocr-receta] OK via ${provider.name}`)
      return NextResponse.json({ ok: true, receta, provider: provider.name })
    } catch (err: any) {
      console.warn(`[ocr-receta] ${provider.name} failed:`, err.message)
    }
  }

  return NextResponse.json({
    error: 'No se pudo leer la receta automáticamente. Por favor ingresa los valores manualmente.',
    canManual: true
  }, { status: 503 })
}
