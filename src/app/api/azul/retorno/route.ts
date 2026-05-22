// /api/azul/retorno — recibe el retorno de AZUL (GET con query params)
// AZUL devuelve: OrderNumber, Amount, ResponseCode, ReasonCode, ReasonCodeText, AzulOrderId, etc.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE = 'https://www.contactgo.net'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  
  // AZUL devuelve estos campos como query params en la ApprovedUrl
  const orderNumber  = url.searchParams.get('OrderNumber') ?? ''      // ej: CG-52568784
  const azulOrderId  = url.searchParams.get('AzulOrderId') ?? ''      // ID de AZUL
  const responseCode = url.searchParams.get('ResponseCode') ?? ''     // "00" = aprobado
  const resultado    = url.searchParams.get('resultado') ?? ''        // nuestro param
  const amount       = url.searchParams.get('Amount') ?? ''

  console.log('[AZUL/retorno] params:', { orderNumber, azulOrderId, responseCode, resultado, amount })

  let orderId = ''
  // AZUL ResponseCode: "00" = aprobado, "ISO0" = aprobado en algunos casos
  const esAprobado = resultado === 'aprobado' || 
    responseCode === '00' || 
    responseCode === '000' ||
    responseCode === 'ISO0' ||
    responseCode === '0'

  // Buscar la orden por numero_orden (AZUL devuelve OrderNumber, no el UUID)
  if (orderNumber) {
    try {
      const { data: order } = await sb
        .from('orders')
        .select('id')
        .eq('numero_orden', orderNumber)
        .single()
      
      if (order?.id) {
        orderId = order.id
        
        // Actualizar estado si el pago fue aprobado
        if (esAprobado) {
          await sb.from('orders')
            .update({ 
              pago_estado: 'pagado', 
              estado: 'confirmado',
              ...(azulOrderId ? { azul_order_id: azulOrderId } : {}),
              ...(responseCode ? { azul_response_code: responseCode } : {})
            })
            .eq('id', orderId)

          // Enviar emails de notificación
          await fetch(`${BASE}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, evento: 'nuevo_pedido' })
          }).catch(console.error)
        }
      }
    } catch (e) {
      console.error('[AZUL/retorno] DB error:', e)
    }
  }

  // Redirigir a /confirmacion con el UUID real
  const confirmUrl = new URL('/confirmacion', BASE)
  if (orderId) confirmUrl.searchParams.set('orden', orderId)
  confirmUrl.searchParams.set('origen', 'azul')
  confirmUrl.searchParams.set('resultado', esAprobado ? 'aprobado' : resultado || 'error')
  if (azulOrderId) confirmUrl.searchParams.set('azul_order_id', azulOrderId)

  return NextResponse.redirect(confirmUrl.toString(), { status: 302 })
}

// AZUL también puede llamar por POST
export async function POST(req: NextRequest) {
  // Redirigir al GET handler
  return GET(req)
}
