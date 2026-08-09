// ============================================================
// ContactGo — POST /api/admin/backfill-clientes-whatsapp
// Utilidad de un solo uso (pero segura de repetir): convierte en
// clientes registrados reales a los pedidos de venta por WhatsApp que
// quedaron con user_id=null antes del fix del 2026-08-02. Reutiliza
// exactamente la misma lógica que ahora corre automáticamente en
// /api/venta-wa/[token] para cada pedido nuevo.
//
// Idempotente: solo toca pedidos con user_id IS NULL, así que correrlo
// dos veces no duplica nada — la segunda vez simplemente no encuentra
// nada que hacer.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-guard'

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  // FIX AUDITORÍA (2026-08-09): el secreto vivía escrito literal en el
  // código fuente (visible para cualquiera con acceso al repo, aunque sea
  // privado — mala práctica de todas formas). Ahora vive en variable de
  // entorno, y se agrega requireAdmin() como segunda capa: aunque el
  // secreto se filtrara, hace falta ADEMÁS una sesión de admin real.
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.BACKFILL_SECRET || secret !== process.env.BACKFILL_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const sb = getSb()
  const resultados: any[] = []

  const { data: pedidos } = await sb
    .from('orders')
    .select('id, numero_orden, cliente_nombre, cliente_email, cliente_telefono, cliente_fecha_nacimiento, direccion_texto, ciudad')
    .is('user_id', null)
    .not('cliente_email', 'is', null)
    .order('created_at', { ascending: true })

  for (const o of pedidos ?? []) {
    const email = (o.cliente_email ?? '').trim().toLowerCase()
    if (!email) { resultados.push({ orden: o.numero_orden, resultado: 'sin_email' }); continue }

    try {
      let userId: string | null = null

      const { data: perfilExistente } = await sb
        .from('profiles').select('id').eq('email', email).eq('role', 'customer').maybeSingle()

      if (perfilExistente) {
        userId = perfilExistente.id
        resultados.push({ orden: o.numero_orden, email, resultado: 'perfil_ya_existia', user_id: userId })
      } else {
        const { data: authUser, error: authErr } = await sb.auth.admin.createUser({
          email,
          password: crypto.randomUUID(),
          email_confirm: true,
          user_metadata: { nombre: o.cliente_nombre, origen: 'backfill_venta_whatsapp' },
        })

        if (authErr) {
          const { data: lista } = await sb.auth.admin.listUsers()
          const existente = lista?.users?.find((u: any) => u.email?.toLowerCase() === email)
          if (existente) userId = existente.id
        } else {
          userId = authUser.user.id
        }

        if (userId) {
          const [dir, ...restoCiudad] = (o.direccion_texto ?? '').split(',')
          await sb.from('profiles').upsert({
            id: userId, nombre: o.cliente_nombre, email,
            telefono: o.cliente_telefono, direccion: dir?.trim() ?? null,
            ciudad: o.ciudad, fecha_nacimiento: o.cliente_fecha_nacimiento,
            role: 'customer', activo: true,
          })
          resultados.push({ orden: o.numero_orden, email, resultado: 'cliente_creado', user_id: userId })
        } else {
          resultados.push({ orden: o.numero_orden, email, resultado: 'error_sin_user_id' })
          continue
        }
      }

      // Vincular el pedido histórico a la cuenta recién creada/encontrada
      await sb.from('orders').update({ user_id: userId }).eq('id', o.id)
    } catch (e: any) {
      resultados.push({ orden: o.numero_orden, email, resultado: 'error', detalle: e.message })
    }
  }

  return NextResponse.json({
    ok: true,
    total_procesados: resultados.length,
    creados: resultados.filter(r => r.resultado === 'cliente_creado').length,
    reutilizados: resultados.filter(r => r.resultado === 'perfil_ya_existia').length,
    errores: resultados.filter(r => r.resultado?.includes('error')).length,
    detalle: resultados,
  })
}
