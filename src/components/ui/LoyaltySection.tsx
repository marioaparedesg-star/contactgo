'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Star, Award, Crown, Gem } from 'lucide-react'

type LoyaltyData = {
  points: number
  level: string
  total_spent: number
  orders_count: number
}

const LEVELS = {
  bronze: { label: 'Bronze',   icon: Star,  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', next: 3000,  discount: 5  },
  silver: { label: 'Silver',   icon: Award, color: 'text-gray-500',   bg: 'bg-gray-50',   border: 'border-gray-200',  next: 8000,  discount: 10 },
  gold:   { label: 'Gold',     icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200',next: 15000, discount: 15 },
  vip:    { label: 'VIP',      icon: Gem,   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', next: null,  discount: 20 },
}

export function LoyaltySection({ userId }: { userId: string }) {
  const [data, setData] = useState<LoyaltyData | null>(null)
  const sb = createClient()

  useEffect(() => {
    sb.from('loyalty_points').select('*').eq('user_id', userId).single()
      .then(({ data }) => {
        if (data) setData(data as LoyaltyData)
        else {
          // Crear registro inicial si no existe
          sb.from('loyalty_points').insert({ user_id: userId, points: 0, level: 'bronze', total_spent: 0, orders_count: 0 })
            .select().single().then(({ data: d }) => d && setData(d as LoyaltyData))
        }
      })
  }, [userId])

  if (!data) return null

  const level = LEVELS[data.level as keyof typeof LEVELS] ?? LEVELS.bronze
  const LevelIcon = level.icon
  const progress = level.next ? Math.min((data.total_spent / level.next) * 100, 100) : 100
  const faltante = level.next ? Math.max(level.next - data.total_spent, 0) : 0

  return (
    <div className={`rounded-2xl border ${level.border} ${level.bg} p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${level.bg} border ${level.border} flex items-center justify-center`}>
          <LevelIcon className={`w-5 h-5 ${level.color}`} />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">ContactGo Plus · {level.label}</p>
          <p className={`text-xs font-semibold ${level.color}`}>{level.discount}% descuento en tu próxima compra</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>RD${data.total_spent.toLocaleString()} gastados</span>
          {level.next && <span>Meta: RD${level.next.toLocaleString()}</span>}
        </div>
        <div className="w-full bg-white/70 rounded-full h-2 border border-white">
          <div className={`h-2 rounded-full transition-all duration-500 ${
            data.level === 'vip' ? 'bg-purple-500' :
            data.level === 'gold' ? 'bg-yellow-400' :
            data.level === 'silver' ? 'bg-gray-400' : 'bg-amber-500'
          }`} style={{ width: `${progress}%` }} />
        </div>
        {level.next && faltante > 0 && (
          <p className="text-xs text-gray-500">Gasta RD${faltante.toLocaleString()} más para subir a {
            data.level === 'bronze' ? 'Silver' : data.level === 'silver' ? 'Gold' : 'VIP'
          }</p>
        )}
        {data.level === 'vip' && (
          <p className="text-xs text-purple-600 font-semibold">¡Máximo nivel! Disfruta 20% de descuento permanente</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/50">
        <div className="text-center">
          <p className="text-lg font-black text-gray-900">{data.orders_count}</p>
          <p className="text-xs text-gray-500">Pedidos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-gray-900">RD${data.total_spent.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total gastado</p>
        </div>
      </div>
    </div>
  )
}
