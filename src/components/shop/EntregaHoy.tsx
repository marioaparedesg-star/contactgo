'use client'
import { useState, useEffect } from 'react'

/**
 * Muestra "Pide antes de las 3:00 PM y llega mañana"
 * con cuenta regresiva si falta menos de 2 horas
 */
export default function EntregaHoy() {
  const [texto, setTexto] = useState<string | null>(null)
  const [urgente, setUrgente] = useState(false)

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date()
      const hora  = ahora.getHours()
      const min   = ahora.getMinutes()
      const dow   = ahora.getDay() // 0=dom, 6=sab

      // Sábado/domingo no hay corte
      if (dow === 0 || dow === 6) {
        setTexto('📦 Procesamos tu pedido el próximo día laborable')
        setUrgente(false)
        return
      }

      const minutosHasta15 = (15 * 60) - (hora * 60 + min)

      if (minutosHasta15 <= 0) {
        // Después de las 3pm
        setTexto('📦 Tu pedido saldrá mañana — pide ahora')
        setUrgente(false)
      } else if (minutosHasta15 <= 120) {
        // Menos de 2 horas — urgencia real
        const h = Math.floor(minutosHasta15 / 60)
        const m = minutosHasta15 % 60
        const tiempo = h > 0 ? `${h}h ${m}min` : `${m} minutos`
        setTexto(`⚡ Quedan ${tiempo} para entrega mañana`)
        setUrgente(true)
      } else {
        // Mucho tiempo — mensaje suave
        setTexto('🚀 Pide antes de las 3:00 PM — llega mañana')
        setUrgente(false)
      }
    }

    calcular()
    const interval = setInterval(calcular, 60000) // actualizar cada minuto
    return () => clearInterval(interval)
  }, [])

  if (!texto) return null

  return (
    <div className={`text-center text-xs font-bold py-1.5 px-3 rounded-full transition-colors ${
      urgente
        ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
        : 'bg-green-50 text-green-700 border border-green-100'
    }`}>
      {texto}
    </div>
  )
}
