import { guardRequest } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/admin-guard'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { enviarNotificacionPedido } from '@/lib/email/order-notifications'

export const dynamic = 'force-dynamic'
function sbAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
function esc(v: unknown) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ?? c))
}
function money(v: number) { return 'RD$' + Number(v || 0).toLocaleString('es-DO') }

export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response
  const sb = sbAdmin()
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim()
  const [{ data: customers, error: ce }, { data: products, error: pe }] = await Promise.all([
    sb.from('profiles').select('id,nombre,email,telefono,direccion,ciudad,direccion_completa,activo')
      .eq('role','customer').eq('activo',true)
      .or(q ? `nombre.ilike.%${q}%,email.ilike.%${q}%,telefono.ilike.%${q}%` : 'id.eq.00000000-0000-0000-0000-000000000000')
      .order('nombre').limit(30),
    sb.from('products').select('id,nombre,marca,tipo,precio,variantes,activo')
      .eq('activo',true).order('nombre').limit(500)
  ])
  if (ce || pe) return NextResponse.json({error:'No se pudieron cargar clientes o productos'},{status:500})
  return NextResponse.json({customers:customers ?? [], products:products ?? []},{headers:{'Cache-Control':'no-store'}})
}

export async function POST(req: NextRequest) {
  const guardErr = guardRequest(req,{limitPerMin:20,requireOrigin:false})
  if (guardErr) return guardErr
  const auth = await requireAdmin()
  if (auth.ok === false) return auth.response
  try {
    const body = await req.json()
    const action = body.action
    const sb = sbAdmin()
    const customerId = String(body.customer_id ?? '')
    const items = Array.isArray(body.items) ? body.items : []
    if (!customerId || !items.length) return NextResponse.json({error:'Selecciona un cliente y agrega al menos un producto.'},{status:400})
    const {data:customer,error:customerErr} = await sb.from('profiles')
      .select('id,nombre,email,telefono,direccion,ciudad,direccion_completa').eq('id',customerId).eq('role','customer').single()
    if (customerErr || !customer) return NextResponse.json({error:'Cliente registrado no encontrado.'},{status:404})
    if (!customer.email) return NextResponse.json({error:'El cliente no tiene correo registrado.'},{status:400})

    const ids = [...new Set(items.map((i:any)=>String(i.product_id ?? '')))].filter(Boolean)
    const {data:products,error:productErr} = await sb.from('products')
      .select('id,nombre,precio,tipo,activo').in('id',ids)
    if (productErr) throw productErr
    const productMap = new Map((products ?? []).map((p:any)=>[p.id,p]))
    const finalItems = items.map((i:any)=>{
      const p:any = productMap.get(String(i.product_id))
      if (!p || !p.activo) throw new Error('Uno de los productos ya no está disponible.')
      const qty = Math.max(1,Math.min(100,Math.floor(Number(i.cantidad)||1)))
      const price = Number(i.precio)
      if (!Number.isFinite(price) || price < 0 || price > 10000000) throw new Error('Precio inválido.')
      return {
        product_id:p.id,nombre:p.nombre,precio:price,precio_original:Number(p.precio||0),
        cantidad:qty,subtotal:price*qty,
        sph_od:i.sph_od===''?null:i.sph_od ?? null,sph_oi:i.sph_oi===''?null:i.sph_oi ?? null,
        cyl_od:i.cyl_od===''?null:i.cyl_od ?? null,cyl_oi:i.cyl_oi===''?null:i.cyl_oi ?? null,
        axis_od:i.axis_od===''?null:i.axis_od ?? null,axis_oi:i.axis_oi===''?null:i.axis_oi ?? null,
        add_od:i.add_od||null,add_oi:i.add_oi||null, ojo_mode:i.ojo_mode||'AMBOS',
        ojo:i.ojo_mode||'AMBOS',color:i.color||null,size:i.size||null,modalidad:i.modalidad||null
      }
    })
    const subtotal = finalItems.reduce((s:number,i:any)=>s+i.subtotal,0)
    const envio = Math.max(0,Number(body.envio)||0)
    const descuento = Math.max(0,Number(body.descuento)||0)
    const total = Math.max(0,subtotal+envio-descuento)
    const notes = String(body.notas ?? '').slice(0,1500)

    if (action === 'quote') {
      if (!process.env.RESEND_API_KEY) return NextResponse.json({error:'El servicio de correo no está configurado.'},{status:503})
      const rows = finalItems.map((i:any)=>`<tr><td style="padding:12px;border-bottom:1px solid #e5e7eb">${esc(i.nombre)} × ${i.cantidad}</td><td style="padding:12px;text-align:right;border-bottom:1px solid #e5e7eb">${money(i.subtotal)}</td></tr>`).join('')
      const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033"><div style="background:#002455;padding:24px;color:white"><h1 style="margin:0">ContactGo</h1><p style="margin:6px 0 0">Cotización de productos</p></div><div style="padding:24px"><p>Hola ${esc(customer.nombre || 'cliente')},</p><p>Te compartimos la cotización solicitada. Los precios y disponibilidad están sujetos a confirmación al momento de crear el pedido.</p><table style="width:100%;border-collapse:collapse">${rows}<tr><td style="padding:10px">Subtotal</td><td style="text-align:right">${money(subtotal)}</td></tr><tr><td style="padding:10px">Envío</td><td style="text-align:right">${money(envio)}</td></tr><tr><td style="padding:10px">Descuento</td><td style="text-align:right">-${money(descuento)}</td></tr><tr><td style="padding:14px;font-weight:bold;border-top:2px solid #002455">Total cotizado</td><td style="text-align:right;font-weight:bold;border-top:2px solid #002455;color:#002455">${money(total)}</td></tr></table>${notes ? `<p><b>Notas:</b> ${esc(notes)}</p>` : ''}<p style="margin-top:28px">Para confirmar esta cotización, responde a este correo o contáctanos por WhatsApp.</p><p>ContactGo</p></div></div>`
      const resend = new Resend(process.env.RESEND_API_KEY)
      const {error} = await resend.emails.send({from:process.env.RESEND_FROM ?? 'ContactGo <notifications@contactgo.net>',to:customer.email,subject:'Tu cotización de ContactGo',html})
      if (error) return NextResponse.json({error:error.message},{status:502})
      return NextResponse.json({ok:true,message:`Cotización enviada a ${customer.email}`})
    }

    if (action !== 'create') return NextResponse.json({error:'Acción no válida.'},{status:400})
    const orderNum = `CG-${Date.now().toString().slice(-8)}`
    const address = String(body.direccion ?? customer.direccion_completa ?? customer.direccion ?? '').trim()
    const city = String(body.ciudad ?? customer.ciudad ?? '').trim()
    const {data:order,error:orderErr} = await sb.from('orders').insert({
      user_id:customer.id,cliente_nombre:customer.nombre,cliente_email:customer.email,
      cliente_telefono:customer.telefono, direccion_texto:[address,city].filter(Boolean).join(', '),
      ciudad:city,estado:'recibido',subtotal,envio,descuento,total,
      metodo_pago:'tarjeta',pago_estado:'pendiente',numero_orden:orderNum,
      canal:'admin',notas_admin:notes ? `[Pedido manual] ${notes}` : '[Pedido manual]'
    }).select('id,numero_orden').single()
    if (orderErr || !order) throw orderErr ?? new Error('No se pudo crear el pedido.')
    const rows = finalItems.map((i:any)=>({...i,order_id:order.id}))
    const {error:itemErr} = await sb.from('order_items').insert(rows)
    if (itemErr) {
      await sb.from('orders').delete().eq('id',order.id)
      throw itemErr
    }
    const notification = await enviarNotificacionPedido(order.id,'nuevo_pedido')
    return NextResponse.json({ok:true,order,notification})
  } catch (error:any) {
    console.error('[admin/crear-pedido]',error?.message)
    return NextResponse.json({error:error?.message ?? 'No se pudo procesar la solicitud.'},{status:500})
  }
}
