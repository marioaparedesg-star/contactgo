import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contactgo.net'
const FROM = process.env.RESEND_FROM ?? 'ContactGo <onboarding@resend.dev>'

function emailTemplate(
  nombre: string, producto: string, dias: number,
  cupon: string, descuento: number,
  alerta: '7dias' | '3dias' | 'hoy',
  tipoProducto: string
) {
  const esGota = tipoProducto === 'gota'
  const esSolucion = tipoProducto === 'solucion'
  const icono = esGota ? '💧' : esSolucion ? '🧴' : '👁️'
  const objeto = esGota ? 'gotas' : esSolucion ? 'solución' : 'lentes'

  const mensajes = {
    '7dias': {
      titulo: `${nombre}, tus ${producto} se terminan en 7 días ${icono}`,
      urgencia: `Tienes tiempo, pero actúa ahora para no quedarte sin ${objeto}.`,
    },
    '3dias': {
      titulo: `¡Solo 3 días! Tus ${producto} se acaban pronto ⚠️`,
      urgencia: `Actúa ya — en 3 días te quedas sin ${objeto}.`,
    },
    'hoy': {
      titulo: `Hoy se terminan tus ${producto} 🔴`,
      urgencia: `Hoy es el último día de uso estimado. Pide ahora y evita quedarte sin ${objeto}.`,
    },
  }
  const { titulo, urgencia } = mensajes[alerta]

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:linear-gradient(135deg,#0a4d8c,#0d6efd);padding:30px;text-align:center;border-radius:12px 12px 0 0;">
      <h1 style="color:white;margin:0;font-size:22px;">ContactGo</h1>
      <p style="color:rgba(255,255,255,0.8);margin:5px 0 0;font-size:13px;">Lentes de Contacto República Dominicana</p>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="color:#1a1a1a;font-size:20px;margin-bottom:8px;">${titulo}</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;">${urgencia}</p>
      <div style="background:#f8faff;border:2px solid #0d6efd;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:#555;font-size:13px;margin:0 0 8px;">Tu cupón exclusivo de recompra:</p>
        <p style="color:#0d6efd;font-size:28px;font-weight:900;margin:0;letter-spacing:4px;">${cupon}</p>
        <p style="color:#0d6efd;font-size:14px;margin:6px 0 0;font-weight:bold;">${descuento}% de descuento en tu próxima orden</p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${BASE}/catalogo?recompra=${cupon}" 
           style="background:#0d6efd;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
          Pedir ahora →
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#999;font-size:12px;text-align:center;">
        Recordatorio automático basado en los ${dias} días de duración de tu producto.<br>
        Si ya hiciste tu pedido, ignora este mensaje.
      </p>
    </div>
  </div>`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY!)
  const ahora = new Date()
  let enviados = 0

  async function procesarLista(lista: any[], campo: 'notificado_7' | 'notificado_3' | 'notificado_0', alerta: '7dias' | '3dias' | 'hoy') {
    for (const n of lista || []) {
      try {
        await resend.emails.send({
          from: FROM,
          to: n.email,
          subject: alerta === '7dias'
            ? `Tus ${n.product_nombre} se terminan en 7 días`
            : alerta === '3dias'
            ? `¡Solo 3 días! Tus ${n.product_nombre} se acaban`
            : `Hoy se terminan tus ${n.product_nombre}`,
          html: emailTemplate(
            n.nombre, n.product_nombre, n.dias_uso,
            n.cupon_generado, n.descuento_ofrecido,
            alerta, n.tipo_producto || 'esferico'
          ),
        })
        await sb.from('recompra_notifications').update({ [campo]: true }).eq('id', n.id)
        if (alerta === '7dias') {
          await sb.from('coupons').update({ activo: true }).eq('codigo', n.cupon_generado)
        }
        enviados++
      } catch (e) { console.error('[recompra cron]', e) }
    }
  }

  const { data: l7 } = await sb.from('recompra_notifications')
    .select('*').eq('notificado_7', false).lte('fecha_notificacion_7', ahora.toISOString())
  await procesarLista(l7 || [], 'notificado_7', '7dias')

  const { data: l3 } = await sb.from('recompra_notifications')
    .select('*').eq('notificado_3', false).lte('fecha_notificacion_3', ahora.toISOString())
  await procesarLista(l3 || [], 'notificado_3', '3dias')

  const { data: l0 } = await sb.from('recompra_notifications')
    .select('*').eq('notificado_0', false).lte('fecha_notificacion_0', ahora.toISOString())
  await procesarLista(l0 || [], 'notificado_0', 'hoy')

  return NextResponse.json({ ok: true, enviados, timestamp: ahora.toISOString() })
}
