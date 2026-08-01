'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  RefreshCw, CheckCircle2, XCircle, ShoppingCart, Package, Star, Repeat,
  AlertTriangle, Circle, TrendingUp, Clock,
} from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'

type LogEntry = {
  id: string
  telefono: string
  tipo: string
  estado: string
  error: string | null
  created_at: string
  delivered_at: string | null
  read_at: string | null
  attempt: number | null
}

const TIPO_INFO: Record<string, { label: string; icon: any; color: string }> = {
  confirmacion:  { label: 'Confirmación', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  envio:         { label: 'Envío', icon: Package, color: 'bg-blue-100 text-blue-700' },
  estado_recibido:      { label: 'Recibido', icon: Package, color: 'bg-blue-100 text-blue-700' },
  estado_pago_aprobado: { label: 'Pago aprobado', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  estado_preparando:    { label: 'Preparando', icon: Package, color: 'bg-blue-100 text-blue-700' },
  estado_fabricante:    { label: 'Fabricante', icon: Package, color: 'bg-blue-100 text-blue-700' },
  estado_transito:      { label: 'Tránsito', icon: Package, color: 'bg-blue-100 text-blue-700' },
  estado_entregado:     { label: 'Entregado', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  resena:        { label: 'Reseña', icon: Star, color: 'bg-amber-100 text-amber-700' },
  renovacion:    { label: 'Renovación', icon: Repeat, color: 'bg-purple-100 text-purple-700' },
  carrito:       { label: 'Carrito', icon: ShoppingCart, color: 'bg-pink-100 text-pink-700' },
  pago_fallido:  { label: 'Pago Fallido', icon: XCircle, color: 'bg-orange-100 text-orange-700' },
  cross_sell:    { label: 'Cross-sell', icon: ShoppingCart, color: 'bg-indigo-100 text-indigo-700' },
}

// esperadoCadaDias: cada cuántos días como máximo se espera ver al menos 1 envío
// exitoso si el negocio tiene actividad normal (señal, no exacto).
const SISTEMAS = [
  { tipo: 'estado_entregado', label: 'Seguimiento de pedido', desc: 'Recibido → pagado → preparando → tránsito → entregado', esperadoCadaDias: 7 },
  { tipo: 'carrito',          label: 'Carrito abandonado', desc: 'WhatsApp 2-24h después de abandonar', esperadoCadaDias: 10 },
  { tipo: 'pago_fallido',     label: 'Cancelación de pendientes', desc: 'Aviso cuando expira un pedido sin pagar', esperadoCadaDias: 14 },
  { tipo: 'resena',           label: 'Solicitud de reseña', desc: 'Email 3-45 días post-entrega', esperadoCadaDias: 14 },
  { tipo: 'cross_sell',       label: 'Cross-sell (solución/gotas)', desc: 'Email 15 días post-compra', esperadoCadaDias: 20 },
]

function tiempoDesde(fecha: string | null): string {
  if (!fecha) return 'nunca'
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000)
  if (dias === 0) return 'hoy'
  if (dias === 1) return 'ayer'
  return `hace ${dias} días`
}

export default function WhatsAppAutomationDashboard() {
  const sb = createClient()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [salud, setSalud] = useState<any[]>([])
  const [recompra, setRecompra] = useState({ registrados: 0, n7: 0, n3: 0, n0: 0 })
  const [resenas, setResenas] = useState({ entregados: 0, solicitadas: 0, elegiblesAhora: 0, huerfanas: 0 })
  const [carritos, setCarritos] = useState({ total: 0, notificados: 0, convertidos: 0 })
  const [suscripciones, setSuscripciones] = useState({ activas: 0, automaticas: 0, manuales: 0, proximasHoy: 0 })

  const cargarDatos = async () => {
    setLoading(true)

    const { data } = await sb.from('wa_automation_log').select('*')
      .order('created_at', { ascending: false }).limit(100)
    if (data) setLogs(data)

    const hace30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const saludCalculada = await Promise.all(SISTEMAS.map(async (sis) => {
      const { data: ultimos } = await sb.from('wa_automation_log')
        .select('estado, created_at')
        .eq('tipo', sis.tipo)
        .gt('created_at', hace30d)
        .order('created_at', { ascending: false })

      const registros = ultimos ?? []
      const exitosos = registros.filter(r => r.estado === 'sent')
      const fallidos = registros.filter(r => r.estado === 'failed')
      const ultimoExito = exitosos[0]?.created_at ?? null
      const diasSinExito = ultimoExito ? Math.floor((Date.now() - new Date(ultimoExito).getTime()) / 86400000) : 999

      let status: 'ok' | 'revisar' | 'roto' = 'ok'
      if (registros.length === 0) status = 'roto'
      else if (diasSinExito > sis.esperadoCadaDias * 2) status = 'roto'
      else if (fallidos.length > exitosos.length || diasSinExito > sis.esperadoCadaDias) status = 'revisar'

      return { ...sis, exitosos: exitosos.length, fallidos: fallidos.length, ultimoExito, status }
    }))
    setSalud(saludCalculada)

    const { data: rc } = await sb.from('recompra_notifications')
      .select('notificado_7, notificado_3, notificado_0')
    setRecompra({
      registrados: rc?.length ?? 0,
      n7: (rc ?? []).filter(r => r.notificado_7).length,
      n3: (rc ?? []).filter(r => r.notificado_3).length,
      n0: (rc ?? []).filter(r => r.notificado_0).length,
    })

    const { data: entregados } = await sb.from('orders')
      .select('resena_solicitada, updated_at')
      .eq('estado', 'entregado')
    const total = entregados?.length ?? 0
    const solicitadas = (entregados ?? []).filter(o => o.resena_solicitada).length
    const hace3d = Date.now() - 3 * 86400000
    const hace45d = Date.now() - 45 * 86400000
    const elegiblesAhora = (entregados ?? []).filter(o =>
      !o.resena_solicitada && new Date(o.updated_at).getTime() <= hace3d && new Date(o.updated_at).getTime() >= hace45d
    ).length
    const huerfanas = (entregados ?? []).filter(o =>
      !o.resena_solicitada && new Date(o.updated_at).getTime() < hace45d
    ).length
    setResenas({ entregados: total, solicitadas, elegiblesAhora, huerfanas })

    const { data: ca } = await sb.from('carritos_abandonados').select('wa_enviado, convertido')
    setCarritos({
      total: ca?.length ?? 0,
      notificados: (ca ?? []).filter(c => c.wa_enviado).length,
      convertidos: (ca ?? []).filter(c => c.convertido).length,
    })

    const { data: subs } = await sb.from('subscriptions')
      .select('activa, creada_automaticamente, proximo_envio')
      .eq('cancelada', false)
    const hoy = new Date().toISOString().split('T')[0]
    setSuscripciones({
      activas: (subs ?? []).filter(s => s.activa).length,
      automaticas: (subs ?? []).filter(s => s.creada_automaticamente).length,
      manuales: (subs ?? []).filter(s => !s.creada_automaticamente).length,
      proximasHoy: (subs ?? []).filter(s => s.activa && s.proximo_envio === hoy).length,
    })

    setLoading(false)
  }

  useEffect(() => { cargarDatos() }, [])

  const STATUS_INFO = {
    ok:      { label: 'Saludable', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    revisar: { label: 'Revisar', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    roto:    { label: 'Sin actividad', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  }

  return (
    <div className="p-4 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <WhatsAppIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Salud de Automatizaciones</h1>
            <p className="text-xs text-gray-500">Estado real de cada sistema · Últimos 30 días</p>
          </div>
        </div>
        <button onClick={cargarDatos} className="p-2 hover:bg-gray-100 rounded-lg">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ═══ SALUD POR SISTEMA ═══ */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Estado de cada sistema</h2>
        </div>
        <div className="divide-y">
          {salud.map(sis => {
            const info = STATUS_INFO[sis.status as keyof typeof STATUS_INFO]
            return (
              <div key={sis.tipo} className="flex items-center gap-3 px-4 py-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${info.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{sis.label}</p>
                  <p className="text-[11px] text-gray-400">{sis.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${info.color}`}>
                    {info.label}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {sis.exitosos} enviados{sis.fallidos > 0 && `, ${sis.fallidos} fallidos`} · último {tiempoDesde(sis.ultimoExito)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ RECOMPRA ═══ */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Recordatorio de recompra (cupón 7-3-0 días antes de agotarse)</h2>
        </div>
        <div className="grid grid-cols-4 divide-x">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{recompra.registrados}</p>
            <p className="text-[11px] text-gray-500 mt-1">Ciclos registrados</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{recompra.n7}</p>
            <p className="text-[11px] text-gray-500 mt-1">Aviso 7 días</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{recompra.n3}</p>
            <p className="text-[11px] text-gray-500 mt-1">Aviso 3 días</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{recompra.n0}</p>
            <p className="text-[11px] text-gray-500 mt-1">Aviso día 0</p>
          </div>
        </div>
      </div>

      {/* ═══ REPOSICIÓN AUTOMÁTICA ═══ */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <Repeat className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Reposición automática</h2>
        </div>
        <div className="grid grid-cols-4 divide-x">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{suscripciones.activas}</p>
            <p className="text-[11px] text-gray-500 mt-1">Activas</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{suscripciones.automaticas}</p>
            <p className="text-[11px] text-gray-500 mt-1">Creadas solas</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{suscripciones.manuales}</p>
            <p className="text-[11px] text-gray-500 mt-1">Elegidas por cliente</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{suscripciones.proximasHoy}</p>
            <p className="text-[11px] text-gray-500 mt-1">Vencen hoy</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="text-[11px] text-gray-400">
            Se crean solas al completar el pago — calculadas exacto según producto × cantidad comprada (ej: 1 caja mensual = 90 días, 2 cajas = 180 días).
          </p>
        </div>
      </div>

      {/* ═══ RESEÑAS ═══ */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Solicitud de reseñas</h2>
        </div>
        <div className="grid grid-cols-4 divide-x">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{resenas.entregados}</p>
            <p className="text-[11px] text-gray-500 mt-1">Entregados</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{resenas.solicitadas}</p>
            <p className="text-[11px] text-gray-500 mt-1">Solicitadas</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{resenas.elegiblesAhora}</p>
            <p className="text-[11px] text-gray-500 mt-1">Elegibles próx. envío</p>
          </div>
          <div className="p-4 text-center">
            <p className={`text-2xl font-bold ${resenas.huerfanas > 0 ? 'text-red-600' : 'text-gray-300'}`}>{resenas.huerfanas}</p>
            <p className="text-[11px] text-gray-500 mt-1">Fuera de ventana</p>
          </div>
        </div>
      </div>

      {/* ═══ CARRITOS ═══ */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Carritos abandonados</h2>
        </div>
        <div className="grid grid-cols-3 divide-x">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{carritos.total}</p>
            <p className="text-[11px] text-gray-500 mt-1">Detectados</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{carritos.notificados}</p>
            <p className="text-[11px] text-gray-500 mt-1">Notificados</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{carritos.convertidos}</p>
            <p className="text-[11px] text-gray-500 mt-1">Recuperados 💰</p>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-sm">Log de mensajes automáticos (últimos 100)</h2>
        </div>
        <div className="divide-y">
          {logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Aún no hay mensajes automáticos registrados.
            </div>
          ) : (
            logs.map(log => {
              const info = TIPO_INFO[log.tipo] ?? { label: log.tipo, icon: Circle, color: 'bg-gray-100 text-gray-700' }
              const Icon = info.icon
              const isFailed = log.estado === 'failed'
              return (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{info.label}</span>
                      <span className="text-xs text-gray-400 truncate">→ {log.telefono}</span>
                    </div>
                    {log.error && <p className="text-xs text-red-600 mt-0.5 truncate">{log.error}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {isFailed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Falló</span>
                    ) : log.read_at ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">✓✓ Leído</span>
                    ) : log.delivered_at ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">✓✓ Entregado</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Enviado</span>
                    )}
                    {(log.attempt ?? 1) > 1 && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                        Reintento #{log.attempt}
                      </span>
                    )}
                    <div className="text-[10px] text-gray-400 mt-1">
                      {new Date(log.created_at).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
