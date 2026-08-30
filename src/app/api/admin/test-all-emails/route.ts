import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { emailCliente } from '@/app/api/notify/route'

// ENDPOINT TEMPORAL DE DIAGNÓSTICO — creado a pedido de Mario para revisar
// todas las plantillas de correo reales que le llegan a los clientes.
// Se elimina después de esta prueba.

const DESTINO = 'info@contactgo.net'

function ordenMock(overrides: any = {}) {
  return {
    id: 'test-0000-0000-0000-000000000001',
    numero_orden: 'CG-TEST0001',
    cliente_nombre: 'Cliente de Prueba',
    cliente_email: DESTINO,
    total: 3350,
    envio: 0,
    descuento: 0,
    created_at: new Date().toISOString(),
    estado: 'pendiente',
    ...overrides,
  }
}

function itemsMock(tipo: string, reemplazo: string, nombre: string) {
  return [{
    nombre, cantidad: 1, precio: 3350, tipo,
    sph_od: '-2.00', sph_oi: '-2.25',
    cyl_od: tipo === 'torico' ? '-1.25' : null, cyl_oi: tipo === 'torico' ? '-1.25' : null,
    axis_od: tipo === 'torico' ? '90' : null, axis_oi: tipo === 'torico' ? '180' : null,
    products: { tipo, reemplazo },
  }]
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const enviados: string[] = []
  const errores: string[] = []

  async function enviar(etiqueta: string, subject: string, html: string) {
    try {
      await resend.emails.send({
        from: 'ContactGo <info@contactgo.net>',
        to: DESTINO,
        subject: `[PRUEBA] ${subject}`,
        html,
      })
      enviados.push(etiqueta)
    } catch (e: any) {
      errores.push(`${etiqueta}: ${e?.message ?? 'error desconocido'}`)
    }
  }

  // 1. Confirmación de pedido nuevo
  await enviar(
    '1. Confirmación de pedido',
    'Confirmación de tu pedido #CG-TEST0001',
    emailCliente(ordenMock(), itemsMock('esferico', 'Diario', '1-DAY ACUVUE® MOIST®'), 'nuevo_pedido')
  )

  // 2-6. Cada estado del pedido
  const estados = ['confirmado', 'preparando', 'enviado', 'entregado', 'cancelado']
  for (const estado of estados) {
    await enviar(
      `Estado: ${estado}`,
      `Actualización de tu pedido — ${estado}`,
      emailCliente(ordenMock({ estado }), itemsMock('esferico', 'Diario', '1-DAY ACUVUE® MOIST®'), 'cambio_estado', estado)
    )
  }

  // 7-10. Secuencia educativa post-entrega (día 3, día 7 diario, día 7 reutilizable, día 14)
  const notaAplicacion = (tipo: string) => {
    if (tipo === 'torico') return `<li>🔄 Es normal que el lente gire levemente al parpadear — está diseñado para volver solo a su posición (por eso es tórico). Si la visión se siente inestable los primeros días, es parte de la adaptación.</li>`
    if (tipo === 'multifocal') return `<li>👓 Los multifocales necesitan un poco más de paciencia: tu cerebro tarda entre unos días y 2 semanas en acostumbrarse a ver de cerca y lejos con el mismo lente.</li>`
    if (tipo === 'color') return `<li>🎨 Nunca compartas tus lentes de color con nadie, aunque sean "de un solo uso estético" — es la misma regla de higiene que un lente graduado.</li>`
    return ''
  }
  const notaAlerta = (tipo: string) => {
    if (tipo === 'multifocal') return `<p style="color:#374151;font-size:14px">Si después de 2 semanas tu visión de cerca o lejos sigue sin sentirse nítida, escríbenos — a veces hace falta ajustar la potencia ADD.</p>`
    if (tipo === 'torico') return `<p style="color:#374151;font-size:14px">Un poco de fluctuación visual al mover los ojos es normal en tóricos durante la adaptación — pero si persiste después de 2 semanas, avísanos.</p>`
    return ''
  }
  function envolver(contenidoHtml: string) {
    return `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
  <div style="background:#0f766e;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <p style="color:white;font-weight:900;font-size:20px;margin:0">ContactGo</p>
    <p style="color:#99f6e4;font-size:11px;margin:2px 0 0">Cuidado de tus lentes</p>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
    ${contenidoHtml}
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px">
      ¿Dudas? Escríbenos por WhatsApp: +1 809 694-2268
    </p>
  </div>
</div>`
  }

  await enviar('7. Educativo día 3', 'Cómo poner y quitar tus lentes correctamente 👁️', envolver(`
    <h2 style="color:#111;font-size:18px">¡Hola, Cliente! 👋</h2>
    <p style="color:#374151;font-size:14px">Aquí tienes lo básico para empezar bien con tus lentes de contacto:</p>
    <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
      <li>✅ Lávate y sécate bien las manos antes de tocarlos</li>
      <li>✅ Revisa que el lente no esté al revés — el borde debe verse liso, no volteado</li>
      <li>✅ Colócatelo mirando hacia arriba, apoyando el párpado inferior</li>
      <li>✅ Si sientes molestia los primeros 1-2 días, es normal (período de adaptación)</li>
      ${notaAplicacion('torico')}
      <li>⚠️ Nunca uses agua del grifo ni saliva — solo solución para lentes de contacto</li>
    </ul>
    <p style="color:#374151;font-size:14px">Si algo no se siente bien, no fuerces el lente — quítatelo y escríbenos por WhatsApp.</p>`))

  await enviar('8. Educativo día 7 (diario)', 'Un tip importante sobre tus lentes diarios 🗓️', envolver(`
    <h2 style="color:#111;font-size:18px">Cliente, un recordatorio rápido 🗓️</h2>
    <p style="color:#374151;font-size:14px">Tus lentes son de reemplazo diario — eso significa:</p>
    <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
      <li>✅ Se usan una sola vez y se descartan al final del día — no los reutilices ni los guardes en solución para el día siguiente</li>
      <li>✅ No necesitas estuche ni solución de limpieza para este producto</li>
      <li>⚠️ Reusar un lente diario aumenta muchísimo el riesgo de infección — el material no está diseñado para limpiarse y durar más de un día</li>
    </ul>`))

  await enviar('9. Educativo día 7 (reutilizable)', 'El error más común con el estuche de tus lentes 🧴', envolver(`
    <h2 style="color:#111;font-size:18px">Cliente, hablemos de tu estuche 🧴</h2>
    <p style="color:#374151;font-size:14px">Un estuche mal cuidado es la causa más común de infecciones oculares evitables:</p>
    <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
      <li>✅ Cambia la solución del estuche cada vez que lo uses — nunca "rellenes" la de ayer</li>
      <li>✅ Enjuaga el estuche con solución (no agua) y déjalo secar boca abajo al aire</li>
      <li>✅ Cambia el estuche completo cada 3 meses</li>
    </ul>`))

  await enviar('10. Educativo día 14', '¿Cuándo debes ver a un optometrista? 👀', envolver(`
    <h2 style="color:#111;font-size:18px">Cliente, esto es importante 👀</h2>
    <p style="color:#374151;font-size:14px">ContactGo no reemplaza a tu optometrista. Consulta a un profesional si notas:</p>
    <ul style="color:#374151;font-size:14px;padding-left:20px;line-height:1.8">
      <li>🔴 Ojo rojo que no mejora en 24 horas</li>
      <li>🔴 Dolor (no solo molestia leve de adaptación)</li>
      <li>🔴 Visión borrosa que no se corrige parpadeando</li>
      <li>🔴 Sensibilidad fuerte a la luz o secreción inusual</li>
    </ul>
    ${notaAlerta('multifocal')}
    <p style="color:#374151;font-size:14px">Ante cualquiera de estas señales, quítate el lente y acude a un oftalmólogo u optometrista — no esperes a que pase solo.</p>`))

  // 11. Bienvenida (con el gradiente verde viejo — así lo verás tal cual está hoy)
  await enviar('11. Bienvenida (registro)', '¡Bienvenido a ContactGo, Cliente! 👁️', `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
  <tr><td style="background:linear-gradient(135deg,#14532d,#16a34a);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">👁️</div>
    <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 8px;">¡Bienvenido a ContactGo!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">La tienda especializada en lentes de contacto de RD</p>
  </td></tr>
  <tr><td style="background:white;padding:36px;border-radius:0 0 20px 20px;">
    <p style="color:#374151;font-size:14px">Este es el correo REAL de bienvenida — nota el gradiente verde, distinto al azul/turquesa del resto de la marca.</p>
  </td></tr>
</table></td></tr></table></body></html>`)

  return NextResponse.json({ ok: true, enviados, errores })
}
