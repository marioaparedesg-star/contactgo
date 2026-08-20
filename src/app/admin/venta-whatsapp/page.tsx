'use client'
// ============================================================
// ContactGo — /admin/venta-whatsapp
// Genera links de venta por WhatsApp con selectores inteligentes
// por tipo de producto (esférico/tórico/multifocal/color/solución/gota).
// ============================================================
export const dynamic = 'force-dynamic'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Trash2, Copy, Link2, CheckCircle, Clock, XCircle, Search, DollarSign, RefreshCw, Eye } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

function fmtRD(n: number) { return 'RD$' + Number(n || 0).toLocaleString('es-DO') }

type OjoMode = 'OD' | 'OI' | 'AMBOS'

type ItemDraft = {
  product_id: string
  nombre: string
  marca?: string
  tipo: string
  precio: number
  precio_catalogo: number
  cantidad: number
  variantes: any // JSONB del producto (para color: {plano:{precio}}, para solucion: [{ml,precio}])
  ojo_mode: OjoMode
  sph_od?: string; sph_oi?: string
  cyl_od?: string; cyl_oi?: string
  axis_od?: string; axis_oi?: string
  add_od?: string; add_oi?: string
  modalidad?: 'plano' | 'graduado' // solo tipo color
  color?: string                   // solo tipo color
  size?: string                    // solo tipo solucion (ej "300ml")
}

// Tipos que llevan receta graduada (siempre o condicional)
const TIPOS_CON_RECETA = new Set(['esferico', 'torico', 'multifocal'])

export default function VentaWhatsAppAdmin() {
  const sb = createClient()

  const [productos, setProductos] = useState<any[]>([])
  const [coloresPorProducto, setColoresPorProducto] = useState<Record<string, string[]>>({})
  const [busqueda, setBusqueda] = useState('')
  const [items, setItems] = useState<ItemDraft[]>([])
  const [envio, setEnvio] = useState<number>(0)
  const [notas, setNotas] = useState('')
  const [creando, setCreando] = useState(false)
  const [linkGenerado, setLinkGenerado] = useState<string | null>(null)

  const [links, setLinks] = useState<any[]>([])
  const [cargandoLinks, setCargandoLinks] = useState(true)

  useEffect(() => {
    ;(async () => {
      // Traer productos con tipo y variantes
      const { data: prods } = await sb.from('products')
        .select('id, nombre, marca, precio, tipo, variantes, activo')
        .eq('activo', true)
        .order('nombre')
      setProductos(prods ?? [])

      // Traer colores disponibles de productos tipo "color"
      const colorProdIds = (prods ?? []).filter((p: any) => p.tipo === 'color').map((p: any) => p.id)
      if (colorProdIds.length) {
        const { data: inv } = await sb.from('product_inventory')
          .select('product_id, color')
          .in('product_id', colorProdIds)
          .not('color', 'is', null)
        const agrupados: Record<string, Set<string>> = {}
        ;(inv ?? []).forEach((r: any) => {
          if (!agrupados[r.product_id]) agrupados[r.product_id] = new Set()
          agrupados[r.product_id].add(r.color)
        })
        const out: Record<string, string[]> = {}
        Object.entries(agrupados).forEach(([k, v]) => { out[k] = Array.from(v).sort() })
        setColoresPorProducto(out)
      }
    })()
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
    const nuevo: ItemDraft = {
      product_id: p.id,
      nombre: p.nombre,
      marca: p.marca,
      tipo: p.tipo,
      precio: Number(p.precio),
      precio_catalogo: Number(p.precio),
      cantidad: 1,
      variantes: p.variantes,
      ojo_mode: 'AMBOS',
    }
    // Defaults por tipo
    if (p.tipo === 'color') {
      nuevo.modalidad = 'plano'
      // Precio plano si existe
      if (p.variantes?.plano?.precio) nuevo.precio = Number(p.variantes.plano.precio)
    }
    if (p.tipo === 'solucion' && Array.isArray(p.variantes) && p.variantes.length > 0) {
      // Preseleccionar la primera variante
      nuevo.size = p.variantes[0].ml
      nuevo.precio = Number(p.variantes[0].precio ?? p.precio)
    }
    setItems(prev => [...prev, nuevo])
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
    // Validación mínima: color tipo graduado requiere color elegido
    for (const it of items) {
      if (it.tipo === 'color' && !it.color) {
        return toast.error(`Elige el color para ${it.nombre}`)
      }
    }
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
            ojo_mode: i.ojo_mode,
            sph_od: i.sph_od || null, sph_oi: i.sph_oi || null,
            cyl_od: i.cyl_od || null, cyl_oi: i.cyl_oi || null,
            axis_od: i.axis_od || null, axis_oi: i.axis_oi || null,
            add_od: i.add_od || null, add_oi: i.add_oi || null,
            modalidad: i.modalidad || null,
            color: i.color || null,
            size: i.size || null,
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

  // ── Agregar producto a un pedido/link YA existente ──
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [busquedaEdit, setBusquedaEdit] = useState('')
  const [agregando, setAgregando] = useState(false)

  const resultadosEdit = useMemo(() => {
    const q = busquedaEdit.trim().toLowerCase()
    if (q.length < 2) return []
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.marca ?? '').toLowerCase().includes(q)
    ).slice(0, 6)
  }, [busquedaEdit, productos])

  const agregarItemExistente = async (link: any, producto: any) => {
    setAgregando(true)
    try {
      const body: any = { accion: 'agregar_item', product_id: producto.id, cantidad: 1 }
      if (link.order_id) body.order_id = link.order_id
      else body.link_id = link.id

      const r = await fetch('/api/venta-wa/admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!r.ok) { toast.error(j.error ?? 'No se pudo agregar'); return }

      toast.success(`${producto.nombre} agregado — nuevo total ${fmtRD(j.total)}`)
      setBusquedaEdit('')
      setEditandoId(null)
      cargarLinks()

      if (j.tipo === 'orden' && j.cliente_telefono) {
        const resumen = `Hola ${j.cliente_nombre?.split(' ')[0] ?? ''} 👋 Actualicé tu pedido *#${j.numero_orden}* — le agregué *${producto.nombre}*.\n\nNuevo total: *${fmtRD(j.total)}*\n\nEn cuanto confirmes te envío el link de pago. 💙`
        setTimeout(() => {
          if (confirm('Producto agregado a la orden. ¿Abrir WhatsApp para avisarle al cliente del nuevo total?')) {
            window.open(`https://wa.me/1${j.cliente_telefono}?text=${encodeURIComponent(resumen)}`, '_blank')
          }
        }, 300)
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setAgregando(false)
    }
  }

  const quitarItemExistente = async (link: any, itemId: string | null, itemIndex: number | null) => {
    if (!confirm('¿Quitar este producto del pedido?')) return
    const body: any = { accion: 'quitar_item' }
    if (link.order_id) { body.order_id = link.order_id; body.item_id = itemId }
    else { body.link_id = link.id; body.item_index = itemIndex }

    const r = await fetch('/api/venta-wa/admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const j = await r.json()
    if (!r.ok) { toast.error(j.error ?? 'No se pudo quitar'); return }
    toast.success(`Producto quitado — nuevo total ${fmtRD(j.total)}`)
    cargarLinks()
  }

  const ESTADO_BADGE: Record<string, { cls: string; icon: any; label: string }> = {
    pendiente:  { cls: 'bg-amber-50 text-amber-700 border-amber-200',  icon: Clock,       label: 'Esperando cliente' },
    completado: { cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: CheckCircle, label: 'Datos completados' },
    cancelado:  { cls: 'bg-red-50 text-red-600 border-red-200',        icon: XCircle,     label: 'Cancelado' },
    expirado:   { cls: 'bg-gray-100 text-gray-500 border-gray-200',    icon: Clock,       label: 'Expirado' },
  }

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
            className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30"
            placeholder="Buscar producto por nombre o marca…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {resultados.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
              {resultados.map(p => (
                <button key={p.id} onClick={() => agregarProducto(p)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex justify-between items-center text-sm">
                  <span>{p.nombre} <span className="text-gray-400 text-xs">· {p.marca} · {p.tipo}</span></span>
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
          <ItemRow
            key={idx}
            item={it}
            idx={idx}
            colores={coloresPorProducto[it.product_id] ?? []}
            onChange={patch => setItem(idx, patch)}
            onRemove={() => quitarItem(idx)}
          />
        ))}

        {/* Envío + notas + total */}
        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Envío (RD$)</label>
                <input type="number" min={0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30"
                  value={envio} onChange={e => setEnvio(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Nota interna (opcional)</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30"
                  placeholder="Ej: cliente de Instagram"
                  value={notas} onChange={e => setNotas(e.target.value)} />
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
                    <div className="text-sm text-gray-700 mt-1.5 space-y-0.5">
                      {(l.order ? (l.orderItems ?? []) : (l.items ?? [])).map((i: any, idx: number) => (
                        <div key={i.id ?? idx} className="flex items-start gap-1.5 group">
                          <span className="flex-1">
                            {i.cantidad}× {i.nombre}
                            <ItemDetalleTxt i={i} />
                          </span>
                          {!pagado && l.estado !== 'cancelado' && (l.order ? (l.orderItems ?? []).length > 1 : (l.items ?? []).length > 1) && (
                            <button
                              onClick={() => quitarItemExistente(l, i.id ?? null, idx)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity mt-0.5"
                              title="Quitar producto">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
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
                    {!pagado && l.estado !== 'cancelado' && (
                      <button
                        onClick={() => { setEditandoId(editandoId === l.id ? null : l.id); setBusquedaEdit('') }}
                        className="p-2 border rounded-lg hover:bg-blue-50 text-[#0B3D66]" title="Agregar producto">
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {editandoId === l.id && (
                  <div className="mt-3 pt-3 border-t relative">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      {l.order ? 'Agregar producto a esta orden — se recalcula el total y puedes avisarle al cliente' : 'Agregar producto a este link — el cliente lo verá cuando abra su link'}
                    </p>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        autoFocus
                        className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30"
                        placeholder="Buscar producto (ej: solución, gotas)…"
                        value={busquedaEdit}
                        onChange={e => setBusquedaEdit(e.target.value)}
                      />
                      {resultadosEdit.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
                          {resultadosEdit.map(p => (
                            <button key={p.id} disabled={agregando} onClick={() => agregarItemExistente(l, p)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex justify-between items-center text-sm disabled:opacity-50">
                              <span>{p.nombre} <span className="text-gray-400 text-xs">· {p.marca}</span></span>
                              <span className="font-semibold text-[#0B3D66]">{fmtRD(p.precio)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Componente ItemRow — inputs dinámicos según tipo de producto
// ============================================================
function ItemRow({
  item, idx, colores, onChange, onRemove,
}: {
  item: ItemDraft
  idx: number
  colores: string[]
  onChange: (patch: Partial<ItemDraft>) => void
  onRemove: () => void
}) {
  const inputCls = 'border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D66]/30 w-full'
  const labelCls = 'text-[10px] font-semibold uppercase tracking-wide text-gray-500 block mb-0.5'

  const necesitaReceta = TIPOS_CON_RECETA.has(item.tipo) ||
    (item.tipo === 'color' && item.modalidad === 'graduado')

  // ¿El multifocal es tórico? (Proclear Multifocal Toric)
  const esMultifocalToric = item.tipo === 'multifocal' && /toric/i.test(item.nombre)

  return (
    <div className="border rounded-xl p-4 mb-3 bg-gray-50/50">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <div className="font-medium text-gray-900 text-sm">{item.nombre}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{item.marca} · {item.tipo}</div>
        </div>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fila 1: Precio + Descuento + Cantidad + campos específicos del tipo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        <div>
          <label className={labelCls}>Precio (RD$)</label>
          <input type="number" className={inputCls} value={item.precio}
            onChange={e => onChange({ precio: Number(e.target.value) })} />
          {item.precio !== item.precio_catalogo && (
            <div className="text-[10px] text-amber-600 mt-0.5">Catálogo: {fmtRD(item.precio_catalogo)}</div>
          )}
        </div>
        <div>
          <label className={labelCls}>
            Descuento — {item.precio_catalogo > 0 ? Math.round((1 - item.precio / item.precio_catalogo) * 100) : 0}%
          </label>
          <input
            type="range" min={0} max={100} step={1}
            value={item.precio_catalogo > 0 ? Math.round((1 - item.precio / item.precio_catalogo) * 100) : 0}
            className="w-full accent-primary-600 h-9"
            onChange={e => {
              const pct = Number(e.target.value)
              const nuevoPrecio = Math.round(item.precio_catalogo * (1 - pct / 100))
              onChange({ precio: nuevoPrecio })
            }}
          />
          {item.precio === 0 && (
            <div className="text-[10px] text-red-500 mt-0.5 font-semibold">Gratis (100%)</div>
          )}
        </div>
        <div>
          <label className={labelCls}>Cantidad</label>
          <input type="number" min={1} className={inputCls} value={item.cantidad}
            onChange={e => onChange({ cantidad: Math.max(1, Number(e.target.value)) })} />
        </div>

        {/* SOLUCIÓN con variantes de tamaño */}
        {item.tipo === 'solucion' && Array.isArray(item.variantes) && item.variantes.length > 0 && (
          <div className="col-span-2">
            <label className={labelCls}>Tamaño</label>
            <select className={inputCls} value={item.size ?? ''}
              onChange={e => {
                const v = item.variantes.find((x: any) => x.ml === e.target.value)
                onChange({ size: e.target.value, precio: v ? Number(v.precio) : item.precio })
              }}>
              {item.variantes.map((v: any) => (
                <option key={v.ml} value={v.ml}>{v.label ?? `${v.ml} — ${fmtRD(v.precio)}`}</option>
              ))}
            </select>
          </div>
        )}

        {/* COLOR: modalidad plano/graduado + dropdown de color */}
        {item.tipo === 'color' && (
          <>
            <div>
              <label className={labelCls}>Modalidad</label>
              <select className={inputCls} value={item.modalidad ?? 'plano'}
                onChange={e => {
                  const mod = e.target.value as 'plano' | 'graduado'
                  const precioNuevo = mod === 'plano' && item.variantes?.plano?.precio
                    ? Number(item.variantes.plano.precio)
                    : item.precio_catalogo
                  onChange({ modalidad: mod, precio: precioNuevo })
                }}>
                <option value="plano">Plano (sin graduación){item.variantes?.plano?.precio ? ` — ${fmtRD(item.variantes.plano.precio)}` : ''}</option>
                <option value="graduado">Con graduación — {fmtRD(item.precio_catalogo)}</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <select className={inputCls} value={item.color ?? ''}
                onChange={e => onChange({ color: e.target.value })}>
                <option value="">— Elegir color —</option>
                {colores.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Selector de ojo + inputs de receta */}
      {necesitaReceta && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span className={labelCls + ' !mb-0'}>Receta</span>
            <div className="ml-auto flex gap-1">
              {(['OD', 'OI', 'AMBOS'] as OjoMode[]).map(mode => (
                <button key={mode} type="button"
                  onClick={() => onChange({ ojo_mode: mode })}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                    item.ojo_mode === mode
                      ? 'bg-[#0B3D66] text-white border-[#0B3D66]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {mode === 'OD' ? 'Solo OD' : mode === 'OI' ? 'Solo OI' : 'Ambos ojos'}
                </button>
              ))}
            </div>
          </div>

          <RecetaGrid
            item={item}
            onChange={onChange}
            esToric={item.tipo === 'torico' || esMultifocalToric}
            esMultifocal={item.tipo === 'multifocal'}
            inputCls={inputCls}
            labelCls={labelCls}
          />

          {item.ojo_mode === 'AMBOS' && (
            <p className="text-[10px] text-gray-400 mt-2">
              💡 Deja igual las dos columnas si ambos ojos usan la misma receta, o llena distinto si son diferentes.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// RecetaGrid — muestra columnas de receta según ojo_mode
// ============================================================
function RecetaGrid({
  item, onChange, esToric, esMultifocal, inputCls, labelCls,
}: {
  item: ItemDraft
  onChange: (patch: Partial<ItemDraft>) => void
  esToric: boolean
  esMultifocal: boolean
  inputCls: string
  labelCls: string
}) {
  // Campos por columna (por ojo)
  const camposPorOjo = ['SPH', ...(esToric ? ['CYL', 'EJE'] : []), ...(esMultifocal ? ['ADD'] : [])]

  const colsPorOjo = camposPorOjo.length
  const showOD = item.ojo_mode === 'OD' || item.ojo_mode === 'AMBOS'
  const showOI = item.ojo_mode === 'OI' || item.ojo_mode === 'AMBOS'

  const getVal = (campo: string, ojo: 'od' | 'oi'): string => {
    const k = `${campo.toLowerCase().replace('eje', 'axis')}_${ojo}` as keyof ItemDraft
    return (item[k] as string) ?? ''
  }
  const setVal = (campo: string, ojo: 'od' | 'oi', v: string) => {
    const k = `${campo.toLowerCase().replace('eje', 'axis')}_${ojo}` as keyof ItemDraft
    onChange({ [k]: v } as any)
  }

  const placeholder = (campo: string) => ({
    SPH: '-2.50', CYL: '-1.25', EJE: '180', ADD: '+2.00 / LOW',
  }[campo] || '')

  return (
    <div className="space-y-2">
      {showOD && (
        <div>
          <div className="text-[10px] font-bold text-[#0B3D66] mb-1">
            {item.ojo_mode === 'OD' ? 'Ojo derecho (OD)' : 'OD — Ojo derecho'}
          </div>
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${colsPorOjo}, minmax(0, 1fr))` }}>
            {camposPorOjo.map(c => (
              <div key={c}>
                <label className={labelCls}>{c}</label>
                <input className={inputCls} placeholder={placeholder(c)}
                  value={getVal(c, 'od')}
                  onChange={e => setVal(c, 'od', e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}
      {showOI && (
        <div>
          <div className="text-[10px] font-bold text-[#0B3D66] mb-1">
            {item.ojo_mode === 'OI' ? 'Ojo izquierdo (OI)' : 'OI — Ojo izquierdo'}
          </div>
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${colsPorOjo}, minmax(0, 1fr))` }}>
            {camposPorOjo.map(c => (
              <div key={c}>
                <label className={labelCls}>{c}</label>
                <input className={inputCls} placeholder={placeholder(c)}
                  value={getVal(c, 'oi')}
                  onChange={e => setVal(c, 'oi', e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ItemDetalleTxt — muestra receta/color/tamaño en la lista de links
// ============================================================
function ItemDetalleTxt({ i }: { i: any }) {
  const parts: string[] = []

  if (i.size) parts.push(i.size)
  if (i.color) parts.push(i.color)
  if (i.modalidad === 'plano') parts.push('Plano')

  const buildOjo = (ojo: 'od' | 'oi') => {
    const sph = i[`sph_${ojo}`]
    const cyl = i[`cyl_${ojo}`]
    const axis = i[`axis_${ojo}`]
    const add = i[`add_${ojo}`]
    const bits: string[] = []
    if (sph != null && sph !== '') bits.push(`SPH ${sph}`)
    if (cyl != null && cyl !== '') bits.push(`CYL ${cyl}`)
    if (axis != null && axis !== '') bits.push(`EJE ${axis}`)
    if (add != null && add !== '') bits.push(`ADD ${add}`)
    return bits.length ? bits.join(' ') : null
  }

  const od = buildOjo('od')
  const oi = buildOjo('oi')

  // Fallback compatibilidad campos viejos (sph, cyl, axis, add_power a secas)
  if (!od && !oi) {
    const legacy: string[] = []
    if (i.sph != null && i.sph !== '') legacy.push(`SPH ${i.sph}`)
    if (i.cyl != null && i.cyl !== '') legacy.push(`CYL ${i.cyl}`)
    if (i.axis != null && i.axis !== '') legacy.push(`EJE ${i.axis}`)
    if (i.add_power) legacy.push(`ADD ${i.add_power}`)
    if (legacy.length) parts.push(legacy.join(' '))
  } else {
    if (i.ojo_mode === 'OD' && od) parts.push(`OD ${od}`)
    else if (i.ojo_mode === 'OI' && oi) parts.push(`OI ${oi}`)
    else {
      if (od) parts.push(`OD ${od}`)
      if (oi) parts.push(`OI ${oi}`)
    }
  }

  if (!parts.length) return null
  return <span className="text-xs text-gray-500 block ml-4">— {parts.join(' · ')}</span>
}
