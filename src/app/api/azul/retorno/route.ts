// /api/azul/retorno — recibe el retorno de AZUL (GET con query params)
// AZUL devuelve: OrderNumber, Amount, AuthorizationCode, DateTime, ResponseCode,
//               ISOCode, ResponseMessage, ErrorDescription, RRN, AzulOrderId, AuthHash
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.contactgo.net'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const sb  = getSb()
  const url = new URL(req.url)
  const p = url.searchParams

  // ── Todos los campos que AZUL devuelve ──────────────────────────────────────
  const orderNumber      = p.get('OrderNumber')      ?? ''  // nuestro CG-XXXXXXXX
  const amount           = p.get('Amount')           ?? ''
  const authCode         = p.get('AuthorizationCode')?? ''  // código de aprobación
  const dateTime         = p.get('DateTime')         ?? ''
  const responseCode     = p.get('ResponseCode')     ?? ''  // "ISO8583" — NO es el estado
  const isoCode          = p.get('IsoCode')          ?? ''  // "00" = APROBADO ← key
  const responseMessage  = p.get('ResponseMessage')  ?? ''  // "APROBADA"
  const errorDescription = p.get('ErrorDescription') ?? ''
  const rrn              = p.get('RRN')              ?? ''  // referencia AZUL
  const azulOrderId      = p.get('AzulOrderId')      ?? ''  // ID interno AZUL
  const resultado        = p.get('resultado')        ?? ''  // nuestro param prefijado

  console.log('[AZUL/retorno] RECIBIDO:', {
    orderNumber, isoCode, responseCode, responseMessage,
    authCode: authCode ? '***' + authCode.slice(-4) : 'none',
    rrn, azulOrderId, resultado, amount
  })

  // ── Determinar si fue APROBADO ──────────────────────────────────────────────
  // IsoCode="00" es el indicador oficial de AZUL para aprobación
  const esAprobado =
    isoCode === '00' ||                    // ← indicador principal AZUL
    resultado === 'aprobado' ||            // ← nuestro param en ApprovedUrl
    responseMessage?.toUpperCase() === 'APROBADA'

  let orderId = ''

  if (orderNumber) {
    try {
      // Buscar la orden por numero_orden (AZUL devuelve nuestro OrderNumber)
      const { data: order, error: findErr } = await sb
        .from('orders')
        .select('id, pago_estado')
        .eq('numero_orden', orderNumber)
        .single()

      if (findErr || !order) {
        console.error('[AZUL/retorno] orden no encontrada:', orderNumber, findErr?.message)
      } else {
        orderId = order.id
        console.log('[AZUL/retorno] orden encontrada:', orderId, '| pago_estado actual:', order.pago_estado)

        if (esAprobado) {
          // ── Guardar TODOS los datos de AZUL en la orden ─────────────────
          const { error: updateErr } = await sb.from('orders').update({
            pago_estado:       'pagado',
            estado:            'confirmado',
            azul_order_number: orderNumber,
            azul_order_id:     azulOrderId  || null,
            azul_auth_code:    authCode     || null,
            azul_rrn:          rrn         || null,
            azul_response_code: responseCode || null,  // ISO8583
            azul_iso_code:     isoCode      || null,   // 00 = aprobado
            pagado_en:         new Date().toISOString(),
          }).eq('id', orderId)

          if (updateErr) {
            console.error('[AZUL/retorno] ERROR actualizando orden:', updateErr.message)
          } else {
            console.log('[AZUL/retorno] ✅ orden actualizada pago_estado=pagado')
            // Notificar por email
            fetch(`${BASE}/api/notify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: orderId, evento: 'nuevo_pedido' })
            }).catch(e => console.error('[AZUL/retorno] notify error:', e))
          }
        } else {
          // Pago declinado — registrar el intento
          await sb.from('orders').update({
            pago_estado:        'declinado',
            azul_order_number:  orderNumber,
            azul_response_code: isoCode || responseCode || null,
          }).eq('id', orderId)
          console.log('[AZUL/retorno] ⚠️ pago declinado, isoCode:', isoCode, 'responseMessage:', responseMessage)
        }
      }
    } catch (e) {
      console.error('[AZUL/retorno] excepción:', e)
    }
  } else {
    console.warn('[AZUL/retorno] sin OrderNumber en querystring')
  }

  // ── Redirigir a /confirmacion ───────────────────────────────────────────────
  const confirmUrl = new URL('/confirmacion', BASE)
  if (orderId)     confirmUrl.searchParams.set('orden',        orderId)
  if (azulOrderId) confirmUrl.searchParams.set('azul_order_id', azulOrderId)
  confirmUrl.searchParams.set('origen',    'azul')
  confirmUrl.searchParams.set('resultado', esAprobado ? 'aprobado' : 'declinado')

  return NextResponse.redirect(confirmUrl.toString(), { status: 302 })
}

// AZUL puede llamar también por POST (IPN)
export async function POST(req: NextRequest) {
  return GET(req)
}
