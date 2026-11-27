import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function sbAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
function wait(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }
function esc(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ?? c))
}

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req, { limitPerMin: 3, requireOrigin: true })
  if (guardErr) return guardErr
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY no está configurado.' }, { status: 500 })
  }

  const sb = sbAdmin()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
  const from = process.env.RESEND_FROM ?? 'ContactGo <notifications@contactgo.net>'

  try {
    const { data: orders, error: ordersError } = await sb.from('orders')
      .select('cliente_nombre,cliente_email,cliente_telefono')
      .eq('canal', 'whatsapp')
      .is('user_id', null)
      .not('cliente_email', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1000)
    if (ordersError) throw ordersError

    const byEmail = new Map<string, { nombre: string; telefono: string }>()
    for (const order of orders ?? []) {
      const email = String(order.cliente_email ?? '').trim().toLowerCase()
      if (!email || !email.includes('@')) continue
      if (!byEmail.has(email)) byEmail.set(email, {
        nombre: String(order.cliente_nombre ?? 'Cliente ContactGo').trim(),
        telefono: String(order.cliente_telefono ?? '').trim(),
      })
    }

    const { data: profiles, error: profilesError } = await sb.from('profiles')
      .select('id,email,role')
      .not('email', 'is', null)
      .limit(5000)
    if (profilesError) throw profilesError
    const profileByEmail = new Map((profiles ?? []).map(p => [String(p.email ?? '').trim().toLowerCase(), p]))

    const { data: userList, error: usersError } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (usersError) throw usersError
    const authByEmail = new Map((userList.users ?? []).filter(u => u.email).map(u => [String(u.email).toLowerCase(), u]))

    const summary = { encontrados: byEmail.size, creadas: 0, correos_enviados: 0, ya_existian: 0, errores: 0, detalle: [] as Array<{ email: string; resultado: string; error?: string }> }

    for (const [email, customer] of byEmail) {
      let createdUserId: string | null = null
      try {
        const existingProfile = profileByEmail.get(email)
        const existingAuth = authByEmail.get(email)

        if (existingProfile || existingAuth) {
          // No duplicar cuentas ni cambiar contraseñas existentes. Tampoco
          // enviar recovery links a usuarios que ya tenían cuenta.
          summary.ya_existian++
          summary.detalle.push({ email, resultado: 'Cuenta existente; no modificada' })
          continue
        }

        const { data: created, error: createError } = await sb.auth.admin.createUser({
          email,
          password: crypto.randomUUID(),
          email_confirm: true,
          user_metadata: {
            nombre: customer.nombre,
            telefono: customer.telefono,
            origen: 'venta_whatsapp',
            requiere_configurar_password: true,
          },
        })
        if (createError || !created.user) throw new Error(createError?.message ?? 'No se pudo crear el usuario.')
        createdUserId = created.user.id

        const { error: profileError } = await sb.from('profiles').insert({
          id: created.user.id,
          nombre: customer.nombre,
          email,
          telefono: customer.telefono,
          role: 'customer',
          activo: true,
        })
        if (profileError) {
          await sb.auth.admin.deleteUser(created.user.id)
          createdUserId = null
          throw new Error('No se pudo crear el perfil; se revirtió el usuario para evitar una cuenta incompleta. ' + profileError.message)
        }

        const { data: linkData, error: linkError } = await sb.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: { redirectTo: `${base}/auth/callback?next=/cuenta/reset-password` },
        })
        const tokenHash = linkData?.properties?.hashed_token
        if (linkError || !tokenHash) throw new Error(linkError?.message ?? 'No se pudo generar el enlace seguro.')

        const setupUrl = `${base}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=recovery&next=/cuenta/reset-password`
        const firstName = esc(customer.nombre.split(/\s+/)[0] || 'Cliente')
        const html = `<!doctype html><html lang="es"><meta charset="utf-8"><body style="margin:0;padding:28px 12px;background:#f3f6fa;font-family:Arial,sans-serif;color:#172b4d"><div style="max-width:580px;margin:auto;background:#fff;border-radius:14px;padding:32px"><div style="font-size:24px;font-weight:800;color:#002455">ContactGo</div><h1 style="font-size:22px;color:#002455">Tu cuenta ya está registrada</h1><p style="font-size:14px;line-height:1.7;color:#52647a">Hola ${firstName}, creamos tu cuenta de ContactGo con este correo porque realizaste una compra por WhatsApp. Solo necesitas establecer tu contraseña para acceder y consultar tus pedidos.</p><p style="margin:26px 0"><a href="${esc(setupUrl)}" style="display:inline-block;padding:14px 22px;background:#002455;border-radius:8px;color:#fff;text-decoration:none;font-weight:700">Establecer mi contraseña</a></p><p style="font-size:11px;line-height:1.6;color:#718096">Este enlace es personal y temporal. Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p><p style="margin-top:24px;font-size:12px;color:#718096">ContactGo · contactgo.net</p></div></body></html>`
        const { error: sendError } = await resend.emails.send({
          from, to: email, subject: 'Tu cuenta de ContactGo está lista: establece tu contraseña', html,
        })
        if (sendError) throw new Error(sendError.message)

        summary.creadas++
        summary.correos_enviados++
        summary.detalle.push({ email, resultado: 'Cuenta creada y correo aceptado por Resend' })
        // Small pause to avoid burst limits while processing the batch.
        await wait(350)
      } catch (error: any) {
        // If this run created the account but could not finish the secure
        // password email, roll it back so a later retry cannot strand it.
        if (createdUserId) {
          await sb.from('profiles').delete().eq('id', createdUserId)
          await sb.auth.admin.deleteUser(createdUserId)
        }
        summary.errores++
        summary.detalle.push({ email, resultado: 'No se completó; se revirtió la cuenta creada en este intento', error: error?.message ?? 'Error desconocido' })
      }
    }

    return NextResponse.json({ ok: true, summary })
  } catch (error: any) {
    console.error('[regularizar-cuentas-whatsapp]', error?.message)
    return NextResponse.json({ error: error?.message ?? 'No se pudo completar la regularización.' }, { status: 500 })
  }
}
