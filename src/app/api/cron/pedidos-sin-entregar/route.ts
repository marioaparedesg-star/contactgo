// ============================================================
// ContactGo — GET /api/cron/pedidos-sin-entregar
// Envía por WhatsApp al número de servicio de Mario (809-694-2268)
// la lista de pedidos PAGADOS que todavía no están marcados como
// 'entregado', con cuántos días lleva cada uno desde que se hizo.
//
// Pedido explícito de Mario (2026-08-17): quiere esto todos los días
// para no perder de vista pedidos que se están quedando atrás.
//
// Solo va a su número de servicio — nunca a clientes, nunca toca el
// webhook ni el trato con clientes en ningún momento.
// ============================================================
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchWA } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const ESTADO_LABEL: Record<string, string> = {
  recibido:    'Recibido',
  confirmado:  'Confirmado',
  preparando:  'Preparando',
  fabricante:  'En fabricación',
  enviado:     'Enviado',
  transito:    'En tránsito',
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()

  try {
    const { data: pedidos } = await sb
      .from('orders')
      .select('numero_orden, cliente_nombre, estado, created_at')
      .eq('pago_estado', 'pagado')
      .eq('es_prueba', false)
      .not('estado', 'in', '(entregado,cancelado)')
      .order('created_at', { ascending: true })

    const lista = (pedidos ?? []).map(o => {
      const dias = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000)
      // Tóricos tardan 25-40 días en fabricación (normal, no alarmante).
      // Para todo lo demás, más de 5 días sin moverse sí merece atención.
      const alerta = dias > 20 ? '🔴' : dias > 5 ? '🟡' : '🟢'
      return { ...o, dias, alerta, label: ESTADO_LABEL[o.estado] ?? o.estado }
    })

    if (lista.length === 0) {
      // Aun con cero pedidos pendientes, se manda el aviso — así Mario sabe
      // que el sistema corrió y que de verdad no hay nada atrasado, en vez
      // de quedarse con la duda de si el mensaje simplemente no llegó.
      // BUG EVITADO: usar la MISMA plantilla aprobada para este caso también
      // — texto libre fuera de la ventana de 24h falla en silencio (mismo
      // problema ya encontrado y corregido antes en otras notificaciones).
      await enviarWhatsApp(0, '✅ Todo entregado — ningún pedido pendiente hoy.')
      return NextResponse.json({ ok: true, pendientes: 0 })
    }

    const textoLista = lista
      .map(p => `${p.alerta} ${p.numero_orden} · ${p.cliente_nombre ?? '—'} · ${p.label} · ${p.dias}d`)
      .join('\n')

    await enviarWhatsApp(lista.length, textoLista)

    return NextResponse.json({ ok: true, pendientes: lista.length })
  } catch (err: any) {
    console.error('[pedidos-sin-entregar]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function enviarWhatsApp(total: number, lista: string) {
  const WA_API = 'https://graph.facebook.com/v20.0'
  // Meta rechaza parámetros con saltos, tabulaciones, controles invisibles
  // o más de 1,024 caracteres. Normalizamos Unicode y enviamos la lista
  // en partes para no perder pedidos cuando el volumen sea alto.
  const lineas = lista
    .normalize('NFKC')
    .split(/[\\r\\n\\u2028\\u2029]+/u)
    .map(linea => linea
      .replace(/[\\p{Cc}\\p{Cf}\\p{Z}]+/gu, ' ')
      .replace(/\\s+/gu, ' ')
      .trim()
    )
    .filter(Boolean)

  const limite = 900
  const partes: string[] = []
  let parte = ''
  for (const linea of lineas) {
    const candidata = parte ? `${parte} | ${linea}` : linea
    if (candidata.length > limite && parte) {
      partes.push(parte)
      parte = linea
    } else {
      parte = candidata
    }
    // Una sola línea excepcionalmente larga se divide sin exceder el límite.
    while (parte.length > limite) {
      partes.push(parte.slice(0, limite))
      parte = parte.slice(limite).trim()
    }
  }
  if (parte) partes.push(parte)
  if (partes.length === 0) partes.push('Sin detalle disponible.')

  for (let i = 0; i < partes.length; i++) {
    const detalle = partes.length > 1
      ? `Parte ${i + 1}/${partes.length}: ${partes[i]}`
      : partes[i]
    const parametro = detalle
      .normalize('NFKC')
      .replace(/[\\p{Cc}\\p{Cf}\\p{Z}]+/gu, ' ')
      .replace(/\\s+/gu, ' ')
      .trim()
      .slice(0, 1024)

    const body = {
      messaging_product: 'whatsapp',
      to: '18096942268',
      type: 'template',
      template: {
        name: 'pedidos_sin_entregar',
        language: { code: 'es' },
        components: [{ type: 'body', parameters: [
          { type: 'text', text: String(total) },
          { type: 'text', text: parametro },
        ] }],
      },
    }

    const r = await fetchWA('18096942268', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await r.json()
    if (!r.ok || data?.error) {
      console.error('[pedidos-sin-entregar] WhatsApp falló:', JSON.stringify(data?.error ?? data))
      throw new Error('No se pudo enviar el resumen de pedidos por WhatsApp.')
    }
  }
}
