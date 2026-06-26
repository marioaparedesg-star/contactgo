import { NextRequest, NextResponse } from 'next/server'

const WA_TOKEN      = process.env.WHATSAPP_TOKEN
const WA_PHONE_ID   = process.env.WHATSAPP_PHONE_ID
const VERIFY_TOKEN  = process.env.WHATSAPP_VERIFY_TOKEN ?? 'contactgo-webhook-2026'

// ── Auto-respuestas inteligentes por palabras clave ────────────────────────
const RESPUESTAS: { keywords: string[]; respuesta: string }[] = [
  {
    keywords: ['hola', 'buenas', 'buenos', 'hi', 'hello', 'buen dia', 'buen día'],
    respuesta: `👋 ¡Hola! Bienvenido a *ContactGo* 👁️

Somos la tienda online de lentes de contacto en República Dominicana. ¿En qué podemos ayudarte?

Puedes preguntarme sobre:
• 📦 *Productos* — ACUVUE, Bausch+Lomb, CooperVision, Alcon
• 🚚 *Envíos* — Entregamos en 24-48h en toda la RD
• 💊 *Tu receta* — Te ayudamos a encontrar el lente correcto
• 💰 *Precios* — Todos originales y certificados

O visita nuestro catálogo: https://www.contactgo.net/catalogo`
  },
  {
    keywords: ['precio', 'cuanto cuesta', 'cuánto cuesta', 'cuanto vale', 'cuánto vale', 'costo', 'precio de'],
    respuesta: `💰 *Precios ContactGo (originales 100%)*

• ACUVUE OASYS 6u → RD$3,875
• 1-DAY ACUVUE MOIST 30u → RD$3,875  
• Biofinity 6u → RD$4,750
• AIR OPTIX HydraGlyde 6u → RD$4,375
• Bausch+Lomb ULTRA 6u → RD$4,500
• AIR OPTIX COLORS 2u → RD$2,625

🚚 Envío incluido en toda la RD

Ver catálogo completo: https://www.contactgo.net/catalogo`
  },
  {
    keywords: ['envio', 'envío', 'entrega', 'delivery', 'cuanto demora', 'cuánto demora', 'cuando llega', 'cuándo llega'],
    respuesta: `🚚 *Envíos ContactGo*

✅ *24-48 horas* en Santo Domingo y Santiago
✅ *48-72 horas* en el interior del país
✅ Envío incluido en todos los pedidos

Hacemos entregas de lunes a sábado. Una vez confirmado tu pago, te notificamos el estado de tu pedido.

¿Tienes alguna duda sobre tu pedido? Danos tu número de orden.`
  },
  {
    keywords: ['acuvue', 'oasys', '1-day', 'moist'],
    respuesta: `👁️ *Lentes ACUVUE disponibles en ContactGo*

• *ACUVUE OASYS* (quincenal) — RD$3,875
• *ACUVUE 2* (quincenal) — RD$3,600
• *1-DAY ACUVUE MOIST* (diario 30u) — RD$3,875
• *ACUVUE OASYS for Astigmatism* — RD$6,250
• *1-DAY MOIST for Astigmatism* — RD$6,250
• *ACUVUE OASYS Multifocal* — RD$8,200

Todos son 100% originales de Johnson & Johnson ✅

Ver detalles: https://www.contactgo.net/marca/acuvue`
  },
  {
    keywords: ['biofinity', 'coopervision', 'clariti', 'avaira'],
    respuesta: `👁️ *Lentes CooperVision en ContactGo*

• *Biofinity* (mensual) — RD$4,750
• *Biofinity Toric* — RD$5,750
• *Biofinity Multifocal* — RD$9,500
• *clariti 1 day* (diario) — RD$4,375
• *clariti toric* — RD$5,750
• *Avaira Vitality* (mensual) — RD$3,690

100% originales de CooperVision ✅

Ver catálogo: https://www.contactgo.net/catalogo`
  },
  {
    keywords: ['air optix', 'alcon', 'bausch', 'ultra', 'hidraglyde', 'hydraglyde'],
    respuesta: `👁️ *Lentes Alcon y Bausch+Lomb en ContactGo*

*Alcon:*
• AIR OPTIX HydraGlyde (mensual) — RD$4,375
• AIR OPTIX COLORS — RD$2,625
• AIR OPTIX Multifocal — RD$7,250

*Bausch+Lomb:*
• Bausch+Lomb ULTRA (mensual) — RD$4,500
• BL ULTRA for Astigmatism — RD$4,000
• BL ULTRA Presbyopia — RD$4,100

Todos originales y certificados ✅

Ver todo: https://www.contactgo.net/catalogo`
  },
  {
    keywords: ['receta', 'graduacion', 'graduación', 'prescripcion', 'prescripción', 'no se mi receta', 'no sé mi receta'],
    respuesta: `📋 *¿No tienes tu receta a mano?*

No te preocupes. Tienes 3 opciones:

1️⃣ *Usa nuestra calculadora* — te ayuda a encontrar el lente correcto basado en lo que usas ahora:
https://www.contactgo.net/receta

2️⃣ *Revisa tu caja actual* — la receta está en la caja del lente que usas ahora (busca SPH, CYL, BC, DIA)

3️⃣ *Escríbenos aquí* — cuéntanos qué lente usas actualmente y te ayudamos a encontrar el equivalente.

¿Cuál prefieres?`
  },
  {
    keywords: ['pago', 'como pago', 'cómo pago', 'tarjeta', 'azul', 'transferencia', 'efectivo'],
    respuesta: `💳 *Métodos de pago en ContactGo*

✅ *Tarjeta de crédito/débito* — VISA, Mastercard, American Express (procesado por AZUL / Banco Popular)
✅ *100% seguro* — Certificación PCI DSS

El pago se realiza directamente en nuestro sitio web de forma segura:
https://www.contactgo.net/checkout

¿Tienes alguna duda sobre el proceso de pago?`
  },
  {
    keywords: ['color', 'colores', 'lentes de color', 'ojos de color', 'cambiar color'],
    respuesta: `🎨 *Lentes de contacto de color en ContactGo*

• *AIR OPTIX COLORS* (Alcon) — RD$2,625 por 2 lentes
  Colores: Blue, Gray, Green, Honey, Pure Hazel, Sterling Gray, Turquoise, Brown, Gemstone Green, Brilliant Blue

• *Lunare Tri-Kolor* — RD$2,250 por 2 lentes
  Colores variados disponibles

¿Tienes graduación o quieres sin graduación (planos)?

Ver colores disponibles: https://www.contactgo.net/color`
  },
  {
    keywords: ['solucion', 'solución', 'liquido', 'líquido', 'multipropósito', 'multiproposito', 'limpiar'],
    respuesta: `🧴 *Soluciones para lentes de contacto*

• *Dream Eye* (80ml) — RD$750
• *Opti-Free PureMoist* — RD$1,200
• *Prolub Hyfresh* — RD$900

También tenemos gotas lubricantes:
• Refresh Tears, Refresh Optive, Manzanilla Sophia

Ver todos: https://www.contactgo.net/soluciones`
  },
  {
    keywords: ['pedido', 'orden', 'mi pedido', 'donde esta', 'dónde está', 'tracking', 'seguimiento'],
    respuesta: `📦 *Consulta de pedido*

Para ver el estado de tu pedido, ingresa a tu cuenta:
https://www.contactgo.net/cuenta

O cuéntame tu número de orden (empieza con CG-) y lo verifico por ti ahora mismo. 

¿Cuál es tu número de orden?`
  },
  {
    keywords: ['devolucion', 'devolución', 'cambio', 'devolver', 'garantia', 'garantía'],
    respuesta: `🔄 *Devoluciones y garantías*

En ContactGo garantizamos que todos nuestros productos son 100% originales y en perfectas condiciones.

Si tienes algún problema con tu pedido:
1. Escríbenos aquí o a info@contactgo.net
2. Dinos el número de orden y el problema
3. Coordinamos la solución en 24 horas

Política completa: https://www.contactgo.net/devoluciones`
  },
  {
    keywords: ['gracias', 'ok', 'perfecto', 'listo', 'excelente', 'genial'],
    respuesta: `😊 ¡Con gusto! 

Si tienes más preguntas o quieres hacer tu pedido, estamos aquí.

Recuerda que puedes ver todo nuestro catálogo en:
https://www.contactgo.net/catalogo

¡Que tengas un excelente día! 👁️✨`
  },
]

// Función para encontrar la respuesta correcta
function getAutoRespuesta(mensaje: string): string | null {
  const msg = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  for (const r of RESPUESTAS) {
    if (r.keywords.some(kw => msg.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return r.respuesta
    }
  }
  
  // Respuesta genérica si no matchea ninguna keyword
  return `👋 ¡Hola! Soy el asistente de *ContactGo*.

Recibí tu mensaje y un asesor te responderá pronto. Mientras tanto, puedes ver nuestro catálogo:
https://www.contactgo.net/catalogo

O si tienes una urgencia, llámanos al *(829) 472-8328*.

¡Gracias por escribirnos! 😊`
}

// Enviar mensaje por WhatsApp API
async function enviarMensaje(telefono: string, mensaje: string) {
  if (!WA_TOKEN || !WA_PHONE_ID) return false
  
  const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: telefono,
      type: 'text',
      text: { body: mensaje, preview_url: true }
    })
  })
  return res.ok
}

// ── GET: Verificación del webhook ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WA Webhook] Verificado ✅')
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
}

// ── POST: Recibir mensajes entrantes y auto-responder ─────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Verificar que es un mensaje de WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' })
    }

    const entry   = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value   = changes?.value
    
    // Procesar mensajes entrantes
    const messages = value?.messages
    if (!messages?.length) {
      return NextResponse.json({ status: 'no_messages' })
    }

    for (const message of messages) {
      const telefono = message.from
      const tipo     = message.type
      
      // Solo procesar mensajes de texto
      if (tipo !== 'text') continue
      
      const textoCliente = message.text?.body ?? ''
      console.log(`[WA Webhook] Mensaje de ${telefono}: "${textoCliente}"`)
      
      // Buscar auto-respuesta
      const respuesta = getAutoRespuesta(textoCliente)
      if (respuesta && WA_TOKEN && WA_PHONE_ID) {
        await enviarMensaje(telefono, respuesta)
        console.log(`[WA Webhook] Auto-respuesta enviada a ${telefono}`)
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err: any) {
    console.error('[WA Webhook] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
