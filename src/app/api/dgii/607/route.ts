// GET /api/dgii/607?mes=YYYYMM&formato=txt|json
// Genera el archivo 607 (Ventas) en formato DGII
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

const RNC_EMPRESA = process.env.DGII_RNC ?? '000000000'

export async function GET(req: NextRequest) {
  // Auth: solo admins
  try {
    const sbServer = createServerSupabaseClient()
    const { data: { user } } = await sbServer.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { data: profile } = await sbServer.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  } catch {
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 401 })
  }

  const mes     = req.nextUrl.searchParams.get('mes')
  const formato = req.nextUrl.searchParams.get('formato') ?? 'txt'

  if (!mes || !/^\d{6}$/.test(mes)) {
    return NextResponse.json({ error: 'Parámetro mes requerido: YYYYMM (ej: 202505)' }, { status: 400 })
  }

  const year  = parseInt(mes.slice(0, 4))
  const month = parseInt(mes.slice(4, 6))
  const desde = new Date(year, month - 1, 1).toISOString()
  const hasta = new Date(year, month, 0, 23, 59, 59).toISOString()

  const sb = getSb()
  const { data: orders, error } = await sb
    .from('orders')
    .select('*')
    .eq('pago_estado', 'pagado')
    .gte('pagado_en', desde)
    .lte('pagado_en', hasta)
    .not('ncf', 'is', null)
    .order('pagado_en', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!orders || orders.length === 0) {
    return NextResponse.json({ mensaje: `Sin ventas NCF en ${mes}`, total_registros: 0 })
  }

  const registros = orders.map(formatRegistro607)

  if (formato === 'json') {
    return NextResponse.json({
      periodo: mes, rnc_empresa: RNC_EMPRESA,
      total_registros: orders.length,
      total_monto: orders.reduce((s, o) => s + parseFloat(o.total ?? '0'), 0).toFixed(2),
      modo: orders[0]?.ncf_tipo?.startsWith('E') ? 'PRUEBA' : 'PRODUCCION',
      registros,
    })
  }

  // ── Formato TXT oficial DGII 607 ─────────────────────────────────────────
  const header = `607|${RNC_EMPRESA}|${mes}|${orders.length}`
  const lineas = registros.map(r => [
    r.rnc_comprador,
    r.tipo_id,
    r.ncf,
    '',
    r.fecha,
    r.fecha_vencimiento,
    r.monto_facturado,
    r.itbis_facturado,
    '0.00', '0.00', '0.00', '0.00',
    '0.00', // efectivo — contra entrega eliminado
    '0.00',
    r.metodo_pago === 'tarjeta'        ? r.monto_facturado : '0.00',
    r.metodo_pago === 'transferencia'  ? r.monto_facturado : '0.00',
    '0.00', '0.00', '0.00',
  ].join('|'))

  const txt = [header, ...lineas].join('\r\n')

  return new NextResponse(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="607_${RNC_EMPRESA}_${mes}.txt"`,
    }
  })
}

function formatRegistro607(o: any) {
  const d    = new Date(o.pagado_en ?? o.created_at)
  const fmt  = (dt: Date) => dt.toISOString().slice(0, 10).replace(/-/g, '')
  const venc = new Date(d); venc.setMonth(venc.getMonth() + 6)

  return {
    rnc_comprador:     o.cliente_rnc || '9999999999999',
    tipo_id:           o.cliente_rnc ? '1' : '3',
    ncf:               o.ncf,
    fecha:             fmt(d),
    fecha_vencimiento: fmt(venc),
    monto_facturado:   parseFloat(o.total ?? 0).toFixed(2),
    itbis_facturado:   '0.00',  // lentes de contacto exentos
    metodo_pago:       o.metodo_pago,
    numero_orden:      o.numero_orden,
    cliente:           o.cliente_nombre,
  }
}
