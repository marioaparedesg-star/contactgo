// /api/azul/retorno — recibe el retorno de AZUL (GET o POST)
// y redirige a /confirmacion con los datos del pago
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE = 'https://www.contactgo.net'

// Manejar tanto GET (query params) como POST (form data)
export async function GET(req: NextRequest) {
  return handleRetorno(req)
}
export async function POST(req: NextRequest) {
  return handleRetorno(req)
}

async function handleRetorno(req: NextRequest) {
  const url = new URL(req.url)
  
  // Leer params del query string (GET) o form body (POST)
  let params: Record<string, string> = {}
  
  // Query params primero
  url.searchParams.forEach((v, k) => { params[k] = v })
  
  // Si es POST, también leer el body
  if (req.method === 'POST') {
    try {
      const ct = req.headers.get('content-type') ?? ''
      if (ct.includes('application/x-www-form-urlencoded')) {
        const text = await req.text()
        new URLSearchParams(text).forEach((v, k) => { params[k] = v })
      } else if (ct.includes('application/json')) {
        const json = await req.json()
        Object.assign(params, json)
      }
    } catch {}
  }

  const orderId      = params['orden'] ?? params['OrderNumber'] ?? ''
  const resultado    = params['resultado'] ?? ''
  const azulOrderId  = params['AzulOrderId'] ?? params['azulOrderId'] ?? ''
  const responseCode = params['ResponseCode'] ?? params['responseCode'] ?? ''
  
  // Log para debug
  console.log('[AZUL/retorno]', { orderId, resultado, azulOrderId, responseCode, params })

  // Si hay AzulOrderId y la transacción fue aprobada, actualizar la orden
  if (azulOrderId && orderId && (resultado === 'aprobado' || responseCode === '00' || responseCode === '000')) {
    try {
      await sb.from('orders')
        .update({ 
          pago_estado: 'pagado', 
          estado: 'confirmado',
          azul_order_id: azulOrderId,
          azul_response_code: responseCode
        })
        .eq('id', orderId)
      
      // Enviar emails de notificación
      await fetch(`${BASE}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, evento: 'nuevo_pedido' })
      }).catch(console.error)
    } catch (e) {
      console.error('[AZUL/retorno] DB error:', e)
    }
  }

  // Redirigir a /confirmacion con los datos
  const confirmUrl = new URL('/confirmacion', BASE)
  if (orderId) confirmUrl.searchParams.set('orden', orderId)
  confirmUrl.searchParams.set('origen', 'azul')
  confirmUrl.searchParams.set('resultado', resultado || (azulOrderId ? 'aprobado' : 'error'))
  if (azulOrderId) confirmUrl.searchParams.set('azul_order_id', azulOrderId)

  return NextResponse.redirect(confirmUrl.toString())
}
