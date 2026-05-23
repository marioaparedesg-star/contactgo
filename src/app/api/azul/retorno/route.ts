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

  if (process.env.NODE_ENV !== 'production') console.log('[AZUL/retorno] recibido:', {orderNumber, isoCode, resultado})

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


        if (esAprobado) {
          // ── Obtener próximo NCF ──────────────────────────────────────────
          let ncf: string | null = null
          try {
            const { data: ncfData, error: ncfErr } = await sb.rpc('get_next_ncf', { p_serie: 'E02' })
            if (ncfErr) console.error('[AZUL/retorno] NCF error:', ncfErr.message)
            else { ncf = ncfData as string }
          } catch (e) { console.error('[AZUL/retorno] NCF excepción:', e) }

          // ── Guardar TODOS los datos de AZUL + NCF en la orden ───────────
          const { error: updateErr } = await sb.from('orders').update({
            pago_estado:        'pagado',
            estado:             'confirmado',
            azul_order_number:  orderNumber,
            azul_order_id:      azulOrderId  || null,
            azul_auth_code:     authCode     || null,
            azul_rrn:           rrn          || null,
            azul_response_code: responseCode || null,
            azul_iso_code:      isoCode      || null,
            pagado_en:          new Date().toISOString(),
            ncf:                ncf,
            ncf_tipo:           'E02',
          }).eq('id', orderId)

          if (updateErr) {
            console.error('[AZUL/retorno] ERROR actualizando orden:', updateErr.message)
          } else {

            // El notify lo dispara el cliente desde /confirmacion (más confiable en Vercel)

          }
        } else {
          // Pago declinado — registrar el intento
          await sb.from('orders').update({
            pago_estado:        'declinado',
            azul_order_number:  orderNumber,
            azul_response_code: isoCode || responseCode || null,
          }).eq('id', orderId)

        }
      }
    } catch (e) {
      console.error('[AZUL/retorno] excepción:', e)
    }
  } else {

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
