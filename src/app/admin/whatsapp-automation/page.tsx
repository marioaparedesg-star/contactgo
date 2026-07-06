'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { MessageCircle, RefreshCw, CheckCircle2, XCircle, ShoppingCart, Package, Star, Repeat } from 'lucide-react'

type LogEntry = {
  id: string
  telefono: string
  tipo: string
  estado: string
  error: string | null
  created_at: string
}

const TIPO_INFO: Record<string, { label: string; icon: any; color: string }> = {
  confirmacion: { label: 'Confirmación', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  envio:        { label: 'Envío', icon: Package, color: 'bg-blue-100 text-blue-700' },
  resena:       { label: 'Reseña', icon: Star, color: 'bg-amber-100 text-amber-700' },
  renovacion:   { label: 'Renovación', icon: Repeat, color: 'bg-purple-100 text-purple-700' },
  carrito:      { label: 'Carrito', icon: ShoppingCart, color: 'bg-pink-100 text-pink-700' },
}

export default function WhatsAppAutomationDashboard() {
  const sb = createClient()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState({ envios: 0, resenas: 0, renovaciones: 0, carritos: 0, confirmaciones: 0, fallos: 0 })
  const [loading, setLoading] = useState(true)
  const [ejecutando, setEjecutando] = useState(false)

  const cargarDatos = async () => {
    setLoading(true)
    // Log últimos 100
    const { data } = await sb
      .from('wa_automation_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setLogs(data)

    // Stats últimos 30 días
    const hace30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: all } = await sb
      .from('wa_automation_log')
      .select('tipo, estado')
      .gt('created_at', hace30d)

    const s = { envios: 0, resenas: 0, renovaciones: 0, carritos: 0, confirmaciones: 0, fallos: 0 }
    ;(all ?? []).forEach((r: any) => {
      if (r.estado === 'failed') s.fallos++
      else if (r.tipo === 'envio') s.envios++
      else if (r.tipo === 'resena') s.resenas++
      else if (r.tipo === 'renovacion') s.renovaciones++
      else if (r.tipo === 'carrito') s.carritos++
      else if (r.tipo === 'confirmacion') s.confirmaciones++
    })
    setStats(s)
    setLoading(false)
  }

  useEffect(() => { cargarDatos() }, [])

  const ejecutarCron = async (tipo: 'daily' | 'hourly') => {
    if (ejecutando) return
    setEjecutando(true)
    try {
      const secret = prompt(`Ingresa el CRON_SECRET para ejecutar ${tipo} manualmente:`)
      if (!secret) { setEjecutando(false); return }
      const res = await fetch(`/api/cron/wa-${tipo}`, {
        headers: { 'Authorization': `Bearer ${secret}` },
      })
      const data = await res.json()
      alert(`✅ Ejecutado ${tipo}:\n${JSON.stringify(data, null, 2)}`)
      cargarDatos()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
    setEjecutando(false)
  }

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  )

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Automatizaciones WhatsApp</h1>
            <p className="text-xs text-gray-500">Últimos 30 días · Se ejecutan automáticamente</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => ejecutarCron('hourly')} disabled={ejecutando}
            className="text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
            Ejecutar carritos
          </button>
          <button onClick={() => ejecutarCron('daily')} disabled={ejecutando}
            className="text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
            Ejecutar diario
          </button>
          <button onClick={cargarDatos} className="p-2 hover:bg-gray-100 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <StatCard label="Confirmación" value={stats.confirmaciones} icon={CheckCircle2} color="bg-green-100 text-green-700" />
        <StatCard label="Envío" value={stats.envios} icon={Package} color="bg-blue-100 text-blue-700" />
        <StatCard label="Reseña" value={stats.resenas} icon={Star} color="bg-amber-100 text-amber-700" />
        <StatCard label="Renovación" value={stats.renovaciones} icon={Repeat} color="bg-purple-100 text-purple-700" />
        <StatCard label="Carrito" value={stats.carritos} icon={ShoppingCart} color="bg-pink-100 text-pink-700" />
        <StatCard label="Fallos" value={stats.fallos} icon={XCircle} color="bg-red-100 text-red-700" />
      </div>

      {/* Log */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="font-semibold text-sm">Log de mensajes automáticos (últimos 100)</h2>
        </div>
        <div className="divide-y">
          {logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Aún no hay mensajes automáticos enviados. Los crons se ejecutan cada hora (carritos) y a las 9am DR (diario).
            </div>
          ) : (
            logs.map(log => {
              const info = TIPO_INFO[log.tipo] ?? { label: log.tipo, icon: MessageCircle, color: 'bg-gray-100 text-gray-700' }
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
                      <span className="text-xs text-gray-400">→ {log.telefono}</span>
                    </div>
                    {log.error && <p className="text-xs text-red-600 mt-0.5 truncate">{log.error}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {isFailed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Falló</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Enviado</span>
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

      {/* Info panel */}
      <div className="mt-6 grid md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">📅 Cron diario · 9am DR</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Notificaciones de envío pendientes</li>
            <li>• Solicitud de reseña (3 días post-envío)</li>
            <li>• Recordatorio de renovación (día 25 post-compra)</li>
          </ul>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-pink-900 mb-2">⏰ Cron horario · cada hora</h3>
          <ul className="text-xs text-pink-800 space-y-1">
            <li>• Recuperación de carritos abandonados</li>
            <li>• Espera 2h de inactividad antes de enviar</li>
            <li>• Incluye código de descuento VUELVE5 (5%)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
