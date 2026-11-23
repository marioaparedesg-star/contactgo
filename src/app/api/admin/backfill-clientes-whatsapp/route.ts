// ContactGo — POST /api/admin/backfill-clientes-whatsapp
// Vincula pedidos históricos sin user_id a cuentas reales y envía un enlace
// de un solo uso para configurar contraseña cuando se crea una cuenta nueva.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const maxDuration = 60

function getSb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function setupEmailHtml(nombre: string, setupUrl: string): string {
  const safeName = escapeHtml(nombre || 'Cliente')
  const safeUrl = escapeHtml(setupUrl)
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"></head>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#172033">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px">
      <tr><td align="center"><table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#002455;padding:24px 28px;color:#fff;font-size:24px;font-weight:800">ContactGo</td></tr>
        <tr><td style="padding:28px">
          <h1 style="font-size:21px;color:#002455">Activa el acceso a tu cuenta</h1>
          <p>Hola ${safeName},</p>
          <p>Hemos asociado tus pedidos anteriores de ContactGo a esta cuenta. Para consultar tus pedidos, estados y detalles, configura tu contraseña personal.</p>
          <p style="text-align:center;padding:18px 0"><a href="${safeUrl}" style="background:#01b2b7;color:#002455;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:9px;display:inline-block">Configurar mi contraseña</a></p>
          <p style="font-size:12px;color:#718096">Este enlace es personal y de un solo uso. Si no solicitaste esta cuenta, ignora este correo.</p>
        </td></tr>
      </table></td></tr>
    </table>
  </body></html>`
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY no está configurada; no se procesaron pedidos.' }, { status: 503 })
  }

  const sb = getSb()
  const { data: orders, error: ordersError } = await sb.from('orders')
    .select('id, numero_orden, cliente_nombre, cliente_email, cliente_telefono, cliente_fecha_nacimiento, direccion_texto, ciudad')
    .is('user_id', null)
    .not('cliente_email', 'is', null)
    .order('created_at', { ascending: true })

  if (ordersError) {
    console.error('[backfill-clientes] Error leyendo pedidos:', ordersError.message)
    return NextResponse.json({ error: 'No se pudieron consultar los pedidos pendientes de vincular.' }, { status: 500 })
  }

  const groups = new Map<string, NonNullable<typeof orders>>()
  for (const order of orders ?? []) {
    const email = String(order.cliente_email ?? '').trim().toLowerCase()
    if (!email) continue
    const group = groups.get(email) ?? []
    group.push(order)
    groups.set(email, group)
  }

  const { data: authList, error: authListError } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (authListError) {
    console.error('[backfill-clientes] Error consultando Auth:', authListError.message)
    return NextResponse.json({ error: 'No se pudo verificar el registro de clientes.' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
  const from = process.env.RESEND_FROM ?? 'ContactGo <notifications@contactgo.net>'
  let linkedOrders = 0
  let accountsCreated = 0
  let setupEmailsSent = 0
  let errors = 0
  const skippedNoEmail = (orders ?? []).filter(o => !String(o.cliente_email ?? '').trim()).length
  const details: Array<{ status: string; orders: number }> = []

  for (const [email, customerOrders] of groups) {
    try {
      const { data: existingProfile, error: profileLookupError } = await sb.from('profiles')
        .select('id, nombre, role').eq('email', email).eq('role', 'customer').maybeSingle()
      if (profileLookupError) throw new Error('No se pudo verificar el perfil')

      let authUser = authList.users.find(u => u.email?.trim().toLowerCase() === email) ?? null
      let userId = existingProfile?.id ?? authUser?.id ?? null
      let newlyCreated = false

      if (!userId) {
        const first = customerOrders[0]
        const { data: created, error: createError } = await sb.auth.admin.createUser({
          email,
          password: crypto.randomUUID(),
          email_confirm: true,
          user_metadata: {
            nombre: first.cliente_nombre,
            origen: 'backfill_pedidos_historicos',
            requiere_configurar_password: true,
          },
        })
        if (createError || !created.user) throw new Error('No se pudo crear la cuenta')
        authUser = created.user
        userId = created.user.id
        newlyCreated = true
        accountsCreated++
      }

      if (!userId) throw new Error('No se pudo resolver el usuario')

      const firstOrder = customerOrders[0]
      const [direccion] = String(firstOrder.direccion_texto ?? '').split(',')
      const { error: profileUpsertError } = await sb.from('profiles').upsert({
        id: userId,
        nombre: existingProfile?.nombre || firstOrder.cliente_nombre,
        email,
        telefono: firstOrder.cliente_telefono,
        direccion: direccion?.trim() || null,
        ciudad: firstOrder.ciudad,
        fecha_nacimiento: firstOrder.cliente_fecha_nacimiento,
        role: 'customer',
        activo: true,
      })
      if (profileUpsertError) throw new Error('No se pudo completar el perfil')

      const requiresSetup = newlyCreated || authUser?.user_metadata?.requiere_configurar_password === true
      if (requiresSetup) {
        const { data: generated, error: linkError } = await sb.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: { redirectTo: `${base}/auth/callback?next=/cuenta/reset-password` },
        })
        if (linkError || !generated?.properties?.hashed_token) throw new Error('No se pudo generar el enlace de contraseña')
        const setupUrl = `${base}/auth/callback?token_hash=${encodeURIComponent(generated.properties.hashed_token)}&type=recovery&next=/cuenta/reset-password`
        const { error: sendError } = await resend.emails.send({
          from,
          to: email,
          subject: 'Activa tu cuenta de ContactGo',
          html: setupEmailHtml(firstOrder.cliente_nombre ?? '', setupUrl),
        })
        if (sendError) throw new Error('No se pudo enviar el correo de activación')
        setupEmailsSent++
      }

      const ids = customerOrders.map(o => o.id)
      const { data: linked, error: linkOrdersError } = await sb.from('orders')
        .update({ user_id: userId })
        .in('id', ids)
        .is('user_id', null)
        .select('id')
      if (linkOrdersError) throw new Error('No se pudieron vincular los pedidos')
      linkedOrders += linked?.length ?? 0
      details.push({ status: requiresSetup ? 'cuenta_activada_por_correo' : 'cuenta_existente_vinculada', orders: linked?.length ?? 0 })
    } catch (error: any) {
      errors++
      console.error('[backfill-clientes] Error procesando cliente:', error?.message ?? error)
      details.push({ status: 'error', orders: customerOrders.length })
    }
  }

  return NextResponse.json({
    ok: errors === 0,
    pedidos_pendientes: orders?.length ?? 0,
    pedidos_vinculados: linkedOrders,
    cuentas_creadas: accountsCreated,
    correos_configuracion_enviados: setupEmailsSent,
    pedidos_sin_correo: skippedNoEmail,
    clientes_con_error: errors,
    detalle: details,
  }, { status: errors ? 207 : 200 })
}
