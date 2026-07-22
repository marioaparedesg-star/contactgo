'use client'
// ============================================================
// ContactGo — /admin/venta-whatsapp
// Genera links de venta por WhatsApp: elige productos, crea link,
// se lo envías al cliente, y cuando pague lo marcas como pagado.
// ============================================================
export const dynamic = 'force-dynamic'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, Copy, Link2, CheckCircle, Clock, XCircle, Search, DollarSign, RefreshCw } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

function fmtRD(n: number) { return 'RD$' + Number(n || 0).toLocaleString('es-DO') }

type ItemDraft = {
  product_id: string
  nombre: string
  precio: number
  precio_catalogo: number
  cantidad: number
  sph?: string; cyl?: string; axis?: string; add_power?: string
  sph_od?: string; sph_oi?: string
  color?: string; size?: string
}

export default function VentaWhatsAppAdmin() {
  const sb = createClient()

  const [productos, setProductos] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [items, setItems] = useState<ItemDraft[]>([])
  const [envio, setEnvio] = useState<number>(0)
  const [notas, setNotas] = useState('')
  const [creando, setCreando] = useState(false)
  const [linkGenerado, setLinkGenerado] = useState<string | null>(null)

  const [links, setLinks] = useState<any[]>([])
  const [cargandoLinks, setCargandoLinks] = useState(true)

  useEffect(() => {
    sb.from('products')
      .select('id, nombre, marca, precio, tipo, activo')
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => setProductos(data ?? []))
    cargarLinks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cargarLinks = async () => {
    setCargandoLinks(true)
    try {
      const r = await fetch('/api/venta-wa/admin')
      const j = await r.json()
      if (r.ok) setLinks(j.links ?? [])
    } finally {
      setCargandoLinks(false)
    }
  }

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (q.length < 2) return []
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.marca ?? '').toLowerCase().includes(q)
    ).slice(0, 8)
  }, [busqueda, productos])

  const agregarProducto = (p: any) => {
    setItems(prev => [...prev, {
      product_id: p.id, nombre: p.nombre,
      precio: Number(p.precio), precio_catalogo: Number(p.precio), cantidad: 1,
    }])
    setBusqueda('')
  }

  const setItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it))
  }
  const quitarItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const total = subtotal + (Number(envio) || 0)

  const crearLink = async () => {
    if (!items.length) return toast.error('Agrega al menos un producto')
    setCreando(true)
    setLinkGenerado(null)
    try {
      const r = await fetch('/api/venta-wa/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product_id,
            precio: i.precio,
            cantidad: i.cantidad,
            sph: i.sph || null, cyl: i.cyl || null, axis: i.axis || null,
            add_power: i.add_power || null,
            sph_od: i.sph_od || null, sph_oi: i.sph_oi || null,
            color: i.color || null, size: i.size || null,
          })),
          envio: Number(envio) || 0,
          notas: notas.trim() || null,
        }),
      })
      const j = await r.json()
      if (!r.ok) { toast.error(j.error ?? 'Error al crear link'); return }
      setLinkGenerado(j.link)
      setItems([]); setEnvio(0); setNotas('')
      toast.success('Link generado ✓')
      cargarLinks()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setCreando(false)
    }
  }

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto)
    toast.success('Copiado ✓')
  }

  const abrirWhatsApp = (url: string) => {
    const msg = encodeURIComponent(`¡Hola! 👋 Aquí está el link para completar tu pedido en ContactGo:\n\n${url}\n\nSolo completa tus datos y en seguida te envío el link de pago seguro. 💙`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const marcarPagado = async (order_id: string, numero: string) => {
    if (!confirm(`¿Marcar el pedido ${numero} como PAGADO? Esto lo confirma y notifica al cliente.`)) return
    const r = await fetch('/api/venta-wa/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'marcar_pagado', order_id }),
    })
    const j = await r.json()
    if (!r.ok) { toast.error(j.error ?? 'Error'); return }
    toast.success(`${numero} marcado como pagado ✓`)
    cargarLinks()
  }

  const cancelarLink = async (link_id: string) => {
    if (!confirm('¿Cancelar este link? El cliente ya no podrá usarlo.')) return
    const r = await fetch('/api/venta-wa/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'cancelar_link', link_id }),
    })
    if (r.ok) { toast.success('Link cancelado'); cargarLinks() }
    else toast.error('Error al cancelar')
  }

  const ESTADO_BADGE: Record<string, { cls: string; icon: any; label: string }> = {
    pendiente:  { cls: 'bg-amber-50 text-amber-700 border-amber-200',  icon: Clock,       label: 'Esperando cliente' },
    completado: { cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: CheckCircle, label: 'Datos completados' },
    cancelado:  { cls: 'bg-red-50 text-red-600 border-red-200',        icon: XCircle,     label: 'Cancelado' },
    expirado:   { cls: 'bg-gray-100 text-gray-500 border-gray-200',    icon: Clock,       label: 'Expirado' },
  }

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30'

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-1">
        <WhatsAppIcon className="w-7 h-7" />
        <h1 className="text-2xl font-bold text-gray-900">Venta por WhatsApp</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Arma el pedido, genera el link, envíaselo al cliente. Cuando complete sus datos te llega notificación y le envías el pago por AZUL.
      </p>

      {/* ── Crear nuevo link ─────────────────────────── */}
      <div className="bg-white rounded-2xl border shadow-sm p-5 mb-8">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Nuevo pedido</h2>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            className={`${inputCls} w-full pl-9`}
            placeholder="Buscar producto por nombre o marca…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {resultados.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
              {resultados.map(p => (
                <button key={p.id} onClick={() => agregarProducto(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex justify-between items-center text-sm">
                  <span>{p.nombre} <span className="text-gray-400 text-xs">· {p.marca}</span></span>
                  <span className="font-semibold text-[#0B3D66]">{fmtRD(p.precio)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Items */}
        {items.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-6 border border-dashed rounded-xl">
            Busca y agrega los productos que el cliente quiere
          </div>
        )}
        {items.map((it, idx) => (
          <div key={idx} className="border rounded-xl p-4 mb-3 bg-gray-50/50">
            <div className="flex justify-between items-start gap-3">
              <div className="font-medium text-gray-900 text-sm">{it.nombre}</div>
              <button onClick={() => quitarItem(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Precio (RD$)</label>
                <input type="number" className={`${inputCls} w-full`} value={it.precio}
                  onChange={e => setItem(idx, { precio: Number(e.target.value) })} />
                {it.precio !== it.precio_catalogo && (
                  <div className="text-[10px] text-amber-600 mt-0.5">Catálogo: {fmtRD(it.precio_catalogo)}</div>
                )}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Cantidad</label>
                <input type="number" min={1} className={`${inputCls} w-full`} value={it.cantidad}
                  onChange={e => setItem(idx, { cantidad: Math.max(1, Number(e.target.value)) })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">SPH OD (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="-2.50" value={it.sph_od ?? ''}
                  onChange={e => setItem(idx, { sph_od: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">SPH OI (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="-2.00" value={it.sph_oi ?? ''}
                  onChange={e => setItem(idx, { sph_oi: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">CYL (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="-1.25" value={it.cyl ?? ''}
                  onChange={e => setItem(idx, { cyl: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">EJE (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="180" value={it.axis ?? ''}
                  onChange={e => setItem(idx, { axis: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">ADD (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="LOW / +2.00" value={it.add_power ?? ''}
                  onChange={e => setItem(idx, { add_power: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Color (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="Gray, Honey…" value={it.color ?? ''}
                  onChange={e => setItem(idx, { color: e.target.value })} />
              </div>
            </div>
          </div>
        ))}

        {/* Envío + notas + total */}
        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Envío (RD$)</label>
                <input type="number" min={0} className={`${inputCls} w-full`} value={envio}
                  onChange={e => setEnvio(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Nota interna (opcional)</label>
                <input className={`${inputCls} w-full`} placeholder="Ej: cliente de Instagram" value={notas}
                  onChange={e => setNotas(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Subtotal {fmtRD(subtotal)} · Envío {fmtRD(envio)} · <span className="font-bold text-gray-900 text-base">Total {fmtRD(total)}</span>
              </div>
              <button onClick={crearLink} disabled={creando}
                className="bg-[#0B3D66] hover:bg-[#0d4a7c] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2">
                <Link2 className="w-4 h-4" /> {creando ? 'Generando…' : 'Generar link'}
              </button>
            </div>
          </>
        )}

        {/* Link generado */}
        {linkGenerado && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-green-800 mb-2">✅ Link listo para enviar:</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white border rounded-lg px-3 py-2 text-xs text-gray-700 overflow-x-auto">{linkGenerado}</code>
              <button onClick={() => copiar(linkGenerado)} className="p-2 bg-white border rounded-lg hover:bg-gray-50" title="Copiar">
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => abrirWhatsApp(linkGenerado)} className="p-2 bg-[#25D366] rounded-lg hover:opacity-90" title="Enviar por WhatsApp">
                <WhatsAppIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Links existentes ─────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">Ventas generadas</h2>
        <button onClick={cargarLinks} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {cargandoLinks ? (
        <div className="text-sm text-gray-400 py-8 text-center">Cargando…</div>
      ) : links.length === 0 ? (
        <div className="text-sm text-gray-400 py-8 text-center border border-dashed rounded-xl">Aún no has generado links de venta</div>
      ) : (
        <div className="space-y-3">
          {links.map(l => {
            const badge = ESTADO_BADGE[l.estado] ?? ESTADO_BADGE.pendiente
            const BadgeIcon = badge.icon
            const pagado = l.order?.pago_estado === 'pagado'
            return (
              <div key={l.id} className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2.5 py-0.5 ${badge.cls}`}>
                        <BadgeIcon className="w-3 h-3" /> {badge.label}
                      </span>
                      {pagado && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                          <DollarSign className="w-3 h-3" /> Pagado
                        </span>
                      )}
                      {l.order && <span className="text-xs font-bold text-[#0B3D66]">{l.order.numero_orden}</span>}
                      <span className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1.5">
                      {(l.items ?? []).map((i: any) => `${i.cantidad}× ${i.nombre}`).join(' · ')}
                    </div>
                    {l.order && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {l.order.cliente_nombre} · {l.order.cliente_telefono}
                      </div>
                    )}
                    {l.notas && <div className="text-[11px] text-gray-400 italic mt-0.5">{l.notas}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-gray-900">{fmtRD(l.total)}</span>
                    {l.estado === 'pendiente' && (
                      <>
                        <button onClick={() => copiar(l.url)} className="p-2 border rounded-lg hover:bg-gray-50" title="Copiar link">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => abrirWhatsApp(l.url)} className="p-2 bg-[#25D366] rounded-lg hover:opacity-90" title="Enviar por WhatsApp">
                          <WhatsAppIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => cancelarLink(l.id)} className="p-2 border rounded-lg hover:bg-red-50" title="Cancelar link">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    )}
                    {l.estado === 'completado' && l.order && !pagado && (
                      <button onClick={() => marcarPagado(l.order_id, l.order.numero_orden)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" /> Marcar pagado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
