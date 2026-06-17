// /api/azul/retorno — recibe el retorno de AZUL (GET con query params o POST form-encoded)
// AZUL devuelve: OrderNumber, Amount, AuthorizationCode, DateTime, ResponseCode,
//               ISOCode, ResponseMessage, ErrorDescription, RRN, AzulOrderId, AuthHash
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const BASE      = 'https://www.contactgo.net'
const AUTH_KEY  = process.env.AZUL_AUTH_KEY ?? ''
const MERCHANT_ID   = process.env.AZUL_MERCHANT_ID    ?? '39038540035'
const MERCHANT_NAME = process.env.AZUL_MERCHANT_NAME  ?? 'ContactGo'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Extrae parámetros tanto de query string como de body form-encoded */
async function extractParams(req: NextRequest): Promise<URLSearchParams> {
  const url    = new URL(req.url)
  const params = new URLSearchParams(url.searchParams)

  // AZUL puede hacer POST con application/x-www-form-urlencoded
  if (req.method === 'POST') {
    try {
      const ct = req.headers.get('content-type') ?? ''
      if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
        const formData = await req.formData()
        formData.forEach((v, k) => { if (!params.has(k)) params.set(k, String(v)) })
      } else if (ct.includes('application/json')) {
        const json = await req.json()
        Object.entries(json).forEach(([k, v]) => { if (!params.has(k)) params.set(k, String(v)) })
      }
    } catch (_) { /* body vacío — OK */ }
  }

  return params
}

/**
 * Valida el AuthHash de la respuesta de AZUL.
 * Construcción EXACTA según documentación oficial AZUL (pág. 8):
 *   OrderNumber + Amount + AuthorizationCode + DateTime + ResponseCode
 *   + ISOCode + ResponseMessage + ErrorDescription + RRN + AuthKey
 * Encoding: UTF-16LE (según ejemplo PHP oficial en pág. 9)
 */
function validateResponseHash(
  p: URLSearchParams,
  returnedHash: string
): boolean {
  if (!AUTH_KEY || !returnedHash) return false
  try {
    // Orden exacto según spec AZUL — NO incluye MerchantId, ITBIS ni AzulOrderId
    const rawStr = [
      p.get('OrderNumber')       ?? '',  // 1
      p.get('Amount')            ?? '',  // 2
      p.get('AuthorizationCode') ?? '',  // 3
      p.get('DateTime')          ?? '',  // 4
      p.get('ResponseCode')      ?? '',  // 5
      p.get('IsoCode')           ?? '',  // 6 — AZUL llama "ISOCode" en docs, devuelve "IsoCode"
      p.get('ResponseMessage')   ?? '',  // 7
      p.get('ErrorDescription')  ?? '',  // 8
      p.get('RRN')               ?? '',  // 9
      AUTH_KEY,                          // 10 — authKey al final (no viaja en el POST)
    ].join('')

    // Encoding UTF-16LE requerido — validado contra ejemplo oficial AZUL (pág. 43)
    const rawBuffer = Buffer.from(rawStr, 'utf16le')
    const computed = createHmac('sha512', AUTH_KEY)
      .update(rawBuffer).digest('hex')

    const match = computed.toLowerCase() === returnedHash.toLowerCase()
    if (!match && process.env.NODE_ENV !== 'production') {
      console.warn('[AZUL/retorno] hash mismatch debug:', {
        rawStr: rawStr.slice(0, 80) + '...',
        computedPrefix: computed.slice(0, 20),
        receivedPrefix: returnedHash.slice(0, 20),
      })
    }
    return match
  } catch (_) {
    return false
  }
}

async function handleReturn(req: NextRequest) {
  const sb     = getSb()
  const p      = await extractParams(req)

  // ── Todos los campos que AZUL devuelve ──────────────────────────────────────
  const orderNumber      = p.get('OrderNumber')      ?? ''
  const amountRaw        = p.get('Amount')           ?? ''
  const authCode         = p.get('AuthorizationCode')?? ''
  const dateTime         = p.get('DateTime')         ?? ''
  const responseCode     = p.get('ResponseCode')     ?? ''
  const isoCode          = p.get('IsoCode')          ?? ''
  const responseMessage  = p.get('ResponseMessage')  ?? ''
  const errorDescription = p.get('ErrorDescription') ?? ''
  const rrn              = p.get('RRN')              ?? ''
  const azulOrderId      = p.get('AzulOrderId')      ?? ''
  const returnedHash     = p.get('AuthHash')         ?? ''
  // NOTA: resultado=aprobado es un param que incluimos en la ApprovedUrl para saber
  // qué URL llamó AZUL, pero NO lo usamos como indicador de aprobación por seguridad
  const resultadoUrl     = p.get('resultado')        ?? ''

  console.log('[AZUL/retorno] recibido:', {
    orderNumber,
    isoCode,
    responseCode,
    amountRaw,
    hasHash: !!returnedHash,
    resultadoUrl,
    env: process.env.AZUL_ENV
  })

  // ── Determinar si fue APROBADO de forma segura ──────────────────────────────
  // SEGURIDAD: usar ÚNICAMENTE IsoCode=00 de AZUL — nunca confiar en parámetros
  // de URL que podrían ser manipulados (como resultado=aprobado)
  const isoAprobado = isoCode === '00'

  // En sandbox AZUL puede no enviar hash — permitir si hash ausente en sandbox
  const isProduction = process.env.AZUL_ENV === 'production'
  let hashValido = false
  if (returnedHash) {
    hashValido = validateResponseHash(p, returnedHash)
    if (!hashValido) {
      console.error('[AZUL/retorno] AuthHash INVÁLIDO — posible manipulación:', {
        orderNumber,
        returnedHash: returnedHash.slice(0, 20) + '...'
      })
    }
  }

  // En producción el hash es obligatorio para aprobar
  const esAprobado = isProduction
    ? isoAprobado && hashValido
    : isoAprobado  // sandbox: solo IsoCode (AZUL sandbox puede no enviar hash)

  let orderId = ''

  if (orderNumber) {
    try {
      // Buscar la orden por numero_orden (AZUL devuelve nuestro OrderNumber)
      const { data: order, error: findErr } = await sb
        .from('orders')
        .select('id, pago_estado, total, user_id')
        .eq('numero_orden', orderNumber)
        .single()

      if (findErr || !order) {
        console.error('[AZUL/retorno] orden no encontrada:', orderNumber, findErr?.message)
      } else {
        orderId = order.id

        // SEGURIDAD: Protección replay — solo procesar si aún está pendiente
        if (order.pago_estado !== 'pendiente') {
          console.warn('[AZUL/retorno] orden ya procesada (replay bloqueado):', {
            orderNumber,
            pago_estado: order.pago_estado
          })
          // Redirigir sin modificar nada
          const confirmUrl = new URL('/confirmacion', BASE)
          confirmUrl.searchParams.set('orden',     orderId)
          confirmUrl.searchParams.set('origen',    'azul')
          confirmUrl.searchParams.set('resultado', order.pago_estado === 'pagado' ? 'aprobado' : 'declinado')
          return NextResponse.redirect(confirmUrl.toString(), { status: 302 })
        }

        if (esAprobado) {
          // SEGURIDAD: Validar que el Amount de AZUL coincide con el total de la orden
          if (amountRaw && order.total) {
            const amountAzul  = parseInt(amountRaw, 10)           // AZUL devuelve centavos
            const amountDb    = Math.round(Number(order.total) * 100)
            const diff        = Math.abs(amountAzul - amountDb)

            if (diff > 10) { // tolerancia de ±10 centavos por redondeo
              console.error('[AZUL/retorno] MONTO NO COINCIDE — transacción rechazada:', {
                amountAzul,
                amountDb,
                diff,
                orderNumber
              })
              // Marcar como declinado por discrepancia de monto
              await sb.from('orders').update({
                pago_estado:        'declinado',
                azul_order_number:  orderNumber,
                azul_response_code: 'AMOUNT_MISMATCH',
              }).eq('id', orderId)

              const confirmUrl = new URL('/confirmacion', BASE)
              confirmUrl.searchParams.set('orden',     orderId)
              confirmUrl.searchParams.set('origen',    'azul')
              confirmUrl.searchParams.set('resultado', 'declinado')
              return NextResponse.redirect(confirmUrl.toString(), { status: 302 })
            }
          }

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

            // ── Loyalty: 1 punto por cada RD$10 gastado ───────────────────
            try {
              const pts = Math.floor(Number(amountRaw || 0) / 100 / 10)  // AZUL devuelve centavos
              if (pts > 0 && order.user_id) {
                await sb.from('loyalty_points').upsert(
                  { user_id: order.user_id, points: pts, level: 'bronze', total_spent: parseInt(amountRaw||'0',10)/100, orders_count: 1 },
                  { onConflict: 'user_id', ignoreDuplicates: false }
                )
              }
            } catch { /* loyalty no bloquea el flujo */ }

          if (updateErr) {
            console.error('[AZUL/retorno] ERROR actualizando orden:', updateErr.message)
          }
          // Activar suscripciones pendientes de esta orden
          if (!updateErr) {
            await sb.from('subscriptions')
              .update({ activa: true })
              .eq('order_id_origen', orderId)
              .eq('activa', false)
              .is('cancelada', false)
            // Marcar orden con flag de suscripción
            await sb.from('orders')
              .update({ tiene_suscripcion: true })
              .eq('id', orderId)
              .in('id', (
                await sb.from('subscriptions').select('order_id_origen').eq('order_id_origen', orderId).then(r => [orderId])
              ).filter(Boolean))
          }

          // El notify lo dispara el cliente desde /confirmacion (más confiable en Vercel)

        } else {
          // Pago declinado — registrar el intento y cancelar la orden
          await sb.from('orders').update({
            pago_estado:        'declinado',
            estado:             'cancelado',  // No mostrar como pedido activo en admin
            azul_order_number:  orderNumber,
            azul_response_code: isoCode || responseCode || null,
          }).eq('id', orderId)

          console.log('[AZUL/retorno] declinado → cancelado:', { orderNumber, isoCode, responseCode })
        }
      }
    } catch (e) {
      console.error('[AZUL/retorno] excepción:', e)
    }
  } else {
    console.warn('[AZUL/retorno] sin OrderNumber en la respuesta')
  }

  // ── Redirigir a /confirmacion ───────────────────────────────────────────────
  const confirmUrl = new URL('/confirmacion', BASE)
  if (orderId)     confirmUrl.searchParams.set('orden',         orderId)
  if (azulOrderId) confirmUrl.searchParams.set('azul_order_id', azulOrderId)
  confirmUrl.searchParams.set('origen',    'azul')
  confirmUrl.searchParams.set('resultado', esAprobado ? 'aprobado' : 'declinado')

  return NextResponse.redirect(confirmUrl.toString(), { status: 302 })
}

export async function GET(req: NextRequest)  { return handleReturn(req) }
export async function POST(req: NextRequest) { return handleReturn(req) }
