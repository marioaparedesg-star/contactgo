import { guardRequest } from '@/lib/api-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) }
const SERVICIO_WA = '18096942268' // número de servicio al cliente, para reclamar el cupón

// ── Ventana permitida para enviar mensajes: 9:00am–7:00pm hora de República Dominicana (UTC-4) ──
// Esta comprobación es independiente del horario programado del cron: si Vercel reintenta o
// alguien lo dispara manualmente fuera de horario, el cron NO envía nada, solo lo reporta.
function dentroDeHorarioPermitido(): boolean {
  const horaRD = new Date(Date.now() - 4 * 60 * 60 * 1000).getUTCHours()
  return horaRD >= 9 && horaRD < 19
}

// Mensaje iniciado por el negocio → debe ir por plantilla aprobada de Meta (no texto libre),
// porque el cliente probablemente no escribió en las últimas 24h. Usamos la plantilla ya
// aprobada 'renovacion_lentes' (parámetros: nombre, producto), variando el texto del segundo
// parámetro según la etapa. Sin saltos de línea — Meta rechaza parámetros con \n (error 132018).
function textoProducto(
  producto: string, cupon: string, descuento: number,
  alerta: '7dias' | '3dias' | 'hoy', tipoProducto: string
): string {
  const esGota = tipoProducto === 'gota'
  const esSolucion = tipoProducto === 'solucion'
  const objeto = esGota ? 'gotas' : esSolucion ? 'solución' : 'lentes'

  if (alerta === '7dias') return `${producto} — ya casi se te acaban, te quedan ~7 días de uso 😊`
  if (alerta === '3dias') return `${producto} — se te acaban en 3 días. Usa ${cupon}: ${descuento}% off + envío gratis 🎁. Escríbenos: wa.me/${SERVICIO_WA}`
  return `${producto} — se terminan hoy 👀. Usa ${cupon}: ${descuento}% off + envío gratis. Escríbenos: wa.me/${SERVICIO_WA}`
}

async function enviarTemplate(telefono: string, nombre: string, producto: string) {
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID ?? '1237770472751989'
  const TOKEN = process.env.WHATSAPP_TOKEN ?? ''
  let phone = telefono.replace(/[^0-9+]/g, '').replace(/^\+/, '')
  if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone

  const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'renovacion_lentes',
        language: { code: 'es' },
        components: [{
          type: 'body',
          parameters: [
            { type: 'text', text: nombre?.split(' ')[0] || 'Cliente' },
            { type: 'text', text: producto },
          ],
        }],
      },
    }),
  })
  const data = await res.json()
  if (!data.messages?.[0]?.id) throw new Error(JSON.stringify(data.error ?? data))
  return data
}

export async function GET(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 2 })
  if (guardErr) return guardErr

  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!dentroDeHorarioPermitido()) {
    return NextResponse.json({
      ok: true, enviados: 0,
      motivo: 'Fuera de la ventana permitida (9am-7pm hora RD) — no se envía nada.',
    })
  }

  const ahora = new Date()
  let enviados = 0
  let fallidos = 0

  async function procesarLista(lista: any[], campo: 'notificado_7' | 'notificado_3' | 'notificado_0', alerta: '7dias' | '3dias' | 'hoy') {
    for (const n of lista || []) {
      if (!n.telefono) {
        // Sin teléfono no podemos avisar por WhatsApp — se marca igual para no reintentar en vano
        await getSb().from('recompra_notifications').update({ [campo]: true }).eq('id', n.id)
        continue
      }
      try {
        const producto = textoProducto(
          n.product_nombre, n.cupon_generado, n.descuento_ofrecido,
          alerta, n.tipo_producto || 'esferico'
        )
        await enviarTemplate(n.telefono, n.nombre, producto)
        await getSb().from('recompra_notifications').update({ [campo]: true }).eq('id', n.id)
        if (alerta === '7dias') {
          await getSb().from('coupons').update({ activo: true }).eq('codigo', n.cupon_generado)
        }
        enviados++
      } catch (e) {
        console.error('[recompra cron]', e)
        fallidos++
      }
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  const { data: l7 } = await getSb().from('recompra_notifications')
    .select('*').eq('notificado_7', false).lte('fecha_notificacion_7', ahora.toISOString())
  await procesarLista(l7 || [], 'notificado_7', '7dias')

  const { data: l3 } = await getSb().from('recompra_notifications')
    .select('*').eq('notificado_3', false).lte('fecha_notificacion_3', ahora.toISOString())
  await procesarLista(l3 || [], 'notificado_3', '3dias')

  const { data: l0 } = await getSb().from('recompra_notifications')
    .select('*').eq('notificado_0', false).lte('fecha_notificacion_0', ahora.toISOString())
  await procesarLista(l0 || [], 'notificado_0', 'hoy')

  return NextResponse.json({ ok: true, enviados, fallidos, timestamp: ahora.toISOString() })
}
